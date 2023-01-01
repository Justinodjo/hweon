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
                            <i class="bi bi-house-door fa-fw me-2"></i>Mes Propriétés
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" :to="{ name: 'vue_ensemble_biens' }"
                                    :class="{ 'active': isActive('/vue_ensemble_biens') }">
                                    <i class="bi bi-building fa-fw me-2"></i>Vue d'ensemble du patrimoine</router-link>
                            </li>
                            <li><router-link class="dropdown-item" :to="{ name: 'details_biens' }"
                                    :class="{ 'active': isActive('/details_biens') }">
                                    <i class="bi bi-list-ul fa-fw me-2"></i>Détails des biens</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'transactions' }"
                                    :class="{ 'active': isActive('/transactions') }"> <i
                                        class="bi bi-clock-history fa-fw me-2"></i>Historique des
                                    transactions</router-link></li>
                        </ul>
                    </li>

                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-wallet2 fa-fw me-2"></i>Revenus & Finances </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" :to="{ name: 'suivi_loyers' }"
                                    :class="{ 'active': isActive('/suivi_loyers') }">
                                    <i class="bi bi-cash-stack fa-fw me-2"></i>Suivi des loyers perçus</router-link>
                            </li>
                            <li><router-link class="dropdown-item" :to="{ name: 'releve_de_compte' }"
                                    :class="{ 'active': isActive('/releve_de_compte') }">
                                    <i class="bi bi-credit-card fa-fw me-2"></i>Relevés de compte</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'declarations_fiscales' }"
                                    :class="{ 'active': isActive('/declarations_fiscales') }"><i
                                        class="bi bi-file-earmark-bar-graph fa-fw me-2"></i>Déclarations
                                    fiscales</router-link></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-person-lines-fill fa-fw me-2"></i>Contrats & Locataires </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" :to="{ name: 'details_baux_list' }"
                                    :class="{ 'active': isActive('/details_baux_list') }">
                                    <i class="bi bi-file-earmark-lock fa-fw me-2"></i>Gestion des baux </router-link>
                            </li>
                            <li><router-link class="dropdown-item" :to="{ name: 'informations_locataires_list' }"
                                    :class="{ 'active': isActive('/informations_locataires_list') }">
                                    <i class="bi bi-person-check fa-fw me-2"></i> Informations locataires </router-link>
                            </li>
                            <li><router-link class="dropdown-item" :to="{ name: 'historiques_locatif' }"
                                    :class="{ 'active': isActive('/historiques_locatif') }"><i
                                        class="bi bi-file-earmark-text fa-fw me-2"></i>Historique
                                    locatif</router-link></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-tools fa-fw me-2"></i>Maintenance & Travaux </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" :to="{ name: 'demandes_interventions' }"
                                    :class="{ 'active': isActive('/demandes_interventions') }">
                                    <i class="bi bi-gear fa-fw me-2"></i>Demandes d'intervention </router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'suivi_travaux' }"
                                    :class="{ 'active': isActive('/suivi_travaux') }">
                                    <i class="bi bi-arrow-repeat fa-fw me-2"></i>Suivi des travaux </router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'historiques_maintenances' }"
                                    :class="{ 'active': isActive('/historiques_maintenances') }"><i
                                        class="bi bi-clock fa-fw me-2"></i>Historique
                                    maintenance</router-link></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="agent-earnings.html#" id="dropdownMenu"
                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="bi bi-list-ul fa-fw me-1"></i>Autres
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenu">
                            <!-- Dropdown menu -->
                            <li><router-link class="dropdown-item" href="#"
                                    to="/manager_user">Utilisateurs</router-link></li>
                            <li><router-link class="dropdown-item" href="#" to="/manager_user">Item
                                    2</router-link></li>
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