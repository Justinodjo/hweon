<template>
    <div class="page-content pt-0 bloc">
        <!-- Page main content START -->
        <div class="page-content-wrapper vstack container gap-4">
            <!-- Title -->
            <div class="row">
                <div class="col-sm-12 mb-5">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <h1 class="h3 mb-2 mb-sm-0">Chambres et Appartements</h1>
                        <div class="d-grid"><a @click="newChambre" class="btn btn-primary-soft mb-0"><i
                                    class="bi bi-plus-lg fa-fw"></i> Nouvelle Chambre</a></div>
                    </div>
                </div>
            </div>

            <!-- Counter START -->
            <div class="row  g-4 mb-5">
                <!-- Counter item -->
                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <!-- Number -->
                            <div class="me-2">
                                <span>New Booked Rooms</span>
                                <h3 class="mb-0 mt-2">54</h3>
                            </div>
                            <!-- Icon -->
                            <div
                                class="icon-lg rounded-circle flex-shrink-0 bg-primary bg-opacity-10 text-primary mb-0">
                                <i class="bi bi-door-open fa-fw"></i>
                            </div>
                        </div>
                        <!-- Progress bar -->
                        <div class="progress progress-xs bg-primary bg-opacity-10 mb-2">
                            <div class="progress-bar bg-primary" role="progressbar" style="width: 60%"
                                aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
                            </div>
                        </div>
                        <span><span class="text-primary">16 new rooms booked</span> today</span>
                    </div>
                </div>

                <!-- Counter item -->
                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <!-- Number -->
                            <div class="me-2">
                                <span>Cancelled Rooms</span>
                                <h3 class="mb-0 mt-2">12</h3>
                            </div>
                            <!-- Icon -->
                            <div class="icon-lg rounded-circle flex-shrink-0 bg-danger bg-opacity-10 text-danger mb-0">
                                <i class="bi bi-x-circle fa-fw"></i>
                            </div>
                        </div>
                        <!-- Progress bar -->
                        <div class="progress progress-xs bg-danger bg-opacity-10 mb-2">
                            <div class="progress-bar bg-danger" role="progressbar" style="width: 60%" aria-valuenow="60"
                                aria-valuemin="0" aria-valuemax="100">
                            </div>
                        </div>
                        <span><span class="text-danger">2 canceled rooms</span> today</span>
                    </div>
                </div>

                <!-- Counter item -->
                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <!-- Number -->
                            <div class="me-2">
                                <span>Check-in</span>
                                <h3 class="mb-0 mt-2">20</h3>
                            </div>
                            <!-- Icon -->
                            <div
                                class="icon-lg rounded-circle flex-shrink-0 bg-success bg-opacity-10 text-success mb-0">
                                <i class="bi bi-box-arrow-in-right fa-fw"></i>
                            </div>
                        </div>
                        <!-- Progress bar -->
                        <div class="progress progress-xs bg-success bg-opacity-10 mb-2">
                            <div class="progress-bar bg-success" role="progressbar" style="width: 60%"
                                aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
                            </div>
                        </div>
                        <span><span class="text-success">45 reservation</span> incoming</span>
                    </div>
                </div>

                <!-- Counter item -->
                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <!-- Number -->
                            <div class="me-2">
                                <span>Check-out</span>
                                <h3 class="mb-0 mt-2">28</h3>
                            </div>
                            <!-- Icon -->
                            <div class="icon-lg rounded-circle flex-shrink-0 bg-orange bg-opacity-10 text-orange mb-0">
                                <i class="bi bi-box-arrow-right fa-fw"></i>
                            </div>
                        </div>
                        <!-- Progress bar -->
                        <div class="progress progress-xs bg-orange bg-opacity-10 mb-2">
                            <div class="progress-bar bg-orange" role="progressbar" style="width: 60%" aria-valuenow="60"
                                aria-valuemin="0" aria-valuemax="100">
                            </div>
                        </div>
                        <span><span class="text-orange">30 reservation</span> outgoing</span>
                    </div>
                </div>
            </div>
            <!-- Counter END -->

            <!-- Tabs and search START -->
            <div class="row g-4 justify-content-between align-items-center">
                <div class="col-lg-5">
                    <!-- Tabs -->
                    <ul class="nav nav-pills-shadow nav-responsive">
                        <li class="nav-item">
                            <a class="nav-link mb-0 me-sm-2" data-bs-toggle="tab"
                                :class="{ active: statusFilter === 'all' }" @click="statusFilter = 'all'">All Status</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link mb-0 me-sm-2" data-bs-toggle="tab"
                                :class="{ active: statusFilter === 'available' }"
                                @click="statusFilter = 'available'">Available</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link mb-0" data-bs-toggle="tab"
                                :class="{ active: statusFilter === 'sold-out' }" @click="statusFilter = 'sold-out'">Sold
                                Out</a>
                        </li>
                    </ul>
                </div>

                <div class="col-lg-6 col-xxl-5">
                    <div class="d-sm-flex gap-4 justify-content-between justify-content-lg-end">
                        <!-- Search -->
                        <div class="col-md-8">
                            <form class="rounded position-relative" @submit.prevent>
                                <input class="form-control bg-transparent" type="search" v-model="searchQuery"
                                    placeholder="Search" aria-label="Search">
                                <button
                                    class="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset"
                                    type="submit">
                                    <i class="fas fa-search fs-6"></i>
                                </button>
                            </form>
                        </div>
                        <!-- Tabs -->
                        <div class="d-flex justify-content-end mt-2 mt-sm-0">
                            <ul class="nav nav-pills nav-pills-dark" id="room-pills-tab" role="tablist">
                                <!-- Tab item -->
                                <li class="nav-item">
                                    <button class="nav-link rounded-start rounded-0 active" id="grid-tab"
                                        data-bs-toggle="tab" data-bs-target="#grid-tab-pane" type="button" role="tab"
                                        aria-controls="grid-tab-pane" aria-selected="true"><i
                                            class="bi fa-fw bi-grid-fill"></i></button>
                                </li>
                                <!-- Tab item -->
                                <li class="nav-item">
                                    <button class="nav-link rounded-end rounded-0" id="list-tab" data-bs-toggle="tab"
                                        data-bs-target="#list-tab-pane" type="button" role="tab"
                                        aria-controls="list-tab-pane" aria-selected="false"><i
                                            class="bi fa-fw bi-list-ul"></i></button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Tabs and search END -->

            <!-- Tab content START -->
            <div class="tab-content mt-5" id="myTabContent">
                <!-- Content item START -->
                <div class="tab-pane fade show active" id="grid-tab-pane">
                    <!-- Rooms START -->
                    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xxl-5 g-4">
                        <div v-if="chambres.length === 0" class="text-center text-muted my-5">
                            Aucun bien immobilier trouvé.
                        </div>
                        <!-- Room item -->
                        <div v-else class="col" v-for="(chambre, index) in paginatedChambres" :key="index">
                            <div class="card shadow h-100">
                                <!-- Overlay item -->
                                <div class="position-relative">
                                    <!-- Image -->
                                    <img :src="getImageUrl(chambre.fichier?.id)" :data-gallery="'gallery' + chambre.id"
                                        class="card-img-top glightbox" :data-title="chambre.nomdetails"
                                        alt="Card image">
                                    <!-- Overlay -->
                                    <div class="card-img-overlay d-flex flex-column p-3">
                                        <!-- Card overlay top -->
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div class="badge text-bg-dark"><i
                                                    class="bi fa-fw bi-star-fill me-2 text-warning"></i>{{ chambre.note
                                                        || 4.0 }}
                                            </div>
                                            <!-- Buttons -->
                                            <div class="list-inline-item dropdown">
                                                <!-- Dropdown button -->
                                                <a href="admin-booking-list.html#"
                                                    class="btn btn-sm btn-round btn-light" role="button"
                                                    id="dropdownAction1" data-bs-toggle="dropdown"
                                                    aria-expanded="false">
                                                    <i class="bi bi-three-dots-vertical"></i>
                                                </a>
                                                <!-- dropdown items -->
                                                <ul class="dropdown-menu dropdown-menu-end min-w-auto shadow rounded small"
                                                    aria-labelledby="dropdownAction1">
                                                    <li><a class="dropdown-item" href="admin-booking-list.html#"><i
                                                                class="bi bi-info-circle me-2"></i>Report</a>
                                                    </li>
                                                    <li class="dropdown-item">
                                                        <i class="form-check form-switch m-0">
                                                            <input class="form-check-input" type="checkbox"
                                                                :id="'switch-' + chambre.id"
                                                                v-model="chambre.disponible"
                                                                @change="toggleDisponibilite(chambre)">
                                                            <label class="form-check-label ms-2"
                                                                :for="'switch-' + chambre.id">
                                                                {{ chambre.status ? 'Actif' : 'Inactif' }}
                                                            </label>
                                                        </i>
                                                    </li>

                                                    <li>
                                                        <a class="dropdown-item" @click="editChambre(chambre)">
                                                            <i class="bi bi-pencil-square me-2"></i>Modifier
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a class="dropdown-item text-danger"
                                                            @click="deleteChambre(chambre.id)">
                                                            <i class="bi bi-trash me-2"></i>Supprimer
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Card body START -->
                                <div class="card-body px-3">
                                    <!-- Title -->
                                    <h5 class="card-title mb-1"><a href="admin-booking-detail.html">{{
                                        chambre.nomdetails }}</a></h5>
                                    <ul class="list-group list-group-borderless small mt-2 mb-0">
                                        <li class="list-group-item pb-0">
                                            <i class="fa-solid fa-building fa-fw me-2"></i>DPE: {{ chambre.typeDPE }}
                                        </li>
                                        <li class="list-group-item pb-0">
                                            <i class="fa-solid fa-bed fa-fw me-2"></i>Chambres: {{
                                                chambre.nombre }}
                                        </li>
                                    </ul>
                                </div>
                                <!-- Card body END -->

                                <!-- Card footer START-->
                                <div class="card-footer pt-0">
                                    <!-- Price -->
                                    <div class="hstack gap-2 mb-2">
                                        <h6 class="fw-normal mb-0">{{ formatCurrency(chambre.prix) }}</h6>
                                        <!-- <small>/per person</small> -->
                                    </div>
                                    <a href="admin-booking-detail.html"
                                        class="btn btn-sm btn-primary-soft mb-0 w-100">View
                                        detail</a>
                                </div>
                            </div>
                        </div>



                    </div>
                    <!-- Rooms END -->

                    <!-- Pagination START -->
                    <div class="d-sm-flex justify-content-sm-between align-items-sm-center mt-4">
                        <!-- Content -->
                        <p class="mb-sm-0 text-center text-sm-start">Showing 1 to 8 of 20 entries</p>
                        <!-- Pagination -->
                        <nav class="mb-sm-0 d-flex justify-content-center" aria-label="navigation">
                            <ul class="pagination pagination-sm pagination-primary-soft mb-0">
                                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                    <a class="page-link" @click.prevent="goToPage(currentPage - 1)">Prev</a>
                                </li>

                                <li v-for="page in totalPages" :key="page" class="page-item"
                                    :class="{ active: currentPage === page }">
                                    <a class="page-link" @click.prevent="goToPage(page)">{{ page }}</a>
                                </li>

                                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                    <a class="page-link" @click.prevent="goToPage(currentPage + 1)">Next</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <!-- Pagination END -->
                </div>
                <!-- Content item END -->

                <!-- Content item START -->
                <div class="tab-pane fade" id="list-tab-pane">
                    <div class="card shadow">

                        <!-- Card body START -->
                        <div class="card-body">
                            <!-- Table head -->
                            <div class="bg-light rounded p-3 d-none d-xxl-block">
                                <div class="row row-cols-6 g-4">
                                    <div class="col">
                                        <h6 class="mb-0">Room Name</h6>
                                    </div>
                                    <div class="col">
                                        <h6 class="mb-0">Bed Type</h6>
                                    </div>
                                    <div class="col">
                                        <h6 class="mb-0">Room Floor</h6>
                                    </div>
                                    <div class="col">
                                        <h6 class="mb-0">Amount</h6>
                                    </div>
                                    <div class="col">
                                        <h6 class="mb-0">Rating</h6>
                                    </div>
                                    <div class="col">
                                        <h6 class="mb-0">Action</h6>
                                    </div>
                                </div>
                            </div>


                            <div class="row row-cols-6 g-4 border-bottom py-2" v-for="chambre in paginatedChambres"
                                :key="chambre.id">
                                <div class="col">
                                    {{ chambre.nomdetails }}
                                </div>
                                <div class="col">
                                    {{ chambre.typeDPE }}
                                </div>
                                <div class="col">
                                    {{ chambre.nombre }}
                                </div>
                                <div class="col">
                                    {{ formatCurrency(chambre.prix) }}
                                </div>
                                <div class="col">
                                    <span class="badge bg-warning text-dark">{{ chambre.note || 4.0 }}</span>
                                </div>
                                <div class="col">
                                    <button class="btn btn-sm btn-outline-primary"
                                        @click="editChambre(chambre)">✏️</button>
                                    <button class="btn btn-sm btn-outline-danger"
                                        @click="deleteChambre(chambre.id)">🗑️</button>
                                </div>
                            </div>

                        </div>
                        <!-- Card body END -->

                        <!-- Card footer START -->
                        <div class="card-footer pt-0">
                            <!-- Pagination and content -->
                            <div class="d-sm-flex justify-content-sm-between align-items-sm-center">
                                <!-- Content -->
                                <p class="mb-sm-0 text-center text-sm-start">Showing 1 to 8 of 20 entries
                                </p>
                                <!-- Pagination -->
                                <nav class="mb-sm-0 d-flex justify-content-center" aria-label="navigation">
                                    <ul class="pagination pagination-sm pagination-primary-soft mb-0">
                                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                            <a class="page-link" @click.prevent="goToPage(currentPage - 1)">Prev</a>
                                        </li>

                                        <li v-for="page in totalPages" :key="page" class="page-item"
                                            :class="{ active: currentPage === page }">
                                            <a class="page-link" @click.prevent="goToPage(page)">{{ page }}</a>
                                        </li>

                                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                            <a class="page-link" @click.prevent="goToPage(currentPage + 1)">Next</a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                        <!-- Card footer END -->
                    </div>
                </div>
                <!-- Content item END -->
            </div>
            <!-- Tab content END -->
        </div>
        <!-- Modal Confirmation Suppression -->
        <div class="modal fade" id="confirmDeleteModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirmation</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        Voulez-vous vraiment supprimer cette chambre ?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-danger" @click="confirmDelete">Supprimer</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Ajouter / Modifier -->
        <div class="modal fade" id="chambreModal" tabindex="-1" aria-labelledby="chambreModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="chambreModalLabel">
                            {{ chambreToEdit ? "Modifier Chambre" : "Nouvelle Chambre" }}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="mb-3">
                                <label class="form-label">Nom de la chambre</label>
                                <input type="text" class="form-control" v-model="chambreForm.nomdetails"
                                    placeholder="Nom de la chambre" />
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Type DPE</label>
                                <input type="text" class="form-control" v-model="chambreForm.typeDPE"
                                    placeholder="Type DPE" />
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Nombre de lits</label>
                                <input type="number" class="form-control" v-model="chambreForm.nombre" min="1" />
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Prix</label>
                                <input type="number" class="form-control" v-model="chambreForm.prix" min="0" />
                            </div>

                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="disponible"
                                    v-model="chambreForm.disponible">
                                <label class="form-check-label" for="disponible">Disponible</label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="saveChambre" data-bs-dismiss="modal">
                            {{ chambreToEdit ? "Mettre à jour" : "Ajouter" }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <!-- Page main content END -->
</template>
<script>
import { tns } from 'tiny-slider';
// import { mapActions, mapGetters } from "vuex";
import { ref, onMounted, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from "element-plus";
import { API_URLS } from "@/config/api";
import { useStore } from 'vuex'
import { useLoading } from "vue-loading-overlay";
import L from 'leaflet';
import GLightbox from 'glightbox'
import 'glightbox/dist/css/glightbox.min.css'
import 'leaflet/dist/leaflet.css'


export default {
    props: {

    },
    data() {
        return {
            biens: null,
            chambres: [],
            searchQuery: "",
            chambreToDelete: null,
            statusFilter: "all",
            currentPage: 1,
            perPage: 8,
            isLoading: false,
            map: null,
            lightbox: null,
            chambreToEdit: null,
            chambreForm: {
                nomdetails: "",
                typeDPE: "",
                nombre: 1,
                prix: 0,
                disponible: true,
            }
        }
    },
    mounted() {
        const bienId = Number(this.$route.params.id);
        this.fetchBiens(bienId);
        this.$nextTick(() => {
            this.initializeLightbox();
        });
        // this.$nextTick(() => {
        //     this.initializeMap();
        //     this.initializeLightbox();
        // });
    },
    watch: {
        'bienId'(newBienId) {
            if (newBienId && newBienId !== this.bienId) {
                this.changerType(parseInt(newBienId));
            }
        },
        searchQuery() {
            this.currentPage = 1; // reset pagination quand on recherche
        },
        statusFilter() {
            this.currentPage = 1; // reset pagination quand on change de filtre
        }
    },
    computed: {
        filteredChambres() {
            let list = this.chambres;

            // 🔍 Filtre recherche
            if (this.searchQuery) {
                list = list.filter(c =>
                    c.nomdetails?.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }

            // 📌 Filtre statut
            if (this.statusFilter === "available") {
                list = list.filter(c => c.disponible === true);
            } else if (this.statusFilter === "sold-out") {
                list = list.filter(c => c.disponible === false);
            }

            return list;
        },
        paginatedChambres() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredChambres.slice(start, start + this.perPage);
        },
        totalPages() {
            return Math.ceil(this.filteredChambres.length / this.perPage);
        }
    },
    methods: {

        async fetchBiens(bienId) {
            this.isLoading = true;
            try {

                console.log("ID récupéré:", bienId);
                // 👉 Tu peux appeler ton store ou ton API ici
                const response = await this.$store.dispatch("biensImmobiliers/getOne", bienId);
                console.log("Détails du bien:", response);
                this.biens = response;
                this.chambres = response.detailsBiensImmobiliers;

                console.log("Chambres du bien:", this.chambres);
                return response;
            } catch (error) {
                console.error("Error fetching pièces:", error);
                ElMessage.error("Failed to load pièces.");
            } finally {
                this.isLoading = false;
            }
        },
        async toggleDisponibilite(chambre) {
            try {
                await this.$store.dispatch("biensImmobiliers/updateChambre", {
                    ...chambre,
                    status: chambre.status
                });
                console.log("Disponibilité changée:", chambre.nomdetails, chambre.status);
            } catch (error) {
                console.error("Erreur maj dispo:", error);
                // rollback si échec
                chambre.status = !chambre.status;
            }
        },
        initializeLightbox() {
            if (this.lightbox) return; // Prevent re-initialization

            this.lightbox = GLightbox({
                selector: '.glightbox'
            });
        },
        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        getImageUrl(idfile) {

            // return `https://93.115.20.172:8081/fichier/download/${idfile}`;
            return `${API_URLS.API_BASE}/fichier/download/${idfile}`;

        },
        formatCurrency(value) {
            if (!value) return '—';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0,
            }).format(value);
        },
        // ➕ Nouvelle chambre
        newChambre() {
            this.chambreToEdit = null;
            this.chambreForm = { nomdetails: "", typeDPE: "", nombre: 1, prix: 0, disponible: true };
            const modal = new bootstrap.Modal(document.getElementById("chambreModal"));
            modal.show();
        },

        // ✏️ Modifier chambre
        editChambre(chambre) {
            this.chambreToEdit = chambre;
            this.chambreForm = { ...chambre };
            const modal = new bootstrap.Modal(document.getElementById("chambreModal"));
            modal.show();
        },

        // 💾 Sauvegarde
        async saveChambre() {
            const payload = { ...this.chambreForm, biensImmobiliers: { id: this.bienId } };

            if (this.chambreToEdit) {
                const updated = await this.$store.dispatch("detailsBiensImmobiliers/update", payload);
                Object.assign(this.chambreToEdit, updated);
            } else {
                const newChambre = await this.$store.dispatch("detailsBiensImmobiliers/create", payload);
                this.chambres.push(newChambre);

                // ⚡ Mettre à jour le bien courant pour inclure cette nouvelle chambre
                this.biens.detailsBiensImmobiliers.push(newChambre);
            }
        },

        deleteChambre(id) {
            this.chambreToDelete = id;
            const modal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
            modal.show();
        },
        async confirmDelete() {
            await this.$store.dispatch("biensImmobiliers/deleteChambre", this.chambreToDelete);
            this.chambres = this.chambres.filter(c => c.id !== this.chambreToDelete);
            this.chambreToDelete = null;
        }
    }

}

</script>



<style>
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