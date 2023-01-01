import request from "@/http/request";

const state = () => ({
  mandats: [], // liste des mandats
  mandatSelected: null,
});

const getters = {
  allMandats: (state) => state.mandats,
  selectedMandat: (state) => state.mandatSelected,
};

const mutations = {
  SET_MANDATS(state, mandats) {
    state.mandats = mandats;
  },
  SET_SELECTED_MANDAT(state, mandat) {
    state.mandatSelected = mandat;
  },
  ADD_MANDAT(state, mandat) {
    state.mandats.push(mandat);
  },
};

const actions = {
  async getAllMandats({ commit }) {
    try {
      const { data } = await request.get("mandat/all");
      commit("SET_MANDATS", data);
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des mandats :", error);
      throw error;
    }
  },

  async mandaterGestionnaire({ commit }, payload) {
    try {
      const { data } = await request.post("mandat/gestion", payload);
      commit("ADD_MANDAT", data); // Ajouter le mandat créé à la liste
      return data;
    } catch (error) {
      console.error("Erreur lors du mandat :", error);
      throw error;
    }
  },

  async simulerMandat(_, payload) {
    try {
      const { data } = await request.post("mandat/simulation", payload);
      return data; // retourne le nombre de biens concernés
    } catch (error) {
      console.error("Erreur lors de la simulation :", error);
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
