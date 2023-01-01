import axios from "axios";
import router from "@/router";
import {
  getToken,
  setToken,
  removeToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
} from "@/helpers/auth";
import { API_URLS } from "@/config/api";
import { ElMessage } from "element-plus";

const service = axios.create({
  // baseURL: "https://93.115.20.172:8081/",
  // baseURL: "http://localhost:8081/",
  baseURL: `${API_URLS.API_BASE}`,
  withCredentials: true,
  crossorigin: true,
  timeout: 60000,
});

// Indicateur pour suivre l'état du rafraîchissement du token
let isRefreshing = false;
let failedQueue = [];
let refreshTokenPromise = null;
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Fonction pour gérer le rafraîchissement du token
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const { data } = await axios.post(
      `${API_URLS.REFRESH_TOKEN}`,
      { refreshToken }, // correspond au backend
      {
        timeout: 10000,
        headers: { "Content-Type": "application/json" },
      }
    );

    // Le backend renvoie : { token, refreshToken }
    if (!data.token) {
      throw new Error("Invalid token response");
    }

    // Mettre à jour le token dans le localStorage / cookies
    setToken(data.token);

    // Mettre à jour le refresh token si présent
    if (data.refreshToken) {
      setRefreshToken(data.refreshToken);
    }

    return data.token; // retourner le token pour l’intercepteur
  } catch (error) {
    // Nettoyer les tokens invalides
    removeToken();
    removeRefreshToken();
    throw error;
  }
};

// Fonction pour gérer la déconnexion
const handleLogout = (
  message = "Session expirée. Veuillez vous reconnecter."
) => {
  removeToken();
  removeRefreshToken();

  // Éviter les messages multiples
  if (!window.__logoutInProgress) {
    window.__logoutInProgress = true;
    ElMessage.error(message);

    // Reset après la navigation
    setTimeout(() => {
      window.__logoutInProgress = false;
    }, 1000);
  }

  // Éviter les redirections multiples
  if (router.currentRoute.value.path !== "/login") {
    router.push("/login");
  }
};
// Intercepteur de requêtes
service.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Ajouter un identifiant unique pour le suivi des requêtes
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponses
service.interceptors.response.use(
  (response) => {
    // Optionnel : Log des performances
    if (response.config.metadata) {
      const duration = new Date() - response.config.metadata.startTime;
      console.debug(`Request to ${response.config.url} took ${duration}ms`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Gérer les erreurs réseau
    if (!error.response) {
      // Vérifier si c'est une erreur de timeout
      if (error.code === "ECONNABORTED") {
        ElMessage.error("La requête a expiré. Veuillez réessayer.");
      } else if (error.message === "Network Error") {
        ElMessage.error(
          "Erreur de connexion. Vérifiez votre connexion internet."
        );
      } else {
        ElMessage.error("Erreur de connexion au serveur.");
      }
      return Promise.reject(error);
    }
    const { status } = error.response;
    // Gérer l'erreur 401 (Non autorisé)
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Si un rafraîchissement est déjà en cours, attendre
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return service(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      // Démarrer le rafraîchissement
      isRefreshing = true;

      // Utiliser une promesse partagée pour éviter les appels multiples
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshAccessToken()
          .then((token) => {
            processQueue(null, token);
            return token;
          })
          .catch((err) => {
            processQueue(err, null);
            handleLogout("Session expirée. Veuillez vous reconnecter.");
            throw err;
          })
          .finally(() => {
            isRefreshing = false;
            refreshTokenPromise = null;
          });
      }
      try {
        const token = await refreshTokenPromise;
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        return service(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    // Gérer les autres codes d'erreur
    const errorMessages = {
      403: "Accès interdit. Vous n'avez pas les permissions nécessaires.",
      404: "Ressource non trouvée.",
      409: "Conflit. La ressource existe déjà ou est en cours d'utilisation.",
      422: "Données invalides. Veuillez vérifier vos informations.",
      429: "Trop de requêtes. Veuillez réessayer plus tard.",
      500: "Erreur interne du serveur. Veuillez réessayer.",
      502: "Passerelle incorrecte. Le serveur est temporairement indisponible.",
      503: "Service indisponible. Veuillez réessayer dans quelques instants.",
    };

    const message =
      errorMessages[status] ||
      error.response.data?.message ||
      `Erreur: ${status}`;

    // Éviter les messages en double
    if (!error.config.__messageShown) {
      ElMessage.error(message);
      error.config.__messageShown = true;
    }
    return Promise.reject(error);
  }
);
// Fonction helper pour les requêtes avec retry
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      const isLastAttempt = i === maxRetries - 1;
      const shouldRetry =
        error.response?.status >= 500 ||
        error.code === "ECONNABORTED" ||
        error.message === "Network Error";

      if (isLastAttempt || !shouldRetry) {
        throw error;
      }

      // Attendre avant de réessayer (backoff exponentiel)
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, i))
      );
    }
  }
};

// Fonction pour annuler les requêtes en cours
export const createCancelToken = () => {
  const CancelToken = axios.CancelToken;
  return CancelToken.source();
};
export default service;
