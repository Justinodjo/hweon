// ========================================
// 2. COMPOSANT SUPER ADMIN - SuperAdminSidebar.vue
// ========================================
// components/sidebar/SuperAdminSidebar.vue
<template>
    <BaseSidebar dashboard-route="/master/master_dashboard/master_accueil" dashboard-title="Master Dashboard"
        settings-route="/master_dashboard/settings" :menu-sections="menuSections" @logout="handleLogout" />

</template>

<script>
import BaseSidebar from './BaseSidebar.vue';

export default {
    name: 'SuperAdminSidebar',
    components: {
        BaseSidebar
    },
    data() {
        return {
            menuSections: [
                {
                    title: 'Administration Système',
                    items: [
                        {
                            id: 'systemConfig',
                            title: 'Configuration Système',
                            icon: 'fas fa-cogs',
                            children: [
                                { title: 'Paramètres Globaux', route: '/system/settings' },
                                { title: 'Sécurité & Permissions', route: '/system/security' },
                                { title: 'Sauvegarde & Restauration', route: '/system/backup' },
                                { title: 'Logs & Audit', route: '/system/logs' }
                            ]
                        },
                        {
                            id: 'userManagement',
                            title: 'Gestion Utilisateurs',
                            icon: 'fas fa-users-cog',
                            children: [
                                { title: 'Tous les Utilisateurs', route: '/master/master_dashboard/liste_agents' },
                                { title: 'Rôles & Permissions', route: '/master/master_dashboard/roles_permissions' },
                                { title: 'Contrôle d\'Accès', route: '/master/master_dashboard/access_control' }
                            ]
                        }
                    ]
                },
                {
                    title: 'Analytics & Rapports',
                    items: [
                        {
                            title: 'Analytics Plateforme',
                            route: '/analytics/platform',
                            icon: 'fas fa-chart-line'
                        },
                        {
                            title: 'Rapports Globaux',
                            route: '/reports/global',
                            icon: 'fas fa-chart-bar'
                        },
                        {
                            title: 'Performance Système',
                            route: '/system/performance',
                            icon: 'fas fa-tachometer-alt'
                        }
                    ]
                },
                {
                    title: 'Support & Maintenance',
                    items: [
                        {
                            title: 'Tickets Support',
                            route: '/support/tickets',
                            icon: 'fas fa-ticket-alt'
                        },
                        {
                            title: 'Maintenance',
                            route: '/system/maintenance',
                            icon: 'fas fa-tools'
                        }
                    ]
                }
            ]
        }
    },
    methods: {
        handleLogout() {
            // Logique de déconnexion
            this.logout();
            this.$router.push('/login');
        },
        async logout() {
            this.$store.dispatch('auth/logout');  // Appel de l'action 'logout'
            this.$router.push('/login'); // Rediriger vers la page de connexion
        },
    }
}
</script>