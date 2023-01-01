<template>
    <div class="page-content pt-0" style="background-color:#f9fafb; min-height:100vh;">
        <div class="page-content-wrapper px-3 py-4" style="max-width: 100%;">

            <!-- En-tête -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">
                                <i class="bi bi-houses me-2"></i>Propriétés Assignées
                            </h1>
                            <p class="text-muted mb-0">Gestion du patrimoine immobilier et affectations</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <button @click="showAssignModal = true" class="btn btn-primary">
                                <i class="bi bi-plus-circle me-1"></i>Nouvelle Affectation
                            </button>
                            <button @click="showMapView = !showMapView" class="btn btn-outline-primary">
                                <i class="bi" :class="showMapView ? 'bi-list' : 'bi-map'"></i>
                                {{ showMapView ? 'Vue Liste' : 'Vue Carte' }}
                            </button>
                            <button @click="exportProprietes" class="btn btn-success">
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
                                    <span class="text-muted small">Total Propriétés</span>
                                    <h3 class="mb-0 mt-2 text-primary">{{ stats.total }}</h3>
                                    <small class="text-primary">
                                        <i class="bi bi-houses me-1"></i>Enregistrées
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-primary bg-opacity-10 text-primary">
                                    <i class="bi bi-houses fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Occupées</span>
                                    <h3 class="mb-0 mt-2 text-success">{{ stats.occupees }}</h3>
                                    <small class="text-success">
                                        <i class="bi bi-check-circle me-1"></i>{{ stats.tauxOccupation }}%
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-success bg-opacity-10 text-success">
                                    <i class="bi bi-house-check fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Disponibles</span>
                                    <h3 class="mb-0 mt-2 text-info">{{ stats.disponibles }}</h3>
                                    <small class="text-info">
                                        <i class="bi bi-house me-1"></i>À louer/vendre
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-info bg-opacity-10 text-info">
                                    <i class="bi bi-house fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Valeur Totale</span>
                                    <h3 class="mb-0 mt-2 text-warning">{{ formatMontant(stats.valeurTotale) }}</h3>
                                    <small class="text-warning">
                                        <i class="bi bi-currency-euro me-1"></i>Patrimoine
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-warning bg-opacity-10 text-warning">
                                    <i class="bi bi-currency-euro fa-fw fs-4"></i>
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
                                <h6 class="mb-0"><i class="bi bi-bar-chart me-2"></i>Répartition par Type</h6>
                            </div>
                            <div class="card-body">
                                <canvas id="typeChart" height="80"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0"><i class="bi bi-pie-chart me-2"></i>Statut d'Occupation</h6>
                            </div>
                            <div class="card-body">
                                <canvas id="statutChart" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Types de propriétés -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Types de Propriétés</h6>
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div v-for="type in typesProprietes" :key="type.id" class="col-md-4 col-lg-3">
                                        <div class="card border h-100" style="cursor: pointer;"
                                            @click="filterByType(type.id)">
                                            <div class="card-body text-center">
                                                <i class="bi fs-1 mb-2" :class="[type.icon, 'text-' + type.color]"></i>
                                                <h5 class="mb-1" :class="'text-' + type.color">{{ type.count }}</h5>
                                                <p class="mb-0 small fw-bold">{{ type.label }}</p>
                                                <small class="text-muted">{{ formatMontant(type.valeur) }}</small>
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
                                                v-model="searchQuery" @input="filterProprietes">
                                            <i
                                                class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.type" @change="filterProprietes" class="form-select">
                                            <option value="">Tous types</option>
                                            <option value="APPARTEMENT">Appartement</option>
                                            <option value="MAISON">Maison</option>
                                            <option value="BUREAU">Bureau</option>
                                            <option value="COMMERCE">Commerce</option>
                                            <option value="TERRAIN">Terrain</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.statut" @change="filterProprietes" class="form-select">
                                            <option value="">Tous statuts</option>
                                            <option value="DISPONIBLE">Disponible</option>
                                            <option value="OCCUPEE">Occupée</option>
                                            <option value="MAINTENANCE">Maintenance</option>
                                            <option value="VENDUE">Vendue</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.ville" @change="filterProprietes" class="form-select">
                                            <option value="">Toutes villes</option>
                                            <option v-for="ville in villesUniques" :key="ville" :value="ville">
                                                {{ ville }}
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

                <!-- Vue Carte (simulation) -->
                <div v-if="showMapView" class="row mb-4">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-body"
                                style="height: 500px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                <div class="text-center text-white">
                                    <i class="bi bi-map fs-1 mb-3"></i>
                                    <h4>Vue Carte Interactive</h4>
                                    <p class="mb-0">Intégration avec Google Maps / OpenStreetMap</p>
                                    <small>{{ filteredProprietes.length }} propriétés géolocalisées</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Liste des propriétés -->
                <div v-else class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">
                                    Liste des Propriétés
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ filteredProprietes.length }} propriétés
                                    </span>
                                </h6>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Référence</th>
                                                <th>Propriété</th>
                                                <th>Type</th>
                                                <th>Localisation</th>
                                                <th>Surface</th>
                                                <th>Valeur</th>
                                                <th>Occupant</th>
                                                <th>Statut</th>
                                                <th class="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="paginatedProprietes.length === 0">
                                                <td colspan="9" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucune propriété trouvée</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="propriete in paginatedProprietes" :key="propriete.id"
                                                :class="getRowClass(propriete)">
                                                <td>
                                                    <strong class="text-primary">{{ propriete.reference }}</strong>
                                                </td>
                                                <td>
                                                    <div><strong>{{ propriete.nom }}</strong></div>
                                                    <small class="text-muted">{{ propriete.adresse }}</small>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="'bg-' + getTypeColor(propriete.type)">
                                                        <i class="bi me-1" :class="getTypeIcon(propriete.type)"></i>
                                                        {{ propriete.type }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <i class="bi bi-geo-alt me-1"></i>
                                                    {{ propriete.ville }}
                                                </td>
                                                <td>
                                                    <strong>{{ propriete.surface }} m²</strong>
                                                    <div v-if="propriete.pieces">
                                                        <small class="text-muted">{{ propriete.pieces }} pièces</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <strong class="text-success">{{ formatMontant(propriete.valeur)
                                                        }}</strong>
                                                    <div v-if="propriete.loyer">
                                                        <small class="text-muted">{{ formatMontant(propriete.loyer)
                                                            }}/mois</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div v-if="propriete.occupant">
                                                        <strong>{{ propriete.occupant }}</strong>
                                                        <div v-if="propriete.dateDebut">
                                                            <small class="text-muted">Depuis {{
                                                                formatDate(propriete.dateDebut) }}</small>
                                                        </div>
                                                    </div>
                                                    <small v-else class="text-muted">-</small>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getStatutBadgeClass(propriete.statut)">
                                                        {{ propriete.statut }}
                                                    </span>
                                                </td>
                                                <td class="text-end">
                                                    <div class="btn-group">
                                                        <button class="btn btn-sm btn-outline-primary"
                                                            @click="viewPropriete(propriete)">
                                                            <i class="bi bi-eye"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-success"
                                                            @click="assignerPropriete(propriete)">
                                                            <i class="bi bi-person-plus"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-info"
                                                            @click="historiquePropriete(propriete)">
                                                            <i class="bi bi-clock-history"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- Pagination -->
                                <div v-if="filteredProprietes.length > perPage" class="card-footer border-top">
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
        <div v-if="selectedPropriete" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ selectedPropriete.nom }}
                            <span class="badge ms-2" :class="getStatutBadgeClass(selectedPropriete.statut)">
                                {{ selectedPropriete.statut }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedPropriete = null"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-house me-2"></i>Informations Générales</h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Référence</label>
                                            <p class="mb-0 fw-bold">{{ selectedPropriete.reference }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Type</label>
                                            <p class="mb-0">
                                                <span class="badge"
                                                    :class="'bg-' + getTypeColor(selectedPropriete.type)">
                                                    {{ selectedPropriete.type }}
                                                </span>
                                            </p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Surface</label>
                                            <p class="mb-0"><strong>{{ selectedPropriete.surface }} m²</strong></p>
                                        </div>
                                        <div class="mb-2" v-if="selectedPropriete.pieces">
                                            <label class="text-muted small">Nombre de pièces</label>
                                            <p class="mb-0">{{ selectedPropriete.pieces }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-geo-alt me-2"></i>Localisation</h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Adresse</label>
                                            <p class="mb-0">{{ selectedPropriete.adresse }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Code Postal</label>
                                            <p class="mb-0">{{ selectedPropriete.codePostal }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Ville</label>
                                            <p class="mb-0">{{ selectedPropriete.ville }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-currency-euro me-2"></i>Valeur</h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Valeur estimée</label>
                                            <p class="mb-0"><strong class="text-success fs-5">{{
                                                    formatMontant(selectedPropriete.valeur) }}</strong></p>
                                        </div>
                                        <div class="mb-2" v-if="selectedPropriete.loyer">
                                            <label class="text-muted small">Loyer mensuel</label>
                                            <p class="mb-0"><strong>{{ formatMontant(selectedPropriete.loyer)
                                                    }}</strong></p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-person me-2"></i>Occupation</h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Occupant</label>
                                            <p class="mb-0"><strong>{{ selectedPropriete.occupant || 'Aucun' }}</strong>
                                            </p>
                                        </div>
                                        <div class="mb-2" v-if="selectedPropriete.dateDebut">
                                            <label class="text-muted small">Date de début</label>
                                            <p class="mb-0">{{ formatDate(selectedPropriete.dateDebut) }}</p>
                                        </div>
                                        <div class="mb-2" v-if="selectedPropriete.dateFin">
                                            <label class="text-muted small">Date de fin</label>
                                            <p class="mb-0">{{ formatDate(selectedPropriete.dateFin) }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12" v-if="selectedPropriete.description">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-file-text me-2"></i>Description</h6>
                                        <p class="mb-0">{{ selectedPropriete.description }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12"
                                v-if="selectedPropriete.equipements && selectedPropriete.equipements.length > 0">
                                <div class="card border-info">
                                    <div class="card-header bg-info bg-opacity-10">
                                        <h6 class="mb-0"><i class="bi bi-star me-2"></i>Équipements</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="d-flex flex-wrap gap-2">
                                            <span v-for="(equip, index) in selectedPropriete.equipements" :key="index"
                                                class="badge bg-info">
                                                {{ equip }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            @click="selectedPropriete = null">Fermer</button>
                        <button type="button" class="btn btn-info" @click="historiquePropriete(selectedPropriete)">
                            <i class="bi bi-clock-history me-1"></i>Historique
                        </button>
                        <button type="button" class="btn btn-success" @click="assignerPropriete(selectedPropriete)">
                            <i class="bi bi-person-plus me-1"></i>Assigner
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Assignation -->
        <div v-if="showAssignModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Assigner une Propriété</h5>
                        <button type="button" class="btn-close" @click="closeAssignModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Propriété *</label>
                                <select v-model="assignForm.proprieteId" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option v-for="prop in proprietesDisponibles" :key="prop.id" :value="prop.id">
                                        {{ prop.reference }} - {{ prop.nom }}
                                    </option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Occupant *</label>
                                <input type="text" v-model="assignForm.occupant" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date de début *</label>
                                <input type="date" v-model="assignForm.dateDebut" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date de fin</label>
                                <input type="date" v-model="assignForm.dateFin" class="form-control">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Loyer mensuel</label>
                                <input type="number" v-model.number="assignForm.loyer" class="form-control" step="0.01">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Type de contrat</label>
                                <select v-model="assignForm.typeContrat" class="form-select">
                                    <option value="LOCATION">Location</option>
                                    <option value="VENTE">Vente</option>
                                    <option value="GESTION">Gestion</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Notes</label>
                                <textarea v-model="assignForm.notes" class="form-control" rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeAssignModal">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="saveAssignation">
                            <i class="bi bi-check-circle me-1"></i>Assigner
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Historique -->
        <div v-if="showHistoriqueModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Historique des Affectations</h5>
                        <button type="button" class="btn-close" @click="showHistoriqueModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="timeline">
                            <div v-for="(event, index) in historique" :key="index" class="timeline-item mb-3">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                            <h6 class="mb-1">{{ event.occupant }}</h6>
                                            <span class="badge"
                                                :class="'bg-' + (event.actif ? 'success' : 'secondary')">
                                                {{ event.actif ? 'En cours' : 'Terminé' }}
                                            </span>
                                        </div>
                                        <p class="text-muted small mb-2">
                                            <i class="bi bi-calendar-range me-1"></i>
                                            {{ formatDate(event.dateDebut) }} - {{ event.dateFin ?
                                            formatDate(event.dateFin) : 'En cours' }}
                                        </p>
                                        <p class="mb-0 small" v-if="event.loyer">
                                            <strong>Loyer:</strong> {{ formatMontant(event.loyer) }}/mois
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            @click="showHistoriqueModal = false">Fermer</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProprietesAssignees',

    data() {
        return {
            loading: true,
            searchQuery: '',
            currentPage: 1,
            perPage: 15,
            showMapView: false,
            selectedPropriete: null,
            showAssignModal: false,
            showHistoriqueModal: false,
            filters: { type: '', statut: '', ville: '' },
            assignForm: {
                proprieteId: null,
                occupant: '',
                dateDebut: '',
                dateFin: '',
                loyer: 0,
                typeContrat: 'LOCATION',
                notes: ''
            },
            proprietes: [],
            historique: [],
            stats: { total: 0, occupees: 0, disponibles: 0, valeurTotale: 0, tauxOccupation: 0 },
            typesProprietes: [],
            charts: {
                type: null,
                statut: null
            }
        };
    },

    computed: {
        filteredProprietes() {
            let result = [...this.proprietes];

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(p =>
                    p.nom.toLowerCase().includes(query) ||
                    p.reference.toLowerCase().includes(query) ||
                    p.adresse.toLowerCase().includes(query) ||
                    p.ville.toLowerCase().includes(query) ||
                    (p.occupant && p.occupant.toLowerCase().includes(query))
                );
            }

            if (this.filters.type) result = result.filter(p => p.type === this.filters.type);
            if (this.filters.statut) result = result.filter(p => p.statut === this.filters.statut);
            if (this.filters.ville) result = result.filter(p => p.ville === this.filters.ville);

            return result.sort((a, b) => a.reference.localeCompare(b.reference));
        },

        paginatedProprietes() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredProprietes.slice(start, start + this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filteredProprietes.length / this.perPage);
        },

        villesUniques() {
            return [...new Set(this.proprietes.map(p => p.ville))].sort();
        },

        proprietesDisponibles() {
            return this.proprietes.filter(p => p.statut === 'DISPONIBLE');
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
                const types = ['APPARTEMENT', 'MAISON', 'BUREAU', 'COMMERCE', 'TERRAIN'];
                const statuts = ['DISPONIBLE', 'OCCUPEE', 'MAINTENANCE', 'VENDUE'];
                const villes = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Bordeaux'];
                const occupants = ['Jean Dupont', 'Marie Martin', 'Pierre Durand', 'Sophie Bernard', null];

                this.proprietes = Array.from({ length: 35 }, (_, i) => {
                    const type = types[Math.floor(Math.random() * types.length)];
                    const statut = statuts[Math.floor(Math.random() * statuts.length)];
                    const occupant = statut === 'OCCUPEE' ? occupants[Math.floor(Math.random() * (occupants.length - 1))] : null;

                    return {
                        id: i + 1,
                        reference: `PROP-${String(i + 1).padStart(4, '0')}`,
                        nom: `${type} ${i + 1}`,
                        type: type,
                        adresse: `${Math.floor(Math.random() * 200) + 1} ${['Rue', 'Avenue', 'Boulevard'][Math.floor(Math.random() * 3)]} de la ${['République', 'Liberté', 'Paix'][Math.floor(Math.random() * 3)]}`,
                        codePostal: `${Math.floor(Math.random() * 90000) + 10000}`,
                        ville: villes[Math.floor(Math.random() * villes.length)],
                        surface: Math.floor(Math.random() * 200) + 30,
                        pieces: type === 'APPARTEMENT' || type === 'MAISON' ? Math.floor(Math.random() * 5) + 1 : null,
                        valeur: Math.floor(Math.random() * 500000) + 100000,
                        loyer: statut === 'OCCUPEE' ? Math.floor(Math.random() * 2000) + 500 : null,
                        statut: statut,
                        occupant: occupant,
                        dateDebut: occupant ? new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
                        dateFin: null,
                        description: `Belle propriété de type ${type} située dans un quartier recherché.`,
                        equipements: ['Parking', 'Ascenseur', 'Balcon', 'Cave'].slice(0, Math.floor(Math.random() * 4) + 1)
                    };
                });

                this.calculateStats();
                this.calculateTypesProprietes();
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors du chargement', 'error');
            } finally {
                this.loading = false;
            }
        },

        calculateStats() {
            this.stats.total = this.proprietes.length;
            this.stats.occupees = this.proprietes.filter(p => p.statut === 'OCCUPEE').length;
            this.stats.disponibles = this.proprietes.filter(p => p.statut === 'DISPONIBLE').length;
            this.stats.valeurTotale = this.proprietes.reduce((sum, p) => sum + p.valeur, 0);
            this.stats.tauxOccupation = this.stats.total > 0 ? Math.round((this.stats.occupees / this.stats.total) * 100) : 0;
        },

        calculateTypesProprietes() {
            const typesConfig = [
                { id: 'APPARTEMENT', label: 'Appartements', icon: 'bi-building', color: 'primary' },
                { id: 'MAISON', label: 'Maisons', icon: 'bi-house-door', color: 'success' },
                { id: 'BUREAU', label: 'Bureaux', icon: 'bi-briefcase', color: 'info' },
                { id: 'COMMERCE', label: 'Commerces', icon: 'bi-shop', color: 'warning' },
                { id: 'TERRAIN', label: 'Terrains', icon: 'bi-geo', color: 'secondary' }
            ];

            this.typesProprietes = typesConfig.map(type => {
                const props = this.proprietes.filter(p => p.type === type.id);
                return {
                    ...type,
                    count: props.length,
                    valeur: props.reduce((sum, p) => sum + p.valeur, 0)
                };
            });
        },

        initCharts() {
            // Graphique par type
            const ctxType = document.getElementById('typeChart');
            if (ctxType && window.Chart) {
                this.charts.type = new Chart(ctxType, {
                    type: 'bar',
                    data: {
                        labels: this.typesProprietes.map(t => t.label),
                        datasets: [{
                            label: 'Nombre de propriétés',
                            data: this.typesProprietes.map(t => t.count),
                            backgroundColor: ['#0d6efd', '#198754', '#0dcaf0', '#ffc107', '#6c757d'],
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
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 1
                                }
                            }
                        }
                    }
                });
            }

            // Graphique statut
            const ctxStatut = document.getElementById('statutChart');
            if (ctxStatut && window.Chart) {
                const disponibles = this.proprietes.filter(p => p.statut === 'DISPONIBLE').length;
                const occupees = this.proprietes.filter(p => p.statut === 'OCCUPEE').length;
                const maintenance = this.proprietes.filter(p => p.statut === 'MAINTENANCE').length;
                const vendues = this.proprietes.filter(p => p.statut === 'VENDUE').length;

                this.charts.statut = new Chart(ctxStatut, {
                    type: 'doughnut',
                    data: {
                        labels: ['Disponibles', 'Occupées', 'Maintenance', 'Vendues'],
                        datasets: [{
                            data: [disponibles, occupees, maintenance, vendues],
                            backgroundColor: ['#0dcaf0', '#198754', '#ffc107', '#6c757d'],
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

        viewPropriete(propriete) {
            this.selectedPropriete = propriete;
        },

        assignerPropriete(propriete) {
            if (propriete) {
                this.assignForm.proprieteId = propriete.id;
            }
            this.showAssignModal = true;
            if (this.selectedPropriete) {
                this.selectedPropriete = null;
            }
        },

        historiquePropriete(propriete) {
            // Simulation d'historique
            this.historique = [
                {
                    occupant: propriete.occupant || 'Marie Martin',
                    dateDebut: '2024-01-15',
                    dateFin: null,
                    loyer: propriete.loyer || 1200,
                    actif: true
                },
                {
                    occupant: 'Jean Dupont',
                    dateDebut: '2023-01-01',
                    dateFin: '2023-12-31',
                    loyer: 1100,
                    actif: false
                }
            ];
            this.showHistoriqueModal = true;
            if (this.selectedPropriete) {
                this.selectedPropriete = null;
            }
        },

        closeAssignModal() {
            this.showAssignModal = false;
            this.assignForm = {
                proprieteId: null,
                occupant: '',
                dateDebut: '',
                dateFin: '',
                loyer: 0,
                typeContrat: 'LOCATION',
                notes: ''
            };
        },

        saveAssignation() {
            if (!this.assignForm.proprieteId || !this.assignForm.occupant || !this.assignForm.dateDebut) {
                this.showMessage('Veuillez remplir tous les champs obligatoires', 'warning');
                return;
            }

            const index = this.proprietes.findIndex(p => p.id === this.assignForm.proprieteId);
            if (index !== -1) {
                this.proprietes[index].statut = 'OCCUPEE';
                this.proprietes[index].occupant = this.assignForm.occupant;
                this.proprietes[index].dateDebut = this.assignForm.dateDebut;
                this.proprietes[index].dateFin = this.assignForm.dateFin;
                this.proprietes[index].loyer = this.assignForm.loyer;

                this.calculateStats();
                this.showMessage('Propriété assignée avec succès', 'success');
                this.closeAssignModal();
            }
        },

        async exportProprietes() {
            try {
                const csvContent = [
                    ['Référence', 'Nom', 'Type', 'Adresse', 'Ville', 'Surface', 'Valeur', 'Loyer', 'Occupant', 'Statut'].join(';'),
                    ...this.filteredProprietes.map(p => [
                        p.reference,
                        p.nom,
                        p.type,
                        p.adresse,
                        p.ville,
                        p.surface,
                        p.valeur,
                        p.loyer || '',
                        p.occupant || '',
                        p.statut
                    ].join(';'))
                ].join('\n');

                const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `proprietes-${new Date().toISOString().split('T')[0]}.csv`;
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

        filterProprietes() {
            this.currentPage = 1;
        },

        filterByType(typeId) {
            this.filters.type = this.filters.type === typeId ? '' : typeId;
            this.filterProprietes();
        },

        resetFilters() {
            this.searchQuery = '';
            this.filters = { type: '', statut: '', ville: '' };
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
                currency: 'EUR',
                maximumFractionDigits: 0
            }).format(montant);
        },

        getRowClass(propriete) {
            if (propriete.statut === 'MAINTENANCE') return 'table-warning';
            return '';
        },

        getTypeColor(type) {
            const colors = {
                'APPARTEMENT': 'primary',
                'MAISON': 'success',
                'BUREAU': 'info',
                'COMMERCE': 'warning',
                'TERRAIN': 'secondary'
            };
            return colors[type] || 'secondary';
        },

        getTypeIcon(type) {
            const icons = {
                'APPARTEMENT': 'bi-building',
                'MAISON': 'bi-house-door',
                'BUREAU': 'bi-briefcase',
                'COMMERCE': 'bi-shop',
                'TERRAIN': 'bi-geo'
            };
            return icons[type] || 'bi-house';
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'DISPONIBLE': 'bg-info',
                'OCCUPEE': 'bg-success',
                'MAINTENANCE': 'bg-warning',
                'VENDUE': 'bg-secondary'
            };
            return classes[statut] || 'bg-secondary';
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
        if (this.charts.type) {
            this.charts.type.destroy();
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

canvas {
    max-height: 300px;
}

/* Timeline */
.timeline {
    position: relative;
}

.timeline-item {
    position: relative;
}

.timeline-item .card {
    border-left: 3px solid #0d6efd;
}

.timeline-item .card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

.alert {
    border-radius: 8px;
}
</style>