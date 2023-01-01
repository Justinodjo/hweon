<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">

            <!-- En-tête -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">
                                <i class="bi bi-people me-2"></i>Informations des Parties
                            </h1>
                            <p class="text-muted mb-0">Gestion des clients et parties prenantes des actes</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <button @click="showCreateModal = true" class="btn btn-primary">
                                <i class="bi bi-plus-circle me-1"></i>Nouvelle Partie
                            </button>
                            <button @click="rafraichir" class="btn btn-outline-primary">
                                <i class="bi bi-arrow-clockwise"></i>
                            </button>
                            <button @click="exportParties" class="btn btn-success">
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
                                    <span class="text-muted small">Total Parties</span>
                                    <h3 class="mb-0 mt-2 text-primary">{{ stats.total }}</h3>
                                    <small class="text-muted">
                                        <i class="bi bi-people me-1"></i>Enregistrées
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-primary bg-opacity-10 text-primary">
                                    <i class="bi bi-people fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Personnes Physiques</span>
                                    <h3 class="mb-0 mt-2 text-success">{{ stats.physiques }}</h3>
                                    <small class="text-success">
                                        <i class="bi bi-person me-1"></i>Particuliers
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-success bg-opacity-10 text-success">
                                    <i class="bi bi-person fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Personnes Morales</span>
                                    <h3 class="mb-0 mt-2 text-info">{{ stats.morales }}</h3>
                                    <small class="text-muted">
                                        <i class="bi bi-building me-1"></i>Entreprises
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-info bg-opacity-10 text-info">
                                    <i class="bi bi-building fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Nouveaux ce mois</span>
                                    <h3 class="mb-0 mt-2 text-warning">{{ stats.nouveaux }}</h3>
                                    <small class="text-muted">
                                        <i class="bi bi-calendar-plus me-1"></i>Novembre 2024
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-warning bg-opacity-10 text-warning">
                                    <i class="bi bi-calendar-plus fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Statistiques et Activité -->
                <div class="row g-4 mb-4">
                    <div class="col-md-6">
                        <div class="card shadow-sm h-100">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Répartition par Qualité</h6>
                            </div>
                            <div class="card-body">
                                <div v-for="qualite in qualiteStats" :key="qualite.id" class="mb-3">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <div class="d-flex align-items-center">
                                            <i class="bi fs-5 me-2"
                                                :class="[qualite.icon, 'text-' + qualite.color]"></i>
                                            <span>{{ qualite.label }}</span>
                                        </div>
                                        <strong :class="'text-' + qualite.color">{{ qualite.count }}</strong>
                                    </div>
                                    <div class="progress" style="height: 6px;">
                                        <div class="progress-bar" :class="'bg-' + qualite.color"
                                            :style="{ width: qualite.percentage + '%' }"></div>
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
                                                v-model="searchQuery" @input="filterParties">
                                            <i
                                                class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.type" @change="filterParties" class="form-select">
                                            <option value="">Tous les types</option>
                                            <option value="PHYSIQUE">Personne physique</option>
                                            <option value="MORALE">Personne morale</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.qualite" @change="filterParties" class="form-select">
                                            <option value="">Toutes qualités</option>
                                            <option value="ACHETEUR">Acheteur</option>
                                            <option value="VENDEUR">Vendeur</option>
                                            <option value="LOCATAIRE">Locataire</option>
                                            <option value="BAILLEUR">Bailleur</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.statut" @change="filterParties" class="form-select">
                                            <option value="">Tous statuts</option>
                                            <option value="ACTIF">Actif</option>
                                            <option value="INACTIF">Inactif</option>
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

                <!-- Sélecteur de vue -->
                <div class="row mb-3">
                    <div class="col-12">
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-outline-primary"
                                :class="{ active: viewMode === 'cards' }" @click="viewMode = 'cards'">
                                <i class="bi bi-grid-3x3 me-1"></i>Cartes
                            </button>
                            <button type="button" class="btn btn-outline-primary"
                                :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">
                                <i class="bi bi-list-ul me-1"></i>Liste
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Vue Cartes -->
                <div v-if="viewMode === 'cards'">
                    <div v-if="paginatedParties.length === 0" class="row">
                        <div class="col-12">
                            <div class="card shadow-sm">
                                <div class="card-body text-center py-5">
                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                    <p class="text-muted mb-0">Aucune partie trouvée</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else class="row g-4 mb-4">
                        <div v-for="partie in paginatedParties" :key="partie.id" class="col-md-6 col-lg-4">
                            <div class="card partie-card shadow-sm h-100" @click="viewPartie(partie)">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between align-items-start mb-3">
                                        <div class="partie-avatar"
                                            :class="'bg-' + getTypeColor(partie.type) + ' bg-opacity-10'">
                                            <i class="bi fs-3"
                                                :class="[getTypeIcon(partie.type), 'text-' + getTypeColor(partie.type)]"></i>
                                        </div>
                                        <div class="d-flex flex-column align-items-end gap-1">
                                            <span class="badge" :class="'bg-' + getTypeColor(partie.type)">
                                                {{ getTypeLabel(partie.type) }}
                                            </span>
                                            <span class="badge" :class="getStatutBadgeClass(partie.statut)">
                                                {{ partie.statut }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <h6 class="mb-1">{{ partie.nom }}</h6>
                                        <small class="text-muted">Réf: {{ partie.reference }}</small>
                                    </div>
                                    <div class="partie-info">
                                        <div class="info-item">
                                            <i class="bi bi-briefcase text-muted me-2"></i>
                                            <small class="text-muted">{{ partie.qualite }}</small>
                                        </div>
                                        <div class="info-item">
                                            <i class="bi bi-telephone text-muted me-2"></i>
                                            <small class="text-muted">{{ partie.telephone }}</small>
                                        </div>
                                        <div class="info-item">
                                            <i class="bi bi-envelope text-muted me-2"></i>
                                            <small class="text-muted">{{ partie.email }}</small>
                                        </div>
                                        <div class="info-item">
                                            <i class="bi bi-geo-alt text-muted me-2"></i>
                                            <small class="text-muted">{{ partie.ville }}</small>
                                        </div>
                                    </div>
                                    <div class="mt-3 pt-3 border-top">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <small class="text-muted">
                                                <i class="bi bi-file-earmark-text me-1"></i>{{ partie.nombreActes }}
                                                acte(s)
                                            </small>
                                            <small class="text-muted">
                                                <i class="bi bi-calendar-event me-1"></i>{{
                                                    formatDate(partie.dateCreation) }}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Pagination Cartes -->
                    <div v-if="filteredParties.length > perPage" class="row">
                        <div class="col-12">
                            <nav>
                                <ul class="pagination justify-content-center">
                                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                        <a class="page-link" href="#" @click.prevent="currentPage--">Précédent</a>
                                    </li>
                                    <li v-for="page in totalPages" :key="page" class="page-item"
                                        :class="{ active: currentPage === page }">
                                        <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
                                    </li>
                                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                        <a class="page-link" href="#" @click.prevent="currentPage++">Suivant</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>

                <!-- Vue Liste -->
                <div v-if="viewMode === 'list'" class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">
                                    Liste des Parties
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ filteredParties.length }} parties
                                    </span>
                                </h6>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Référence</th>
                                                <th>Nom / Type</th>
                                                <th>Qualité</th>
                                                <th>Contact</th>
                                                <th>Ville</th>
                                                <th>Actes</th>
                                                <th>Statut</th>
                                                <th class="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="paginatedParties.length === 0">
                                                <td colspan="8" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucune partie trouvée</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="partie in paginatedParties" :key="partie.id">
                                                <td><strong class="text-primary">{{ partie.reference }}</strong></td>
                                                <td>
                                                    <div><strong>{{ partie.nom }}</strong></div>
                                                    <span class="badge" :class="'bg-' + getTypeColor(partie.type)">
                                                        <i class="bi" :class="getTypeIcon(partie.type)"></i>
                                                        {{ getTypeLabel(partie.type) }}
                                                    </span>
                                                </td>
                                                <td><span class="badge bg-light text-dark">{{ partie.qualite }}</span>
                                                </td>
                                                <td>
                                                    <div><i class="bi bi-telephone me-1"></i><small>{{ partie.telephone
                                                    }}</small></div>
                                                    <div><i class="bi bi-envelope me-1"></i><small>{{ partie.email
                                                    }}</small></div>
                                                </td>
                                                <td><small class="text-muted"><i class="bi bi-geo-alt me-1"></i>{{
                                                    partie.ville }}</small></td>
                                                <td><span class="badge bg-primary bg-opacity-10 text-primary">{{
                                                    partie.nombreActes }}</span></td>
                                                <td><span class="badge" :class="getStatutBadgeClass(partie.statut)">{{
                                                    partie.statut }}</span></td>
                                                <td class="text-end">
                                                    <div class="dropdown">
                                                        <button class="btn btn-sm btn-light" type="button"
                                                            data-bs-toggle="dropdown">
                                                            <i class="bi bi-three-dots-vertical"></i>
                                                        </button>
                                                        <ul class="dropdown-menu dropdown-menu-end">
                                                            <li><a class="dropdown-item" href="#"
                                                                    @click.prevent="viewPartie(partie)">
                                                                    <i class="bi bi-eye me-2"></i>Voir détails</a></li>
                                                            <li><a class="dropdown-item" href="#"
                                                                    @click.prevent="voirActes(partie)">
                                                                    <i class="bi bi-file-earmark-text me-2"></i>Voir
                                                                    actes</a></li>
                                                            <li>
                                                                <hr class="dropdown-divider">
                                                            </li>
                                                            <li><a class="dropdown-item" href="#"
                                                                    @click.prevent="editPartie(partie)">
                                                                    <i class="bi bi-pencil me-2"></i>Modifier</a></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- Pagination Liste -->
                                <div v-if="filteredParties.length > perPage" class="card-footer border-top">
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
        <div v-if="selectedPartie" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ selectedPartie.nom }}
                            <span class="badge ms-2" :class="'bg-' + getTypeColor(selectedPartie.type)">
                                {{ getTypeLabel(selectedPartie.type) }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedPartie = null"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-info-circle me-2"></i>Informations Générales
                                        </h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Référence</label>
                                            <p class="mb-0 fw-bold">{{ selectedPartie.reference }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Type</label>
                                            <p class="mb-0">
                                                <span class="badge" :class="'bg-' + getTypeColor(selectedPartie.type)">
                                                    {{ getTypeLabel(selectedPartie.type) }}
                                                </span>
                                            </p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Qualité</label>
                                            <p class="mb-0">{{ selectedPartie.qualite }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-telephone me-2"></i>Contact</h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Téléphone</label>
                                            <p class="mb-0">{{ selectedPartie.telephone }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Email</label>
                                            <p class="mb-0">{{ selectedPartie.email }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Adresse</label>
                                            <p class="mb-0">{{ selectedPartie.adresse }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Ville</label>
                                            <p class="mb-0">{{ selectedPartie.ville }}, {{ selectedPartie.pays }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-file-earmark-text me-2"></i>Actes Associés ({{
                                            selectedPartie.actes.length }})</h6>
                                        <div style="max-height: 300px; overflow-y: auto;">
                                            <div v-for="acte in selectedPartie.actes" :key="acte.id"
                                                class="p-3 mb-2 bg-white rounded">
                                                <div class="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <strong class="text-primary">#{{ acte.reference }}</strong>
                                                        <span class="badge bg-light text-dark ms-2">{{ acte.type
                                                        }}</span>
                                                        <div class="mt-1">{{ acte.titre }}</div>
                                                        <small class="text-muted">{{ formatDate(acte.date) }}</small>
                                                    </div>
                                                    <span class="badge" :class="getActeStatutBadgeClass(acte.statut)">{{
                                                        acte.statut }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="selectedPartie = null">Fermer</button>
                        <button type="button" class="btn btn-primary" @click="editPartie(selectedPartie)">
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
                        <h5 class="modal-title">{{ editMode ? 'Modifier' : 'Nouvelle' }} Partie</h5>
                        <button type="button" class="btn-close" @click="closeCreateModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Type de personne *</label>
                                <select v-model="partieForm.type" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="PHYSIQUE">Personne physique</option>
                                    <option value="MORALE">Personne morale</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Qualité *</label>
                                <select v-model="partieForm.qualite" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="ACHETEUR">Acheteur</option>
                                    <option value="VENDEUR">Vendeur</option>
                                    <option value="LOCATAIRE">Locataire</option>
                                    <option value="BAILLEUR">Bailleur</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">
                                    {{ partieForm.type === 'PHYSIQUE' ? 'Nom complet' : 'Raison sociale' }} *</label>
                                <input type="text" v-model="partieForm.nom" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Téléphone *</label>
                                <input type="tel" v-model="partieForm.telephone" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Email</label>
                                <input type="email" v-model="partieForm.email" class="form-control">
                            </div>
                            <div class="col-12">
                                <label class="form-label">Adresse *</label>
                                <input type="text" v-model="partieForm.adresse" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Ville *</label>
                                <input type="text" v-model="partieForm.ville" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Pays *</label>
                                <input type="text" v-model="partieForm.pays" class="form-control" required>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeCreateModal">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="savePartie">
                            <i class="bi bi-check-circle me-1"></i>{{ editMode ? 'Modifier' : 'Créer' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus';

export default {
    name: 'InformationsParties',

    data() {
        return {
            loading: true,
            viewMode: 'cards',
            searchQuery: '',
            currentPage: 1,
            perPage: 12,
            selectedPartie: null,
            showCreateModal: false,
            editMode: false,
            filters: { type: '', qualite: '', statut: '' },
            partieForm: {
                id: null, type: '', qualite: '', nom: '', telephone: '',
                email: '', adresse: '', ville: '', pays: 'Côte d\'Ivoire'
            },
            parties: [],
            stats: { total: 0, physiques: 0, morales: 0, nouveaux: 0 },
            qualiteStats: [],
            recentActivity: []
        };
    },

    computed: {
        filteredParties() {
            let result = [...this.parties];
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(p =>
                    p.nom.toLowerCase().includes(query) ||
                    p.reference.toLowerCase().includes(query) ||
                    (p.email && p.email.toLowerCase().includes(query)) ||
                    (p.telephone && p.telephone.includes(query))
                );
            }
            if (this.filters.type) result = result.filter(p => p.type === this.filters.type);
            if (this.filters.qualite) result = result.filter(p => p.qualite === this.filters.qualite);
            if (this.filters.statut) result = result.filter(p => p.statut === this.filters.statut);
            return result.sort((a, b) => a.nom.localeCompare(b.nom));
        },

        paginatedParties() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredParties.slice(start, start + this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filteredParties.length / this.perPage);
        }
    },

    async mounted() {
        await this.loadData();
    },

    methods: {
        async loadData() {
            try {
                this.loading = true;
                const noms = ['Jean Kouassi', 'Marie Diallo', 'Paul Kone', 'Sophie N\'Guessan',
                    'SARL BTP Ivoire', 'SA Immobilier Cocody', 'SCI Les Palmiers', 'Amadou Traoré'];

                this.parties = Array.from({ length: 40 }, (_, i) => {
                    const type = Math.random() > 0.6 ? 'MORALE' : 'PHYSIQUE';
                    const qualites = ['ACHETEUR', 'VENDEUR', 'LOCATAIRE', 'BAILLEUR', 'DONATEUR'];
                    return {
                        id: i + 1,
                        reference: `PAR-${String(i + 1).padStart(4, '0')}`,
                        type: type,
                        nom: noms[Math.floor(Math.random() * noms.length)] + ' ' + (i + 1),
                        qualite: qualites[Math.floor(Math.random() * qualites.length)],
                        telephone: `+225 07 ${Math.floor(Math.random() * 90000000 + 10000000)}`,
                        email: `partie${i + 1}@email.com`,
                        adresse: `Rue ${i + 1}, Quartier Résidentiel`,
                        ville: ['Abidjan', 'Yamoussoukro', 'Bouaké'][Math.floor(Math.random() * 3)],
                        pays: 'Côte d\'Ivoire',
                        statut: Math.random() > 0.2 ? 'ACTIF' : 'INACTIF',
                        nombreActes: Math.floor(Math.random() * 10) + 1,
                        dateCreation: new Date(2024, Math.floor(Math.random() * 11), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
                        actes: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
                            id: j + 1,
                            reference: `ACT-${String(j + 1).padStart(4, '0')}`,
                            type: ['VENTE', 'BAIL', 'DONATION'][Math.floor(Math.random() * 3)],
                            titre: `Acte ${j + 1}`,
                            date: new Date(2024, Math.floor(Math.random() * 11), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
                            statut: ['EN_COURS', 'SIGNE', 'ARCHIVE'][Math.floor(Math.random() * 3)]
                        }))
                    };
                });

                this.calculateStats();
                this.calculateQualiteStats();
                this.generateRecentActivity();
            } catch (error) {
                console.error('Erreur:', error);
                ElMessage.error('Erreur lors du chargement');
            } finally {
                this.loading = false;
            }
        },

        calculateStats() {
            this.stats.total = this.parties.length;
            this.stats.physiques = this.parties.filter(p => p.type === 'PHYSIQUE').length;
            this.stats.morales = this.parties.filter(p => p.type === 'MORALE').length;
            const thisMonth = new Date().getMonth();
            this.stats.nouveaux = this.parties.filter(p => new Date(p.dateCreation).getMonth() === thisMonth).length;
        },

        calculateQualiteStats() {
            const qualites = [
                { id: 'ACHETEUR', label: 'Acheteurs', icon: 'bi-cart-check', color: 'primary' },
                { id: 'VENDEUR', label: 'Vendeurs', icon: 'bi-shop', color: 'success' },
                { id: 'LOCATAIRE', label: 'Locataires', icon: 'bi-key', color: 'info' },
                { id: 'BAILLEUR', label: 'Bailleurs', icon: 'bi-building', color: 'warning' },
                { id: 'DONATEUR', label: 'Donateurs', icon: 'bi-gift', color: 'danger' }
            ];
            this.qualiteStats = qualites.map(q => ({
                ...q,
                count: this.parties.filter(p => p.qualite === q.id).length,
                percentage: this.stats.total > 0 ? Math.round((this.parties.filter(p => p.qualite === q.id).length / this.stats.total) * 100) : 0
            }));
        },

        generateRecentActivity() {
            this.recentActivity = [
                {
                    id: 1, action: 'Nouvelle partie ajoutée', details: 'Jean Kouassi - Acheteur',
                    date: new Date().toISOString().split('T')[0], icon: 'bi-person-plus', color: 'success'
                },
                {
                    id: 2, action: 'Modification d\'informations', details: 'SARL BTP Ivoire - Mise à jour contact',
                    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], icon: 'bi-pencil', color: 'primary'
                },
                {
                    id: 3, action: 'Document vérifié', details: 'Marie Diallo - CNI validée',
                    date: new Date(Date.now() - 172800000).toISOString().split('T')[0], icon: 'bi-check-circle', color: 'info'
                }
            ];
        },

        filterParties() {
            this.currentPage = 1;
        },

        resetFilters() {
            this.searchQuery = '';
            this.filters = { type: '', qualite: '', statut: '' };
            this.currentPage = 1;
        },

        viewPartie(partie) {
            this.selectedPartie = partie;
        },

        editPartie(partie) {
            this.editMode = true;
            this.partieForm = { ...partie };
            this.showCreateModal = true;
            if (this.selectedPartie) this.selectedPartie = null;
        },

        closeCreateModal() {
            this.showCreateModal = false;
            this.editMode = false;
            this.partieForm = {
                id: null, type: '', qualite: '', nom: '', telephone: '',
                email: '', adresse: '', ville: '', pays: 'Côte d\'Ivoire'
            };
        },

        savePartie() {
            if (!this.partieForm.type || !this.partieForm.qualite || !this.partieForm.nom ||
                !this.partieForm.telephone || !this.partieForm.adresse || !this.partieForm.ville) {
                ElMessage.warning('Veuillez remplir tous les champs obligatoires');
                return;
            }
            ElMessage.success(this.editMode ? 'Partie modifiée avec succès!' : 'Partie créée avec succès!');
            this.closeCreateModal();
            this.loadData();
        },

        voirActes(partie) {
            ElMessage.info(`Affichage des ${partie.nombreActes} acte(s) de ${partie.nom}`);
        },

        exportParties() {
            ElMessage.success('Export des parties en cours...');
        },

        rafraichir() {
            this.loadData();
            ElMessage.success('Données mises à jour !');
        },

        getTypeLabel(type) {
            return type === 'PHYSIQUE' ? 'Personne physique' : 'Personne morale';
        },

        getTypeIcon(type) {
            return type === 'PHYSIQUE' ? 'bi-person' : 'bi-building';
        },

        getTypeColor(type) {
            return type === 'PHYSIQUE' ? 'success' : 'info';
        },

        getStatutBadgeClass(statut) {
            return statut === 'ACTIF' ? 'bg-success' : 'bg-secondary';
        },

        getActeStatutBadgeClass(statut) {
            const classes = { 'EN_COURS': 'bg-warning text-dark', 'SIGNE': 'bg-success', 'ARCHIVE': 'bg-secondary' };
            return classes[statut] || 'bg-secondary';
        },

        formatDate(dateStr) {
            if (!dateStr) return '—';
            return new Date(dateStr).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
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

.partie-card {
    cursor: pointer;
    transition: all 0.3s;
}

.partie-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}

.partie-avatar {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
}

.partie-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-item {
    display: flex;
    align-items: center;
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

    .icon-lg,
    .partie-avatar {
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