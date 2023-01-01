<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">
            <!-- En-tête -->
            <div class="row">
                <div class="col-sm-12 mb-5">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <h1 class="h3 mb-2 mb-sm-0">Historique de Maintenance</h1>
                        <div class="d-flex gap-2">
                            <button @click="nouvelleIntervention" class="btn btn-primary mb-0">
                                <i class="bi bi-plus-lg fa-fw"></i> Nouvelle Intervention
                            </button>
                            <button @click="planifierMaintenance" class="btn btn-info mb-0">
                                <i class="bi bi-calendar-check fa-fw"></i> Planifier
                            </button>
                            <button @click="exporterHistorique" class="btn btn-success mb-0">
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
                                <span>Total Interventions</span>
                                <h3 class="mb-0 mt-2">{{ stats.totalInterventions }}</h3>
                            </div>
                            <div
                                class="icon-lg rounded-circle flex-shrink-0 bg-primary bg-opacity-10 text-primary mb-0">
                                <i class="bi bi-tools fa-fw"></i>
                            </div>
                        </div>
                        <span><span class="text-primary">{{ stats.interventionsMois }}</span> ce mois</span>
                    </div>
                </div>

                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>Préventives</span>
                                <h3 class="mb-0 mt-2 text-success">{{ stats.preventives }}</h3>
                            </div>
                            <div
                                class="icon-lg rounded-circle flex-shrink-0 bg-success bg-opacity-10 text-success mb-0">
                                <i class="bi bi-shield-check fa-fw"></i>
                            </div>
                        </div>
                        <span>{{ stats.pourcentagePreventives }}% du total</span>
                    </div>
                </div>

                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>Coût Total</span>
                                <h3 class="mb-0 mt-2">{{ formatCurrency(stats.coutTotal) }}</h3>
                            </div>
                            <div
                                class="icon-lg rounded-circle flex-shrink-0 bg-warning bg-opacity-10 text-warning mb-0">
                                <i class="bi bi-cash-stack fa-fw"></i>
                            </div>
                        </div>
                        <span>{{ formatCurrency(stats.coutMoyen) }} en moyenne</span>
                    </div>
                </div>

                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>À Planifier</span>
                                <h3 class="mb-0 mt-2 text-info">{{ stats.aPlanifier }}</h3>
                            </div>
                            <div class="icon-lg rounded-circle flex-shrink-0 bg-info bg-opacity-10 text-info mb-0">
                                <i class="bi bi-calendar-event fa-fw"></i>
                            </div>
                        </div>
                        <span>Prochaines maintenances</span>
                    </div>
                </div>
            </div>

            <!-- Alertes maintenance -->
            <div class="row mb-4" v-if="alertesMaintenance.length > 0">
                <div class="col-12">
                    <div class="alert alert-warning d-flex align-items-center" role="alert">
                        <i class="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
                        <div>
                            <strong>Attention !</strong> {{ alertesMaintenance.length }} maintenance(s) planifiée(s) à
                            venir dans les 30 jours.
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
                            <label class="form-label">Type Maintenance</label>
                            <select v-model="filters.type" @change="applyFilters" class="form-select">
                                <option value="">Tous</option>
                                <option value="PREVENTIVE">Préventive</option>
                                <option value="CORRECTIVE">Corrective</option>
                                <option value="CURATIVE">Curative</option>
                                <option value="AMELIORATIVE">Améliorative</option>
                            </select>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Catégorie</label>
                            <select v-model="filters.categorie" @change="applyFilters" class="form-select">
                                <option value="">Toutes</option>
                                <option value="PLOMBERIE">Plomberie</option>
                                <option value="ELECTRICITE">Électricité</option>
                                <option value="CHAUFFAGE">Chauffage</option>
                                <option value="CLIMATISATION">Climatisation</option>
                                <option value="SERRURERIE">Serrurerie</option>
                                <option value="PEINTURE">Peinture</option>
                                <option value="JARDINAGE">Jardinage</option>
                                <option value="AUTRE">Autre</option>
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
                            <label class="form-label">Période</label>
                            <select v-model="filters.periode" @change="applyFilters" class="form-select">
                                <option value="30jours">30 derniers jours</option>
                                <option value="3mois">3 derniers mois</option>
                                <option value="6mois">6 derniers mois</option>
                                <option value="annee">Cette année</option>
                                <option value="tout">Tout l'historique</option>
                            </select>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Rechercher</label>
                            <input type="text" v-model="searchQuery" @input="applyFilters" class="form-control"
                                placeholder="Référence, description...">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <ul class="nav nav-pills mb-4" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#historique-tab" type="button"
                        role="tab">
                        <i class="bi bi-clock-history me-2"></i>Historique
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#planning-tab" type="button"
                        role="tab">
                        <i class="bi bi-calendar3 me-2"></i>Planning Préventif
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#equipements-tab" type="button"
                        role="tab">
                        <i class="bi bi-gear me-2"></i>Équipements
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#stats-tab" type="button" role="tab">
                        <i class="bi bi-graph-up me-2"></i>Statistiques
                    </button>
                </li>
            </ul>

            <!-- Tab Content -->
            <div class="tab-content">
                <!-- Onglet Historique -->
                <div class="tab-pane fade show active" id="historique-tab">
                    <div class="card shadow">
                        <div class="card-body">
                            <!-- En-têtes -->
                            <div class="bg-light rounded p-3 d-none d-lg-block">
                                <div class="row">
                                    <div class="col-lg-2">
                                        <h6 class="mb-0">Date / Réf</h6>
                                    </div>
                                    <div class="col-lg-2">
                                        <h6 class="mb-0">Bien / Type</h6>
                                    </div>
                                    <div class="col-lg-2">
                                        <h6 class="mb-0">Catégorie</h6>
                                    </div>
                                    <div class="col-lg-3">
                                        <h6 class="mb-0">Description</h6>
                                    </div>
                                    <div class="col-lg-2">
                                        <h6 class="mb-0">Intervenant / Coût</h6>
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

                            <!-- Aucune intervention -->
                            <div v-else-if="paginatedInterventions.length === 0" class="text-center text-muted my-5">
                                <i class="bi bi-inbox fs-1"></i>
                                <p class="mt-3">Aucune intervention trouvée.</p>
                            </div>

                            <!-- Lignes -->
                            <div v-else>
                                <div class="row border-bottom py-3 align-items-center"
                                    v-for="intervention in paginatedInterventions" :key="intervention.id">
                                    <div class="col-lg-2">
                                        <strong class="d-lg-none">Date:</strong>
                                        <div>
                                            <div class="fw-bold">{{ formatDate(intervention.date) }}</div>
                                            <small class="text-muted">{{ intervention.reference }}</small>
                                        </div>
                                    </div>
                                    <div class="col-lg-2">
                                        <strong class="d-lg-none">Bien:</strong>
                                        <div>
                                            <div class="small">{{ intervention.bien }}</div>
                                            <span class="badge" :class="getTypeBadgeClass(intervention.type)">
                                                {{ intervention.type }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-lg-2">
                                        <strong class="d-lg-none">Catégorie:</strong>
                                        <span class="badge bg-info">
                                            <i :class="getCategorieIcon(intervention.categorie)" class="me-1"></i>
                                            {{ intervention.categorie }}
                                        </span>
                                    </div>
                                    <div class="col-lg-3">
                                        <strong class="d-lg-none">Description:</strong>
                                        <span class="small">{{ truncate(intervention.description, 80) }}</span>
                                    </div>
                                    <div class="col-lg-2">
                                        <strong class="d-lg-none">Intervenant:</strong>
                                        <div class="small">
                                            <div>{{ intervention.intervenant }}</div>
                                            <div class="fw-bold">{{ formatCurrency(intervention.cout) }}</div>
                                        </div>
                                    </div>
                                    <div class="col-lg-1">
                                        <div class="dropdown">
                                            <button class="btn btn-sm btn-light" type="button"
                                                data-bs-toggle="dropdown">
                                                <i class="bi bi-three-dots-vertical"></i>
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li>
                                                    <a class="dropdown-item" @click="voirDetails(intervention)">
                                                        <i class="bi bi-eye me-2"></i>Détails
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item"
                                                        @click="modifierIntervention(intervention)">
                                                        <i class="bi bi-pencil me-2"></i>Modifier
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item" @click="dupliquer(intervention)">
                                                        <i class="bi bi-files me-2"></i>Dupliquer
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item" @click="telechargerRapport(intervention)">
                                                        <i class="bi bi-download me-2"></i>Rapport PDF
                                                    </a>
                                                </li>
                                                <li>
                                                    <hr class="dropdown-divider">
                                                    <a class="dropdown-item text-danger"
                                                        @click="supprimerIntervention(intervention.id)">
                                                        <i class="bi bi-trash me-2"></i>Supprimer
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
                                    Affichage {{ startIndex + 1 }} à {{ endIndex }} sur {{ filteredInterventions.length
                                    }} entrées
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

                <!-- Onglet Planning Préventif -->
                <div class="tab-pane fade" id="planning-tab">
                    <div class="card shadow">
                        <div class="card-body">
                            <h5 class="mb-4">Planning de Maintenance Préventive</h5>
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Bien</th>
                                            <th>Équipement</th>
                                            <th>Type Maintenance</th>
                                            <th>Fréquence</th>
                                            <th>Dernière Intervention</th>
                                            <th>Prochaine Date</th>
                                            <th>Statut</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="plan in planningPreventif" :key="plan.id">
                                            <td>{{ plan.bien }}</td>
                                            <td>{{ plan.equipement }}</td>
                                            <td>{{ plan.typeMaintenance }}</td>
                                            <td>{{ plan.frequence }}</td>
                                            <td>{{ formatDate(plan.derniereIntervention) }}</td>
                                            <td>{{ formatDate(plan.prochaineDate) }}</td>
                                            <td>
                                                <span class="badge" :class="getStatutPlanBadgeClass(plan)">
                                                    {{ getStatutPlan(plan) }}
                                                </span>
                                            </td>
                                            <td>
                                                <button class="btn btn-sm btn-primary"
                                                    @click="planifierDepuisPlan(plan)">
                                                    <i class="bi bi-calendar-plus"></i> Planifier
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Onglet Équipements -->
                <div class="tab-pane fade" id="equipements-tab">
                    <div class="row g-4">
                        <div class="col-md-6 col-lg-4" v-for="equipement in equipements" :key="equipement.id">
                            <div class="card h-100 shadow-sm">
                                <div class="card-header bg-light">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <h6 class="mb-0">{{ equipement.nom }}</h6>
                                        <span class="badge" :class="getEtatEquipementBadgeClass(equipement.etat)">
                                            {{ equipement.etat }}
                                        </span>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <p class="mb-2"><strong>Bien:</strong> {{ equipement.bien }}</p>
                                    <p class="mb-2"><strong>Marque:</strong> {{ equipement.marque }}</p>
                                    <p class="mb-2"><strong>Date installation:</strong> {{
                                        formatDate(equipement.dateInstallation) }}</p>
                                    <p class="mb-2"><strong>Dernière maintenance:</strong> {{
                                        formatDate(equipement.derniereMaintenance) }}</p>
                                    <p class="mb-0"><strong>Interventions:</strong> {{ equipement.nombreInterventions }}
                                    </p>
                                </div>
                                <div class="card-footer">
                                    <button class="btn btn-sm btn-primary w-100"
                                        @click="voirHistoriqueEquipement(equipement)">
                                        <i class="bi bi-clock-history me-1"></i> Voir historique
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Onglet Statistiques -->
                <div class="tab-pane fade" id="stats-tab">
                    <div class="row g-4">
                        <!-- Graphique par type -->
                        <div class="col-md-6">
                            <div class="card shadow">
                                <div class="card-header bg-light">
                                    <h6 class="mb-0">Répartition par Type</h6>
                                </div>
                                <div class="card-body">
                                    <canvas id="typeChart" height="300"></canvas>
                                </div>
                            </div>
                        </div>

                        <!-- Graphique par catégorie -->
                        <div class="col-md-6">
                            <div class="card shadow">
                                <div class="card-header bg-light">
                                    <h6 class="mb-0">Répartition par Catégorie</h6>
                                </div>
                                <div class="card-body">
                                    <canvas id="categorieChart" height="300"></canvas>
                                </div>
                            </div>
                        </div>

                        <!-- Évolution des coûts -->
                        <div class="col-12">
                            <div class="card shadow">
                                <div class="card-header bg-light">
                                    <h6 class="mb-0">Évolution des Coûts de Maintenance</h6>
                                </div>
                                <div class="card-body">
                                    <canvas id="coutsChart" height="100"></canvas>
                                </div>
                            </div>
                        </div>

                        <!-- Top 5 biens -->
                        <div class="col-md-6">
                            <div class="card shadow">
                                <div class="card-header bg-light">
                                    <h6 class="mb-0">Top 5 Biens - Plus d'Interventions</h6>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Bien</th>
                                                    <th>Interventions</th>
                                                    <th>Coût Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(item, index) in topBiens" :key="index">
                                                    <td>{{ item.bien }}</td>
                                                    <td><span class="badge bg-primary">{{ item.count }}</span></td>
                                                    <td class="fw-bold">{{ formatCurrency(item.cout) }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Top 5 catégories coûteuses -->
                        <div class="col-md-6">
                            <div class="card shadow">
                                <div class="card-header bg-light">
                                    <h6 class="mb-0">Top 5 Catégories - Plus Coûteuses</h6>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Catégorie</th>
                                                    <th>Interventions</th>
                                                    <th>Coût Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(item, index) in topCategories" :key="index">
                                                    <td>{{ item.categorie }}</td>
                                                    <td><span class="badge bg-info">{{ item.count }}</span></td>
                                                    <td class="fw-bold">{{ formatCurrency(item.cout) }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Nouvelle/Modifier Intervention -->


        <!-- Modal Nouvelle/Modifier Intervention -->
        <div class="modal fade" id="interventionModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ interventionForm.id ? 'Modifier' : 'Nouvelle' }} Intervention de Maintenance
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="row g-3 mb-4">
                                <div class="col-12">
                                    <h6 class="border-bottom pb-2">Informations Générales</h6>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Date Intervention *</label>
                                    <input type="date" v-model="interventionForm.date" class="form-control" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Bien Concerné *</label>
                                    <select v-model="interventionForm.bienId" class="form-select" required>
                                        <option value="">Sélectionnez...</option>
                                        <option v-for="bien in biens" :key="bien.id" :value="bien.id">
                                            {{ bien.nom }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Type Maintenance *</label>
                                    <select v-model="interventionForm.type" class="form-select" required>
                                        <option value="">Sélectionnez...</option>
                                        <option value="PREVENTIVE">Préventive</option>
                                        <option value="CORRECTIVE">Corrective</option>
                                        <option value="CURATIVE">Curative</option>
                                        <option value="AMELIORATIVE">Améliorative</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Catégorie *</label>
                                    <select v-model="interventionForm.categorie" class="form-select" required>
                                        <option value="">Sélectionnez...</option>
                                        <option value="PLOMBERIE">Plomberie</option>
                                        <option value="ELECTRICITE">Électricité</option>
                                        <option value="CHAUFFAGE">Chauffage</option>
                                        <option value="CLIMATISATION">Climatisation</option>
                                        <option value="SERRURERIE">Serrurerie</option>
                                        <option value="PEINTURE">Peinture</option>
                                        <option value="JARDINAGE">Jardinage</option>
                                        <option value="AUTRE">Autre</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label class="form-label">Description *</label>
                                    <textarea v-model="interventionForm.description" class="form-control" rows="3"
                                        placeholder="Détails de l'intervention..." required></textarea>
                                </div>
                            </div>

                            <div class="row g-3 mb-4">
                                <div class="col-12">
                                    <h6 class="border-bottom pb-2">Intervenant</h6>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Nom / Entreprise</label>
                                    <input type="text" v-model="interventionForm.intervenant" class="form-control">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Contact</label>
                                    <input type="tel" v-model="interventionForm.intervenantContact"
                                        class="form-control">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Durée (heures)</label>
                                    <input type="number" v-model.number="interventionForm.duree" class="form-control"
                                        step="0.5">
                                </div>
                            </div>

                            <div class="row g-3 mb-4">
                                <div class="col-12">
                                    <h6 class="border-bottom pb-2">Coûts</h6>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Main d'œuvre</label>
                                    <input type="number" v-model.number="interventionForm.coutMainOeuvre"
                                        class="form-control" step="0.01" @input="calculerCoutTotal">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Pièces / Matériel</label>
                                    <input type="number" v-model.number="interventionForm.coutPieces"
                                        class="form-control" step="0.01" @input="calculerCoutTotal">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Coût Total</label>
                                    <input type="number" v-model.number="interventionForm.cout" class="form-control"
                                        step="0.01" readonly>
                                </div>
                            </div>

                            <div class="row g-3">
                                <div class="col-12">
                                    <h6 class="border-bottom pb-2">Observations</h6>
                                </div>
                                <div class="col-12">
                                    <textarea v-model="interventionForm.observations" class="form-control" rows="2"
                                        placeholder="Observations, recommandations..."></textarea>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox"
                                            v-model="interventionForm.sousGarantie" id="sousGarantie">
                                        <label class="form-check-label" for="sousGarantie">
                                            Intervention sous garantie
                                        </label>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox"
                                            v-model="interventionForm.preventifSuivant" id="preventifSuivant">
                                        <label class="form-check-label" for="preventifSuivant">
                                            Planifier prochain entretien préventif
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="sauvegarderIntervention">
                            <i class="bi bi-save"></i> {{ interventionForm.id ? 'Mettre à jour' : 'Enregistrer' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Détails Intervention -->
        <div class="modal fade" id="detailsModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Détails de l'Intervention</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" v-if="selectedIntervention">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <strong>Référence:</strong> {{ selectedIntervention.reference }}
                            </div>
                            <div class="col-md-6">
                                <strong>Date:</strong> {{ formatDate(selectedIntervention.date) }}
                            </div>
                            <div class="col-md-6">
                                <strong>Bien:</strong> {{ selectedIntervention.bien }}
                            </div>
                            <div class="col-md-6">
                                <strong>Type:</strong>
                                <span class="badge" :class="getTypeBadgeClass(selectedIntervention.type)">
                                    {{ selectedIntervention.type }}
                                </span>
                            </div>
                            <div class="col-md-6">
                                <strong>Catégorie:</strong> {{ selectedIntervention.categorie }}
                            </div>
                            <div class="col-md-6">
                                <strong>Durée:</strong> {{ selectedIntervention.duree }}h
                            </div>
                            <div class="col-12">
                                <strong>Description:</strong>
                                <p class="mb-0">{{ selectedIntervention.description }}</p>
                            </div>
                            <div class="col-md-6">
                                <strong>Intervenant:</strong> {{ selectedIntervention.intervenant }}
                            </div>
                            <div class="col-md-6">
                                <strong>Contact:</strong> {{ selectedIntervention.intervenantContact }}
                            </div>
                            <div class="col-md-4">
                                <strong>Main d'œuvre:</strong> {{ formatCurrency(selectedIntervention.coutMainOeuvre) }}
                            </div>
                            <div class="col-md-4">
                                <strong>Pièces:</strong> {{ formatCurrency(selectedIntervention.coutPieces) }}
                            </div>
                            <div class="col-md-4">
                                <strong>Total:</strong>
                                <span class="fw-bold text-primary">{{ formatCurrency(selectedIntervention.cout)
                                }}</span>
                            </div>
                            <div class="col-12" v-if="selectedIntervention.observations">
                                <strong>Observations:</strong>
                                <p class="mb-0">{{ selectedIntervention.observations }}</p>
                            </div>
                            <div class="col-12" v-if="selectedIntervention.sousGarantie">
                                <span class="badge bg-success">
                                    <i class="bi bi-shield-check me-1"></i> Sous garantie
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                        <button type="button" class="btn btn-primary" @click="telechargerRapport(selectedIntervention)">
                            <i class="bi bi-download"></i> Télécharger Rapport
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Confirmation Suppression -->
        <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirmation</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        Voulez-vous vraiment supprimer cette intervention de maintenance ?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-danger" @click="confirmerSuppression">Supprimer</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ElMessage } from "element-plus";
import Chart from 'chart.js/auto';

export default {
    data() {
        return {
            interventions: [],
            biens: [],
            equipements: [],
            planningPreventif: [],
            alertesMaintenance: [],
            stats: {
                totalInterventions: 0,
                interventionsMois: 0,
                preventives: 0,
                pourcentagePreventives: 0,
                coutTotal: 0,
                coutMoyen: 0,
                aPlanifier: 0
            },
            filters: {
                type: '',
                categorie: '',
                bienId: '',
                periode: '30jours'
            },
            interventionForm: {
                id: null,
                reference: '',
                date: new Date().toISOString().split('T')[0],
                bienId: '',
                type: '',
                categorie: '',
                description: '',
                intervenant: '',
                intervenantContact: '',
                duree: 0,
                coutMainOeuvre: 0,
                coutPieces: 0,
                cout: 0,
                observations: '',
                sousGarantie: false,
                preventifSuivant: false
            },
            searchQuery: '',
            currentPage: 1,
            perPage: 15,
            isLoading: false,
            selectedIntervention: null,
            interventionToDelete: null,
            charts: {
                type: null,
                categorie: null,
                couts: null
            }
        };
    },

    computed: {
        filteredInterventions() {
            let result = [...this.interventions];

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(i =>
                    i.reference?.toLowerCase().includes(query) ||
                    i.description?.toLowerCase().includes(query) ||
                    i.intervenant?.toLowerCase().includes(query)
                );
            }

            if (this.filters.type) {
                result = result.filter(i => i.type === this.filters.type);
            }

            if (this.filters.categorie) {
                result = result.filter(i => i.categorie === this.filters.categorie);
            }

            if (this.filters.bienId) {
                result = result.filter(i => i.bienId === parseInt(this.filters.bienId));
            }

            // Filtre période
            if (this.filters.periode !== 'tout') {
                const now = new Date();
                let dateMin;

                switch (this.filters.periode) {
                    case '30jours':
                        dateMin = new Date(now.setDate(now.getDate() - 30));
                        break;
                    case '3mois':
                        dateMin = new Date(now.setMonth(now.getMonth() - 3));
                        break;
                    case '6mois':
                        dateMin = new Date(now.setMonth(now.getMonth() - 6));
                        break;
                    case 'annee':
                        dateMin = new Date(now.getFullYear(), 0, 1);
                        break;
                }

                if (dateMin) {
                    result = result.filter(i => new Date(i.date) >= dateMin);
                }
            }

            return result.sort((a, b) => new Date(b.date) - new Date(a.date));
        },

        paginatedInterventions() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredInterventions.slice(start, start + this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filteredInterventions.length / this.perPage);
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
            return Math.min(this.startIndex + this.perPage, this.filteredInterventions.length);
        },

        topBiens() {
            const grouped = {};
            this.interventions.forEach(i => {
                if (!grouped[i.bien]) {
                    grouped[i.bien] = { bien: i.bien, count: 0, cout: 0 };
                }
                grouped[i.bien].count++;
                grouped[i.bien].cout += i.cout || 0;
            });

            return Object.values(grouped)
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);
        },

        topCategories() {
            const grouped = {};
            this.interventions.forEach(i => {
                if (!grouped[i.categorie]) {
                    grouped[i.categorie] = { categorie: i.categorie, count: 0, cout: 0 };
                }
                grouped[i.categorie].count++;
                grouped[i.categorie].cout += i.cout || 0;
            });

            return Object.values(grouped)
                .sort((a, b) => b.cout - a.cout)
                .slice(0, 5);
        }
    },

    mounted() {
        this.fetchInterventions();
        this.fetchBiens();
        this.genererEquipements();
        this.genererPlanningPreventif();
    },

    methods: {
        async fetchInterventions() {
            this.isLoading = true;
            try {
                const biens = await this.$store.dispatch("biensImmobiliers/getAll", { page: 0, size: 100 });
                const biensData = biens.content || biens;

                this.interventions = this.genererInterventionsDepuisBiens(biensData);
                this.calculerStats();
                this.verifierAlertes();
            } catch (error) {
                console.error("Erreur chargement interventions:", error);
                ElMessage.error("Erreur lors du chargement");
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

        genererInterventionsDepuisBiens(biens) {
            const types = ['PREVENTIVE', 'CORRECTIVE', 'CURATIVE', 'AMELIORATIVE'];
            const categories = ['PLOMBERIE', 'ELECTRICITE', 'CHAUFFAGE', 'CLIMATISATION', 'SERRURERIE', 'PEINTURE', 'JARDINAGE'];

            const interventions = [];
            let compteur = 1;

            biens.forEach((bien) => {
                const nbInterventions = Math.floor(Math.random() * 5) + 2;

                for (let i = 0; i < nbInterventions; i++) {
                    const type = types[Math.floor(Math.random() * types.length)];
                    const categorie = categories[Math.floor(Math.random() * categories.length)];
                    const date = this.genererDatePassee(365);
                    const coutMainOeuvre = Math.floor(Math.random() * 30000) + 10000;
                    const coutPieces = Math.floor(Math.random() * 20000) + 5000;

                    interventions.push({
                        id: `MAINT-${2025}-${String(compteur).padStart(4, '0')}`,
                        reference: `MAINT-${2025}-${String(compteur).padStart(4, '0')}`,
                        date: date,
                        bienId: bien.id,
                        bien: bien.nom,
                        type: type,
                        categorie: categorie,
                        description: this.genererDescription(type, categorie),
                        intervenant: ['Entreprise Martin', 'TechPro Services', 'Maintenance Plus'][Math.floor(Math.random() * 3)],
                        intervenantContact: '+229 97 XX XX XX',
                        duree: Math.floor(Math.random() * 8) + 1,
                        coutMainOeuvre: coutMainOeuvre,
                        coutPieces: coutPieces,
                        cout: coutMainOeuvre + coutPieces,
                        observations: '',
                        sousGarantie: Math.random() > 0.7
                    });

                    compteur++;
                }
            });

            return interventions;
        },

        genererDatePassee(joursMax) {
            const now = new Date();
            const joursAgo = Math.floor(Math.random() * joursMax);
            return new Date(now.getTime() - joursAgo * 24 * 60 * 60 * 1000);
        },

        genererDescription(type, categorie) {
            const descriptions = {
                'PREVENTIVE': `Maintenance préventive - ${categorie.toLowerCase()}`,
                'CORRECTIVE': `Réparation - ${categorie.toLowerCase()}`,
                'CURATIVE': `Intervention curative - ${categorie.toLowerCase()}`,
                'AMELIORATIVE': `Amélioration - ${categorie.toLowerCase()}`
            };
            return descriptions[type] || 'Intervention de maintenance';
        },

        genererEquipements() {
            this.equipements = [
                {
                    id: 1,
                    nom: 'Chaudière',
                    bien: 'Appartement A1',
                    marque: 'Bosch',
                    dateInstallation: new Date(2020, 5, 15),
                    derniereMaintenance: new Date(2024, 10, 1),
                    nombreInterventions: 8,
                    etat: 'BON'
                },
                {
                    id: 2,
                    nom: 'Climatisation',
                    bien: 'Maison B2',
                    marque: 'Daikin',
                    dateInstallation: new Date(2021, 2, 20),
                    derniereMaintenance: new Date(2024, 8, 15),
                    nombreInterventions: 5,
                    etat: 'BON'
                },
                {
                    id: 3,
                    nom: 'Chauffe-eau',
                    bien: 'Appartement C3',
                    marque: 'Atlantic',
                    dateInstallation: new Date(2019, 11, 10),
                    derniereMaintenance: new Date(2024, 9, 5),
                    nombreInterventions: 12,
                    etat: 'MOYEN'
                }
            ];
        },

        genererPlanningPreventif() {
            this.planningPreventif = [
                {
                    id: 1,
                    bien: 'Appartement A1',
                    equipement: 'Chaudière',
                    typeMaintenance: 'Révision annuelle',
                    frequence: 'Annuelle',
                    derniereIntervention: new Date(2024, 10, 1),
                    prochaineDate: new Date(2025, 10, 1)
                },
                {
                    id: 2,
                    bien: 'Maison B2',
                    equipement: 'Climatisation',
                    typeMaintenance: 'Nettoyage filtres',
                    frequence: 'Trimestrielle',
                    derniereIntervention: new Date(2024, 8, 15),
                    prochaineDate: new Date(2024, 11, 15)
                },
                {
                    id: 3,
                    bien: 'Appartement C3',
                    equipement: 'Chauffe-eau',
                    typeMaintenance: 'Détartrage',
                    frequence: 'Annuelle',
                    derniereIntervention: new Date(2024, 9, 5),
                    prochaineDate: new Date(2025, 9, 5)
                }
            ];
        },

        calculerStats() {
            const now = new Date();
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

            const preventives = this.interventions.filter(i => i.type === 'PREVENTIVE');
            const interventionsMois = this.interventions.filter(i =>
                new Date(i.date) >= monthStart
            );

            this.stats = {
                totalInterventions: this.interventions.length,
                interventionsMois: interventionsMois.length,
                preventives: preventives.length,
                pourcentagePreventives: Math.round((preventives.length / Math.max(this.interventions.length, 1)) * 100),
                coutTotal: this.interventions.reduce((sum, i) => sum + (i.cout || 0), 0),
                coutMoyen: Math.round(this.interventions.reduce((sum, i) => sum + (i.cout || 0), 0) / Math.max(this.interventions.length, 1)),
                aPlanifier: this.planningPreventif.filter(p => {
                    const diff = (new Date(p.prochaineDate) - now) / (1000 * 60 * 60 * 24);
                    return diff <= 30 && diff >= 0;
                }).length
            };
        },

        verifierAlertes() {
            const now = new Date();
            this.alertesMaintenance = this.planningPreventif.filter(p => {
                const diff = (new Date(p.prochaineDate) - now) / (1000 * 60 * 60 * 24);
                return diff <= 30 && diff >= 0;
            });
        },

        nouvelleIntervention() {
            this.resetForm();
            this.interventionForm.reference = this.genererReference();
            const modal = new bootstrap.Modal(document.getElementById("interventionModal"));
            modal.show();
        },

        modifierIntervention(intervention) {
            this.interventionForm = { ...intervention };
            bootstrap.Modal.getInstance(document.getElementById("detailsModal"))?.hide();
            const modal = new bootstrap.Modal(document.getElementById("interventionModal"));
            modal.show();
        },

        resetForm() {
            this.interventionForm = {
                id: null,
                reference: '',
                date: new Date().toISOString().split('T')[0],
                bienId: '',
                type: '',
                categorie: '',
                description: '',
                intervenant: '',
                intervenantContact: '',
                duree: 0,
                coutMainOeuvre: 0,
                coutPieces: 0,
                cout: 0,
                observations: '',
                sousGarantie: false,
                preventifSuivant: false
            };
        },

        genererReference() {
            const year = new Date().getFullYear();
            const count = this.interventions.length + 1;
            return `MAINT-${year}-${String(count).padStart(4, '0')}`;
        },

        calculerCoutTotal() {
            this.interventionForm.cout =
                (this.interventionForm.coutMainOeuvre || 0) +
                (this.interventionForm.coutPieces || 0);
        },

        async sauvegarderIntervention() {
            try {
                if (!this.interventionForm.date || !this.interventionForm.bienId ||
                    !this.interventionForm.type || !this.interventionForm.categorie ||
                    !this.interventionForm.description) {
                    ElMessage.warning("Veuillez remplir tous les champs obligatoires");
                    return;
                }

                const bien = this.biens.find(b => b.id === parseInt(this.interventionForm.bienId));

                if (this.interventionForm.id) {
                    const index = this.interventions.findIndex(i => i.id === this.interventionForm.id);
                    if (index !== -1) {
                        this.interventions[index] = {
                            ...this.interventionForm,
                            bien: bien?.nom || 'N/A',
                            date: new Date(this.interventionForm.date)
                        };
                    }
                    ElMessage.success("Intervention mise à jour");
                } else {
                    const newIntervention = {
                        id: this.interventionForm.reference,
                        ...this.interventionForm,
                        bien: bien?.nom || 'N/A',
                        date: new Date(this.interventionForm.date)
                    };
                    this.interventions.unshift(newIntervention);
                    ElMessage.success("Intervention enregistrée");
                }

                bootstrap.Modal.getInstance(document.getElementById("interventionModal")).hide();
                this.resetForm();
                this.calculerStats();
                this.$nextTick(() => {
                    this.initCharts();
                });
            } catch (error) {
                console.error("Erreur sauvegarde:", error);
                ElMessage.error("Erreur lors de la sauvegarde");
            }
        },

        voirDetails(intervention) {
            this.selectedIntervention = intervention;
            const modal = new bootstrap.Modal(document.getElementById("detailsModal"));
            modal.show();
        },

        dupliquer(intervention) {
            this.interventionForm = {
                ...intervention,
                id: null,
                reference: this.genererReference(),
                date: new Date().toISOString().split('T')[0]
            };
            const modal = new bootstrap.Modal(document.getElementById("interventionModal"));
            modal.show();
        },

        supprimerIntervention(id) {
            this.interventionToDelete = id;
            const modal = new bootstrap.Modal(document.getElementById("deleteModal"));
            modal.show();
        },

        confirmerSuppression() {
            this.interventions = this.interventions.filter(i => i.id !== this.interventionToDelete);
            bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
            ElMessage.success("Intervention supprimée");
            this.calculerStats();
            this.$nextTick(() => {
                this.initCharts();
            });
        },

        async telechargerRapport(intervention) {
            try {
                const fileUrl = await this.$store.dispatch("contrats/exportContrats", "pdf");
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = `rapport-maintenance-${intervention.reference}.pdf`;
                link.click();
                URL.revokeObjectURL(fileUrl);
                ElMessage.success("Téléchargement réussi");
            } catch (error) {
                ElMessage.error("Erreur lors du téléchargement");
            }
        },

        planifierMaintenance() {
            ElMessage.info("Fonctionnalité de planification - À implémenter");
        },

        planifierDepuisPlan(plan) {
            this.resetForm();
            this.interventionForm.reference = this.genererReference();
            this.interventionForm.type = 'PREVENTIVE';
            this.interventionForm.description = plan.typeMaintenance;
            const modal = new bootstrap.Modal(document.getElementById("interventionModal"));
            modal.show();
        },

        async exporterHistorique() {
            try {
                const fileUrl = await this.$store.dispatch("contrats/exportContrats", "xlsx");
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = `historique-maintenance-${new Date().toISOString().split('T')[0]}.xlsx`;
                link.click();
                URL.revokeObjectURL(fileUrl);
                ElMessage.success("Export réussi");
            } catch (error) {
                ElMessage.error("Erreur lors de l'export");
            }
        },

        voirAlertes() {
            ElMessage.info(`${this.alertesMaintenance.length} maintenance(s) à venir`);
        },

        voirHistoriqueEquipement(equipement) {
            this.filters.bienId = '';
            this.searchQuery = equipement.nom;
            this.applyFilters();
            // Basculer vers l'onglet historique
            const tab = new bootstrap.Tab(document.querySelector('[data-bs-target="#historique-tab"]'));
            tab.show();
        },

        applyFilters() {
            this.currentPage = 1;
        },

        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },

        initCharts() {
            this.$nextTick(() => {
                this.createTypeChart();
                this.createCategorieChart();
                this.createCoutsChart();
            });
        },

        createTypeChart() {
            const ctx = document.getElementById('typeChart');
            if (!ctx) return;

            if (this.charts.type) {
                this.charts.type.destroy();
            }

            const grouped = {};
            this.interventions.forEach(i => {
                grouped[i.type] = (grouped[i.type] || 0) + 1;
            });

            this.charts.type = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(grouped),
                    datasets: [{
                        data: Object.values(grouped),
                        backgroundColor: ['#28a745', '#ffc107', '#dc3545', '#17a2b8']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        },

        createCategorieChart() {
            const ctx = document.getElementById('categorieChart');
            if (!ctx) return;

            if (this.charts.categorie) {
                this.charts.categorie.destroy();
            }

            const grouped = {};
            this.interventions.forEach(i => {
                grouped[i.categorie] = (grouped[i.categorie] || 0) + 1;
            });

            this.charts.categorie = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(grouped),
                    datasets: [{
                        label: 'Nombre d\'interventions',
                        data: Object.values(grouped),
                        backgroundColor: '#0d6efd'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        },

        createCoutsChart() {
            const ctx = document.getElementById('coutsChart');
            if (!ctx) return;

            if (this.charts.couts) {
                this.charts.couts.destroy();
            }

            // Grouper par mois
            const grouped = {};
            this.interventions.forEach(i => {
                const mois = new Date(i.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' });
                grouped[mois] = (grouped[mois] || 0) + (i.cout || 0);
            });

            const labels = Object.keys(grouped).slice(-12);
            const data = labels.map(l => grouped[l]);

            this.charts.couts = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Coûts de maintenance',
                        data: data,
                        borderColor: '#ffc107',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: true
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    return 'Coût: ' + this.formatCurrency(context.parsed.y);
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) => this.formatCurrency(value)
                            }
                        }
                    }
                }
            });
        },

        getTypeBadgeClass(type) {
            const classes = {
                'PREVENTIVE': 'bg-success',
                'CORRECTIVE': 'bg-warning',
                'CURATIVE': 'bg-danger',
                'AMELIORATIVE': 'bg-info'
            };
            return classes[type] || 'bg-secondary';
        },

        getCategorieIcon(categorie) {
            const icons = {
                'PLOMBERIE': 'bi bi-droplet',
                'ELECTRICITE': 'bi bi-lightning-charge',
                'CHAUFFAGE': 'bi bi-thermometer-half',
                'CLIMATISATION': 'bi bi-snow',
                'SERRURERIE': 'bi bi-key',
                'PEINTURE': 'bi bi-brush',
                'JARDINAGE': 'bi bi-tree',
                'AUTRE': 'bi bi-tools'
            };
            return icons[categorie] || 'bi bi-wrench';
        },

        getStatutPlanBadgeClass(plan) {
            const now = new Date();
            const diff = (new Date(plan.prochaineDate) - now) / (1000 * 60 * 60 * 24);

            if (diff < 0) return 'bg-danger';
            if (diff <= 7) return 'bg-warning';
            if (diff <= 30) return 'bg-info';
            return 'bg-success';
        },

        getStatutPlan(plan) {
            const now = new Date();
            const diff = (new Date(plan.prochaineDate) - now) / (1000 * 60 * 60 * 24);

            if (diff < 0) return 'En retard';
            if (diff <= 7) return 'Urgent';
            if (diff <= 30) return 'À venir';
            return 'Planifié';
        },

        getEtatEquipementBadgeClass(etat) {
            const classes = {
                'BON': 'bg-success',
                'MOYEN': 'bg-warning',
                'MAUVAIS': 'bg-danger'
            };
            return classes[etat] || 'bg-secondary';
        },

        truncate(text, length) {
            if (!text) return '';
            return text.length > length ? text.substring(0, length) + '...' : text;
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
    },

    beforeDestroy() {
        // Détruire les graphiques
        if (this.charts.type) this.charts.type.destroy();
        if (this.charts.categorie) this.charts.categorie.destroy();
        if (this.charts.couts) this.charts.couts.destroy();
    },

    watch: {
        '$route.query.tab'(newTab) {
            if (newTab === 'stats') {
                this.$nextTick(() => {
                    this.initCharts();
                });
            }
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
