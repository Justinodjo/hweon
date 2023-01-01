<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">

            <!-- En-tête -->
            <div class="row">
                <div class="col-sm-12 mb-4">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">
                                <i class="bi bi-pen me-2"></i>Planning des Signatures
                            </h1>
                            <p class="text-muted mb-0">Gestion des rendez-vous et séances de signature</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <button @click="showCreateModal = true" class="btn btn-primary">
                                <i class="bi bi-plus-circle me-1"></i>Nouveau Rendez-vous
                            </button>
                            <button @click="rafraichir" class="btn btn-outline-primary">
                                <i class="bi bi-arrow-clockwise"></i>
                            </button>
                            <button @click="exportPlanning" class="btn btn-success">
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
                                    <span class="text-muted small">Aujourd'hui</span>
                                    <h3 class="mb-0 mt-2 text-primary">{{ stats.aujourdhui }}</h3>
                                    <small class="text-muted">
                                        <i class="bi bi-calendar-check me-1"></i>Signatures
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-primary bg-opacity-10 text-primary">
                                    <i class="bi bi-calendar-event fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Cette Semaine</span>
                                    <h3 class="mb-0 mt-2 text-info">{{ stats.semaine }}</h3>
                                    <small class="text-muted">
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
                                    <small class="text-muted">
                                        <i class="bi bi-hourglass-split me-1"></i>Confirmation
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
                                    <span class="text-muted small">Complétées</span>
                                    <h3 class="mb-0 mt-2 text-success">{{ stats.completees }}</h3>
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

                <!-- Calendrier Hebdomadaire -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h6 class="mb-0">Semaine du {{ formatWeekRange() }}</h6>
                                    <div class="btn-group btn-group-sm" role="group">
                                        <button class="btn btn-outline-primary" @click="previousWeek">
                                            <i class="bi bi-chevron-left"></i>
                                        </button>
                                        <button class="btn btn-outline-primary" @click="currentWeek">
                                            Aujourd'hui
                                        </button>
                                        <button class="btn btn-outline-primary" @click="nextWeek">
                                            <i class="bi bi-chevron-right"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body p-0">
                                <div class="week-calendar">
                                    <div v-for="day in weekDays" :key="day.date" class="calendar-day"
                                        :class="{ 'today': isToday(day.date), 'weekend': isWeekend(day.date) }">
                                        <div class="day-header">
                                            <div class="day-name">{{ day.name }}</div>
                                            <div class="day-number">{{ day.number }}</div>
                                            <span class="badge bg-primary">{{ getSignaturesByDay(day.date).length
                                            }}</span>
                                        </div>
                                        <div class="day-events">
                                            <div v-for="signature in getSignaturesByDay(day.date)" :key="signature.id"
                                                class="event-card" :class="getEventClass(signature.statut)"
                                                @click="viewSignature(signature)">
                                                <div class="event-time">
                                                    <i class="bi bi-clock me-1"></i>{{ signature.heure }}
                                                </div>
                                                <div class="event-title">{{ signature.acte }}</div>
                                                <div class="event-parties">
                                                    <i class="bi bi-people me-1"></i>
                                                    {{ signature.parties.length }} partie(s)
                                                </div>
                                            </div>
                                            <div v-if="getSignaturesByDay(day.date).length === 0" class="no-events">
                                                Aucune signature
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
                                    <!-- Recherche -->
                                    <div class="col-md-3">
                                        <div class="position-relative">
                                            <input type="text" class="form-control" placeholder="Rechercher..."
                                                v-model="searchQuery" @input="filterSignatures">
                                            <i
                                                class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>

                                    <!-- Filtre Statut -->
                                    <div class="col-md-2">
                                        <select v-model="filters.statut" @change="filterSignatures" class="form-select">
                                            <option value="">Tous les statuts</option>
                                            <option value="PLANIFIE">Planifiée</option>
                                            <option value="CONFIRME">Confirmée</option>
                                            <option value="EN_COURS">En cours</option>
                                            <option value="COMPLETE">Complétée</option>
                                            <option value="ANNULE">Annulée</option>
                                        </select>
                                    </div>

                                    <!-- Filtre Type -->
                                    <div class="col-md-2">
                                        <select v-model="filters.type" @change="filterSignatures" class="form-select">
                                            <option value="">Tous les types</option>
                                            <option value="VENTE">Vente</option>
                                            <option value="BAIL">Bail</option>
                                            <option value="DONATION">Donation</option>
                                            <option value="HYPOTHEQUE">Hypothèque</option>
                                        </select>
                                    </div>

                                    <!-- Filtre Notaire -->
                                    <div class="col-md-2">
                                        <select v-model="filters.notaire" @change="filterSignatures"
                                            class="form-select">
                                            <option value="">Tous les notaires</option>
                                            <option value="1">Me. Kouassi</option>
                                            <option value="2">Me. Kone</option>
                                            <option value="3">Me. Diallo</option>
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

                <!-- Vue Liste / Agenda -->
                <div class="row mb-3">
                    <div class="col-12">
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-outline-primary"
                                :class="{ active: viewMode === 'agenda' }" @click="viewMode = 'agenda'">
                                <i class="bi bi-calendar3 me-1"></i>Agenda
                            </button>
                            <button type="button" class="btn btn-outline-primary"
                                :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">
                                <i class="bi bi-list-ul me-1"></i>Liste
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Vue Agenda -->
                <div v-if="viewMode === 'agenda'" class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Signatures à venir</h6>
                            </div>
                            <div class="card-body">
                                <div class="agenda-timeline">
                                    <div v-for="(group, date) in groupedSignatures" :key="date" class="timeline-group">
                                        <div class="timeline-date">
                                            <i class="bi bi-calendar3 me-2"></i>
                                            {{ formatDateLong(date) }}
                                            <span class="badge bg-primary ms-2">{{ group.length }}</span>
                                        </div>
                                        <div class="timeline-items">
                                            <div v-for="signature in group" :key="signature.id" class="timeline-item"
                                                @click="viewSignature(signature)">
                                                <div class="timeline-marker" :class="getMarkerClass(signature.statut)">
                                                </div>
                                                <div class="timeline-content">
                                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                                        <div>
                                                            <strong class="text-primary">#{{ signature.reference
                                                            }}</strong>
                                                            <span class="badge ms-2"
                                                                :class="getStatutBadgeClass(signature.statut)">
                                                                {{ getStatutLabel(signature.statut) }}
                                                            </span>
                                                        </div>
                                                        <span class="text-muted">
                                                            <i class="bi bi-clock me-1"></i>{{ signature.heure }}
                                                        </span>
                                                    </div>
                                                    <h6 class="mb-2">{{ signature.acte }}</h6>
                                                    <div class="row g-2">
                                                        <div class="col-md-4">
                                                            <small class="text-muted">
                                                                <i class="bi bi-briefcase me-1"></i>{{
                                                                    signature.typeLabel }}
                                                            </small>
                                                        </div>
                                                        <div class="col-md-4">
                                                            <small class="text-muted">
                                                                <i class="bi bi-person me-1"></i>{{ signature.notaire }}
                                                            </small>
                                                        </div>
                                                        <div class="col-md-4">
                                                            <small class="text-muted">
                                                                <i class="bi bi-people me-1"></i>{{
                                                                    signature.parties.length }} partie(s)
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

                <!-- Vue Liste -->
                <div v-if="viewMode === 'list'" class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">
                                    Liste des Signatures
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ filteredSignatures.length }} signatures
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
                                                <th>Acte / Type</th>
                                                <th>Notaire</th>
                                                <th>Parties</th>
                                                <th>Statut</th>
                                                <th>Lieu</th>
                                                <th class="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="paginatedSignatures.length === 0">
                                                <td colspan="8" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucune signature trouvée</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="signature in paginatedSignatures" :key="signature.id">
                                                <td>
                                                    <strong class="text-primary">#{{ signature.reference }}</strong>
                                                </td>
                                                <td>
                                                    <div>
                                                        <i class="bi bi-calendar-event me-1"></i>
                                                        {{ formatDate(signature.date) }}
                                                    </div>
                                                    <small class="text-muted">
                                                        <i class="bi bi-clock me-1"></i>{{ signature.heure }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <div>
                                                        <strong>{{ signature.acte }}</strong>
                                                    </div>
                                                    <span class="badge bg-light text-dark">{{ signature.typeLabel
                                                    }}</span>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div
                                                            class="avatar bg-primary bg-opacity-10 rounded-circle me-2 p-2">
                                                            <i class="bi bi-person fs-6 text-primary"></i>
                                                        </div>
                                                        <span>{{ signature.notaire }}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <i class="bi bi-people me-1"></i>
                                                        <span>{{ signature.parties.length }}</span>
                                                        <button class="btn btn-sm btn-link p-0 ms-2"
                                                            @click="viewParties(signature)">
                                                            Voir
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getStatutBadgeClass(signature.statut)">
                                                        <i class="bi" :class="getStatutIcon(signature.statut)"></i>
                                                        {{ getStatutLabel(signature.statut) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <small class="text-muted">
                                                        <i class="bi bi-geo-alt me-1"></i>{{ signature.lieu }}
                                                    </small>
                                                </td>
                                                <td class="text-end">
                                                    <div class="dropdown">
                                                        <button class="btn btn-sm btn-light" type="button"
                                                            :id="'dropdown-' + signature.id" data-bs-toggle="dropdown">
                                                            <i class="bi bi-three-dots-vertical"></i>
                                                        </button>
                                                        <ul class="dropdown-menu dropdown-menu-end">
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="viewSignature(signature)">
                                                                    <i class="bi bi-eye me-2"></i>Voir détails
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="confirmerRendezVous(signature)">
                                                                    <i class="bi bi-check-circle me-2"></i>Confirmer
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="envoyerRappel(signature)">
                                                                    <i class="bi bi-bell me-2"></i>Envoyer rappel
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <hr class="dropdown-divider">
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="editSignature(signature)">
                                                                    <i class="bi bi-pencil me-2"></i>Modifier
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item text-danger" href="#"
                                                                    @click.prevent="annulerRendezVous(signature)">
                                                                    <i class="bi bi-x-circle me-2"></i>Annuler
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
                                <div v-if="filteredSignatures.length > perPage" class="card-footer border-top">
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

        <!-- Modal Détails Signature -->
        <div v-if="selectedSignature" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);"
            tabindex="-1">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Signature #{{ selectedSignature.reference }}
                            <span class="badge ms-2" :class="getStatutBadgeClass(selectedSignature.statut)">
                                {{ getStatutLabel(selectedSignature.statut) }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedSignature = null"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-4">
                            <!-- Informations Rendez-vous -->
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-calendar-event me-2"></i>Rendez-vous
                                        </h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Date</label>
                                            <p class="mb-0 fw-bold">{{ formatDateLong(selectedSignature.date) }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Heure</label>
                                            <p class="mb-0">{{ selectedSignature.heure }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Durée estimée</label>
                                            <p class="mb-0">{{ selectedSignature.duree }} min</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Lieu</label>
                                            <p class="mb-0">
                                                <i class="bi bi-geo-alt me-1"></i>{{ selectedSignature.lieu }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Informations Acte -->
                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-file-earmark-text me-2"></i>Acte
                                        </h6>
                                        <div class="mb-2">
                                            <label class="text-muted small">Type</label>
                                            <p class="mb-0">
                                                <span class="badge bg-primary">{{ selectedSignature.typeLabel }}</span>
                                            </p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Intitulé</label>
                                            <p class="mb-0 fw-bold">{{ selectedSignature.acte }}</p>
                                        </div>
                                        <div class="mb-2">
                                            <label class="text-muted small">Notaire responsable</label>
                                            <p class="mb-0">{{ selectedSignature.notaire }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Parties Présentes -->
                            <div class="col-12">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-people me-2"></i>Parties Présentes
                                        </h6>
                                        <div class="row g-3">
                                            <div v-for="partie in selectedSignature.parties" :key="partie.id"
                                                class="col-md-6">
                                                <div class="d-flex align-items-start p-3 bg-white rounded">
                                                    <div
                                                        class="avatar bg-primary bg-opacity-10 rounded-circle me-3 p-2">
                                                        <i class="bi bi-person fs-5 text-primary"></i>
                                                    </div>
                                                    <div class="flex-grow-1">
                                                        <strong>{{ partie.nom }}</strong>
                                                        <div class="text-muted small">{{ partie.qualite }}</div>
                                                        <div class="mt-2">
                                                            <small class="text-muted">
                                                                <i class="bi bi-telephone me-1"></i>{{ partie.telephone
                                                                }}
                                                            </small>
                                                        </div>
                                                        <div v-if="partie.confirme" class="mt-1">
                                                            <span class="badge bg-success">
                                                                <i class="bi bi-check-circle me-1"></i>Confirmé
                                                            </span>
                                                        </div>
                                                        <div v-else class="mt-1">
                                                            <span class="badge bg-warning text-dark">
                                                                <i class="bi bi-clock me-1"></i>En attente
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Documents requis -->
                            <div class="col-12" v-if="selectedSignature.documents">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-file-earmark-check me-2"></i>Documents Requis
                                        </h6>
                                        <div class="row g-2">
                                            <div v-for="doc in selectedSignature.documents" :key="doc.id"
                                                class="col-md-6">
                                                <div class="d-flex align-items-center p-2 bg-white rounded">
                                                    <i class="bi bi-file-earmark-pdf text-danger me-2 fs-5"></i>
                                                    <span>{{ doc.nom }}</span>
                                                    <span v-if="doc.present" class="badge bg-success ms-auto">
                                                        <i class="bi bi-check"></i>
                                                    </span>
                                                    <span v-else class="badge bg-secondary ms-auto">
                                                        En attente
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Notes -->
                            <div class="col-12" v-if="selectedSignature.notes">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3">
                                            <i class="bi bi-sticky me-2"></i>Notes
                                        </h6>
                                        <p class="mb-0">{{ selectedSignature.notes }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="selectedSignature = null">
                            Fermer
                        </button>
                        <button type="button" class="btn btn-info" @click="envoyerRappel(selectedSignature)">
                            <i class="bi bi-bell me-1"></i>Envoyer Rappel
                        </button>
                        <button type="button" class="btn btn-success" @click="confirmerRendezVous(selectedSignature)">
                            <i class="bi bi-check-circle me-1"></i>Confirmer
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Création/Modification Signature -->
        <div v-if="showCreateModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ editMode ? 'Modifier' : 'Nouveau' }} Rendez-vous de Signature
                        </h5>
                        <button type="button" class="btn-close" @click="closeCreateModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Date *</label>
                                <input type="date" v-model="signatureForm.date" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Heure *</label>
                                <input type="time" v-model="signatureForm.heure" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Type d'acte *</label>
                                <select v-model="signatureForm.type" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="VENTE">Vente</option>
                                    <option value="BAIL">Bail</option>
                                    <option value="DONATION">Donation</option>
                                    <option value="HYPOTHEQUE">Hypothèque</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Notaire responsable *</label>
                                <select v-model="signatureForm.notaireId" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="1">Me. Kouassi</option>
                                    <option value="2">Me. Kone</option>
                                    <option value="3">Me. Diallo</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Intitulé de l'acte *</label>
                                <input type="text" v-model="signatureForm.acte" class="form-control"
                                    placeholder="Ex: Vente d'appartement à Cocody" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Durée estimée (min) *</label>
                                <input type="number" v-model="signatureForm.duree" class="form-control" placeholder="60"
                                    required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Lieu *</label>
                                <select v-model="signatureForm.lieu" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="Étude - Bureau principal">Étude - Bureau principal</option>
                                    <option value="Étude - Salle de réunion">Étude - Salle de réunion</option>
                                    <option value="Extérieur">Extérieur</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Notes</label>
                                <textarea v-model="signatureForm.notes" class="form-control" rows="3"
                                    placeholder="Instructions particulières, remarques..."></textarea>
                            </div>

                            <!-- Parties -->
                            <div class="col-12">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <label class="form-label mb-0">Parties présentes</label>
                                    <button type="button" class="btn btn-sm btn-outline-primary" @click="ajouterPartie">
                                        <i class="bi bi-plus-circle me-1"></i>Ajouter une partie
                                    </button>
                                </div>
                                <div v-for="(partie, index) in signatureForm.parties" :key="index" class="card mb-2">
                                    <div class="card-body p-3">
                                        <div class="row g-2">
                                            <div class="col-md-5">
                                                <input type="text" v-model="partie.nom"
                                                    class="form-control form-control-sm" placeholder="Nom complet">
                                            </div>
                                            <div class="col-md-3">
                                                <input type="text" v-model="partie.qualite"
                                                    class="form-control form-control-sm" placeholder="Qualité">
                                            </div>
                                            <div class="col-md-3">
                                                <input type="tel" v-model="partie.telephone"
                                                    class="form-control form-control-sm" placeholder="Téléphone">
                                            </div>
                                            <div class="col-md-1">
                                                <button type="button" class="btn btn-sm btn-outline-danger w-100"
                                                    @click="retirerPartie(index)">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeCreateModal">
                            Annuler
                        </button>
                        <button type="button" class="btn btn-primary" @click="saveSignature">
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
    name: 'PlanningSignatures',

    data() {
        return {
            loading: true,
            viewMode: 'agenda',
            searchQuery: '',
            currentPage: 1,
            perPage: 10,
            selectedSignature: null,
            showCreateModal: false,
            editMode: false,
            currentWeekStart: new Date(),

            filters: {
                statut: '',
                type: '',
                notaire: ''
            },

            signatureForm: {
                id: null,
                date: '',
                heure: '',
                type: '',
                notaireId: '',
                acte: '',
                duree: 60,
                lieu: '',
                notes: '',
                parties: []
            },

            signatures: [],
            stats: {
                aujourdhui: 0,
                semaine: 0,
                enAttente: 0,
                completees: 0
            }
        };
    },

    computed: {
        filteredSignatures() {
            let result = [...this.signatures];

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(s =>
                    s.reference.toLowerCase().includes(query) ||
                    s.acte.toLowerCase().includes(query) ||
                    s.notaire.toLowerCase().includes(query)
                );
            }

            if (this.filters.statut) {
                result = result.filter(s => s.statut === this.filters.statut);
            }

            if (this.filters.type) {
                result = result.filter(s => s.type === this.filters.type);
            }

            if (this.filters.notaire) {
                result = result.filter(s => s.notaireId === this.filters.notaire);
            }

            return result.sort((a, b) => new Date(a.date) - new Date(b.date));
        },

        paginatedSignatures() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredSignatures.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.filteredSignatures.length / this.perPage);
        },

        weekDays() {
            const days = [];
            const startDate = new Date(this.currentWeekStart);
            startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Lundi

            for (let i = 0; i < 7; i++) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + i);
                days.push({
                    date: date.toISOString().split('T')[0],
                    name: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
                    number: date.getDate()
                });
            }
            return days;
        },

        groupedSignatures() {
            const groups = {};
            this.filteredSignatures.forEach(sig => {
                if (!groups[sig.date]) {
                    groups[sig.date] = [];
                }
                groups[sig.date].push(sig);
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
                const today = new Date();
                this.signatures = Array.from({ length: 30 }, (_, i) => {
                    const date = new Date(today);
                    date.setDate(date.getDate() + Math.floor(Math.random() * 30) - 5);

                    return {
                        id: i + 1,
                        reference: `SIG-${String(i + 1).padStart(4, '0')}`,
                        date: date.toISOString().split('T')[0],
                        heure: ['09:00', '10:30', '14:00', '15:30', '16:00'][Math.floor(Math.random() * 5)],
                        type: ['VENTE', 'BAIL', 'DONATION', 'HYPOTHEQUE'][Math.floor(Math.random() * 4)],
                        typeLabel: ['Vente', 'Bail', 'Donation', 'Hypothèque'][Math.floor(Math.random() * 4)],
                        acte: `Acte de signature ${i + 1}`,
                        notaire: ['Me. Kouassi', 'Me. Kone', 'Me. Diallo'][Math.floor(Math.random() * 3)],
                        notaireId: String(Math.floor(Math.random() * 3) + 1),
                        statut: ['PLANIFIE', 'CONFIRME', 'EN_COURS', 'COMPLETE', 'ANNULE'][Math.floor(Math.random() * 5)],
                        lieu: ['Étude - Bureau principal', 'Étude - Salle de réunion', 'Extérieur'][Math.floor(Math.random() * 3)],
                        duree: [30, 45, 60, 90][Math.floor(Math.random() * 4)],
                        parties: Array.from({ length: Math.floor(Math.random() * 3) + 2 }, (_, j) => ({
                            id: j + 1,
                            nom: `Partie ${j + 1}`,
                            qualite: ['Vendeur', 'Acheteur', 'Témoin', 'Mandataire'][Math.floor(Math.random() * 4)],
                            telephone: '+225 07 XX XX XX XX',
                            confirme: Math.random() > 0.3
                        })),
                        documents: [
                            { id: 1, nom: 'Pièce d\'identité', present: Math.random() > 0.5 },
                            { id: 2, nom: 'Certificat de propriété', present: Math.random() > 0.5 },
                            { id: 3, nom: 'Procuration', present: Math.random() > 0.5 }
                        ],
                        notes: Math.random() > 0.5 ? 'Notes importantes pour cette signature' : null
                    };
                });

                this.calculateStats();

            } catch (error) {
                console.error('Erreur:', error);
                ElMessage.error('Erreur lors du chargement');
            } finally {
                this.loading = false;
            }
        },

        calculateStats() {
            const today = new Date().toISOString().split('T')[0];
            const weekEnd = new Date();
            weekEnd.setDate(weekEnd.getDate() + 7);
            const weekEndStr = weekEnd.toISOString().split('T')[0];

            this.stats.aujourdhui = this.signatures.filter(s => s.date === today).length;
            this.stats.semaine = this.signatures.filter(s =>
                s.date >= today && s.date <= weekEndStr
            ).length;
            this.stats.enAttente = this.signatures.filter(s =>
                s.statut === 'PLANIFIE' || s.statut === 'CONFIRME'
            ).length;

            const thisMonth = new Date().getMonth();
            this.stats.completees = this.signatures.filter(s => {
                const sigDate = new Date(s.date);
                return s.statut === 'COMPLETE' && sigDate.getMonth() === thisMonth;
            }).length;
        },

        getSignaturesByDay(date) {
            return this.filteredSignatures.filter(s => s.date === date);
        },

        filterSignatures() {
            this.currentPage = 1;
        },

        resetFilters() {
            this.searchQuery = '';
            this.filters = {
                statut: '',
                type: '',
                notaire: ''
            };
            this.currentPage = 1;
        },

        viewSignature(signature) {
            this.selectedSignature = signature;
        },

        viewParties(signature) {
            this.viewSignature(signature);
        },

        editSignature(signature) {
            this.editMode = true;
            this.signatureForm = {
                ...signature,
                parties: signature.parties.map(p => ({ ...p }))
            };
            this.showCreateModal = true;
        },

        closeCreateModal() {
            this.showCreateModal = false;
            this.editMode = false;
            this.signatureForm = {
                id: null,
                date: '',
                heure: '',
                type: '',
                notaireId: '',
                acte: '',
                duree: 60,
                lieu: '',
                notes: '',
                parties: []
            };
        },

        saveSignature() {
            try {
                if (!this.signatureForm.date || !this.signatureForm.heure ||
                    !this.signatureForm.type || !this.signatureForm.notaireId ||
                    !this.signatureForm.acte) {
                    ElMessage.warning('Veuillez remplir tous les champs obligatoires');
                    return;
                }

                if (this.signatureForm.parties.length === 0) {
                    ElMessage.warning('Veuillez ajouter au moins une partie');
                    return;
                }

                if (this.editMode) {
                    ElMessage.success('Rendez-vous modifié avec succès!');
                } else {
                    ElMessage.success('Rendez-vous créé avec succès!');
                }
                this.closeCreateModal();
                this.loadData();
            } catch (error) {
                console.error('Erreur:', error);
                ElMessage.error('Erreur lors de la sauvegarde');
            }
        },

        ajouterPartie() {
            this.signatureForm.parties.push({
                nom: '',
                qualite: '',
                telephone: ''
            });
        },

        retirerPartie(index) {
            this.signatureForm.parties.splice(index, 1);
        },

        async confirmerRendezVous(signature) {
            try {
                await ElMessageBox.confirm(
                    'Confirmer ce rendez-vous de signature ?',
                    'Confirmation',
                    {
                        confirmButtonText: 'Confirmer',
                        cancelButtonText: 'Annuler',
                        type: 'info'
                    }
                );

                ElMessage.success('Rendez-vous confirmé !');
                if (this.selectedSignature) {
                    this.selectedSignature = null;
                }
                this.loadData();
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur:', error);
                }
            }
        },

        async annulerRendezVous(signature) {
            try {
                const { value: raison } = await ElMessageBox.prompt(
                    'Motif d\'annulation',
                    'Annuler le rendez-vous',
                    {
                        confirmButtonText: 'Annuler le RDV',
                        cancelButtonText: 'Retour',
                        inputType: 'textarea',
                        inputPlaceholder: 'Indiquez la raison de l\'annulation...'
                    }
                );

                if (raison) {
                    ElMessage.success('Rendez-vous annulé');
                    if (this.selectedSignature) {
                        this.selectedSignature = null;
                    }
                    this.loadData();
                }
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur:', error);
                }
            }
        },

        envoyerRappel(signature) {
            ElMessage.success('Rappels envoyés aux parties !');
        },

        exportPlanning() {
            ElMessage.success('Export du planning en cours...');
        },

        rafraichir() {
            this.loadData();
            ElMessage.success('Données mises à jour !');
        },

        // Navigation semaine
        previousWeek() {
            const newDate = new Date(this.currentWeekStart);
            newDate.setDate(newDate.getDate() - 7);
            this.currentWeekStart = newDate;
        },

        nextWeek() {
            const newDate = new Date(this.currentWeekStart);
            newDate.setDate(newDate.getDate() + 7);
            this.currentWeekStart = newDate;
        },

        currentWeek() {
            this.currentWeekStart = new Date();
        },

        formatWeekRange() {
            const start = new Date(this.currentWeekStart);
            start.setDate(start.getDate() - start.getDay() + 1);
            const end = new Date(start);
            end.setDate(end.getDate() + 6);

            return `${start.getDate()} ${start.toLocaleDateString('fr-FR', { month: 'short' })} - ${end.getDate()} ${end.toLocaleDateString('fr-FR', { month: 'short' })}`;
        },

        isToday(date) {
            return date === new Date().toISOString().split('T')[0];
        },

        isWeekend(date) {
            const day = new Date(date).getDay();
            return day === 0 || day === 6;
        },

        getEventClass(statut) {
            const classes = {
                'PLANIFIE': 'event-planifie',
                'CONFIRME': 'event-confirme',
                'EN_COURS': 'event-encours',
                'COMPLETE': 'event-complete',
                'ANNULE': 'event-annule'
            };
            return classes[statut] || '';
        },

        getMarkerClass(statut) {
            const classes = {
                'PLANIFIE': 'marker-warning',
                'CONFIRME': 'marker-info',
                'EN_COURS': 'marker-primary',
                'COMPLETE': 'marker-success',
                'ANNULE': 'marker-danger'
            };
            return classes[statut] || 'marker-secondary';
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'PLANIFIE': 'bg-warning text-dark',
                'CONFIRME': 'bg-info',
                'EN_COURS': 'bg-primary',
                'COMPLETE': 'bg-success',
                'ANNULE': 'bg-danger'
            };
            return classes[statut] || 'bg-secondary';
        },

        getStatutLabel(statut) {
            const labels = {
                'PLANIFIE': 'Planifiée',
                'CONFIRME': 'Confirmée',
                'EN_COURS': 'En cours',
                'COMPLETE': 'Complétée',
                'ANNULE': 'Annulée'
            };
            return labels[statut] || statut;
        },

        getStatutIcon(statut) {
            const icons = {
                'PLANIFIE': 'bi-calendar-check',
                'CONFIRME': 'bi-check-circle',
                'EN_COURS': 'bi-hourglass-split',
                'COMPLETE': 'bi-check-circle-fill',
                'ANNULE': 'bi-x-circle'
            };
            return icons[statut] || 'bi-circle';
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

/* Calendrier Hebdomadaire */
.week-calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background: #dee2e6;
}

.calendar-day {
    background: white;
    min-height: 200px;
    display: flex;
    flex-direction: column;
}

.calendar-day.today {
    background: #e7f3ff;
}

.calendar-day.weekend {
    background: #f8f9fa;
}

.day-header {
    padding: 10px;
    border-bottom: 2px solid #dee2e6;
    text-align: center;
}

.day-name {
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    color: #6c757d;
}

.day-number {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 5px 0;
}

.day-events {
    flex: 1;
    padding: 8px;
    overflow-y: auto;
}

.event-card {
    padding: 8px;
    margin-bottom: 6px;
    border-radius: 6px;
    border-left: 3px solid;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.85rem;
}

.event-card:hover {
    transform: translateX(2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.event-planifie {
    background: #fff3cd;
    border-left-color: #ffc107;
}

.event-confirme {
    background: #d1ecf1;
    border-left-color: #0dcaf0;
}

.event-encours {
    background: #cfe2ff;
    border-left-color: #0d6efd;
}

.event-complete {
    background: #d1e7dd;
    border-left-color: #198754;
}

.event-annule {
    background: #f8d7da;
    border-left-color: #dc3545;
}

.event-time {
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 0.8rem;
}

.event-title {
    font-weight: 500;
    margin-bottom: 4px;
}

.event-parties {
    font-size: 0.75rem;
    color: #6c757d;
}

.no-events {
    text-align: center;
    color: #adb5bd;
    padding: 20px;
    font-size: 0.85rem;
}

/* Timeline Agenda */
.agenda-timeline {
    padding: 20px 0;
}

.timeline-group {
    margin-bottom: 30px;
}

.timeline-date {
    font-size: 1.1rem;
    font-weight: 600;
    color: #0d6efd;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 2px solid #e9ecef;
}

.timeline-items {
    position: relative;
    padding-left: 30px;
}

.timeline-items::before {
    content: '';
    position: absolute;
    left: 9px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #dee2e6;
}

.timeline-item {
    position: relative;
    padding: 15px;
    margin-bottom: 15px;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.timeline-item:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateX(5px);
}

.timeline-marker {
    position: absolute;
    left: -26px;
    top: 20px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 0 0 2px #dee2e6;
}

.marker-warning {
    background: #ffc107;
}

.marker-info {
    background: #0dcaf0;
}

.marker-primary {
    background: #0d6efd;
}

.marker-success {
    background: #198754;
}

.marker-danger {
    background: #dc3545;
}

.marker-secondary {
    background: #6c757d;
}

.timeline-content h6 {
    margin-bottom: 10px;
}

/* Avatar */
.avatar {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Autres styles */
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

    .week-calendar {
        grid-template-columns: 1fr;
    }

    .calendar-day {
        min-height: 150px;
    }

    .timeline-items {
        padding-left: 20px;
    }

    .timeline-marker {
        left: -16px;
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