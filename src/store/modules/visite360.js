// store/modules/visite360.js

import request from "@/http/request";
import { API_URLS } from "@/config/api";

const state = () => ({
  all: [],
  one: {},
  visitesByBien: [],
  popularVisites: [],
  stats: {
    totalVisites: 0,
    totalVues: 0,
    visitesMoisDernier: 0,
    tauxEngagement: 0,
  },
  paginationMeta: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 1,
    pageSize: 10,
  },
  hotspots: [],
  loading: false,
  error: null,
});

const getters = {
  all: (state) => state.all,
  one: (state) => state.one,
  visitesByBien: (state) => state.visitesByBien,
  popularVisites: (state) => state.popularVisites,
  stats: (state) => state.stats,
  paginationMeta: (state) => state.paginationMeta,
  hotspots: (state) => state.hotspots,
  loading: (state) => state.loading,
  error: (state) => state.error,

  // Getter pour vérifier si un bien a une visite 360
  hasVisite360: (state) => (bienId) => {
    return state.all.some((v) => v.bien?.id === bienId);
  },

  // Getter pour obtenir la visite d'un bien spécifique
  getVisiteByBienId: (state) => (bienId) => {
    return state.all.find((v) => v.bien?.id === bienId);
  },
};

const mutations = {
  SET_ALL: (state, visites) => {
    state.all = visites;
  },

  SET_ONE: (state, visite) => {
    state.one = visite;
  },

  SET_VISITES_BY_BIEN: (state, visites) => {
    state.visitesByBien = visites;
  },

  SET_POPULAR_VISITES: (state, visites) => {
    state.popularVisites = visites;
  },

  SET_STATS: (state, stats) => {
    state.stats = stats;
  },

  SET_PAGINATION_META: (state, meta) => {
    state.paginationMeta = {
      totalPages: meta.totalPages,
      totalElements: meta.totalElements,
      currentPage: meta.number + 1,
      pageSize: meta.size,
    };
  },

  SET_HOTSPOTS: (state, hotspots) => {
    state.hotspots = hotspots;
  },

  SET_LOADING: (state, loading) => {
    state.loading = loading;
  },

  SET_ERROR: (state, error) => {
    state.error = error;
  },

  UPDATE_ONE: (state, visite) => {
    const index = state.all.findIndex((item) => item.id === visite.id);
    if (index !== -1) {
      state.all.splice(index, 1, visite);
    }
  },

  DELETE_ONE: (state, id) => {
    state.all = state.all.filter((item) => item.id !== id);
  },

  INCREMENT_VUE: (state, visiteId) => {
    const visite = state.all.find((v) => v.id === visiteId);
    if (visite) {
      visite.nombreVues = (visite.nombreVues || 0) + 1;
    }
  },

  ADD_HOTSPOT: (state, hotspot) => {
    state.hotspots.push(hotspot);
  },

  REMOVE_HOTSPOT: (state, hotspotId) => {
    state.hotspots = state.hotspots.filter((h) => h.id !== hotspotId);
  },
};

const actions = {
  // Récupérer toutes les visites avec pagination
  async getAll({ commit }, { page = 0, size = 10 } = {}) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);

    try {
      const { data } = await request.get("visite360/all", {
        params: { page, size },
      });

      commit("SET_ALL", data.content);
      commit("SET_PAGINATION_META", data);

      return data;
    } catch (error) {
      commit("SET_ERROR", error.message);
      console.error("Erreur lors de la récupération des visites 360:", error);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // Récupérer une visite par ID
  async getOne({ commit }, id) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);

    try {
      const { data } = await request.get(`visite360/get/${id}`);
      commit("SET_ONE", data);
      return data;
    } catch (error) {
      commit("SET_ERROR", error.message);
      console.error("Erreur lors de la récupération de la visite:", error);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // Récupérer les visites d'un bien spécifique
  async getVisitesByBien({ commit }, bienId) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);

    try {
      const { data } = await request.get(`visite360/bien/${bienId}`);
      commit("SET_VISITES_BY_BIEN", data);
      return data;
    } catch (error) {
      commit("SET_ERROR", error.message);
      console.error(
        "Erreur lors de la récupération des visites du bien:",
        error
      );
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // Créer une nouvelle visite 360
  async create({ commit }, payload) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);

    try {
      const { data } = await request.post("visite360/add", payload);
      commit("SET_ONE", data);

      // Recharger la liste
      await this.dispatch("visite360/getAll");

      return data;
    } catch (error) {
      commit("SET_ERROR", error.message);
      console.error("Erreur lors de la création de la visite:", error);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // Mettre à jour une visite
  async update({ commit }, payload) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);

    try {
      const { data } = await request.put(
        `visite360/update/${payload.id}`,
        payload
      );
      commit("UPDATE_ONE", data);
      return data;
    } catch (error) {
      commit("SET_ERROR", error.message);
      console.error("Erreur lors de la mise à jour de la visite:", error);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // Supprimer une visite
  async delete({ commit }, id) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);

    try {
      await request.delete(`visite360/delete/${id}`);
      commit("DELETE_ONE", id);
    } catch (error) {
      commit("SET_ERROR", error.message);
      console.error("Erreur lors de la suppression de la visite:", error);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // Incrémenter le compteur de vues
  async incrementVue({ commit }, visiteId) {
    try {
      await request.post(`visite360/vue/${visiteId}`);
      commit("INCREMENT_VUE", visiteId);
    } catch (error) {
      console.error("Erreur lors de l'incrémentation de la vue:", error);
      throw error;
    }
  },

  // Récupérer les statistiques
  async getStats({ commit }) {
    try {
      const { data } = await request.get("visite360/stats");
      commit("SET_STATS", data);
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des stats:", error);
      throw error;
    }
  },

  // Récupérer les visites populaires
  async getPopularVisites({ commit }, limit = 10) {
    try {
      const { data } = await request.get("visite360/popular", {
        params: { limit },
      });
      commit("SET_POPULAR_VISITES", data);
      return data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des visites populaires:",
        error
      );
      throw error;
    }
  },

  // Gérer les hotspots
  async getHotspots({ commit }, visiteId) {
    try {
      const { data } = await request.get(`visite360/${visiteId}/hotspots`);
      commit("SET_HOTSPOTS", data);
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des hotspots:", error);
      throw error;
    }
  },

  async addHotspot({ commit }, { visiteId, hotspot }) {
    try {
      const { data } = await request.post(
        `visite360/${visiteId}/hotspots`,
        hotspot
      );
      commit("ADD_HOTSPOT", data);
      return data;
    } catch (error) {
      console.error("Erreur lors de l'ajout du hotspot:", error);
      throw error;
    }
  },

  async removeHotspot({ commit }, { visiteId, hotspotId }) {
    try {
      await request.delete(`visite360/${visiteId}/hotspots/${hotspotId}`);
      commit("REMOVE_HOTSPOT", hotspotId);
    } catch (error) {
      console.error("Erreur lors de la suppression du hotspot:", error);
      throw error;
    }
  },

  // Upload d'image 360
  async uploadImage360({ commit }, { file, visiteId }) {
    commit("SET_LOADING", true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("visiteId", visiteId);

      const { data } = await request.post("visite360/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image:", error);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // Générer une miniature
  async generateThumbnail({ commit }, visiteId) {
    try {
      const { data } = await request.post(`visite360/${visiteId}/thumbnail`);
      return data;
    } catch (error) {
      console.error("Erreur lors de la génération de la miniature:", error);
      throw error;
    }
  },

  // Analytics
  async trackInteraction({ commit }, { visiteId, action, data }) {
    try {
      await request.post(`visite360/${visiteId}/analytics`, {
        action,
        data,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erreur lors du tracking:", error);
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
