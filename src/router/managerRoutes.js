import SecondWebsiteLayout from "@/layouts/SecondWebsite.vue";
import store from "@/store/index";
const managerRoutes = [
  {
    path: "/manager",
    component: SecondWebsiteLayout,
    meta: { requiresAuth: true, role: "MANAGER_ROLES" },
    redirect: "manager_dashboard",
    children: [
      {
        path: "manager_dashboard",
        name: "manager_dashboard",
        component: () => import("@/views/manager/ManagerDashboard.vue"),
        meta: { requiresAuth: true, role: "MANAGER_ROLES" },
      },
      // {
      //   path: "portfolio",
      //   name: "ManagerPortfolio",
      //   component: () => import("@/views/manager/Portfolio.vue"),
      //   meta: { requiresAuth: true, role: "MANAGER_ROLES" },
      // },
      // {
      //   path: "tenants",
      //   name: "ManagerTenants",
      //   component: () => import("@/views/manager/Tenants.vue"),
      //   meta: { requiresAuth: true, role: "MANAGER_ROLES" },
      // },
      // {
      //   path: "leases",
      //   name: "ManagerLeases",
      //   component: () => import("@/views/manager/Leases.vue"),
      //   meta: { requiresAuth: true, role: "MANAGER_ROLES" },
      // },
      // {
      //   path: "maintenance",
      //   name: "ManagerMaintenance",
      //   component: () => import("@/views/manager/Maintenance.vue"),
      //   meta: { requiresAuth: true, role: "MANAGER_ROLES" },
      // },
      // {
      //   path: "suppliers",
      //   name: "ManagerSuppliers",
      //   component: () => import("@/views/manager/Suppliers.vue"),
      //   meta: { requiresAuth: true, role: "MANAGER_ROLES" },
      // },
    ],
  },
];

export default managerRoutes;
