<template>
  <main>
    <section class="pt-0">
      <div class="container vstack gap-4">
        <!-- Title -->
        <div class="row">
          <div class="col-12">
            <h1 class="fs-4 mb-0">
              <i class="bi bi-calendar-check fa-fw me-1"></i>Planning des Visites
            </h1>
            <p class="text-muted mb-0">Gestion des visites de propriétés</p>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="row g-4">
          <!-- Visites Aujourd'hui -->
          <div class="col-md-6 col-xl-3">
            <div class="card border p-4 h-100">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="text-muted mb-2">Aujourd'hui</h6>
                  <h2 class="mb-0 text-primary">{{ stats.aujourdhui }}</h2>
                  <p class="mb-0 small text-muted mt-2">
                    <i class="bi bi-calendar-day me-1"></i>Visites prévues
                  </p>
                </div>
                <div class="bg-primary bg-opacity-10 p-3 rounded">
                  <i class="bi bi-calendar-day fs-4 text-primary"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- En Attente -->
          <div class="col-md-6 col-xl-3">
            <div class="card border p-4 h-100">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="text-muted mb-2">En Attente</h6>
                  <h2 class="mb-0 text-warning">{{ stats.enAttente }}</h2>
                  <p class="mb-0 small text-muted mt-2">
                    <i class="bi bi-clock-history me-1"></i>À confirmer
                  </p>
                </div>
                <div class="bg-warning bg-opacity-10 p-3 rounded">
                  <i class="bi bi-hourglass-split fs-4 text-warning"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Confirmées -->
          <div class="col-md-6 col-xl-3">
            <div class="card border p-4 h-100">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="text-muted mb-2">Confirmées</h6>
                  <h2 class="mb-0 text-success">{{ stats.confirmees }}</h2>
                  <p class="mb-0 small text-muted mt-2">
                    <i class="bi bi-check-circle me-1"></i>Cette semaine
                  </p>
                </div>
                <div class="bg-success bg-opacity-10 p-3 rounded">
                  <i class="bi bi-check-circle fs-4 text-success"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Terminées -->
          <div class="col-md-6 col-xl-3">
            <div class="card border p-4 h-100">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="text-muted mb-2">Terminées</h6>
                  <h2 class="mb-0 text-info">{{ stats.terminees }}</h2>
                  <p class="mb-0 small text-muted mt-2">
                    <i class="bi bi-check-all me-1"></i>Ce mois
                  </p>
                </div>
                <div class="bg-info bg-opacity-10 p-3 rounded">
                  <i class="bi bi-clipboard-check fs-4 text-info"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions Bar -->
        <div class="row">
          <div class="col-12">
            <div class="card border">
              <div class="card-body">
                <div class="d-flex flex-wrap gap-2 align-items-center justify-content-between">
                  <div class="d-flex gap-2 flex-wrap">
                    <button class="btn btn-primary" @click="showCreateModal = true">
                      <i class="bi bi-plus-circle me-1"></i>Nouvelle visite
                    </button>
                    <button class="btn btn-outline-primary" @click="refreshData">
                      <i class="bi bi-arrow-clockwise me-1"></i>Actualiser
                    </button>
                    <button class="btn btn-outline-secondary" @click="exportVisites">
                      <i class="bi bi-download me-1"></i>Exporter
                    </button>
                  </div>
                  
                  <div class="btn-group" role="group">
                    <button 
                      type="button" 
                      class="btn btn-outline-primary"
                      :class="{ active: viewMode === 'calendar' }"
                      @click="viewMode = 'calendar'">
                      <i class="bi bi-calendar3 me-1"></i>Calendrier
                    </button>
                    <button 
                      type="button" 
                      class="btn btn-outline-primary"
                      :class="{ active: viewMode === 'list' }"
                      @click="viewMode = 'list'">
                      <i class="bi bi-list-ul me-1"></i>Liste
                    </button>
                    <button 
                      type="button" 
                      class="btn btn-outline-primary"
                      :class="{ active: viewMode === 'timeline' }"
                      @click="viewMode = 'timeline'">
                      <i class="bi bi-clock-history me-1"></i>Timeline
                    </button>
                  </div>
                </div>

                <!-- Filters -->
                <div class="row g-3 mt-2">
                  <div class="col-md-3">
                    <input 
                      type="text" 
                      class="form-control" 
                      placeholder="Rechercher..."
                      v-model="searchQuery"
                      @input="filterVisites">
                  </div>
                  <div class="col-md-2">
                    <select v-model="filters.status" @change="filterVisites" class="form-select">
                      <option value="">Tous les statuts</option>
                      <option value="EN_ATTENTE">En attente</option>
                      <option value="CONFIRMEE">Confirmée</option>
                      <option value="TERMINEE">Terminée</option>
                      <option value="ANNULEE">Annulée</option>
                    </select>
                  </div>
                  <div class="col-md-2">
                    <input 
                      type="date" 
                      class="form-control" 
                      v-model="filters.dateDebut"
                      @change="filterVisites">
                  </div>
                  <div class="col-md-2">
                    <input 
                      type="date" 
                      class="form-control" 
                      v-model="filters.dateFin"
                      @change="filterVisites">
                  </div>
                  <div class="col-md-3">
                    <select v-model="filters.propriete" @change="filterVisites" class="form-select">
                      <option value="">Toutes les propriétés</option>
                      <option v-for="bien in availableBiens" :key="bien.id" :value="bien.id">
                        {{ bien.nom }}
                      </option>
                    </select>
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
                  <h5 class="card-header-title mb-0">
                    <i class="bi bi-calendar3 me-2"></i>{{ currentMonthYear }}
                  </h5>
                  <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" @click="previousMonth">
                      <i class="bi bi-chevron-left"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" @click="goToToday">
                      Aujourd'hui
                    </button>
                    <button class="btn btn-sm btn-outline-primary" @click="nextMonth">
                      <i class="bi bi-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="card-body p-0">
                <div class="calendar-container">
                  <div class="calendar-header">
                    <div v-for="day in daysOfWeek" :key="day" class="calendar-day-header">
                      {{ day }}
                    </div>
                  </div>
                  <div class="calendar-grid">
                    <div 
                      v-for="(day, index) in calendarDays" 
                      :key="index"
                      class="calendar-cell"
                      :class="{ 
                        'other-month': !day.isCurrentMonth,
                        'today': day.isToday,
                        'has-visits': day.visites.length > 0
                      }"
                      @click="openDayVisites(day)">
                      <div class="cell-header">
                        <span class="day-number">{{ day.date }}</span>
                        <span v-if="day.visites.length > 0" class="badge bg-primary rounded-pill">
                          {{ day.visites.length }}
                        </span>
                      </div>
                      <div class="cell-content">
                        <div 
                          v-for="visite in day.visites.slice(0, 3)" 
                          :key="visite.id"
                          class="visite-badge"
                          :class="getVisiteBadgeClass(visite.status)"
                          @click.stop="viewVisite(visite)">
                          <i class="bi" :class="getStatusIcon(visite.status)"></i>
                          <span class="time">{{ formatTime(visite.heureVisite) }}</span>
                          <span class="name">{{ visite.visiteurNom }}</span>
                        </div>
                        <small v-if="day.visites.length > 3" class="text-muted more-indicator">
                          +{{ day.visites.length - 3 }} plus
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-if="viewMode === 'list'" class="row">
          <div class="col-12">
            <div class="card border">
              <div class="card-header border-bottom">
                <h5 class="card-header-title">
                  Liste des Visites
                  <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                    {{ filteredVisites.length }} visites
                  </span>
                </h5>
              </div>
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                      <tr>
                        <th class="px-4">Date & Heure</th>
                        <th>Propriété</th>
                        <th>Visiteur</th>
                        <th>Contact</th>
                        <th>Statut</th>
                        <th>Notes</th>
                        <th class="text-end px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="7" class="text-center py-5">
                          <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Chargement...</span>
                          </div>
                        </td>
                      </tr>
                      <tr v-else-if="paginatedVisites.length === 0">
                        <td colspan="7" class="text-center py-5">
                          <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                          <p class="text-muted mb-0">Aucune visite trouvée</p>
                        </td>
                      </tr>
                      <tr v-else v-for="visite in paginatedVisites" :key="visite.id" 
                          :class="{ 'table-warning': isToday(visite.dateVisite) }">
                        <td class="px-4">
                          <div>
                            <strong>{{ formatDate(visite.dateVisite) }}</strong>
                            <div class="text-muted small">
                              <i class="bi bi-clock me-1"></i>{{ formatTime(visite.heureVisite) }}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong>{{ visite.bienNom }}</strong>
                            <small class="text-muted d-block">
                              <i class="bi bi-geo-alt me-1"></i>{{ visite.bienAdresse }}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <i class="bi bi-person-circle me-1"></i>{{ visite.visiteurNom }}
                          </div>
                        </td>
                        <td>
                          <div v-if="visite.visiteurTel" class="small">
                            <i class="bi bi-telephone me-1"></i>{{ visite.visiteurTel }}
                          </div>
                          <div v-if="visite.visiteurEmail" class="small text-muted">
                            <i class="bi bi-envelope me-1"></i>{{ visite.visiteurEmail }}
                          </div>
                        </td>
                        <td>
                          <span class="badge" :class="getStatusBadgeClass(visite.status)">
                            <i class="bi" :class="getStatusIcon(visite.status)"></i>
                            {{ getStatusLabel(visite.status) }}
                          </span>
                        </td>
                        <td>
                          <small class="text-muted">
                            {{ visite.notes ? visite.notes.substring(0, 30) + '...' : '—' }}
                          </small>
                        </td>
                        <td class="text-end px-4">
                          <div class="dropdown">
                            <button 
                              class="btn btn-sm btn-light" 
                              type="button" 
                              :id="'dropdown-' + visite.id"
                              data-bs-toggle="dropdown">
                              <i class="bi bi-three-dots-vertical"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                              <li>
                                <a class="dropdown-item" href="#" @click.prevent="viewVisite(visite)">
                                  <i class="bi bi-eye me-2"></i>Voir détails
                                </a>
                              </li>
                              <li v-if="visite.status === 'EN_ATTENTE'">
                                <a class="dropdown-item text-success" href="#" @click.prevent="confirmerVisite(visite.id)">
                                  <i class="bi bi-check-circle me-2"></i>Confirmer
                                </a>
                              </li>
                              <li v-if="visite.status === 'CONFIRMEE'">
                                <a class="dropdown-item text-info" href="#" @click.prevent="terminerVisite(visite.id)">
                                  <i class="bi bi-check-all me-2"></i>Marquer terminée
                                </a>
                              </li>
                              <li><hr class="dropdown-divider"></li>
                              <li>
                                <a class="dropdown-item" href="#" @click.prevent="editVisite(visite)">
                                  <i class="bi bi-pencil me-2"></i>Modifier
                                </a>
                              </li>
                              <li>
                                <a class="dropdown-item text-danger" href="#" @click.prevent="annulerVisite(visite.id)">
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
                <div v-if="filteredVisites.length > perPage" class="card-footer border-top">
                  <nav>
                    <ul class="pagination justify-content-center mb-0">
                      <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <a class="page-link" href="#" @click.prevent="currentPage--">Précédent</a>
                      </li>
                      <li v-for="page in totalPages" 
                          :key="page" 
                          class="page-item" 
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
            </div>
          </div>
        </div>

        <!-- Timeline View -->
        <div v-if="viewMode === 'timeline'" class="row">
          <div class="col-12">
            <div class="card border">
              <div class="card-body">
                <div class="timeline-wrapper">
                  <div v-for="(group, date) in groupedByDate" :key="date" class="timeline-group">
                    <div class="timeline-date-header">
                      <h6 class="mb-0">
                        <i class="bi bi-calendar-event me-2"></i>
                        {{ formatDate(date) }}
                        <span class="badge bg-primary ms-2">{{ group.length }}</span>
                      </h6>
                    </div>
                    <div class="timeline-items">
                      <div v-for="visite in group" :key="visite.id" class="timeline-item">
                        <div class="timeline-marker" :class="getTimelineMarkerClass(visite.status)"></div>
                        <div class="timeline-content card border mb-3">
                          <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <h6 class="mb-1">
                                  <i class="bi bi-clock me-1"></i>{{ formatTime(visite.heureVisite) }}
                                  <span class="text-muted mx-2">|</span>
                                  {{ visite.bienNom }}
                                </h6>
                                <p class="text-muted small mb-0">
                                  <i class="bi bi-person me-1"></i>{{ visite.visiteurNom }}
                                  <span v-if="visite.visiteurTel" class="ms-2">
                                    <i class="bi bi-telephone me-1"></i>{{ visite.visiteurTel }}
                                  </span>
                                </p>
                              </div>
                              <span class="badge" :class="getStatusBadgeClass(visite.status)">
                                {{ getStatusLabel(visite.status) }}
                              </span>
                            </div>
                            <p v-if="visite.notes" class="mb-2 small">
                              <i class="bi bi-chat-left-text me-1"></i>{{ visite.notes }}
                            </p>
                            <div class="d-flex gap-2">
                              <button class="btn btn-sm btn-outline-primary" @click="viewVisite(visite)">
                                Détails
                              </button>
                              <button v-if="visite.status === 'EN_ATTENTE'" 
                                      class="btn btn-sm btn-success" 
                                      @click="confirmerVisite(visite.id)">
                                Confirmer
                              </button>
                              <button v-if="visite.status === 'CONFIRMEE'" 
                                      class="btn btn-sm btn-info" 
                                      @click="terminerVisite(visite.id)">
                                Terminer
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
        </div>
      </div>
    </section>

    <!-- Modal Création/Modification Visite -->
    <div v-if="showCreateModal || showEditModal" 
         class="modal fade show d-block" 
         style="background: rgba(0,0,0,0.5);" 
         tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ showEditModal ? 'Modifier la visite' : 'Nouvelle visite' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModals"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveVisite">
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label">Propriété <span class="text-danger">*</span></label>
                  <select v-model="formVisite.bienId" class="form-select" required>
                    <option value="">Sélectionner une propriété</option>
                    <option v-for="bien in availableBiens" :key="bien.id" :value="bien.id">
                      {{ bien.nom }} - {{ bien.adresse }}
                    </option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Date de visite <span class="text-danger">*</span></label>
                  <input 
                    type="date" 
                    class="form-control" 
                    v-model="formVisite.dateVisite"
                    :min="today"
                    required>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Heure <span class="text-danger">*</span></label>
                  <input 
                    type="time" 
                    class="form-control" 
                    v-model="formVisite.heureVisite"
                    required>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Nom du visiteur <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="formVisite.visiteurNom"
                    placeholder="Nom complet"
                    required>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Téléphone <span class="text-danger">*</span></label>
                  <input 
                    type="tel" 
                    class="form-control" 
                    v-model="formVisite.visiteurTel"
                    placeholder="+225 XX XX XX XX XX"
                    required>
                </div>

                <div class="col-md-12">
                  <label class="form-label">Email</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    v-model="formVisite.visiteurEmail"
                    placeholder="email@exemple.com">
                </div>

                <div class="col-md-6">
                  <label class="form-label">Statut</label>
                  <select v-model="formVisite.status" class="form-select">
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="CONFIRMEE">Confirmée</option>
                    <option value="TERMINEE">Terminée</option>
                    <option value="ANNULEE">Annulée</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Type de visite</label>
                  <select v-model="formVisite.typeVisite" class="form-select">
                    <option value="PREMIERE_VISITE">Première visite</option>
                    <option value="DEUXIEME_VISITE">Deuxième visite</option>
                    <option value="VISITE_GROUPE">Visite de groupe</option>
                    <option value="VISITE_VIRTUELLE">Visite virtuelle</option>
                  </select>
                </div>

                <div class="col-md-12">
                  <label class="form-label">Notes / Commentaires</label>
                  <textarea 
                    class="form-control" 
                    rows="4" 
                    v-model="formVisite.notes"
                    placeholder="Ajoutez des notes ou commentaires..."></textarea>
                </div>

                <div class="col-md-12">
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      v-model="formVisite.envoyerRappel"
                      id="envoyerRappel">
                    <label class="form-check-label" for="envoyerRappel">
                      Envoyer un rappel par email/SMS
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModals">
              Annuler
            </button>
            <button type="button" class="btn btn-primary" @click="saveVisite">
              <i class="bi bi-check-circle me-1"></i>
              {{ showEditModal ? 'Mettre à jour' : 'Créer' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Détails Visite -->
    <div v-if="selectedVisite" 
         class="modal fade show d-block" 
         style="background: rgba(0,0,0,0.5);" 
         tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Détails de la Visite
              <span class="badge ms-2" :class="getStatusBadgeClass(selectedVisite.status)">
                {{ getStatusLabel(selectedVisite.status) }}
              </span>
            </h5>
            <button type="button" class="btn-close" @click="selectedVisite = null"></button>
          </div>
          <div class="modal-body">
            <div class="row g-4">
              <!-- Informations Date & Heure -->
              <div class="col-md-6">
                <div class="card bg-light border-0">
                  <div class="card-body">
                    <h6 class="mb-3">
                      <i class="bi bi-calendar-event me-2"></i>Date & Heure
                    </h6>
                    <div class="mb-2">
                      <label class="text-muted small">Date</label>
                      <p class="mb-0 fw-bold">{{ formatDate(selectedVisite.dateVisite) }}</p>
                    </div>
                    <div class="mb-2">
                      <label class="text-muted small">Heure</label>
                      <p class="mb-0 fw-bold">{{ formatTime(selectedVisite.heureVisite) }}</p>
                    </div>
                    <div class="mb-2">
                      <label class="text-muted small">Type</label>
                      <p class="mb-0">{{ selectedVisite.typeVisite || 'Première visite' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Informations Visiteur -->
              <div class="col-md-6">
                <div class="card bg-light border-0">
                  <div class="card-body">
                    <h6 class="mb-3">
                      <i class="bi bi-person me-2"></i>Visiteur
                    </h6>
                    <div class="mb-2">
                      <label class="text-muted small">Nom</label>
                      <p class="mb-0 fw-bold">{{ selectedVisite.visiteurNom }}</p>
                    </div>
                    <div class="mb-2">
                      <label class="text-muted small">Téléphone</label>
                      <p class="mb-0">
                        <i class="bi bi-envelope me-1"></i>{{ selectedVisite.visiteurEmail }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Informations Propriété -->
              <div class="col-12">
                <div class="card bg-light border-0">
                  <div class="card-body">
                    <h6 class="mb-3">
                      <i class="bi bi-building me-2"></i>Propriété
                    </h6>
                    <div class="row">
                      <div class="col-md-6 mb-2">
                        <label class="text-muted small">Nom</label>
                        <p class="mb-0 fw-bold">{{ selectedVisite.bienNom }}</p>
                      </div>
                      <div class="col-md-6 mb-2">
                        <label class="text-muted small">Adresse</label>
                        <p class="mb-0">
                          <i class="bi bi-geo-alt me-1"></i>{{ selectedVisite.bienAdresse }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Notes -->
              <div v-if="selectedVisite.notes" class="col-12">
                <div class="card bg-light border-0">
                  <div class="card-body">
                    <h6 class="mb-3">
                      <i class="bi bi-chat-left-text me-2"></i>Notes
                    </h6>
                    <p class="mb-0">{{ selectedVisite.notes }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="selectedVisite = null">
              Fermer
            </button>
            <button v-if="selectedVisite.status === 'EN_ATTENTE'" 
                    type="button" 
                    class="btn btn-success" 
                    @click="confirmerVisite(selectedVisite.id)">
              <i class="bi bi-check-circle me-1"></i>Confirmer
            </button>
            <button v-if="selectedVisite.status === 'CONFIRMEE'" 
                    type="button" 
                    class="btn btn-info" 
                    @click="terminerVisite(selectedVisite.id)">
              <i class="bi bi-check-all me-1"></i>Marquer terminée
            </button>
            <button type="button" class="btn btn-primary" @click="editVisite(selectedVisite)">
              <i class="bi bi-pencil me-1"></i>Modifier
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Visites du Jour -->
    <div v-if="selectedDayVisites" 
         class="modal fade show d-block" 
         style="background: rgba(0,0,0,0.5);" 
         tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-calendar-day me-2"></i>
              Visites du {{ formatDate(selectedDayVisites.date) }}
              <span class="badge bg-primary ms-2">{{ selectedDayVisites.visites.length }}</span>
            </h5>
            <button type="button" class="btn-close" @click="selectedDayVisites = null"></button>
          </div>
          <div class="modal-body">
            <div class="list-group">
              <div 
                v-for="visite in selectedDayVisites.visites" 
                :key="visite.id"
                class="list-group-item list-group-item-action"
                @click="viewVisite(visite)">
                <div class="d-flex w-100 justify-content-between align-items-start">
                  <div>
                    <h6 class="mb-1">
                      <i class="bi bi-clock me-1"></i>{{ formatTime(visite.heureVisite) }}
                      <span class="text-muted mx-2">|</span>
                      {{ visite.bienNom }}
                    </h6>
                    <p class="mb-1 small">
                      <i class="bi bi-person me-1"></i>{{ visite.visiteurNom }}
                      <span v-if="visite.visiteurTel" class="ms-2">
                        <i class="bi bi-telephone me-1"></i>{{ visite.visiteurTel }}
                      </span>
                    </p>
                    <small class="text-muted">{{ visite.bienAdresse }}</small>
                  </div>
                  <span class="badge" :class="getStatusBadgeClass(visite.status)">
                    {{ getStatusLabel(visite.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="selectedDayVisites = null">
              Fermer
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
  name: 'PlanningVisites',
  
  data() {
    return {
      loading: true,
      viewMode: 'calendar',
      searchQuery: '',
      currentPage: 1,
      perPage: 15,
      
      visites: [],
      availableBiens: [],
      
      filters: {
        status: '',
        dateDebut: '',
        dateFin: '',
        propriete: ''
      },
      
      stats: {
        aujourdhui: 0,
        enAttente: 0,
        confirmees: 0,
        terminees: 0
      },
      
      selectedVisite: null,
      selectedDayVisites: null,
      showCreateModal: false,
      showEditModal: false,
      
      formVisite: {
        id: null,
        bienId: '',
        dateVisite: '',
        heureVisite: '',
        visiteurNom: '',
        visiteurTel: '',
        visiteurEmail: '',
        status: 'EN_ATTENTE',
        typeVisite: 'PREMIERE_VISITE',
        notes: '',
        envoyerRappel: true
      },
      
      calendarCurrentDate: new Date(),
      daysOfWeek: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    };
  },

  computed: {
    today() {
      return new Date().toISOString().split('T')[0];
    },

    filteredVisites() {
      let result = this.visites;

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(v => 
          v.visiteurNom?.toLowerCase().includes(query) ||
          v.bienNom?.toLowerCase().includes(query) ||
          v.visiteurTel?.includes(query)
        );
      }

      if (this.filters.status) {
        result = result.filter(v => v.status === this.filters.status);
      }

      if (this.filters.propriete) {
        result = result.filter(v => v.bienId === this.filters.propriete);
      }

      if (this.filters.dateDebut) {
        result = result.filter(v => v.dateVisite >= this.filters.dateDebut);
      }

      if (this.filters.dateFin) {
        result = result.filter(v => v.dateVisite <= this.filters.dateFin);
      }

      return result.sort((a, b) => {
        const dateA = new Date(a.dateVisite + ' ' + a.heureVisite);
        const dateB = new Date(b.dateVisite + ' ' + b.heureVisite);
        return dateA - dateB;
      });
    },

    paginatedVisites() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredVisites.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.filteredVisites.length / this.perPage);
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
      const startDayOfWeek = firstDay.getDay() || 7;

      const days = [];
      
      // Jours du mois précédent
      for (let i = startDayOfWeek - 1; i > 0; i--) {
        const date = new Date(year, month, -i + 1);
        days.push({
          date: date.getDate(),
          fullDate: date,
          isCurrentMonth: false,
          isToday: false,
          visites: []
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
          visites: this.getVisitesForDate(date)
        });
      }

      // Jours du mois suivant
      const remainingDays = 42 - days.length;
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(year, month + 1, i);
        days.push({
          date: i,
          fullDate: date,
          isCurrentMonth: false,
          isToday: false,
          visites: []
        });
      }

      return days;
    },

    groupedByDate() {
      const grouped = {};
      this.filteredVisites.forEach(visite => {
        const date = visite.dateVisite;
        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push(visite);
      });
      return grouped;
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

        // Charger les biens disponibles
        const biensData = await this.getDisponibles();
        this.availableBiens = biensData;

        // Charger les visites (à adapter selon votre API)
        // Pour la démo, on génère des données
        this.visites = this.generateDemoVisites();

        this.calculateStats();

      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        ElMessage.error('Erreur lors du chargement des visites');
      } finally {
        this.loading = false;
      }
    },

    generateDemoVisites() {
      // Données de démonstration
      const visites = [];
      const statuses = ['EN_ATTENTE', 'CONFIRMEE', 'TERMINEE', 'ANNULEE'];
      const noms = ['Jean Dupont', 'Marie Martin', 'Pierre Bernard', 'Sophie Durand', 'Luc Petit'];
      
      for (let i = 0; i < 50; i++) {
        const dateOffset = Math.floor(Math.random() * 60) - 30;
        const date = new Date();
        date.setDate(date.getDate() + dateOffset);
        
        const bienIndex = Math.floor(Math.random() * Math.min(5, this.availableBiens.length));
        const bien = this.availableBiens[bienIndex] || { id: 1, nom: 'Villa Moderne', adresse: 'Cocody, Abidjan' };
        
        visites.push({
          id: i + 1,
          bienId: bien.id,
          bienNom: bien.nom,
          bienAdresse: bien.adresse,
          dateVisite: date.toISOString().split('T')[0],
          heureVisite: `${Math.floor(Math.random() * 12) + 8}:${Math.random() > 0.5 ? '00' : '30'}`,
          visiteurNom: noms[Math.floor(Math.random() * noms.length)],
          visiteurTel: `+225 0${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`,
          visiteurEmail: `visiteur${i}@email.com`,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          typeVisite: 'PREMIERE_VISITE',
          notes: Math.random() > 0.5 ? 'Client intéressé, à rappeler' : ''
        });
      }
      
      return visites;
    },

    calculateStats() {
      const today = new Date().toISOString().split('T')[0];
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const monthStart = new Date();
      monthStart.setDate(1);

      this.stats.aujourdhui = this.visites.filter(v => v.dateVisite === today).length;
      this.stats.enAttente = this.visites.filter(v => v.status === 'EN_ATTENTE').length;
      this.stats.confirmees = this.visites.filter(v => {
        const vDate = new Date(v.dateVisite);
        return v.status === 'CONFIRMEE' && vDate >= weekStart && vDate <= weekEnd;
      }).length;
      this.stats.terminees = this.visites.filter(v => {
        const vDate = new Date(v.dateVisite);
        return v.status === 'TERMINEE' && vDate >= monthStart;
      }).length;
    },

    getVisitesForDate(date) {
      const dateStr = date.toISOString().split('T')[0];
      return this.visites.filter(v => v.dateVisite === dateStr);
    },

    filterVisites() {
      this.currentPage = 1;
    },

    getStatusBadgeClass(status) {
      const classes = {
        'EN_ATTENTE': 'bg-warning',
        'CONFIRMEE': 'bg-success',
        'TERMINEE': 'bg-info',
        'ANNULEE': 'bg-danger'
      };
      return classes[status] || 'bg-secondary';
    },

    getStatusIcon(status) {
      const icons = {
        'EN_ATTENTE': 'bi-hourglass-split',
        'CONFIRMEE': 'bi-check-circle',
        'TERMINEE': 'bi-check-all',
        'ANNULEE': 'bi-x-circle'
      };
      return icons[status] || 'bi-circle';
    },

    getStatusLabel(status) {
      const labels = {
        'EN_ATTENTE': 'En attente',
        'CONFIRMEE': 'Confirmée',
        'TERMINEE': 'Terminée',
        'ANNULEE': 'Annulée'
      };
      return labels[status] || status;
    },

    getVisiteBadgeClass(status) {
      const classes = {
        'EN_ATTENTE': 'badge-warning',
        'CONFIRMEE': 'badge-success',
        'TERMINEE': 'badge-info',
        'ANNULEE': 'badge-danger'
      };
      return classes[status] || 'badge-secondary';
    },

    getTimelineMarkerClass(status) {
      return this.getStatusBadgeClass(status).replace('bg-', '');
    },

    formatDate(date) {
      if (!date) return '—';
      return new Date(date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    formatTime(time) {
      if (!time) return '—';
      return time;
    },

    isToday(date) {
      const today = new Date().toISOString().split('T')[0];
      return date === today;
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

    goToToday() {
      this.calendarCurrentDate = new Date();
    },

    openDayVisites(day) {
      if (day.visites.length > 0) {
        this.selectedDayVisites = {
          date: day.fullDate,
          visites: day.visites
        };
      }
    },

    viewVisite(visite) {
      this.selectedVisite = visite;
      this.selectedDayVisites = null;
    },

    editVisite(visite) {
      this.formVisite = { ...visite };
      this.showEditModal = true;
      this.selectedVisite = null;
    },

    closeModals() {
      this.showCreateModal = false;
      this.showEditModal = false;
      this.resetForm();
    },

    resetForm() {
      this.formVisite = {
        id: null,
        bienId: '',
        dateVisite: '',
        heureVisite: '',
        visiteurNom: '',
        visiteurTel: '',
        visiteurEmail: '',
        status: 'EN_ATTENTE',
        typeVisite: 'PREMIERE_VISITE',
        notes: '',
        envoyerRappel: true
      };
    },

    async saveVisite() {
      try {
        if (!this.formVisite.bienId || !this.formVisite.dateVisite || 
            !this.formVisite.heureVisite || !this.formVisite.visiteurNom || 
            !this.formVisite.visiteurTel) {
          ElMessage.warning('Veuillez remplir tous les champs obligatoires');
          return;
        }

        // Trouver le bien sélectionné
        const bien = this.availableBiens.find(b => b.id === this.formVisite.bienId);

        if (this.showEditModal) {
          // Mise à jour
          const index = this.visites.findIndex(v => v.id === this.formVisite.id);
          if (index !== -1) {
            this.visites[index] = {
              ...this.formVisite,
              bienNom: bien?.nom || '',
              bienAdresse: bien?.adresse || ''
            };
          }
          ElMessage.success('Visite mise à jour avec succès');
        } else {
          // Création
          const newVisite = {
            ...this.formVisite,
            id: this.visites.length + 1,
            bienNom: bien?.nom || '',
            bienAdresse: bien?.adresse || ''
          };
          this.visites.push(newVisite);
          ElMessage.success('Visite créée avec succès');
        }

        this.closeModals();
        this.calculateStats();

      } catch (error) {
        console.error('Erreur sauvegarde visite:', error);
        ElMessage.error('Erreur lors de la sauvegarde');
      }
    },

    async confirmerVisite(visiteId) {
      try {
        await ElMessageBox.confirm(
          'Confirmer cette visite ?',
          'Confirmation',
          {
            confirmButtonText: 'Oui',
            cancelButtonText: 'Annuler',
            type: 'success'
          }
        );

        const visite = this.visites.find(v => v.id === visiteId);
        if (visite) {
          visite.status = 'CONFIRMEE';
          ElMessage.success('Visite confirmée');
          this.calculateStats();
          this.selectedVisite = null;
        }

      } catch (error) {
        if (error !== 'cancel') {
          console.error('Erreur confirmation:', error);
        }
      }
    },

    async terminerVisite(visiteId) {
      try {
        await ElMessageBox.confirm(
          'Marquer cette visite comme terminée ?',
          'Confirmation',
          {
            confirmButtonText: 'Oui',
            cancelButtonText: 'Annuler',
            type: 'info'
          }
        );

        const visite = this.visites.find(v => v.id === visiteId);
        if (visite) {
          visite.status = 'TERMINEE';
          ElMessage.success('Visite terminée');
          this.calculateStats();
          this.selectedVisite = null;
        }

      } catch (error) {
        if (error !== 'cancel') {
          console.error('Erreur:', error);
        }
      }
    },

    async annulerVisite(visiteId) {
      try {
        await ElMessageBox.confirm(
          'Annuler cette visite ?',
          'Confirmation',
          {
            confirmButtonText: 'Oui, annuler',
            cancelButtonText: 'Non',
            type: 'warning'
          }
        );

        const visite = this.visites.find(v => v.id === visiteId);
        if (visite) {
          visite.status = 'ANNULEE';
          ElMessage.success('Visite annulée');
          this.calculateStats();
          this.selectedVisite = null;
        }

      } catch (error) {
        if (error !== 'cancel') {
          console.error('Erreur annulation:', error);
        }
      }
    },

    async refreshData() {
      await this.loadData();
      ElMessage.success('Données actualisées');
    },

    async exportVisites() {
      try {
        // Simulation export
        ElMessage.success('Export en cours...');
        setTimeout(() => {
          ElMessage.success('Visites exportées avec succès');
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

/* Calendar Styles */
.calendar-container {
  padding: 1rem;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
  margin-bottom: 0.5rem;
}

.calendar-day-header {
  text-align: center;
  font-weight: 600;
  padding: 0.75rem;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
}

.calendar-cell {
  min-height: 120px;
  border: 1px solid #dee2e6;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
}

.calendar-cell:hover {
  background: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.calendar-cell.other-month {
  background: #f8f9fa;
  opacity: 0.5;
}

.calendar-cell.today {
  background: #e7f3ff;
  border: 2px solid #0d6efd;
}

.calendar-cell.has-visits {
  background: #fff3cd;
}

.cell-header {
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
}

.day-number {
  font-weight: 600;
  font-size: 0.9rem;
}

.cell-content {
  padding: 0.5rem;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.visite-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.visite-badge:hover {
  opacity: 0.8;
  transform: translateX(2px);
}

.badge-warning {
  background: #fff3cd;
  color: #664d03;
}

.badge-success {
  background: #d1e7dd;
  color: #0f5132;
}

.badge-info {
  background: #cff4fc;
  color: #055160;
}

.badge-danger {
  background: #f8d7da;
  color: #842029;
}

.visite-badge .time {
  font-weight: 600;
}

.visite-badge .name {
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-indicator {
  padding: 0.25rem 0;
  text-align: center;
}

/* Timeline Styles */
.timeline-wrapper {
  position: relative;
}

.timeline-group {
  margin-bottom: 2rem;
}

.timeline-date-header {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.timeline-items {
  position: relative;
  padding-left: 30px;
}

.timeline-items::before {
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
  margin-bottom: 1rem;
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

.timeline-marker.warning {
  background: #ffc107;
}

.timeline-marker.success {
  background: #198754;
}

.timeline-marker.info {
  background: #0dcaf0;
}

.timeline-marker.danger {
  background: #dc3545;
}

.timeline-content {
  margin-left: 20px;
}

/* Table Styles */
.table > :not(caption) > * > * {
  padding: 1rem 0.75rem;
}

.table-warning {
  background-color: #fff3cd;
}

.badge {
  font-weight: 500;
  padding: 0.35em 0.65em;
}
</style> 