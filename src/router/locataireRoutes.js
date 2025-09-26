import SecondWebsiteLayout from "@/layouts/SecondWebsite.vue";
import store from "@/store/index";
// Routes Locataire
const locataireRoutes = [
  {
    path: "/Locataire",
    component: SecondWebsiteLayout,
    meta: {
      requiresAuth: true,
      role: "LOCATAIRE_ROLES",
      hideHeaderFooter: false,
    },
    redirect: "locataire_dashboard",
    children: [
      {
        path: "locataire_dashboard",
        name: "locataire_dashboard",
        component: () => import("@/views/locataire/LocataireDashboard.vue"),
        meta: { requiresAuth: true, role: "LOCATAIRE_ROLES" },
        redirect: { name: "Reservations_location" },
        children: [
          {
            path: "reservations_location",
            name: "Reservations_location",
            component: () =>
              import("@/views/locataire/ReservationsLocation.vue"),
            meta: { requiresAuth: true, role: "LOCATAIRE_ROLES" },
          },
          {
            path: "contrat_location",
            name: "contrat_location",
            component: () => import("@/views/locataire/LocationBail.vue"),
            meta: { requiresAuth: true, role: "LOCATAIRE_ROLES" },
          },
          {
            path: "contrat_document",
            name: "contrat_document",
            component: () => import("@/views/locataire/DocumentList.vue"),
            meta: { requiresAuth: true, role: "LOCATAIRE_ROLES" },
          },
          {
            path: "paiements_historique",
            name: "paiements_historique",
            component: () =>
              import("@/views/locataire/PaiementsHistorique.vue"),
            meta: { requiresAuth: true, role: "LOCATAIRE_ROLES" },
          },
          {
            path: "quittances_loyers",
            name: "quittances_loyers",
            component: () => import("@/views/locataire/QuittancesLoyers.vue"),
            meta: { requiresAuth: true, role: "LOCATAIRE_ROLES" },
          },
          {
            path: "suivi_charges",
            name: "suivi_charges",
            component: () => import("@/views/locataire/SuiviCharges.vue"),
            meta: { requiresAuth: true, role: "LOCATAIRE_ROLES" },
          },
          {
            path: "demande_maintenance",
            name: "demande_maintenance",
            component: () => import("@/views/locataire/DemandeMaintenance.vue"),
            meta: { requiresAuth: true, role: "LOCATAIRE_ROLES" },
          },
          {
            path: "reclamation_historique",
            name: "reclamation_historique",
            component: () =>
              import("@/views/locataire/ReclamationsHistorique.vue"),
            meta: { requiresAuth: true, role: "LOCATAIRE_ROLES" },
          },
          {
            path: "services_annexe",
            name: "services_annexe",
            component: () =>
              import("@/views/locataire/ServicesAnnexesHistorique.vue"),
            meta: { requiresAuth: true, role: "LOCATAIRE_ROLES" },
          },
          {
            path: "messages", // Catch all route pour attraper toutes les erreurs
            name: "messages",
            component: () => import("@/components/modal/MessagesChat.vue"), // Créer cette page si elle n'existe pas encore
            meta: { requiresAuth: false },
          },
          {
            path: "profil_details",
            name: "profil_details",
            component: () =>
              import("@/views/locataire/ProfilsDetailsLocataire.vue"),
            meta: { requiresAuth: true },
            props: true,
          },
        ],
      },

      // {
      //   path: "payments",
      //   name: "LocatairePayments",
      //   component: () => import("@/views/locataire/Payments.vue"),
      //   meta: { requiresAuth: true, role: "LOCATAIRE_ROLES" },
      // },
      // {
      //   path: "requests",
      //   name: "LocataireRequests",
      //   component: () => import("@/views/locataire/Requests.vue"),
      //   meta: { requiresAuth: true, role: "LOCATAIRE_ROLES" },
      // },
      // {
      //   path: "messages",
      //   name: "LocataireMessages",
      //   component: () => import("@/views/locataire/Messages.vue"),
      //   meta: { requiresAuth: true, role: "LOCATAIRE_ROLES" },
      // },
    ],
  },
];
export default locataireRoutes;
