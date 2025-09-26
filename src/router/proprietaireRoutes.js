import SecondWebsiteLayout from "@/layouts/SecondWebsite.vue";
import store from "@/store/index";

// Routes Propriétaire
// DataTableAccueil
const proprietaireRoutes = [
  {
    path: "/proprietaire",
    component: SecondWebsiteLayout,
    meta: {
      requiresAuth: true,
      role: "PROPRIETAIRE_ROLES",
      hideHeaderFooter: false,
      hideNotifications: true,
    },
    redirect: "/proprietaire/proprietaire_dashboard",
    children: [
      {
        path: "proprietaire_dashboard",
        name: "proprietaire_dashboard",
        component: () =>
          import("@/views/proprietaire/menus/ProprietaireDashboard.vue"),
        meta: { requiresAuth: true, role: "PROPRIETAIRE_ROLES" },
        redirect: "/proprietaire/proprietaire_dashboard/vue_initial",
        children: [
          {
            path: "vue_initial",
            name: "vue_initial",
            component: () =>
              import("@/components/ui/proprietaire/DataTableAccueil.vue"),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "PROPRIETAIRE_ROLES",
            },
          },
          {
            path: "/vue_ensemble_biens",
            name: "vue_ensemble_biens",
            component: () =>
              import(
                "@/views/proprietaire/conteneurs/proprietes/VueEnsembleBiens.vue"
              ),
            meta: {
              requiresAuth: true,
              role: "PROPRIETAIRE_ROLES",
            },
          },
          {
            path: "/details_biens",
            name: "details_biens",
            component: () =>
              import(
                "@/views/proprietaire/conteneurs/annonces/ListeAnnonces.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: true,
              role: "PROPRIETAIRE_ROLES",
            },
          },
          {
            path: "/details_biens_list",
            name: "details_biens_list",
            component: () =>
              import(
                "@/views/proprietaire/conteneurs/annonces/DetailsListAnnonce.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: true,
              role: "PROPRIETAIRE_ROLES",
            },
          },
          {
            path: "/transactions",
            name: "transactions",
            component: () =>
              import(
                "@/views/proprietaire/conteneurs/transactions/ViewTransactions.vue"
              ),
            meta: {
              requiresAuth: true,
              // hideAddAnnonce: true,
              role: "PROPRIETAIRE_ROLES",
            },
          },
        ],
      },

      // {
      //   path: "revenues",
      //   name: "ProprietaireRevenues",
      //   component: () => import("@/views/proprietaire/Revenues.vue"),
      //   meta: { requiresAuth: true, role: "PROPRIETAIRE_ROLES" },
      // },
      // {
      //   path: "current-tenants",
      //   name: "ProprietaireCurrentTenants",
      //   component: () => import("@/views/proprietaire/CurrentTenants.vue"),
      //   meta: { requiresAuth: true, role: "PROPRIETAIRE_ROLES" },
      // },
    ],
  },
];
export default proprietaireRoutes;
