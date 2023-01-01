<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">

            <!-- En-tête -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">
                                <i class="bi bi-receipt-cutoff me-2"></i>Suivi des Factures
                            </h1>
                            <p class="text-muted mb-0">Gestion et suivi des facturations clients</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <button @click="nouvelleFacture" class="btn btn-primary">
                                <i class="bi bi-plus-circle me-1"></i>Nouvelle Facture
                            </button>
                            <button @click="exportFactures" class="btn btn-success">
                                <i class="bi bi-download me-1"></i>Exporter
                            </button>
                            <button @click="genererRapport" class="btn btn-info">
                                <i class="bi bi-file-earmark-bar-graph me-1"></i>Rapport
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
                                    <span class="text-muted small">Total Facturé</span>
                                    <h3 class="mb-0 mt-2 text-primary">{{ formatMontant(stats.totalFacture) }}</h3>
                                    <small class="text-primary">
                                        <i class="bi bi-graph-up me-1"></i>Ce mois
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-primary bg-opacity-10 text-primary">
                                    <i class="bi bi-currency-euro fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Encaissé</span>
                                    <h3 class="mb-0 mt-2 text-success">{{ formatMontant(stats.totalEncaisse) }}</h3>
                                    <small class="text-success">
                                        <i class="bi bi-check-circle me-1"></i>{{ stats.tauxEncaissement }}%
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-success bg-opacity-10 text-success">
                                    <i class="bi bi-cash-stack fa-fw fs-4"></i>
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
                                        <i class="bi bi-hourglass-split me-1"></i>{{ stats.nombreEnAttente }} factures
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
                                    <span class="text-muted small">En Retard</span>
                                    <h3 class="mb-0 mt-2 text-danger">{{ formatMontant(stats.totalRetard) }}</h3>
                                    <small class="text-danger">
                                        <i class="bi bi-exclamation-triangle me-1"></i>{{ stats.nombreRetard }} factures
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-danger bg-opacity-10 text-danger">
                                    <i class="bi bi-exclamation-triangle fa-fw fs-4"></i>
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
                                <h6 class="mb-0"><i class="bi bi-bar-chart me-2"></i>Évolution Mensuelle</h6>
                            </div>
                            <div class="card-body">
                                <canvas id="evolutionChart" height="80"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0"><i class="bi bi-pie-chart me-2"></i>Statuts</h6>
                            </div>
                            <div class="card-body">
                                <canvas id="statutChart" height="200"></canvas>
                                <div class="mt-3">
                                    <div class="d-flex justify-content-between mb-2">
                                        <span class="small">Taux d'encaissement:</span>
                                        <strong class="text-success">{{ stats.tauxEncaissement }}%</strong>
                                    </div>
                                    <div class="progress" style="height: 10px;">
                                        <div class="progress-bar bg-success"
                                            :style="{ width: stats.tauxEncaissement + '%' }"></div>
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
                                                v-model="searchQuery" @input="filterFactures">
                                            <i
                                                class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.statut" @change="filterFactures" class="form-select">
                                            <option value="">Tous statuts</option>
                                            <option value="BROUILLON">Brouillon</option>
                                            <option value="EMISE">Émise</option>
                                            <option value="ENVOYEE">Envoyée</option>
                                            <option value="PAYEE">Payée</option>
                                            <option value="RETARD">En retard</option>
                                            <option value="ANNULEE">Annulée</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.mois" @change="filterFactures" class="form-select">
                                            <option value="">Tous les mois</option>
                                            <option value="1">Janvier</option>
                                            <option value="2">Février</option>
                                            <option value="3">Mars</option>
                                            <option value="4">Avril</option>
                                            <option value="5">Mai</option>
                                            <option value="6">Juin</option>
                                            <option value="7">Juillet</option>
                                            <option value="8">Août</option>
                                            <option value="9">Septembre</option>
                                            <option value="10">Octobre</option>
                                            <option value="11">Novembre</option>
                                            <option value="12">Décembre</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.client" @change="filterFactures" class="form-select">
                                            <option value="">Tous clients</option>
                                            <option v-for="client in clientsUniques" :key="client" :value="client">
                                                {{ client }}
                                            </option>
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
                <div class="row mb-3" v-if="selectedFactures.length > 0">
                    <div class="col-12">
                        <div class="alert alert-info d-flex justify-content-between align-items-center">
                            <span>
                                <i class="bi bi-info-circle me-2"></i>
                                {{ selectedFactures.length }} facture(s) sélectionnée(s)
                            </span>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-success" @click="marquerPayeesGroupees">
                                    <i class="bi bi-check-circle me-1"></i>Marquer payées
                                </button>
                                <button class="btn btn-sm btn-info" @click="envoyerRappelGroupe">
                                    <i class="bi bi-envelope me-1"></i>Envoyer rappel
                                </button>
                                <button class="btn btn-sm btn-secondary" @click="selectedFactures = []">
                                    <i class="bi bi-x-circle me-1"></i>Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Liste des factures -->
                <div class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h6 class="mb-0">
                                        Liste des Factures
                                        <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                            {{ filteredFactures.length }} factures
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
                                                <th>Numéro</th>
                                                <th>Date</th>
                                                <th>Client</th>
                                                <th>Montant TTC</th>
                                                <th>Échéance</th>
                                                <th>Statut</th>
                                                <th>Paiement</th>
                                                <th class="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="paginatedFactures.length === 0">
                                                <td colspan="9" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucune facture trouvée</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="facture in paginatedFactures" :key="facture.id"
                                                :class="getRowClass(facture)">
                                                <td>
                                                    <input type="checkbox" class="form-check-input"
                                                        v-model="selectedFactures" :value="facture.id">
                                                </td>
                                                <td>
                                                    <strong class="text-primary">{{ facture.numero }}</strong>
                                                    <div v-if="isRetard(facture)" class="small text-danger">
                                                        <i class="bi bi-exclamation-triangle"></i> Retard
                                                    </div>
                                                </td>
                                                <td>
                                                    <small class="text-muted">
                                                        <i class="bi bi-calendar-event me-1"></i>
                                                        {{ formatDate(facture.dateEmission) }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <div><strong>{{ facture.client.nom }}</strong></div>
                                                    <small class="text-muted">{{ facture.client.email }}</small>
                                                </td>
                                                <td>
                                                    <strong class="text-success">{{ formatMontant(facture.montantTTC)
                                                        }}</strong>
                                                    <div v-if="facture.montantRestant > 0" class="small text-warning">
                                                        Reste: {{ formatMontant(facture.montantRestant) }}
                                                    </div>
                                                </td>
                                                <td>
                                                    <small
                                                        :class="getEcheanceClass(facture.dateEcheance, facture.statut)">
                                                        <i class="bi bi-clock me-1"></i>
                                                        {{ formatDate(facture.dateEcheance) }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getStatutBadgeClass(facture.statut)">
                                                        {{ getStatutLabel(facture.statut) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <small class="text-muted" v-if="facture.modePaiement">
                                                        <i class="bi" :class="getPaymentIcon(facture.modePaiement)"></i>
                                                        {{ facture.modePaiement }}
                                                    </small>
                                                    <small class="text-muted" v-else>-</small>
                                                </td>
                                                <td class="text-end">
                                                    <div class="btn-group">
                                                        <button class="btn btn-sm btn-outline-primary"
                                                            @click="viewFacture(facture)">
                                                            <i class="bi bi-eye"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-success"
                                                            @click="enregistrerPaiement(facture)"
                                                            v-if="facture.statut !== 'PAYEE' && facture.statut !== 'ANNULEE'">
                                                            <i class="bi bi-cash"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-info"
                                                            @click="telechargerPDF(facture)">
                                                            <i class="bi bi-download"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-warning"
                                                            @click="envoyerRappel(facture)"
                                                            v-if="facture.statut === 'ENVOYEE' || facture.statut === 'RETARD'">
                                                            <i class="bi bi-envelope"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- Pagination -->
                                <div v-if="filteredFactures.length > perPage" class="card-footer border-top">
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

        <!-- Modal Visualisation -->
        <div v-if="selectedFacture" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Facture {{ selectedFacture.numero }}
                            <span class="badge ms-2" :class="getStatutBadgeClass(selectedFacture.statut)">
                                {{ getStatutLabel(selectedFacture.statut) }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedFacture = null"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Aperçu facture -->
                        <div class="facture-preview p-4" style="background: white; border: 1px solid #dee2e6;">
                            <div class="row mb-4">
                                <div class="col-6">
                                    <h3 class="text-primary mb-3">FACTURE</h3>
                                    <p class="mb-1"><strong>N°:</strong> {{ selectedFacture.numero }}</p>
                                    <p class="mb-1"><strong>Date d'émission:</strong> {{
                                        formatDate(selectedFacture.dateEmission) }}</p>
                                    <p class="mb-1"><strong>Date d'échéance:</strong> {{
                                        formatDate(selectedFacture.dateEcheance) }}</p>
                                </div>
                                <div class="col-6 text-end">
                                    <h5>Office Notarial</h5>
                                    <p class="mb-1">123 Rue de la République</p>
                                    <p class="mb-1">75001 Paris</p>
                                    <p class="mb-1">Tel: +33 1 23 45 67 89</p>
                                    <p class="mb-1">contact@office-notarial.fr</p>
                                    <p class="mb-1">SIRET: 123 456 789 00012</p>
                                </div>
                            </div>

                            <div class="row mb-4">
                                <div class="col-12">
                                    <div class="card bg-light">
                                        <div class="card-body">
                                            <h6 class="mb-2">Facturer à:</h6>
                                            <p class="mb-1"><strong>{{ selectedFacture.client.nom }}</strong></p>
                                            <p class="mb-1">{{ selectedFacture.client.email }}</p>
                                            <p class="mb-1">{{ selectedFacture.client.telephone }}</p>
                                            <p class="mb-0">{{ selectedFacture.client.adresse }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-4">
                                <div class="col-12">
                                    <table class="table table-bordered">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Description</th>
                                                <th class="text-center" style="width: 10%;">Qté</th>
                                                <th class="text-end" style="width: 15%;">Prix Unit.</th>
                                                <th class="text-end" style="width: 10%;">TVA</th>
                                                <th class="text-end" style="width: 15%;">Total HT</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(ligne, index) in selectedFacture.lignes" :key="index">
                                                <td>{{ ligne.description }}</td>
                                                <td class="text-center">{{ ligne.quantite }}</td>
                                                <td class="text-end">{{ formatMontant(ligne.prixUnitaire) }}</td>
                                                <td class="text-end">{{ ligne.tva }}%</td>
                                                <td class="text-end">{{ formatMontant(ligne.quantite *
                                                    ligne.prixUnitaire) }}</td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colspan="4" class="text-end"><strong>Total HT:</strong></td>
                                                <td class="text-end"><strong>{{ formatMontant(selectedFacture.montantHT)
                                                        }}</strong></td>
                                            </tr>
                                            <tr>
                                                <td colspan="4" class="text-end"><strong>Total TVA:</strong></td>
                                                <td class="text-end"><strong>{{
                                                    formatMontant(selectedFacture.montantTVA) }}</strong></td>
                                            </tr>
                                            <tr class="table-primary">
                                                <td colspan="4" class="text-end"><strong>Total TTC:</strong></td>
                                                <td class="text-end"><strong class="fs-5">{{
                                                    formatMontant(selectedFacture.montantTTC) }}</strong></td>
                                            </tr>
                                            <tr v-if="selectedFacture.montantRestant > 0">
                                                <td colspan="4" class="text-end"><strong class="text-warning">Reste à
                                                        payer:</strong></td>
                                                <td class="text-end"><strong class="text-warning fs-5">{{
                                                    formatMontant(selectedFacture.montantRestant) }}</strong></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            <div class="row mb-3"
                                v-if="selectedFacture.paiements && selectedFacture.paiements.length > 0">
                                <div class="col-12">
                                    <h6>Historique des paiements:</h6>
                                    <table class="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Montant</th>
                                                <th>Mode</th>
                                                <th>Référence</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(paiement, index) in selectedFacture.paiements" :key="index">
                                                <td>{{ formatDate(paiement.date) }}</td>
                                                <td>{{ formatMontant(paiement.montant) }}</td>
                                                <td>{{ paiement.mode }}</td>
                                                <td>{{ paiement.reference }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div class="row" v-if="selectedFacture.notes">
                                <div class="col-12">
                                    <p class="small text-muted"><strong>Notes:</strong> {{ selectedFacture.notes }}</p>
                                </div>
                            </div>

                            <div class="row mt-4">
                                <div class="col-12">
                                    <p class="small text-muted text-center">
                                        En cas de retard de paiement, des pénalités de 3 fois le taux d'intérêt légal
                                        seront appliquées.
                                        <br>Escompte pour règlement anticipé : néant.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="selectedFacture = null">Fermer</button>
                        <button type="button" class="btn btn-warning" @click="envoyerRappel(selectedFacture)"
                            v-if="selectedFacture.statut !== 'PAYEE'">
                            <i class="bi bi-envelope me-1"></i>Envoyer Rappel
                        </button>
                        <button type="button" class="btn btn-success" @click="enregistrerPaiement(selectedFacture)"
                            v-if="selectedFacture.statut !== 'PAYEE'">
                            <i class="bi bi-cash me-1"></i>Enregistrer Paiement
                        </button>
                        <button type="button" class="btn btn-info" @click="telechargerPDF(selectedFacture)">
                            <i class="bi bi-download me-1"></i>Télécharger PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Paiement -->
        <div v-if="showPaiementModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Enregistrer un Paiement</h5>
                        <button type="button" class="btn-close" @click="showPaiementModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Facture</label>
                            <input type="text" class="form-control" :value="paiementForm.factureNumero" readonly>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Montant à payer</label>
                            <input type="text" class="form-control" :value="formatMontant(paiementForm.montantRestant)"
                                readonly>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Montant du paiement *</label>
                            <input type="number" v-model.number="paiementForm.montant" class="form-control" step="0.01"
                                :max="paiementForm.montantRestant">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Date du paiement *</label>
                            <input type="date" v-model="paiementForm.date" class="form-control">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Mode de paiement *</label>
                            <select v-model="paiementForm.mode" class="form-select">
                                <option value="">Sélectionner</option>
                                <option value="Virement">Virement</option>
                                <option value="Chèque">Chèque</option>
                                <option value="Carte">Carte bancaire</option>
                                <option value="Espèces">Espèces</option>
                                <option value="Prélèvement">Prélèvement</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Référence de transaction</label>
                            <input type="text" v-model="paiementForm.reference" class="form-control"
                                placeholder="N° de chèque, référence virement...">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Notes</label>
                            <textarea v-model="paiementForm.notes" class="form-control" rows="2"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            @click="showPaiementModal = false">Annuler</button>
                        <button type="button" class="btn btn-success" @click="savePaiement">
                            <i class="bi bi-check-circle me-1"></i>Enregistrer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SuiviFactures',

    data() {
        return {
            loading: true,
            searchQuery: '',
            currentPage: 1,
            perPage: 15,
            selectedFacture: null,
            showPaiementModal: false,
            selectAll: false,
            selectedFactures: [],
            filters: { statut: '', mois: '', client: '' },
            paiementForm: {
                factureId: null,
                factureNumero: '',
                montantRestant: 0,
                montant: 0,
                date: '',
                mode: '',
                reference: '',
                notes: ''
            },
            factures: [],
            stats: {
                totalFacture: 0,
                totalEncaisse: 0,
                totalEnAttente: 0,
                totalRetard: 0,
                nombreEnAttente: 0,
                nombreRetard: 0,
                tauxEncaissement: 0
            },
            charts: {
                evolution: null,
                statut: null
            }
        };
    },

    computed: {
        filteredFactures() {
            let result = [...this.factures];

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(f =>
                    f.numero.toLowerCase().includes(query) ||
                    f.client.nom.toLowerCase().includes(query) ||
                    f.client.email.toLowerCase().includes(query)
                );
            }

            if (this.filters.statut) result = result.filter(f => f.statut === this.filters.statut);
            if (this.filters.mois) {
                result = result.filter(f => {
                    const mois = new Date(f.dateEmission).getMonth() + 1;
                    return mois === parseInt(this.filters.mois);
                });
            }
            if (this.filters.client) result = result.filter(f => f.client.nom === this.filters.client);

            return result.sort((a, b) => new Date(b.dateEmission) - new Date(a.dateEmission));
        },

        paginatedFactures() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredFactures.slice(start, start + this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filteredFactures.length / this.perPage);
        },

        clientsUniques() {
            return [...new Set(this.factures.map(f => f.client.nom))].sort();
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
                const statuts = ['BROUILLON', 'EMISE', 'ENVOYEE', 'PAYEE', 'RETARD', 'ANNULEE'];
                const modesPaiement = ['Virement', 'Chèque', 'Carte', 'Espèces', 'Prélèvement'];
                const clients = [
                    { nom: 'Jean Dupont', email: 'jean.dupont@email.com', telephone: '+33 6 12 34 56 78', adresse: '123 Rue de Paris, 75001 Paris' },
                    { nom: 'Marie Martin', email: 'marie.martin@email.com', telephone: '+33 6 23 45 67 89', adresse: '456 Avenue Victor Hugo, 75016 Paris' },
                    { nom: 'Pierre Durand', email: 'pierre.durand@email.com', telephone: '+33 6 34 56 78 90', adresse: '789 Boulevard Haussmann, 75008 Paris' },
                    { nom: 'Sophie Bernard', email: 'sophie.bernard@email.com', telephone: '+33 6 45 67 89 01', adresse: '321 Rue de Rivoli, 75004 Paris' }
                ];

                this.factures = Array.from({ length: 40 }, (_, i) => {
                    const baseDate = new Date();
                    const randomDays = Math.floor(Math.random() * 90);
                    const dateEmission = new Date(baseDate);
                    dateEmission.setDate(baseDate.getDate() - randomDays);

                    const dateEcheance = new Date(dateEmission);
                    dateEcheance.setDate(dateEmission.getDate() + 30);

                    const client = clients[Math.floor(Math.random() * clients.length)];

                    const lignes = Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, j) => ({
                        description: `Prestation ${j + 1}`,
                        quantite: Math.floor(Math.random() * 3) + 1,
                        prixUnitaire: Math.floor(Math.random() * 800) + 200,
                        tva: [0, 5.5, 10, 20][Math.floor(Math.random() * 4)]
                    }));

                    const montantHT = lignes.reduce((sum, l) => sum + (l.quantite * l.prixUnitaire), 0);
                    const montantTVA = lignes.reduce((sum, l) => sum + (l.quantite * l.prixUnitaire * l.tva / 100), 0);
                    const montantTTC = montantHT + montantTVA;

                    let statut = statuts[Math.floor(Math.random() * statuts.length)];

                    // Vérifier si en retard
                    if (statut === 'ENVOYEE' && new Date() > dateEcheance) {
                        statut = 'RETARD';
                    }

                    const estPayee = statut === 'PAYEE';
                    const montantRestant = estPayee ? 0 : montantTTC;

                    const paiements = estPayee ? [{
                        date: new Date(dateEmission.getTime() + Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        montant: montantTTC,
                        mode: modesPaiement[Math.floor(Math.random() * modesPaiement.length)],
                        reference: `PAY-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`
                    }] : [];

                    return {
                        id: i + 1,
                        numero: `FACT-${new Date().getFullYear()}-${String(i + 1).padStart(5, '0')}`,
                        dateEmission: dateEmission.toISOString().split('T')[0],
                        dateEcheance: dateEcheance.toISOString().split('T')[0],
                        client: { ...client },
                        lignes: lignes,
                        montantHT: montantHT,
                        montantTVA: montantTVA,
                        montantTTC: montantTTC,
                        montantRestant: montantRestant,
                        statut: statut,
                        modePaiement: estPayee ? modesPaiement[Math.floor(Math.random() * modesPaiement.length)] : null,
                        paiements: paiements,
                        notes: Math.random() > 0.7 ? 'Notes concernant cette facture' : ''
                    };
                });

                this.calculateStats();
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

            const facturesMois = this.factures.filter(f => {
                const date = new Date(f.dateEmission);
                return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
            });

            this.stats.totalFacture = facturesMois.reduce((sum, f) => sum + f.montantTTC, 0);
            this.stats.totalEncaisse = facturesMois.filter(f => f.statut === 'PAYEE').reduce((sum, f) => sum + f.montantTTC, 0);

            const facturesEnAttente = this.factures.filter(f => f.statut === 'ENVOYEE' || f.statut === 'EMISE');
            this.stats.totalEnAttente = facturesEnAttente.reduce((sum, f) => sum + f.montantRestant, 0);
            this.stats.nombreEnAttente = facturesEnAttente.length;

            const facturesRetard = this.factures.filter(f => f.statut === 'RETARD');
            this.stats.totalRetard = facturesRetard.reduce((sum, f) => sum + f.montantRestant, 0);
            this.stats.nombreRetard = facturesRetard.length;

            this.stats.tauxEncaissement = this.stats.totalFacture > 0 ?
                Math.round((this.stats.totalEncaisse / this.stats.totalFacture) * 100) : 0;
        },

        initCharts() {
            // Graphique d'évolution
            const ctxEvolution = document.getElementById('evolutionChart');
            if (ctxEvolution && window.Chart) {
                const derniersMois = ['Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
                const dataFacture = [45000, 52000, 48000, 55000, 60000, 58000];
                const dataEncaisse = [42000, 50000, 46000, 52000, 57000, 48000];

                this.charts.evolution = new Chart(ctxEvolution, {
                    type: 'bar',
                    data: {
                        labels: derniersMois,
                        datasets: [
                            {
                                label: 'Facturé',
                                data: dataFacture,
                                backgroundColor: 'rgba(13, 110, 253, 0.8)',
                                borderColor: '#0d6efd',
                                borderWidth: 1
                            },
                            {
                                label: 'Encaissé',
                                data: dataEncaisse,
                                backgroundColor: 'rgba(25, 135, 84, 0.8)',
                                borderColor: '#198754',
                                borderWidth: 1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: {
                                position: 'top',
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

            // Graphique de statut
            const ctxStatut = document.getElementById('statutChart');
            if (ctxStatut && window.Chart) {
                const payees = this.factures.filter(f => f.statut === 'PAYEE').length;
                const envoyees = this.factures.filter(f => f.statut === 'ENVOYEE').length;
                const retard = this.factures.filter(f => f.statut === 'RETARD').length;
                const autres = this.factures.filter(f => !['PAYEE', 'ENVOYEE', 'RETARD'].includes(f.statut)).length;

                this.charts.statut = new Chart(ctxStatut, {
                    type: 'doughnut',
                    data: {
                        labels: ['Payées', 'Envoyées', 'En retard', 'Autres'],
                        datasets: [{
                            data: [payees, envoyees, retard, autres],
                            backgroundColor: ['#198754', '#0dcaf0', '#dc3545', '#6c757d'],
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

        nouvelleFacture() {
            this.showMessage('Fonctionnalité de création disponible prochainement', 'info');
        },

        viewFacture(facture) {
            this.selectedFacture = facture;
        },

        enregistrerPaiement(facture) {
            this.paiementForm = {
                factureId: facture.id,
                factureNumero: facture.numero,
                montantRestant: facture.montantRestant,
                montant: facture.montantRestant,
                date: new Date().toISOString().split('T')[0],
                mode: '',
                reference: '',
                notes: ''
            };
            this.showPaiementModal = true;
            if (this.selectedFacture) {
                this.selectedFacture = null;
            }
        },

        savePaiement() {
            if (!this.paiementForm.montant || !this.paiementForm.date || !this.paiementForm.mode) {
                this.showMessage('Veuillez remplir tous les champs obligatoires', 'warning');
                return;
            }

            if (this.paiementForm.montant > this.paiementForm.montantRestant) {
                this.showMessage('Le montant ne peut pas dépasser le montant restant', 'warning');
                return;
            }

            const index = this.factures.findIndex(f => f.id === this.paiementForm.factureId);
            if (index !== -1) {
                const facture = this.factures[index];

                // Ajouter le paiement
                if (!facture.paiements) facture.paiements = [];
                facture.paiements.push({
                    date: this.paiementForm.date,
                    montant: this.paiementForm.montant,
                    mode: this.paiementForm.mode,
                    reference: this.paiementForm.reference || '-',
                    notes: this.paiementForm.notes
                });

                // Mettre à jour le montant restant
                facture.montantRestant -= this.paiementForm.montant;

                // Mettre à jour le statut
                if (facture.montantRestant <= 0) {
                    facture.statut = 'PAYEE';
                    facture.modePaiement = this.paiementForm.mode;
                }

                this.calculateStats();
                this.showMessage('Paiement enregistré avec succès', 'success');
                this.showPaiementModal = false;

                // Mise à jour des graphiques
                if (this.charts.statut) {
                    const payees = this.factures.filter(f => f.statut === 'PAYEE').length;
                    const envoyees = this.factures.filter(f => f.statut === 'ENVOYEE').length;
                    const retard = this.factures.filter(f => f.statut === 'RETARD').length;
                    const autres = this.factures.filter(f => !['PAYEE', 'ENVOYEE', 'RETARD'].includes(f.statut)).length;

                    this.charts.statut.data.datasets[0].data = [payees, envoyees, retard, autres];
                    this.charts.statut.update();
                }
            }
        },

        async telechargerPDF(facture) {
            try {
                const content = `
FACTURE - ${facture.numero}
${'='.repeat(60)}

Office Notarial
123 Rue de la République
75001 Paris
Tel: +33 1 23 45 67 89
SIRET: 123 456 789 00012

Date d'émission: ${this.formatDate(facture.dateEmission)}
Date d'échéance: ${this.formatDate(facture.dateEcheance)}

FACTURER À
----------
${facture.client.nom}
${facture.client.email}
${facture.client.telephone}
${facture.client.adresse}

PRESTATIONS
-----------
${facture.lignes.map(l =>
                    `${l.description}
  Quantité: ${l.quantite} x ${this.formatMontant(l.prixUnitaire)}
  TVA: ${l.tva}%
  Total HT: ${this.formatMontant(l.quantite * l.prixUnitaire)}`
                ).join('\n\n')}

TOTAUX
------
Total HT:  ${this.formatMontant(facture.montantHT)}
Total TVA: ${this.formatMontant(facture.montantTVA)}
Total TTC: ${this.formatMontant(facture.montantTTC)}

${facture.montantRestant > 0 ? `Reste à payer: ${this.formatMontant(facture.montantRestant)}\n` : ''}

${facture.paiements && facture.paiements.length > 0 ? `
PAIEMENTS REÇUS
---------------
${facture.paiements.map(p => `${this.formatDate(p.date)} - ${this.formatMontant(p.montant)} (${p.mode})`).join('\n')}
` : ''}

${facture.notes ? `NOTES\n-----\n${facture.notes}\n` : ''}

CONDITIONS
----------
En cas de retard de paiement, des pénalités de 3 fois le taux d'intérêt légal seront appliquées.
Escompte pour règlement anticipé : néant.
                `.trim();

                const blob = new Blob([content], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${facture.numero}.txt`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                this.showMessage('Facture téléchargée', 'success');
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors du téléchargement', 'error');
            }
        },

        envoyerRappel(facture) {
            this.showMessage(`Rappel envoyé à ${facture.client.email}`, 'success');
        },

        envoyerRappelGroupe() {
            const count = this.selectedFactures.length;
            this.showMessage(`Rappels envoyés pour ${count} facture(s)`, 'success');
            this.selectedFactures = [];
            this.selectAll = false;
        },

        marquerPayeesGroupees() {
            this.selectedFactures.forEach(id => {
                const index = this.factures.findIndex(f => f.id === id);
                if (index !== -1) {
                    this.factures[index].statut = 'PAYEE';
                    this.factures[index].montantRestant = 0;
                    this.factures[index].modePaiement = 'Virement';
                }
            });

            this.calculateStats();
            this.showMessage(`${this.selectedFactures.length} facture(s) marquée(s) comme payée(s)`, 'success');
            this.selectedFactures = [];
            this.selectAll = false;
        },

        toggleSelectAll() {
            if (this.selectAll) {
                this.selectedFactures = this.paginatedFactures.map(f => f.id);
            } else {
                this.selectedFactures = [];
            }
        },

        async exportFactures() {
            try {
                const csvContent = [
                    ['Numéro', 'Date', 'Client', 'Email', 'Montant HT', 'TVA', 'Montant TTC', 'Reste', 'Échéance', 'Statut'].join(';'),
                    ...this.filteredFactures.map(f => [
                        f.numero,
                        this.formatDate(f.dateEmission),
                        f.client.nom,
                        f.client.email,
                        f.montantHT.toFixed(2),
                        f.montantTVA.toFixed(2),
                        f.montantTTC.toFixed(2),
                        f.montantRestant.toFixed(2),
                        this.formatDate(f.dateEcheance),
                        this.getStatutLabel(f.statut)
                    ].join(';'))
                ].join('\n');

                const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `factures-${new Date().toISOString().split('T')[0]}.csv`;
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

        genererRapport() {
            const rapport = `
RAPPORT DE FACTURATION
======================
Période: ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}

SYNTHÈSE
--------
Total facturé: ${this.formatMontant(this.stats.totalFacture)}
Total encaissé: ${this.formatMontant(this.stats.totalEncaisse)}
Taux d'encaissement: ${this.stats.tauxEncaissement}%
En attente de paiement: ${this.formatMontant(this.stats.totalEnAttente)} (${this.stats.nombreEnAttente} factures)
En retard: ${this.formatMontant(this.stats.totalRetard)} (${this.stats.nombreRetard} factures)

RÉPARTITION PAR STATUT
-----------------------
${['BROUILLON', 'EMISE', 'ENVOYEE', 'PAYEE', 'RETARD', 'ANNULEE'].map(s => {
                const count = this.factures.filter(f => f.statut === s).length;
                const montant = this.factures.filter(f => f.statut === s).reduce((sum, f) => sum + f.montantTTC, 0);
                return `${this.getStatutLabel(s)}: ${count} factures - ${this.formatMontant(montant)}`;
            }).join('\n')}

CLIENTS PRINCIPAUX
------------------
${this.clientsUniques.slice(0, 10).map(client => {
                const facturesClient = this.factures.filter(f => f.client.nom === client);
                const montantTotal = facturesClient.reduce((sum, f) => sum + f.montantTTC, 0);
                return `${client}: ${facturesClient.length} factures - ${this.formatMontant(montantTotal)}`;
            }).join('\n')}
            `.trim();

            const blob = new Blob([rapport], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `rapport-facturation-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            this.showMessage('Rapport généré avec succès', 'success');
        },

        filterFactures() {
            this.currentPage = 1;
            this.selectedFactures = [];
            this.selectAll = false;
        },

        resetFilters() {
            this.searchQuery = '';
            this.filters = { statut: '', mois: '', client: '' };
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

        isRetard(facture) {
            if (facture.statut === 'PAYEE' || facture.statut === 'ANNULEE') return false;
            const today = new Date();
            const echeance = new Date(facture.dateEcheance);
            return echeance < today;
        },

        getEcheanceClass(dateEcheance, statut) {
            if (statut === 'PAYEE' || statut === 'ANNULEE') return 'text-muted';

            const today = new Date();
            const echeance = new Date(dateEcheance);
            const diffDays = Math.ceil((echeance - today) / (1000 * 60 * 60 * 24));

            if (diffDays < 0) return 'text-danger fw-bold';
            if (diffDays <= 7) return 'text-warning fw-bold';
            return 'text-muted';
        },

        getRowClass(facture) {
            if (facture.statut === 'RETARD') return 'table-danger';
            if (this.isRetard(facture)) return 'table-warning';
            return '';
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'BROUILLON': 'bg-secondary',
                'EMISE': 'bg-info',
                'ENVOYEE': 'bg-primary',
                'PAYEE': 'bg-success',
                'RETARD': 'bg-danger',
                'ANNULEE': 'bg-dark'
            };
            return classes[statut] || 'bg-secondary';
        },

        getStatutLabel(statut) {
            const labels = {
                'BROUILLON': 'Brouillon',
                'EMISE': 'Émise',
                'ENVOYEE': 'Envoyée',
                'PAYEE': 'Payée',
                'RETARD': 'En retard',
                'ANNULEE': 'Annulée'
            };
            return labels[statut] || statut;
        },

        getPaymentIcon(mode) {
            const icons = {
                'Virement': 'bi-bank',
                'Chèque': 'bi-file-earmark-text',
                'Carte': 'bi-credit-card',
                'Espèces': 'bi-cash',
                'Prélèvement': 'bi-arrow-repeat'
            };
            return icons[mode] || 'bi-cash';
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
        if (this.charts.statut) {
            this.charts.statut.destroy();
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

/* Facture preview */
.facture-preview {
    font-family: Arial, sans-serif;
}

.facture-preview h3,
.facture-preview h5,
.facture-preview h6 {
    color: #212529;
}

.facture-preview .table {
    font-size: 0.95rem;
}

/* Progress bar */
.progress {
    border-radius: 10px;
}

.progress-bar {
    border-radius: 10px;
}

canvas {
    max-height: 300px;
}

/* Responsive */
@media (max-width: 768px) {
    .btn-group {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .btn-group .btn {
        border-radius: 6px !important;
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

/* Alert custom */
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
