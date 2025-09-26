import request from "@/http/request";
import {
  getToken,
  setToken,
  removeToken,
  getRoles,
  setRoles,
  removeRoles,
  getPermissions,
  setPermissions,
  removePermissions,
  getEmail,
  setEmail,
  removeEmail,
  setFichier,
  getFichier,
  getUserInfo,
  setUserInfo,
  removeUserInfo,
  removeFichier,
  getUserName,
  setUserName,
  removeUserName,
  getSecondName,
  setSecondName,
  removeSecondName,
} from "@/helpers/auth";

const state = {
  token: getToken("token") || "",
  usernameOrEmail: "",
  roles: JSON.parse(getRoles() || "[]"),
  permissions: JSON.parse(getPermissions() || "[]"),
  userInfo: getUserInfo("userInfo") || null,
  userName: getUserName("userName") || "",
  secondName: getSecondName("secondName") || "",
  email: getEmail("email") || "",
  fichier: getFichier("fichier") || "",
};

const mutations = {
  SET_AUTH(state, authData) {
    // console.log("Mutation SET_AUTH called with data:", authData); // Vérification des données qui arrivent dans la mutation
    if (authData.token) {
      state.token = authData.token;
      state.usernameOrEmail = authData.usernameOrEmail;
      // Assurez-vous que les rôles sont des objets 'GrantedAuthority' complets
      state.roles = authData.roles || [];
      state.permissions = authData.permissions || [];
      state.fichier = authData.fichier || "";
      state.userInfo = authData.id;

      state.userName = authData.userName;
      state.email = authData.email;
      state.secondName = authData.secondName;
      setToken("token", authData.token, "7d");
      setRoles(JSON.stringify(state.roles));
      setPermissions(JSON.stringify(state.permissions));
      setFichier("fichier", authData.fichier, "7d");
      setUserInfo("userInfo", authData.id, "7d");
      setEmail("email", authData.email, "7d");
      setUserName("userName", authData.userName, "7d");
      setSecondName("secondName", authData.secondName, "7d");
      // console.log("Token saved in cookies:", authData.token); // Vérification de l'enregistrement du token
    } else {
      // console.error("Token is missing in authData");
    }
  },
  SET_USER_DETAILS(state, authData) {
    state.userName = authData.userName;
    state.secondName = authData.secondName;
    state.email = authData.email;
    state.userInfo = authData.id;
    state.fichier = authData.fichier || "";
  },
  LOGOUT(state) {
    // console.log("Mutation LOGOUT called");
    state.token = null;
    state.usernameOrEmail = "";
    state.email = "";
    state.roles = [];
    state.permissions = [];
    state.fichier = "";
    state.userInfo = "";
    (state.userName = ""), (state.secondName = ""), removeToken("token");
    removeUserInfo("userInfo");
    removeEmail("email");
    removeUserName("userName");
    removeSecondName("secondName");
    removeFichier("fichier");
    removeToken("roles");
    removePermissions("permissions");
  },
};

const actions = {
  async login({ commit }, authRequest) {
    console.log("Action login called with request:", authRequest);

    try {
      const response = await request.post("auth/login", authRequest);
      console.log(response.data.roles);
      const authData = response.data;

      // 🛠️ Débogage : Voir la réponse de l'API
      console.log("Login API response:", authData);

      // Vérifier si authData est bien un objet
      if (!authData || typeof authData !== "object") {
        console.error("La réponse de l'API est invalide :", authData);
        throw new Error("Réponse API invalide !");
      }

      // Vérifie si la réponse contient une erreur d'authentification
      if (
        authData.message &&
        authData.message === "Invalid username or password"
      ) {
        console.error("Nom d'utilisateur ou mot de passe invalide.");
        throw new Error("Nom d'utilisateur ou mot de passe invalide.");
      }
      // 🛠️ Vérifier si `roles` est un tableau
      if (!authData.roles || !Array.isArray(authData.roles)) {
        console.error(
          "Les rôles ne sont pas un tableau ou sont manquants :",
          authData.roles
        );
        throw new Error("Les rôles ne sont pas un tableau valide !");
      }

      // 🎯 Séparation rôles vs permissions
      const authorities = authData.roles || [];

      const extractedRoles = authorities
        .map((r) => r.authority)
        .filter((auth) => auth.startsWith("ROLE_"))
        .map((role) => role.replace("ROLE_", "").trim());

      const extractedPermissions = authorities
        .map((r) => r.authority)
        .filter((auth) => !auth.startsWith("ROLE_"));

      // Injecter les nouveaux champs
      authData.roles = extractedRoles;
      authData.permissions = extractedPermissions;
      // 🛠️ Vérifier si le token est bien présent
      if (!authData.token) {
        console.error("Le token JWT est manquant dans la réponse de l'API.");
        throw new Error("Le token JWT est manquant !");
      }

      // ✅ Si tout est bon, on enregistre les données
      commit("SET_AUTH", authData);
      console.log("Token reçu :", authData.token);
    } catch (error) {
      console.error("Login API error:", error);
      throw error; // Permet au composant d'attraper l'erreur
    }
  },

  logout({ commit }) {
    // Vous pouvez ajouter des actions supplémentaires ici, comme supprimer le token, etc.
    commit("LOGOUT");
    removeEmail("email");
    removeUserName("userName");
    removeSecondName("secondName");
    removeFichier("fichier");
    removeRoles("roles");
    removePermissions("permissions");
  },
  async deleteAccount({ commit }) {
    try {
      // Appel de l'API pour supprimer le compte de l'utilisateur
      const response = await request.delete("auth/deleteAccount"); // Vérifie l'URL de ton API pour la suppression du compte

      // Supprimer le token et autres données locales
      commit("LOGOUT");
      removeToken("token");
      removeUserName("userName");
      removeSecondName("secondName");
      removeEmail("email");
      removeFichier("fichier");
      removeRoles("roles");
      removePermissions("permissions");

      // console.log("Compte supprimé avec succès.");
    } catch (error) {
      // console.error("Erreur lors de la suppression du compte", error);
      throw new Error("Échec de la suppression du compte");
    }
  },

  async getUserInfo({ commit, state, dispatch }) {
    const userId = state.userInfo; // ID de l'utilisateur
    if (!userId) {
      console.error("Aucun utilisateur connecté.");
      return;
    }

    try {
      // Appel à l'action getOne pour récupérer les informations complètes de l'utilisateur
      const userData = await dispatch("users/getOne", userId);

      // Une fois les données récupérées, vous pouvez mettre à jour l'état de l'authentification
      commit("SET_USER_DETAILS", userData);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations de l'utilisateur:",
        error
      );
    }
  },
};

const getters = {
  isAuthenticated: (state) => state.token,
  userRoles: (state) => state.roles,
  userPermissions: (state) => state.permissions,
  hasPermission: (state) => (permission) => {
    return (state.permissions || []).includes(permission);
  },
  userFichier: (state) => state.fichier,
  usernameOrEmail: (state) => state.usernameOrEmail,
  userInfo: (state) => state.userInfo,
  userName: (state) => state.userName,
  secondName: (state) => state.secondName,
  email: (state) => state.email,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
