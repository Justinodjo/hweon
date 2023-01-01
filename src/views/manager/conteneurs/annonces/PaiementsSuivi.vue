<template>
    <main>
        <div class="page-content pt-0 bloc">
            <div class="page-content-wrapper vstack container gap-4">

                <!-- En-tête -->
                <div class="row">
                    <div class="col-sm-12 mb-4">
                        <div class="d-sm-flex justify-content-between align-items-center">
                            <div>
                                <h1 class="h3 mb-2">
                                    <i class="bi bi-cash-stack me-2"></i>Suivi des Paiements
                                </h1>
                                <p class="text-muted mb-0">Gestion complète des paiements et loyers</p>
                            </div>
                            <div class="d-flex gap-2 mt-3 mt-sm-0">
                                <button @click="showCreateModal = true" class="btn btn-primary">
                                    <i class="bi bi-plus-circle me-1"></i>Nouveau Paiement
                                </button>
                                <button @click="envoyerRappels" class="btn btn-warning">
                                    <i class="bi bi-bell me-1"></i>Rappels
                                </button>
                                <button @click="rafraichir" class="btn btn-outline-primary">
                                    <i class="bi bi-arrow-clockwise"></i>
                                </button>
                                <button @click="exportPaiements" class="btn btn-success">
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
                                        <span class="text-muted small">Total Encaissé</span>
                                        <h3 class="mb-0 mt-2 text-success">{{ formatCurrency(stats.totalEncaisse) }}
                                        </h3>
                                        <small class="text-muted">
                                            <i class="bi bi-check-circle me-1"></i>Ce mois
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
                                        <span class="text-muted small">En Attente</span>
                                        <h3 class="mb-0 mt-2 text-warning">{{ formatCurrency(stats.enAttente) }}</h3>
                                        <small class="text-muted">
                                            {{ stats.nombreEnAttente }} paiement(s)
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
                                        <span class="text-muted small">En Retard</span>
                                        <h3 class="mb-0 mt-2 text-danger">{{ formatCurrency(stats.enRetard) }}</h3>
                                        <small class="text-danger">
                                            <i class="bi bi-exclamation-triangle me-1"></i>{{ stats.nombreEnRetard }}
                                            impayé(s)
                                        </small>
                                    </div>
                                    <div class="icon-lg rounded-circle bg-danger bg-opacity-10 text-danger">
                                        <i class="bi bi-exclamation-triangle fa-fw fs-4"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-6 col-xl-3">
                            <div class="card card-body shadow-sm h-100">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <span class="text-muted small">Taux de Recouvrement</span>
                                        <h3 class="mb-0 mt-2 text-primary">{{ stats.tauxRecouvrement }}%</h3>
                                        <small class="text-muted">
                                            <i class="bi bi-graph-up me-1"></i>Performance
                                        </small>
                                    </div>
                                    <div class="icon-lg rounded-circle bg-primary bg-opacity-10 text-primary">
                                        <i class="bi bi-graph-up-arrow fa-fw fs-4"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Graphiques -->
                    <div class="row g-4 mb-4">
                        <!-- Évolution des Paiements -->
                        <div class="col-lg-8">
                            <div class="card shadow-sm h-100">
                                <div class="card-header bg-light">
                                    <h6 class="mb-0">Évolution des Encaissements</h6>
                                </div>
                                <div class="card-body">
                                    <canvas ref="chartPaiements" height="80"></canvas>
                                </div>
                            </div>
                        </div>

                        <!-- Modes de Paiement -->
                        <div class="col-lg-4">
                            <div class="card shadow-sm h-100">
                                <div class="card-header bg-light">
                                    <h6 class="mb-0">Modes de Paiement</h6>
                                </div>
                                <div class="card-body">
                                    <canvas ref="chartModes" height="200"></canvas>
                                    <div class="mt-3">
                                        <div v-for="method in paymentMethods" :key="method.name"
                                            class="d-flex justify-content-between align-items-center mb-2">
                                            <div class="d-flex align-items-center">
                                                <span class="badge me-2" :style="{ backgroundColor: method.color }">
                                                    {{ method.percentage }}%
                                                </span>
                                                <span>{{ method.name }}</span>
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
                                        <!-- Recherche -->
                                        <div class="col-md-3">
                                            <div class="position-relative">
                                                <input type="text" class="form-control" placeholder="Rechercher..."
                                                    v-model="searchQuery" @input="filterPaiements">
                                                <i
                                                    class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                            </div>
                                        </div>

                                        <!-- Filtre Statut -->
                                        <div class="col-md-2">
                                            <select v-model="filters.statut" @change="filterPaiements"
                                                class="form-select">
                                                <option value="">Tous les statuts</option>
                                                <option value="PAYE">Payé</option>
                                                <option value="EN_ATTENTE">En attente</option>
                                                <option value="EN_RETARD">En retard</option>
                                                <option value="PARTIEL">Partiel</option>
                                            </select>
                                        </div>

                                        <!-- Filtre Mois -->
                                        <div class="col-md-2">
                                            <input type="month" v-model="filters.mois" @change="filterPaiements"
                                                class="form-control">
                                        </div>

                                        <!-- Filtre Mode -->
                                        <div class="col-md-2">
                                            <select v-model="filters.mode" @change="filterPaiements"
                                                class="form-select">
                                                <option value="">Tous les modes</option>
                                                <option value="VIREMENT">Virement</option>
                                                <option value="ESPECES">Espèces</option>
                                                <option value="MOBILE_MONEY">Mobile Money</option>
                                                <option value="CHEQUE">Chèque</option>
                                            </select>
                                        </div>

                                        <!-- Actions -->
                                        <div class="col-md-3">
                                            <button @click="resetFilters" class="btn btn-secondary w-100">
                                                <i class="bi bi-arrow-counterclockwise me-1"></i>Réinitialiser
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Actions en masse -->
                                    <div v-if="selectedPaiements.length > 0"
                                        class="mt-3 alert alert-info d-flex justify-content-between align-items-center">
                                        <span>{{ selectedPaiements.length }} paiement(s) sélectionné(s)</span>
                                        <div class="btn-group">
                                            <button @click="marquerPayes" class="btn btn-sm btn-success">
                                                <i class="bi bi-check-circle me-1"></i>Marquer Payé
                                            </button>
                                            <button @click="envoyerRappelsSelection" class="btn btn-sm btn-warning">
                                                <i class="bi bi-bell me-1"></i>Envoyer Rappels
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tableau des Paiements -->
                    <div class="row">
                        <div class="col-12">
                            <div class="card shadow-sm">
                                <div class="card-header bg-light d-flex justify-content-between align-items-center">
                                    <h6 class="mb-0">
                                        Liste des Paiements
                                        <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                            {{ filteredPaiements.length }} paiements
                                        </span>
                                    </h6>
                                    <button @click="toggleSort" class="btn btn-sm btn-outline-secondary">
                                        <i class="bi" :class="sortAsc ? 'bi-sort-up' : 'bi-sort-down'"></i>
                                        Échéance
                                    </button>
                                </div>
                                <div class="card-body p-0">
                                    <div class="table-responsive">
                                        <table class="table table-hover mb-0">
                                            <thead class="table-light">
                                                <tr>
                                                    <th style="width: 40px;">
                                                        <input type="checkbox" class="form-check-input"
                                                            :checked="allSelected" @change="toggleSelectAll">
                                                    </th>
                                                    <th>Référence</th>
                                                    <th>Locataire</th>
                                                    <th>Propriété</th>
                                                    <th>Montant</th>
                                                    <th>Échéance</th>
                                                    <th>Mode</th>
                                                    <th>Statut</th>
                                                    <th class="text-end">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-if="paginatedPaiements.length === 0">
                                                    <td colspan="9" class="text-center py-5">
                                                        <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                        <p class="text-muted mb-0">Aucun paiement trouvé</p>
                                                    </td>
                                                </tr>
                                                <tr v-else v-for="paiement in paginatedPaiements" :key="paiement.id">
                                                    <td>
                                                        <input type="checkbox" class="form-check-input"
                                                            :checked="isSelected(paiement.id)"
                                                            @change="toggleSelection(paiement.id)">
                                                    </td>
                                                    <td>
                                                        <strong class="text-primary">#{{ paiement.reference }}</strong>
                                                    </td>
                                                    <td>{{ paiement.locataireNom }}</td>
                                                    <td>
                                                        <div>
                                                            <strong>{{ paiement.bienNom }}</strong>
                                                            <small class="text-muted d-block">{{ paiement.bienAdresse
                                                            }}</small>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <strong>{{ formatCurrency(paiement.montant) }}</strong>
                                                        <small v-if="paiement.montantPaye" class="text-muted d-block">
                                                            Payé: {{ formatCurrency(paiement.montantPaye) }}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <div :class="getEcheanceClass(paiement.dateEcheance)">
                                                            <i class="bi bi-calendar-event me-1"></i>
                                                            {{ formatDate(paiement.dateEcheance) }}
                                                        </div>
                                                        <small
                                                            v-if="isEnRetard(paiement.dateEcheance) && paiement.statut !== 'PAYE'"
                                                            class="text-danger d-block">
                                                            <i class="bi bi-exclamation-triangle me-1"></i>
                                                            {{ getJoursRetard(paiement.dateEcheance) }} jours de retard
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <span v-if="paiement.modePaiement">
                                                            <i class="bi"
                                                                :class="getModeIcon(paiement.modePaiement) + ' me-1'"></i>
                                                            {{ paiement.modePaiement }}
                                                        </span>
                                                        <span v-else class="text-muted">—</span>
                                                    </td>
                                                    <td>
                                                        <span class="badge"
                                                            :class="getStatutBadgeClass(paiement.statut)">
                                                            <i class="bi" :class="getStatutIcon(paiement.statut)"></i>
                                                            {{ getStatutLabel(paiement.statut) }}
                                                        </span>
                                                    </td>
                                                    <td class="text-end">
                                                        <div class="dropdown">
                                                            <button class="btn btn-sm btn-light" type="button"
                                                                :id="'dropdown-' + paiement.id"
                                                                data-bs-toggle="dropdown">
                                                                <i class="bi bi-three-dots-vertical"></i>
                                                            </button>
                                                            <ul class="dropdown-menu dropdown-menu-end">
                                                                <li>
                                                                    <a class="dropdown-item" href="#"
                                                                        @click.prevent="viewPaiement(paiement)">
                                                                        <i class="bi bi-eye me-2"></i>Voir détails
                                                                    </a>
                                                                </li>
                                                                <li v-if="paiement.statut === 'PAYE'">
                                                                    <a class="dropdown-item" href="#"
                                                                        @click.prevent="downloadRecu(paiement.id)">
                                                                        <i class="bi bi-download me-2"></i>Télécharger
                                                                        Reçu
                                                                    </a>
                                                                </li>
                                                                <li v-if="paiement.statut !== 'PAYE'">
                                                                    <a class="dropdown-item text-success" href="#"
                                                                        @click.prevent="marquerPaye(paiement.id)">
                                                                        <i class="bi bi-check-circle me-2"></i>Marquer
                                                                        Payé
                                                                    </a>
                                                                </li>
                                                                <li v-if="paiement.statut !== 'PAYE'">
                                                                    <a class="dropdown-item text-warning" href="#"
                                                                        @click.prevent="envoyerRappel(paiement.id)">
                                                                        <i class="bi bi-bell me-2"></i>Envoyer Rappel
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <hr class="dropdown-divider">
                                                                </li>
                                                                <li>
                                                                    <a class="dropdown-item" href="#"
                                                                        @click.prevent="editPaiement(paiement)">
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
                                    <div v-if="filteredPaiements.length > perPage" class="card-footer border-top">
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
                                                    <a class="page-link" href="#"
                                                        @click.prevent="currentPage++">Suivant</a>
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

            <!-- Modal Détails Paiement -->
            <div v-if="selectedPaiement" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);"
                tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                Paiement #{{ selectedPaiement.reference }}
                                <span class="badge ms-2" :class="getStatutBadgeClass(selectedPaiement.statut)">
                                    {{ getStatutLabel(selectedPaiement.statut) }}
                                </span>
                            </h5>
                            <button type="button" class="btn-close" @click="selectedPaiement = null"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row g-4">
                                <!-- Informations Propriété -->
                                <div class="col-md-6">
                                    <div class="card bg-light border-0">
                                        <div class="card-body">
                                            <h6 class="mb-3">
                                                <i class="bi bi-building me-2"></i>Propriété
                                            </h6>
                                            <div class="mb-2">
                                                <label class="text-muted small">Nom</label>
                                                <p class="mb-0 fw-bold">{{ selectedPaiement.bienNom }}</p>
                                            </div>
                                            <div class="mb-2">
                                                <label class="text-muted small">Adresse</label>
                                                <p class="mb-0">{{ selectedPaiement.bienAdresse }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Informations Locataire -->
                                <div class="col-md-6">
                                    <div class="card bg-light border-0">
                                        <div class="card-body">
                                            <h6 class="mb-3">
                                                <i class="bi bi-person me-2"></i>Locataire
                                            </h6>
                                            <div class="mb-2">
                                                <label class="text-muted small">Nom</label>
                                                <p class="mb-0 fw-bold">{{ selectedPaiement.locataireNom }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Détails Paiement -->
                                <div class="col-12">
                                    <div class="card bg-light border-0">
                                        <div class="card-body">
                                            <h6 class="mb-3">
                                                <i class="bi bi-cash-stack me-2"></i>Détails du Paiement
                                            </h6>
                                            <div class="row g-3">
                                                <div class="col-md-4">
                                                    <label class="text-muted small">Montant</label>
                                                    <p class="mb-0 fw-bold fs-5 text-success">
                                                        {{ formatCurrency(selectedPaiement.montant) }}
                                                    </p>
                                                </div>
                                                <div class="col-md-4">
                                                    <label class="text-muted small">Date d'échéance</label>
                                                    <p class="mb-0">{{ formatDate(selectedPaiement.dateEcheance) }}</p>
                                                </div>
                                                <div class="col-md-4" v-if="selectedPaiement.datePaiement">
                                                    <label class="text-muted small">Date de paiement</label>
                                                    <p class="mb-0">{{ formatDate(selectedPaiement.datePaiement) }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="selectedPaiement = null">
                                Fermer
                            </button>
                            <button v-if="selectedPaiement.statut === 'PAYE'" type="button" class="btn btn-info"
                                @click="downloadRecu(selectedPaiement.id)">
                                <i class="bi bi-download me-1"></i>Télécharger Reçu
                            </button>
                            <button v-if="selectedPaiement.statut !== 'PAYE'" type="button" class="btn btn-success"
                                @click="marquerPaye(selectedPaiement.id)">
                                <i class="bi bi-check-circle me-1"></i>Marquer Payé
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Marquer Payé -->
            <div v-if="showPaymentModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);"
                tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Enregistrer le Paiement</h5>
                            <button type="button" class="btn-close" @click="showPaymentModal = false"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row g-3">
                                <div class="col-12">
                                    <label class="form-label">Mode de paiement *</label>
                                    <select v-model="paymentForm.modePaiement" class="form-select" required>
                                        <option value="">Sélectionner</option>
                                        <option value="VIREMENT">Virement</option>
                                        <option value="ESPECES">Espèces</option>
                                        <option value="CHEQUE">Chèque</option>
                                        <option value="MOBILE_MONEY">Mobile Money</option>
                                        <option value="CARTE">Carte bancaire</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label class="form-label">Date de paiement *</label>
                                    <input type="date" v-model="paymentForm.datePaiement" class="form-control" required>
                                </div>
                                <div class="col-12">
                                    <label class="form-label">Montant payé (XOF) *</label>
                                    <input type="number" v-model.number="paymentForm.montantPaye" class="form-control"
                                        required>
                                </div>
                                <div class="col-12">
                                    <label class="form-label">N° de transaction</label>
                                    <input type="text" v-model="paymentForm.numeroTransaction" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="showPaymentModal = false">
                                Annuler
                            </button>
                            <button type="button" class="btn btn-success" @click="confirmMarquerPaye">
                                <i class="bi bi-check-circle me-1"></i>Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Création Paiement -->
            <div v-if="showCreateModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);"
                tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Nouveau Paiement</h5>
                            <button type="button" class="btn-close" @click="closeCreateModal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">Locataire *</label>
                                    <select v-model="paiementForm.locataireId" class="form-select" required>
                                        <option value="">Sélectionner</option>
                                        <option value="1">Locataire 1</option>
                                        <option value="2">Locataire 2</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Propriété *</label>
                                    <select v-model="paiementForm.bienId" class="form-select" required>
                                        <option value="">Sélectionner</option>
                                        <option value="1">Appartement A1</option>
                                        <option value="2">Villa B2</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Montant (XOF) *</label>
                                    <input type="number" v-model.number="paiementForm.montant" class="form-control"
                                        required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Date d'échéance *</label>
                                    <input type="date" v-model="paiementForm.dateEcheance" class="form-control"
                                        required>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeCreateModal">
                                Annuler
                            </button>
                            <button type="button" class="btn btn-primary" @click="savePaiement">
                                <i class="bi bi-check-circle me-1"></i>Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';
import Chart from 'chart.js/auto';

export default {
    name: 'SuiviPaiements',

    data() {
        return {
            loading: true,
            searchQuery: '',
            sortAsc: false,
            currentPage: 1,
            perPage: 15,
            selectedPaiement: null,
            showCreateModal: false,
            showPaymentModal: false,
            editMode: false,
            selectedPaiements: [],

            filters: {
                statut: '',
                propriete: '',
                mois: '',
                mode: ''
            },

            paiementForm: {
                id: null,
                locataireId: '',
                bienId: '',
                montant: 0,
                dateEcheance: '',
                statut: 'EN_ATTENTE'
            },

            paymentForm: {
                paiementId: null,
                modePaiement: '',
                datePaiement: new Date().toISOString().split('T')[0],
                montantPaye: 0,
                numeroTransaction: ''
            },

            paiements: [],
            paymentMethods: [
                { name: 'Virement', percentage: 45, color: '#0d6efd' },
                { name: 'Espèces', percentage: 30, color: '#198754' },
                { name: 'Mobile Money', percentage: 20, color: '#ffc107' },
                { name: 'Chèque', percentage: 5, color: '#6c757d' }
            ],

            chartPaiements: null,
            chartModes: null
        };
    },

    computed: {
        stats() {
            const payes = this.paiements.filter(p => p.statut === 'PAYE');
            const enAttente = this.paiements.filter(p => p.statut === 'EN_ATTENTE');
            const enRetard = this.paiements.filter(p => p.statut === 'EN_RETARD');

            const totalEncaisse = payes.reduce((sum, p) => sum + (p.montantPaye || p.montant), 0);
            const totalEnAttente = enAttente.reduce((sum, p) => sum + p.montant, 0);
            const totalEnRetard = enRetard.reduce((sum, p) => sum + p.montant, 0);

            const tauxRecouvrement = this.paiements.length > 0
                ? Math.round((payes.length / this.paiements.length) * 100)
                : 0;

            return {
                totalEncaisse,
                enAttente: totalEnAttente,
                nombreEnAttente: enAttente.length,
                enRetard: totalEnRetard,
                nombreEnRetard: enRetard.length,
                tauxRecouvrement
            };
        },

        filteredPaiements() {
            let result = [...this.paiements];

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(p =>
                    p.reference.toLowerCase().includes(query) ||
                    p.locataireNom.toLowerCase().includes(query) ||
                    p.bienNom.toLowerCase().includes(query)
                );
            }

            if (this.filters.statut) {
                result = result.filter(p => p.statut === this.filters.statut);
            }

            if (this.filters.mois) {
                result = result.filter(p => {
                    const pMonth = p.dateEcheance.substring(0, 7);
                    return pMonth === this.filters.mois;
                });
            }

            if (this.filters.mode) {
                result = result.filter(p => p.modePaiement === this.filters.mode);
            }

            result.sort((a, b) => {
                const dateA = new Date(a.dateEcheance);
                const dateB = new Date(b.dateEcheance);
                return this.sortAsc ? dateA - dateB : dateB - dateA;
            });

            return result;
        },

        paginatedPaiements() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredPaiements.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.filteredPaiements.length / this.perPage);
        },

        allSelected() {
            return this.paginatedPaiements.length > 0 &&
                this.paginatedPaiements.every(p => this.selectedPaiements.includes(p.id));
        }
    },

    async mounted() {
        await this.loadData();
    },

    beforeDestroy() {
        if (this.chartPaiements) this.chartPaiements.destroy();
        if (this.chartModes) this.chartModes.destroy();
    },

    methods: {
        async loadData() {
            try {
                this.loading = true;

                // Générer des données de démonstration
                this.paiements = Array.from({ length: 50 }, (_, i) => ({
                    id: i + 1,
                    reference: `PAY-${String(i + 1).padStart(4, '0')}`,
                    locataireNom: `Locataire ${i + 1}`,
                    bienNom: `Bien ${i + 1}`,
                    bienAdresse: `Adresse ${i + 1}`,
                    montant: Math.floor(Math.random() * 300000) + 100000,
                    montantPaye: Math.random() > 0.3 ? Math.floor(Math.random() * 300000) + 100000 : null,
                    dateEcheance: new Date(2024, 10, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
                    datePaiement: Math.random() > 0.5 ? new Date(2024, 10, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0] : null,
                    statut: ['PAYE', 'EN_ATTENTE', 'EN_RETARD', 'PARTIEL'][Math.floor(Math.random() * 4)],
                    modePaiement: Math.random() > 0.5 ? ['VIREMENT', 'ESPECES', 'MOBILE_MONEY', 'CHEQUE'][Math.floor(Math.random() * 4)] : null
                }));

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

        initCharts() {
            this.createChartPaiements();
            this.createChartModes();
        },

        createChartPaiements() {
            const ctx = this.$refs.chartPaiements?.getContext('2d');
            if (!ctx) return;
            if (this.chartPaiements) this.chartPaiements.destroy();

            this.chartPaiements = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
                    datasets: [
                        {
                            label: 'Encaissements',
                            data: [850000, 920000, 880000, 950000, 1000000, 980000, 1050000, 1100000, 1080000, 1150000, 1200000, 1250000],
                            borderColor: '#198754',
                            backgroundColor: 'rgba(25, 135, 84, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Attendu',
                            data: [1000000, 1000000, 1000000, 1000000, 1200000, 1200000, 1200000, 1200000, 1200000, 1300000, 1300000, 1300000],
                            borderColor: '#0d6efd',
                            backgroundColor: 'rgba(13, 110, 253, 0.1)',
                            borderDash: [5, 5],
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        },

        createChartModes() {
            const ctx = this.$refs.chartModes?.getContext('2d');
            if (!ctx) return;
            if (this.chartModes) this.chartModes.destroy();

            this.chartModes = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: this.paymentMethods.map(m => m.name),
                    datasets: [{
                        data: this.paymentMethods.map(m => m.percentage),
                        backgroundColor: this.paymentMethods.map(m => m.color),
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        },

        formatCurrency(amount) {
            if (amount == null) return '0 XOF';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0
            }).format(amount);
        },

        formatDate(dateStr) {
            if (!dateStr) return '—';
            return new Date(dateStr).toLocaleDateString('fr-FR');
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'PAYE': 'bg-success',
                'EN_ATTENTE': 'bg-warning text-dark',
                'EN_RETARD': 'bg-danger',
                'PARTIEL': 'bg-info',
                'ANNULE': 'bg-secondary'
            };
            return classes[statut] || 'bg-secondary';
        },

        getStatutLabel(statut) {
            const labels = {
                'PAYE': 'Payé',
                'EN_ATTENTE': 'En attente',
                'EN_RETARD': 'En retard',
                'PARTIEL': 'Partiel',
                'ANNULE': 'Annulé'
            };
            return labels[statut] || statut;
        },

        getStatutIcon(statut) {
            const icons = {
                'PAYE': 'bi-check-circle-fill',
                'EN_ATTENTE': 'bi-clock-fill',
                'EN_RETARD': 'bi-exclamation-triangle-fill',
                'PARTIEL': 'bi-hourglass-split',
                'ANNULE': 'bi-x-circle-fill'
            };
            return icons[statut] || 'bi-question-circle-fill';
        },

        getModeIcon(mode) {
            const icons = {
                'VIREMENT': 'bi-bank',
                'ESPECES': 'bi-cash',
                'CHEQUE': 'bi-receipt',
                'MOBILE_MONEY': 'bi-phone',
                'CARTE': 'bi-credit-card'
            };
            return icons[mode] || 'bi-cash';
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

        isSelected(id) {
            return this.selectedPaiements.includes(id);
        },

        toggleSelection(id) {
            const index = this.selectedPaiements.indexOf(id);
            if (index > -1) {
                this.selectedPaiements.splice(index, 1);
            } else {
                this.selectedPaiements.push(id);
            }
        },

        toggleSelectAll() {
            if (this.allSelected) {
                this.selectedPaiements = [];
            } else {
                this.selectedPaiements = this.paginatedPaiements.map(p => p.id);
            }
        },

        toggleSort() {
            this.sortAsc = !this.sortAsc;
        },

        filterPaiements() {
            this.currentPage = 1;
        },

        resetFilters() {
            this.searchQuery = '';
            this.filters = {
                statut: '',
                propriete: '',
                mois: '',
                mode: ''
            };
            this.currentPage = 1;
        },

        viewPaiement(paiement) {
            this.selectedPaiement = paiement;
        },

        editPaiement(paiement) {
            this.editMode = true;
            this.paiementForm = { ...paiement };
            this.showCreateModal = true;
        },

        closeCreateModal() {
            this.showCreateModal = false;
            this.editMode = false;
            this.paiementForm = {
                id: null,
                locataireId: '',
                bienId: '',
                montant: 0,
                dateEcheance: '',
                statut: 'EN_ATTENTE'
            };
        },

        savePaiement() {
            try {
                if (this.editMode) {
                    ElMessage.success('Paiement modifié avec succès!');
                } else {
                    ElMessage.success('Paiement enregistré avec succès!');
                }
                this.closeCreateModal();
                this.loadData();
            } catch (error) {
                console.error('Erreur:', error);
                ElMessage.error('Erreur lors de la sauvegarde');
            }
        },

        marquerPaye(id) {
            const paiement = this.paiements.find(p => p.id === id);
            if (!paiement) return;

            this.paymentForm = {
                paiementId: id,
                modePaiement: '',
                datePaiement: new Date().toISOString().split('T')[0],
                montantPaye: paiement.montant,
                numeroTransaction: ''
            };
            this.showPaymentModal = true;
        },

        confirmMarquerPaye() {
            try {
                ElMessage.success('Paiement enregistré avec succès!');
                this.showPaymentModal = false;
                if (this.selectedPaiement) {
                    this.selectedPaiement = null;
                }
                this.loadData();
            } catch (error) {
                console.error('Erreur:', error);
                ElMessage.error('Erreur lors de l\'enregistrement');
            }
        },

        async marquerPayes() {
            try {
                await ElMessageBox.confirm(
                    `Voulez-vous marquer ${this.selectedPaiements.length} paiement(s) comme payé(s) ?`,
                    'Confirmation',
                    {
                        confirmButtonText: 'Oui',
                        cancelButtonText: 'Annuler',
                        type: 'warning'
                    }
                );

                ElMessage.success('Paiements marqués comme payés!');
                this.selectedPaiements = [];
                this.loadData();
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur:', error);
                }
            }
        },

        envoyerRappel(id) {
            ElMessage.success('Rappel envoyé avec succès!');
        },

        async envoyerRappels() {
            try {
                const enRetard = this.paiements.filter(p =>
                    p.statut === 'EN_RETARD' || p.statut === 'EN_ATTENTE'
                );

                if (enRetard.length === 0) {
                    ElMessage.info('Aucun paiement en attente ou en retard');
                    return;
                }

                await ElMessageBox.confirm(
                    `Envoyer ${enRetard.length} rappel(s) aux locataires ?`,
                    'Confirmation',
                    {
                        confirmButtonText: 'Envoyer',
                        cancelButtonText: 'Annuler',
                        type: 'warning'
                    }
                );

                ElMessage.success(`${enRetard.length} rappel(s) envoyé(s)!`);
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur:', error);
                }
            }
        },

        async envoyerRappelsSelection() {
            try {
                await ElMessageBox.confirm(
                    `Envoyer ${this.selectedPaiements.length} rappel(s) ?`,
                    'Confirmation',
                    {
                        confirmButtonText: 'Envoyer',
                        cancelButtonText: 'Annuler',
                        type: 'warning'
                    }
                );

                ElMessage.success('Rappels envoyés avec succès!');
                this.selectedPaiements = [];
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur:', error);
                }
            }
        },

        downloadRecu(id) {
            ElMessage.success('Téléchargement du reçu en cours...');
        },

        exportPaiements() {
            ElMessage.success('Export en cours...');
        },

        rafraichir() {
            this.loadData();
            ElMessage.success('Données mises à jour !');
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

.form-check-input:checked {
    background-color: #0d6efd;
    border-color: #0d6efd;
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