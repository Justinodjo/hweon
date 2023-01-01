import request from "@/http/request";
import { API_URLS } from "@/config/api";

const state = () => ({
  all: [],
  one: {},
  offresActives: [],
  paginationMeta: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 1,
    pageSize: 6,
  },
});

const getters = {
  all: (state) => state.all,
  one: (state) => state.one,
  offresActives: (state) => state.offresActives,
  paginationMeta: (state) => state.paginationMeta,
};

const mutations = {
  SET_ALL: (state, obj) => {
    state.all = obj;
  },
  SET_ONE: (state, obj) => {
    state.one = obj;
  },
  SET_OFFRES_ACTIVES: (state, offres) => {
    state.offresActives = offres;
  },
  SET_PAGINATION_META: (state, meta) => {
    state.paginationMeta = {
      totalPages: meta.totalPages,
      totalElements: meta.totalElements,
      currentPage: meta.number + 1,
      pageSize: meta.size,
    };
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
  async getAll(cxt) {
    let { data } = await request.get("api/offres/all");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getOffresActives(cxt, { page = 0, size = 6 }) {
    try {
      let { data } = await request.get("api/offres/actives", {
        params: { page, size },
      });
      cxt.commit("SET_OFFRES_ACTIVES", data.content);
      cxt.commit("SET_PAGINATION_META", data);
      return data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des offres actives:",
        error
      );
      throw error;
    }
  },

  async getOne(cxt, id) {
    let { data } = await request.get("api/offres/get/" + id);
    cxt.commit("SET_ONE", data);
    return data;
  },

  async create(cxt, payload) {
    let { data } = await request.post("api/offres/add", payload);
    cxt.commit("SET_ONE", data);
    return data;
  },

  async update(cxt, payload) {
    let { data } = await request.put(
      "api/offres/update/" + payload.id,
      payload
    );
    cxt.commit("UPDATE_ONE", data);
    return data;
  },

  async delete(cxt, id) {
    await request.delete("offres/delete/" + id);
    cxt.commit("DELETE_ONE", id);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
