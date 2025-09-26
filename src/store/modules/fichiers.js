import request from "@/http/request"; // Import de la configuration de requêtes HTTP
import { API_URLS } from "@/config/api"; // Les URL de ton API

const state = () => ({
  fichiers: [], // Liste des fichiers
  fichier: {}, // Fichier spécifique
  uploadedFile: null, // Fichier téléchargé
});

const getters = {
  fichiers: (state) => state.fichiers,
  fichier: (state) => state.fichier,
  uploadedFile: (state) => state.uploadedFile,
};

const mutations = {
  SET_FICHIERS: (state, fichiers) => {
    state.fichiers = fichiers;
  },
  SET_FICHIER: (state, fichier) => {
    state.fichier = fichier;
  },
  SET_UPLOADED_FILE: (state, file) => {
    state.uploadedFile = file;
  },
  DELETE_FICHIER: (state, id) => {
    state.fichiers = state.fichiers.filter((file) => file.id !== id);
  },
};

const actions = {
  // Récupérer tous les fichiers
  async getAllFichiers({ commit }) {
    try {
      const { data } = await request.get(`${API_URLS.API_BASE}fichier/all`);
      commit("SET_FICHIERS", data);
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des fichiers:", error);
    }
  },

  // Télécharger un fichier par son ID
  async downloadFichier({ commit }, { id }) {
    try {
      const response = await request.get(
        `${API_URLS.API_BASE}fichier/download/${id}`,
        { responseType: "blob" }
      );

      // Créer une URL pour le fichier téléchargé
      const fileUrl = URL.createObjectURL(response.data);
      commit("SET_UPLOADED_FILE", fileUrl);
      return fileUrl;
    } catch (error) {
      console.error("Erreur lors du téléchargement du fichier:", error);
      throw error;
    }
  },

  // Télécharger un fichier par son nom
  async downloadFichierByName({ commit }, { nom }) {
    try {
      const response = await request.get(
        `${API_URLS.API_BASE}fichier/getByName/${nom}`,
        { responseType: "blob" }
      );

      // Créer une URL pour le fichier téléchargé
      const fileUrl = URL.createObjectURL(response.data);
      commit("SET_UPLOADED_FILE", fileUrl);
      return fileUrl;
    } catch (error) {
      console.error("Erreur lors du téléchargement du fichier par nom:", error);
      throw error;
    }
  },

  // Ajouter un fichier
  async uploadFichier({ commit }, { file }) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await request.post(
        `${API_URLS.API_BASE}fichier/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      commit("SET_FICHIER", data); // Enregistrer le fichier ajouté dans le store
      return data;
    } catch (error) {
      console.error("Erreur lors de l'upload du fichier:", error);
      throw error;
    }
  },

  // Supprimer un fichier
  async deleteFichier({ commit }, { id }) {
    try {
      await request.delete(`${API_URLS.API_BASE}fichier/delete/${id}`);
      commit("DELETE_FICHIER", id); // Mise à jour du store après suppression
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du fichier:", error);
      throw error;
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
