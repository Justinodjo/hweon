import request from "@/http/request";

const state = () => ({
  all: [],
  one: {},
  paginationMeta: {},
});

const getters = {
  all: (state) => state.all,
  one: (state) => state.one,
  paginationMeta: (state) => state.paginationMeta,
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
  SET_PAGINATION_META: (state, meta) => {
    state.paginationMeta = {
      totalPages: meta.totalPages,
      totalElements: meta.totalElements,
      currentPage: meta.number + 1,
      pageSize: meta.size,
    };
  },
};

const actions = {
  async getAll({ commit }, { page = 0, size = 10 } = {}) {
    const { data } = await request.get("api/suggestions", {
      params: { page, size },
    });
    commit("SET_ALL", data.content || data);
    if (data.content) {
      commit("SET_PAGINATION_META", data);
    }
    return data;
  },

  async getOne({ commit }, id) {
    const { data } = await request.get(`api/suggestions/${id}`);
    commit("SET_ONE", data);
    return data;
  },

  async create({ commit }, payload) {
    const { data } = await request.post("api/suggestions/create", payload);
    commit("SET_ONE", data);
    return data;
  },

  async update({ commit }, payload) {
    const { data } = await request.put(
      `api/suggestions/${payload.id}`,
      payload
    );
    commit("UPDATE_ONE", data);
    return data;
  },

  async delete({ commit }, id) {
    await request.delete(`api/suggestions/${id}`);
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
