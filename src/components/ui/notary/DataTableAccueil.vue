<template>
    <section class="pt-0">
        <div class="container vstack gap-4">
            <StatCard />
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
                                            <th scope="col" class="border-0">Adresse</th>
                                            <th scope="col" class="border-0">Commune</th>
                                            <th scope="col" class="border-0">Superficie</th>
                                            <th scope="col" class="border-0">status</th>
                                            <th scope="col" class="border-0">description</th>
                                            <th scope="col" class="border-0 rounded-end">Action</th>
                                        </tr>
                                    </thead>

                                    <!-- Table body START -->
                                    <tbody class="border-top-0">
                                        <!-- Table item -->
                                        <tr v-for="item in biensPaginees" :key="item">
                                            <td>
                                                <h6 class="mb-0">{{ item.id }}</h6>
                                            </td>
                                            <td>
                                                <h6 class="mb-0"><a href="agent-dashboard.html#">{{ item.nom
                                                        }}</a>
                                                </h6>
                                            </td>
                                            <td> {{ item.adresse }} </td>
                                            <td>
                                                <div>{{ item.commune.libelle }} </div>
                                            </td>
                                            <td> {{ item.superficie }} </td>

                                            <td>
                                                <div :class="['badge', getStatusClass(item.status)]">{{
                                                    item.status
                                                        == true ? "Disponible" : "Non-disponible"
                                                }}</div>
                                            </td>
                                            <td>
                                                <div class="mb-0">{{
                                                    item.prix
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
                                <p class="text-muted mb-0">
                                    Affichage de {{ Math.min((pageActuelle - 1) * taillePage + 1,
                                        biensImmobiliers.length) }}
                                    à {{ Math.min(pageActuelle * taillePage, biensImmobiliers.length) }}
                                    sur {{ biensImmobiliers.length }} résultats
                                </p>
                                <!-- Pagination -->
                                <nav class="mb-sm-0 d-flex justify-content-center" aria-label="navigation">
                                    <ul class="pagination pagination-sm pagination-primary-soft mb-0">
                                        <li class="page-item disabled">
                                            <a class="page-link" @click="pageActuelle--" :disabled="pageActuelle === 1"
                                                tabindex="-1">Prev</a>
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
</template>
<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useLoading } from "vue-loading-overlay";
import { ElMessage, ElMessageBox } from "element-plus";
import UserDashboard from '@/components/ui/notary/UserDashboard.vue';
import ContratDetailsModal from "@/components/modal/ContratDetailsModal.vue";
import StatCard from "@/components/ui/notary/StatCard.vue";
const store = useStore()
const loading = useLoading();

const categorie = ref([])
const fichier = ref([])
const typeService = ref({})
const filtreNom = ref('')
const filtreStatus = ref('')
const filtrePaiement = ref('')
const filterItems = ref([])
const biensImmobiliers = ref([])
const typeId = ref(1)
const pageActuelle = ref(1)
const page = ref('')
const taillePage = ref(10)
const searchQuery = ref('')
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

const selectedBienImmobilier = ref({
    nom: '',
    adresse: '',
    longitude: '',
    latitude: '',
    nombreVues: '',
    nombreJaime: '',
    aVendre: '',
    commune: '',
    status: '',
    note: '',
    superficie: '',
    typeUnite: '',
    description: '',
    paymentStatus: '',
    typeBiensImmobiliere: [],
    detailsBiensImmobiliers: [],
    userInfo: [],
    fichier: [],
    equipements: [],
})

// Computed properties pour le filtrage et la pagination
const biensFilters = computed(() => {
    let filtered = biensImmobiliers.value;

    // Recherche textuelle
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim();
        filtered = filtered.filter(bien =>
            bien.nom?.toLowerCase().includes(query) ||
            bien.adresse?.toLowerCase().includes(query) ||
            bien.commune?.libelle?.toLowerCase().includes(query)
        );
    }

    // Filtres de statut et paiement
    if (filtreStatus.value) {
        filtered = filtered.filter(bien => bien.status === filtreStatus.value);
    }

    if (filtrePaiement.value) {
        filtered = filtered.filter(bien => bien.paymentStatus === filtrePaiement.value);
    }

    return filtered;
});

const biensImmobiliersFiltrees = computed(() => {
    return filterItems.value.filter(r => {
        const matchNom = r.nom.toLowerCase().includes(filtreNom.value.toLowerCase()) ||
            r.prenom.toLowerCase().includes(filtreNom.value.toLowerCase())

        const matchStatus = !filtreStatus.value || r.status === filtreStatus.value
        const matchPaiement = !filtrePaiement.value || r.paymentStatus === filtrePaiement.value

        return matchNom && matchStatus && matchPaiement
    })
})

// Pages visibles pour la pagination
const visiblePages = computed(() => {
    const total = totalBiensPages.value;
    const current = pageActuelle.value;
    const pages = [];

    if (total <= 5) {
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
    } else {
        if (current <= 3) {
            pages.push(1, 2, 3, 4, 5);
        } else if (current >= total - 2) {
            for (let i = total - 4; i <= total; i++) {
                pages.push(i);
            }
        } else {
            for (let i = current - 2; i <= current + 2; i++) {
                pages.push(i);
            }
        }
    }

    return pages;
});

const totalBiensPages = computed(() =>
    Math.ceil(biensImmobiliers.value.length / taillePage.value)
);
const biensPaginees = computed(() => {
    const start = (pageActuelle.value - 1) * taillePage.value;
    const end = start + taillePage.value;
    return biensImmobiliers.value.slice(start, end);
});
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

const totalPages = computed(() =>
    Math.ceil(biensImmobiliersFiltrees.value.length / taillePage.value)
)

// const reservationsPaginees = computed(() => {
//     const start = (pageActuelle.value - 1) * taillePage.value
//     const end = start + taillePage.value
//     return reservationsFiltrees.value.slice(start, end)
// })
// Watchers pour réinitialiser la pagination lors des changements de filtres
watch([searchQuery, filtreStatus, filtrePaiement], () => {
    pageActuelle.value = 1;
});
onMounted(() => {
    loadBiensImmobiliers()
    loadTypeBiens()
})

const loadTypeBiens = async () => {
    try {
        const response = await store.dispatch('typeBiens/getAll');
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
const loadBiensImmobiliers = async () => {
    const loader = loading.show();
    loadTypeBiens()
    try {
        const response = await store.dispatch('biensImmobiliers/getBiensByType', {
            page: pageActuelle.value - 1, // page 0-based
            size: taillePage.value,
            typeId: typeId.value,
        });
        if (response && response.content) {
            biensImmobiliers.value = response.content;
        } else {
            console.warn('Aucun bien immobilier trouvé ou réponse incorrecte.');
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des biens immobiliers:", error);
    } finally {
        loader.hide();
    }
}
const saveBiensImmobilier = async () => {
    const loader = loading.show();
    try {
        const payload = {
            nom: typeService.value.nom,
            typeService: typeService.value.categorie,
        };
        const response = await store.dispatch('biens/create', payload);
        ElMessage({
            showClose: true,
            message: 'Bien immobilier ajoutée avec succès.',
            type: 'success',
        });
        loadReservation();
    } catch (error) {
        console.error('Erreur lors de la création du Bien immobilier:', error);
    } finally {
        loader.hide();
    }
};

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


// const loadBiensImmobiliers = async () => {
//     const loader = loading.show();
//     try {
//         const reservations = await store.dispatch('reservation/getAll');
//         console.log(reservations); // Vérifier la structure des données
//         filterItems.value = reservations;
//     } catch (error) {
//         console.error("Erreur lors du chargement des réservations:", error);
//     } finally {
//         loader.hide();
//     }
// }

const getStatusClass = (status) => {
    const statusClasses = {
        false: 'text-bg-danger',       // Rouge
        true: 'text-bg-success', // Vert
    };
    return statusClasses[status]; // Couleur par défaut (gris)
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