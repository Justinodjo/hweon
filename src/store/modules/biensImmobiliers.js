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
  SET_PAGINATION_META: (state, meta) => {
    state.paginationMeta = {
      totalPages: meta.totalPages,
      totalElements: meta.totalElements,
      currentPage: meta.number + 1, // pour que ce soit 1-based
      pageSize: meta.size,
    };
  },
  DELETE_ONE: (state, id) => {
    state.all = state.all.filter((item) => item.id !== id);
  },
  DELETE_FICHIER: (state, id) => {
    state.fichier = state.fichier.filter((fichier) => fichier.id !== id);
  },
};

const actions = {
  async getAll(cxt, { page, size }) {
    let { data } = await request.get("biens/all", {
      params: {
        page,
        size,
      },
    });
    cxt.commit("SET_ALL", data.content);
    cxt.commit("SET_PAGINATION_META", data);
    return data;
  },

  async getBiensByType(cxt, { page, size, typeId }) {
    try {
      let { data } = await request.get("biens/by-type", {
        params: {
          typeId: typeId,
          page: page,
          size: size,
        },
      });
      cxt.commit("SET_ALL", data.content);
      cxt.commit("SET_PAGINATION_META", data);
      return data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des biens immobiliers:",
        error
      );
    }
  },
  async getOne(cxt, id) {
    let { data } = await request.get("biens/get/" + id);
    cxt.commit("SET_ONE", data);
    return data;
  },
  async create(cxt, payload) {
    let { data } = await request.post("biens/add", payload);
    cxt.commit("SET_ONE", data);
    return data;
  },
  async send(cxt, payload) {
    let { data } = await request.post("contact/send", payload);
    cxt.commit("SET_ONE", data);
    return data;
  },
  async searchBiens({ commit }, { texte, type }) {
    const params = {};
    if (texte) params.texte = texte;
    if (type) params.type = type;
    const { data } = await request.get("biens/search", { params });
    commit("SET_ALL", data);
    return data;
  },
  async update(cxt, payload) {
    let { data } = await request.put("biens/update/" + payload);
    cxt.commit("UPDATE_ONE", data);
    return data;
  },
  async likeBien({ commit, state }, id) {
    try {
      const { data } = await request.post(`biens/${id}/like`);

      // Trouver le bien dans state.all ou dans state.one
      let bien =
        state.all.find((b) => b.id === id) ||
        (state.one?.id === id ? state.one : null);

      if (bien) {
        const updatedBien = { ...bien, nombreJaime: data.likes };
        commit("UPDATE_ONE", updatedBien);

        if (state.one?.id === id) {
          commit("SET_ONE", updatedBien);
        }
      }

      return data;
    } catch (error) {
      console.error("Erreur lors du like :", error);
      throw error;
    }
  },

  async delete(cxt, id) {
    await request.delete("biens/delete/" + id);
    cxt.commit("DELETE_ONE", id);
  },
  async downloadFichier({ commit }, { fichierId }) {
    try {
      const response = await request.get(
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
    let { data } = await request.get("biens/categorie/" + id);
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

  async noterBien({ commit }, payload) {
    let { data } = await request.post(`biens/noter/${payload.id}`, {
      note: payload.note,
    });
    commit("UPDATE_ONE", data);
    return data;
  },
  async getLikes({ commit }, id) {
    try {
      const { data } = await request.get(`biens/like/${id}`);
      return data; // { likes: 10 }
    } catch (error) {
      console.error("Erreur lors de la récupération des likes :", error);
      throw error;
    }
  },
  async incrementerVue({ commit }, id) {
    try {
      const { data } = await request.get(`biens/vues/${id}`);
      commit("SET_ONE", data); // mettre à jour le bien dans le state
      return data;
    } catch (error) {
      console.error("Erreur lors de l'incrémentation de vue :", error);
      throw error;
    }
  },
  async getMesBiens(cxt, { page, size }) {
    try {
      const { data } = await request.get("biens/moi", {
        params: { page, size },
      });
      cxt.commit("SET_ALL", data.content);
      cxt.commit("SET_PAGINATION_META", data);
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération de mes biens :", error);
      throw error;
    }
  },
  async getBiensByUser(cxt, { page, size }) {
    try {
      // Récupérer l'utilisateur connecté depuis le store
      const userInfo = cxt.rootState.auth.userInfo; // Accède à l'utilisateur via rootState

      if (!userInfo) {
        throw new Error("Utilisateur non connecté");
      }

      // Faire appel à l'API pour récupérer les biens de cet utilisateur
      let { data } = await request.get("biens/user/biens", {
        params: {
          userId: userInfo, // Passer l'ID de l'utilisateur connecté
          page,
          size,
        },
      });

      cxt.commit("SET_ALL", data.content); // Mets à jour les biens dans le state
      cxt.commit("SET_PAGINATION_META", data); // Mets à jour la pagination
      return data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des biens de l'utilisateur:",
        error
      );
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
