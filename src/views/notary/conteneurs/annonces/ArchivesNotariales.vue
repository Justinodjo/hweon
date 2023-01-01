<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">

            <!-- En-tête -->
            <div class="row">
                <div class="col-sm-12 mb-4">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">
                                <i class="bi bi-archive me-2"></i>Archives Notariales
                            </h1>
                            <p class="text-muted mb-0">Gestion et consultation des archives d'actes notariés</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <button @click="showArchiveModal = true" class="btn btn-primary">
                                <i class="bi bi-plus-circle me-1"></i>Archiver un Acte
                            </button>
                            <button @click="rafraichir" class="btn btn-outline-primary">
                                <i class="bi bi-arrow-clockwise"></i>
                            </button>
                            <button @click="exportArchives" class="btn btn-success">
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
                                    <span class="text-muted small">Total Archives</span>
                                    <h3 class="mb-0 mt-2 text-primary">{{ stats.total }}</h3>
                                    <small class="text-muted">
                                        <i class="bi bi-archive me-1"></i>Actes archivés
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-primary bg-opacity-10 text-primary">
                                    <i class="bi bi-archive fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Cette Année</span>
                                    <h3 class="mb-0 mt-2 text-success">{{ stats.cetteAnnee }}</h3>
                                    <small class="text-success">
                                        <i class="bi bi-calendar-check me-1"></i>2024
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-success bg-opacity-10 text-success">
                                    <i class="bi bi-calendar-check fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Documents Numériques</span>
                                    <h3 class="mb-0 mt-2 text-info">{{ stats.numeriques }}</h3>
                                    <small class="text-muted">
                                        <i class="bi bi-file-earmark-pdf me-1"></i>Fichiers
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-info bg-opacity-10 text-info">
                                    <i class="bi bi-file-earmark-pdf fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Espace Utilisé</span>
                                    <h3 class="mb-0 mt-2 text-warning">{{ stats.espaceUtilise }}</h3>
                                    <small class="text-muted">
                                        <i class="bi bi-hdd me-1"></i>GB stockés
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-warning bg-opacity-10 text-warning">
                                    <i class="bi bi-hdd fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Statistiques par Type et Année -->
                <div class="row mb-4">
                    <div class="col-md-6">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Répartition par Type d'Acte</h6>
                            </div>
                            <div class="card-body">
                                <div class="type-stats">
                                    <div v-for="type in typeStats" :key="type.id" class="type-stat-item">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <div class="d-flex align-items-center">
                                                <i class="bi fs-5 me-2" :class="[type.icon, 'text-' + type.color]"></i>
                                                <span>{{ type.label }}</span>
                                            </div>
                                            <strong :class="'text-' + type.color">{{ type.count }}</strong>
                                        </div>
                                        <div class="progress" style="height: 6px;">
                                            <div class="progress-bar" :class="'bg-' + type.color"
                                                :style="{ width: type.percentage + '%' }"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Archives par Année</h6>
                            </div>
                            <div class="card-body">
                                <div class="year-stats">
                                    <div v-for="year in yearStats" :key="year.year" class="year-stat-item">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <div class="d-flex align-items-center">
                                                <i class="bi bi-calendar3 fs-5 me-2 text-primary"></i>
                                                <span>{{ year.year }}</span>
                                            </div>
                                            <strong class="text-primary">{{ year.count }} actes</strong>
                                        </div>
                                        <div class="progress" style="height: 6px;">
                                            <div class="progress-bar bg-primary"
                                                :style="{ width: year.percentage + '%' }"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filtres et Recherche -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <div class="row g-3">
                                    <!-- Recherche -->
                                    <div class="col-md-3">
                                        <div class="position-relative">
                                            <input type="text" class="form-control" placeholder="Rechercher..."
                                                v-model="searchQuery" @input="filterArchives">
                                            <i
                                                class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>

                                    <!-- Filtre Type -->
                                    <div class="col-md-2">
                                        <select v-model="filters.type" @change="filterArchives" class="form-select">
                                            <option value="">Tous les types</option>
                                            <option value="VENTE">Vente</option>
                                            <option value="BAIL">Bail</option>
                                            <option value="DONATION">Donation</option>
                                            <option value="HYPOTHEQUE">Hypothèque</option>
                                            <option value="SUCCESSION">Succession</option>
                                        </select>
                                    </div>

                                    <!-- Filtre Année -->
                                    <div class="col-md-2">
                                        <select v-model="filters.annee" @change="filterArchives" class="form-select">
                                            <option value="">Toutes les années</option>
                                            <option value="2024">2024</option>
                                            <option value="2023">2023</option>
                                            <option value="2022">2022</option>
                                            <option value="2021">2021</option>
                                            <option value="2020">2020</option>
                                        </select>
                                    </div>

                                    <!-- Filtre Lieu -->
                                    <div class="col-md-2">
                                        <select v-model="filters.lieu" @change="filterArchives" class="form-select">
                                            <option value="">Tous les lieux</option>
                                            <option value="PHYSIQUE">Physique</option>
                                            <option value="NUMERIQUE">Numérique</option>
                                            <option value="MIXTE">Mixte</option>
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

                <!-- Vue Grille / Liste / Timeline -->
                <div class="row mb-3">
                    <div class="col-12">
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-outline-primary"
                                :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">
                                <i class="bi bi-grid-3x3 me-1"></i>Grille
                            </button>
                            <button type="button" class="btn btn-outline-primary"
                                :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">
                                <i class="bi bi-list-ul me-1"></i>Liste
                            </button>
                            <button type="button" class="btn btn-outline-primary"
                                :class="{ active: viewMode === 'timeline' }" @click="viewMode = 'timeline'">
                                <i class="bi bi-clock-history me-1"></i>Chronologie
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Vue Grille -->
                <div v-if="viewMode === 'grid'" class="row g-4">
                    <div v-if="paginatedArchives.length === 0" class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-body text-center py-5">
                                <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                <p class="text-muted mb-0">Aucune archive trouvée</p>
                            </div>
                        </div>
                    </div>
                    <div v-else v-for="archive in paginatedArchives" :key="archive.id" class="col-md-6 col-lg-4">
                        <div class="card archive-card shadow-sm h-100" @click="viewArchive(archive)">
                            <div class="card-body">
                                <!-- En-tête -->
                                <div class="d-flex justify-content-between align-items-start mb-3">
                                    <div class="archive-icon"
                                        :class="'bg-' + getTypeColor(archive.type) + ' bg-opacity-10'">
                                        <i class="bi fs-3"
                                            :class="[getTypeIcon(archive.type), 'text-' + getTypeColor(archive.type)]"></i>
                                    </div>
                                    <span class="badge" :class="'bg-' + getTypeColor(archive.type)">
                                        {{ getTypeLabel(archive.type) }}
                                    </span>
                                </div>

                                <!-- Référence et titre -->
                                <div class="mb-3">
                                    <strong class="text-primary d-block mb-1">#{{ archive.reference }}</strong>
                                    <h6 class="mb-0">{{ archive.titre }}</h6>
                                </div>

                                <!-- Informations -->
                                <div class="archive-info">
                                    <div class="info-item">
                                        <i class="bi bi-calendar-event text-muted me-2"></i>
                                        <small class="text-muted">{{ formatDate(archive.dateActe) }}</small>
                                    </div>
                                    <div class="info-item">
                                        <i class="bi bi-geo-alt text-muted me-2"></i>
                                        <small class="text-muted">{{ archive.localisation }}</small>
                                    </div>
                                    <div class="info-item">
                                        <i class="bi bi-person text-muted me-2"></i>
                                        <small class="text-muted">{{ archive.notaire }}</small>
                                    </div>
                                </div>

                                <!-- Documents -->
                                <div class="mt-3 pt-3 border-top">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <small class="text-muted">
                                            <i class="bi bi-file-earmark-text me-1"></i>
                                            {{ archive.nombreDocuments }} document(s)
                                        </small>
                                        <div class="archive-badges">
                                            <span v-if="archive.numerique"
                                                class="badge bg-info bg-opacity-10 text-info">
                                                <i class="bi bi-cloud"></i>
                                            </span>
                                            <span v-if="archive.physique"
                                                class="badge bg-success bg-opacity-10 text-success">
                                                <i class="bi bi-archive"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Pagination pour Grid -->
                    <div v-if="filteredArchives.length > perPage" class="col-12">
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

                <!-- Vue Liste -->
                <div v-if="viewMode === 'list'" class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">
                                    Liste des Archives
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ filteredArchives.length }} archives
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
                                                <th>Date de l'Acte</th>
                                                <th>Notaire</th>
                                                <th>Localisation</th>
                                                <th>Documents</th>
                                                <th>Stockage</th>
                                                <th class="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="paginatedArchives.length === 0">
                                                <td colspan="8" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucune archive trouvée</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="archive in paginatedArchives" :key="archive.id">
                                                <td>
                                                    <strong class="text-primary">#{{ archive.reference }}</strong>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span class="badge mb-1"
                                                            :class="'bg-' + getTypeColor(archive.type)">
                                                            <i class="bi" :class="getTypeIcon(archive.type)"></i>
                                                            {{ getTypeLabel(archive.type) }}
                                                        </span>
                                                        <div><strong>{{ archive.titre }}</strong></div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <small class="text-muted">
                                                        <i class="bi bi-calendar-event me-1"></i>
                                                        {{ formatDate(archive.dateActe) }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div
                                                            class="avatar bg-primary bg-opacity-10 rounded-circle me-2 p-2">
                                                            <i class="bi bi-person fs-6 text-primary"></i>
                                                        </div>
                                                        <span>{{ archive.notaire }}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <small class="text-muted">
                                                        <i class="bi bi-geo-alt me-1"></i>
                                                        {{ archive.localisation }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <span class="badge bg-light text-dark">
                                                        <i class="bi bi-file-earmark-text me-1"></i>
                                                        {{ archive.nombreDocuments }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div class="d-flex gap-1">
                                                        <span v-if="archive.physique" class="badge bg-success"
                                                            title="Archive physique">
                                                            <i class="bi bi-archive"></i>
                                                        </span>
                                                        <span v-if="archive.numerique" class="badge bg-info"
                                                            title="Archive numérique">
                                                            <i class="bi bi-cloud"></i>
                                                        </span>
                                                    </div>
                                                </td>
                                                <td class="text-end">
                                                    <div class="dropdown">
                                                        <button class="btn btn-sm btn-light" type="button"
                                                            :id="'dropdown-' + archive.id" data-bs-toggle="dropdown">
                                                            <i class="bi bi-three-dots-vertical"></i>
                                                        </button>
                                                        <ul class="dropdown-menu dropdown-menu-end">
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="viewArchive(archive)">
                                                                    <i class="bi bi-eye me-2"></i>Voir détails
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="telechargerArchive(archive)">
                                                                    <i class="bi bi-download me-2"></i>Télécharger
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="imprimerFiche(archive)">
                                                                    <i class="bi bi-printer me-2"></i>Imprimer fiche
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <hr class="dropdown-divider">
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="editArchive(archive)">
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
                                <div v-if="filteredArchives.length > perPage" class="card-footer border-top">
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

                <!-- Vue Timeline -->
                <div v-if="viewMode === 'timeline'" class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Chronologie des Archives</h6>
                            </div>
                            <div class="card-body">
                                <div class="timeline">
                                    <div v-for="(group, year) in groupedByYear" :key="year" class="timeline-year-group">
                                        <div class="timeline-year-header">
                                            <h5 class="text-primary">
                                                <i class="bi bi-calendar3 me-2"></i>{{ year }}
                                                <span class="badge bg-primary ms-2">{{ group.length }}</span>
                                            </h5>
                                        </div>
                                        <div class="timeline-items">
                                            <div v-for="archive in group.slice(0, 5)" :key="archive.id"
                                                class="timeline-item" @click="viewArchive(archive)">
                                                <div class="timeline-marker"
                                                    :class="'bg-' + getTypeColor(archive.type)"></div>
                                                <div class="timeline-content">
                                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                                        <div>
                                                            <strong class="text-primary">#{{ archive.reference
                                                            }}</strong>
                                                            <span class="badge ms-2"
                                                                :class="'bg-' + getTypeColor(archive.type)">
                                                                {{ getTypeLabel(archive.type) }}
                                                            </span>
                                                        </div>
                                                        <small class="text-muted">{{ formatDate(archive.dateActe)
                                                        }}</small>
                                                    </div>
                                                    <h6 class="mb-2">{{ archive.titre }}</h6>
                                                    <div class="row g-2">
                                                        <div class="col-md-4">
                                                            <small class="text-muted">
                                                                <i class="bi bi-person me-1"></i>{{ archive.notaire }}
                                                            </small>
                                                        </div>
                                                        <div class="col-md-4">
                                                            <small class="text-muted">
                                                                <i class="bi bi-geo-alt me-1"></i>{{
                                                                    archive.localisation }}
                                                            </small>
                                                        </div>
                                                        <div class="col-md-4">
                                                            <small class="text-muted">
                                                                <i class="bi bi-file-earmark-text me-1"></i>
                                                                {{ archive.nombreDocuments }} doc(s)
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Détails Archive -->
        <div v-if="selectedArchive" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Archive #{{ selectedArchive.reference }}
                            <span class="badge ms-2" :class="'bg-' + getTypeColor(selectedArchive.type)">
                                {{ getTypeLabel(selectedArchive.type) }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedArchive = null"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-4">
                            <!-- Informations Générales -->
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-info-circle me-2"></i>Informations de l'Acte
                                        </h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Type</label>
                                            <p class="mb-0">
                                                <span class="badge" :class="'bg-' + getTypeColor(selectedArchive.type)">
                                                    {{ getTypeLabel(selectedArchive.type) }}
                                                </span>
                                            </p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Titre</label>
                                            <p class="mb-0 fw-bold">{{ selectedArchive.titre }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Date de l'acte</label>
                                            <p class="mb-0">{{ formatDateLong(selectedArchive.dateActe) }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Notaire</label>
                                            <p class="mb-0">{{ selectedArchive.notaire }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Localisation et Stockage -->
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-geo-alt me-2"></i>Localisation et Stockage
                                        </h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Emplacement physique</label>
                                            <p class="mb-0">{{ selectedArchive.localisation }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Référence rangement</label>
                                            <p class="mb-0">{{ selectedArchive.referenceRangement }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Type de stockage</label>
                                            <p class="mb-0">
                                                <span v-if="selectedArchive.physique" class="badge bg-success me-1">
                                                    <i class="bi bi-archive me-1"></i>Physique
                                                </span>
                                                <span v-if="selectedArchive.numerique" class="badge bg-info">
                                                    <i class="bi bi-cloud me-1"></i>Numérique
                                                </span>
                                            </p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Date d'archivage</label>
                                            <p class="mb-0">{{ formatDate(selectedArchive.dateArchivage) }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Parties Concernées -->
                            <div class="col-12">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-people me-2"></i>Parties Concernées
                                        </h6>
                                        <div class="row g-3">
                                            <div v-for="partie in selectedArchive.parties" :key="partie.id"
                                                class="col-md-6">
                                                <div class="d-flex align-items-start p-3 bg-white rounded">
                                                    <div
                                                        class="avatar bg-primary bg-opacity-10 rounded-circle me-3 p-2">
                                                        <i class="bi bi-person fs-5 text-primary"></i>
                                                    </div>
                                                    <div>
                                                        <strong>{{ partie.nom }}</strong>
                                                        <div class="text-muted small">{{ partie.qualite }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Documents Associés -->
                            <div class="col-12">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-files me-2"></i>Documents Associés ({{
                                                selectedArchive.documents.length }})
                                        </h6>
                                        <div class="documents-list">
                                            <div v-for="doc in selectedArchive.documents" :key="doc.id"
                                                class="document-item p-3 mb-2 bg-white rounded">
                                                <div class="d-flex align-items-center justify-content-between">
                                                    <div class="d-flex align-items-center">
                                                        <i class="bi fs-3 me-3" :class="getDocumentIcon(doc.type)"></i>
                                                        <div>
                                                            <strong>{{ doc.nom }}</strong>
                                                            <div class="text-muted small">{{ doc.taille }} • {{ doc.type
                                                            }}</div>
                                                        </div>
                                                    </div>
                                                    <div class="btn-group btn-group-sm">
                                                        <button class="btn btn-outline-primary"
                                                            @click="previsualiserDocument(doc)">
                                                            <i class="bi bi-eye"></i>
                                                        </button>
                                                        <button class="btn btn-outline-success"
                                                            @click="telechargerDocument(doc)">
                                                            <i class="bi bi-download"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Historique des Accès -->
                            <div class="col-12"
                                v-if="selectedArchive.historique && selectedArchive.historique.length > 0">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-clock-history me-2"></i>Historique des Accès
                                        </h6>
                                        <div class="historique-list">
                                            <div v-for="h in selectedArchive.historique" :key="h.id"
                                                class="historique-item p-2 mb-2 bg-white rounded">
                                                <div class="d-flex justify-content-between">
                                                    <div>
                                                        <i class="bi bi-person-circle me-2"></i>
                                                        <strong>{{ h.utilisateur }}</strong>
                                                        <span class="text-muted ms-2">{{ h.action }}</span>
                                                    </div>
                                                    <small class="text-muted">{{ formatDate(h.date) }}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Notes -->
                            <div class="col-12" v-if="selectedArchive.notes">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-sticky me-2"></i>Notes
                                        </h6>
                                        <p class="mb-0">{{ selectedArchive.notes }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="selectedArchive = null">
                            Fermer
                        </button>
                        <button type="button" class="btn btn-info" @click="imprimerFiche(selectedArchive)">
                            <i class="bi bi-printer me-1"></i>Imprimer Fiche
                        </button>
                        <button type="button" class="btn btn-success" @click="telechargerArchive(selectedArchive)">
                            <i class="bi bi-download me-1"></i>Télécharger Tout
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Archivage -->
        <div v-if="showArchiveModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ editMode ? 'Modifier' : 'Archiver' }} un Acte
                        </h5>
                        <button type="button" class="btn-close" @click="closeArchiveModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Type d'acte *</label>
                                <select v-model="archiveForm.type" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="VENTE">Vente</option>
                                    <option value="BAIL">Bail</option>
                                    <option value="DONATION">Donation</option>
                                    <option value="HYPOTHEQUE">Hypothèque</option>
                                    <option value="SUCCESSION">Succession</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date de l'acte *</label>
                                <input type="date" v-model="archiveForm.dateActe" class="form-control" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Titre de l'acte *</label>
                                <input type="text" v-model="archiveForm.titre" class="form-control"
                                    placeholder="Ex: Vente appartement Cocody" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Notaire responsable *</label>
                                <select v-model="archiveForm.notaireId" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="1">Me. Kouassi</option>
                                    <option value="2">Me. Kone</option>
                                    <option value="3">Me. Diallo</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Localisation physique *</label>
                                <input type="text" v-model="archiveForm.localisation" class="form-control"
                                    placeholder="Ex: Salle d'archives - Rayon A3" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Référence rangement</label>
                                <input type="text" v-model="archiveForm.referenceRangement" class="form-control"
                                    placeholder="Ex: 2024-A-125">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Type de stockage *</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" v-model="archiveForm.physique"
                                        id="physique">
                                    <label class="form-check-label" for="physique">
                                        Archive physique
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" v-model="archiveForm.numerique"
                                        id="numerique">
                                    <label class="form-check-label" for="numerique">
                                        Archive numérique
                                    </label>
                                </div>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Notes</label>
                                <textarea v-model="archiveForm.notes" class="form-control" rows="3"
                                    placeholder="Remarques, observations..."></textarea>
                            </div>

                            <!-- Parties -->
                            <div class="col-12">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <label class="form-label mb-0">Parties concernées</label>
                                    <button type="button" class="btn btn-sm btn-outline-primary" @click="ajouterPartie">
                                        <i class="bi bi-plus-circle me-1"></i>Ajouter
                                    </button>
                                </div>
                                <div v-for="(partie, index) in archiveForm.parties" :key="index" class="card mb-2">
                                    <div class="card-body p-3">
                                        <div class="row g-2">
                                            <div class="col-md-5">
                                                <input type="text" v-model="partie.nom"
                                                    class="form-control form-control-sm" placeholder="Nom complet">
                                            </div>
                                            <div class="col-md-4">
                                                <input type="text" v-model="partie.qualite"
                                                    class="form-control form-control-sm"
                                                    placeholder="Qualité (vendeur, acheteur...)">
                                            </div>
                                            <div class="col-md-3">
                                                <button type="button" class="btn btn-sm btn-outline-danger w-100"
                                                    @click="retirerPartie(index)">
                                                    <i class="bi bi-trash"></i> Retirer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeArchiveModal">
                            Annuler
                        </button>
                        <button type="button" class="btn btn-primary" @click="saveArchive">
                            <i class="bi bi-check-circle me-1"></i>
                            {{ editMode ? 'Modifier' : 'Archiver' }}
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
    name: 'ArchivesNotariales',

    data() {
        return {
            loading: true,
            viewMode: 'grid',
            searchQuery: '',
            currentPage: 1,
            perPage: 12,
            selectedArchive: null,
            showArchiveModal: false,
            editMode: false,

            filters: {
                type: '',
                annee: '',
                lieu: ''
            },

            archiveForm: {
                id: null,
                type: '',
                dateActe: '',
                titre: '',
                notaireId: '',
                localisation: '',
                referenceRangement: '',
                physique: true,
                numerique: false,
                notes: '',
                parties: []
            },

            archives: [],
            stats: {
                total: 0,
                cetteAnnee: 0,
                numeriques: 0,
                espaceUtilise: 0
            },

            typeStats: [],
            yearStats: []
        };
    },

    computed: {
        filteredArchives() {
            let result = [...this.archives];

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(a =>
                    a.reference.toLowerCase().includes(query) ||
                    a.titre.toLowerCase().includes(query) ||
                    a.notaire.toLowerCase().includes(query)
                );
            }

            if (this.filters.type) {
                result = result.filter(a => a.type === this.filters.type);
            }

            if (this.filters.annee) {
                result = result.filter(a => new Date(a.dateActe).getFullYear() === parseInt(this.filters.annee));
            }

            if (this.filters.lieu) {
                if (this.filters.lieu === 'PHYSIQUE') {
                    result = result.filter(a => a.physique);
                } else if (this.filters.lieu === 'NUMERIQUE') {
                    result = result.filter(a => a.numerique);
                } else if (this.filters.lieu === 'MIXTE') {
                    result = result.filter(a => a.physique && a.numerique);
                }
            }

            return result.sort((a, b) => new Date(b.dateActe) - new Date(a.dateActe));
        },

        paginatedArchives() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredArchives.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.filteredArchives.length / this.perPage);
        },

        groupedByYear() {
            const groups = {};
            this.filteredArchives.forEach(archive => {
                const year = new Date(archive.dateActe).getFullYear();
                if (!groups[year]) {
                    groups[year] = [];
                }
                groups[year].push(archive);
            });
            return groups;
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
                this.archives = Array.from({ length: 50 }, (_, i) => {
                    const year = 2024 - Math.floor(Math.random() * 5);
                    const month = Math.floor(Math.random() * 12);
                    const day = Math.floor(Math.random() * 28) + 1;

                    return {
                        id: i + 1,
                        reference: `ARC-${year}-${String(i + 1).padStart(4, '0')}`,
                        type: ['VENTE', 'BAIL', 'DONATION', 'HYPOTHEQUE', 'SUCCESSION'][Math.floor(Math.random() * 5)],
                        titre: `Acte archivé ${i + 1}`,
                        dateActe: new Date(year, month, day).toISOString().split('T')[0],
                        dateArchivage: new Date(year, month, day + 5).toISOString().split('T')[0],
                        notaire: ['Me. Kouassi', 'Me. Kone', 'Me. Diallo'][Math.floor(Math.random() * 3)],
                        notaireId: String(Math.floor(Math.random() * 3) + 1),
                        localisation: ['Salle A - Rayon 1', 'Salle B - Rayon 3', 'Salle C - Rayon 2'][Math.floor(Math.random() * 3)],
                        referenceRangement: `${year}-A-${String(i + 1).padStart(3, '0')}`,
                        physique: Math.random() > 0.3,
                        numerique: Math.random() > 0.2,
                        nombreDocuments: Math.floor(Math.random() * 8) + 2,
                        parties: Array.from({ length: Math.floor(Math.random() * 3) + 2 }, (_, j) => ({
                            id: j + 1,
                            nom: `Partie ${j + 1}`,
                            qualite: ['Vendeur', 'Acheteur', 'Donateur', 'Bénéficiaire'][Math.floor(Math.random() * 4)]
                        })),
                        documents: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
                            id: j + 1,
                            nom: `Document_${j + 1}.pdf`,
                            type: 'PDF',
                            taille: `${Math.floor(Math.random() * 10) + 1} MB`
                        })),
                        historique: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
                            id: j + 1,
                            utilisateur: ['Me. Kouassi', 'Me. Kone', 'Assistant'][Math.floor(Math.random() * 3)],
                            action: ['Consultation', 'Téléchargement', 'Modification'][Math.floor(Math.random() * 3)],
                            date: new Date(year, month, day + j + 10).toISOString().split('T')[0]
                        })),
                        notes: Math.random() > 0.6 ? 'Notes importantes sur cette archive' : null
                    };
                });

                this.calculateStats();
                this.calculateTypeStats();
                this.calculateYearStats();

            } catch (error) {
                console.error('Erreur:', error);
                ElMessage.error('Erreur lors du chargement');
            } finally {
                this.loading = false;
            }
        },

        calculateStats() {
            this.stats.total = this.archives.length;
            this.stats.cetteAnnee = this.archives.filter(a =>
                new Date(a.dateActe).getFullYear() === 2024
            ).length;
            this.stats.numeriques = this.archives.filter(a => a.numerique).length;
            this.stats.espaceUtilise = (Math.random() * 500).toFixed(1);
        },

        calculateTypeStats() {
            const types = [
                { id: 'VENTE', label: 'Ventes', icon: 'bi-house-door', color: 'primary' },
                { id: 'BAIL', label: 'Baux', icon: 'bi-key', color: 'success' },
                { id: 'DONATION', label: 'Donations', icon: 'bi-gift', color: 'info' },
                { id: 'HYPOTHEQUE', label: 'Hypothèques', icon: 'bi-bank', color: 'warning' },
                { id: 'SUCCESSION', label: 'Successions', icon: 'bi-tree', color: 'danger' }
            ];

            this.typeStats = types.map(type => {
                const count = this.archives.filter(a => a.type === type.id).length;
                return {
                    ...type,
                    count: count,
                    percentage: this.stats.total > 0 ? Math.round((count / this.stats.total) * 100) : 0
                };
            });
        },

        calculateYearStats() {
            const years = {};
            this.archives.forEach(archive => {
                const year = new Date(archive.dateActe).getFullYear();
                years[year] = (years[year] || 0) + 1;
            });

            const maxCount = Math.max(...Object.values(years));
            this.yearStats = Object.keys(years)
                .sort((a, b) => b - a)
                .slice(0, 5)
                .map(year => ({
                    year: year,
                    count: years[year],
                    percentage: Math.round((years[year] / maxCount) * 100)
                }));
        },

        filterArchives() {
            this.currentPage = 1;
        },

        resetFilters() {
            this.searchQuery = '';
            this.filters = {
                type: '',
                annee: '',
                lieu: ''
            };
            this.currentPage = 1;
        },

        viewArchive(archive) {
            this.selectedArchive = archive;
        },

        editArchive(archive) {
            this.editMode = true;
            this.archiveForm = {
                ...archive,
                parties: archive.parties.map(p => ({ ...p }))
            };
            this.showArchiveModal = true;
        },

        closeArchiveModal() {
            this.showArchiveModal = false;
            this.editMode = false;
            this.archiveForm = {
                id: null,
                type: '',
                dateActe: '',
                titre: '',
                notaireId: '',
                localisation: '',
                referenceRangement: '',
                physique: true,
                numerique: false,
                notes: '',
                parties: []
            };
        },

        saveArchive() {
            try {
                if (!this.archiveForm.type || !this.archiveForm.dateActe ||
                    !this.archiveForm.titre || !this.archiveForm.notaireId ||
                    !this.archiveForm.localisation) {
                    ElMessage.warning('Veuillez remplir tous les champs obligatoires');
                    return;
                }

                if (!this.archiveForm.physique && !this.archiveForm.numerique) {
                    ElMessage.warning('Veuillez sélectionner au moins un type de stockage');
                    return;
                }

                if (this.editMode) {
                    ElMessage.success('Archive modifiée avec succès!');
                } else {
                    ElMessage.success('Acte archivé avec succès!');
                }
                this.closeArchiveModal();
                this.loadData();
            } catch (error) {
                console.error('Erreur:', error);
                ElMessage.error('Erreur lors de la sauvegarde');
            }
        },

        ajouterPartie() {
            this.archiveForm.parties.push({
                nom: '',
                qualite: ''
            });
        },

        retirerPartie(index) {
            this.archiveForm.parties.splice(index, 1);
        },

        telechargerArchive(archive) {
            ElMessage.success('Téléchargement de l\'archive en cours...');
            if (this.selectedArchive) {
                this.selectedArchive = null;
            }
        },

        telechargerDocument(doc) {
            ElMessage.success(`Téléchargement de ${doc.nom}...`);
        },

        previsualiserDocument(doc) {
            ElMessage.info(`Prévisualisation de ${doc.nom}...`);
        },

        imprimerFiche(archive) {
            ElMessage.success('Impression de la fiche d\'archive...');
            if (this.selectedArchive) {
                this.selectedArchive = null;
            }
        },

        exportArchives() {
            ElMessage.success('Export des archives en cours...');
        },

        rafraichir() {
            this.loadData();
            ElMessage.success('Données mises à jour !');
        },

        // Helpers
        getTypeLabel(type) {
            const labels = {
                'VENTE': 'Vente',
                'BAIL': 'Bail',
                'DONATION': 'Donation',
                'HYPOTHEQUE': 'Hypothèque',
                'SUCCESSION': 'Succession'
            };
            return labels[type] || type;
        },

        getTypeIcon(type) {
            const icons = {
                'VENTE': 'bi-house-door',
                'BAIL': 'bi-key',
                'DONATION': 'bi-gift',
                'HYPOTHEQUE': 'bi-bank',
                'SUCCESSION': 'bi-tree'
            };
            return icons[type] || 'bi-file-earmark';
        },

        getTypeColor(type) {
            const colors = {
                'VENTE': 'primary',
                'BAIL': 'success',
                'DONATION': 'info',
                'HYPOTHEQUE': 'warning',
                'SUCCESSION': 'danger'
            };
            return colors[type] || 'secondary';
        },

        getDocumentIcon(type) {
            return type === 'PDF' ? 'bi-file-earmark-pdf text-danger' : 'bi-file-earmark text-primary';
        },

        formatDate(dateStr) {
            if (!dateStr) return '—';
            return new Date(dateStr).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },

        formatDateLong(dateStr) {
            if (!dateStr) return '—';
            return new Date(dateStr).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
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

/* Statistiques */
.type-stats,
.year-stats {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.type-stat-item,
.year-stat-item {
    padding: 10px;
    border-radius: 8px;
    background: #f8f9fa;
}

/* Cartes d'archives */
.archive-card {
    cursor: pointer;
    transition: all 0.3s;
    border-left: 4px solid transparent;
}

.archive-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}

.archive-icon {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
}

.archive-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-item {
    display: flex;
    align-items: center;
}

.archive-badges {
    display: flex;
    gap: 5px;
}

/* Timeline */
.timeline {
    position: relative;
    padding: 20px 0;
}

.timeline-year-group {
    margin-bottom: 40px;
}

.timeline-year-header {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #dee2e6;
}

.timeline-items {
    position: relative;
    padding-left: 40px;
}

.timeline-items::before {
    content: '';
    position: absolute;
    left: 12px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #dee2e6;
}

.timeline-item {
    position: relative;
    padding: 20px;
    margin-bottom: 20px;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
}

.timeline-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateX(5px);
}

.timeline-marker {
    position: absolute;
    left: -34px;
    top: 25px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 0 0 2px #dee2e6;
}

/* Documents */
.documents-list {
    max-height: 400px;
    overflow-y: auto;
}

.document-item {
    border: 1px solid #dee2e6;
    transition: all 0.2s;
}

.document-item:hover {
    background: #f8f9fa !important;
    border-color: #0d6efd;
}

.historique-list {
    max-height: 300px;
    overflow-y: auto;
}

.historique-item {
    border: 1px solid #dee2e6;
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
.documents-list::-webkit-scrollbar,
.historique-list::-webkit-scrollbar {
    width: 8px;
}

.documents-list::-webkit-scrollbar-track,
.historique-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.documents-list::-webkit-scrollbar-thumb,
.historique-list::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}

.documents-list::-webkit-scrollbar-thumb:hover,
.historique-list::-webkit-scrollbar-thumb:hover {
    background: #555;
}

/* Responsive */
@media (max-width: 768px) {
    .icon-lg {
        width: 50px;
        height: 50px;
    }

    .archive-icon {
        width: 50px;
        height: 50px;
    }

    .timeline-items {
        padding-left: 30px;
    }

    .timeline-marker {
        left: -24px;
    }

    .type-stats,
    .year-stats {
        gap: 10px;
    }
}

/* Animation pour les cartes */
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

.archive-card {
    animation: fadeIn 0.3s ease-in-out;
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