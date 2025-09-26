// src/config/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"; // Utiliser l'URL de l'API de votre backend
// import.meta.env.VITE_API_URL || "http://localhost:8080"; // Utiliser l'URL de l'API de votre backend
export const API_URLS = {
  API_BASE: `${API_BASE_URL}`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
  ADD_FICHIER: `${API_BASE_URL}/fichier/add`,
  // Ajoutez d'autres points d'API nécessaires

  CONSENTEMENT_ALL: "consentement/all",
  CONSENTEMENT_BY_USER: (id) => `consentement/by-user/${id}`,
  CONSENTEMENT_ADD: "consentement/add",
  CONSENTEMENT_DELETE: (id) => `consentement/delete/${id}`,
};
