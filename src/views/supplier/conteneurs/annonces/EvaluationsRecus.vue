<template>
    <div class="page-content pt-0" style="background-color:#f9fafb; min-height:100vh;">
        <div class="page-content-wrapper px-3 py-4" style="max-width: 100%;">

            <!-- En-tête -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">
                                <i class="bi bi-star me-2"></i>Évaluations Reçues
                            </h1>
                            <p class="text-muted mb-0">Avis et satisfaction clients sur les prestations notariales</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <button @click="showSendRequestModal = true" class="btn btn-primary">
                                <i class="bi bi-envelope me-1"></i>Demander Avis
                            </button>
                            <button @click="exportEvaluations" class="btn btn-success">
                                <i class="bi bi-download me-1"></i>Exporter
                            </button>
                            <button @click="genererRapport" class="btn btn-info">
                                <i class="bi bi-file-earmark-bar-graph me-1"></i>Rapport
                            </button>
                            <button @click="rafraichir" class="btn btn-outline-primary">
                                <i class="bi bi-arrow-clockwise"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Chargement -->
            <div v-if="loading" class="text-center my-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Chargement...</span>
                </div>
            </div>

            <div v-else>
                <!-- KPIs -->
                <div class="row g-4 mb-4">
                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Note Moyenne</span>
                                    <h3 class="mb-0 mt-2" :class="getMoyenneColor()">{{ stats.noteMoyenne }}/5</h3>
                                    <small :class="getMoyenneColor()">
                                        <i class="bi bi-star-fill me-1"></i>{{ getStarsDisplay(stats.noteMoyenne) }}
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-opacity-10" :class="getMoyenneBgColor()">
                                    <i class="bi bi-star-fill fa-fw fs-4" :class="getMoyenneColor()"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Total Avis</span>
                                    <h3 class="mb-0 mt-2 text-primary">{{ stats.total }}</h3>
                                    <small class="text-primary">
                                        <i class="bi bi-chat-square-text me-1"></i>Reçus
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-primary bg-opacity-10 text-primary">
                                    <i class="bi bi-chat-square-text fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Ce Mois</span>
                                    <h3 class="mb-0 mt-2 text-info">{{ stats.mois }}</h3>
                                    <small class="text-info">
                                        <i class="bi bi-calendar-check me-1"></i>Nouveaux
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-info bg-opacity-10 text-info">
                                    <i class="bi bi-calendar-check fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Taux Satisfaction</span>
                                    <h3 class="mb-0 mt-2 text-success">{{ stats.tauxSatisfaction }}%</h3>
                                    <small class="text-success">
                                        <i class="bi bi-hand-thumbs-up me-1"></i>≥ 4/5
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-success bg-opacity-10 text-success">
                                    <i class="bi bi-hand-thumbs-up fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Graphiques -->
                <div class="row g-4 mb-4">
                    <div class="col-lg-8">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0"><i class="bi bi-graph-up me-2"></i>Évolution des Notes</h6>
                            </div>
                            <div class="card-body">
                                <canvas id="evolutionChart" height="80"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0"><i class="bi bi-bar-chart me-2"></i>Répartition des Notes</h6>
                            </div>
                            <div class="card-body">
                                <div v-for="note in [5, 4, 3, 2, 1]" :key="note" class="mb-3">
                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                        <span class="small">{{ note }} <i
                                                class="bi bi-star-fill text-warning"></i></span>
                                        <span class="small fw-bold">{{ getCountByNote(note) }}</span>
                                    </div>
                                    <div class="progress" style="height: 8px;">
                                        <div class="progress-bar" :class="getProgressColor(note)"
                                            :style="{ width: getPercentageByNote(note) + '%' }"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Critères d'évaluation -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Moyennes par Critère</h6>
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div v-for="critere in criteres" :key="critere.id" class="col-md-4">
                                        <div class="card border h-100">
                                            <div class="card-body">
                                                <div class="d-flex justify-content-between align-items-start mb-2">
                                                    <div>
                                                        <i class="bi fs-4 me-2"
                                                            :class="[critere.icon, 'text-' + critere.color]"></i>
                                                        <strong>{{ critere.label }}</strong>
                                                    </div>
                                                    <span class="badge"
                                                        :class="'bg-' + getNoteBadgeColor(critere.moyenne)">
                                                        {{ critere.moyenne.toFixed(1) }}/5
                                                    </span>
                                                </div>
                                                <div class="progress" style="height: 10px;">
                                                    <div class="progress-bar"
                                                        :class="'bg-' + getNoteBadgeColor(critere.moyenne)"
                                                        :style="{ width: (critere.moyenne / 5 * 100) + '%' }"></div>
                                                </div>
                                                <div class="mt-2">
                                                    <span class="text-warning">
                                                        <i v-for="i in Math.floor(critere.moyenne)" :key="'full-' + i"
                                                            class="bi bi-star-fill"></i>
                                                        <i v-if="critere.moyenne % 1 >= 0.5"
                                                            class="bi bi-star-half"></i>
                                                        <i v-for="i in (5 - Math.ceil(critere.moyenne))"
                                                            :key="'empty-' + i" class="bi bi-star"></i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filtres -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <div class="row g-3">
                                    <div class="col-md-3">
                                        <div class="position-relative">
                                            <input type="text" class="form-control" placeholder="Rechercher..."
                                                v-model="searchQuery" @input="filterEvaluations">
                                            <i
                                                class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.note" @change="filterEvaluations" class="form-select">
                                            <option value="">Toutes notes</option>
                                            <option value="5">5 étoiles</option>
                                            <option value="4">4 étoiles</option>
                                            <option value="3">3 étoiles</option>
                                            <option value="2">2 étoiles</option>
                                            <option value="1">1 étoile</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.type" @change="filterEvaluations" class="form-select">
                                            <option value="">Tous types</option>
                                            <option value="VENTE">Vente</option>
                                            <option value="SUCCESSION">Succession</option>
                                            <option value="DONATION">Donation</option>
                                            <option value="PRET">Prêt</option>
                                            <option value="AUTRE">Autre</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.periode" @change="filterEvaluations"
                                            class="form-select">
                                            <option value="">Toutes périodes</option>
                                            <option value="SEMAINE">Cette semaine</option>
                                            <option value="MOIS">Ce mois</option>
                                            <option value="TRIMESTRE">Ce trimestre</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <button @click="resetFilters" class="btn btn-secondary w-100">
                                            <i class="bi bi-arrow-counterclockwise me-1"></i>Réinitialiser
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Liste des évaluations -->
                <div class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">
                                    Avis Clients
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ filteredEvaluations.length }} avis
                                    </span>
                                </h6>
                            </div>
                            <div class="card-body p-4">
                                <div v-if="paginatedEvaluations.length === 0" class="text-center py-5">
                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                    <p class="text-muted mb-0">Aucune évaluation trouvée</p>
                                </div>
                                <div v-else class="evaluation-list">
                                    <div v-for="evaluation in paginatedEvaluations" :key="evaluation.id"
                                        class="evaluation-card card mb-3">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-9">
                                                    <div class="d-flex align-items-start mb-3">
                                                        <div class="avatar-lg bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                                                            style="width: 50px; height: 50px; min-width: 50px;">
                                                            <span class="fw-bold">{{ getInitiales(evaluation.client)
                                                                }}</span>
                                                        </div>
                                                        <div class="flex-grow-1">
                                                            <div
                                                                class="d-flex justify-content-between align-items-start mb-1">
                                                                <div>
                                                                    <h6 class="mb-0">{{ evaluation.client }}</h6>
                                                                    <small class="text-muted">
                                                                        <i class="bi bi-calendar-event me-1"></i>
                                                                        {{ formatDate(evaluation.date) }}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                            <div class="mb-2">
                                                                <span class="text-warning fs-5">
                                                                    <i v-for="i in evaluation.note" :key="'star-' + i"
                                                                        class="bi bi-star-fill"></i>
                                                                    <i v-for="i in (5 - evaluation.note)"
                                                                        :key="'empty-' + i" class="bi bi-star"></i>
                                                                </span>
                                                                <span class="ms-2 badge"
                                                                    :class="'bg-' + getNoteBadgeColor(evaluation.note)">
                                                                    {{ evaluation.note }}/5
                                                                </span>
                                                                <span class="ms-2 badge bg-light text-dark">
                                                                    {{ evaluation.typeActe }}
                                                                </span>
                                                            </div>
                                                            <p class="mb-2">{{ evaluation.commentaire }}</p>
                                                            <div class="d-flex flex-wrap gap-2">
                                                                <small class="badge bg-light text-dark">
                                                                    <i class="bi bi-speedometer2 me-1"></i>Rapidité: {{
                                                                    evaluation.rapidite }}/5
                                                                </small>
                                                                <small class="badge bg-light text-dark">
                                                                    <i
                                                                        class="bi bi-person-check me-1"></i>Professionnalisme:
                                                                    {{ evaluation.professionnalisme }}/5
                                                                </small>
                                                                <small class="badge bg-light text-dark">
                                                                    <i class="bi bi-chat-dots me-1"></i>Communication:
                                                                    {{ evaluation.communication }}/5
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-3 text-end">
                                                    <button class="btn btn-sm btn-outline-primary mb-2"
                                                        @click="viewEvaluation(evaluation)">
                                                        <i class="bi bi-eye me-1"></i>Détails
                                                    </button>
                                                    <button class="btn btn-sm btn-outline-success"
                                                        @click="repondreEvaluation(evaluation)">
                                                        <i class="bi bi-reply me-1"></i>Répondre
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Pagination -->
                                <div v-if="filteredEvaluations.length > perPage" class="mt-4">
                                    <nav>
                                        <ul class="pagination justify-content-center">
                                            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                                <a class="page-link" href="#"
                                                    @click.prevent="changePage(currentPage - 1)">Précédent</a>
                                            </li>
                                            <li v-for="page in totalPages" :key="page" class="page-item"
                                                :class="{ active: currentPage === page }">
                                                <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page
                                                    }}</a>
                                            </li>
                                            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                                <a class="page-link" href="#"
                                                    @click.prevent="changePage(currentPage + 1)">Suivant</a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Détails -->
        <div v-if="selectedEvaluation" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Évaluation de {{ selectedEvaluation.client }}
                        </h5>
                        <button type="button" class="btn-close" @click="selectedEvaluation = null"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-4">
                            <div class="avatar-xl bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                style="width: 80px; height: 80px;">
                                <span class="fs-2 fw-bold">{{ getInitiales(selectedEvaluation.client) }}</span>
                            </div>
                            <h4>{{ selectedEvaluation.client }}</h4>
                            <div class="text-warning fs-3 mb-2">
                                <i v-for="i in selectedEvaluation.note" :key="'modal-star-' + i"
                                    class="bi bi-star-fill"></i>
                                <i v-for="i in (5 - selectedEvaluation.note)" :key="'modal-empty-' + i"
                                    class="bi bi-star"></i>
                            </div>
                            <span class="badge" :class="'bg-' + getNoteBadgeColor(selectedEvaluation.note) + ' fs-6'">
                                {{ selectedEvaluation.note }}/5
                            </span>
                        </div>

                        <div class="row g-3 mb-4">
                            <div class="col-md-4">
                                <div class="card bg-light border-0 text-center">
                                    <div class="card-body">
                                        <i class="bi bi-speedometer2 fs-3 text-info mb-2"></i>
                                        <h6 class="mb-1">Rapidité</h6>
                                        <strong>{{ selectedEvaluation.rapidite }}/5</strong>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card bg-light border-0 text-center">
                                    <div class="card-body">
                                        <i class="bi bi-person-check fs-3 text-success mb-2"></i>
                                        <h6 class="mb-1">Professionnalisme</h6>
                                        <strong>{{ selectedEvaluation.professionnalisme }}/5</strong>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card bg-light border-0 text-center">
                                    <div class="card-body">
                                        <i class="bi bi-chat-dots fs-3 text-primary mb-2"></i>
                                        <h6 class="mb-1">Communication</h6>
                                        <strong>{{ selectedEvaluation.communication }}/5</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card bg-light border-0 mb-3">
                            <div class="card-body">
                                <h6 class="mb-2"><i class="bi bi-chat-square-quote me-2"></i>Commentaire</h6>
                                <p class="mb-0">{{ selectedEvaluation.commentaire }}</p>
                            </div>
                        </div>

                        <div class="card bg-light border-0">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-6">
                                        <small class="text-muted">Type d'acte</small>
                                        <p class="mb-0"><strong>{{ selectedEvaluation.typeActe }}</strong></p>
                                    </div>
                                    <div class="col-6">
                                        <small class="text-muted">Date</small>
                                        <p class="mb-0"><strong>{{ formatDate(selectedEvaluation.date) }}</strong></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="selectedEvaluation.reponse" class="mt-3">
                            <div class="card border-primary">
                                <div class="card-header bg-primary bg-opacity-10">
                                    <h6 class="mb-0"><i class="bi bi-reply me-2"></i>Votre Réponse</h6>
                                </div>
                                <div class="card-body">
                                    <p class="mb-0">{{ selectedEvaluation.reponse }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            @click="selectedEvaluation = null">Fermer</button>
                        <button type="button" class="btn btn-success" @click="repondreEvaluation(selectedEvaluation)"
                            v-if="!selectedEvaluation.reponse">
                            <i class="bi bi-reply me-1"></i>Répondre
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Réponse -->
        <div v-if="showReponseModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Répondre à l'Évaluation</h5>
                        <button type="button" class="btn-close" @click="showReponseModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Votre réponse</label>
                            <textarea v-model="reponseForm.texte" class="form-control" rows="5"
                                placeholder="Merci pour votre retour..."></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            @click="showReponseModal = false">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="saveReponse">
                            <i class="bi bi-send me-1"></i>Envoyer
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Demande d'Avis -->
        <div v-if="showSendRequestModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Demander un Avis</h5>
                        <button type="button" class="btn-close" @click="showSendRequestModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle me-2"></i>
                            Envoyez une demande d'avis par email à vos clients
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Email du client *</label>
                            <input type="email" v-model="requestForm.email" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Nom du client *</label>
                            <input type="text" v-model="requestForm.nom" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Type d'acte</label>
                            <select v-model="requestForm.typeActe" class="form-select">
                                <option value="VENTE">Vente</option>
                                <option value="SUCCESSION">Succession</option>
                                <option value="DONATION">Donation</option>
                                <option value="PRET">Prêt</option>
                                <option value="AUTRE">Autre</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            @click="showSendRequestModal = false">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="sendRequest">
                            <i class="bi bi-envelope me-1"></i>Envoyer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'EvaluationsRecues',

    data() {
        return {
            loading: true,
            searchQuery: '',
            currentPage: 1,
            perPage: 10,
            selectedEvaluation: null,
            showReponseModal: false,
            showSendRequestModal: false,
            filters: { note: '', type: '', periode: '' },
            reponseForm: {
                evaluationId: null,
                texte: ''
            },
            requestForm: {
                email: '',
                nom: '',
                typeActe: 'VENTE'
            },
            evaluations: [],
            stats: { noteMoyenne: 0, total: 0, mois: 0, tauxSatisfaction: 0 },
            criteres: [],
            charts: {
                evolution: null
            }
        };
    },

    computed: {
        filteredEvaluations() {
            let result = [...this.evaluations];

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(e =>
                    e.client.toLowerCase().includes(query) ||
                    e.commentaire.toLowerCase().includes(query)
                );
            }

            if (this.filters.note) result = result.filter(e => e.note === parseInt(this.filters.note));
            if (this.filters.type) result = result.filter(e => e.typeActe === this.filters.type);

            if (this.filters.periode) {
                const today = new Date();
                if (this.filters.periode === 'SEMAINE') {
                    const startOfWeek = new Date(today);
                    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
                    result = result.filter(e => new Date(e.date) >= startOfWeek);
                } else if (this.filters.periode === 'MOIS') {
                    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    result = result.filter(e => new Date(e.date) >= startOfMonth);
                } else if (this.filters.periode === 'TRIMESTRE') {
                    const currentQuarter = Math.floor(today.getMonth() / 3);
                    const startOfQuarter = new Date(today.getFullYear(), currentQuarter * 3, 1);
                    result = result.filter(e => new Date(e.date) >= startOfQuarter);
                }
            }

            return result;
        },

        paginatedEvaluations() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredEvaluations.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.filteredEvaluations.length / this.perPage);
        }
    },

    mounted() {
        this.chargerDonnees();
    },

    methods: {
        async chargerDonnees() {
            this.loading = true;
            try {
                // Simuler un appel API
                await this.delay(800);

                // Données mockées
                this.evaluations = [
                    {
                        id: 1,
                        client: 'Jean Dupont',
                        note: 5,
                        rapidite: 5,
                        professionnalisme: 5,
                        communication: 4,
                        commentaire: 'Excellent service ! Très professionnel et réactif. Je recommande vivement pour toute démarche notariale.',
                        typeActe: 'VENTE',
                        date: '2024-11-10',
                        reponse: null
                    },
                    {
                        id: 2,
                        client: 'Marie Martin',
                        note: 4,
                        rapidite: 4,
                        professionnalisme: 5,
                        communication: 4,
                        commentaire: 'Très bon accompagnement durant la succession. Explications claires et précises.',
                        typeActe: 'SUCCESSION',
                        date: '2024-11-08',
                        reponse: 'Merci beaucoup pour votre retour positif !'
                    },
                    {
                        id: 3,
                        client: 'Pierre Dubois',
                        note: 5,
                        rapidite: 5,
                        professionnalisme: 5,
                        communication: 5,
                        commentaire: 'Service impeccable, délais respectés. Équipe très compétente et à l\'écoute.',
                        typeActe: 'DONATION',
                        date: '2024-11-05',
                        reponse: null
                    },
                    {
                        id: 4,
                        client: 'Sophie Bernard',
                        note: 4,
                        rapidite: 3,
                        professionnalisme: 5,
                        communication: 4,
                        commentaire: 'Bon service dans l\'ensemble. Quelques délais un peu longs mais résultat satisfaisant.',
                        typeActe: 'PRET',
                        date: '2024-10-28',
                        reponse: null
                    },
                    {
                        id: 5,
                        client: 'Luc Rousseau',
                        note: 5,
                        rapidite: 5,
                        professionnalisme: 4,
                        communication: 5,
                        commentaire: 'Très satisfait de la prestation. Personnel accueillant et efficace.',
                        typeActe: 'VENTE',
                        date: '2024-10-20',
                        reponse: 'Nous vous remercions pour votre confiance !'
                    },
                    {
                        id: 6,
                        client: 'Anne Petit',
                        note: 3,
                        rapidite: 3,
                        professionnalisme: 4,
                        communication: 3,
                        commentaire: 'Service correct mais manque de suivi sur certains points. Amélioration possible.',
                        typeActe: 'SUCCESSION',
                        date: '2024-10-15',
                        reponse: null
                    },
                    {
                        id: 7,
                        client: 'François Lefebvre',
                        note: 5,
                        rapidite: 5,
                        professionnalisme: 5,
                        communication: 5,
                        commentaire: 'Parfait ! Professionnalisme exemplaire du début à la fin. Merci beaucoup.',
                        typeActe: 'VENTE',
                        date: '2024-10-10',
                        reponse: null
                    },
                    {
                        id: 8,
                        client: 'Isabelle Moreau',
                        note: 4,
                        rapidite: 4,
                        professionnalisme: 4,
                        communication: 5,
                        commentaire: 'Très bonne communication et suivi régulier. Je suis satisfaite du service.',
                        typeActe: 'DONATION',
                        date: '2024-09-25',
                        reponse: 'Merci pour votre avis, au plaisir de vous revoir !'
                    }
                ];

                this.calculerStats();
                this.calculerCriteres();
                this.initGraphiques();
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                this.loading = false;
            }
        },

        calculerStats() {
            this.stats.total = this.evaluations.length;

            if (this.stats.total > 0) {
                const somme = this.evaluations.reduce((acc, e) => acc + e.note, 0);
                this.stats.noteMoyenne = (somme / this.stats.total).toFixed(1);

                const satisfaits = this.evaluations.filter(e => e.note >= 4).length;
                this.stats.tauxSatisfaction = Math.round((satisfaits / this.stats.total) * 100);

                const today = new Date();
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                this.stats.mois = this.evaluations.filter(e => new Date(e.date) >= startOfMonth).length;
            }
        },

        calculerCriteres() {
            if (this.evaluations.length === 0) return;

            const sommeRapidite = this.evaluations.reduce((acc, e) => acc + e.rapidite, 0);
            const sommeProfessionnalisme = this.evaluations.reduce((acc, e) => acc + e.professionnalisme, 0);
            const sommeCommunication = this.evaluations.reduce((acc, e) => acc + e.communication, 0);

            this.criteres = [
                {
                    id: 'rapidite',
                    label: 'Rapidité',
                    icon: 'bi-speedometer2',
                    color: 'info',
                    moyenne: sommeRapidite / this.evaluations.length
                },
                {
                    id: 'professionnalisme',
                    label: 'Professionnalisme',
                    icon: 'bi-person-check',
                    color: 'success',
                    moyenne: sommeProfessionnalisme / this.evaluations.length
                },
                {
                    id: 'communication',
                    label: 'Communication',
                    icon: 'bi-chat-dots',
                    color: 'primary',
                    moyenne: sommeCommunication / this.evaluations.length
                }
            ];
        },

        initGraphiques() {
            this.$nextTick(() => {
                const ctx = document.getElementById('evolutionChart');
                if (!ctx) return;

                // Grouper par mois
                const moisData = {};
                this.evaluations.forEach(e => {
                    const date = new Date(e.date);
                    const mois = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    if (!moisData[mois]) {
                        moisData[mois] = { somme: 0, count: 0 };
                    }
                    moisData[mois].somme += e.note;
                    moisData[mois].count++;
                });

                const labels = Object.keys(moisData).sort();
                const data = labels.map(mois => (moisData[mois].somme / moisData[mois].count).toFixed(1));

                if (this.charts.evolution) {
                    this.charts.evolution.destroy();
                }

                this.charts.evolution = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels.map(m => {
                            const [y, mon] = m.split('-');
                            const moisNoms = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
                            return `${moisNoms[parseInt(mon) - 1]} ${y}`;
                        }),
                        datasets: [{
                            label: 'Note Moyenne',
                            data: data,
                            borderColor: '#0d6efd',
                            backgroundColor: 'rgba(13, 110, 253, 0.1)',
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 5,
                                ticks: {
                                    stepSize: 1
                                }
                            }
                        }
                    }
                });
            });
        },

        getCountByNote(note) {
            return this.evaluations.filter(e => e.note === note).length;
        },

        getPercentageByNote(note) {
            if (this.evaluations.length === 0) return 0;
            return (this.getCountByNote(note) / this.evaluations.length * 100).toFixed(1);
        },

        getProgressColor(note) {
            if (note >= 4) return 'bg-success';
            if (note === 3) return 'bg-warning';
            return 'bg-danger';
        },

        getNoteBadgeColor(note) {
            if (note >= 4.5) return 'success';
            if (note >= 4) return 'primary';
            if (note >= 3) return 'warning';
            return 'danger';
        },

        getMoyenneColor() {
            const note = parseFloat(this.stats.noteMoyenne);
            if (note >= 4.5) return 'text-success';
            if (note >= 4) return 'text-primary';
            if (note >= 3) return 'text-warning';
            return 'text-danger';
        },

        getMoyenneBgColor() {
            const note = parseFloat(this.stats.noteMoyenne);
            if (note >= 4.5) return 'bg-success';
            if (note >= 4) return 'bg-primary';
            if (note >= 3) return 'bg-warning';
            return 'bg-danger';
        },

        getStarsDisplay(note) {
            return '★'.repeat(Math.round(note));
        },

        getInitiales(nom) {
            return nom.split(' ').map(n => n[0]).join('').toUpperCase();
        },

        formatDate(date) {
            const d = new Date(date);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return d.toLocaleDateString('fr-FR', options);
        },

        filterEvaluations() {
            this.currentPage = 1;
        },

        resetFilters() {
            this.searchQuery = '';
            this.filters = { note: '', type: '', periode: '' };
            this.currentPage = 1;
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },

        viewEvaluation(evaluation) {
            this.selectedEvaluation = evaluation;
        },

        repondreEvaluation(evaluation) {
            this.selectedEvaluation = null;
            this.reponseForm.evaluationId = evaluation.id;
            this.reponseForm.texte = '';
            this.showReponseModal = true;
        },

        async saveReponse() {
            if (!this.reponseForm.texte.trim()) {
                alert('Veuillez saisir une réponse');
                return;
            }

            try {
                // Simuler l'enregistrement
                await this.delay(500);

                const evaluation = this.evaluations.find(e => e.id === this.reponseForm.evaluationId);
                if (evaluation) {
                    evaluation.reponse = this.reponseForm.texte;
                }

                this.showReponseModal = false;
                alert('Réponse envoyée avec succès !');
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de l\'envoi de la réponse');
            }
        },

        async sendRequest() {
            if (!this.requestForm.email || !this.requestForm.nom) {
                alert('Veuillez remplir tous les champs obligatoires');
                return;
            }

            try {
                // Simuler l'envoi
                await this.delay(500);

                this.showSendRequestModal = false;
                alert(`Demande d'avis envoyée à ${this.requestForm.email}`);

                // Réinitialiser le formulaire
                this.requestForm = {
                    email: '',
                    nom: '',
                    typeActe: 'VENTE'
                };
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de l\'envoi de la demande');
            }
        },

        exportEvaluations() {
            const csv = this.generateCSV();
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `evaluations_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        generateCSV() {
            const headers = ['Client', 'Note', 'Rapidité', 'Professionnalisme', 'Communication', 'Commentaire', 'Type Acte', 'Date'];
            const rows = this.evaluations.map(e => [
                e.client,
                e.note,
                e.rapidite,
                e.professionnalisme,
                e.communication,
                `"${e.commentaire.replace(/"/g, '""')}"`,
                e.typeActe,
                e.date
            ]);

            return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        },

        genererRapport() {
            alert('Génération du rapport en cours...\n\nLe rapport PDF sera disponible dans quelques instants.');
            // Ici vous ajouteriez la logique de génération de rapport PDF
        },

        async rafraichir() {
            await this.chargerDonnees();
        },

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }
};
</script>

<style scoped>
.evaluation-card {
    transition: all 0.3s ease;
    border-left: 4px solid transparent;
}

.evaluation-card:hover {
    border-left-color: #0d6efd;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
    transform: translateY(-2px);
}

.icon-lg {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal.show {
    display: block;
}

.page-link {
    cursor: pointer;
}

.badge {
    font-weight: 500;
}
</style>