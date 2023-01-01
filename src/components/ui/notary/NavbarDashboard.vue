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
                            <i class="bi bi-folder-check fa-fw me-2"></i>Dossiers en Cours
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" :to="{ name: 'transactions_immobilieres' }"
                                    :class="{ 'active': isActive('/transactions_immobilieres') }">
                                    <i class="bi bi-cash-coin me-2"></i>Transactions immobilières</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'actes_en_preparations' }"
                                    :class="{ 'active': isActive('/actes_en_preparations') }">
                                    <i class="bi bi-file-earmark-text me-2"></i>Actes en préparation</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'planning_signatures' }"
                                    :class="{ 'active': isActive('/planning_signatures') }"><i
                                        class="bi bi-calendar-check me-2"></i>Planning des
                                    signatures</router-link>
                            </li>
                        </ul>
                    </li>

                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-journal-text fa-fw me-2"></i> Documentation Légale</a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" :to="{ name: 'gestions_actes' }"
                                    :class="{ 'active': isActive('/gestions_actes') }">
                                    <i class="bi bi-journal-bookmark me-2"></i>Gestion des actes</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'verifications_legale' }"
                                    :class="{ 'active': isActive('/verifications_legale') }">
                                    <i class="bi bi-search me-2"></i>Vérifications légales</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'archives_notariales' }"
                                    :class="{ 'active': isActive('/archives_notariales') }"><i
                                        class="bi bi-archive me-2"></i>Archives
                                    notariales</router-link></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-people fa-fw me-2"></i>Clients & Parties</a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" :to="{ name: 'informations_parties' }"
                                    :class="{ 'active': isActive('/informations_parties') }">
                                    <i class="bi bi-person-lines-fill me-2"></i>Informations des parties</router-link>
                            </li>
                            <li><router-link class="dropdown-item" :to="{ name: 'communications' }"
                                    :class="{ 'active': isActive('/communications') }">
                                    <i class="bi bi-chat-dots me-2"></i>Communications</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'suivi_dossier' }"
                                    :class="{ 'active': isActive('/suivi_dossier') }"><i
                                        class="bi bi-clipboard-data me-2"></i>Suivi des
                                    dossiers</router-link></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-shield-check fa-fw me-2"></i>Conformité & Reglementation</a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><router-link class="dropdown-item" :to="{ name: 'verifications_reglementaires' }"
                                    :class="{ 'active': isActive('/verifications_reglementaires') }">
                                    <i class="bi bi-shield-exclamation me-2"></i> Vérifications
                                    réglementaires</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'mise_a_jour_legale' }"
                                    :class="{ 'active': isActive('/mise_a_jour_legale') }">
                                    <i class="bi bi-arrow-repeat me-2"></i> Mise à jour légale </router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'rapports_conformite' }"
                                    :class="{ 'active': isActive('/rapports_conformite') }"><i
                                        class="bi bi-file-check me-2"></i>Rapports de
                                    conformité</router-link></li>
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