<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">

            <!-- En-tête -->
            <div class="row">
                <div class="col-sm-12 mb-4">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">
                                <i class="bi bi-file-earmark-text me-2"></i>Actes en Préparation
                            </h1>
                            <p class="text-muted mb-0">Suivi des actes en cours de rédaction et validation</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <button @click="showCreateModal = true" class="btn btn-primary">
                                <i class="bi bi-plus-circle me-1"></i>Nouvel Acte
                            </button>
                            <button @click="rafraichir" class="btn btn-outline-primary">
                                <i class="bi bi-arrow-clockwise"></i>
                            </button>
                            <button @click="exportActes" class="btn btn-success">
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
                                    <span class="text-muted small">En Rédaction</span>
                                    <h3 class="mb-0 mt-2 text-warning">{{ stats.enRedaction }}</h3>
                                    <small class="text-muted">
                                        <i class="bi bi-pencil me-1"></i>En cours
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-warning bg-opacity-10 text-warning">
                                    <i class="bi bi-pencil-square fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">En Relecture</span>
                                    <h3 class="mb-0 mt-2 text-info">{{ stats.enRelecture }}</h3>
                                    <small class="text-muted">
                                        <i class="bi bi-eye me-1"></i>Vérification
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-info bg-opacity-10 text-info">
                                    <i class="bi bi-eye fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">En Attente Signature</span>
                                    <h3 class="mb-0 mt-2 text-primary">{{ stats.attenteSignature }}</h3>
                                    <small class="text-muted">
                                        <i class="bi bi-pen me-1"></i>Prêts
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-primary bg-opacity-10 text-primary">
                                    <i class="bi bi-file-earmark-check fa-fw fs-4"></i>
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
                                        <i class="bi bi-exclamation-triangle me-1"></i>Urgents
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-danger bg-opacity-10 text-danger">
                                    <i class="bi bi-clock-history fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Timeline des Étapes -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Pipeline de Production</h6>
                            </div>
                            <div class="card-body">
                                <div class="pipeline-container">
                                    <div class="pipeline-stage" v-for="(stage, index) in pipelineStages" :key="index">
                                        <div class="stage-header" :class="'bg-' + stage.color">
                                            <i class="bi" :class="stage.icon"></i>
                                            <span class="stage-title">{{ stage.label }}</span>
                                            <span class="stage-count">{{ stage.count }}</span>
                                        </div>
                                        <div class="stage-progress">
                                            <div class="progress" style="height: 8px;">
                                                <div class="progress-bar" :class="'bg-' + stage.color"
                                                    :style="{ width: stage.progress + '%' }"></div>
                                            </div>
                                            <small class="text-muted">{{ stage.progress }}% complété</small>
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
                                                v-model="searchQuery" @input="filterActes">
                                            <i
                                                class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>

                                    <!-- Filtre Étape -->
                                    <div class="col-md-2">
                                        <select v-model="filters.etape" @change="filterActes" class="form-select">
                                            <option value="">Toutes les étapes</option>
                                            <option value="REDACTION">Rédaction</option>
                                            <option value="RELECTURE">Relecture</option>
                                            <option value="CORRECTION">Correction</option>
                                            <option value="VALIDATION">Validation</option>
                                            <option value="ATTENTE_SIGNATURE">Attente signature</option>
                                        </select>
                                    </div>

                                    <!-- Filtre Type -->
                                    <div class="col-md-2">
                                        <select v-model="filters.type" @change="filterActes" class="form-select">
                                            <option value="">Tous les types</option>
                                            <option value="VENTE">Vente</option>
                                            <option value="BAIL">Bail</option>
                                            <option value="DONATION">Donation</option>
                                            <option value="HYPOTHEQUE">Hypothèque</option>
                                        </select>
                                    </div>

                                    <!-- Filtre Priorité -->
                                    <div class="col-md-2">
                                        <select v-model="filters.priorite" @change="filterActes" class="form-select">
                                            <option value="">Toutes priorités</option>
                                            <option value="HAUTE">Haute</option>
                                            <option value="MOYENNE">Moyenne</option>
                                            <option value="BASSE">Basse</option>
                                        </select>
                                    </div>

                                    <!-- Réinitialiser -->
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

                <!-- Vue Kanban / Liste -->
                <div class="row mb-3">
                    <div class="col-12">
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-outline-primary"
                                :class="{ active: viewMode === 'kanban' }" @click="viewMode = 'kanban'">
                                <i class="bi bi-kanban me-1"></i>Kanban
                            </button>
                            <button type="button" class="btn btn-outline-primary"
                                :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">
                                <i class="bi bi-list-ul me-1"></i>Liste
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Vue Kanban -->
                <div v-if="viewMode === 'kanban'" class="row g-3">
                    <div v-for="etape in etapesKanban" :key="etape.id" class="col-lg-3 col-md-6">
                        <div class="card shadow-sm kanban-column">
                            <div class="card-header" :class="'bg-' + etape.color + ' bg-opacity-10'">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h6 class="mb-0" :class="'text-' + etape.color">
                                        <i class="bi" :class="etape.icon + ' me-2'"></i>
                                        {{ etape.label }}
                                    </h6>
                                    <span class="badge" :class="'bg-' + etape.color">
                                        {{ getActesByEtape(etape.id).length }}
                                    </span>
                                </div>
                            </div>
                            <div class="card-body kanban-cards">
                                <div v-for="acte in getActesByEtape(etape.id)" :key="acte.id" class="kanban-card mb-3"
                                    @click="viewActe(acte)">
                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                        <strong class="text-primary">#{{ acte.reference }}</strong>
                                        <span class="badge" :class="getPrioriteBadgeClass(acte.priorite)">
                                            {{ acte.priorite }}
                                        </span>
                                    </div>
                                    <div class="mb-2">
                                        <small class="text-muted d-block">{{ acte.typeLabel }}</small>
                                        <strong>{{ acte.titre }}</strong>
                                    </div>
                                    <div class="mb-2">
                                        <small class="text-muted">
                                            <i class="bi bi-person me-1"></i>{{ acte.redacteur }}
                                        </small>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <small class="text-muted">
                                            <i class="bi bi-calendar me-1"></i>{{ formatDate(acte.dateEcheance) }}
                                        </small>
                                        <div class="progress flex-grow-1 ms-2" style="height: 6px;">
                                            <div class="progress-bar" :class="'bg-' + etape.color"
                                                :style="{ width: acte.progression + '%' }"></div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="getActesByEtape(etape.id).length === 0" class="text-center text-muted py-3">
                                    Aucun acte
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Vue Liste -->
                <div v-if="viewMode === 'list'" class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">
                                    Liste des Actes
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ filteredActes.length }} actes
                                    </span>
                                </h6>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Référence</th>
                                                <th>Type / Titre</th>
                                                <th>Rédacteur</th>
                                                <th>Étape</th>
                                                <th>Priorité</th>
                                                <th>Progression</th>
                                                <th>Échéance</th>
                                                <th class="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="paginatedActes.length === 0">
                                                <td colspan="8" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucun acte trouvé</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="acte in paginatedActes" :key="acte.id"
                                                :class="{ 'table-danger': isEnRetard(acte.dateEcheance) }">
                                                <td>
                                                    <strong class="text-primary">#{{ acte.reference }}</strong>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span class="badge bg-light text-dark">{{ acte.typeLabel
                                                            }}</span>
                                                        <div class="mt-1"><strong>{{ acte.titre }}</strong></div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div
                                                            class="avatar bg-primary bg-opacity-10 rounded-circle me-2 p-2">
                                                            <i class="bi bi-person fs-6 text-primary"></i>
                                                        </div>
                                                        <span>{{ acte.redacteur }}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getEtapeBadgeClass(acte.etape)">
                                                        <i class="bi" :class="getEtapeIcon(acte.etape)"></i>
                                                        {{ getEtapeLabel(acte.etape) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getPrioriteBadgeClass(acte.priorite)">
                                                        {{ acte.priorite }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div class="progress flex-grow-1 me-2"
                                                            style="height: 8px; min-width: 80px;">
                                                            <div class="progress-bar"
                                                                :class="getProgressBarClass(acte.progression)"
                                                                :style="{ width: acte.progression + '%' }"></div>
                                                        </div>
                                                        <small>{{ acte.progression }}%</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div :class="getEcheanceClass(acte.dateEcheance)">
                                                        <i class="bi bi-calendar-event me-1"></i>
                                                        {{ formatDate(acte.dateEcheance) }}
                                                    </div>
                                                    <small v-if="isEnRetard(acte.dateEcheance)"
                                                        class="text-danger d-block">
                                                        <i class="bi bi-exclamation-triangle me-1"></i>
                                                        {{ getJoursRetard(acte.dateEcheance) }} jours de retard
                                                    </small>
                                                </td>
                                                <td class="text-end">
                                                    <div class="dropdown">
                                                        <button class="btn btn-sm btn-light" type="button"
                                                            :id="'dropdown-' + acte.id" data-bs-toggle="dropdown">
                                                            <i class="bi bi-three-dots-vertical"></i>
                                                        </button>
                                                        <ul class="dropdown-menu dropdown-menu-end">
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="viewActe(acte)">
                                                                    <i class="bi bi-eye me-2"></i>Voir détails
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="changerEtape(acte)">
                                                                    <i class="bi bi-arrow-right me-2"></i>Changer étape
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="ajouterCommentaire(acte)">
                                                                    <i class="bi bi-chat-left-text me-2"></i>Commenter
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <hr class="dropdown-divider">
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="editActe(acte)">
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
                                <div v-if="filteredActes.length > perPage" class="card-footer border-top">
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

        <!-- Modal Détails Acte -->
        <div v-if="selectedActe" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Acte #{{ selectedActe.reference }}
                            <span class="badge ms-2" :class="getEtapeBadgeClass(selectedActe.etape)">
                                {{ getEtapeLabel(selectedActe.etape) }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedActe = null"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-4">
                            <!-- Informations Générales -->
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-info-circle me-2"></i>Informations
                                        </h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Type</label>
                                            <p class="mb-0 fw-bold">{{ selectedActe.typeLabel }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Titre</label>
                                            <p class="mb-0">{{ selectedActe.titre }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Rédacteur</label>
                                            <p class="mb-0">{{ selectedActe.redacteur }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Priorité</label>
                                            <p class="mb-0">
                                                <span class="badge"
                                                    :class="getPrioriteBadgeClass(selectedActe.priorite)">
                                                    {{ selectedActe.priorite }}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Progression -->
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-graph-up me-2"></i>Progression
                                        </h6>
                                        <div class="mb-3">
                                            <label class="text-muted small">Avancement</label>
                                            <div class="progress" style="height: 20px;">
                                                <div class="progress-bar"
                                                    :class="getProgressBarClass(selectedActe.progression)"
                                                    :style="{ width: selectedActe.progression + '%' }">
                                                    {{ selectedActe.progression }}%
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Date de création</label>
                                            <p class="mb-0">{{ formatDate(selectedActe.dateCreation) }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Date d'échéance</label>
                                            <p class="mb-0" :class="getEcheanceClass(selectedActe.dateEcheance)">
                                                {{ formatDate(selectedActe.dateEcheance) }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Description -->
                            <div class="col-12" v-if="selectedActe.description">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-file-text me-2"></i>Description
                                        </h6>
                                        <p class="mb-0">{{ selectedActe.description }}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Commentaires -->
                            <div class="col-12"
                                v-if="selectedActe.commentaires && selectedActe.commentaires.length > 0">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-chat-left-text me-2"></i>Commentaires
                                        </h6>
                                        <div v-for="comment in selectedActe.commentaires" :key="comment.id"
                                            class="mb-3">
                                            <div class="d-flex align-items-start">
                                                <div class="avatar bg-primary bg-opacity-10 rounded-circle me-2 p-2">
                                                    <i class="bi bi-person fs-6 text-primary"></i>
                                                </div>
                                                <div class="flex-grow-1">
                                                    <div class="d-flex justify-content-between">
                                                        <strong>{{ comment.auteur }}</strong>
                                                        <small class="text-muted">{{ formatDate(comment.date) }}</small>
                                                    </div>
                                                    <p class="mb-0 mt-1">{{ comment.texte }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="selectedActe = null">
                            Fermer
                        </button>
                        <button type="button" class="btn btn-info" @click="ajouterCommentaire(selectedActe)">
                            <i class="bi bi-chat-left-text me-1"></i>Commenter
                        </button>
                        <button type="button" class="btn btn-primary" @click="changerEtape(selectedActe)">
                            <i class="bi bi-arrow-right me-1"></i>Changer Étape
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Création Acte -->
        <div v-if="showCreateModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Nouvel Acte en Préparation</h5>
                        <button type="button" class="btn-close" @click="closeCreateModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Type *</label>
                                <select v-model="acteForm.type" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="VENTE">Vente</option>
                                    <option value="BAIL">Bail</option>
                                    <option value="DONATION">Donation</option>
                                    <option value="HYPOTHEQUE">Hypothèque</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Priorité *</label>
                                <select v-model="acteForm.priorite" class="form-select" required>
                                    <option value="HAUTE">Haute</option>
                                    <option value="MOYENNE">Moyenne</option>
                                    <option value="BASSE">Basse</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Titre *</label>
                                <input type="text" v-model="acteForm.titre" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Rédacteur *</label>
                                <select v-model="acteForm.redacteurId" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="1">Me. Kouassi</option>
                                    <option value="2">Me. Kone</option>
                                    <option value="3">Me. Diallo</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date d'échéance *</label>
                                <input type="date" v-model="acteForm.dateEcheance" class="form-control" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Description</label>
                                <textarea v-model="acteForm.description" class="form-control" rows="4"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeCreateModal">
                            Annuler
                        </button>
                        <button type="button" class="btn btn-primary" @click="saveActe">
                            <i class="bi bi-check-circle me-1"></i>Créer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
    name: 'ActesEnPreparation',

    data() {
        return {
            loading: true,
            viewMode: 'kanban',
            searchQuery: '',
            currentPage: 1,
            perPage: 10,
            selectedActe: null,
            showCreateModal: false,
            editMode: false,

            filters: {
                etape: '',
                type: '',
                priorite: ''
            },

            acteForm: {
                id: null,
                type: '',
                titre: '',
                redacteurId: '',
                priorite: 'MOYENNE',
                dateEcheance: '',
                description: ''
            },

            actes: [],
            stats: {
                enRedaction: 0,
                enRelecture: 0,
                attenteSignature: 0,
                enRetard: 0
            },

            pipelineStages: [],
            etapesKanban: [
                { id: 'REDACTION', label: 'Rédaction', color: 'warning', icon: 'bi-pencil-square' },
                { id: 'RELECTURE', label: 'Relecture', color: 'info', icon: 'bi-eye' },
                { id: 'CORRECTION', label: 'Correction', color: 'primary', icon: 'bi-arrow-repeat' },
                { id: 'VALIDATION', label: 'Validation', color: 'success', icon: 'bi-check-circle' }
            ]
        };
    },

    computed: {
        filteredActes() {
            let result = [...this.actes];

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(a =>
                    a.reference.toLowerCase().includes(query) ||
                    a.titre.toLowerCase().includes(query) ||
                    a.redacteur.toLowerCase().includes(query)
                );
            }

            if (this.filters.etape) {
                result = result.filter(a => a.etape === this.filters.etape);
            }

            if (this.filters.type) {
                result = result.filter(a => a.type === this.filters.type);
            }

            if (this.filters.priorite) {
                result = result.filter(a => a.priorite === this.filters.priorite);
            }

            return result;
        },

        paginatedActes() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredActes.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.filteredActes.length / this.perPage);
        }
    },

    async mounted() {
        await this.loadData();
    },

    methods: {
        async loadData() {
            try {
                this.loading = true;

                // Générer des données de démonstration
                this.actes = Array.from({ length: 25 }, (_, i) => ({
                    id: i + 1,
                    reference: `PREP-${String(i + 1).padStart(4, '0')}`,
                    type: ['VENTE', 'BAIL', 'DONATION', 'HYPOTHEQUE'][Math.floor(Math.random() * 4)],
                    typeLabel: ['Vente', 'Bail', 'Donation', 'Hypothèque'][Math.floor(Math.random() * 4)],
                    titre: `Acte ${i + 1} - Titre descriptif`,
                    redacteur: ['Me. Kouassi', 'Me. Kone', 'Me. Diallo'][Math.floor(Math.random() * 3)],
                    redacteurId: String(Math.floor(Math.random() * 3) + 1),
                    etape: ['REDACTION', 'RELECTURE', 'CORRECTION', 'VALIDATION'][Math.floor(Math.random() * 4)],
                    priorite: ['HAUTE', 'MOYENNE', 'BASSE'][Math.floor(Math.random() * 3)],
                    progression: Math.floor(Math.random() * 100),
                    dateCreation: new Date(2024, 9, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
                    dateEcheance: new Date(2024, 11, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
                    description: `Description détaillée de l'acte ${i + 1}`,
                    commentaires: Math.random() > 0.5 ? [
                        {
                            id: 1,
                            auteur: 'Me. Kouassi',
                            date: new Date().toISOString(),
                            texte: 'Commentaire important sur cet acte'
                        }
                    ] : []
                }));

                this.calculateStats();
                this.calculatePipelineStages();

            } catch (error) {
                console.error('Erreur:', error);
                ElMessage.error('Erreur lors du chargement');
            } finally {
                this.loading = false;
            }
        },

        calculateStats() {
            this.stats.enRedaction = this.actes.filter(a => a.etape === 'REDACTION').length;
            this.stats.enRelecture = this.actes.filter(a => a.etape === 'RELECTURE').length;
            this.stats.attenteSignature = this.actes.filter(a => a.etape === 'VALIDATION').length;

            const today = new Date();
            this.stats.enRetard = this.actes.filter(a => {
                const echeance = new Date(a.dateEcheance);
                return echeance < today && a.etape !== 'VALIDATION';
            }).length;
        },

        calculatePipelineStages() {
            this.pipelineStages = [
                {
                    label: 'Rédaction',
                    count: this.stats.enRedaction,
                    progress: 25,
                    color: 'warning',
                    icon: 'bi-pencil-square'
                },
                {
                    label: 'Relecture',
                    count: this.stats.enRelecture,
                    progress: 50,
                    color: 'info',
                    icon: 'bi-eye'
                },
                {
                    label: 'Correction',
                    count: this.actes.filter(a => a.etape === 'CORRECTION').length,
                    progress: 75,
                    color: 'primary',
                    icon: 'bi-arrow-repeat'
                },
                {
                    label: 'Validation',
                    count: this.stats.attenteSignature,
                    progress: 100,
                    color: 'success',
                    icon: 'bi-check-circle'
                }
            ];
        },

        getActesByEtape(etapeId) {
            return this.filteredActes.filter(a => a.etape === etapeId);
        },

        filterActes() {
            this.currentPage = 1;
        },

        resetFilters() {
            this.searchQuery = '';
            this.filters = {
                etape: '',
                type: '',
                priorite: ''
            };
            this.currentPage = 1;
        },

        viewActe(acte) {
            this.selectedActe = acte;
        },

        editActe(acte) {
            this.editMode = true;
            this.acteForm = { ...acte };
            this.showCreateModal = true;
        },

        closeCreateModal() {
            this.showCreateModal = false;
            this.editMode = false;
            this.acteForm = {
                id: null,
                type: '',
                titre: '',
                redacteurId: '',
                priorite: 'MOYENNE',
                dateEcheance: '',
                description: ''
            };
        },

        saveActe() {
            try {
                if (!this.acteForm.type || !this.acteForm.titre || !this.acteForm.redacteurId) {
                    ElMessage.warning('Veuillez remplir tous les champs obligatoires');
                    return;
                }

                if (this.editMode) {
                    ElMessage.success('Acte modifié avec succès!');
                } else {
                    ElMessage.success('Acte créé avec succès!');
                }
                this.closeCreateModal();
                this.loadData();
            } catch (error) {
                console.error('Erreur:', error);
                ElMessage.error('Erreur lors de la sauvegarde');
            }
        },

        async changerEtape(acte) {
            try {
                const { value: nouvelleEtape } = await ElMessageBox.prompt(
                    'Sélectionnez la nouvelle étape',
                    'Changer l\'étape',
                    {
                        confirmButtonText: 'Confirmer',
                        cancelButtonText: 'Annuler',
                        inputType: 'select',
                        inputOptions: {
                            'REDACTION': 'Rédaction',
                            'RELECTURE': 'Relecture',
                            'CORRECTION': 'Correction',
                            'VALIDATION': 'Validation',
                            'ATTENTE_SIGNATURE': 'Attente signature'
                        }
                    }
                );

                ElMessage.success('Étape changée avec succès!');
                if (this.selectedActe) {
                    this.selectedActe = null;
                }
                this.loadData();
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur:', error);
                }
            }
        },

        async ajouterCommentaire(acte) {
            try {
                const { value: commentaire } = await ElMessageBox.prompt(
                    'Ajoutez votre commentaire',
                    'Nouveau commentaire',
                    {
                        confirmButtonText: 'Ajouter',
                        cancelButtonText: 'Annuler',
                        inputType: 'textarea'
                    }
                );

                if (commentaire) {
                    ElMessage.success('Commentaire ajouté avec succès!');
                    if (this.selectedActe) {
                        this.selectedActe = null;
                    }
                    this.loadData();
                }
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur:', error);
                }
            }
        },

        exportActes() {
            ElMessage.success('Export en cours...');
        },

        rafraichir() {
            this.loadData();
            ElMessage.success('Données mises à jour !');
        },

        getEtapeBadgeClass(etape) {
            const classes = {
                'REDACTION': 'bg-warning text-dark',
                'RELECTURE': 'bg-info',
                'CORRECTION': 'bg-primary',
                'VALIDATION': 'bg-success',
                'ATTENTE_SIGNATURE': 'bg-secondary'
            };
            return classes[etape] || 'bg-secondary';
        },

        getEtapeLabel(etape) {
            const labels = {
                'REDACTION': 'Rédaction',
                'RELECTURE': 'Relecture',
                'CORRECTION': 'Correction',
                'VALIDATION': 'Validation',
                'ATTENTE_SIGNATURE': 'Attente signature'
            };
            return labels[etape] || etape;
        },

        getEtapeIcon(etape) {
            const icons = {
                'REDACTION': 'bi-pencil-square',
                'RELECTURE': 'bi-eye',
                'CORRECTION': 'bi-arrow-repeat',
                'VALIDATION': 'bi-check-circle',
                'ATTENTE_SIGNATURE': 'bi-pen'
            };
            return icons[etape] || 'bi-circle';
        },

        getPrioriteBadgeClass(priorite) {
            const classes = {
                'HAUTE': 'bg-danger',
                'MOYENNE': 'bg-warning text-dark',
                'BASSE': 'bg-secondary'
            };
            return classes[priorite] || 'bg-secondary';
        },

        getProgressBarClass(progression) {
            if (progression >= 75) return 'bg-success';
            if (progression >= 50) return 'bg-primary';
            if (progression >= 25) return 'bg-info';
            return 'bg-warning';
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

        formatDate(dateStr) {
            if (!dateStr) return '—';
            return new Date(dateStr).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
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

/* Pipeline */
.pipeline-container {
    display: flex;
    gap: 15px;
    overflow-x: auto;
}

.pipeline-stage {
    flex: 1;
    min-width: 200px;
}

.stage-header {
    padding: 15px;
    border-radius: 8px 8px 0 0;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.stage-title {
    font-weight: 600;
    margin: 0 10px;
}

.stage-count {
    background: rgba(255, 255, 255, 0.3);
    padding: 2px 10px;
    border-radius: 12px;
    font-weight: bold;
}

.stage-progress {
    padding: 15px;
    background: #f8f9fa;
    border-radius: 0 0 8px 8px;
}

/* Kanban */
.kanban-column {
    height: 600px;
    display: flex;
    flex-direction: column;
}

.kanban-cards {
    flex: 1;
    overflow-y: auto;
}

.kanban-card {
    padding: 15px;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
}

.kanban-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.avatar {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
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

.card {
    transition: transform 0.2s, box-shadow 0.2s;
}

@media (max-width: 768px) {
    .icon-lg {
        width: 50px;
        height: 50px;
    }

    .pipeline-container {
        flex-direction: column;
    }

    .kanban-column {
        height: auto;
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