import request from "@/http/request"; // Import de la configuration de requêtes HTTP
import { API_URLS } from "@/config/api"; // Les URL de ton API

const state = {
  favoris: [],
  loading: false,
  error: null,
};

const getters = {
  allFavoris: (state) => state.favoris,
  isFavorite: (state) => (bienId) => state.favoris.includes(bienId),
  countFavoris: (state) => state.favoris.length,
};

const actions = {
  // Récupérer les favoris de l'utilisateur
  async fetchFavoris({ commit }) {
    commit("SET_LOADING", true);
    try {
      const response = await axios.get(`${API_URLS.API_BASE}/favoris`);
      commit(
        "SET_FAVORIS",
        response.data.map((f) => f.bienId)
      );
      return response.data;
    } catch (error) {
      commit("SET_ERROR", error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // Ajouter aux favoris
  async addFavori({ commit }, bienId) {
    try {
      const response = await axios.post(`${API_URLS.API_BASE}/favoris`, {
        bienId,
      });
      commit("ADD_FAVORI", bienId);
      return response.data;
    } catch (error) {
      commit("SET_ERROR", error.message);
      throw error;
    }
  },

  // Retirer des favoris
  async removeFavori({ commit }, bienId) {
    try {
      await axios.delete(`${API_URLS.API_BASE}/favoris/${bienId}`);
      commit("REMOVE_FAVORI", bienId);
    } catch (error) {
      commit("SET_ERROR", error.message);
      throw error;
    }
  },

  // Toggle favori
  async toggleFavori({ state, dispatch }, bienId) {
    if (state.favoris.includes(bienId)) {
      await dispatch("removeFavori", bienId);
    } else {
      await dispatch("addFavori", bienId);
    }
  },
};

const mutations = {
  SET_FAVORIS(state, favoris) {
    state.favoris = favoris;
  },

  ADD_FAVORI(state, bienId) {
    if (!state.favoris.includes(bienId)) {
      state.favoris.push(bienId);
    }
  },

  REMOVE_FAVORI(state, bienId) {
    state.favoris = state.favoris.filter((id) => id !== bienId);
  },

  SET_LOADING(state, status) {
    state.loading = status;
  },

  SET_ERROR(state, error) {
    state.error = error;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
