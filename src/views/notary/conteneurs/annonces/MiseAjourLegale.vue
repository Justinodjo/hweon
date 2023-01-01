<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">

            <!-- En-tête -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">
                                <i class="bi bi-book-half me-2"></i>Mise à jour Légale
                            </h1>
                            <p class="text-muted mb-0">Veille juridique et réglementaire</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <button @click="showCreateModal = true" class="btn btn-primary">
                                <i class="bi bi-plus-circle me-1"></i>Nouvelle Publication
                            </button>
                            <button @click="rafraichir" class="btn btn-outline-primary">
                                <i class="bi bi-arrow-clockwise"></i>
                            </button>
                            <button @click="exportPublications" class="btn btn-success">
                                <i class="bi bi-download me-1"></i> Exporter
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
                                    <span class="text-muted small">Total Publications</span>
                                    <h3 class="mb-0 mt-2 text-primary">{{ stats.total }}</h3>
                                    <small class="text-muted">
                                        <i class="bi bi-book me-1"></i>Archivées
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-primary bg-opacity-10 text-primary">
                                    <i class="bi bi-book fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Ce Mois</span>
                                    <h3 class="mb-0 mt-2 text-success">{{ stats.ceMois }}</h3>
                                    <small class="text-success">
                                        <i class="bi bi-calendar-check me-1"></i>Nouvelles
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-success bg-opacity-10 text-success">
                                    <i class="bi bi-calendar-check fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Modifications Importantes</span>
                                    <h3 class="mb-0 mt-2 text-warning">{{ stats.importantes }}</h3>
                                    <small class="text-warning">
                                        <i class="bi bi-exclamation-triangle me-1"></i>À réviser
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-warning bg-opacity-10 text-warning">
                                    <i class="bi bi-exclamation-triangle fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Alertes Actives</span>
                                    <h3 class="mb-0 mt-2 text-danger">{{ stats.alertes }}</h3>
                                    <small class="text-danger">
                                        <i class="bi bi-bell me-1"></i>En attente
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-danger bg-opacity-10 text-danger">
                                    <i class="bi bi-bell fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Catégories -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Catégories Juridiques</h6>
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div v-for="cat in categories" :key="cat.id" class="col-md-4">
                                        <div class="category-card p-3 rounded border" @click="filterByCategory(cat.id)"
                                            style="cursor: pointer;">
                                            <div class="d-flex justify-content-between align-items-center mb-2">
                                                <div class="d-flex align-items-center">
                                                    <i class="bi fs-4 me-2"
                                                        :class="[cat.icon, 'text-' + cat.color]"></i>
                                                    <strong>{{ cat.label }}</strong>
                                                </div>
                                                <span class="badge" :class="'bg-' + cat.color">{{ cat.count }}</span>
                                            </div>
                                            <small class="text-muted">{{ cat.description }}</small>
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
                                                v-model="searchQuery" @input="filterPublications">
                                            <i
                                                class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.categorie" @change="filterPublications"
                                            class="form-select">
                                            <option value="">Toutes catégories</option>
                                            <option value="LOI">Lois</option>
                                            <option value="DECRET">Décrets</option>
                                            <option value="ARRETE">Arrêtés</option>
                                            <option value="JURISPRUDENCE">Jurisprudence</option>
                                            <option value="CIRCULAIRE">Circulaires</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.importance" @change="filterPublications"
                                            class="form-select">
                                            <option value="">Toutes importances</option>
                                            <option value="CRITIQUE">Critique</option>
                                            <option value="HAUTE">Haute</option>
                                            <option value="NORMALE">Normale</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.statut" @change="filterPublications"
                                            class="form-select">
                                            <option value="">Tous les statuts</option>
                                            <option value="NOUVEAU">Nouveau</option>
                                            <option value="LU">Lu</option>
                                            <option value="APPLIQUE">Appliqué</option>
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

                <!-- Liste des publications -->
                <div class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">
                                    Publications Récentes
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ filteredPublications.length }} publications
                                    </span>
                                </h6>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Référence</th>
                                                <th>Titre / Type</th>
                                                <th>Importance</th>
                                                <th>Date Publication</th>
                                                <th>Impact</th>
                                                <th>Statut</th>
                                                <th class="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="paginatedPublications.length === 0">
                                                <td colspan="7" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucune publication trouvée</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="pub in paginatedPublications" :key="pub.id"
                                                :class="{ 'table-warning': pub.statut === 'NOUVEAU' && pub.importance === 'CRITIQUE' }">
                                                <td>
                                                    <strong class="text-primary">{{ pub.reference }}</strong>
                                                    <span v-if="pub.statut === 'NOUVEAU'" class="badge bg-danger ms-1">
                                                        <i class="bi bi-exclamation"></i>
                                                    </span>
                                                </td>
                                                <td>
                                                    <div><strong>{{ pub.titre }}</strong></div>
                                                    <span class="badge"
                                                        :class="'bg-' + getCategorieColor(pub.categorie)">
                                                        {{ pub.categorie }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span class="badge"
                                                        :class="getImportanceBadgeClass(pub.importance)">
                                                        <i class="bi" :class="getImportanceIcon(pub.importance)"></i>
                                                        {{ pub.importance }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <small class="text-muted">
                                                        <i class="bi bi-calendar-event me-1"></i>
                                                        {{ formatDate(pub.datePublication) }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <div class="d-flex gap-1">
                                                        <span v-for="domaine in pub.domainesImpact" :key="domaine"
                                                            class="badge bg-light text-dark small">
                                                            {{ domaine }}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getStatutBadgeClass(pub.statut)">
                                                        {{ getStatutLabel(pub.statut) }}
                                                    </span>
                                                </td>
                                                <td class="text-end">
                                                    <div class="btn-group">
                                                        <button class="btn btn-sm btn-outline-primary"
                                                            @click="viewPublication(pub)">
                                                            <i class="bi bi-eye"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-success"
                                                            @click="marquerLu(pub)">
                                                            <i class="bi bi-check-circle"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-warning"
                                                            @click="creerAlerte(pub)">
                                                            <i class="bi bi-bell"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- Pagination -->
                                <div v-if="filteredPublications.length > perPage" class="card-footer border-top">
                                    <nav>
                                        <ul class="pagination justify-content-center mb-0">
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
        <div v-if="selectedPublication" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ selectedPublication.titre }}
                            <span class="badge ms-2" :class="getImportanceBadgeClass(selectedPublication.importance)">
                                {{ selectedPublication.importance }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedPublication = null"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-info-circle me-2"></i>Informations</h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Référence</label>
                                            <p class="mb-0 fw-bold">{{ selectedPublication.reference }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Catégorie</label>
                                            <p class="mb-0">
                                                <span class="badge"
                                                    :class="'bg-' + getCategorieColor(selectedPublication.categorie)">
                                                    {{ selectedPublication.categorie }}
                                                </span>
                                            </p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Date de publication</label>
                                            <p class="mb-0">{{ formatDate(selectedPublication.datePublication) }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Source</label>
                                            <p class="mb-0">{{ selectedPublication.source }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-diagram-3 me-2"></i>Impact</h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Domaines concernés</label>
                                            <div class="d-flex flex-wrap gap-1">
                                                <span v-for="domaine in selectedPublication.domainesImpact"
                                                    :key="domaine" class="badge bg-primary">{{ domaine }}</span>
                                            </div>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Date d'application</label>
                                            <p class="mb-0">{{ formatDate(selectedPublication.dateApplication) }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Niveau d'urgence</label>
                                            <p class="mb-0">
                                                <span class="badge"
                                                    :class="getImportanceBadgeClass(selectedPublication.importance)">
                                                    {{ selectedPublication.importance }}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-file-text me-2"></i>Résumé</h6>
                                        <p class="mb-0">{{ selectedPublication.resume }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12"
                                v-if="selectedPublication.modifications && selectedPublication.modifications.length > 0">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-arrow-repeat me-2"></i>Modifications Apportées
                                        </h6>
                                        <ul class="mb-0">
                                            <li v-for="(modif, index) in selectedPublication.modifications"
                                                :key="index">
                                                {{ modif }}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12"
                                v-if="selectedPublication.actions && selectedPublication.actions.length > 0">
                                <div class="card border-warning">
                                    <div class="card-header bg-warning bg-opacity-10">
                                        <h6 class="mb-0"><i class="bi bi-exclamation-triangle me-2"></i>Actions Requises
                                        </h6>
                                    </div>
                                    <div class="card-body">
                                        <ul class="mb-0">
                                            <li v-for="(action, index) in selectedPublication.actions" :key="index">
                                                <strong>{{ action }}</strong>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            @click="selectedPublication = null">Fermer</button>
                        <button type="button" class="btn btn-info" @click="creerAlerte(selectedPublication)">
                            <i class="bi bi-bell me-1"></i>Créer Alerte
                        </button>
                        <button type="button" class="btn btn-success" @click="telecharger(selectedPublication)">
                            <i class="bi bi-download me-1"></i>Télécharger
                        </button>
                        <button type="button" class="btn btn-primary" @click="marquerLu(selectedPublication)">
                            <i class="bi bi-check-circle me-1"></i>Marquer Lu
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
                        <h5 class="modal-title">Nouvelle Publication</h5>
                        <button type="button" class="btn-close" @click="closeCreateModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Catégorie *</label>
                                <select v-model="publicationForm.categorie" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="LOI">Loi</option>
                                    <option value="DECRET">Décret</option>
                                    <option value="ARRETE">Arrêté</option>
                                    <option value="JURISPRUDENCE">Jurisprudence</option>
                                    <option value="CIRCULAIRE">Circulaire</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Importance *</label>
                                <select v-model="publicationForm.importance" class="form-select" required>
                                    <option value="CRITIQUE">Critique</option>
                                    <option value="HAUTE">Haute</option>
                                    <option value="NORMALE">Normale</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Titre *</label>
                                <input type="text" v-model="publicationForm.titre" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Référence</label>
                                <input type="text" v-model="publicationForm.reference" class="form-control">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date de publication *</label>
                                <input type="date" v-model="publicationForm.datePublication" class="form-control"
                                    required>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Résumé *</label>
                                <textarea v-model="publicationForm.resume" class="form-control" rows="4"
                                    required></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeCreateModal">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="savePublication">
                            <i class="bi bi-check-circle me-1"></i>Créer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MiseAJourLegale',

    data() {
        return {
            loading: true,
            searchQuery: '',
            currentPage: 1,
            perPage: 15,
            selectedPublication: null,
            showCreateModal: false,
            filters: { categorie: '', importance: '', statut: '' },
            publicationForm: {
                categorie: '', importance: 'NORMALE', titre: '', reference: '',
                datePublication: '', resume: ''
            },
            publications: [],
            stats: { total: 0, ceMois: 0, importantes: 0, alertes: 0 },
            categories: []
        };
    },

    computed: {
        filteredPublications() {
            let result = [...this.publications];
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(p =>
                    p.titre.toLowerCase().includes(query) ||
                    p.reference.toLowerCase().includes(query) ||
                    p.resume.toLowerCase().includes(query)
                );
            }
            if (this.filters.categorie) result = result.filter(p => p.categorie === this.filters.categorie);
            if (this.filters.importance) result = result.filter(p => p.importance === this.filters.importance);
            if (this.filters.statut) result = result.filter(p => p.statut === this.filters.statut);
            return result.sort((a, b) => new Date(b.datePublication) - new Date(a.datePublication));
        },

        paginatedPublications() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredPublications.slice(start, start + this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filteredPublications.length / this.perPage);
        }
    },

    async mounted() {
        await this.loadData();
    },

    methods: {
        async loadData() {
            try {
                this.loading = true;
                const categories = ['LOI', 'DECRET', 'ARRETE', 'JURISPRUDENCE', 'CIRCULAIRE'];
                const importances = ['CRITIQUE', 'HAUTE', 'NORMALE'];
                const statuts = ['NOUVEAU', 'LU', 'APPLIQUE'];

                this.publications = Array.from({ length: 30 }, (_, i) => ({
                    id: i + 1,
                    reference: `REF-${String(i + 1).padStart(4, '0')}/2024`,
                    categorie: categories[Math.floor(Math.random() * categories.length)],
                    titre: `Publication juridique ${i + 1}`,
                    importance: importances[Math.floor(Math.random() * importances.length)],
                    datePublication: new Date(2024, 10, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
                    dateApplication: new Date(2024, 11, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
                    source: 'Journal Officiel',
                    statut: statuts[Math.floor(Math.random() * statuts.length)],
                    domainesImpact: ['Notariat', 'Immobilier'],
                    resume: `Résumé de la publication juridique numéro ${i + 1} concernant les modifications apportées.`,
                    modifications: ['Modification de l\'article X', 'Ajout de nouvelles dispositions'],
                    actions: Math.random() > 0.7 ? ['Mise à jour des procédures internes requise'] : []
                }));

                this.calculateStats();
                this.calculateCategories();
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors du chargement', 'error');
            } finally {
                this.loading = false;
            }
        },

        calculateStats() {
            this.stats.total = this.publications.length;
            const thisMonth = new Date().getMonth();
            this.stats.ceMois = this.publications.filter(p => new Date(p.datePublication).getMonth() === thisMonth).length;
            this.stats.importantes = this.publications.filter(p => p.importance === 'CRITIQUE' || p.importance === 'HAUTE').length;
            this.stats.alertes = this.publications.filter(p => p.statut === 'NOUVEAU' && (p.importance === 'CRITIQUE' || p.importance === 'HAUTE')).length;
        },

        calculateCategories() {
            const categoriesList = [
                { id: 'LOI', label: 'Lois', icon: 'bi-shield-check', color: 'primary', description: 'Textes législatifs' },
                { id: 'DECRET', label: 'Décrets', icon: 'bi-file-earmark-text', color: 'success', description: 'Décrets d\'application' },
                { id: 'ARRETE', label: 'Arrêtés', icon: 'bi-file-earmark', color: 'info', description: 'Arrêtés ministériels' },
                { id: 'JURISPRUDENCE', label: 'Jurisprudence', icon: 'bi-balance-scale', color: 'warning', description: 'Décisions de justice' },
                { id: 'CIRCULAIRE', label: 'Circulaires', icon: 'bi-envelope', color: 'secondary', description: 'Circulaires administratives' }
            ];

            this.categories = categoriesList.map(cat => ({
                ...cat,
                count: this.publications.filter(p => p.categorie === cat.id).length
            }));
        },

        filterPublications() {
            this.currentPage = 1;
        },

        filterByCategory(categorieId) {
            this.filters.categorie = this.filters.categorie === categorieId ? '' : categorieId;
            this.filterPublications();
        },

        resetFilters() {
            this.searchQuery = '';
            this.filters = { categorie: '', importance: '', statut: '' };
            this.currentPage = 1;
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },

        viewPublication(pub) {
            this.selectedPublication = pub;
        },

        async marquerLu(pub) {
            try {
                const index = this.publications.findIndex(p => p.id === pub.id);
                if (index !== -1) {
                    this.publications[index].statut = 'LU';
                    this.showMessage('Publication marquée comme lue', 'success');
                    this.calculateStats();
                    if (this.selectedPublication && this.selectedPublication.id === pub.id) {
                        this.selectedPublication = null;
                    }
                }
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors de la mise à jour', 'error');
            }
        },

        async creerAlerte(pub) {
            try {
                this.showMessage(`Alerte créée pour: ${pub.titre}`, 'success');
                this.calculateStats();
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors de la création de l\'alerte', 'error');
            }
        },

        async telecharger(pub) {
            try {
                // Simulation du téléchargement
                const content = `
PUBLICATION JURIDIQUE
====================

Référence: ${pub.reference}
Catégorie: ${pub.categorie}
Importance: ${pub.importance}
Date de publication: ${this.formatDate(pub.datePublication)}
Source: ${pub.source}

TITRE
-----
${pub.titre}

RÉSUMÉ
------
${pub.resume}

DOMAINES D'IMPACT
-----------------
${pub.domainesImpact.join(', ')}

MODIFICATIONS APPORTÉES
------------------------
${pub.modifications ? pub.modifications.map((m, i) => `${i + 1}. ${m}`).join('\n') : 'Aucune modification spécifiée'}

ACTIONS REQUISES
----------------
${pub.actions && pub.actions.length > 0 ? pub.actions.map((a, i) => `${i + 1}. ${a}`).join('\n') : 'Aucune action requise'}
                `.trim();

                const blob = new Blob([content], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${pub.reference.replace(/\//g, '-')}.txt`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                this.showMessage('Document téléchargé avec succès', 'success');
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors du téléchargement', 'error');
            }
        },

        async exportPublications() {
            try {
                const csvContent = [
                    ['Référence', 'Titre', 'Catégorie', 'Importance', 'Date Publication', 'Statut', 'Domaines Impact'].join(';'),
                    ...this.filteredPublications.map(p => [
                        p.reference,
                        p.titre,
                        p.categorie,
                        p.importance,
                        this.formatDate(p.datePublication),
                        this.getStatutLabel(p.statut),
                        p.domainesImpact.join(', ')
                    ].join(';'))
                ].join('\n');

                const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `publications-legales-${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                this.showMessage('Export réalisé avec succès', 'success');
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors de l\'export', 'error');
            }
        },

        async rafraichir() {
            await this.loadData();
            this.showMessage('Données actualisées', 'success');
        },

        closeCreateModal() {
            this.showCreateModal = false;
            this.publicationForm = {
                categorie: '',
                importance: 'NORMALE',
                titre: '',
                reference: '',
                datePublication: '',
                resume: ''
            };
        },

        async savePublication() {
            try {
                // Validation
                if (!this.publicationForm.categorie || !this.publicationForm.titre ||
                    !this.publicationForm.datePublication || !this.publicationForm.resume) {
                    this.showMessage('Veuillez remplir tous les champs obligatoires', 'warning');
                    return;
                }

                const newPub = {
                    id: this.publications.length + 1,
                    reference: this.publicationForm.reference || `REF-${String(this.publications.length + 1).padStart(4, '0')}/2024`,
                    categorie: this.publicationForm.categorie,
                    titre: this.publicationForm.titre,
                    importance: this.publicationForm.importance,
                    datePublication: this.publicationForm.datePublication,
                    dateApplication: this.publicationForm.datePublication,
                    source: 'Saisie manuelle',
                    statut: 'NOUVEAU',
                    domainesImpact: ['Notariat'],
                    resume: this.publicationForm.resume,
                    modifications: [],
                    actions: []
                };

                this.publications.unshift(newPub);
                this.calculateStats();
                this.calculateCategories();
                this.closeCreateModal();
                this.showMessage('Publication créée avec succès', 'success');
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors de la création', 'error');
            }
        },

        // Méthodes utilitaires
        formatDate(dateString) {
            if (!dateString) return '-';
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

        getCategorieColor(categorie) {
            const colors = {
                'LOI': 'primary',
                'DECRET': 'success',
                'ARRETE': 'info',
                'JURISPRUDENCE': 'warning',
                'CIRCULAIRE': 'secondary'
            };
            return colors[categorie] || 'secondary';
        },

        getImportanceBadgeClass(importance) {
            const classes = {
                'CRITIQUE': 'bg-danger',
                'HAUTE': 'bg-warning',
                'NORMALE': 'bg-info'
            };
            return classes[importance] || 'bg-secondary';
        },

        getImportanceIcon(importance) {
            const icons = {
                'CRITIQUE': 'bi-exclamation-triangle-fill',
                'HAUTE': 'bi-exclamation-circle-fill',
                'NORMALE': 'bi-info-circle-fill'
            };
            return icons[importance] || 'bi-info-circle';
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'NOUVEAU': 'bg-danger',
                'LU': 'bg-primary',
                'APPLIQUE': 'bg-success'
            };
            return classes[statut] || 'bg-secondary';
        },

        getStatutLabel(statut) {
            const labels = {
                'NOUVEAU': 'Nouveau',
                'LU': 'Lu',
                'APPLIQUE': 'Appliqué'
            };
            return labels[statut] || statut;
        },

        showMessage(message, type = 'info') {
            // Affichage simple du message
            const alertClass = {
                'success': 'alert-success',
                'error': 'alert-danger',
                'warning': 'alert-warning',
                'info': 'alert-info'
            }[type] || 'alert-info';

            const alertDiv = document.createElement('div');
            alertDiv.className = `alert ${alertClass} position-fixed top-0 start-50 translate-middle-x mt-3`;
            alertDiv.style.zIndex = '9999';
            alertDiv.textContent = message;
            document.body.appendChild(alertDiv);

            setTimeout(() => {
                alertDiv.remove();
            }, 3000);
        }
    }
};
</script>

<style scoped>
.category-card {
    cursor: pointer;
    transition: all 0.3s ease;
}

.category-card:hover {
    background-color: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.icon-lg {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.table-hover tbody tr:hover {
    background-color: rgba(0, 123, 255, 0.05);
}

.modal.show {
    display: block;
}

.badge {
    font-weight: 500;
}

.pagination .page-link {
    color: #0d6efd;
}

.pagination .page-item.active .page-link {
    background-color: #0d6efd;
    border-color: #0d6efd;
}

.pagination .page-item.disabled .page-link {
    color: #6c757d;
    pointer-events: none;
}

.card {
    border-radius: 8px;
}

.btn {
    border-radius: 6px;
}

.form-control,
.form-select {
    border-radius: 6px;
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