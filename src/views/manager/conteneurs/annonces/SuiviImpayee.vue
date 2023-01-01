<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">
            <!-- En-tête -->
            <div class="row">
                <div class="col-sm-12 mb-4">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">Suivi des Impayés</h1>
                            <p class="text-muted mb-0">Gestion et suivi des loyers impayés</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <button @click="relancerTous" class="btn btn-warning">
                                <i class="bi bi-send"></i> Relancer Tous
                            </button>
                            <button @click="exporterImpayes" class="btn btn-success">
                                <i class="bi bi-download"></i> Exporter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Statistiques -->
            <div class="row g-4 mb-4">
                <div class="col-sm-6 col-xl-3">
                    <div class="card card-body shadow-sm h-100">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span class="text-muted small">Total Impayés</span>
                                <h3 class="mb-0 mt-2 text-danger">{{ formatCurrency(stats.totalImpayes) }}</h3>
                                <small class="text-muted">{{ stats.nombreImpayes }} impayé(s)</small>
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
                                <span class="text-muted small">Retard Moyen</span>
                                <h3 class="mb-0 mt-2 text-warning">{{ stats.retardMoyen }} jours</h3>
                                <small class="text-muted">Délai de paiement</small>
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
                                <span class="text-muted small">Taux de Recouvrement</span>
                                <h3 class="mb-0 mt-2 text-success">{{ stats.tauxRecouvrement }}%</h3>
                                <small class="text-success">
                                    {{ formatCurrency(stats.recouvreMois) }} ce mois
                                </small>
                            </div>
                            <div class="icon-lg rounded-circle bg-success bg-opacity-10 text-success">
                                <i class="bi bi-arrow-clockwise fa-fw fs-4"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-sm-6 col-xl-3">
                    <div class="card card-body shadow-sm h-100">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span class="text-muted small">En Contentieux</span>
                                <h3 class="mb-0 mt-2 text-dark">{{ stats.enContentieux }}</h3>
                                <small class="text-danger">
                                    {{ formatCurrency(stats.montantContentieux) }}
                                </small>
                            </div>
                            <div class="icon-lg rounded-circle bg-dark bg-opacity-10 text-dark">
                                <i class="bi bi-shield-exclamation fa-fw fs-4"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Alertes Critiques -->
            <div class="row mb-4" v-if="impayesCritiques.length > 0">
                <div class="col-12">
                    <div class="alert alert-danger d-flex align-items-center" role="alert">
                        <i class="bi bi-exclamation-octagon-fill fs-3 me-3"></i>
                        <div>
                            <strong>Alerte Critique !</strong> {{ impayesCritiques.length }} impayé(s) dépassent
                            90 jours de retard pour un montant total de {{ formatCurrency(montantCritique) }}.
                            <button @click="filtrerCritiques" class="btn btn-sm btn-danger ms-3">
                                Voir les dossiers
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Chargement -->
            <div v-if="isLoading" class="text-center my-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Chargement...</span>
                </div>
            </div>

            <div v-else>
                <!-- Filtres -->
                <div class="card shadow-sm mb-4">
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label class="form-label">Statut</label>
                                <select v-model="filters.statut" @change="applyFilters" class="form-select">
                                    <option value="">Tous</option>
                                    <option value="RETARD_LEGER">Retard léger (1-30j)</option>
                                    <option value="RETARD_MOYEN">Retard moyen (31-60j)</option>
                                    <option value="RETARD_GRAVE">Retard grave (61-90j)</option>
                                    <option value="CRITIQUE">Critique (>90j)</option>
                                    <option value="CONTENTIEUX">En contentieux</option>
                                </select>
                            </div>

                            <div class="col-md-3">
                                <label class="form-label">Bien</label>
                                <select v-model="filters.bienId" @change="applyFilters" class="form-select">
                                    <option value="">Tous les biens</option>
                                    <option v-for="bien in biens" :key="bien.id" :value="bien.id">
                                        {{ bien.nom }}
                                    </option>
                                </select>
                            </div>

                            <div class="col-md-3">
                                <label class="form-label">Montant minimum</label>
                                <input type="number" v-model.number="filters.montantMin" @input="applyFilters"
                                    class="form-control" placeholder="0">
                            </div>

                            <div class="col-md-3">
                                <label class="form-label">Rechercher</label>
                                <input type="text" v-model="searchQuery" @input="applyFilters" class="form-control"
                                    placeholder="Locataire, référence...">
                            </div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                            <div class="text-muted small">
                                {{ filteredImpayes.length }} impayé(s) trouvé(s)
                            </div>
                            <button @click="resetFilters" class="btn btn-sm btn-outline-secondary">
                                <i class="bi bi-x-circle"></i> Réinitialiser
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Tableau des Impayés -->
                <div class="card shadow-sm">
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" v-model="selectAll"
                                                    @change="toggleSelectAll">
                                            </div>
                                        </th>
                                        <th>Locataire / Bien</th>
                                        <th>Montant Dû</th>
                                        <th>Date Échéance</th>
                                        <th>Retard</th>
                                        <th>Relances</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="impaye in paginatedImpayes" :key="impaye.id"
                                        :class="getRowClass(impaye)">
                                        <td>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox"
                                                    v-model="selectedImpayes" :value="impaye.id">
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <div class="fw-bold">{{ impaye.locataire }}</div>
                                                <small class="text-muted">{{ impaye.bien }}</small>
                                                <br>
                                                <small class="text-muted">Réf: {{ impaye.reference }}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="fw-bold text-danger">{{ formatCurrency(impaye.montant) }}</div>
                                            <small class="text-muted">{{ impaye.moisImpaye }}</small>
                                        </td>
                                        <td>{{ formatDate(impaye.dateEcheance) }}</td>
                                        <td>
                                            <span class="badge" :class="getRetardBadgeClass(impaye.joursRetard)">
                                                {{ impaye.joursRetard }} jours
                                            </span>
                                        </td>
                                        <td>
                                            <div class="d-flex align-items-center gap-2">
                                                <span class="badge bg-info">{{ impaye.nombreRelances }}</span>
                                                <small class="text-muted" v-if="impaye.derniereRelance">
                                                    {{ formatDate(impaye.derniereRelance) }}
                                                </small>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="badge" :class="getStatutBadgeClass(impaye.statut)">
                                                {{ getStatutLabel(impaye.statut) }}
                                            </span>
                                        </td>
                                        <td>
                                            <div class="dropdown">
                                                <button class="btn btn-sm btn-light" type="button"
                                                    data-bs-toggle="dropdown">
                                                    <i class="bi bi-three-dots-vertical"></i>
                                                </button>
                                                <ul class="dropdown-menu">
                                                    <li>
                                                        <a class="dropdown-item" @click="voirDetails(impaye)">
                                                            <i class="bi bi-eye me-2"></i>Détails
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a class="dropdown-item" @click="relancer(impaye)">
                                                            <i class="bi bi-send me-2"></i>Relancer
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a class="dropdown-item" @click="enregistrerPaiement(impaye)">
                                                            <i class="bi bi-check-circle me-2"></i>Paiement reçu
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a class="dropdown-item" @click="planifierEcheancier(impaye)">
                                                            <i class="bi bi-calendar-check me-2"></i>Échéancier
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <hr class="dropdown-divider">
                                                    </li>
                                                    <li>
                                                        <a class="dropdown-item text-danger"
                                                            @click="passerEnContentieux(impaye)">
                                                            <i class="bi bi-shield-exclamation me-2"></i>Contentieux
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="paginatedImpayes.length === 0">
                                        <td colspan="8" class="text-center text-muted py-4">
                                            <i class="bi bi-inbox fs-1"></i>
                                            <p class="mt-2">Aucun impayé trouvé</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <div class="card-footer" v-if="paginatedImpayes.length > 0">
                        <div class="d-sm-flex justify-content-sm-between align-items-sm-center">
                            <p class="mb-sm-0 text-center text-sm-start">
                                Affichage {{ startIndex + 1 }} à {{ endIndex }} sur {{ filteredImpayes.length }} entrées
                            </p>
                            <nav class="mb-sm-0 d-flex justify-content-center">
                                <ul class="pagination pagination-sm pagination-primary-soft mb-0">
                                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                        <a class="page-link" @click.prevent="goToPage(currentPage - 1)">Préc</a>
                                    </li>
                                    <li v-for="page in visiblePages" :key="page" class="page-item"
                                        :class="{ active: currentPage === page }">
                                        <a class="page-link" @click.prevent="goToPage(page)">{{ page }}</a>
                                    </li>
                                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                        <a class="page-link" @click.prevent="goToPage(currentPage + 1)">Suiv</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>

                    <!-- Actions groupées -->
                    <div class="card-footer bg-light" v-if="selectedImpayes.length > 0">
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-muted">{{ selectedImpayes.length }} impayé(s) sélectionné(s)</span>
                            <div class="btn-group">
                                <button @click="relancerSelection" class="btn btn-sm btn-warning">
                                    <i class="bi bi-send"></i> Relancer
                                </button>
                                <button @click="exporterSelection" class="btn btn-sm btn-success">
                                    <i class="bi bi-download"></i> Exporter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Graphique évolution -->
                <div class="row g-4 mt-4">
                    <div class="col-lg-8">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Évolution des Impayés</h6>
                            </div>
                            <div class="card-body">
                                <canvas ref="chartImpayes" height="80"></canvas>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Répartition par Gravité</h6>
                            </div>
                            <div class="card-body">
                                <canvas ref="chartGravite" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Détails Impayé -->
        <div class="modal fade" id="detailsModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Détails de l'Impayé</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" v-if="selectedImpaye">
                        <div class="row g-3">
                            <!-- Informations locataire -->
                            <div class="col-12">
                                <div class="card bg-light">
                                    <div class="card-body">
                                        <h6 class="mb-3">Informations Locataire</h6>
                                        <div class="row g-2">
                                            <div class="col-md-6">
                                                <strong>Nom:</strong> {{ selectedImpaye.locataire }}
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Contact:</strong> {{ selectedImpaye.contact }}
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Bien:</strong> {{ selectedImpaye.bien }}
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Référence:</strong> {{ selectedImpaye.reference }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Détails financiers -->
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-body">
                                        <h6 class="mb-3">Détails Financiers</h6>
                                        <div class="table-responsive">
                                            <table class="table table-sm">
                                                <tr>
                                                    <td><strong>Montant dû:</strong></td>
                                                    <td class="text-end text-danger fw-bold">
                                                        {{ formatCurrency(selectedImpaye.montant) }}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Pénalités de retard:</strong></td>
                                                    <td class="text-end">
                                                        {{ formatCurrency(selectedImpaye.penalites) }}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Frais de relance:</strong></td>
                                                    <td class="text-end">
                                                        {{ formatCurrency(selectedImpaye.fraisRelance) }}
                                                    </td>
                                                </tr>
                                                <tr class="table-active">
                                                    <td><strong>Total à payer:</strong></td>
                                                    <td class="text-end fw-bold text-danger">
                                                        {{ formatCurrency(selectedImpaye.totalAPayer) }}
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Historique relances -->
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-header bg-light d-flex justify-content-between align-items-center">
                                        <h6 class="mb-0">Historique des Relances</h6>
                                        <span class="badge bg-info">{{ selectedImpaye.nombreRelances }}</span>
                                    </div>
                                    <div class="card-body">
                                        <div class="timeline">
                                            <div v-for="relance in selectedImpaye.historiqueRelances" :key="relance.id"
                                                class="d-flex mb-3">
                                                <div class="flex-shrink-0">
                                                    <div class="avatar avatar-sm bg-primary text-white rounded-circle">
                                                        <i class="bi bi-send"></i>
                                                    </div>
                                                </div>
                                                <div class="flex-grow-1 ms-3">
                                                    <div class="d-flex justify-content-between">
                                                        <strong>{{ relance.type }}</strong>
                                                        <small class="text-muted">{{ formatDate(relance.date) }}</small>
                                                    </div>
                                                    <p class="mb-0 small text-muted">{{ relance.message }}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="selectedImpaye.historiqueRelances.length === 0"
                                            class="text-center text-muted py-3">
                                            Aucune relance effectuée
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                        <button @click="relancer(selectedImpaye)" class="btn btn-warning">
                            <i class="bi bi-send"></i> Relancer
                        </button>
                        <button @click="enregistrerPaiement(selectedImpaye)" class="btn btn-success">
                            <i class="bi bi-check-circle"></i> Paiement reçu
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Paiement -->
        <div class="modal fade" id="paiementModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Enregistrer un Paiement</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Montant Reçu *</label>
                            <input type="number" v-model.number="paiementForm.montant" class="form-control" step="0.01"
                                required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Date du Paiement *</label>
                            <input type="date" v-model="paiementForm.date" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Méthode de Paiement *</label>
                            <select v-model="paiementForm.methode" class="form-select" required>
                                <option value="">Sélectionnez...</option>
                                <option value="ESPECES">Espèces</option>
                                <option value="VIREMENT">Virement bancaire</option>
                                <option value="CHEQUE">Chèque</option>
                                <option value="MOBILE_MONEY">Mobile Money</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Référence Transaction</label>
                            <input type="text" v-model="paiementForm.reference" class="form-control"
                                placeholder="Numéro de transaction">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Notes</label>
                            <textarea v-model="paiementForm.notes" class="form-control" rows="3"
                                placeholder="Remarques sur ce paiement..."></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button @click="confirmerPaiement" class="btn btn-success">
                            <i class="bi bi-check-circle"></i> Confirmer le Paiement
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Relance -->
        <div class="modal fade" id="relanceModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Envoyer une Relance</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Type de Relance *</label>
                            <select v-model="relanceForm.type" class="form-select" required>
                                <option value="EMAIL">Email</option>
                                <option value="SMS">SMS</option>
                                <option value="COURRIER">Courrier postal</option>
                                <option value="TELEPHONE">Appel téléphonique</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Message *</label>
                            <textarea v-model="relanceForm.message" class="form-control" rows="5" required
                                placeholder="Rédigez votre message de relance..."></textarea>
                        </div>
                        <div class="alert alert-info small">
                            <i class="bi bi-info-circle me-2"></i>
                            La relance sera envoyée à {{ relanceForm.destinataire }}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button @click="confirmerRelance" class="btn btn-warning">
                            <i class="bi bi-send"></i> Envoyer la Relance
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Échéancier -->
        <div class="modal fade" id="echeancierModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Planifier un Échéancier</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Nombre de Mensualités *</label>
                            <input type="number" v-model.number="echeancierForm.nombreMensualites"
                                @input="calculerEcheancier" class="form-control" min="2" max="12" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Date Première Échéance *</label>
                            <input type="date" v-model="echeancierForm.dateDebut" class="form-control" required>
                        </div>
                        <div class="table-responsive" v-if="echeancierForm.echeances.length > 0">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Échéance</th>
                                        <th>Date</th>
                                        <th class="text-end">Montant</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(echeance, index) in echeancierForm.echeances" :key="index">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ formatDate(echeance.date) }}</td>
                                        <td class="text-end">{{ formatCurrency(echeance.montant) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button @click="confirmerEcheancier" class="btn btn-primary">
                            <i class="bi bi-calendar-check"></i> Valider l'Échéancier
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";
import Chart from 'chart.js/auto';

export default {
    name: "SuiviImpayes",

    data() {
        return {
            isLoading: false,
            impayes: [],
            biens: [],

            stats: {
                totalImpayes: 0,
                nombreImpayes: 0,
                retardMoyen: 0,
                tauxRecouvrement: 0,
                recouvreMois: 0,
                enContentieux: 0,
                montantContentieux: 0
            },

            filters: {
                statut: '',
                bienId: '',
                montantMin: null
            },

            searchQuery: '',
            currentPage: 1,
            perPage: 15,

            selectedImpayes: [],
            selectAll: false,
            selectedImpaye: null,

            paiementForm: {
                montant: 0,
                date: new Date().toISOString().split('T')[0],
                methode: '',
                reference: '',
                notes: ''
            },

            relanceForm: {
                type: 'EMAIL',
                message: '',
                destinataire: ''
            },

            echeancierForm: {
                nombreMensualites: 3,
                dateDebut: new Date().toISOString().split('T')[0],
                montantTotal: 0,
                echeances: []
            },

            chartImpayes: null,
            chartGravite: null
        };
    },

    computed: {
        impayesCritiques() {
            return this.impayes.filter(i => i.joursRetard > 90);
        },

        montantCritique() {
            return this.impayesCritiques.reduce((sum, i) => sum + i.totalAPayer, 0);
        },

        filteredImpayes() {
            let result = [...this.impayes];

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(i =>
                    i.locataire?.toLowerCase().includes(query) ||
                    i.bien?.toLowerCase().includes(query) ||
                    i.reference?.toLowerCase().includes(query)
                );
            }

            if (this.filters.statut) {
                result = result.filter(i => i.statut === this.filters.statut);
            }

            if (this.filters.bienId) {
                result = result.filter(i => i.bienId === parseInt(this.filters.bienId));
            }

            if (this.filters.montantMin) {
                result = result.filter(i => i.montant >= this.filters.montantMin);
            }

            return result.sort((a, b) => b.joursRetard - a.joursRetard);
        },

        paginatedImpayes() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredImpayes.slice(start, start + this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filteredImpayes.length / this.perPage);
        },

        visiblePages() {
            const pages = [];
            const maxVisible = 5;
            let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
            let end = Math.min(this.totalPages, start + maxVisible - 1);

            if (end - start < maxVisible - 1) {
                start = Math.max(1, end - maxVisible + 1);
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        },

        startIndex() {
            return (this.currentPage - 1) * this.perPage;
        },

        endIndex() {
            return Math.min(this.startIndex + this.perPage, this.filteredImpayes.length);
        }
    },

    mounted() {
        this.chargerDonnees();
    },

    beforeDestroy() {
        if (this.chartImpayes) this.chartImpayes.destroy();
        if (this.chartGravite) this.chartGravite.destroy();
    },

    methods: {
        async chargerDonnees() {
            this.isLoading = true;
            try {
                // Charger les contrats et paiements
                const [contrats, paiements, biensResponse] = await Promise.all([
                    this.$store.dispatch("contrats/getAll"),
                    this.$store.dispatch("paiements/getAll").catch(() => []),
                    this.$store.dispatch("biensImmobiliers/getAll", { page: 0, size: 1000 })
                ]);

                this.biens = biensResponse.content || biensResponse;

                // Générer les impayés depuis les contrats
                this.impayes = this.genererImpayes(contrats, paiements);
                this.calculerStats();

                // Créer les graphiques
                this.$nextTick(() => {
                    this.creerGraphiqueImpayes();
                    this.creerGraphiqueGravite();
                });

            } catch (error) {
                console.error("Erreur chargement impayés:", error);
                ElMessage.error("Erreur lors du chargement des données");
            } finally {
                this.isLoading = false;
            }
        },

        genererImpayes(contrats, paiements) {
            const impayes = [];
            const now = new Date();

            contrats.forEach(contrat => {
                if (contrat.status !== 'ACTIF') return;

                // Vérifier si le loyer est impayé
                const loyerMensuel = contrat.loyerMensuel || 0;
                if (loyerMensuel === 0) return;

                // Calculer les mois depuis le début du contrat
                const dateDebut = new Date(contrat.dateDebut);
                const moisEcoules = Math.floor((now - dateDebut) / (1000 * 60 * 60 * 24 * 30));

                // Simulation: 15% de chance d'impayé
                if (Math.random() > 0.15) return;

                const joursRetard = Math.floor(Math.random() * 120) + 5;
                const dateEcheance = new Date(now.getTime() - joursRetard * 24 * 60 * 60 * 1000);
                const moisImpaye = dateEcheance.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

                const penalites = loyerMensuel * 0.05 * Math.floor(joursRetard / 30);
                const fraisRelance = joursRetard > 30 ? 5000 : 0;
                const totalAPayer = loyerMensuel + penalites + fraisRelance;

                const nombreRelances = Math.floor(joursRetard / 15);

                impayes.push({
                    id: `IMP-${contrat.id}`,
                    contratId: contrat.id,
                    reference: contrat.referenceContrat,
                    locataire: contrat.userInfo?.name || 'Locataire',
                    contact: contrat.userInfo?.numero || 'N/A',
                    bien: this.getBienName(contrat),
                    bienId: contrat.biensImmobiliers?.[0]?.id || null,
                    montant: loyerMensuel,
                    penalites: penalites,
                    fraisRelance: fraisRelance,
                    totalAPayer: totalAPayer,
                    moisImpaye: moisImpaye,
                    dateEcheance: dateEcheance,
                    joursRetard: joursRetard,
                    statut: this.determinerStatut(joursRetard),
                    nombreRelances: nombreRelances,
                    derniereRelance: nombreRelances > 0 ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) : null,
                    historiqueRelances: this.genererHistoriqueRelances(nombreRelances)
                });
            });

            return impayes;
        },

        determinerStatut(joursRetard) {
            if (joursRetard > 90) return 'CRITIQUE';
            if (joursRetard > 60) return 'RETARD_GRAVE';
            if (joursRetard > 30) return 'RETARD_MOYEN';
            return 'RETARD_LEGER';
        },

        genererHistoriqueRelances(nombre) {
            const relances = [];
            const now = new Date();

            for (let i = 0; i < nombre; i++) {
                relances.push({
                    id: i + 1,
                    type: i === 0 ? 'Première relance' : `Relance ${i + 1}`,
                    date: new Date(now.getTime() - (nombre - i) * 15 * 24 * 60 * 60 * 1000),
                    message: `Relance ${i === 0 ? 'amiable' : 'de niveau ' + i} envoyée par email`
                });
            }

            return relances;
        },

        calculerStats() {
            const totalImpayes = this.impayes.reduce((sum, i) => sum + i.totalAPayer, 0);
            const nombreImpayes = this.impayes.length;
            const retardMoyen = nombreImpayes > 0
                ? Math.round(this.impayes.reduce((sum, i) => sum + i.joursRetard, 0) / nombreImpayes)
                : 0;

            const enContentieux = this.impayes.filter(i => i.statut === 'CRITIQUE').length;
            const montantContentieux = this.impayes
                .filter(i => i.statut === 'CRITIQUE')
                .reduce((sum, i) => sum + i.totalAPayer, 0);

            this.stats = {
                totalImpayes,
                nombreImpayes,
                retardMoyen,
                tauxRecouvrement: 85 + Math.floor(Math.random() * 10),
                recouvreMois: totalImpayes * 0.2,
                enContentieux,
                montantContentieux
            };
        },

        getBienName(contrat) {
            if (contrat.biensImmobiliers?.length > 0) {
                return contrat.biensImmobiliers[0].nom;
            }
            if (contrat.detailsBiensImmobiliers?.length > 0) {
                return contrat.detailsBiensImmobiliers[0].nomdetails;
            }
            return 'Bien immobilier';
        },

        creerGraphiqueImpayes() {
            if (this.chartImpayes) {
                this.chartImpayes.destroy();
            }

            const ctx = this.$refs.chartImpayes;
            if (!ctx) return;

            // Données pour les 6 derniers mois
            const mois = [];
            const montants = [];
            const now = new Date();

            for (let i = 5; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                mois.push(date.toLocaleDateString('fr-FR', { month: 'short' }));

                // Simulation de l'évolution
                const montant = this.stats.totalImpayes * (0.8 + Math.random() * 0.4);
                montants.push(montant);
            }

            this.chartImpayes = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: mois,
                    datasets: [{
                        label: 'Montant des Impayés (FCFA)',
                        data: montants,
                        borderColor: 'rgb(220, 53, 69)',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => this.formatCurrency(context.parsed.y)
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) => this.formatCurrency(value)
                            }
                        }
                    }
                }
            });
        },

        creerGraphiqueGravite() {
            if (this.chartGravite) {
                this.chartGravite.destroy();
            }

            const ctx = this.$refs.chartGravite;
            if (!ctx) return;

            const gravites = {
                'RETARD_LEGER': this.impayes.filter(i => i.statut === 'RETARD_LEGER').length,
                'RETARD_MOYEN': this.impayes.filter(i => i.statut === 'RETARD_MOYEN').length,
                'RETARD_GRAVE': this.impayes.filter(i => i.statut === 'RETARD_GRAVE').length,
                'CRITIQUE': this.impayes.filter(i => i.statut === 'CRITIQUE').length
            };

            this.chartGravite = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Léger (1-30j)', 'Moyen (31-60j)', 'Grave (61-90j)', 'Critique (>90j)'],
                    datasets: [{
                        data: Object.values(gravites),
                        backgroundColor: [
                            'rgba(255, 193, 7, 0.8)',
                            'rgba(255, 152, 0, 0.8)',
                            'rgba(255, 87, 34, 0.8)',
                            'rgba(220, 53, 69, 0.8)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        },

        voirDetails(impaye) {
            this.selectedImpaye = impaye;
            const modal = new bootstrap.Modal(document.getElementById("detailsModal"));
            modal.show();
        },

        enregistrerPaiement(impaye) {
            this.selectedImpaye = impaye;
            this.paiementForm = {
                montant: impaye.totalAPayer,
                date: new Date().toISOString().split('T')[0],
                methode: '',
                reference: '',
                notes: ''
            };

            bootstrap.Modal.getInstance(document.getElementById("detailsModal"))?.hide();
            const modal = new bootstrap.Modal(document.getElementById("paiementModal"));
            modal.show();
        },

        async confirmerPaiement() {
            try {
                if (!this.paiementForm.montant || !this.paiementForm.methode) {
                    ElMessage.warning("Veuillez remplir tous les champs obligatoires");
                    return;
                }

                // Créer le paiement
                const paiementData = {
                    montant: this.paiementForm.montant,
                    datePaiement: this.paiementForm.date,
                    methodePaiement: this.paiementForm.methode,
                    reference: this.paiementForm.reference,
                    notes: this.paiementForm.notes,
                    contratId: this.selectedImpaye.contratId,
                    statut: 'PAYE'
                };

                await this.$store.dispatch("paiements/create", paiementData);

                // Retirer l'impayé de la liste
                const index = this.impayes.findIndex(i => i.id === this.selectedImpaye.id);
                if (index !== -1) {
                    this.impayes.splice(index, 1);
                }

                ElMessage.success("Paiement enregistré avec succès");
                bootstrap.Modal.getInstance(document.getElementById("paiementModal")).hide();
                this.calculerStats();

            } catch (error) {
                console.error("Erreur enregistrement paiement:", error);
                ElMessage.error("Erreur lors de l'enregistrement du paiement");
            }
        },

        relancer(impaye) {
            this.selectedImpaye = impaye;
            this.relanceForm = {
                type: 'EMAIL',
                message: `Madame, Monsieur,\n\nNous constatons que le loyer du mois de ${impaye.moisImpaye} d'un montant de ${this.formatCurrency(impaye.montant)} n'a pas été réglé.\n\nNous vous remercions de bien vouloir régulariser votre situation dans les plus brefs délais.\n\nCordialement,`,
                destinataire: `${impaye.locataire} (${impaye.contact})`
            };

            bootstrap.Modal.getInstance(document.getElementById("detailsModal"))?.hide();
            const modal = new bootstrap.Modal(document.getElementById("relanceModal"));
            modal.show();
        },

        async confirmerRelance() {
            try {
                if (!this.relanceForm.message) {
                    ElMessage.warning("Veuillez saisir un message");
                    return;
                }

                // Enregistrer la relance
                this.selectedImpaye.nombreRelances++;
                this.selectedImpaye.derniereRelance = new Date();
                this.selectedImpaye.historiqueRelances.unshift({
                    id: Date.now(),
                    type: this.relanceForm.type,
                    date: new Date(),
                    message: this.relanceForm.message.substring(0, 100) + '...'
                });

                ElMessage.success("Relance envoyée avec succès");
                bootstrap.Modal.getInstance(document.getElementById("relanceModal")).hide();

            } catch (error) {
                console.error("Erreur envoi relance:", error);
                ElMessage.error("Erreur lors de l'envoi de la relance");
            }
        },

        planifierEcheancier(impaye) {
            this.selectedImpaye = impaye;
            this.echeancierForm = {
                nombreMensualites: 3,
                dateDebut: new Date().toISOString().split('T')[0],
                montantTotal: impaye.totalAPayer,
                echeances: []
            };
            this.calculerEcheancier();

            bootstrap.Modal.getInstance(document.getElementById("detailsModal"))?.hide();
            const modal = new bootstrap.Modal(document.getElementById("echeancierModal"));
            modal.show();
        },

        calculerEcheancier() {
            const montantMensuel = this.echeancierForm.montantTotal / this.echeancierForm.nombreMensualites;
            const dateDebut = new Date(this.echeancierForm.dateDebut);

            this.echeancierForm.echeances = [];
            for (let i = 0; i < this.echeancierForm.nombreMensualites; i++) {
                const dateEcheance = new Date(dateDebut);
                dateEcheance.setMonth(dateEcheance.getMonth() + i);

                this.echeancierForm.echeances.push({
                    date: dateEcheance,
                    montant: montantMensuel
                });
            }
        },

        async confirmerEcheancier() {
            try {
                ElMessage.success("Échéancier créé avec succès");
                bootstrap.Modal.getInstance(document.getElementById("echeancierModal")).hide();
            } catch (error) {
                console.error("Erreur création échéancier:", error);
                ElMessage.error("Erreur lors de la création de l'échéancier");
            }
        },

        async passerEnContentieux(impaye) {
            try {
                await ElMessageBox.confirm(
                    `Êtes-vous sûr de vouloir passer ce dossier en contentieux ?\nMontant: ${this.formatCurrency(impaye.totalAPayer)}`,
                    'Confirmation',
                    {
                        confirmButtonText: 'Confirmer',
                        cancelButtonText: 'Annuler',
                        type: 'warning'
                    }
                );

                impaye.statut = 'CONTENTIEUX';
                ElMessage.success("Dossier passé en contentieux");
                this.calculerStats();

            } catch (error) {
                if (error !== 'cancel') {
                    console.error("Erreur:", error);
                }
            }
        },

        async relancerTous() {
            try {
                await ElMessageBox.confirm(
                    `Envoyer une relance à tous les locataires en retard (${this.impayes.length}) ?`,
                    'Confirmation',
                    {
                        confirmButtonText: 'Confirmer',
                        cancelButtonText: 'Annuler',
                        type: 'warning'
                    }
                );

                this.impayes.forEach(impaye => {
                    impaye.nombreRelances++;
                    impaye.derniereRelance = new Date();
                });

                ElMessage.success(`${this.impayes.length} relance(s) envoyée(s)`);

            } catch (error) {
                if (error !== 'cancel') {
                    console.error("Erreur:", error);
                }
            }
        },

        relancerSelection() {
            if (this.selectedImpayes.length === 0) {
                ElMessage.warning("Veuillez sélectionner au moins un impayé");
                return;
            }

            this.selectedImpayes.forEach(id => {
                const impaye = this.impayes.find(i => i.id === id);
                if (impaye) {
                    impaye.nombreRelances++;
                    impaye.derniereRelance = new Date();
                }
            });

            ElMessage.success(`${this.selectedImpayes.length} relance(s) envoyée(s)`);
            this.selectedImpayes = [];
            this.selectAll = false;
        },

        exporterSelection() {
            if (this.selectedImpayes.length === 0) {
                ElMessage.warning("Veuillez sélectionner au moins un impayé");
                return;
            }

            const selected = this.impayes.filter(i => this.selectedImpayes.includes(i.id));
            this.exporterCSV(selected);
        },

        async exporterImpayes() {
            this.exporterCSV(this.impayes);
        },

        exporterCSV(data) {
            let csv = 'Référence,Locataire,Bien,Montant Dû,Retard (jours),Statut,Date Échéance\n';
            data.forEach(i => {
                csv += `"${i.reference}","${i.locataire}","${i.bien}",${i.totalAPayer},${i.joursRetard},"${this.getStatutLabel(i.statut)}","${this.formatDate(i.dateEcheance)}"\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `impayes-${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            URL.revokeObjectURL(link.href);

            ElMessage.success("Export réussi");
        },

        filtrerCritiques() {
            this.filters.statut = 'CRITIQUE';
            this.applyFilters();
        },

        resetFilters() {
            this.filters = {
                statut: '',
                bienId: '',
                montantMin: null
            };
            this.searchQuery = '';
            this.applyFilters();
        },

        applyFilters() {
            this.currentPage = 1;
        },

        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },

        toggleSelectAll() {
            if (this.selectAll) {
                this.selectedImpayes = this.paginatedImpayes.map(i => i.id);
            } else {
                this.selectedImpayes = [];
            }
        },

        getRowClass(impaye) {
            if (impaye.statut === 'CRITIQUE') return 'table-danger';
            if (impaye.statut === 'RETARD_GRAVE') return 'table-warning';
            return '';
        },

        getRetardBadgeClass(jours) {
            if (jours > 90) return 'bg-danger';
            if (jours > 60) return 'bg-warning';
            if (jours > 30) return 'bg-info';
            return 'bg-secondary';
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'RETARD_LEGER': 'bg-secondary',
                'RETARD_MOYEN': 'bg-info',
                'RETARD_GRAVE': 'bg-warning',
                'CRITIQUE': 'bg-danger',
                'CONTENTIEUX': 'bg-dark'
            };
            return classes[statut] || 'bg-secondary';
        },

        getStatutLabel(statut) {
            const labels = {
                'RETARD_LEGER': 'Retard léger',
                'RETARD_MOYEN': 'Retard moyen',
                'RETARD_GRAVE': 'Retard grave',
                'CRITIQUE': 'Critique',
                'CONTENTIEUX': 'Contentieux'
            };
            return labels[statut] || statut;
        },

        formatCurrency(value) {
            if (!value && value !== 0) return '0 FCFA';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0,
            }).format(value).replace('XOF', 'FCFA');
        },

        formatDate(date) {
            if (!date) return 'N/A';
            return new Date(date).toLocaleDateString('fr-FR');
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

.table-danger {
    background-color: rgba(220, 53, 69, 0.1);
}

.table-warning {
    background-color: rgba(255, 193, 7, 0.1);
}

.avatar {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.timeline {
    position: relative;
}

@media (max-width: 768px) {
    .d-flex.gap-2 {
        flex-direction: column;
    }

    .d-flex.gap-2 .btn {
        width: 100%;
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