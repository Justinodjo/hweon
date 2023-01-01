<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">

            <!-- En-tête -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">
                                <i class="bi bi-receipt me-2"></i>Création de Devis
                            </h1>
                            <p class="text-muted mb-0">Gestion et création des devis notariaux</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <button @click="nouveauDevis" class="btn btn-primary">
                                <i class="bi bi-plus-circle me-1"></i>Nouveau Devis
                            </button>
                            <button @click="showTemplatesModal = true" class="btn btn-outline-primary">
                                <i class="bi bi-files me-1"></i>Modèles
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
                                    <span class="text-muted small">Total Devis</span>
                                    <h3 class="mb-0 mt-2 text-primary">{{ stats.total }}</h3>
                                    <small class="text-primary">
                                        <i class="bi bi-receipt me-1"></i>Créés
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-primary bg-opacity-10 text-primary">
                                    <i class="bi bi-receipt fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">En Attente</span>
                                    <h3 class="mb-0 mt-2 text-warning">{{ stats.enAttente }}</h3>
                                    <small class="text-warning">
                                        <i class="bi bi-hourglass-split me-1"></i>Non envoyés
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
                                    <span class="text-muted small">Acceptés</span>
                                    <h3 class="mb-0 mt-2 text-success">{{ stats.acceptes }}</h3>
                                    <small class="text-success">
                                        <i class="bi bi-check-circle me-1"></i>Validés
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
                                    <span class="text-muted small">Montant Total</span>
                                    <h3 class="mb-0 mt-2 text-info">{{ formatMontant(stats.montantTotal) }}</h3>
                                    <small class="text-info">
                                        <i class="bi bi-currency-euro me-1"></i>Ce mois
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-info bg-opacity-10 text-info">
                                    <i class="bi bi-currency-euro fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Formulaire de création/édition -->
                <div v-if="showEditor" class="row mb-4">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-primary text-white">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h5 class="mb-0">
                                        <i class="bi bi-plus-circle me-2"></i>
                                        {{ devisForm.id ? 'Modifier' : 'Nouveau' }} Devis
                                    </h5>
                                    <button class="btn btn-sm btn-light" @click="annulerEdition">
                                        <i class="bi bi-x-lg"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="row g-4">
                                    <!-- Informations client -->
                                    <div class="col-lg-6">
                                        <div class="card bg-light border-0">
                                            <div class="card-body">
                                                <h6 class="mb-3"><i class="bi bi-person me-2"></i>Informations Client
                                                </h6>
                                                <div class="mb-3">
                                                    <label class="form-label">Nom du client *</label>
                                                    <input type="text" v-model="devisForm.client.nom"
                                                        class="form-control" required>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label">Email *</label>
                                                    <input type="email" v-model="devisForm.client.email"
                                                        class="form-control" required>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label">Téléphone</label>
                                                    <input type="tel" v-model="devisForm.client.telephone"
                                                        class="form-control">
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label">Adresse</label>
                                                    <textarea v-model="devisForm.client.adresse" class="form-control"
                                                        rows="2"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Informations devis -->
                                    <div class="col-lg-6">
                                        <div class="card bg-light border-0">
                                            <div class="card-body">
                                                <h6 class="mb-3"><i class="bi bi-file-text me-2"></i>Informations Devis
                                                </h6>
                                                <div class="mb-3">
                                                    <label class="form-label">Objet *</label>
                                                    <input type="text" v-model="devisForm.objet" class="form-control"
                                                        required>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label">Type d'acte *</label>
                                                    <select v-model="devisForm.typeActe" class="form-select" required>
                                                        <option value="">Sélectionner</option>
                                                        <option value="VENTE">Vente immobilière</option>
                                                        <option value="DONATION">Donation</option>
                                                        <option value="SUCCESSION">Succession</option>
                                                        <option value="PRET">Prêt hypothécaire</option>
                                                        <option value="MARIAGE">Contrat de mariage</option>
                                                        <option value="AUTRE">Autre</option>
                                                    </select>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label">Date de validité *</label>
                                                    <input type="date" v-model="devisForm.dateValidite"
                                                        class="form-control" required>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label">Notes</label>
                                                    <textarea v-model="devisForm.notes" class="form-control"
                                                        rows="2"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Prestations -->
                                    <div class="col-12">
                                        <div class="card border-primary">
                                            <div class="card-header bg-primary bg-opacity-10">
                                                <div class="d-flex justify-content-between align-items-center">
                                                    <h6 class="mb-0"><i class="bi bi-list-ul me-2"></i>Prestations</h6>
                                                    <button class="btn btn-sm btn-success" @click="ajouterPrestation">
                                                        <i class="bi bi-plus-circle me-1"></i>Ajouter
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="card-body">
                                                <div v-if="devisForm.prestations.length === 0"
                                                    class="text-center py-4 text-muted">
                                                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                                                    <p>Aucune prestation ajoutée</p>
                                                </div>
                                                <div v-else class="table-responsive">
                                                    <table class="table table-hover mb-0">
                                                        <thead class="table-light">
                                                            <tr>
                                                                <th style="width: 40%;">Description</th>
                                                                <th style="width: 15%;" class="text-center">Quantité
                                                                </th>
                                                                <th style="width: 15%;" class="text-end">Prix unitaire
                                                                </th>
                                                                <th style="width: 15%;" class="text-end">TVA %</th>
                                                                <th style="width: 15%;" class="text-end">Total HT</th>
                                                                <th style="width: 5%;"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr v-for="(prestation, index) in devisForm.prestations"
                                                                :key="index">
                                                                <td>
                                                                    <input type="text" v-model="prestation.description"
                                                                        class="form-control form-control-sm"
                                                                        placeholder="Description">
                                                                </td>
                                                                <td>
                                                                    <input type="number"
                                                                        v-model.number="prestation.quantite"
                                                                        class="form-control form-control-sm text-center"
                                                                        min="1" @input="calculerTotaux">
                                                                </td>
                                                                <td>
                                                                    <input type="number"
                                                                        v-model.number="prestation.prixUnitaire"
                                                                        class="form-control form-control-sm text-end"
                                                                        step="0.01" @input="calculerTotaux">
                                                                </td>
                                                                <td>
                                                                    <select v-model.number="prestation.tva"
                                                                        class="form-select form-select-sm"
                                                                        @change="calculerTotaux">
                                                                        <option :value="0">0%</option>
                                                                        <option :value="5.5">5,5%</option>
                                                                        <option :value="10">10%</option>
                                                                        <option :value="20">20%</option>
                                                                    </select>
                                                                </td>
                                                                <td class="text-end fw-bold">
                                                                    {{ formatMontant(prestation.quantite *
                                                                        prestation.prixUnitaire) }}
                                                                </td>
                                                                <td class="text-center">
                                                                    <button class="btn btn-sm btn-outline-danger"
                                                                        @click="supprimerPrestation(index)">
                                                                        <i class="bi bi-trash"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                        <tfoot class="table-light">
                                                            <tr>
                                                                <td colspan="4" class="text-end"><strong>Total
                                                                        HT:</strong></td>
                                                                <td class="text-end fw-bold">{{
                                                                    formatMontant(totaux.totalHT) }}</td>
                                                                <td></td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan="4" class="text-end"><strong>Total
                                                                        TVA:</strong></td>
                                                                <td class="text-end fw-bold">{{
                                                                    formatMontant(totaux.totalTVA) }}</td>
                                                                <td></td>
                                                            </tr>
                                                            <tr class="table-primary">
                                                                <td colspan="4" class="text-end"><strong>Total
                                                                        TTC:</strong></td>
                                                                <td class="text-end fw-bold fs-5">{{
                                                                    formatMontant(totaux.totalTTC) }}</td>
                                                                <td></td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Actions -->
                                    <div class="col-12">
                                        <div class="d-flex justify-content-end gap-2">
                                            <button class="btn btn-secondary" @click="annulerEdition">
                                                <i class="bi bi-x-circle me-1"></i>Annuler
                                            </button>
                                            <button class="btn btn-primary" @click="sauvegarderBrouillon">
                                                <i class="bi bi-save me-1"></i>Sauvegarder Brouillon
                                            </button>
                                            <button class="btn btn-success" @click="finaliserDevis">
                                                <i class="bi bi-check-circle me-1"></i>Finaliser et Envoyer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filtres -->
                <div class="row mb-4" v-if="!showEditor">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <div class="row g-3">
                                    <div class="col-md-3">
                                        <div class="position-relative">
                                            <input type="text" class="form-control" placeholder="Rechercher..."
                                                v-model="searchQuery" @input="filterDevis">
                                            <i
                                                class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.statut" @change="filterDevis" class="form-select">
                                            <option value="">Tous statuts</option>
                                            <option value="BROUILLON">Brouillon</option>
                                            <option value="ENVOYE">Envoyé</option>
                                            <option value="ACCEPTE">Accepté</option>
                                            <option value="REFUSE">Refusé</option>
                                            <option value="EXPIRE">Expiré</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.typeActe" @change="filterDevis" class="form-select">
                                            <option value="">Tous types</option>
                                            <option value="VENTE">Vente</option>
                                            <option value="DONATION">Donation</option>
                                            <option value="SUCCESSION">Succession</option>
                                            <option value="PRET">Prêt</option>
                                            <option value="MARIAGE">Mariage</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.periode" @change="filterDevis" class="form-select">
                                            <option value="">Toutes périodes</option>
                                            <option value="AUJOURDHUI">Aujourd'hui</option>
                                            <option value="SEMAINE">Cette semaine</option>
                                            <option value="MOIS">Ce mois</option>
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

                <!-- Liste des devis -->
                <div class="row" v-if="!showEditor">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">
                                    Liste des Devis
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ filteredDevis.length }} devis
                                    </span>
                                </h6>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Numéro</th>
                                                <th>Date</th>
                                                <th>Client</th>
                                                <th>Objet / Type</th>
                                                <th>Montant TTC</th>
                                                <th>Validité</th>
                                                <th>Statut</th>
                                                <th class="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="paginatedDevis.length === 0">
                                                <td colspan="8" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucun devis trouvé</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="devis in paginatedDevis" :key="devis.id">
                                                <td>
                                                    <strong class="text-primary">{{ devis.numero }}</strong>
                                                </td>
                                                <td>
                                                    <small class="text-muted">
                                                        <i class="bi bi-calendar-event me-1"></i>
                                                        {{ formatDate(devis.dateCreation) }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <div><strong>{{ devis.client.nom }}</strong></div>
                                                    <small class="text-muted">{{ devis.client.email }}</small>
                                                </td>
                                                <td>
                                                    <div>{{ devis.objet }}</div>
                                                    <span class="badge bg-light text-dark">{{ devis.typeActe }}</span>
                                                </td>
                                                <td>
                                                    <strong class="text-success">{{ formatMontant(devis.montantTTC)
                                                    }}</strong>
                                                </td>
                                                <td>
                                                    <small :class="getValiditeClass(devis.dateValidite)">
                                                        <i class="bi bi-clock me-1"></i>
                                                        {{ formatDate(devis.dateValidite) }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getStatutBadgeClass(devis.statut)">
                                                        {{ getStatutLabel(devis.statut) }}
                                                    </span>
                                                </td>
                                                <td class="text-end">
                                                    <div class="btn-group">
                                                        <button class="btn btn-sm btn-outline-primary"
                                                            @click="visualiserDevis(devis)">
                                                            <i class="bi bi-eye"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-warning"
                                                            @click="modifierDevis(devis)"
                                                            v-if="devis.statut === 'BROUILLON'">
                                                            <i class="bi bi-pencil"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-success"
                                                            @click="telechargerPDF(devis)">
                                                            <i class="bi bi-download"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-info"
                                                            @click="envoyerEmail(devis)"
                                                            v-if="devis.statut !== 'ENVOYE'">
                                                            <i class="bi bi-envelope"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- Pagination -->
                                <div v-if="filteredDevis.length > perPage" class="card-footer border-top">
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
        <div v-if="selectedDevis" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Devis {{ selectedDevis.numero }}
                            <span class="badge ms-2" :class="getStatutBadgeClass(selectedDevis.statut)">
                                {{ getStatutLabel(selectedDevis.statut) }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedDevis = null"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Aperçu du devis -->
                        <div class="devis-preview p-4" style="background: white; border: 1px solid #dee2e6;">
                            <div class="row mb-4">
                                <div class="col-6">
                                    <h4 class="text-primary">DEVIS</h4>
                                    <p class="mb-1"><strong>N°:</strong> {{ selectedDevis.numero }}</p>
                                    <p class="mb-1"><strong>Date:</strong> {{ formatDate(selectedDevis.dateCreation) }}
                                    </p>
                                    <p class="mb-1"><strong>Validité:</strong> {{ formatDate(selectedDevis.dateValidite)
                                    }}</p>
                                </div>
                                <div class="col-6 text-end">
                                    <h5>Office Notarial</h5>
                                    <p class="mb-1">123 Rue de la République</p>
                                    <p class="mb-1">75001 Paris</p>
                                    <p class="mb-1">contact@office-notarial.fr</p>
                                </div>
                            </div>

                            <div class="row mb-4">
                                <div class="col-12">
                                    <div class="card bg-light">
                                        <div class="card-body">
                                            <h6 class="mb-2">Client:</h6>
                                            <p class="mb-1"><strong>{{ selectedDevis.client.nom }}</strong></p>
                                            <p class="mb-1">{{ selectedDevis.client.email }}</p>
                                            <p class="mb-1">{{ selectedDevis.client.telephone }}</p>
                                            <p class="mb-0">{{ selectedDevis.client.adresse }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-4">
                                <div class="col-12">
                                    <h6>Objet: {{ selectedDevis.objet }}</h6>
                                    <p class="text-muted">Type: {{ selectedDevis.typeActe }}</p>
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
                                            <tr v-for="(prest, index) in selectedDevis.prestations" :key="index">
                                                <td>{{ prest.description }}</td>
                                                <td class="text-center">{{ prest.quantite }}</td>
                                                <td class="text-end">{{ formatMontant(prest.prixUnitaire) }}</td>
                                                <td class="text-end">{{ prest.tva }}%</td>
                                                <td class="text-end">{{ formatMontant(prest.quantite *
                                                    prest.prixUnitaire) }}</td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colspan="4" class="text-end"><strong>Total HT:</strong></td>
                                                <td class="text-end"><strong>{{ formatMontant(selectedDevis.montantHT)
                                                }}</strong></td>
                                            </tr>
                                            <tr>
                                                <td colspan="4" class="text-end"><strong>Total TVA:</strong></td>
                                                <td class="text-end"><strong>{{ formatMontant(selectedDevis.montantTVA)
                                                }}</strong></td>
                                            </tr>
                                            <tr class="table-primary">
                                                <td colspan="4" class="text-end"><strong>Total TTC:</strong></td>
                                                <td class="text-end"><strong class="fs-5">{{
                                                    formatMontant(selectedDevis.montantTTC) }}</strong></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            <div class="row" v-if="selectedDevis.notes">
                                <div class="col-12">
                                    <p class="small text-muted"><strong>Notes:</strong> {{ selectedDevis.notes }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="selectedDevis = null">Fermer</button>
                        <button type="button" class="btn btn-info" @click="envoyerEmail(selectedDevis)">
                            <i class="bi bi-envelope me-1"></i>Envoyer par Email
                        </button>
                        <button type="button" class="btn btn-success" @click="telechargerPDF(selectedDevis)">
                            <i class="bi bi-download me-1"></i>Télécharger PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Modèles -->
        <div v-if="showTemplatesModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Modèles de Devis</h5>
                        <button type="button" class="btn-close" @click="showTemplatesModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div v-for="template in templates" :key="template.id" class="col-md-6">
                                <div class="card h-100 border" style="cursor: pointer;"
                                    @click="utiliserTemplate(template)">
                                    <div class="card-body">
                                        <h6 class="mb-2">
                                            <i class="bi me-2" :class="template.icon"></i>
                                            {{ template.nom }}
                                        </h6>
                                        <p class="small text-muted mb-3">{{ template.description }}</p>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <span class="badge bg-primary">{{ template.prestations.length }}
                                                prestations</span>
                                            <button class="btn btn-sm btn-outline-primary">
                                                <i class="bi bi-plus-circle me-1"></i>Utiliser
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            @click="showTemplatesModal = false">Fermer</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CreationDevis',

    data() {
        return {
            loading: true,
            searchQuery: '',
            currentPage: 1,
            perPage: 15,
            selectedDevis: null,
            showEditor: false,
            showTemplatesModal: false,
            filters: { statut: '', typeActe: '', periode: '' },
            devisForm: {
                id: null,
                client: {
                    nom: '',
                    email: '',
                    telephone: '',
                    adresse: ''
                },
                objet: '',
                typeActe: '',
                dateValidite: '',
                notes: '',
                prestations: []
            },
            totaux: {
                totalHT: 0,
                totalTVA: 0,
                totalTTC: 0
            },
            devis: [],
            stats: { total: 0, enAttente: 0, acceptes: 0, montantTotal: 0 },
            templates: []
        };
    },

    computed: {
        filteredDevis() {
            let result = [...this.devis];

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(d =>
                    d.numero.toLowerCase().includes(query) ||
                    d.client.nom.toLowerCase().includes(query) ||
                    d.objet.toLowerCase().includes(query) ||
                    d.client.email.toLowerCase().includes(query)
                );
            }

            if (this.filters.statut) result = result.filter(d => d.statut === this.filters.statut);
            if (this.filters.typeActe) result = result.filter(d => d.typeActe === this.filters.typeActe);

            if (this.filters.periode) {
                const today = new Date();
                if (this.filters.periode === 'AUJOURDHUI') {
                    const todayStr = today.toISOString().split('T')[0];
                    result = result.filter(d => d.dateCreation === todayStr);
                } else if (this.filters.periode === 'SEMAINE') {
                    const startOfWeek = new Date(today);
                    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
                    result = result.filter(d => new Date(d.dateCreation) >= startOfWeek);
                } else if (this.filters.periode === 'MOIS') {
                    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    result = result.filter(d => new Date(d.dateCreation) >= startOfMonth);
                }
            }

            return result.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));
        },

        paginatedDevis() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredDevis.slice(start, start + this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filteredDevis.length / this.perPage);
        }
    },

    async mounted() {
        await this.loadData();
        this.initTemplates();
    },

    methods: {
        async loadData() {
            try {
                this.loading = true;
                const statuts = ['BROUILLON', 'ENVOYE', 'ACCEPTE', 'REFUSE', 'EXPIRE'];
                const typesActe = ['VENTE', 'DONATION', 'SUCCESSION', 'PRET', 'MARIAGE', 'AUTRE'];
                const clients = [
                    { nom: 'Jean Dupont', email: 'jean.dupont@email.com', telephone: '+33 6 12 34 56 78', adresse: '123 Rue de Paris, 75001 Paris' },
                    { nom: 'Marie Martin', email: 'marie.martin@email.com', telephone: '+33 6 23 45 67 89', adresse: '456 Avenue Victor Hugo, 75016 Paris' },
                    { nom: 'Pierre Durand', email: 'pierre.durand@email.com', telephone: '+33 6 34 56 78 90', adresse: '789 Boulevard Haussmann, 75008 Paris' }
                ];

                this.devis = Array.from({ length: 25 }, (_, i) => {
                    const baseDate = new Date();
                    const randomDays = Math.floor(Math.random() * 60);
                    const dateCreation = new Date(baseDate);
                    dateCreation.setDate(baseDate.getDate() - randomDays);

                    const dateValidite = new Date(dateCreation);
                    dateValidite.setDate(dateCreation.getDate() + 30);

                    const client = clients[Math.floor(Math.random() * clients.length)];
                    const typeActe = typesActe[Math.floor(Math.random() * typesActe.length)];

                    const prestations = Array.from({ length: Math.floor(Math.random() * 3) + 2 }, (_, j) => ({
                        description: `Prestation ${j + 1} - ${typeActe}`,
                        quantite: Math.floor(Math.random() * 3) + 1,
                        prixUnitaire: Math.floor(Math.random() * 500) + 100,
                        tva: [0, 5.5, 10, 20][Math.floor(Math.random() * 4)]
                    }));

                    const montantHT = prestations.reduce((sum, p) => sum + (p.quantite * p.prixUnitaire), 0);
                    const montantTVA = prestations.reduce((sum, p) => sum + (p.quantite * p.prixUnitaire * p.tva / 100), 0);
                    const montantTTC = montantHT + montantTVA;

                    return {
                        id: i + 1,
                        numero: `DEV-${new Date().getFullYear()}-${String(i + 1).padStart(5, '0')}`,
                        dateCreation: dateCreation.toISOString().split('T')[0],
                        dateValidite: dateValidite.toISOString().split('T')[0],
                        client: { ...client },
                        objet: `${typeActe} - Dossier ${i + 1}`,
                        typeActe: typeActe,
                        statut: statuts[Math.floor(Math.random() * statuts.length)],
                        prestations: prestations,
                        montantHT: montantHT,
                        montantTVA: montantTVA,
                        montantTTC: montantTTC,
                        notes: Math.random() > 0.5 ? 'Notes concernant ce devis' : ''
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

        initTemplates() {
            this.templates = [
                {
                    id: 1,
                    nom: 'Vente Immobilière Standard',
                    icon: 'bi-house',
                    description: 'Template pour une vente immobilière classique',
                    prestations: [
                        { description: 'Rédaction acte de vente', quantite: 1, prixUnitaire: 800, tva: 20 },
                        { description: 'Frais de formalités', quantite: 1, prixUnitaire: 250, tva: 20 },
                        { description: 'Recherches hypothécaires', quantite: 1, prixUnitaire: 150, tva: 20 }
                    ]
                },
                {
                    id: 2,
                    nom: 'Donation Simple',
                    icon: 'bi-gift',
                    description: 'Template pour donation entre particuliers',
                    prestations: [
                        { description: 'Acte de donation', quantite: 1, prixUnitaire: 600, tva: 20 },
                        { description: 'Enregistrement', quantite: 1, prixUnitaire: 150, tva: 20 }
                    ]
                },
                {
                    id: 3,
                    nom: 'Succession',
                    icon: 'bi-person-lines-fill',
                    description: 'Template pour règlement de succession',
                    prestations: [
                        { description: 'Déclaration de succession', quantite: 1, prixUnitaire: 1200, tva: 20 },
                        { description: 'Certificat hérédité', quantite: 1, prixUnitaire: 300, tva: 20 },
                        { description: 'Formalités administratives', quantite: 1, prixUnitaire: 400, tva: 20 }
                    ]
                },
                {
                    id: 4,
                    nom: 'Prêt Hypothécaire',
                    icon: 'bi-bank',
                    description: 'Template pour acte de prêt avec hypothèque',
                    prestations: [
                        { description: 'Acte de prêt hypothécaire', quantite: 1, prixUnitaire: 900, tva: 20 },
                        { description: 'Inscription hypothécaire', quantite: 1, prixUnitaire: 350, tva: 20 }
                    ]
                }
            ];
        },

        calculateStats() {
            this.stats.total = this.devis.length;
            this.stats.enAttente = this.devis.filter(d => d.statut === 'BROUILLON').length;
            this.stats.acceptes = this.devis.filter(d => d.statut === 'ACCEPTE').length;

            const thisMonth = new Date().getMonth();
            const thisYear = new Date().getFullYear();
            this.stats.montantTotal = this.devis
                .filter(d => {
                    const date = new Date(d.dateCreation);
                    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
                })
                .reduce((sum, d) => sum + d.montantTTC, 0);
        },

        nouveauDevis() {
            this.devisForm = {
                id: null,
                client: { nom: '', email: '', telephone: '', adresse: '' },
                objet: '',
                typeActe: '',
                dateValidite: this.getDefaultValidite(),
                notes: '',
                prestations: []
            };
            this.totaux = { totalHT: 0, totalTVA: 0, totalTTC: 0 };
            this.showEditor = true;
        },

        getDefaultValidite() {
            const date = new Date();
            date.setDate(date.getDate() + 30);
            return date.toISOString().split('T')[0];
        },

        ajouterPrestation() {
            this.devisForm.prestations.push({
                description: '',
                quantite: 1,
                prixUnitaire: 0,
                tva: 20
            });
        },

        supprimerPrestation(index) {
            this.devisForm.prestations.splice(index, 1);
            this.calculerTotaux();
        },

        calculerTotaux() {
            this.totaux.totalHT = this.devisForm.prestations.reduce((sum, p) => {
                return sum + (p.quantite * p.prixUnitaire);
            }, 0);

            this.totaux.totalTVA = this.devisForm.prestations.reduce((sum, p) => {
                return sum + (p.quantite * p.prixUnitaire * p.tva / 100);
            }, 0);

            this.totaux.totalTTC = this.totaux.totalHT + this.totaux.totalTVA;
        },

        sauvegarderBrouillon() {
            if (!this.validerFormulaire()) return;

            const devis = this.creerDevis('BROUILLON');

            if (this.devisForm.id) {
                const index = this.devis.findIndex(d => d.id === this.devisForm.id);
                if (index !== -1) {
                    this.devis[index] = devis;
                    this.showMessage('Devis mis à jour', 'success');
                }
            } else {
                this.devis.unshift(devis);
                this.showMessage('Brouillon enregistré', 'success');
            }

            this.calculateStats();
            this.annulerEdition();
        },

        finaliserDevis() {
            if (!this.validerFormulaire()) return;

            if (this.devisForm.prestations.length === 0) {
                this.showMessage('Veuillez ajouter au moins une prestation', 'warning');
                return;
            }

            const devis = this.creerDevis('ENVOYE');

            if (this.devisForm.id) {
                const index = this.devis.findIndex(d => d.id === this.devisForm.id);
                if (index !== -1) {
                    this.devis[index] = devis;
                }
            } else {
                this.devis.unshift(devis);
            }

            this.calculateStats();
            this.showMessage('Devis finalisé et envoyé', 'success');
            this.annulerEdition();
        },

        creerDevis(statut) {
            return {
                id: this.devisForm.id || this.devis.length + 1,
                numero: this.devisForm.id ?
                    this.devis.find(d => d.id === this.devisForm.id).numero :
                    `DEV-${new Date().getFullYear()}-${String(this.devis.length + 1).padStart(5, '0')}`,
                dateCreation: new Date().toISOString().split('T')[0],
                dateValidite: this.devisForm.dateValidite,
                client: { ...this.devisForm.client },
                objet: this.devisForm.objet,
                typeActe: this.devisForm.typeActe,
                statut: statut,
                prestations: [...this.devisForm.prestations],
                montantHT: this.totaux.totalHT,
                montantTVA: this.totaux.totalTVA,
                montantTTC: this.totaux.totalTTC,
                notes: this.devisForm.notes
            };
        },

        validerFormulaire() {
            if (!this.devisForm.client.nom || !this.devisForm.client.email) {
                this.showMessage('Veuillez renseigner le nom et l\'email du client', 'warning');
                return false;
            }
            if (!this.devisForm.objet || !this.devisForm.typeActe) {
                this.showMessage('Veuillez renseigner l\'objet et le type d\'acte', 'warning');
                return false;
            }
            if (!this.devisForm.dateValidite) {
                this.showMessage('Veuillez renseigner la date de validité', 'warning');
                return false;
            }
            return true;
        },

        annulerEdition() {
            this.showEditor = false;
            this.devisForm = {
                id: null,
                client: { nom: '', email: '', telephone: '', adresse: '' },
                objet: '',
                typeActe: '',
                dateValidite: '',
                notes: '',
                prestations: []
            };
            this.totaux = { totalHT: 0, totalTVA: 0, totalTTC: 0 };
        },

        modifierDevis(devis) {
            this.devisForm = {
                id: devis.id,
                client: { ...devis.client },
                objet: devis.objet,
                typeActe: devis.typeActe,
                dateValidite: devis.dateValidite,
                notes: devis.notes,
                prestations: devis.prestations.map(p => ({ ...p }))
            };
            this.calculerTotaux();
            this.showEditor = true;
        },

        visualiserDevis(devis) {
            this.selectedDevis = devis;
        },

        utiliserTemplate(template) {
            this.devisForm.prestations = template.prestations.map(p => ({ ...p }));
            this.calculerTotaux();
            this.showTemplatesModal = false;
            this.showMessage(`Modèle "${template.nom}" appliqué`, 'success');
        },

        async telechargerPDF(devis) {
            try {
                const content = `
DEVIS - ${devis.numero}
${'='.repeat(50)}

Date d'émission: ${this.formatDate(devis.dateCreation)}
Date de validité: ${this.formatDate(devis.dateValidite)}

CLIENT
------
${devis.client.nom}
${devis.client.email}
${devis.client.telephone}
${devis.client.adresse}

OBJET
-----
${devis.objet}
Type: ${devis.typeActe}

PRESTATIONS
-----------
${devis.prestations.map(p =>
                    `${p.description}
  Quantité: ${p.quantite} x ${this.formatMontant(p.prixUnitaire)}
  TVA: ${p.tva}%
  Total HT: ${this.formatMontant(p.quantite * p.prixUnitaire)}`
                ).join('\n\n')}

TOTAUX
------
Total HT:  ${this.formatMontant(devis.montantHT)}
Total TVA: ${this.formatMontant(devis.montantTVA)}
Total TTC: ${this.formatMontant(devis.montantTTC)}

${devis.notes ? `\nNOTES\n-----\n${devis.notes}` : ''}
                `.trim();

                const blob = new Blob([content], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${devis.numero}.txt`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                this.showMessage('Devis téléchargé', 'success');
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors du téléchargement', 'error');
            }
        },

        async envoyerEmail(devis) {
            try {
                // Simulation d'envoi
                const index = this.devis.findIndex(d => d.id === devis.id);
                if (index !== -1) {
                    this.devis[index].statut = 'ENVOYE';
                }
                this.calculateStats();
                this.showMessage(`Devis ${devis.numero} envoyé à ${devis.client.email}`, 'success');
                if (this.selectedDevis) {
                    this.selectedDevis = null;
                }
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors de l\'envoi', 'error');
            }
        },

        filterDevis() {
            this.currentPage = 1;
        },

        resetFilters() {
            this.searchQuery = '';
            this.filters = { statut: '', typeActe: '', periode: '' };
            this.currentPage = 1;
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },

        async rafraichir() {
            await this.loadData();
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

        getValiditeClass(dateValidite) {
            const today = new Date();
            const validite = new Date(dateValidite);
            const diffDays = Math.ceil((validite - today) / (1000 * 60 * 60 * 24));

            if (diffDays < 0) return 'text-danger fw-bold';
            if (diffDays <= 7) return 'text-warning fw-bold';
            return 'text-muted';
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'BROUILLON': 'bg-secondary',
                'ENVOYE': 'bg-info',
                'ACCEPTE': 'bg-success',
                'REFUSE': 'bg-danger',
                'EXPIRE': 'bg-warning'
            };
            return classes[statut] || 'bg-secondary';
        },

        getStatutLabel(statut) {
            const labels = {
                'BROUILLON': 'Brouillon',
                'ENVOYE': 'Envoyé',
                'ACCEPTE': 'Accepté',
                'REFUSE': 'Refusé',
                'EXPIRE': 'Expiré'
            };
            return labels[statut] || statut;
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

/* Devis preview */
.devis-preview {
    font-family: Arial, sans-serif;
}

.devis-preview h4,
.devis-preview h5,
.devis-preview h6 {
    color: #212529;
}

.devis-preview .table {
    font-size: 0.95rem;
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