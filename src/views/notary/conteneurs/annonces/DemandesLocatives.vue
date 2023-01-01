<template>
    <main>
        <section class="pt-0">
            <div class="container vstack gap-4">
                <!-- Title -->
                <div class="row">
                    <div class="col-12">
                        <h1 class="fs-4 mb-0">
                            <i class="bi bi-file-earmark-person fa-fw me-1"></i>Gestion des Demandes Locatives
                        </h1>
                        <p class="text-muted mb-0">Traitement des candidatures de location</p>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="row g-4">
                    <!-- Nouvelles Demandes -->
                    <div class="col-md-6 col-xl-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">Nouvelles</h6>
                                    <h2 class="mb-0 text-primary">{{ stats.nouvelles }}</h2>
                                    <p class="mb-0 small text-muted mt-2">
                                        <i class="bi bi-inbox me-1"></i>À traiter
                                    </p>
                                </div>
                                <div class="bg-primary bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-envelope fs-4 text-primary"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- En Cours -->
                    <div class="col-md-6 col-xl-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">En Cours</h6>
                                    <h2 class="mb-0 text-warning">{{ stats.enCours }}</h2>
                                    <p class="mb-0 small text-muted mt-2">
                                        <i class="bi bi-hourglass-split me-1"></i>En traitement
                                    </p>
                                </div>
                                <div class="bg-warning bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-clock-history fs-4 text-warning"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Approuvées -->
                    <div class="col-md-6 col-xl-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">Approuvées</h6>
                                    <h2 class="mb-0 text-success">{{ stats.approuvees }}</h2>
                                    <p class="mb-0 small text-muted mt-2">
                                        <i class="bi bi-check-circle me-1"></i>Ce mois
                                    </p>
                                </div>
                                <div class="bg-success bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-check-circle fs-4 text-success"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Rejetées -->
                    <div class="col-md-6 col-xl-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">Rejetées</h6>
                                    <h2 class="mb-0 text-danger">{{ stats.rejetees }}</h2>
                                    <p class="mb-0 small text-muted mt-2">
                                        <i class="bi bi-x-circle me-1"></i>Ce mois
                                    </p>
                                </div>
                                <div class="bg-danger bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-x-circle fs-4 text-danger"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filters and Actions -->
                <div class="row">
                    <div class="col-12">
                        <div class="card border">
                            <div class="card-body">
                                <div class="row g-3 mb-3">
                                    <!-- Recherche -->
                                    <div class="col-md-4">
                                        <div class="input-group">
                                            <span class="input-group-text">
                                                <i class="bi bi-search"></i>
                                            </span>
                                            <input type="text" class="form-control"
                                                placeholder="Rechercher par nom, email, téléphone..."
                                                v-model="searchQuery" @input="filterDemandes">
                                        </div>
                                    </div>

                                    <!-- Filtre Statut -->
                                    <div class="col-md-2">
                                        <select v-model="filters.statut" @change="filterDemandes" class="form-select">
                                            <option value="">Tous les statuts</option>
                                            <option value="NOUVELLE">Nouvelle</option>
                                            <option value="EN_COURS">En cours</option>
                                            <option value="APPROUVEE">Approuvée</option>
                                            <option value="REJETEE">Rejetée</option>
                                            <option value="ANNULEE">Annulée</option>
                                        </select>
                                    </div>

                                    <!-- Filtre Propriété -->
                                    <div class="col-md-3">
                                        <select v-model="filters.propriete" @change="filterDemandes"
                                            class="form-select">
                                            <option value="">Toutes les propriétés</option>
                                            <option v-for="bien in availableBiens" :key="bien.id" :value="bien.id">
                                                {{ bien.nom }}
                                            </option>
                                        </select>
                                    </div>

                                    <!-- Filtre Priorité -->
                                    <div class="col-md-2">
                                        <select v-model="filters.priorite" @change="filterDemandes" class="form-select">
                                            <option value="">Toutes priorités</option>
                                            <option value="HAUTE">Haute</option>
                                            <option value="MOYENNE">Moyenne</option>
                                            <option value="BASSE">Basse</option>
                                        </select>
                                    </div>

                                    <!-- Tri -->
                                    <div class="col-md-1">
                                        <button class="btn btn-outline-secondary w-100" @click="toggleSort">
                                            <i class="bi" :class="sortAsc ? 'bi-sort-down' : 'bi-sort-up'"></i>
                                        </button>
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="d-flex gap-2 flex-wrap">
                                    <button class="btn btn-primary" @click="showCreateModal = true">
                                        <i class="bi bi-plus-circle me-1"></i>Nouvelle demande
                                    </button>
                                    <button class="btn btn-outline-success" @click="traiterGroupees">
                                        <i class="bi bi-check-all me-1"></i>Traiter sélection
                                    </button>
                                    <button class="btn btn-outline-info" @click="exportDemandes">
                                        <i class="bi bi-download me-1"></i>Exporter
                                    </button>
                                    <button class="btn btn-outline-secondary" @click="resetFilters">
                                        <i class="bi bi-arrow-counterclockwise me-1"></i>Réinitialiser
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Stats Bar -->
                <div class="row">
                    <div class="col-12">
                        <div class="card border bg-light">
                            <div class="card-body py-2">
                                <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                    <div class="d-flex gap-4">
                                        <small class="text-muted">
                                            <strong>{{ filteredDemandes.length }}</strong> demandes trouvées
                                        </small>
                                        <small class="text-muted">
                                            <strong>{{ selectedDemandes.length }}</strong> sélectionnées
                                        </small>
                                    </div>
                                    <div class="d-flex gap-3">
                                        <small class="text-primary">
                                            <i class="bi bi-clock-history me-1"></i>
                                            Temps moyen de traitement: <strong>2.5 jours</strong>
                                        </small>
                                        <small class="text-success">
                                            <i class="bi bi-percent me-1"></i>
                                            Taux d'approbation: <strong>65%</strong>
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Demandes List -->
                <div class="row">
                    <div class="col-12">
                        <div class="card border">
                            <div class="card-header border-bottom">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h5 class="card-header-title mb-0">
                                        Liste des Demandes
                                    </h5>
                                    <div class="btn-group btn-group-sm" role="group">
                                        <button type="button" class="btn"
                                            :class="viewMode === 'cards' ? 'btn-primary' : 'btn-outline-primary'"
                                            @click="viewMode = 'cards'">
                                            <i class="bi bi-grid"></i>
                                        </button>
                                        <button type="button" class="btn"
                                            :class="viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'"
                                            @click="viewMode = 'list'">
                                            <i class="bi bi-list-ul"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Cards View -->
                            <div v-if="viewMode === 'cards'" class="card-body">
                                <div v-if="loading" class="text-center py-5">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Chargement...</span>
                                    </div>
                                </div>
                                <div v-else-if="paginatedDemandes.length === 0" class="text-center py-5">
                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                    <p class="text-muted mb-0">Aucune demande trouvée</p>
                                </div>
                                <div v-else class="row g-3">
                                    <div v-for="demande in paginatedDemandes" :key="demande.id"
                                        class="col-md-6 col-lg-4">
                                        <div class="card border h-100 demande-card"
                                            :class="{ 'border-primary': isSelected(demande.id), 'border-warning': demande.priorite === 'HAUTE' }">
                                            <div class="card-body">
                                                <!-- Header -->
                                                <div class="d-flex justify-content-between align-items-start mb-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox"
                                                            :id="'check-' + demande.id"
                                                            :checked="isSelected(demande.id)"
                                                            @change="toggleSelection(demande.id)">
                                                        <label class="form-check-label" :for="'check-' + demande.id">
                                                            <small class="text-muted">#{{ demande.id }}</small>
                                                        </label>
                                                    </div>
                                                    <div class="d-flex gap-1">
                                                        <span class="badge"
                                                            :class="getStatutBadgeClass(demande.statut)">
                                                            {{ getStatutLabel(demande.statut) }}
                                                        </span>
                                                        <span v-if="demande.priorite === 'HAUTE'"
                                                            class="badge bg-warning">
                                                            <i class="bi bi-exclamation-triangle"></i>
                                                        </span>
                                                    </div>
                                                </div>

                                                <!-- Candidat Info -->
                                                <div class="mb-3">
                                                    <h6 class="mb-1">
                                                        <i class="bi bi-person-circle me-1"></i>{{ demande.candidatNom
                                                        }}
                                                    </h6>
                                                    <small class="text-muted d-block">
                                                        <i class="bi bi-telephone me-1"></i>{{ demande.candidatTel }}
                                                    </small>
                                                    <small class="text-muted d-block">
                                                        <i class="bi bi-envelope me-1"></i>{{ demande.candidatEmail }}
                                                    </small>
                                                </div>

                                                <!-- Propriété Info -->
                                                <div class="mb-3 p-2 bg-light rounded">
                                                    <small class="text-muted d-block mb-1">Propriété souhaitée</small>
                                                    <strong class="d-block">{{ demande.bienNom }}</strong>
                                                    <small class="text-muted">{{ demande.bienAdresse }}</small>
                                                </div>

                                                <!-- Details -->
                                                <div class="row g-2 mb-3">
                                                    <div class="col-6">
                                                        <small class="text-muted d-block">Budget</small>
                                                        <strong class="text-success">{{ formatCurrency(demande.budget)
                                                        }}</strong>
                                                    </div>
                                                    <div class="col-6">
                                                        <small class="text-muted d-block">Date souhaitée</small>
                                                        <strong>{{ formatDate(demande.dateEntree) }}</strong>
                                                    </div>
                                                </div>

                                                <!-- Score -->
                                                <div v-if="demande.score" class="mb-3">
                                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                                        <small class="text-muted">Score de candidature</small>
                                                        <span class="badge" :class="getScoreBadgeClass(demande.score)">
                                                            {{ demande.score }}/100
                                                        </span>
                                                    </div>
                                                    <div class="progress" style="height: 6px;">
                                                        <div class="progress-bar"
                                                            :class="getScoreProgressClass(demande.score)"
                                                            :style="{ width: demande.score + '%' }"></div>
                                                    </div>
                                                </div>

                                                <!-- Date -->
                                                <small class="text-muted d-block mb-3">
                                                    <i class="bi bi-calendar-event me-1"></i>
                                                    Reçue le {{ formatDateTime(demande.dateCreation) }}
                                                </small>

                                                <!-- Actions -->
                                                <div class="d-flex gap-2">
                                                    <button class="btn btn-sm btn-outline-primary flex-fill"
                                                        @click="viewDemande(demande)">
                                                        <i class="bi bi-eye me-1"></i>Voir
                                                    </button>
                                                    <div class="dropdown">
                                                        <button class="btn btn-sm btn-outline-secondary" type="button"
                                                            :id="'dropdown-' + demande.id" data-bs-toggle="dropdown">
                                                            <i class="bi bi-three-dots-vertical"></i>
                                                        </button>
                                                        <ul class="dropdown-menu dropdown-menu-end">
                                                            <li
                                                                v-if="demande.statut === 'NOUVELLE' || demande.statut === 'EN_COURS'">
                                                                <a class="dropdown-item text-success" href="#"
                                                                    @click.prevent="approuverDemande(demande.id)">
                                                                    <i class="bi bi-check-circle me-2"></i>Approuver
                                                                </a>
                                                            </li>
                                                            <li
                                                                v-if="demande.statut === 'NOUVELLE' || demande.statut === 'EN_COURS'">
                                                                <a class="dropdown-item text-danger" href="#"
                                                                    @click.prevent="rejeterDemande(demande.id)">
                                                                    <i class="bi bi-x-circle me-2"></i>Rejeter
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <hr class="dropdown-divider">
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="editDemande(demande)">
                                                                    <i class="bi bi-pencil me-2"></i>Modifier
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="contactCandidat(demande)">
                                                                    <i class="bi bi-chat-dots me-2"></i>Contacter
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- List View -->
                            <div v-if="viewMode === 'list'" class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover align-middle mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th class="px-4" style="width: 50px;">
                                                    <input type="checkbox" class="form-check-input"
                                                        @change="toggleSelectAll" :checked="allSelected">
                                                </th>
                                                <th>ID</th>
                                                <th>Candidat</th>
                                                <th>Propriété</th>
                                                <th>Budget</th>
                                                <th>Date entrée</th>
                                                <th>Score</th>
                                                <th>Statut</th>
                                                <th class="text-end px-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="loading">
                                                <td colspan="9" class="text-center py-5">
                                                    <div class="spinner-border text-primary" role="status">
                                                        <span class="visually-hidden">Chargement...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr v-else-if="paginatedDemandes.length === 0">
                                                <td colspan="9" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucune demande trouvée</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="demande in paginatedDemandes" :key="demande.id"
                                                :class="{ 'table-warning': demande.priorite === 'HAUTE' }">
                                                <td class="px-4">
                                                    <input type="checkbox" class="form-check-input"
                                                        :checked="isSelected(demande.id)"
                                                        @change="toggleSelection(demande.id)">
                                                </td>
                                                <td>
                                                    <strong class="text-primary">#{{ demande.id }}</strong>
                                                    <span v-if="demande.priorite === 'HAUTE'" class="ms-1">
                                                        <i class="bi bi-exclamation-triangle text-warning"></i>
                                                    </span>
                                                </td>
                                                <td>
                                                    <div>
                                                        <strong>{{ demande.candidatNom }}</strong>
                                                        <small class="text-muted d-block">
                                                            <i class="bi bi-telephone me-1"></i>{{ demande.candidatTel
                                                            }}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        {{ demande.bienNom }}
                                                        <small class="text-muted d-block">{{ demande.bienAdresse
                                                        }}</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <strong class="text-success">{{ formatCurrency(demande.budget)
                                                    }}</strong>
                                                </td>
                                                <td>{{ formatDate(demande.dateEntree) }}</td>
                                                <td>
                                                    <span v-if="demande.score" class="badge"
                                                        :class="getScoreBadgeClass(demande.score)">
                                                        {{ demande.score }}/100
                                                    </span>
                                                    <span v-else class="text-muted">—</span>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getStatutBadgeClass(demande.statut)">
                                                        <i class="bi" :class="getStatutIcon(demande.statut)"></i>
                                                        {{ getStatutLabel(demande.statut) }}
                                                    </span>
                                                </td>
                                                <td class="text-end px-4">
                                                    <div class="dropdown">
                                                        <button class="btn btn-sm btn-light" type="button"
                                                            :id="'dropdown-list-' + demande.id"
                                                            data-bs-toggle="dropdown">
                                                            <i class="bi bi-three-dots-vertical"></i>
                                                        </button>
                                                        <ul class="dropdown-menu dropdown-menu-end">
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="viewDemande(demande)">
                                                                    <i class="bi bi-eye me-2"></i>Voir détails
                                                                </a>
                                                            </li>
                                                            <li
                                                                v-if="demande.statut === 'NOUVELLE' || demande.statut === 'EN_COURS'">
                                                                <a class="dropdown-item text-success" href="#"
                                                                    @click.prevent="approuverDemande(demande.id)">
                                                                    <i class="bi bi-check-circle me-2"></i>Approuver
                                                                </a>
                                                            </li>
                                                            <li
                                                                v-if="demande.statut === 'NOUVELLE' || demande.statut === 'EN_COURS'">
                                                                <a class="dropdown-item text-danger" href="#"
                                                                    @click.prevent="rejeterDemande(demande.id)">
                                                                    <i class="bi bi-x-circle me-2"></i>Rejeter
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <hr class="dropdown-divider">
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="editDemande(demande)">
                                                                    <i class="bi bi-pencil me-2"></i>Modifier
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="contactCandidat(demande)">
                                                                    <i class="bi bi-chat-dots me-2"></i>Contacter
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
                                <div v-if="filteredDemandes.length > perPage" class="card-footer border-top">
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
        </section>

        <!-- Modal Détails Demande -->
        <div v-if="selectedDemande" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Demande #{{ selectedDemande.id }}
                            <span class="badge ms-2" :class="getStatutBadgeClass(selectedDemande.statut)">
                                {{ getStatutLabel(selectedDemande.statut) }}
                            </span>
                            <span v-if="selectedDemande.priorite === 'HAUTE'" class="badge bg-warning ms-1">
                                Priorité haute
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedDemande = null"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-4">
                            <!-- Informations Candidat -->
                            <div class="col-md-6">
                                <div class="card bg-light border-0 h-100">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-person-circle me-2"></i>Informations du Candidat
                                        </h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Nom complet</label>
                                            <p class="mb-0 fw-bold">{{ selectedDemande.candidatNom }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Téléphone</label>
                                            <p class="mb-0">
                                                <i class="bi bi-telephone me-1"></i>{{ selectedDemande.candidatTel }}
                                                <button class="btn btn-sm btn-outline-primary ms-2"
                                                    @click="callCandidat(selectedDemande.candidatTel)">
                                                    <i class="bi bi-telephone-outbound"></i>
                                                </button>
                                            </p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Email</label>
                                            <p class="mb-0">
                                                <i class="bi bi-envelope me-1"></i>{{ selectedDemande.candidatEmail }}
                                                <button class="btn btn-sm btn-outline-primary ms-2"
                                                    @click="emailCandidat(selectedDemande.candidatEmail)">
                                                    <i class="bi bi-envelope-at"></i>
                                                </button>
                                            </p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Profession</label>
                                            <p class="mb-0">{{ selectedDemande.profession || '—' }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Employeur</label>
                                            <p class="mb-0">{{ selectedDemande.employeur || '—' }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Informations Propriété -->
                            <div class="col-md-6">
                                <div class="card bg-light border-0 h-100">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-building me-2"></i>Propriété Demandée
                                        </h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Nom</label>
                                            <p class="mb-0 fw-bold">{{ selectedDemande.bienNom }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Adresse</label>
                                            <p class="mb-0">
                                                <i class="bi bi-geo-alt me-1"></i>{{ selectedDemande.bienAdresse }}
                                            </p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Loyer</label>
                                            <p class="mb-0 fw-bold text-success fs-5">{{
                                                formatCurrency(selectedDemande.loyerBien) }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Budget du candidat</label>
                                            <p class="mb-0 fw-bold"
                                                :class="selectedDemande.budget >= selectedDemande.loyerBien ? 'text-success' : 'text-danger'">
                                                {{ formatCurrency(selectedDemande.budget) }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Détails de la Demande -->
                            <div class="col-12">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-file-text me-2"></i>Détails de la Demande
                                        </h6>
                                        <div class="row g-3">
                                            <div class="col-md-3">
                                                <label class="text-muted small">Durée souhaitée</label>
                                                <p class="mb-0">{{ selectedDemande.duree || '—' }}</p>
                                            </div>
                                            <div class="col-md-3">
                                                <label class="text-muted small">Nombre d'occupants</label>
                                                <p class="mb-0">{{ selectedDemande.nombreOccupants || '—' }}</p>
                                            </div>
                                            <div class="col-md-3">
                                                <label class="text-muted small">Date de création</label>
                                                <p class="mb-0">{{ formatDateTime(selectedDemande.dateCreation) }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Score et Évaluation -->
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-star me-2"></i>Score de Candidature
                                        </h6>
                                        <div class="mb-3">
                                            <div class="d-flex justify-content-between align-items-center mb-2">
                                                <span>Score global</span>
                                                <span class="badge fs-6"
                                                    :class="getScoreBadgeClass(selectedDemande.score)">
                                                    {{ selectedDemande.score }}/100
                                                </span>
                                            </div>
                                            <div class="progress mb-3" style="height: 20px;">
                                                <div class="progress-bar"
                                                    :class="getScoreProgressClass(selectedDemande.score)"
                                                    :style="{ width: selectedDemande.score + '%' }">
                                                    {{ selectedDemande.score }}%
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row g-2">
                                            <div class="col-6">
                                                <small class="text-muted d-block">Solvabilité</small>
                                                <div class="progress" style="height: 8px;">
                                                    <div class="progress-bar bg-success" style="width: 85%"></div>
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <small class="text-muted d-block">Dossier</small>
                                                <div class="progress" style="height: 8px;">
                                                    <div class="progress-bar bg-info" style="width: 70%"></div>
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <small class="text-muted d-block">Références</small>
                                                <div class="progress" style="height: 8px;">
                                                    <div class="progress-bar bg-warning" style="width: 60%"></div>
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <small class="text-muted d-block">Historique</small>
                                                <div class="progress" style="height: 8px;">
                                                    <div class="progress-bar bg-primary" style="width: 90%"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Documents -->
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-file-earmark-text me-2"></i>Documents Fournis
                                        </h6>
                                        <div class="list-group list-group-flush">
                                            <div
                                                class="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
                                                <div>
                                                    <i class="bi bi-file-earmark-person me-2 text-primary"></i>
                                                    <span>Pièce d'identité</span>
                                                </div>
                                                <span class="badge bg-success">
                                                    <i class="bi bi-check-circle"></i>
                                                </span>
                                            </div>
                                            <div
                                                class="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
                                                <div>
                                                    <i class="bi bi-file-earmark-bar-graph me-2 text-primary"></i>
                                                    <span>Bulletins de salaire</span>
                                                </div>
                                                <span class="badge bg-success">
                                                    <i class="bi bi-check-circle"></i>
                                                </span>
                                            </div>
                                            <div
                                                class="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
                                                <div>
                                                    <i class="bi bi-file-earmark-check me-2 text-primary"></i>
                                                    <span>Contrat de travail</span>
                                                </div>
                                                <span class="badge bg-success">
                                                    <i class="bi bi-check-circle"></i>
                                                </span>
                                            </div>
                                            <div
                                                class="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
                                                <div>
                                                    <i class="bi bi-file-earmark-text me-2 text-muted"></i>
                                                    <span>Attestation d'hébergement</span>
                                                </div>
                                                <span class="badge bg-warning">
                                                    <i class="bi bi-clock"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Notes et Commentaires -->
                            <div class="col-12">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-chat-left-text me-2"></i>Notes et Commentaires
                                        </h6>
                                        <textarea class="form-control" rows="4" v-model="selectedDemande.notes"
                                            placeholder="Ajoutez des notes sur cette candidature..."></textarea>
                                    </div>
                                </div>
                            </div>

                            <!-- Historique -->
                            <div class="col-12">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-clock-history me-2"></i>Historique
                                        </h6>
                                        <div class="timeline-simple">
                                            <div class="timeline-item-simple">
                                                <span class="badge bg-primary">{{
                                                    formatDate(selectedDemande.dateCreation) }}</span>
                                                <span class="ms-2">Demande reçue</span>
                                            </div>
                                            <div v-if="selectedDemande.statut !== 'NOUVELLE'"
                                                class="timeline-item-simple">
                                                <span class="badge bg-warning">{{ formatDate(new Date()) }}</span>
                                                <span class="ms-2">Mise en cours de traitement</span>
                                            </div>
                                            <div v-if="selectedDemande.statut === 'APPROUVEE'"
                                                class="timeline-item-simple">
                                                <span class="badge bg-success">{{ formatDate(new Date()) }}</span>
                                                <span class="ms-2">Demande approuvée</span>
                                            </div>
                                            <div v-if="selectedDemande.statut === 'REJETEE'"
                                                class="timeline-item-simple">
                                                <span class="badge bg-danger">{{ formatDate(new Date()) }}</span>
                                                <span class="ms-2">Demande rejetée</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="selectedDemande = null">
                            Fermer
                        </button>
                        <button type="button" class="btn btn-info" @click="contactCandidat(selectedDemande)">
                            <i class="bi bi-chat-dots me-1"></i>Contacter
                        </button>
                        <button v-if="selectedDemande.statut === 'NOUVELLE' || selectedDemande.statut === 'EN_COURS'"
                            type="button" class="btn btn-danger" @click="rejeterDemande(selectedDemande.id)">
                            <i class="bi bi-x-circle me-1"></i>Rejeter
                        </button>
                        <button v-if="selectedDemande.statut === 'NOUVELLE' || selectedDemande.statut === 'EN_COURS'"
                            type="button" class="btn btn-success" @click="approuverDemande(selectedDemande.id)">
                            <i class="bi bi-check-circle me-1"></i>Approuver
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Création/Modification Demande -->
        <div v-if="showCreateModal || showEditModal" class="modal fade show d-block"
            style="background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ showEditModal ? 'Modifier la demande' : 'Nouvelle demande' }}
                        </h5>
                        <button type="button" class="btn-close" @click="closeModals"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveDemande">
                            <div class="row g-3">
                                <!-- Informations Candidat -->
                                <div class="col-12">
                                    <h6 class="border-bottom pb-2 mb-3">Informations du Candidat</h6>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Nom complet <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" v-model="formDemande.candidatNom" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Téléphone <span class="text-danger">*</span></label>
                                    <input type="tel" class="form-control" v-model="formDemande.candidatTel"
                                        placeholder="+225 XX XX XX XX XX" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Email <span class="text-danger">*</span></label>
                                    <input type="email" class="form-control" v-model="formDemande.candidatEmail"
                                        required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Profession</label>
                                    <input type="text" class="form-control" v-model="formDemande.profession">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Employeur</label>
                                    <input type="text" class="form-control" v-model="formDemande.employeur">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Revenu mensuel</label>
                                    <input type="number" class="form-control" v-model.number="formDemande.revenuMensuel"
                                        placeholder="0">
                                </div>

                                <!-- Informations Propriété -->
                                <div class="col-12">
                                    <h6 class="border-bottom pb-2 mb-3 mt-3">Propriété Souhaitée</h6>
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label">Propriété <span class="text-danger">*</span></label>
                                    <select v-model="formDemande.bienId" class="form-select" required>
                                        <option value="">Sélectionner une propriété</option>
                                        <option v-for="bien in availableBiens" :key="bien.id" :value="bien.id">
                                            {{ bien.nom }} - {{ formatCurrency(bien.prix) }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Budget maximum <span class="text-danger">*</span></label>
                                    <input type="number" class="form-control" v-model.number="formDemande.budget"
                                        placeholder="0" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Date d'entrée souhaitée <span
                                            class="text-danger">*</span></label>
                                    <input type="date" class="form-control" v-model="formDemande.dateEntree"
                                        :min="today" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Durée de location</label>
                                    <select v-model="formDemande.duree" class="form-select">
                                        <option value="6 mois">6 mois</option>
                                        <option value="1 an">1 an</option>
                                        <option value="2 ans">2 ans</option>
                                        <option value="3 ans">3 ans</option>
                                        <option value="Plus de 3 ans">Plus de 3 ans</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Nombre d'occupants</label>
                                    <input type="number" class="form-control"
                                        v-model.number="formDemande.nombreOccupants" min="1" placeholder="1">
                                </div>

                                <!-- Priorité et Statut -->
                                <div class="col-12">
                                    <h6 class="border-bottom pb-2 mb-3 mt-3">Paramètres</h6>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Statut</label>
                                    <select v-model="formDemande.statut" class="form-select">
                                        <option value="NOUVELLE">Nouvelle</option>
                                        <option value="EN_COURS">En cours</option>
                                        <option value="APPROUVEE">Approuvée</option>
                                        <option value="REJETEE">Rejetée</option>
                                        <option value="ANNULEE">Annulée</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Priorité</label>
                                    <select v-model="formDemande.priorite" class="form-select">
                                        <option value="BASSE">Basse</option>
                                        <option value="MOYENNE">Moyenne</option>
                                        <option value="HAUTE">Haute</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label class="form-label">Notes</label>
                                    <textarea class="form-control" rows="3" v-model="formDemande.notes"
                                        placeholder="Ajoutez des notes..."></textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeModals">
                            Annuler
                        </button>
                        <button type="button" class="btn btn-primary" @click="saveDemande">
                            <i class="bi bi-check-circle me-1"></i>
                            {{ showEditModal ? 'Mettre à jour' : 'Créer' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Contact Candidat -->
        <div v-if="showContactModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="bi bi-chat-dots me-2"></i>Contacter {{ contactDemande.candidatNom }}
                        </h5>
                        <button type="button" class="btn-close" @click="showContactModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Objet</label>
                            <input type="text" class="form-control" v-model="contactForm.objet"
                                placeholder="Objet du message">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Message</label>
                            <textarea class="form-control" rows="5" v-model="contactForm.message"
                                placeholder="Votre message..."></textarea>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" v-model="contactForm.envoyerCopie"
                                id="envoyerCopie">
                            <label class="form-check-label" for="envoyerCopie">
                                M'envoyer une copie
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showContactModal = false">
                            Annuler
                        </button>
                        <button type="button" class="btn btn-primary" @click="envoyerMessage">
                            <i class="bi bi-send me-1"></i>Envoyer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { mapActions } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
    name: 'GestionDemandesLocatives',

    data() {
        return {
            loading: true,
            viewMode: 'cards',
            searchQuery: '',
            currentPage: 1,
            perPage: 12,
            sortAsc: false,

            demandes: [],
            availableBiens: [],
            selectedDemandes: [],

            filters: {
                statut: '',
                propriete: '',
                priorite: ''
            },

            stats: {
                nouvelles: 0,
                enCours: 0,
                approuvees: 0,
                rejetees: 0
            },

            selectedDemande: null,
            showCreateModal: false,
            showEditModal: false,
            showContactModal: false,
            contactDemande: null,

            formDemande: {
                id: null,
                candidatNom: '',
                candidatTel: '',
                candidatEmail: '',
                profession: '',
                employeur: '',
                revenuMensuel: 0,
                bienId: '',
                budget: 0,
                dateEntree: '',
                duree: '1 an',
                nombreOccupants: 1,
                statut: 'NOUVELLE',
                priorite: 'MOYENNE',
                notes: ''
            },

            contactForm: {
                objet: '',
                message: '',
                envoyerCopie: false
            }
        };
    },

    computed: {
        today() {
            return new Date().toISOString().split('T')[0];
        },

        filteredDemandes() {
            let result = this.demandes;

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(d =>
                    d.candidatNom?.toLowerCase().includes(query) ||
                    d.candidatEmail?.toLowerCase().includes(query) ||
                    d.candidatTel?.includes(query) ||
                    d.bienNom?.toLowerCase().includes(query)
                );
            }

            if (this.filters.statut) {
                result = result.filter(d => d.statut === this.filters.statut);
            }

            if (this.filters.propriete) {
                result = result.filter(d => d.bienId === this.filters.propriete);
            }

            if (this.filters.priorite) {
                result = result.filter(d => d.priorite === this.filters.priorite);
            }

            return result.sort((a, b) => {
                const dateA = new Date(a.dateCreation);
                const dateB = new Date(b.dateCreation);
                return this.sortAsc ? dateA - dateB : dateB - dateA;
            });
        },

        paginatedDemandes() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredDemandes.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.filteredDemandes.length / this.perPage);
        },

        allSelected() {
            return this.paginatedDemandes.length > 0 &&
                this.paginatedDemandes.every(d => this.isSelected(d.id));
        }
    },

    async mounted() {
        await this.loadData();
    },

    methods: {
        ...mapActions({
            getDisponibles: 'biensImmobiliers/getDisponibles'
        }),

        async loadData() {
            try {
                this.loading = true;

                const biensData = await this.getDisponibles();
                this.availableBiens = biensData;

                this.demandes = this.generateDemoDemandes();
                this.calculateStats();

            } catch (error) {
                console.error('Erreur chargement:', error);
                ElMessage.error('Erreur lors du chargement des demandes');
            } finally {
                this.loading = false;
            }
        },

        generateDemoDemandes() {
            const statuts = ['NOUVELLE', 'EN_COURS', 'APPROUVEE', 'REJETEE'];
            const priorites = ['HAUTE', 'MOYENNE', 'BASSE'];
            const noms = ['Alice Kouadio', 'Bob Traoré', 'Claire N\'Guessan', 'David Koné', 'Emma Bamba'];
            const professions = ['Ingénieur', 'Médecin', 'Enseignant', 'Commercial', 'Comptable'];

            const demandes = [];
            for (let i = 0; i < 50; i++) {
                const bienIndex = Math.floor(Math.random() * Math.min(5, this.availableBiens.length));
                const bien = this.availableBiens[bienIndex] || {
                    id: 1,
                    nom: 'Villa Moderne',
                    adresse: 'Cocody, Abidjan',
                    prix: 450000
                };

                const dateOffset = Math.floor(Math.random() * 30);
                const dateCreation = new Date();
                dateCreation.setDate(dateCreation.getDate() - dateOffset);

                demandes.push({
                    id: i + 1,
                    candidatNom: noms[Math.floor(Math.random() * noms.length)],
                    candidatTel: `+225 0${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`,
                    candidatEmail: `candidat${i}@email.com`,
                    profession: professions[Math.floor(Math.random() * professions.length)],
                    employeur: `Entreprise ${i + 1}`,
                    revenuMensuel: (Math.floor(Math.random() * 10) + 5) * 100000,
                    bienId: bien.id,
                    bienNom: bien.nom,
                    bienAdresse: bien.adresse,
                    loyerBien: bien.prix,
                    budget: bien.prix + (Math.floor(Math.random() * 3) - 1) * 50000,
                    dateEntree: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    duree: ['6 mois', '1 an', '2 ans'][Math.floor(Math.random() * 3)],
                    nombreOccupants: Math.floor(Math.random() * 4) + 1,
                    statut: statuts[Math.floor(Math.random() * statuts.length)],
                    priorite: priorites[Math.floor(Math.random() * priorites.length)],
                    score: Math.floor(Math.random() * 40) + 60,
                    dateCreation: dateCreation.toISOString(),
                    notes: ''
                });
            }

            return demandes;
        },

        calculateStats() {
            this.stats.nouvelles = this.demandes.filter(d => d.statut === 'NOUVELLE').length;
            this.stats.enCours = this.demandes.filter(d => d.statut === 'EN_COURS').length;

            const thisMonth = new Date();
            thisMonth.setDate(1);

            this.stats.approuvees = this.demandes.filter(d =>
                d.statut === 'APPROUVEE' && new Date(d.dateCreation) >= thisMonth
            ).length;

            this.stats.rejetees = this.demandes.filter(d =>
                d.statut === 'REJETEE' && new Date(d.dateCreation) >= thisMonth
            ).length;
        },

        filterDemandes() {
            this.currentPage = 1;
        },

        resetFilters() {
            this.filters = {
                statut: '',
                propriete: '',
                priorite: ''
            };
            this.searchQuery = '';
            this.currentPage = 1;
        },

        toggleSort() {
            this.sortAsc = !this.sortAsc;
        },

        isSelected(id) {
            return this.selectedDemandes.includes(id);
        },

        toggleSelection(id) {
            const index = this.selectedDemandes.indexOf(id);
            if (index > -1) {
                this.selectedDemandes.splice(index, 1);
            } else {
                this.selectedDemandes.push(id);
            }
        },

        toggleSelectAll() {
            if (this.allSelected) {
                this.paginatedDemandes.forEach(d => {
                    const index = this.selectedDemandes.indexOf(d.id);
                    if (index > -1) this.selectedDemandes.splice(index, 1);
                });
            } else {
                this.paginatedDemandes.forEach(d => {
                    if (!this.isSelected(d.id)) {
                        this.selectedDemandes.push(d.id);
                    }
                });
            }
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'NOUVELLE': 'bg-primary',
                'EN_COURS': 'bg-warning',
                'APPROUVEE': 'bg-success',
                'REJETEE': 'bg-danger',
                'ANNULEE': 'bg-secondary'
            };
            return classes[statut] || 'bg-secondary';
        },

        getStatutIcon(statut) {
            const icons = {
                'NOUVELLE': 'bi-envelope',
                'EN_COURS': 'bi-hourglass-split',
                'APPROUVEE': 'bi-check-circle',
                'REJETEE': 'bi-x-circle',
                'ANNULEE': 'bi-slash-circle'
            };
            return icons[statut] || 'bi-circle';
        },

        getStatutLabel(statut) {
            const labels = {
                'NOUVELLE': 'Nouvelle',
                'EN_COURS': 'En cours',
                'APPROUVEE': 'Approuvée',
                'REJETEE': 'Rejetée',
                'ANNULEE': 'Annulée'
            };
            return labels[statut] || statut;
        },

        getScoreBadgeClass(score) {
            if (score >= 80) return 'bg-success';
            if (score >= 60) return 'bg-warning';
            return 'bg-danger';
        },

        getScoreProgressClass(score) {
            if (score >= 80) return 'bg-success';
            if (score >= 60) return 'bg-warning';
            return 'bg-danger';
        },

        formatCurrency(value) {
            if (!value) return '—';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0
            }).format(value);
        },

        formatDate(date) {
            if (!date) return '—';
            return new Date(date).toLocaleDateString('fr-FR');
        },

        formatDateTime(date) {
            if (!date) return '—';
            return new Date(date).toLocaleString('fr-FR');
        },

        viewDemande(demande) {
            this.selectedDemande = demande;
        },

        editDemande(demande) {
            this.formDemande = { ...demande };
            this.showEditModal = true;
            this.selectedDemande = null;
        },

        closeModals() {
            this.showCreateModal = false;
            this.showEditModal = false;
            this.resetForm();
        },

        resetForm() {
            this.formDemande = {
                id: null,
                candidatNom: '',
                candidatTel: '',
                candidatEmail: '',
                profession: '',
                employeur: '',
                revenuMensuel: 0,
                bienId: '',
                budget: 0,
                dateEntree: '',
                duree: '1 an',
                nombreOccupants: 1,
                statut: 'NOUVELLE',
                priorite: 'MOYENNE',
                notes: ''
            };
        },

        async saveDemande() {
            try {
                if (!this.formDemande.candidatNom || !this.formDemande.candidatTel ||
                    !this.formDemande.candidatEmail || !this.formDemande.bienId ||
                    !this.formDemande.budget || !this.formDemande.dateEntree) {
                    ElMessage.warning('Veuillez remplir tous les champs obligatoires');
                    return;
                }

                const bien = this.availableBiens.find(b => b.id === this.formDemande.bienId);

                if (this.showEditModal) {
                    const index = this.demandes.findIndex(d => d.id === this.formDemande.id);
                    if (index !== -1) {
                        this.demandes[index] = {
                            ...this.formDemande,
                            bienNom: bien?.nom || '',
                            bienAdresse: bien?.adresse || '',
                            loyerBien: bien?.prix || 0
                        };
                    }
                    ElMessage.success('Demande mise à jour avec succès');
                } else {
                    const newDemande = {
                        ...this.formDemande,
                        id: this.demandes.length + 1,
                        bienNom: bien?.nom || '',
                        bienAdresse: bien?.adresse || '',
                        loyerBien: bien?.prix || 0,
                        score: Math.floor(Math.random() * 40) + 60,
                        dateCreation: new Date().toISOString()
                    };
                    this.demandes.unshift(newDemande);
                    ElMessage.success('Demande créée avec succès');
                }

                this.closeModals();
                this.calculateStats();

            } catch (error) {
                console.error('Erreur sauvegarde demande:', error);
                ElMessage.error('Erreur lors de la sauvegarde');
            }
        },

        async approuverDemande(demandeId) {
            try {
                await ElMessageBox.confirm(
                    'Approuver cette demande de location ?',
                    'Confirmation',
                    {
                        confirmButtonText: 'Oui, approuver',
                        cancelButtonText: 'Annuler',
                        type: 'success'
                    }
                );

                const demande = this.demandes.find(d => d.id === demandeId);
                if (demande) {
                    demande.statut = 'APPROUVEE';
                    ElMessage.success('Demande approuvée avec succès');
                    this.calculateStats();
                    this.selectedDemande = null;
                }

            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur approbation:', error);
                }
            }
        },

        async rejeterDemande(demandeId) {
            try {
                const { value: raison } = await ElMessageBox.prompt(
                    'Raison du rejet (optionnel)',
                    'Rejeter la demande',
                    {
                        confirmButtonText: 'Rejeter',
                        cancelButtonText: 'Annuler',
                        inputPlaceholder: 'Ex: Budget insuffisant',
                        inputType: 'textarea'
                    }
                );

                const demande = this.demandes.find(d => d.id === demandeId);
                if (demande) {
                    demande.statut = 'REJETEE';
                    if (raison) {
                        demande.notes = `Rejet: ${raison}`;
                    }
                    ElMessage.success('Demande rejetée');
                    this.calculateStats();
                    this.selectedDemande = null;
                }

            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur rejet:', error);
                }
            }
        },

        contactCandidat(demande) {
            this.contactDemande = demande;
            this.contactForm = {
                objet: `Demande de location - ${demande.bienNom}`,
                message: `Bonjour ${demande.candidatNom},\n\nNous vous contactons concernant votre demande de location pour ${demande.bienNom}.\n\nCordialement,`,
                envoyerCopie: false
            };
            this.showContactModal = true;
            this.selectedDemande = null;
        },

        async envoyerMessage() {
            try {
                if (!this.contactForm.message.trim()) {
                    ElMessage.warning('Veuillez saisir un message');
                    return;
                }

                // Simulation envoi
                ElMessage.success(`Message envoyé à ${this.contactDemande.candidatNom}`);
                this.showContactModal = false;
                this.contactDemande = null;

            } catch (error) {
                console.error('Erreur envoi message:', error);
                ElMessage.error('Erreur lors de l\'envoi du message');
            }
        },

        callCandidat(tel) {
            window.location.href = `tel:${tel}`;
        },

        emailCandidat(email) {
            window.location.href = `mailto:${email}`;
        },

        async traiterGroupees() {
            if (this.selectedDemandes.length === 0) {
                ElMessage.warning('Veuillez sélectionner au moins une demande');
                return;
            }

            try {
                const { value: action } = await ElMessageBox.prompt(
                    `${this.selectedDemandes.length} demande(s) sélectionnée(s)`,
                    'Action groupée',
                    {
                        confirmButtonText: 'Appliquer',
                        cancelButtonText: 'Annuler',
                        inputType: 'select',
                        inputOptions: {
                            'EN_COURS': 'Mettre en cours',
                            'APPROUVEE': 'Approuver',
                            'REJETEE': 'Rejeter'
                        }
                    }
                );

                if (action) {
                    this.selectedDemandes.forEach(id => {
                        const demande = this.demandes.find(d => d.id === id);
                        if (demande) {
                            demande.statut = action;
                        }
                    });

                    ElMessage.success(`${this.selectedDemandes.length} demande(s) traitée(s)`);
                    this.selectedDemandes = [];
                    this.calculateStats();
                }

            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur traitement groupé:', error);
                }
            }
        },

        async exportDemandes() {
            try {
                ElMessage.success('Export en cours...');
                setTimeout(() => {
                    ElMessage.success('Demandes exportées avec succès');
                }, 1000);
            } catch (error) {
                console.error('Erreur export:', error);
                ElMessage.error('Erreur lors de l\'export');
            }
        }
    }
};
</script>

<style scoped>
.modal.show {
    display: block !important;
}

.demande-card {
    transition: all 0.3s ease;
    cursor: pointer;
}

.demande-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.demande-card.border-primary {
    border-width: 2px !important;
}

.demande-card.border-warning {
    border-left-width: 4px !important;
}

.table> :not(caption)>*>* {
    padding: 1rem 0.75rem;
}

.table-warning {
    background-color: #fff3cd;
}

.badge {
    font-weight: 500;
    padding: 0.35em 0.65em;
}

.timeline-simple {
    padding-left: 1rem;
    border-left: 2px solid #dee2e6;
}

.timeline-item-simple {
    padding: 0.5rem 0;
    margin-left: -1rem;
    padding-left: 1.5rem;
    position: relative;
}

.timeline-item-simple::before {
    content: '';
    position: absolute;
    left: -6px;
    top: 50%;
    transform: translateY(-50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #dee2e6;
}

.progress {
    border-radius: 0.5rem;
    overflow: hidden;
}

.progress-bar {
    transition: width 0.6s ease;
}

/* Score indicators */
.bg-score-high {
    background-color: #198754 !important;
}

.bg-score-medium {
    background-color: #ffc107 !important;
}

.bg-score-low {
    background-color: #dc3545 !important;
}

/* Card View Specific */
@media (max-width: 768px) {
    .demande-card {
        margin-bottom: 1rem;
    }
}

/* Hover effects */
.btn-outline-primary:hover,
.btn-outline-secondary:hover,
.btn-outline-success:hover,
.btn-outline-info:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* List group items */
.list-group-item {
    border: none;
    padding: 0.5rem 0;
}

/* Form controls */
.form-control:focus,
.form-select:focus {
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* Input group */
.input-group-text {
    background-color: #f8f9fa;
    border-right: none;
}

.input-group .form-control {
    border-left: none;
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.demande-card {
    animation: fadeIn 0.3s ease-out;
}

/* Scrollbar styling */
.modal-body::-webkit-scrollbar {
    width: 8px;
}

.modal-body::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.modal-body::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>