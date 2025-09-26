import request from "@/http/request";
import { API_URLS } from "@/config/api";

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
    const { data } = await request.get("consentement/all");
    commit("SET_ALL", data);
    return data;
  },

  async getByUserId({ commit }, userId) {
    const { data } = await request.get(`consentement/by-user/${userId}`);
    commit("SET_ALL", data);
    return data;
  },

  async getOne({ commit }, id) {
    const { data } = await request.get(`consentement/get/${id}`);
    commit("SET_ONE", data);
    return data;
  },

  async create({ commit }, payload) {
    const { data } = await request.post("consentement/add", payload);
    commit("SET_ONE", data);
    return data;
  },

  async update({ commit }, payload) {
    const { data } = await request.put(
      `consentement/put/${payload.id}`,
      payload
    );
    commit("UPDATE_ONE", data);
    return data;
  },

  async delete({ commit }, id) {
    await request.delete(`consentement/delete/${id}`);
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
