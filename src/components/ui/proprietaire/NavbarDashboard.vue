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

                    <li class="nav-item"> <router-link class="nav-link active"
                            to="/proprietaire/proprietaire_dashboard/vue_initial"><i
                                class="bi bi-house-door fa-fw me-1"></i>Accueil</router-link> </li>

                    <!-- <li class="nav-item"> <router-link class="nav-link" to="/manager_service"><i
                                                class="bi bi-journals fa-fw me-1"></i>Mes Propriétés</router-link>
                                    </li> -->
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-ticket-perforated fa-fw me-2"></i>Mes Propriétés
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" to="/vue_ensemble_biens">
                                    Vue d'ensemble du patrimoine</router-link></li>
                            <li><router-link class="dropdown-item" to="/details_biens">
                                    Détails des biens</router-link></li>
                            <li><router-link class="dropdown-item" to="/transactions">Historique des
                                    transactions</router-link></li>
                        </ul>
                    </li>

                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-ticket-perforated fa-fw me-2"></i>Revenus & Finances </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" to="/profils/reservations_details">
                                    Suivi des loyers perçus</router-link></li>
                            <li><router-link class="dropdown-item" to="/profils/annuler_reservation">
                                    Relevés de compte</router-link></li>
                            <li><router-link class="dropdown-item" to="/profils/historique_reservations">Déclarations
                                    fiscales</router-link></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-ticket-perforated fa-fw me-2"></i>Contrats & Locataires </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" to="/profils/reservations_details">
                                    Gestion des baux </router-link></li>
                            <li><router-link class="dropdown-item" to="/profils/annuler_reservation">
                                    Informations locataires </router-link></li>
                            <li><router-link class="dropdown-item" to="/profils/historique_reservations">Historique
                                    locatif</router-link></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-ticket-perforated fa-fw me-2"></i>Maintenance & Travaux </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" to="/profils/reservations_details">
                                    Demandes d'intervention </router-link></li>
                            <li><router-link class="dropdown-item" to="/profils/annuler_reservation">
                                    Suivi des travaux </router-link></li>
                            <li><router-link class="dropdown-item" to="/profils/historique_reservations">Historique
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
    }
}
</script>