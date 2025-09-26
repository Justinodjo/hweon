import { createRouter, createWebHistory } from "vue-router";
import Cookies from "js-cookie";
import {
  getToken,
  setToken,
  getRoles,
  setRoles,
  getUserInfo,
  setUserInfo,
  getUserName,
  setUserName,
  getEmail,
  setEmail,
} from "@/helpers/auth";
import store from "@/store/index";
import publicRoutes from "./publicRoutes";
import adminRoutes from "./adminRoutes";
import managerRoutes from "./managerRoutes";
import masterRoutes from "./masterRoutes";
import locataireRoutes from "./locataireRoutes"; // Assurez-vous d'importer locataireRoutes depuis le fichier approprié
import proprietaireRoutes from "./proprietaireRoutes";
import notaryRoutes from "./notaryRoutes";
import supplierRoutes from "./supplierRoutes";
// Regrouper toutes les routes
const routes = [
  ...publicRoutes,
  ...adminRoutes,
  ...managerRoutes,
  ...masterRoutes,
  ...locataireRoutes,
  ...proprietaireRoutes,
  ...notaryRoutes,
  ...supplierRoutes,
  {
    path: "/:catchAll(.*)", // Catch all route pour attraper toutes les erreurs
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"), // Créer cette page si elle n'existe pas encore
    meta: { requiresAuth: false },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Garde de navigation pour l'authentification et les rôles
router.beforeEach((to, from, next) => {
  console.log("Navigation vers :", to.path);

  // Utilisation de Cookies pour récupérer les informations

  const token = getToken();
  const roles = JSON.parse(getRoles() || "[]");
  const userRoles = store.getters["auth/userRoles"];
  const userInfo = getUserInfo();

  const isAuthenticated = token !== undefined && token !== null && token !== "";

  if (to.path === "/login" && isAuthenticated) {
    // const roleRedirects = {
    //   ADMIN_ROLES: "/admin",
    //   MANAGER_ROLES: "/manager_dashboard",
    //   CLIENTS_ROLES: "/",
    //   SUPER_ADMIN_ROLES: "/master_dashboard",
    //   LOCATAIRE_ROLES: "/locataire_dashboard",
    //   PROPRIETAIRE_ROLES: "/proprietaire_dashboard",
    // };
    // // Trouver la première redirection valide basée sur les rôles
    // const redirectPath = roles
    //   .map((role) => roleRedirects[role])
    //   .find((path) => path !== undefined);
    // if (redirectPath) {
    //   console.log(`Redirection vers ${redirectPath} basée sur le rôle`);
    //   return next({ path: redirectPath });
    // }
  }

  // Laisser passer "DirectoryDetails" sans authentification
  if (to.name === "DirectoryDetails") {
    return next();
  }

  // Vérifier si la route nécessite une authentification
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      console.log("Non authentifié, redirection vers login");
      if (to.path !== "/login") {
        // On ne redirige pas vers /login si l'utilisateur est déjà dessus
        return next({ path: "/login", query: { redirect: to.fullPath } });
      }
    }

    // Contrôle d'accès basé sur les rôles
    if (to.meta.role && !userRoles.includes(to.meta.role)) {
      console.log("Rôle non autorisé, redirection vers /unauthorized");
      return next({ path: "/unauthorized" });
    }

    // Redirection en fonction des rôles
    // const roleRedirects = {
    //   ADMIN_ROLES: "/admin",
    //   MANAGER_ROLES: "/manager_dashboard",
    //   CLIENTS_ROLES: "/",
    //   SUPER_ADMIN_ROLES: "/master_dashboard",
    //   LOCATAIRE_ROLES: "/locataire_dashboard",
    //   PROPRIETAIRE_ROLES: "/proprietaire_dashboard",
    // };

    // // Trouver la première route correspondant au rôle de l'utilisateur
    // const redirectPath = roles
    //   .map((role) => roleRedirects[role])
    //   .find((path) => path !== undefined);

    // // Redirection en fonction du rôle de l'utilisateur
    // if (redirectPath && to.path !== redirectPath) {
    //   console.log(`Redirection vers ${redirectPath} basée sur le rôle`);
    //   return next({ path: redirectPath });
    // }

    // if (redirectPath && to.path !== redirectPath && to.path !== "/login") {
    //   return next({ path: redirectPath });
    // }
  }

  next(); // Continuer la navigation
});

export default router;
