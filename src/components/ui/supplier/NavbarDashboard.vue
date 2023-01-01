<template>
    <!-- Nav links START -->
    <div class="offcanvas-xl offcanvas-end mt-xl-3" tabindex="-1" id="dashboardMenu">
        <div class="offcanvas-header border-bottom p-3">
            <h5 class="offcanvas-title">Menu</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#dashboardMenu"
                aria-label="Close"></button>
        </div>
        <!-- Offcanvas body -->
        <div class="offcanvas-body p-3 p-xl-0">
            <!-- Nav item -->
            <div class="navbar navbar-expand-xl">
                <ul class="navbar-nav navbar-offcanvas-menu">

                    <li class="nav-item"> <router-link class="nav-link active" to="/home"><i
                                class="bi bi-house-door fa-fw me-1"></i>Accueil</router-link> </li>

                    <!-- <li class="nav-item"> <router-link class="nav-link" to="/manager_service"><i
                                                class="bi bi-journals fa-fw me-1"></i>Mes Propriétés</router-link>
                                    </li> -->
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-tools fa-fw me-2"></i>Mes Interventions
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" :to="{ name: 'planning_interventions' }">
                                    <i class="bi bi-calendar-event me-2 text-secondary"></i> Planning des
                                    interventions</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'demandes_en_attente' }">
                                    <i class="bi bi-hourglass-split me-2 text-warning"></i>Demandes en
                                    attente</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'historique_des_travaux' }"><i
                                        class="bi bi-clipboard-check me-2 text-success"></i>Historique des
                                    travaux</router-link>
                            </li>
                        </ul>
                    </li>

                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-receipt fa-fw me-2"></i> Facturation</a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" :to="{ name: 'creation_devis' }">
                                    <i class="bi bi-file-earmark-plus me-2 text-primary"></i>Création de
                                    devis</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'suivi_des_factures' }">
                                    <i class="bi bi-journal-text me-2 text-secondary"></i>Suivi des
                                    factures</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'paiements_recu' }"><i
                                        class="bi bi-cash-stack me-2 text-success"></i>Paiements reçus
                                </router-link></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-people fa-fw me-2"></i>Gestion Clients</a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" :to="{ name: 'contacts_gestionnaires' }">
                                    <i class="bi bi-person-lines-fill me-2 text-primary"></i>Contacts
                                    gestionnaires</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'proprietes_assigne' }">
                                    <i class="bi bi-house-door me-2 text-secondary"></i>Propriétés
                                    assignées</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'evaluations_recus' }"><i
                                        class="bi bi-star me-2 text-warning"></i>Evaluations
                                    reçues</router-link></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-folder2-open fa-fw me-2"></i>Documentation</a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" to="/profils/reservations_details">
                                    <i class="bi bi-patch-check me-2 text-success"></i>Certificats et
                                    assurances</router-link></li>
                            <li><router-link class="dropdown-item" to="/profils/annuler_reservation">
                                    <i class="bi bi-file-earmark-text me-2 text-primary"></i> Documents techniques
                                </router-link></li>
                            <li><router-link class="dropdown-item" to="/profils/historique_reservations"><i
                                        class="bi bi-clipboard-data me-2 text-secondary"></i>Rapports d'
                                    intervention</router-link></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <!-- Nav links END -->
</template>
<script>
import { tns } from 'tiny-slider';
import { mapActions, mapGetters } from "vuex";
import { API_URLS } from "@/config/api";
import { setEmail, setUserName, setSecondName, } from "@/helpers/auth";

export default {
    name: "NavbarDashboard",
    data() {
        return {
            services: [],
            defaultAvatarUrl: new URL('@/assets/images/avatar/04.jpg', import.meta.url).href,
            // secondName: "",
            // name: ""
        };
    },
    methods: {
        // Méthode qui vérifie si l'URL actuelle correspond au lien
        isActive(path) {
            return this.$route.path.startsWith(path);
        }
    }
}
</script>
<style scoped>
.nav-link i,
.dropdown-item i {
    width: 18px;
    text-align: center;
}

.dropdown-item {
    display: flex;
    align-items: center;
}

.navbar-nav .nav-link {
    display: flex;
    align-items: center;
}
</style>