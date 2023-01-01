<template>
    <main>
        <section class="pt-0">
            <div class="container-fluid vstack gap-4">
                <!-- En-tête avec navigation -->
                <div class="row">
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h1 class="fs-3 mb-1">
                                    <i class="bi bi-clock-history fa-fw me-2"></i>Historique Locatif
                                </h1>
                                <p class="text-muted mb-0">Consultez l'historique complet de vos locations</p>
                            </div>
                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-primary" @click="exporterHistorique">
                                    <i class="bi bi-download me-1"></i>
                                    Exporter
                                </button>
                                <button class="btn btn-primary" @click="showFilterPanel = !showFilterPanel">
                                    <i class="bi bi-funnel me-1"></i>
                                    Filtres
                                    <span class="badge bg-white text-primary ms-1" v-if="activeFiltersCount > 0">
                                        {{ activeFiltersCount }}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Panneau de filtres avancés -->
                <div class="row" v-if="showFilterPanel">
                    <div class="col-12">
                        <div class="card border-primary">
                            <div class="card-header bg-primary bg-opacity-10">
                                <h6 class="mb-0 text-primary">
                                    <i class="bi bi-sliders me-2"></i>Filtres Avancés
                                </h6>
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div class="col-md-3">
                                        <label class="form-label small fw-bold">Période</label>
                                        <select class="form-select" v-model="filters.periode" @change="applyFilters">
                                            <option value="">Toutes les périodes</option>
                                            <option value="mois">Ce mois</option>
                                            <option value="trimestre">Ce trimestre</option>
                                            <option value="semestre">Ce semestre</option>
                                            <option value="annee">Cette année</option>
                                            <option value="personnalise">Période personnalisée</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3" v-if="filters.periode === 'personnalise'">
                                        <label class="form-label small fw-bold">Date début</label>
                                        <input type="date" class="form-control" v-model="filters.dateDebut" />
                                    </div>
                                    <div class="col-md-3" v-if="filters.periode === 'personnalise'">
                                        <label class="form-label small fw-bold">Date fin</label>
                                        <input type="date" class="form-control" v-model="filters.dateFin" />
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label small fw-bold">Locataire</label>
                                        <select class="form-select" v-model="filters.locataireId" @change="applyFilters">
                                            <option value="">Tous les locataires</option>
                                            <option v-for="loc in locataires" :key="loc.id" :value="loc.id">
                                                {{ loc.nom }} {{ loc.prenom }}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label small fw-bold">Bien immobilier</label>
                                        <select class="form-select" v-model="filters.bienId" @change="applyFilters">
                                            <option value="">Tous les biens</option>
                                            <option v-for="bien in biens" :key="bien.id" :value="bien.id">
                                                {{ bien.nom }}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label small fw-bold">Type d'événement</label>
                                        <select class="form-select" v-model="filters.typeEvenement" @change="applyFilters">
                                            <option value="">Tous les types</option>
                                            <option value="entree">Entrée</option>
                                            <option value="sortie">Sortie</option>
                                            <option value="paiement">Paiement</option>
                                            <option value="incident">Incident</option>
                                            <option value="travaux">Travaux</option>
                                            <option value="visite">Visite</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label small fw-bold">Statut</label>
                                        <select class="form-select" v-model="filters.statut" @change="applyFilters">
                                            <option value="">Tous les statuts</option>
                                            <option value="termine">Terminé</option>
                                            <option value="en_cours">En cours</option>
                                            <option value="en_attente">En attente</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3 d-flex align-items-end">
                                        <button class="btn btn-outline-danger w-100" @click="resetFilters">
                                            <i class="bi bi-x-circle me-1"></i>
                                            Réinitialiser
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Vue principale avec sidebar -->
                <div class="row">
                    <!-- Sidebar gauche - Timeline -->
                    <div class="col-lg-3">
                        <div class="card border sticky-top" style="top: 20px;">
                            <div class="card-header">
                                <h6 class="mb-0">
                                    <i class="bi bi-calendar3 me-2"></i>Navigation Temporelle
                                </h6>
                            </div>
                            <div class="card-body p-3">
                                <div class="list-group list-group-flush">
                                    <a
                                        href="#"
                                        class="list-group-item list-group-item-action border-0 px-2 py-2"
                                        :class="{ active: selectedYear === year }"
                                        v-for="year in annees"
                                        :key="year"
                                        @click.prevent="selectYear(year)"
                                    >
                                        <div class="d-flex justify-content-between align-items-center">
                                            <span class="fw-bold">{{ year }}</span>
                                            <span class="badge bg-primary rounded-pill">
                                                {{ getEventsByYear(year).length }}
                                            </span>
                                        </div>
                                    </a>
                                </div>

                                <hr class="my-3" />

                                <div class="mb-2">
                                    <h6 class="small text-muted mb-2">STATISTIQUES</h6>
                                    <div class="d-flex justify-content-between mb-2">
                                        <small class="text-muted">Total événements</small>
                                        <strong>{{ historiqueTotal.length }}</strong>
                                    </div>
                                    <div class="d-flex justify-content-between mb-2">
                                        <small class="text-muted">Locations actives</small>
                                        <strong class="text-success">{{ statsGlobales.locationsActives }}</strong>
                                    </div>
                                    <div class="d-flex justify-content-between mb-2">
                                        <small class="text-muted">Locations terminées</small>
                                        <strong class="text-muted">{{ statsGlobales.locationsTerminees }}</strong>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <small class="text-muted">Revenus totaux</small>
                                        <strong class="text-primary">
                                            {{ formatCurrency(statsGlobales.revenusTotal) }}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contenu principal - Timeline des événements -->
                    <div class="col-lg-9">
                        <!-- Barre de recherche rapide -->
                        <div class="card border mb-3">
                            <div class="card-body py-2">
                                <div class="input-group">
                                    <span class="input-group-text bg-white border-0">
                                        <i class="bi bi-search"></i>
                                    </span>
                                    <input
                                        type="text"
                                        class="form-control border-0"
                                        placeholder="Rechercher dans l'historique..."
                                        v-model="searchQuery"
                                        @input="quickSearch"
                                    />
                                    <select class="form-select border-0" style="max-width: 150px;" v-model="sortOrder">
                                        <option value="desc">Plus récent</option>
                                        <option value="asc">Plus ancien</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Timeline des événements -->
                        <div v-if="loading" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Chargement...</span>
                            </div>
                        </div>

                        <div v-else-if="filteredHistorique.length === 0" class="card border text-center py-5">
                            <i class="bi bi-inbox text-muted" style="font-size: 4rem;"></i>
                            <h5 class="mt-3 text-muted">Aucun événement trouvé</h5>
                            <p class="text-muted">Essayez de modifier vos filtres de recherche</p>
                        </div>

                        <div v-else class="timeline">
                            <div
                                v-for="(groupe, mois) in groupedHistorique"
                                :key="mois"
                                class="timeline-group mb-4"
                            >
                                <!-- Séparateur de mois -->
                                <div class="timeline-month-header sticky-top bg-white py-2 mb-3" style="top: 0; z-index: 10;">
                                    <h5 class="mb-0 text-primary">
                                        <i class="bi bi-calendar-month me-2"></i>
                                        {{ formatMois(mois) }}
                                    </h5>
                                    <hr class="mt-2 mb-0" />
                                </div>

                                <!-- Événements du mois -->
                                <div
                                    v-for="event in groupe"
                                    :key="event.id"
                                    class="timeline-item mb-3"
                                >
                                    <div class="card border-start border-4" :class="getBorderColorClass(event.type)">
                                        <div class="card-body">
                                            <div class="row">
                                                <!-- Icône et date -->
                                                <div class="col-auto">
                                                    <div
                                                        class="timeline-icon rounded-circle d-flex align-items-center justify-content-center"
                                                        :class="getIconBgClass(event.type)"
                                                    >
                                                        <i class="bi fs-5" :class="getEventIcon(event.type)"></i>
                                                    </div>
                                                </div>

                                                <!-- Contenu -->
                                                <div class="col">
                                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                                        <div>
                                                            <h6 class="mb-1">{{ event.titre }}</h6>
                                                            <div class="d-flex gap-2 align-items-center">
                                                                <small class="text-muted">
                                                                    <i class="bi bi-clock me-1"></i>
                                                                    {{ formatDateHeure(event.date) }}
                                                                </small>
                                                                <span
                                                                    class="badge"
                                                                    :class="getTypeBadgeClass(event.type)"
                                                                >
                                                                    {{ getTypeLabel(event.type) }}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="d-flex gap-1">
                                                            <button
                                                                class="btn btn-sm btn-light"
                                                                @click="viewEventDetails(event)"
                                                            >
                                                                <i class="bi bi-eye"></i>
                                                            </button>
                                                            <button
                                                                class="btn btn-sm btn-light"
                                                                @click="downloadEventDoc(event)"
                                                                v-if="event.hasDocument"
                                                            >
                                                                <i class="bi bi-file-earmark-arrow-down"></i>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <!-- Informations principales -->
                                                    <div class="mb-2">
                                                        <div class="row g-2">
                                                            <div class="col-md-6" v-if="event.locataire">
                                                                <small class="text-muted d-block">Locataire</small>
                                                                <div class="d-flex align-items-center">
                                                                    <i class="bi bi-person-circle me-1"></i>
                                                                    <strong class="small">{{ event.locataire }}</strong>
                                                                </div>
                                                            </div>
                                                            <div class="col-md-6" v-if="event.bien">
                                                                <small class="text-muted d-block">Bien</small>
                                                                <div class="d-flex align-items-center">
                                                                    <i class="bi bi-house me-1"></i>
                                                                    <strong class="small">{{ event.bien }}</strong>
                                                                </div>
                                                            </div>
                                                            <div class="col-md-6" v-if="event.montant">
                                                                <small class="text-muted d-block">Montant</small>
                                                                <div class="d-flex align-items-center">
                                                                    <i class="bi bi-currency-dollar me-1"></i>
                                                                    <strong class="small text-success">
                                                                        {{ formatCurrency(event.montant) }}
                                                                    </strong>
                                                                </div>
                                                            </div>
                                                            <div class="col-md-6" v-if="event.statut">
                                                                <small class="text-muted d-block">Statut</small>
                                                                <span
                                                                    class="badge small"
                                                                    :class="getStatutBadgeClass(event.statut)"
                                                                >
                                                                    {{ event.statut }}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <!-- Description -->
                                                    <p class="mb-0 small text-muted" v-if="event.description">
                                                        {{ event.description }}
                                                    </p>

                                                    <!-- Actions rapides -->
                                                    <div class="mt-2" v-if="event.actions && event.actions.length > 0">
                                                        <div class="d-flex gap-2">
                                                            <button
                                                                v-for="action in event.actions"
                                                                :key="action.label"
                                                                class="btn btn-sm btn-outline-primary"
                                                                @click="executeAction(action, event)"
                                                            >
                                                                <i class="bi me-1" :class="action.icon"></i>
                                                                {{ action.label }}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Pagination -->
                        <div class="d-flex justify-content-center mt-4" v-if="totalPages > 1">
                            <nav>
                                <ul class="pagination">
                                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                        <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                                            <i class="bi bi-chevron-left"></i>
                                        </a>
                                    </li>
                                    <li
                                        class="page-item"
                                        v-for="page in visiblePages"
                                        :key="page"
                                        :class="{ active: currentPage === page }"
                                    >
                                        <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                                    </li>
                                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                        <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                                            <i class="bi bi-chevron-right"></i>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Modal Détails Événement -->
        <div v-if="showDetailModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header" :class="getHeaderBgClass(selectedEvent.type)">
                        <h5 class="modal-title">
                            <i class="bi me-2" :class="getEventIcon(selectedEvent.type)"></i>
                            Détails de l'événement
                        </h5>
                        <button type="button" class="btn-close" @click="showDetailModal = false"></button>
                    </div>
                    <div class="modal-body" v-if="selectedEvent">
                        <div class="row g-3">
                            <div class="col-12">
                                <h6>{{ selectedEvent.titre }}</h6>
                                <p class="text-muted mb-3">{{ selectedEvent.description }}</p>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold small">Date et heure</label>
                                <p>{{ formatDateHeure(selectedEvent.date) }}</p>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold small">Type</label>
                                <p>
                                    <span class="badge" :class="getTypeBadgeClass(selectedEvent.type)">
                                        {{ getTypeLabel(selectedEvent.type) }}
                                    </span>
                                </p>
                            </div>
                            <div class="col-md-6" v-if="selectedEvent.locataire">
                                <label class="form-label fw-bold small">Locataire</label>
                                <p>{{ selectedEvent.locataire }}</p>
                            </div>
                            <div class="col-md-6" v-if="selectedEvent.bien">
                                <label class="form-label fw-bold small">Bien immobilier</label>
                                <p>{{ selectedEvent.bien }}</p>
                            </div>
                            <div class="col-md-6" v-if="selectedEvent.montant">
                                <label class="form-label fw-bold small">Montant</label>
                                <p class="text-success fs-5 mb-0">{{ formatCurrency(selectedEvent.montant) }}</p>
                            </div>
                            <div class="col-md-6" v-if="selectedEvent.statut">
                                <label class="form-label fw-bold small">Statut</label>
                                <p>
                                    <span class="badge" :class="getStatutBadgeClass(selectedEvent.statut)">
                                        {{ selectedEvent.statut }}
                                    </span>
                                </p>
                            </div>
                            <div class="col-12" v-if="selectedEvent.notes">
                                <label class="form-label fw-bold small">Notes additionnelles</label>
                                <p class="small">{{ selectedEvent.notes }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="showDetailModal = false">Fermer</button>
                        <button class="btn btn-primary" v-if="selectedEvent.hasDocument">
                            <i class="bi bi-download me-1"></i>
                            Télécharger le document
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

export default {
    name: 'HistoriqueLocatif',
    setup() {
        const store = useStore();
        const loading = ref(false);
        const showFilterPanel = ref(false);
        const showDetailModal = ref(false);
        const selectedEvent = ref(null);
        const searchQuery = ref('');
        const sortOrder = ref('desc');
        const selectedYear = ref(new Date().getFullYear());
        const currentPage = ref(1);
        const perPage = 20;

        const historiqueTotal = ref([]);
        const locataires = ref([]);
        const biens = ref([]);

        const filters = ref({
            periode: '',
            dateDebut: '',
            dateFin: '',
            locataireId: '',
            bienId: '',
            typeEvenement: '',
            statut: '',
        });

        // Computed
        const activeFiltersCount = computed(() => {
            return Object.values(filters.value).filter((v) => v !== '').length;
        });

        const annees = computed(() => {
            const years = [...new Set(historiqueTotal.value.map((h) => new Date(h.date).getFullYear()))];
            return years.sort((a, b) => b - a);
        });

        const statsGlobales = computed(() => {
            const actives = historiqueTotal.value.filter((h) => h.type === 'entree' && h.statut === 'en_cours').length;
            const terminees = historiqueTotal.value.filter((h) => h.type === 'sortie').length;
            const revenus = historiqueTotal.value
                .filter((h) => h.type === 'paiement')
                .reduce((sum, h) => sum + (h.montant || 0), 0);

            return {
                locationsActives: actives,
                locationsTerminees: terminees,
                revenusTotal: revenus,
            };
        });

        const filteredHistorique = computed(() => {
            let result = [...historiqueTotal.value];

            // Filtre par recherche
            if (searchQuery.value) {
                const query = searchQuery.value.toLowerCase();
                result = result.filter(
                    (h) =>
                        h.titre?.toLowerCase().includes(query) ||
                        h.description?.toLowerCase().includes(query) ||
                        h.locataire?.toLowerCase().includes(query) ||
                        h.bien?.toLowerCase().includes(query)
                );
            }

            // Filtres avancés
            if (filters.value.locataireId) {
                result = result.filter((h) => h.locataireId === filters.value.locataireId);
            }
            if (filters.value.bienId) {
                result = result.filter((h) => h.bienId === filters.value.bienId);
            }
            if (filters.value.typeEvenement) {
                result = result.filter((h) => h.type === filters.value.typeEvenement);
            }
            if (filters.value.statut) {
                result = result.filter((h) => h.statut === filters.value.statut);
            }

            // Filtre par année sélectionnée
            if (selectedYear.value) {
                result = result.filter((h) => new Date(h.date).getFullYear() === selectedYear.value);
            }

            // Tri
            result.sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return sortOrder.value === 'desc' ? dateB - dateA : dateA - dateB;
            });

            return result;
        });

        const groupedHistorique = computed(() => {
            const grouped = {};
            const start = (currentPage.value - 1) * perPage;
            const end = start + perPage;
            const paginated = filteredHistorique.value.slice(start, end);

            paginated.forEach((event) => {
                const date = new Date(event.date);
                const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (!grouped[key]) {
                    grouped[key] = [];
                }
                grouped[key].push(event);
            });

            return grouped;
        });

        const totalPages = computed(() => {
            return Math.ceil(filteredHistorique.value.length / perPage);
        });

        const visiblePages = computed(() => {
            const pages = [];
            const maxVisible = 5;
            let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
            let end = Math.min(totalPages.value, start + maxVisible - 1);

            if (end - start < maxVisible - 1) {
                start = Math.max(1, end - maxVisible + 1);
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            return pages;
        });

        // Methods
        const formatCurrency = (amount) => {
            if (amount == null) return '—';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0,
            }).format(amount);
        };

        const formatDateHeure = (dateString) => {
            if (!dateString) return '—';
            const date = new Date(dateString);
            return date.toLocaleString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        };

        const formatMois = (moisKey) => {
            const [year, month] = moisKey.split('-');
            const date = new Date(year, parseInt(month) - 1);
            return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        };

        const getEventIcon = (type) => {
            const icons = {
                entree: 'bi-box-arrow-in-right',
                sortie: 'bi-box-arrow-left',
                paiement: 'bi-cash-coin',
                incident: 'bi-exclamation-triangle',
                travaux: 'bi-tools',
                visite: 'bi-eye',
            };
            return icons[type] || 'bi-circle';
        };

        const getIconBgClass = (type) => {
            const classes = {
                entree: 'bg-success bg-opacity-10 text-success',
                sortie: 'bg-danger bg-opacity-10 text-danger',
                paiement: 'bg-primary bg-opacity-10 text-primary',
                incident: 'bg-warning bg-opacity-10 text-warning',
                travaux: 'bg-info bg-opacity-10 text-info',
                visite: 'bg-secondary bg-opacity-10 text-secondary',
            };
            return classes[type] || 'bg-secondary bg-opacity-10 text-secondary';
        };

        const getBorderColorClass = (type) => {
            const classes = {
                entree: 'border-success',
                sortie: 'border-danger',
                paiement: 'border-primary',
                incident: 'border-warning',
                travaux: 'border-info',
                visite: 'border-secondary',
            };
            return classes[type] || 'border-secondary';
        };

        const getTypeBadgeClass = (type) => {
            const classes = {
                entree: 'bg-success',
                sortie: 'bg-danger',
                paiement: 'bg-primary',
                incident: 'bg-warning',
                travaux: 'bg-info',
                visite: 'bg-secondary',
            };
            return classes[type] || 'bg-secondary';
        };

        const getTypeLabel = (type) => {
            const labels = {
                entree: 'Entrée',
                sortie: 'Sortie',
                paiement: 'Paiement',
                incident: 'Incident',
                travaux: 'Travaux',
                visite: 'Visite',
            };
            return labels[type] || type;
        };

        const getStatutBadgeClass = (statut) => {
            const classes = {
                termine: 'bg-secondary',
                en_cours: 'bg-success',
                en_attente: 'bg-warning',
            };
            return classes[statut] || 'bg-secondary';
        };

        const getHeaderBgClass = (type) => {
            const classes = {
                entree: 'bg-success bg-opacity-10',
                sortie: 'bg-danger bg-opacity-10',
                paiement: 'bg-primary bg-opacity-10',
                incident: 'bg-warning bg-opacity-10',
                travaux: 'bg-info bg-opacity-10',
                visite: 'bg-secondary bg-opacity-10',
            };
            return classes[type] || 'bg-light';
        };

        const getEventsByYear = (year) => {
            return historiqueTotal.value.filter((h) => new Date(h.date).getFullYear() === year);
        };

        const selectYear = (year) => {
            selectedYear.value = year;
            currentPage.value = 1;
        };

        const quickSearch = () => {
            currentPage.value = 1;
        };

        const applyFilters = () => {
            currentPage.value = 1;
        };

        const resetFilters = () => {
            filters.value = {
                periode: '',
                dateDebut: '',
                dateFin: '',
                locataireId: '',
                bienId: '',
                typeEvenement: '',
                statut: '',
            };
            searchQuery.value = '';
            currentPage.value = 1;
        };

        const changePage = (page) => {
            if (page >= 1 && page <= totalPages.value) {
                currentPage.value = page;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        const viewEventDetails = (event) => {
            selectedEvent.value = event;
            showDetailModal.value = true;
        };

        const downloadEventDoc = async (event) => {
            try {
                await store.dispatch('historique/downloadDocument', event.id);
                ElMessage.success('Téléchargement en cours...');
            } catch (error) {
                console.error('Erreur téléchargement:', error);
                ElMessage.error('Erreur lors du téléchargement');
            }
        };

        const executeAction = async (action, event) => {
            try {
                await store.dispatch(action.dispatch, { eventId: event.id, ...action.params });
                ElMessage.success(action.successMessage || 'Action effectuée avec succès');
                await loadHistorique();
            } catch (error) {
                console.error('Erreur action:', error);
                ElMessage.error('Erreur lors de l\'exécution de l\'action');
            }
        };

        const exporterHistorique = async () => {
            try {
                await store.dispatch('historique/export', {
                    filters: filters.value,
                    year: selectedYear.value,
                });
                ElMessage.success('Export en cours...');
            } catch (error) {
                console.error('Erreur export:', error);
                ElMessage.error('Erreur lors de l\'export');
            }
        };

        const loadHistorique = async () => {
            loading.value = true;
            try {
                const response = await store.dispatch('historique/getAll');
                historiqueTotal.value = response || [];
            } catch (error) {
                console.error('Erreur chargement historique:', error);
                ElMessage.error('Erreur lors du chargement de l\'historique');
                historiqueTotal.value = [];
            } finally {
                loading.value = false;
            }
        };

        const loadLocataires = async () => {
            try {
                const response = await store.dispatch('locataires/getAll');
                locataires.value = response || [];
            } catch (error) {
                console.error('Erreur chargement locataires:', error);
            }
        };

        const loadBiens = async () => {
            try {
                const response = await store.dispatch('biensImmobiliers/getAll');
                biens.value = response || [];
            } catch (error) {
                console.error('Erreur chargement biens:', error);
            }
        };

        // Lifecycle
        onMounted(async () => {
            await Promise.all([loadHistorique(), loadLocataires(), loadBiens()]);
        });

        return {
            loading,
            showFilterPanel,
            showDetailModal,
            selectedEvent,
            searchQuery,
            sortOrder,
            selectedYear,
            currentPage,
            historiqueTotal,
            locataires,
            biens,
            filters,
            activeFiltersCount,
            annees,
            statsGlobales,
            filteredHistorique,
            groupedHistorique,
            totalPages,
            visiblePages,
            formatCurrency,
            formatDateHeure,
            formatMois,
            getEventIcon,
            getIconBgClass,
            getBorderColorClass,
            getTypeBadgeClass,
            getTypeLabel,
            getStatutBadgeClass,
            getHeaderBgClass,
            getEventsByYear,
            selectYear,
            quickSearch,
            applyFilters,
            resetFilters,
            changePage,
            viewEventDetails,
            downloadEventDoc,
            executeAction,
            exporterHistorique,
        };
    },
};
</script>

<style scoped>
.timeline {
    position: relative;
}

.timeline-icon {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
}

.timeline-month-header {
    backdrop-filter: blur(10px);
}

.card-header {
    background-color: #f8f9fa;
}

.sticky-top {
    position: sticky;
}

.list-group-item.active {
    background-color: #0d6efd;
    border-color: #0d6efd;
    color: white;
}

.modal.show {
    display: block;
}

.pagination {
    margin: 0;
}

.page-link {
    color: #0d6efd;
}

.page-item.active .page-link {
    background-color: #0d6efd;
    border-color: #0d6efd;
}

.input-group .form-control:focus,
.input-group .form-select:focus {
    box-shadow: none;
}

.badge {
    font-weight: 500;
}

.card-body {
    transition: all 0.2s ease;
}

.card:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.timeline-item {
    animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.border-4 {
    border-width: 4px !important;
}

@media (max-width: 991.98px) {
    .col-lg-3 .sticky-top {
        position: relative !important;
        top: 0 !important;
    }
}
</style>