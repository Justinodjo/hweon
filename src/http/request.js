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
  withCredentials: false,
  crossorigin: true,
  timeout: 60000,
});

// Indicateur pour suivre l'état du rafraîchissement du token
let isRefreshing = false;
let failedQueue = [];

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

// Intercepteur de requêtes
service.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponses
service.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response) {
      switch (error.response.status) {
        case 401:
          if (!originalRequest._retry) {
            if (isRefreshing) {
              try {
                const newToken = await new Promise((resolve, reject) => {
                  failedQueue.push({ resolve, reject });
                });
                originalRequest.headers["Authorization"] = "Bearer " + newToken;
                return service(originalRequest);
              } catch (err) {
                return Promise.reject(err);
              }
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = getRefreshToken();
            if (!refreshToken) {
              ElMessage.error("Session expirée. Veuillez vous reconnecter.");
              removeToken();
              router.push("/login");
              return Promise.reject(error);
            }

            try {
              const { data } = await axios.post(
                // "https://93.115.20.172:8081/auth/refresh-token",
                // "http://localhost:8081/auth/refresh-token",
                `${API_URLS.REFRESH_TOKEN}`,
                { token: refreshToken }
              );
              setToken(data.accessToken);
              setRefreshToken(data.refreshToken); // Met à jour le refresh token
              originalRequest.headers["Authorization"] =
                "Bearer " + data.accessToken;
              processQueue(null, data.accessToken);
              return service(originalRequest);
            } catch (err) {
              processQueue(err, null);
              ElMessage.error(
                "Impossible de rafraîchir le token. Veuillez vous reconnecter."
              );
              removeToken();
              removeRefreshToken(); // Supprime le refresh token
              router.push("/login");
              return Promise.reject(err);
            } finally {
              isRefreshing = false;
            }
          }
          break;
        case 403:
          ElMessage.error("Accès interdit.");
          break;
        case 404:
          ElMessage.error("Ressource non trouvée.");
          break;
        case 500:
          ElMessage.error("Erreur interne du serveur.");
          break;
        default:
          ElMessage.error(`Erreur: ${error.response.status}`);
      }
    } else {
      ElMessage.error("Erreur de connexion au serveur.");
    }
    return Promise.reject(error);
  }
);

export default service;
