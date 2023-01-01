<template>
    <main>
        <section class="pt-0">
            <div class="container vstack gap-4">
                <!-- Title -->
                <div class="row">
                    <div class="col-12">
                        <h1 class="fs-4 mb-0">
                            <i class="bi bi-arrow-repeat fa-fw me-1"></i>Renouvellement des Baux
                        </h1>
                        <p class="text-muted mb-0">Gestion des échéances et renouvellements de contrats</p>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="row g-4">
                    <!-- À Renouveler ce mois -->
                    <div class="col-md-6 col-xl-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">Ce Mois</h6>
                                    <h2 class="mb-0 text-danger">{{ stats.ceMois }}</h2>
                                    <p class="mb-0 small text-muted mt-2">
                                        <i class="bi bi-exclamation-triangle me-1"></i>Urgent
                                    </p>
                                </div>
                                <div class="bg-danger bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-calendar-x fs-4 text-danger"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- À Renouveler 30 jours -->
                    <div class="col-md-6 col-xl-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">30 Jours</h6>
                                    <h2 class="mb-0 text-warning">{{ stats.dans30Jours }}</h2>
                                    <p class="mb-0 small text-muted mt-2">
                                        <i class="bi bi-clock-history me-1"></i>À planifier
                                    </p>
                                </div>
                                <div class="bg-warning bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-calendar-event fs-4 text-warning"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- À Renouveler 60 jours -->
                    <div class="col-md-6 col-xl-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">60 Jours</h6>
                                    <h2 class="mb-0 text-info">{{ stats.dans60Jours }}</h2>
                                    <p class="mb-0 small text-muted mt-2">
                                        <i class="bi bi-calendar-check me-1"></i>À surveiller
                                    </p>
                                </div>
                                <div class="bg-info bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-calendar3 fs-4 text-info"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Renouvelés ce mois -->
                    <div class="col-md-6 col-xl-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">Renouvelés</h6>
                                    <h2 class="mb-0 text-success">{{ stats.renouveles }}</h2>
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
                </div>

                <!-- Timeline Chart -->
                <div class="row">
                    <div class="col-12">
                        <div class="card border">
                            <div class="card-header border-bottom">
                                <h5 class="card-header-title">Échéancier des 12 Prochains Mois</h5>
                            </div>
                            <div class="card-body">
                                <canvas ref="timelineChart" height="80"></canvas>
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
                                    <div class="col-md-3">
                                        <div class="input-group">
                                            <span class="input-group-text">
                                                <i class="bi bi-search"></i>
                                            </span>
                                            <input type="text" class="form-control" placeholder="Rechercher..."
                                                v-model="searchQuery" @input="filterContrats">
                                        </div>
                                    </div>

                                    <!-- Filtre Période -->
                                    <div class="col-md-2">
                                        <select v-model="filters.periode" @change="filterContrats" class="form-select">
                                            <option value="">Toutes périodes</option>
                                            <option value="expire">Expirés</option>
                                            <option value="ce_mois">Ce mois</option>
                                            <option value="30_jours">30 jours</option>
                                            <option value="60_jours">60 jours</option>
                                            <option value="90_jours">90 jours</option>
                                        </select>
                                    </div>

                                    <!-- Filtre Statut -->
                                    <div class="col-md-2">
                                        <select v-model="filters.statut" @change="filterContrats" class="form-select">
                                            <option value="">Tous statuts</option>
                                            <option value="ACTIF">Actif</option>
                                            <option value="A_RENOUVELER">À renouveler</option>
                                            <option value="RENOUVELE">Renouvelé</option>
                                            <option value="RESILIE">Résilié</option>
                                            <option value="EXPIRE">Expiré</option>
                                        </select>
                                    </div>

                                    <!-- Filtre Propriété -->
                                    <div class="col-md-3">
                                        <select v-model="filters.propriete" @change="filterContrats"
                                            class="form-select">
                                            <option value="">Toutes propriétés</option>
                                            <option v-for="bien in availableBiens" :key="bien.id" :value="bien.id">
                                                {{ bien.nom }}
                                            </option>
                                        </select>
                                    </div>

                                    <!-- Filtre Priorité -->
                                    <div class="col-md-2">
                                        <select v-model="filters.priorite" @change="filterContrats" class="form-select">
                                            <option value="">Toutes priorités</option>
                                            <option value="CRITIQUE">Critique</option>
                                            <option value="HAUTE">Haute</option>
                                            <option value="NORMALE">Normale</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="d-flex gap-2 flex-wrap">
                                    <button class="btn btn-primary" @click="showCreateModal = true">
                                        <i class="bi bi-plus-circle me-1"></i>Nouveau contrat
                                    </button>
                                    <button class="btn btn-outline-warning" @click="envoyerRappelsGroupes">
                                        <i class="bi bi-bell me-1"></i>Envoyer rappels
                                    </button>
                                    <button class="btn btn-outline-success" @click="renouvelerSelection">
                                        <i class="bi bi-arrow-repeat me-1"></i>Renouveler sélection
                                    </button>
                                    <button class="btn btn-outline-info" @click="exportContrats">
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

                <!-- Quick Info Bar -->
                <div class="row">
                    <div class="col-12">
                        <div class="alert alert-warning d-flex justify-content-between align-items-center mb-0">
                            <div>
                                <i class="bi bi-info-circle me-2"></i>
                                <strong>{{ filteredContracts?.length || 0 }}</strong> contrats trouvés
                                <span class="mx-2">|</span>
                                <strong>{{ contratsUrgents.length }}</strong> nécessitent une action urgente
                                <span class="mx-2">|</span>
                                <strong>{{ selectedContrats.length }}</strong> sélectionnés
                            </div>
                            <button v-if="contratsUrgents.length > 0" class="btn btn-sm btn-danger"
                                @click="afficherUrgents">
                                <i class="bi bi-exclamation-triangle me-1"></i>Voir urgents
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Contracts List -->
                <div class="row">
                    <div class="col-12">
                        <div class="card border">
                            <div class="card-header border-bottom">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h5 class="card-header-title mb-0">Liste des Contrats</h5>
                                    <div class="btn-group btn-group-sm" role="group">
                                        <button type="button" class="btn"
                                            :class="viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'"
                                            @click="viewMode = 'table'">
                                            <i class="bi bi-table"></i>
                                        </button>
                                        <button type="button" class="btn"
                                            :class="viewMode === 'timeline' ? 'btn-primary' : 'btn-outline-primary'"
                                            @click="viewMode = 'timeline'">
                                            <i class="bi bi-clock-history"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Table View -->
                            <div v-if="viewMode === 'table'" class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover align-middle mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th class="px-4" style="width: 50px;">
                                                    <input type="checkbox" class="form-check-input"
                                                        @change="toggleSelectAll" :checked="allSelected">
                                                </th>
                                                <th>N° Contrat</th>
                                                <th>Locataire</th>
                                                <th>Propriété</th>
                                                <th>Date fin</th>
                                                <th>Jours restants</th>
                                                <th>Loyer</th>
                                                <th>Priorité</th>
                                                <th>Statut</th>
                                                <th class="text-end px-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="loading">
                                                <td colspan="10" class="text-center py-5">
                                                    <div class="spinner-border text-primary" role="status">
                                                        <span class="visually-hidden">Chargement...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr v-else-if="paginatedContrats.length === 0">
                                                <td colspan="10" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucun contrat trouvé</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="contrat in paginatedContrats" :key="contrat.id"
                                                :class="getRowClass(contrat)">
                                                <td class="px-4">
                                                    <input type="checkbox" class="form-check-input"
                                                        :checked="isSelected(contrat.id)"
                                                        @change="toggleSelection(contrat.id)">
                                                </td>
                                                <td>
                                                    <strong class="text-primary">#{{ contrat.numeroContrat }}</strong>
                                                </td>
                                                <td>
                                                    <div>
                                                        <strong>{{ contrat.locataireNom }}</strong>
                                                        <small v-if="contrat.locataireTel" class="text-muted d-block">
                                                            <i class="bi bi-telephone me-1"></i>{{ contrat.locataireTel
                                                            }}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        {{ contrat.bienNom }}
                                                        <small class="text-muted d-block">{{ contrat.bienAdresse
                                                        }}</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span :class="getDateFinClass(contrat.dateFin)">
                                                        {{ formatDate(contrat.dateFin) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span class="badge"
                                                        :class="getJoursRestantsBadge(contrat.joursRestants)">
                                                        <i class="bi"
                                                            :class="getJoursRestantsIcon(contrat.joursRestants)"></i>
                                                        {{ contrat.joursRestants > 0 ? contrat.joursRestants : 0 }}
                                                        jours
                                                    </span>
                                                </td>
                                                <td>
                                                    <strong class="text-success">{{ formatCurrency(contrat.montantLoyer)
                                                    }}</strong>
                                                </td>
                                                <td>
                                                    <span class="badge"
                                                        :class="getPrioriteBadgeClass(contrat.priorite)">
                                                        {{ contrat.priorite }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getStatutBadgeClass(contrat.statut)">
                                                        <i class="bi" :class="getStatutIcon(contrat.statut)"></i>
                                                        {{ getStatutLabel(contrat.statut) }}
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
                                                            <li
                                                                v-if="contrat.statut === 'A_RENOUVELER' || contrat.joursRestants <= 90">
                                                                <a class="dropdown-item text-success" href="#"
                                                                    @click.prevent="openRenewModal(contrat)">
                                                                    <i class="bi bi-arrow-repeat me-2"></i>Renouveler
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="envoyerRappel(contrat.id)">
                                                                    <i class="bi bi-bell me-2"></i>Envoyer rappel
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="downloadContrat(contrat.id)">
                                                                    <i class="bi bi-file-pdf me-2"></i>Télécharger PDF
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
                                                            <li v-if="contrat.statut === 'ACTIF'">
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
                                <div v-if="filteredContrats?.length > perPage" class="card-footer border-top">
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

                            <!-- Timeline View -->
                            <div v-if="viewMode === 'timeline'" class="card-body">
                                <div class="timeline-view">
                                    <div v-for="(group, month) in contratsGroupedByMonth" :key="month"
                                        class="timeline-month-group">
                                        <div class="timeline-month-header">
                                            <h5 class="mb-0">
                                                <i class="bi bi-calendar-month me-2"></i>
                                                {{ month }}
                                                <span class="badge bg-primary ms-2">{{ group.length }}</span>
                                            </h5>
                                        </div>
                                        <div class="timeline-contracts">
                                            <div v-for="contrat in group" :key="contrat.id"
                                                class="timeline-contract-card card border mb-3"
                                                :class="getCardBorderClass(contrat)">
                                                <div class="card-body">
                                                    <div class="d-flex justify-content-between align-items-start mb-3">
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="checkbox"
                                                                :id="'check-timeline-' + contrat.id"
                                                                :checked="isSelected(contrat.id)"
                                                                @change="toggleSelection(contrat.id)">
                                                            <label class="form-check-label"
                                                                :for="'check-timeline-' + contrat.id">
                                                                <strong>#{{ contrat.numeroContrat }}</strong>
                                                            </label>
                                                        </div>
                                                        <div class="d-flex gap-1">
                                                            <span class="badge"
                                                                :class="getPrioriteBadgeClass(contrat.priorite)">
                                                                {{ contrat.priorite }}
                                                            </span>
                                                            <span class="badge"
                                                                :class="getStatutBadgeClass(contrat.statut)">
                                                                {{ getStatutLabel(contrat.statut) }}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div class="row g-3">
                                                        <div class="col-md-6">
                                                            <h6 class="mb-1">
                                                                <i class="bi bi-person-circle me-1"></i>{{
                                                                    contrat.locataireNom }}
                                                            </h6>
                                                            <p class="text-muted small mb-0">{{ contrat.bienNom }}</p>
                                                        </div>
                                                        <div class="col-md-6 text-md-end">
                                                            <small class="text-muted d-block">Date de fin</small>
                                                            <strong :class="getDateFinClass(contrat.dateFin)">
                                                                {{ formatDate(contrat.dateFin) }}
                                                            </strong>
                                                            <div class="mt-1">
                                                                <span class="badge"
                                                                    :class="getJoursRestantsBadge(contrat.joursRestants)">
                                                                    {{ contrat.joursRestants }} jours restants
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="d-flex gap-2 mt-3">
                                                        <button class="btn btn-sm btn-outline-primary"
                                                            @click="viewContrat(contrat)">
                                                            <i class="bi bi-eye"></i>
                                                        </button>
                                                        <button v-if="contrat.joursRestants <= 90"
                                                            class="btn btn-sm btn-success flex-fill"
                                                            @click="openRenewModal(contrat)">
                                                            <i class="bi bi-arrow-repeat me-1"></i>Renouveler
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-warning"
                                                            @click="envoyerRappel(contrat.id)">
                                                            <i class="bi bi-bell"></i>
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
        </section>

        <!-- Modal Détails Contrat -->
        <div v-if="selectedContrat" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Contrat #{{ selectedContrat.numeroContrat }}
                            <span class="badge ms-2" :class="getStatutBadgeClass(selectedContrat.statut)">
                                {{ getStatutLabel(selectedContrat.statut) }}
                            </span>
                            <span class="badge ms-1" :class="getPrioriteBadgeClass(selectedContrat.priorite)">
                                {{ selectedContrat.priorite }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedContrat = null"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-4">
                            <!-- Alert Échéance -->
                            <div v-if="selectedContrat.joursRestants <= 30" class="col-12">
                                <div class="alert"
                                    :class="selectedContrat.joursRestants <= 0 ? 'alert-danger' : 'alert-warning'">
                                    <i class="bi bi-exclamation-triangle me-2"></i>
                                    <strong>{{ selectedContrat.joursRestants <= 0 ? 'Contrat expiré' : 'Échéance proche'
                                    }}!</strong>
                                            {{ selectedContrat.joursRestants <= 0 ? 'Ce contrat est expiré.' : `Il reste
                                                ${selectedContrat.joursRestants} jours avant l'échéance.` }} </div>
                                </div>

                                <!-- Informations Locataire -->
                                <div class="col-md-6">
                                    <div class="card bg-light border-0 h-100">
                                        <div class="card-body">
                                            <h6 class="mb-3">
                                                <i class="bi bi-person-circle me-2"></i>Informations Locataire
                                            </h6>
                                            <div class="mb-2">
                                                <label class="text-muted small">Nom complet</label>
                                                <p class="mb-0 fw-bold">{{ selectedContrat.locataireNom }}</p>
                                            </div>
                                            <div class="mb-2">
                                                <label class="text-muted small">Téléphone</label>
                                                <p class="mb-0">
                                                    <i class="bi bi-telephone me-1"></i>{{ selectedContrat.locataireTel
                                                        || '—' }}
                                                </p>
                                            </div>
                                            <div class="mb-2">
                                                <label class="text-muted small">Email</label>
                                                <p class="mb-0">
                                                    <i class="bi bi-envelope me-1"></i>{{ selectedContrat.locataireEmail
                                                        || '—' }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Informations Propriété -->
                                <div class="col-md-6">
                                    <div class="card bg-light border-0 h-100">
                                        <div class="card-body">
                                            <h6 class="mb-3">
                                                <i class="bi bi-building me-2"></i>Informations Propriété
                                            </h6>
                                            <div class="mb-2">
                                                <label class="text-muted small">Nom</label>
                                                <p class="mb-0 fw-bold">{{ selectedContrat.bienNom }}</p>
                                            </div>
                                            <div class="mb-2">
                                                <label class="text-muted small">Adresse</label>
                                                <p class="mb-0">
                                                    <i class="bi bi-geo-alt me-1"></i>{{ selectedContrat.bienAdresse }}
                                                </p>
                                            </div>
                                            <div class="mb-2">
                                                <label class="text-muted small">Loyer mensuel</label>
                                                <p class="mb-0 fw-bold text-success fs-5">
                                                    {{ formatCurrency(selectedContrat.montantLoyer) }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Détails du Contrat -->
                                <div class="col-12">
                                    <div class="card bg-light border-0">
                                        <div class="card-body">
                                            <h6 class="mb-3">
                                                <i class="bi bi-file-text me-2"></i>Détails du Contrat
                                            </h6>
                                            <div class="row g-3">
                                                <div class="col-md-3">
                                                    <label class="text-muted small">Date de début</label>
                                                    <p class="mb-0 fw-bold">{{ formatDate(selectedContrat.dateDebut) }}
                                                    </p>
                                                </div>
                                                <div class="col-md-3">
                                                    <label class="text-muted small">Date de fin</label>
                                                    <p class="mb-0 fw-bold"
                                                        :class="getDateFinClass(selectedContrat.dateFin)">
                                                        {{ formatDate(selectedContrat.dateFin) }}
                                                    </p>
                                                </div>
                                                <div class="col-md-3">
                                                    <label class="text-muted small">Durée</label>
                                                    <p class="mb-0">{{ calculateDuration(selectedContrat.dateDebut,
                                                        selectedContrat.dateFin) }}</p>
                                                </div>
                                                <div class="col-md-3">
                                                    <label class="text-muted small">Jours restants</label>
                                                    <p class="mb-0">
                                                        <span class="badge fs-6"
                                                            :class="getJoursRestantsBadge(selectedContrat.joursRestants)">
                                                            {{ selectedContrat.joursRestants }} jours
                                                        </span>
                                                    </p>
                                                </div>
                                                <div class="col-md-4">
                                                    <label class="text-muted small">Dépôt de garantie</label>
                                                    <p class="mb-0">{{ formatCurrency(selectedContrat.depotGarantie ||
                                                        0) }}</p>
                                                </div>
                                                <div class="col-md-4">
                                                    <label class="text-muted small">Type de contrat</label>
                                                    <p class="mb-0">{{ selectedContrat.typeContrat || '—' }}</p>
                                                </div>
                                                <div class="col-md-4">
                                                    <label class="text-muted small">Mode de paiement</label>
                                                    <p class="mb-0">{{ selectedContrat.modePaiement || '—' }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Historique Renouvellements -->
                                <div v-if="selectedContrat.historique && selectedContrat.historique.length > 0"
                                    class="col-12">
                                    <div class="card bg-light border-0">
                                        <div class="card-body">
                                            <h6 class="mb-3">
                                                <i class="bi bi-clock-history me-2"></i>Historique des Renouvellements
                                            </h6>
                                            <div class="timeline-simple">
                                                <div v-for="(event, index) in selectedContrat.historique" :key="index"
                                                    class="timeline-item-simple">
                                                    <span class="badge"
                                                        :class="event.type === 'CREATION' ? 'bg-primary' : event.type === 'RENOUVELLEMENT' ? 'bg-success' : 'bg-info'">
                                                        {{ formatDate(event.date) }}
                                                    </span>
                                                    <span class="ms-2">{{ event.description }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Notes -->
                                <div class="col-12">
                                    <div class="card bg-light border-0">
                                        <div class="card-body">
                                            <h6 class="mb-3">
                                                <i class="bi bi-chat-left-text me-2"></i>Notes
                                            </h6>
                                            <textarea class="form-control" rows="4" v-model="selectedContrat.notes"
                                                placeholder="Ajoutez des notes sur ce contrat..."></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="selectedContrat = null">
                                Fermer
                            </button>
                            <button type="button" class="btn btn-info" @click="downloadContrat(selectedContrat.id)">
                                <i class="bi bi-file-pdf me-1"></i>Télécharger PDF
                            </button>
                            <button type="button" class="btn btn-warning" @click="envoyerRappel(selectedContrat.id)">
                                <i class="bi bi-bell me-1"></i>Envoyer rappel
                            </button>
                            <button v-if="selectedContrat.joursRestants <= 90" type="button" class="btn btn-success"
                                @click="openRenewModal(selectedContrat)">
                                <i class="bi bi-arrow-repeat me-1"></i>Renouveler
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Renouvellement -->
            <div v-if="showRenewModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);"
                tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="bi bi-arrow-repeat me-2"></i>Renouveler le Contrat
                            </h5>
                            <button type="button" class="btn-close" @click="closeRenewModal"></button>
                        </div>
                        <div class="modal-body">
                            <div v-if="renewContrat" class="mb-4">
                                <div class="alert alert-info">
                                    <h6 class="mb-2">
                                        <i class="bi bi-info-circle me-2"></i>Informations actuelles
                                    </h6>
                                    <div class="row g-2">
                                        <div class="col-md-6">
                                            <small class="text-muted">Locataire:</small>
                                            <strong class="d-block">{{ renewContrat.locataireNom }}</strong>
                                        </div>
                                        <div class="col-md-6">
                                            <small class="text-muted">Propriété:</small>
                                            <strong class="d-block">{{ renewContrat.bienNom }}</strong>
                                        </div>
                                        <div class="col-md-4">
                                            <small class="text-muted">Date fin actuelle:</small>
                                            <strong class="d-block">{{ formatDate(renewContrat.dateFin) }}</strong>
                                        </div>
                                        <div class="col-md-4">
                                            <small class="text-muted">Loyer actuel:</small>
                                            <strong class="d-block text-success">{{
                                                formatCurrency(renewContrat.montantLoyer) }}</strong>
                                        </div>
                                        <div class="col-md-4">
                                            <small class="text-muted">Jours restants:</small>
                                            <strong class="d-block"
                                                :class="renewContrat.joursRestants <= 0 ? 'text-danger' : 'text-warning'">
                                                {{ renewContrat.joursRestants }} jours
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form @submit.prevent="confirmRenouvellement">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Date de début <span
                                                class="text-danger">*</span></label>
                                        <input type="date" class="form-control" v-model="renewForm.dateDebut"
                                            :min="minRenewDateDebut" required>
                                        <small class="text-muted">La nouvelle période commence après la date de fin
                                            actuelle</small>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label">Date de fin <span class="text-danger">*</span></label>
                                        <input type="date" class="form-control" v-model="renewForm.dateFin"
                                            :min="renewForm.dateDebut" required>
                                        <small class="text-muted">Minimum 6 mois recommandé</small>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label">Nouveau loyer mensuel</label>
                                        <input type="number" class="form-control"
                                            v-model.number="renewForm.montantLoyer"
                                            :placeholder="renewContrat ? formatCurrency(renewContrat.montantLoyer) : '0'">
                                        <small class="text-muted">Laissez vide pour garder le même montant</small>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label">Augmentation (%)</label>
                                        <div class="input-group">
                                            <input type="number" class="form-control"
                                                v-model.number="renewForm.augmentationPourcent" min="0" max="100"
                                                step="0.5" placeholder="0">
                                            <span class="input-group-text">%</span>
                                        </div>
                                        <small v-if="nouveauMontantCalcule > 0" class="text-success">
                                            Nouveau montant: {{ formatCurrency(nouveauMontantCalcule) }}
                                        </small>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label">Durée du renouvellement</label>
                                        <select v-model="renewForm.duree" class="form-select" @change="ajusterDateFin">
                                            <option value="">Personnalisée</option>
                                            <option value="6">6 mois</option>
                                            <option value="12">1 an</option>
                                            <option value="24">2 ans</option>
                                            <option value="36">3 ans</option>
                                        </select>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label">Type de renouvellement</label>
                                        <select v-model="renewForm.typeRenouvellement" class="form-select">
                                            <option value="AUTOMATIQUE">Automatique</option>
                                            <option value="MANUEL">Manuel</option>
                                            <option value="TACITE_RECONDUCTION">Tacite reconduction</option>
                                        </select>
                                    </div>

                                    <div class="col-12">
                                        <label class="form-label">Conditions de renouvellement</label>
                                        <textarea class="form-control" rows="3" v-model="renewForm.conditions"
                                            placeholder="Nouvelles conditions particulières (optionnel)..."></textarea>
                                    </div>

                                    <div class="col-12">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox"
                                                v-model="renewForm.envoyerNotification" id="envoyerNotification">
                                            <label class="form-check-label" for="envoyerNotification">
                                                Envoyer une notification au locataire
                                            </label>
                                        </div>
                                    </div>

                                    <div class="col-12">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox"
                                                v-model="renewForm.genererNouveauContrat" id="genererNouveauContrat">
                                            <label class="form-check-label" for="genererNouveauContrat">
                                                Générer un nouveau document de contrat
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <!-- Résumé du renouvellement -->
                            <div v-if="renewForm.dateDebut && renewForm.dateFin" class="alert alert-success mt-3">
                                <h6 class="mb-2">
                                    <i class="bi bi-check-circle me-2"></i>Résumé du renouvellement
                                </h6>
                                <div class="row g-2">
                                    <div class="col-md-4">
                                        <small class="text-muted">Nouvelle période:</small>
                                        <strong class="d-block">
                                            {{ formatDate(renewForm.dateDebut) }} → {{ formatDate(renewForm.dateFin) }}
                                        </strong>
                                    </div>
                                    <div class="col-md-4">
                                        <small class="text-muted">Durée:</small>
                                        <strong class="d-block">{{ calculerDureeRenouvellement() }} mois</strong>
                                    </div>
                                    <div class="col-md-4">
                                        <small class="text-muted">Nouveau loyer:</small>
                                        <strong class="d-block text-success">
                                            {{ formatCurrency(nouveauMontantCalcule || (renewContrat ?
                                                renewContrat.montantLoyer : 0)) }}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeRenewModal">
                                Annuler
                            </button>
                            <button type="button" class="btn btn-success" @click="confirmRenouvellement"
                                :disabled="!renewForm.dateDebut || !renewForm.dateFin">
                                <i class="bi bi-check-circle me-1"></i>Confirmer le renouvellement
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Création Contrat -->
            <div v-if="showCreateModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);"
                tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Nouveau Contrat</h5>
                            <button type="button" class="btn-close" @click="showCreateModal = false"></button>
                        </div>
                        <div class="modal-body">
                            <p class="text-muted">Cette fonctionnalité sera disponible prochainement...</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="showCreateModal = false">
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    </main>
</template>

<script>
// import { useStore } from 'vuex'
import { mapActions, useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import Chart from 'chart.js/auto';

export default {
    name: 'RenouvellementBaux',

    data() {
        return {
            loading: true,
            viewMode: 'table',
            searchQuery: '',
            currentPage: 1,
            perPage: 15,

            contrats: [],
            availableBiens: [],
            selectedContrats: [],

            filters: {
                periode: '',
                statut: '',
                propriete: '',
                priorite: ''
            },

            stats: {
                ceMois: 0,
                dans30Jours: 0,
                dans60Jours: 0,
                renouveles: 0
            },

            selectedContrat: null,
            showRenewModal: false,
            showCreateModal: false,
            renewContrat: null,

            renewForm: {
                dateDebut: '',
                dateFin: '',
                montantLoyer: null,
                augmentationPourcent: 0,
                duree: '',
                typeRenouvellement: 'MANUEL',
                conditions: '',
                envoyerNotification: true,
                genererNouveauContrat: true
            },

            timelineChart: null
        };
    },

    computed: {
        userId() {
            return this.$store.getters.userInfo || null;
        },
        filteredContracts() {
            let result = this.contrats;

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(c =>
                    c.locataireNom?.toLowerCase().includes(query) ||
                    c.numeroContrat?.toLowerCase().includes(query) ||
                    c.bienNom?.toLowerCase().includes(query)
                );
            }

            if (this.filters.periode) {
                const today = new Date();
                result = result.filter(c => {
                    const dateFin = new Date(c.dateFin);
                    const diffDays = Math.ceil((dateFin - today) / (1000 * 60 * 60 * 24));

                    switch (this.filters.periode) {
                        case 'expire':
                            return diffDays < 0;
                        case 'ce_mois':
                            return diffDays >= 0 && diffDays <= 30;
                        case '30_jours':
                            return diffDays > 0 && diffDays <= 30;
                        case '60_jours':
                            return diffDays > 30 && diffDays <= 60;
                        case '90_jours':
                            return diffDays > 60 && diffDays <= 90;
                        default:
                            return true;
                    }
                });
            }

            if (this.filters.statut) {
                result = result.filter(c => c.statut === this.filters.statut);
            }

            if (this.filters.propriete) {
                result = result.filter(c => c.bienId === this.filters.propriete);
            }

            if (this.filters.priorite) {
                result = result.filter(c => c.priorite === this.filters.priorite);
            }

            return result.sort((a, b) => a.joursRestants - b.joursRestants);
        },

        paginatedContrats() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredContracts.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.filteredContracts.length / this.perPage);
        },

        allSelected() {
            return this.paginatedContrats.length > 0 &&
                this.paginatedContrats.every(c => this.isSelected(c.id));
        },

        contratsUrgents() {
            return this.contrats.filter(c => c.joursRestants <= 30 && c.joursRestants >= 0);
        },

        contratsGroupedByMonth() {
            const grouped = {};
            this.filteredContracts.forEach(contrat => {
                const dateFin = new Date(contrat.dateFin);
                const monthKey = dateFin.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
                if (!grouped[monthKey]) {
                    grouped[monthKey] = [];
                }
                grouped[monthKey].push(contrat);
            });
            return grouped;
        },

        minRenewDateDebut() {
            if (!this.renewContrat) return '';
            const dateFin = new Date(this.renewContrat.dateFin);
            dateFin.setDate(dateFin.getDate() + 1);
            return dateFin.toISOString().split('T')[0];
        },

        nouveauMontantCalcule() {
            if (!this.renewContrat || !this.renewForm.augmentationPourcent) return 0;
            const montantActuel = this.renewContrat.montantLoyer;
            return montantActuel + (montantActuel * this.renewForm.augmentationPourcent / 100);
        }
    },

    async mounted() {
        await this.loadData();
        this.$nextTick(() => {
            this.initTimelineChart();
        });
    },

    beforeDestroy() {
        if (this.timelineChart) this.timelineChart.destroy();
    },

    methods: {
        ...mapActions({
            getContratsUtilisateur: 'contrats/getContratsUtilisateur',
            renouvelerContrat: 'contrats/renouvelerContrat',
            getDisponibles: 'biensImmobiliers/getDisponibles'
        }),

        async loadData() {
            try {
                this.loading = true;
                const userId = this.$store.getters['auth/userInfo']
                console.log('userInfo:', userId);
                const biensData = await this.getDisponibles();
                this.availableBiens = biensData;

                const contratsData = await this.getContratsUtilisateur(userId);
                console.log('contratsData reçu:', contratsData);
                this.contrats = this.transformContracts(contratsData);

                this.calculateStats();

            } catch (error) {
                console.error('Erreur chargement:', error);
                ElMessage.error('Erreur lors du chargement des contrats');
            } finally {
                this.loading = false;
            }
        },

        transformContracts(contratsData) {
            return contratsData.map(contrat => {
                const bien = contrat.biensImmobiliers?.[0] || {};
                const locataire = contrat.userInfo || {};

                const dateFin = new Date(contrat.dateFin);
                const today = new Date();
                const joursRestants = Math.ceil((dateFin - today) / (1000 * 60 * 60 * 24));

                let priorite = 'NORMALE';
                if (joursRestants < 0) priorite = 'CRITIQUE';
                else if (joursRestants <= 30) priorite = 'CRITIQUE';
                else if (joursRestants <= 60) priorite = 'HAUTE';

                return {
                    id: contrat.id,
                    numeroContrat: contrat.referenceContrat || `CONT-${contrat.id}`,
                    locataireNom: locataire.nom || 'N/A',
                    locataireTel: locataire.telephone,
                    locataireEmail: locataire.email,
                    bienId: bien.id,
                    bienNom: bien.nom || 'N/A',
                    bienAdresse: bien.adresse || 'N/A',
                    dateDebut: contrat.dateDebut,
                    dateFin: contrat.dateFin,
                    montantLoyer: contrat.loyerMensuel || bien.prix || 0,
                    depotGarantie: contrat.depotGarantie,
                    typeContrat: contrat.typeContrat,
                    modePaiement: contrat.modePaiement,
                    statut: contrat.status || 'ACTIF',
                    joursRestants: joursRestants,
                    priorite: priorite,
                    historique: [],
                    notes: ''
                };
            });
        },

        calculateStats() {
            const today = new Date();
            const thisMonth = new Date();
            thisMonth.setDate(1);

            this.stats.ceMois = this.contrats.filter(c => {
                const dateFin = new Date(c.dateFin);
                return dateFin >= today && dateFin <= new Date(thisMonth.getFullYear(), thisMonth.getMonth() + 1, 0);
            }).length;

            this.stats.dans30Jours = this.contrats.filter(c =>
                c.joursRestants > 0 && c.joursRestants <= 30
            ).length;

            this.stats.dans60Jours = this.contrats.filter(c =>
                c.joursRestants > 30 && c.joursRestants <= 60
            ).length;

            this.stats.renouveles = this.contrats.filter(c =>
                c.statut === 'RENOUVELE'
            ).length;
        },

        initTimelineChart() {
            const ctx = this.$refs.timelineChart?.getContext('2d');
            if (!ctx) return;

            const monthlyData = this.getMonthlyEcheances();

            this.timelineChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: monthlyData.labels,
                    datasets: [{
                        label: 'Contrats arrivant à échéance',
                        data: monthlyData.counts,
                        backgroundColor: monthlyData.colors,
                        borderColor: monthlyData.borderColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                afterLabel: function (context) {
                                    const index = context.dataIndex;
                                    return monthlyData.details[index];
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        },

        getMonthlyEcheances() {
            const months = [];
            const counts = [];
            const colors = [];
            const borderColors = [];
            const details = [];

            for (let i = 0; i < 12; i++) {
                const date = new Date();
                date.setMonth(date.getMonth() + i);
                const monthKey = date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });

                const contratsInMonth = this.contrats.filter(c => {
                    const dateFin = new Date(c.dateFin);
                    return dateFin.getMonth() === date.getMonth() &&
                        dateFin.getFullYear() === date.getFullYear();
                });

                months.push(monthKey);
                counts.push(contratsInMonth.length);

                // Couleurs selon urgence
                if (i === 0) {
                    colors.push('rgba(220, 53, 69, 0.5)');
                    borderColors.push('rgba(220, 53, 69, 1)');
                } else if (i === 1) {
                    colors.push('rgba(255, 193, 7, 0.5)');
                    borderColors.push('rgba(255, 193, 7, 1)');
                } else {
                    colors.push('rgba(13, 202, 240, 0.5)');
                    borderColors.push('rgba(13, 202, 240, 1)');
                }

                details.push(contratsInMonth.map(c => c.bienNom).join(', ') || 'Aucun');
            }

            return { labels: months, counts, colors, borderColors, details };
        },

        filterContrats() {
            this.currentPage = 1;
        },

        resetFilters() {
            this.filters = {
                periode: '',
                statut: '',
                propriete: '',
                priorite: ''
            };
            this.searchQuery = '';
            this.currentPage = 1;
        },

        afficherUrgents() {
            this.filters.periode = 'ce_mois';
            this.filterContrats();
        },

        isSelected(id) {
            return this.selectedContrats.includes(id);
        },

        toggleSelection(id) {
            const index = this.selectedContrats.indexOf(id);
            if (index > -1) {
                this.selectedContrats.splice(index, 1);
            } else {
                this.selectedContrats.push(id);
            }
        },

        toggleSelectAll() {
            if (this.allSelected) {
                this.paginatedContrats.forEach(c => {
                    const index = this.selectedContrats.indexOf(c.id);
                    if (index > -1) this.selectedContrats.splice(index, 1);
                });
            } else {
                this.paginatedContrats.forEach(c => {
                    if (!this.isSelected(c.id)) {
                        this.selectedContrats.push(c.id);
                    }
                });
            }
        },

        getRowClass(contrat) {
            if (contrat.joursRestants < 0) return 'table-danger';
            if (contrat.joursRestants <= 30) return 'table-warning';
            return '';
        },

        getCardBorderClass(contrat) {
            if (contrat.joursRestants < 0) return 'border-danger';
            if (contrat.joursRestants <= 30) return 'border-warning';
            return '';
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'ACTIF': 'bg-success',
                'A_RENOUVELER': 'bg-warning',
                'RENOUVELE': 'bg-info',
                'RESILIE': 'bg-danger',
                'EXPIRE': 'bg-secondary'
            };
            return classes[statut] || 'bg-secondary';
        },

        getStatutIcon(statut) {
            const icons = {
                'ACTIF': 'bi-check-circle',
                'A_RENOUVELER': 'bi-clock-history',
                'RENOUVELE': 'bi-arrow-repeat',
                'RESILIE': 'bi-x-circle',
                'EXPIRE': 'bi-exclamation-circle'
            };
            return icons[statut] || 'bi-circle';
        },

        getStatutLabel(statut) {
            const labels = {
                'ACTIF': 'Actif',
                'A_RENOUVELER': 'À renouveler',
                'RENOUVELE': 'Renouvelé',
                'RESILIE': 'Résilié',
                'EXPIRE': 'Expiré'
            };
            return labels[statut] || statut;
        },

        getPrioriteBadgeClass(priorite) {
            const classes = {
                'CRITIQUE': 'bg-danger',
                'HAUTE': 'bg-warning',
                'NORMALE': 'bg-info'
            };
            return classes[priorite] || 'bg-secondary';
        },

        getDateFinClass(dateFin) {
            const joursRestants = this.calculateJoursRestants(dateFin);
            if (joursRestants < 0) return 'text-danger fw-bold';
            if (joursRestants <= 30) return 'text-warning fw-bold';
            return '';
        },

        getJoursRestantsBadge(joursRestants) {
            if (joursRestants < 0) return 'bg-danger';
            if (joursRestants <= 30) return 'bg-warning';
            if (joursRestants <= 60) return 'bg-info';
            return 'bg-secondary';
        },

        getJoursRestantsIcon(joursRestants) {
            if (joursRestants < 0) return 'bi-exclamation-triangle';
            if (joursRestants <= 30) return 'bi-clock-history';
            return 'bi-calendar-check';
        },

        calculateJoursRestants(dateFin) {
            if (!dateFin) return 0;
            const today = new Date();
            const end = new Date(dateFin);
            return Math.ceil((end - today) / (1000 * 60 * 60 * 24));
        },

        calculateDuration(dateDebut, dateFin) {
            if (!dateDebut || !dateFin) return '—';
            const start = new Date(dateDebut);
            const end = new Date(dateFin);
            const months = (end.getFullYear() - start.getFullYear()) * 12 +
                (end.getMonth() - start.getMonth());
            return `${months} mois`;
        },

        calculerDureeRenouvellement() {
            if (!this.renewForm.dateDebut || !this.renewForm.dateFin) return 0;
            const start = new Date(this.renewForm.dateDebut);
            const end = new Date(this.renewForm.dateFin);
            return (end.getFullYear() - start.getFullYear()) * 12 +
                (end.getMonth() - start.getMonth());
        },

        ajusterDateFin() {
            if (!this.renewForm.duree || !this.renewForm.dateDebut) return;

            const dateDebut = new Date(this.renewForm.dateDebut);
            const dateFin = new Date(dateDebut);
            dateFin.setMonth(dateFin.getMonth() + parseInt(this.renewForm.duree));

            this.renewForm.dateFin = dateFin.toISOString().split('T')[0];
        },

        formatCurrency(value) {
            if (!value) return '0 FCFA';
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

        viewContrat(contrat) {
            this.selectedContrat = contrat;
        },

        editContrat(contrat) {
            this.$router.push({
                name: 'edit-contrat',
                params: { id: contrat.id }
            });
        },

        openRenewModal(contrat) {
            this.renewContrat = contrat;

            // Pré-remplir le formulaire
            const dateFin = new Date(contrat.dateFin);
            dateFin.setDate(dateFin.getDate() + 1);
            this.renewForm.dateDebut = dateFin.toISOString().split('T')[0];

            const newDateFin = new Date(dateFin);
            newDateFin.setFullYear(newDateFin.getFullYear() + 1);
            this.renewForm.dateFin = newDateFin.toISOString().split('T')[0];

            this.renewForm.montantLoyer = contrat.montantLoyer;
            this.renewForm.augmentationPourcent = 0;
            this.renewForm.duree = '12';
            this.renewForm.typeRenouvellement = 'MANUEL';
            this.renewForm.conditions = '';
            this.renewForm.envoyerNotification = true;
            this.renewForm.genererNouveauContrat = true;

            this.showRenewModal = true;
            this.selectedContrat = null;
        },

        closeRenewModal() {
            this.showRenewModal = false;
            this.renewContrat = null;
            this.resetRenewForm();
        },

        resetRenewForm() {
            this.renewForm = {
                dateDebut: '',
                dateFin: '',
                montantLoyer: null,
                augmentationPourcent: 0,
                duree: '',
                typeRenouvellement: 'MANUEL',
                conditions: '',
                envoyerNotification: true,
                genererNouveauContrat: true
            };
        },

        async confirmRenouvellement() {
            try {
                if (!this.renewForm.dateDebut || !this.renewForm.dateFin) {
                    ElMessage.warning('Veuillez remplir toutes les dates obligatoires');
                    return;
                }

                // Validation de la durée minimale (6 mois)
                const duree = this.calculerDureeRenouvellement();
                if (duree < 6) {
                    ElMessage.warning('La durée minimale de renouvellement est de 6 mois');
                    return;
                }

                await ElMessageBox.confirm(
                    `Confirmer le renouvellement du contrat #${this.renewContrat.numeroContrat} jusqu'au ${this.formatDate(this.renewForm.dateFin)} ?`,
                    'Confirmation de renouvellement',
                    {
                        confirmButtonText: 'Confirmer',
                        cancelButtonText: 'Annuler',
                        type: 'success'
                    }
                );

                // Appel à l'API de renouvellement
                await this.renouvelerContrat({
                    id: this.renewContrat.id,
                    nouvelleDateFin: this.renewForm.dateFin
                });

                // Si un nouveau loyer est défini, mettre à jour le contrat
                if (this.renewForm.montantLoyer && this.renewForm.montantLoyer !== this.renewContrat.montantLoyer) {
                    await this.$store.dispatch('contrats/update', {
                        id: this.renewContrat.id,
                        loyerMensuel: this.nouveauMontantCalcule || this.renewForm.montantLoyer
                    });
                }

                ElMessage.success('Contrat renouvelé avec succès');

                // Envoyer notification si demandé
                if (this.renewForm.envoyerNotification) {
                    await this.envoyerNotificationRenouvellement(this.renewContrat.id);
                }

                this.closeRenewModal();
                await this.loadData();

            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur renouvellement:', error);
                    ElMessage.error('Erreur lors du renouvellement du contrat');
                }
            }
        },

        async envoyerNotificationRenouvellement(contratId) {
            try {
                // Simulation d'envoi de notification
                ElMessage.info('Notification envoyée au locataire');
            } catch (error) {
                console.error('Erreur envoi notification:', error);
            }
        },

        async envoyerRappel(contratId) {
            try {
                const contrat = this.contrats.find(c => c.id === contratId);
                if (!contrat) return;

                await ElMessageBox.confirm(
                    `Envoyer un rappel d'échéance à ${contrat.locataireNom} pour le contrat #${contrat.numeroContrat} ?`,
                    'Confirmation',
                    {
                        confirmButtonText: 'Envoyer',
                        cancelButtonText: 'Annuler',
                        type: 'info'
                    }
                );

                // Simulation envoi rappel
                ElMessage.success('Rappel envoyé avec succès');
                this.selectedContrat = null;

            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur envoi rappel:', error);
                }
            }
        },

        async envoyerRappelsGroupes() {
            const urgents = this.contratsUrgents;

            if (urgents.length === 0) {
                ElMessage.info('Aucun contrat nécessitant un rappel');
                return;
            }

            try {
                await ElMessageBox.confirm(
                    `Envoyer des rappels pour ${urgents.length} contrat(s) arrivant à échéance ?`,
                    'Confirmation',
                    {
                        confirmButtonText: 'Envoyer',
                        cancelButtonText: 'Annuler',
                        type: 'warning'
                    }
                );

                // Simulation envoi groupé
                ElMessage.success(`${urgents.length} rappel(s) envoyé(s)`);

            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur:', error);
                }
            }
        },

        async renouvelerSelection() {
            if (this.selectedContrats.length === 0) {
                ElMessage.warning('Veuillez sélectionner au moins un contrat');
                return;
            }

            try {
                await ElMessageBox.confirm(
                    `Renouveler ${this.selectedContrats.length} contrat(s) sélectionné(s) ?`,
                    'Confirmation',
                    {
                        confirmButtonText: 'Renouveler',
                        cancelButtonText: 'Annuler',
                        type: 'success'
                    }
                );

                // Traitement groupé
                for (const id of this.selectedContrats) {
                    const contrat = this.contrats.find(c => c.id === id);
                    if (contrat && contrat.joursRestants <= 90) {
                        const nouvelleDateFin = new Date(contrat.dateFin);
                        nouvelleDateFin.setFullYear(nouvelleDateFin.getFullYear() + 1);

                        await this.renouvelerContrat({
                            id: contrat.id,
                            nouvelleDateFin: nouvelleDateFin.toISOString().split('T')[0]
                        });
                    }
                }

                ElMessage.success(`${this.selectedContrats.length} contrat(s) renouvelé(s)`);
                this.selectedContrats = [];
                await this.loadData();

            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur renouvellement groupé:', error);
                    ElMessage.error('Erreur lors du renouvellement');
                }
            }
        },

        async resilierContrat(contratId) {
            try {
                const contrat = this.contrats.find(c => c.id === contratId);
                if (!contrat) return;

                const { value: raison } = await ElMessageBox.prompt(
                    'Raison de la résiliation (optionnel)',
                    'Résilier le contrat',
                    {
                        confirmButtonText: 'Résilier',
                        cancelButtonText: 'Annuler',
                        inputPlaceholder: 'Ex: Fin de bail à la demande du locataire',
                        inputType: 'textarea'
                    }
                );

                await this.$store.dispatch('contrats/update', {
                    id: contratId,
                    status: 'RESILIE'
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

        async downloadContrat(contratId) {
            try {
                const fileUrl = await this.$store.dispatch('contrats/downloadPDF', contratId);
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

        async exportContracts() {
            try {
                const fileUrl = await this.$store.dispatch('contrats/exportContrats', 'xlsx');
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = `contrats_echeances_${Date.now()}.xlsx`;
                link.click();
                URL.revokeObjectURL(fileUrl);
                ElMessage.success('Export réussi');
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

.table> :not(caption)>*>* {
    padding: 1rem 0.75rem;
}

.table-warning {
    background-color: #fff3cd;
}

.table-danger {
    background-color: #f8d7da;
}

.badge {
    font-weight: 500;
    padding: 0.35em 0.65em;
}

/* Timeline Styles */
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

/* Timeline View */
.timeline-view {
    padding: 1rem;
}

.timeline-month-group {
    margin-bottom: 2rem;
}

.timeline-month-header {
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 1rem;
}

.timeline-contracts {
    padding-left: 2rem;
}

.timeline-contract-card {
    transition: all 0.3s ease;
}

.timeline-contract-card:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.timeline-contract-card.border-danger {
    border-left-width: 4px !important;
}

.timeline-contract-card.border-warning {
    border-left-width: 4px !important;
}

/* Card hover effects */
.card {
    transition: all 0.3s ease;
}

.card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Form controls */
.form-control:focus,
.form-select:focus {
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* Alert styling */
.alert {
    border-radius: 0.5rem;
}

/* Progress bar for timeline chart */
.progress {
    border-radius: 0.5rem;
    overflow: hidden;
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

.card {
    animation: fadeIn 0.3s ease-out;
}

/* Responsive */
@media (max-width: 768px) {
    .table-responsive {
        font-size: 0.875rem;
    }

    .timeline-contracts {
        padding-left: 1rem;
    }
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

/* Status indicators with animation */
.text-danger.fw-bold {
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.7;
    }
}

/* Button group styling */
.btn-group .btn {
    border-radius: 0;
}

.btn-group .btn:first-child {
    border-top-left-radius: 0.375rem;
    border-bottom-left-radius: 0.375rem;
}

.btn-group .btn:last-child {
    border-top-right-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
}

/* Input group styling */
.input-group-text {
    background-color: #f8f9fa;
}

/* Chart container */
canvas {
    max-height: 400px;
}
</style>
