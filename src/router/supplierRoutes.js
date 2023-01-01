import SecondWebsiteLayout from "@/layouts/SecondWebsite.vue";
import store from "@/store/index";
// Routes Supplier
const supplierRoutes = [
  {
    path: "/supplier",
    component: SecondWebsiteLayout,
    meta: {
      requiresAuth: true,
      role: "SUPPLIER_ROLES",
      hideHeaderFooter: true,
      hideNotifications: false,
    },
    redirect: "/supplier/supplier_dashboard",
    children: [
      {
        path: "supplier_dashboard",
        name: "supplier_dashboard",
        component: () => import("@/views/supplier/menus/Dashboard.vue"),
        meta: { requiresAuth: true, role: "SUPPLIER_ROLES" },
        redirect: "/supplier/supplier_dashboard/vue_initialy_primary",
        children: [
          {
            path: "vue_initialy_primary",
            name: "vue_initialy_primary",
            component: () =>
              import("@/components/ui/supplier/DataTableAccueil.vue"),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "SUPPLIER_ROLES",
            },
          },
          {
            path: "planning_interventions",
            name: "planning_interventions",
            component: () =>
              import(
                "@/views/supplier/conteneurs/annonces/PlanningInterventions.vue"
              ),
            meta: {
              requiresAuth: true,
              role: "SUPPLIER_ROLES",
            },
          },
          {
            path: "demandes_en_attente",
            name: "demandes_en_attente",
            component: () =>
              import(
                "@/views/supplier/conteneurs/annonces/DemandesAttente.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "SUPPLIER_ROLES",
            },
          },
          {
            path: "historique_des_travaux",
            name: "historique_des_travaux",
            component: () =>
              import(
                "@/views/supplier/conteneurs/annonces/HistoriqueDesTravaux.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "SUPPLIER_ROLES",
            },
          },
          {
            path: "creation_devis",
            name: "creation_devis",
            component: () =>
              import("@/views/supplier/conteneurs/annonces/CreationDevis.vue"),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "SUPPLIER_ROLES",
            },
          },
          {
            path: "paiements_recu",
            name: "paiements_recu",
            component: () =>
              import("@/views/supplier/conteneurs/annonces/PaiementsRecu.vue"),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "SUPPLIER_ROLES",
            },
          },
          {
            path: "suivi_des_factures",
            name: "suivi_des_factures",
            component: () =>
              import(
                "@/views/supplier/conteneurs/annonces/SuiviDesFactures.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "SUPPLIER_ROLES",
            },
          },
          {
            path: "contacts_gestionnaires",
            name: "contacts_gestionnaires",
            component: () =>
              import(
                "@/views/supplier/conteneurs/annonces/ContactsGestionnaires.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "SUPPLIER_ROLES",
            },
          },
          {
            path: "proprietes_assigne",
            name: "proprietes_assigne",
            component: () =>
              import(
                "@/views/supplier/conteneurs/annonces/ProprietesAssigne.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "SUPPLIER_ROLES",
            },
          },
          {
            path: "evaluations_recus",
            name: "evaluations_recus",
            component: () =>
              import(
                "@/views/supplier/conteneurs/annonces/EvaluationsRecus.vue"
              ),
            meta: {
              requiresAuth: true,
              hideAddAnnonce: false,
              role: "SUPPLIER_ROLES",
            },
          },
        ],
      },
      //   {
      //     path: "interventions",
      //     name: "SupplierInterventions",
      //     component: () => import("@/views/supplier/Interventions.vue"),
      //     meta: { requiresAuth: true, role: "SUPPLIER_ROLES" },
      //   },
      //   {
      //     path: "schedule",
      //     name: "SupplierSchedule",
      //     component: () => import("@/views/supplier/Schedule.vue"),
      //     meta: { requiresAuth: true, role: "SUPPLIER_ROLES" },
      //   },
      //   {
      //     path: "quotes",
      //     name: "SupplierQuotes",
      //     component: () => import("@/views/supplier/Quotes.vue"),
      //     meta: { requiresAuth: true, role: "SUPPLIER_ROLES" },
      //   },
      //   {
      //     path: "invoices",
      //     name: "SupplierInvoices",
      //     component: () => import("@/views/supplier/Invoices.vue"),
      //     meta: { requiresAuth: true, role: "SUPPLIER_ROLES" },
      //   },
    ],
  },
];
export default supplierRoutes;
