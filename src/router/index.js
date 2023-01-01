import { createRouter, createWebHistory } from "vue-router";
import getRedirectByRole from "@/helpers/getRedirectByRole";
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
  {
    path: "/",
    redirect: "/home",
  },
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
// Routes publiques qui ne nécessitent pas d'authentification
const publicPaths = [
  "/home",
  "/login",
  "/directory/login",
  "/directory/signup",
  "/directory/forgot",
  "/select-role",
  "/login/oauth2/success",
  "/directory/unauthorized",
  "/unauthorized",
];

// Fonction pour vérifier si une route est publique
const isPublicRoute = (path) => {
  return (
    publicPaths.some((publicPath) => path.startsWith(publicPath)) ||
    path.startsWith("/oauth2/redirect") ||
    path === "/directory/details" || // Pour DirectoryDetails
    /^\/directory\/details\/\d+$/.test(path) // Pattern pour /directory/details/:id
  );
};

// Variable pour éviter les boucles infinies
let isAuthChecking = false;
// Garde de navigation pour l'authentification et les rôles
router.beforeEach(async (to, from, next) => {
  console.log("Navigation vers :", to.path);
  // ✅ Autoriser les routes publiques sans vérification
  if (isPublicRoute(to.path) || to.name === "DirectoryDetails") {
    console.log("✅ Route publique autorisée");
    return next();
  }
  // Utilisation de Cookies pour récupérer les informations

  const token = getToken();
  let userRoles = store.getters["auth/userRoles"];
  const isAuthenticated = !!token;
  // const isAuthenticated = token !== undefined && token !== null && token !== "";
  console.log("🔐 Token présent:", isAuthenticated);
  console.log("👥 Rôles actuels:", userRoles);

  // Vérifier si la route nécessite une authentification
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    console.log("❌ Non authentifié, redirection vers /login");
    return next({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }
  // Laisser passer "DirectoryDetails" sans authentification
  // if (to.name === "DirectoryDetails") {
  //   return next();
  // }

  // 🧠 Si un token existe mais pas de rôles → recharger l'utilisateur
  if (
    isAuthenticated &&
    (!userRoles || userRoles.length === 0) &&
    !isAuthChecking
  ) {
    isAuthChecking = true;

    try {
      console.log("🔄 Récupération du profil utilisateur...");
      await store.dispatch("auth/checkAuth");

      // Rafraîchir les rôles après la récupération
      userRoles = store.getters["auth/userRoles"];
      console.log("✅ Profil utilisateur chargé, rôles:", userRoles);
    } catch (error) {
      console.error("⚠️ Échec du chargement de l'utilisateur:", error);

      // Si l'erreur est 401, le token est invalide
      if (error.response?.status === 401) {
        console.log("🔒 Token invalide, redirection vers /login");
        return next({
          path: "/login",
          query: { redirect: to.fullPath },
        });
      }
    } finally {
      isAuthChecking = false;
    }
  }
  // Contrôle d'accès basé sur les rôles (si spécifié dans la route)
  if (requiresAuth && to.meta.roles) {
    const hasRequiredRole = to.meta.roles.some((role) =>
      userRoles.includes(role)
    );

    if (!hasRequiredRole) {
      console.log("🚫 Accès refusé: rôles insuffisants");
      console.log("📋 Rôles requis:", to.meta.roles);
      console.log("👤 Rôles de l'utilisateur:", userRoles);

      return next({
        path: "/unauthorized",
        query: { from: to.fullPath },
      });
    }
  }
  if (requiresAuth) {
    // Cherche tous les rôles requis dans la pile de routes imbriquées
    const requiredRoles = to.matched
      .filter((record) => record.meta.role || record.meta.roles)
      .flatMap((record) =>
        record.meta.roles ? record.meta.roles : [record.meta.role]
      );

    if (requiredRoles.length > 0) {
      const hasRole = requiredRoles.some((role) => userRoles.includes(role));
      if (!hasRole) {
        console.log("🚫 Accès refusé: rôle incorrect");
        console.log("📋 Rôles requis:", requiredRoles);
        console.log("👤 Rôles de l'utilisateur:", userRoles);
        return next({ path: "/unauthorized", query: { from: to.fullPath } });
      }
    }
  }

  if (isAuthenticated && to.path === "/login") {
    const redirectPath = getRedirectByRole(userRoles);
    return next(redirectPath);
  }

  console.log("✅ Navigation autorisée");
  next();
});

// Garde après navigation pour logger les erreurs
// router.afterEach((to, from, failure) => {
//   if (failure) {
//     console.error("❌ Erreur de navigation:", failure);
//   }
// });

// Gestion des erreurs de navigation
router.onError((error) => {
  console.error("🔥 Erreur du router:", error);
});

//   // 🧠 Si un token existe mais pas de rôles → recharger l’utilisateur
//   if (token && (!userRoles || userRoles.length === 0)) {
//     try {
//       console.log("🔄 Récupération du profil utilisateur depuis le store...");
//       await store.dispatch("auth/getCurrentUser");
//     } catch (err) {
//       console.warn("⚠️ Impossible de charger l'utilisateur :", err);
//     }
//   }
//   // Vérifier si la route nécessite une authentification
//   if (to.matched.some((record) => record.meta.requiresAuth)) {
//     if (!isAuthenticated) {
//       console.log("Non authentifié, redirection vers login");
//       if (to.path !== "/login") {
//         // On ne redirige pas vers /login si l'utilisateur est déjà dessus
//         return next({ path: "/login", query: { redirect: to.fullPath } });
//       }
//     }

//     // Contrôle d'accès basé sur les rôles
//     if (
//       to.meta.roles &&
//       !to.meta.roles.some((role) => userRoles.includes(role))
//     ) {
//       return next({ path: "/unauthorized" });
//     }
//   }

//   next(); // Continuer la navigation
// });

export default router;
