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
      hideHeaderFooter: false,
      hideNotifications: true,
    },
    redirect: { name: "supplier_dashboard" },
    children: [
      {
        path: "/supplier_dashboard",
        name: "supplier_dashboard",
        component: () => import("@/views/supplier/SupplierDashboard.vue"),
        meta: { requiresAuth: true, role: "SUPPLIER_ROLES" },
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
