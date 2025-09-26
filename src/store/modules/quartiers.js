import request from "@/http/request";
import { API_URLS } from "@/config/api";
const state = () => ({
  all: [],
  one: {},
  fichier: [],
  uploadedFile: null,
});

const getters = {
  all: (state) => state.all,
  one: (state) => state.one,
  fichier: (state) => state.fichier,
  uploadedFile: (state) => state.uploadedFile,
};

const mutations = {
  SET_ALL: (state, obj) => {
    state.all = obj;
  },
  SET_ONE: (state, obj) => {
    state.one = obj;
  },
  SET_FICHIER: (state, fichier) => {
    state.fichier = fichier;
  },
  SET_UPLOADED_FILE: (state, obj) => {
    state.uploadedFile = obj;
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
  DELETE_FICHIER: (state, id) => {
    state.fichier = state.fichier.filter((fichier) => fichier.id !== id);
  },
};
// Arrondissement
// "/api/arrondissement/create_arrondissement",
// "/api/arrondissement/liste_arrondissements",
// "/api/arrondissement/{idArrondissement}",
// "/api/arrondissement/commune/{libelle}",
// "/api/arrondissement/delete/{idArrondissement}",
const actions = {
  async getAll(cxt, payload) {
    let { data } = await request.get("api/quartiers/liste_quartiers");
    cxt.commit("SET_ALL", data);
    return data;
  },
  async getOne(cxt, id) {
    let { data } = await request.get("api/quartiers/" + id);
    cxt.commit("SET_ONE", data);
    return data;
  },
  async getQuartiersByarrondissementId(cxt, payload) {
    const { data } = await request.get(
      `api/quartiers/arrondissement/${payload.id}`
    );
    cxt.commit("SET_ALL", data);
    return data;
  },
  async create(cxt, payload) {
    let { data } = await request.post("api/quartiers/create_quartier", payload);
    cxt.commit("SET_ONE", data);
    return data;
  },
  async send(cxt, payload) {
    let { data } = await request.post("contact/send", payload);
    cxt.commit("SET_ONE", data);
    return data;
  },
  //   async update(cxt, payload) {
  //     let { data } = await request.put(
  //       "/api/quartiers/departement/" + payload.libelle,
  //       payload
  //     );
  //     cxt.commit("UPDATE_ONE", data);
  //     return data;
  //   },
  async delete(cxt, id) {
    await request.delete("api/quartiers/delete/" + id);
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
