import SecondWebsiteLayout from "@/layouts/SecondWebsite.vue";
import store from "@/store/index";
const adminRoutes = [
  {
    path: "/master",
    component: SecondWebsiteLayout,
    meta: {
      requiresAuth: true,
      role: "SUPER_ADMIN_ROLES",
      hideHeaderFooter: true,
    },
    redirect: "master_dashboard",
    redirect: "/master/master_dashboard",
    children: [
      {
        path: "master_dashboard",
        name: "MasterDashboard",
        component: () => import("@/views/master/MasterDashboard.vue"),
        meta: { requiresAuth: true, role: "SUPER_ADMIN_ROLES" },
        redirect: "/master/master_dashboard/master_accueil",
        children: [
          {
            path: "liste_agents",
            name: "liste_agents",
            component: () => import("@/views/master/ListeDesAgents.vue"),
            meta: { requiresAuth: true, role: "SUPER_ADMIN_ROLES" },
          },
          {
            path: "detail_agent/:id",
            name: "detail_agent",
            component: () => import("@/views/master/AgentDetail.vue"),
            meta: { requiresAuth: true, role: "SUPER_ADMIN_ROLES" },
            props: true,
          },
          {
            path: "master_accueil",
            name: "master_accueil",
            component: () =>
              import("@/views/master/MasterDashboardAccueil.vue"),
            meta: { requiresAuth: true, role: "SUPER_ADMIN_ROLES" },
          },
          {
            path: "roles_permissions",
            name: "roles_permissions",
            component: () => import("@/views/master/RolePermissionList.vue"),
            meta: { requiresAuth: true, role: "SUPER_ADMIN_ROLES" },
          },
          {
            path: "access_control",
            name: "access_control",
            component: () => import("@/views/master/ControleAcces.vue"),
            meta: { requiresAuth: true, role: "SUPER_ADMIN_ROLES" },
          },
        ],
      },

      // {
      //   path: "user",
      //   name: "AdminUser",
      //   component: () => import("@/views/master/User.vue"),
      //   meta: { requiresAuth: true, role: "SUPER_ADMIN_ROLES" },
      // },
      // {
      //   path: "produits",
      //   name: "AdminProduits",
      //   component: () => import("@/views/master/Produits.vue"),
      //   meta: { requiresAuth: true, role: "SUPER_ADMIN_ROLES" },
      // },
    ],
  },
];

export default adminRoutes;
