<template>
    <main>
        <section class="pt-0">
            <div class="container vstack gap-4">
                <!-- Title -->
                <div class="row">
                    <div class="col-12">
                        <h1 class="fs-4 mb-0">
                            <i class="bi bi-file-earmark-text fa-fw me-1"></i>Suivi des Contrats et Baux
                        </h1>
                        <p class="text-muted mb-0">Gestion complète des contrats de location</p>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="row g-4">
                    <!-- Contrats Actifs -->
                    <div class="col-md-6 col-xl-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">Contrats Actifs</h6>
                                    <h2 class="mb-0 text-success">{{ stats.actifs }}</h2>
                                    <p class="mb-0 small text-muted mt-2">
                                        <i class="bi bi-check-circle me-1"></i>En cours
                                    </p>
                                </div>
                                <div class="bg-success bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-file-check fs-4 text-success"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- À Renouveler -->
                    <div class="col-md-6 col-xl-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">À Renouveler</h6>
                                    <h2 class="mb-0 text-warning">{{ stats.aRenouveler }}</h2>
                                    <p class="mb-0 small text-muted mt-2">
                                        <i class="bi bi-clock-history me-1"></i>Dans 30 jours
                                    </p>
                                </div>
                                <div class="bg-warning bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-arrow-repeat fs-4 text-warning"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Expirés -->
                    <div class="col-md-6 col-xl-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">Expirés</h6>
                                    <h2 class="mb-0 text-danger">{{ stats.expires }}</h2>
                                    <p class="mb-0 small text-muted mt-2">
                                        <i class="bi bi-exclamation-triangle me-1"></i>Action requise
                                    </p>
                                </div>
                                <div class="bg-danger bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-x-circle fs-4 text-danger"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Archivés -->
                    <div class="col-md-6 col-xl-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">Archivés</h6>
                                    <h2 class="mb-0 text-secondary">{{ stats.archives }}</h2>
                                    <p class="mb-0 small text-muted mt-2">
                                        <i class="bi bi-archive me-1"></i>Terminés
                                    </p>
                                </div>
                                <div class="bg-secondary bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-archive fs-4 text-secondary"></i>
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
                                <div class="row g-3">
                                    <!-- Recherche globale -->
                                    <div class="col-md-4">
                                        <input type="text" class="form-control"
                                            placeholder="Rechercher un contrat, locataire..." v-model="searchQuery"
                                            @input="filterContracts">
                                        <i
                                            class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                    </div>

                                    <!-- Filtre Statut -->
                                    <div class="col-md-2">
                                        <select v-model="filters.status" @change="filterContracts" class="form-select">
                                            <option value="">Tous les statuts</option>
                                            <option value="ACTIF">Actif</option>
                                            <option value="EN_ATTENTE">En attente</option>
                                            <option value="EXPIRE">Expiré</option>
                                            <option value="RESILIÉ">Résilié</option>
                                            <option value="ARCHIVE">Archivé</option>
                                        </select>
                                    </div>

                                    <!-- Filtre Type -->
                                    <div class="col-md-2">
                                        <select v-model="filters.type" @change="filterContracts" class="form-select">
                                            <option value="">Tous les types</option>
                                            <option value="LOCATION">Location</option>
                                            <option value="BAIL_COMMERCIAL">Bail Commercial</option>
                                            <option value="BAIL_HABITATION">Bail Habitation</option>
                                        </select>
                                    </div>

                                    <!-- Période -->
                                    <div class="col-md-2">
                                        <input type="date" class="form-control" v-model="filters.dateDebut"
                                            @change="filterContracts" placeholder="Date début">
                                    </div>

                                    <div class="col-md-2">
                                        <input type="date" class="form-control" v-model="filters.dateFin"
                                            @change="filterContracts" placeholder="Date fin">
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="d-flex gap-2 mt-3">
                                    <button class="btn btn-primary" @click="showCreateModal = true">
                                        <i class="bi bi-plus-circle me-1"></i>Nouveau contrat
                                    </button>
                                    <button class="btn btn-warning" @click="archiverExpires">
                                        <i class="bi bi-archive me-1"></i>Archiver expirés
                                    </button>
                                    <button class="btn btn-info" @click="exportContracts">
                                        <i class="bi bi-download me-1"></i>Exporter
                                    </button>
                                    <button class="btn btn-secondary" @click="resetFilters">
                                        <i class="bi bi-arrow-counterclockwise me-1"></i>Réinitialiser
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Timeline View / List View Toggle -->
                <div class="row">
                    <div class="col-12">
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-outline-primary"
                                :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">
                                <i class="bi bi-list-ul me-1"></i>Liste
                            </button>
                            <button type="button" class="btn btn-outline-primary"
                                :class="{ active: viewMode === 'timeline' }" @click="viewMode = 'timeline'">
                                <i class="bi bi-calendar3 me-1"></i>Timeline
                            </button>
                            <button type="button" class="btn btn-outline-primary"
                                :class="{ active: viewMode === 'calendar' }" @click="viewMode = 'calendar'">
                                <i class="bi bi-calendar-week me-1"></i>Calendrier
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Contracts List -->
                <div v-if="viewMode === 'list'" class="row">
                    <div class="col-12">
                        <div class="card border">
                            <div class="card-header border-bottom">
                                <h5 class="card-header-title">
                                    Liste des Contrats
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ filteredContracts.length }} contrats
                                    </span>
                                </h5>
                            </div>

                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover align-middle mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th class="px-4">N° Contrat</th>
                                                <th>Propriété</th>
                                                <th>Locataire</th>
                                                <th>Date début</th>
                                                <th>Date fin</th>
                                                <th>Loyer</th>
                                                <th>Statut</th>
                                                <th class="text-end px-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="loading">
                                                <td colspan="8" class="text-center py-5">
                                                    <div class="spinner-border text-primary" role="status">
                                                        <span class="visually-hidden">Chargement...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr v-else-if="paginatedContracts.length === 0">
                                                <td colspan="8" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucun contrat trouvé</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="contrat in paginatedContracts" :key="contrat.id">
                                                <td class="px-4">
                                                    <strong class="text-primary">#{{ contrat.numeroContrat || contrat.id
                                                    }}</strong>
                                                </td>
                                                <td>
                                                    <div>
                                                        <strong>{{ contrat.bienNom }}</strong>
                                                        <small class="text-muted d-block">
                                                            <i class="bi bi-geo-alt me-1"></i>{{ contrat.bienAdresse }}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        {{ contrat.locataireNom }}
                                                        <small v-if="contrat.locataireTel" class="text-muted d-block">
                                                            <i class="bi bi-telephone me-1"></i>{{ contrat.locataireTel
                                                            }}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="badge bg-light text-dark">
                                                        {{ formatDate(contrat.dateDebut) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getDateBadgeClass(contrat.dateFin)">
                                                        {{ formatDate(contrat.dateFin) }}
                                                    </span>
                                                    <small v-if="isExpiringSoon(contrat.dateFin)"
                                                        class="text-warning d-block">
                                                        <i class="bi bi-exclamation-triangle me-1"></i>
                                                        {{ getDaysRemaining(contrat.dateFin) }} jours restants
                                                    </small>
                                                </td>
                                                <td>
                                                    <strong>{{ formatCurrency(contrat.montantLoyer) }}</strong>
                                                    <small class="text-muted d-block">{{ contrat.typePaiement || '/mois'
                                                    }}</small>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getStatusBadgeClass(contrat.status)">
                                                        <i class="bi" :class="getStatusIcon(contrat.status)"></i>
                                                        {{ getStatusLabel(contrat.status) }}
                                                    </span>
                                                </td>
                                                <td class="text-end px-4">
                                                    <div class="dropdown">
                                                        <button class="btn btn-sm btn-light" type="button"
                                                            :id="'dropdown-' + contrat.id" data-bs-toggle="dropdown">
                                                            <i class="bi bi-three-dots-vertical"></i>
                                                        </button>
                                                        <ul class="dropdown-menu dropdown-menu-end">
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="viewContrat(contrat)">
                                                                    <i class="bi bi-eye me-2"></i>Voir détails
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="downloadPDF(contrat.id)">
                                                                    <i class="bi bi-file-pdf me-2"></i>Télécharger PDF
                                                                </a>
                                                            </li>
                                                            <li v-if="canRenew(contrat)">
                                                                <a class="dropdown-item text-warning" href="#"
                                                                    @click.prevent="openRenewModal(contrat)">
                                                                    <i class="bi bi-arrow-repeat me-2"></i>Renouveler
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <hr class="dropdown-divider">
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="editContrat(contrat)">
                                                                    <i class="bi bi-pencil me-2"></i>Modifier
                                                                </a>
                                                            </li>
                                                            <li v-if="contrat.status === 'ACTIF'">
                                                                <a class="dropdown-item text-danger" href="#"
                                                                    @click.prevent="resilierContrat(contrat.id)">
                                                                    <i class="bi bi-x-circle me-2"></i>Résilier
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
                                <div v-if="filteredContracts.length > perPage" class="card-footer border-top">
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

                <!-- Timeline View -->
                <div v-if="viewMode === 'timeline'" class="row">
                    <div class="col-12">
                        <div class="card border">
                            <div class="card-body">
                                <div class="timeline">
                                    <div v-for="(contrat, index) in filteredContracts" :key="contrat.id"
                                        class="timeline-item">
                                        <div class="timeline-marker" :class="getTimelineMarkerClass(contrat.status)">
                                        </div>
                                        <div class="timeline-content card border mb-3">
                                            <div class="card-body">
                                                <div class="d-flex justify-content-between align-items-start mb-2">
                                                    <div>
                                                        <h6 class="mb-1">
                                                            <span class="badge bg-primary me-2">#{{
                                                                contrat.numeroContrat || contrat.id }}</span>
                                                            {{ contrat.bienNom }}
                                                        </h6>
                                                        <p class="text-muted small mb-0">
                                                            <i class="bi bi-person me-1"></i>{{ contrat.locataireNom }}
                                                        </p>
                                                    </div>
                                                    <span class="badge" :class="getStatusBadgeClass(contrat.status)">
                                                        {{ getStatusLabel(contrat.status) }}
                                                    </span>
                                                </div>
                                                <div class="row g-2 mt-2">
                                                    <div class="col-md-3">
                                                        <small class="text-muted d-block">Date début</small>
                                                        <strong>{{ formatDate(contrat.dateDebut) }}</strong>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <small class="text-muted d-block">Date fin</small>
                                                        <strong>{{ formatDate(contrat.dateFin) }}</strong>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <small class="text-muted d-block">Loyer mensuel</small>
                                                        <strong class="text-success">{{
                                                            formatCurrency(contrat.montantLoyer) }}</strong>
                                                    </div>
                                                    <div class="col-md-3 text-end">
                                                        <button class="btn btn-sm btn-outline-primary"
                                                            @click="viewContrat(contrat)">
                                                            Voir détails
                                                        </button>
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

                <!-- Calendar View -->
                <div v-if="viewMode === 'calendar'" class="row">
                    <div class="col-12">
                        <div class="card border">
                            <div class="card-header border-bottom">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h5 class="card-header-title mb-0">Calendrier des Échéances</h5>
                                    <div class="btn-group">
                                        <button class="btn btn-sm btn-outline-primary" @click="previousMonth">
                                            <i class="bi bi-chevron-left"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-primary">
                                            {{ currentMonthYear }}
                                        </button>
                                        <button class="btn btn-sm btn-outline-primary" @click="nextMonth">
                                            <i class="bi bi-chevron-right"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="calendar-grid">
                                    <div class="calendar-header">
                                        <div v-for="day in daysOfWeek" :key="day" class="calendar-day-name">
                                            {{ day }}
                                        </div>
                                    </div>
                                    <div class="calendar-body">
                                        <div v-for="(day, index) in calendarDays" :key="index" class="calendar-day"
                                            :class="{
                                                'other-month': !day.isCurrentMonth,
                                                'today': day.isToday,
                                                'has-event': day.contracts.length > 0
                                            }">
                                            <div class="day-number">{{ day.date }}</div>
                                            <div v-if="day.contracts.length > 0" class="day-events">
                                                <div v-for="contract in day.contracts.slice(0, 2)" :key="contract.id"
                                                    class="event-badge" :class="getEventClass(contract)"
                                                    @click="viewContrat(contract)">
                                                    <small>{{ contract.bienNom }}</small>
                                                </div>
                                                <small v-if="day.contracts.length > 2" class="text-muted">
                                                    +{{ day.contracts.length - 2 }} plus
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
        </section>

        <!-- Modal Détails Contrat -->
        <div v-if="selectedContrat" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Contrat #{{ selectedContrat.numeroContrat || selectedContrat.id }}
                            <span class="badge ms-2" :class="getStatusBadgeClass(selectedContrat.status)">
                                {{ getStatusLabel(selectedContrat.status) }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedContrat = null"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-4">
                            <!-- Informations Propriété -->
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-building me-2"></i>Informations Propriété
                                        </h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Nom du bien</label>
                                            <p class="mb-0 fw-bold">{{ selectedContrat.bienNom }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Adresse</label>
                                            <p class="mb-0">{{ selectedContrat.bienAdresse }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Type</label>
                                            <p class="mb-0">{{ selectedContrat.bienType }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Informations Locataire -->
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-person me-2"></i>Informations Locataire
                                        </h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Nom complet</label>
                                            <p class="mb-0 fw-bold">{{ selectedContrat.locataireNom }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Téléphone</label>
                                            <p class="mb-0">
                                                <i class="bi bi-telephone me-1"></i>{{ selectedContrat.locataireTel ||
                                                    '—' }}
                                            </p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Email</label>
                                            <p class="mb-0">
                                                <i class="bi bi-envelope me-1"></i>{{ selectedContrat.locataireEmail ||
                                                    '—' }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Détails Contrat -->
                            <div class="col-12">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-file-text me-2"></i>Détails du Contrat
                                        </h6>
                                        <div class="row g-3">
                                            <div class="col-md-3">
                                                <label class="text-muted small">Date de début</label>
                                                <p class="mb-0 fw-bold">{{ formatDate(selectedContrat.dateDebut) }}</p>
                                            </div>
                                            <div class="col-md-3">
                                                <label class="text-muted small">Date de fin</label>
                                                <p class="mb-0 fw-bold">{{ formatDate(selectedContrat.dateFin) }}</p>
                                            </div>
                                            <div class="col-md-3">
                                                <label class="text-muted small">Durée</label>
                                                <p class="mb-0">{{ calculateDuration(selectedContrat.dateDebut,
                                                    selectedContrat.dateFin) }}</p>
                                            </div>
                                            <div class="col-md-3">
                                                <label class="text-muted small">Jours restants</label>
                                                <p class="mb-0"
                                                    :class="{ 'text-danger': getDaysRemaining(selectedContrat.dateFin) < 30 }">
                                                    {{ getDaysRemaining(selectedContrat.dateFin) }} jours
                                                </p>
                                            </div>
                                            <div class="col-md-4">
                                                <label class="text-muted small">Loyer mensuel</label>
                                                <p class="mb-0 fw-bold text-success fs-5">{{
                                                    formatCurrency(selectedContrat.montantLoyer) }}</p>
                                            </div>
                                            <div class="col-md-4">
                                                <label class="text-muted small">Dépôt de garantie</label>
                                                <p class="mb-0">{{ formatCurrency(selectedContrat.depotGarantie || 0) }}
                                                </p>
                                            </div>
                                            <div class="col-md-4">
                                                <label class="text-muted small">Mode de paiement</label>
                                                <p class="mb-0">{{ selectedContrat.modePaiement || '—' }}</p>
                                            </div>
                                            <div v-if="selectedContrat.conditions" class="col-12">
                                                <label class="text-muted small">Conditions particulières</label>
                                                <p class="mb-0">{{ selectedContrat.conditions }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="selectedContrat = null">
                            Fermer
                        </button>
                        <button type="button" class="btn btn-info" @click="downloadPDF(selectedContrat.id)">
                            <i class="bi bi-download me-1"></i>Télécharger PDF
                        </button>
                        <button v-if="canRenew(selectedContrat)" type="button" class="btn btn-warning"
                            @click="openRenewModal(selectedContrat)">
                            <i class="bi bi-arrow-repeat me-1"></i>Renouveler
                        </button>
                        <button type="button" class="btn btn-primary" @click="editContrat(selectedContrat)">
                            <i class="bi bi-pencil me-1"></i>Modifier
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Renouvellement -->
        <div v-if="showRenewModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Renouveler le Contrat</h5>
                        <button type="button" class="btn-close" @click="closeRenewModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle me-2"></i>
                            Renouvellement du contrat #{{ renewContrat.numeroContrat || renewContrat.id }}
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Nouvelle date de fin</label>
                            <input type="date" class="form-control" v-model="nouvelleDateFin" :min="minRenewDate">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Nouveau loyer (optionnel)</label>
                            <input type="number" class="form-control" v-model.number="nouveauLoyer"
                                :placeholder="formatCurrency(renewContrat.montantLoyer)">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Commentaire</label>
                            <textarea class="form-control" rows="3" v-model="commentaireRenouvellement"
                                placeholder="Ajoutez un commentaire sur ce renouvellement..."></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeRenewModal">
                            Annuler
                        </button>
                        <button type="button" class="btn btn-warning" @click="confirmRenouvellement"
                            :disabled="!nouvelleDateFin">
                            <i class="bi bi-arrow-repeat me-1"></i>Confirmer le renouvellement
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Création Contrat -->
        <div v-if="showCreateModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Nouveau Contrat</h5>
                        <button type="button" class="btn-close" @click="showCreateModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="createContrat">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">Propriété <span class="text-danger">*</span></label>
                                    <select v-model="newContrat.bienId" class="form-select" required>
                                        <option value="">Sélectionner une propriété</option>
                                        <option v-for="bien in availableBiens" :key="bien.id" :value="bien.id">
                                            {{ bien.nom }} - {{ bien.adresse }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Locataire <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" v-model="newContrat.locataireNom"
                                        placeholder="Nom du locataire" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Téléphone</label>
                                    <input type="tel" class="form-control" v-model="newContrat.locataireTel"
                                        placeholder="+225 XX XX XX XX XX">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control" v-model="newContrat.locataireEmail"
                                        placeholder="email@exemple.com">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Date de début <span class="text-danger">*</span></label>
                                    <input type="date" class="form-control" v-model="newContrat.dateDebut" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Date de fin <span class="text-danger">*</span></label>
                                    <input type="date" class="form-control" v-model="newContrat.dateFin"
                                        :min="newContrat.dateDebut" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Montant du loyer <span
                                            class="text-danger">*</span></label>
                                    <input type="number" class="form-control" v-model.number="newContrat.montantLoyer"
                                        placeholder="0" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Dépôt de garantie</label>
                                    <input type="number" class="form-control" v-model.number="newContrat.depotGarantie"
                                        placeholder="0">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Type de contrat</label>
                                    <select v-model="newContrat.typeContrat" class="form-select">
                                        <option value="LOCATION">Location</option>
                                        <option value="BAIL_HABITATION">Bail Habitation</option>
                                        <option value="BAIL_COMMERCIAL">Bail Commercial</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Mode de paiement</label>
                                    <select v-model="newContrat.modePaiement" class="form-select">
                                        <option value="VIREMENT">Virement</option>
                                        <option value="ESPECES">Espèces</option>
                                        <option value="CHEQUE">Chèque</option>
                                        <option value="MOBILE_MONEY">Mobile Money</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label class="form-label">Conditions particulières</label>
                                    <textarea class="form-control" rows="3" v-model="newContrat.conditions"
                                        placeholder="Ajoutez des conditions particulières..."></textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showCreateModal = false">
                            Annuler
                        </button>
                        <button type="button" class="btn btn-primary" @click="createContrat">
                            <i class="bi bi-check-circle me-1"></i>Créer le contrat
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
    name: 'SuiviContratsBaux',

    data() {
        return {
            loading: true,
            viewMode: 'list',
            searchQuery: '',
            currentPage: 1,
            perPage: 10,
            contracts: [],
            availableBiens: [],

            filters: {
                status: '',
                type: '',
                dateDebut: '',
                dateFin: ''
            },

            stats: {
                actifs: 0,
                aRenouveler: 0,
                expires: 0,
                archives: 0
            },

            selectedContrat: null,
            showRenewModal: false,
            showCreateModal: false,
            renewContrat: null,
            nouvelleDateFin: '',
            nouveauLoyer: null,
            commentaireRenouvellement: '',

            newContrat: {
                bienId: '',
                locataireNom: '',
                locataireTel: '',
                locataireEmail: '',
                dateDebut: '',
                dateFin: '',
                montantLoyer: 0,
                depotGarantie: 0,
                typeContrat: 'LOCATION',
                modePaiement: 'VIREMENT',
                conditions: ''
            },

            calendarCurrentDate: new Date(),
            daysOfWeek: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
        };
    },

    computed: {
        filteredContracts() {
            let result = this.contracts;

            // Filtre par recherche globale
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(c =>
                    c.bienNom?.toLowerCase().includes(query) ||
                    c.locataireNom?.toLowerCase().includes(query) ||
                    c.numeroContrat?.toString().includes(query)
                );
            }

            // Filtre par statut
            if (this.filters.status) {
                result = result.filter(c => c.status === this.filters.status);
            }

            // Filtre par type
            if (this.filters.type) {
                result = result.filter(c => c.typeContrat === this.filters.type);
            }

            // Filtre par dates
            if (this.filters.dateDebut) {
                result = result.filter(c => new Date(c.dateDebut) >= new Date(this.filters.dateDebut));
            }
            if (this.filters.dateFin) {
                result = result.filter(c => new Date(c.dateFin) <= new Date(this.filters.dateFin));
            }

            return result;
        },

        paginatedContracts() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredContracts.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.filteredContracts.length / this.perPage);
        },

        minRenewDate() {
            if (!this.renewContrat) return '';
            const date = new Date(this.renewContrat.dateFin);
            return date.toISOString().split('T')[0];
        },

        currentMonthYear() {
            const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
            return `${months[this.calendarCurrentDate.getMonth()]} ${this.calendarCurrentDate.getFullYear()}`;
        },

        calendarDays() {
            const year = this.calendarCurrentDate.getFullYear();
            const month = this.calendarCurrentDate.getMonth();

            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startDayOfWeek = firstDay.getDay() || 7; // Lundi = 1

            const days = [];

            // Jours du mois précédent
            for (let i = startDayOfWeek - 1; i > 0; i--) {
                const date = new Date(year, month, -i + 1);
                days.push({
                    date: date.getDate(),
                    fullDate: date,
                    isCurrentMonth: false,
                    isToday: false,
                    contracts: []
                });
            }

            // Jours du mois actuel
            const today = new Date();
            for (let i = 1; i <= daysInMonth; i++) {
                const date = new Date(year, month, i);
                const isToday = date.toDateString() === today.toDateString();

                days.push({
                    date: i,
                    fullDate: date,
                    isCurrentMonth: true,
                    isToday: isToday,
                    contracts: this.getContractsForDate(date)
                });
            }

            // Jours du mois suivant
            const remainingDays = 42 - days.length; // 6 semaines * 7 jours
            for (let i = 1; i <= remainingDays; i++) {
                const date = new Date(year, month + 1, i);
                days.push({
                    date: i,
                    fullDate: date,
                    isCurrentMonth: false,
                    isToday: false,
                    contracts: []
                });
            }

            return days;
        }
    },

    async mounted() {
        await this.loadData();
    },

    methods: {
        ...mapActions({
            getContratsUtilisateur: 'contrats/getContratsUtilisateur',
            renouvelerContrat: 'contrats/renouvelerContrat',
            resilierContratsExpires: 'contrats/resilierContratsExpires',
            archiverContratsExpires: 'contrats/archiverContratsExpires',
            downloadPDFAction: 'contrats/downloadPDF',
            exportContratsAction: 'contrats/exportContrats',
            createContratAction: 'contrats/create',
            getDisponibles: 'biensImmobiliers/getDisponibles'
        }),

        async loadData() {
            try {
                this.loading = true;
                const userId = this.$store.getters.userInfo;

                // Charger les contrats
                const contratsData = await this.getContratsUtilisateur(userId);
                this.contracts = this.transformContracts(contratsData);

                // Charger les biens disponibles
                const biensData = await this.getDisponibles();
                this.availableBiens = biensData;

                // Calculer les statistiques
                this.calculateStats();

            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
                ElMessage.error('Erreur lors du chargement des contrats');
            } finally {
                this.loading = false;
            }
        },

        transformContracts(contratsData) {
            return contratsData.map(contrat => {
                const bien = contrat.biensImmobiliers?.[0] || {};
                const locataire = contrat.locataire || {};

                return {
                    id: contrat.id,
                    numeroContrat: contrat.numeroContrat || contrat.id,
                    bienId: bien.id,
                    bienNom: bien.nom || 'N/A',
                    bienAdresse: bien.adresse || 'N/A',
                    bienType: bien.typeBiensImmo?.nomTypeBiensImmo || 'N/A',
                    locataireNom: locataire.nom || 'N/A',
                    locataireTel: locataire.telephone,
                    locataireEmail: locataire.email,
                    dateDebut: contrat.dateDebut,
                    dateFin: contrat.dateFin,
                    montantLoyer: contrat.montantLoyer || bien.prix || 0,
                    depotGarantie: contrat.depotGarantie,
                    status: contrat.status || 'ACTIF',
                    typeContrat: contrat.typeContrat || 'LOCATION',
                    modePaiement: contrat.modePaiement,
                    typePaiement: contrat.typePaiement,
                    conditions: contrat.conditions
                };
            });
        },

        calculateStats() {
            this.stats.actifs = this.contracts.filter(c => c.status === 'ACTIF').length;
            this.stats.expires = this.contracts.filter(c => c.status === 'EXPIRE').length;
            this.stats.archives = this.contracts.filter(c => c.status === 'ARCHIVE').length;

            // Contrats à renouveler (expirent dans les 30 prochains jours)
            this.stats.aRenouveler = this.contracts.filter(c => {
                if (c.status !== 'ACTIF') return false;
                const daysRemaining = this.getDaysRemaining(c.dateFin);
                return daysRemaining > 0 && daysRemaining <= 30;
            }).length;
        },

        filterContracts() {
            this.currentPage = 1;
        },

        resetFilters() {
            this.filters = {
                status: '',
                type: '',
                dateDebut: '',
                dateFin: ''
            };
            this.searchQuery = '';
            this.currentPage = 1;
        },

        getStatusBadgeClass(status) {
            const classes = {
                'ACTIF': 'bg-success',
                'EN_ATTENTE': 'bg-warning',
                'EXPIRE': 'bg-danger',
                'RESILIÉ': 'bg-dark',
                'ARCHIVE': 'bg-secondary'
            };
            return classes[status] || 'bg-secondary';
        },

        getStatusIcon(status) {
            const icons = {
                'ACTIF': 'bi-check-circle',
                'EN_ATTENTE': 'bi-clock',
                'EXPIRE': 'bi-x-circle',
                'RESILIÉ': 'bi-slash-circle',
                'ARCHIVE': 'bi-archive'
            };
            return icons[status] || 'bi-circle';
        },

        getStatusLabel(status) {
            const labels = {
                'ACTIF': 'Actif',
                'EN_ATTENTE': 'En attente',
                'EXPIRE': 'Expiré',
                'RESILIÉ': 'Résilié',
                'ARCHIVE': 'Archivé'
            };
            return labels[status] || status;
        },

        getDateBadgeClass(dateFin) {
            const daysRemaining = this.getDaysRemaining(dateFin);
            if (daysRemaining < 0) return 'bg-danger';
            if (daysRemaining <= 30) return 'bg-warning';
            return 'bg-light text-dark';
        },

        getTimelineMarkerClass(status) {
            const classes = {
                'ACTIF': 'bg-success',
                'EN_ATTENTE': 'bg-warning',
                'EXPIRE': 'bg-danger',
                'RESILIÉ': 'bg-dark',
                'ARCHIVE': 'bg-secondary'
            };
            return classes[status] || 'bg-secondary';
        },

        getEventClass(contract) {
            const daysRemaining = this.getDaysRemaining(contract.dateFin);
            if (daysRemaining < 0) return 'event-expired';
            if (daysRemaining <= 30) return 'event-warning';
            return 'event-active';
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

        getDaysRemaining(dateFin) {
            if (!dateFin) return 0;
            const today = new Date();
            const end = new Date(dateFin);
            const diffTime = end - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        },

        isExpiringSoon(dateFin) {
            const days = this.getDaysRemaining(dateFin);
            return days > 0 && days <= 30;
        },

        canRenew(contrat) {
            return contrat.status === 'ACTIF' ||
                (contrat.status === 'EXPIRE' && this.getDaysRemaining(contrat.dateFin) > -90);
        },

        calculateDuration(dateDebut, dateFin) {
            if (!dateDebut || !dateFin) return '—';
            const start = new Date(dateDebut);
            const end = new Date(dateFin);
            const months = (end.getFullYear() - start.getFullYear()) * 12 +
                (end.getMonth() - start.getMonth());
            return `${months} mois`;
        },

        getContractsForDate(date) {
            return this.contracts.filter(contract => {
                const start = new Date(contract.dateDebut);
                const end = new Date(contract.dateFin);
                return date >= start && date <= end;
            });
        },

        previousMonth() {
            this.calendarCurrentDate = new Date(
                this.calendarCurrentDate.getFullYear(),
                this.calendarCurrentDate.getMonth() - 1,
                1
            );
        },

        nextMonth() {
            this.calendarCurrentDate = new Date(
                this.calendarCurrentDate.getFullYear(),
                this.calendarCurrentDate.getMonth() + 1,
                1
            );
        },

        viewContrat(contrat) {
            this.selectedContrat = contrat;
        },

        editContrat(contrat) {
            this.$router.push({
                name: 'edit-contrat',
                params: { id: contrat.id }
            });
        },

        async downloadPDF(contratId) {
            try {
                const fileUrl = await this.downloadPDFAction(contratId);
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = `contrat_${contratId}.pdf`;
                link.click();
                URL.revokeObjectURL(fileUrl);
                ElMessage.success('PDF téléchargé avec succès');
            } catch (error) {
                console.error('Erreur téléchargement PDF:', error);
                ElMessage.error('Erreur lors du téléchargement du PDF');
            }
        },

        openRenewModal(contrat) {
            this.renewContrat = contrat;
            this.nouvelleDateFin = '';
            this.nouveauLoyer = null;
            this.commentaireRenouvellement = '';
            this.showRenewModal = true;
            this.selectedContrat = null;
        },

        closeRenewModal() {
            this.showRenewModal = false;
            this.renewContrat = null;
        },

        async confirmRenouvellement() {
            try {
                await this.renouvelerContrat({
                    id: this.renewContrat.id,
                    nouvelleDateFin: this.nouvelleDateFin
                });

                ElMessage.success('Contrat renouvelé avec succès');
                this.closeRenewModal();
                await this.loadData();
            } catch (error) {
                console.error('Erreur renouvellement:', error);
                ElMessage.error('Erreur lors du renouvellement du contrat');
            }
        },

        async resilierContrat(contratId) {
            try {
                await ElMessageBox.confirm(
                    'Êtes-vous sûr de vouloir résilier ce contrat ?',
                    'Confirmation',
                    {
                        confirmButtonText: 'Oui, résilier',
                        cancelButtonText: 'Annuler',
                        type: 'warning'
                    }
                );

                await this.$store.dispatch('contrats/update', {
                    id: contratId,
                    status: 'RESILIÉ'
                });

                ElMessage.success('Contrat résilié avec succès');
                await this.loadData();
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur résiliation:', error);
                    ElMessage.error('Erreur lors de la résiliation');
                }
            }
        },

        async archiverExpires() {
            try {
                await ElMessageBox.confirm(
                    'Archiver tous les contrats expirés ?',
                    'Confirmation',
                    {
                        confirmButtonText: 'Oui, archiver',
                        cancelButtonText: 'Annuler',
                        type: 'warning'
                    }
                );

                await this.archiverContratsExpires();
                ElMessage.success('Contrats expirés archivés');
                await this.loadData();
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur archivage:', error);
                    ElMessage.error('Erreur lors de l\'archivage');
                }
            }
        },

        async exportContracts() {
            try {
                const fileUrl = await this.exportContratsAction('xlsx');
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = `contrats_${Date.now()}.xlsx`;
                link.click();
                URL.revokeObjectURL(fileUrl);
                ElMessage.success('Export réussi');
            } catch (error) {
                console.error('Erreur export:', error);
                ElMessage.error('Erreur lors de l\'export');
            }
        },

        async createContrat() {
            try {
                if (!this.newContrat.bienId || !this.newContrat.locataireNom ||
                    !this.newContrat.dateDebut || !this.newContrat.dateFin) {
                    ElMessage.warning('Veuillez remplir tous les champs obligatoires');
                    return;
                }

                await this.createContratAction(this.newContrat);
                ElMessage.success('Contrat créé avec succès');
                this.showCreateModal = false;
                this.resetNewContrat();
                await this.loadData();
            } catch (error) {
                console.error('Erreur création contrat:', error);
                ElMessage.error('Erreur lors de la création du contrat');
            }
        },

        resetNewContrat() {
            this.newContrat = {
                bienId: '',
                locataireNom: '',
                locataireTel: '',
                locataireEmail: '',
                dateDebut: '',
                dateFin: '',
                montantLoyer: 0,
                depotGarantie: 0,
                typeContrat: 'LOCATION',
                modePaiement: 'VIREMENT',
                conditions: ''
            };
        }
    }
};
</script>

<style scoped>
.modal.show {
    display: block !important;
}

.table> :not(caption)>*>* {
    padding: 1rem 0.75rem;
}

.badge {
    font-weight: 500;
    padding: 0.35em 0.65em;
}

/* Timeline Styles */
.timeline {
    position: relative;
    padding-left: 30px;
}

.timeline::before {
    content: '';
    position: absolute;
    left: 10px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #dee2e6;
}

.timeline-item {
    position: relative;
    margin-bottom: 20px;
}

.timeline-marker {
    position: absolute;
    left: -24px;
    top: 20px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 0 0 3px #dee2e6;
}

.timeline-content {
    margin-left: 20px;
}

/* Calendar Styles */
.calendar-grid {
    display: flex;
    flex-direction: column;
}

.calendar-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    margin-bottom: 5px;
}

.calendar-day-name {
    text-align: center;
    font-weight: 600;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 4px;
}

.calendar-body {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
}

.calendar-day {
    min-height: 100px;
    padding: 8px;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
    transition: all 0.2s;
}

.calendar-day:hover {
    background: #f8f9fa;
    border-color: #0d6efd;
}

.calendar-day.other-month {
    background: #f8f9fa;
    color: #adb5bd;
}

.calendar-day.today {
    background: #e7f3ff;
    border-color: #0d6efd;
}

.calendar-day.has-event {
    background: #fff3cd;
}

.day-number {
    font-weight: 600;
    margin-bottom: 5px;
}

.day-events {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.event-badge {
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 0.75rem;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.event-active {
    background: #d1e7dd;
    color: #0f5132;
}

.event-warning {
    background: #fff3cd;
    color: #664d03;
}

.event-expired {
    background: #f8d7da;
    color: #842029;
}
</style>