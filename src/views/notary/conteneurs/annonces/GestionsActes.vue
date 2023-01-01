<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">

            <!-- En-tête -->
            <div class="row">
                <div class="col-sm-12 mb-4">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">
                                <i class="bi bi-file-earmark-text me-2"></i>Gestion des Actes
                            </h1>
                            <p class="text-muted mb-0">Suivi et gestion des actes juridiques et notariés</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <button @click="showCreateModal = true" class="btn btn-primary">
                                <i class="bi bi-plus-circle me-1"></i>Nouvel Acte
                            </button>
                            <button @click="rafraichir" class="btn btn-outline-primary">
                                <i class="bi bi-arrow-clockwise"></i>
                            </button>
                            <button @click="exportActes" class="btn btn-success">
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
                                    <span class="text-muted small">Total Actes</span>
                                    <h3 class="mb-0 mt-2 text-primary">{{ stats.totalActes }}</h3>
                                    <small class="text-muted">
                                        <i class="bi bi-file-earmark-text me-1"></i>Enregistrés
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-primary bg-opacity-10 text-primary">
                                    <i class="bi bi-files fa-fw fs-4"></i>
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
                                    <small class="text-muted">
                                        <i class="bi bi-clock me-1"></i>En traitement
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
                                    <span class="text-muted small">Signés</span>
                                    <h3 class="mb-0 mt-2 text-success">{{ stats.signes }}</h3>
                                    <small class="text-success">
                                        <i class="bi bi-check-circle me-1"></i>Validés
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-success bg-opacity-10 text-success">
                                    <i class="bi bi-pen fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">À Renouveler</span>
                                    <h3 class="mb-0 mt-2 text-danger">{{ stats.aRenouveler }}</h3>
                                    <small class="text-danger">
                                        <i class="bi bi-exclamation-triangle me-1"></i>Attention
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-danger bg-opacity-10 text-danger">
                                    <i class="bi bi-arrow-repeat fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Graphiques -->
                <div class="row g-4 mb-4">
                    <!-- Répartition par Type -->
                    <div class="col-lg-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Répartition par Type d'Acte</h6>
                            </div>
                            <div class="card-body">
                                <canvas ref="chartTypes" height="250"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- Évolution Mensuelle -->
                    <div class="col-lg-8">
                        <div class="card shadow-sm h-100">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Évolution des Actes</h6>
                            </div>
                            <div class="card-body">
                                <canvas ref="chartEvolution" height="100"></canvas>
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
                                    <!-- Recherche -->
                                    <div class="col-md-3">
                                        <div class="position-relative">
                                            <input type="text" class="form-control" placeholder="Rechercher..."
                                                v-model="searchQuery" @input="filterActes">
                                            <i
                                                class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>

                                    <!-- Filtre Type -->
                                    <div class="col-md-2">
                                        <select v-model="filters.type" @change="filterActes" class="form-select">
                                            <option value="">Tous les types</option>
                                            <option value="VENTE">Vente</option>
                                            <option value="BAIL">Bail</option>
                                            <option value="DONATION">Donation</option>
                                            <option value="HYPOTHEQUE">Hypothèque</option>
                                            <option value="SUCCESSION">Succession</option>
                                        </select>
                                    </div>

                                    <!-- Filtre Statut -->
                                    <div class="col-md-2">
                                        <select v-model="filters.statut" @change="filterActes" class="form-select">
                                            <option value="">Tous les statuts</option>
                                            <option value="BROUILLON">Brouillon</option>
                                            <option value="EN_COURS">En cours</option>
                                            <option value="SIGNE">Signé</option>
                                            <option value="ENREGISTRE">Enregistré</option>
                                            <option value="ARCHIVE">Archivé</option>
                                        </select>
                                    </div>

                                    <!-- Filtre Notaire -->
                                    <div class="col-md-2">
                                        <select v-model="filters.notaire" @change="filterActes" class="form-select">
                                            <option value="">Tous les notaires</option>
                                            <option value="1">Me. Kouassi</option>
                                            <option value="2">Me. Kone</option>
                                            <option value="3">Me. Diallo</option>
                                        </select>
                                    </div>

                                    <!-- Réinitialiser -->
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

                <!-- Tableau des Actes -->
                <div class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light d-flex justify-content-between align-items-center">
                                <h6 class="mb-0">
                                    Liste des Actes
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ filteredActes.length }} actes
                                    </span>
                                </h6>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Référence</th>
                                                <th>Type d'Acte</th>
                                                <th>Parties Impliquées</th>
                                                <th>Bien Concerné</th>
                                                <th>Date de Signature</th>
                                                <th>Notaire</th>
                                                <th>Statut</th>
                                                <th class="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="paginatedActes.length === 0">
                                                <td colspan="8" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucun acte trouvé</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="acte in paginatedActes" :key="acte.id">
                                                <td>
                                                    <strong class="text-primary">#{{ acte.reference }}</strong>
                                                    <small class="text-muted d-block">{{ acte.numeroEnregistrement
                                                        }}</small>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div class="acte-icon me-2"
                                                            :class="getTypeIconClass(acte.type)">
                                                            <i class="bi" :class="getTypeIcon(acte.type)"></i>
                                                        </div>
                                                        <div>
                                                            <strong>{{ acte.typeLabel }}</strong>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <div class="mb-1">
                                                            <i class="bi bi-person-circle me-1"></i>
                                                            <strong>{{ acte.partie1 }}</strong>
                                                        </div>
                                                        <div class="text-muted small">
                                                            <i class="bi bi-arrow-right me-1"></i>
                                                            {{ acte.partie2 }}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div v-if="acte.bienConcerne">
                                                        <strong>{{ acte.bienConcerne }}</strong>
                                                        <small class="text-muted d-block">{{ acte.bienAdresse }}</small>
                                                    </div>
                                                    <span v-else class="text-muted">—</span>
                                                </td>
                                                <td>
                                                    <div>
                                                        <i class="bi bi-calendar-event me-1"></i>
                                                        {{ formatDate(acte.dateSignature) }}
                                                    </div>
                                                    <small v-if="acte.dateEnregistrement" class="text-muted d-block">
                                                        Enreg: {{ formatDate(acte.dateEnregistrement) }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div
                                                            class="avatar bg-primary bg-opacity-10 rounded-circle me-2 p-2">
                                                            <i class="bi bi-person-badge fs-6 text-primary"></i>
                                                        </div>
                                                        <span>{{ acte.notaire }}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getStatutBadgeClass(acte.statut)">
                                                        <i class="bi" :class="getStatutIcon(acte.statut)"></i>
                                                        {{ getStatutLabel(acte.statut) }}
                                                    </span>
                                                </td>
                                                <td class="text-end">
                                                    <div class="dropdown">
                                                        <button class="btn btn-sm btn-light" type="button"
                                                            :id="'dropdown-' + acte.id" data-bs-toggle="dropdown">
                                                            <i class="bi bi-three-dots-vertical"></i>
                                                        </button>
                                                        <ul class="dropdown-menu dropdown-menu-end">
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="viewActe(acte)">
                                                                    <i class="bi bi-eye me-2"></i>Voir détails
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="downloadActe(acte.id)">
                                                                    <i class="bi bi-download me-2"></i>Télécharger PDF
                                                                </a>
                                                            </li>
                                                            <li
                                                                v-if="acte.statut === 'BROUILLON' || acte.statut === 'EN_COURS'">
                                                                <a class="dropdown-item text-success" href="#"
                                                                    @click.prevent="signerActe(acte.id)">
                                                                    <i class="bi bi-pen me-2"></i>Signer
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <hr class="dropdown-divider">
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="editActe(acte)">
                                                                    <i class="bi bi-pencil me-2"></i>Modifier
                                                                </a>
                                                            </li>
                                                            <li v-if="acte.statut === 'SIGNE'">
                                                                <a class="dropdown-item text-info" href="#"
                                                                    @click.prevent="archiverActe(acte.id)">
                                                                    <i class="bi bi-archive me-2"></i>Archiver
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
                                <div v-if="filteredActes.length > perPage" class="card-footer border-top">
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

        <!-- Modal Détails Acte -->
        <div v-if="selectedActe" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Acte #{{ selectedActe.reference }}
                            <span class="badge ms-2" :class="getStatutBadgeClass(selectedActe.statut)">
                                {{ getStatutLabel(selectedActe.statut) }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedActe = null"></button>
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
                                            <label class="text-muted small">Type d'acte</label>
                                            <p class="mb-0 fw-bold">{{ selectedActe.typeLabel }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Numéro d'enregistrement</label>
                                            <p class="mb-0">{{ selectedActe.numeroEnregistrement }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Date de signature</label>
                                            <p class="mb-0">{{ formatDate(selectedActe.dateSignature) }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Notaire en charge</label>
                                            <p class="mb-0 fw-bold">{{ selectedActe.notaire }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Parties Impliquées -->
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-people me-2"></i>Parties Impliquées
                                        </h6>
                                        <div class="mb-3">
                                            <label class="text-muted small">Partie 1 (Vendeur/Bailleur)</label>
                                            <p class="mb-0 fw-bold">{{ selectedActe.partie1 }}</p>
                                            <small class="text-muted">{{ selectedActe.partie1Details }}</small>
                                        </div>
                                        <div>
                                            <label class="text-muted small">Partie 2 (Acquéreur/Locataire)</label>
                                            <p class="mb-0 fw-bold">{{ selectedActe.partie2 }}</p>
                                            <small class="text-muted">{{ selectedActe.partie2Details }}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Bien Concerné -->
                            <div class="col-12" v-if="selectedActe.bienConcerne">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-building me-2"></i>Bien Concerné
                                        </h6>
                                        <div class="row g-3">
                                            <div class="col-md-6">
                                                <label class="text-muted small">Désignation</label>
                                                <p class="mb-0 fw-bold">{{ selectedActe.bienConcerne }}</p>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="text-muted small">Adresse</label>
                                                <p class="mb-0">{{ selectedActe.bienAdresse }}</p>
                                            </div>
                                            <div class="col-md-6" v-if="selectedActe.montant">
                                                <label class="text-muted small">Montant</label>
                                                <p class="mb-0 fw-bold text-success fs-5">
                                                    {{ formatCurrency(selectedActe.montant) }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Détails Supplémentaires -->
                            <div class="col-12" v-if="selectedActe.notes">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-file-text me-2"></i>Notes et Remarques
                                        </h6>
                                        <p class="mb-0">{{ selectedActe.notes }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="selectedActe = null">
                            Fermer
                        </button>
                        <button type="button" class="btn btn-info" @click="downloadActe(selectedActe.id)">
                            <i class="bi bi-download me-1"></i>Télécharger PDF
                        </button>
                        <button v-if="selectedActe.statut !== 'SIGNE'" type="button" class="btn btn-success"
                            @click="signerActe(selectedActe.id)">
                            <i class="bi bi-pen me-1"></i>Signer l'Acte
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Création Acte -->
        <div v-if="showCreateModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Nouvel Acte Notarié</h5>
                        <button type="button" class="btn-close" @click="closeCreateModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Type d'acte *</label>
                                <select v-model="acteForm.type" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="VENTE">Vente</option>
                                    <option value="BAIL">Bail</option>
                                    <option value="DONATION">Donation</option>
                                    <option value="HYPOTHEQUE">Hypothèque</option>
                                    <option value="SUCCESSION">Succession</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Notaire *</label>
                                <select v-model="acteForm.notaireId" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="1">Me. Kouassi</option>
                                    <option value="2">Me. Kone</option>
                                    <option value="3">Me. Diallo</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Partie 1 (Vendeur/Bailleur) *</label>
                                <input type="text" v-model="acteForm.partie1" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Partie 2 (Acquéreur/Locataire) *</label>
                                <input type="text" v-model="acteForm.partie2" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Bien concerné</label>
                                <input type="text" v-model="acteForm.bienConcerne" class="form-control">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date de signature *</label>
                                <input type="date" v-model="acteForm.dateSignature" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Montant (XOF)</label>
                                <input type="number" v-model.number="acteForm.montant" class="form-control">
                            </div>
                            <div class="col-12">
                                <label class="form-label">Notes</label>
                                <textarea v-model="acteForm.notes" class="form-control" rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeCreateModal">
                            Annuler
                        </button>
                        <button type="button" class="btn btn-primary" @click="saveActe">
                            <i class="bi bi-check-circle me-1"></i>Enregistrer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';
import Chart from 'chart.js/auto';

export default {
    name: 'GestionActesNotaire',

    data() {
        return {
            loading: true,
            searchQuery: '',
            currentPage: 1,
            perPage: 10,
            selectedActe: null,
            showCreateModal: false,
            editMode: false,

            filters: {
                type: '',
                statut: '',
                notaire: ''
            },

            acteForm: {
                id: null,
                type: '',
                notaireId: '',
                partie1: '',
                partie2: '',
                bienConcerne: '',
                dateSignature: '',
                montant: 0,
                notes: ''
            },

            actes: [],
            stats: {
                totalActes: 0,
                enCours: 0,
                signes: 0,
                aRenouveler: 0
            },

            chartTypes: null,
            chartEvolution: null
        };
    },

    computed: {
        filteredActes() {
            let result = [...this.actes];

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(a =>
                    a.reference.toLowerCase().includes(query) ||
                    a.partie1.toLowerCase().includes(query) ||
                    a.partie2.toLowerCase().includes(query) ||
                    a.bienConcerne?.toLowerCase().includes(query)
                );
            }

            if (this.filters.type) {
                result = result.filter(a => a.type === this.filters.type);
            }

            if (this.filters.statut) {
                result = result.filter(a => a.statut === this.filters.statut);
            }

            if (this.filters.notaire) {
                result = result.filter(a => a.notaireId === this.filters.notaire);
            }

            return result;
        },

        paginatedActes() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredActes.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.filteredActes.length / this.perPage);
        }
    },

    async mounted() {
        await this.loadData();
    },

    beforeDestroy() {
        if (this.chartTypes) this.chartTypes.destroy();
        if (this.chartEvolution) this.chartEvolution.destroy();
    },

    methods: {
        async loadData() {
            try {
                this.loading = true;

                // Générer des données de démonstration
                this.actes = Array.from({ length: 30 }, (_, i) => ({
                    id: i + 1,
                    reference: `ACTE-${String(i + 1).padStart(4, '0')}`,
                    numeroEnregistrement: `NE-${String(i + 1).padStart(6, '0')}`,
                    type: ['VENTE', 'BAIL', 'DONATION', 'HYPOTHEQUE', 'SUCCESSION'][Math.floor(Math.random() * 5)],
                    typeLabel: ['Vente', 'Bail', 'Donation', 'Hypothèque', 'Succession'][Math.floor(Math.random() * 5)],
                    partie1: `Vendeur ${i + 1}`,
                    partie1Details: `CNI: ${Math.floor(Math.random() * 1000000000)}`,
                    partie2: `Acquéreur ${i + 1}`,
                    partie2Details: `CNI: ${Math.floor(Math.random() * 1000000000)}`,
                    bienConcerne: `Bien ${i + 1}`,
                    bienAdresse: `Adresse ${i + 1}, Abidjan`,
                    montant: Math.floor(Math.random() * 50000000) + 10000000,
                    dateSignature: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
                    dateEnregistrement: Math.random() > 0.5 ? new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0] : null,
                    statut: ['BROUILLON', 'EN_COURS', 'SIGNE', 'ENREGISTRE', 'ARCHIVE'][Math.floor(Math.random() * 5)],
                    notaire: ['Me. Kouassi', 'Me. Kone', 'Me. Diallo'][Math.floor(Math.random() * 3)],
                    notaireId: String(Math.floor(Math.random() * 3) + 1),
                    notes: Math.random() > 0.5 ? 'Notes importantes sur cet acte' : null
                }));

                this.calculateStats();

                this.$nextTick(() => {
                    this.initCharts();
                });

            } catch (error) {
                console.error('Erreur:', error);
                ElMessage.error('Erreur lors du chargement');
            } finally {
                this.loading = false;
            }
        },

        calculateStats() {
            this.stats.totalActes = this.actes.length;
            this.stats.enCours = this.actes.filter(a => a.statut === 'EN_COURS').length;
            this.stats.signes = this.actes.filter(a => a.statut === 'SIGNE' || a.statut === 'ENREGISTRE').length;
            this.stats.aRenouveler = this.actes.filter(a => a.statut === 'ARCHIVE').length;
        },

        initCharts() {
            this.createChartTypes();
            this.createChartEvolution();
        },

        createChartTypes() {
            const ctx = this.$refs.chartTypes?.getContext('2d');
            if (!ctx) return;
            if (this.chartTypes) this.chartTypes.destroy();

            const types = this.actes.reduce((acc, acte) => {
                acc[acte.typeLabel] = (acc[acte.typeLabel] || 0) + 1;
                return acc;
            }, {});

            this.chartTypes = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(types),
                    datasets: [{
                        data: Object.values(types),
                        backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6c757d']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        },

        createChartEvolution() {
            const ctx = this.$refs.chartEvolution?.getContext('2d');
            if (!ctx) return;
            if (this.chartEvolution) this.chartEvolution.destroy();

            this.chartEvolution = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
                    datasets: [{
                        label: 'Actes signés',
                        data: [12, 15, 10, 18, 14, 20, 16, 22, 19, 25, 21, 28],
                        backgroundColor: '#0d6efd'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        },

        filterActes() {
            this.currentPage = 1;
        },

        resetFilters() {
            this.searchQuery = '';
            this.filters = {
                type: '',
                statut: '',
                notaire: ''
            };
            this.currentPage = 1;
        },

        viewActe(acte) {
            this.selectedActe = acte;
        },

        editActe(acte) {
            this.editMode = true;
            this.acteForm = { ...acte };
            this.showCreateModal = true;
        },

        closeCreateModal() {
            this.showCreateModal = false;
            this.editMode = false;
            this.acteForm = {
                id: null,
                type: '',
                notaireId: '',
                partie1: '',
                partie2: '',
                bienConcerne: '',
                dateSignature: '',
                montant: 0,
                notes: ''
            };
        },

        saveActe() {
            try {
                if (!this.acteForm.type || !this.acteForm.partie1 || !this.acteForm.partie2) {
                    ElMessage.warning('Veuillez remplir tous les champs obligatoires');
                    return;
                }

                if (this.editMode) {
                    ElMessage.success('Acte modifié avec succès!');
                } else {
                    ElMessage.success('Acte créé avec succès!');
                }
                this.closeCreateModal();
                this.loadData();
            } catch (error) {
                console.error('Erreur:', error);
                ElMessage.error('Erreur lors de la sauvegarde');
            }
        },

        async signerActe(id) {
            try {
                await ElMessageBox.confirm(
                    'Voulez-vous signer cet acte ?',
                    'Confirmation de signature',
                    {
                        confirmButtonText: 'Signer',
                        cancelButtonText: 'Annuler',
                        type: 'warning'
                    }
                );

                ElMessage.success('Acte signé avec succès!');
                if (this.selectedActe) {
                    this.selectedActe = null;
                }
                this.loadData();
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur:', error);
                    ElMessage.error('Erreur lors de la signature');
                }
            }
        },

        async archiverActe(id) {
            try {
                await ElMessageBox.confirm(
                    'Voulez-vous archiver cet acte ?',
                    'Confirmation',
                    {
                        confirmButtonText: 'Archiver',
                        cancelButtonText: 'Annuler',
                        type: 'warning'
                    }
                );

                ElMessage.success('Acte archivé avec succès!');
                this.loadData();
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur:', error);
                }
            }
        },

        downloadActe(id) {
            ElMessage.success('Téléchargement de l\'acte en cours...');
        },

        exportActes() {
            ElMessage.success('Export en cours...');
        },

        rafraichir() {
            this.loadData();
            ElMessage.success('Données mises à jour !');
        },

        getTypeIcon(type) {
            const icons = {
                'VENTE': 'bi-cash-coin',
                'BAIL': 'bi-house-door',
                'DONATION': 'bi-gift',
                'HYPOTHEQUE': 'bi-bank',
                'SUCCESSION': 'bi-people'
            };
            return icons[type] || 'bi-file-earmark-text';
        },

        getTypeIconClass(type) {
            const classes = {
                'VENTE': 'type-icon-success',
                'BAIL': 'type-icon-primary',
                'DONATION': 'type-icon-warning',
                'HYPOTHEQUE': 'type-icon-info',
                'SUCCESSION': 'type-icon-secondary'
            };
            return classes[type] || 'type-icon-secondary';
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'BROUILLON': 'bg-secondary',
                'EN_COURS': 'bg-warning text-dark',
                'SIGNE': 'bg-success',
                'ENREGISTRE': 'bg-primary',
                'ARCHIVE': 'bg-dark'
            };
            return classes[statut] || 'bg-secondary';
        },

        getStatutLabel(statut) {
            const labels = {
                'BROUILLON': 'Brouillon',
                'EN_COURS': 'En cours',
                'SIGNE': 'Signé',
                'ENREGISTRE': 'Enregistré',
                'ARCHIVE': 'Archivé'
            };
            return labels[statut] || statut;
        },

        getStatutIcon(statut) {
            const icons = {
                'BROUILLON': 'bi-file-earmark',
                'EN_COURS': 'bi-hourglass-split',
                'SIGNE': 'bi-pen',
                'ENREGISTRE': 'bi-check-circle',
                'ARCHIVE': 'bi-archive'
            };
            return icons[statut] || 'bi-file-earmark';
        },

        formatCurrency(amount) {
            if (amount == null) return '—';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0
            }).format(amount);
        },

        formatDate(dateStr) {
            if (!dateStr) return '—';
            return new Date(dateStr).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
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

.table-hover tbody tr:hover {
    background-color: rgba(13, 110, 253, 0.05);
}

.badge {
    font-weight: 500;
    padding: 0.35em 0.65em;
}

.acte-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.type-icon-success {
    background: rgba(25, 135, 84, 0.1);
    color: #198754;
}

.type-icon-primary {
    background: rgba(13, 110, 253, 0.1);
    color: #0d6efd;
}

.type-icon-warning {
    background: rgba(255, 193, 7, 0.1);
    color: #ffc107;
}

.type-icon-info {
    background: rgba(13, 202, 240, 0.1);
    color: #0dcaf0;
}

.type-icon-secondary {
    background: rgba(108, 117, 125, 0.1);
    color: #6c757d;
}

.avatar {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dropdown-menu {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.spinner-border {
    width: 3rem;
    height: 3rem;
}

canvas {
    max-height: 300px;
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

.card {
    transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
    .icon-lg {
        width: 50px;
        height: 50px;
    }

    .table-responsive {
        font-size: 0.875rem;
    }

    .acte-icon {
        width: 30px;
        height: 30px;
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