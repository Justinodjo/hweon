<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">
            <!-- En-tête -->
            <div class="row">
                <div class="col-sm-12 mb-5">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <h1 class="h3 mb-2 mb-sm-0">Demandes d'Intervention</h1>
                        <div class="d-flex gap-2">
                            <button @click="nouvelleDemande" class="btn btn-primary mb-0">
                                <i class="bi bi-plus-lg fa-fw"></i> Nouvelle Demande
                            </button>
                            <button @click="exporterDemandes" class="btn btn-success mb-0">
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
                                <span>Demandes Ouvertes</span>
                                <h3 class="mb-0 mt-2">{{ stats.demandesOuvertes }}</h3>
                            </div>
                            <div
                                class="icon-lg rounded-circle flex-shrink-0 bg-warning bg-opacity-10 text-warning mb-0">
                                <i class="bi bi-inbox fa-fw"></i>
                            </div>
                        </div>
                        <span><span class="text-warning">{{ stats.nouvellesSemaine }}</span> cette semaine</span>
                    </div>
                </div>

                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>En Cours</span>
                                <h3 class="mb-0 mt-2 text-primary">{{ stats.enCours }}</h3>
                            </div>
                            <div
                                class="icon-lg rounded-circle flex-shrink-0 bg-primary bg-opacity-10 text-primary mb-0">
                                <i class="bi bi-gear fa-fw"></i>
                            </div>
                        </div>
                        <span>Interventions en cours</span>
                    </div>
                </div>

                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>Urgentes</span>
                                <h3 class="mb-0 mt-2 text-danger">{{ stats.urgentes }}</h3>
                            </div>
                            <div class="icon-lg rounded-circle flex-shrink-0 bg-danger bg-opacity-10 text-danger mb-0">
                                <i class="bi bi-exclamation-triangle fa-fw"></i>
                            </div>
                        </div>
                        <span>À traiter en priorité</span>
                    </div>
                </div>

                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>Résolues (Mois)</span>
                                <h3 class="mb-0 mt-2 text-success">{{ stats.resoluesMois }}</h3>
                            </div>
                            <div
                                class="icon-lg rounded-circle flex-shrink-0 bg-success bg-opacity-10 text-success mb-0">
                                <i class="bi bi-check-circle fa-fw"></i>
                            </div>
                        </div>
                        <span><span class="text-success">{{ stats.tauxResolution }}%</span> de résolution</span>
                    </div>
                </div>
            </div>

            <!-- Alertes urgentes -->
            <div class="row mb-4" v-if="demandesUrgentes.length > 0">
                <div class="col-12">
                    <div class="alert alert-danger d-flex align-items-center" role="alert">
                        <i class="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
                        <div>
                            <strong>Attention !</strong> {{ demandesUrgentes.length }} demande(s) urgente(s)
                            nécessite(nt) votre attention immédiate.
                            <button @click="filtrerUrgentes" class="btn btn-sm btn-danger ms-3">Voir</button>
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
                                <option value="OUVERTE">Ouverte</option>
                                <option value="EN_COURS">En cours</option>
                                <option value="EN_ATTENTE">En attente</option>
                                <option value="RESOLUE">Résolue</option>
                                <option value="ANNULEE">Annulée</option>
                            </select>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Priorité</label>
                            <select v-model="filters.priorite" @change="applyFilters" class="form-select">
                                <option value="">Toutes</option>
                                <option value="URGENTE">Urgente</option>
                                <option value="HAUTE">Haute</option>
                                <option value="MOYENNE">Moyenne</option>
                                <option value="BASSE">Basse</option>
                            </select>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Catégorie</label>
                            <select v-model="filters.categorie" @change="applyFilters" class="form-select">
                                <option value="">Toutes</option>
                                <option value="PLOMBERIE">Plomberie</option>
                                <option value="ELECTRICITE">Électricité</option>
                                <option value="CHAUFFAGE">Chauffage</option>
                                <option value="SERRURERIE">Serrurerie</option>
                                <option value="MENAGE">Ménage</option>
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
                                <option value="">Toutes</option>
                                <option value="7jours">7 derniers jours</option>
                                <option value="30jours">30 derniers jours</option>
                                <option value="mois">Ce mois</option>
                                <option value="trimestre">Ce trimestre</option>
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

            <!-- Tableau des demandes -->
            <div class="card shadow">
                <div class="card-body">
                    <!-- En-têtes -->
                    <div class="bg-light rounded p-3 d-none d-lg-block">
                        <div class="row">
                            <div class="col-lg-2">
                                <h6 class="mb-0">Référence</h6>
                            </div>
                            <div class="col-lg-2">
                                <h6 class="mb-0">Bien / Locataire</h6>
                            </div>
                            <div class="col-lg-2">
                                <h6 class="mb-0">Catégorie</h6>
                            </div>
                            <div class="col-lg-2">
                                <h6 class="mb-0">Description</h6>
                            </div>
                            <div class="col-lg-1">
                                <h6 class="mb-0">Priorité</h6>
                            </div>
                            <div class="col-lg-2">
                                <h6 class="mb-0">Date / Statut</h6>
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

                    <!-- Aucune demande -->
                    <div v-else-if="paginatedDemandes.length === 0" class="text-center text-muted my-5">
                        <i class="bi bi-inbox fs-1"></i>
                        <p class="mt-3">Aucune demande d'intervention trouvée.</p>
                    </div>

                    <!-- Lignes -->
                    <div v-else>
                        <div class="row border-bottom py-3 align-items-center" v-for="demande in paginatedDemandes"
                            :key="demande.id" :class="{ 'bg-danger bg-opacity-10': demande.priorite === 'URGENTE' }">
                            <div class="col-lg-2">
                                <strong class="d-lg-none">Référence:</strong>
                                <span class="text-primary fw-bold">{{ demande.reference }}</span>
                            </div>
                            <div class="col-lg-2">
                                <strong class="d-lg-none">Bien:</strong>
                                <div>
                                    <div class="fw-bold small">{{ demande.bien }}</div>
                                    <div class="text-muted small">{{ demande.locataire }}</div>
                                </div>
                            </div>
                            <div class="col-lg-2">
                                <strong class="d-lg-none">Catégorie:</strong>
                                <span class="badge" :class="getCategorieBadgeClass(demande.categorie)">
                                    <i :class="getCategorieIcon(demande.categorie)" class="me-1"></i>
                                    {{ demande.categorie }}
                                </span>
                            </div>
                            <div class="col-lg-2">
                                <strong class="d-lg-none">Description:</strong>
                                <span class="small">{{ truncate(demande.description, 50) }}</span>
                            </div>
                            <div class="col-lg-1">
                                <strong class="d-lg-none">Priorité:</strong>
                                <span class="badge" :class="getPrioriteBadgeClass(demande.priorite)">
                                    {{ demande.priorite }}
                                </span>
                            </div>
                            <div class="col-lg-2">
                                <strong class="d-lg-none">Date:</strong>
                                <div class="small">{{ formatDate(demande.dateCreation) }}</div>
                                <span class="badge" :class="getStatutBadgeClass(demande.statut)">
                                    {{ demande.statut }}
                                </span>
                            </div>
                            <div class="col-lg-1">
                                <div class="dropdown">
                                    <button class="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown">
                                        <i class="bi bi-three-dots-vertical"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li>
                                            <a class="dropdown-item" @click="voirDetails(demande)">
                                                <i class="bi bi-eye me-2"></i>Détails
                                            </a>
                                        </li>
                                        <li v-if="demande.statut === 'OUVERTE'">
                                            <a class="dropdown-item" @click="prendreEnCharge(demande)">
                                                <i class="bi bi-hand-thumbs-up me-2"></i>Prendre en charge
                                            </a>
                                        </li>
                                        <li v-if="demande.statut === 'EN_COURS'">
                                            <a class="dropdown-item" @click="marquerResolue(demande)">
                                                <i class="bi bi-check-circle me-2"></i>Marquer résolue
                                            </a>
                                        </li>
                                        <li>
                                            <a class="dropdown-item" @click="ajouterCommentaire(demande)">
                                                <i class="bi bi-chat-left-text me-2"></i>Commentaire
                                            </a>
                                        </li>
                                        <li>
                                            <a class="dropdown-item" @click="assignerTechnicien(demande)">
                                                <i class="bi bi-person-plus me-2"></i>Assigner
                                            </a>
                                        </li>
                                        <li v-if="demande.statut !== 'RESOLUE'">
                                            <hr class="dropdown-divider">
                                            <a class="dropdown-item text-danger" @click="annulerDemande(demande)">
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
                            Affichage {{ startIndex + 1 }} à {{ endIndex }} sur {{ filteredDemandes.length }} entrées
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

        <!-- Modal Nouvelle/Modifier Demande -->
        <div class="modal fade" id="demandeModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ demandeForm.id ? 'Modifier' : 'Nouvelle' }} Demande d'Intervention
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">Bien Concerné *</label>
                                    <select v-model="demandeForm.bienId" class="form-select" required>
                                        <option value="">Sélectionnez un bien...</option>
                                        <option v-for="bien in biens" :key="bien.id" :value="bien.id">
                                            {{ bien.nom }}
                                        </option>
                                    </select>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Catégorie *</label>
                                    <select v-model="demandeForm.categorie" class="form-select" required>
                                        <option value="">Sélectionnez...</option>
                                        <option value="PLOMBERIE">Plomberie</option>
                                        <option value="ELECTRICITE">Électricité</option>
                                        <option value="CHAUFFAGE">Chauffage</option>
                                        <option value="SERRURERIE">Serrurerie</option>
                                        <option value="MENAGE">Ménage</option>
                                        <option value="JARDINAGE">Jardinage</option>
                                        <option value="AUTRE">Autre</option>
                                    </select>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Priorité *</label>
                                    <select v-model="demandeForm.priorite" class="form-select" required>
                                        <option value="URGENTE">Urgente (24h)</option>
                                        <option value="HAUTE">Haute (48h)</option>
                                        <option value="MOYENNE">Moyenne (1 semaine)</option>
                                        <option value="BASSE">Basse</option>
                                    </select>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Date Souhaitée</label>
                                    <input type="datetime-local" v-model="demandeForm.dateSouhaitee"
                                        class="form-control">
                                </div>

                                <div class="col-12">
                                    <label class="form-label">Titre de la Demande *</label>
                                    <input type="text" v-model="demandeForm.titre" class="form-control"
                                        placeholder="Ex: Fuite d'eau dans la cuisine" required>
                                </div>

                                <div class="col-12">
                                    <label class="form-label">Description Détaillée *</label>
                                    <textarea v-model="demandeForm.description" class="form-control" rows="4"
                                        placeholder="Décrivez le problème en détail..." required></textarea>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Lieu Précis</label>
                                    <input type="text" v-model="demandeForm.lieu" class="form-control"
                                        placeholder="Ex: Cuisine, Salle de bain">
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Contact</label>
                                    <input type="tel" v-model="demandeForm.contact" class="form-control"
                                        placeholder="Numéro de téléphone">
                                </div>

                                <div class="col-12">
                                    <label class="form-label">Photos (optionnel)</label>
                                    <input type="file" class="form-control" accept="image/*" multiple
                                        @change="handleFileUpload">
                                    <small class="text-muted">Ajoutez des photos pour illustrer le problème</small>
                                </div>

                                <div class="col-12" v-if="demandeForm.photos && demandeForm.photos.length > 0">
                                    <div class="d-flex gap-2 flex-wrap">
                                        <div v-for="(photo, index) in demandeForm.photos" :key="index"
                                            class="position-relative">
                                            <img :src="photo" class="img-thumbnail"
                                                style="width: 100px; height: 100px; object-fit: cover;">
                                            <button type="button"
                                                class="btn btn-sm btn-danger position-absolute top-0 end-0"
                                                @click="removePhoto(index)">
                                                <i class="bi bi-x"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-12">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox"
                                            v-model="demandeForm.accesPossible" id="accesPossible">
                                        <label class="form-check-label" for="accesPossible">
                                            Accès au logement possible sans ma présence
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="sauvegarderDemande">
                            <i class="bi bi-send"></i> {{ demandeForm.id ? 'Mettre à jour' : 'Soumettre' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Détails Demande -->
        <div class="modal fade" id="detailsModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Détails de la Demande</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" v-if="selectedDemande">
                        <div class="row g-4">
                            <!-- Informations principales -->
                            <div class="col-md-8">
                                <div class="card">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0">Informations Générales</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row g-3">
                                            <div class="col-md-6">
                                                <strong>Référence:</strong> {{ selectedDemande.reference }}
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Statut:</strong>
                                                <span class="badge"
                                                    :class="getStatutBadgeClass(selectedDemande.statut)">
                                                    {{ selectedDemande.statut }}
                                                </span>
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Bien:</strong> {{ selectedDemande.bien }}
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Locataire:</strong> {{ selectedDemande.locataire }}
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Catégorie:</strong>
                                                <span class="badge"
                                                    :class="getCategorieBadgeClass(selectedDemande.categorie)">
                                                    {{ selectedDemande.categorie }}
                                                </span>
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Priorité:</strong>
                                                <span class="badge"
                                                    :class="getPrioriteBadgeClass(selectedDemande.priorite)">
                                                    {{ selectedDemande.priorite }}
                                                </span>
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Date création:</strong> {{
                                                    formatDateTime(selectedDemande.dateCreation) }}
                                            </div>
                                            <div class="col-md-6" v-if="selectedDemande.dateSouhaitee">
                                                <strong>Date souhaitée:</strong> {{
                                                    formatDateTime(selectedDemande.dateSouhaitee) }}
                                            </div>
                                            <div class="col-12">
                                                <strong>Titre:</strong>
                                                <p class="mb-0">{{ selectedDemande.titre }}</p>
                                            </div>
                                            <div class="col-12">
                                                <strong>Description:</strong>
                                                <p class="mb-0">{{ selectedDemande.description }}</p>
                                            </div>
                                            <div class="col-md-6" v-if="selectedDemande.lieu">
                                                <strong>Lieu:</strong> {{ selectedDemande.lieu }}
                                            </div>
                                            <div class="col-md-6" v-if="selectedDemande.contact">
                                                <strong>Contact:</strong> {{ selectedDemande.contact }}
                                            </div>
                                        </div>

                                        <!-- Photos -->
                                        <div v-if="selectedDemande.photos && selectedDemande.photos.length > 0"
                                            class="mt-3">
                                            <strong>Photos:</strong>
                                            <div class="d-flex gap-2 flex-wrap mt-2">
                                                <img v-for="(photo, index) in selectedDemande.photos" :key="index"
                                                    :src="photo" class="img-thumbnail glightbox"
                                                    style="width: 150px; height: 150px; object-fit: cover; cursor: pointer;">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Commentaires et Historique -->
                                <div class="card mt-3">
                                    <div class="card-header bg-light d-flex justify-content-between align-items-center">
                                        <h6 class="mb-0">Historique et Commentaires</h6>
                                        <button class="btn btn-sm btn-primary"
                                            @click="ajouterCommentaire(selectedDemande)">
                                            <i class="bi bi-plus"></i> Ajouter
                                        </button>
                                    </div>
                                    <div class="card-body">
                                        <div class="timeline">
                                            <div v-for="comment in selectedDemande.commentaires" :key="comment.id"
                                                class="timeline-item mb-3">
                                                <div class="d-flex">
                                                    <div class="flex-shrink-0">
                                                        <div
                                                            class="avatar avatar-sm bg-primary text-white rounded-circle">
                                                            {{ getInitials(comment.auteur) }}
                                                        </div>
                                                    </div>
                                                    <div class="flex-grow-1 ms-3">
                                                        <div class="d-flex justify-content-between">
                                                            <strong>{{ comment.auteur }}</strong>
                                                            <small class="text-muted">{{ formatDateTime(comment.date)
                                                            }}</small>
                                                        </div>
                                                        <p class="mb-0 small">{{ comment.texte }}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Sidebar Actions -->
                            <div class="col-md-4">
                                <div class="card">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0">Actions</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="d-grid gap-2">
                                            <button class="btn btn-success" v-if="selectedDemande.statut === 'OUVERTE'"
                                                @click="prendreEnCharge(selectedDemande)">
                                                <i class="bi bi-hand-thumbs-up me-2"></i>Prendre en charge
                                            </button>
                                            <button class="btn btn-primary" v-if="selectedDemande.statut === 'EN_COURS'"
                                                @click="marquerResolue(selectedDemande)">
                                                <i class="bi bi-check-circle me-2"></i>Marquer résolue
                                            </button>
                                            <button class="btn btn-info" @click="assignerTechnicien(selectedDemande)">
                                                <i class="bi bi-person-plus me-2"></i>Assigner technicien
                                            </button>
                                            <button class="btn btn-outline-primary">
                                                <i class="bi bi-printer me-2"></i>Imprimer
                                            </button>
                                            <button class="btn btn-outline-danger"
                                                v-if="selectedDemande.statut !== 'RESOLUE'"
                                                @click="annulerDemande(selectedDemande)">
                                                <i class="bi bi-x-circle me-2"></i>Annuler
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Informations technicien -->
                                <div class="card mt-3" v-if="selectedDemande.technicien">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0">Technicien Assigné</h6>
                                    </div>
                                    <div class="card-body">
                                        <p><strong>Nom:</strong> {{ selectedDemande.technicien }}</p>
                                        <p><strong>Contact:</strong> {{ selectedDemande.technicienContact }}</p>
                                    </div>
                                </div>

                                <!-- Coûts -->
                                <div class="card mt-3" v-if="selectedDemande.coutEstime">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0">Coûts</h6>
                                    </div>
                                    <div class="card-body">
                                        <p><strong>Coût estimé:</strong> {{ formatCurrency(selectedDemande.coutEstime)
                                        }}</p>
                                        <p v-if="selectedDemande.coutFinal">
                                            <strong>Coût final:</strong> {{ formatCurrency(selectedDemande.coutFinal) }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Assigner Technicien -->
        <div class="modal fade" id="assignerModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Assigner un Technicien</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="mb-3">
                                <label class="form-label">Sélectionner un Technicien</label>
                                <select v-model="assignationForm.technicienId" class="form-select">
                                    <option value="">Choisir...</option>
                                    <option value="1">Jean Dupont - Plomberie</option>
                                    <option value="2">Marie Martin - Électricité</option>
                                    <option value="3">Pierre Durand - Chauffage</option>
                                    <option value="4">Sophie Bernard - Multi-services</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Date d'Intervention</label>
                                <input type="datetime-local" v-model="assignationForm.dateIntervention"
                                    class="form-control">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Coût Estimé</label>
                                <input type="number" v-model="assignationForm.coutEstime" class="form-control"
                                    step="0.01">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Instructions</label>
                                <textarea v-model="assignationForm.instructions" class="form-control"
                                    rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="confirmerAssignation">
                            <i class="bi bi-check"></i> Assigner
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Ajouter Commentaire -->
        <div class="modal fade" id="commentaireModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Ajouter un Commentaire</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="mb-3">
                                <label class="form-label">Type</label>
                                <select v-model="commentaireForm.type" class="form-select">
                                    <option value="COMMENTAIRE">Commentaire</option>
                                    <option value="NOTE">Note interne</option>
                                    <option value="MISE_A_JOUR">Mise à jour</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Message</label>
                                <textarea v-model="commentaireForm.texte" class="form-control" rows="4"
                                    placeholder="Votre commentaire..."></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="sauvegarderCommentaire">
                            <i class="bi bi-send"></i> Ajouter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ElMessage } from "element-plus";
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';

export default {
    data() {
        return {
            demandes: [],
            biens: [],
            stats: {
                demandesOuvertes: 0,
                nouvellesSemaine: 0,
                enCours: 0,
                urgentes: 0,
                resoluesMois: 0,
                tauxResolution: 0
            },
            filters: {
                statut: '',
                priorite: '',
                categorie: '',
                bienId: '',
                periode: ''
            },
            demandeForm: {
                id: null,
                bienId: '',
                categorie: '',
                priorite: 'MOYENNE',
                titre: '',
                description: '',
                lieu: '',
                contact: '',
                dateSouhaitee: '',
                accesPossible: false,
                photos: []
            },
            assignationForm: {
                technicienId: '',
                dateIntervention: '',
                coutEstime: 0,
                instructions: ''
            },
            commentaireForm: {
                type: 'COMMENTAIRE',
                texte: ''
            },
            searchQuery: '',
            currentPage: 1,
            perPage: 15,
            isLoading: false,
            selectedDemande: null,
            lightbox: null
        };
    },

    computed: {
        demandesUrgentes() {
            return this.demandes.filter(d =>
                d.priorite === 'URGENTE' && d.statut !== 'RESOLUE' && d.statut !== 'ANNULEE'
            );
        },

        filteredDemandes() {
            let result = [...this.demandes];

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(d =>
                    d.reference?.toLowerCase().includes(query) ||
                    d.titre?.toLowerCase().includes(query) ||
                    d.description?.toLowerCase().includes(query)
                );
            }

            if (this.filters.statut) {
                result = result.filter(d => d.statut === this.filters.statut);
            }

            if (this.filters.priorite) {
                result = result.filter(d => d.priorite === this.filters.priorite);
            }

            if (this.filters.categorie) {
                result = result.filter(d => d.categorie === this.filters.categorie);
            }

            if (this.filters.bienId) {
                result = result.filter(d => d.bienId === parseInt(this.filters.bienId));
            }

            return result.sort((a, b) => {
                // Trier par priorité puis par date
                const prioriteOrder = { 'URGENTE': 1, 'HAUTE': 2, 'MOYENNE': 3, 'BASSE': 4 };
                const priorityDiff = prioriteOrder[a.priorite] - prioriteOrder[b.priorite];
                if (priorityDiff !== 0) return priorityDiff;
                return new Date(b.dateCreation) - new Date(a.dateCreation);
            });
        },

        paginatedDemandes() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredDemandes.slice(start, start + this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filteredDemandes.length / this.perPage);
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
            return Math.min(this.startIndex + this.perPage, this.filteredDemandes.length);
        }
    },

    mounted() {
        this.fetchDemandes();
        this.fetchBiens();
        this.$nextTick(() => {
            this.initLightbox();
        });
    },

    methods: {
        async fetchDemandes() {
            this.isLoading = true;
            try {
                const contrats = await this.$store.dispatch("contrats/getAll");

                // Générer des demandes d'intervention fictives
                this.demandes = this.genererDemandesDepuisContrats(contrats);
                this.calculerStats();
            } catch (error) {
                console.error("Erreur chargement demandes:", error);
                ElMessage.error("Erreur lors du chargement des demandes");
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

        genererDemandesDepuisContrats(contrats) {
            const categories = ['PLOMBERIE', 'ELECTRICITE', 'CHAUFFAGE', 'SERRURERIE', 'MENAGE', 'JARDINAGE'];
            const priorites = ['URGENTE', 'HAUTE', 'MOYENNE', 'BASSE'];
            const statuts = ['OUVERTE', 'EN_COURS', 'EN_ATTENTE', 'RESOLUE'];

            const demandes = [];

            contrats.forEach((contrat, index) => {
                if (Math.random() > 0.5) { // 50% des contrats ont une demande
                    const categorie = categories[Math.floor(Math.random() * categories.length)];
                    const priorite = priorites[Math.floor(Math.random() * priorites.length)];
                    const statut = statuts[Math.floor(Math.random() * statuts.length)];

                    const bienNom = this.getBienName(contrat);
                    const locataire = contrat.userInfo?.nom || 'Locataire';

                    demandes.push({
                        id: `INT-${2025}-${String(index + 1).padStart(4, '0')}`,
                        reference: `INT-${2025}-${String(index + 1).padStart(4, '0')}`,
                        bienId: contrat.biensImmobiliers?.[0]?.id || null,
                        bien: bienNom,
                        locataire: locataire,
                        categorie: categorie,
                        priorite: priorite,
                        titre: this.genererTitre(categorie),
                        description: this.genererDescription(categorie),
                        lieu: this.genererLieu(categorie),
                        contact: contrat.userInfo?.telephone || '+229 XX XX XX XX',
                        dateCreation: this.genererDateRecente(),
                        dateSouhaitee: null,
                        statut: statut,
                        accesPossible: Math.random() > 0.5,
                        technicien: statut !== 'OUVERTE' ? 'Jean Dupont' : null,
                        technicienContact: statut !== 'OUVERTE' ? '+229 97 XX XX XX' : null,
                        coutEstime: Math.floor(Math.random() * 50000) + 10000,
                        coutFinal: statut === 'RESOLUE' ? Math.floor(Math.random() * 50000) + 10000 : null,
                        photos: [],
                        commentaires: this.genererCommentaires(statut)
                    });
                }
            });

            return demandes;
        },

        genererTitre(categorie) {
            const titres = {
                'PLOMBERIE': ['Fuite d\'eau', 'WC bouché', 'Robinet qui goutte', 'Chauffe-eau en panne'],
                'ELECTRICITE': ['Panne électrique', 'Disjoncteur qui saute', 'Prise défectueuse', 'Lumière qui clignote'],
                'CHAUFFAGE': ['Chauffage ne fonctionne pas', 'Radiateur froid', 'Thermostat défectueux'],
                'SERRURERIE': ['Serrure bloquée', 'Clés perdues', 'Porte claquée'],
                'MENAGE': ['Nettoyage après travaux', 'État des lieux sortant'],
                'JARDINAGE': ['Tonte de pelouse', 'Taille de haies']
            };
            const liste = titres[categorie] || ['Intervention nécessaire'];
            return liste[Math.floor(Math.random() * liste.length)];
        },

        genererDescription(categorie) {
            const descriptions = {
                'PLOMBERIE': 'Problème de plomberie nécessitant une intervention rapide.',
                'ELECTRICITE': 'Dysfonctionnement électrique à résoudre.',
                'CHAUFFAGE': 'Système de chauffage défaillant.',
                'SERRURERIE': 'Problème de serrurerie urgent.',
                'MENAGE': 'Prestation de ménage requise.',
                'JARDINAGE': 'Travaux d\'entretien extérieur.'
            };
            return descriptions[categorie] || 'Intervention nécessaire.';
        },

        genererLieu(categorie) {
            const lieux = {
                'PLOMBERIE': ['Cuisine', 'Salle de bain', 'WC'],
                'ELECTRICITE': ['Salon', 'Chambre', 'Cuisine'],
                'CHAUFFAGE': ['Salon', 'Chambre'],
                'SERRURERIE': ['Porte d\'entrée', 'Porte chambre']
            };
            const liste = lieux[categorie] || ['Logement'];
            return liste[Math.floor(Math.random() * liste.length)];
        },

        genererDateRecente() {
            const now = new Date();
            const daysAgo = Math.floor(Math.random() * 30);
            return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        },

        genererCommentaires(statut) {
            const commentaires = [];
            if (statut !== 'OUVERTE') {
                commentaires.push({
                    id: 1,
                    auteur: 'Gestionnaire',
                    date: new Date(),
                    texte: 'Demande prise en charge, technicien en cours d\'assignation.'
                });
            }
            if (statut === 'RESOLUE') {
                commentaires.push({
                    id: 2,
                    auteur: 'Technicien',
                    date: new Date(),
                    texte: 'Intervention terminée avec succès.'
                });
            }
            return commentaires;
        },

        getBienName(contrat) {
            if (contrat.biensImmobiliers?.length > 0) {
                return contrat.biensImmobiliers[0].nom;
            }
            if (contrat.detailsBiensImmobiliers?.length > 0) {
                return contrat.detailsBiensImmobiliers[0].nomdetails;
            }
            return 'Bien immobilier';
        },

        calculerStats() {
            const now = new Date();
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

            this.stats = {
                demandesOuvertes: this.demandes.filter(d =>
                    d.statut === 'OUVERTE' || d.statut === 'EN_ATTENTE'
                ).length,
                nouvellesSemaine: this.demandes.filter(d =>
                    new Date(d.dateCreation) >= weekAgo
                ).length,
                enCours: this.demandes.filter(d => d.statut === 'EN_COURS').length,
                urgentes: this.demandes.filter(d =>
                    d.priorite === 'URGENTE' && d.statut !== 'RESOLUE'
                ).length,
                resoluesMois: this.demandes.filter(d =>
                    d.statut === 'RESOLUE' && new Date(d.dateCreation) >= monthStart
                ).length,
                tauxResolution: Math.round(
                    (this.demandes.filter(d => d.statut === 'RESOLUE').length /
                        Math.max(this.demandes.length, 1)) * 100
                )
            };
        },

        nouvelleDemande() {
            this.resetForm();
            const modal = new bootstrap.Modal(document.getElementById("demandeModal"));
            modal.show();
        },

        resetForm() {
            this.demandeForm = {
                id: null,
                bienId: '',
                categorie: '',
                priorite: 'MOYENNE',
                titre: '',
                description: '',
                lieu: '',
                contact: '',
                dateSouhaitee: '',
                accesPossible: false,
                photos: []
            };
        },

        handleFileUpload(event) {
            const files = event.target.files;
            for (let i = 0; i < files.length; i++) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.demandeForm.photos.push(e.target.result);
                };
                reader.readAsDataURL(files[i]);
            }
        },

        removePhoto(index) {
            this.demandeForm.photos.splice(index, 1);
        },

        async sauvegarderDemande() {
            try {
                if (!this.demandeForm.bienId || !this.demandeForm.categorie ||
                    !this.demandeForm.titre || !this.demandeForm.description) {
                    ElMessage.warning("Veuillez remplir tous les champs obligatoires");
                    return;
                }

                const bien = this.biens.find(b => b.id === parseInt(this.demandeForm.bienId));

                if (this.demandeForm.id) {
                    const index = this.demandes.findIndex(d => d.id === this.demandeForm.id);
                    if (index !== -1) {
                        this.demandes[index] = {
                            ...this.demandes[index],
                            ...this.demandeForm,
                            bien: bien?.nom || 'N/A'
                        };
                    }
                    ElMessage.success("Demande mise à jour avec succès");
                } else {
                    const newDemande = {
                        id: `INT-${new Date().getFullYear()}-${String(this.demandes.length + 1).padStart(4, '0')}`,
                        reference: `INT-${new Date().getFullYear()}-${String(this.demandes.length + 1).padStart(4, '0')}`,
                        ...this.demandeForm,
                        bien: bien?.nom || 'N/A',
                        locataire: 'Vous',
                        dateCreation: new Date(),
                        statut: 'OUVERTE',
                        commentaires: []
                    };
                    this.demandes.unshift(newDemande);
                    ElMessage.success("Demande créée avec succès");
                }

                bootstrap.Modal.getInstance(document.getElementById("demandeModal")).hide();
                this.resetForm();
                this.calculerStats();
            } catch (error) {
                console.error("Erreur sauvegarde:", error);
                ElMessage.error("Erreur lors de la sauvegarde");
            }
        },

        voirDetails(demande) {
            this.selectedDemande = demande;
            const modal = new bootstrap.Modal(document.getElementById("detailsModal"));
            modal.show();
            this.$nextTick(() => {
                this.initLightbox();
            });
        },

        async prendreEnCharge(demande) {
            try {
                demande.statut = 'EN_COURS';
                ElMessage.success("Demande prise en charge");
                bootstrap.Modal.getInstance(document.getElementById("detailsModal"))?.hide();
                this.calculerStats();
            } catch (error) {
                ElMessage.error("Erreur lors de la prise en charge");
            }
        },

        async marquerResolue(demande) {
            try {
                demande.statut = 'RESOLUE';
                ElMessage.success("Demande marquée comme résolue");
                bootstrap.Modal.getInstance(document.getElementById("detailsModal"))?.hide();
                this.calculerStats();
            } catch (error) {
                ElMessage.error("Erreur lors de la mise à jour");
            }
        },

        assignerTechnicien(demande) {
            this.selectedDemande = demande;
            bootstrap.Modal.getInstance(document.getElementById("detailsModal"))?.hide();
            const modal = new bootstrap.Modal(document.getElementById("assignerModal"));
            modal.show();
        },

        confirmerAssignation() {
            if (!this.assignationForm.technicienId) {
                ElMessage.warning("Veuillez sélectionner un technicien");
                return;
            }

            this.selectedDemande.technicien = "Technicien assigné";
            this.selectedDemande.statut = 'EN_COURS';
            this.selectedDemande.coutEstime = this.assignationForm.coutEstime;

            ElMessage.success("Technicien assigné avec succès");
            bootstrap.Modal.getInstance(document.getElementById("assignerModal")).hide();
            this.calculerStats();
        },

        ajouterCommentaire(demande) {
            this.selectedDemande = demande;
            bootstrap.Modal.getInstance(document.getElementById("detailsModal"))?.hide();
            const modal = new bootstrap.Modal(document.getElementById("commentaireModal"));
            modal.show();
        },

        sauvegarderCommentaire() {
            if (!this.commentaireForm.texte) {
                ElMessage.warning("Veuillez saisir un commentaire");
                return;
            }

            if (!this.selectedDemande.commentaires) {
                this.selectedDemande.commentaires = [];
            }

            this.selectedDemande.commentaires.push({
                id: Date.now(),
                auteur: 'Vous',
                date: new Date(),
                texte: this.commentaireForm.texte,
                type: this.commentaireForm.type
            });

            ElMessage.success("Commentaire ajouté");
            bootstrap.Modal.getInstance(document.getElementById("commentaireModal")).hide();
            this.commentaireForm = { type: 'COMMENTAIRE', texte: '' };
        },

        async annulerDemande(demande) {
            try {
                demande.statut = 'ANNULEE';
                ElMessage.success("Demande annulée");
                bootstrap.Modal.getInstance(document.getElementById("detailsModal"))?.hide();
                this.calculerStats();
            } catch (error) {
                ElMessage.error("Erreur lors de l'annulation");
            }
        },

        async exporterDemandes() {
            try {
                const fileUrl = await this.$store.dispatch("contrats/exportContrats", "xlsx");
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = `demandes-intervention-${new Date().toISOString().split('T')[0]}.xlsx`;
                link.click();
                URL.revokeObjectURL(fileUrl);
                ElMessage.success("Export réussi");
            } catch (error) {
                ElMessage.error("Erreur lors de l'export");
            }
        },

        filtrerUrgentes() {
            this.filters.priorite = 'URGENTE';
            this.applyFilters();
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

        initLightbox() {
            if (this.lightbox) {
                this.lightbox.destroy();
            }
            this.lightbox = GLightbox({
                selector: '.glightbox'
            });
        },

        getInitials(name) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase();
        },

        truncate(text, length) {
            if (!text) return '';
            return text.length > length ? text.substring(0, length) + '...' : text;
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'OUVERTE': 'bg-warning',
                'EN_COURS': 'bg-primary',
                'EN_ATTENTE': 'bg-info',
                'RESOLUE': 'bg-success',
                'ANNULEE': 'bg-secondary'
            };
            return classes[statut] || 'bg-secondary';
        },

        getPrioriteBadgeClass(priorite) {
            const classes = {
                'URGENTE': 'bg-danger',
                'HAUTE': 'bg-warning',
                'MOYENNE': 'bg-info',
                'BASSE': 'bg-secondary'
            };
            return classes[priorite] || 'bg-secondary';
        },

        getCategorieBadgeClass(categorie) {
            const classes = {
                'PLOMBERIE': 'bg-primary',
                'ELECTRICITE': 'bg-warning',
                'CHAUFFAGE': 'bg-danger',
                'SERRURERIE': 'bg-secondary',
                'MENAGE': 'bg-info',
                'JARDINAGE': 'bg-success',
                'AUTRE': 'bg-dark'
            };
            return classes[categorie] || 'bg-secondary';
        },

        getCategorieIcon(categorie) {
            const icons = {
                'PLOMBERIE': 'bi bi-droplet',
                'ELECTRICITE': 'bi bi-lightning-charge',
                'CHAUFFAGE': 'bi bi-thermometer-half',
                'SERRURERIE': 'bi bi-key',
                'MENAGE': 'bi bi-brush',
                'JARDINAGE': 'bi bi-tree',
                'AUTRE': 'bi bi-tools'
            };
            return icons[categorie] || 'bi bi-wrench';
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
        },

        formatDateTime(date) {
            if (!date) return 'N/A';
            return new Date(date).toLocaleString('fr-FR');
        }
    },

    beforeDestroy() {
        if (this.lightbox) {
            this.lightbox.destroy();
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

.timeline-item {
    border-left: 2px solid #dee2e6;
    padding-left: 1rem;
}

.avatar {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;
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