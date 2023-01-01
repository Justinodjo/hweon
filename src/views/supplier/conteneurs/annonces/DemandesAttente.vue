<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">

            <!-- En-tête -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">
                                <i class="bi bi-hourglass-split me-2"></i>Demandes en Attente
                            </h1>
                            <p class="text-muted mb-0">Gestion des demandes clients en attente de traitement</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <button @click="showCreateModal = true" class="btn btn-primary">
                                <i class="bi bi-plus-circle me-1"></i>Nouvelle Demande
                            </button>
                            <button @click="traiterGroupees" class="btn btn-success" v-if="selectedDemandes.length > 0">
                                <i class="bi bi-check-all me-1"></i>Traiter Sélection ({{ selectedDemandes.length }})
                            </button>
                            <button @click="exportDemandes" class="btn btn-outline-success">
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
                                    <span class="text-muted small">Total En Attente</span>
                                    <h3 class="mb-0 mt-2 text-warning">{{ stats.total }}</h3>
                                    <small class="text-warning">
                                        <i class="bi bi-hourglass-split me-1"></i>Demandes
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
                                    <span class="text-muted small">Urgentes</span>
                                    <h3 class="mb-0 mt-2 text-danger">{{ stats.urgentes }}</h3>
                                    <small class="text-danger">
                                        <i class="bi bi-exclamation-triangle me-1"></i>Priorité haute
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
                                    <span class="text-muted small">En Retard</span>
                                    <h3 class="mb-0 mt-2 text-danger">{{ stats.enRetard }}</h3>
                                    <small class="text-danger">
                                        <i class="bi bi-clock-history me-1"></i>Délai dépassé
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-danger bg-opacity-10 text-danger">
                                    <i class="bi bi-clock-history fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Temps Moyen</span>
                                    <h3 class="mb-0 mt-2 text-info">{{ stats.tempsMoyen }}j</h3>
                                    <small class="text-info">
                                        <i class="bi bi-graph-up me-1"></i>D'attente
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-info bg-opacity-10 text-info">
                                    <i class="bi bi-clock fa-fw fs-4"></i>
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
                                <h6 class="mb-0"><i class="bi bi-bar-chart me-2"></i>Évolution des Demandes</h6>
                            </div>
                            <div class="card-body">
                                <canvas id="evolutionChart" height="80"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0"><i class="bi bi-pie-chart me-2"></i>Par Priorité</h6>
                            </div>
                            <div class="card-body">
                                <canvas id="prioriteChart" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Types de demandes -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Répartition par Type</h6>
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div v-for="type in typesDemandes" :key="type.id" class="col-md-4">
                                        <div class="card border h-100" style="cursor: pointer;"
                                            @click="filterByType(type.id)">
                                            <div class="card-body">
                                                <div class="d-flex justify-content-between align-items-start mb-3">
                                                    <div class="d-flex align-items-center">
                                                        <i class="bi fs-3 me-2"
                                                            :class="[type.icon, 'text-' + type.color]"></i>
                                                        <div>
                                                            <strong class="d-block">{{ type.label }}</strong>
                                                            <small class="text-muted">{{ type.count }} demandes</small>
                                                        </div>
                                                    </div>
                                                    <span class="badge" :class="'bg-' + type.color">
                                                        {{ type.count }}
                                                    </span>
                                                </div>
                                                <small class="text-muted">{{ type.description }}</small>
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
                                                v-model="searchQuery" @input="filterDemandes">
                                            <i
                                                class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.type" @change="filterDemandes" class="form-select">
                                            <option value="">Tous types</option>
                                            <option value="ACTE">Acte notarié</option>
                                            <option value="CONSEIL">Conseil</option>
                                            <option value="DOCUMENT">Document</option>
                                            <option value="INFORMATION">Information</option>
                                            <option value="RDV">Rendez-vous</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.priorite" @change="filterDemandes" class="form-select">
                                            <option value="">Toutes priorités</option>
                                            <option value="URGENTE">Urgente</option>
                                            <option value="HAUTE">Haute</option>
                                            <option value="NORMALE">Normale</option>
                                            <option value="BASSE">Basse</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.affecte" @change="filterDemandes" class="form-select">
                                            <option value="">Affectation</option>
                                            <option value="OUI">Affectées</option>
                                            <option value="NON">Non affectées</option>
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

                <!-- Liste des demandes -->
                <div class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h6 class="mb-0">
                                        Demandes en Attente
                                        <span class="badge bg-warning bg-opacity-10 text-warning ms-2">
                                            {{ filteredDemandes.length }} demandes
                                        </span>
                                    </h6>
                                    <div class="form-check" v-if="filteredDemandes.length > 0">
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
                                                <th>Client</th>
                                                <th>Type / Objet</th>
                                                <th>Priorité</th>
                                                <th>Date Demande</th>
                                                <th>Délai</th>
                                                <th>Affecté à</th>
                                                <th class="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="paginatedDemandes.length === 0">
                                                <td colspan="9" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucune demande en attente</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="demande in paginatedDemandes" :key="demande.id"
                                                :class="getRowClass(demande)">
                                                <td>
                                                    <input type="checkbox" class="form-check-input"
                                                        v-model="selectedDemandes" :value="demande.id">
                                                </td>
                                                <td>
                                                    <strong class="text-primary">{{ demande.reference }}</strong>
                                                    <span v-if="isEnRetard(demande.dateEcheance)"
                                                        class="badge bg-danger ms-1">
                                                        <i class="bi bi-exclamation-triangle"></i>
                                                    </span>
                                                </td>
                                                <td>
                                                    <div><strong>{{ demande.client }}</strong></div>
                                                    <small class="text-muted">
                                                        <i class="bi bi-envelope me-1"></i>{{ demande.email }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <div><strong>{{ demande.objet }}</strong></div>
                                                    <span class="badge" :class="'bg-' + getTypeColor(demande.type)">
                                                        {{ demande.type }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span class="badge"
                                                        :class="getPrioriteBadgeClass(demande.priorite)">
                                                        <i class="bi" :class="getPrioriteIcon(demande.priorite)"></i>
                                                        {{ demande.priorite }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <small class="text-muted">
                                                        <i class="bi bi-calendar-event me-1"></i>
                                                        {{ formatDate(demande.dateDemande) }}
                                                    </small>
                                                    <div>
                                                        <small class="text-muted">
                                                            Il y a {{ getJoursAttente(demande.dateDemande) }}j
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <small :class="getDelaiClass(demande.dateEcheance)">
                                                        <i class="bi bi-clock me-1"></i>
                                                        {{ formatDate(demande.dateEcheance) }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <div v-if="demande.affecteA">
                                                        <div class="d-flex align-items-center">
                                                            <div class="avatar-sm bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-2"
                                                                style="width: 28px; height: 28px;">
                                                                <small>{{ getInitiales(demande.affecteA) }}</small>
                                                            </div>
                                                            <small>{{ demande.affecteA }}</small>
                                                        </div>
                                                    </div>
                                                    <small v-else class="text-muted">Non affectée</small>
                                                </td>
                                                <td class="text-end">
                                                    <div class="btn-group">
                                                        <button class="btn btn-sm btn-outline-primary"
                                                            @click="viewDemande(demande)">
                                                            <i class="bi bi-eye"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-success"
                                                            @click="traiterDemande(demande)">
                                                            <i class="bi bi-check-circle"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-warning"
                                                            @click="affecterDemande(demande)">
                                                            <i class="bi bi-person-plus"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- Pagination -->
                                <div v-if="filteredDemandes.length > perPage" class="card-footer border-top">
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
        <div v-if="selectedDemande" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ selectedDemande.objet }}
                            <span class="badge ms-2" :class="getPrioriteBadgeClass(selectedDemande.priorite)">
                                {{ selectedDemande.priorite }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedDemande = null"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-person me-2"></i>Informations Client</h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Nom</label>
                                            <p class="mb-0 fw-bold">{{ selectedDemande.client }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Email</label>
                                            <p class="mb-0">{{ selectedDemande.email }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Téléphone</label>
                                            <p class="mb-0">{{ selectedDemande.telephone }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-info-circle me-2"></i>Détails Demande</h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Référence</label>
                                            <p class="mb-0 fw-bold">{{ selectedDemande.reference }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Type</label>
                                            <p class="mb-0">
                                                <span class="badge" :class="'bg-' + getTypeColor(selectedDemande.type)">
                                                    {{ selectedDemande.type }}
                                                </span>
                                            </p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Date de demande</label>
                                            <p class="mb-0">{{ formatDate(selectedDemande.dateDemande) }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Échéance</label>
                                            <p class="mb-0" :class="getDelaiClass(selectedDemande.dateEcheance)">
                                                {{ formatDate(selectedDemande.dateEcheance) }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-file-text me-2"></i>Description</h6>
                                        <p class="mb-0">{{ selectedDemande.description }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12"
                                v-if="selectedDemande.documents && selectedDemande.documents.length > 0">
                                <div class="card border-primary">
                                    <div class="card-header bg-primary bg-opacity-10">
                                        <h6 class="mb-0"><i class="bi bi-paperclip me-2"></i>Documents joints ({{
                                            selectedDemande.documents.length }})</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="list-group">
                                            <a href="#" v-for="(doc, index) in selectedDemande.documents" :key="index"
                                                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                                <div>
                                                    <i class="bi bi-file-earmark-pdf text-danger me-2 fs-5"></i>
                                                    <span>{{ doc }}</span>
                                                </div>
                                                <i class="bi bi-download text-primary"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12" v-if="selectedDemande.affecteA">
                                <div class="card border-info">
                                    <div class="card-header bg-info bg-opacity-10">
                                        <h6 class="mb-0"><i class="bi bi-person-check me-2"></i>Affectation</h6>
                                    </div>
                                    <div class="card-body">
                                        <p class="mb-0">
                                            <strong>Affectée à :</strong> {{ selectedDemande.affecteA }}
                                        </p>
                                        <small class="text-muted">
                                            Le {{ formatDate(selectedDemande.dateAffectation) }}
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12"
                                v-if="selectedDemande.commentaires && selectedDemande.commentaires.length > 0">
                                <div class="card border-warning">
                                    <div class="card-header bg-warning bg-opacity-10">
                                        <h6 class="mb-0"><i class="bi bi-chat-left-text me-2"></i>Commentaires</h6>
                                    </div>
                                    <div class="card-body">
                                        <div v-for="(comment, index) in selectedDemande.commentaires" :key="index"
                                            class="mb-3">
                                            <div class="d-flex justify-content-between">
                                                <strong>{{ comment.auteur }}</strong>
                                                <small class="text-muted">{{ formatDate(comment.date) }}</small>
                                            </div>
                                            <p class="mb-0 mt-1">{{ comment.texte }}</p>
                                            <hr v-if="index < selectedDemande.commentaires.length - 1">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="selectedDemande = null">Fermer</button>
                        <button type="button" class="btn btn-warning" @click="affecterDemande(selectedDemande)">
                            <i class="bi bi-person-plus me-1"></i>Affecter
                        </button>
                        <button type="button" class="btn btn-success" @click="traiterDemande(selectedDemande)">
                            <i class="bi bi-check-circle me-1"></i>Traiter
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Création -->
        <div v-if="showCreateModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Nouvelle Demande</h5>
                        <button type="button" class="btn-close" @click="closeCreateModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Type *</label>
                                <select v-model="demandeForm.type" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="ACTE">Acte notarié</option>
                                    <option value="CONSEIL">Conseil</option>
                                    <option value="DOCUMENT">Document</option>
                                    <option value="INFORMATION">Information</option>
                                    <option value="RDV">Rendez-vous</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Priorité *</label>
                                <select v-model="demandeForm.priorite" class="form-select" required>
                                    <option value="NORMALE">Normale</option>
                                    <option value="HAUTE">Haute</option>
                                    <option value="URGENTE">Urgente</option>
                                    <option value="BASSE">Basse</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Objet de la demande *</label>
                                <input type="text" v-model="demandeForm.objet" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Nom du client *</label>
                                <input type="text" v-model="demandeForm.client" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Email *</label>
                                <input type="email" v-model="demandeForm.email" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Téléphone</label>
                                <input type="tel" v-model="demandeForm.telephone" class="form-control">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date d'échéance *</label>
                                <input type="date" v-model="demandeForm.dateEcheance" class="form-control" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Description *</label>
                                <textarea v-model="demandeForm.description" class="form-control" rows="4"
                                    required></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeCreateModal">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="saveDemande">
                            <i class="bi bi-check-circle me-1"></i>Créer
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Affectation -->
        <div v-if="showAffectationModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Affecter la Demande</h5>
                        <button type="button" class="btn-close" @click="showAffectationModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Affecter à *</label>
                            <select v-model="affectationForm.affecteA" class="form-select">
                                <option value="">Sélectionner un collaborateur</option>
                                <option value="Me. Dupont">Me. Dupont</option>
                                <option value="Me. Martin">Me. Martin</option>
                                <option value="Me. Bernard">Me. Bernard</option>
                                <option value="Sophie Durand">Sophie Durand (Clerc)</option>
                                <option value="Pierre Petit">Pierre Petit (Assistant)</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Commentaire</label>
                            <textarea v-model="affectationForm.commentaire" class="form-control" rows="3"
                                placeholder="Notes sur l'affectation..."></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            @click="showAffectationModal = false">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="saveAffectation">
                            <i class="bi bi-check-circle me-1"></i>Affecter
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Traitement -->
        <div v-if="showTraitementModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Traiter la Demande</h5>
                        <button type="button" class="btn-close" @click="showTraitementModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Statut final *</label>
                            <select v-model="traitementForm.statut" class="form-select">
                                <option value="TRAITEE">Traitée</option>
                                <option value="EN_COURS">En cours de traitement</option>
                                <option value="REJETEE">Rejetée</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Commentaire de clôture *</label>
                            <textarea v-model="traitementForm.commentaire" class="form-control" rows="4"
                                placeholder="Décrivez le traitement effectué..." required></textarea>
                        </div>
                        <div class="mb-3" v-if="traitementForm.statut === 'EN_COURS'">
                            <label class="form-label">Nouvelle échéance</label>
                            <input type="date" v-model="traitementForm.nouvelleEcheance" class="form-control">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            @click="showTraitementModal = false">Annuler</button>
                        <button type="button" class="btn btn-success" @click="saveTraitement">
                            <i class="bi bi-check-circle me-1"></i>Confirmer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DemandesAttente',

    data() {
        return {
            loading: true,
            searchQuery: '',
            currentPage: 1,
            perPage: 15,
            selectedDemande: null,
            showCreateModal: false,
            showAffectationModal: false,
            showTraitementModal: false,
            selectAll: false,
            selectedDemandes: [],
            filters: { type: '', priorite: '', affecte: '' },
            demandeForm: {
                type: '',
                priorite: 'NORMALE',
                objet: '',
                client: '',
                email: '',
                telephone: '',
                dateEcheance: '',
                description: ''
            },
            affectationForm: {
                demandeId: null,
                affecteA: '',
                commentaire: ''
            },
            traitementForm: {
                demandeId: null,
                statut: 'TRAITEE',
                commentaire: '',
                nouvelleEcheance: ''
            },
            demandes: [],
            stats: { total: 0, urgentes: 0, enRetard: 0, tempsMoyen: 0 },
            typesDemandes: [],
            charts: {
                evolution: null,
                priorite: null
            }
        };
    },

    computed: {
        filteredDemandes() {
            let result = [...this.demandes];
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(d =>
                    d.objet.toLowerCase().includes(query) ||
                    d.client.toLowerCase().includes(query) ||
                    d.reference.toLowerCase().includes(query) ||
                    d.email.toLowerCase().includes(query)
                );
            }
            if (this.filters.type) result = result.filter(d => d.type === this.filters.type);
            if (this.filters.priorite) result = result.filter(d => d.priorite === this.filters.priorite);
            if (this.filters.affecte === 'OUI') result = result.filter(d => d.affecteA);
            if (this.filters.affecte === 'NON') result = result.filter(d => !d.affecteA);

            return result.sort((a, b) => {
                // Tri par priorité puis par date
                const prioriteOrder = { 'URGENTE': 0, 'HAUTE': 1, 'NORMALE': 2, 'BASSE': 3 };
                if (prioriteOrder[a.priorite] !== prioriteOrder[b.priorite]) {
                    return prioriteOrder[a.priorite] - prioriteOrder[b.priorite];
                }
                return new Date(a.dateDemande) - new Date(b.dateDemande);
            });
        },

        paginatedDemandes() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredDemandes.slice(start, start + this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filteredDemandes.length / this.perPage);
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
                const types = ['ACTE', 'CONSEIL', 'DOCUMENT', 'INFORMATION', 'RDV'];
                const priorites = ['URGENTE', 'HAUTE', 'NORMALE', 'BASSE'];
                const clients = ['Jean Dupont', 'Marie Martin', 'Pierre Durand', 'Sophie Bernard', 'Luc Petit', 'Emma Rousseau', 'Thomas Blanc', 'Julie Moreau'];
                const collaborateurs = ['Me. Dupont', 'Me. Martin', 'Me. Bernard', 'Sophie Durand', 'Pierre Petit'];

                this.demandes = Array.from({ length: 35 }, (_, i) => {
                    const baseDate = new Date();
                    const randomDays = Math.floor(Math.random() * 30) + 1;
                    const dateDemande = new Date(baseDate);
                    dateDemande.setDate(baseDate.getDate() - randomDays);

                    const echeanceDate = new Date(dateDemande);
                    echeanceDate.setDate(dateDemande.getDate() + Math.floor(Math.random() * 20) + 5);

                    const affecte = Math.random() > 0.3;

                    return {
                        id: i + 1,
                        reference: `DEM-${String(i + 1).padStart(5, '0')}`,
                        type: types[Math.floor(Math.random() * types.length)],
                        priorite: priorites[Math.floor(Math.random() * priorites.length)],
                        objet: `Demande ${types[Math.floor(Math.random() * types.length)]} - ${i + 1}`,
                        client: clients[Math.floor(Math.random() * clients.length)],
                        email: `client${i + 1}@example.com`,
                        telephone: `+33 6 ${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
                        dateDemande: dateDemande.toISOString().split('T')[0],
                        dateEcheance: echeanceDate.toISOString().split('T')[0],
                        affecteA: affecte ? collaborateurs[Math.floor(Math.random() * collaborateurs.length)] : null,
                        dateAffectation: affecte ? dateDemande.toISOString().split('T')[0] : null,
                        description: `Description détaillée de la demande numéro ${i + 1}. Le client souhaite obtenir des informations ou des services concernant cette demande.`,
                        documents: Math.random() > 0.5 ? [
                            'Document_identite.pdf',
                            'Justificatif_domicile.pdf'
                        ] : [],
                        commentaires: Math.random() > 0.6 ? [
                            {
                                auteur: 'Me. Dupont',
                                date: new Date().toISOString().split('T')[0],
                                texte: 'Demande prise en compte, en attente de documents complémentaires.'
                            }
                        ] : []
                    };
                });

                this.calculateStats();
                this.calculateTypesDemandes();
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors du chargement', 'error');
            } finally {
                this.loading = false;
            }
        },

        calculateStats() {
            this.stats.total = this.demandes.length;
            this.stats.urgentes = this.demandes.filter(d => d.priorite === 'URGENTE' || d.priorite === 'HAUTE').length;

            const today = new Date();
            this.stats.enRetard = this.demandes.filter(d => {
                const echeance = new Date(d.dateEcheance);
                return echeance < today;
            }).length;

            // Calcul du temps moyen d'attente
            const totalJours = this.demandes.reduce((sum, d) => {
                return sum + this.getJoursAttente(d.dateDemande);
            }, 0);
            this.stats.tempsMoyen = Math.round(totalJours / this.demandes.length);
        },

        calculateTypesDemandes() {
            const typesList = [
                { id: 'ACTE', label: 'Actes notariés', icon: 'bi-file-earmark-text', color: 'primary', description: 'Rédaction d\'actes' },
                { id: 'CONSEIL', label: 'Conseils', icon: 'bi-lightbulb', color: 'warning', description: 'Demandes de conseil' },
                { id: 'DOCUMENT', label: 'Documents', icon: 'bi-folder', color: 'info', description: 'Demandes de documents' },
                { id: 'INFORMATION', label: 'Informations', icon: 'bi-info-circle', color: 'secondary', description: 'Demandes d\'information' },
                { id: 'RDV', label: 'Rendez-vous', icon: 'bi-calendar-check', color: 'success', description: 'Prises de rendez-vous' }
            ];

            this.typesDemandes = typesList.map(type => ({
                ...type,
                count: this.demandes.filter(d => d.type === type.id).length
            }));
        },

        initCharts() {
            // Graphique d'évolution
            const ctxEvolution = document.getElementById('evolutionChart');
            if (ctxEvolution && window.Chart) {
                const derniersMois = ['Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
                const dataDemandes = [45, 52, 48, 55, 60, 35];
                const dataTraitees = [40, 48, 45, 50, 55, 30];

                this.charts.evolution = new Chart(ctxEvolution, {
                    type: 'line',
                    data: {
                        labels: derniersMois,
                        datasets: [
                            {
                                label: 'Demandes reçues',
                                data: dataDemandes,
                                borderColor: '#ffc107',
                                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                                tension: 0.4,
                                fill: true
                            },
                            {
                                label: 'Demandes traitées',
                                data: dataTraitees,
                                borderColor: '#198754',
                                backgroundColor: 'rgba(25, 135, 84, 0.1)',
                                tension: 0.4,
                                fill: true
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
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

            // Graphique de priorité
            const ctxPriorite = document.getElementById('prioriteChart');
            if (ctxPriorite && window.Chart) {
                const urgentes = this.demandes.filter(d => d.priorite === 'URGENTE').length;
                const hautes = this.demandes.filter(d => d.priorite === 'HAUTE').length;
                const normales = this.demandes.filter(d => d.priorite === 'NORMALE').length;
                const basses = this.demandes.filter(d => d.priorite === 'BASSE').length;

                this.charts.priorite = new Chart(ctxPriorite, {
                    type: 'doughnut',
                    data: {
                        labels: ['Urgente', 'Haute', 'Normale', 'Basse'],
                        datasets: [{
                            data: [urgentes, hautes, normales, basses],
                            backgroundColor: ['#dc3545', '#fd7e14', '#0dcaf0', '#6c757d'],
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

        filterDemandes() {
            this.currentPage = 1;
            this.selectedDemandes = [];
            this.selectAll = false;
        },

        filterByType(typeId) {
            this.filters.type = this.filters.type === typeId ? '' : typeId;
            this.filterDemandes();
        },

        resetFilters() {
            this.searchQuery = '';
            this.filters = { type: '', priorite: '', affecte: '' };
            this.currentPage = 1;
            this.selectedDemandes = [];
            this.selectAll = false;
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },

        toggleSelectAll() {
            if (this.selectAll) {
                this.selectedDemandes = this.paginatedDemandes.map(d => d.id);
            } else {
                this.selectedDemandes = [];
            }
        },

        viewDemande(demande) {
            this.selectedDemande = demande;
        },

        affecterDemande(demande) {
            this.affectationForm.demandeId = demande.id;
            this.affectationForm.affecteA = demande.affecteA || '';
            this.affectationForm.commentaire = '';
            this.showAffectationModal = true;
            if (this.selectedDemande) {
                this.selectedDemande = null;
            }
        },

        async saveAffectation() {
            try {
                if (!this.affectationForm.affecteA) {
                    this.showMessage('Veuillez sélectionner un collaborateur', 'warning');
                    return;
                }

                const index = this.demandes.findIndex(d => d.id === this.affectationForm.demandeId);
                if (index !== -1) {
                    this.demandes[index].affecteA = this.affectationForm.affecteA;
                    this.demandes[index].dateAffectation = new Date().toISOString().split('T')[0];

                    if (this.affectationForm.commentaire) {
                        if (!this.demandes[index].commentaires) {
                            this.demandes[index].commentaires = [];
                        }
                        this.demandes[index].commentaires.push({
                            auteur: 'Système',
                            date: new Date().toISOString().split('T')[0],
                            texte: `Affectation: ${this.affectationForm.commentaire}`
                        });
                    }

                    this.showMessage('Demande affectée avec succès', 'success');
                    this.showAffectationModal = false;
                }
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors de l\'affectation', 'error');
            }
        },

        traiterDemande(demande) {
            this.traitementForm.demandeId = demande.id;
            this.traitementForm.statut = 'TRAITEE';
            this.traitementForm.commentaire = '';
            this.traitementForm.nouvelleEcheance = '';
            this.showTraitementModal = true;
            if (this.selectedDemande) {
                this.selectedDemande = null;
            }
        },

        async saveTraitement() {
            try {
                if (!this.traitementForm.commentaire) {
                    this.showMessage('Veuillez ajouter un commentaire', 'warning');
                    return;
                }

                const index = this.demandes.findIndex(d => d.id === this.traitementForm.demandeId);
                if (index !== -1) {
                    if (this.traitementForm.statut === 'TRAITEE' || this.traitementForm.statut === 'REJETEE') {
                        // Retirer de la liste
                        this.demandes.splice(index, 1);
                        this.showMessage(`Demande ${this.traitementForm.statut === 'TRAITEE' ? 'traitée' : 'rejetée'} avec succès`, 'success');
                    } else if (this.traitementForm.statut === 'EN_COURS') {
                        if (this.traitementForm.nouvelleEcheance) {
                            this.demandes[index].dateEcheance = this.traitementForm.nouvelleEcheance;
                        }
                        this.showMessage('Statut mis à jour', 'success');
                    }

                    this.calculateStats();
                    this.calculateTypesDemandes();
                    this.showTraitementModal = false;
                    this.selectedDemandes = [];
                    this.selectAll = false;

                    // Mise à jour des graphiques
                    if (this.charts.priorite) {
                        const urgentes = this.demandes.filter(d => d.priorite === 'URGENTE').length;
                        const hautes = this.demandes.filter(d => d.priorite === 'HAUTE').length;
                        const normales = this.demandes.filter(d => d.priorite === 'NORMALE').length;
                        const basses = this.demandes.filter(d => d.priorite === 'BASSE').length;

                        this.charts.priorite.data.datasets[0].data = [urgentes, hautes, normales, basses];
                        this.charts.priorite.update();
                    }
                }
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors du traitement', 'error');
            }
        },

        async traiterGroupees() {
            if (this.selectedDemandes.length === 0) {
                this.showMessage('Aucune demande sélectionnée', 'warning');
                return;
            }

            if (confirm(`Êtes-vous sûr de vouloir traiter ${this.selectedDemandes.length} demande(s) ?`)) {
                try {
                    this.demandes = this.demandes.filter(d => !this.selectedDemandes.includes(d.id));
                    this.showMessage(`${this.selectedDemandes.length} demande(s) traitée(s)`, 'success');
                    this.selectedDemandes = [];
                    this.selectAll = false;
                    this.calculateStats();
                    this.calculateTypesDemandes();
                } catch (error) {
                    console.error('Erreur:', error);
                    this.showMessage('Erreur lors du traitement groupé', 'error');
                }
            }
        },

        async exportDemandes() {
            try {
                const csvContent = [
                    ['Référence', 'Date', 'Type', 'Objet', 'Client', 'Email', 'Priorité', 'Échéance', 'Affecté à', 'Délai (jours)'].join(';'),
                    ...this.filteredDemandes.map(d => [
                        d.reference,
                        this.formatDate(d.dateDemande),
                        d.type,
                        d.objet,
                        d.client,
                        d.email,
                        d.priorite,
                        this.formatDate(d.dateEcheance),
                        d.affecteA || 'Non affectée',
                        this.getJoursAttente(d.dateDemande)
                    ].join(';'))
                ].join('\n');

                const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `demandes-attente-${new Date().toISOString().split('T')[0]}.csv`;
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

        async rafraichir() {
            await this.loadData();
            this.$nextTick(() => {
                this.initCharts();
            });
            this.showMessage('Données actualisées', 'success');
        },

        closeCreateModal() {
            this.showCreateModal = false;
            this.demandeForm = {
                type: '',
                priorite: 'NORMALE',
                objet: '',
                client: '',
                email: '',
                telephone: '',
                dateEcheance: '',
                description: ''
            };
        },

        async saveDemande() {
            try {
                if (!this.demandeForm.type || !this.demandeForm.objet ||
                    !this.demandeForm.client || !this.demandeForm.email ||
                    !this.demandeForm.dateEcheance || !this.demandeForm.description) {
                    this.showMessage('Veuillez remplir tous les champs obligatoires', 'warning');
                    return;
                }

                const newDemande = {
                    id: this.demandes.length + 1,
                    reference: `DEM-${String(this.demandes.length + 1).padStart(5, '0')}`,
                    ...this.demandeForm,
                    dateDemande: new Date().toISOString().split('T')[0],
                    affecteA: null,
                    dateAffectation: null,
                    documents: [],
                    commentaires: []
                };

                this.demandes.unshift(newDemande);
                this.calculateStats();
                this.calculateTypesDemandes();
                this.closeCreateModal();
                this.showMessage('Demande créée avec succès', 'success');
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors de la création', 'error');
            }
        },

        // Méthodes utilitaires
        formatDate(dateString) {
            if (!dateString) return '-';
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },

        getJoursAttente(dateDemande) {
            const today = new Date();
            const demande = new Date(dateDemande);
            const diffTime = Math.abs(today - demande);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        },

        isEnRetard(dateEcheance) {
            const today = new Date();
            const echeance = new Date(dateEcheance);
            return echeance < today;
        },

        getDelaiClass(dateEcheance) {
            if (!dateEcheance) return '';
            const today = new Date();
            const echeance = new Date(dateEcheance);
            const diffDays = Math.ceil((echeance - today) / (1000 * 60 * 60 * 24));

            if (diffDays < 0) return 'text-danger fw-bold';
            if (diffDays <= 3) return 'text-warning fw-bold';
            return 'text-muted';
        },

        getTypeColor(type) {
            const colors = {
                'ACTE': 'primary',
                'CONSEIL': 'warning',
                'DOCUMENT': 'info',
                'INFORMATION': 'secondary',
                'RDV': 'success'
            };
            return colors[type] || 'secondary';
        },

        getPrioriteBadgeClass(priorite) {
            const classes = {
                'URGENTE': 'bg-danger',
                'HAUTE': 'bg-warning',
                'NORMALE': 'bg-info',
                'BASSE': 'bg-secondary'
            };
            return classes[priorite] || 'bg-secondary';
        },

        getPrioriteIcon(priorite) {
            const icons = {
                'URGENTE': 'bi-exclamation-triangle-fill',
                'HAUTE': 'bi-exclamation-circle-fill',
                'NORMALE': 'bi-info-circle-fill',
                'BASSE': 'bi-dash-circle-fill'
            };
            return icons[priorite] || 'bi-info-circle';
        },

        getRowClass(demande) {
            if (this.isEnRetard(demande.dateEcheance)) {
                return 'table-danger';
            }
            if (demande.priorite === 'URGENTE') {
                return 'table-warning';
            }
            return '';
        },

        getInitiales(nom) {
            if (!nom) return '?';
            const parts = nom.split(' ');
            if (parts.length >= 2) {
                return parts[0][0] + parts[1][0];
            }
            return nom.substring(0, 2).toUpperCase();
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
        if (this.charts.priorite) {
            this.charts.priorite.destroy();
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

.avatar-sm {
    font-size: 11px;
    font-weight: 600;
}

.list-group-item {
    border-radius: 6px;
    margin-bottom: 8px;
}

.list-group-item:hover {
    background-color: #f8f9fa;
}

canvas {
    max-height: 300px;
}

/* Checkbox styling */
.form-check-input {
    cursor: pointer;
}

.form-check-input:checked {
    background-color: #0d6efd;
    border-color: #0d6efd;
}

/* Table row selection */
tr.selected {
    background-color: rgba(13, 110, 253, 0.1);
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
