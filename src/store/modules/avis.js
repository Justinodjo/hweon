import request from "@/http/request";

const state = () => ({
  all: [],
  one: {},
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
    const { data } = await request.get("api/avis/all");
    commit("SET_ALL", data);
    return data;
  },

  async getOne({ commit }, id) {
    const { data } = await request.get(`api/avis/get/${id}`);
    commit("SET_ONE", data);
    return data;
  },

  async create({ commit }, payload) {
    const { data } = await request.post("api/avis/add", payload);
    commit("SET_ONE", data);
    return data;
  },
  async getAvisParBien({ commit }, id) {
    try {
      const { data } = await request.get(`/api/avis/bien/${id}`);
      commit("SET_ALL", data);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async update({ commit }, payload) {
    const { data } = await request.put(`api/avis/put/${payload.id}`, payload);
    commit("UPDATE_ONE", data);
    return data;
  },

  async delete({ commit }, id) {
    await request.delete(`api/avis/delete/${id}`);
    commit("DELETE_ONE", id);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
