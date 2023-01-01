<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4 py-4">

            <!-- En-tête -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">
                                <i class="bi bi-shield-check me-2"></i>Vérifications Réglementaires
                            </h1>
                            <p class="text-muted mb-0">Contrôle de conformité et respect des obligations légales</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <button @click="showCreateModal = true" class="btn btn-primary">
                                <i class="bi bi-plus-circle me-1"></i>Nouvelle Vérification
                            </button>
                            <button @click="rafraichir" class="btn btn-outline-primary">
                                <i class="bi bi-arrow-clockwise"></i>
                            </button>
                            <button @click="exportVerifications" class="btn btn-success">
                                <i class="bi bi-download me-1"></i> Rapport
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
                                    <span class="text-muted small">Total Vérifications</span>
                                    <h3 class="mb-0 mt-2 text-primary">{{ stats.total }}</h3>
                                    <small class="text-muted">
                                        <i class="bi bi-shield-check me-1"></i>Effectuées
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-primary bg-opacity-10 text-primary">
                                    <i class="bi bi-shield-check fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Conformes</span>
                                    <h3 class="mb-0 mt-2 text-success">{{ stats.conformes }}</h3>
                                    <small class="text-success">
                                        <i class="bi bi-check-circle me-1"></i>Validées
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-success bg-opacity-10 text-success">
                                    <i class="bi bi-check-circle fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Non Conformes</span>
                                    <h3 class="mb-0 mt-2 text-danger">{{ stats.nonConformes }}</h3>
                                    <small class="text-danger">
                                        <i class="bi bi-x-circle me-1"></i>À corriger
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-danger bg-opacity-10 text-danger">
                                    <i class="bi bi-x-circle fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Taux de Conformité</span>
                                    <h3 class="mb-0 mt-2 text-info">{{ stats.tauxConformite }}%</h3>
                                    <small class="text-muted">
                                        <i class="bi bi-graph-up me-1"></i>Global
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-info bg-opacity-10 text-info">
                                    <i class="bi bi-graph-up fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Catégories de vérification -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Catégories de Vérification</h6>
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div v-for="cat in categories" :key="cat.id" class="col-md-4">
                                        <div class="category-card p-3 rounded"
                                            :class="'border-start border-4 border-' + cat.color">
                                            <div class="d-flex justify-content-between align-items-center mb-2">
                                                <div class="d-flex align-items-center">
                                                    <i class="bi fs-4 me-2"
                                                        :class="[cat.icon, 'text-' + cat.color]"></i>
                                                    <strong>{{ cat.label }}</strong>
                                                </div>
                                                <span class="badge" :class="'bg-' + cat.color">{{ cat.count }}</span>
                                            </div>
                                            <div class="progress" style="height: 6px;">
                                                <div class="progress-bar" :class="'bg-' + cat.color"
                                                    :style="{ width: cat.conformite + '%' }"></div>
                                            </div>
                                            <small class="text-muted">{{ cat.conformite }}% conformes</small>
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
                                                v-model="searchQuery" @input="filterVerifications">
                                            <i
                                                class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.categorie" @change="filterVerifications"
                                            class="form-select">
                                            <option value="">Toutes catégories</option>
                                            <option value="KYC">KYC/AML</option>
                                            <option value="FISCAL">Conformité Fiscale</option>
                                            <option value="LEGAL">Conformité Légale</option>
                                            <option value="DOCUMENTS">Documents</option>
                                            <option value="SIGNATURES">Signatures</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.statut" @change="filterVerifications"
                                            class="form-select">
                                            <option value="">Tous les statuts</option>
                                            <option value="CONFORME">Conforme</option>
                                            <option value="NON_CONFORME">Non conforme</option>
                                            <option value="EN_COURS">En cours</option>
                                            <option value="EN_ATTENTE">En attente</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.criticite" @change="filterVerifications"
                                            class="form-select">
                                            <option value="">Toutes criticités</option>
                                            <option value="CRITIQUE">Critique</option>
                                            <option value="ELEVEE">Élevée</option>
                                            <option value="MOYENNE">Moyenne</option>
                                            <option value="FAIBLE">Faible</option>
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

                <!-- Liste des vérifications -->
                <div class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">
                                    Registre des Vérifications
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ filteredVerifications.length }} vérifications
                                    </span>
                                </h6>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Référence</th>
                                                <th>Catégorie</th>
                                                <th>Dossier / Acte</th>
                                                <th>Points de Contrôle</th>
                                                <th>Statut</th>
                                                <th>Criticité</th>
                                                <th>Date</th>
                                                <th class="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="paginatedVerifications.length === 0">
                                                <td colspan="8" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucune vérification trouvée</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="verif in paginatedVerifications" :key="verif.id"
                                                :class="{ 'table-danger': verif.statut === 'NON_CONFORME' && verif.criticite === 'CRITIQUE' }">
                                                <td>
                                                    <strong class="text-primary">#{{ verif.reference }}</strong>
                                                </td>
                                                <td>
                                                    <span class="badge"
                                                        :class="'bg-' + getCategorieColor(verif.categorie)">
                                                        <i class="bi" :class="getCategorieIcon(verif.categorie)"></i>
                                                        {{ getCategorieLabel(verif.categorie) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div><strong>{{ verif.dossier }}</strong></div>
                                                    <small class="text-muted">{{ verif.acte }}</small>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <i class="bi bi-check-square me-2"></i>
                                                        <span>{{ verif.pointsValides }}/{{ verif.pointsTotal }}</span>
                                                    </div>
                                                    <div class="progress mt-1" style="height: 4px; width: 80px;">
                                                        <div class="progress-bar"
                                                            :class="getProgressBarClass(verif.pointsValides, verif.pointsTotal)"
                                                            :style="{ width: (verif.pointsValides / verif.pointsTotal * 100) + '%' }">
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getStatutBadgeClass(verif.statut)">
                                                        <i class="bi" :class="getStatutIcon(verif.statut)"></i>
                                                        {{ getStatutLabel(verif.statut) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span class="badge"
                                                        :class="getCriticiteBadgeClass(verif.criticite)">
                                                        {{ verif.criticite }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <small class="text-muted">
                                                        <i class="bi bi-calendar-event me-1"></i>
                                                        {{ formatDate(verif.dateVerification) }}
                                                    </small>
                                                </td>
                                                <td class="text-end">
                                                    <div class="dropdown">
                                                        <button class="btn btn-sm btn-light" type="button"
                                                            data-bs-toggle="dropdown">
                                                            <i class="bi bi-three-dots-vertical"></i>
                                                        </button>
                                                        <ul class="dropdown-menu dropdown-menu-end">
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="viewVerification(verif)">
                                                                    <i class="bi bi-eye me-2"></i>Voir détails
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="genererRapport(verif)">
                                                                    <i class="bi bi-file-earmark-pdf me-2"></i>Rapport
                                                                    PDF
                                                                </a>
                                                            </li>
                                                            <li v-if="verif.statut === 'NON_CONFORME'">
                                                                <a class="dropdown-item text-warning" href="#"
                                                                    @click.prevent="createAction(verif)">
                                                                    <i class="bi bi-exclamation-triangle me-2"></i>Plan
                                                                    d'action
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <hr class="dropdown-divider">
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="editVerification(verif)">
                                                                    <i class="bi bi-pencil me-2"></i>Modifier
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- Pagination -->
                                <div v-if="filteredVerifications.length > perPage" class="card-footer border-top">
                                    <nav>
                                        <ul class="pagination justify-content-center mb-0">
                                            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                                <a class="page-link" href="#"
                                                    @click.prevent="currentPage--">Précédent</a>
                                            </li>
                                            <li v-for="page in totalPages" :key="page" class="page-item"
                                                :class="{ active: currentPage === page }">
                                                <a class="page-link" href="#" @click.prevent="currentPage = page">{{
                                                    page }}</a>
                                            </li>
                                            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                                <a class="page-link" href="#" @click.prevent="currentPage++">Suivant</a>
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
        <div v-if="selectedVerification" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Vérification #{{ selectedVerification.reference }}
                            <span class="badge ms-2" :class="getStatutBadgeClass(selectedVerification.statut)">
                                {{ getStatutLabel(selectedVerification.statut) }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedVerification = null"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-info-circle me-2"></i>Informations</h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Catégorie</label>
                                            <p class="mb-0">
                                                <span class="badge"
                                                    :class="'bg-' + getCategorieColor(selectedVerification.categorie)">
                                                    {{ getCategorieLabel(selectedVerification.categorie) }}
                                                </span>
                                            </p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Dossier</label>
                                            <p class="mb-0 fw-bold">{{ selectedVerification.dossier }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Acte</label>
                                            <p class="mb-0">{{ selectedVerification.acte }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Criticité</label>
                                            <p class="mb-0">
                                                <span class="badge"
                                                    :class="getCriticiteBadgeClass(selectedVerification.criticite)">
                                                    {{ selectedVerification.criticite }}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-graph-up me-2"></i>Résultats</h6>
                                        <div class="mb-3">
                                            <label class="text-muted small">Points de contrôle</label>
                                            <div class="progress" style="height: 20px;">
                                                <div class="progress-bar"
                                                    :class="getProgressBarClass(selectedVerification.pointsValides, selectedVerification.pointsTotal)"
                                                    :style="{ width: (selectedVerification.pointsValides / selectedVerification.pointsTotal * 100) + '%' }">
                                                    {{ selectedVerification.pointsValides }}/{{
                                                        selectedVerification.pointsTotal }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Vérificateur</label>
                                            <p class="mb-0">{{ selectedVerification.verificateur }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Date de vérification</label>
                                            <p class="mb-0">{{ formatDate(selectedVerification.dateVerification) }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-list-check me-2"></i>Points de Contrôle</h6>
                                        <div class="checklist">
                                            <div v-for="point in selectedVerification.pointsControle" :key="point.id"
                                                class="checklist-item p-3 mb-2 rounded"
                                                :class="getChecklistItemClass(point.conforme)">
                                                <div class="d-flex align-items-start">
                                                    <i class="bi fs-5 me-3"
                                                        :class="point.conforme ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'"></i>
                                                    <div class="flex-grow-1">
                                                        <strong>{{ point.titre }}</strong>
                                                        <p class="mb-0 small text-muted mt-1">{{ point.description }}
                                                        </p>
                                                        <div v-if="!point.conforme && point.remarque"
                                                            class="alert alert-warning py-2 px-3 mt-2 mb-0">
                                                            <small><i class="bi bi-exclamation-triangle me-1"></i>{{
                                                                point.remarque }}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12" v-if="selectedVerification.recommandations">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-lightbulb me-2"></i>Recommandations</h6>
                                        <p class="mb-0">{{ selectedVerification.recommandations }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            @click="selectedVerification = null">Fermer</button>
                        <button type="button" class="btn btn-info" @click="genererRapport(selectedVerification)">
                            <i class="bi bi-file-earmark-pdf me-1"></i>Rapport PDF
                        </button>
                        <button v-if="selectedVerification.statut === 'NON_CONFORME'" type="button"
                            class="btn btn-warning" @click="createAction(selectedVerification)">
                            <i class="bi bi-exclamation-triangle me-1"></i>Plan d'Action
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Création -->
        <div v-if="showCreateModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Nouvelle Vérification Réglementaire</h5>
                        <button type="button" class="btn-close" @click="closeCreateModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Catégorie *</label>
                                <select v-model="verificationForm.categorie" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="KYC">KYC/AML</option>
                                    <option value="FISCAL">Conformité Fiscale</option>
                                    <option value="LEGAL">Conformité Légale</option>
                                    <option value="DOCUMENTS">Documents</option>
                                    <option value="SIGNATURES">Signatures</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Criticité *</label>
                                <select v-model="verificationForm.criticite" class="form-select" required>
                                    <option value="CRITIQUE">Critique</option>
                                    <option value="ELEVEE">Élevée</option>
                                    <option value="MOYENNE">Moyenne</option>
                                    <option value="FAIBLE">Faible</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Dossier concerné *</label>
                                <input type="text" v-model="verificationForm.dossier" class="form-control" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Acte *</label>
                                <input type="text" v-model="verificationForm.acte" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Vérificateur *</label>
                                <select v-model="verificationForm.verificateurId" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="1">Me. Kouassi</option>
                                    <option value="2">Me. Kone</option>
                                    <option value="3">Me. Diallo</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date *</label>
                                <input type="date" v-model="verificationForm.dateVerification" class="form-control"
                                    required>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeCreateModal">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="saveVerification">
                            <i class="bi bi-check-circle me-1"></i>Créer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
    name: 'VerificationsReglementaires',

    data() {
        return {
            loading: true,
            searchQuery: '',
            currentPage: 1,
            perPage: 15,
            selectedVerification: null,
            showCreateModal: false,
            editMode: false,
            filters: { categorie: '', statut: '', criticite: '' },
            verificationForm: {
                id: null, categorie: '', criticite: 'MOYENNE', dossier: '', acte: '',
                verificateurId: '', dateVerification: ''
            },
            verifications: [],
            stats: { total: 0, conformes: 0, nonConformes: 0, tauxConformite: 0 },
            categories: []
        };
    },

    computed: {
        filteredVerifications() {
            let result = [...this.verifications];
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(v =>
                    v.reference.toLowerCase().includes(query) ||
                    v.dossier.toLowerCase().includes(query) ||
                    v.acte.toLowerCase().includes(query)
                );
            }
            if (this.filters.categorie) result = result.filter(v => v.categorie === this.filters.categorie);
            if (this.filters.statut) result = result.filter(v => v.statut === this.filters.statut);
            if (this.filters.criticite) result = result.filter(v => v.criticite === this.filters.criticite);
            return result.sort((a, b) => new Date(b.dateVerification) - new Date(a.dateVerification));
        },

        paginatedVerifications() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredVerifications.slice(start, start + this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filteredVerifications.length / this.perPage);
        }
    },

    async mounted() {
        await this.loadData();
    },

    methods: {
        async loadData() {
            try {
                this.loading = true;
                const categories = ['KYC', 'FISCAL', 'LEGAL', 'DOCUMENTS', 'SIGNATURES'];
                const statuts = ['CONFORME', 'NON_CONFORME', 'EN_COURS', 'EN_ATTENTE'];
                const criticites = ['CRITIQUE', 'ELEVEE', 'MOYENNE', 'FAIBLE'];
                const verificateurs = ['Me. Kouassi', 'Me. Kone', 'Me. Diallo'];

                this.verifications = Array.from({ length: 35 }, (_, i) => {
                    const pointsTotal = Math.floor(Math.random() * 10) + 5;
                    const pointsValides = Math.floor(Math.random() * pointsTotal);
                    const statut = pointsValides === pointsTotal ? 'CONFORME' :
                        pointsValides < pointsTotal / 2 ? 'NON_CONFORME' :
                            statuts[Math.floor(Math.random() * statuts.length)];

                    return {
                        id: i + 1,
                        reference: `VER-${String(i + 1).padStart(4, '0')}`,
                        categorie: categories[Math.floor(Math.random() * categories.length)],
                        dossier: `DOS-${String(Math.floor(Math.random() * 100) + 1).padStart(4, '0')}`,
                        acte: `Acte ${i + 1}`,
                        statut: statut,
                        criticite: criticites[Math.floor(Math.random() * criticites.length)],
                        pointsTotal: pointsTotal,
                        pointsValides: pointsValides,
                        verificateur: verificateurs[Math.floor(Math.random() * verificateurs.length)],
                        dateVerification: new Date(2024, 10, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
                        pointsControle: Array.from({ length: pointsTotal }, (_, j) => ({
                            id: j + 1,
                            titre: `Point de contrôle ${j + 1}`,
                            description: `Description du contrôle réglementaire`,
                            conforme: j < pointsValides,
                            remarque: j >= pointsValides ? 'Non-conformité détectée' : null
                        })),
                        recommandations: statut === 'NON_CONFORME' ? 'Actions correctives requises pour mise en conformité' : null
                    };
                });

                this.calculateStats();
                this.calculateCategories();
            } catch (error) {
                console.error('Erreur:', error);
                ElMessage.error('Erreur lors du chargement');
            } finally {
                this.loading = false;
            }
        },

        calculateStats() {
            this.stats.total = this.verifications.length;
            this.stats.conformes = this.verifications.filter(v => v.statut === 'CONFORME').length;
            this.stats.nonConformes = this.verifications.filter(v => v.statut === 'NON_CONFORME').length;
            const total = this.stats.conformes + this.stats.nonConformes;
            this.stats.tauxConformite = total > 0 ? Math.round((this.stats.conformes / total) * 100) : 0;
        },

        calculateCategories() {
            const cats = [
                { id: 'KYC', label: 'KYC/AML', icon: 'bi-person-badge', color: 'primary' },
                { id: 'FISCAL', label: 'Conformité Fiscale', icon: 'bi-calculator', color: 'success' },
                { id: 'LEGAL', label: 'Conformité Légale', icon: 'bi-briefcase', color: 'info' },
                { id: 'DOCUMENTS', label: 'Documents', icon: 'bi-file-earmark-check', color: 'warning' },
                { id: 'SIGNATURES', label: 'Signatures', icon: 'bi-pen', color: 'danger' }
            ];

            this.categories = cats.map(cat => {
                const items = this.verifications.filter(v => v.categorie === cat.id);
                const conformes = items.filter(v => v.statut === 'CONFORME').length;
                return {
                    ...cat,
                    count: items.length,
                    conformite: items.length > 0 ? Math.round((conformes / items.length) * 100) : 0
                };
            });
        },

        filterVerifications() {
            this.currentPage = 1;
        },

        resetFilters() {
            this.searchQuery = '';
            this.filters = { categorie: '', statut: '', criticite: '' };
            this.currentPage = 1;
        },

        viewVerification(verif) {
            this.selectedVerification = verif;
        },

        editVerification(verif) {
            this.editMode = true;
            this.verificationForm = { ...verif };
            this.showCreateModal = true;
            if (this.selectedVerification) this.selectedVerification = null;
        },

        closeCreateModal() {
            this.showCreateModal = false;
            this.editMode = false;
            this.verificationForm = {
                id: null, categorie: '', criticite: 'MOYENNE', dossier: '', acte: '',
                verificateurId: '', dateVerification: ''
            };
        },

        saveVerification() {
            if (!this.verificationForm.categorie || !this.verificationForm.dossier ||
                !this.verificationForm.acte || !this.verificationForm.verificateurId) {
                ElMessage.warning('Veuillez remplir tous les champs obligatoires');
                return;
            }
            ElMessage.success('Vérification créée avec succès!');
            this.closeCreateModal();
            this.loadData();
        },

        genererRapport(verif) {
            ElMessage.success('Génération du rapport PDF en cours...');
            if (this.selectedVerification) this.selectedVerification = null;
        },

        async createAction(verif) {
            try {
                await ElMessageBox.confirm(
                    'Créer un plan d\'action correctif pour cette non-conformité ?',
                    'Plan d\'action',
                    {
                        confirmButtonText: 'Créer',
                        cancelButtonText: 'Annuler',
                        type: 'warning'
                    }
                );
                ElMessage.success('Plan d\'action créé!');
                if (this.selectedVerification) this.selectedVerification = null;
            } catch (error) {
                if (error !== 'cancel') console.error('Erreur:', error);
            }
        },

        exportVerifications() {
            ElMessage.success('Export du rapport en cours...');
        },

        rafraichir() {
            this.loadData();
            ElMessage.success('Données mises à jour !');
        },

        getCategorieLabel(categorie) {
            const labels = {
                'KYC': 'KYC/AML',
                'FISCAL': 'Conformité Fiscale',
                'LEGAL': 'Conformité Légale',
                'DOCUMENTS': 'Documents',
                'SIGNATURES': 'Signatures'
            };
            return labels[categorie] || categorie;
        },

        getCategorieIcon(categorie) {
            const icons = {
                'KYC': 'bi-person-badge',
                'FISCAL': 'bi-calculator',
                'LEGAL': 'bi-briefcase',
                'DOCUMENTS': 'bi-file-earmark-check',
                'SIGNATURES': 'bi-pen'
            };
            return icons[categorie] || 'bi-shield-check';
        },

        getCategorieColor(categorie) {
            const colors = {
                'KYC': 'primary',
                'FISCAL': 'success',
                'LEGAL': 'info',
                'DOCUMENTS': 'warning',
                'SIGNATURES': 'danger'
            };
            return colors[categorie] || 'secondary';
        },

        getStatutLabel(statut) {
            const labels = {
                'CONFORME': 'Conforme',
                'NON_CONFORME': 'Non conforme',
                'EN_COURS': 'En cours',
                'EN_ATTENTE': 'En attente'
            };
            return labels[statut] || statut;
        },

        getStatutIcon(statut) {
            const icons = {
                'CONFORME': 'bi-check-circle-fill',
                'NON_CONFORME': 'bi-x-circle-fill',
                'EN_COURS': 'bi-arrow-repeat',
                'EN_ATTENTE': 'bi-clock'
            };
            return icons[statut] || 'bi-circle';
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'CONFORME': 'bg-success',
                'NON_CONFORME': 'bg-danger',
                'EN_COURS': 'bg-warning text-dark',
                'EN_ATTENTE': 'bg-secondary'
            };
            return classes[statut] || 'bg-secondary';
        },

        getCriticiteBadgeClass(criticite) {
            const classes = {
                'CRITIQUE': 'bg-danger',
                'ELEVEE': 'bg-warning text-dark',
                'MOYENNE': 'bg-info',
                'FAIBLE': 'bg-secondary'
            };
            return classes[criticite] || 'bg-secondary';
        },

        getProgressBarClass(valides, total) {
            const percentage = (valides / total) * 100;
            if (percentage === 100) return 'bg-success';
            if (percentage >= 75) return 'bg-info';
            if (percentage >= 50) return 'bg-warning';
            return 'bg-danger';
        },

        getChecklistItemClass(conforme) {
            return conforme ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10';
        },

        formatDate(dateStr) {
            if (!dateStr) return '—';
            return new Date(dateStr).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    }
};
</script>

<style scoped>
.icon-lg {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal.show {
    display: block !important;
}

.category-card {
    background: white;
    transition: all 0.3s;
}

.category-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.checklist {
    max-height: 500px;
    overflow-y: auto;
}

.checklist-item {
    border: 1px solid #dee2e6;
    transition: all 0.2s;
}

.table-hover tbody tr:hover {
    background-color: rgba(13, 110, 253, 0.05);
}

.badge {
    font-weight: 500;
    padding: 0.35em 0.65em;
}

.dropdown-menu {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.spinner-border {
    width: 3rem;
    height: 3rem;
}

.pagination .page-link {
    color: #0d6efd;
    border-color: #dee2e6;
}

.pagination .page-item.active .page-link {
    background-color: #0d6efd;
    border-color: #0d6efd;
}

.pagination .page-item.disabled .page-link {
    color: #6c757d;
    pointer-events: none;
}

.checklist::-webkit-scrollbar {
    width: 8px;
}

.checklist::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.checklist::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}

.checklist::-webkit-scrollbar-thumb:hover {
    background: #555;
}

@media (max-width: 768px) {
    .icon-lg {
        width: 50px;
        height: 50px;
    }
}

.bloc {
    min-height: 100vh;
    right: 2rem;
    /* ou relative selon ton cas */
}

/* Pour les petits écrans (ex. <style 768px) */
@media (max-width: 768px) {
    .bloc {
        min-height: auto;
        right: 0;
    }
}
</style>