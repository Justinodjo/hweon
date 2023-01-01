<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">

            <!-- En-tête -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">
                                <i class="bi bi-people me-2"></i>Contacts Gestionnaires
                            </h1>
                            <p class="text-muted mb-0">Annuaire des gestionnaires et partenaires</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <button @click="showCreateModal = true" class="btn btn-primary">
                                <i class="bi bi-plus-circle me-1"></i>Nouveau Contact
                            </button>
                            <button @click="showImportModal = true" class="btn btn-outline-primary">
                                <i class="bi bi-upload me-1"></i>Importer
                            </button>
                            <button @click="exportContacts" class="btn btn-success">
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
                                    <span class="text-muted small">Total Contacts</span>
                                    <h3 class="mb-0 mt-2 text-primary">{{ stats.total }}</h3>
                                    <small class="text-primary">
                                        <i class="bi bi-people me-1"></i>Enregistrés
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-primary bg-opacity-10 text-primary">
                                    <i class="bi bi-people fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Actifs</span>
                                    <h3 class="mb-0 mt-2 text-success">{{ stats.actifs }}</h3>
                                    <small class="text-success">
                                        <i class="bi bi-check-circle me-1"></i>En service
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-success bg-opacity-10 text-success">
                                    <i class="bi bi-check-circle fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Organisations</span>
                                    <h3 class="mb-0 mt-2 text-info">{{ stats.organisations }}</h3>
                                    <small class="text-info">
                                        <i class="bi bi-building me-1"></i>Différentes
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-info bg-opacity-10 text-info">
                                    <i class="bi bi-building fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Favoris</span>
                                    <h3 class="mb-0 mt-2 text-warning">{{ stats.favoris }}</h3>
                                    <small class="text-warning">
                                        <i class="bi bi-star me-1"></i>Contacts
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-warning bg-opacity-10 text-warning">
                                    <i class="bi bi-star fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Catégories -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Répartition par Catégorie</h6>
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div v-for="cat in categories" :key="cat.id" class="col-md-3">
                                        <div class="card border h-100" style="cursor: pointer;"
                                            @click="filterByCategorie(cat.id)">
                                            <div class="card-body text-center">
                                                <i class="bi fs-1 mb-2" :class="[cat.icon, 'text-' + cat.color]"></i>
                                                <h5 class="mb-1" :class="'text-' + cat.color">{{ cat.count }}</h5>
                                                <p class="mb-0 small fw-bold">{{ cat.label }}</p>
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
                                                v-model="searchQuery" @input="filterContacts">
                                            <i
                                                class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.categorie" @change="filterContacts"
                                            class="form-select">
                                            <option value="">Toutes catégories</option>
                                            <option value="BANQUE">Banques</option>
                                            <option value="ASSURANCE">Assurances</option>
                                            <option value="IMMOBILIER">Immobilier</option>
                                            <option value="JURIDIQUE">Juridique</option>
                                            <option value="ADMINISTRATION">Administration</option>
                                            <option value="AUTRE">Autres</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.statut" @change="filterContacts" class="form-select">
                                            <option value="">Tous statuts</option>
                                            <option value="ACTIF">Actif</option>
                                            <option value="INACTIF">Inactif</option>
                                            <option value="ARCHIVE">Archivé</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.favoris" @change="filterContacts" class="form-select">
                                            <option value="">Tous</option>
                                            <option value="OUI">Favoris uniquement</option>
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

                <!-- Vue toggle -->
                <div class="row mb-3">
                    <div class="col-12">
                        <div class="btn-group" role="group">
                            <button type="button" class="btn"
                                :class="viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'"
                                @click="viewMode = 'grid'">
                                <i class="bi bi-grid-3x3-gap me-1"></i>Grille
                            </button>
                            <button type="button" class="btn"
                                :class="viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'"
                                @click="viewMode = 'list'">
                                <i class="bi bi-list-ul me-1"></i>Liste
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Vue Grille -->
                <div v-if="viewMode === 'grid'" class="row g-4">
                    <div v-if="paginatedContacts.length === 0" class="col-12">
                        <div class="text-center py-5">
                            <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                            <p class="text-muted mb-0">Aucun contact trouvé</p>
                        </div>
                    </div>
                    <div v-else v-for="contact in paginatedContacts" :key="contact.id"
                        class="col-md-6 col-lg-4 col-xl-3">
                        <div class="card h-100 contact-card" :class="{ 'border-warning': contact.favori }">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-3">
                                    <div
                                        class="avatar-lg bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center">
                                        <span class="fs-4 fw-bold">{{ getInitiales(contact.nom) }}</span>
                                    </div>
                                    <div class="dropdown">
                                        <button class="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown">
                                            <i class="bi bi-three-dots-vertical"></i>
                                        </button>
                                        <ul class="dropdown-menu dropdown-menu-end">
                                            <li><a class="dropdown-item" href="#"
                                                    @click.prevent="viewContact(contact)"><i
                                                        class="bi bi-eye me-2"></i>Voir</a></li>
                                            <li><a class="dropdown-item" href="#"
                                                    @click.prevent="editContact(contact)"><i
                                                        class="bi bi-pencil me-2"></i>Modifier</a></li>
                                            <li><a class="dropdown-item" href="#"
                                                    @click.prevent="toggleFavori(contact)"><i class="bi me-2"
                                                        :class="contact.favori ? 'bi-star-fill' : 'bi-star'"></i>{{
                                                            contact.favori ? 'Retirer des' : 'Ajouter aux' }} favoris</a></li>
                                            <li>
                                                <hr class="dropdown-divider">
                                            </li>
                                            <li><a class="dropdown-item text-danger" href="#"
                                                    @click.prevent="deleteContact(contact)"><i
                                                        class="bi bi-trash me-2"></i>Supprimer</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <h6 class="mb-1">{{ contact.nom }}</h6>
                                <p class="text-muted small mb-2">{{ contact.poste }}</p>
                                <p class="text-muted small mb-3">
                                    <i class="bi bi-building me-1"></i>{{ contact.organisation }}
                                </p>
                                <div class="mb-2">
                                    <span class="badge" :class="'bg-' + getCategorieColor(contact.categorie)">
                                        {{ contact.categorie }}
                                    </span>
                                    <span class="badge ms-1" :class="getStatutBadgeClass(contact.statut)">
                                        {{ contact.statut }}
                                    </span>
                                </div>
                                <div class="d-flex gap-2 mt-3">
                                    <a :href="'tel:' + contact.telephone"
                                        class="btn btn-sm btn-outline-primary flex-fill">
                                        <i class="bi bi-telephone"></i>
                                    </a>
                                    <a :href="'mailto:' + contact.email"
                                        class="btn btn-sm btn-outline-primary flex-fill">
                                        <i class="bi bi-envelope"></i>
                                    </a>
                                    <button class="btn btn-sm btn-outline-warning" @click="toggleFavori(contact)">
                                        <i class="bi" :class="contact.favori ? 'bi-star-fill' : 'bi-star'"></i>
                                    </button>
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
                                    Liste des Contacts
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ filteredContacts.length }} contacts
                                    </span>
                                </h6>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Contact</th>
                                                <th>Organisation</th>
                                                <th>Catégorie</th>
                                                <th>Téléphone</th>
                                                <th>Email</th>
                                                <th>Statut</th>
                                                <th class="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="paginatedContacts.length === 0">
                                                <td colspan="7" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucun contact trouvé</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="contact in paginatedContacts" :key="contact.id">
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div class="avatar-sm bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                                                            style="width: 40px; height: 40px;">
                                                            <span class="small fw-bold">{{ getInitiales(contact.nom)
                                                            }}</span>
                                                        </div>
                                                        <div>
                                                            <strong>{{ contact.nom }}</strong>
                                                            <i v-if="contact.favori"
                                                                class="bi bi-star-fill text-warning ms-1"></i>
                                                            <div><small class="text-muted">{{ contact.poste }}</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{{ contact.organisation }}</td>
                                                <td>
                                                    <span class="badge"
                                                        :class="'bg-' + getCategorieColor(contact.categorie)">
                                                        {{ contact.categorie }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <a :href="'tel:' + contact.telephone" class="text-decoration-none">
                                                        <i class="bi bi-telephone me-1"></i>{{ contact.telephone }}
                                                    </a>
                                                </td>
                                                <td>
                                                    <a :href="'mailto:' + contact.email" class="text-decoration-none">
                                                        {{ contact.email }}
                                                    </a>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getStatutBadgeClass(contact.statut)">
                                                        {{ contact.statut }}
                                                    </span>
                                                </td>
                                                <td class="text-end">
                                                    <div class="btn-group">
                                                        <button class="btn btn-sm btn-outline-primary"
                                                            @click="viewContact(contact)">
                                                            <i class="bi bi-eye"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-success"
                                                            @click="editContact(contact)">
                                                            <i class="bi bi-pencil"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-warning"
                                                            @click="toggleFavori(contact)">
                                                            <i class="bi"
                                                                :class="contact.favori ? 'bi-star-fill' : 'bi-star'"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-outline-danger"
                                                            @click="deleteContact(contact)">
                                                            <i class="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- Pagination -->
                                <div v-if="filteredContacts.length > perPage" class="card-footer border-top">
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

                <!-- Pagination pour vue grille -->
                <div v-if="viewMode === 'grid' && filteredContacts.length > perPage" class="row mt-4">
                    <div class="col-12">
                        <nav>
                            <ul class="pagination justify-content-center">
                                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                    <a class="page-link" href="#"
                                        @click.prevent="changePage(currentPage - 1)">Précédent</a>
                                </li>
                                <li v-for="page in totalPages" :key="page" class="page-item"
                                    :class="{ active: currentPage === page }">
                                    <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
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

        <!-- Modal Détails -->
        <div v-if="selectedContact" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ selectedContact.nom }}
                            <span v-if="selectedContact.favori" class="ms-2">
                                <i class="bi bi-star-fill text-warning"></i>
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedContact = null"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-4">
                            <div class="col-12 text-center">
                                <div class="avatar-xl bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                    style="width: 100px; height: 100px;">
                                    <span class="fs-1 fw-bold">{{ getInitiales(selectedContact.nom) }}</span>
                                </div>
                                <h4>{{ selectedContact.nom }}</h4>
                                <p class="text-muted">{{ selectedContact.poste }}</p>
                                <div class="mb-3">
                                    <span class="badge" :class="'bg-' + getCategorieColor(selectedContact.categorie)">
                                        {{ selectedContact.categorie }}
                                    </span>
                                    <span class="badge ms-2" :class="getStatutBadgeClass(selectedContact.statut)">
                                        {{ selectedContact.statut }}
                                    </span>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-building me-2"></i>Organisation</h6>
                                        <p class="mb-2"><strong>{{ selectedContact.organisation }}</strong></p>
                                        <p class="mb-0 text-muted small" v-if="selectedContact.adresse">{{
                                            selectedContact.adresse }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-3"><i class="bi bi-telephone me-2"></i>Contact</h6>
                                        <p class="mb-2">
                                            <i class="bi bi-telephone me-2"></i>
                                            <a :href="'tel:' + selectedContact.telephone">{{ selectedContact.telephone
                                            }}</a>
                                        </p>
                                        <p class="mb-0">
                                            <i class="bi bi-envelope me-2"></i>
                                            <a :href="'mailto:' + selectedContact.email">{{ selectedContact.email }}</a>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12" v-if="selectedContact.notes">
                                <div class="card border-info">
                                    <div class="card-header bg-info bg-opacity-10">
                                        <h6 class="mb-0"><i class="bi bi-sticky me-2"></i>Notes</h6>
                                    </div>
                                    <div class="card-body">
                                        <p class="mb-0">{{ selectedContact.notes }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12" v-if="selectedContact.derniereInteraction">
                                <div class="card bg-light border-0">
                                    <div class="card-body">
                                        <h6 class="mb-2"><i class="bi bi-clock-history me-2"></i>Dernière interaction
                                        </h6>
                                        <p class="mb-0 text-muted">{{ formatDate(selectedContact.derniereInteraction) }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="selectedContact = null">Fermer</button>
                        <a :href="'tel:' + selectedContact.telephone" class="btn btn-primary">
                            <i class="bi bi-telephone me-1"></i>Appeler
                        </a>
                        <a :href="'mailto:' + selectedContact.email" class="btn btn-success">
                            <i class="bi bi-envelope me-1"></i>Envoyer Email
                        </a>
                        <button type="button" class="btn btn-warning" @click="editContact(selectedContact)">
                            <i class="bi bi-pencil me-1"></i>Modifier
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Création/Édition -->
        <div v-if="showCreateModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ contactForm.id ? 'Modifier' : 'Nouveau' }} Contact</h5>
                        <button type="button" class="btn-close" @click="closeCreateModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Nom complet *</label>
                                <input type="text" v-model="contactForm.nom" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Poste *</label>
                                <input type="text" v-model="contactForm.poste" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Organisation *</label>
                                <input type="text" v-model="contactForm.organisation" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Catégorie *</label>
                                <select v-model="contactForm.categorie" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="BANQUE">Banque</option>
                                    <option value="ASSURANCE">Assurance</option>
                                    <option value="IMMOBILIER">Immobilier</option>
                                    <option value="JURIDIQUE">Juridique</option>
                                    <option value="ADMINISTRATION">Administration</option>
                                    <option value="AUTRE">Autre</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Téléphone *</label>
                                <input type="tel" v-model="contactForm.telephone" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Email *</label>
                                <input type="email" v-model="contactForm.email" class="form-control" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Adresse</label>
                                <textarea v-model="contactForm.adresse" class="form-control" rows="2"></textarea>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Statut</label>
                                <select v-model="contactForm.statut" class="form-select">
                                    <option value="ACTIF">Actif</option>
                                    <option value="INACTIF">Inactif</option>
                                    <option value="ARCHIVE">Archivé</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <div class="form-check mt-4">
                                    <input class="form-check-input" type="checkbox" v-model="contactForm.favori"
                                        id="favorisCheck">
                                    <label class="form-check-label" for="favorisCheck">
                                        Ajouter aux favoris
                                    </label>
                                </div>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Notes</label>
                                <textarea v-model="contactForm.notes" class="form-control" rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeCreateModal">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="saveContact">
                            <i class="bi bi-check-circle me-1"></i>{{ contactForm.id ? 'Mettre à jour' : 'Créer' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Import -->
        <div v-if="showImportModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Importer des Contacts</h5>
                        <button type="button" class="btn-close" @click="showImportModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle me-2"></i>
                            Importez un fichier CSV avec les colonnes : Nom, Poste, Organisation, Catégorie, Téléphone,
                            Email
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Fichier CSV</label>
                            <input type="file" class="form-control" accept=".csv" @change="handleFileUpload">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            @click="showImportModal = false">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="importContacts">
                            <i class="bi bi-upload me-1"></i>Importer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ContactsGestionnaires',

    data() {
        return {
            loading: true,
            searchQuery: '',
            currentPage: 1,
            perPage: 12,
            viewMode: 'grid', // 'grid' ou 'list'
            selectedContact: null,
            showCreateModal: false,
            showImportModal: false,
            filters: { categorie: '', statut: '', favoris: '' },
            contactForm: {
                id: null,
                nom: '',
                poste: '',
                organisation: '',
                categorie: '',
                telephone: '',
                email: '',
                adresse: '',
                statut: 'ACTIF',
                favori: false,
                notes: ''
            },
            contacts: [],
            stats: { total: 0, actifs: 0, organisations: 0, favoris: 0 },
            categories: []
        };
    },

    computed: {
        filteredContacts() {
            let result = [...this.contacts];

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(c =>
                    c.nom.toLowerCase().includes(query) ||
                    c.organisation.toLowerCase().includes(query) ||
                    c.poste.toLowerCase().includes(query) ||
                    c.email.toLowerCase().includes(query)
                );
            }

            if (this.filters.categorie) result = result.filter(c => c.categorie === this.filters.categorie);
            if (this.filters.statut) result = result.filter(c => c.statut === this.filters.statut);
            if (this.filters.favoris === 'OUI') result = result.filter(c => c.favori);

            return result.sort((a, b) => a.nom.localeCompare(b.nom));
        },

        paginatedContacts() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredContacts.slice(start, start + this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filteredContacts.length / this.perPage);
        }
    },

    async mounted() {
        await this.loadData();
    },

    methods: {
        async loadData() {
            try {
                this.loading = true;
                const categories = ['BANQUE', 'ASSURANCE', 'IMMOBILIER', 'JURIDIQUE', 'ADMINISTRATION', 'AUTRE'];
                const postes = ['Gestionnaire', 'Conseiller', 'Directeur', 'Agent', 'Responsable', 'Chargé de clientèle'];
                const organisations = [
                    'BNP Paribas', 'Crédit Agricole', 'Société Générale', 'AXA Assurances', 'Allianz',
                    'Century 21', 'Orpi', 'Foncia', 'Cabinet Juridique Dupont', 'Mairie de Paris',
                    'Préfecture', 'Chambre des Notaires', 'Conseil Départemental'
                ];

                this.contacts = Array.from({ length: 30 }, (_, i) => ({
                    id: i + 1,
                    nom: `${['Jean', 'Marie', 'Pierre', 'Sophie', 'Luc', 'Emma', 'Thomas', 'Julie'][Math.floor(Math.random() * 8)]} ${['Dupont', 'Martin', 'Bernard', 'Durand', 'Petit', 'Rousseau'][Math.floor(Math.random() * 6)]}`,
                    poste: postes[Math.floor(Math.random() * postes.length)],
                    organisation: organisations[Math.floor(Math.random() * organisations.length)],
                    categorie: categories[Math.floor(Math.random() * categories.length)],
                    telephone: `+33 ${Math.floor(Math.random() * 9) + 1} ${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
                    email: `contact${i + 1}@example.com`,
                    adresse: `${Math.floor(Math.random() * 200) + 1} Rue de la ${['République', 'Liberté', 'Paix', 'Victoire'][Math.floor(Math.random() * 4)]}, 75001 Paris`,
                    statut: ['ACTIF', 'ACTIF', 'ACTIF', 'INACTIF'][Math.floor(Math.random() * 4)],
                    favori: Math.random() > 0.7,
                    notes: Math.random() > 0.6 ? 'Notes importantes concernant ce contact' : '',
                    derniereInteraction: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                }));

                this.calculateStats();
                this.calculateCategories();
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors du chargement', 'error');
            } finally {
                this.loading = false;
            }
        },

        calculateStats() {
            this.stats.total = this.contacts.length;
            this.stats.actifs = this.contacts.filter(c => c.statut === 'ACTIF').length;
            this.stats.organisations = [...new Set(this.contacts.map(c => c.organisation))].length;
            this.stats.favoris = this.contacts.filter(c => c.favori).length;
        },

        calculateCategories() {
            const categoriesConfig = [
                { id: 'BANQUE', label: 'Banques', icon: 'bi-bank', color: 'primary' },
                { id: 'ASSURANCE', label: 'Assurances', icon: 'bi-shield-check', color: 'success' },
                { id: 'IMMOBILIER', label: 'Immobilier', icon: 'bi-house', color: 'info' },
                { id: 'JURIDIQUE', label: 'Juridique', icon: 'bi-balance-scale', color: 'warning' },
                { id: 'ADMINISTRATION', label: 'Administration', icon: 'bi-building', color: 'secondary' },
                { id: 'AUTRE', label: 'Autres', icon: 'bi-three-dots', color: 'dark' }
            ];

            this.categories = categoriesConfig.map(cat => ({
                ...cat,
                count: this.contacts.filter(c => c.categorie === cat.id).length
            }));
        },

        viewContact(contact) {
            this.selectedContact = contact;
        },

        editContact(contact) {
            this.contactForm = {
                id: contact.id,
                nom: contact.nom,
                poste: contact.poste,
                organisation: contact.organisation,
                categorie: contact.categorie,
                telephone: contact.telephone,
                email: contact.email,
                adresse: contact.adresse,
                statut: contact.statut,
                favori: contact.favori,
                notes: contact.notes
            };
            this.showCreateModal = true;
            if (this.selectedContact) {
                this.selectedContact = null;
            }
        },

        toggleFavori(contact) {
            const index = this.contacts.findIndex(c => c.id === contact.id);
            if (index !== -1) {
                this.contacts[index].favori = !this.contacts[index].favori;
                this.calculateStats();
                this.showMessage(
                    this.contacts[index].favori ? 'Contact ajouté aux favoris' : 'Contact retiré des favoris',
                    'success'
                );
            }
        },

        deleteContact(contact) {
            if (confirm(`Êtes-vous sûr de vouloir supprimer ${contact.nom} ?`)) {
                const index = this.contacts.findIndex(c => c.id === contact.id);
                if (index !== -1) {
                    this.contacts.splice(index, 1);
                    this.calculateStats();
                    this.calculateCategories();
                    this.showMessage('Contact supprimé', 'success');
                }
            }
        },

        closeCreateModal() {
            this.showCreateModal = false;
            this.contactForm = {
                id: null,
                nom: '',
                poste: '',
                organisation: '',
                categorie: '',
                telephone: '',
                email: '',
                adresse: '',
                statut: 'ACTIF',
                favori: false,
                notes: ''
            };
        },

        saveContact() {
            if (!this.contactForm.nom || !this.contactForm.poste || !this.contactForm.organisation ||
                !this.contactForm.categorie || !this.contactForm.telephone || !this.contactForm.email) {
                this.showMessage('Veuillez remplir tous les champs obligatoires', 'warning');
                return;
            }

            if (this.contactForm.id) {
                // Modification
                const index = this.contacts.findIndex(c => c.id === this.contactForm.id);
                if (index !== -1) {
                    this.contacts[index] = {
                        ...this.contacts[index],
                        ...this.contactForm
                    };
                    this.showMessage('Contact modifié avec succès', 'success');
                }
            } else {
                // Création
                const newContact = {
                    id: this.contacts.length + 1,
                    ...this.contactForm,
                    derniereInteraction: new Date().toISOString().split('T')[0]
                };
                this.contacts.unshift(newContact);
                this.showMessage('Contact créé avec succès', 'success');
            }

            this.calculateStats();
            this.calculateCategories();
            this.closeCreateModal();
        },

        handleFileUpload(event) {
            this.uploadedFile = event.target.files[0];
        },

        importContacts() {
            if (!this.uploadedFile) {
                this.showMessage('Veuillez sélectionner un fichier', 'warning');
                return;
            }
            // Simulation d'import
            this.showMessage('Import simulé : 5 contacts ajoutés', 'success');
            this.showImportModal = false;
            this.uploadedFile = null;
        },

        async exportContacts() {
            try {
                const csvContent = [
                    ['Nom', 'Poste', 'Organisation', 'Catégorie', 'Téléphone', 'Email', 'Adresse', 'Statut'].join(';'),
                    ...this.filteredContacts.map(c => [
                        c.nom,
                        c.poste,
                        c.organisation,
                        c.categorie,
                        c.telephone,
                        c.email,
                        c.adresse,
                        c.statut
                    ].join(';'))
                ].join('\n');

                const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `contacts-gestionnaires-${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                this.showMessage('Export réalisé avec succès', 'success');
            } catch (error) {
                console.error('Erreur:', error);
                this.showMessage('Erreur lors de l\'export', 'error');
            }
        },

        filterContacts() {
            this.currentPage = 1;
        },

        filterByCategorie(categorieId) {
            this.filters.categorie = this.filters.categorie === categorieId ? '' : categorieId;
            this.filterContacts();
        },

        resetFilters() {
            this.searchQuery = '';
            this.filters = { categorie: '', statut: '', favoris: '' };
            this.currentPage = 1;
        },

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },

        async rafraichir() {
            await this.loadData();
            this.showMessage('Données actualisées', 'success');
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

        getInitiales(nom) {
            if (!nom) return '?';
            const parts = nom.split(' ');
            if (parts.length >= 2) {
                return parts[0][0] + parts[1][0];
            }
            return nom.substring(0, 2).toUpperCase();
        },

        getCategorieColor(categorie) {
            const colors = {
                'BANQUE': 'primary',
                'ASSURANCE': 'success',
                'IMMOBILIER': 'info',
                'JURIDIQUE': 'warning',
                'ADMINISTRATION': 'secondary',
                'AUTRE': 'dark'
            };
            return colors[categorie] || 'secondary';
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'ACTIF': 'bg-success',
                'INACTIF': 'bg-warning',
                'ARCHIVE': 'bg-secondary'
            };
            return classes[statut] || 'bg-secondary';
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

.avatar-sm {
    font-size: 12px;
    font-weight: 600;
}

.avatar-lg {
    width: 60px;
    height: 60px;
}

.avatar-xl {
    font-size: 2rem;
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
    transition: all 0.3s ease;
}

.contact-card {
    transition: all 0.3s ease;
}

.contact-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.contact-card.border-warning {
    border-width: 2px;
}

.btn {
    border-radius: 6px;
}

.form-control,
.form-select {
    border-radius: 6px;
}

/* Liens */
a {
    text-decoration: none;
    color: inherit;
}

a:hover {
    color: #0d6efd;
}

/* Dropdown */
.dropdown-menu {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dropdown-item {
    border-radius: 4px;
    margin: 2px 4px;
}

.dropdown-item:hover {
    background-color: #f8f9fa;
}

/* Responsive */
@media (max-width: 768px) {
    .btn-group {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .btn-group .btn {
        border-radius: 6px !important;
    }
}

/* Animation */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.card {
    animation: fadeIn 0.3s ease-out;
}

.alert {
    border-radius: 8px;
}

/* Toggle buttons */
.btn-group .btn {
    transition: all 0.2s ease;
}

/* Avatar gradients */
.avatar-sm,
.avatar-lg,
.avatar-xl {
    background: linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(13, 110, 253, 0.05) 100%);
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