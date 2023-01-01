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
      hideHeaderFooter: true,
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
            path: "/details_biens_list/:id",
            name: "details_biens_list",
            component: () =>
              import(
                "@/views/proprietaire/conteneurs/annonces/DetailsListAnnonce.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "PROPRIETAIRE_ROLES",
            },
          },
          {
            path: "/details_baux_list",
            name: "details_baux_list",
            component: () =>
              import(
                "@/views/proprietaire/conteneurs/annonces/DetailsBaux.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "PROPRIETAIRE_ROLES",
            },
          },
          {
            path: "/informations_locataires_list",
            name: "informations_locataires_list",
            component: () =>
              import(
                "@/views/proprietaire/conteneurs/annonces/InformationsLocataires.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "PROPRIETAIRE_ROLES",
            },
          },
          {
            path: "/historiques_locatif",
            name: "historiques_locatif",
            component: () =>
              import(
                "@/views/proprietaire/conteneurs/annonces/HistoriquesLocatif.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
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
          {
            path: "/suivi_loyers",
            name: "suivi_loyers",
            component: () =>
              import(
                "@/views/proprietaire/conteneurs/annonces/SuiviLoyers.vue"
              ),
            meta: {
              requiresAuth: true,
              // hideAddAnnonce: true,
              role: "PROPRIETAIRE_ROLES",
            },
          },
          {
            path: "/releve_de_compte",
            name: "releve_de_compte",
            component: () =>
              import(
                "@/views/proprietaire/conteneurs/annonces/ReleveDeCompte.vue"
              ),
            meta: {
              requiresAuth: true,
              // hideAddAnnonce: true,
              role: "PROPRIETAIRE_ROLES",
            },
          },
          {
            path: "/declarations_fiscales",
            name: "declarations_fiscales",
            component: () =>
              import(
                "@/views/proprietaire/conteneurs/annonces/DeclarationsFiscales.vue"
              ),
            meta: {
              requiresAuth: true,
              // hideAddAnnonce: true,
              role: "PROPRIETAIRE_ROLES",
            },
          },
          {
            path: "/demandes_interventions",
            name: "demandes_interventions",
            component: () =>
              import(
                "@/views/proprietaire/conteneurs/annonces/DemandesInterventions.vue"
              ),
            meta: {
              requiresAuth: true,
              // hideAddAnnonce: true,
              role: "PROPRIETAIRE_ROLES",
            },
          },

          {
            path: "/suivi_travaux",
            name: "suivi_travaux",
            component: () =>
              import(
                "@/views/proprietaire/conteneurs/annonces/SuiviTravaux.vue"
              ),
            meta: {
              requiresAuth: true,
              // hideAddAnnonce: true,
              role: "PROPRIETAIRE_ROLES",
            },
          },
          {
            path: "/historiques_maintenances",
            name: "historiques_maintenances",
            component: () =>
              import(
                "@/views/proprietaire/conteneurs/annonces/HistoriquesMaintenances.vue"
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
