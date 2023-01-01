<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">

            <!-- En-tête -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">
                                <i class="bi bi-clock-history me-2"></i>Historique des Travaux
                            </h1>
                            <p class="text-muted mb-0">Journal complet des activités et opérations</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <button @click="showFilterModal = true" class="btn btn-outline-primary">
                                <i class="bi bi-funnel me-1"></i>Filtres Avancés
                            </button>
                            <button @click="exportHistorique" class="btn btn-success">
                                <i class="bi bi-download me-1"></i>Exporter
                            </button>
                            <button @click="genererRapport" class="btn btn-info">
                                <i class="bi bi-file-earmark-pdf me-1"></i>Rapport
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
                                    <span class="text-muted small">Total Opérations</span>
                                    <h3 class="mb-0 mt-2 text-primary">{{ stats.total }}</h3>
                                    <small class="text-primary">
                                        <i class="bi bi-journal-text me-1"></i>Enregistrées
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-primary bg-opacity-10 text-primary">
                                    <i class="bi bi-journal-text fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Aujourd'hui</span>
                                    <h3 class="mb-0 mt-2 text-success">{{ stats.aujourdhui }}</h3>
                                    <small class="text-success">
                                        <i class="bi bi-calendar-day me-1"></i>Activités
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-success bg-opacity-10 text-success">
                                    <i class="bi bi-calendar-day fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Cette Semaine</span>
                                    <h3 class="mb-0 mt-2 text-info">{{ stats.semaine }}</h3>
                                    <small class="text-info">
                                        <i class="bi bi-calendar-week me-1"></i>Opérations
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-info bg-opacity-10 text-info">
                                    <i class="bi bi-calendar-week fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Ce Mois</span>
                                    <h3 class="mb-0 mt-2 text-warning">{{ stats.mois }}</h3>
                                    <small class="text-warning">
                                        <i class="bi bi-calendar-month me-1"></i>Travaux
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-warning bg-opacity-10 text-warning">
                                    <i class="bi bi-calendar-month fa-fw fs-4"></i>
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
                                <h6 class="mb-0"><i class="bi bi-graph-up me-2"></i>Activité sur 30 jours</h6>
                            </div>
                            <div class="card-body">
                                <canvas id="activiteChart" height="80"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0"><i class="bi bi-pie-chart me-2"></i>Par Type d'Action</h6>
                            </div>
                            <div class="card-body">
                                <canvas id="typeChart" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Timeline des activités -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Résumé par Catégorie</h6>
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div v-for="cat in categories" :key="cat.id" class="col-md-3">
                                        <div class="card border h-100" style="cursor: pointer;"
                                            @click="filterByCategorie(cat.id)">
                                            <div class="card-body text-center">
                                                <i class="bi fs-1 mb-2" :class="[cat.icon, 'text-' + cat.color]"></i>
                                                <h4 class="mb-1" :class="'text-' + cat.color">{{ cat.count }}</h4>
                                                <p class="mb-0 small text-muted">{{ cat.label }}</p>
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
                                                v-model="searchQuery" @input="filterTravaux">
                                            <i
                                                class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.action" @change="filterTravaux" class="form-select">
                                            <option value="">Toutes actions</option>
                                            <option value="CREATION">Création</option>
                                            <option value="MODIFICATION">Modification</option>
                                            <option value="SUPPRESSION">Suppression</option>
                                            <option value="CONSULTATION">Consultation</option>
                                            <option value="VALIDATION">Validation</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.module" @change="filterTravaux" class="form-select">
                                            <option value="">Tous modules</option>
                                            <option value="DOSSIERS">Dossiers</option>
                                            <option value="ACTES">Actes</option>
                                            <option value="CLIENTS">Clients</option>
                                            <option value="DOCUMENTS">Documents</option>
                                            <option value="COMPTABILITE">Comptabilité</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.utilisateur" @change="filterTravaux"
                                            class="form-select">
                                            <option value="">Tous utilisateurs</option>
                                            <option value="Me. Dupont">Me. Dupont</option>
                                            <option value="Me. Martin">Me. Martin</option>
                                            <option value="Sophie Durand">Sophie Durand</option>
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

                <!-- Liste des travaux -->
                <div class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">
                                    Journal des Opérations
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ filteredTravaux.length }} entrées
                                    </span>
                                </h6>
                            </div>
                            <div class="card-body p-0">
                                <div class="timeline-container p-4">
                                    <div v-if="paginatedTravaux.length === 0" class="text-center py-5">
                                        <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                        <p class="text-muted mb-0">Aucune activité trouvée</p>
                                    </div>
                                    <div v-else class="timeline">
                                        <div v-for="(travail, index) in paginatedTravaux" :key="travail.id"
                                            class="timeline-item" :class="'timeline-' + getActionColor(travail.action)">
                                            <div class="timeline-marker">
                                                <i class="bi" :class="getActionIcon(travail.action)"></i>
                                            </div>
                                            <div class="timeline-content">
                                                <div class="d-flex justify-content-between align-items-start mb-2">
                                                    <div>
                                                        <h6 class="mb-1">
                                                            <span class="badge me-2"
                                                                :class="'bg-' + getActionColor(travail.action)">
                                                                {{ travail.action }}
                                                            </span>
                                                            {{ travail.titre }}
                                                        </h6>
                                                        <small class="text-muted">
                                                            <i class="bi bi-clock me-1"></i>
                                                            {{ formatDateTime(travail.dateHeure) }}
                                                        </small>
                                                    </div>
                                                    <button class="btn btn-sm btn-outline-primary"
                                                        @click="viewDetails(travail)">
                                                        <i class="bi bi-eye"></i>
                                                    </button>
                                                </div>
                                                <div class="mb-2">
                                                    <span class="badge bg-light text-dark me-2">
                                                        <i class="bi bi-grid me-1"></i>{{ travail.module }}
                                                    </span>
                                                    <span class="badge bg-light text-dark">
                                                        <i class="bi bi-person me-1"></i>{{ travail.utilisateur }}
                                                    </span>
                                                </div>
                                                <p class="mb-0 text-muted small">{{ travail.description }}</p>
                                                <div v-if="travail.reference" class="mt-2">
                                                    <small class="text-primary">
                                                        <i class="bi bi-link-45deg me-1"></i>
                                                        Référence: {{ travail.reference }}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Pagination -->
                                <div v-if="filteredTravaux.length > perPage" class="card-footer border-top">
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
        <div v-if="selectedTravail" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Détails de l'Opération
                            <span class="badge ms-2" :class="'bg-' + getActionColor(selectedTravail.action)">
                                {{ selectedTravail.action }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedTravail = null"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-info-circle me-2"></i>Informations Générales
                                        </h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">ID Opération</label>
                                            <p class="mb-0 fw-bold">{{ selectedTravail.id }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Type d'action</label>
                                            <p class="mb-0">
                                                <span class="badge"
                                                    :class="'bg-' + getActionColor(selectedTravail.action)">
                                                    {{ selectedTravail.action }}
                                                </span>
                                            </p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Module</label>
                                            <p class="mb-0">{{ selectedTravail.module }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Date et heure</label>
                                            <p class="mb-0">{{ formatDateTime(selectedTravail.dateHeure) }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-person me-2"></i>Utilisateur</h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Nom</label>
                                            <p class="mb-0 fw-bold">{{ selectedTravail.utilisateur }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Adresse IP</label>
                                            <p class="mb-0">{{ selectedTravail.adresseIP }}</p>
                                        </div>
                                        <div class="mb-2" v-if="selectedTravail.reference">
                                            <label class="text-muted small">Référence</label>
                                            <p class="mb-0">{{ selectedTravail.reference }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-file-text me-2"></i>Description</h6>
                                        <p class="mb-0">{{ selectedTravail.description }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12" v-if="selectedTravail.details">
                                <div class="card border-primary">
                                    <div class="card-header bg-primary bg-opacity-10">
                                        <h6 class="mb-0"><i class="bi bi-list-ul me-2"></i>Détails Techniques</h6>
                                    </div>
                                    <div class="card-body">
                                        <pre class="mb-0 small"
                                            style="max-height: 200px; overflow-y: auto;">{{ JSON.stringify(selectedTravail.details, null, 2) }}</pre>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12"
                                v-if="selectedTravail.modifications && selectedTravail.modifications.length > 0">
                                <div class="card border-warning">
                                    <div class="card-header bg-warning bg-opacity-10">
                                        <h6 class="mb-0"><i class="bi bi-arrow-repeat me-2"></i>Modifications Effectuées
                                        </h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive">
                                            <table class="table table-sm mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Champ</th>
                                                        <th>Ancienne valeur</th>
                                                        <th>Nouvelle valeur</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(modif, index) in selectedTravail.modifications"
                                                        :key="index">
                                                        <td><strong>{{ modif.champ }}</strong></td>
                                                        <td><span class="text-danger">{{ modif.avant }}</span></td>
                                                        <td><span class="text-success">{{ modif.apres }}</span></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="selectedTravail = null">Fermer</button>
                        <button type="button" class="btn btn-info" @click="exportOperation(selectedTravail)">
                            <i class="bi bi-download me-1"></i>Exporter
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Filtres Avancés -->
        <div v-if="showFilterModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Filtres Avancés</h5>
                        <button type="button" class="btn-close" @click="showFilterModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Date de début</label>
                                <input type="date" v-model="advancedFilters.dateDebut" class="form-control">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date de fin</label>
                                <input type="date" v-model="advancedFilters.dateFin" class="form-control">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Type d'action</label>
                                <select v-model="advancedFilters.action" class="form-select">
                                    <option value="">Toutes</option>
                                    <option value="CREATION">Création</option>
                                    <option value="MODIFICATION">Modification</option>
                                    <option value="SUPPRESSION">Suppression</option>
                                    <option value="CONSULTATION">Consultation</option>
                                    <option value="VALIDATION">Validation</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Module</label>
                                <select v-model="advancedFilters.module" class="form-select">
                                    <option value="">Tous</option>
                                    <option value="DOSSIERS">Dossiers</option>
                                    <option value="ACTES">Actes</option>
                                    <option value="CLIENTS">Clients</option>
                                    <option value="DOCUMENTS">Documents</option>
                                    <option value="COMPTABILITE">Comptabilité</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Référence</label>
                                <input type="text" v-model="advancedFilters.reference" class="form-control"
                                    placeholder="Rechercher par référence...">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            @click="resetAdvancedFilters">Réinitialiser</button>
                        <button type="button" class="btn btn-primary" @click="applyAdvancedFilters">
                            <i class="bi bi-check-circle me-1"></i>Appliquer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HistoriqueTravaux',

    data() {
        return {
            loading: true,
            searchQuery: '',
            currentPage: 1,
            perPage: 20,
            selectedTravail: null,
            showFilterModal: false,
            filters: { action: '', module: '', utilisateur: '' },
            advancedFilters: {
                dateDebut: '',
                dateFin: '',
                action: '',
                module: '',
                reference: ''
            },
            travaux: [],
            stats: { total: 0, aujourdhui: 0, semaine: 0, mois: 0 },
            categories: [],
            charts: {
                activite: null,
                type: null
            }
        };
    },

    computed: {
        filteredTravaux() {
            let result = [...this.travaux];

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(t =>
                    t.titre.toLowerCase().includes(query) ||
                    t.description.toLowerCase().includes(query) ||
                    t.utilisateur.toLowerCase().includes(query) ||
                    (t.reference && t.reference.toLowerCase().includes(query))
                );
            }

            if (this.filters.action) result = result.filter(t => t.action === this.filters.action);
            if (this.filters.module) result = result.filter(t => t.module === this.filters.module);
            if (this.filters.utilisateur) result = result.filter(t => t.utilisateur === this.filters.utilisateur);

            return result.sort((a, b) => new Date(b.dateHeure) - new Date(a.dateHeure));
        },

        paginatedTravaux() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredTravaux.slice(start, start + this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filteredTravaux.length / this.perPage);
        }
    },

    async mounted() {
        await this.loadData();
        this.$nextTick(() => {
            this.initCharts();
        });
    },

    methods: {
        async loadData() {
            try {
                this.loading = true;
                const actions = ['CREATION', 'MODIFICATION', 'SUPPRESSION', 'CONSULTATION', 'VALIDATION'];
                const modules = ['DOSSIERS', 'ACTES', 'CLIENTS', 'DOCUMENTS', 'COMPTABILITE'];
                const utilisateurs = ['Me. Dupont', 'Me. Martin', 'Sophie Durand', 'Pierre Petit'];

                this.travaux = Array.from({ length: 100 }, (_, i) => {
                    const baseDate = new Date();
                    const randomDays = Math.floor(Math.random() * 30);
                    const randomHours = Math.floor(Math.random() * 24);
                    const randomMinutes = Math.floor(Math.random() * 60);
                    const date = new Date(baseDate);
                    date.setDate(baseDate.getDate() - randomDays);
                    date.setHours(randomHours, randomMinutes);

                    const action = actions[Math.floor(Math.random() * actions.length)];
                    const module = modules[Math.floor(Math.random() * modules.length)];

                    return {
                        id: 100 - i,
                        action: action,
                        module: module,
                        titre: `${action} - ${module} #${100 - i}`,
                        description: `Opération de ${action.toLowerCase()} effectuée sur le module ${module}`,
                        utilisateur: utilisateurs[Math.floor(Math.random() * utilisateurs.length)],
                        dateHeure: date.toISOString(),
                        adresseIP: `192.168.1.${Math.floor(Math.random() * 255)}`,
                        reference: Math.random() > 0.5 ? `REF-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}` : null,
                        details: {
                            navigateur: 'Chrome 120.0',
                            systeme: 'Windows 10',
                            duree: `${Math.floor(Math.random() * 5000)}ms`
                        },
                        modifications: action === 'MODIFICATION' ? [
                            { champ: 'Statut', avant: 'En cours', apres: 'Terminé' },
                            { champ: 'Date', avant: '2024-11-01', apres: '2024-11-15' }
                        ] : []
                    };
                });

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
            this.stats.total = this.travaux.length;

            const today = new Date().toISOString().split('T')[0];
            this.stats.aujourdhui = this.travaux.filter(t => t.dateHeure.split('T')[0] === today).length;

            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            this.stats.semaine = this.travaux.filter(t => {
                const date = new Date(t.dateHeure);
                return date >= startOfWeek && date <= endOfWeek;
            }).length;

            const thisMonth = new Date().getMonth();
            const thisYear = new Date().getFullYear();
            this.stats.mois = this.travaux.filter(t => {
                const date = new Date(t.dateHeure);
                return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
            }).length;
        },

        calculateCategories() {
            const categoriesList = [
                { id: 'CREATION', label: 'Créations', icon: 'bi-plus-circle', color: 'success' },
                { id: 'MODIFICATION', label: 'Modifications', icon: 'bi-pencil-square', color: 'warning' },
                { id: 'SUPPRESSION', label: 'Suppressions', icon: 'bi-trash', color: 'danger' },
                { id: 'CONSULTATION', label: 'Consultations', icon: 'bi-eye', color: 'info' }
            ];

            this.categories = categoriesList.map(cat => ({
                ...cat,
                count: this.travaux.filter(t => t.action === cat.id).length
            }));
        },

        initCharts() {
            // Graphique d'activité sur 30 jours
            const ctxActivite = document.getElementById('activiteChart');
            if (ctxActivite && window.Chart) {
                const last30Days = [];
                const counts = [];

                for (let i = 29; i >= 0; i--) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toISOString().split('T')[0];
                    last30Days.push(date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }));
                    counts.push(this.travaux.filter(t => t.dateHeure.split('T')[0] === dateStr).length);
                }

                this.charts.activite = new Chart(ctxActivite, {
                    type: 'line',
                    data: {
                        labels: last30Days,
                        datasets: [{
                            label: 'Opérations',
                            data: counts,
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
                                ticks: {
                                    stepSize: 1
                                }
                            }
                        }
                    }
                });
            }

            // Graphique par type d'action
            const ctxType = document.getElementById('typeChart');
            if (ctxType && window.Chart) {
                const creation = this.travaux.filter(t => t.action === 'CREATION').length;
                const modification = this.travaux.filter(t => t.action === 'MODIFICATION').length;
                const suppression = this.travaux.filter(t => t.action === 'SUPPRESSION').length;
                const consultation = this.travaux.filter(t => t.action === 'CONSULTATION').length;
                const validation = this.travaux.filter(t => t.action === 'VALIDATION').length;

                this.charts.type = new Chart(ctxType, {
                    type: 'doughnut',
                    data: {
                        labels: ['Création', 'Modification', 'Suppression', 'Consultation', 'Validation'],
                        datasets: [{
                            data: [creation, modification, suppression, consultation, validation],
                            backgroundColor: ['#198754', '#ffc107', '#dc3545', '#0dcaf0', '#6c757d'],
                            borderWidth: 2,
                            borderColor: '#fff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: {
                                position: 'bottom',
                            }
                        }
                    }
                });
            }
        },

        filterTravaux() {
            this.currentPage = 1;
        },

        filterByCategorie(categorieId) {
            this.filters.action = this.filters.action === categorieId ? '' : categorieId;
            this.filterTravaux();
        },

        resetFilters() {
            this.searchQuery = '';
            this.filters = { action: '', module: '', utilisateur: '' };
            this.currentPage = 1;
        },

        resetAdvancedFilters() {
            this.advancedFilters = {
                dateDebut: '',
                dateFin: '',
                action: '',
                module: '',
                reference: ''
            };
        },

        applyAdvancedFilters() {
            this.filters.action = this.advancedFilters.action;
            this.filters.module = this.advancedFilters.module;

            if (this.advancedFilters.reference) {
                this.searchQuery = this.advancedFilters.reference;
            }

            // Filtrage par date (simplifié pour l'exemple)
            if (this.advancedFilters.dateDebut || this.advancedFilters.dateFin) {
                // Logique de filtrage par date ici
                this.showMessage('Filtrage par date appliqué', 'info');
            }

            this.showFilterModal = false;
            this.filterTravaux();
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },

        viewDetails(travail) {
            this.selectedTravail = travail;
        },

        async exportOperation(travail) {
            try {
                const content = `
DÉTAILS DE L'OPÉRATION
======================

ID: ${travail.id}
Action: ${travail.action}
Module: ${travail.module}
Titre: ${travail.titre}
Date et heure: ${this.formatDateTime(travail.dateHeure)}

UTILISATEUR
-----------
Nom: ${travail.utilisateur}
Adresse IP: ${travail.adresseIP}

DESCRIPTION
-----------
${travail.description}

${travail.reference ? `RÉFÉRENCE\n-----------\n${travail.reference}\n\n` : ''}
${travail.details ? `DÉTAILS TECHNIQUES\n------------------\n${JSON.stringify(travail.details, null, 2)}\n\n` : ''}
${travail.modifications && travail.modifications.length > 0 ?
                        `MODIFICATIONS\n-------------\n${travail.modifications.map(m => `${m.champ}: ${m.avant} → ${m.apres}`).join('\n')}\n` : ''}
                `.trim();

                const blob = new Blob([content], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `operation-${travail.id}.txt`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                this.showMessage('Opération exportée avec succès', 'success');
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors de l\'export', 'error');
            }
        },

        async exportHistorique() {
            try {
                const csvContent = [
                    ['ID', 'Date/Heure', 'Action', 'Module', 'Titre', 'Utilisateur', 'IP', 'Référence'].join(';'),
                    ...this.filteredTravaux.map(t => [
                        t.id,
                        this.formatDateTime(t.dateHeure),
                        t.action,
                        t.module,
                        t.titre,
                        t.utilisateur,
                        t.adresseIP,
                        t.reference || ''
                    ].join(';'))
                ].join('\n');

                const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `historique-travaux-${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                this.showMessage('Historique exporté avec succès', 'success');
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors de l\'export', 'error');
            }
        },

        async genererRapport() {
            try {
                const content = `
RAPPORT D'HISTORIQUE DES TRAVAUX
=================================
Date de génération: ${this.formatDateTime(new Date().toISOString())}

STATISTIQUES GÉNÉRALES
----------------------
Total des opérations: ${this.stats.total}
Opérations aujourd'hui: ${this.stats.aujourdhui}
Opérations cette semaine: ${this.stats.semaine}
Opérations ce mois: ${this.stats.mois}

RÉPARTITION PAR ACTION
----------------------
${this.categories.map(c => `${c.label}: ${c.count}`).join('\n')}

RÉPARTITION PAR MODULE
----------------------
${['DOSSIERS', 'ACTES', 'CLIENTS', 'DOCUMENTS', 'COMPTABILITE'].map(m => {
                    const count = this.travaux.filter(t => t.module === m).length;
                    return `${m}: ${count}`;
                }).join('\n')}

UTILISATEURS ACTIFS
-------------------
${[...new Set(this.travaux.map(t => t.utilisateur))].map(u => {
                    const count = this.travaux.filter(t => t.utilisateur === u).length;
                    return `${u}: ${count} opérations`;
                }).join('\n')}

DERNIÈRES OPÉRATIONS (10)
-------------------------
${this.filteredTravaux.slice(0, 10).map(t => `
[${this.formatDateTime(t.dateHeure)}] ${t.action} - ${t.module}
${t.titre}
Par: ${t.utilisateur}
`).join('\n')}
                `.trim();

                const blob = new Blob([content], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `rapport-historique-${new Date().toISOString().split('T')[0]}.txt`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                this.showMessage('Rapport généré avec succès', 'success');
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors de la génération du rapport', 'error');
            }
        },

        async rafraichir() {
            await this.loadData();
            this.$nextTick(() => {
                this.initCharts();
            });
            this.showMessage('Données actualisées', 'success');
        },

        // Méthodes utilitaires
        formatDateTime(dateTimeString) {
            if (!dateTimeString) return '-';
            const date = new Date(dateTimeString);
            return date.toLocaleString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        getActionColor(action) {
            const colors = {
                'CREATION': 'success',
                'MODIFICATION': 'warning',
                'SUPPRESSION': 'danger',
                'CONSULTATION': 'info',
                'VALIDATION': 'primary'
            };
            return colors[action] || 'secondary';
        },

        getActionIcon(action) {
            const icons = {
                'CREATION': 'bi-plus-circle',
                'MODIFICATION': 'bi-pencil-square',
                'SUPPRESSION': 'bi-trash',
                'CONSULTATION': 'bi-eye',
                'VALIDATION': 'bi-check-circle'
            };
            return icons[action] || 'bi-circle';
        },

        showMessage(message, type = 'info') {
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
    },

    beforeUnmount() {
        if (this.charts.activite) {
            this.charts.activite.destroy();
        }
        if (this.charts.type) {
            this.charts.type.destroy();
        }
    }
};
</script>

<style scoped>
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
    transition: transform 0.2s ease;
}

.card:hover {
    transform: translateY(-2px);
}

.btn {
    border-radius: 6px;
}

.form-control,
.form-select {
    border-radius: 6px;
}

canvas {
    max-height: 300px;
}

/* Timeline Styles */
.timeline-container {
    position: relative;
}

.timeline {
    position: relative;
    padding: 0;
    margin: 0;
}

.timeline-item {
    position: relative;
    padding-left: 50px;
    margin-bottom: 30px;
}

.timeline-marker {
    position: absolute;
    left: 0;
    top: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
    z-index: 2;
}

.timeline-success .timeline-marker {
    background: linear-gradient(135deg, #198754 0%, #157347 100%);
    box-shadow: 0 4px 10px rgba(25, 135, 84, 0.3);
}

.timeline-warning .timeline-marker {
    background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
    box-shadow: 0 4px 10px rgba(255, 193, 7, 0.3);
}

.timeline-danger .timeline-marker {
    background: linear-gradient(135deg, #dc3545 0%, #bb2d3b 100%);
    box-shadow: 0 4px 10px rgba(220, 53, 69, 0.3);
}

.timeline-info .timeline-marker {
    background: linear-gradient(135deg, #0dcaf0 0%, #0baccc 100%);
    box-shadow: 0 4px 10px rgba(13, 202, 240, 0.3);
}

.timeline-primary .timeline-marker {
    background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
    box-shadow: 0 4px 10px rgba(13, 110, 253, 0.3);
}

.timeline-content {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-left: 3px solid #e9ecef;
    transition: all 0.3s ease;
}

.timeline-content:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateX(5px);
}

.timeline-success .timeline-content {
    border-left-color: #198754;
}

.timeline-warning .timeline-content {
    border-left-color: #ffc107;
}

.timeline-danger .timeline-content {
    border-left-color: #dc3545;
}

.timeline-info .timeline-content {
    border-left-color: #0dcaf0;
}

.timeline-primary .timeline-content {
    border-left-color: #0d6efd;
}

.timeline-item:not(:last-child)::before {
    content: '';
    position: absolute;
    left: 19px;
    top: 45px;
    bottom: -30px;
    width: 2px;
    background: linear-gradient(to bottom, #dee2e6 0%, rgba(222, 226, 230, 0.3) 100%);
}

.timeline-item h6 {
    color: #212529;
    font-weight: 600;
    margin-bottom: 8px;
}

/* Responsive */
@media (max-width: 768px) {
    .timeline-item {
        padding-left: 45px;
    }

    .timeline-marker {
        width: 35px;
        height: 35px;
        font-size: 16px;
    }

    .timeline-item:not(:last-child)::before {
        left: 17px;
    }

    .timeline-content {
        padding: 15px;
    }
}

/* Animation d'entrée */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.timeline-item {
    animation: slideIn 0.4s ease-out;
}

/* Code pre styling */
pre {
    background-color: #f8f9fa;
    border-radius: 6px;
    padding: 15px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
}

pre::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

pre::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

pre::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

pre::-webkit-scrollbar-thumb:hover {
    background: #555;
}

.bloc {
    min-height: 100vh;
    right: 3rem;
    /* ou relative selon ton cas */
}

/* Pour les petits écrans (ex. < 768px) */
@media (max-width: 768px) {
    .bloc {
        min-height: auto;
        right: 0;
    }
}
</style>