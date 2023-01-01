<template>
    <main>
        <section class="pt-0">
            <div class="container vstack gap-4">
                <!-- En-tête -->
                <div class="row">
                    <div class="col-12">
                        <h1 class="fs-4 mb-0">
                            <i class="bi bi-people fa-fw me-1"></i>Gestion des Locataires
                        </h1>
                    </div>
                </div>

                <!-- Statistiques -->
                <div class="row g-4">
                    <div class="col-md-6 col-xl-3">
                        <div class="card card-body border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="mb-0">Total Locataires</h6>
                                <i class="bi bi-people text-primary fs-4"></i>
                            </div>
                            <h2 class="text-primary mb-2">{{ stats.total }}</h2>
                            <p class="mb-0">
                                <small class="text-muted">{{ stats.actifs }} locataires actifs</small>
                            </p>
                        </div>
                    </div>

                    <div class="col-md-6 col-xl-3">
                        <div class="card card-body border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="mb-0">Baux Actifs</h6>
                                <i class="bi bi-file-text text-success fs-4"></i>
                            </div>
                            <h2 class="text-success mb-2">{{ stats.bauxActifs }}</h2>
                            <p class="mb-0">
                                <small class="text-muted">En cours</small>
                            </p>
                        </div>
                    </div>

                    <div class="col-md-6 col-xl-3">
                        <div class="card card-body border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="mb-0">Paiements en Retard</h6>
                                <i class="bi bi-exclamation-triangle text-warning fs-4"></i>
                            </div>
                            <h2 class="text-warning mb-2">{{ stats.retards }}</h2>
                            <p class="mb-0">
                                <small class="text-muted">À relancer</small>
                            </p>
                        </div>
                    </div>

                    <div class="col-md-6 col-xl-3">
                        <div class="card card-body border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="mb-0">Documents Manquants</h6>
                                <i class="bi bi-file-earmark-x text-danger fs-4"></i>
                            </div>
                            <h2 class="text-danger mb-2">{{ stats.documentsManquants }}</h2>
                            <p class="mb-0">
                                <small class="text-muted">À compléter</small>
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Filtres et actions -->
                <div class="row">
                    <div class="col-12">
                        <div class="card border">
                            <div class="card-body">
                                <div class="row g-3 align-items-center">
                                    <div class="col-md-4">
                                        <div class="input-group">
                                            <span class="input-group-text bg-white">
                                                <i class="bi bi-search"></i>
                                            </span>
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="Rechercher un locataire..."
                                                v-model="searchTerm"
                                                @input="searchLocataires"
                                            />
                                        </div>
                                    </div>

                                    <div class="col-md-3">
                                        <select class="form-select" v-model="filterStatus" @change="applyFilters">
                                            <option value="">Tous les statuts</option>
                                            <option value="actif">Actifs</option>
                                            <option value="inactif">Inactifs</option>
                                            <option value="retard">En retard de paiement</option>
                                        </select>
                                    </div>

                                    <div class="col-md-2">
                                        <select class="form-select" v-model="sortKey" @change="sortLocataires">
                                            <option value="">Trier par...</option>
                                            <option value="nom">Nom</option>
                                            <option value="email">Email</option>
                                            <option value="dateEntree">Date d'entrée</option>
                                        </select>
                                    </div>

                                    <div class="col-md-3 text-end">
                                        <button class="btn btn-primary" @click="openCreateModal">
                                            <i class="bi bi-plus-lg me-1"></i>
                                            Nouveau Locataire
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Onglets -->
                <div class="row">
                    <div class="col-12">
                        <ul class="nav nav-tabs">
                            <li class="nav-item">
                                <a
                                    class="nav-link"
                                    :class="{ active: activeTab === 'tous' }"
                                    href="#"
                                    @click.prevent="changeTab('tous')"
                                >
                                    Tous ({{ locataires.length }})
                                </a>
                            </li>
                            <li class="nav-item">
                                <a
                                    class="nav-link"
                                    :class="{ active: activeTab === 'actifs' }"
                                    href="#"
                                    @click.prevent="changeTab('actifs')"
                                >
                                    Actifs ({{ stats.actifs }})
                                </a>
                            </li>
                            <li class="nav-item">
                                <a
                                    class="nav-link"
                                    :class="{ active: activeTab === 'retards' }"
                                    href="#"
                                    @click.prevent="changeTab('retards')"
                                >
                                    En retard ({{ stats.retards }})
                                </a>
                            </li>
                            <li class="nav-item">
                                <a
                                    class="nav-link"
                                    :class="{ active: activeTab === 'inactifs' }"
                                    href="#"
                                    @click.prevent="changeTab('inactifs')"
                                >
                                    Inactifs
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Liste des locataires -->
                <div class="row">
                    <div class="col-12">
                        <div class="card border">
                            <div class="card-header border-bottom">
                                <h5 class="card-header-title">
                                    Liste des locataires
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ filteredLocataires.length }} locataires
                                    </span>
                                </h5>
                            </div>
                            <div class="card-body">
                                <div v-if="loading" class="text-center py-5">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Chargement...</span>
                                    </div>
                                </div>

                                <div v-else-if="filteredLocataires.length === 0" class="text-center py-5">
                                    <i class="bi bi-people text-muted" style="font-size: 3rem;"></i>
                                    <p class="text-muted mt-3">Aucun locataire trouvé</p>
                                </div>

                                <div v-else>
                                    <!-- Vue en cartes pour mobile/tablette -->
                                    <div class="d-lg-none vstack gap-3">
                                        <div
                                            v-for="locataire in filteredLocataires"
                                            :key="locataire.id"
                                            class="card border p-3"
                                        >
                                            <div class="d-flex justify-content-between align-items-start mb-2">
                                                <div class="d-flex align-items-center">
                                                    <div
                                                        class="avatar avatar-lg rounded-circle bg-primary bg-opacity-10 text-primary me-2"
                                                    >
                                                        <i class="bi bi-person fs-4"></i>
                                                    </div>
                                                    <div>
                                                        <h6 class="mb-0">{{ locataire.nom }} {{ locataire.prenom }}</h6>
                                                        <small class="text-muted">{{ locataire.email }}</small>
                                                    </div>
                                                </div>
                                                <span class="badge" :class="getStatusClass(locataire.status)">
                                                    {{ getStatusLabel(locataire.status) }}
                                                </span>
                                            </div>
                                            <div class="mb-2">
                                                <small class="text-muted d-block">
                                                    <i class="bi bi-telephone me-1"></i>{{ locataire.telephone }}
                                                </small>
                                                <small class="text-muted d-block" v-if="locataire.bienActuel">
                                                    <i class="bi bi-house me-1"></i>{{ locataire.bienActuel }}
                                                </small>
                                            </div>
                                            <div class="d-flex gap-1 mt-2">
                                                <button
                                                    class="btn btn-sm btn-light flex-fill"
                                                    @click="viewLocataire(locataire)"
                                                >
                                                    <i class="bi bi-eye"></i>
                                                </button>
                                                <button
                                                    class="btn btn-sm btn-primary flex-fill"
                                                    @click="editLocataire(locataire)"
                                                >
                                                    <i class="bi bi-pencil-square"></i>
                                                </button>
                                                <button
                                                    class="btn btn-sm btn-danger flex-fill"
                                                    @click="deleteLocataire(locataire.id)"
                                                >
                                                    <i class="bi bi-trash3"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Vue en table pour desktop -->
                                    <div class="d-none d-lg-block table-responsive">
                                        <table class="table table-hover align-middle">
                                            <thead class="table-light">
                                                <tr>
                                                    <th>Locataire</th>
                                                    <th>Contact</th>
                                                    <th>Bien occupé</th>
                                                    <th>Date d'entrée</th>
                                                    <th>Loyer</th>
                                                    <th>Statut</th>
                                                    <th>Documents</th>
                                                    <th class="text-end">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="locataire in filteredLocataires" :key="locataire.id">
                                                    <td>
                                                        <div class="d-flex align-items-center">
                                                            <div
                                                                class="avatar avatar-sm rounded-circle bg-primary bg-opacity-10 text-primary me-2"
                                                            >
                                                                <i class="bi bi-person"></i>
                                                            </div>
                                                            <div>
                                                                <strong>{{ locataire.nom }} {{ locataire.prenom }}</strong
                                                                ><br />
                                                                <small class="text-muted">{{ locataire.email }}</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <small>
                                                            <i class="bi bi-telephone me-1"></i
                                                            >{{ locataire.telephone }}<br />
                                                            <span v-if="locataire.telephoneSecondaire">
                                                                <i class="bi bi-phone me-1"></i
                                                                >{{ locataire.telephoneSecondaire }}
                                                            </span>
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <div v-if="locataire.bienActuel">
                                                            <i class="bi bi-house me-1 text-muted"></i>
                                                            <small>{{ locataire.bienActuel }}</small>
                                                        </div>
                                                        <small v-else class="text-muted">Aucun bien</small>
                                                    </td>
                                                    <td>
                                                        <small>{{ formatDate(locataire.dateEntree) }}</small>
                                                    </td>
                                                    <td>
                                                        <strong v-if="locataire.loyerMensuel">{{
                                                            formatCurrency(locataire.loyerMensuel)
                                                        }}</strong>
                                                        <span v-else class="text-muted">—</span>
                                                    </td>
                                                    <td>
                                                        <span class="badge" :class="getStatusClass(locataire.status)">
                                                            {{ getStatusLabel(locataire.status) }}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div class="d-flex align-items-center gap-1">
                                                            <span
                                                                class="badge bg-success bg-opacity-10 text-success"
                                                                v-if="locataire.documentsComplets"
                                                            >
                                                                <i class="bi bi-check-circle-fill"></i>
                                                            </span>
                                                            <span
                                                                class="badge bg-warning bg-opacity-10 text-warning"
                                                                v-else
                                                            >
                                                                <i class="bi bi-exclamation-triangle-fill"></i>
                                                            </span>
                                                            <small>{{ locataire.nombreDocuments || 0 }}/5</small>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="d-flex justify-content-end gap-1">
                                                            <button
                                                                class="btn btn-sm btn-light"
                                                                @click="viewLocataire(locataire)"
                                                                title="Voir détails"
                                                            >
                                                                <i class="bi bi-eye"></i>
                                                            </button>
                                                            <button
                                                                class="btn btn-sm btn-light"
                                                                @click="viewDocuments(locataire)"
                                                                title="Documents"
                                                            >
                                                                <i class="bi bi-folder"></i>
                                                            </button>
                                                            <button
                                                                class="btn btn-sm btn-primary"
                                                                @click="editLocataire(locataire)"
                                                                title="Modifier"
                                                            >
                                                                <i class="bi bi-pencil-square"></i>
                                                            </button>
                                                            <button
                                                                class="btn btn-sm btn-danger"
                                                                @click="deleteLocataire(locataire.id)"
                                                                title="Supprimer"
                                                            >
                                                                <i class="bi bi-trash3"></i>
                                                            </button>
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
            </div>
        </section>

        <!-- Modal Création/Edition -->
        <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ modalType === 'create' ? 'Nouveau Locataire' : 'Modifier le Locataire' }}
                        </h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <!-- Informations personnelles -->
                            <div class="col-12">
                                <h6 class="border-bottom pb-2">Informations Personnelles</h6>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Nom *</label>
                                <input type="text" class="form-control" v-model="locataireForm.nom" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Prénom *</label>
                                <input type="text" class="form-control" v-model="locataireForm.prenom" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Email *</label>
                                <input type="email" class="form-control" v-model="locataireForm.email" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Téléphone *</label>
                                <input type="tel" class="form-control" v-model="locataireForm.telephone" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Téléphone secondaire</label>
                                <input
                                    type="tel"
                                    class="form-control"
                                    v-model="locataireForm.telephoneSecondaire"
                                />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date de naissance</label>
                                <input type="date" class="form-control" v-model="locataireForm.dateNaissance" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Lieu de naissance</label>
                                <input type="text" class="form-control" v-model="locataireForm.lieuNaissance" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Nationalité</label>
                                <input type="text" class="form-control" v-model="locataireForm.nationalite" />
                            </div>

                            <!-- Pièces d'identité -->
                            <div class="col-12 mt-3">
                                <h6 class="border-bottom pb-2">Pièces d'Identité</h6>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Type de pièce</label>
                                <select class="form-select" v-model="locataireForm.typePiece">
                                    <option value="">Sélectionner</option>
                                    <option value="CNI">Carte Nationale d'Identité</option>
                                    <option value="Passeport">Passeport</option>
                                    <option value="Permis">Permis de conduire</option>
                                    <option value="Attestation">Attestation d'identité</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Numéro de pièce</label>
                                <input type="text" class="form-control" v-model="locataireForm.numeroPiece" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date de délivrance</label>
                                <input type="date" class="form-control" v-model="locataireForm.dateDelivrance" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date d'expiration</label>
                                <input type="date" class="form-control" v-model="locataireForm.dateExpiration" />
                            </div>

                            <!-- Informations professionnelles -->
                            <div class="col-12 mt-3">
                                <h6 class="border-bottom pb-2">Informations Professionnelles</h6>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Profession</label>
                                <input type="text" class="form-control" v-model="locataireForm.profession" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Employeur</label>
                                <input type="text" class="form-control" v-model="locataireForm.employeur" />
                            </div>
                            <div class="col-md-12">
                                <label class="form-label">Adresse professionnelle</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="locataireForm.adresseProfessionnelle"
                                />
                            </div>

                            <!-- Contact d'urgence -->
                            <div class="col-12 mt-3">
                                <h6 class="border-bottom pb-2">Contact d'Urgence</h6>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Nom du contact</label>
                                <input type="text" class="form-control" v-model="locataireForm.contactUrgenceNom" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Téléphone du contact</label>
                                <input type="tel" class="form-control" v-model="locataireForm.contactUrgenceTel" />
                            </div>
                            <div class="col-md-12">
                                <label class="form-label">Lien avec le locataire</label>
                                <input type="text" class="form-control" v-model="locataireForm.contactUrgenceLien" />
                            </div>

                            <!-- Notes -->
                            <div class="col-12 mt-3">
                                <label class="form-label">Notes / Observations</label>
                                <textarea class="form-control" rows="3" v-model="locataireForm.notes"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="closeModal">Annuler</button>
                        <button class="btn btn-primary" @click="saveLocataire">Enregistrer</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Détails -->
        <div v-if="showDetailModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Profil du Locataire</h5>
                        <button type="button" class="btn-close" @click="showDetailModal = false"></button>
                    </div>
                    <div class="modal-body" v-if="selectedLocataire">
                        <div class="row">
                            <!-- Colonne gauche - Informations principales -->
                            <div class="col-lg-4">
                                <div class="card border mb-3">
                                    <div class="card-body text-center">
                                        <div
                                            class="avatar avatar-xxl rounded-circle bg-primary bg-opacity-10 text-primary mx-auto mb-3"
                                        >
                                            <i class="bi bi-person" style="font-size: 3rem;"></i>
                                        </div>
                                        <h5 class="mb-1">
                                            {{ selectedLocataire.nom }} {{ selectedLocataire.prenom }}
                                        </h5>
                                        <p class="text-muted mb-2">{{ selectedLocataire.email }}</p>
                                        <span class="badge" :class="getStatusClass(selectedLocataire.status)">
                                            {{ getStatusLabel(selectedLocataire.status) }}
                                        </span>
                                    </div>
                                </div>

                                <div class="card border">
                                    <div class="card-header">
                                        <h6 class="mb-0">Contact</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="mb-2">
                                            <small class="text-muted d-block">Téléphone principal</small>
                                            <strong>{{ selectedLocataire.telephone }}</strong>
                                        </div>
                                        <div class="mb-2" v-if="selectedLocataire.telephoneSecondaire">
                                            <small class="text-muted d-block">Téléphone secondaire</small>
                                            <strong>{{ selectedLocataire.telephoneSecondaire }}</strong>
                                        </div>
                                        <div class="mb-2">
                                            <small class="text-muted d-block">Email</small>
                                            <strong>{{ selectedLocataire.email }}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Colonne droite - Détails -->
                            <div class="col-lg-8">
                                <!-- Informations générales -->
                                <div class="card border mb-3">
                                    <div class="card-header">
                                        <h6 class="mb-0">Informations Générales</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row g-3">
                                            <div class="col-md-6">
                                                <small class="text-muted d-block">Date de naissance</small>
                                                <strong>{{ formatDate(selectedLocataire.dateNaissance) }}</strong>
                                            </div>
                                            <div class="col-md-6">
                                                <small class="text-muted d-block">Lieu de naissance</small>
                                                <strong>{{
                                                    selectedLocataire.lieuNaissance || 'Non renseigné'
                                                }}</strong>
                                            </div>
                                            <div class="col-md-6">
                                                <small class="text-muted d-block">Nationalité</small>
                                                <strong>{{ selectedLocataire.nationalite || 'Non renseignée' }}</strong>
                                            </div>
                                            <div class="col-md-6">
                                                <small class="text-muted d-block">Date d'entrée</small>
                                                <strong>{{ formatDate(selectedLocataire.dateEntree) }}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Pièces d'identité -->
                                <div class="card border mb-3">
                                    <div class="card-header">
                                        <h6 class="mb-0">Pièces d'Identité</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row g-3">
                                            <div class="col-md-6">
                                                <small class="text-muted d-block">Type de pièce</small>
                                                <strong>{{ selectedLocataire.typePiece || 'Non renseigné' }}</strong>
                                            </div>
                                            <div class="col-md-6">
                                                <small class="text-muted d-block">Numéro</small>
                                                <strong>{{ selectedLocataire.numeroPiece || 'Non renseigné' }}</strong>
                                            </div>
                                            <div class="col-md-6">
                                                <small class="text-muted d-block">Date de délivrance</small>
                                                <strong>{{
                                                    formatDate(selectedLocataire.dateDelivrance) || 'Non renseignée'
                                                }}</strong>
                                            </div>
                                            <div class="col-md-6">
                                                <small class="text-muted d-block">Date d'expiration</small>
                                                <strong>{{
                                                    formatDate(selectedLocataire.dateExpiration) || 'Non renseignée'
                                                }}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Informations professionnelles -->
                                <div class="card border mb-3">
                                    <div class="card-header">
                                        <h6 class="mb-0">Informations Professionnelles</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row g-3">
                                            <div class="col-md-6">
                                                <small class="text-muted d-block">Profession</small>
                                                <strong>{{ selectedLocataire.profession || 'Non renseignée' }}</strong>
                                            </div>
                                            <div class="col-md-6">
                                                <small class="text-muted d-block">Employeur</small>
                                                <strong>{{ selectedLocataire.employeur || 'Non renseigné' }}</strong>
                                            </div>
                                            <div class="col-12">
                                                <small class="text-muted d-block">Adresse professionnelle</small>
                                                <strong>{{
                                                    selectedLocataire.adresseProfessionnelle || 'Non renseignée'
                                                }}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Bien occupé -->
                                <div class="card border mb-3" v-if="selectedLocataire.bienActuel">
                                    <div class="card-header">
                                        <h6 class="mb-0">Bien Occupé</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row g-3">
                                            <div class="col-12">
                                                <small class="text-muted d-block">Bien immobilier</small>
                                                <strong>{{ selectedLocataire.bienActuel }}</strong>
                                            </div>
                                            <div class="col-md-6">
                                                <small class="text-muted d-block">Loyer mensuel</small>
                                                <strong class="text-success">{{
                                                    formatCurrency(selectedLocataire.loyerMensuel)
                                                }}</strong>
                                            </div>
                                            <div class="col-md-6">
                                                <small class="text-muted d-block">Prochain paiement</small>
                                                <strong>{{
                                                    formatDate(selectedLocataire.prochainPaiement) || 'Non défini'
                                                }}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Contact d'urgence -->
                                <div class="card border mb-3">
                                    <div class="card-header">
                                        <h6 class="mb-0">Contact d'Urgence</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row g-3">
                                            <div class="col-md-6">
                                                <small class="text-muted d-block">Nom</small>
                                                <strong>{{
                                                    selectedLocataire.contactUrgenceNom || 'Non renseigné'
                                                }}</strong>
                                            </div>
                                            <div class="col-md-6">
                                                <small class="text-muted d-block">Téléphone</small>
                                                <strong>{{
                                                    selectedLocataire.contactUrgenceTel || 'Non renseigné'
                                                }}</strong>
                                            </div>
                                            <div class="col-12">
                                                <small class="text-muted d-block">Lien avec le locataire</small>
                                                <strong>{{
                                                    selectedLocataire.contactUrgenceLien || 'Non renseigné'
                                                }}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Notes -->
                                <div class="card border" v-if="selectedLocataire.notes">
                                    <div class="card-header">
                                        <h6 class="mb-0">Notes / Observations</h6>
                                    </div>
                                    <div class="card-body">
                                        <p class="mb-0">{{ selectedLocataire.notes }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="showDetailModal = false">Fermer</button>
                        <button class="btn btn-primary" @click="editLocataire(selectedLocataire)">
                            <i class="bi bi-pencil-square me-1"></i>
                            Modifier
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Documents -->
        <div v-if="showDocumentModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Documents du Locataire</h5>
                        <button type="button" class="btn-close" @click="showDocumentModal = false"></button>
                    </div>
                    <div class="modal-body" v-if="selectedLocataire">
                        <div class="alert alert-info d-flex align-items-center mb-3">
                            <i class="bi bi-info-circle me-2"></i>
                            <div>
                                <strong>{{ selectedLocataire.nom }} {{ selectedLocataire.prenom }}</strong>
                                <br />
                                <small>Documents requis : 5 | Documents fournis : {{ selectedLocataire.nombreDocuments || 0 }}</small>
                            </div>
                        </div>

                        <div class="list-group">
                            <div
                                class="list-group-item d-flex justify-content-between align-items-center"
                                v-for="doc in documentsRequis"
                                :key="doc.type"
                            >
                                <div>
                                    <i class="bi me-2" :class="doc.icon"></i>
                                    <strong>{{ doc.nom }}</strong>
                                    <br />
                                    <small class="text-muted">{{ doc.description }}</small>
                                </div>
                                <div class="d-flex gap-2">
                                    <span
                                        class="badge"
                                        :class="
                                            doc.fourni
                                                ? 'bg-success bg-opacity-10 text-success'
                                                : 'bg-warning bg-opacity-10 text-warning'
                                        "
                                    >
                                        <i
                                            class="bi"
                                            :class="doc.fourni ? 'bi-check-circle-fill' : 'bi-clock-fill'"
                                        ></i>
                                        {{ doc.fourni ? 'Fourni' : 'En attente' }}
                                    </span>
                                    <button class="btn btn-sm btn-primary" v-if="!doc.fourni">
                                        <i class="bi bi-upload"></i>
                                    </button>
                                    <button class="btn btn-sm btn-light" v-else>
                                        <i class="bi bi-download"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="mt-3">
                            <button class="btn btn-outline-primary btn-sm">
                                <i class="bi bi-plus-lg me-1"></i>
                                Ajouter un document
                            </button>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="showDocumentModal = false">Fermer</button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
    name: 'GestionLocataires',
    setup() {
        const store = useStore();
        const loading = ref(false);
        const activeTab = ref('tous');
        const showModal = ref(false);
        const showDetailModal = ref(false);
        const showDocumentModal = ref(false);
        const modalType = ref('create');
        const selectedLocataire = ref(null);
        const searchTerm = ref('');
        const filterStatus = ref('');
        const sortKey = ref('');

        const locataires = ref([]);

        const locataireForm = ref({
            id: null,
            nom: '',
            prenom: '',
            email: '',
            telephone: '',
            telephoneSecondaire: '',
            dateNaissance: '',
            lieuNaissance: '',
            nationalite: '',
            typePiece: '',
            numeroPiece: '',
            dateDelivrance: '',
            dateExpiration: '',
            profession: '',
            employeur: '',
            adresseProfessionnelle: '',
            contactUrgenceNom: '',
            contactUrgenceTel: '',
            contactUrgenceLien: '',
            notes: '',
        });

        const documentsRequis = ref([
            {
                type: 'identite',
                nom: "Pièce d'identité",
                description: 'CNI, Passeport ou Permis de conduire',
                icon: 'bi-card-heading',
                fourni: false,
            },
            {
                type: 'justificatif_domicile',
                nom: 'Justificatif de domicile',
                description: 'Facture récente de moins de 3 mois',
                icon: 'bi-house-door',
                fourni: false,
            },
            {
                type: 'bulletin_salaire',
                nom: 'Bulletins de salaire',
                description: '3 derniers bulletins de salaire',
                icon: 'bi-file-earmark-text',
                fourni: true,
            },
            {
                type: 'contrat_travail',
                nom: 'Contrat de travail',
                description: 'Copie du contrat de travail',
                icon: 'bi-briefcase',
                fourni: true,
            },
            {
                type: 'rib',
                nom: 'RIB',
                description: 'Relevé d\'identité bancaire',
                icon: 'bi-bank',
                fourni: false,
            },
        ]);

        // Computed
        const stats = computed(() => ({
            total: locataires.value.length,
            actifs: locataires.value.filter((l) => l.status === 'actif').length,
            bauxActifs: locataires.value.filter((l) => l.bienActuel).length,
            retards: locataires.value.filter((l) => l.status === 'retard').length,
            documentsManquants: locataires.value.filter((l) => !l.documentsComplets).length,
        }));

        const filteredLocataires = computed(() => {
            return locataires.value.filter((locataire) => {
                const matchSearch =
                    locataire.nom?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                    locataire.prenom?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                    locataire.email?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                    locataire.telephone?.includes(searchTerm.value);

                const matchStatus = !filterStatus.value || locataire.status === filterStatus.value;

                const matchTab =
                    activeTab.value === 'tous' ||
                    (activeTab.value === 'actifs' && locataire.status === 'actif') ||
                    (activeTab.value === 'retards' && locataire.status === 'retard') ||
                    (activeTab.value === 'inactifs' && locataire.status === 'inactif');

                return matchSearch && matchStatus && matchTab;
            });
        });

        // Methods
        const formatCurrency = (amount) => {
            if (amount == null || amount === '') return '—';
            const numValue = Number(amount);
            if (isNaN(numValue)) return '—';

            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0,
            }).format(numValue);
        };

        const formatDate = (dateString) => {
            if (!dateString) return '—';
            return new Date(dateString).toLocaleDateString('fr-FR');
        };

        const getStatusClass = (status) => {
            const classes = {
                actif: 'bg-success bg-opacity-10 text-success',
                inactif: 'bg-secondary bg-opacity-10 text-secondary',
                retard: 'bg-danger bg-opacity-10 text-danger',
            };
            return classes[status] || 'bg-secondary bg-opacity-10 text-secondary';
        };

        const getStatusLabel = (status) => {
            const labels = {
                actif: 'Actif',
                inactif: 'Inactif',
                retard: 'En retard',
            };
            return labels[status] || 'Inconnu';
        };

        const loadLocataires = async () => {
            loading.value = true;
            try {
                const response = await store.dispatch('locataires/getAll');
                locataires.value = response || [];
            } catch (error) {
                console.error('Erreur lors du chargement des locataires:', error);
                ElMessage.error('Erreur lors du chargement des locataires');
                locataires.value = [];
            } finally {
                loading.value = false;
            }
        };

        const searchLocataires = async () => {
            if (searchTerm.value.length > 2) {
                loading.value = true;
                try {
                    const response = await store.dispatch('locataires/search', {
                        texte: searchTerm.value,
                    });
                    locataires.value = response || [];
                } catch (error) {
                    console.error('Erreur lors de la recherche:', error);
                    ElMessage.error('Erreur lors de la recherche');
                } finally {
                    loading.value = false;
                }
            } else if (searchTerm.value.length === 0) {
                await loadLocataires();
            }
        };

        const applyFilters = () => {
            // Les filtres sont appliqués automatiquement via le computed filteredLocataires
        };

        const sortLocataires = () => {
            if (!sortKey.value) return;

            locataires.value.sort((a, b) => {
                let valA = a[sortKey.value];
                let valB = b[sortKey.value];

                if (sortKey.value === 'dateEntree') {
                    valA = new Date(valA).getTime();
                    valB = new Date(valB).getTime();
                }

                if (typeof valA === 'string') {
                    return valA.localeCompare(valB);
                }

                return valA - valB;
            });
        };

        const changeTab = (tab) => {
            activeTab.value = tab;
        };

        const openCreateModal = () => {
            modalType.value = 'create';
            locataireForm.value = {
                id: null,
                nom: '',
                prenom: '',
                email: '',
                telephone: '',
                telephoneSecondaire: '',
                dateNaissance: '',
                lieuNaissance: '',
                nationalite: '',
                typePiece: '',
                numeroPiece: '',
                dateDelivrance: '',
                dateExpiration: '',
                profession: '',
                employeur: '',
                adresseProfessionnelle: '',
                contactUrgenceNom: '',
                contactUrgenceTel: '',
                contactUrgenceLien: '',
                notes: '',
            };
            showModal.value = true;
        };

        const editLocataire = (locataire) => {
            modalType.value = 'edit';
            locataireForm.value = { ...locataire };
            showModal.value = true;
            showDetailModal.value = false;
        };

        const viewLocataire = (locataire) => {
            selectedLocataire.value = locataire;
            showDetailModal.value = true;
        };

        const viewDocuments = (locataire) => {
            selectedLocataire.value = locataire;
            showDocumentModal.value = true;
        };

        const closeModal = () => {
            showModal.value = false;
            locataireForm.value = {
                id: null,
                nom: '',
                prenom: '',
                email: '',
                telephone: '',
                telephoneSecondaire: '',
                dateNaissance: '',
                lieuNaissance: '',
                nationalite: '',
                typePiece: '',
                numeroPiece: '',
                dateDelivrance: '',
                dateExpiration: '',
                profession: '',
                employeur: '',
                adresseProfessionnelle: '',
                contactUrgenceNom: '',
                contactUrgenceTel: '',
                contactUrgenceLien: '',
                notes: '',
            };
        };

        const saveLocataire = async () => {
            try {
                if (modalType.value === 'create') {
                    await store.dispatch('locataires/create', locataireForm.value);
                    ElMessage.success('Locataire créé avec succès !');
                } else {
                    await store.dispatch('locataires/update', locataireForm.value);
                    ElMessage.success('Locataire mis à jour avec succès !');
                }
                closeModal();
                await loadLocataires();
            } catch (error) {
                console.error('Erreur lors de la sauvegarde:', error);
                ElMessage.error('Erreur lors de la sauvegarde du locataire');
            }
        };

        const deleteLocataire = async (id) => {
            try {
                await ElMessageBox.confirm(
                    'Voulez-vous vraiment supprimer ce locataire ?',
                    'Confirmation',
                    {
                        confirmButtonText: 'Oui',
                        cancelButtonText: 'Annuler',
                        type: 'warning',
                    }
                );
                await store.dispatch('locataires/delete', id);
                ElMessage.success('Locataire supprimé avec succès !');
                await loadLocataires();
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur lors de la suppression:', error);
                    ElMessage.error('Erreur lors de la suppression du locataire');
                }
            }
        };

        // Lifecycle
        onMounted(async () => {
            await loadLocataires();
        });

        return {
            loading,
            activeTab,
            showModal,
            showDetailModal,
            showDocumentModal,
            modalType,
            selectedLocataire,
            searchTerm,
            filterStatus,
            sortKey,
            locataires,
            locataireForm,
            documentsRequis,
            stats,
            filteredLocataires,
            formatCurrency,
            formatDate,
            getStatusClass,
            getStatusLabel,
            searchLocataires,
            applyFilters,
            sortLocataires,
            changeTab,
            openCreateModal,
            editLocataire,
            viewLocataire,
            viewDocuments,
            closeModal,
            saveLocataire,
            deleteLocataire,
        };
    },
};
</script>

<style scoped>
.avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.avatar-sm {
    width: 2.5rem;
    height: 2.5rem;
}

.avatar-lg {
    width: 4rem;
    height: 4rem;
}

.avatar-xxl {
    width: 8rem;
    height: 8rem;
}

.table th,
.table td {
    vertical-align: middle;
}

.badge {
    padding: 0.35em 0.65em;
}

.modal.show {
    display: block;
}

.btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
}

.card-body {
    padding: 1.5rem;
}

.nav-tabs .nav-link {
    color: #6c757d;
}

.nav-tabs .nav-link.active {
    color: #0d6efd;
    font-weight: 500;
}

.input-group-text {
    border-right: 0;
}

.input-group .form-control {
    border-left: 0;
}

.input-group .form-control:focus {
    box-shadow: none;
    border-color: #dee2e6;
}

.spinner-border {
    width: 3rem;
    height: 3rem;
}

.list-group-item {
    border: 1px solid #dee2e6;
    margin-bottom: 0.5rem;
    border-radius: 0.375rem;
}
</style>