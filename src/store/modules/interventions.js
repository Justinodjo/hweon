import request from "@/http/request";

const state = () => ({
  all: [], // toutes les interventions
  one: {}, // intervention sélectionnée
});

const getters = {
  all: (state) => state.all,
  one: (state) => state.one,
};

const mutations = {
  SET_ALL: (state, obj) => {
    state.all = obj;
  },
  SET_ONE: (state, obj) => {
    state.one = obj;
  },
  UPDATE_ONE: (state, obj) => {
    const index = state.all.findIndex((item) => item.id === obj.id);
    if (index !== -1) {
      state.all[index] = obj;
    }
  },
  DELETE_ONE: (state, id) => {
    state.all = state.all.filter((item) => item.id !== id);
  },
};

const actions = {
  async getAll({ commit }) {
    try {
      const { data } = await request.get("api/interventions");
      commit("SET_ALL", data);
      return data;
    } catch (error) {
      console.error("Erreur lors du chargement des interventions :", error);
      throw error;
    }
  },

  async getOne({ commit }, id) {
    try {
      const { data } = await request.get(`api/interventions/${id}`);
      commit("SET_ONE", data);
      return data;
    } catch (error) {
      console.error("Erreur lors du chargement de l'intervention :", error);
      throw error;
    }
  },

  async create({ commit }, payload) {
    try {
      const { data } = await request.post("api/interventions", payload);
      commit("SET_ONE", data);
      return data;
    } catch (error) {
      console.error("Erreur lors de la création de l'intervention :", error);
      throw error;
    }
  },

  async update({ commit }, payload) {
    try {
      const { data } = await request.put(
        `api/interventions/${payload.id}`,
        payload
      );
      commit("UPDATE_ONE", data);
      return data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'intervention :", error);
      throw error;
    }
  },

  async delete({ commit }, id) {
    try {
      await request.delete(`api/interventions/${id}`);
      commit("DELETE_ONE", id);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'intervention :", error);
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
