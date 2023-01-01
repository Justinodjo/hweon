<template>
    <main>
        <section class="pt-0">
            <div class="container vstack gap-4">
                <!-- Title START -->
                <div class="row">
                    <div class="col-12">
                        <h1 class="fs-4 mb-0">
                            <i class="bi bi-journals fa-fw me-1"></i>Mes Annonces
                        </h1>
                    </div>
                </div>
                <!-- Title END -->

                <!-- Counter START (DYNAMIQUE) -->
                <div class="row g-4">
                    <!-- Revenu total -->
                    <div class="col-md-6 col-xl-4">
                        <div class="card card-body border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h6 class="mb-0">
                                        Revenus Totaux
                                        <a tabindex="0" class="h6 mb-0 ms-1" role="button" data-bs-toggle="tooltip"
                                            title="Total des revenus générés">
                                            <i class="bi bi-info-circle-fill small"></i>
                                        </a>
                                    </h6>
                                </div>
                                <div class="icon-box bg-success bg-opacity-10 rounded-circle p-2">
                                    <i class="bi bi-currency-exchange text-success fs-5"></i>
                                </div>
                            </div>

                            <h2 class="text-success mb-2">{{ formatCurrency(stats.revenuTotal) }}</h2>

                            <div class="d-flex align-items-center mb-2">
                                <span :class="stats.evolutionRevenu >= 0 ? 'text-success' : 'text-danger'" class="me-2">
                                    <i class="bi"
                                        :class="stats.evolutionRevenu >= 0 ? 'bi-arrow-up' : 'bi-arrow-down'"></i>
                                    {{ Math.abs(stats.evolutionRevenu) }}%
                                </span>
                                <span class="text-muted small">vs mois dernier</span>
                            </div>

                            <div class="mt-auto">
                                <router-link :to="{ name: 'details_baux_list' }"
                                    class="text-primary text-decoration-underline p-0 mb-0">
                                    Voir le détail
                                </router-link>
                            </div>
                        </div>
                    </div>

                    <!-- Biens loués -->
                    <div class="col-md-6 col-xl-4">
                        <div class="card card-body border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h6 class="mb-0">Biens Loués</h6>
                                </div>
                                <div class="icon-box bg-info bg-opacity-10 rounded-circle p-2">
                                    <i class="bi bi-house-check text-info fs-5"></i>
                                </div>
                            </div>

                            <h2 class="text-info mb-2">{{ stats.biensLoues }}</h2>

                            <p class="mb-2">
                                <span class="text-muted me-1">{{ stats.totalBiens }}</span>
                                Biens au total
                            </p>

                            <!-- Barre de progression -->
                            <div class="progress mb-2" style="height: 8px;">
                                <div class="progress-bar bg-info" role="progressbar"
                                    :style="{ width: tauxOccupation + '%' }" :aria-valuenow="tauxOccupation">
                                </div>
                            </div>
                            <small class="text-muted">Taux d'occupation: {{ tauxOccupation }}%</small>

                            <div class="mt-auto">
                                <a href="#" @click.prevent="filterByStatus('LOUE')"
                                    class="text-primary text-decoration-underline p-0 mb-0">
                                    Voir les biens loués
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Biens disponibles -->
                    <div class="col-md-6 col-xl-4">
                        <div class="card card-body border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h6 class="mb-0">Biens Disponibles</h6>
                                </div>
                                <div class="icon-box bg-warning bg-opacity-10 rounded-circle p-2">
                                    <i class="bi bi-house text-warning fs-5"></i>
                                </div>
                            </div>

                            <h2 class="text-warning mb-2">{{ stats.biensDisponibles }}</h2>

                            <p class="mb-2">
                                <span class="badge bg-success">{{ stats.nouveauxCeMois }}</span>
                                Nouveaux ce mois
                            </p>

                            <div class="mt-auto">
                                <a href="#" @click.prevent="filterByStatus('DISPONIBLE')"
                                    class="text-primary text-decoration-underline p-0 mb-0">
                                    Voir les biens disponibles
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Counter END -->

                <!-- Statistiques supplémentaires -->
                <div class="row g-4">
                    <div class="col-md-3">
                        <div class="card border-start border-4 border-primary">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="flex-shrink-0">
                                        <i class="bi bi-eye fs-2 text-primary"></i>
                                    </div>
                                    <div class="flex-grow-1 ms-3">
                                        <h6 class="mb-0 text-muted">Vues totales</h6>
                                        <h4 class="mb-0">{{ stats.vuesTotales }}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card border-start border-4 border-success">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="flex-shrink-0">
                                        <i class="bi bi-heart-fill fs-2 text-success"></i>
                                    </div>
                                    <div class="flex-grow-1 ms-3">
                                        <h6 class="mb-0 text-muted">Favoris</h6>
                                        <h4 class="mb-0">{{ stats.favorisTotal }}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card border-start border-4 border-info">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="flex-shrink-0">
                                        <i class="bi bi-chat-dots fs-2 text-info"></i>
                                    </div>
                                    <div class="flex-grow-1 ms-3">
                                        <h6 class="mb-0 text-muted">Messages</h6>
                                        <h4 class="mb-0">{{ stats.messagesNonLus }}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card border-start border-4 border-warning">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="flex-shrink-0">
                                        <i class="bi bi-star-fill fs-2 text-warning"></i>
                                    </div>
                                    <div class="flex-grow-1 ms-3">
                                        <h6 class="mb-0 text-muted">Note moyenne</h6>
                                        <h4 class="mb-0">{{ stats.noteMoyenne }}/5</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Listing table START -->
                <div class="row">
                    <div class="col-12">
                        <div class="card border">
                            <!-- Card header -->
                            <div class="card-header border-bottom">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h5 class="card-header-title mb-0">
                                        Mes annonces
                                        <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                            {{ filteredBiens.length }} / {{ stats.totalBiens }}
                                        </span>
                                    </h5>

                                    <!-- Actions rapides -->
                                    <div class="d-flex gap-2">
                                        <button class="btn btn-sm btn-success" @click="showMandatModal = true">
                                            <i class="bi bi-person-check me-1"></i> Mandater
                                        </button>
                                        <button class="btn btn-sm btn-primary" @click="openUserModal">
                                            <i class="bi bi-plus-circle me-1"></i> Nouveau bien
                                        </button>
                                    </div>
                                </div>

                                <!-- Filtres et recherche -->
                                <div class="mt-3">
                                    <div class="row g-3">
                                        <!-- Recherche globale -->
                                        <div class="col-md-4">
                                            <div class="input-group">
                                                <span class="input-group-text">
                                                    <i class="bi bi-search"></i>
                                                </span>
                                                <input type="text" class="form-control"
                                                    placeholder="Rechercher un bien..."
                                                    v-model="searchFilters.globalSearch" @input="debouncedSearch">
                                            </div>
                                        </div>

                                        <!-- Filtre par type -->
                                        <div class="col-md-2">
                                            <select class="form-select" v-model="searchFilters.type"
                                                @change="applyFilters">
                                                <option value="">Tous les types</option>
                                                <option v-for="service in services" :key="service.id"
                                                    :value="service.id">
                                                    {{ capitalize(service.nomTypeBiensImmo) }}
                                                </option>
                                            </select>
                                        </div>

                                        <!-- Filtre par statut -->
                                        <div class="col-md-2">
                                            <select class="form-select" v-model="searchFilters.statut"
                                                @change="applyFilters">
                                                <option value="">Tous les statuts</option>
                                                <option value="DISPONIBLE">Disponible</option>
                                                <option value="LOUE">Loué</option>
                                                <option value="MAINTENANCE">En maintenance</option>
                                                <option value="ARCHIVE">Archivé</option>
                                            </select>
                                        </div>

                                        <!-- Prix min -->
                                        <div class="col-md-2">
                                            <input type="number" class="form-control" placeholder="Prix min"
                                                v-model.number="searchFilters.prixMin" @input="applyFilters">
                                        </div>

                                        <!-- Prix max -->
                                        <div class="col-md-2">
                                            <input type="number" class="form-control" placeholder="Prix max"
                                                v-model.number="searchFilters.prixMax" @input="applyFilters">
                                        </div>
                                    </div>

                                    <!-- Deuxième ligne de filtres -->
                                    <div class="row g-3 mt-2">
                                        <!-- Tri -->
                                        <div class="col-md-3">
                                            <select v-model="sortKey" @change="sortBiens" class="form-select">
                                                <option value="">Trier par...</option>
                                                <option value="dateCreation">Date de création</option>
                                                <option value="prix">Prix</option>
                                                <option value="nom">Nom</option>
                                                <option value="vues">Vues</option>
                                                <option value="note">Note</option>
                                            </select>
                                        </div>

                                        <!-- Ordre -->
                                        <div class="col-md-2">
                                            <select v-model="sortOrder" @change="sortBiens" class="form-select">
                                                <option value="asc">Croissant</option>
                                                <option value="desc">Décroissant</option>
                                            </select>
                                        </div>

                                        <!-- Vue -->
                                        <div class="col-md-2">
                                            <div class="btn-group w-100" role="group">
                                                <button type="button" class="btn"
                                                    :class="viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'"
                                                    @click="viewMode = 'list'">
                                                    <i class="bi bi-list-ul"></i>
                                                </button>
                                                <button type="button" class="btn"
                                                    :class="viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'"
                                                    @click="viewMode = 'grid'">
                                                    <i class="bi bi-grid-3x3-gap"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Actions groupées -->
                                        <div class="col-md-3">
                                            <select v-model="bulkAction" class="form-select"
                                                @change="executeBulkAction">
                                                <option value="">Actions groupées...</option>
                                                <option value="delete">Supprimer sélectionnés</option>
                                                <option value="archive">Archiver sélectionnés</option>
                                                <option value="publish">Publier sélectionnés</option>
                                            </select>
                                        </div>

                                        <!-- Réinitialiser -->
                                        <div class="col-md-2">
                                            <button @click="resetFilters" class="btn btn-outline-secondary w-100">
                                                <i class="bi bi-arrow-counterclockwise me-1"></i> Réinitialiser
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Card body START -->
                            <div class="card-body vstack gap-3">
                                <!-- Message vide -->
                                <div v-if="filteredBiens.length === 0" class="text-center py-5">
                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
                                    <p class="text-muted mb-3">
                                        {{ searchFilters.globalSearch ? 'Aucun bien ne correspond à votre recherche' :
                                            'Vous n\'avez pas encore de biens' }}
                                    </p>
                                    <button v-if="!searchFilters.globalSearch" class="btn btn-primary"
                                        @click="openUserModal">
                                        <i class="bi bi-plus-circle me-2"></i>
                                        Ajouter votre premier bien
                                    </button>
                                </div>

                                <!-- Liste des biens -->
                                <div v-else>
                                    <!-- Sélection globale -->
                                    <div class="d-flex align-items-center mb-3">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" v-model="selectAll"
                                                @change="toggleSelectAll" id="selectAll">
                                            <label class="form-check-label" for="selectAll">
                                                Tout sélectionner
                                            </label>
                                        </div>
                                        <span class="ms-3 text-muted small" v-if="selectedBiens.length > 0">
                                            {{ selectedBiens.length }} bien(s) sélectionné(s)
                                        </span>
                                    </div>

                                    <!-- Listing item -->
                                    <div class="card border p-2 listing-item"
                                        :class="{ 'selected': isSelected(bien.id) }"
                                        v-for="(bien, index) in paginatedBiens" :key="bien.id || `bien-${index}`">

                                        <div class="row g-4">
                                            <!-- Checkbox -->
                                            <div class="col-auto d-flex align-items-center">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" :value="bien.id"
                                                        v-model="selectedBiens" :id="`check-${bien.id}`">
                                                </div>
                                            </div>

                                            <!-- Image -->
                                            <div class="col-md-3 col-lg-2">
                                                <div class="position-relative">
                                                    <img v-if="bien.fichier && bien.fichier.id"
                                                        :src="getImageUrl(bien.fichier.id)" class="card-img rounded-2"
                                                        alt="Image du bien" @error="handleImageError($event, bien)">

                                                    <div v-else
                                                        class="card-img rounded-2 bg-light d-flex align-items-center justify-content-center"
                                                        style="height: 120px;">
                                                        <i class="bi bi-image text-muted" style="font-size: 2rem;"></i>
                                                    </div>

                                                    <!-- Badge statut -->
                                                    <span class="position-absolute top-0 start-0 m-2 badge"
                                                        :class="getStatutBadgeClass(bien.statut)">
                                                        {{ getStatutLabel(bien.statut) }}
                                                    </span>
                                                </div>
                                            </div>

                                            <!-- Contenu -->
                                            <div class="col">
                                                <div class="card-body position-relative d-flex flex-column p-0 h-100">
                                                    <!-- Actions dropdown -->
                                                    <div class="dropdown position-absolute top-0 end-0">
                                                        <button class="btn btn-sm btn-round btn-light" type="button"
                                                            :id="`dropdown-${bien.id}`" data-bs-toggle="dropdown">
                                                            <i class="bi bi-three-dots-vertical"></i>
                                                        </button>

                                                        <ul class="dropdown-menu dropdown-menu-end"
                                                            :aria-labelledby="`dropdown-${bien.id}`">
                                                            <li>
                                                                <router-link
                                                                    :to="{ name: 'details_biens_list', params: { id: bien.id } }"
                                                                    class="dropdown-item">
                                                                    <i class="bi bi-eye me-2"></i>Voir
                                                                </router-link>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="openEditModal(bien)">
                                                                    <i class="bi bi-pencil me-2"></i>Modifier
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="duplicateBien(bien)">
                                                                    <i class="bi bi-files me-2"></i>Dupliquer
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <hr class="dropdown-divider">
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="archiveBien(bien.id)">
                                                                    <i class="bi bi-archive me-2"></i>Archiver
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item text-danger" href="#"
                                                                    @click.prevent="deleteBien(bien.id)">
                                                                    <i class="bi bi-trash me-2"></i>Supprimer
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <!-- Titre et infos -->
                                                    <div class="mb-2">
                                                        <h5 class="card-title mb-1 me-5">
                                                            <router-link
                                                                :to="{ name: 'details_biens_list', params: { id: bien.id } }"
                                                                class="text-dark text-decoration-none">
                                                                {{ bien.nom || 'Bien sans nom' }}
                                                            </router-link>
                                                        </h5>
                                                        <small class="text-muted">
                                                            <i class="bi bi-geo-alt me-1"></i>{{ bien.adresse ||
                                                                'Adresse non renseignée' }}
                                                        </small>
                                                    </div>

                                                    <!-- Stats rapides -->
                                                    <div class="d-flex gap-3 mb-2 flex-wrap">
                                                        <small class="text-muted">
                                                            <i class="bi bi-eye me-1"></i>{{ bien.vues || 0 }} vues
                                                        </small>
                                                        <small class="text-muted">
                                                            <i class="bi bi-heart me-1"></i>{{ bien.favoris || 0 }}
                                                            favoris
                                                        </small>
                                                        <small class="text-warning">
                                                            <i class="bi bi-star-fill me-1"></i>{{ (bien.note ||
                                                                0).toFixed(1) }}
                                                        </small>
                                                        <small class="text-muted">
                                                            <i class="bi bi-calendar me-1"></i>{{
                                                                formatDate(bien.dateCreation) }}
                                                        </small>
                                                    </div>

                                                    <!-- Prix et actions -->
                                                    <div
                                                        class="d-sm-flex justify-content-sm-between align-items-center mt-auto">
                                                        <div class="d-flex align-items-center">
                                                            <h5 class="fw-bold mb-0 me-2 text-success">
                                                                {{ formatCurrency(bien.prix) }}
                                                            </h5>
                                                            <span class="text-muted small">/{{ bien.typeUnite || 'mois'
                                                            }}</span>
                                                        </div>

                                                        <div class="hstack gap-2 mt-3 mt-sm-0">
                                                            <button class="btn btn-sm"
                                                                :class="bien.isFavorite ? 'btn-warning' : 'btn-outline-warning'"
                                                                @click="toggleFavorite(bien)" title="Favori">
                                                                <i class="bi"
                                                                    :class="bien.isFavorite ? 'bi-star-fill' : 'bi-star'"></i>
                                                            </button>

                                                            <button class="btn btn-sm btn-primary"
                                                                @click="openEditModal(bien)">
                                                                <i class="bi bi-pencil-square me-1"></i>Modifier
                                                            </button>

                                                            <button class="btn btn-sm btn-danger"
                                                                @click="deleteBien(bien.id)">
                                                                <i class="bi bi-trash3 me-1"></i>Supprimer
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Pagination -->
                                    <nav v-if="totalPages > 1" class="mt-4" aria-label="Pagination">
                                        <ul class="pagination justify-content-center">
                                            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                                <a class="page-link" href="#"
                                                    @click.prevent="changePage(currentPage - 1)">
                                                    <i class="bi bi-chevron-left"></i>
                                                </a>
                                            </li>

                                            <li v-for="page in paginationRange" :key="page" class="page-item"
                                                :class="{ active: page === currentPage, disabled: page === '...' }">
                                                <a v-if="page !== '...'" class="page-link" href="#"
                                                    @click.prevent="changePage(page)">
                                                    {{ page }}
                                                </a>
                                                <span v-else class="page-link">...</span>
                                            </li>

                                            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                                <a class="page-link" href="#"
                                                    @click.prevent="changePage(currentPage + 1)">
                                                    <i class="bi bi-chevron-right"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>

                                    <!-- Info pagination -->
                                    <div class="text-center text-muted small">
                                        Affichage de {{ startIndex }} à {{ endIndex }} sur {{ filteredBiens.length }}
                                        bien(s)
                                    </div>
                                </div>
                            </div>
                            <!-- Card body END -->
                        </div>
                    </div>
                </div>
                <!-- Listing table END -->
            </div>
        </section>

        <!-- Modals -->
        <ModalMandat :show="showMandatModal" :proprietaireId="userId" @close="showMandatModal = false" />

        <!-- Modal Edition (reste identique) -->
        <div v-if="showEditModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Modifier le bien</h5>
                        <button type="button" class="btn-close" @click="showEditModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Nom *</label>
                            <input v-model="editBien.nom" class="form-control" required />
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Adresse *</label>
                            <input v-model="editBien.adresse" class="form-control" required />
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Prix *</label>
                                <input v-model.number="editBien.prix" class="form-control" type="number" required />
                            </div>

                            <div class="col-md-6 mb-3">
                                <label class="form-label">Statut</label>
                                <select v-model="editBien.statut" class="form-select">
                                    <option value="DISPONIBLE">Disponible</option>
                                    <option value="LOUE">Loué</option>
                                    <option value="MAINTENANCE">Maintenance</option>
                                    <option value="ARCHIVE">Archivé</option>
                                </select>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Description</label>
                            <textarea v-model="editBien.description" class="form-control" rows="4"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="showEditModal = false">Annuler</button>
                        <button class="btn btn-primary" @click="saveEditBien">
                            <i class="bi bi-save me-1"></i>Enregistrer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";
import { API_URLS } from "@/config/api";
import ModalMandat from "@/components/modal/ModalMandat.vue";
import AddBiensStepOne from '@/components/modal/AddBiensStepOne.vue'
import { useStore } from "vuex";
export default {
    components: {
        ModalMandat,
        AddBiensStepOne,
    },
    setup() {
        const store = useStore();

        const openUserModal = () => {
            store.dispatch("modal/openModal", {
                component: "AddBiensStepOne", // ton composant
                props: { userId: 1 }        // props que tu veux passer
            });
        };

        return { openUserModal };
    },
    data() {
        return {
            // Données
            services: [],
            biensOriginaux: [],
            selectedBiens: [],
            selectAll: false,

            // Modals
            showEditModal: false,
            showMandatModal: false,
            editBien: {},

            // Pagination
            currentPage: 1,
            perPage: 10,

            // Vue
            viewMode: 'list',

            // Filtres
            searchFilters: {
                globalSearch: '',
                type: '',
                statut: '',
                prixMin: null,
                prixMax: null,
            },

            // Tri
            sortKey: 'dateCreation',
            sortOrder: 'desc',

            // Actions groupées
            bulkAction: '',

            // Statistiques
            stats: {
                revenuTotal: 0,
                evolutionRevenu: 0,
                biensLoues: 0,
                biensDisponibles: 0,
                totalBiens: 0,
                nouveauxCeMois: 0,
                vuesTotales: 0,
                favorisTotal: 0,
                messagesNonLus: 0,
                noteMoyenne: 0,
            },

            // Debounce
            searchDebounce: null,
        };
    },

    computed: {
        userId() {
            return this.$store.getters["auth/userInfo"]?.id || null;
        },

        // Taux d'occupation
        tauxOccupation() {
            if (this.stats.totalBiens === 0) return 0;
            return Math.round((this.stats.biensLoues / this.stats.totalBiens) * 100);
        },

        // Filtrage des biens
        filteredBiens() {
            let result = [...this.biensOriginaux];

            // Recherche globale
            if (this.searchFilters.globalSearch) {
                const query = this.searchFilters.globalSearch.toLowerCase();
                result = result.filter(bien =>
                    (bien.nom || '').toLowerCase().includes(query) ||
                    (bien.adresse || '').toLowerCase().includes(query)
                );
            }

            // Filtre par type
            if (this.searchFilters.type) {
                result = result.filter(bien =>
                    bien.typeBiensImmobiliere?.id === this.searchFilters.type
                );
            }

            // Filtre par statut
            if (this.searchFilters.statut) {
                result = result.filter(bien => bien.statut === this.searchFilters.statut);
            }

            // Filtre par prix
            if (this.searchFilters.prixMin !== null) {
                result = result.filter(bien => bien.prix >= this.searchFilters.prixMin);
            }
            if (this.searchFilters.prixMax !== null) {
                result = result.filter(bien => bien.prix <= this.searchFilters.prixMax);
            }

            // Tri
            if (this.sortKey) {
                result.sort((a, b) => {
                    let valA = a[this.sortKey];
                    let valB = b[this.sortKey];

                    // Gestion des dates
                    if (this.sortKey === 'dateCreation') {
                        valA = new Date(valA || 0).getTime();
                        valB = new Date(valB || 0).getTime();
                    }

                    // Gestion des valeurs nulles
                    if (valA == null) valA = 0;
                    if (valB == null) valB = 0;

                    if (this.sortOrder === 'asc') {
                        return valA > valB ? 1 : -1;
                    } else {
                        return valA < valB ? 1 : -1;
                    }
                });
            }

            return result;
        },

        // Pagination
        totalPages() {
            return Math.ceil(this.filteredBiens.length / this.perPage);
        },

        paginatedBiens() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredBiens.slice(start, end);
        },

        paginationRange() {
            const total = this.totalPages;
            const current = this.currentPage;
            const delta = 2;
            const range = [];
            const rangeWithDots = [];
            let l;

            for (let i = 1; i <= total; i++) {
                if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
                    range.push(i);
                }
            }

            for (let i of range) {
                if (l) {
                    if (i - l === 2) {
                        rangeWithDots.push(l + 1);
                    } else if (i - l !== 1) {
                        rangeWithDots.push('...');
                    }
                }
                rangeWithDots.push(i);
                l = i;
            }

            return rangeWithDots;
        },

        startIndex() {
            return (this.currentPage - 1) * this.perPage + 1;
        },

        endIndex() {
            return Math.min(this.currentPage * this.perPage, this.filteredBiens.length);
        },
    },

    async mounted() {
        await this.loadService();
        await this.loadBiensImmobiliers();
        await this.loadStatistics();
    },

    methods: {
        // ============================================
        // CHARGEMENT DES DONNÉES
        // ============================================

        async loadService() {
            try {
                const response = await this.$store.dispatch('typeBiens/getAll');
                this.services = response || [];
            } catch (error) {
                console.error('Erreur chargement services:', error);
            }
        },

        async loadBiensImmobiliers() {
            const loader = this.$loading.show();
            try {
                const response = await this.$store.dispatch('biensImmobiliers/getBiensByUser', {
                    page: 0,
                    size: 1000
                });

                if (response && response.content && Array.isArray(response.content)) {
                    this.biensOriginaux = response.content.filter(bien => bien && bien.id);
                } else if (Array.isArray(response)) {
                    this.biensOriginaux = response.filter(bien => bien && bien.id);
                } else {
                    this.biensOriginaux = [];
                }

                console.log('✅ Biens chargés:', this.biensOriginaux.length);
            } catch (error) {
                console.error('❌ Erreur chargement biens:', error);
                ElMessage.error('Erreur lors du chargement des biens');
            } finally {
                loader.hide();
            }
        },

        async loadStatistics() {
            try {
                // Calculer les statistiques à partir des biens
                const biens = this.biensOriginaux;

                this.stats.totalBiens = biens.length;
                this.stats.biensLoues = biens.filter(b => b.statut === 'LOUE').length;
                this.stats.biensDisponibles = biens.filter(b => b.statut === 'DISPONIBLE').length;

                // Revenus (à adapter selon votre structure)
                this.stats.revenuTotal = biens
                    .filter(b => b.statut === 'LOUE')
                    .reduce((sum, b) => sum + (b.prix || 0), 0);

                // Biens créés ce mois
                const thisMonth = new Date().getMonth();
                const thisYear = new Date().getFullYear();
                this.stats.nouveauxCeMois = biens.filter(b => {
                    const date = new Date(b.dateCreation);
                    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
                }).length;

                // Vues totales
                this.stats.vuesTotales = biens.reduce((sum, b) => sum + (b.vues || 0), 0);

                // Favoris
                this.stats.favorisTotal = biens.reduce((sum, b) => sum + (b.favoris || 0), 0);

                // Note moyenne
                const notesValides = biens.filter(b => b.note > 0);
                if (notesValides.length > 0) {
                    const sommeNotes = notesValides.reduce((sum, b) => sum + b.note, 0);
                    this.stats.noteMoyenne = (sommeNotes / notesValides.length).toFixed(1);
                } else {
                    this.stats.noteMoyenne = 0;
                }

                // Messages non lus (à adapter selon votre API)
                this.stats.messagesNonLus = 0; // À implémenter

                // Évolution revenu (à adapter)
                this.stats.evolutionRevenu = 0; // À implémenter

            } catch (error) {
                console.error('Erreur calcul statistiques:', error);
            }
        },

        // ============================================
        // FILTRES ET RECHERCHE
        // ============================================

        debouncedSearch() {
            clearTimeout(this.searchDebounce);
            this.searchDebounce = setTimeout(() => {
                this.applyFilters();
            }, 500);
        },

        applyFilters() {
            this.currentPage = 1;
        },

        resetFilters() {
            this.searchFilters = {
                globalSearch: '',
                type: '',
                statut: '',
                prixMin: null,
                prixMax: null,
            };
            this.sortKey = 'dateCreation';
            this.sortOrder = 'desc';
            this.currentPage = 1;
        },

        filterByStatus(status) {
            this.searchFilters.statut = status;
            this.applyFilters();
        },

        sortBiens() {
            // Le tri est géré automatiquement par le computed
            this.currentPage = 1;
        },

        // ============================================
        // PAGINATION
        // ============================================

        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },

        // ============================================
        // SÉLECTION
        // ============================================

        toggleSelectAll() {
            if (this.selectAll) {
                this.selectedBiens = this.paginatedBiens.map(b => b.id);
            } else {
                this.selectedBiens = [];
            }
        },

        isSelected(id) {
            return this.selectedBiens.includes(id);
        },

        // ============================================
        // ACTIONS GROUPÉES
        // ============================================

        async executeBulkAction() {
            if (!this.bulkAction || this.selectedBiens.length === 0) {
                ElMessage.warning('Veuillez sélectionner des biens');
                return;
            }

            try {
                await ElMessageBox.confirm(
                    `Êtes-vous sûr de vouloir ${this.bulkAction === 'delete' ? 'supprimer' : this.bulkAction === 'archive' ? 'archiver' : 'publier'} ${this.selectedBiens.length} bien(s) ?`,
                    'Confirmation',
                    {
                        confirmButtonText: 'Oui',
                        cancelButtonText: 'Annuler',
                        type: 'warning',
                    }
                );

                const loader = this.$loading.show();

                switch (this.bulkAction) {
                    case 'delete':
                        await Promise.all(
                            this.selectedBiens.map(id =>
                                this.$store.dispatch('biensImmobiliers/delete', id)
                            )
                        );
                        ElMessage.success('Biens supprimés avec succès');
                        break;

                    case 'archive':
                        await Promise.all(
                            this.selectedBiens.map(id =>
                                this.$store.dispatch('biensImmobiliers/update', {
                                    id,
                                    statut: 'ARCHIVE'
                                })
                            )
                        );
                        ElMessage.success('Biens archivés avec succès');
                        break;

                    case 'publish':
                        await Promise.all(
                            this.selectedBiens.map(id =>
                                this.$store.dispatch('biensImmobiliers/update', {
                                    id,
                                    statut: 'DISPONIBLE'
                                })
                            )
                        );
                        ElMessage.success('Biens publiés avec succès');
                        break;
                }

                this.selectedBiens = [];
                this.selectAll = false;
                this.bulkAction = '';

                await this.loadBiensImmobiliers();
                await this.loadStatistics();

                loader.hide();

            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur action groupée:', error);
                    ElMessage.error('Erreur lors de l\'opération');
                }
            }
        },

        // ============================================
        // ACTIONS SUR UN BIEN
        // ============================================

        openEditModal(bien) {
            this.editBien = { ...bien };
            this.showEditModal = true;
        },

        async saveEditBien() {
            if (!this.editBien.nom || !this.editBien.prix) {
                ElMessage.warning('Veuillez remplir tous les champs obligatoires');
                return;
            }

            const loader = this.$loading.show();
            try {
                await this.$store.dispatch('biensImmobiliers/update', this.editBien);
                ElMessage.success('Bien mis à jour avec succès');
                this.showEditModal = false;
                await this.loadBiensImmobiliers();
                await this.loadStatistics();
            } catch (error) {
                console.error('Erreur mise à jour:', error);
                ElMessage.error('Erreur lors de la mise à jour');
            } finally {
                loader.hide();
            }
        },

        async deleteBien(id) {
            try {
                await ElMessageBox.confirm(
                    'Êtes-vous sûr de vouloir supprimer ce bien ? Cette action est irréversible.',
                    'Confirmation',
                    {
                        confirmButtonText: 'Oui, supprimer',
                        cancelButtonText: 'Annuler',
                        type: 'warning',
                    }
                );

                const loader = this.$loading.show();
                await this.$store.dispatch('biensImmobiliers/delete', id);
                ElMessage.success('Bien supprimé avec succès');

                await this.loadBiensImmobiliers();
                await this.loadStatistics();

                loader.hide();
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur suppression:', error);
                    ElMessage.error('Erreur lors de la suppression');
                }
            }
        },

        async archiveBien(id) {
            try {
                const loader = this.$loading.show();
                await this.$store.dispatch('biensImmobiliers/update', {
                    id,
                    statut: 'ARCHIVE'
                });
                ElMessage.success('Bien archivé avec succès');

                await this.loadBiensImmobiliers();
                await this.loadStatistics();

                loader.hide();
            } catch (error) {
                console.error('Erreur archivage:', error);
                ElMessage.error('Erreur lors de l\'archivage');
            }
        },

        async duplicateBien(bien) {
            try {
                await ElMessageBox.confirm(
                    'Voulez-vous créer une copie de ce bien ?',
                    'Duplication',
                    {
                        confirmButtonText: 'Oui, dupliquer',
                        cancelButtonText: 'Annuler',
                        type: 'info',
                    }
                );

                const loader = this.$loading.show();

                const copie = {
                    ...bien,
                    id: null,
                    nom: `${bien.nom} (Copie)`,
                    dateCreation: new Date().toISOString(),
                    statut: 'DISPONIBLE',
                };

                await this.$store.dispatch('biensImmobiliers/create', copie);
                ElMessage.success('Bien dupliqué avec succès');

                await this.loadBiensImmobiliers();
                await this.loadStatistics();

                loader.hide();
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur duplication:', error);
                    ElMessage.error('Erreur lors de la duplication');
                }
            }
        },

        toggleFavorite(bien) {
            if (!bien || !bien.id) return;

            bien.isFavorite = !bien.isFavorite;

            this.$store.dispatch('biensImmobiliers/updateFavoriteStatus', {
                id: bien.id,
                isFavorite: bien.isFavorite
            }).catch(err => {
                console.error('Erreur favori:', err);
                bien.isFavorite = !bien.isFavorite;
            });
        },

        // ============================================
        // UTILITAIRES
        // ============================================

        formatCurrency(value) {
            if (value == null || value === '') return '—';
            const numValue = Number(value);
            if (isNaN(numValue)) return '—';

            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0,
            }).format(numValue);
        },

        formatDate(date) {
            if (!date) return '—';
            return new Date(date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },

        capitalize(value) {
            if (!value) return '';
            return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        },

        getImageUrl(idfile) {
            if (!idfile) return '';
            return `${API_URLS.API_BASE}/fichier/download/${idfile}`;
        },

        handleImageError(event, bien) {
            console.warn('Erreur image pour bien:', bien.id);
            event.target.style.display = 'none';

            const placeholder = document.createElement('div');
            placeholder.className = 'card-img rounded-2 bg-light d-flex align-items-center justify-content-center';
            placeholder.style.height = '120px';
            placeholder.innerHTML = '<i class="bi bi-image text-muted" style="font-size: 2rem;"></i>';
            event.target.parentNode.appendChild(placeholder);
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'DISPONIBLE': 'bg-success',
                'LOUE': 'bg-info',
                'MAINTENANCE': 'bg-warning',
                'ARCHIVE': 'bg-secondary',
            };
            return classes[statut] || 'bg-secondary';
        },

        getStatutLabel(statut) {
            const labels = {
                'DISPONIBLE': 'Disponible',
                'LOUE': 'Loué',
                'MAINTENANCE': 'Maintenance',
                'ARCHIVE': 'Archivé',
            };
            return labels[statut] || statut;
        },
    },
};
</script>

<style scoped>
/* Styles des cartes */
.listing-item {
    transition: all 0.3s ease;
}

.listing-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.listing-item.selected {
    border-color: #0d6efd;
    background-color: #f0f7ff;
}

/* Images */
.card-img {
    width: 100%;
    height: 120px;
    object-fit: cover;
}

/* Stats icons */
.icon-box {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Responsive */
@media (max-width: 768px) {
    .card-img {
        height: 150px;
    }
}
</style>