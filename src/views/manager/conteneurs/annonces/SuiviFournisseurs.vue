<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">
            <!-- En-tête -->
            <div class="row">
                <div class="col-sm-12 mb-5">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <h1 class="h3 mb-2 mb-sm-0">Suivi des Fournisseurs</h1>
                        <div class="d-flex gap-2">
                            <button @click="nouveauFournisseur" class="btn btn-primary mb-0">
                                <i class="bi bi-plus-lg fa-fw"></i> Nouveau Fournisseur
                            </button>
                            <button @click="exporterFournisseurs" class="btn btn-success mb-0">
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
                                <span>Total Fournisseurs</span>
                                <h3 class="mb-0 mt-2">{{ stats.total }}</h3>
                            </div>
                            <div
                                class="icon-lg rounded-circle flex-shrink-0 bg-primary bg-opacity-10 text-primary mb-0">
                                <i class="bi bi-building fa-fw"></i>
                            </div>
                        </div>
                        <span>Tous les fournisseurs</span>
                    </div>
                </div>

                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>Fournisseurs Actifs</span>
                                <h3 class="mb-0 mt-2 text-success">{{ stats.actifs }}</h3>
                            </div>
                            <div
                                class="icon-lg rounded-circle flex-shrink-0 bg-success bg-opacity-10 text-success mb-0">
                                <i class="bi bi-check-circle fa-fw"></i>
                            </div>
                        </div>
                        <span>Actuellement disponibles</span>
                    </div>
                </div>

                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>Note Moyenne</span>
                                <h3 class="mb-0 mt-2 text-warning">{{ stats.noteMoyenne }}</h3>
                            </div>
                            <div
                                class="icon-lg rounded-circle flex-shrink-0 bg-warning bg-opacity-10 text-warning mb-0">
                                <i class="bi bi-star fa-fw"></i>
                            </div>
                        </div>
                        <span>Satisfaction globale</span>
                    </div>
                </div>

                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>Interventions Mois</span>
                                <h3 class="mb-0 mt-2 text-info">{{ stats.interventionsMois }}</h3>
                            </div>
                            <div class="icon-lg rounded-circle flex-shrink-0 bg-info bg-opacity-10 text-info mb-0">
                                <i class="bi bi-tools fa-fw"></i>
                            </div>
                        </div>
                        <span>Ce mois-ci</span>
                    </div>
                </div>
            </div>

            <!-- Filtres -->
            <div class="card shadow mb-4">
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label">Type de service</label>
                            <select v-model="filters.type" @change="applyFilters" class="form-select">
                                <option value="">Tous</option>
                                <option value="PLOMBERIE">Plomberie</option>
                                <option value="ELECTRICITE">Électricité</option>
                                <option value="MENUISERIE">Menuiserie</option>
                                <option value="PEINTURE">Peinture</option>
                                <option value="CLIMATISATION">Climatisation</option>
                                <option value="MACONNERIE">Maçonnerie</option>
                                <option value="JARDINAGE">Jardinage</option>
                                <option value="AUTRE">Autre</option>
                            </select>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Statut</label>
                            <select v-model="filters.statut" @change="applyFilters" class="form-select">
                                <option value="">Tous</option>
                                <option value="ACTIF">Actif</option>
                                <option value="INACTIF">Inactif</option>
                                <option value="SUSPENDU">Suspendu</option>
                            </select>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Note minimale</label>
                            <select v-model="filters.noteMin" @change="applyFilters" class="form-select">
                                <option value="">Toutes</option>
                                <option value="4">4+ étoiles</option>
                                <option value="3">3+ étoiles</option>
                                <option value="2">2+ étoiles</option>
                            </select>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Rechercher</label>
                            <input type="text" v-model="searchQuery" @input="applyFilters" class="form-control"
                                placeholder="Nom, contact...">
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                        <div class="text-muted small">
                            {{ filteredFournisseurs.length }} fournisseur(s) trouvé(s)
                        </div>
                        <div class="d-flex gap-2">
                            <button
                                @click="filters = { type: '', statut: '', noteMin: '' }; searchQuery = ''; applyFilters()"
                                class="btn btn-sm btn-outline-secondary">
                                <i class="bi bi-x-circle"></i> Réinitialiser
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Liste des fournisseurs en cartes -->
            <div v-if="isLoading" class="text-center my-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Chargement...</span>
                </div>
            </div>

            <div v-else-if="paginatedFournisseurs.length === 0" class="card shadow">
                <div class="card-body text-center text-muted py-5">
                    <i class="bi bi-inbox fs-1"></i>
                    <p class="mt-3">Aucun fournisseur trouvé.</p>
                    <button @click="nouveauFournisseur" class="btn btn-primary mt-2">
                        <i class="bi bi-plus-lg"></i> Ajouter un fournisseur
                    </button>
                </div>
            </div>

            <div v-else class="row g-4">
                <div class="col-md-6 col-lg-4" v-for="fournisseur in paginatedFournisseurs" :key="fournisseur.id">
                    <div class="card shadow-sm h-100 hover-shadow">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h5 class="card-title mb-1">{{ fournisseur.nom }}</h5>
                                    <span class="badge" :class="getTypeBadgeClass(fournisseur.type)">
                                        <i :class="getTypeIcon(fournisseur.type)" class="me-1"></i>
                                        {{ fournisseur.type }}
                                    </span>
                                </div>
                                <span class="badge" :class="getStatutBadgeClass(fournisseur.statut)">
                                    {{ fournisseur.statut }}
                                </span>
                            </div>

                            <div class="mb-3">
                                <div class="d-flex align-items-center mb-2">
                                    <div class="text-warning me-2">
                                        <i v-for="n in 5" :key="n"
                                            :class="n <= Math.floor(fournisseur.note) ? 'bi bi-star-fill' : 'bi bi-star'"
                                            class="small"></i>
                                    </div>
                                    <span class="text-muted small">({{ fournisseur.note }}/5)</span>
                                </div>
                            </div>

                            <div class="small text-muted mb-3">
                                <div class="d-flex align-items-center mb-2">
                                    <i class="bi bi-person me-2"></i>
                                    <span>{{ fournisseur.contact }}</span>
                                </div>
                                <div class="d-flex align-items-center mb-2">
                                    <i class="bi bi-telephone me-2"></i>
                                    <span>{{ fournisseur.telephone }}</span>
                                </div>
                                <div class="d-flex align-items-center mb-2">
                                    <i class="bi bi-envelope me-2"></i>
                                    <span class="text-truncate">{{ fournisseur.email }}</span>
                                </div>
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-geo-alt me-2"></i>
                                    <span>{{ fournisseur.adresse }}</span>
                                </div>
                            </div>

                            <div class="row text-center border-top pt-3">
                                <div class="col-4">
                                    <div class="fw-bold text-primary">{{ fournisseur.interventionsTotal }}</div>
                                    <small class="text-muted">Interventions</small>
                                </div>
                                <div class="col-4">
                                    <div class="fw-bold text-success" v-if="fournisseur.interventionsEnCours > 0">
                                        {{ fournisseur.interventionsEnCours }}
                                    </div>
                                    <div class="fw-bold text-muted" v-else>0</div>
                                    <small class="text-muted">En cours</small>
                                </div>
                                <div class="col-4">
                                    <div class="fw-bold text-info">{{ fournisseur.delaiMoyen }}j</div>
                                    <small class="text-muted">Délai moy.</small>
                                </div>
                            </div>

                            <div class="d-flex gap-2 mt-3 pt-3 border-top">
                                <button @click="voirDetails(fournisseur)"
                                    class="btn btn-sm btn-outline-primary flex-fill">
                                    <i class="bi bi-eye"></i> Détails
                                </button>
                                <button @click="modifierFournisseur(fournisseur)"
                                    class="btn btn-sm btn-outline-secondary">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <div class="dropdown">
                                    <button class="btn btn-sm btn-outline-secondary" type="button"
                                        data-bs-toggle="dropdown">
                                        <i class="bi bi-three-dots-vertical"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li>
                                            <a class="dropdown-item" @click="assignerIntervention(fournisseur)">
                                                <i class="bi bi-calendar-plus me-2"></i>Assigner intervention
                                            </a>
                                        </li>
                                        <li>
                                            <a class="dropdown-item" @click="voirHistorique(fournisseur)">
                                                <i class="bi bi-clock-history me-2"></i>Historique
                                            </a>
                                        </li>
                                        <li>
                                            <hr class="dropdown-divider">
                                        </li>
                                        <li>
                                            <a class="dropdown-item text-danger"
                                                @click="supprimerFournisseur(fournisseur)">
                                                <i class="bi bi-trash me-2"></i>Supprimer
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div class="card shadow mt-4" v-if="paginatedFournisseurs.length > 0">
                <div class="card-footer">
                    <div class="d-sm-flex justify-content-sm-between align-items-sm-center">
                        <p class="mb-sm-0 text-center text-sm-start">
                            Affichage {{ startIndex + 1 }} à {{ endIndex }} sur {{ filteredFournisseurs.length }}
                            entrées
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

        <!-- Modal Nouveau/Modifier Fournisseur -->
        <div class="modal fade" id="fournisseurModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ fournisseurForm.id ? 'Modifier' : 'Nouveau' }} Fournisseur
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Nom du Fournisseur *</label>
                                <input type="text" v-model="fournisseurForm.nom" class="form-control"
                                    placeholder="Ex: Plomberie Express" required>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Type de Service *</label>
                                <select v-model="fournisseurForm.type" class="form-select" required>
                                    <option value="">Sélectionnez...</option>
                                    <option value="PLOMBERIE">Plomberie</option>
                                    <option value="ELECTRICITE">Électricité</option>
                                    <option value="MENUISERIE">Menuiserie</option>
                                    <option value="PEINTURE">Peinture</option>
                                    <option value="CLIMATISATION">Climatisation</option>
                                    <option value="MACONNERIE">Maçonnerie</option>
                                    <option value="JARDINAGE">Jardinage</option>
                                    <option value="AUTRE">Autre</option>
                                </select>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Personne de Contact *</label>
                                <input type="text" v-model="fournisseurForm.contact" class="form-control"
                                    placeholder="Ex: Jean Dupont" required>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Téléphone *</label>
                                <input type="tel" v-model="fournisseurForm.telephone" class="form-control"
                                    placeholder="+229 XX XX XX XX" required>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Email *</label>
                                <input type="email" v-model="fournisseurForm.email" class="form-control"
                                    placeholder="contact@entreprise.bj" required>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Adresse *</label>
                                <input type="text" v-model="fournisseurForm.adresse" class="form-control"
                                    placeholder="Cotonou, Quartier" required>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Statut</label>
                                <select v-model="fournisseurForm.statut" class="form-select">
                                    <option value="ACTIF">Actif</option>
                                    <option value="INACTIF">Inactif</option>
                                    <option value="SUSPENDU">Suspendu</option>
                                </select>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Délai Moyen (jours)</label>
                                <input type="number" v-model.number="fournisseurForm.delaiMoyen" class="form-control"
                                    min="0" step="0.5">
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Coût Moyen (FCFA)</label>
                                <input type="number" v-model.number="fournisseurForm.coutMoyen" class="form-control"
                                    min="0" step="1000">
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Note (0-5)</label>
                                <input type="number" v-model.number="fournisseurForm.note" class="form-control" min="0"
                                    max="5" step="0.1">
                            </div>

                            <div class="col-12">
                                <label class="form-label">Notes / Remarques</label>
                                <textarea v-model="fournisseurForm.remarques" class="form-control" rows="3"
                                    placeholder="Informations complémentaires..."></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="sauvegarderFournisseur">
                            <i class="bi bi-check-circle"></i> {{ fournisseurForm.id ? 'Mettre à jour' : 'Enregistrer'
                            }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Détails Fournisseur -->
        <div class="modal fade" id="detailsModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Détails du Fournisseur</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" v-if="selectedFournisseur">
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
                                                <strong>Nom:</strong> {{ selectedFournisseur.nom }}
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Type:</strong>
                                                <span class="badge ms-2"
                                                    :class="getTypeBadgeClass(selectedFournisseur.type)">
                                                    {{ selectedFournisseur.type }}
                                                </span>
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Statut:</strong>
                                                <span class="badge ms-2"
                                                    :class="getStatutBadgeClass(selectedFournisseur.statut)">
                                                    {{ selectedFournisseur.statut }}
                                                </span>
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Note:</strong>
                                                <span class="text-warning ms-2">
                                                    <i v-for="n in 5" :key="n"
                                                        :class="n <= Math.floor(selectedFournisseur.note) ? 'bi bi-star-fill' : 'bi bi-star'"></i>
                                                    ({{ selectedFournisseur.note }}/5)
                                                </span>
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Contact:</strong> {{ selectedFournisseur.contact }}
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Téléphone:</strong> {{ selectedFournisseur.telephone }}
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Email:</strong> {{ selectedFournisseur.email }}
                                            </div>
                                            <div class="col-md-6">
                                                <strong>Adresse:</strong> {{ selectedFournisseur.adresse }}
                                            </div>
                                        </div>

                                        <div class="row g-3 mt-3 pt-3 border-top">
                                            <div class="col-md-4">
                                                <div class="text-center p-3 bg-light rounded">
                                                    <div class="h4 mb-0 text-primary">{{
                                                        selectedFournisseur.interventionsTotal }}</div>
                                                    <small class="text-muted">Interventions totales</small>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="text-center p-3 bg-light rounded">
                                                    <div class="h4 mb-0 text-success">{{
                                                        selectedFournisseur.interventionsEnCours }}</div>
                                                    <small class="text-muted">En cours</small>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="text-center p-3 bg-light rounded">
                                                    <div class="h4 mb-0 text-info">{{ selectedFournisseur.delaiMoyen }}j
                                                    </div>
                                                    <small class="text-muted">Délai moyen</small>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="mt-3" v-if="selectedFournisseur.remarques">
                                            <strong>Remarques:</strong>
                                            <p class="mb-0 mt-2">{{ selectedFournisseur.remarques }}</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Historique interventions -->
                                <div class="card mt-3">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0">Dernières Interventions</h6>
                                    </div>
                                    <div class="card-body">
                                        <p class="text-muted">Historique des interventions à venir...</p>
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
                                            <button class="btn btn-primary"
                                                @click="assignerIntervention(selectedFournisseur)">
                                                <i class="bi bi-calendar-plus me-2"></i>Assigner intervention
                                            </button>
                                            <button class="btn btn-outline-primary"
                                                @click="modifierFournisseur(selectedFournisseur)">
                                                <i class="bi bi-pencil me-2"></i>Modifier
                                            </button>
                                            <button class="btn btn-outline-info"
                                                @click="voirHistorique(selectedFournisseur)">
                                                <i class="bi bi-clock-history me-2"></i>Historique complet
                                            </button>
                                            <button class="btn btn-outline-secondary">
                                                <i class="bi bi-printer me-2"></i>Imprimer fiche
                                            </button>
                                            <button class="btn btn-outline-danger"
                                                @click="supprimerFournisseur(selectedFournisseur)">
                                                <i class="bi bi-trash me-2"></i>Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Performance -->
                                <div class="card mt-3">
                                    <div class="card-header bg-light">
                                        <h6 class="mb-0">Performance</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="mb-3">
                                            <div class="d-flex justify-content-between mb-1">
                                                <small>Coût moyen</small>
                                                <strong>{{ formatCurrency(selectedFournisseur.coutMoyen) }}</strong>
                                            </div>
                                        </div>
                                        <div class="mb-3">
                                            <div class="d-flex justify-content-between mb-1">
                                                <small>Dernière intervention</small>
                                                <strong>{{ formatDate(selectedFournisseur.derniereIntervention)
                                                }}</strong>
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
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";

export default {
    name: "SuiviFournisseurs",

    data() {
        return {
            fournisseurs: [],
            stats: {
                total: 0,
                actifs: 0,
                noteMoyenne: 0,
                interventionsMois: 0
            },
            filters: {
                type: '',
                statut: '',
                noteMin: ''
            },
            fournisseurForm: {
                id: null,
                nom: '',
                type: '',
                contact: '',
                telephone: '',
                email: '',
                adresse: '',
                statut: 'ACTIF',
                note: 0,
                delaiMoyen: 0,
                coutMoyen: 0,
                remarques: ''
            },
            searchQuery: '',
            currentPage: 1,
            perPage: 9,
            isLoading: false,
            selectedFournisseur: null
        };
    },

    computed: {
        filteredFournisseurs() {
            let result = [...this.fournisseurs];

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(f =>
                    f.nom?.toLowerCase().includes(query) ||
                    f.contact?.toLowerCase().includes(query) ||
                    f.email?.toLowerCase().includes(query)
                );
            }

            if (this.filters.type) {
                result = result.filter(f => f.type === this.filters.type);
            }

            if (this.filters.statut) {
                result = result.filter(f => f.statut === this.filters.statut);
            }

            if (this.filters.noteMin) {
                result = result.filter(f => f.note >= parseFloat(this.filters.noteMin));
            }

            return result.sort((a, b) => b.note - a.note);
        },

        paginatedFournisseurs() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredFournisseurs.slice(start, start + this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filteredFournisseurs.length / this.perPage);
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
            return Math.min(this.startIndex + this.perPage, this.filteredFournisseurs.length);
        }
    },

    mounted() {
        this.fetchFournisseurs();
    },

    methods: {
        async fetchFournisseurs() {
            this.isLoading = true;
            try {
                // Récupérer depuis le store Vuex
                const data = await this.$store.dispatch("interventions/getAll");

                // Générer des fournisseurs fictifs ou mapper les données existantes
                this.fournisseurs = this.genererFournisseurs(data);
                this.calculerStats();
            } catch (error) {
                console.error("Erreur chargement fournisseurs:", error);
                ElMessage.error("Erreur lors du chargement des fournisseurs");
            } finally {
                this.isLoading = false;
            }
        },

        genererFournisseurs(interventions) {
            // Génération de fournisseurs d'exemple
            const types = ['PLOMBERIE', 'ELECTRICITE', 'MENUISERIE', 'PEINTURE', 'CLIMATISATION', 'MACONNERIE', 'JARDINAGE'];
            const noms = {
                'PLOMBERIE': ['Plomberie Express', 'AquaServices', 'Plomberie du Bénin'],
                'ELECTRICITE': ['Électricité Pro', 'LumièreServices', 'ElectroBénin'],
                'MENUISERIE': ['Menuiserie Moderne', 'BoisArt', 'Menuiserie Royale'],
                'PEINTURE': ['Peinture & Décor', 'ColorMaster', 'Peinture Plus'],
                'CLIMATISATION': ['Climatisation Plus', 'FreshAir', 'ClimaBénin'],
                'MACONNERIE': ['Maçonnerie Expert', 'BâtiSolide', 'Maçonnerie Pro'],
                'JARDINAGE': ['Jardins du Golfe', 'VertsEspaces', 'JardinPlus']
            };

            const quartiers = ['Akpakpa', 'Cadjehoun', 'Fidjrossè', 'Gbegamey', 'Haie Vive', 'Cococodji'];
            const prenoms = ['Jean', 'Marie', 'Paul', 'Sylvie', 'Robert', 'Aminata', 'Dossou', 'Kossou'];
            const noms_famille = ['Dupont', 'Martin', 'Agbota', 'Ahouansou', 'Hounnou', 'Koffi', 'Dossa'];

            const fournisseurs = [];
            let id = 1;

            types.forEach(type => {
                const nomsType = noms[type] || ['Fournisseur'];
                nomsType.forEach(nom => {
                    const prenom = prenoms[Math.floor(Math.random() * prenoms.length)];
                    const nomFamille = noms_famille[Math.floor(Math.random() * noms_famille.length)];
                    const quartier = quartiers[Math.floor(Math.random() * quartiers.length)];

                    fournisseurs.push({
                        id: id++,
                        nom: nom,
                        type: type,
                        contact: `${prenom} ${nomFamille}`,
                        telephone: `+229 ${90 + Math.floor(Math.random() * 10)} ${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
                        email: `contact@${nom.toLowerCase().replace(/\s+/g, '-').replace(/[éè]/g, 'e')}.bj`,
                        adresse: `Cotonou, ${quartier}`,
                        statut: Math.random() > 0.15 ? 'ACTIF' : 'INACTIF',
                        note: parseFloat((3 + Math.random() * 2).toFixed(1)),
                        interventionsTotal: Math.floor(Math.random() * 50) + 5,
                        interventionsEnCours: Math.floor(Math.random() * 6),
                        coutMoyen: Math.floor(Math.random() * 80000) + 20000,
                        delaiMoyen: parseFloat((1 + Math.random() * 4).toFixed(1)),
                        derniereIntervention: this.genererDateRecente(),
                        remarques: ''
                    });
                });
            });

            return fournisseurs;
        },

        genererDateRecente() {
            const now = new Date();
            const daysAgo = Math.floor(Math.random() * 60);
            return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        },

        calculerStats() {
            this.stats = {
                total: this.fournisseurs.length,
                actifs: this.fournisseurs.filter(f => f.statut === 'ACTIF').length,
                noteMoyenne: this.fournisseurs.length > 0
                    ? (this.fournisseurs.reduce((sum, f) => sum + f.note, 0) / this.fournisseurs.length).toFixed(1)
                    : 0,
                interventionsMois: this.fournisseurs.reduce((sum, f) => {
                    const lastMonth = new Date();
                    lastMonth.setMonth(lastMonth.getMonth() - 1);
                    return sum + (new Date(f.derniereIntervention) >= lastMonth ? 1 : 0);
                }, 0)
            };
        },

        nouveauFournisseur() {
            this.resetForm();
            const modal = new bootstrap.Modal(document.getElementById("fournisseurModal"));
            modal.show();
        },

        modifierFournisseur(fournisseur) {
            this.fournisseurForm = { ...fournisseur };
            bootstrap.Modal.getInstance(document.getElementById("detailsModal"))?.hide();
            const modal = new bootstrap.Modal(document.getElementById("fournisseurModal"));
            modal.show();
        },

        resetForm() {
            this.fournisseurForm = {
                id: null,
                nom: '',
                type: '',
                contact: '',
                telephone: '',
                email: '',
                adresse: '',
                statut: 'ACTIF',
                note: 0,
                delaiMoyen: 0,
                coutMoyen: 0,
                remarques: ''
            };
        },

        async sauvegarderFournisseur() {
            try {
                if (!this.fournisseurForm.nom || !this.fournisseurForm.type ||
                    !this.fournisseurForm.contact || !this.fournisseurForm.telephone) {
                    ElMessage.warning("Veuillez remplir tous les champs obligatoires");
                    return;
                }

                if (this.fournisseurForm.id) {
                    // Mise à jour
                    // await this.$store.dispatch("fournisseurs/update", this.fournisseurForm);
                    const index = this.fournisseurs.findIndex(f => f.id === this.fournisseurForm.id);
                    if (index !== -1) {
                        this.$set(this.fournisseurs, index, { ...this.fournisseurForm });
                    }
                    ElMessage.success("Fournisseur mis à jour avec succès");
                } else {
                    // Création
                    const newFournisseur = {
                        ...this.fournisseurForm,
                        id: this.fournisseurs.length + 1,
                        interventionsTotal: 0,
                        interventionsEnCours: 0,
                        derniereIntervention: new Date()
                    };
                    // await this.$store.dispatch("fournisseurs/create", newFournisseur);
                    this.fournisseurs.unshift(newFournisseur);
                    ElMessage.success("Fournisseur créé avec succès");
                }

                bootstrap.Modal.getInstance(document.getElementById("fournisseurModal")).hide();
                this.resetForm();
                this.calculerStats();
            } catch (error) {
                console.error("Erreur sauvegarde:", error);
                ElMessage.error("Erreur lors de la sauvegarde");
            }
        },

        voirDetails(fournisseur) {
            this.selectedFournisseur = fournisseur;
            const modal = new bootstrap.Modal(document.getElementById("detailsModal"));
            modal.show();
        },

        async supprimerFournisseur(fournisseur) {
            try {
                await ElMessageBox.confirm(
                    `Êtes-vous sûr de vouloir supprimer le fournisseur "${fournisseur.nom}" ?`,
                    'Confirmation',
                    {
                        confirmButtonText: 'Supprimer',
                        cancelButtonText: 'Annuler',
                        type: 'warning',
                        confirmButtonClass: 'btn btn-danger',
                        cancelButtonClass: 'btn btn-secondary'
                    }
                );

                // await this.$store.dispatch("fournisseurs/delete", fournisseur.id);
                const index = this.fournisseurs.findIndex(f => f.id === fournisseur.id);
                if (index !== -1) {
                    this.fournisseurs.splice(index, 1);
                }

                ElMessage.success("Fournisseur supprimé avec succès");
                bootstrap.Modal.getInstance(document.getElementById("detailsModal"))?.hide();
                this.calculerStats();
            } catch (error) {
                if (error !== 'cancel') {
                    console.error("Erreur suppression:", error);
                    ElMessage.error("Erreur lors de la suppression");
                }
            }
        },

        assignerIntervention(fournisseur) {
            ElMessage.info(`Fonctionnalité d'assignation d'intervention pour ${fournisseur.nom} à venir...`);
            bootstrap.Modal.getInstance(document.getElementById("detailsModal"))?.hide();
        },

        voirHistorique(fournisseur) {
            ElMessage.info(`Affichage de l'historique complet de ${fournisseur.nom} à venir...`);
        },

        async exporterFournisseurs() {
            try {
                // Créer un CSV simple
                let csv = 'Nom,Type,Contact,Téléphone,Email,Adresse,Statut,Note,Interventions\n';
                this.fournisseurs.forEach(f => {
                    csv += `"${f.nom}","${f.type}","${f.contact}","${f.telephone}","${f.email}","${f.adresse}","${f.statut}",${f.note},${f.interventionsTotal}\n`;
                });

                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `fournisseurs-${new Date().toISOString().split('T')[0]}.csv`;
                link.click();
                URL.revokeObjectURL(link.href);

                ElMessage.success("Export réussi");
            } catch (error) {
                console.error("Erreur export:", error);
                ElMessage.error("Erreur lors de l'export");
            }
        },

        applyFilters() {
            this.currentPage = 1;
        },

        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'ACTIF': 'bg-success',
                'INACTIF': 'bg-secondary',
                'SUSPENDU': 'bg-warning'
            };
            return classes[statut] || 'bg-secondary';
        },

        getTypeBadgeClass(type) {
            const classes = {
                'PLOMBERIE': 'bg-primary',
                'ELECTRICITE': 'bg-warning',
                'MENUISERIE': 'bg-info',
                'PEINTURE': 'bg-danger',
                'CLIMATISATION': 'bg-success',
                'MACONNERIE': 'bg-secondary',
                'JARDINAGE': 'bg-dark',
                'AUTRE': 'bg-secondary'
            };
            return classes[type] || 'bg-secondary';
        },

        getTypeIcon(type) {
            const icons = {
                'PLOMBERIE': 'bi bi-droplet',
                'ELECTRICITE': 'bi bi-lightning-charge',
                'MENUISERIE': 'bi bi-hammer',
                'PEINTURE': 'bi bi-brush',
                'CLIMATISATION': 'bi bi-snow',
                'MACONNERIE': 'bi bi-bricks',
                'JARDINAGE': 'bi bi-tree',
                'AUTRE': 'bi bi-tools'
            };
            return icons[type] || 'bi bi-wrench';
        },

        formatCurrency(value) {
            if (!value && value !== 0) return '0 FCFA';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0,
            }).format(value).replace('XOF', 'FCFA');
        },

        formatDate(date) {
            if (!date) return 'N/A';
            return new Date(date).toLocaleDateString('fr-FR');
        }
    }
};
</script>

<style scoped>
.hover-shadow {
    transition: all 0.3s ease;
}

.hover-shadow:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.card-title {
    font-size: 1.1rem;
    font-weight: 600;
}

.text-truncate {
    max-width: 200px;
}

@media (max-width: 768px) {
    .d-flex.gap-2 {
        flex-direction: column;
    }

    .d-flex.gap-2 .btn {
        width: 100%;
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