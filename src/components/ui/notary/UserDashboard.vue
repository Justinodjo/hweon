<template>
    <main>
        <div class="card rounded-3 border p-3 pb-2">
            <!-- Avatar and info START -->
            <div class="d-sm-flex align-items-center">
                <div class="avatar avatar-xl mb-2 mb-sm-0">
                    <img class="avatar-img rounded-circle" :src="avatarUrl" alt="">
                    <div class="position-absolute top-0 end-2 p-1">
                        <a class="text-primary-hover" data-bs-toggle="tooltip" data-bs-title="Edit profile"
                            style="transform: translate(50%, 50%);" @click="openEditProfileModal">
                            <i class="bi bi-pencil-square"></i>
                        </a>
                    </div>
                </div>
                <h4 class="mb-2 mb-sm-0 ms-sm-3"><span class="fw-light">Hello</span> {{ userName + ' ' + secondName }}
                </h4>
                <a href="#" class="btn btn-sm btn-primary-soft mb-0 ms-auto flex-shrink-0" v-if="hideAddAnnonce"
                    @click="openUserModal"><i
                        :class="hideAddAnnonce ? 'bi bi-plus-lg fa-fw me-2' : 'bi bi-dash-lg fa-fw me-2'"></i>Ajouter
                    une annonce</a>
            </div>
            <!-- Avatar and info START -->

            <!-- Responsive navbar toggler -->
            <button class="btn btn-primary w-100 d-block d-xl-none mt-2" type="button" data-bs-toggle="offcanvas"
                data-bs-target="#dashboardMenu" aria-controls="dashboardMenu">
                <i class="bi bi-list"></i> Dashboard Menu
            </button>

            <!-- Nav links START -->
            <NavbarDashboard />
            <!-- Nav links END -->

        </div>
        <!-- 🎯 Modal avec approche variable locale -->
        <!-- <AddBiensStepOne ref="addBienModal" @success="handleBienAdded" @close="handleModalClose" /> -->
    </main>


</template>

<script>
import { ref, shallowRef, nextTick } from 'vue';
import NavbarDashboard from './NavbarDashboard.vue'
import AddBiensStepOne from '@/components/modal/AddBiensStepOne.vue'
import { API_URLS } from "@/config/api";
import { mapActions, mapGetters } from "vuex";
import ProfilsDetailsLocataire from "@/views/locataire/ProfilsDetailsLocataire.vue"
import { setEmail, setUserName, setSecondName, getFichier } from "@/helpers/auth";
import { useStore } from "vuex";
export default {
    name: "UserDashboard",

    components: {
        NavbarDashboard,
        AddBiensStepOne,
        ProfilsDetailsLocataire,
    },
    setup() {
        const store = useStore();

        const openUserModal = () => {
            store.dispatch("modal/openModal", {
                component: "AddBiensStepOne", // ton composant
                props: { userId: 1 }        // props que tu veux passer
            });
        };

        return { openUserModal };
    },

    data() {
        return {
            services: [],
        }
    },

    computed: {
        ...mapGetters('auth', ['userName', 'secondName', 'email', 'userRoles', 'userInfo', 'userFichier', 'email', "isAuthenticated"]),
        ...mapGetters('notifications', ['notifications', 'unreadCount', 'isConnected']),
        hideAddAnnonce() {
            return this.$route.meta?.hideAddAnnonce === true
        },

        avatarUrl() {
            // 1. Priorité au fichier uploadé (depuis cookie ou store)
            let fileId = this.userFichier || getFichier();
            console.log("userFichier dans avatarUrl :", this.userFichier);
            // 2. Si tu veux prendre le dernier fichier uploadé via FilePond
            if (fileId) {
                return `${API_URLS.API_BASE}/fichier/download/${fileId}`;
            }

            // 3. Avatar par défaut
            return new URL('@/assets/images/avatar/user_profil.png', import.meta.url).href;
        },
    },

    methods: {
        // 🎯 Utilisation de la référence pour ouvrir la modal
        openAddBienModal() {
            const p = this.$refs.addBienModal.show();
            console.log('Ouverture du modal:', p);
        },

        // 🎯 Gestionnaire quand un bien est ajouté avec succès
        handleBienAdded(formData) {
            console.log('Bien ajouté avec succès:', formData);

            // Ici vous pouvez :
            // - Rafraîchir la liste des biens
            // - Afficher une notification
            // - Rediriger vers une autre page
            // - Mettre à jour le store Vuex

            // Exemple : rafraîchir la liste des biens
            // this.$store.dispatch('biens/fetchAll');

            // Exemple : afficher une notification custom
            // this.$notify({
            //     title: 'Succès',
            //     message: 'Le bien a été ajouté avec succès',
            //     type: 'success'
            // });
        },
        // 🎯 Gestionnaire quand la modal se ferme
        handleModalClose() {
            console.log('Modal fermée');

            // Actions optionnelles à la fermeture :
            // - Logging
            // - Nettoyage d'état
            // - Analytics
        },

        // 🎯 Méthode pour fermer la modal depuis l'extérieur (optionnel)
        closeAddBienModal() {
            // Utilisation de la référence pour fermer la modal
            const p = this.$refs.addBienModal.hide();
            console.log('Fermeture du modal:', p);
        },
        openEditProfileModal() {
            const userId = this.$store.getters["auth/userInfo"];
            this.$store.dispatch("modal/openModal", {
                component: ProfilsDetailsLocataire,
                props: { userId }
            });
        },
    }
}
</script>