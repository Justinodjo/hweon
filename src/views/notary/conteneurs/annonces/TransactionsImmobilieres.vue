<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">

            <!-- En-tête -->
            <div class="row">
                <div class="col-sm-12 mb-4">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">
                                <i class="bi bi-cash-stack me-2"></i>Transactions Immobilières
                            </h1>
                            <p class="text-muted mb-0">Suivi complet des ventes, achats et échanges immobiliers</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <button @click="showCreateModal = true" class="btn btn-primary">
                                <i class="bi bi-plus-circle me-1"></i>Nouvelle Transaction
                            </button>
                            <button @click="rafraichir" class="btn btn-outline-primary">
                                <i class="bi bi-arrow-clockwise"></i>
                            </button>
                            <button @click="exportTransactions" class="btn btn-success">
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
                                    <span class="text-muted small">Volume Total</span>
                                    <h3 class="mb-0 mt-2 text-success">{{ formatCurrency(stats.volumeTotal) }}</h3>
                                    <small :class="stats.evolutionVolume >= 0 ? 'text-success' : 'text-danger'">
                                        <i
                                            :class="stats.evolutionVolume >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
                                        {{ Math.abs(stats.evolutionVolume).toFixed(1) }}% vs période précédente
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-success bg-opacity-10 text-success">
                                    <i class="bi bi-cash-coin fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Transactions Réalisées</span>
                                    <h3 class="mb-0 mt-2 text-primary">{{ stats.transactionsRealisees }}</h3>
                                    <small class="text-muted">
                                        <i class="bi bi-check-circle me-1"></i>Complétées
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-primary bg-opacity-10 text-primary">
                                    <i class="bi bi-graph-up-arrow fa-fw fs-4"></i>
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
                                        <i class="bi bi-hourglass-split me-1"></i>En négociation
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-warning bg-opacity-10 text-warning">
                                    <i class="bi bi-clock-history fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Prix Moyen</span>
                                    <h3 class="mb-0 mt-2 text-info">{{ formatCurrency(stats.prixMoyen) }}</h3>
                                    <small class="text-muted">
                                        <i class="bi bi-calculator me-1"></i>Par transaction
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-info bg-opacity-10 text-info">
                                    <i class="bi bi-calculator fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Graphiques -->
                <div class="row g-4 mb-4">
                    <!-- Volume des Transactions -->
                    <div class="col-lg-8">
                        <div class="card shadow-sm h-100">
                            <div class="card-header bg-light d-flex justify-content-between align-items-center">
                                <h6 class="mb-0">Volume des Transactions</h6>
                                <div class="btn-group btn-group-sm">
                                    <button
                                        :class="['btn', periodeGraphique === 'mois' ? 'btn-primary' : 'btn-outline-primary']"
                                        @click="periodeGraphique = 'mois'">Mois</button>
                                    <button
                                        :class="['btn', periodeGraphique === 'trimestre' ? 'btn-primary' : 'btn-outline-primary']"
                                        @click="periodeGraphique = 'trimestre'">Trimestre</button>
                                    <button
                                        :class="['btn', periodeGraphique === 'annee' ? 'btn-primary' : 'btn-outline-primary']"
                                        @click="periodeGraphique = 'annee'">Année</button>
                                </div>
                            </div>
                            <div class="card-body">
                                <canvas ref="chartVolume" height="80"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- Répartition par Type -->
                    <div class="col-lg-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Répartition par Type</h6>
                            </div>
                            <div class="card-body">
                                <canvas ref="chartTypes" height="200"></canvas>
                                <div class="mt-3">
                                    <div v-for="type in typesTransactions" :key="type.nom"
                                        class="d-flex justify-content-between align-items-center mb-2">
                                        <div class="d-flex align-items-center">
                                            <span class="badge me-2" :style="{ backgroundColor: type.couleur }">
                                                {{ type.nombre }}
                                            </span>
                                            <span>{{ type.nom }}</span>
                                        </div>
                                        <small class="text-muted">{{ formatCurrency(type.montant) }}</small>
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
                                    <!-- Recherche -->
                                    <div class="col-md-3">
                                        <div class="position-relative">
                                            <input type="text" class="form-control" placeholder="Rechercher..."
                                                v-model="searchQuery" @input="filterTransactions">
                                            <i
                                                class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>

                                    <!-- Filtre Type -->
                                    <div class="col-md-2">
                                        <select v-model="filters.type" @change="filterTransactions" class="form-select">
                                            <option value="">Tous les types</option>
                                            <option value="VENTE">Vente</option>
                                            <option value="ACHAT">Achat</option>
                                            <option value="LOCATION">Location</option>
                                            <option value="ECHANGE">Échange</option>
                                        </select>
                                    </div>

                                    <!-- Filtre Statut -->
                                    <div class="col-md-2">
                                        <select v-model="filters.statut" @change="filterTransactions"
                                            class="form-select">
                                            <option value="">Tous les statuts</option>
                                            <option value="NEGOCIATION">Négociation</option>
                                            <option value="COMPROMIS">Compromis</option>
                                            <option value="FINALISE">Finalisé</option>
                                            <option value="ANNULE">Annulé</option>
                                        </select>
                                    </div>

                                    <!-- Période -->
                                    <div class="col-md-2">
                                        <input type="month" v-model="filters.periode" @change="filterTransactions"
                                            class="form-control">
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

                <!-- Tableau des Transactions -->
                <div class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light d-flex justify-content-between align-items-center">
                                <h6 class="mb-0">
                                    Liste des Transactions
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ filteredTransactions.length }} transactions
                                    </span>
                                </h6>
                                <button @click="toggleSort" class="btn btn-sm btn-outline-secondary">
                                    <i class="bi" :class="sortAsc ? 'bi-sort-up' : 'bi-sort-down'"></i>
                                    Date
                                </button>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Référence</th>
                                                <th>Type</th>
                                                <th>Bien</th>
                                                <th>Vendeur</th>
                                                <th>Acheteur</th>
                                                <th>Montant</th>
                                                <th>Date</th>
                                                <th>Statut</th>
                                                <th class="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="paginatedTransactions.length === 0">
                                                <td colspan="9" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucune transaction trouvée</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="transaction in paginatedTransactions"
                                                :key="transaction.id">
                                                <td>
                                                    <strong class="text-primary">#{{ transaction.reference }}</strong>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getTypeBadgeClass(transaction.type)">
                                                        <i class="bi" :class="getTypeIcon(transaction.type)"></i>
                                                        {{ transaction.type }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div>
                                                        <strong>{{ transaction.bienNom }}</strong>
                                                        <small class="text-muted d-block">{{ transaction.bienType
                                                        }}</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div
                                                            class="avatar bg-primary bg-opacity-10 rounded-circle me-2 p-2">
                                                            <i class="bi bi-person fs-6 text-primary"></i>
                                                        </div>
                                                        <span>{{ transaction.vendeur }}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div
                                                            class="avatar bg-success bg-opacity-10 rounded-circle me-2 p-2">
                                                            <i class="bi bi-person-check fs-6 text-success"></i>
                                                        </div>
                                                        <span>{{ transaction.acheteur }}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <strong class="text-success">{{
                                                            formatCurrency(transaction.montant) }}</strong>
                                                        <small v-if="transaction.commission" class="text-muted d-block">
                                                            Commission: {{ formatCurrency(transaction.commission) }}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <i class="bi bi-calendar-event me-1"></i>
                                                        {{ formatDate(transaction.dateTransaction) }}
                                                    </div>
                                                    <small class="text-muted d-block">
                                                        {{ formatTime(transaction.dateTransaction) }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <span class="badge"
                                                        :class="getStatutBadgeClass(transaction.statut)">
                                                        <i class="bi" :class="getStatutIcon(transaction.statut)"></i>
                                                        {{ getStatutLabel(transaction.statut) }}
                                                    </span>
                                                </td>
                                                <td class="text-end">
                                                    <div class="dropdown">
                                                        <button class="btn btn-sm btn-light" type="button"
                                                            :id="'dropdown-' + transaction.id"
                                                            data-bs-toggle="dropdown">
                                                            <i class="bi bi-three-dots-vertical"></i>
                                                        </button>
                                                        <ul class="dropdown-menu dropdown-menu-end">
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="viewTransaction(transaction)">
                                                                    <i class="bi bi-eye me-2"></i>Voir détails
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="downloadContrat(transaction.id)">
                                                                    <i class="bi bi-download me-2"></i>Télécharger
                                                                    Contrat
                                                                </a>
                                                            </li>
                                                            <li v-if="transaction.statut === 'NEGOCIATION'">
                                                                <a class="dropdown-item text-success" href="#"
                                                                    @click.prevent="finaliserTransaction(transaction.id)">
                                                                    <i class="bi bi-check-circle me-2"></i>Finaliser
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <hr class="dropdown-divider">
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="editTransaction(transaction)">
                                                                    <i class="bi bi-pencil me-2"></i>Modifier
                                                                </a>
                                                            </li>
                                                            <li v-if="transaction.statut !== 'FINALISE'">
                                                                <a class="dropdown-item text-danger" href="#"
                                                                    @click.prevent="annulerTransaction(transaction.id)">
                                                                    <i class="bi bi-x-circle me-2"></i>Annuler
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
                                <div v-if="filteredTransactions.length > perPage" class="card-footer border-top">
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

        <!-- Modal Détails Transaction -->
        <div v-if="selectedTransaction" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);"
            tabindex="-1">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Transaction #{{ selectedTransaction.reference }}
                            <span class="badge ms-2" :class="getStatutBadgeClass(selectedTransaction.statut)">
                                {{ getStatutLabel(selectedTransaction.statut) }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedTransaction = null"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-4">
                            <!-- Informations Transaction -->
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-info-circle me-2"></i>Informations Transaction
                                        </h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Type</label>
                                            <p class="mb-0 fw-bold">{{ selectedTransaction.type }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Date</label>
                                            <p class="mb-0">{{ formatDateTime(selectedTransaction.dateTransaction) }}
                                            </p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Montant</label>
                                            <p class="mb-0 fw-bold text-success fs-5">
                                                {{ formatCurrency(selectedTransaction.montant) }}
                                            </p>
                                        </div>
                                        <div v-if="selectedTransaction.commission" class="mb-2">
                                            <label class="text-muted small">Commission</label>
                                            <p class="mb-0">{{ formatCurrency(selectedTransaction.commission) }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Bien Concerné -->
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-building me-2"></i>Bien Concerné
                                        </h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Nom</label>
                                            <p class="mb-0 fw-bold">{{ selectedTransaction.bienNom }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Type</label>
                                            <p class="mb-0">{{ selectedTransaction.bienType }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Adresse</label>
                                            <p class="mb-0">{{ selectedTransaction.bienAdresse }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Parties -->
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-person me-2"></i>Vendeur
                                        </h6>
                                        <p class="mb-0 fw-bold">{{ selectedTransaction.vendeur }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-person-check me-2"></i>Acheteur
                                        </h6>
                                        <p class="mb-0 fw-bold">{{ selectedTransaction.acheteur }}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Notes -->
                            <div class="col-12" v-if="selectedTransaction.notes">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-file-text me-2"></i>Notes
                                        </h6>
                                        <p class="mb-0">{{ selectedTransaction.notes }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="selectedTransaction = null">
                            Fermer
                        </button>
                        <button type="button" class="btn btn-info" @click="downloadContrat(selectedTransaction.id)">
                            <i class="bi bi-download me-1"></i>Télécharger Contrat
                        </button>
                        <button v-if="selectedTransaction.statut === 'NEGOCIATION'" type="button"
                            class="btn btn-success" @click="finaliserTransaction(selectedTransaction.id)">
                            <i class="bi bi-check-circle me-1"></i>Finaliser
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Création Transaction -->
        <div v-if="showCreateModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Nouvelle Transaction</h5>
                        <button type="button" class="btn-close" @click="closeCreateModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Type *</label>
                                <select v-model="transactionForm.type" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="VENTE">Vente</option>
                                    <option value="ACHAT">Achat</option>
                                    <option value="LOCATION">Location</option>
                                    <option value="ECHANGE">Échange</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Bien *</label>
                                <select v-model="transactionForm.bienId" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="1">Appartement A1</option>
                                    <option value="2">Villa B2</option>
                                    <option value="3">Bureau C3</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Vendeur *</label>
                                <input type="text" v-model="transactionForm.vendeur" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Acheteur *</label>
                                <input type="text" v-model="transactionForm.acheteur" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Montant (XOF) *</label>
                                <input type="number" v-model.number="transactionForm.montant" class="form-control"
                                    required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date de transaction *</label>
                                <input type="date" v-model="transactionForm.dateTransaction" class="form-control"
                                    required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Commission (XOF)</label>
                                <input type="number" v-model.number="transactionForm.commission" class="form-control">
                            </div>
                            <div class="col-12">
                                <label class="form-label">Notes</label>
                                <textarea v-model="transactionForm.notes" class="form-control" rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeCreateModal">
                            Annuler
                        </button>
                        <button type="button" class="btn btn-primary" @click="saveTransaction">
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
    name: 'TransactionsImmobilieres',

    data() {
        return {
            loading: true,
            searchQuery: '',
            sortAsc: false,
            currentPage: 1,
            perPage: 10,
            selectedTransaction: null,
            showCreateModal: false,
            editMode: false,
            periodeGraphique: 'mois',

            filters: {
                type: '',
                statut: '',
                periode: ''
            },

            transactionForm: {
                id: null,
                type: '',
                bienId: '',
                vendeur: '',
                acheteur: '',
                montant: 0,
                commission: 0,
                dateTransaction: '',
                notes: ''
            },

            transactions: [],
            stats: {
                volumeTotal: 0,
                evolutionVolume: 0,
                transactionsRealisees: 0,
                enCours: 0,
                prixMoyen: 0
            },

            typesTransactions: [],
            chartVolume: null,
            chartTypes: null
        };
    },

    computed: {
        filteredTransactions() {
            let result = [...this.transactions];

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(t =>
                    t.reference.toLowerCase().includes(query) ||
                    t.vendeur.toLowerCase().includes(query) ||
                    t.acheteur.toLowerCase().includes(query) ||
                    t.bienNom.toLowerCase().includes(query)
                );
            }

            if (this.filters.type) {
                result = result.filter(t => t.type === this.filters.type);
            }

            if (this.filters.statut) {
                result = result.filter(t => t.statut === this.filters.statut);
            }

            if (this.filters.periode) {
                result = result.filter(t => {
                    const tMonth = t.dateTransaction.substring(0, 7);
                    return tMonth === this.filters.periode;
                });
            }

            result.sort((a, b) => {
                const dateA = new Date(a.dateTransaction);
                const dateB = new Date(b.dateTransaction);
                return this.sortAsc ? dateA - dateB : dateB - dateA;
            });

            return result;
        },

        paginatedTransactions() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredTransactions.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.filteredTransactions.length / this.perPage);
        }
    },

    async mounted() {
        await this.loadData();
    },

    beforeDestroy() {
        if (this.chartVolume) this.chartVolume.destroy();
        if (this.chartTypes) this.chartTypes.destroy();
    },

    methods: {
        async loadData() {
            try {
                this.loading = true;

                // Générer des données de démonstration
                this.transactions = Array.from({ length: 40 }, (_, i) => ({
                    id: i + 1,
                    reference: `TRX-${String(i + 1).padStart(4, '0')}`,
                    type: ['VENTE', 'ACHAT', 'LOCATION', 'ECHANGE'][Math.floor(Math.random() * 4)],
                    bienNom: `Bien ${i + 1}`,
                    bienType: ['Appartement', 'Villa', 'Bureau', 'Commerce'][Math.floor(Math.random() * 4)],
                    bienAdresse: `Adresse ${i + 1}, Abidjan`,
                    vendeur: `Vendeur ${i + 1}`,
                    acheteur: `Acheteur ${i + 1}`,
                    montant: Math.floor(Math.random() * 80000000) + 20000000,
                    commission: Math.floor(Math.random() * 2000000) + 500000,
                    dateTransaction: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
                    statut: ['NEGOCIATION', 'COMPROMIS', 'FINALISE', 'ANNULE'][Math.floor(Math.random() * 4)],
                    notes: Math.random() > 0.5 ? 'Notes importantes sur cette transaction' : null
                }));

                this.calculateStats();
                this.calculateTypesTransactions();

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
            const finalises = this.transactions.filter(t => t.statut === 'FINALISE');
            const enCours = this.transactions.filter(t => t.statut === 'NEGOCIATION' || t.statut === 'COMPROMIS');

            this.stats.volumeTotal = finalises.reduce((sum, t) => sum + t.montant, 0);
            this.stats.evolutionVolume = Math.random() * 20 - 5;
            this.stats.transactionsRealisees = finalises.length;
            this.stats.enCours = enCours.length;
            this.stats.prixMoyen = finalises.length > 0 ? this.stats.volumeTotal / finalises.length : 0;
        },

        calculateTypesTransactions() {
            const types = this.transactions.reduce((acc, t) => {
                if (!acc[t.type]) {
                    acc[t.type] = { nombre: 0, montant: 0 };
                }
                acc[t.type].nombre++;
                if (t.statut === 'FINALISE') {
                    acc[t.type].montant += t.montant;
                }
                return acc;
            }, {});

            const couleurs = ['#0d6efd', '#198754', '#ffc107', '#dc3545'];
            this.typesTransactions = Object.entries(types).map(([nom, data], index) => ({
                nom,
                nombre: data.nombre,
                montant: data.montant,
                couleur: couleurs[index % couleurs.length]
            }));
        },

        initCharts() {
            this.createChartVolume();
            this.createChartTypes();
        },

        createChartVolume() {
            const ctx = this.$refs.chartVolume?.getContext('2d');
            if (!ctx) return;
            if (this.chartVolume) this.chartVolume.destroy();

            this.chartVolume = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
                    datasets: [
                        {
                            label: 'Volume (Millions XOF)',
                            data: [150, 180, 160, 200, 220, 190, 240, 260, 230, 280, 300, 320],
                            borderColor: '#198754',
                            backgroundColor: 'rgba(25, 135, 84, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Nombre de transactions',
                            data: [8, 12, 10, 15, 14, 11, 16, 18, 15, 20, 19, 22],
                            borderColor: '#0d6efd',
                            backgroundColor: 'rgba(13, 110, 253, 0.1)',
                            tension: 0.4,
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left'
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            grid: {
                                drawOnChartArea: false
                            }
                        }
                    }
                }
            });
        },

        createChartTypes() {
            const ctx = this.$refs.chartTypes?.getContext('2d');
            if (!ctx) return;
            if (this.chartTypes) this.chartTypes.destroy();

            this.chartTypes = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: this.typesTransactions.map(t => t.nom),
                    datasets: [{
                        data: this.typesTransactions.map(t => t.nombre),
                        backgroundColor: this.typesTransactions.map(t => t.couleur)
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

        toggleSort() {
            this.sortAsc = !this.sortAsc;
        },

        filterTransactions() {
            this.currentPage = 1;
        },

        resetFilters() {
            this.searchQuery = '';
            this.filters = {
                type: '',
                statut: '',
                periode: ''
            };
            this.currentPage = 1;
        },

        viewTransaction(transaction) {
            this.selectedTransaction = transaction;
        },

        editTransaction(transaction) {
            this.editMode = true;
            this.transactionForm = { ...transaction };
            this.showCreateModal = true;
        },

        closeCreateModal() {
            this.showCreateModal = false;
            this.editMode = false;
            this.transactionForm = {
                id: null,
                type: '',
                bienId: '',
                vendeur: '',
                acheteur: '',
                montant: 0,
                commission: 0,
                dateTransaction: '',
                notes: ''
            };
        },

        saveTransaction() {
            try {
                if (!this.transactionForm.type || !this.transactionForm.vendeur || !this.transactionForm.acheteur) {
                    ElMessage.warning('Veuillez remplir tous les champs obligatoires');
                    return;
                }

                if (this.editMode) {
                    ElMessage.success('Transaction modifiée avec succès!');
                } else {
                    ElMessage.success('Transaction créée avec succès!');
                }
                this.closeCreateModal();
                this.loadData();
            } catch (error) {
                console.error('Erreur:', error);
                ElMessage.error('Erreur lors de la sauvegarde');
            }
        },

        async finaliserTransaction(id) {
            try {
                await ElMessageBox.confirm(
                    'Voulez-vous finaliser cette transaction ?',
                    'Confirmation',
                    {
                        confirmButtonText: 'Finaliser',
                        cancelButtonText: 'Annuler',
                        type: 'warning'
                    }
                );

                ElMessage.success('Transaction finalisée avec succès!');
                if (this.selectedTransaction) {
                    this.selectedTransaction = null;
                }
                this.loadData();
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur:', error);
                    ElMessage.error('Erreur lors de la finalisation');
                }
            }
        },

        async annulerTransaction(id) {
            try {
                await ElMessageBox.confirm(
                    'Voulez-vous annuler cette transaction ?',
                    'Confirmation',
                    {
                        confirmButtonText: 'Annuler la transaction',
                        cancelButtonText: 'Retour',
                        type: 'warning'
                    }
                );

                ElMessage.success('Transaction annulée');
                this.loadData();
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur:', error);
                }
            }
        },

        downloadContrat(id) {
            ElMessage.success('Téléchargement du contrat en cours...');
        },

        exportTransactions() {
            ElMessage.success('Export en cours...');
        },

        rafraichir() {
            this.loadData();
            ElMessage.success('Données mises à jour !');
        },

        getTypeBadgeClass(type) {
            const classes = {
                'VENTE': 'bg-success',
                'ACHAT': 'bg-primary',
                'LOCATION': 'bg-info',
                'ECHANGE': 'bg-warning text-dark'
            };
            return classes[type] || 'bg-secondary';
        },

        getTypeIcon(type) {
            const icons = {
                'VENTE': 'bi-cash-coin',
                'ACHAT': 'bi-cart-check',
                'LOCATION': 'bi-house-door',
                'ECHANGE': 'bi-arrow-left-right'
            };
            return icons[type] || 'bi-circle';
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'NEGOCIATION': 'bg-warning text-dark',
                'COMPROMIS': 'bg-info',
                'FINALISE': 'bg-success',
                'ANNULE': 'bg-danger'
            };
            return classes[statut] || 'bg-secondary';
        },

        getStatutLabel(statut) {
            const labels = {
                'NEGOCIATION': 'Négociation',
                'COMPROMIS': 'Compromis',
                'FINALISE': 'Finalisé',
                'ANNULE': 'Annulé'
            };
            return labels[statut] || statut;
        },

        getStatutIcon(statut) {
            const icons = {
                'NEGOCIATION': 'bi-chat-dots',
                'COMPROMIS': 'bi-file-earmark-text',
                'FINALISE': 'bi-check-circle',
                'ANNULE': 'bi-x-circle'
            };
            return icons[statut] || 'bi-circle';
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
                month: 'short',
                day: 'numeric'
            });
        },

        formatTime(dateStr) {
            if (!dateStr) return '—';
            return new Date(dateStr).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        formatDateTime(dateStr) {
            if (!dateStr) return '—';
            return new Date(dateStr).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
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

    .avatar {
        width: 28px;
        height: 28px;
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