<template>
    <BaseSidebar :dashboard-route="dashboardRoute" :dashboard-title="dashboardTitle" :menu-sections="menuSections"
        @logout="handleLogout" />
</template>

<script>
import BaseSidebar from '@/layouts/components/sidebar/BaseSidebar.vue';

export default {
    name: 'ManagerSidebar',
    components: {
        BaseSidebar
    },
    data() {
        return {
            dashboardRoute: "/manager_dashboard",
            dashboardTitle: "Dashboard",
            menuSections: this.getMenuSections()
        };
    },
    methods: {
        getMenuSections() {
            const role = this.$store.getters["auth/userRole"];

            const commonSections = [
                {
                    title: "Finances",
                    items: [
                        {
                            title: "Suivi Paiements",
                            route: "/payments/tracking",
                            icon: "fas fa-credit-card"
                        },
                        {
                            title: "Rapports Occupation",
                            route: "/reports/occupancy",
                            icon: "fas fa-chart-bar"
                        }
                    ]
                },
                {
                    title: "Communication",
                    items: [
                        {
                            title: "Messages",
                            route: "/messages/inbox",
                            icon: "fas fa-envelope"
                        },
                        {
                            title: "Notifications",
                            route: "/notifications/manage",
                            icon: "fas fa-bell"
                        }
                    ]
                }
            ];

            const roleBasedSections = {
                MANAGER_ROLES: [
                    {
                        title: "Portfolio",
                        items: [
                            {
                                id: "portfolio",
                                title: "Mes Propriétés",
                                icon: "fas fa-building",
                                children: [
                                    { title: "Vue d'ensemble", route: "/portfolio/overview" },
                                    { title: "Biens Occupés", route: "/portfolio/occupied" },
                                    { title: "Biens Vacants", route: "/portfolio/vacant" }
                                ]
                            }
                        ]
                    },
                    {
                        title: "Gestion Locative",
                        items: [
                            {
                                id: "leasing",
                                title: "Locataires",
                                icon: "fas fa-users",
                                children: [
                                    { title: "Liste Locataires", route: "/tenants/list" },
                                    { title: "Demandes", route: "/tenants/requests" },
                                    { title: "Visites Programmées", route: "/tenants/visits" }
                                ]
                            },
                            {
                                id: "leases",
                                title: "Contrats & Baux",
                                icon: "fas fa-file-contract",
                                children: [
                                    { title: "Baux Actifs", route: "/leases/active" },
                                    { title: "Expirations Proches", route: "/leases/expiring" },
                                    { title: "Renouvellements", route: "/leases/renewals" }
                                ]
                            }
                        ]
                    },
                    {
                        title: "Maintenance",
                        items: [
                            {
                                title: "Demandes Maintenance",
                                route: "/maintenance/requests",
                                icon: "fas fa-tools"
                            },
                            {
                                title: "Planning Interventions",
                                route: "/maintenance/schedule",
                                icon: "fas fa-calendar-alt"
                            },
                            {
                                title: "Fournisseurs",
                                route: "/suppliers/list",
                                icon: "fas fa-truck"
                            }
                        ]
                    }
                ]
            };

            // Retourne les sections basées sur le rôle
            return [...roleBasedSections[role], ...commonSections];
        },

        handleLogout() {
            this.$store.dispatch("auth/logout");
            this.$router.push("/login");
        }
    }
};
</script>
