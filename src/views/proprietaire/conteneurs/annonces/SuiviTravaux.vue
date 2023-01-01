<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">
            <!-- En-tête -->
            <div class="row">
                <div class="col-sm-12 mb-5">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <h1 class="h3 mb-2 mb-sm-0">Suivi des Travaux</h1>
                        <div class="d-flex gap-2">
                            <button @click="nouveauProjet" class="btn btn-primary mb-0">
                                <i class="bi bi-plus-lg fa-fw"></i> Nouveau Projet
                            </button>
                            <button @click="exporterTravaux" class="btn btn-success mb-0">
                                <i class="bi bi-download fa-fw"></i> Exporter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Statistiques -->
            <div class="row g-4 mb-5">
                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>Projets Actifs</span>
                                <h3 class="mb-0 mt-2">{{ stats.projetsActifs }}</h3>
                            </div>
                            <div
                                class="icon-lg rounded-circle flex-shrink-0 bg-primary bg-opacity-10 text-primary mb-0">
                                <i class="bi bi-hammer fa-fw"></i>
                            </div>
                        </div>
                        <div class="progress progress-xs bg-primary bg-opacity-10 mb-2">
                            <div class="progress-bar bg-primary" :style="`width: ${stats.tauxAvancement}%`"></div>
                        </div>
                        <span><span class="text-primary">{{ stats.tauxAvancement }}%</span> avancement moyen</span>
                    </div>
                </div>

                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>Budget Total</span>
                                <h3 class="mb-0 mt-2">{{ formatCurrency(stats.budgetTotal) }}</h3>
                            </div>
                            <div
                                class="icon-lg rounded-circle flex-shrink-0 bg-success bg-opacity-10 text-success mb-0">
                                <i class="bi bi-wallet2 fa-fw"></i>
                            </div>
                        </div>
                        <span><span class="text-success">{{ formatCurrency(stats.depenseReel) }}</span> dépensé</span>
                    </div>
                </div>

                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>En Retard</span>
                                <h3 class="mb-0 mt-2 text-danger">{{ stats.projetsRetard }}</h3>
                            </div>
                            <div class="icon-lg rounded-circle flex-shrink-0 bg-danger bg-opacity-10 text-danger mb-0">
                                <i class="bi bi-exclamation-triangle fa-fw"></i>
                            </div>
                        </div>
                        <span>Nécessitent attention</span>
                    </div>
                </div>

                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>Terminés (Mois)</span>
                                <h3 class="mb-0 mt-2 text-success">{{ stats.projetsTermines }}</h3>
                            </div>
                            <div
                                class="icon-lg rounded-circle flex-shrink-0 bg-success bg-opacity-10 text-success mb-0">
                                <i class="bi bi-check-circle fa-fw"></i>
                            </div>
                        </div>
                        <span>Ce mois</span>
                    </div>
                </div>
            </div>

            <!-- Alertes -->
            <div class="row mb-4" v-if="alertes.length > 0">
                <div class="col-12">
                    <div class="alert alert-warning d-flex align-items-center" role="alert">
                        <i class="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
                        <div>
                            <strong>Attention !</strong> {{ alertes.length }} projet(s) nécessite(nt) votre attention.
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
                            <label class="form-label">Statut</label>
                            <select v-model="filters.statut" @change="applyFilters" class="form-select">
                                <option value="">Tous</option>
                                <option value="PLANIFIE">Planifié</option>
                                <option value="EN_COURS">En cours</option>
                                <option value="EN_PAUSE">En pause</option>
                                <option value="TERMINE">Terminé</option>
                                <option value="ANNULE">Annulé</option>
                            </select>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Type de Travaux</label>
                            <select v-model="filters.type" @change="applyFilters" class="form-select">
                                <option value="">Tous</option>
                                <option value="RENOVATION">Rénovation</option>
                                <option value="EXTENSION">Extension</option>
                                <option value="ENTRETIEN">Entretien</option>
                                <option value="REPARATION">Réparation</option>
                                <option value="AMENAGEMENT">Aménagement</option>
                            </select>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Bien</label>
                            <select v-model="filters.bienId" @change="applyFilters" class="form-select">
                                <option value="">Tous les biens</option>
                                <option v-for="bien in biens" :key="bien.id" :value="bien.id">
                                    {{ bien.nom }}
                                </option>
                            </select>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Rechercher</label>
                            <input type="text" v-model="searchQuery" @input="applyFilters" class="form-control"
                                placeholder="Nom projet, entrepreneur...">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <ul class="nav nav-pills mb-4" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#liste-tab" type="button"
                        role="tab">
                        <i class="bi bi-list-ul me-2"></i>Liste des Projets
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#kanban-tab" type="button" role="tab">
                        <i class="bi bi-kanban me-2"></i>Vue Kanban
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#gantt-tab" type="button" role="tab">
                        <i class="bi bi-calendar-range me-2"></i>Planning
                    </button>
                </li>
            </ul>

            <!-- Tab Content -->
            <div class="tab-content">
                <!-- Onglet Liste -->
                <div class="tab-pane fade show active" id="liste-tab">
                    <div class="card shadow">
                        <div class="card-body">
                            <!-- En-têtes -->
                            <div class="bg-light rounded p-3 d-none d-lg-block">
                                <div class="row">
                                    <div class="col-lg-2">
                                        <h6 class="mb-0">Projet</h6>
                                    </div>
                                    <div class="col-lg-2">
                                        <h6 class="mb-0">Bien / Type</h6>
                                    </div>
                                    <div class="col-lg-2">
                                        <h6 class="mb-0">Entrepreneur</h6>
                                    </div>
                                    <div class="col-lg-2">
                                        <h6 class="mb-0">Dates / Budget</h6>
                                    </div>
                                    <div class="col-lg-2">
                                        <h6 class="mb-0">Avancement</h6>
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

                            <!-- Aucun projet -->
                            <div v-else-if="paginatedProjets.length === 0" class="text-center text-muted my-5">
                                <i class="bi bi-inbox fs-1"></i>
                                <p class="mt-3">Aucun projet de travaux trouvé.</p>
                            </div>

                            <!-- Lignes -->
                            <div v-else>
                                <div class="row border-bottom py-3 align-items-center"
                                    v-for="projet in paginatedProjets" :key="projet.id"
                                    :class="{ 'bg-danger bg-opacity-10': isEnRetard(projet) }">
                                    <div class="col-lg-2">
                                        <strong class="d-lg-none">Projet:</strong>
                                        <div>
                                            <div class="fw-bold text-primary">{{ projet.nom }}</div>
                                            <small class="text-muted">{{ projet.reference }}</small>
                                        </div>
                                    </div>
                                    <div class="col-lg-2">
                                        <strong class="d-lg-none">Bien:</strong>
                                        <div>
                                            <div class="small">{{ projet.bien }}</div>
                                            <span class="badge bg-info small">{{ projet.type }}</span>
                                        </div>
                                    </div>
                                    <div class="col-lg-2">
                                        <strong class="d-lg-none">Entrepreneur:</strong>
                                        <div class="small">
                                            <div class="fw-bold">{{ projet.entrepreneur }}</div>
                                            <div class="text-muted">{{ projet.entrepreneurContact }}</div>
                                        </div>
                                    </div>
                                    <div class="col-lg-2">
                                        <strong class="d-lg-none">Dates:</strong>
                                        <div class="small">
                                            <div>{{ formatDate(projet.dateDebut) }} - {{ formatDate(projet.dateFin) }}
                                            </div>
                                            <div class="fw-bold">{{ formatCurrency(projet.budget) }}</div>
                                        </div>
                                    </div>
                                    <div class="col-lg-2">
                                        <strong class="d-lg-none">Avancement:</strong>
                                        <div>
                                            <div class="d-flex justify-content-between mb-1">
                                                <small>{{ projet.avancement }}%</small>
                                                <small v-if="isEnRetard(projet)" class="text-danger">
                                                    <i class="bi bi-exclamation-circle"></i> Retard
                                                </small>
                                            </div>
                                            <div class="progress" style="height: 8px;">
                                                <div class="progress-bar" :class="getProgressClass(projet.avancement)"
                                                    :style="`width: ${projet.avancement}%`"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-1">
                                        <strong class="d-lg-none">Statut:</strong>
                                        <span class="badge" :class="getStatutBadgeClass(projet.statut)">
                                            {{ projet.statut }}
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
                                                    <a class="dropdown-item" @click="voirDetails(projet)">
                                                        <i class="bi bi-eye me-2"></i>Détails
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item" @click="modifierProjet(projet)">
                                                        <i class="bi bi-pencil me-2"></i>Modifier
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item" @click="ajouterEtape(projet)">
                                                        <i class="bi bi-plus-circle me-2"></i>Ajouter étape
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item" @click="ajouterDepense(projet)">
                                                        <i class="bi bi-cash me-2"></i>Ajouter dépense
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item" @click="ajouterDocument(projet)">
                                                        <i class="bi bi-file-earmark me-2"></i>Joindre document
                                                    </a>
                                                </li>
                                                <li v-if="projet.statut === 'EN_COURS'">
                                                    <hr class="dropdown-divider">
                                                    <a class="dropdown-item" @click="mettreEnPause(projet)">
                                                        <i class="bi bi-pause-circle me-2"></i>Mettre en pause
                                                    </a>
                                                </li>
                                                <li v-if="projet.statut === 'EN_PAUSE'">
                                                    <a class="dropdown-item" @click="reprendre(projet)">
                                                        <i class="bi bi-play-circle me-2"></i>Reprendre
                                                    </a>
                                                </li>
                                                <li v-if="projet.avancement === 100 && projet.statut !== 'TERMINE'">
                                                    <a class="dropdown-item text-success"
                                                        @click="terminerProjet(projet)">
                                                        <i class="bi bi-check-circle me-2"></i>Marquer terminé
                                                    </a>
                                                </li>
                                                <li v-if="projet.statut !== 'TERMINE'">
                                                    <hr class="dropdown-divider">
                                                    <a class="dropdown-item text-danger" @click="annulerProjet(projet)">
                                                        <i class="bi bi-x-circle me-2"></i>Annuler
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
                                    Affichage {{ startIndex + 1 }} à {{ endIndex }} sur {{ filteredProjets.length }}
                                    entrées
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

                <!-- Onglet Kanban -->
                <div class="tab-pane fade" id="kanban-tab">
                    <div class="row g-3">
                        <div class="col-md-3" v-for="statut in ['PLANIFIE', 'EN_COURS', 'EN_PAUSE', 'TERMINE']"
                            :key="statut">
                            <div class="card">
                                <div class="card-header" :class="getKanbanHeaderClass(statut)">
                                    <h6 class="mb-0">{{ statut }} ({{ getProjetsByStatut(statut).length }})</h6>
                                </div>
                                <div class="card-body" style="min-height: 400px; max-height: 600px; overflow-y: auto;">
                                    <div v-for="projet in getProjetsByStatut(statut)" :key="projet.id"
                                        class="card mb-3 shadow-sm" style="cursor: pointer;"
                                        @click="voirDetails(projet)">
                                        <div class="card-body p-3">
                                            <h6 class="card-title mb-2">{{ projet.nom }}</h6>
                                            <p class="card-text small text-muted mb-2">{{ projet.bien }}</p>
                                            <div class="progress mb-2" style="height: 6px;">
                                                <div class="progress-bar" :class="getProgressClass(projet.avancement)"
                                                    :style="`width: ${projet.avancement}%`"></div>
                                            </div>
                                            <div class="d-flex justify-content-between align-items-center">
                                                <small class="text-muted">{{ projet.avancement }}%</small>
                                                <small class="fw-bold">{{ formatCurrency(projet.budget) }}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Onglet Planning -->
                <div class="tab-pane fade" id="gantt-tab">
                    <div class="card shadow">
                        <div class="card-body">
                            <h5 class="mb-4">Planning des Travaux</h5>
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Projet</th>
                                            <th>Date Début</th>
                                            <th>Date Fin</th>
                                            <th>Durée</th>
                                            <th>Planning</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="projet in filteredProjets" :key="projet.id">
                                            <td>{{ projet.nom }}</td>
                                            <td>{{ formatDate(projet.dateDebut) }}</td>
                                            <td>{{ formatDate(projet.dateFin) }}</td>
                                            <td>{{ calculerDuree(projet) }} jours</td>
                                            <td>
                                                <div class="position-relative" style="height: 30px;">
                                                    <div class="position-absolute w-100 bg-light rounded"
                                                        style="height: 20px; top: 5px;"></div>
                                                    <div class="position-absolute bg-primary rounded"
                                                        :style="getGanttStyle(projet)" style="height: 20px; top: 5px;">
                                                    </div>
                                                </div>
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

        <!-- Modal Nouveau/Modifier Projet -->
        <!-- Modal Nouveau/Modifier Projet -->
        <div class="modal fade" id="projetModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ projetForm.id ? 'Modifier' : 'Nouveau' }} Projet de Travaux
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
                                    <label class="form-label">Nom du Projet *</label>
                                    <input type="text" v-model="projetForm.nom" class="form-control"
                                        placeholder="Ex: Rénovation Cuisine" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Bien Concerné *</label>
                                    <select v-model="projetForm.bienId" class="form-select" required>
                                        <option value="">Sélectionnez...</option>
                                        <option v-for="bien in biens" :key="bien.id" :value="bien.id">
                                            {{ bien.nom }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Type de Travaux *</label>
                                    <select v-model="projetForm.type" class="form-select" required>
                                        <option value="">Sélectionnez...</option>
                                        <option value="RENOVATION">Rénovation</option>
                                        <option value="EXTENSION">Extension</option>
                                        <option value="ENTRETIEN">Entretien</option>
                                        <option value="REPARATION">Réparation</option>
                                        <option value="AMENAGEMENT">Aménagement</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Priorité</label>
                                    <select v-model="projetForm.priorite" class="form-select">
                                        <option value="HAUTE">Haute</option>
                                        <option value="MOYENNE">Moyenne</option>
                                        <option value="BASSE">Basse</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label class="form-label">Description</label>
                                    <textarea v-model="projetForm.description" class="form-control" rows="3"
                                        placeholder="Description détaillée des travaux..."></textarea>
                                </div>
                            </div>

                            <!-- Planning -->
                            <div class="row g-3 mb-4">
                                <div class="col-12">
                                    <h6 class="border-bottom pb-2">Planning</h6>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Date de Début *</label>
                                    <input type="date" v-model="projetForm.dateDebut" class="form-control" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Date de Fin Prévue *</label>
                                    <input type="date" v-model="projetForm.dateFin" class="form-control" required>
                                </div>
                            </div>

                            <!-- Budget -->
                            <div class="row g-3 mb-4">
                                <div class="col-12">
                                    <h6 class="border-bottom pb-2">Budget</h6>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Budget Total *</label>
                                    <input type="number" v-model.number="projetForm.budget" class="form-control"
                                        step="0.01" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Dépenses Actuelles</label>
                                    <input type="number" v-model.number="projetForm.depenseReel" class="form-control"
                                        step="0.01" readonly>
                                </div>
                            </div>

                            <!-- Entrepreneur -->
                            <div class="row g-3 mb-4">
                                <div class="col-12">
                                    <h6 class="border-bottom pb-2">Entrepreneur / Prestataire</h6>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Nom Entreprise</label>
                                    <input type="text" v-model="projetForm.entrepreneur" class="form-control">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Contact</label>
                                    <input type="tel" v-model="projetForm.entrepreneurContact" class="form-control">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Email</label>
                                    <input type="email" v-model="projetForm.entrepreneurEmail" class="form-control">
                                </div>
                            </div>

                            <!-- Étapes du projet -->
                            <div class="row g-3">
                                <div class="col-12">
                                    <div
                                        class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                                        <h6 class="mb-0">Étapes du Projet</h6>
                                        <button type="button" class="btn btn-sm btn-primary" @click="ajouterEtapeForm">
                                            <i class="bi bi-plus"></i> Ajouter
                                        </button>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="table-responsive">
                                        <table class="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Nom Étape</th>
                                                    <th>Date Début</th>
                                                    <th>Date Fin</th>
                                                    <th>Statut</th>
                                                    <th style="width: 50px;"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(etape, index) in projetForm.etapes" :key="index">
                                                    <td>
                                                        <input type="text" v-model="etape.nom"
                                                            class="form-control form-control-sm">
                                                    </td>
                                                    <td>
                                                        <input type="date" v-model="etape.dateDebut"
                                                            class="form-control form-control-sm">
                                                    </td>
                                                    <td>
                                                        <input type="date" v-model="etape.dateFin"
                                                            class="form-control form-control-sm">
                                                    </td>
                                                    <td>
                                                        <select v-model="etape.statut"
                                                            class="form-select form-select-sm">
                                                            <option value="A_FAIRE">À faire</option>
                                                            <option value="EN_COURS">En cours</option>
                                                            <option value="TERMINE">Terminé</option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <button type="button" class="btn btn-sm btn-danger"
                                                            @click="supprimerEtapeForm(index)">
                                                            <i class="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="sauvegarderProjet">
                            <i class="bi bi-save"></i> {{ projetForm.id ? 'Mettre à jour' : 'Créer' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Détails Projet -->
        <div class="modal fade" id="detailsModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Détails du Projet</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" v-if="selectedProjet">
                        <div class="row g-4">
                            <!-- Informations principales -->
                            <div class="col-md-8">
                                <!-- Info générale -->
                                <div class="card mb-3">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0">{{ selectedProjet.nom }}</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row g-3">
                                            <div class="col-md-6">
                                                <strong>Référence:</strong> {{ selectedProjet.reference }}
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Bien:</strong> {{ selectedProjet.bien }}
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Type:</strong> {{ selectedProjet.type }}
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Statut:</strong>
                                                <span class="badge" :class="getStatutBadgeClass(selectedProjet.statut)">
                                                    {{ selectedProjet.statut }}
                                                </span>
                                            </div>
                                            <div class="col-12">
                                                <strong>Description:</strong>
                                                <p class="mb-0">{{ selectedProjet.description }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Planning et Budget -->
                                <div class="card mb-3">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0">Planning et Budget</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row g-3">
                                            <div class="col-md-6">
                                                <strong>Date début:</strong> {{ formatDate(selectedProjet.dateDebut) }}
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Date fin prévue:</strong> {{ formatDate(selectedProjet.dateFin)
                                                }}
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Durée:</strong> {{ calculerDuree(selectedProjet) }} jours
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Budget total:</strong> {{ formatCurrency(selectedProjet.budget)
                                                }}
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Dépenses:</strong> {{ formatCurrency(selectedProjet.depenseReel)
                                                }}
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Reste:</strong>
                                                <span
                                                    :class="selectedProjet.budget - selectedProjet.depenseReel >= 0 ? 'text-success' : 'text-danger'">
                                                    {{ formatCurrency(selectedProjet.budget -
                                                        selectedProjet.depenseReel) }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Étapes -->
                                <div class="card mb-3">
                                    <div class="card-header bg-light d-flex justify-content-between align-items-center">
                                        <h6 class="mb-0">Étapes du Projet</h6>
                                        <button class="btn btn-sm btn-primary" @click="ajouterEtape(selectedProjet)">
                                            <i class="bi bi-plus"></i>
                                        </button>
                                    </div>
                                    <div class="card-body">
                                        <div v-if="selectedProjet.etapes && selectedProjet.etapes.length > 0">
                                            <div v-for="(etape, index) in selectedProjet.etapes" :key="index"
                                                class="border-bottom pb-3 mb-3">
                                                <div class="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <h6>{{ etape.nom }}</h6>
                                                        <small class="text-muted">
                                                            {{ formatDate(etape.dateDebut) }} - {{
                                                                formatDate(etape.dateFin) }}
                                                        </small>
                                                    </div>
                                                    <span class="badge" :class="getStatutEtapeBadgeClass(etape.statut)">
                                                        {{ etape.statut }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <p v-else class="text-muted">Aucune étape définie</p>
                                    </div>
                                </div>

                                <!-- Dépenses -->
                                <div class="card">
                                    <div class="card-header bg-light d-flex justify-content-between align-items-center">
                                        <h6 class="mb-0">Dépenses</h6>
                                        <button class="btn btn-sm btn-primary" @click="ajouterDepense(selectedProjet)">
                                            <i class="bi bi-plus"></i>
                                        </button>
                                    </div>
                                    <div class="card-body">
                                        <div v-if="selectedProjet.depenses && selectedProjet.depenses.length > 0">
                                            <div class="table-responsive">
                                                <table class="table table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th>Date</th>
                                                            <th>Description</th>
                                                            <th>Montant</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(depense, index) in selectedProjet.depenses"
                                                            :key="index">
                                                            <td>{{ formatDate(depense.date) }}</td>
                                                            <td>{{ depense.description }}</td>
                                                            <td class="fw-bold">{{ formatCurrency(depense.montant) }}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <p v-else class="text-muted">Aucune dépense enregistrée</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Sidebar -->
                            <div class="col-md-4">
                                <!-- Actions -->
                                <div class="card mb-3">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0">Actions</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="d-grid gap-2">
                                            <button class="btn btn-primary" @click="modifierProjet(selectedProjet)">
                                                <i class="bi bi-pencil me-2"></i>Modifier
                                            </button>
                                            <button class="btn btn-success" v-if="selectedProjet.avancement === 100"
                                                @click="terminerProjet(selectedProjet)">
                                                <i class="bi bi-check-circle me-2"></i>Marquer terminé
                                            </button>
                                            <button class="btn btn-outline-primary">
                                                <i class="bi bi-printer me-2"></i>Imprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Avancement -->
                                <div class="card mb-3">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0">Avancement</h6>
                                    </div>
                                    <div class="card-body text-center">
                                        <div class="mb-3">
                                            <h2 class="mb-0">{{ selectedProjet.avancement }}%</h2>
                                        </div>
                                        <div class="progress" style="height: 20px;">
                                            <div class="progress-bar"
                                                :class="getProgressClass(selectedProjet.avancement)"
                                                :style="`width: ${selectedProjet.avancement}%`">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Entrepreneur -->
                                <div class="card" v-if="selectedProjet.entrepreneur">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0">Entrepreneur</h6>
                                    </div>
                                    <div class="card-body">
                                        <p class="mb-1"><strong>{{ selectedProjet.entrepreneur }}</strong></p>
                                        <p class="mb-1 small">{{ selectedProjet.entrepreneurContact }}</p>
                                        <p class="mb-0 small">{{ selectedProjet.entrepreneurEmail }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Ajouter Dépense -->
        <div class="modal fade" id="depenseModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Ajouter une Dépense</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="mb-3">
                                <label class="form-label">Date *</label>
                                <input type="date" v-model="depenseForm.date" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Description *</label>
                                <input type="text" v-model="depenseForm.description" class="form-control"
                                    placeholder="Ex: Achat matériaux" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Montant *</label>
                                <input type="number" v-model.number="depenseForm.montant" class="form-control"
                                    step="0.01" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Catégorie</label>
                                <select v-model="depenseForm.categorie" class="form-select">
                                    <option value="MATERIAUX">Matériaux</option>
                                    <option value="MAIN_OEUVRE">Main d'œuvre</option>
                                    <option value="EQUIPEMENT">Équipement</option>
                                    <option value="AUTRE">Autre</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="sauvegarderDepense">
                            <i class="bi bi-save"></i> Ajouter
                        </button>
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
            projets: [],
            biens: [],
            stats: {
                projetsActifs: 0,
                tauxAvancement: 0,
                budgetTotal: 0,
                depenseReel: 0,
                projetsRetard: 0,
                projetsTermines: 0
            },
            filters: {
                statut: '',
                type: '',
                bienId: ''
            },
            projetForm: {
                id: null,
                reference: '',
                nom: '',
                bienId: '',
                type: '',
                priorite: 'MOYENNE',
                description: '',
                dateDebut: '',
                dateFin: '',
                budget: 0,
                depenseReel: 0,
                entrepreneur: '',
                entrepreneurContact: '',
                entrepreneurEmail: '',
                statut: 'PLANIFIE',
                avancement: 0,
                etapes: []
            },
            depenseForm: {
                date: new Date().toISOString().split('T')[0],
                description: '',
                montant: 0,
                categorie: 'MATERIAUX'
            },
            searchQuery: '',
            currentPage: 1,
            perPage: 10,
            isLoading: false,
            selectedProjet: null,
            alertes: []
        };
    },

    computed: {
        filteredProjets() {
            let result = [...this.projets];

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(p =>
                    p.nom?.toLowerCase().includes(query) ||
                    p.entrepreneur?.toLowerCase().includes(query) ||
                    p.reference?.toLowerCase().includes(query)
                );
            }

            if (this.filters.statut) {
                result = result.filter(p => p.statut === this.filters.statut);
            }

            if (this.filters.type) {
                result = result.filter(p => p.type === this.filters.type);
            }

            if (this.filters.bienId) {
                result = result.filter(p => p.bienId === parseInt(this.filters.bienId));
            }

            return result.sort((a, b) => new Date(b.dateDebut) - new Date(a.dateDebut));
        },

        paginatedProjets() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredProjets.slice(start, start + this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filteredProjets.length / this.perPage);
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
            return Math.min(this.startIndex + this.perPage, this.filteredProjets.length);
        }
    },

    mounted() {
        this.fetchProjets();
        this.fetchBiens();
    },

    methods: {
        async fetchProjets() {
            this.isLoading = true;
            try {
                const biens = await this.$store.dispatch("biensImmobiliers/getAll", { page: 0, size: 100 });
                const biensData = biens.content || biens;

                // Générer des projets de travaux
                this.projets = this.genererProjetsDepuisBiens(biensData);
                this.calculerStats();
                this.verifierAlertes();
            } catch (error) {
                console.error("Erreur chargement projets:", error);
                ElMessage.error("Erreur lors du chargement des projets");
            } finally {
                this.isLoading = false;
            }
        },

        async fetchBiens() {
            try {
                const response = await this.$store.dispatch("biensImmobiliers/getAll", { page: 0, size: 100 });
                this.biens = response.content || response;
            } catch (error) {
                console.error("Erreur chargement biens:", error);
            }
        },

        genererProjetsDepuisBiens(biens) {
            const types = ['RENOVATION', 'EXTENSION', 'ENTRETIEN', 'REPARATION', 'AMENAGEMENT'];
            const statuts = ['PLANIFIE', 'EN_COURS', 'EN_PAUSE', 'TERMINE'];

            const projets = [];

            biens.forEach((bien, index) => {
                if (Math.random() > 0.6) { // 40% des biens ont un projet
                    const type = types[Math.floor(Math.random() * types.length)];
                    const statut = statuts[Math.floor(Math.random() * statuts.length)];
                    const dateDebut = this.genererDateRecente();
                    const dateFin = new Date(dateDebut);
                    dateFin.setDate(dateFin.getDate() + Math.floor(Math.random() * 90) + 30);

                    const budget = Math.floor(Math.random() * 500000) + 100000;
                    const depenseReel = statut !== 'PLANIFIE' ? Math.floor(budget * Math.random() * 0.8) : 0;
                    const avancement = this.calculerAvancementSelonStatut(statut);

                    projets.push({
                        id: `TRV-${2025}-${String(index + 1).padStart(4, '0')}`,
                        reference: `TRV-${2025}-${String(index + 1).padStart(4, '0')}`,
                        nom: this.genererNomProjet(type),
                        bienId: bien.id,
                        bien: bien.nom,
                        type: type,
                        priorite: ['HAUTE', 'MOYENNE', 'BASSE'][Math.floor(Math.random() * 3)],
                        description: `Travaux de ${type.toLowerCase()} pour ${bien.nom}`,
                        dateDebut: dateDebut,
                        dateFin: dateFin,
                        budget: budget,
                        depenseReel: depenseReel,
                        statut: statut,
                        avancement: avancement,
                        entrepreneur: ['Entreprise Martin', 'Bâti Pro', 'Réno Expert', 'Construct Plus'][Math.floor(Math.random() * 4)],
                        entrepreneurContact: '+229 97 XX XX XX',
                        entrepreneurEmail: 'contact@entreprise.bj',
                        etapes: this.genererEtapes(type, dateDebut, dateFin),
                        depenses: statut !== 'PLANIFIE' ? this.genererDepenses(depenseReel) : []
                    });
                }
            });

            return projets;
        },

        genererNomProjet(type) {
            const noms = {
                'RENOVATION': ['Rénovation complète', 'Rénovation cuisine', 'Rénovation salle de bain'],
                'EXTENSION': ['Extension maison', 'Ajout véranda', 'Agrandissement'],
                'ENTRETIEN': ['Entretien annuel', 'Maintenance préventive'],
                'REPARATION': ['Réparation toiture', 'Réparation plomberie'],
                'AMENAGEMENT': ['Aménagement intérieur', 'Aménagement extérieur']
            };
            const liste = noms[type] || ['Travaux'];
            return liste[Math.floor(Math.random() * liste.length)];
        },

        genererDateRecente() {
            const now = new Date();
            const daysAgo = Math.floor(Math.random() * 180) - 90; // -90 à +90 jours
            return new Date(now.getTime() + daysAgo * 24 * 60 * 60 * 1000);
        },

        calculerAvancementSelonStatut(statut) {
            switch (statut) {
                case 'PLANIFIE': return 0;
                case 'EN_COURS': return Math.floor(Math.random() * 70) + 10;
                case 'EN_PAUSE': return Math.floor(Math.random() * 50) + 20;
                case 'TERMINE': return 100;
                default: return 0;
            }
        },

        genererEtapes(type, dateDebut, dateFin) {
            const etapesBase = [
                'Préparation du chantier',
                'Travaux principaux',
                'Finitions',
                'Nettoyage final'
            ];

            const duree = (dateFin - dateDebut) / (24 * 60 * 60 * 1000);
            const dureEtape = duree / etapesBase.length;

            return etapesBase.map((nom, index) => {
                const debut = new Date(dateDebut);
                debut.setDate(debut.getDate() + dureEtape * index);
                const fin = new Date(debut);
                fin.setDate(fin.getDate() + dureEtape);

                return {
                    nom,
                    dateDebut: debut,
                    dateFin: fin,
                    statut: index === 0 ? 'TERMINE' : index === 1 ? 'EN_COURS' : 'A_FAIRE'
                };
            });
        },

        genererDepenses(total) {
            const nbDepenses = Math.floor(Math.random() * 5) + 2;
            const depenses = [];
            let reste = total;

            for (let i = 0; i < nbDepenses - 1; i++) {
                const montant = Math.floor(reste * Math.random() * 0.5);
                depenses.push({
                    date: this.genererDateRecente(),
                    description: ['Matériaux', 'Main d\'œuvre', 'Équipement'][Math.floor(Math.random() * 3)],
                    montant: montant,
                    categorie: ['MATERIAUX', 'MAIN_OEUVRE', 'EQUIPEMENT'][Math.floor(Math.random() * 3)]
                });
                reste -= montant;
            }

            depenses.push({
                date: this.genererDateRecente(),
                description: 'Autres frais',
                montant: reste,
                categorie: 'AUTRE'
            });

            return depenses;
        },

        calculerStats() {
            this.stats = {
                projetsActifs: this.projets.filter(p => p.statut === 'EN_COURS').length,
                tauxAvancement: Math.round(
                    this.projets.reduce((sum, p) => sum + p.avancement, 0) /
                    Math.max(this.projets.length, 1)
                ),
                budgetTotal: this.projets.reduce((sum, p) => sum + (p.budget || 0), 0),
                depenseReel: this.projets.reduce((sum, p) => sum + (p.depenseReel || 0), 0),
                projetsRetard: this.projets.filter(p => this.isEnRetard(p)).length,
                projetsTermines: this.projets.filter(p =>
                    p.statut === 'TERMINE' &&
                    new Date(p.dateFin) >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                ).length
            };
        },

        verifierAlertes() {
            this.alertes = this.projets.filter(p =>
                this.isEnRetard(p) ||
                (p.depenseReel > p.budget * 0.9 && p.statut !== 'TERMINE')
            );
        },

        nouveauProjet() {
            this.resetForm();
            this.projetForm.reference = this.genererReference();
            const modal = new bootstrap.Modal(document.getElementById("projetModal"));
            modal.show();
        },

        modifierProjet(projet) {
            this.projetForm = { ...projet };
            bootstrap.Modal.getInstance(document.getElementById("detailsModal"))?.hide();
            const modal = new bootstrap.Modal(document.getElementById("projetModal"));
            modal.show();
        },

        resetForm() {
            this.projetForm = {
                id: null,
                reference: '',
                nom: '',
                bienId: '',
                type: '',
                priorite: 'MOYENNE',
                description: '',
                dateDebut: '',
                dateFin: '',
                budget: 0,
                depenseReel: 0,
                entrepreneur: '',
                entrepreneurContact: '',
                entrepreneurEmail: '',
                statut: 'PLANIFIE',
                avancement: 0,
                etapes: []
            };
        },

        genererReference() {
            const year = new Date().getFullYear();
            const count = this.projets.length + 1;
            return `TRV-${year}-${String(count).padStart(4, '0')}`;
        },

        ajouterEtapeForm() {
            this.projetForm.etapes.push({
                nom: '',
                dateDebut: '',
                dateFin: '',
                statut: 'A_FAIRE'
            });
        },

        supprimerEtapeForm(index) {
            this.projetForm.etapes.splice(index, 1);
        },

        async sauvegarderProjet() {
            try {
                if (!this.projetForm.nom || !this.projetForm.bienId || !this.projetForm.type ||
                    !this.projetForm.dateDebut || !this.projetForm.dateFin) {
                    ElMessage.warning("Veuillez remplir tous les champs obligatoires");
                    return;
                }

                const bien = this.biens.find(b => b.id === parseInt(this.projetForm.bienId));

                if (this.projetForm.id) {
                    const index = this.projets.findIndex(p => p.id === this.projetForm.id);
                    if (index !== -1) {
                        this.projets[index] = {
                            ...this.projetForm,
                            bien: bien?.nom || 'N/A',
                            dateDebut: new Date(this.projetForm.dateDebut),
                            dateFin: new Date(this.projetForm.dateFin)
                        };
                    }
                    ElMessage.success("Projet mis à jour avec succès");
                } else {
                    const newProjet = {
                        id: this.projetForm.reference,
                        ...this.projetForm,
                        bien: bien?.nom || 'N/A',
                        dateDebut: new Date(this.projetForm.dateDebut),
                        dateFin: new Date(this.projetForm.dateFin),
                        depenses: []
                    };
                    this.projets.unshift(newProjet);
                    ElMessage.success("Projet créé avec succès");
                }

                bootstrap.Modal.getInstance(document.getElementById("projetModal")).hide();
                this.resetForm();
                this.calculerStats();
                this.verifierAlertes();
            } catch (error) {
                console.error("Erreur sauvegarde:", error);
                ElMessage.error("Erreur lors de la sauvegarde");
            }
        },

        voirDetails(projet) {
            this.selectedProjet = projet;
            const modal = new bootstrap.Modal(document.getElementById("detailsModal"));
            modal.show();
        },

        ajouterEtape(projet) {
            this.selectedProjet = projet;
            ElMessage.info("Fonctionnalité d'ajout d'étape - À implémenter");
        },

        ajouterDepense(projet) {
            this.selectedProjet = projet;
            this.depenseForm = {
                date: new Date().toISOString().split('T')[0],
                description: '',
                montant: 0,
                categorie: 'MATERIAUX'
            };
            bootstrap.Modal.getInstance(document.getElementById("detailsModal"))?.hide();
            const modal = new bootstrap.Modal(document.getElementById("depenseModal"));
            modal.show();
        },

        sauvegarderDepense() {
            if (!this.depenseForm.description || !this.depenseForm.montant) {
                ElMessage.warning("Veuillez remplir tous les champs obligatoires");
                return;
            }

            if (!this.selectedProjet.depenses) {
                this.selectedProjet.depenses = [];
            }

            this.selectedProjet.depenses.push({
                date: new Date(this.depenseForm.date),
                description: this.depenseForm.description,
                montant: this.depenseForm.montant,
                categorie: this.depenseForm.categorie
            });

            this.selectedProjet.depenseReel += this.depenseForm.montant;

            ElMessage.success("Dépense ajoutée avec succès");
            bootstrap.Modal.getInstance(document.getElementById("depenseModal")).hide();
            this.calculerStats();
        },

        ajouterDocument(projet) {
            ElMessage.info("Fonctionnalité d'ajout de document - À implémenter");
        },

        async mettreEnPause(projet) {
            try {
                projet.statut = 'EN_PAUSE';
                ElMessage.success("Projet mis en pause");
                this.calculerStats();
            } catch (error) {
                ElMessage.error("Erreur lors de la mise en pause");
            }
        },

        async reprendre(projet) {
            try {
                projet.statut = 'EN_COURS';
                ElMessage.success("Projet repris");
                this.calculerStats();
            } catch (error) {
                ElMessage.error("Erreur lors de la reprise");
            }
        },

        async terminerProjet(projet) {
            try {
                projet.statut = 'TERMINE';
                projet.avancement = 100;
                ElMessage.success("Projet marqué comme terminé");
                bootstrap.Modal.getInstance(document.getElementById("detailsModal"))?.hide();
                this.calculerStats();
            } catch (error) {
                ElMessage.error("Erreur lors de la mise à jour");
            }
        },

        async annulerProjet(projet) {
            try {
                projet.statut = 'ANNULE';
                ElMessage.success("Projet annulé");
                this.calculerStats();
            } catch (error) {
                ElMessage.error("Erreur lors de l'annulation");
            }
        },

        async exporterTravaux() {
            try {
                const fileUrl = await this.$store.dispatch("contrats/exportContrats", "xlsx");
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = `suivi-travaux-${new Date().toISOString().split('T')[0]}.xlsx`;
                link.click();
                URL.revokeObjectURL(fileUrl);
                ElMessage.success("Export réussi");
            } catch (error) {
                ElMessage.error("Erreur lors de l'export");
            }
        },

        voirAlertes() {
            this.filters.statut = '';
            this.applyFilters();
            ElMessage.info(`${this.alertes.length} projet(s) nécessite(nt) votre attention`);
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

        getProjetsByStatut(statut) {
            return this.filteredProjets.filter(p => p.statut === statut);
        },

        isEnRetard(projet) {
            const today = new Date();
            const dateFin = new Date(projet.dateFin);
            return today > dateFin && projet.statut !== 'TERMINE' && projet.statut !== 'ANNULE';
        },

        calculerDuree(projet) {
            const debut = new Date(projet.dateDebut);
            const fin = new Date(projet.dateFin);
            return Math.ceil((fin - debut) / (1000 * 60 * 60 * 24));
        },

        getGanttStyle(projet) {
            const debut = new Date(projet.dateDebut);
            const fin = new Date(projet.dateFin);
            const today = new Date();

            const minDate = new Date(Math.min(...this.filteredProjets.map(p => new Date(p.dateDebut))));
            const maxDate = new Date(Math.max(...this.filteredProjets.map(p => new Date(p.dateFin))));

            const totalDuree = (maxDate - minDate) / (1000 * 60 * 60 * 24);
            const offsetDebut = (debut - minDate) / (1000 * 60 * 60 * 24);
            const dureeProjet = (fin - debut) / (1000 * 60 * 60 * 24);

            const left = (offsetDebut / totalDuree) * 100;
            const width = (dureeProjet / totalDuree) * 100;

            return `left: ${left}%; width: ${width}%;`;
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'PLANIFIE': 'bg-secondary',
                'EN_COURS': 'bg-primary',
                'EN_PAUSE': 'bg-warning',
                'TERMINE': 'bg-success',
                'ANNULE': 'bg-danger'
            };
            return classes[statut] || 'bg-secondary';
        },

        getStatutEtapeBadgeClass(statut) {
            const classes = {
                'A_FAIRE': 'bg-secondary',
                'EN_COURS': 'bg-primary',
                'TERMINE': 'bg-success'
            };
            return classes[statut] || 'bg-secondary';
        },

        getProgressClass(avancement) {
            if (avancement < 30) return 'bg-danger';
            if (avancement < 70) return 'bg-warning';
            return 'bg-success';
        },

        getKanbanHeaderClass(statut) {
            const classes = {
                'PLANIFIE': 'bg-secondary text-white',
                'EN_COURS': 'bg-primary text-white',
                'EN_PAUSE': 'bg-warning',
                'TERMINE': 'bg-success text-white'
            };
            return classes[statut] || 'bg-light';
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

.progress {
    background-color: #e9ecef;
}

@media (max-width: 991px) {
    .card-body .row>div {
        margin-bottom: 0.5rem;
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
