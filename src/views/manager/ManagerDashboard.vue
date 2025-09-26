<template>
    <main class="py-5">
        <section class="">
            <div class="container">
                <!-- Modal for showing reservation details -->
                <div class="modal fade " id="reservationModal" tabindex="-1" aria-labelledby="reservationModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="reservationModalLabel">Détails de la Réservation</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <p><strong>Nom:</strong> {{ selectedReservation.nom || 'N/A' }} {{
                                    selectedReservation.prenom || 'N/A' }}</p>
                                <p><strong>Contact:</strong> {{ selectedReservation.contact || 'N/A' }}</p>
                                <p><strong>Email:</strong> {{ selectedReservation.email || 'N/A' }}</p>
                                <p><strong>Date de réservation:</strong> {{ selectedReservation.dateReservation || 'N/A'
                                }}</p>
                                <div><strong>Type réservation:</strong>
                                    <table class="table align-middle p-4 mb-0 table-hover table-shrink">
                                        <thead class="table-light">
                                            <tr>
                                                <th scope="col" class="border-0 rounded-start">#</th>
                                                <th scope="col" class="border-0">Nom</th>
                                                <th scope="col" class="border-0">Prix</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="reser in selectedReservation.typeServices" :key="reser.id">
                                                <td>{{ reser.id || 'N/A'
                                                }}</td>
                                                <td>{{ reser.nom || 'N/A'
                                                }}</td>
                                                <td>{{ reser.prix || 'N/A'
                                                }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p><strong>Status:</strong> <span
                                        :class="['badge', getStatusClass(selectedReservation.status)]">{{
                                            selectedReservation.status || 'N/A' }}</span></p>
                                <p><strong>Payment Status:</strong> Full payment</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="card rounded-3 border p-3 pb-2">
                    <!-- Avatar and info START -->
                    <div class="d-sm-flex align-items-center">
                        <div class="avatar avatar-xl mb-2 mb-sm-0">
                            <img class="avatar-img rounded-circle" src="../../assets/images/avatar/01.jpg" alt="">
                        </div>
                        <h4 class="mb-2 mb-sm-0 ms-sm-3"><span class="fw-light">Hello</span> Gestionnaire</h4>

                    </div>
                    <!-- Avatar and info START -->

                    <!-- Responsive navbar toggler -->
                    <button class="btn btn-primary w-100 d-block d-xl-none mt-2" type="button"
                        data-bs-toggle="offcanvas" data-bs-target="#dashboardMenu" aria-controls="dashboardMenu">
                        <i class="bi bi-list"></i> Dashboard Menu
                    </button>

                    <!-- Nav links START -->
                    <div class="offcanvas-xl offcanvas-end mt-xl-3" tabindex="-1" id="dashboardMenu">
                        <div class="offcanvas-header border-bottom p-3">
                            <h5 class="offcanvas-title">Menu</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="offcanvas"
                                data-bs-target="#dashboardMenu" aria-label="Close"></button>
                        </div>
                        <!-- Offcanvas body -->
                        <div class="offcanvas-body p-3 p-xl-0">
                            <!-- Nav item -->
                            <div class="navbar navbar-expand-xl">
                                <ul class="navbar-nav navbar-offcanvas-menu">

                                    <li class="nav-item"> <router-link class="nav-link active"
                                            to="/manager_dashboard"><i
                                                class="bi bi-house-door fa-fw me-1"></i>Accueil</router-link> </li>

                                    <li class="nav-item"> <router-link class="nav-link" to="/manager_service"><i
                                                class="bi bi-journals fa-fw me-1"></i>Services</router-link> </li>

                                    <li class="nav-item"> <router-link class="nav-link" to="/manager_sousService"><i
                                                class="bi bi-bell fa-fw me-1"></i>Sous-Services</router-link> </li>

                                    <li class="nav-item"><router-link class="nav-link" to="/manager_produits"><i
                                                class="bi bi-star fa-fw me-1"></i>Produits</router-link></li>
                                    <!-- <li class="nav-item"><router-link class="nav-link" to="/manager_user"><i
                                                class="bi bi-star fa-fw me-1"></i>Users</router-link></li> -->
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!-- Nav links END -->
                </div>
            </div>
        </section>

        <section class="pt-0">
            <div class="container vstack gap-4">
                <!-- Title START -->
                <div class="row">
                    <div class="col-12">
                        <h1 class="fs-4 mb-0"><i class="bi bi-house-door fa-fw me-1"></i>Accueil</h1>
                    </div>
                </div>
                <!-- Title END -->

                <!-- Counter START -->
                <div class="row g-4">
                    <!-- Counter item -->
                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body border">
                            <div class="d-flex align-items-center">
                                <!-- Icon -->
                                <div class="icon-xl bg-success rounded-3 text-white">
                                    <i class="bi bi-journals"></i>
                                </div>
                                <!-- Content -->
                                <div class="ms-3">
                                    <!-- <h4>56</h4> -->
                                    <h4>{{ totalReservations }}</h4>
                                    <span>Réservations</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Counter item -->
                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body border">
                            <div class="d-flex align-items-center">
                                <!-- Icon -->
                                <div class="icon-xl bg-info rounded-3 text-white">
                                    <i class="bi bi-graph-up-arrow"></i>
                                </div>
                                <!-- Content -->
                                <div class="ms-3">
                                    <!-- <h4>$2,55,365</h4> -->
                                    <h4>{{ chiffreAffaires.toLocaleString() }}</h4>
                                    <span>CA</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Counter item -->
                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body border">
                            <div class="d-flex align-items-center">
                                <!-- Icon -->
                                <div class="icon-xl bg-warning rounded-3 text-white">
                                    <i class="bi bi-bar-chart-line-fill"></i>
                                </div>
                                <!-- Content -->
                                <div class="ms-3">
                                    <!-- <h4>15K</h4> -->
                                    <h4>{{ totalVisiteurs.toLocaleString() }}</h4>
                                    <span>Visiteurs</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Counter item -->
                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body border">
                            <div class="d-flex align-items-center">
                                <!-- Icon -->
                                <div class="icon-xl bg-primary rounded-3 text-white">
                                    <i class="bi bi-star"></i>
                                </div>
                                <!-- Content -->
                                <div class="ms-3">
                                    <!-- <h4>12K</h4> -->
                                    <h4>{{ totalClients.toLocaleString() }}</h4>
                                    <span>Clients</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Booking table START -->
                <div class="row">
                    <div class="col-12">
                        <div class="card border rounded-3">
                            <!-- Card header START -->
                            <div class="card-header border-bottom">
                                <div class="d-sm-flex justify-content-between align-items-center">
                                    <h5 class="mb-2 mb-sm-0">Dernières Réservations</h5>
                                    <!-- <router-link to="/dashboard" class="btn btn-sm btn-primary mb-0">View
                                        All</router-link> -->
                                    <form class="btn btn-sm mb-0">
                                        <div class="row g-3 align-items-center justify-content-between mb-3">
                                            <select class=" col-md-8 form-select js-choice" v-model="filtrePaiement"
                                                aria-label=".form-select-sm">
                                                <option value="">Tous les paiements</option>
                                                <option value="Complet">Complet</option>
                                                <option value="Moitié payé">Moitié payé</option>
                                            </select>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <!-- Card header END -->

                            <!-- Card body START -->
                            <div class="card-body">
                                <!-- Search and select START -->
                                <div class="row g-3 align-items-center justify-content-between mb-3">
                                    <!-- Search -->
                                    <div class="col-md-8">
                                        <form class="rounded position-relative">
                                            <input class="form-control pe-5" type="search" placeholder="Search"
                                                aria-label="Search">
                                            <button
                                                class="btn border-0 px-3 py-0 position-absolute top-50 end-0 translate-middle-y"
                                                type="submit"><i class="fas fa-search fs-6"></i></button>
                                        </form>
                                    </div>

                                    <!-- Select option -->
                                    <div class="col-md-3">
                                        <!-- Short by filter -->
                                        <form>
                                            <div>
                                                <select class="form-select js-choice" v-model="filtreStatus"
                                                    aria-label=".form-select-sm">
                                                    <option value="">Tous les statuts</option>
                                                    <option value="Payé">Payé</option>
                                                    <option value="Encours">Encours</option>
                                                    <option value="Fermé">Fermé</option>
                                                </select>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <!-- Search and select END -->

                                <!-- Hotel room list START -->
                                <div class="table-responsive border-0">
                                    <table class="table align-middle p-4 mb-0 table-hover table-shrink">
                                        <!-- Table head -->
                                        <thead class="table-light">
                                            <tr>
                                                <th scope="col" class="border-0 rounded-start">#</th>
                                                <th scope="col" class="border-0">Name</th>
                                                <th scope="col" class="border-0">Contact</th>
                                                <th scope="col" class="border-0">Date</th>
                                                <th scope="col" class="border-0">E-mail</th>
                                                <th scope="col" class="border-0">status</th>
                                                <th scope="col" class="border-0">Payment</th>
                                                <th scope="col" class="border-0 rounded-end">Action</th>
                                            </tr>
                                        </thead>

                                        <!-- Table body START -->
                                        <tbody class="border-top-0">
                                            <!-- Table item -->
                                            <tr v-for="item in reservationsPaginees" :key="item">
                                                <td>
                                                    <h6 class="mb-0">{{ item.id }}</h6>
                                                </td>
                                                <td>
                                                    <h6 class="mb-0"><a href="agent-dashboard.html#">{{ item.nom + ' ' +
                                                        item.prenom }}</a></h6>
                                                </td>
                                                <td> {{ item.contact }} </td>
                                                <td>
                                                    <div>{{ item.dateReservation }} </div>
                                                </td>
                                                <td> {{ item.email }} </td>

                                                <td>
                                                    <div :class="['badge', getStatusClass(item.status)]">{{ item.status
                                                    }}</div>
                                                </td>
                                                <td>
                                                    <div class="badge bg-success bg-opacity-10 text-success">{{
                                                        item.paymentStatus
                                                    }}</div>
                                                </td>
                                                <td>
                                                    <button @click="handleViewClick(item)"
                                                        class="btn btn-sm btn-danger-light me-1 mb-1 mb-md-0">View</button>
                                                    <!-- <button @click="deleteReservation(item.id)"
                                                        class="btn btn-sm btn-danger-soft me-1 mb-1 mb-md-0">Supprimer</button> -->
                                                </td>
                                            </tr>

                                            <!-- Table item -->
                                        </tbody>
                                        <!-- Table body END -->
                                    </table>
                                </div>
                                <!-- Hotel room list END -->
                            </div>
                            <!-- Card body END -->

                            <!-- Card footer START -->
                            <div class="card-footer pt-0">
                                <!-- Pagination and content -->
                                <div class="d-sm-flex justify-content-sm-between align-items-sm-center">
                                    <!-- Content -->
                                    <p class="mb-sm-0 text-center text-sm-start">Showing 1 to 10</p>
                                    <!-- Pagination -->
                                    <nav class="mb-sm-0 d-flex justify-content-center" aria-label="navigation">
                                        <ul class="pagination pagination-sm pagination-primary-soft mb-0">
                                            <li class="page-item disabled">
                                                <a class="page-link" @click="pageActuelle--"
                                                    :disabled="pageActuelle === 1" tabindex="-1">Prev</a>
                                            </li>
                                            <li class="page-item"><a class="page-link" @click="pageActuelle = page"
                                                    :class="{ active: pageActuelle === page }">1</a></li>
                                            <li class="page-item">
                                                <a class="page-link" @click="pageActuelle++"
                                                    :disabled="pageActuelle === totalPages">Next</a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                            <!-- Card footer END -->
                        </div>
                    </div>
                </div>
                <!-- Booking table END -->
            </div>
        </section>
        <!-- =======================
Content END -->

    </main>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useLoading } from "vue-loading-overlay";
import { ElMessage, ElMessageBox } from "element-plus";


const store = useStore()
const loading = useLoading();

const categorie = ref([])
const fichier = ref([])
const typeService = ref({})
const filtreNom = ref('')
const filtreStatus = ref('')
const filtrePaiement = ref('')
const filterItems = ref([])
const selectedReservation = ref({
    nom: '',
    prenom: '',
    contact: '',
    email: '',
    dateReservation: '',
    status: '',
    paymentStatus: '',
    typeServices: [],
})

const reservationsFiltrees = computed(() => {
    return filterItems.value.filter(r => {
        const matchNom = r.nom.toLowerCase().includes(filtreNom.value.toLowerCase()) ||
            r.prenom.toLowerCase().includes(filtreNom.value.toLowerCase())

        const matchStatus = !filtreStatus.value || r.status === filtreStatus.value
        const matchPaiement = !filtrePaiement.value || r.paymentStatus === filtrePaiement.value

        return matchNom && matchStatus && matchPaiement
    })
})
// Statistiques calculées (computed) depuis filterItems
const totalReservations = computed(() => filterItems.value.length)

const chiffreAffaires = computed(() => {
    // Supposons que chaque réservation a un champ montant (ex: montantPaiement)
    return filterItems.value.reduce((acc, r) => acc + (r.prixTotal || 0), 0)
})

const totalVisiteurs = computed(() => {
    // Exemple : si vous avez un champ visiteurs dans chaque réservation ou autrement,
    // sinon ici juste une valeur factice
    return filterItems.value.reduce((acc, r) => acc + (r.userInfo.length || 1), 0)
})

const totalClients = computed(() => {
    // Par exemple, clients uniques sur base d'un id ou email
    const clientsSet = new Set(filterItems.value.map(r => r.email))
    return clientsSet.size
})


const pageActuelle = ref(1)
const taillePage = ref(10)

const totalPages = computed(() =>
    Math.ceil(reservationsFiltrees.value.length / taillePage.value)
)

const reservationsPaginees = computed(() => {
    const start = (pageActuelle.value - 1) * taillePage.value
    const end = start + taillePage.value
    return reservationsFiltrees.value.slice(start, end)
})

onMounted(() => {
    loadReservation()
    loadCategorie()
})

const loadCategorie = async () => {
    try {
        const response = await store.dispatch('sousService/getAll');
        categorie.value = response
    } catch (error) {
        console.error("Erreur lors du chargement des sous services :", error);
    }
}

const saveCategory = async () => {
    const loader = loading.show();
    try {
        const payload = {
            nom: typeService.value.nom,
            typeService: typeService.value.categorie,
        }
        const response = await store.dispatch('produits/create', payload)
        ElMessage({
            showClose: true,
            message: 'Element ajouté avec success.',
            type: "success",
        });
    } catch (error) {
        console.error('Erreur lors de la création de la catégorie:', error)
    } finally {
        loader.hide();
        loadReservation()
    }
}

const deleteReservation = async (id) => {

    await ElMessageBox.confirm(
        "Voulez-vous vraiment supprimer cette réservation ?",
        "Confirmation",
        {
            confirmButtonText: "Oui",
            cancelButtonText: "Annuler",
            type: "warning",
        }
    );
    const loader = loading.show();
    try {

        await store.dispatch('reservation/delete', id)
        ElMessage({
            showClose: true,
            message: 'Element supprimé avec success.',
            type: "success",
        });
        await loadReservation()
    } catch (error) {
        console.error("Erreur lors de la suppression :", error)
    } finally {
        loader.hide();
        loadReservation()
    }

}
const loadReservation = async () => {
    const loader = loading.show();
    try {
        const reservations = await store.dispatch('reservation/getAll');
        console.log(reservations); // Vérifier la structure des données
        filterItems.value = reservations;
    } catch (error) {
        console.error("Erreur lors du chargement des réservations:", error);
    } finally {
        loader.hide();
    }
}


const getStatusClass = (status) => {
    const statusClasses = {
        'Payé': 'text-bg-primary',  // Bleu
        'Encours': 'text-bg-danger',       // Rouge
        'Fermé': 'text-bg-success', // Vert
        'Moitié payé': 'text-bg-warning'   // Jaune
    };
    return statusClasses[status] || 'text-bg-secondary'; // Couleur par défaut (gris)
};

const handleViewClick = (reservation) => {
    if (reservation) {
        selectedReservation.value = reservation;
        const modal = new window.bootstrap.Modal(document.getElementById('reservationModal'));
        modal.show();
    } else {
        console.error('La réservation sélectionnée est invalide');
    }
};


</script>


<style lang="scss" scoped></style>