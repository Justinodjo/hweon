<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">

            <!-- En-tête -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">
                                <i class="bi bi-clipboard-check me-2"></i>Rapports de Conformité
                            </h1>
                            <p class="text-muted mb-0">Suivi et gestion de la conformité réglementaire</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <button @click="showCreateModal = true" class="btn btn-primary">
                                <i class="bi bi-plus-circle me-1"></i>Nouveau Rapport
                            </button>
                            <button @click="genererRapportGlobal" class="btn btn-success">
                                <i class="bi bi-file-earmark-pdf me-1"></i>Rapport Global
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
                                    <span class="text-muted small">Taux de Conformité</span>
                                    <h3 class="mb-0 mt-2" :class="getTauxConformiteColor()">{{ stats.tauxConformite }}%
                                    </h3>
                                    <small :class="getTauxConformiteColor()">
                                        <i class="bi bi-graph-up me-1"></i>Global
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-opacity-10" :class="getTauxConformiteBgColor()">
                                    <i class="bi bi-speedometer2 fa-fw fs-4" :class="getTauxConformiteColor()"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Non-Conformités</span>
                                    <h3 class="mb-0 mt-2 text-danger">{{ stats.nonConformites }}</h3>
                                    <small class="text-danger">
                                        <i class="bi bi-exclamation-triangle me-1"></i>Actives
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-danger bg-opacity-10 text-danger">
                                    <i class="bi bi-x-circle fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">En Cours</span>
                                    <h3 class="mb-0 mt-2 text-warning">{{ stats.enCours }}</h3>
                                    <small class="text-warning">
                                        <i class="bi bi-hourglass-split me-1"></i>Traitement
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
                                    <span class="text-muted small">Résolues</span>
                                    <h3 class="mb-0 mt-2 text-success">{{ stats.resolues }}</h3>
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
                </div>

                <!-- Graphiques de synthèse -->
                <div class="row g-4 mb-4">
                    <div class="col-lg-8">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0"><i class="bi bi-bar-chart me-2"></i>Évolution de la Conformité</h6>
                            </div>
                            <div class="card-body">
                                <canvas id="evolutionChart" height="80"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0"><i class="bi bi-pie-chart me-2"></i>Répartition par Statut</h6>
                            </div>
                            <div class="card-body">
                                <canvas id="statutChart" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Domaines de conformité -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Domaines de Conformité</h6>
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div v-for="domaine in domaines" :key="domaine.id" class="col-md-4">
                                        <div class="card border h-100">
                                            <div class="card-body">
                                                <div class="d-flex justify-content-between align-items-start mb-3">
                                                    <div class="d-flex align-items-center">
                                                        <i class="bi fs-3 me-2"
                                                            :class="[domaine.icon, 'text-' + domaine.color]"></i>
                                                        <div>
                                                            <strong class="d-block">{{ domaine.label }}</strong>
                                                            <small class="text-muted">{{ domaine.count }}
                                                                contrôles</small>
                                                        </div>
                                                    </div>
                                                    <span class="badge"
                                                        :class="'bg-' + getConformiteColor(domaine.taux)">
                                                        {{ domaine.taux }}%
                                                    </span>
                                                </div>
                                                <div class="progress" style="height: 8px;">
                                                    <div class="progress-bar"
                                                        :class="'bg-' + getConformiteColor(domaine.taux)"
                                                        :style="{ width: domaine.taux + '%' }"></div>
                                                </div>
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
                                                v-model="searchQuery" @input="filterRapports">
                                            <i
                                                class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.domaine" @change="filterRapports" class="form-select">
                                            <option value="">Tous domaines</option>
                                            <option value="RGPD">RGPD</option>
                                            <option value="SECURITE">Sécurité</option>
                                            <option value="QUALITE">Qualité</option>
                                            <option value="JURIDIQUE">Juridique</option>
                                            <option value="ENVIRONNEMENT">Environnement</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.statut" @change="filterRapports" class="form-select">
                                            <option value="">Tous statuts</option>
                                            <option value="CONFORME">Conforme</option>
                                            <option value="NON_CONFORME">Non conforme</option>
                                            <option value="EN_COURS">En cours</option>
                                            <option value="A_VERIFIER">À vérifier</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.criticite" @change="filterRapports"
                                            class="form-select">
                                            <option value="">Toutes criticités</option>
                                            <option value="CRITIQUE">Critique</option>
                                            <option value="ELEVEE">Élevée</option>
                                            <option value="MOYENNE">Moyenne</option>
                                            <option value="FAIBLE">Faible</option>
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

                <!-- Liste des rapports -->
                <div class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">
                                    Rapports de Conformité
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ filteredRapports.length }} rapports
                                    </span>
                                </h6>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Référence</th>
                                                <th>Domaine / Contrôle</th>
                                                <th>Date Audit</th>
                                                <th>Criticité</th>
                                                <th>Statut</th>
                                                <th>Échéance</th>
                                                <th>Responsable</th>
                                                <th class="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="paginatedRapports.length === 0">
                                                <td colspan="8" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucun rapport trouvé</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="rapport in paginatedRapports" :key="rapport.id"
                                                :class="getRowClass(rapport)">
                                                <td>
                                                    <strong class="text-primary">{{ rapport.reference }}</strong>
                                                    <span v-if="isEcheanceProche(rapport.dateEcheance)"
                                                        class="badge bg-danger ms-1">
                                                        <i class="bi bi-clock"></i>
                                                    </span>
                                                </td>
                                                <td>
                                                    <div><strong>{{ rapport.titre }}</strong></div>
                                                    <span class="badge"
                                                        :class="'bg-' + getDomaineColor(rapport.domaine)">
                                                        {{ rapport.domaine }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <small class="text-muted">
                                                        <i class="bi bi-calendar-event me-1"></i>
                                                        {{ formatDate(rapport.dateAudit) }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <span class="badge"
                                                        :class="getCriticiteBadgeClass(rapport.criticite)">
                                                        <i class="bi" :class="getCriticiteIcon(rapport.criticite)"></i>
                                                        {{ rapport.criticite }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getStatutBadgeClass(rapport.statut)">
                                                        {{ getStatutLabel(rapport.statut) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <small :class="getEcheanceClass(rapport.dateEcheance)">
                                                        <i class="bi bi-flag me-1"></i>
                                                        {{ formatDate(rapport.dateEcheance) }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div class="avatar-sm bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-2"
                                                            style="width: 32px; height: 32px;">
                                                            <small>{{ getInitiales(rapport.responsable) }}</small>
                                                        </div>
                                                        <small>{{ rapport.responsable }}</small>
                                                    </div>
                                                </td>
                                                <td class="text-end">
                                                    <div class="btn-group">
                                                        <button class="btn btn-sm btn-outline-primary"
                                                            @click="viewRapport(rapport)">
                                                            <i class="bi bi-eye"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-success"
                                                            @click="modifierStatut(rapport)">
                                                            <i class="bi bi-pencil"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-info"
                                                            @click="telechargerRapport(rapport)">
                                                            <i class="bi bi-download"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- Pagination -->
                                <div v-if="filteredRapports.length > perPage" class="card-footer border-top">
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
        <div v-if="selectedRapport" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ selectedRapport.titre }}
                            <span class="badge ms-2" :class="getStatutBadgeClass(selectedRapport.statut)">
                                {{ getStatutLabel(selectedRapport.statut) }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedRapport = null"></button>
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
                                            <p class="mb-0 fw-bold">{{ selectedRapport.reference }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Domaine</label>
                                            <p class="mb-0">
                                                <span class="badge"
                                                    :class="'bg-' + getDomaineColor(selectedRapport.domaine)">
                                                    {{ selectedRapport.domaine }}
                                                </span>
                                            </p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Date d'audit</label>
                                            <p class="mb-0">{{ formatDate(selectedRapport.dateAudit) }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Auditeur</label>
                                            <p class="mb-0">{{ selectedRapport.auditeur }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-flag me-2"></i>Suivi</h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Criticité</label>
                                            <p class="mb-0">
                                                <span class="badge"
                                                    :class="getCriticiteBadgeClass(selectedRapport.criticite)">
                                                    {{ selectedRapport.criticite }}
                                                </span>
                                            </p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Date d'échéance</label>
                                            <p class="mb-0" :class="getEcheanceClass(selectedRapport.dateEcheance)">
                                                {{ formatDate(selectedRapport.dateEcheance) }}
                                            </p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Responsable</label>
                                            <p class="mb-0">{{ selectedRapport.responsable }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Progression</label>
                                            <div class="progress" style="height: 20px;">
                                                <div class="progress-bar"
                                                    :class="'bg-' + getProgressColor(selectedRapport.progression)"
                                                    :style="{ width: selectedRapport.progression + '%' }">
                                                    {{ selectedRapport.progression }}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-file-text me-2"></i>Description</h6>
                                        <p class="mb-0">{{ selectedRapport.description }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12" v-if="selectedRapport.constats && selectedRapport.constats.length > 0">
                                <div class="card border-warning">
                                    <div class="card-header bg-warning bg-opacity-10">
                                        <h6 class="mb-0"><i class="bi bi-exclamation-triangle me-2"></i>Constats et
                                            Non-Conformités</h6>
                                    </div>
                                    <div class="card-body">
                                        <ul class="mb-0">
                                            <li v-for="(constat, index) in selectedRapport.constats" :key="index"
                                                class="mb-2">
                                                {{ constat }}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12" v-if="selectedRapport.actions && selectedRapport.actions.length > 0">
                                <div class="card border-primary">
                                    <div class="card-header bg-primary bg-opacity-10">
                                        <h6 class="mb-0"><i class="bi bi-list-check me-2"></i>Plan d'Actions Correctifs
                                        </h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive">
                                            <table class="table table-sm mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Action</th>
                                                        <th>Responsable</th>
                                                        <th>Échéance</th>
                                                        <th>Statut</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(action, index) in selectedRapport.actions" :key="index">
                                                        <td>{{ action.libelle }}</td>
                                                        <td>{{ action.responsable }}</td>
                                                        <td>{{ formatDate(action.echeance) }}</td>
                                                        <td>
                                                            <span class="badge" :class="'bg-' + action.statut">
                                                                {{ action.statut }}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="selectedRapport = null">Fermer</button>
                        <button type="button" class="btn btn-warning" @click="modifierStatut(selectedRapport)">
                            <i class="bi bi-pencil me-1"></i>Modifier Statut
                        </button>
                        <button type="button" class="btn btn-success" @click="telechargerRapport(selectedRapport)">
                            <i class="bi bi-download me-1"></i>Télécharger
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
                        <h5 class="modal-title">Nouveau Rapport de Conformité</h5>
                        <button type="button" class="btn-close" @click="closeCreateModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Domaine *</label>
                                <select v-model="rapportForm.domaine" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="RGPD">RGPD</option>
                                    <option value="SECURITE">Sécurité</option>
                                    <option value="QUALITE">Qualité</option>
                                    <option value="JURIDIQUE">Juridique</option>
                                    <option value="ENVIRONNEMENT">Environnement</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Criticité *</label>
                                <select v-model="rapportForm.criticite" class="form-select" required>
                                    <option value="CRITIQUE">Critique</option>
                                    <option value="ELEVEE">Élevée</option>
                                    <option value="MOYENNE">Moyenne</option>
                                    <option value="FAIBLE">Faible</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Titre du contrôle *</label>
                                <input type="text" v-model="rapportForm.titre" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date d'audit *</label>
                                <input type="date" v-model="rapportForm.dateAudit" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date d'échéance *</label>
                                <input type="date" v-model="rapportForm.dateEcheance" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Responsable *</label>
                                <input type="text" v-model="rapportForm.responsable" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Auditeur</label>
                                <input type="text" v-model="rapportForm.auditeur" class="form-control">
                            </div>
                            <div class="col-12">
                                <label class="form-label">Description *</label>
                                <textarea v-model="rapportForm.description" class="form-control" rows="4"
                                    required></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeCreateModal">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="saveRapport">
                            <i class="bi bi-check-circle me-1"></i>Créer
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Modification Statut -->
        <div v-if="showStatutModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Modifier le Statut</h5>
                        <button type="button" class="btn-close" @click="showStatutModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Nouveau statut</label>
                            <select v-model="statutForm.statut" class="form-select">
                                <option value="CONFORME">Conforme</option>
                                <option value="NON_CONFORME">Non conforme</option>
                                <option value="EN_COURS">En cours</option>
                                <option value="A_VERIFIER">À vérifier</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Progression (%)</label>
                            <input type="number" v-model="statutForm.progression" class="form-control" min="0"
                                max="100">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Commentaire</label>
                            <textarea v-model="statutForm.commentaire" class="form-control" rows="3"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            @click="showStatutModal = false">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="updateStatut">
                            <i class="bi bi-check-circle me-1"></i>Mettre à jour
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RapportsConformite',

    data() {
        return {
            loading: true,
            searchQuery: '',
            currentPage: 1,
            perPage: 15,
            selectedRapport: null,
            showCreateModal: false,
            showStatutModal: false,
            filters: { domaine: '', statut: '', criticite: '' },
            rapportForm: {
                domaine: '', criticite: 'MOYENNE', titre: '', dateAudit: '',
                dateEcheance: '', responsable: '', auditeur: '', description: ''
            },
            statutForm: {
                rapportId: null,
                statut: '',
                progression: 0,
                commentaire: ''
            },
            rapports: [],
            stats: { tauxConformite: 0, nonConformites: 0, enCours: 0, resolues: 0 },
            domaines: [],
            charts: {
                evolution: null,
                statut: null
            }
        };
    },

    computed: {
        filteredRapports() {
            let result = [...this.rapports];
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(r =>
                    r.titre.toLowerCase().includes(query) ||
                    r.reference.toLowerCase().includes(query) ||
                    r.description.toLowerCase().includes(query)
                );
            }
            if (this.filters.domaine) result = result.filter(r => r.domaine === this.filters.domaine);
            if (this.filters.statut) result = result.filter(r => r.statut === this.filters.statut);
            if (this.filters.criticite) result = result.filter(r => r.criticite === this.filters.criticite);
            return result.sort((a, b) => new Date(b.dateAudit) - new Date(a.dateAudit));
        },

        paginatedRapports() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredRapports.slice(start, start + this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filteredRapports.length / this.perPage);
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
                const domaines = ['RGPD', 'SECURITE', 'QUALITE', 'JURIDIQUE', 'ENVIRONNEMENT'];
                const criticites = ['CRITIQUE', 'ELEVEE', 'MOYENNE', 'FAIBLE'];
                const statuts = ['CONFORME', 'NON_CONFORME', 'EN_COURS', 'A_VERIFIER'];
                const responsables = ['Jean Dupont', 'Marie Martin', 'Pierre Durand', 'Sophie Bernard'];
                const auditeurs = ['Audit Externe SA', 'Cabinet Conseil', 'Auditeur Interne'];

                this.rapports = Array.from({ length: 25 }, (_, i) => {
                    const statut = statuts[Math.floor(Math.random() * statuts.length)];
                    const progression = statut === 'CONFORME' ? 100 :
                        statut === 'EN_COURS' ? Math.floor(Math.random() * 70) + 20 :
                            statut === 'NON_CONFORME' ? Math.floor(Math.random() * 30) :
                                Math.floor(Math.random() * 50);

                    return {
                        id: i + 1,
                        reference: `CONF-${String(i + 1).padStart(4, '0')}/2024`,
                        domaine: domaines[Math.floor(Math.random() * domaines.length)],
                        titre: `Contrôle de conformité ${i + 1}`,
                        criticite: criticites[Math.floor(Math.random() * criticites.length)],
                        dateAudit: new Date(2024, 9 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
                        dateEcheance: new Date(2024, 11, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
                        statut: statut,
                        responsable: responsables[Math.floor(Math.random() * responsables.length)],
                        auditeur: auditeurs[Math.floor(Math.random() * auditeurs.length)],
                        progression: progression,
                        description: `Description détaillée du contrôle de conformité numéro ${i + 1}. Vérification des processus et procédures en place.`,
                        constats: statut !== 'CONFORME' ? [
                            'Non-conformité identifiée sur le processus',
                            'Documentation incomplète',
                            'Formation du personnel insuffisante'
                        ] : [],
                        actions: statut !== 'CONFORME' ? [
                            { libelle: 'Mise à jour de la documentation', responsable: responsables[0], echeance: '2024-12-15', statut: 'warning' },
                            { libelle: 'Formation du personnel', responsable: responsables[1], echeance: '2024-12-20', statut: 'info' },
                            { libelle: 'Révision des procédures', responsable: responsables[2], echeance: '2024-12-31', statut: 'secondary' }
                        ] : []
                    };
                });

                this.calculateStats();
                this.calculateDomaines();
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors du chargement', 'error');
            } finally {
                this.loading = false;
            }
        },

        calculateStats() {
            const total = this.rapports.length;
            const conformes = this.rapports.filter(r => r.statut === 'CONFORME').length;
            this.stats.tauxConformite = total > 0 ? Math.round((conformes / total) * 100) : 0;
            this.stats.nonConformites = this.rapports.filter(r => r.statut === 'NON_CONFORME').length;
            this.stats.enCours = this.rapports.filter(r => r.statut === 'EN_COURS').length;

            const thisMonth = new Date().getMonth();
            this.stats.resolues = this.rapports.filter(r =>
                r.statut === 'CONFORME' && new Date(r.dateAudit).getMonth() === thisMonth
            ).length;
        },

        calculateDomaines() {
            const domainesList = [
                { id: 'RGPD', label: 'RGPD', icon: 'bi-shield-lock', color: 'primary' },
                { id: 'SECURITE', label: 'Sécurité', icon: 'bi-shield-check', color: 'danger' },
                { id: 'QUALITE', label: 'Qualité', icon: 'bi-award', color: 'success' },
                { id: 'JURIDIQUE', label: 'Juridique', icon: 'bi-balance-scale', color: 'warning' },
                { id: 'ENVIRONNEMENT', label: 'Environnement', icon: 'bi-tree', color: 'info' }
            ];

            this.domaines = domainesList.map(dom => {
                const rapportsDomaine = this.rapports.filter(r => r.domaine === dom.id);
                const conformes = rapportsDomaine.filter(r => r.statut === 'CONFORME').length;
                const taux = rapportsDomaine.length > 0 ? Math.round((conformes / rapportsDomaine.length) * 100) : 0;

                return {
                    ...dom,
                    count: rapportsDomaine.length,
                    taux: taux
                };
            });
        },

        initCharts() {
            // Graphique d'évolution
            const ctxEvolution = document.getElementById('evolutionChart');
            if (ctxEvolution && window.Chart) {
                const months = ['Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
                const dataConformes = [65, 70, 72, 75, 78, 82];
                const dataNonConformes = [15, 12, 10, 8, 7, 5];
                const dataEnCours = [20, 18, 18, 17, 15, 13];

                this.charts.evolution = new Chart(ctxEvolution, {
                    type: 'line',
                    data: {
                        labels: months,
                        datasets: [
                            {
                                label: 'Conformes',
                                data: dataConformes,
                                borderColor: '#198754',
                                backgroundColor: 'rgba(25, 135, 84, 0.1)',
                                tension: 0.4,
                                fill: true
                            },
                            {
                                label: 'Non conformes',
                                data: dataNonConformes,
                                borderColor: '#dc3545',
                                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                                tension: 0.4,
                                fill: true
                            },
                            {
                                label: 'En cours',
                                data: dataEnCours,
                                borderColor: '#ffc107',
                                backgroundColor: 'rgba(255, 193, 7, 0.1)',
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
                                beginAtZero: true,
                                max: 100
                            }
                        }
                    }
                });
            }

            // Graphique de répartition
            const ctxStatut = document.getElementById('statutChart');
            if (ctxStatut && window.Chart) {
                const conformes = this.rapports.filter(r => r.statut === 'CONFORME').length;
                const nonConformes = this.rapports.filter(r => r.statut === 'NON_CONFORME').length;
                const enCours = this.rapports.filter(r => r.statut === 'EN_COURS').length;
                const aVerifier = this.rapports.filter(r => r.statut === 'A_VERIFIER').length;

                this.charts.statut = new Chart(ctxStatut, {
                    type: 'doughnut',
                    data: {
                        labels: ['Conformes', 'Non conformes', 'En cours', 'À vérifier'],
                        datasets: [{
                            data: [conformes, nonConformes, enCours, aVerifier],
                            backgroundColor: ['#198754', '#dc3545', '#ffc107', '#6c757d'],
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

        filterRapports() {
            this.currentPage = 1;
        },

        resetFilters() {
            this.searchQuery = '';
            this.filters = { domaine: '', statut: '', criticite: '' };
            this.currentPage = 1;
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },

        viewRapport(rapport) {
            this.selectedRapport = rapport;
        },

        modifierStatut(rapport) {
            this.statutForm.rapportId = rapport.id;
            this.statutForm.statut = rapport.statut;
            this.statutForm.progression = rapport.progression;
            this.statutForm.commentaire = '';
            this.showStatutModal = true;
            if (this.selectedRapport) {
                this.selectedRapport = null;
            }
        },

        async updateStatut() {
            try {
                const index = this.rapports.findIndex(r => r.id === this.statutForm.rapportId);
                if (index !== -1) {
                    this.rapports[index].statut = this.statutForm.statut;
                    this.rapports[index].progression = this.statutForm.progression;
                    this.showMessage('Statut mis à jour avec succès', 'success');
                    this.calculateStats();
                    this.calculateDomaines();

                    // Mise à jour des graphiques
                    if (this.charts.statut) {
                        const conformes = this.rapports.filter(r => r.statut === 'CONFORME').length;
                        const nonConformes = this.rapports.filter(r => r.statut === 'NON_CONFORME').length;
                        const enCours = this.rapports.filter(r => r.statut === 'EN_COURS').length;
                        const aVerifier = this.rapports.filter(r => r.statut === 'A_VERIFIER').length;

                        this.charts.statut.data.datasets[0].data = [conformes, nonConformes, enCours, aVerifier];
                        this.charts.statut.update();
                    }

                    this.showStatutModal = false;
                }
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors de la mise à jour', 'error');
            }
        },

        async telechargerRapport(rapport) {
            try {
                const content = `
RAPPORT DE CONFORMITÉ
=====================

Référence: ${rapport.reference}
Domaine: ${rapport.domaine}
Criticité: ${rapport.criticite}
Statut: ${this.getStatutLabel(rapport.statut)}
Progression: ${rapport.progression}%

INFORMATIONS GÉNÉRALES
---------------------
Date d'audit: ${this.formatDate(rapport.dateAudit)}
Date d'échéance: ${this.formatDate(rapport.dateEcheance)}
Auditeur: ${rapport.auditeur}
Responsable: ${rapport.responsable}

TITRE
-----
${rapport.titre}

DESCRIPTION
-----------
${rapport.description}

CONSTATS ET NON-CONFORMITÉS
---------------------------
${rapport.constats && rapport.constats.length > 0 ? rapport.constats.map((c, i) => `${i + 1}. ${c}`).join('\n') : 'Aucun constat'}

PLAN D'ACTIONS CORRECTIFS
-------------------------
${rapport.actions && rapport.actions.length > 0 ? rapport.actions.map((a, i) => `${i + 1}. ${a.libelle} - Responsable: ${a.responsable} - Échéance: ${this.formatDate(a.echeance)}`).join('\n') : 'Aucune action'}
                `.trim();

                const blob = new Blob([content], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${rapport.reference.replace(/\//g, '-')}.txt`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                this.showMessage('Rapport téléchargé avec succès', 'success');
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors du téléchargement', 'error');
            }
        },

        async genererRapportGlobal() {
            try {
                const content = `
RAPPORT GLOBAL DE CONFORMITÉ
============================
Date de génération: ${this.formatDate(new Date().toISOString())}

STATISTIQUES GÉNÉRALES
----------------------
Taux de conformité global: ${this.stats.tauxConformite}%
Non-conformités actives: ${this.stats.nonConformites}
Rapports en cours de traitement: ${this.stats.enCours}
Rapports résolus ce mois: ${this.stats.resolues}

RÉPARTITION PAR DOMAINE
-----------------------
${this.domaines.map(d => `${d.label}: ${d.taux}% (${d.count} contrôles)`).join('\n')}

DÉTAIL DES RAPPORTS
------------------
${this.rapports.map(r => `
- ${r.reference}: ${r.titre}
  Domaine: ${r.domaine}
  Statut: ${this.getStatutLabel(r.statut)}
  Progression: ${r.progression}%
  Responsable: ${r.responsable}
  Échéance: ${this.formatDate(r.dateEcheance)}
`).join('\n')}
                `.trim();

                const blob = new Blob([content], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `rapport-global-conformite-${new Date().toISOString().split('T')[0]}.txt`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                this.showMessage('Rapport global généré avec succès', 'success');
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors de la génération', 'error');
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
            this.rapportForm = {
                domaine: '', criticite: 'MOYENNE', titre: '', dateAudit: '',
                dateEcheance: '', responsable: '', auditeur: '', description: ''
            };
        },

        async saveRapport() {
            try {
                if (!this.rapportForm.domaine || !this.rapportForm.titre ||
                    !this.rapportForm.dateAudit || !this.rapportForm.dateEcheance ||
                    !this.rapportForm.responsable || !this.rapportForm.description) {
                    this.showMessage('Veuillez remplir tous les champs obligatoires', 'warning');
                    return;
                }

                const newRapport = {
                    id: this.rapports.length + 1,
                    reference: `CONF-${String(this.rapports.length + 1).padStart(4, '0')}/2024`,
                    domaine: this.rapportForm.domaine,
                    titre: this.rapportForm.titre,
                    criticite: this.rapportForm.criticite,
                    dateAudit: this.rapportForm.dateAudit,
                    dateEcheance: this.rapportForm.dateEcheance,
                    statut: 'A_VERIFIER',
                    responsable: this.rapportForm.responsable,
                    auditeur: this.rapportForm.auditeur || 'Non spécifié',
                    progression: 0,
                    description: this.rapportForm.description,
                    constats: [],
                    actions: []
                };

                this.rapports.unshift(newRapport);
                this.calculateStats();
                this.calculateDomaines();
                this.closeCreateModal();
                this.showMessage('Rapport créé avec succès', 'success');

                // Mise à jour des graphiques
                if (this.charts.statut) {
                    const conformes = this.rapports.filter(r => r.statut === 'CONFORME').length;
                    const nonConformes = this.rapports.filter(r => r.statut === 'NON_CONFORME').length;
                    const enCours = this.rapports.filter(r => r.statut === 'EN_COURS').length;
                    const aVerifier = this.rapports.filter(r => r.statut === 'A_VERIFIER').length;

                    this.charts.statut.data.datasets[0].data = [conformes, nonConformes, enCours, aVerifier];
                    this.charts.statut.update();
                }
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
                month: 'long',
                day: 'numeric'
            });
        },

        getDomaineColor(domaine) {
            const colors = {
                'RGPD': 'primary',
                'SECURITE': 'danger',
                'QUALITE': 'success',
                'JURIDIQUE': 'warning',
                'ENVIRONNEMENT': 'info'
            };
            return colors[domaine] || 'secondary';
        },

        getCriticiteBadgeClass(criticite) {
            const classes = {
                'CRITIQUE': 'bg-danger',
                'ELEVEE': 'bg-warning',
                'MOYENNE': 'bg-info',
                'FAIBLE': 'bg-success'
            };
            return classes[criticite] || 'bg-secondary';
        },

        getCriticiteIcon(criticite) {
            const icons = {
                'CRITIQUE': 'bi-exclamation-triangle-fill',
                'ELEVEE': 'bi-exclamation-circle-fill',
                'MOYENNE': 'bi-info-circle-fill',
                'FAIBLE': 'bi-check-circle-fill'
            };
            return icons[criticite] || 'bi-info-circle';
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'CONFORME': 'bg-success',
                'NON_CONFORME': 'bg-danger',
                'EN_COURS': 'bg-warning',
                'A_VERIFIER': 'bg-secondary'
            };
            return classes[statut] || 'bg-secondary';
        },

        getStatutLabel(statut) {
            const labels = {
                'CONFORME': 'Conforme',
                'NON_CONFORME': 'Non conforme',
                'EN_COURS': 'En cours',
                'A_VERIFIER': 'À vérifier'
            };
            return labels[statut] || statut;
        },

        getConformiteColor(taux) {
            if (taux >= 80) return 'success';
            if (taux >= 60) return 'info';
            if (taux >= 40) return 'warning';
            return 'danger';
        },

        getTauxConformiteColor() {
            if (this.stats.tauxConformite >= 80) return 'text-success';
            if (this.stats.tauxConformite >= 60) return 'text-info';
            if (this.stats.tauxConformite >= 40) return 'text-warning';
            return 'text-danger';
        },

        getTauxConformiteBgColor() {
            if (this.stats.tauxConformite >= 80) return 'bg-success';
            if (this.stats.tauxConformite >= 60) return 'bg-info';
            if (this.stats.tauxConformite >= 40) return 'bg-warning';
            return 'bg-danger';
        },

        getProgressColor(progression) {
            if (progression >= 80) return 'success';
            if (progression >= 50) return 'info';
            if (progression >= 25) return 'warning';
            return 'danger';
        },

        getEcheanceClass(dateEcheance) {
            if (!dateEcheance) return '';
            const today = new Date();
            const echeance = new Date(dateEcheance);
            const diffDays = Math.ceil((echeance - today) / (1000 * 60 * 60 * 24));

            if (diffDays < 0) return 'text-danger fw-bold';
            if (diffDays <= 7) return 'text-warning fw-bold';
            return 'text-muted';
        },

        isEcheanceProche(dateEcheance) {
            if (!dateEcheance) return false;
            const today = new Date();
            const echeance = new Date(dateEcheance);
            const diffDays = Math.ceil((echeance - today) / (1000 * 60 * 60 * 24));
            return diffDays >= 0 && diffDays <= 7;
        },

        getRowClass(rapport) {
            if (rapport.statut === 'NON_CONFORME' && rapport.criticite === 'CRITIQUE') {
                return 'table-danger';
            }
            if (this.isEcheanceProche(rapport.dateEcheance) && rapport.statut !== 'CONFORME') {
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
        // Nettoyage des graphiques
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

.progress {
    border-radius: 10px;
}

.avatar-sm {
    font-size: 12px;
    font-weight: 600;
}

canvas {
    max-height: 300px;
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