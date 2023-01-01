<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">

            <!-- En-tête -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">
                                <i class="bi bi-cash-coin me-2"></i>Paiements Reçus
                            </h1>
                            <p class="text-muted mb-0">Suivi des encaissements et réconciliation bancaire</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <button @click="showSaisieModal = true" class="btn btn-primary">
                                <i class="bi bi-plus-circle me-1"></i>Nouveau Paiement
                            </button>
                            <button @click="showRapprochementModal = true" class="btn btn-outline-primary">
                                <i class="bi bi-arrow-left-right me-1"></i>Rapprochement
                            </button>
                            <button @click="exportPaiements" class="btn btn-success">
                                <i class="bi bi-download me-1"></i>Exporter
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
                                    <span class="text-muted small">Total Reçu</span>
                                    <h3 class="mb-0 mt-2 text-success">{{ formatMontant(stats.totalRecu) }}</h3>
                                    <small class="text-success">
                                        <i class="bi bi-arrow-down-circle me-1"></i>Ce mois
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
                                    <span class="text-muted small">Rapproché</span>
                                    <h3 class="mb-0 mt-2 text-primary">{{ formatMontant(stats.totalRapproche) }}</h3>
                                    <small class="text-primary">
                                        <i class="bi bi-check-circle me-1"></i>{{ stats.tauxRapprochement }}%
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-primary bg-opacity-10 text-primary">
                                    <i class="bi bi-check2-circle fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">En Attente</span>
                                    <h3 class="mb-0 mt-2 text-warning">{{ formatMontant(stats.totalEnAttente) }}</h3>
                                    <small class="text-warning">
                                        <i class="bi bi-hourglass-split me-1"></i>{{ stats.nombreEnAttente }} paiements
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
                                    <span class="text-muted small">Nombre Total</span>
                                    <h3 class="mb-0 mt-2 text-info">{{ stats.nombreTotal }}</h3>
                                    <small class="text-info">
                                        <i class="bi bi-list-ul me-1"></i>Transactions
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-info bg-opacity-10 text-info">
                                    <i class="bi bi-list-ul fa-fw fs-4"></i>
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
                                <h6 class="mb-0"><i class="bi bi-graph-up me-2"></i>Évolution des Encaissements</h6>
                            </div>
                            <div class="card-body">
                                <canvas id="evolutionChart" height="80"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0"><i class="bi bi-pie-chart me-2"></i>Modes de Paiement</h6>
                            </div>
                            <div class="card-body">
                                <canvas id="modeChart" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Synthèse par mode de paiement -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Répartition par Mode de Paiement</h6>
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div v-for="mode in modesPaiement" :key="mode.id" class="col-md-2-4 col-lg-2-4">
                                        <div class="card border h-100" :class="'border-' + mode.color">
                                            <div class="card-body text-center">
                                                <i class="bi fs-1 mb-2" :class="[mode.icon, 'text-' + mode.color]"></i>
                                                <h5 class="mb-1" :class="'text-' + mode.color">{{
                                                    formatMontant(mode.montant) }}</h5>
                                                <p class="mb-1 small fw-bold">{{ mode.label }}</p>
                                                <small class="text-muted">{{ mode.nombre }} paiements</small>
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
                                                v-model="searchQuery" @input="filterPaiements">
                                            <i
                                                class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.mode" @change="filterPaiements" class="form-select">
                                            <option value="">Tous modes</option>
                                            <option value="Virement">Virement</option>
                                            <option value="Chèque">Chèque</option>
                                            <option value="Carte">Carte</option>
                                            <option value="Espèces">Espèces</option>
                                            <option value="Prélèvement">Prélèvement</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.statut" @change="filterPaiements" class="form-select">
                                            <option value="">Tous statuts</option>
                                            <option value="EN_ATTENTE">En attente</option>
                                            <option value="RAPPROCHE">Rapproché</option>
                                            <option value="VALIDE">Validé</option>
                                            <option value="ANNULE">Annulé</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.periode" @change="filterPaiements" class="form-select">
                                            <option value="">Toutes périodes</option>
                                            <option value="AUJOURDHUI">Aujourd'hui</option>
                                            <option value="SEMAINE">Cette semaine</option>
                                            <option value="MOIS">Ce mois</option>
                                            <option value="TRIMESTRE">Ce trimestre</option>
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

                <!-- Actions groupées -->
                <div class="row mb-3" v-if="selectedPaiements.length > 0">
                    <div class="col-12">
                        <div class="alert alert-info d-flex justify-content-between align-items-center">
                            <span>
                                <i class="bi bi-info-circle me-2"></i>
                                {{ selectedPaiements.length }} paiement(s) sélectionné(s) - Total: {{
                                    formatMontant(getMontantSelection()) }}
                            </span>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-success" @click="validerSelection">
                                    <i class="bi bi-check-circle me-1"></i>Valider
                                </button>
                                <button class="btn btn-sm btn-primary" @click="rapprocherSelection">
                                    <i class="bi bi-arrow-left-right me-1"></i>Rapprocher
                                </button>
                                <button class="btn btn-sm btn-secondary" @click="selectedPaiements = []">
                                    <i class="bi bi-x-circle me-1"></i>Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Liste des paiements -->
                <div class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h6 class="mb-0">
                                        Liste des Paiements
                                        <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                            {{ filteredPaiements.length }} paiements
                                        </span>
                                    </h6>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" v-model="selectAll"
                                            @change="toggleSelectAll">
                                        <label class="form-check-label small">
                                            Tout sélectionner
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th style="width: 40px;">
                                                    <input type="checkbox" class="form-check-input" v-model="selectAll"
                                                        @change="toggleSelectAll">
                                                </th>
                                                <th>Référence</th>
                                                <th>Date</th>
                                                <th>Client</th>
                                                <th>Facture</th>
                                                <th>Mode</th>
                                                <th>Montant</th>
                                                <th>Statut</th>
                                                <th>Date Rapprochement</th>
                                                <th class="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="paginatedPaiements.length === 0">
                                                <td colspan="10" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucun paiement trouvé</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="paiement in paginatedPaiements" :key="paiement.id"
                                                :class="getRowClass(paiement)">
                                                <td>
                                                    <input type="checkbox" class="form-check-input"
                                                        v-model="selectedPaiements" :value="paiement.id">
                                                </td>
                                                <td>
                                                    <strong class="text-primary">{{ paiement.reference }}</strong>
                                                </td>
                                                <td>
                                                    <small class="text-muted">
                                                        <i class="bi bi-calendar-event me-1"></i>
                                                        {{ formatDate(paiement.datePaiement) }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <div><strong>{{ paiement.client.nom }}</strong></div>
                                                    <small class="text-muted">{{ paiement.client.email }}</small>
                                                </td>
                                                <td>
                                                    <span class="badge bg-light text-dark">{{ paiement.numeroFacture
                                                        }}</span>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <i class="bi me-2"
                                                            :class="[getModeIcon(paiement.modePaiement), 'text-' + getModeColor(paiement.modePaiement)]"></i>
                                                        <span>{{ paiement.modePaiement }}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <strong class="text-success">{{ formatMontant(paiement.montant)
                                                        }}</strong>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getStatutBadgeClass(paiement.statut)">
                                                        {{ getStatutLabel(paiement.statut) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <small class="text-muted" v-if="paiement.dateRapprochement">
                                                        {{ formatDate(paiement.dateRapprochement) }}
                                                    </small>
                                                    <small class="text-muted" v-else>-</small>
                                                </td>
                                                <td class="text-end">
                                                    <div class="btn-group">
                                                        <button class="btn btn-sm btn-outline-primary"
                                                            @click="viewPaiement(paiement)">
                                                            <i class="bi bi-eye"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-success"
                                                            @click="validerPaiement(paiement)"
                                                            v-if="paiement.statut === 'EN_ATTENTE'">
                                                            <i class="bi bi-check-circle"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-info"
                                                            @click="rapprocherPaiement(paiement)"
                                                            v-if="paiement.statut !== 'RAPPROCHE'">
                                                            <i class="bi bi-arrow-left-right"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-danger"
                                                            @click="annulerPaiement(paiement)"
                                                            v-if="paiement.statut !== 'ANNULE'">
                                                            <i class="bi bi-x-circle"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                        <tfoot class="table-light">
                                            <tr>
                                                <td colspan="6" class="text-end"><strong>Total affiché:</strong></td>
                                                <td colspan="4"><strong class="text-success">{{
                                                    formatMontant(getTotalAffiche()) }}</strong></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                <!-- Pagination -->
                                <div v-if="filteredPaiements.length > perPage" class="card-footer border-top">
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
        <div v-if="selectedPaiement" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Détails du Paiement
                            <span class="badge ms-2" :class="getStatutBadgeClass(selectedPaiement.statut)">
                                {{ getStatutLabel(selectedPaiement.statut) }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedPaiement = null"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-info-circle me-2"></i>Informations</h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Référence</label>
                                            <p class="mb-0 fw-bold">{{ selectedPaiement.reference }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Date du paiement</label>
                                            <p class="mb-0">{{ formatDate(selectedPaiement.datePaiement) }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Mode de paiement</label>
                                            <p class="mb-0">
                                                <i class="bi me-1"
                                                    :class="getModeIcon(selectedPaiement.modePaiement)"></i>
                                                {{ selectedPaiement.modePaiement }}
                                            </p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Montant</label>
                                            <p class="mb-0"><strong class="text-success fs-5">{{
                                                formatMontant(selectedPaiement.montant) }}</strong></p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-person me-2"></i>Client</h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Nom</label>
                                            <p class="mb-0 fw-bold">{{ selectedPaiement.client.nom }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Email</label>
                                            <p class="mb-0">{{ selectedPaiement.client.email }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Facture associée</label>
                                            <p class="mb-0">
                                                <span class="badge bg-primary">{{ selectedPaiement.numeroFacture
                                                    }}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12" v-if="selectedPaiement.referenceTransaction">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-receipt me-2"></i>Détails Transaction</h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Référence bancaire</label>
                                            <p class="mb-0 fw-bold">{{ selectedPaiement.referenceTransaction }}</p>
                                        </div>
                                        <div class="mb-2" v-if="selectedPaiement.dateRapprochement">
                                            <label class="text-muted small">Date de rapprochement</label>
                                            <p class="mb-0">{{ formatDate(selectedPaiement.dateRapprochement) }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12" v-if="selectedPaiement.notes">
                                <div class="card border-info">
                                    <div class="card-header bg-info bg-opacity-10">
                                        <h6 class="mb-0"><i class="bi bi-sticky me-2"></i>Notes</h6>
                                    </div>
                                    <div class="card-body">
                                        <p class="mb-0">{{ selectedPaiement.notes }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="selectedPaiement = null">Fermer</button>
                        <button type="button" class="btn btn-success" @click="validerPaiement(selectedPaiement)"
                            v-if="selectedPaiement.statut === 'EN_ATTENTE'">
                            <i class="bi bi-check-circle me-1"></i>Valider
                        </button>
                        <button type="button" class="btn btn-primary" @click="rapprocherPaiement(selectedPaiement)"
                            v-if="selectedPaiement.statut !== 'RAPPROCHE'">
                            <i class="bi bi-arrow-left-right me-1"></i>Rapprocher
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Saisie Paiement -->
        <div v-if="showSaisieModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Nouveau Paiement</h5>
                        <button type="button" class="btn-close" @click="closeSaisieModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Client *</label>
                                <input type="text" v-model="paiementForm.clientNom" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Email</label>
                                <input type="email" v-model="paiementForm.clientEmail" class="form-control">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Numéro de facture *</label>
                                <input type="text" v-model="paiementForm.numeroFacture" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Montant *</label>
                                <input type="number" v-model.number="paiementForm.montant" class="form-control"
                                    step="0.01" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date du paiement *</label>
                                <input type="date" v-model="paiementForm.datePaiement" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Mode de paiement *</label>
                                <select v-model="paiementForm.modePaiement" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="Virement">Virement</option>
                                    <option value="Chèque">Chèque</option>
                                    <option value="Carte">Carte bancaire</option>
                                    <option value="Espèces">Espèces</option>
                                    <option value="Prélèvement">Prélèvement</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Référence de transaction</label>
                                <input type="text" v-model="paiementForm.referenceTransaction" class="form-control"
                                    placeholder="N° de chèque, référence virement...">
                            </div>
                            <div class="col-12">
                                <label class="form-label">Notes</label>
                                <textarea v-model="paiementForm.notes" class="form-control" rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeSaisieModal">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="savePaiement">
                            <i class="bi bi-check-circle me-1"></i>Enregistrer
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Rapprochement -->
        <div v-if="showRapprochementModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Rapprochement Bancaire</h5>
                        <button type="button" class="btn-close" @click="showRapprochementModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle me-2"></i>
                            Sélectionnez les paiements à rapprocher avec les relevés bancaires
                        </div>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead class="table-light">
                                    <tr>
                                        <th><input type="checkbox" class="form-check-input"
                                                v-model="selectAllRapprochement" @change="toggleSelectAllRapprochement">
                                        </th>
                                        <th>Référence</th>
                                        <th>Client</th>
                                        <th>Date</th>
                                        <th>Mode</th>
                                        <th>Montant</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="paiement in paiementsNonRapproches" :key="paiement.id">
                                        <td><input type="checkbox" class="form-check-input"
                                                v-model="selectedRapprochement" :value="paiement.id"></td>
                                        <td>{{ paiement.reference }}</td>
                                        <td>{{ paiement.client.nom }}</td>
                                        <td>{{ formatDate(paiement.datePaiement) }}</td>
                                        <td>{{ paiement.modePaiement }}</td>
                                        <td>{{ formatMontant(paiement.montant) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-if="selectedRapprochement.length > 0" class="mt-3">
                            <strong>Total sélectionné: {{ formatMontant(getMontantRapprochement()) }}</strong>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            @click="showRapprochementModal = false">Fermer</button>
                        <button type="button" class="btn btn-primary" @click="validerRapprochement"
                            :disabled="selectedRapprochement.length === 0">
                            <i class="bi bi-check-circle me-1"></i>Rapprocher ({{ selectedRapprochement.length }})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PaiementsRecus',

    data() {
        return {
            loading: true,
            searchQuery: '',
            currentPage: 1,
            perPage: 15,
            selectedPaiement: null,
            showSaisieModal: false,
            showRapprochementModal: false,
            selectAll: false,
            selectAllRapprochement: false,
            selectedPaiements: [],
            selectedRapprochement: [],
            filters: { mode: '', statut: '', periode: '' },
            paiementForm: {
                clientNom: '',
                clientEmail: '',
                numeroFacture: '',
                montant: 0,
                datePaiement: '',
                modePaiement: '',
                referenceTransaction: '',
                notes: ''
            },
            paiements: [],
            stats: {
                totalRecu: 0,
                totalRapproche: 0,
                totalEnAttente: 0,
                nombreTotal: 0,
                nombreEnAttente: 0,
                tauxRapprochement: 0
            },
            modesPaiement: [],
            charts: {
                evolution: null,
                mode: null
            }
        };
    },

    computed: {
        filteredPaiements() {
            let result = [...this.paiements];

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(p =>
                    p.reference.toLowerCase().includes(query) ||
                    p.client.nom.toLowerCase().includes(query) ||
                    p.numeroFacture.toLowerCase().includes(query) ||
                    (p.referenceTransaction && p.referenceTransaction.toLowerCase().includes(query))
                );
            }

            if (this.filters.mode) result = result.filter(p => p.modePaiement === this.filters.mode);
            if (this.filters.statut) result = result.filter(p => p.statut === this.filters.statut);

            if (this.filters.periode) {
                const today = new Date();
                if (this.filters.periode === 'AUJOURDHUI') {
                    const todayStr = today.toISOString().split('T')[0];
                    result = result.filter(p => p.datePaiement === todayStr);
                } else if (this.filters.periode === 'SEMAINE') {
                    const startOfWeek = new Date(today);
                    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
                    result = result.filter(p => new Date(p.datePaiement) >= startOfWeek);
                } else if (this.filters.periode === 'MOIS') {
                    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    result = result.filter(p => new Date(p.datePaiement) >= startOfMonth);
                } else if (this.filters.periode === 'TRIMESTRE') {
                    const currentQuarter = Math.floor(today.getMonth() / 3);
                    const startOfQuarter = new Date(today.getFullYear(), currentQuarter * 3, 1);
                    result = result.filter(p => new Date(p.datePaiement) >= startOfQuarter);
                }
            }

            return result.sort((a, b) => new Date(b.datePaiement) - new Date(a.datePaiement));
        },

        paginatedPaiements() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredPaiements.slice(start, start + this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filteredPaiements.length / this.perPage);
        },

        paiementsNonRapproches() {
            return this.paiements.filter(p => p.statut !== 'RAPPROCHE' && p.statut !== 'ANNULE');
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
                const modes = ['Virement', 'Chèque', 'Carte', 'Espèces', 'Prélèvement'];
                const statuts = ['EN_ATTENTE', 'RAPPROCHE', 'VALIDE', 'ANNULE'];
                const clients = [
                    { nom: 'Jean Dupont', email: 'jean.dupont@email.com' },
                    { nom: 'Marie Martin', email: 'marie.martin@email.com' },
                    { nom: 'Pierre Durand', email: 'pierre.durand@email.com' },
                    { nom: 'Sophie Bernard', email: 'sophie.bernard@email.com' },
                    { nom: 'Luc Petit', email: 'luc.petit@email.com' }
                ];

                this.paiements = Array.from({ length: 50 }, (_, i) => {
                    const baseDate = new Date();
                    const randomDays = Math.floor(Math.random() * 60);
                    const datePaiement = new Date(baseDate);
                    datePaiement.setDate(baseDate.getDate() - randomDays);

                    const client = clients[Math.floor(Math.random() * clients.length)];
                    const mode = modes[Math.floor(Math.random() * modes.length)];
                    const statut = statuts[Math.floor(Math.random() * statuts.length)];

                    const dateRapprochement = statut === 'RAPPROCHE' ?
                        new Date(datePaiement.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null;

                    return {
                        id: i + 1,
                        reference: `PAY-${new Date().getFullYear()}-${String(i + 1).padStart(5, '0')}`,
                        datePaiement: datePaiement.toISOString().split('T')[0],
                        client: { ...client },
                        numeroFacture: `FACT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(5, '0')}`,
                        montant: Math.floor(Math.random() * 5000) + 500,
                        modePaiement: mode,
                        statut: statut,
                        referenceTransaction: mode === 'Chèque' ? `CHQ-${String(Math.floor(Math.random() * 1000000)).padStart(7, '0')}` :
                            mode === 'Virement' ? `VIR-${String(Math.floor(Math.random() * 1000000)).padStart(7, '0')}` : null,
                        dateRapprochement: dateRapprochement,
                        notes: Math.random() > 0.7 ? 'Notes concernant ce paiement' : ''
                    };
                });

                this.calculateStats();
                this.calculateModesPaiement();
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors du chargement', 'error');
            } finally {
                this.loading = false;
            }
        },

        calculateStats() {
            const thisMonth = new Date().getMonth();
            const thisYear = new Date().getFullYear();

            const paiementsMois = this.paiements.filter(p => {
                const date = new Date(p.datePaiement);
                return date.getMonth() === thisMonth && date.getFullYear() === thisYear && p.statut !== 'ANNULE';
            });

            this.stats.totalRecu = paiementsMois.reduce((sum, p) => sum + p.montant, 0);
            this.stats.totalRapproche = this.paiements.filter(p => p.statut === 'RAPPROCHE').reduce((sum, p) => sum + p.montant, 0);

            const paiementsEnAttente = this.paiements.filter(p => p.statut === 'EN_ATTENTE');
            this.stats.totalEnAttente = paiementsEnAttente.reduce((sum, p) => sum + p.montant, 0);
            this.stats.nombreEnAttente = paiementsEnAttente.length;

            this.stats.nombreTotal = this.paiements.filter(p => p.statut !== 'ANNULE').length;

            const totalPaiements = this.paiements.filter(p => p.statut !== 'ANNULE').reduce((sum, p) => sum + p.montant, 0);
            this.stats.tauxRapprochement = totalPaiements > 0 ?
                Math.round((this.stats.totalRapproche / totalPaiements) * 100) : 0;
        },

        calculateModesPaiement() {
            const modesConfig = [
                { id: 'Virement', label: 'Virement', icon: 'bi-bank', color: 'primary' },
                { id: 'Chèque', label: 'Chèque', icon: 'bi-file-earmark-text', color: 'success' },
                { id: 'Carte', label: 'Carte', icon: 'bi-credit-card', color: 'info' },
                { id: 'Espèces', label: 'Espèces', icon: 'bi-cash', color: 'warning' },
                { id: 'Prélèvement', label: 'Prélèvement', icon: 'bi-arrow-repeat', color: 'secondary' }
            ];

            this.modesPaiement = modesConfig.map(mode => {
                const paiementsMode = this.paiements.filter(p => p.modePaiement === mode.id && p.statut !== 'ANNULE');
                return {
                    ...mode,
                    nombre: paiementsMode.length,
                    montant: paiementsMode.reduce((sum, p) => sum + p.montant, 0)
                };
            });
        },

        initCharts() {
            // Graphique d'évolution
            const ctxEvolution = document.getElementById('evolutionChart');
            if (ctxEvolution && window.Chart) {
                const derniersMois = ['Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
                const dataEncaissements = [38000, 42000, 45000, 48000, 52000, 55000];

                this.charts.evolution = new Chart(ctxEvolution, {
                    type: 'line',
                    data: {
                        labels: derniersMois,
                        datasets: [{
                            label: 'Encaissements',
                            data: dataEncaissements,
                            borderColor: '#198754',
                            backgroundColor: 'rgba(25, 135, 84, 0.1)',
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
                                    callback: function (value) {
                                        return value.toLocaleString('fr-FR') + ' €';
                                    }
                                }
                            }
                        }
                    }
                });
            }

            // Graphique par mode
            const ctxMode = document.getElementById('modeChart');
            if (ctxMode && window.Chart) {
                this.charts.mode = new Chart(ctxMode, {
                    type: 'doughnut',
                    data: {
                        labels: this.modesPaiement.map(m => m.label),
                        datasets: [{
                            data: this.modesPaiement.map(m => m.montant),
                            backgroundColor: ['#0d6efd', '#198754', '#0dcaf0', '#ffc107', '#6c757d'],
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

        viewPaiement(paiement) {
            this.selectedPaiement = paiement;
        },

        validerPaiement(paiement) {
            const index = this.paiements.findIndex(p => p.id === paiement.id);
            if (index !== -1) {
                this.paiements[index].statut = 'VALIDE';
                this.calculateStats();
                this.showMessage('Paiement validé', 'success');
                if (this.selectedPaiement) {
                    this.selectedPaiement = null;
                }
            }
        },

        rapprocherPaiement(paiement) {
            const index = this.paiements.findIndex(p => p.id === paiement.id);
            if (index !== -1) {
                this.paiements[index].statut = 'RAPPROCHE';
                this.paiements[index].dateRapprochement = new Date().toISOString().split('T')[0];
                this.calculateStats();
                this.showMessage('Paiement rapproché', 'success');
                if (this.selectedPaiement) {
                    this.selectedPaiement = null;
                }
            }
        },

        annulerPaiement(paiement) {
            if (confirm(`Êtes-vous sûr de vouloir annuler le paiement ${paiement.reference} ?`)) {
                const index = this.paiements.findIndex(p => p.id === paiement.id);
                if (index !== -1) {
                    this.paiements[index].statut = 'ANNULE';
                    this.calculateStats();
                    this.showMessage('Paiement annulé', 'success');
                }
            }
        },

        validerSelection() {
            this.selectedPaiements.forEach(id => {
                const index = this.paiements.findIndex(p => p.id === id);
                if (index !== -1) {
                    this.paiements[index].statut = 'VALIDE';
                }
            });
            this.calculateStats();
            this.showMessage(`${this.selectedPaiements.length} paiement(s) validé(s)`, 'success');
            this.selectedPaiements = [];
            this.selectAll = false;
        },

        rapprocherSelection() {
            const today = new Date().toISOString().split('T')[0];
            this.selectedPaiements.forEach(id => {
                const index = this.paiements.findIndex(p => p.id === id);
                if (index !== -1) {
                    this.paiements[index].statut = 'RAPPROCHE';
                    this.paiements[index].dateRapprochement = today;
                }
            });
            this.calculateStats();
            this.showMessage(`${this.selectedPaiements.length} paiement(s) rapproché(s)`, 'success');
            this.selectedPaiements = [];
            this.selectAll = false;
        },

        validerRapprochement() {
            const today = new Date().toISOString().split('T')[0];
            this.selectedRapprochement.forEach(id => {
                const index = this.paiements.findIndex(p => p.id === id);
                if (index !== -1) {
                    this.paiements[index].statut = 'RAPPROCHE';
                    this.paiements[index].dateRapprochement = today;
                }
            });
            this.calculateStats();
            this.showMessage(`${this.selectedRapprochement.length} paiement(s) rapproché(s)`, 'success');
            this.selectedRapprochement = [];
            this.selectAllRapprochement = false;
            this.showRapprochementModal = false;
        },

        toggleSelectAll() {
            if (this.selectAll) {
                this.selectedPaiements = this.paginatedPaiements.map(p => p.id);
            } else {
                this.selectedPaiements = [];
            }
        },

        toggleSelectAllRapprochement() {
            if (this.selectAllRapprochement) {
                this.selectedRapprochement = this.paiementsNonRapproches.map(p => p.id);
            } else {
                this.selectedRapprochement = [];
            }
        },

        getMontantSelection() {
            return this.paiements
                .filter(p => this.selectedPaiements.includes(p.id))
                .reduce((sum, p) => sum + p.montant, 0);
        },

        getMontantRapprochement() {
            return this.paiements
                .filter(p => this.selectedRapprochement.includes(p.id))
                .reduce((sum, p) => sum + p.montant, 0);
        },

        getTotalAffiche() {
            return this.paginatedPaiements.reduce((sum, p) => sum + p.montant, 0);
        },

        closeSaisieModal() {
            this.showSaisieModal = false;
            this.paiementForm = {
                clientNom: '',
                clientEmail: '',
                numeroFacture: '',
                montant: 0,
                datePaiement: '',
                modePaiement: '',
                referenceTransaction: '',
                notes: ''
            };
        },

        savePaiement() {
            if (!this.paiementForm.clientNom || !this.paiementForm.numeroFacture ||
                !this.paiementForm.montant || !this.paiementForm.datePaiement || !this.paiementForm.modePaiement) {
                this.showMessage('Veuillez remplir tous les champs obligatoires', 'warning');
                return;
            }

            const newPaiement = {
                id: this.paiements.length + 1,
                reference: `PAY-${new Date().getFullYear()}-${String(this.paiements.length + 1).padStart(5, '0')}`,
                datePaiement: this.paiementForm.datePaiement,
                client: {
                    nom: this.paiementForm.clientNom,
                    email: this.paiementForm.clientEmail
                },
                numeroFacture: this.paiementForm.numeroFacture,
                montant: this.paiementForm.montant,
                modePaiement: this.paiementForm.modePaiement,
                statut: 'EN_ATTENTE',
                referenceTransaction: this.paiementForm.referenceTransaction,
                dateRapprochement: null,
                notes: this.paiementForm.notes
            };

            this.paiements.unshift(newPaiement);
            this.calculateStats();
            this.calculateModesPaiement();
            this.closeSaisieModal();
            this.showMessage('Paiement enregistré avec succès', 'success');
        },

        async exportPaiements() {
            try {
                const csvContent = [
                    ['Référence', 'Date', 'Client', 'Facture', 'Mode', 'Montant', 'Statut', 'Date Rapprochement'].join(';'),
                    ...this.filteredPaiements.map(p => [
                        p.reference,
                        this.formatDate(p.datePaiement),
                        p.client.nom,
                        p.numeroFacture,
                        p.modePaiement,
                        p.montant.toFixed(2),
                        this.getStatutLabel(p.statut),
                        p.dateRapprochement ? this.formatDate(p.dateRapprochement) : ''
                    ].join(';'))
                ].join('\n');

                const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `paiements-recus-${new Date().toISOString().split('T')[0]}.csv`;
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

        filterPaiements() {
            this.currentPage = 1;
            this.selectedPaiements = [];
            this.selectAll = false;
        },

        resetFilters() {
            this.searchQuery = '';
            this.filters = { mode: '', statut: '', periode: '' };
            this.currentPage = 1;
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
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
        formatDate(dateString) {
            if (!dateString) return '-';
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

        formatMontant(montant) {
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
            }).format(montant);
        },

        getRowClass(paiement) {
            if (paiement.statut === 'ANNULE') return 'table-secondary';
            return '';
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'EN_ATTENTE': 'bg-warning',
                'RAPPROCHE': 'bg-primary',
                'VALIDE': 'bg-success',
                'ANNULE': 'bg-danger'
            };
            return classes[statut] || 'bg-secondary';
        },

        getStatutLabel(statut) {
            const labels = {
                'EN_ATTENTE': 'En attente',
                'RAPPROCHE': 'Rapproché',
                'VALIDE': 'Validé',
                'ANNULE': 'Annulé'
            };
            return labels[statut] || statut;
        },

        getModeIcon(mode) {
            const icons = {
                'Virement': 'bi-bank',
                'Chèque': 'bi-file-earmark-text',
                'Carte': 'bi-credit-card',
                'Espèces': 'bi-cash',
                'Prélèvement': 'bi-arrow-repeat'
            };
            return icons[mode] || 'bi-cash';
        },

        getModeColor(mode) {
            const colors = {
                'Virement': 'primary',
                'Chèque': 'success',
                'Carte': 'info',
                'Espèces': 'warning',
                'Prélèvement': 'secondary'
            };
            return colors[mode] || 'secondary';
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
        if (this.charts.evolution) {
            this.charts.evolution.destroy();
        }
        if (this.charts.mode) {
            this.charts.mode.destroy();
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

.form-check-input {
    cursor: pointer;
}

.form-check-input:checked {
    background-color: #0d6efd;
    border-color: #0d6efd;
}

canvas {
    max-height: 300px;
}

/* Grid custom pour 5 colonnes */
.col-md-2-4 {
    flex: 0 0 auto;
    width: 20%;
}

@media (max-width: 768px) {
    .col-md-2-4 {
        width: 100%;
    }

    .btn-group {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .btn-group .btn {
        border-radius: 6px !important;
    }
}

@media (min-width: 769px) and (max-width: 991px) {
    .col-md-2-4 {
        width: 33.333%;
    }
}

/* Animation */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.card {
    animation: fadeIn 0.3s ease-out;
}

.alert {
    border-radius: 8px;
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