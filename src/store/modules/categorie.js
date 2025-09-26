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

const actions = {
  async getAll(cxt, payload) {
    let { data } = await request.get("categorie/all");
    cxt.commit("SET_ALL", data);
    return data;
  },
  async getOne(cxt, id) {
    let { data } = await request.get("categorie/get/" + id);
    cxt.commit("SET_ONE", data);
    return data;
  },
  async create(cxt, payload) {
    let { data } = await request.post("categorie/add", payload);
    cxt.commit("SET_ONE", data);
    return data;
  },
  async send(cxt, payload) {
    let { data } = await request.post("contact/send", payload);
    cxt.commit("SET_ONE", data);
    return data;
  },
  async update(cxt, payload) {
    let { data } = await request.put("categorie/put/" + payload);
    cxt.commit("UPDATE_ONE", data);
    return data;
  },
  async delete(cxt, id) {
    await request.delete("categorie/delete/" + id);
    cxt.commit("DELETE_ONE", id);
  },
  async downloadFichier({ commit }, { fichierId }) {
    try {
      const response = await client.get(
        `${API_URLS.API_BASE}fichier/download/${fichierId}`,
        {
          responseType: "blob",
        }
      );

      const fileUrl = URL.createObjectURL(response.data);
      commit("SET_UPLOADED_FILE", fileUrl);

      return fileUrl;
    } catch (error) {
      console.error("Erreur lors du téléchargement du fichier:", error);
      throw error;
    }
  },
  async getAllSousService(cxt, id) {
    let { data } = await request.get("typeService/categorie/" + id);
    cxt.commit("SET_ALL", data);
    return data;
  },
  async deleteFichier({ commit }, id) {
    try {
      await request.delete(`/fichier/delete/${id}`);
      commit("DELETE_FICHIER", id);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du fichier:", error);
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
