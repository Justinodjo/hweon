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
                            <i class="bi bi-building fa-fw me-2"></i>Portfolio Management
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" :to="{ name: 'vue_ensemble' }"
                                    :class="{ 'active': isActive('/vue_ensemble') }">
                                    <i class="bi bi-layout-text-sidebar-reverse me-2 text-secondary"></i> Vue d'ensemble
                                    des propriétés assignées</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'suivi_de_baux' }"
                                    :class="{ 'active': isActive('/suivi_de_baux') }">
                                    <i class="bi bi-file-earmark-text me-2 text-primary"></i> Suivi des Contrats et
                                    baux</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'planning_visite' }"
                                    :class="{ 'active': isActive('/planning_visite') }"><i
                                        class="bi bi-calendar-check me-2 text-success"></i>Planning des
                                    visites</router-link>
                            </li>
                        </ul>
                    </li>

                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-key fa-fw me-2"></i>Gestion locative</a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" :to="{ name: 'demandes_locatives' }"
                                    :class="{ 'active': isActive('/demandes_locatives') }">
                                    <i class="bi bi-person-plus me-2 text-primary"></i> Gestion des demandes
                                    locatives</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'paiements_suivi' }"
                                    :class="{ 'active': isActive('/paiements_suivi') }">
                                    <i class="bi bi-cash-coin me-2 text-success"></i>Suivi des paiements</router-link>
                            </li>
                            <li><router-link class="dropdown-item" :to="{ name: 'renouvellement_baux' }"
                                    :class="{ 'active': isActive('/renouvellement_baux') }"><i
                                        class="bi bi-arrow-repeat me-2 text-warning"></i>Renouvellement
                                    des baux</router-link></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-tools fa-fw me-2"></i>Maintenance et Interventions</a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" :to="{ name: 'demandes_maintenance' }"
                                    :class="{ 'active': isActive('/demandes_maintenance') }">
                                    <i class="bi bi-wrench-adjustable-circle me-2 text-danger"></i>Demandes de
                                    maintenance</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'planning_interventions' }"
                                    :class="{ 'active': isActive('/planning_interventions') }">
                                    <i class="bi bi-calendar-event me-2 text-info"></i>Planning des
                                    interventions</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'suivi_fournisseurs' }"
                                    :class="{ 'active': isActive('/suivi_fournisseurs') }"><i
                                        class="bi bi-people me-2 text-secondary"></i>Suivi des
                                    fournisseurs</router-link></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-bar-chart-line fa-fw me-2"></i>Rapports Opérationnels</a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" :to="{ name: 'tableaux_locatif' }"
                                    :class="{ 'active': isActive('/tableaux_locatif') }">
                                    <i class="bi bi-speedometer2 me-2 text-primary"></i>Tableaux de bord
                                    locatif</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'suivi_impayee' }"
                                    :class="{ 'active': isActive('/suivi_impayee') }">
                                    <i class="bi bi-exclamation-triangle me-2 text-danger"></i>Suivi des impayés
                                </router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'statistiques_occupation' }"
                                    :class="{ 'active': isActive('/statistiques_occupation') }"><i
                                        class="bi bi-pie-chart me-2 text-success"></i>Statistiques
                                    d'occupation</router-link></li>
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