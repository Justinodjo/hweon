// ========================================
// 7. COMPOSANT WRAPPER PRINCIPAL - DynamicSidebar.vue
// ========================================
// components/sidebar/DynamicSidebar.vue
<template>
    <component :is="currentSidebarComponent" v-if="currentSidebarComponent" @logout="handleLogout" />


</template>

<script>
import { computed } from 'vue';
import { useStore, mapActions, mapGetters } from 'vuex';
import { watch } from 'vue';
import SidebarAdmin from "@/layouts/components/sidebar/AdminSideBar.vue";
import SidebarManager from "@/layouts/components/sidebar/ManagerSideBar.vue";
import SidebarLocataire from "@/layouts/components/sidebar/LocataireSideBar.vue";
import SidebarSupplier from "@/layouts/components/sidebar/SupplierSideBar.vue";
import SidebarNotary from "@/layouts/components/sidebar/NotarySideBar.vue";
import SidebarSuperAdmin from "@/layouts/components/sidebar/SuperAdminSidebar.vue";
import SidebarProprietaire from "@/layouts/components/sidebar/ProprietaireSideBar.vue";
import { setToken, setEmail, setUserName, setUserInfo, setSecondName } from "@/helpers/auth";
import { useLoading } from "vue-loading-overlay";
import { ElMessage } from "element-plus";
import router from "@/router/index.js";
export default {
    name: 'DynamicSidebar',
    setup() {
        const store = useStore();


        // Récupérer le rôle utilisateur du store
        const userRoles = computed(() => store.getters["auth/userRoles"]);
        const userName = computed(() => store.getters["auth/userName"]);
        const secondName = computed(() => store.getters["auth/secondName"]);
        const email = computed(() => store.getters["auth/email"]);
        const userFichier = computed(() => store.getters["auth/userFichier"]);
        const userInfo = computed(() => store.getters["auth/userInfo"]);
        // Déterminer quel composant de la sidebar afficher selon le rôle
        const currentSidebarComponent = computed(() => {
            if (userRoles.value.includes("ADMIN_ROLES")) {
                return SidebarAdmin;
            } else if (userRoles.value.includes("MANAGER_ROLES")) {
                return SidebarManager;
            } else if (userRoles.value.includes("LOCATAIRE_ROLES")) {
                return SidebarLocataire;
            } else if (userRoles.value.includes("SUPPLIER_ROLES")) {
                return SidebarSupplier;
            } else if (userRoles.value.includes("NOTARY_ROLES")) {
                return SidebarNotary;
            } else if (userRoles.value.includes("SUPER_ADMIN_ROLES")) {
                return SidebarSuperAdmin;
            } else if (userRoles.value.includes("PROPRIETAIRE_ROLES")) {
                return SidebarProprietaire;
            } else {
                return null; // Si aucun rôle ne correspond, aucune sidebar n'est affichée
            }
        });

        // Fonction de déconnexion
        const handleLogout = () => {
            logout();
            store.dispatch("auth/logout");
        };

        return {
            currentSidebarComponent,
            handleLogout,
            userName,
            secondName,
            email,
            userFichier,
            userInfo
        };
    }
};
</script>
<style scoped>
/* Styles spécifiques à la sidebar */
.sidebar-error {
    text-align: center;
    color: red;
    padding: 20px;
    font-size: 18px;
}
</style>