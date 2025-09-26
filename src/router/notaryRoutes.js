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
    },
    redirect: "notary_dashboard",
    children: [
      {
        path: "/notary_dashboard",
        name: "notary_dashboard",
        component: () => import("@/views/notary/NotaryDashboard.vue"),
        meta: { requiresAuth: true, role: "NOTARY_ROLES" },
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
