<template>
    <div class="page-content pt-0">
        <div class="page-content-wrapper vstack container gap-4">
            <!-- En-tête -->
            <div class="row">
                <div class="col-sm-12 mb-5">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <h1 class="h3 mb-2 mb-sm-0">Déclarations Fiscales</h1>
                        <div class="d-flex gap-2">
                            <button @click="nouvelleDeclaration" class="btn btn-primary mb-0">
                                <i class="bi bi-plus-lg fa-fw"></i> Nouvelle Déclaration
                            </button>
                            <button @click="exporterDeclarations" class="btn btn-success mb-0">
                                <i class="bi bi-download fa-fw"></i> Exporter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Statistiques fiscales -->
            <div class="row g-4 mb-5">
                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>Revenus Locatifs (Année)</span>
                                <h3 class="mb-0 mt-2">{{ formatCurrency(stats.revenusLocatifs) }}</h3>
                            </div>
                            <div
                                class="icon-lg rounded-circle flex-shrink-0 bg-primary bg-opacity-10 text-primary mb-0">
                                <i class="bi bi-cash-coin fa-fw"></i>
                            </div>
                        </div>
                        <span>Base imposable</span>
                    </div>
                </div>

                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>Impôts Dus</span>
                                <h3 class="mb-0 mt-2 text-danger">{{ formatCurrency(stats.impotsDus) }}</h3>
                            </div>
                            <div class="icon-lg rounded-circle flex-shrink-0 bg-danger bg-opacity-10 text-danger mb-0">
                                <i class="bi bi-file-earmark-text fa-fw"></i>
                            </div>
                        </div>
                        <span><span class="text-danger">{{ stats.tauxImposition }}%</span> taux moyen</span>
                    </div>
                </div>

                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>Déductions</span>
                                <h3 class="mb-0 mt-2 text-success">{{ formatCurrency(stats.deductions) }}</h3>
                            </div>
                            <div
                                class="icon-lg rounded-circle flex-shrink-0 bg-success bg-opacity-10 text-success mb-0">
                                <i class="bi bi-arrow-down-circle fa-fw"></i>
                            </div>
                        </div>
                        <span>Charges déductibles</span>
                    </div>
                </div>

                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>Déclarations en Attente</span>
                                <h3 class="mb-0 mt-2 text-warning">{{ stats.declarationsEnAttente }}</h3>
                            </div>
                            <div
                                class="icon-lg rounded-circle flex-shrink-0 bg-warning bg-opacity-10 text-warning mb-0">
                                <i class="bi bi-hourglass-split fa-fw"></i>
                            </div>
                        </div>
                        <span>À soumettre</span>
                    </div>
                </div>
            </div>

            <!-- Alertes et rappels -->
            <div class="row mb-4" v-if="alertes.length > 0">
                <div class="col-12">
                    <div class="alert alert-warning d-flex align-items-center" role="alert">
                        <i class="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
                        <div>
                            <strong>Attention !</strong> Vous avez {{ alertes.length }} déclaration(s) à échéance
                            proche.
                            <button @click="voirAlertes" class="btn btn-sm btn-warning ms-3">Voir détails</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Filtres -->
            <div class="card shadow mb-4">
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label">Exercice Fiscal</label>
                            <select v-model="filters.exercice" @change="applyFilters" class="form-select">
                                <option value="">Tous</option>
                                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                            </select>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Type Déclaration</label>
                            <select v-model="filters.typeDeclaration" @change="applyFilters" class="form-select">
                                <option value="">Tous</option>
                                <option value="MENSUELLE">Mensuelle</option>
                                <option value="TRIMESTRIELLE">Trimestrielle</option>
                                <option value="ANNUELLE">Annuelle</option>
                                <option value="TVA">TVA</option>
                                <option value="FONCIERE">Taxe Foncière</option>
                            </select>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Statut</label>
                            <select v-model="filters.statut" @change="applyFilters" class="form-select">
                                <option value="">Tous</option>
                                <option value="BROUILLON">Brouillon</option>
                                <option value="EN_ATTENTE">En attente</option>
                                <option value="SOUMISE">Soumise</option>
                                <option value="VALIDEE">Validée</option>
                                <option value="PAYEE">Payée</option>
                                <option value="RETARD">En retard</option>
                            </select>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Rechercher</label>
                            <input type="text" v-model="searchQuery" @input="applyFilters" class="form-control"
                                placeholder="Référence...">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <ul class="nav nav-pills mb-4" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#declarations-tab"
                        type="button" role="tab">
                        <i class="bi bi-list-ul me-2"></i>Déclarations
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#calendrier-tab" type="button"
                        role="tab">
                        <i class="bi bi-calendar-event me-2"></i>Calendrier Fiscal
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#documents-tab" type="button"
                        role="tab">
                        <i class="bi bi-file-earmark-pdf me-2"></i>Documents
                    </button>
                </li>
            </ul>

            <!-- Tab Content -->
            <div class="tab-content">
                <!-- Onglet Déclarations -->
                <div class="tab-pane fade show active" id="declarations-tab">
                    <div class="card shadow">
                        <div class="card-body">
                            <!-- En-têtes -->
                            <div class="bg-light rounded p-3 d-none d-lg-block">
                                <div class="row">
                                    <div class="col-lg-2">
                                        <h6 class="mb-0">Référence</h6>
                                    </div>
                                    <div class="col-lg-2">
                                        <h6 class="mb-0">Type</h6>
                                    </div>
                                    <div class="col-lg-2">
                                        <h6 class="mb-0">Période</h6>
                                    </div>
                                    <div class="col-lg-2">
                                        <h6 class="mb-0">Montant</h6>
                                    </div>
                                    <div class="col-lg-2">
                                        <h6 class="mb-0">Échéance</h6>
                                    </div>
                                    <div class="col-lg-1">
                                        <h6 class="mb-0">Statut</h6>
                                    </div>
                                    <div class="col-lg-1">
                                        <h6 class="mb-0">Action</h6>
                                    </div>
                                </div>
                            </div>

                            <!-- Chargement -->
                            <div v-if="isLoading" class="text-center my-5">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Chargement...</span>
                                </div>
                            </div>

                            <!-- Aucune déclaration -->
                            <div v-else-if="paginatedDeclarations.length === 0" class="text-center text-muted my-5">
                                <i class="bi bi-inbox fs-1"></i>
                                <p class="mt-3">Aucune déclaration trouvée.</p>
                            </div>

                            <!-- Lignes -->
                            <div v-else>
                                <div class="row border-bottom py-3 align-items-center"
                                    v-for="declaration in paginatedDeclarations" :key="declaration.id">
                                    <div class="col-lg-2">
                                        <strong class="d-lg-none">Référence:</strong>
                                        <span class="text-primary fw-bold">{{ declaration.reference }}</span>
                                    </div>
                                    <div class="col-lg-2">
                                        <strong class="d-lg-none">Type:</strong>
                                        <span class="badge bg-info">{{ declaration.typeDeclaration }}</span>
                                    </div>
                                    <div class="col-lg-2">
                                        <strong class="d-lg-none">Période:</strong>
                                        <span>{{ declaration.periode }}</span>
                                    </div>
                                    <div class="col-lg-2">
                                        <strong class="d-lg-none">Montant:</strong>
                                        <span class="fw-bold">{{ formatCurrency(declaration.montant) }}</span>
                                    </div>
                                    <div class="col-lg-2">
                                        <strong class="d-lg-none">Échéance:</strong>
                                        <span>{{ formatDate(declaration.dateEcheance) }}</span>
                                        <span v-if="isEnRetard(declaration)" class="badge bg-danger ms-1">
                                            <i class="bi bi-exclamation-circle"></i> Retard
                                        </span>
                                    </div>
                                    <div class="col-lg-1">
                                        <strong class="d-lg-none">Statut:</strong>
                                        <span class="badge" :class="getStatutBadgeClass(declaration.statut)">
                                            {{ declaration.statut }}
                                        </span>
                                    </div>
                                    <div class="col-lg-1">
                                        <div class="dropdown">
                                            <button class="btn btn-sm btn-light" type="button"
                                                data-bs-toggle="dropdown">
                                                <i class="bi bi-three-dots-vertical"></i>
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li>
                                                    <a class="dropdown-item" @click="voirDetails(declaration)">
                                                        <i class="bi bi-eye me-2"></i>Détails
                                                    </a>
                                                </li>
                                                <li v-if="declaration.statut === 'BROUILLON'">
                                                    <a class="dropdown-item" @click="modifierDeclaration(declaration)">
                                                        <i class="bi bi-pencil me-2"></i>Modifier
                                                    </a>
                                                </li>
                                                <li v-if="declaration.statut === 'EN_ATTENTE'">
                                                    <a class="dropdown-item" @click="soumettreDeclaration(declaration)">
                                                        <i class="bi bi-send me-2"></i>Soumettre
                                                    </a>
                                                </li>
                                                <li v-if="declaration.statut === 'VALIDEE'">
                                                    <a class="dropdown-item" @click="marquerPayee(declaration)">
                                                        <i class="bi bi-check-circle me-2"></i>Marquer payée
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item" @click="telechargerPDF(declaration)">
                                                        <i class="bi bi-download me-2"></i>Télécharger PDF
                                                    </a>
                                                </li>
                                                <li v-if="declaration.statut === 'BROUILLON'">
                                                    <hr class="dropdown-divider">
                                                    <a class="dropdown-item text-danger"
                                                        @click="supprimerDeclaration(declaration.id)">
                                                        <i class="bi bi-trash me-2"></i>Supprimer
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Pagination -->
                        <div class="card-footer">
                            <div class="d-sm-flex justify-content-sm-between align-items-sm-center">
                                <p class="mb-sm-0 text-center text-sm-start">
                                    Affichage {{ startIndex + 1 }} à {{ endIndex }} sur {{ filteredDeclarations.length
                                    }} entrées
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
                    </div>
                </div>

                <!-- Onglet Calendrier Fiscal -->
                <div class="tab-pane fade" id="calendrier-tab">
                    <div class="card shadow">
                        <div class="card-body">
                            <h5 class="mb-4">Échéancier Fiscal {{ currentYear }}</h5>
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Mois</th>
                                            <th>Type de Déclaration</th>
                                            <th>Date Limite</th>
                                            <th>Statut</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="echeance in calendrierFiscal" :key="echeance.id">
                                            <td>{{ echeance.mois }}</td>
                                            <td>{{ echeance.type }}</td>
                                            <td>{{ formatDate(echeance.dateLimit) }}</td>
                                            <td>
                                                <span class="badge" :class="getStatutCalendrierClass(echeance)">
                                                    {{ getStatutCalendrier(echeance) }}
                                                </span>
                                            </td>
                                            <td>
                                                <button class="btn btn-sm btn-primary"
                                                    @click="creerDeclarationDepuisCalendrier(echeance)"
                                                    :disabled="echeance.declarationId">
                                                    <i class="bi bi-plus-circle"></i>
                                                    {{ echeance.declarationId ? 'Créée' : 'Créer' }}
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Onglet Documents -->
                <div class="tab-pane fade" id="documents-tab">
                    <div class="card shadow">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <h5 class="mb-0">Documents Fiscaux</h5>
                                <button @click="ajouterDocument" class="btn btn-primary btn-sm">
                                    <i class="bi bi-upload"></i> Ajouter Document
                                </button>
                            </div>

                            <div class="row g-4">
                                <div class="col-md-6 col-lg-4" v-for="doc in documentsFiscaux" :key="doc.id">
                                    <div class="card h-100">
                                        <div class="card-body">
                                            <div class="d-flex justify-content-between align-items-start mb-3">
                                                <i class="bi bi-file-earmark-pdf fs-1 text-danger"></i>
                                                <div class="dropdown">
                                                    <button class="btn btn-sm btn-light" data-bs-toggle="dropdown">
                                                        <i class="bi bi-three-dots-vertical"></i>
                                                    </button>
                                                    <ul class="dropdown-menu">
                                                        <li>
                                                            <a class="dropdown-item" @click="telechargerDocument(doc)">
                                                                <i class="bi bi-download me-2"></i>Télécharger
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a class="dropdown-item text-danger"
                                                                @click="supprimerDocument(doc.id)">
                                                                <i class="bi bi-trash me-2"></i>Supprimer
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <h6 class="card-title">{{ doc.nom }}</h6>
                                            <p class="card-text small text-muted">{{ doc.type }}</p>
                                            <p class="card-text small">{{ formatDate(doc.dateAjout) }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Nouvelle/Modifier Déclaration -->
        <div class="modal fade" id="declarationModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ declarationForm.id ? 'Modifier' : 'Nouvelle' }} Déclaration Fiscale
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <!-- Informations générales -->
                            <div class="row g-3 mb-4">
                                <div class="col-12">
                                    <h6 class="border-bottom pb-2">Informations Générales</h6>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Type de Déclaration *</label>
                                    <select v-model="declarationForm.typeDeclaration" class="form-select" required>
                                        <option value="">Sélectionnez...</option>
                                        <option value="MENSUELLE">Mensuelle</option>
                                        <option value="TRIMESTRIELLE">Trimestrielle</option>
                                        <option value="ANNUELLE">Annuelle</option>
                                        <option value="TVA">TVA</option>
                                        <option value="FONCIERE">Taxe Foncière</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Exercice Fiscal *</label>
                                    <select v-model="declarationForm.exercice" class="form-select" required>
                                        <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Période *</label>
                                    <input type="text" v-model="declarationForm.periode" class="form-control"
                                        placeholder="Ex: Janvier 2025" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Date Échéance *</label>
                                    <input type="date" v-model="declarationForm.dateEcheance" class="form-control"
                                        required>
                                </div>
                            </div>

                            <!-- Revenus -->
                            <div class="row g-3 mb-4">
                                <div class="col-12">
                                    <h6 class="border-bottom pb-2">Revenus Locatifs</h6>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Revenus Bruts</label>
                                    <input type="number" v-model.number="declarationForm.revenusBruts"
                                        class="form-control" step="0.01" @input="calculerImpot">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Revenus Nets</label>
                                    <input type="number" v-model.number="declarationForm.revenusNets"
                                        class="form-control" step="0.01" readonly>
                                </div>
                            </div>

                            <!-- Charges déductibles -->
                            <div class="row g-3 mb-4">
                                <div class="col-12">
                                    <h6 class="border-bottom pb-2">Charges Déductibles</h6>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Frais de Gestion</label>
                                    <input type="number" v-model.number="declarationForm.fraisGestion"
                                        class="form-control" step="0.01" @input="calculerImpot">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Travaux et Réparations</label>
                                    <input type="number" v-model.number="declarationForm.travaux" class="form-control"
                                        step="0.01" @input="calculerImpot">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Assurances</label>
                                    <input type="number" v-model.number="declarationForm.assurances"
                                        class="form-control" step="0.01" @input="calculerImpot">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Taxes Locales</label>
                                    <input type="number" v-model.number="declarationForm.taxesLocales"
                                        class="form-control" step="0.01" @input="calculerImpot">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Intérêts d'Emprunt</label>
                                    <input type="number" v-model.number="declarationForm.interetsEmprunt"
                                        class="form-control" step="0.01" @input="calculerImpot">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Autres Charges</label>
                                    <input type="number" v-model.number="declarationForm.autresCharges"
                                        class="form-control" step="0.01" @input="calculerImpot">
                                </div>
                                <div class="col-12">
                                    <div class="alert alert-info">
                                        <strong>Total des charges déductibles:</strong>
                                        {{ formatCurrency(totalCharges) }}
                                    </div>
                                </div>
                            </div>

                            <!-- Calcul de l'impôt -->
                            <div class="row g-3 mb-4">
                                <div class="col-12">
                                    <h6 class="border-bottom pb-2">Calcul de l'Impôt</h6>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Base Imposable</label>
                                    <input type="number" v-model.number="declarationForm.baseImposable"
                                        class="form-control" step="0.01" readonly>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Taux d'Imposition (%)</label>
                                    <input type="number" v-model.number="declarationForm.tauxImposition"
                                        class="form-control" step="0.01" @input="calculerImpot">
                                </div>
                                <div class="col-12">
                                    <div class="alert alert-success">
                                        <h5 class="mb-0">
                                            <strong>Montant de l'impôt dû:</strong>
                                            {{ formatCurrency(declarationForm.montant) }}
                                        </h5>
                                    </div>
                                </div>
                            </div>

                            <!-- Notes -->
                            <div class="row g-3">
                                <div class="col-12">
                                    <label class="form-label">Notes / Observations</label>
                                    <textarea v-model="declarationForm.notes" class="form-control" rows="3"></textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-outline-primary" @click="sauvegarderBrouillon">
                            <i class="bi bi-save"></i> Brouillon
                        </button>
                        <button type="button" class="btn btn-primary" @click="sauvegarderDeclaration">
                            <i class="bi bi-check-circle"></i> {{ declarationForm.id ? 'Mettre à jour' : 'Créer' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Détails -->
        <div class="modal fade" id="detailsModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Détails de la Déclaration</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" v-if="selectedDeclaration">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <strong>Référence:</strong> {{ selectedDeclaration.reference }}
                            </div>
                            <div class="col-md-6">
                                <strong>Type:</strong> {{ selectedDeclaration.typeDeclaration }}
                            </div>
                            <div class="col-md-6">
                                <strong>Période:</strong> {{ selectedDeclaration.periode }}
                            </div>
                            <div class="col-md-6">
                                <strong>Exercice:</strong> {{ selectedDeclaration.exercice }}
                            </div>
                            <div class="col-md-6">
                                <strong>Revenus bruts:</strong> {{ formatCurrency(selectedDeclaration.revenusBruts) }}
                            </div>
                            <div class="col-md-6">
                                <strong>Charges déductibles:</strong> {{
                                    formatCurrency(selectedDeclaration.totalCharges) }}
                            </div>
                            <div class="col-md-6">
                                <strong>Base imposable:</strong> {{ formatCurrency(selectedDeclaration.baseImposable) }}
                            </div>
                            <div class="col-md-6">
                                <strong>Taux:</strong> {{ selectedDeclaration.tauxImposition }}%
                            </div>
                            <div class="col-12">
                                <hr>
                                <h5>Montant dû: <span class="text-danger">{{ formatCurrency(selectedDeclaration.montant)
                                }}</span></h5>
                            </div>
                            <div class="col-md-6">
                                <strong>Date échéance:</strong> {{ formatDate(selectedDeclaration.dateEcheance) }}
                            </div>
                            <div class="col-md-6">
                                <strong>Statut:</strong>
                                <span class="badge" :class="getStatutBadgeClass(selectedDeclaration.statut)">
                                    {{ selectedDeclaration.statut }}
                                </span>
                            </div>
                            <div class="col-12" v-if="selectedDeclaration.notes">
                                <strong>Notes:</strong>
                                <p class="text-muted">{{ selectedDeclaration.notes }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                        <button type="button" class="btn btn-primary" @click="telechargerPDF(selectedDeclaration)">
                            <i class="bi bi-download"></i> Télécharger
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Confirmation Suppression -->
        <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirmation</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        Voulez-vous vraiment supprimer cette déclaration ?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-danger" @click="confirmerSuppression">Supprimer</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ElMessage } from "element-plus";

export default {
    data() {
        return {
            declarations: [],
            contrats: [],
            documentsFiscaux: [],
            calendrierFiscal: [],
            alertes: [],
            stats: {
                revenusLocatifs: 0,
                impotsDus: 0,
                tauxImposition: 0,
                deductions: 0,
                declarationsEnAttente: 0
            },
            filters: {
                exercice: '',
                typeDeclaration: '',
                statut: ''
            },
            declarationForm: {
                id: null,
                reference: '',
                typeDeclaration: '',
                exercice: new Date().getFullYear(),
                periode: '',
                dateEcheance: '',
                revenusBruts: 0,
                revenusNets: 0,
                fraisGestion: 0,
                travaux: 0,
                assurances: 0,
                taxesLocales: 0,
                interetsEmprunt: 0,
                autresCharges: 0,
                baseImposable: 0,
                tauxImposition: 15,
                montant: 0,
                statut: 'BROUILLON',
                notes: ''
            },
            searchQuery: '',
            currentPage: 1,
            perPage: 10,
            isLoading: false,
            selectedDeclaration: null,
            declarationToDelete: null,
            currentYear: new Date().getFullYear()
        };
    },

    computed: {
        years() {
            const current = new Date().getFullYear();
            return Array.from({ length: 5 }, (_, i) => current - i);
        },

        totalCharges() {
            const form = this.declarationForm;
            return (
                (form.fraisGestion || 0) +
                (form.travaux || 0) +
                (form.assurances || 0) +
                (form.taxesLocales || 0) +
                (form.interetsEmprunt || 0) +
                (form.autresCharges || 0)
            );
        },

        filteredDeclarations() {
            let result = [...this.declarations];

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(d =>
                    d.reference?.toLowerCase().includes(query)
                );
            }

            if (this.filters.exercice) {
                result = result.filter(d => d.exercice === parseInt(this.filters.exercice));
            }

            if (this.filters.typeDeclaration) {
                result = result.filter(d => d.typeDeclaration === this.filters.typeDeclaration);
            }

            if (this.filters.statut) {
                result = result.filter(d => d.statut === this.filters.statut);
            }

            return result.sort((a, b) => new Date(b.dateEcheance) - new Date(a.dateEcheance));
        },

        paginatedDeclarations() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredDeclarations.slice(start, start + this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filteredDeclarations.length / this.perPage);
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
            return Math.min(this.startIndex + this.perPage, this.filteredDeclarations.length);
        }
    },

    mounted() {
        this.fetchDeclarations();
        this.fetchContrats();
        this.genererCalendrierFiscal();
        this.verifierAlertes();
    },

    methods: {
        async fetchDeclarations() {
            this.isLoading = true;
            try {
                // Simuler des déclarations à partir des contrats
                const contrats = await this.$store.dispatch("contrats/getAll");
                this.contrats = contrats;

                // Générer des déclarations fiscales
                this.declarations = this.genererDeclarationsDepuisContrats(contrats);
                this.calculerStats();
            } catch (error) {
                console.error("Erreur chargement déclarations:", error);
                ElMessage.error("Erreur lors du chargement des déclarations");
            } finally {
                this.isLoading = false;
            }
        },

        async fetchContrats() {
            try {
                this.contrats = await this.$store.dispatch("contrats/getAll");
            } catch (error) {
                console.error("Erreur chargement contrats:", error);
            }
        },

        genererDeclarationsDepuisContrats(contrats) {
            const declarations = [];
            const currentYear = new Date().getFullYear();

            contrats.forEach((contrat, index) => {
                if (contrat.loyerMensuel && contrat.status === 'ACTIF') {
                    const revenusBruts = contrat.loyerMensuel * 12;
                    const charges = revenusBruts * 0.30; // 30% de charges déductibles estimées
                    const baseImposable = revenusBruts - charges;
                    const montant = baseImposable * 0.15; // 15% d'impôt

                    declarations.push({
                        id: `DECL-${currentYear}-${index + 1}`,
                        reference: `DEC-${currentYear}-${String(index + 1).padStart(4, '0')}`,
                        typeDeclaration: 'ANNUELLE',
                        exercice: currentYear,
                        periode: `Année ${currentYear}`,
                        dateEcheance: new Date(currentYear, 3, 30), // 30 avril
                        revenusBruts: revenusBruts,
                        revenusNets: baseImposable,
                        fraisGestion: charges * 0.2,
                        travaux: charges * 0.3,
                        assurances: charges * 0.2,
                        taxesLocales: charges * 0.2,
                        interetsEmprunt: charges * 0.1,
                        autresCharges: 0,
                        totalCharges: charges,
                        baseImposable: baseImposable,
                        tauxImposition: 15,
                        montant: montant,
                        statut: this.determinerStatut(new Date(currentYear, 3, 30)),
                        notes: `Déclaration annuelle pour le contrat ${contrat.referenceContrat}`,
                        contratId: contrat.id,
                        contratReference: contrat.referenceContrat
                    });
                }
            });

            return declarations;
        },

        determinerStatut(dateEcheance) {
            const today = new Date();
            const echeance = new Date(dateEcheance);

            if (today > echeance) return 'RETARD';

            const diff = (echeance - today) / (1000 * 60 * 60 * 24);
            if (diff <= 30) return 'EN_ATTENTE';

            return 'BROUILLON';
        },

        calculerStats() {
            const currentYear = new Date().getFullYear();
            const declarationsAnnee = this.declarations.filter(d => d.exercice === currentYear);

            this.stats = {
                revenusLocatifs: declarationsAnnee.reduce((sum, d) => sum + (d.revenusBruts || 0), 0),
                impotsDus: declarationsAnnee.reduce((sum, d) => sum + (d.montant || 0), 0),
                tauxImposition: 15,
                deductions: declarationsAnnee.reduce((sum, d) => sum + (d.totalCharges || 0), 0),
                declarationsEnAttente: this.declarations.filter(d =>
                    d.statut === 'EN_ATTENTE' || d.statut === 'BROUILLON'
                ).length
            };
        },

        genererCalendrierFiscal() {
            const mois = [
                'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
            ];

            this.calendrierFiscal = [
                {
                    id: 1,
                    mois: 'Janvier',
                    type: 'TVA Mensuelle',
                    dateLimit: new Date(this.currentYear, 1, 15),
                    declarationId: null
                },
                {
                    id: 2,
                    mois: 'Mars',
                    type: 'Déclaration Trimestrielle',
                    dateLimit: new Date(this.currentYear, 3, 15),
                    declarationId: null
                },
                {
                    id: 3,
                    mois: 'Avril',
                    type: 'Déclaration Annuelle',
                    dateLimit: new Date(this.currentYear, 3, 30),
                    declarationId: null
                },
                {
                    id: 4,
                    mois: 'Juin',
                    type: 'Taxe Foncière',
                    dateLimit: new Date(this.currentYear, 5, 30),
                    declarationId: null
                },
                {
                    id: 5,
                    mois: 'Septembre',
                    type: 'Déclaration Trimestrielle',
                    dateLimit: new Date(this.currentYear, 9, 15),
                    declarationId: null
                },
                {
                    id: 6,
                    mois: 'Décembre',
                    type: 'Bilan Annuel',
                    dateLimit: new Date(this.currentYear, 11, 31),
                    declarationId: null
                }
            ];
        },

        verifierAlertes() {
            const today = new Date();
            this.alertes = this.declarations.filter(d => {
                const echeance = new Date(d.dateEcheance);
                const diff = (echeance - today) / (1000 * 60 * 60 * 24);
                return diff <= 15 && diff >= 0 && d.statut !== 'PAYEE';
            });
        },

        calculerImpot() {
            const form = this.declarationForm;
            const charges = this.totalCharges;

            form.baseImposable = Math.max(0, (form.revenusBruts || 0) - charges);
            form.revenusNets = form.baseImposable;
            form.montant = form.baseImposable * (form.tauxImposition / 100);
        },

        nouvelleDeclaration() {
            this.resetForm();
            this.declarationForm.reference = this.genererReference();
            const modal = new bootstrap.Modal(document.getElementById("declarationModal"));
            modal.show();
        },

        modifierDeclaration(declaration) {
            this.declarationForm = { ...declaration };
            const modal = new bootstrap.Modal(document.getElementById("declarationModal"));
            modal.show();
        },

        resetForm() {
            this.declarationForm = {
                id: null,
                reference: '',
                typeDeclaration: '',
                exercice: new Date().getFullYear(),
                periode: '',
                dateEcheance: '',
                revenusBruts: 0,
                revenusNets: 0,
                fraisGestion: 0,
                travaux: 0,
                assurances: 0,
                taxesLocales: 0,
                interetsEmprunt: 0,
                autresCharges: 0,
                baseImposable: 0,
                tauxImposition: 15,
                montant: 0,
                statut: 'BROUILLON',
                notes: ''
            };
        },

        genererReference() {
            const year = new Date().getFullYear();
            const count = this.declarations.filter(d => d.exercice === year).length + 1;
            return `DEC-${year}-${String(count).padStart(4, '0')}`;
        },

        sauvegarderBrouillon() {
            this.declarationForm.statut = 'BROUILLON';
            this.sauvegarderDeclaration();
        },

        async sauvegarderDeclaration() {
            try {
                this.calculerImpot();
                this.declarationForm.totalCharges = this.totalCharges;

                if (this.declarationForm.id) {
                    const index = this.declarations.findIndex(d => d.id === this.declarationForm.id);
                    if (index !== -1) {
                        this.declarations[index] = { ...this.declarationForm };
                    }
                    ElMessage.success("Déclaration mise à jour avec succès");
                } else {
                    this.declarationForm.id = `DECL-${Date.now()}`;
                    if (!this.declarationForm.statut || this.declarationForm.statut === 'BROUILLON') {
                        this.declarationForm.statut = 'EN_ATTENTE';
                    }
                    this.declarations.push({ ...this.declarationForm });
                    ElMessage.success("Déclaration créée avec succès");
                }

                bootstrap.Modal.getInstance(document.getElementById("declarationModal")).hide();
                this.resetForm();
                this.calculerStats();
                this.verifierAlertes();
            } catch (error) {
                console.error("Erreur sauvegarde:", error);
                ElMessage.error("Erreur lors de la sauvegarde");
            }
        },

        async soumettreDeclaration(declaration) {
            try {
                declaration.statut = 'SOUMISE';
                ElMessage.success("Déclaration soumise avec succès");
            } catch (error) {
                ElMessage.error("Erreur lors de la soumission");
            }
        },

        async marquerPayee(declaration) {
            try {
                declaration.statut = 'PAYEE';
                ElMessage.success("Déclaration marquée comme payée");
                this.calculerStats();
            } catch (error) {
                ElMessage.error("Erreur lors de la mise à jour");
            }
        },

        voirDetails(declaration) {
            this.selectedDeclaration = declaration;
            const modal = new bootstrap.Modal(document.getElementById("detailsModal"));
            modal.show();
        },

        supprimerDeclaration(id) {
            this.declarationToDelete = id;
            const modal = new bootstrap.Modal(document.getElementById("deleteModal"));
            modal.show();
        },

        confirmerSuppression() {
            this.declarations = this.declarations.filter(d => d.id !== this.declarationToDelete);
            bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
            ElMessage.success("Déclaration supprimée");
            this.calculerStats();
        },

        async telechargerPDF(declaration) {
            try {
                // Utiliser l'export de contrats comme base
                const fileUrl = await this.$store.dispatch("contrats/exportContrats", "pdf");
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = `declaration-${declaration.reference}.pdf`;
                link.click();
                URL.revokeObjectURL(fileUrl);
                ElMessage.success("Téléchargement réussi");
            } catch (error) {
                ElMessage.error("Erreur lors du téléchargement");
            }
        },

        async exporterDeclarations() {
            try {
                const fileUrl = await this.$store.dispatch("contrats/exportContrats", "xlsx");
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = `declarations-fiscales-${new Date().toISOString().split('T')[0]}.xlsx`;
                link.click();
                URL.revokeObjectURL(fileUrl);
                ElMessage.success("Export réussi");
            } catch (error) {
                ElMessage.error("Erreur lors de l'export");
            }
        },

        creerDeclarationDepuisCalendrier(echeance) {
            this.resetForm();
            this.declarationForm.typeDeclaration = echeance.type.includes('TVA') ? 'TVA' :
                echeance.type.includes('Trimestrielle') ? 'TRIMESTRIELLE' :
                    echeance.type.includes('Annuelle') ? 'ANNUELLE' : 'FONCIERE';
            this.declarationForm.periode = echeance.mois + ' ' + this.currentYear;
            this.declarationForm.dateEcheance = echeance.dateLimit.toISOString().split('T')[0];
            this.declarationForm.reference = this.genererReference();

            const modal = new bootstrap.Modal(document.getElementById("declarationModal"));
            modal.show();
        },

        voirAlertes() {
            ElMessage.info(`Vous avez ${this.alertes.length} déclaration(s) à échéance proche`);
        },

        ajouterDocument() {
            ElMessage.info("Fonctionnalité d'ajout de document à implémenter");
        },

        telechargerDocument(doc) {
            ElMessage.info(`Téléchargement de ${doc.nom}`);
        },

        supprimerDocument(id) {
            this.documentsFiscaux = this.documentsFiscaux.filter(d => d.id !== id);
            ElMessage.success("Document supprimé");
        },

        getStatutCalendrierClass(echeance) {
            const today = new Date();
            if (echeance.declarationId) return 'bg-success';
            if (today > echeance.dateLimit) return 'bg-danger';
            return 'bg-warning';
        },

        getStatutCalendrier(echeance) {
            const today = new Date();
            if (echeance.declarationId) return 'Créée';
            if (today > echeance.dateLimit) return 'En retard';
            return 'À faire';
        },

        applyFilters() {
            this.currentPage = 1;
            this.calculerStats();
        },

        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },

        isEnRetard(declaration) {
            return new Date() > new Date(declaration.dateEcheance) &&
                declaration.statut !== 'PAYEE';
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'BROUILLON': 'bg-secondary',
                'EN_ATTENTE': 'bg-warning',
                'SOUMISE': 'bg-info',
                'VALIDEE': 'bg-primary',
                'PAYEE': 'bg-success',
                'RETARD': 'bg-danger'
            };
            return classes[statut] || 'bg-secondary';
        },

        formatCurrency(value) {
            if (!value && value !== 0) return '0 XOF';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0,
            }).format(value);
        },

        formatDate(date) {
            if (!date) return 'N/A';
            return new Date(date).toLocaleDateString('fr-FR');
        }
    }
};
</script>

<style scoped>
.card-body .row {
    align-items: center;
}

.card-body .row:hover {
    background-color: #f8f9fa;
    transition: background-color 0.2s;
}

.table th {
    font-weight: 600;
}

@media (max-width: 991px) {
    .card-body .row>div {
        margin-bottom: 0.5rem;
    }
}
</style>