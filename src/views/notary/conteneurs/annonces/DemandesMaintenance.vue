<template>
    <main>
        <section class="pt-0">
            <div class="container vstack gap-4">
                <!-- Title -->
                <div class="row">
                    <div class="col-12">
                        <h1 class="fs-4 mb-0">
                            <i class="bi bi-tools fa-fw me-1"></i>Demandes de Maintenance
                        </h1>
                        <p class="text-muted mb-0">Gestion des interventions et réparations</p>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="row g-4">
                    <!-- En Attente -->
                    <div class="col-md-6 col-xl-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">En Attente</h6>
                                    <h2 class="mb-0 text-warning">{{ stats.enAttente }}</h2>
                                    <p class="mb-0 small text-muted mt-2">
                                        <i class="bi bi-clock me-1"></i>À traiter
                                    </p>
                                </div>
                                <div class="bg-warning bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-exclamation-triangle fs-4 text-warning"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- En Cours -->
                    <div class="col-md-6 col-xl-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">En Cours</h6>
                                    <h2 class="mb-0 text-primary">{{ stats.enCours }}</h2>
                                    <p class="mb-0 small text-muted mt-2">
                                        <i class="bi bi-arrow-repeat me-1"></i>En traitement
                                    </p>
                                </div>
                                <div class="bg-primary bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-gear fs-4 text-primary"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Terminées -->
                    <div class="col-md-6 col-xl-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">Terminées</h6>
                                    <h2 class="mb-0 text-success">{{ stats.termine }}</h2>
                                    <p class="mb-0 small text-muted mt-2">
                                        <i class="bi bi-check-circle me-1"></i>Complétées
                                    </p>
                                </div>
                                <div class="bg-success bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-check-circle fs-4 text-success"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Coût Total -->
                    <div class="col-md-6 col-xl-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">Coût Total</h6>
                                    <h2 class="mb-0 text-dark">{{ formatCurrency(stats.coutTotal) }}</h2>
                                    <p class="mb-0 small mt-2" :class="stats.ecartBudgetaire >= 0 ? 'text-danger' : 'text-success'">
                                        <i class="bi bi-graph-up me-1"></i>
                                        Écart: {{ formatCurrency(Math.abs(stats.ecartBudgetaire)) }}
                                    </p>
                                </div>
                                <div class="bg-info bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-cash-stack fs-4 text-info"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filters and Actions -->
                <div class="row">
                    <div class="col-12">
                        <div class="card border">
                            <div class="card-body">
                                <div class="row g-3">
                                    <!-- Recherche globale -->
                                    <div class="col-md-4">
                                        <div class="position-relative">
                                            <input type="text" class="form-control"
                                                placeholder="Rechercher une intervention..."
                                                v-model="searchQuery"
                                                @input="filterInterventions">
                                            <i class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>

                                    <!-- Filtre Statut -->
                                    <div class="col-md-2">
                                        <select v-model="filters.statut" @change="filterInterventions" class="form-select">
                                            <option value="">Tous les statuts</option>
                                            <option value="EN_ATTENTE">En attente</option>
                                            <option value="EN_COURS">En cours</option>
                                            <option value="TERMINE">Terminé</option>
                                        </select>
                                    </div>

                                    <!-- Filtre Priorité -->
                                    <div class="col-md-2">
                                        <select v-model="filters.priorite" @change="filterInterventions" class="form-select">
                                            <option value="">Toutes priorités</option>
                                            <option value="HAUTE">Haute</option>
                                            <option value="MOYENNE">Moyenne</option>
                                            <option value="BASSE">Basse</option>
                                        </select>
                                    </div>

                                    <!-- Filtre Type -->
                                    <div class="col-md-2">
                                        <select v-model="filters.typeIntervention" @change="filterInterventions" class="form-select">
                                            <option value="">Tous les types</option>
                                            <option value="Plomberie">Plomberie</option>
                                            <option value="Électricité">Électricité</option>
                                            <option value="Climatisation">Climatisation</option>
                                            <option value="Peinture">Peinture</option>
                                            <option value="Menuiserie">Menuiserie</option>
                                        </select>
                                    </div>

                                    <!-- Bouton Réinitialiser -->
                                    <div class="col-md-2">
                                        <button class="btn btn-secondary w-100" @click="resetFilters">
                                            <i class="bi bi-arrow-counterclockwise me-1"></i>Réinitialiser
                                        </button>
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="d-flex gap-2 mt-3">
                                    <button class="btn btn-primary" @click="showCreateModal = true">
                                        <i class="bi bi-plus-circle me-1"></i>Nouvelle demande
                                    </button>
                                    <button class="btn btn-info" @click="exportInterventions">
                                        <i class="bi bi-download me-1"></i>Exporter
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Interventions Table -->
                <div class="row">
                    <div class="col-12">
                        <div class="card border">
                            <div class="card-header border-bottom">
                                <h5 class="card-header-title">
                                    Liste des Interventions
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ filteredInterventions.length }} interventions
                                    </span>
                                </h5>
                            </div>

                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover align-middle mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th class="px-4">Type</th>
                                                <th>Bien</th>
                                                <th>Date signalement</th>
                                                <th>Priorité</th>
                                                <th>Coût estimé</th>
                                                <th>Statut</th>
                                                <th class="text-end px-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="loading">
                                                <td colspan="7" class="text-center py-5">
                                                    <div class="spinner-border text-primary" role="status">
                                                        <span class="visually-hidden">Chargement...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr v-else-if="paginatedInterventions.length === 0">
                                                <td colspan="7" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucune intervention trouvée</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="intervention in paginatedInterventions" :key="intervention.id">
                                                <td class="px-4">
                                                    <div>
                                                        <strong class="text-dark">{{ intervention.typeIntervention }}</strong>
                                                        <small class="text-muted d-block text-truncate" style="max-width: 200px;">
                                                            {{ intervention.description }}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <strong>{{ intervention.biensImmobilers?.nom || 'N/A' }}</strong>
                                                        <small class="text-muted d-block">
                                                            <i class="bi bi-geo-alt me-1"></i>{{ intervention.biensImmobilers?.adresse || 'N/A' }}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="badge bg-light text-dark">
                                                        {{ formatDate(intervention.dateSignalement) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getPrioriteBadgeClass(intervention.priorite)">
                                                        <i class="bi" :class="getPrioriteIcon(intervention.priorite)"></i>
                                                        {{ intervention.priorite }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div>
                                                        <strong>{{ formatCurrency(intervention.estimationCout) }}</strong>
                                                        <small v-if="intervention.coutReel" class="text-muted d-block">
                                                            Réel: {{ formatCurrency(intervention.coutReel) }}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getStatusBadgeClass(intervention.statut)">
                                                        <i class="bi" :class="getStatusIcon(intervention.statut)"></i>
                                                        {{ getStatusLabel(intervention.statut) }}
                                                    </span>
                                                </td>
                                                <td class="text-end px-4">
                                                    <div class="dropdown">
                                                        <button class="btn btn-sm btn-light" type="button"
                                                            :id="'dropdown-' + intervention.id" data-bs-toggle="dropdown">
                                                            <i class="bi bi-three-dots-vertical"></i>
                                                        </button>
                                                        <ul class="dropdown-menu dropdown-menu-end">
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="viewIntervention(intervention)">
                                                                    <i class="bi bi-eye me-2"></i>Voir détails
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="editIntervention(intervention)">
                                                                    <i class="bi bi-pencil me-2"></i>Modifier
                                                                </a>
                                                            </li>
                                                            <li v-if="intervention.statut === 'EN_ATTENTE'">
                                                                <a class="dropdown-item text-primary" href="#"
                                                                    @click.prevent="startIntervention(intervention.id)">
                                                                    <i class="bi bi-play-circle me-2"></i>Démarrer
                                                                </a>
                                                            </li>
                                                            <li v-if="intervention.statut === 'EN_COURS'">
                                                                <a class="dropdown-item text-success" href="#"
                                                                    @click.prevent="completeIntervention(intervention.id)">
                                                                    <i class="bi bi-check-circle me-2"></i>Terminer
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <hr class="dropdown-divider">
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item text-danger" href="#"
                                                                    @click.prevent="deleteIntervention(intervention.id)">
                                                                    <i class="bi bi-trash me-2"></i>Supprimer
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
                                <div v-if="filteredInterventions.length > perPage" class="card-footer border-top">
                                    <nav>
                                        <ul class="pagination justify-content-center mb-0">
                                            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                                <a class="page-link" href="#" @click.prevent="currentPage--">Précédent</a>
                                            </li>
                                            <li v-for="page in totalPages" :key="page" class="page-item"
                                                :class="{ active: currentPage === page }">
                                                <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
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
        </section>

        <!-- Modal Détails Intervention -->
        <div v-if="selectedIntervention" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Détails de l'intervention #{{ selectedIntervention.id }}
                            <span class="badge ms-2" :class="getStatusBadgeClass(selectedIntervention.statut)">
                                {{ getStatusLabel(selectedIntervention.statut) }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedIntervention = null"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-4">
                            <!-- Informations Générales -->
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-info-circle me-2"></i>Informations Générales
                                        </h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Type d'intervention</label>
                                            <p class="mb-0 fw-bold">{{ selectedIntervention.typeIntervention }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Description</label>
                                            <p class="mb-0">{{ selectedIntervention.description }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Priorité</label>
                                            <p class="mb-0">
                                                <span class="badge" :class="getPrioriteBadgeClass(selectedIntervention.priorite)">
                                                    {{ selectedIntervention.priorite }}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Informations Bien -->
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-building me-2"></i>Bien Concerné
                                        </h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Nom du bien</label>
                                            <p class="mb-0 fw-bold">{{ selectedIntervention.biensImmobilers?.nom || 'N/A' }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Adresse</label>
                                            <p class="mb-0">{{ selectedIntervention.biensImmobilers?.adresse || 'N/A' }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Informations Dates -->
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-calendar me-2"></i>Dates
                                        </h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Date de signalement</label>
                                            <p class="mb-0 fw-bold">{{ formatDate(selectedIntervention.dateSignalement) }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Date de traitement</label>
                                            <p class="mb-0 fw-bold">{{ formatDate(selectedIntervention.dateTraitement) }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Informations Financières -->
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-cash-stack me-2"></i>Coûts
                                        </h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Coût estimé</label>
                                            <p class="mb-0 fw-bold text-primary">{{ formatCurrency(selectedIntervention.estimationCout) }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Coût réel</label>
                                            <p class="mb-0 fw-bold">{{ formatCurrency(selectedIntervention.coutReel) }}</p>
                                        </div>
                                        <div v-if="selectedIntervention.ecartBudgetaire" class="mb-2">
                                            <label class="text-muted small">Écart budgétaire</label>
                                            <p class="mb-0 fw-bold" :class="selectedIntervention.ecartBudgetaire > 0 ? 'text-danger' : 'text-success'">
                                                {{ formatCurrency(Math.abs(selectedIntervention.ecartBudgetaire)) }}
                                                <small>({{ selectedIntervention.ecartBudgetaire > 0 ? 'Dépassement' : 'Économie' }})</small>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Informations Créateur -->
                            <div class="col-12" v-if="selectedIntervention.createdBy">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-person me-2"></i>Créé par
                                        </h6>
                                        <div class="d-flex align-items-center">
                                            <div class="avatar bg-primary bg-opacity-10 text-primary rounded-circle p-3 me-3">
                                                <i class="bi bi-person fs-5"></i>
                                            </div>
                                            <div>
                                                <p class="mb-0 fw-bold">{{ selectedIntervention.createdBy.nom }}</p>
                                                <small class="text-muted">{{ formatDate(selectedIntervention.createdAt) }}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="selectedIntervention = null">
                            Fermer
                        </button>
                        <button type="button" class="btn btn-info">
                            <i class="bi bi-download me-1"></i>Télécharger PDF
                        </button>
                        <button type="button" class="btn btn-primary" @click="editIntervention(selectedIntervention)">
                            <i class="bi bi-pencil me-1"></i>Modifier
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Création/Modification Intervention -->
        <div v-if="showCreateModal || showEditModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ showEditModal ? 'Modifier l\'intervention' : 'Nouvelle demande de maintenance' }}
                        </h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveIntervention">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">Type d'intervention <span class="text-danger">*</span></label>
                                    <select v-model="formData.typeIntervention" class="form-select" required>
                                        <option value="">Sélectionner un type</option>
                                        <option value="Plomberie">Plomberie</option>
                                        <option value="Électricité">Électricité</option>
                                        <option value="Climatisation">Climatisation</option>
                                        <option value="Peinture">Peinture</option>
                                        <option value="Menuiserie">Menuiserie</option>
                                        <option value="Serrurerie">Serrurerie</option>
                                        <option value="Jardinage">Jardinage</option>
                                        <option value="Nettoyage">Nettoyage</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Priorité <span class="text-danger">*</span></label>
                                    <select v-model="formData.priorite" class="form-select" required>
                                        <option value="HAUTE">Haute</option>
                                        <option value="MOYENNE">Moyenne</option>
                                        <option value="BASSE">Basse</option>
                                    </select>
                                </div>

                                <div class="col-12">
                                    <label class="form-label">Description <span class="text-danger">*</span></label>
                                    <textarea v-model="formData.description" class="form-control" rows="4"
                                        placeholder="Décrivez le problème en détail..." required></textarea>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Coût estimé</label>
                                    <input type="number" v-model.number="formData.estimationCout" class="form-control"
                                        placeholder="0">
                                </div>

                                <div class="col-md-6" v-if="showEditModal">
                                    <label class="form-label">Coût réel</label>
                                    <input type="number" v-model.number="formData.coutReel" class="form-control"
                                        placeholder="0">
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Bien concerné <span class="text-danger">*</span></label>
                                    <select v-model="formData.biensImmobilersId" class="form-select" required>
                                        <option value="">Sélectionner un bien</option>
                                        <option value="1">Appartement A1 - Cocody Angré</option>
                                        <option value="2">Villa B2 - Plateau Dokui</option>
                                        <option value="3">Bureau C3 - Marcory Zone 4</option>
                                    </select>
                                </div>

                                <div class="col-md-6" v-if="showEditModal">
                                    <label class="form-label">Statut</label>
                                    <select v-model="formData.statut" class="form-select">
                                        <option value="EN_ATTENTE">En attente</option>
                                        <option value="EN_COURS">En cours</option>
                                        <option value="TERMINE">Terminé</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeModal">
                            Annuler
                        </button>
                        <button type="button" class="btn btn-primary" @click="saveIntervention">
                            <i class="bi bi-check-circle me-1"></i>{{ showEditModal ? 'Mettre à jour' : 'Créer' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'DemandesMaintenance',

    data() {
        return {
            loading: true,
            searchQuery: '',
            currentPage: 1,
            perPage: 10,
            
            filters: {
                statut: '',
                priorite: '',
                typeIntervention: '',
                dateDebut: '',
                dateFin: ''
            },

            stats: {
                enAttente: 0,
                enCours: 0,
                termine: 0,
                total: 0,
                coutTotal: 0,
                ecartBudgetaire: 0
            },

            selectedIntervention: null,
            showCreateModal: false,
            showEditModal: false,

            formData: {
                typeIntervention: '',
                description: '',
                estimationCout: null,
                coutReel: null,
                priorite: 'MOYENNE',
                statut: 'EN_ATTENTE',
                biensImmobilersId: '',
                detailsBienId: ''
            },

            interventions: [],
            filteredInterventions: []
        };
    },

    computed: {
        ...mapGetters('interventions', {
            allInterventions: 'all'
        }),

        paginatedInterventions() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredInterventions.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.filteredInterventions.length / this.perPage);
        }
    },

    async mounted() {
        await this.loadData();
    },

    methods: {
        ...mapActions('interventions', {
            getAllInterventions: 'getAll',
            getOneIntervention: 'getOne',
            createIntervention: 'create',
            updateIntervention: 'update',
            deleteInterventionAction: 'delete'
        }),

        async loadData() {
            try {
                this.loading = true;
                await this.getAllInterventions();
                this.interventions = this.allInterventions;
                this.filteredInterventions = [...this.interventions];
                this.calculateStats();
            } catch (error) {
                console.error('Erreur lors du chargement des interventions:', error);
                this.$message?.error('Erreur lors du chargement des interventions');
            } finally {
                this.loading = false;
            }
        },

        calculateStats() {
            this.stats.enAttente = this.interventions.filter(i => i.statut === 'EN_ATTENTE').length;
            this.stats.enCours = this.interventions.filter(i => i.statut === 'EN_COURS').length;
            this.stats.termine = this.interventions.filter(i => i.statut === 'TERMINE').length;
            this.stats.total = this.interventions.length;
            this.stats.coutTotal = this.interventions.reduce((sum, i) => 
                sum + (i.coutReel || i.estimationCout || 0), 0
            );
            this.stats.ecartBudgetaire = this.interventions.reduce((sum, i) => 
                sum + (i.ecartBudgetaire || 0), 0
            );
        },

        filterInterventions() {
            let result = [...this.interventions];

            // Filtre par recherche
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(i =>
                    i.typeIntervention?.toLowerCase().includes(query) ||
                    i.description?.toLowerCase().includes(query) ||
                    i.biensImmobilers?.nom?.toLowerCase().includes(query)
                );
            }

            // Filtre par statut
            if (this.filters.statut) {
                result = result.filter(i => i.statut === this.filters.statut);
            }

            // Filtre par priorité
            if (this.filters.priorite) {
                result = result.filter(i => i.priorite === this.filters.priorite);
            }

            // Filtre par type
            if (this.filters.typeIntervention) {
                result = result.filter(i => i.typeIntervention === this.filters.typeIntervention);
            }

            this.filteredInterventions = result;
            this.currentPage = 1;
        },

        resetFilters() {
            this.filters = {
                statut: '',
                priorite: '',
                typeIntervention: '',
                dateDebut: '',
                dateFin: ''
            };
            this.searchQuery = '';
            this.filteredInterventions = [...this.interventions];
            this.currentPage = 1;
        },

        viewIntervention(intervention) {
            this.selectedIntervention = intervention;
        },

        editIntervention(intervention) {
            this.formData = {
                id: intervention.id,
                typeIntervention: intervention.typeIntervention,
                description: intervention.description,
                estimationCout: intervention.estimationCout,
                coutReel: intervention.coutReel,
                priorite: intervention.priorite,
                statut: intervention.statut,
                biensImmobilersId: intervention.biensImmobilers?.id || '',
                detailsBienId: intervention.detailsBiensImmobiliers?.id || ''
            };
            this.showEditModal = true;
            this.selectedIntervention = null;
        },

        async saveIntervention() {
            try {
                if (!this.formData.typeIntervention || !this.formData.description || !this.formData.biensImmobilersId) {
                    this.$message?.warning('Veuillez remplir tous les champs obligatoires');
                    return;
                }

                const payload = {
                    typeIntervention: this.formData.typeIntervention,
                    description: this.formData.description,
                    estimationCout: this.formData.estimationCout || 0,
                    coutReel: this.formData.coutReel || null,
                    priorite: this.formData.priorite,
                    statut: this.formData.statut || 'EN_ATTENTE',
                    biensImmobilers: {
                        id: parseInt(this.formData.biensImmobilersId)
                    },
                    dateSignalement: new Date().toISOString()
                };

                if (this.showEditModal && this.formData.id) {
                    payload.id = this.formData.id;
                    await this.updateIntervention(payload);
                    this.$message?.success('Intervention mise à jour avec succès');
                } else {
                    await this.createIntervention(payload);
                    this.$message?.success('Intervention créée avec succès');
                }

                this.closeModal();
                await this.loadData();
            } catch (error) {
                console.error('Erreur lors de la sauvegarde:', error);
                this.$message?.error('Erreur lors de la sauvegarde de l\'intervention');
            }
        },

        async startIntervention(id) {
            try {
                const intervention = this.interventions.find(i => i.id === id);
                if (intervention) {
                    await this.updateIntervention({
                        id: id,
                        statut: 'EN_COURS',
                        dateTraitement: new Date().toISOString(),
                        ...intervention
                    });
                    this.$message?.success('Intervention démarrée');
                    await this.loadData();
                }
            } catch (error) {
                console.error('Erreur:', error);
                this.$message?.error('Erreur lors du démarrage de l\'intervention');
            }
        },

        async completeIntervention(id) {
            try {
                const intervention = this.interventions.find(i => i.id === id);
                if (intervention) {
                    // Demander le coût réel
                    const coutReel = prompt('Veuillez entrer le coût réel de l\'intervention:', intervention.estimationCout);
                    if (coutReel === null) return;

                    await this.updateIntervention({
                        id: id,
                        statut: 'TERMINE',
                        coutReel: parseFloat(coutReel) || intervention.estimationCout,
                        ...intervention
                    });
                    this.$message?.success('Intervention terminée');
                    await this.loadData();
                }
            } catch (error) {
                console.error('Erreur:', error);
                this.$message?.error('Erreur lors de la finalisation de l\'intervention');
            }
        },

        async deleteIntervention(id) {
            try {
                if (!confirm('Êtes-vous sûr de vouloir supprimer cette intervention ?')) {
                    return;
                }

                await this.deleteInterventionAction(id);
                this.$message?.success('Intervention supprimée avec succès');
                await this.loadData();
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                this.$message?.error('Erreur lors de la suppression de l\'intervention');
            }
        },

        closeModal() {
            this.showCreateModal = false;
            this.showEditModal = false;
            this.formData = {
                typeIntervention: '',
                description: '',
                estimationCout: null,
                coutReel: null,
                priorite: 'MOYENNE',
                statut: 'EN_ATTENTE',
                biensImmobilersId: '',
                detailsBienId: ''
            };
        },

        exportInterventions() {
            // Logique d'export (CSV, Excel, etc.)
            this.$message?.info('Fonctionnalité d\'export en cours de développement');
        },

        getStatusBadgeClass(statut) {
            const classes = {
                'EN_ATTENTE': 'bg-warning text-dark',
                'EN_COURS': 'bg-primary',
                'TERMINE': 'bg-success'
            };
            return classes[statut] || 'bg-secondary';
        },

        getStatusIcon(statut) {
            const icons = {
                'EN_ATTENTE': 'bi-clock',
                'EN_COURS': 'bi-gear',
                'TERMINE': 'bi-check-circle'
            };
            return icons[statut] || 'bi-circle';
        },

        getStatusLabel(statut) {
            const labels = {
                'EN_ATTENTE': 'En attente',
                'EN_COURS': 'En cours',
                'TERMINE': 'Terminé'
            };
            return labels[statut] || statut;
        },

        getPrioriteBadgeClass(priorite) {
            const classes = {
                'HAUTE': 'bg-danger',
                'MOYENNE': 'bg-warning text-dark',
                'BASSE': 'bg-secondary'
            };
            return classes[priorite] || 'bg-secondary';
        },

        getPrioriteIcon(priorite) {
            const icons = {
                'HAUTE': 'bi-exclamation-triangle-fill',
                'MOYENNE': 'bi-exclamation-circle',
                'BASSE': 'bi-info-circle'
            };
            return icons[priorite] || 'bi-circle';
        },

        formatCurrency(value) {
            if (!value && value !== 0) return '—';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0
            }).format(value);
        },

        formatDate(date) {
            if (!date) return '—';
            return new Date(date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
};
</script>

<style scoped>
.modal.show {
    display: block !important;
}

.table > :not(caption) > * > * {
    padding: 1rem 0.75rem;
}

.badge {
    font-weight: 500;
    padding: 0.35em 0.65em;
}

.text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.card {
    transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dropdown-menu {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.form-label {
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.spinner-border {
    width: 2rem;
    height: 2rem;
}
</style>