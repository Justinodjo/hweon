import SecondWebsiteLayout from "@/layouts/SecondWebsite.vue";
import store from "@/store/index";
const managerRoutes = [
  {
    path: "/manager",
    component: SecondWebsiteLayout,
    meta: {
      requiresAuth: true,
      role: "MANAGER_ROLES",
      hideHeaderFooter: true,
      hideNotifications: false,
    },
    redirect: "/manager/manager_dashboard",
    children: [
      {
        path: "manager_dashboard",
        name: "manager_dashboard",
        component: () => import("@/views/manager/menus/Dashboard.vue"),
        meta: { requiresAuth: true, role: "MANAGER_ROLES" },
        redirect: "/manager/manager_dashboard/vue_initiale",
        children: [
          {
            path: "vue_initiale",
            name: "vue_initiale",
            component: () =>
              import("@/components/ui/manager/DataTableAccueil.vue"),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "MANAGER_ROLES",
            },
          },
          {
            path: "vue_ensemble",
            name: "vue_ensemble",
            component: () =>
              import("@/views/manager/conteneurs/proprietes/VueDensemble.vue"),
            meta: {
              requiresAuth: true,
              role: "MANAGER_ROLES",
            },
          },
          {
            path: "suivi_de_baux",
            name: "suivi_de_baux",
            component: () =>
              import("@/views/manager/conteneurs/annonces/SuiviDeBaux.vue"),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: true,
              role: "MANAGER_ROLES",
            },
          },
          {
            path: "/details_biens_list/:id",
            name: "details_biens_list",
            component: () =>
              import(
                "@/views/manager/conteneurs/annonces/DetailsListAnnonce.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "MANAGER_ROLES",
            },
          },
          {
            path: "/planning_visite",
            name: "planning_visite",
            component: () =>
              import("@/views/manager/conteneurs/annonces/PlanningVisite.vue"),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "MANAGER_ROLES",
            },
          },
          {
            path: "/demandes_locatives",
            name: "demandes_locatives",
            component: () =>
              import(
                "@/views/manager/conteneurs/annonces/DemandesLocatives.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "MANAGER_ROLES",
            },
          },
          {
            path: "/paiements_suivi",
            name: "paiements_suivi",
            component: () =>
              import("@/views/manager/conteneurs/annonces/PaiementsSuivi.vue"),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "MANAGER_ROLES",
            },
          },
          {
            path: "/renouvellement_baux",
            name: "renouvellement_baux",
            component: () =>
              import(
                "@/views/manager/conteneurs/annonces/RenouvellementBaux.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "MANAGER_ROLES",
            },
          },
          {
            path: "/demandes_maintenance",
            name: "demandes_maintenance",
            component: () =>
              import(
                "@/views/manager/conteneurs/annonces/DemandesMaintenance.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "MANAGER_ROLES",
            },
          },
          {
            path: "/planning_interventions",
            name: "planning_interventions",
            component: () =>
              import(
                "@/views/manager/conteneurs/annonces/PlanningInterventions.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "MANAGER_ROLES",
            },
          },
          {
            path: "/suivi_fournisseurs",
            name: "suivi_fournisseurs",
            component: () =>
              import(
                "@/views/manager/conteneurs/annonces/SuiviFournisseurs.vue"
              ),
            meta: {
              requiresAuth: true,
              // hideAddAnnonce: true,
              role: "MANAGER_ROLES",
            },
          },
          {
            path: "/tableaux_locatif",
            name: "tableaux_locatif",
            component: () =>
              import("@/views/manager/conteneurs/annonces/TableauxLocatif.vue"),
            meta: {
              requiresAuth: true,
              // hideAddAnnonce: true,
              role: "MANAGER_ROLES",
            },
          },
          {
            path: "/suivi_impayee",
            name: "suivi_impayee",
            component: () =>
              import("@/views/manager/conteneurs/annonces/SuiviImpayee.vue"),
            meta: {
              requiresAuth: true,
              // hideAddAnnonce: true,
              role: "MANAGER_ROLES",
            },
          },
          {
            path: "/statistiques_occupation",
            name: "statistiques_occupation",
            component: () =>
              import(
                "@/views/manager/conteneurs/annonces/StatistiquesOccupation.vue"
              ),
            meta: {
              requiresAuth: true,
              // hideAddAnnonce: true,
              role: "MANAGER_ROLES",
            },
          },
          {
            path: "/transactions",
            name: "transactions",
            component: () =>
              import(
                "@/views/manager/conteneurs/transactions/ViewTransactions.vue"
              ),
            meta: {
              requiresAuth: true,
              // hideAddAnnonce: true,
              role: "MANAGER_ROLES",
            },
          },

          {
            path: "/suivi_loyers",
            name: "suivi_loyers",
            component: () =>
              import("@/views/manager/conteneurs/annonces/SuiviLoyers.vue"),
            meta: {
              requiresAuth: true,
              // hideAddAnnonce: true,
              role: "MANAGER_ROLES",
            },
          },
          {
            path: "/releve_de_compte",
            name: "releve_de_compte",
            component: () =>
              import("@/views/manager/conteneurs/annonces/ReleveDeCompte.vue"),
            meta: {
              requiresAuth: true,
              // hideAddAnnonce: true,
              role: "MANAGER_ROLES",
            },
          },
          {
            path: "/declarations_fiscales",
            name: "declarations_fiscales",
            component: () =>
              import(
                "@/views/manager/conteneurs/annonces/DeclarationsFiscales.vue"
              ),
            meta: {
              requiresAuth: true,
              // hideAddAnnonce: true,
              role: "MANAGER_ROLES",
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

export default managerRoutes;
