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
    let { data } = await request.get("contrats/all");
    cxt.commit("SET_ALL", data);
    return data;
  },
  async getOne(cxt, id) {
    let { data } = await request.get("contrats/get/" + id);
    cxt.commit("SET_ONE", data);
    return data;
  },
  async create(cxt, payload) {
    let { data } = await request.post("contrats/add", payload);
    cxt.commit("SET_ONE", data);
    return data;
  },
  async send(cxt, payload) {
    let { data } = await request.post("contact/send", payload);
    cxt.commit("SET_ONE", data);
    return data;
  },
  async update(cxt, payload) {
    let { data } = await request.put("contrats/put/" + payload);
    cxt.commit("UPDATE_ONE", data);
    return data;
  },
  async delete(cxt, id) {
    await request.delete("contrats/delete/" + id);
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

  // ✅ Télécharger le contrat en PDF
  async downloadPDF(cxt, id) {
    try {
      const response = await request.get(`contrats/${id}/pdf`, {
        responseType: "blob",
      });
      const fileUrl = URL.createObjectURL(response.data);
      cxt.commit("SET_UPLOADED_FILE", fileUrl);
      return fileUrl;
    } catch (error) {
      console.error("Erreur lors du téléchargement du PDF:", error);
      throw error;
    }
  },

  // ✅ Recherche de contrats avec des filtres (TypeContrat, Status, Date)
  async rechercherContrats(cxt, { type, status, dateDebutMin, dateFinMax }) {
    const { data } = await request.get("contrats/recherche", {
      params: { type, status, dateDebutMin, dateFinMax },
    });
    cxt.commit("SET_ALL", data);
    return data;
  },
  // ✅ Archiver les contrats expirés
  async archiverContratsExpirés(cxt) {
    try {
      await request.put("contrats/archiver-expired");
      cxt.dispatch("getAll"); // Récupérer à nouveau tous les contrats après l'archivage
      return true;
    } catch (error) {
      console.error("Erreur lors de l'archivage des contrats expirés:", error);
      throw error;
    }
  },

  // ✅ Résilier un contrat expiré
  async resilierContratsExpirés(cxt) {
    try {
      await request.put("contrats/resilier-expired");
      cxt.dispatch("getAll"); // Rafraîchir la liste des contrats
      return true;
    } catch (error) {
      console.error(
        "Erreur lors de la résiliation des contrats expirés:",
        error
      );
      throw error;
    }
  },
  // ✅ Renouveler un contrat
  async renouvelerContrat(cxt, { id, nouvelleDateFin }) {
    try {
      const { data } = await request.put(`contrats/renouveler/${id}`, {
        nouvelleDateFin,
      });
      cxt.commit("UPDATE_ONE", data);
      return data;
    } catch (error) {
      console.error("Erreur lors du renouvellement du contrat:", error);
      throw error;
    }
  },

  // ✅ Obtenir tous les biens immobiliers loués (contrats actifs)
  async getBiensLoues(cxt) {
    const { data } = await request.get("contrats/biens-loues");
    cxt.commit("SET_FICHIER", data); // Je suppose que "fichier" stocke ici des biens
    return data;
  },

  // ✅ Récupérer les biens loués par un utilisateur spécifique
  async getBiensLouesParUtilisateur(cxt, userId) {
    const { data } = await request.get(`contrats/biens-loues/${userId}`);
    cxt.commit("SET_FICHIER", data); // Ici aussi, "fichier" pourrait être des biens immobiliers
    return data;
  },

  async getAllSousService(cxt, id) {
    let { data } = await request.get("contrats/categorie/" + id);
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
