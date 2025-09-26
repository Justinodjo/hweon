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
  UPDATE_SOUS_SERVICE: (state, updatedItem) => {
    const index = state.all.findIndex((item) => item.id === updatedItem.id);
    if (index !== -1) {
      state.all.splice(index, 1, updatedItem);
    }
    // Optionnel : tu peux aussi mettre à jour `state.one`
    state.one = updatedItem;
  },
  DELETE_ONE: (state, id) => {
    state.all = state.all.filter((item) => item.id !== id);
  },
};

const actions = {
  async getAll(cxt, payload) {
    let { data } = await request.get("typeService/all");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getOne(cxt, id) {
    let { data } = await request.get("typeService/get/" + id);
    cxt.commit("SET_ONE", data);
    return data;
  },

  async create(cxt, payload) {
    let { data } = await request.post("typeService/add", payload);
    cxt.commit("SET_ONE", data);
    return data;
  },

  async getAllProduit(cxt, id) {
    let { data } = await request.get("/produits/typeService/" + id);
    cxt.commit("SET_ALL", data);
    return data;
  },
  async update({ commit }, payload) {
    try {
      const response = await request.put(
        `/typeService/put/${payload.id}`,
        payload
      );
      commit("UPDATE_SOUS_SERVICE", response.data);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      throw error;
    }
  },

  async delete(cxt, id) {
    await request.delete("typeService/delete/" + id);
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
