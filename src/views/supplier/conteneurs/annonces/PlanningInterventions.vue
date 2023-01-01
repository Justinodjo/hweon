<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">

            <!-- En-tête -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">
                                <i class="bi bi-calendar-check me-2"></i>Planning des Interventions
                            </h1>
                            <p class="text-muted mb-0">Gestion et organisation des missions notariales</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <button @click="showCreateModal = true" class="btn btn-primary">
                                <i class="bi bi-plus-circle me-1"></i>Nouvelle Intervention
                            </button>
                            <button @click="toggleView" class="btn btn-outline-primary">
                                <i class="bi" :class="viewMode === 'calendar' ? 'bi-list' : 'bi-calendar3'"></i>
                                {{ viewMode === 'calendar' ? 'Vue Liste' : 'Vue Calendrier' }}
                            </button>
                            <button @click="exportPlanning" class="btn btn-success">
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
                                    <span class="text-muted small">Aujourd'hui</span>
                                    <h3 class="mb-0 mt-2 text-primary">{{ stats.aujourdhui }}</h3>
                                    <small class="text-primary">
                                        <i class="bi bi-calendar-day me-1"></i>Interventions
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-primary bg-opacity-10 text-primary">
                                    <i class="bi bi-calendar-day fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Cette Semaine</span>
                                    <h3 class="mb-0 mt-2 text-info">{{ stats.cetteSemaine }}</h3>
                                    <small class="text-info">
                                        <i class="bi bi-calendar-week me-1"></i>Planifiées
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-info bg-opacity-10 text-info">
                                    <i class="bi bi-calendar-week fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">En Attente</span>
                                    <h3 class="mb-0 mt-2 text-warning">{{ stats.enAttente }}</h3>
                                    <small class="text-warning">
                                        <i class="bi bi-hourglass-split me-1"></i>À planifier
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
                                    <span class="text-muted small">Terminées</span>
                                    <h3 class="mb-0 mt-2 text-success">{{ stats.terminees }}</h3>
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

                <!-- Navigation du calendrier -->
                <div class="row mb-4" v-if="viewMode === 'calendar'">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <button @click="previousPeriod" class="btn btn-outline-primary">
                                        <i class="bi bi-chevron-left"></i> Précédent
                                    </button>
                                    <h5 class="mb-0">{{ currentPeriodLabel }}</h5>
                                    <button @click="nextPeriod" class="btn btn-outline-primary">
                                        Suivant <i class="bi bi-chevron-right"></i>
                                    </button>
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
                                                v-model="searchQuery" @input="filterInterventions">
                                            <i
                                                class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.type" @change="filterInterventions"
                                            class="form-select">
                                            <option value="">Tous types</option>
                                            <option value="SIGNATURE">Signature</option>
                                            <option value="RDV_CLIENT">RDV Client</option>
                                            <option value="VISITE">Visite</option>
                                            <option value="EXPERTISE">Expertise</option>
                                            <option value="REUNION">Réunion</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.statut" @change="filterInterventions"
                                            class="form-select">
                                            <option value="">Tous statuts</option>
                                            <option value="PLANIFIE">Planifié</option>
                                            <option value="EN_COURS">En cours</option>
                                            <option value="TERMINE">Terminé</option>
                                            <option value="ANNULE">Annulé</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.notaire" @change="filterInterventions"
                                            class="form-select">
                                            <option value="">Tous les notaires</option>
                                            <option value="Me. Dupont">Me. Dupont</option>
                                            <option value="Me. Martin">Me. Martin</option>
                                            <option value="Me. Bernard">Me. Bernard</option>
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

                <!-- Vue Calendrier -->
                <div v-if="viewMode === 'calendar'" class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h6 class="mb-0">Calendrier des Interventions</h6>
                                    <div class="d-flex gap-2">
                                        <span class="badge bg-primary">Signature</span>
                                        <span class="badge bg-info">RDV</span>
                                        <span class="badge bg-success">Visite</span>
                                        <span class="badge bg-warning">Expertise</span>
                                        <span class="badge bg-secondary">Réunion</span>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-bordered mb-0 calendar-table">
                                        <thead class="table-light">
                                            <tr>
                                                <th class="text-center">Lundi</th>
                                                <th class="text-center">Mardi</th>
                                                <th class="text-center">Mercredi</th>
                                                <th class="text-center">Jeudi</th>
                                                <th class="text-center">Vendredi</th>
                                                <th class="text-center">Samedi</th>
                                                <th class="text-center">Dimanche</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(week, weekIndex) in calendarWeeks" :key="weekIndex">
                                                <td v-for="(day, dayIndex) in week" :key="dayIndex" class="calendar-day"
                                                    :class="getDayClass(day)">
                                                    <div class="day-header">
                                                        <span class="day-number"
                                                            :class="{ 'text-primary fw-bold': isToday(day.date) }">
                                                            {{ day.day }}
                                                        </span>
                                                    </div>
                                                    <div class="day-events">
                                                        <div v-for="intervention in day.interventions"
                                                            :key="intervention.id" class="event-item"
                                                            :class="'bg-' + getTypeColor(intervention.type)"
                                                            @click="viewIntervention(intervention)">
                                                            <small class="d-block text-truncate">
                                                                <i class="bi bi-clock me-1"></i>{{
                                                                    intervention.heureDebut }}
                                                            </small>
                                                            <small class="d-block text-truncate fw-bold">
                                                                {{ intervention.titre }}
                                                            </small>
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

                <!-- Vue Liste -->
                <div v-else class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">
                                    Liste des Interventions
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ filteredInterventions.length }} interventions
                                    </span>
                                </h6>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Référence</th>
                                                <th>Date & Heure</th>
                                                <th>Type / Titre</th>
                                                <th>Client</th>
                                                <th>Notaire</th>
                                                <th>Lieu</th>
                                                <th>Statut</th>
                                                <th class="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="paginatedInterventions.length === 0">
                                                <td colspan="8" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucune intervention trouvée</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="intervention in paginatedInterventions"
                                                :key="intervention.id" :class="getRowClass(intervention)">
                                                <td>
                                                    <strong class="text-primary">{{ intervention.reference }}</strong>
                                                    <span v-if="isToday(intervention.date)"
                                                        class="badge bg-danger ms-1">
                                                        Aujourd'hui
                                                    </span>
                                                </td>
                                                <td>
                                                    <div>
                                                        <i class="bi bi-calendar-event me-1"></i>
                                                        <strong>{{ formatDate(intervention.date) }}</strong>
                                                    </div>
                                                    <small class="text-muted">
                                                        <i class="bi bi-clock me-1"></i>
                                                        {{ intervention.heureDebut }} - {{ intervention.heureFin }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <div><strong>{{ intervention.titre }}</strong></div>
                                                    <span class="badge"
                                                        :class="'bg-' + getTypeColor(intervention.type)">
                                                        {{ intervention.type }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div>{{ intervention.client }}</div>
                                                    <small class="text-muted">{{ intervention.dossier }}</small>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div class="avatar-sm bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-2"
                                                            style="width: 32px; height: 32px;">
                                                            <small>{{ getInitiales(intervention.notaire) }}</small>
                                                        </div>
                                                        <small>{{ intervention.notaire }}</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <small>
                                                        <i class="bi bi-geo-alt me-1"></i>
                                                        {{ intervention.lieu }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <span class="badge"
                                                        :class="getStatutBadgeClass(intervention.statut)">
                                                        {{ getStatutLabel(intervention.statut) }}
                                                    </span>
                                                </td>
                                                <td class="text-end">
                                                    <div class="btn-group">
                                                        <button class="btn btn-sm btn-outline-primary"
                                                            @click="viewIntervention(intervention)">
                                                            <i class="bi bi-eye"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-success"
                                                            @click="modifierIntervention(intervention)">
                                                            <i class="bi bi-pencil"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-danger"
                                                            @click="annulerIntervention(intervention)">
                                                            <i class="bi bi-x-circle"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- Pagination -->
                                <div v-if="filteredInterventions.length > perPage" class="card-footer border-top">
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
        <div v-if="selectedIntervention" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ selectedIntervention.titre }}
                            <span class="badge ms-2" :class="'bg-' + getTypeColor(selectedIntervention.type)">
                                {{ selectedIntervention.type }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedIntervention = null"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-info-circle me-2"></i>Informations</h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Référence</label>
                                            <p class="mb-0 fw-bold">{{ selectedIntervention.reference }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Date</label>
                                            <p class="mb-0">{{ formatDate(selectedIntervention.date) }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Horaire</label>
                                            <p class="mb-0">{{ selectedIntervention.heureDebut }} - {{
                                                selectedIntervention.heureFin }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Durée</label>
                                            <p class="mb-0">{{ selectedIntervention.duree }} minutes</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-people me-2"></i>Participants</h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Client</label>
                                            <p class="mb-0">{{ selectedIntervention.client }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Dossier</label>
                                            <p class="mb-0">{{ selectedIntervention.dossier }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Notaire</label>
                                            <p class="mb-0">{{ selectedIntervention.notaire }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Statut</label>
                                            <p class="mb-0">
                                                <span class="badge"
                                                    :class="getStatutBadgeClass(selectedIntervention.statut)">
                                                    {{ getStatutLabel(selectedIntervention.statut) }}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-geo-alt me-2"></i>Lieu</h6>
                                        <p class="mb-0">{{ selectedIntervention.lieu }}</p>
                                        <small class="text-muted">{{ selectedIntervention.adresseComplete }}</small>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12" v-if="selectedIntervention.description">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-file-text me-2"></i>Description</h6>
                                        <p class="mb-0">{{ selectedIntervention.description }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12"
                                v-if="selectedIntervention.documents && selectedIntervention.documents.length > 0">
                                <div class="card border-primary">
                                    <div class="card-header bg-primary bg-opacity-10">
                                        <h6 class="mb-0"><i class="bi bi-paperclip me-2"></i>Documents joints</h6>
                                    </div>
                                    <div class="card-body">
                                        <ul class="list-unstyled mb-0">
                                            <li v-for="(doc, index) in selectedIntervention.documents" :key="index"
                                                class="mb-2">
                                                <i class="bi bi-file-earmark-pdf text-danger me-2"></i>
                                                <a href="#" class="text-decoration-none">{{ doc }}</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12" v-if="selectedIntervention.notes">
                                <div class="card border-warning">
                                    <div class="card-header bg-warning bg-opacity-10">
                                        <h6 class="mb-0"><i class="bi bi-sticky me-2"></i>Notes</h6>
                                    </div>
                                    <div class="card-body">
                                        <p class="mb-0">{{ selectedIntervention.notes }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            @click="selectedIntervention = null">Fermer</button>
                        <button type="button" class="btn btn-warning"
                            @click="modifierIntervention(selectedIntervention)">
                            <i class="bi bi-pencil me-1"></i>Modifier
                        </button>
                        <button type="button" class="btn btn-danger" @click="annulerIntervention(selectedIntervention)"
                            v-if="selectedIntervention.statut !== 'ANNULE'">
                            <i class="bi bi-x-circle me-1"></i>Annuler
                        </button>
                        <button type="button" class="btn btn-success" @click="marquerTermine(selectedIntervention)"
                            v-if="selectedIntervention.statut === 'EN_COURS'">
                            <i class="bi bi-check-circle me-1"></i>Terminer
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
                        <h5 class="modal-title">{{ interventionForm.id ? 'Modifier' : 'Nouvelle' }} Intervention</h5>
                        <button type="button" class="btn-close" @click="closeCreateModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Type *</label>
                                <select v-model="interventionForm.type" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="SIGNATURE">Signature</option>
                                    <option value="RDV_CLIENT">RDV Client</option>
                                    <option value="VISITE">Visite</option>
                                    <option value="EXPERTISE">Expertise</option>
                                    <option value="REUNION">Réunion</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Notaire *</label>
                                <select v-model="interventionForm.notaire" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="Me. Dupont">Me. Dupont</option>
                                    <option value="Me. Martin">Me. Martin</option>
                                    <option value="Me. Bernard">Me. Bernard</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Titre *</label>
                                <input type="text" v-model="interventionForm.titre" class="form-control" required>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Date *</label>
                                <input type="date" v-model="interventionForm.date" class="form-control" required>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Heure début *</label>
                                <input type="time" v-model="interventionForm.heureDebut" class="form-control" required>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Heure fin *</label>
                                <input type="time" v-model="interventionForm.heureFin" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Client *</label>
                                <input type="text" v-model="interventionForm.client" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Dossier</label>
                                <input type="text" v-model="interventionForm.dossier" class="form-control">
                            </div>
                            <div class="col-12">
                                <label class="form-label">Lieu *</label>
                                <input type="text" v-model="interventionForm.lieu" class="form-control" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Adresse complète</label>
                                <input type="text" v-model="interventionForm.adresseComplete" class="form-control">
                            </div>
                            <div class="col-12">
                                <label class="form-label">Description</label>
                                <textarea v-model="interventionForm.description" class="form-control"
                                    rows="3"></textarea>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Notes</label>
                                <textarea v-model="interventionForm.notes" class="form-control" rows="2"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeCreateModal">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="saveIntervention">
                            <i class="bi bi-check-circle me-1"></i>{{ interventionForm.id ? 'Mettre à jour' : 'Créer' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PlanningInterventions',

    data() {
        return {
            loading: true,
            searchQuery: '',
            currentPage: 1,
            perPage: 15,
            selectedIntervention: null,
            showCreateModal: false,
            viewMode: 'calendar', // 'calendar' ou 'list'
            currentDate: new Date(),
            filters: { type: '', statut: '', notaire: '' },
            interventionForm: {
                id: null,
                type: '',
                titre: '',
                date: '',
                heureDebut: '',
                heureFin: '',
                client: '',
                dossier: '',
                notaire: '',
                lieu: '',
                adresseComplete: '',
                description: '',
                notes: ''
            },
            interventions: [],
            stats: { aujourdhui: 0, cetteSemaine: 0, enAttente: 0, terminees: 0 }
        };
    },

    computed: {
        filteredInterventions() {
            let result = [...this.interventions];
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(i =>
                    i.titre.toLowerCase().includes(query) ||
                    i.client.toLowerCase().includes(query) ||
                    i.reference.toLowerCase().includes(query) ||
                    i.dossier.toLowerCase().includes(query)
                );
            }
            if (this.filters.type) result = result.filter(i => i.type === this.filters.type);
            if (this.filters.statut) result = result.filter(i => i.statut === this.filters.statut);
            if (this.filters.notaire) result = result.filter(i => i.notaire === this.filters.notaire);
            return result.sort((a, b) => new Date(a.date + ' ' + a.heureDebut) - new Date(b.date + ' ' + b.heureDebut));
        },

        paginatedInterventions() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredInterventions.slice(start, start + this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filteredInterventions.length / this.perPage);
        },

        currentPeriodLabel() {
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.toLocaleDateString('fr-FR', { month: 'long' });
            return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
        },

        calendarWeeks() {
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth();

            // Premier jour du mois
            const firstDay = new Date(year, month, 1);
            // Dernier jour du mois
            const lastDay = new Date(year, month + 1, 0);

            // Ajuster au lundi précédent
            const startDate = new Date(firstDay);
            const dayOfWeek = firstDay.getDay();
            const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            startDate.setDate(firstDay.getDate() - diff);

            const weeks = [];
            let currentWeek = [];
            const tempDate = new Date(startDate);

            // Générer 6 semaines pour couvrir tous les cas
            for (let i = 0; i < 42; i++) {
                const dateStr = tempDate.toISOString().split('T')[0];
                const interventionsJour = this.interventions.filter(inter => inter.date === dateStr);

                currentWeek.push({
                    day: tempDate.getDate(),
                    date: dateStr,
                    isCurrentMonth: tempDate.getMonth() === month,
                    interventions: interventionsJour
                });

                if (currentWeek.length === 7) {
                    weeks.push(currentWeek);
                    currentWeek = [];
                }

                tempDate.setDate(tempDate.getDate() + 1);
            }

            return weeks;
        }
    },

    async mounted() {
        await this.loadData();
    },

    methods: {
        async loadData() {
            try {
                this.loading = true;
                const types = ['SIGNATURE', 'RDV_CLIENT', 'VISITE', 'EXPERTISE', 'REUNION'];
                const statuts = ['PLANIFIE', 'EN_COURS', 'TERMINE', 'ANNULE'];
                const notaires = ['Me. Dupont', 'Me. Martin', 'Me. Bernard'];
                const clients = ['Jean Dupont', 'Marie Martin', 'Pierre Durand', 'Sophie Bernard', 'Luc Petit'];
                const lieux = ['Office notarial', 'Domicile client', 'Bien immobilier', 'Mairie', 'Cabinet'];

                this.interventions = Array.from({ length: 50 }, (_, i) => {
                    // Générer des dates variées
                    const baseDate = new Date();
                    const randomDays = Math.floor(Math.random() * 60) - 30; // -30 à +30 jours
                    const date = new Date(baseDate);
                    date.setDate(baseDate.getDate() + randomDays);

                    const heureDebut = `${String(9 + Math.floor(Math.random() * 8)).padStart(2, '0')}:${['00', '15', '30', '45'][Math.floor(Math.random() * 4)]}`;
                    const heureDebutMin = parseInt(heureDebut.split(':')[0]) * 60 + parseInt(heureDebut.split(':')[1]);
                    const duree = [30, 60, 90, 120][Math.floor(Math.random() * 4)];
                    const heureFinMin = heureDebutMin + duree;
                    const heureFin = `${String(Math.floor(heureFinMin / 60)).padStart(2, '0')}:${String(heureFinMin % 60).padStart(2, '0')}`;

                    return {
                        id: i + 1,
                        reference: `INT-${String(i + 1).padStart(4, '0')}`,
                        type: types[Math.floor(Math.random() * types.length)],
                        titre: `${types[Math.floor(Math.random() * types.length)].replace('_', ' ')} - Client ${i + 1}`,
                        date: date.toISOString().split('T')[0],
                        heureDebut: heureDebut,
                        heureFin: heureFin,
                        duree: duree,
                        client: clients[Math.floor(Math.random() * clients.length)],
                        dossier: `DOS-${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`,
                        notaire: notaires[Math.floor(Math.random() * notaires.length)],
                        lieu: lieux[Math.floor(Math.random() * lieux.length)],
                        adresseComplete: '123 Rue de la République, 75001 Paris',
                        statut: statuts[Math.floor(Math.random() * statuts.length)],
                        description: `Description de l'intervention ${i + 1}. Détails concernant cette intervention notariale.`,
                        notes: Math.random() > 0.5 ? `Notes importantes pour l'intervention ${i + 1}` : '',
                        documents: Math.random() > 0.6 ? ['Acte de vente.pdf', 'Pièces d\'identité.pdf'] : []
                    };
                });

                this.calculateStats();
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors du chargement', 'error');
            } finally {
                this.loading = false;
            }
        },

        calculateStats() {
            const today = new Date().toISOString().split('T')[0];
            this.stats.aujourdhui = this.interventions.filter(i => i.date === today && i.statut !== 'ANNULE').length;

            // Cette semaine
            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            this.stats.cetteSemaine = this.interventions.filter(i => {
                const date = new Date(i.date);
                return date >= startOfWeek && date <= endOfWeek && i.statut !== 'ANNULE';
            }).length;

            this.stats.enAttente = this.interventions.filter(i => i.statut === 'PLANIFIE').length;

            // Ce mois
            const thisMonth = new Date().getMonth();
            const thisYear = new Date().getFullYear();
            this.stats.terminees = this.interventions.filter(i => {
                const date = new Date(i.date);
                return i.statut === 'TERMINE' &&
                    date.getMonth() === thisMonth &&
                    date.getFullYear() === thisYear;
            }).length;
        },

        toggleView() {
            this.viewMode = this.viewMode === 'calendar' ? 'list' : 'calendar';
        },

        previousPeriod() {
            this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
        },

        nextPeriod() {
            this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
        },

        filterInterventions() {
            this.currentPage = 1;
        },

        resetFilters() {
            this.searchQuery = '';
            this.filters = { type: '', statut: '', notaire: '' };
            this.currentPage = 1;
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },

        viewIntervention(intervention) {
            this.selectedIntervention = intervention;
        },

        modifierIntervention(intervention) {
            this.interventionForm = {
                id: intervention.id,
                type: intervention.type,
                titre: intervention.titre,
                date: intervention.date,
                heureDebut: intervention.heureDebut,
                heureFin: intervention.heureFin,
                client: intervention.client,
                dossier: intervention.dossier,
                notaire: intervention.notaire,
                lieu: intervention.lieu,
                adresseComplete: intervention.adresseComplete,
                description: intervention.description,
                notes: intervention.notes
            };
            this.showCreateModal = true;
            if (this.selectedIntervention) {
                this.selectedIntervention = null;
            }
        },

        async annulerIntervention(intervention) {
            if (confirm(`Êtes-vous sûr de vouloir annuler l'intervention "${intervention.titre}" ?`)) {
                try {
                    const index = this.interventions.findIndex(i => i.id === intervention.id);
                    if (index !== -1) {
                        this.interventions[index].statut = 'ANNULE';
                        this.showMessage('Intervention annulée', 'success');
                        this.calculateStats();
                        if (this.selectedIntervention) {
                            this.selectedIntervention = null;
                        }
                    }
                } catch (error) {
                    console.error('Erreur:', error);
                    this.showMessage('Erreur lors de l\'annulation', 'error');
                }
            }
        },

        async marquerTermine(intervention) {
            try {
                const index = this.interventions.findIndex(i => i.id === intervention.id);
                if (index !== -1) {
                    this.interventions[index].statut = 'TERMINE';
                    this.showMessage('Intervention marquée comme terminée', 'success');
                    this.calculateStats();
                    if (this.selectedIntervention) {
                        this.selectedIntervention = null;
                    }
                }
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors de la mise à jour', 'error');
            }
        },

        async exportPlanning() {
            try {
                const csvContent = [
                    ['Référence', 'Date', 'Heure Début', 'Heure Fin', 'Type', 'Titre', 'Client', 'Notaire', 'Lieu', 'Statut'].join(';'),
                    ...this.filteredInterventions.map(i => [
                        i.reference,
                        this.formatDate(i.date),
                        i.heureDebut,
                        i.heureFin,
                        i.type,
                        i.titre,
                        i.client,
                        i.notaire,
                        i.lieu,
                        this.getStatutLabel(i.statut)
                    ].join(';'))
                ].join('\n');

                const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `planning-interventions-${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                this.showMessage('Planning exporté avec succès', 'success');
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors de l\'export', 'error');
            }
        },

        async rafraichir() {
            await this.loadData();
            this.showMessage('Données actualisées', 'success');
        },

        closeCreateModal() {
            this.showCreateModal = false;
            this.interventionForm = {
                id: null,
                type: '',
                titre: '',
                date: '',
                heureDebut: '',
                heureFin: '',
                client: '',
                dossier: '',
                notaire: '',
                lieu: '',
                adresseComplete: '',
                description: '',
                notes: ''
            };
        },

        async saveIntervention() {
            try {
                // Validation
                if (!this.interventionForm.type || !this.interventionForm.titre ||
                    !this.interventionForm.date || !this.interventionForm.heureDebut ||
                    !this.interventionForm.heureFin || !this.interventionForm.client ||
                    !this.interventionForm.notaire || !this.interventionForm.lieu) {
                    this.showMessage('Veuillez remplir tous les champs obligatoires', 'warning');
                    return;
                }

                // Calcul de la durée
                const debut = parseInt(this.interventionForm.heureDebut.split(':')[0]) * 60 +
                    parseInt(this.interventionForm.heureDebut.split(':')[1]);
                const fin = parseInt(this.interventionForm.heureFin.split(':')[0]) * 60 +
                    parseInt(this.interventionForm.heureFin.split(':')[1]);
                const duree = fin - debut;

                if (duree <= 0) {
                    this.showMessage('L\'heure de fin doit être après l\'heure de début', 'warning');
                    return;
                }

                if (this.interventionForm.id) {
                    // Modification
                    const index = this.interventions.findIndex(i => i.id === this.interventionForm.id);
                    if (index !== -1) {
                        this.interventions[index] = {
                            ...this.interventions[index],
                            ...this.interventionForm,
                            duree: duree
                        };
                        this.showMessage('Intervention modifiée avec succès', 'success');
                    }
                } else {
                    // Création
                    const newIntervention = {
                        id: this.interventions.length + 1,
                        reference: `INT-${String(this.interventions.length + 1).padStart(4, '0')}`,
                        ...this.interventionForm,
                        duree: duree,
                        statut: 'PLANIFIE',
                        documents: []
                    };
                    this.interventions.push(newIntervention);
                    this.showMessage('Intervention créée avec succès', 'success');
                }

                this.calculateStats();
                this.closeCreateModal();
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors de l\'enregistrement', 'error');
            }
        },

        // Méthodes utilitaires
        formatDate(dateString) {
            if (!dateString) return '-';
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },

        isToday(dateString) {
            const today = new Date().toISOString().split('T')[0];
            return dateString === today;
        },

        getDayClass(day) {
            return {
                'text-muted': !day.isCurrentMonth,
                'bg-light': !day.isCurrentMonth
            };
        },

        getTypeColor(type) {
            const colors = {
                'SIGNATURE': 'primary',
                'RDV_CLIENT': 'info',
                'VISITE': 'success',
                'EXPERTISE': 'warning',
                'REUNION': 'secondary'
            };
            return colors[type] || 'secondary';
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'PLANIFIE': 'bg-info',
                'EN_COURS': 'bg-warning',
                'TERMINE': 'bg-success',
                'ANNULE': 'bg-danger'
            };
            return classes[statut] || 'bg-secondary';
        },

        getStatutLabel(statut) {
            const labels = {
                'PLANIFIE': 'Planifié',
                'EN_COURS': 'En cours',
                'TERMINE': 'Terminé',
                'ANNULE': 'Annulé'
            };
            return labels[statut] || statut;
        },

        getRowClass(intervention) {
            if (this.isToday(intervention.date) && intervention.statut !== 'ANNULE') {
                return 'table-info';
            }
            if (intervention.statut === 'ANNULE') {
                return 'table-secondary text-muted';
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
}

.btn {
    border-radius: 6px;
}

.form-control,
.form-select {
    border-radius: 6px;
}

.avatar-sm {
    font-size: 12px;
    font-weight: 600;
}

/* Calendrier */
.calendar-table {
    font-size: 0.9rem;
}

.calendar-table th {
    padding: 12px 8px;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    background-color: #f8f9fa;
}

.calendar-day {
    height: 120px;
    vertical-align: top;
    padding: 8px;
    position: relative;
}

.day-header {
    margin-bottom: 8px;
}

.day-number {
    font-weight: 600;
    font-size: 0.875rem;
}

.day-events {
    max-height: 80px;
    overflow-y: auto;
}

.event-item {
    padding: 4px 6px;
    margin-bottom: 4px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: white;
}

.event-item:hover {
    transform: translateX(2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.event-item small {
    color: white;
    font-size: 0.7rem;
}

/* Scrollbar pour les événements du jour */
.day-events::-webkit-scrollbar {
    width: 4px;
}

.day-events::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.day-events::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

.day-events::-webkit-scrollbar-thumb:hover {
    background: #555;
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