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
                                <img class="avatar-img rounded-circle border border-2 border-white" :src="avatarUrl"
                                    alt="avatar">

                            </div>
                            <h6 class="mb-0">{{ fullName }}</h6>
                            <a href="account-profile.html#" class="text-reset text-primary-hover small">{{ handleEmail
                                }}</a>
                            <hr>
                        </div>
                        <!-- Notifications récentes -->
                        <div v-if="notifications.length" class="mb-3 px-2">
                            <h6 class="text-muted small">📬 Notifications récentes</h6>
                            <ul class="list-group list-group-flush">
                                <li v-for="(notif, index) in notifications.slice(0, 5)" :key="index"
                                    class="list-group-item small px-1 py-2">
                                    {{ notif.contenu }}
                                    <br />
                                    <small class="text-muted">{{ formatDate(notif.timestamp) }}</small>
                                </li>
                            </ul>
                        </div>

                        <!-- Sidebar menu item START -->
                        <ul class="nav nav-pills-primary-soft flex-column">
                            <li class="nav-item" v-if="handlerIdUser">
                                <router-link class="nav-link active" to="profils/details_profil"><i
                                        class="bi bi-person fa-fw me-2"></i>Mon Profile</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" :to="{ name: 'Accueil' }">
                                    <i class="bi bi-house-door fa-fw me-2"></i>
                                    <span>Accueil</span>
                                </router-link>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-building fa-fw me-2"></i>Mon Logement
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><router-link class="dropdown-item" :to="{ name: 'Reservations_location' }">
                                            <i class="bi bi-info-circle me-2"></i>Informations
                                            du bien
                                            loué</router-link></li>
                                    <li><router-link class="dropdown-item" :to="{ name: 'contrat_location' }"> <i
                                                class="bi bi-file-text me-2"></i>Détail du
                                            bail</router-link></li>
                                    <li><router-link class="dropdown-item" :to="{ name: 'contrat_document' }"><i
                                                class="bi bi-folder2-open me-2"></i>Documents
                                            contractuels</router-link></li>
                                </ul>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown1" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-wallet2 fa-fw me-2"></i>Paiements &
                                    Charges
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdown1">
                                    <li><router-link class="dropdown-item" :to="{ name: 'paiements_historique' }"><i
                                                class="bi bi-clock-history me-2"></i>
                                            Historique
                                            des
                                            paiements</router-link></li>
                                    <li><router-link class="dropdown-item" :to="{ name: 'quittances_loyers' }"><i
                                                class="bi bi-receipt-cutoff me-2"></i>Quittances
                                            de
                                            loyer</router-link></li>
                                    <li>
                                        <router-link class="dropdown-item" :to="{ name: 'suivi_charges' }"><i
                                                class="bi bi-bar-chart-line me-2"></i>Suivi
                                            des
                                            Charges</router-link>
                                    </li>
                                </ul>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-tools fa-fw me-2"></i>Demandes &
                                    Services
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><router-link class="dropdown-item" :to="{ name: 'demande_maintenance' }"><i
                                                class="bi bi-wrench-adjustable-circle me-2"></i>
                                            Demandes de
                                            maintenance</router-link></li>
                                    <li><router-link class="dropdown-item" :to="{ name: 'reclamation_historique' }"><i
                                                class="bi bi-exclamation-triangle me-2"></i>Réclamations</router-link>
                                    </li>
                                    <li><router-link class="dropdown-item" :to="{ name: 'services_annexe' }"><i
                                                class="bi bi-plus-circle me-2"></i> Services
                                            Annexes</router-link></li>
                                </ul>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-chat-dots fa-fw me-2"></i>Communications
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><router-link class="dropdown-item" :to="{ name: 'messages' }"><i
                                                class="bi bi-envelope-open me-2"></i>Messages
                                            avec
                                            le
                                            gestionnaire </router-link></li>
                                    <li><router-link class="dropdown-item" :to="{ name: 'notifications' }"><i
                                                class="bi bi-bell me-2"><span v-if="unreadCount > 0"
                                                    class="position-absolute bottom-10 start-20 translate-middle badge rounded-pill bg-danger badge-small">
                                                    {{ unreadCount }}
                                                </span></i>Notifications
                                            importantes</router-link>
                                    </li>
                                    <li><router-link class="dropdown-item" to="profils/historique_reservations"><i
                                                class="bi bi-megaphone me-2"></i>Annonces
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
                                        class="bi bi-trash3 fa-fw me-2"></i>Delete Profile</router-link>
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
import { getFichier, setEmail, setUserName, setUserInfo, setSecondName, setRoles, getToken } from "@/helpers/auth";
import { formatDate } from '@/helpers/validate';
import { ElNotification } from 'element-plus';
export default {
    name: "LocatairesSideBar",
    data() {
        return {
            services: [],
            previousNotifCount: 0,
            // name: ""

        };
    },
    mounted() {
        this.$store.dispatch('notifications/start');
        this.previousNotifCount = this.notifications.length;
    },

    computed: {
        ...mapGetters('auth', ['userName', 'secondName', 'email', 'userRoles', 'userInfo', 'userFichier', 'email']),
        ...mapGetters('notifications', ['notifications', 'unreadCount']),
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
            // 1. Priorité au fichier uploadé (depuis cookie ou store)
            let fileId = this.userFichier || getFichier();
            console.log("userFichier dans avatarUrl :", this.userFichier);
            if (fileId) {
                return `${API_URLS.API_BASE}/fichier/download/${fileId}`;
            }

            // 3. Avatar par défaut
            return new URL('@/assets/images/avatar/01.jpg', import.meta.url).href;
        }
    },
    watch: {
        '$store.state.auth.userName': function (newValue) {
            console.log("Nom mis à jour :", newValue);
            // Tu peux ici faire d'autres actions comme mettre à jour des variables locales si nécessaire
        },
        notifications(newList) {
            if (newList.length > this.previousNotifCount) {
                const newNotif = newList[0]; // dernière reçue
                ElNotification({
                    title: 'Nouvelle notification 📬',
                    message: newNotif.contenu,
                    type: 'info',
                    duration: 5000,
                    position: 'top-right'
                });
            }
            this.previousNotifCount = newList.length;
        }
    },
    methods: {
        formatDate,
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
        testNotification() {
            ElNotification({
                title: 'Test',
                message: 'Ceci est une notification de test',
                type: 'success',
            });
        },
        getImageUrl(idfile) {
            return `${API_URLS.API_BASE}/fichier/download/${idfile}`;
        }

    },
};
</script>
<style scoped>
.badge-small {
    font-size: 0.55rem !important;
    /* plus petit texte */
    padding: 2px 5px !important;
    /* plus petit badge */
    line-height: 1;
    min-width: 16px;
    height: 16px;
}
</style>