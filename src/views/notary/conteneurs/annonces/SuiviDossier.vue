<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">

            <!-- En-tête -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">
                                <i class="bi bi-folder-check me-2"></i>Suivi des Dossiers
                            </h1>
                            <p class="text-muted mb-0">Gestion et suivi de l'avancement des dossiers</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <button @click="showCreateModal = true" class="btn btn-primary">
                                <i class="bi bi-plus-circle me-1"></i>Nouveau Dossier
                            </button>
                            <button @click="rafraichir" class="btn btn-outline-primary">
                                <i class="bi bi-arrow-clockwise"></i>
                            </button>
                            <button @click="exportDossiers" class="btn btn-success">
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
                                    <span class="text-muted small">Total Dossiers</span>
                                    <h3 class="mb-0 mt-2 text-primary">{{ stats.total }}</h3>
                                    <small class="text-muted">
                                        <i class="bi bi-folder me-1"></i>Actifs
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-primary bg-opacity-10 text-primary">
                                    <i class="bi bi-folder fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">En Cours</span>
                                    <h3 class="mb-0 mt-2 text-warning">{{ stats.enCours }}</h3>
                                    <small class="text-warning">
                                        <i class="bi bi-hourglass-split me-1"></i>Traitement
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-warning bg-opacity-10 text-warning">
                                    <i class="bi bi-hourglass-split fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Finalisés</span>
                                    <h3 class="mb-0 mt-2 text-success">{{ stats.finalises }}</h3>
                                    <small class="text-success">
                                        <i class="bi bi-check-circle me-1"></i>Ce mois
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
                                    <span class="text-muted small">En Retard</span>
                                    <h3 class="mb-0 mt-2 text-danger">{{ stats.enRetard }}</h3>
                                    <small class="text-danger">
                                        <i class="bi bi-exclamation-triangle me-1"></i>Urgents
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-danger bg-opacity-10 text-danger">
                                    <i class="bi bi-exclamation-triangle fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Statistiques -->
                <div class="row g-4 mb-4">
                    <div class="col-md-6">
                        <div class="card shadow-sm h-100">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Répartition par Statut</h6>
                            </div>
                            <div class="card-body">
                                <div v-for="stat in statutStats" :key="stat.id" class="mb-3">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <div class="d-flex align-items-center">
                                            <i class="bi fs-5 me-2" :class="[stat.icon, 'text-' + stat.color]"></i>
                                            <span>{{ stat.label }}</span>
                                        </div>
                                        <strong :class="'text-' + stat.color">{{ stat.count }}</strong>
                                    </div>
                                    <div class="progress" style="height: 6px;">
                                        <div class="progress-bar" :class="'bg-' + stat.color"
                                            :style="{ width: stat.percentage + '%' }"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="card shadow-sm h-100">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Activité Récente</h6>
                            </div>
                            <div class="card-body">
                                <div v-for="activity in recentActivity" :key="activity.id" class="mb-3">
                                    <div class="d-flex align-items-start">
                                        <div class="activity-icon me-3"
                                            :class="'bg-' + activity.color + ' bg-opacity-10'">
                                            <i class="bi" :class="[activity.icon, 'text-' + activity.color]"></i>
                                        </div>
                                        <div class="flex-grow-1">
                                            <div class="d-flex justify-content-between">
                                                <strong>{{ activity.action }}</strong>
                                                <small class="text-muted">{{ formatDate(activity.date) }}</small>
                                            </div>
                                            <small class="text-muted">{{ activity.details }}</small>
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
                                                v-model="searchQuery" @input="filterDossiers">
                                            <i
                                                class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.statut" @change="filterDossiers" class="form-select">
                                            <option value="">Tous les statuts</option>
                                            <option value="OUVERT">Ouvert</option>
                                            <option value="EN_COURS">En cours</option>
                                            <option value="EN_ATTENTE">En attente</option>
                                            <option value="FINALISE">Finalisé</option>
                                            <option value="CLOTURE">Clôturé</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.type" @change="filterDossiers" class="form-select">
                                            <option value="">Tous les types</option>
                                            <option value="VENTE">Vente</option>
                                            <option value="BAIL">Bail</option>
                                            <option value="DONATION">Donation</option>
                                            <option value="SUCCESSION">Succession</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.priorite" @change="filterDossiers" class="form-select">
                                            <option value="">Toutes priorités</option>
                                            <option value="HAUTE">Haute</option>
                                            <option value="MOYENNE">Moyenne</option>
                                            <option value="BASSE">Basse</option>
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

                <!-- Liste des dossiers -->
                <div class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">
                                    Liste des Dossiers
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ filteredDossiers.length }} dossiers
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
                                                <th>Client</th>
                                                <th>Responsable</th>
                                                <th>Statut</th>
                                                <th>Progression</th>
                                                <th>Échéance</th>
                                                <th class="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="paginatedDossiers.length === 0">
                                                <td colspan="8" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucun dossier trouvé</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="dossier in paginatedDossiers" :key="dossier.id"
                                                :class="{ 'table-danger': isEnRetard(dossier.dateEcheance) }">
                                                <td>
                                                    <strong class="text-primary">#{{ dossier.reference }}</strong>
                                                    <span v-if="dossier.priorite === 'HAUTE'"
                                                        class="badge bg-danger ms-1">
                                                        <i class="bi bi-exclamation-triangle"></i>
                                                    </span>
                                                </td>
                                                <td>
                                                    <div><strong>{{ dossier.titre }}</strong></div>
                                                    <span class="badge bg-light text-dark">{{ dossier.type }}</span>
                                                </td>
                                                <td>
                                                    <div>{{ dossier.client }}</div>
                                                    <small class="text-muted">{{ dossier.telephone }}</small>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div
                                                            class="avatar bg-primary bg-opacity-10 rounded-circle me-2 p-2">
                                                            <i class="bi bi-person fs-6 text-primary"></i>
                                                        </div>
                                                        <span>{{ dossier.responsable }}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getStatutBadgeClass(dossier.statut)">
                                                        <i class="bi" :class="getStatutIcon(dossier.statut)"></i>
                                                        {{ getStatutLabel(dossier.statut) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div class="progress flex-grow-1 me-2"
                                                            style="height: 8px; min-width: 80px;">
                                                            <div class="progress-bar"
                                                                :class="getProgressBarClass(dossier.progression)"
                                                                :style="{ width: dossier.progression + '%' }"></div>
                                                        </div>
                                                        <small>{{ dossier.progression }}%</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div :class="getEcheanceClass(dossier.dateEcheance)">
                                                        <i class="bi bi-calendar-event me-1"></i>
                                                        {{ formatDate(dossier.dateEcheance) }}
                                                    </div>
                                                    <small v-if="isEnRetard(dossier.dateEcheance)"
                                                        class="text-danger d-block">
                                                        <i class="bi bi-exclamation-triangle me-1"></i>
                                                        {{ getJoursRetard(dossier.dateEcheance) }}j de retard
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
                                                                    @click.prevent="viewDossier(dossier)">
                                                                    <i class="bi bi-eye me-2"></i>Voir détails
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="updateStatut(dossier)">
                                                                    <i class="bi bi-arrow-repeat me-2"></i>Changer
                                                                    statut
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="addNote(dossier)">
                                                                    <i class="bi bi-chat-left-text me-2"></i>Ajouter
                                                                    note
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <hr class="dropdown-divider">
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="editDossier(dossier)">
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
                                <div v-if="filteredDossiers.length > perPage" class="card-footer border-top">
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
        <div v-if="selectedDossier" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Dossier #{{ selectedDossier.reference }}
                            <span class="badge ms-2" :class="getStatutBadgeClass(selectedDossier.statut)">
                                {{ getStatutLabel(selectedDossier.statut) }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedDossier = null"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-info-circle me-2"></i>Informations Générales
                                        </h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Titre</label>
                                            <p class="mb-0 fw-bold">{{ selectedDossier.titre }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Type</label>
                                            <p class="mb-0"><span class="badge bg-primary">{{ selectedDossier.type
                                            }}</span></p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Client</label>
                                            <p class="mb-0">{{ selectedDossier.client }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Responsable</label>
                                            <p class="mb-0">{{ selectedDossier.responsable }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-graph-up me-2"></i>Avancement</h6>
                                        <div class="mb-3">
                                            <label class="text-muted small">Progression</label>
                                            <div class="progress" style="height: 20px;">
                                                <div class="progress-bar"
                                                    :class="getProgressBarClass(selectedDossier.progression)"
                                                    :style="{ width: selectedDossier.progression + '%' }">
                                                    {{ selectedDossier.progression }}%
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Date de création</label>
                                            <p class="mb-0">{{ formatDate(selectedDossier.dateCreation) }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Date d'échéance</label>
                                            <p class="mb-0" :class="getEcheanceClass(selectedDossier.dateEcheance)">
                                                {{ formatDate(selectedDossier.dateEcheance) }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12" v-if="selectedDossier.description">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-file-text me-2"></i>Description</h6>
                                        <p class="mb-0">{{ selectedDossier.description }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12" v-if="selectedDossier.notes && selectedDossier.notes.length > 0">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-chat-left-text me-2"></i>Notes et Commentaires
                                        </h6>
                                        <div v-for="note in selectedDossier.notes" :key="note.id" class="mb-3">
                                            <div class="d-flex align-items-start">
                                                <div class="avatar bg-primary bg-opacity-10 rounded-circle me-2 p-2">
                                                    <i class="bi bi-person fs-6 text-primary"></i>
                                                </div>
                                                <div class="flex-grow-1">
                                                    <div class="d-flex justify-content-between">
                                                        <strong>{{ note.auteur }}</strong>
                                                        <small class="text-muted">{{ formatDate(note.date) }}</small>
                                                    </div>
                                                    <p class="mb-0 mt-1">{{ note.contenu }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="selectedDossier = null">Fermer</button>
                        <button type="button" class="btn btn-info" @click="addNote(selectedDossier)">
                            <i class="bi bi-chat-left-text me-1"></i>Ajouter Note
                        </button>
                        <button type="button" class="btn btn-primary" @click="editDossier(selectedDossier)">
                            <i class="bi bi-pencil me-1"></i>Modifier
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Création/Modification -->
        <div v-if="showCreateModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ editMode ? 'Modifier' : 'Nouveau' }} Dossier</h5>
                        <button type="button" class="btn-close" @click="closeCreateModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Type *</label>
                                <select v-model="dossierForm.type" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="VENTE">Vente</option>
                                    <option value="BAIL">Bail</option>
                                    <option value="DONATION">Donation</option>
                                    <option value="SUCCESSION">Succession</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Priorité *</label>
                                <select v-model="dossierForm.priorite" class="form-select" required>
                                    <option value="HAUTE">Haute</option>
                                    <option value="MOYENNE">Moyenne</option>
                                    <option value="BASSE">Basse</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Titre *</label>
                                <input type="text" v-model="dossierForm.titre" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Client *</label>
                                <input type="text" v-model="dossierForm.client" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Responsable *</label>
                                <select v-model="dossierForm.responsableId" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="1">Me. Kouassi</option>
                                    <option value="2">Me. Kone</option>
                                    <option value="3">Me. Diallo</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date d'échéance *</label>
                                <input type="date" v-model="dossierForm.dateEcheance" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Téléphone</label>
                                <input type="tel" v-model="dossierForm.telephone" class="form-control">
                            </div>
                            <div class="col-12">
                                <label class="form-label">Description</label>
                                <textarea v-model="dossierForm.description" class="form-control" rows="4"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeCreateModal">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="saveDossier">
                            <i class="bi bi-check-circle me-1"></i>{{ editMode ? 'Modifier' : 'Créer' }}
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
    name: 'SuiviDossiers',

    data() {
        return {
            loading: true,
            searchQuery: '',
            currentPage: 1,
            perPage: 15,
            selectedDossier: null,
            showCreateModal: false,
            editMode: false,
            filters: { statut: '', type: '', priorite: '' },
            dossierForm: {
                id: null, type: '', priorite: 'MOYENNE', titre: '', client: '',
                responsableId: '', dateEcheance: '', telephone: '', description: ''
            },
            dossiers: [],
            stats: { total: 0, enCours: 0, finalises: 0, enRetard: 0 },
            statutStats: [],
            recentActivity: []
        };
    },

    computed: {
        filteredDossiers() {
            let result = [...this.dossiers];
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(d =>
                    d.reference.toLowerCase().includes(query) ||
                    d.titre.toLowerCase().includes(query) ||
                    d.client.toLowerCase().includes(query)
                );
            }
            if (this.filters.statut) result = result.filter(d => d.statut === this.filters.statut);
            if (this.filters.type) result = result.filter(d => d.type === this.filters.type);
            if (this.filters.priorite) result = result.filter(d => d.priorite === this.filters.priorite);
            return result.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));
        },

        paginatedDossiers() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredDossiers.slice(start, start + this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filteredDossiers.length / this.perPage);
        }
    },

    async mounted() {
        await this.loadData();
    },

    methods: {
        async loadData() {
            try {
                this.loading = true;
                const clients = ['Jean Kouassi', 'Marie Diallo', 'Paul Kone', 'Sophie N\'Guessan'];
                const responsables = ['Me. Kouassi', 'Me. Kone', 'Me. Diallo'];
                const types = ['VENTE', 'BAIL', 'DONATION', 'SUCCESSION'];
                const statuts = ['OUVERT', 'EN_COURS', 'EN_ATTENTE', 'FINALISE', 'CLOTURE'];
                const priorites = ['HAUTE', 'MOYENNE', 'BASSE'];

                this.dossiers = Array.from({ length: 40 }, (_, i) => ({
                    id: i + 1,
                    reference: `DOS-${String(i + 1).padStart(4, '0')}`,
                    titre: `Dossier ${i + 1}`,
                    type: types[Math.floor(Math.random() * types.length)],
                    client: clients[Math.floor(Math.random() * clients.length)],
                    telephone: `+225 07 ${Math.floor(Math.random() * 90000000 + 10000000)}`,
                    responsable: responsables[Math.floor(Math.random() * responsables.length)],
                    responsableId: String(Math.floor(Math.random() * 3) + 1),
                    statut: statuts[Math.floor(Math.random() * statuts.length)],
                    priorite: priorites[Math.floor(Math.random() * priorites.length)],
                    progression: Math.floor(Math.random() * 100),
                    dateCreation: new Date(2024, Math.floor(Math.random() * 11), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
                    dateEcheance: new Date(2024, 11, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
                    description: `Description détaillée du dossier ${i + 1}`,
                    notes: Math.random() > 0.5 ? [
                        {
                            id: 1,
                            auteur: responsables[Math.floor(Math.random() * responsables.length)],
                            date: new Date().toISOString().split('T')[0],
                            contenu: 'Note importante sur ce dossier'
                        }
                    ] : []
                }));

                this.calculateStats();
                this.calculateStatutStats();
                this.generateRecentActivity();
            } catch (error) {
                console.error('Erreur:', error);
                ElMessage.error('Erreur lors du chargement');
            } finally {
                this.loading = false;
            }
        },

        calculateStats() {
            this.stats.total = this.dossiers.length;
            this.stats.enCours = this.dossiers.filter(d => d.statut === 'EN_COURS' || d.statut === 'OUVERT').length;
            const thisMonth = new Date().getMonth();
            this.stats.finalises = this.dossiers.filter(d => {
                const date = new Date(d.dateCreation);
                return d.statut === 'FINALISE' && date.getMonth() === thisMonth;
            }).length;
            const today = new Date();
            this.stats.enRetard = this.dossiers.filter(d => {
                const echeance = new Date(d.dateEcheance);
                return echeance < today && d.statut !== 'FINALISE' && d.statut !== 'CLOTURE';
            }).length;
        },

        calculateStatutStats() {
            const statuts = [
                { id: 'OUVERT', label: 'Ouverts', icon: 'bi-folder', color: 'primary' },
                { id: 'EN_COURS', label: 'En cours', icon: 'bi-hourglass-split', color: 'warning' },
                { id: 'EN_ATTENTE', label: 'En attente', icon: 'bi-clock', color: 'info' },
                { id: 'FINALISE', label: 'Finalisés', icon: 'bi-check-circle', color: 'success' },
                { id: 'CLOTURE', label: 'Clôturés', icon: 'bi-archive', color: 'secondary' }
            ];
            const total = this.dossiers.length;
            this.statutStats = statuts.map(s => ({
                ...s,
                count: this.dossiers.filter(d => d.statut === s.id).length,
                percentage: total > 0 ? Math.round((this.dossiers.filter(d => d.statut === s.id).length / total) * 100) : 0
            }));
        },

        generateRecentActivity() {
            this.recentActivity = [
                {
                    id: 1, action: 'Dossier créé', details: 'DOS-0025 - Vente Cocody',
                    date: new Date().toISOString().split('T')[0], icon: 'bi-folder-plus', color: 'success'
                },
                {
                    id: 2, action: 'Statut modifié', details: 'DOS-0018 - Passé en finalisation',
                    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], icon: 'bi-arrow-repeat', color: 'primary'
                },
                {
                    id: 3, action: 'Note ajoutée', details: 'DOS-0012 - Commentaire important',
                    date: new Date(Date.now() - 172800000).toISOString().split('T')[0], icon: 'bi-chat-left-text', color: 'info'
                }
            ];
        },

        filterDossiers() {
            this.currentPage = 1;
        },

        resetFilters() {
            this.searchQuery = '';
            this.filters = { statut: '', type: '', priorite: '' };
            this.currentPage = 1;
        },

        viewDossier(dossier) {
            this.selectedDossier = dossier;
        },

        editDossier(dossier) {
            this.editMode = true;
            this.dossierForm = { ...dossier };
            this.showCreateModal = true;
            if (this.selectedDossier) this.selectedDossier = null;
        },

        closeCreateModal() {
            this.showCreateModal = false;
            this.editMode = false;
            this.dossierForm = {
                id: null, type: '', priorite: 'MOYENNE', titre: '', client: '',
                responsableId: '', dateEcheance: '', telephone: '', description: ''
            };
        },

        saveDossier() {
            if (!this.dossierForm.type || !this.dossierForm.titre || !this.dossierForm.client ||
                !this.dossierForm.responsableId || !this.dossierForm.dateEcheance) {
                ElMessage.warning('Veuillez remplir tous les champs obligatoires');
                return;
            }
            ElMessage.success(this.editMode ? 'Dossier modifié avec succès!' : 'Dossier créé avec succès!');
            this.closeCreateModal();
            this.loadData();
        },

        async updateStatut(dossier) {
            try {
                const { value: nouveauStatut } = await ElMessageBox.prompt(
                    'Sélectionnez le nouveau statut',
                    'Changer le statut',
                    {
                        confirmButtonText: 'Confirmer',
                        cancelButtonText: 'Annuler',
                        inputType: 'select',
                        inputOptions: {
                            'OUVERT': 'Ouvert',
                            'EN_COURS': 'En cours',
                            'EN_ATTENTE': 'En attente',
                            'FINALISE': 'Finalisé',
                            'CLOTURE': 'Clôturé'
                        }
                    }
                );
                ElMessage.success('Statut modifié avec succès!');
                this.loadData();
            } catch (error) {
                if (error !== 'cancel') console.error('Erreur:', error);
            }
        },

        async addNote(dossier) {
            try {
                const { value: note } = await ElMessageBox.prompt(
                    'Ajoutez votre note',
                    'Nouvelle note',
                    {
                        confirmButtonText: 'Ajouter',
                        cancelButtonText: 'Annuler',
                        inputType: 'textarea'
                    }
                );
                if (note) {
                    ElMessage.success('Note ajoutée avec succès!');
                    if (this.selectedDossier) this.selectedDossier = null;
                    this.loadData();
                }
            } catch (error) {
                if (error !== 'cancel') console.error('Erreur:', error);
            }
        },

        exportDossiers() {
            ElMessage.success('Export en cours...');
        },

        rafraichir() {
            this.loadData();
            ElMessage.success('Données mises à jour !');
        },

        getStatutLabel(statut) {
            const labels = {
                'OUVERT': 'Ouvert',
                'EN_COURS': 'En cours',
                'EN_ATTENTE': 'En attente',
                'FINALISE': 'Finalisé',
                'CLOTURE': 'Clôturé'
            };
            return labels[statut] || statut;
        },

        getStatutIcon(statut) {
            const icons = {
                'OUVERT': 'bi-folder',
                'EN_COURS': 'bi-hourglass-split',
                'EN_ATTENTE': 'bi-clock',
                'FINALISE': 'bi-check-circle',
                'CLOTURE': 'bi-archive'
            };
            return icons[statut] || 'bi-circle';
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'OUVERT': 'bg-primary',
                'EN_COURS': 'bg-warning text-dark',
                'EN_ATTENTE': 'bg-info',
                'FINALISE': 'bg-success',
                'CLOTURE': 'bg-secondary'
            };
            return classes[statut] || 'bg-secondary';
        },

        getProgressBarClass(progression) {
            if (progression >= 75) return 'bg-success';
            if (progression >= 50) return 'bg-primary';
            if (progression >= 25) return 'bg-info';
            return 'bg-warning';
        },

        getEcheanceClass(dateEcheance) {
            if (!dateEcheance) return '';
            const today = new Date();
            const echeance = new Date(dateEcheance);
            const diff = Math.floor((echeance - today) / (1000 * 60 * 60 * 24));
            if (diff < 0) return 'text-danger fw-bold';
            if (diff <= 7) return 'text-warning fw-bold';
            return 'text-muted';
        },

        isEnRetard(dateEcheance) {
            if (!dateEcheance) return false;
            const today = new Date();
            const echeance = new Date(dateEcheance);
            return echeance < today;
        },

        getJoursRetard(dateEcheance) {
            if (!dateEcheance) return 0;
            const today = new Date();
            const echeance = new Date(dateEcheance);
            return Math.floor((today - echeance) / (1000 * 60 * 60 * 24));
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

.activity-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 1.2rem;
}

.avatar {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
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