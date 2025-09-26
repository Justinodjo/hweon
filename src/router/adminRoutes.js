import SecondWebsiteLayout from "@/layouts/SecondWebsite.vue";
import store from "@/store/index";
const adminRoutes = [
  {
    path: "/admin",
    component: SecondWebsiteLayout,
    meta: { requiresAuth: true, role: "ADMIN_ROLES" },
    redirect: "admin_dashboard",
    children: [
      {
        path: "/admin_dashboard",
        name: "AdminDashboard",
        component: () => import("@/views/admin/AdminDashboard.vue"),
        meta: { requiresAuth: true, role: "ADMIN_ROLES" },
      },
      {
        path: "dashboard",
        name: "AdminDashboard",
        component: () => import("@/views/admin/Dashboard.vue"),
        meta: { requiresAuth: true, role: "ADMIN_ROLES" },
      },
      // {
      //   path: "properties",
      //   name: "AdminProperties",
      //   component: () => import("@/views/admin/Properties.vue"),
      //   meta: { requiresAuth: true, role: "ADMIN_ROLES" },
      // },
      // {
      //   path: "users",
      //   name: "AdminUsers",
      //   component: () => import("@/views/admin/Users.vue"),
      //   meta: { requiresAuth: true, role: "ADMIN_ROLES" },
      // },
      // {
      //   path: "contracts",
      //   name: "AdminContracts",
      //   component: () => import("@/views/admin/Contracts.vue"),
      //   meta: { requiresAuth: true, role: "ADMIN_ROLES" },
      // },
      // {
      //   path: "payments",
      //   name: "AdminPayments",
      //   component: () => import("@/views/admin/Payments.vue"),
      //   meta: { requiresAuth: true, role: "ADMIN_ROLES" },
      // },
      // {
      //   path: "reports",
      //   name: "AdminReports",
      //   component: () => import("@/views/admin/Reports.vue"),
      //   meta: { requiresAuth: true, role: "ADMIN_ROLES" },
      // },
    ],
  },
];

export default adminRoutes;
