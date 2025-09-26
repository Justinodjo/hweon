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
  async getAll(cxt, payload) {
    let { data } = await request.get("details_biens/all");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getOne(cxt, id) {
    let { data } = await request.get("details_biens/get/" + id);
    cxt.commit("SET_ONE", data);
    return data;
  },

  async create(cxt, payload) {
    let { data } = await request.post("details_biens/add", payload);
    cxt.commit("SET_ONE", data);
    return data;
  },
  async update(cxt, payload) {
    let { data } = await request.put("produits/put/" + payload);
    cxt.commit("UPDATE_ONE", data);
    return data;
  },
  async delete(cxt, id) {
    await request.delete("details_biens/delete/" + id);
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
