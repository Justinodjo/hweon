import SecondWebsiteLayout from "@/layouts/SecondWebsite.vue";
import store from "@/store/index";
// Routes Notary
const notaryRoutes = [
  {
    path: "/notary",
    component: SecondWebsiteLayout,
    meta: {
      requiresAuth: true,
      role: "NOTARY_ROLES",
      hideHeaderFooter: true,
      hideNotifications: false,
    },
    redirect: "/notary/notary_dashboard",
    children: [
      {
        path: "notary_dashboard",
        name: "notary_dashboard",
        component: () => import("@/views/notary/menus/Dashboard.vue"),
        meta: { requiresAuth: true, role: "NOTARY_ROLES" },
        redirect: "/notary/notary_dashboard/vue_initialy",
        children: [
          {
            path: "vue_initialy",
            name: "vue_initialy",
            component: () =>
              import("@/components/ui/notary/DataTableAccueil.vue"),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "NOTARY_ROLES",
            },
          },
          {
            path: "vue_ensembles",
            name: "vue_ensembles",
            component: () =>
              import("@/views/notary/conteneurs/proprietes/VueDensembles.vue"),
            meta: {
              requiresAuth: true,
              role: "NOTARY_ROLES",
            },
          },
          {
            path: "gestions_actes",
            name: "gestions_actes",
            component: () =>
              import("@/views/notary/conteneurs/annonces/GestionsActes.vue"),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: true,
              role: "NOTARY_ROLES",
            },
          },
          {
            path: "transactions_immobilieres",
            name: "transactions_immobilieres",
            component: () =>
              import(
                "@/views/notary/conteneurs/annonces/TransactionsImmobilieres.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "NOTARY_ROLES",
            },
          },
          {
            path: "/actes_en_preparations",
            name: "actes_en_preparations",
            component: () =>
              import(
                "@/views/notary/conteneurs/annonces/ActesEnPreparations.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "NOTARY_ROLES",
            },
          },
          {
            path: "/planning_signatures",
            name: "planning_signatures",
            component: () =>
              import(
                "@/views/notary/conteneurs/annonces/PlanningSignatures.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "NOTARY_ROLES",
            },
          },
          {
            path: "/verifications_legale",
            name: "verifications_legale",
            component: () =>
              import(
                "@/views/notary/conteneurs/annonces/VerificationsLegale.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "NOTARY_ROLES",
            },
          },
          {
            path: "/archives_notariales",
            name: "archives_notariales",
            component: () =>
              import(
                "@/views/notary/conteneurs/annonces/ArchivesNotariales.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "NOTARY_ROLES",
            },
          },
          {
            path: "/informations_parties",
            name: "informations_parties",
            component: () =>
              import(
                "@/views/notary/conteneurs/annonces/InformationsParties.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "NOTARY_ROLES",
            },
          },
          {
            path: "/communications",
            name: "communications",
            component: () =>
              import("@/views/notary/conteneurs/annonces/Communications.vue"),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "NOTARY_ROLES",
            },
          },
          {
            path: "/suivi_dossier",
            name: "suivi_dossier",
            component: () =>
              import("@/views/notary/conteneurs/annonces/SuiviDossier.vue"),
            meta: {
              requiresAuth: true,
              // hideAddAnnonce: true,
              role: "NOTARY_ROLES",
            },
          },
          {
            path: "/verifications_reglementaires",
            name: "verifications_reglementaires",
            component: () =>
              import(
                "@/views/notary/conteneurs/annonces/VerificationsReglementaires.vue"
              ),
            meta: {
              requiresAuth: true,
              // hideAddAnnonce: true,
              role: "NOTARY_ROLES",
            },
          },
          {
            path: "/mise_a_jour_legale",
            name: "mise_a_jour_legale",
            component: () =>
              import("@/views/notary/conteneurs/annonces/MiseAjourLegale.vue"),
            meta: {
              requiresAuth: true,
              // hideAddAnnonce: true,
              role: "NOTARY_ROLES",
            },
          },
          {
            path: "/rapports_conformite",
            name: "rapports_conformite",
            component: () =>
              import(
                "@/views/notary/conteneurs/annonces/RapportsConformite.vue"
              ),
            meta: {
              requiresAuth: true,
              // hideAddAnnonce: true,
              role: "NOTARY_ROLES",
            },
          },
          // {
          //   path: "/transactions",
          //   name: "transactions",
          //   component: () =>
          //     import(
          //       "@/views/notary/conteneurs/transactions/ViewTransactions.vue"
          //     ),
          //   meta: {
          //     requiresAuth: true,
          //     // hideAddAnnonce: true,
          //     role: "NOTARY_ROLES",
          //   },
          // },

          // {
          //   path: "/suivi_loyers",
          //   name: "suivi_loyers",
          //   component: () =>
          //     import("@/views/notary/conteneurs/annonces/SuiviLoyers.vue"),
          //   meta: {
          //     requiresAuth: true,
          //     // hideAddAnnonce: true,
          //     role: "NOTARY_ROLES",
          //   },
          // },
          // {
          //   path: "/releve_de_compte",
          //   name: "releve_de_compte",
          //   component: () =>
          //     import("@/views/notary/conteneurs/annonces/ReleveDeCompte.vue"),
          //   meta: {
          //     requiresAuth: true,
          //     // hideAddAnnonce: true,
          //     role: "NOTARY_ROLES",
          //   },
          // },
          // {
          //   path: "/declarations_fiscales",
          //   name: "declarations_fiscales",
          //   component: () =>
          //     import(
          //       "@/views/notary/conteneurs/annonces/DeclarationsFiscales.vue"
          //     ),
          //   meta: {
          //     requiresAuth: true,
          //     // hideAddAnnonce: true,
          //     role: "NOTARY_ROLES",
          //   },
          // },
        ],
      },
      // {
      //   path: "files",
      //   name: "NotaryFiles",
      //   component: () => import("@/views/notary/Files.vue"),
      //   meta: { requiresAuth: true, role: "NOTARY_ROLES" },
      // },
      // {
      //   path: "transactions",
      //   name: "NotaryTransactions",
      //   component: () => import("@/views/notary/Transactions.vue"),
      //   meta: { requiresAuth: true, role: "NOTARY_ROLES" },
      // },
      // {
      //   path: "documents",
      //   name: "NotaryDocuments",
      //   component: () => import("@/views/notary/Documents.vue"),
      //   meta: { requiresAuth: true, role: "NOTARY_ROLES" },
      // },
      // {
      //   path: "verifications",
      //   name: "NotaryVerifications",
      //   component: () => import("@/views/notary/Verifications.vue"),
      //   meta: { requiresAuth: true, role: "NOTARY_ROLES" },
      // },
    ],
  },
];

export default notaryRoutes;
