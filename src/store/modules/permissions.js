// src/store/modules/permission.js
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
  SET_ALL: (state, payload) => {
    state.all = payload;
  },
  SET_ONE: (state, payload) => {
    state.one = payload;
  },
  ADD_ONE: (state, payload) => {
    state.all.push(payload);
  },
  UPDATE_ONE: (state, payload) => {
    const index = state.all.findIndex((item) => item.id === payload.id);
    if (index !== -1) {
      state.all[index] = payload;
    }
  },
  DELETE_ONE: (state, id) => {
    state.all = state.all.filter((item) => item.id !== id);
  },
};

const actions = {
  async getAll({ commit }) {
    const { data } = await request.get("api/permissions");
    commit("SET_ALL", data);
    return data;
  },
  async getOne({ commit }, id) {
    const { data } = await request.get("api/permissions/" + id);
    commit("SET_ONE", data);
    return data;
  },
  async create({ commit }, payload) {
    const { data } = await request.post("api/permissions", payload);
    commit("ADD_ONE", data);
    return data;
  },
  async update({ commit }, payload) {
    const { data } = await request.put(
      "api/permissions/" + payload.id,
      payload
    );
    commit("UPDATE_ONE", data);
    return data;
  },
  async delete({ commit }, id) {
    await request.delete("api/permissions/" + id);
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
