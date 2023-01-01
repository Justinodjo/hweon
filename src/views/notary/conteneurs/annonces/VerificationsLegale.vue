<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">

            <!-- En-tête -->
            <div class="row">
                <div class="col-sm-12 mb-4">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">
                                <i class="bi bi-shield-check me-2"></i>Vérifications Légales
                            </h1>
                            <p class="text-muted mb-0">Contrôle et validation des documents et formalités</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <button @click="showCreateModal = true" class="btn btn-primary">
                                <i class="bi bi-plus-circle me-1"></i>Nouvelle Vérification
                            </button>
                            <button @click="rafraichir" class="btn btn-outline-primary">
                                <i class="bi bi-arrow-clockwise"></i>
                            </button>
                            <button @click="exportVerifications" class="btn btn-success">
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
                                    <span class="text-muted small">En Cours</span>
                                    <h3 class="mb-0 mt-2 text-warning">{{ stats.enCours }}</h3>
                                    <small class="text-muted">
                                        <i class="bi bi-hourglass-split me-1"></i>Vérifications
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
                                    <span class="text-muted small">Conformes</span>
                                    <h3 class="mb-0 mt-2 text-success">{{ stats.conformes }}</h3>
                                    <small class="text-success">
                                        <i class="bi bi-check-circle me-1"></i>Ce mois
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
                                    <span class="text-muted small">Non Conformes</span>
                                    <h3 class="mb-0 mt-2 text-danger">{{ stats.nonConformes }}</h3>
                                    <small class="text-danger">
                                        <i class="bi bi-exclamation-triangle me-1"></i>À corriger
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
                                    <span class="text-muted small">Taux de Conformité</span>
                                    <h3 class="mb-0 mt-2 text-info">{{ stats.tauxConformite }}%</h3>
                                    <small class="text-muted">
                                        <i class="bi bi-graph-up me-1"></i>Global
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-info bg-opacity-10 text-info">
                                    <i class="bi bi-graph-up fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Checklist Catégories -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Aperçu par Catégorie</h6>
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div v-for="cat in categories" :key="cat.id" class="col-md-4">
                                        <div class="category-card" :class="'border-' + cat.color">
                                            <div class="d-flex justify-content-between align-items-center mb-2">
                                                <div class="d-flex align-items-center">
                                                    <i class="bi fs-4 me-2"
                                                        :class="[cat.icon, 'text-' + cat.color]"></i>
                                                    <strong>{{ cat.label }}</strong>
                                                </div>
                                                <span class="badge" :class="'bg-' + cat.color">{{ cat.count }}</span>
                                            </div>
                                            <div class="progress" style="height: 8px;">
                                                <div class="progress-bar" :class="'bg-' + cat.color"
                                                    :style="{ width: cat.progress + '%' }"></div>
                                            </div>
                                            <small class="text-muted">{{ cat.progress }}% complétées</small>
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
                                                v-model="searchQuery" @input="filterVerifications">
                                            <i
                                                class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>

                                    <!-- Filtre Statut -->
                                    <div class="col-md-2">
                                        <select v-model="filters.statut" @change="filterVerifications"
                                            class="form-select">
                                            <option value="">Tous les statuts</option>
                                            <option value="EN_ATTENTE">En attente</option>
                                            <option value="EN_COURS">En cours</option>
                                            <option value="CONFORME">Conforme</option>
                                            <option value="NON_CONFORME">Non conforme</option>
                                            <option value="SUSPENDU">Suspendu</option>
                                        </select>
                                    </div>

                                    <!-- Filtre Catégorie -->
                                    <div class="col-md-2">
                                        <select v-model="filters.categorie" @change="filterVerifications"
                                            class="form-select">
                                            <option value="">Toutes catégories</option>
                                            <option value="IDENTITE">Identité</option>
                                            <option value="PROPRIETE">Propriété</option>
                                            <option value="FISCALE">Fiscale</option>
                                            <option value="JURIDIQUE">Juridique</option>
                                            <option value="URBANISME">Urbanisme</option>
                                        </select>
                                    </div>

                                    <!-- Filtre Priorité -->
                                    <div class="col-md-2">
                                        <select v-model="filters.priorite" @change="filterVerifications"
                                            class="form-select">
                                            <option value="">Toutes priorités</option>
                                            <option value="URGENTE">Urgente</option>
                                            <option value="HAUTE">Haute</option>
                                            <option value="NORMALE">Normale</option>
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

                <!-- Vue Cartes / Liste -->
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
                <div v-if="viewMode === 'cards'" class="row g-4">
                    <div v-if="paginatedVerifications.length === 0" class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-body text-center py-5">
                                <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                <p class="text-muted mb-0">Aucune vérification trouvée</p>
                            </div>
                        </div>
                    </div>
                    <div v-else v-for="verif in paginatedVerifications" :key="verif.id" class="col-md-6 col-lg-4">
                        <div class="card verification-card shadow-sm h-100" :class="getCardBorderClass(verif.statut)"
                            @click="viewVerification(verif)">
                            <div class="card-body">
                                <!-- En-tête -->
                                <div class="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <strong class="text-primary">#{{ verif.reference }}</strong>
                                        <div class="text-muted small mt-1">{{ verif.acte }}</div>
                                    </div>
                                    <span class="badge" :class="getStatutBadgeClass(verif.statut)">
                                        {{ getStatutLabel(verif.statut) }}
                                    </span>
                                </div>

                                <!-- Catégorie -->
                                <div class="mb-3">
                                    <span class="badge bg-light text-dark">
                                        <i class="bi" :class="getCategorieIcon(verif.categorie)"></i>
                                        {{ getCategorieLabel(verif.categorie) }}
                                    </span>
                                    <span v-if="verif.priorite === 'URGENTE'" class="badge bg-danger ms-2">
                                        <i class="bi bi-exclamation-triangle"></i> Urgent
                                    </span>
                                </div>

                                <!-- Progression -->
                                <div class="mb-3">
                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                        <small class="text-muted">Progression</small>
                                        <small class="fw-bold">{{ verif.progression }}%</small>
                                    </div>
                                    <div class="progress" style="height: 8px;">
                                        <div class="progress-bar" :class="getProgressBarClass(verif.progression)"
                                            :style="{ width: verif.progression + '%' }"></div>
                                    </div>
                                </div>

                                <!-- Checklist -->
                                <div class="mb-3">
                                    <small class="text-muted">
                                        <i class="bi bi-check-square me-1"></i>
                                        {{ verif.itemsValides }}/{{ verif.itemsTotal }} items vérifiés
                                    </small>
                                </div>

                                <!-- Infos -->
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-muted">
                                        <i class="bi bi-person me-1"></i>{{ verif.verificateur }}
                                    </small>
                                    <small class="text-muted">
                                        <i class="bi bi-calendar me-1"></i>{{ formatDate(verif.dateVerification) }}
                                    </small>
                                </div>

                                <!-- Alertes -->
                                <div v-if="verif.anomalies > 0" class="alert alert-danger mt-3 mb-0 py-2">
                                    <small>
                                        <i class="bi bi-exclamation-triangle me-1"></i>
                                        {{ verif.anomalies }} anomalie(s) détectée(s)
                                    </small>
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
                                    Liste des Vérifications
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ filteredVerifications.length }} vérifications
                                    </span>
                                </h6>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Référence</th>
                                                <th>Acte / Catégorie</th>
                                                <th>Vérificateur</th>
                                                <th>Statut</th>
                                                <th>Progression</th>
                                                <th>Anomalies</th>
                                                <th>Date</th>
                                                <th class="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="paginatedVerifications.length === 0">
                                                <td colspan="8" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucune vérification trouvée</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="verif in paginatedVerifications" :key="verif.id"
                                                :class="{ 'table-danger': verif.statut === 'NON_CONFORME' }">
                                                <td>
                                                    <strong class="text-primary">#{{ verif.reference }}</strong>
                                                    <span v-if="verif.priorite === 'URGENTE'"
                                                        class="badge bg-danger ms-2">Urgent</span>
                                                </td>
                                                <td>
                                                    <div>
                                                        <strong>{{ verif.acte }}</strong>
                                                    </div>
                                                    <span class="badge bg-light text-dark">
                                                        <i class="bi" :class="getCategorieIcon(verif.categorie)"></i>
                                                        {{ getCategorieLabel(verif.categorie) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div
                                                            class="avatar bg-primary bg-opacity-10 rounded-circle me-2 p-2">
                                                            <i class="bi bi-person fs-6 text-primary"></i>
                                                        </div>
                                                        <span>{{ verif.verificateur }}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getStatutBadgeClass(verif.statut)">
                                                        <i class="bi" :class="getStatutIcon(verif.statut)"></i>
                                                        {{ getStatutLabel(verif.statut) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div class="progress flex-grow-1 me-2"
                                                            style="height: 8px; min-width: 80px;">
                                                            <div class="progress-bar"
                                                                :class="getProgressBarClass(verif.progression)"
                                                                :style="{ width: verif.progression + '%' }"></div>
                                                        </div>
                                                        <small>{{ verif.progression }}%</small>
                                                    </div>
                                                    <small class="text-muted">
                                                        {{ verif.itemsValides }}/{{ verif.itemsTotal }} items
                                                    </small>
                                                </td>
                                                <td>
                                                    <span v-if="verif.anomalies > 0" class="badge bg-danger">
                                                        <i class="bi bi-exclamation-triangle me-1"></i>
                                                        {{ verif.anomalies }}
                                                    </span>
                                                    <span v-else class="badge bg-success">
                                                        <i class="bi bi-check-circle me-1"></i>
                                                        Aucune
                                                    </span>
                                                </td>
                                                <td>
                                                    <small class="text-muted">
                                                        <i class="bi bi-calendar-event me-1"></i>
                                                        {{ formatDate(verif.dateVerification) }}
                                                    </small>
                                                </td>
                                                <td class="text-end">
                                                    <div class="dropdown">
                                                        <button class="btn btn-sm btn-light" type="button"
                                                            :id="'dropdown-' + verif.id" data-bs-toggle="dropdown">
                                                            <i class="bi bi-three-dots-vertical"></i>
                                                        </button>
                                                        <ul class="dropdown-menu dropdown-menu-end">
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="viewVerification(verif)">
                                                                    <i class="bi bi-eye me-2"></i>Voir détails
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="continuerVerification(verif)">
                                                                    <i class="bi bi-play-circle me-2"></i>Continuer
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="genererRapport(verif)">
                                                                    <i class="bi bi-file-earmark-pdf me-2"></i>Rapport
                                                                    PDF
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <hr class="dropdown-divider">
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="editVerification(verif)">
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
                                <div v-if="filteredVerifications.length > perPage" class="card-footer border-top">
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

        <!-- Modal Détails Vérification -->
        <div v-if="selectedVerification" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);"
            tabindex="-1">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Vérification #{{ selectedVerification.reference }}
                            <span class="badge ms-2" :class="getStatutBadgeClass(selectedVerification.statut)">
                                {{ getStatutLabel(selectedVerification.statut) }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedVerification = null"></button>
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
                                            <label class="text-muted small">Acte concerné</label>
                                            <p class="mb-0 fw-bold">{{ selectedVerification.acte }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Catégorie</label>
                                            <p class="mb-0">
                                                <span class="badge bg-primary">
                                                    {{ getCategorieLabel(selectedVerification.categorie) }}
                                                </span>
                                            </p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Vérificateur</label>
                                            <p class="mb-0">{{ selectedVerification.verificateur }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Priorité</label>
                                            <p class="mb-0">
                                                <span class="badge"
                                                    :class="getPrioriteBadgeClass(selectedVerification.priorite)">
                                                    {{ selectedVerification.priorite }}
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
                                            <i class="bi bi-graph-up me-2"></i>Avancement
                                        </h6>
                                        <div class="mb-3">
                                            <label class="text-muted small">Progression globale</label>
                                            <div class="progress" style="height: 20px;">
                                                <div class="progress-bar"
                                                    :class="getProgressBarClass(selectedVerification.progression)"
                                                    :style="{ width: selectedVerification.progression + '%' }">
                                                    {{ selectedVerification.progression }}%
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Items vérifiés</label>
                                            <p class="mb-0 fw-bold">
                                                {{ selectedVerification.itemsValides }}/{{
                                                    selectedVerification.itemsTotal }}
                                            </p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Date de vérification</label>
                                            <p class="mb-0">{{ formatDate(selectedVerification.dateVerification) }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Checklist des vérifications -->
                            <div class="col-12">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-check-square me-2"></i>Checklist de Vérification
                                        </h6>
                                        <div class="verification-checklist">
                                            <div v-for="item in selectedVerification.checklist" :key="item.id"
                                                class="checklist-item" :class="getChecklistItemClass(item.statut)">
                                                <div class="d-flex align-items-start">
                                                    <div class="checklist-icon me-3">
                                                        <i class="bi" :class="getChecklistIcon(item.statut)"></i>
                                                    </div>
                                                    <div class="flex-grow-1">
                                                        <div class="d-flex justify-content-between align-items-start">
                                                            <strong>{{ item.titre }}</strong>
                                                            <span class="badge"
                                                                :class="getChecklistBadgeClass(item.statut)">
                                                                {{ getChecklistStatutLabel(item.statut) }}
                                                            </span>
                                                        </div>
                                                        <p class="text-muted small mb-1">{{ item.description }}</p>
                                                        <div v-if="item.commentaire"
                                                            class="alert alert-warning py-1 px-2 mb-0 mt-2">
                                                            <small>
                                                                <i class="bi bi-chat-left-text me-1"></i>
                                                                {{ item.commentaire }}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Anomalies détectées -->
                            <div class="col-12" v-if="selectedVerification.anomalies > 0">
                                <div class="card border-danger">
                                    <div class="card-header bg-danger text-white">
                                        <h6 class="mb-0">
                                            <i class="bi bi-exclamation-triangle me-2"></i>
                                            Anomalies Détectées ({{ selectedVerification.anomalies }})
                                        </h6>
                                    </div>
                                    <div class="card-body">
                                        <div v-for="(anomalie, index) in selectedVerification.anomaliesDetails"
                                            :key="index" class="alert alert-danger mb-2">
                                            <div class="d-flex align-items-start">
                                                <i class="bi bi-x-circle fs-5 me-2"></i>
                                                <div class="flex-grow-1">
                                                    <strong>{{ anomalie.titre }}</strong>
                                                    <p class="mb-1 mt-1">{{ anomalie.description }}</p>
                                                    <small class="text-muted">
                                                        <i class="bi bi-clock me-1"></i>
                                                        Détectée le {{ formatDate(anomalie.date) }}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Observations -->
                            <div class="col-12" v-if="selectedVerification.observations">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-chat-left-text me-2"></i>Observations
                                        </h6>
                                        <p class="mb-0">{{ selectedVerification.observations }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="selectedVerification = null">
                            Fermer
                        </button>
                        <button type="button" class="btn btn-info" @click="genererRapport(selectedVerification)">
                            <i class="bi bi-file-earmark-pdf me-1"></i>Rapport PDF
                        </button>
                        <button v-if="selectedVerification.statut !== 'CONFORME'" type="button" class="btn btn-primary"
                            @click="continuerVerification(selectedVerification)">
                            <i class="bi bi-play-circle me-1"></i>Continuer la Vérification
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Création/Modification Vérification -->
        <div v-if="showCreateModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ editMode ? 'Modifier' : 'Nouvelle' }} Vérification Légale
                        </h5>
                        <button type="button" class="btn-close" @click="closeCreateModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Catégorie *</label>
                                <select v-model="verificationForm.categorie" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="IDENTITE">Vérification d'identité</option>
                                    <option value="PROPRIETE">Vérification de propriété</option>
                                    <option value="FISCALE">Vérification fiscale</option>
                                    <option value="JURIDIQUE">Vérification juridique</option>
                                    <option value="URBANISME">Vérification urbanisme</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Priorité *</label>
                                <select v-model="verificationForm.priorite" class="form-select" required>
                                    <option value="URGENTE">Urgente</option>
                                    <option value="HAUTE">Haute</option>
                                    <option value="NORMALE">Normale</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Acte concerné *</label>
                                <input type="text" v-model="verificationForm.acte" class="form-control"
                                    placeholder="Ex: Vente appartement Cocody" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Vérificateur *</label>
                                <select v-model="verificationForm.verificateurId" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="1">Me. Kouassi</option>
                                    <option value="2">Me. Kone</option>
                                    <option value="3">Me. Diallo</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date de vérification *</label>
                                <input type="date" v-model="verificationForm.dateVerification" class="form-control"
                                    required>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Observations</label>
                                <textarea v-model="verificationForm.observations" class="form-control" rows="4"
                                    placeholder="Notes et remarques..."></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeCreateModal">
                            Annuler
                        </button>
                        <button type="button" class="btn btn-primary" @click="saveVerification">
                            <i class="bi bi-check-circle me-1"></i>
                            {{ editMode ? 'Modifier' : 'Créer' }}
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
    name: 'VerificationsLegales',

    data() {
        return {
            loading: true,
            viewMode: 'cards',
            searchQuery: '',
            currentPage: 1,
            perPage: 9,
            selectedVerification: null,
            showCreateModal: false,
            editMode: false,

            filters: {
                statut: '',
                categorie: '',
                priorite: ''
            },

            verificationForm: {
                id: null,
                categorie: '',
                acte: '',
                verificateurId: '',
                priorite: 'NORMALE',
                dateVerification: '',
                observations: ''
            },

            verifications: [],
            stats: {
                enCours: 0,
                conformes: 0,
                nonConformes: 0,
                tauxConformite: 0
            },

            categories: []
        };
    },

    computed: {
        filteredVerifications() {
            let result = [...this.verifications];

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(v =>
                    v.reference.toLowerCase().includes(query) ||
                    v.acte.toLowerCase().includes(query) ||
                    v.verificateur.toLowerCase().includes(query)
                );
            }

            if (this.filters.statut) {
                result = result.filter(v => v.statut === this.filters.statut);
            }

            if (this.filters.categorie) {
                result = result.filter(v => v.categorie === this.filters.categorie);
            }

            if (this.filters.priorite) {
                result = result.filter(v => v.priorite === this.filters.priorite);
            }

            return result;
        },

        paginatedVerifications() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredVerifications.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.filteredVerifications.length / this.perPage);
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
                this.verifications = Array.from({ length: 30 }, (_, i) => {
                    const progression = Math.floor(Math.random() * 100);
                    const itemsTotal = Math.floor(Math.random() * 10) + 5;
                    const itemsValides = Math.floor((progression / 100) * itemsTotal);
                    const anomalies = Math.floor(Math.random() * 4);

                    return {
                        id: i + 1,
                        reference: `VER-${String(i + 1).padStart(4, '0')}`,
                        categorie: ['IDENTITE', 'PROPRIETE', 'FISCALE', 'JURIDIQUE', 'URBANISME'][Math.floor(Math.random() * 5)],
                        acte: `Acte de vérification ${i + 1}`,
                        verificateur: ['Me. Kouassi', 'Me. Kone', 'Me. Diallo'][Math.floor(Math.random() * 3)],
                        verificateurId: String(Math.floor(Math.random() * 3) + 1),
                        statut: ['EN_ATTENTE', 'EN_COURS', 'CONFORME', 'NON_CONFORME', 'SUSPENDU'][Math.floor(Math.random() * 5)],
                        priorite: ['URGENTE', 'HAUTE', 'NORMALE'][Math.floor(Math.random() * 3)],
                        progression: progression,
                        itemsTotal: itemsTotal,
                        itemsValides: itemsValides,
                        anomalies: anomalies,
                        dateVerification: new Date(2024, 10, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
                        observations: Math.random() > 0.5 ? 'Observations importantes sur cette vérification' : null,
                        checklist: this.generateChecklist(),
                        anomaliesDetails: anomalies > 0 ? Array.from({ length: anomalies }, (_, j) => ({
                            titre: `Anomalie ${j + 1}`,
                            description: 'Description de l\'anomalie détectée',
                            date: new Date().toISOString().split('T')[0]
                        })) : []
                    };
                });

                this.calculateStats();
                this.calculateCategories();

            } catch (error) {
                console.error('Erreur:', error);
                ElMessage.error('Erreur lors du chargement');
            } finally {
                this.loading = false;
            }
        },

        generateChecklist() {
            const items = [
                { titre: 'Vérification d\'identité', description: 'Contrôle des pièces d\'identité' },
                { titre: 'Titre de propriété', description: 'Vérification de l\'authenticité du titre' },
                { titre: 'Charges et hypothèques', description: 'Recherche des charges grevant le bien' },
                { titre: 'Conformité urbanistique', description: 'Vérification du respect des règles d\'urbanisme' },
                { titre: 'Situation fiscale', description: 'Contrôle de la situation fiscale' }
            ];

            return items.map((item, i) => ({
                id: i + 1,
                titre: item.titre,
                description: item.description,
                statut: ['VALIDE', 'NON_VALIDE', 'EN_ATTENTE', 'NON_APPLICABLE'][Math.floor(Math.random() * 4)],
                commentaire: Math.random() > 0.7 ? 'Attention: point à surveiller' : null
            }));
        },

        calculateStats() {
            this.stats.enCours = this.verifications.filter(v =>
                v.statut === 'EN_COURS' || v.statut === 'EN_ATTENTE'
            ).length;

            const thisMonth = new Date().getMonth();
            this.stats.conformes = this.verifications.filter(v => {
                const verDate = new Date(v.dateVerification);
                return v.statut === 'CONFORME' && verDate.getMonth() === thisMonth;
            }).length;

            this.stats.nonConformes = this.verifications.filter(v =>
                v.statut === 'NON_CONFORME'
            ).length;

            const total = this.verifications.filter(v =>
                v.statut === 'CONFORME' || v.statut === 'NON_CONFORME'
            ).length;

            this.stats.tauxConformite = total > 0
                ? Math.round((this.verifications.filter(v => v.statut === 'CONFORME').length / total) * 100)
                : 0;
        },

        calculateCategories() {
            const cats = [
                { id: 'IDENTITE', label: 'Identité', icon: 'bi-person-badge', color: 'primary' },
                { id: 'PROPRIETE', label: 'Propriété', icon: 'bi-house-check', color: 'success' },
                { id: 'FISCALE', label: 'Fiscale', icon: 'bi-calculator', color: 'warning' },
                { id: 'JURIDIQUE', label: 'Juridique', icon: 'bi-briefcase', color: 'info' },
                { id: 'URBANISME', label: 'Urbanisme', icon: 'bi-building', color: 'danger' }
            ];

            this.categories = cats.map(cat => {
                const items = this.verifications.filter(v => v.categorie === cat.id);
                const completed = items.filter(v => v.statut === 'CONFORME').length;
                return {
                    ...cat,
                    count: items.length,
                    progress: items.length > 0 ? Math.round((completed / items.length) * 100) : 0
                };
            });
        },

        filterVerifications() {
            this.currentPage = 1;
        },

        resetFilters() {
            this.searchQuery = '';
            this.filters = {
                statut: '',
                categorie: '',
                priorite: ''
            };
            this.currentPage = 1;
        },

        viewVerification(verif) {
            this.selectedVerification = verif;
        },

        editVerification(verif) {
            this.editMode = true;
            this.verificationForm = { ...verif };
            this.showCreateModal = true;
        },

        closeCreateModal() {
            this.showCreateModal = false;
            this.editMode = false;
            this.verificationForm = {
                id: null,
                categorie: '',
                acte: '',
                verificateurId: '',
                priorite: 'NORMALE',
                dateVerification: '',
                observations: ''
            };
        },

        saveVerification() {
            try {
                if (!this.verificationForm.categorie || !this.verificationForm.acte ||
                    !this.verificationForm.verificateurId) {
                    ElMessage.warning('Veuillez remplir tous les champs obligatoires');
                    return;
                }

                if (this.editMode) {
                    ElMessage.success('Vérification modifiée avec succès!');
                } else {
                    ElMessage.success('Vérification créée avec succès!');
                }
                this.closeCreateModal();
                this.loadData();
            } catch (error) {
                console.error('Erreur:', error);
                ElMessage.error('Erreur lors de la sauvegarde');
            }
        },

        continuerVerification(verif) {
            ElMessage.info('Redirection vers l\'interface de vérification...');
            if (this.selectedVerification) {
                this.selectedVerification = null;
            }
        },

        genererRapport(verif) {
            ElMessage.success('Génération du rapport PDF en cours...');
            if (this.selectedVerification) {
                this.selectedVerification = null;
            }
        },

        exportVerifications() {
            ElMessage.success('Export en cours...');
        },

        rafraichir() {
            this.loadData();
            ElMessage.success('Données mises à jour !');
        },

        // Helpers pour les classes CSS
        getCardBorderClass(statut) {
            const classes = {
                'EN_ATTENTE': 'border-start border-warning border-4',
                'EN_COURS': 'border-start border-info border-4',
                'CONFORME': 'border-start border-success border-4',
                'NON_CONFORME': 'border-start border-danger border-4',
                'SUSPENDU': 'border-start border-secondary border-4'
            };
            return classes[statut] || '';
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'EN_ATTENTE': 'bg-warning text-dark',
                'EN_COURS': 'bg-info',
                'CONFORME': 'bg-success',
                'NON_CONFORME': 'bg-danger',
                'SUSPENDU': 'bg-secondary'
            };
            return classes[statut] || 'bg-secondary';
        },

        getStatutLabel(statut) {
            const labels = {
                'EN_ATTENTE': 'En attente',
                'EN_COURS': 'En cours',
                'CONFORME': 'Conforme',
                'NON_CONFORME': 'Non conforme',
                'SUSPENDU': 'Suspendu'
            };
            return labels[statut] || statut;
        },

        getStatutIcon(statut) {
            const icons = {
                'EN_ATTENTE': 'bi-hourglass',
                'EN_COURS': 'bi-arrow-repeat',
                'CONFORME': 'bi-check-circle-fill',
                'NON_CONFORME': 'bi-x-circle-fill',
                'SUSPENDU': 'bi-pause-circle'
            };
            return icons[statut] || 'bi-circle';
        },

        getCategorieLabel(categorie) {
            const labels = {
                'IDENTITE': 'Identité',
                'PROPRIETE': 'Propriété',
                'FISCALE': 'Fiscale',
                'JURIDIQUE': 'Juridique',
                'URBANISME': 'Urbanisme'
            };
            return labels[categorie] || categorie;
        },

        getCategorieIcon(categorie) {
            const icons = {
                'IDENTITE': 'bi-person-badge',
                'PROPRIETE': 'bi-house-check',
                'FISCALE': 'bi-calculator',
                'JURIDIQUE': 'bi-briefcase',
                'URBANISME': 'bi-building'
            };
            return icons[categorie] || 'bi-shield-check';
        },

        getPrioriteBadgeClass(priorite) {
            const classes = {
                'URGENTE': 'bg-danger',
                'HAUTE': 'bg-warning text-dark',
                'NORMALE': 'bg-secondary'
            };
            return classes[priorite] || 'bg-secondary';
        },

        getProgressBarClass(progression) {
            if (progression >= 75) return 'bg-success';
            if (progression >= 50) return 'bg-primary';
            if (progression >= 25) return 'bg-info';
            return 'bg-warning';
        },

        getChecklistItemClass(statut) {
            const classes = {
                'VALIDE': 'checklist-valide',
                'NON_VALIDE': 'checklist-non-valide',
                'EN_ATTENTE': 'checklist-attente',
                'NON_APPLICABLE': 'checklist-na'
            };
            return classes[statut] || '';
        },

        getChecklistIcon(statut) {
            const icons = {
                'VALIDE': 'bi-check-circle-fill text-success',
                'NON_VALIDE': 'bi-x-circle-fill text-danger',
                'EN_ATTENTE': 'bi-clock text-warning',
                'NON_APPLICABLE': 'bi-dash-circle text-secondary'
            };
            return icons[statut] || 'bi-circle';
        },

        getChecklistBadgeClass(statut) {
            const classes = {
                'VALIDE': 'bg-success',
                'NON_VALIDE': 'bg-danger',
                'EN_ATTENTE': 'bg-warning text-dark',
                'NON_APPLICABLE': 'bg-secondary'
            };
            return classes[statut] || 'bg-secondary';
        },

        getChecklistStatutLabel(statut) {
            const labels = {
                'VALIDE': 'Validé',
                'NON_VALIDE': 'Non validé',
                'EN_ATTENTE': 'En attente',
                'NON_APPLICABLE': 'N/A'
            };
            return labels[statut] || statut;
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

/* Cartes de catégories */
.category-card {
    padding: 20px;
    border-radius: 8px;
    border: 2px solid #e9ecef;
    background: white;
    transition: all 0.3s;
}

.category-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

/* Cartes de vérification */
.verification-card {
    cursor: pointer;
    transition: all 0.3s;
}

.verification-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}

/* Checklist */
.verification-checklist {
    max-height: 400px;
    overflow-y: auto;
}

.checklist-item {
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 8px;
    border: 1px solid #dee2e6;
    background: white;
}

.checklist-valide {
    background: #d1e7dd;
    border-color: #198754;
}

.checklist-non-valide {
    background: #f8d7da;
    border-color: #dc3545;
}

.checklist-attente {
    background: #fff3cd;
    border-color: #ffc107;
}

.checklist-na {
    background: #e9ecef;
    border-color: #6c757d;
}

.checklist-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
}

/* Avatar */
.avatar {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Table */
.table-hover tbody tr:hover {
    background-color: rgba(13, 110, 253, 0.05);
}

/* Badge */
.badge {
    font-weight: 500;
    padding: 0.35em 0.65em;
}

/* Dropdown */
.dropdown-menu {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

/* Spinner */
.spinner-border {
    width: 3rem;
    height: 3rem;
}

/* Pagination */
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

/* Transitions */
.card {
    transition: transform 0.2s, box-shadow 0.2s;
}

/* Scrollbar personnalisée */
.verification-checklist::-webkit-scrollbar {
    width: 8px;
}

.verification-checklist::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.verification-checklist::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}

.verification-checklist::-webkit-scrollbar-thumb:hover {
    background: #555;
}

/* Responsive */
@media (max-width: 768px) {
    .icon-lg {
        width: 50px;
        height: 50px;
    }

    .category-card {
        margin-bottom: 15px;
    }

    .verification-card {
        margin-bottom: 15px;
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