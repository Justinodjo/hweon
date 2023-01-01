import request, { retryRequest } from "@/http/request";
import { API_URLS } from "@/config/api";
import { showSuccess, showError } from "@/helpers/notify";
import { sendMessage } from "@/helpers/websocketService";
const state = () => ({
  all: [],
  one: {},
  fichier: [],
  uploadedFile: null,
  selectedBiens: [], // Biens principaux (agricoles, maisons)
  selectedDetails: [],
  loading: false,
  paginationMeta: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 1,
    pageSize: 10,
  },
});

const getters = {
  all: (state) => state.all,
  one: (state) => state.one,
  fichier: (state) => state.fichier,
  uploadedFile: (state) => state.uploadedFile,
  selectedBiens: (state) => state.selectedBiens,
  selectedDetails: (state) => state.selectedDetails,
  validationErrors: (state) => state.validationErrors,
  loading: (state) => state.loading,
  // Calculer le prix total
  totalPrice: (state) => {
    const biensTotal = state.selectedBiens.reduce(
      (sum, bien) => sum + (bien.prix || 0),
      0
    );
    const detailsTotal = state.selectedDetails.reduce(
      (sum, detail) => sum + (detail.prix || 0),
      0
    );
    return biensTotal + detailsTotal;
  },
  // Vérifier si un bien est sélectionné
  isBienSelected: (state) => (bienId) => {
    return state.selectedBiens.some((b) => b.id === bienId);
  },

  // Vérifier si un détail est sélectionné
  isDetailSelected: (state) => (detailId) => {
    return state.selectedDetails.some((d) => d.id === detailId);
  },
  selectedItemsCount: (state) =>
    state.selectedBiens.length + state.selectedDetails.length,

  // ✅ NOUVEAU: Obtenir tous les items sélectionnés
  allSelectedItems: (state) => [
    ...state.selectedBiens.map((b) => ({ ...b, type: "bien" })),
    ...state.selectedDetails.map((d) => ({ ...d, type: "detail" })),
  ],
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
  ADD_BIEN: (state, item) => {
    if (!state.selectedBiens.find((b) => b.id === item.id))
      state.selectedBiens.push(item);
  },
  ADD_DETAIL: (state, item) => {
    if (!state.selectedDetails.find((d) => d.id === item.id)) {
      state.selectedDetails.push(item);
    }
  },

  REMOVE_BIEN: (state, id) => {
    state.selectedBiens = state.selectedBiens.filter((b) => b.id !== id);
  },

  REMOVE_DETAIL: (state, id) => {
    state.selectedDetails = state.selectedDetails.filter((d) => d.id !== id);
  },

  CLEAR_CART: (state) => {
    state.selectedBiens = [];
    state.selectedDetails = [];
    state.validationErrors = [];
  },
  SET_LOADING: (state, loading) => {
    state.loading = loading;
  },

  SET_VALIDATION_ERRORS: (state, errors) => {
    state.validationErrors = Array.isArray(errors) ? errors : [errors];
  },

  CLEAR_VALIDATION_ERRORS: (state) => {
    state.validationErrors = [];
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
  // Récupérer tous les contrats
  async getAll({ commit }, { page = 0, size = 10 } = {}) {
    commit("SET_LOADING", true);

    try {
      const { data } = await retryRequest(
        () =>
          request.get("contrats/all", {
            params: { page, size },
          }),
        3,
        1000
      );

      commit("SET_ALL", data.content || data);

      if (data.totalPages !== undefined) {
        commit("SET_PAGINATION_META", data);
      }

      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des contrats:", error);
      showError("Erreur lors du chargement des contrats");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },
  // Récupérer un contrat
  async getOne({ commit }, id) {
    commit("SET_LOADING", true);

    try {
      const { data } = await retryRequest(
        () => request.get(`contrats/get/${id}`),
        3,
        1000
      );
      commit("SET_ONE", data);
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération du contrat:", error);
      showError("Erreur lors du chargement du contrat");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },
  // ✅ NOUVEAU: Vérifier la disponibilité avant création
  async verifierDisponibilite({ commit }, payload) {
    commit("SET_LOADING", true);
    commit("CLEAR_VALIDATION_ERRORS");

    try {
      const { data } = await request.post(
        "contrats/verifier-disponibilite",
        payload
      );

      if (!data.disponible) {
        commit("SET_VALIDATION_ERRORS", [data.message]);
      }

      return data;
    } catch (error) {
      console.error("Erreur lors de la vérification:", error);

      if (error.response?.data) {
        commit("SET_VALIDATION_ERRORS", [
          error.response.data.message || "Erreur de validation",
        ]);
        return error.response.data;
      }

      showError("Erreur lors de la vérification de disponibilité");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },
  // ✅ NOUVEAU: Vérifier disponibilité d'un bien spécifique
  async checkBienDisponibilite({ commit }, { bienId, dateDebut, dateFin }) {
    try {
      const { data } = await request.get(
        `contrats/bien/${bienId}/disponibilite`,
        {
          params: { dateDebut, dateFin },
        }
      );

      return data;
    } catch (error) {
      console.error("Erreur vérification bien:", error);

      if (error.response?.data) {
        return error.response.data;
      }

      throw error;
    }
  },
  // ✅ NOUVEAU: Vérifier disponibilité d'une chambre spécifique
  async checkDetailDisponibilite({ commit }, { detailId, dateDebut, dateFin }) {
    try {
      const { data } = await request.get(
        `contrats/detail/${detailId}/disponibilite`,
        {
          params: { dateDebut, dateFin },
        }
      );

      return data;
    } catch (error) {
      console.error("Erreur vérification chambre:", error);

      if (error.response?.data) {
        return error.response.data;
      }

      throw error;
    }
  },
  // ✅ AMÉLIORÉ: Créer un contrat avec validation
  async createContract({ commit, state, dispatch }, formData) {
    commit("SET_LOADING", true);
    commit("CLEAR_VALIDATION_ERRORS");

    try {
      // Vérifier qu'il y a des biens/détails sélectionnés
      if (!state.selectedBiens.length && !state.selectedDetails.length) {
        const error = "Aucun bien ou détail sélectionné";
        commit("SET_VALIDATION_ERRORS", [error]);
        showError(error);
        throw new Error(error);
      }

      const { data } = await request.post("contrats/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success !== false) {
        commit("SET_ONE", data.contrat || data);
        commit("CLEAR_CART");

        // Toast de succès
        showSuccess("Contrat créé avec succès 🎉");

        // Notification WebSocket
        try {
          sendMessage("/app/notifications/global", {
            type: "CONTRAT_CREE",
            message: `Un nouveau contrat a été créé (#${
              data.id || data.contrat?.id
            }).`,
          });
        } catch (wsError) {
          console.warn("Erreur envoi notification WebSocket:", wsError);
        }

        // Rafraîchir la liste des contrats
        await dispatch("getAll");

        return data.contrat || data;
      } else {
        const errorMsg =
          data.message || "Erreur lors de la création du contrat";
        commit("SET_VALIDATION_ERRORS", [errorMsg]);
        showError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("Erreur lors de la création du contrat:", error);

      if (error.response?.data) {
        const errorData = error.response.data;
        const errorMsg =
          errorData.message || "Erreur lors de la création du contrat";

        commit("SET_VALIDATION_ERRORS", [errorMsg]);

        // Afficher le message d'erreur approprié selon le code
        if (
          errorData.code === "BIEN_DEJA_LOUE" ||
          errorData.code === "DETAIL_DEJA_LOUE"
        ) {
          showError(`❌ ${errorMsg}`);
        } else {
          showError(errorMsg);
        }

        throw errorData;
      }

      showError("Erreur lors de la création du contrat");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
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
  // Mettre à jour un contrat
  async update({ commit }, payload) {
    commit("SET_LOADING", true);

    try {
      const id = payload?.id || payload;
      const body = payload?.id ? payload : {};

      const { data } = await request.put(`contrats/put/${id}`, body);
      commit("UPDATE_ONE", data);
      showSuccess("Contrat mis à jour avec succès");
      return data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du contrat:", error);
      showError("Erreur lors de la mise à jour du contrat");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },
  // Supprimer un contrat
  async delete({ commit }, id) {
    commit("SET_LOADING", true);

    try {
      await request.delete(`contrats/delete/${id}`);
      commit("DELETE_ONE", id);
      showSuccess("Contrat supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du contrat:", error);
      showError("Erreur lors de la suppression du contrat");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },
  async downloadFichier({ commit }, { fichierId }) {
    try {
      const response = await request.get(`fichier/download/${fichierId}`, {
        responseType: "blob",
      });

      const fileUrl = URL.createObjectURL(response.data);
      commit("SET_UPLOADED_FILE", fileUrl);

      return fileUrl;
    } catch (error) {
      console.error("Erreur lors du téléchargement du fichier:", error);
      throw error;
    }
  },
  // Toggle bien
  toggleBien({ commit, state }, item) {
    const action = state.selectedBiens.some((b) => b.id === item.id)
      ? "REMOVE_BIEN"
      : "ADD_BIEN";

    commit(action, action === "REMOVE_BIEN" ? item.id : item);
  },

  // Toggle détail
  toggleDetail({ commit, state }, item) {
    const action = state.selectedDetails.some((d) => d.id === item.id)
      ? "REMOVE_DETAIL"
      : "ADD_DETAIL";

    commit(action, action === "REMOVE_DETAIL" ? item.id : item);
  },
  // Ajouter au panier
  addToCart({ commit }, { item, type }) {
    if (!item || !item.id || !type) {
      console.warn("Item invalide pour ajout au panier:", item);
      return;
    }

    if (type === "bien") {
      commit("ADD_BIEN", item);
    } else if (type === "detail") {
      commit("ADD_DETAIL", item);
    }
  },

  // Retirer du panier
  removeFromCart({ commit }, { id, type }) {
    if (type === "bien") {
      commit("REMOVE_BIEN", id);
    } else if (type === "detail") {
      commit("REMOVE_DETAIL", id);
    }
  },
  // async createContract({ commit, state }) {
  //   if (!state.selectedBiens.length && !state.selectedDetails.length)
  //     throw new Error("Aucun bien ou détail sélectionné");

  //   const payload = {
  //     biensImmobiliers: state.selectedBiens.map((b) => ({
  //       id: b.id,
  //       prix: b.prix,
  //     })),
  //     detailsBiensImmobiliers: state.selectedDetails.map((d) => ({
  //       id: d.id,
  //       prix: d.prix,
  //     })),
  //     totalPrice:
  //       state.selectedBiens.reduce((sum, r) => sum + (r.prix || 0), 0) +
  //       state.selectedDetails.reduce((sum, r) => sum + (r.prix || 0), 0),
  //   };
  //   // ✅ Déclarer prixDetails avant utilisation
  //   const prixDetails = state.selectedDetails.length > 0; // true si détails sélectionnés

  //   const { data } = await request.post(
  //     `contrats/add?prixDetails=${prixDetails}`,
  //     payload
  //   );
  //   commit("SET_ONE", data);
  //   commit("CLEAR_CART");
  //   // ✅ Toast local
  //   showSuccess("Contrat créé avec succès 🎉");

  //   // 🔔 Notification temps réel (envoyer via WebSocket à d'autres utilisateurs)
  //   // 🔔 Notification temps réel (envoyer via WebSocket à d'autres utilisateurs)
  //   // 🔔 Notification temps réel via websocket helper
  //   sendMessage("/app/notifications/global", {
  //     type: "CONTRAT_CREE",
  //     message: `Un nouveau contrat a été créé (#${data.id}).`,
  //   });
  //   return data;
  // },
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

  // Rechercher des contrats
  async rechercherContrats(
    { commit },
    { type, status, dateDebutMin, dateFinMax }
  ) {
    commit("SET_LOADING", true);

    try {
      const { data } = await request.get("contrats/recherche", {
        params: { type, status, dateDebutMin, dateFinMax },
      });

      commit("SET_ALL", data);
      return data;
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      showError("Erreur lors de la recherche");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },
  // Archiver les contrats expirés
  async archiverContratsExpires({ dispatch }) {
    try {
      await request.put("contrats/archiver-expired");
      await dispatch("getAll");
      showSuccess("Contrats expirés archivés avec succès");
      return true;
    } catch (error) {
      console.error("Erreur lors de l'archivage:", error);
      showError("Erreur lors de l'archivage des contrats expirés");
      throw error;
    }
  },

  // Résilier les contrats expirés
  async resilierContratsExpires({ dispatch }) {
    try {
      await request.put("contrats/resilier-expired");
      await dispatch("getAll");
      showSuccess("Contrats expirés résiliés avec succès");
      return true;
    } catch (error) {
      console.error("Erreur lors de la résiliation:", error);
      showError("Erreur lors de la résiliation des contrats expirés");
      throw error;
    }
  },
  // Renouveler un contrat
  async renouvelerContrat({ commit }, { id, nouvelleDateFin }) {
    try {
      const { data } = await request.put(`contrats/renouveler/${id}`, {
        nouvelleDateFin,
      });

      commit("UPDATE_ONE", data);
      showSuccess("Contrat renouvelé avec succès");
      return data;
    } catch (error) {
      console.error("Erreur lors du renouvellement:", error);
      showError("Erreur lors du renouvellement du contrat");
      throw error;
    }
  },

  // ✅ Obtenir tous les biens immobiliers loués (contrats actifs)
  async getBiensLoues(cxt) {
    const { data } = await request.get("contrats/biens-loues");
    cxt.commit("SET_ALL", data); // Je suppose que "fichier" stocke ici des biens
    return data;
  },

  // Obtenir les biens loués
  async getBiensLoues({ commit }) {
    try {
      const { data } = await request.get("contrats/biens-loues");
      commit("SET_FICHIER", data);
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des biens loués:", error);
      throw error;
    }
  },
  // Obtenir les biens loués par utilisateur
  async getBiensLouesParUtilisateur({ commit }, userId) {
    try {
      const { data } = await request.get(`contrats/biens-loues/${userId}`);
      commit("SET_FICHIER", data);
      return data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des biens de l'utilisateur:",
        error
      );
      throw error;
    }
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
  // Valider un contrat
  async validerContrat({ commit }, { id, role }) {
    try {
      const { data } = await request.put(`contrats/${id}/valider`, null, {
        params: { role },
      });

      commit("UPDATE_ONE", data);
      showSuccess("Contrat validé avec succès");
      return data;
    } catch (error) {
      console.error("Erreur lors de la validation:", error);
      showError("Erreur lors de la validation du contrat");
      throw error;
    }
  },
  async getStats(cxt) {
    const { data } = await request.get("contrats/stats");
    return data;
  },
  // Ajouter un bien au panier
  addBien({ commit }, bien) {
    commit("ADD_BIEN", bien);
  },

  // Retirer un bien du panier
  removeBien({ commit }, bienId) {
    commit("REMOVE_BIEN", bienId);
  },

  // Ajouter un détail au panier
  addDetail({ commit }, detail) {
    commit("ADD_DETAIL", detail);
  },

  // Retirer un détail du panier
  removeDetail({ commit }, detailId) {
    commit("REMOVE_DETAIL", detailId);
  },

  // Vider le panier
  clearCart({ commit }) {
    commit("CLEAR_CART");
  },
  async getContratsUtilisateur(cxt, userId) {
    const { data } = await request.get(`contrats/user/id/${userId}/contrats`);
    cxt.commit("SET_ALL", data);
    return data;
  },
  // ✅ NOUVEAU: Valider un contrat (changement de statut)
  async validerContrat({ commit }, contratId) {
    try {
      const { data } = await request.put(`contrats/${contratId}/valider`);
      commit("UPDATE_ONE", data);
      return data;
    } catch (error) {
      console.error("Erreur validation contrat:", error);
      throw error;
    }
  },

  // ✅ NOUVEAU: Rejeter un contrat
  async rejeterContrat({ commit }, { contratId, motif }) {
    try {
      const { data } = await request.put(`contrats/${contratId}/rejeter`, {
        motif,
      });
      commit("UPDATE_ONE", data);
      return data;
    } catch (error) {
      console.error("Erreur rejet contrat:", error);
      throw error;
    }
  },
  // ✅ NOUVEAU: Récupérer les contrats d'un utilisateur
  async getUserContrats({ commit }, userId) {
    commit("SET_LOADING", true);

    try {
      const { data } = await request.get(`contrats/user/${userId}`);
      commit("SET_ALL", data);
      return data;
    } catch (error) {
      console.error("Erreur récupération contrats utilisateur:", error);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },
  async exportContrats(_, format = "xlsx") {
    const response = await request.get(`contrats/export`, {
      params: { format },
      responseType: "blob",
    });
    const fileUrl = URL.createObjectURL(response.data);
    return fileUrl;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
