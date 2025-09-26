<template>
    <!-- Sidebar START -->
    <div class="col-lg-4 col-xl-3">
        <!-- Responsive offcanvas body START -->
        <div class="offcanvas-lg offcanvas-end" tabindex="-1" id="offcanvasSidebar">
            <!-- Offcanvas header -->
            <div class="offcanvas-header justify-content-end pb-2">
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#offcanvasSidebar"
                    aria-label="Close"></button>
            </div>

            <!-- Offcanvas body -->
            <div class="offcanvas-body p-3 p-lg-0">
                <div class="card bg-light w-100">

                    <!-- Edit profile button -->
                    <div class="position-absolute top-0 end-0 p-3">
                        <router-link :to="{ name: 'profil_details' }" class="text-primary-hover"
                            data-bs-toggle="tooltip" data-bs-title="Edit profile">
                            <i class="bi bi-pencil-square"></i>
                        </router-link>
                    </div>

                    <!-- Card body START -->
                    <div class="card-body p-3">
                        <!-- Avatar and content -->
                        <div class="text-center mb-3">
                            <!-- Avatar -->
                            <div class="avatar avatar-xl mb-2">
                                <img class="avatar-img rounded-circle border border-2 border-white"
                                    src="@/assets/images/avatar/01.jpg" alt="">
                            </div>
                            <h6 class="mb-0">{{ fullName }}</h6>
                            <a href="account-profile.html#" class="text-reset text-primary-hover small">{{ handleEmail
                            }}</a>
                            <hr>
                        </div>

                        <!-- Sidebar menu item START -->
                        <ul class="nav nav-pills-primary-soft flex-column">
                            <li class="nav-item" v-if="handlerIdUser">
                                <router-link class="nav-link active" to="profils/details_profil"><i
                                        class="bi bi-person fa-fw me-2"></i>Mon Profile</router-link>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-ticket-perforated fa-fw me-2"></i>Mon Logement
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><router-link class="dropdown-item" :to="{ name: 'Reservations_location' }">
                                            Informations
                                            du bien
                                            loué</router-link></li>
                                    <li><router-link class="dropdown-item" :to="{ name: 'contrat_location' }">Détail du
                                            bail</router-link></li>
                                    <li><router-link class="dropdown-item" :to="{ name: 'contrat_document' }">Documents
                                            contractuels</router-link></li>
                                </ul>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown1" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-ticket-perforated fa-fw me-2"></i>Paiements &
                                    Charges
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdown1">
                                    <li><router-link class="dropdown-item" :to="{ name: 'paiements_historique' }">
                                            Historique
                                            des
                                            paiements</router-link></li>
                                    <li><router-link class="dropdown-item"
                                            :to="{ name: 'quittances_loyers' }">Quittances
                                            de
                                            loyer</router-link></li>
                                    <li>
                                        <router-link class="dropdown-item" :to="{ name: 'suivi_charges' }">Suivi
                                            des
                                            Charges</router-link>
                                    </li>
                                </ul>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-ticket-perforated fa-fw me-2"></i>Demandes &
                                    Services
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><router-link class="dropdown-item" :to="{ name: 'demande_maintenance' }">
                                            Demandes de
                                            maintenance</router-link></li>
                                    <li><router-link class="dropdown-item"
                                            :to="{ name: 'reclamation_historique' }">Réclamations</router-link>
                                    </li>
                                    <li><router-link class="dropdown-item" :to="{ name: 'services_annexe' }">Services
                                            Annexes</router-link></li>
                                </ul>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-ticket-perforated fa-fw me-2"></i>Communications
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><router-link class="dropdown-item" :to="{ name: 'messages' }">Messages
                                            avec
                                            le
                                            gestionnaire <span v-if="unreadCount > 0"
                                                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                {{ unreadCount }}
                                            </span></router-link></li>
                                    <li><router-link class="dropdown-item"
                                            to="profils/annuler_reservation">Notifications
                                            importantes</router-link>
                                    </li>
                                    <li><router-link class="dropdown-item" to="profils/historique_reservations">Annonces
                                            de
                                            la
                                            copropriété</router-link></li>
                                </ul>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="terms"><i class="bi bi-briefcase fa-fw me-2"></i>Terms
                                    et
                                    conditions</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="delete_account"><i
                                        class="bi bi-trash fa-fw me-2"></i>Delete Profile</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link text-danger bg-danger-soft-hover" to="/directory/login"
                                    :onclick="logout"><i class="fas fa-sign-out-alt fa-fw me-2"></i>Sign
                                    Out</router-link>
                            </li>
                        </ul>
                        <!-- Sidebar menu item END -->
                    </div>
                    <!-- Card body END -->
                </div>
            </div>
        </div>
        <!-- Responsive offcanvas body END -->
    </div>
    <!-- Sidebar END -->
</template>
<script>
import { tns } from 'tiny-slider';
import { mapActions, mapGetters } from "vuex";
import { API_URLS } from "@/config/api";
export default {
    name: "LocatairesSideBar",
    data() {
        return {
            services: [],
            unreadCount: 3,
            // name: ""

        };
    },
    mounted() {
        // Assurez-vous que le DOM est complètement monté avant d'initialiser le dropdown
        this.$nextTick(() => {
            const dropdowns = document.querySelectorAll('.dropdown-toggle');
            dropdowns.forEach(dropdown => new Dropdown(dropdown));
        });
    },
    computed: {
        ...mapGetters('auth', ['userName', 'secondName', 'email', 'userRoles', 'userInfo', 'userFichier', 'email']),
        isAuthenticated() {
            return this.$store.getters['auth/isAuthenticated']; // adapte selon ton store
        },


        fullName() {
            // Ici vous pouvez ajouter des calculs ou récupérer le nom de l'utilisateur
            // Exemple avec vuex
            if (this.userName && this.secondName) {
                return this.userName + ' ' + this.secondName
            } else {
                return 'Non Connecté'
            }
        },
        handleEmail() {
            // Idem pour l'email
            return this.email || 'non@connecte.com';
        },

        avatarUrl() {
            if (this.userFichier) {
                // Construire l'URL de l'avatar à partir du dossier assets
                return this.userFichier
                    ? `${API_URLS.API_BASE}/tfe/uploads/${this.userFichier}`
                    : new URL('@/assets/images/avatar/01.jpg', import.meta.url).href;
            }
            return this.defaultAvatarUrl;
        },
    },
    watch: {
        '$store.state.auth.userName': function (newValue) {
            console.log("Nom mis à jour :", newValue);
            // Tu peux ici faire d'autres actions comme mettre à jour des variables locales si nécessaire
        }
    },
    methods: {
        ...mapActions('auth', ['logout',]),
        // async loadService() {
        //     try {
        //         const response = await this.$store.dispatch('categorie/getAll');
        //         this.services = response;
        //     } catch (error) {
        //         console.error('Erreur lors de l\'ajout de l\'élément fonction :', error);
        //     }
        // },
        // getRouteClass(status) {
        //     const routeClasses = {
        //         'Nouveauté': 'text-bg-primary',  // Bleu
        //         'Vendu': 'text-bg-danger',       // Rouge
        //         'Disponible': 'text-bg-success', // Vert
        //         'Plus noté': 'text-bg-warning'   // Jaune
        //     };
        //     return routeClasses[status] || 'text-bg-secondary'; // Couleur par défaut (gris)
        // },

    },
};
</script>