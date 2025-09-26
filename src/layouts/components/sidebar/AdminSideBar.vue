// ========================================
// 3. COMPOSANT ADMIN - AdminSidebar.vue
// ========================================
// components/sidebar/AdminSidebar.vue
<template>
    <BaseSidebar dashboard-route="/dashboard" dashboard-title="Dashboard" settings-route="/dashboard/settings"
        :menu-sections="menuSections" @logout="handleLogout" />
</template>

<script>
import BaseSidebar from './BaseSidebar.vue';

export default {
    name: 'AdminSidebar',
    components: {
        BaseSidebar
    },
    data() {
        return {
            menuSections: [
                {
                    title: 'Gestion Immobilière',
                    items: [
                        {
                            id: 'properties',
                            title: 'Propriétés',
                            icon: 'fas fa-building',
                            children: [
                                { title: 'Liste Propriétés', route: '/properties/list' },
                                { title: 'Ajouter Propriété', route: '/properties/add' },
                                { title: 'Types de Biens', route: '/properties/types' }
                            ]
                        },
                        {
                            id: 'contracts',
                            title: 'Contrats & Baux',
                            icon: 'fas fa-file-contract',
                            children: [
                                { title: 'Liste Contrats', route: '/contracts/list' },
                                { title: 'Templates', route: '/contracts/templates' },
                                { title: 'Renouvellements', route: '/contracts/renewals' }
                            ]
                        }
                    ]
                },
                {
                    title: 'Gestion Utilisateurs',
                    items: [
                        {
                            id: 'users',
                            title: 'Utilisateurs',
                            icon: 'fas fa-users',
                            children: [
                                { title: 'Propriétaires', route: '/users/proprietaires' },
                                { title: 'Locataires', route: '/users/locataires' },
                                { title: 'Gestionnaires', route: '/users/managers' },
                                { title: 'Fournisseurs', route: '/users/suppliers' }
                            ]
                        }
                    ]
                },
                {
                    title: 'Finances',
                    items: [
                        {
                            title: 'Paiements',
                            route: '/payments/overview',
                            icon: 'fas fa-credit-card'
                        },
                        {
                            title: 'Facturations',
                            route: '/invoices/list',
                            icon: 'fas fa-file-invoice'
                        },
                        {
                            title: 'Rapports Financiers',
                            route: '/reports/financial',
                            icon: 'fas fa-chart-pie'
                        }
                    ]
                },
                {
                    title: 'Système',
                    items: [
                        {
                            title: 'Paramètres',
                            route: '/settings',
                            icon: 'fas fa-cog'
                        },
                        {
                            title: 'Notifications',
                            route: '/notifications',
                            icon: 'fas fa-bell'
                        }
                    ]
                }
            ]
        }
    },
    methods: {
        handleLogout() {
            this.$store.dispatch('auth/logout');
            this.$router.push('/login');
        }
    }
}
</script>
