// store/modules/paiements.js
import request from "@/http/request";

const state = () => ({
  // États existants (conservés)
  urlPaiement: null,
  statut: null, // "en_attente", "reussi", "echec"
  message: null,

  // Nouveaux états
  paiements: [],
  paiement: null,
  statistiques: null,
  loading: false,
  error: null,
});

const getters = {
  // Getters existants (conservés)
  urlPaiement: (state) => state.urlPaiement,
  statut: (state) => state.statut,
  message: (state) => state.message,

  // Nouveaux getters
  allPaiements: (state) => state.paiements,
  currentPaiement: (state) => state.paiement,
  statistiques: (state) => state.statistiques,
  isLoading: (state) => state.loading,
  error: (state) => state.error,

  // Paiements par statut
  paiementsPayes: (state) => state.paiements.filter((p) => p.statut === "PAYE"),
  paiementsEnAttente: (state) =>
    state.paiements.filter((p) => p.statut === "EN_ATTENTE"),
  paiementsEnRetard: (state) =>
    state.paiements.filter((p) => p.statut === "EN_RETARD"),

  // Montants calculés
  totalPaye: (state) =>
    state.paiements
      .filter((p) => p.statut === "PAYE")
      .reduce((sum, p) => sum + (p.montantPaye || p.montant || 0), 0),

  totalEnAttente: (state) =>
    state.paiements
      .filter((p) => p.statut === "EN_ATTENTE" || p.statut === "EN_RETARD")
      .reduce((sum, p) => sum + (p.montant || 0), 0),
};

const mutations = {
  // Mutations existantes (conservées)
  SET_URL_PAIEMENT(state, url) {
    state.urlPaiement = url;
  },
  SET_STATUT(state, statut) {
    state.statut = statut;
  },
  SET_MESSAGE(state, msg) {
    state.message = msg;
  },

  // Nouvelles mutations
  SET_PAIEMENTS(state, paiements) {
    state.paiements = paiements;
    state.error = null;
  },

  SET_PAIEMENT(state, paiement) {
    state.paiement = paiement;
    state.error = null;
  },

  SET_STATISTIQUES(state, statistiques) {
    state.statistiques = statistiques;
    state.error = null;
  },

  ADD_PAIEMENT(state, paiement) {
    state.paiements.push(paiement);
    state.error = null;
  },

  UPDATE_PAIEMENT(state, updatedPaiement) {
    const index = state.paiements.findIndex((p) => p.id === updatedPaiement.id);
    if (index !== -1) {
      state.paiements.splice(index, 1, updatedPaiement);
    }

    if (state.paiement && state.paiement.id === updatedPaiement.id) {
      state.paiement = updatedPaiement;
    }

    state.error = null;
  },

  REMOVE_PAIEMENT(state, id) {
    state.paiements = state.paiements.filter((p) => p.id !== id);

    if (state.paiement && state.paiement.id === id) {
      state.paiement = null;
    }

    state.error = null;
  },

  SET_LOADING(state, loading) {
    state.loading = loading;
  },

  SET_ERROR(state, error) {
    state.error = error;
  },

  CLEAR_ERROR(state) {
    state.error = null;
  },
};

const actions = {
  // ============================================
  // ACTIONS EXISTANTES (conservées et améliorées)
  // ============================================

  async getAll({ commit }, payload = {}) {
    commit("SET_LOADING", true);
    try {
      const { data } = await request.get("paiements", { params: payload });
      commit("SET_PAIEMENTS", data);
      return data;
    } catch (error) {
      console.error("Erreur chargement paiements:", error);
      commit("SET_ERROR", error.response?.data?.message || error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async getOne({ commit }, id) {
    commit("SET_LOADING", true);
    try {
      const { data } = await request.get(`paiements/${id}`);
      commit("SET_PAIEMENT", data);
      return data;
    } catch (error) {
      console.error("Erreur chargement paiement:", error);
      commit("SET_ERROR", error.response?.data?.message || error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async initierPaiement({ commit }, payload) {
    commit("SET_LOADING", true);
    try {
      const { data } = await request.post("paiements/initier", payload);

      if (data.url || (typeof data === "string" && data.startsWith("http"))) {
        const url = data.url || data;
        commit("SET_URL_PAIEMENT", url);
        commit("SET_STATUT", "en_attente");
        commit("SET_MESSAGE", "Redirection vers la page de paiement...");

        // 🔁 Redirige directement l'utilisateur vers FedaPay
        window.location.href = url;
        return url;
      } else {
        const message =
          data.message || "Erreur lors de l'initialisation du paiement";
        commit("SET_MESSAGE", message);
        commit("SET_STATUT", "echec");
        throw new Error(message);
      }
    } catch (error) {
      console.error("Erreur lors de l'initiation du paiement:", error);
      commit(
        "SET_MESSAGE",
        error.response?.data?.message || "Erreur de connexion au serveur"
      );
      commit("SET_STATUT", "echec");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async traiterCallback({ commit }, payload) {
    try {
      const { data } = await request.post("paiements/callback", payload);
      commit("SET_STATUT", "reussi");
      commit("SET_MESSAGE", data.message || "Paiement effectué avec succès");

      // Recharger les paiements après le callback
      await this.dispatch("paiements/getAll");

      return data;
    } catch (error) {
      console.error("Erreur callback paiement:", error);
      commit("SET_STATUT", "echec");
      commit("SET_MESSAGE", "Erreur lors du traitement du paiement");
      throw error;
    }
  },

  // ============================================
  // NOUVELLES ACTIONS
  // ============================================

  async getStatistiques({ commit }) {
    try {
      const { data } = await request.get("paiements/statistiques");
      commit("SET_STATISTIQUES", data);
      return data;
    } catch (error) {
      console.error("Erreur chargement statistiques:", error);
      commit("SET_ERROR", error.response?.data?.message || error.message);
      throw error;
    }
  },

  async getByLocataire({ commit }, locataireId) {
    commit("SET_LOADING", true);
    try {
      const { data } = await request.get(`paiements/locataire/${locataireId}`);
      commit("SET_PAIEMENTS", data);
      return data;
    } catch (error) {
      console.error("Erreur chargement paiements locataire:", error);
      commit("SET_ERROR", error.response?.data?.message || error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async getByBien({ commit }, bienId) {
    commit("SET_LOADING", true);
    try {
      const { data } = await request.get(`paiements/bien/${bienId}`);
      commit("SET_PAIEMENTS", data);
      return data;
    } catch (error) {
      console.error("Erreur chargement paiements bien:", error);
      commit("SET_ERROR", error.response?.data?.message || error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async getByStatut({ commit }, statut) {
    commit("SET_LOADING", true);
    try {
      const { data } = await request.get(`paiements/statut/${statut}`);
      commit("SET_PAIEMENTS", data);
      return data;
    } catch (error) {
      console.error("Erreur chargement paiements par statut:", error);
      commit("SET_ERROR", error.response?.data?.message || error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async create({ commit }, paiement) {
    commit("SET_LOADING", true);
    try {
      const { data } = await request.post("paiements", paiement);
      commit("ADD_PAIEMENT", data);
      return data;
    } catch (error) {
      console.error("Erreur création paiement:", error);
      commit("SET_ERROR", error.response?.data?.message || error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async update({ commit }, { id, ...paiement }) {
    commit("SET_LOADING", true);
    try {
      const { data } = await request.put(`paiements/${id}`, paiement);
      commit("UPDATE_PAIEMENT", data);
      return data;
    } catch (error) {
      console.error("Erreur mise à jour paiement:", error);
      commit("SET_ERROR", error.response?.data?.message || error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async delete({ commit }, id) {
    commit("SET_LOADING", true);
    try {
      await request.delete(`paiements/${id}`);
      commit("REMOVE_PAIEMENT", id);
      return true;
    } catch (error) {
      console.error("Erreur suppression paiement:", error);
      commit("SET_ERROR", error.response?.data?.message || error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // ============================================
  // ACTIONS SPÉCIFIQUES
  // ============================================

  async marquerPaye(
    { commit },
    { id, modePaiement, datePaiement, montantPaye, numeroTransaction }
  ) {
    commit("SET_LOADING", true);
    try {
      const { data } = await request.post(`paiements/${id}/marquer-paye`, {
        modePaiement,
        datePaiement,
        montantPaye,
        numeroTransaction,
      });
      commit("UPDATE_PAIEMENT", data);
      commit("SET_MESSAGE", "Paiement marqué comme payé avec succès");
      return data;
    } catch (error) {
      console.error("Erreur marquer payé:", error);
      commit("SET_ERROR", error.response?.data?.message || error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async marquerPayesMultiple({ commit }, { ids, modePaiement, datePaiement }) {
    commit("SET_LOADING", true);
    try {
      const { data } = await request.post("paiements/marquer-payes-multiple", {
        ids,
        modePaiement,
        datePaiement,
      });

      // Mettre à jour chaque paiement
      data.forEach((paiement) => {
        commit("UPDATE_PAIEMENT", paiement);
      });

      commit(
        "SET_MESSAGE",
        `${ids.length} paiement(s) marqué(s) comme payé(s)`
      );
      return data;
    } catch (error) {
      console.error("Erreur marquer payés multiple:", error);
      commit("SET_ERROR", error.response?.data?.message || error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async envoyerRappel({ commit }, id) {
    commit("SET_LOADING", true);
    try {
      await request.post(`paiements/${id}/rappel`);
      commit("SET_MESSAGE", "Rappel envoyé avec succès");
      return true;
    } catch (error) {
      console.error("Erreur envoi rappel:", error);
      commit("SET_ERROR", error.response?.data?.message || error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async envoyerRappelsMultiple({ commit }, ids) {
    commit("SET_LOADING", true);
    try {
      await request.post("paiements/rappels-multiple", { ids });
      commit("SET_MESSAGE", `${ids.length} rappel(s) envoyé(s)`);
      return true;
    } catch (error) {
      console.error("Erreur envoi rappels multiple:", error);
      commit("SET_ERROR", error.response?.data?.message || error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // ============================================
  // EXPORT
  // ============================================

  async exportToExcel({ commit }, filters = {}) {
    commit("SET_LOADING", true);
    try {
      const response = await request.post("paiements/export", filters, {
        responseType: "blob",
      });

      // Créer un blob et télécharger
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `paiements_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);

      commit("SET_MESSAGE", "Export Excel réussi");
      return true;
    } catch (error) {
      console.error("Erreur export Excel:", error);
      commit(
        "SET_ERROR",
        error.response?.data?.message || "Erreur lors de l'export"
      );
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // ============================================
  // UTILITAIRES
  // ============================================

  async verifierPaiementsEnRetard({ commit }) {
    try {
      await request.post("paiements/verifier-retards");
      commit("SET_MESSAGE", "Vérification des retards effectuée");
      return true;
    } catch (error) {
      console.error("Erreur vérification retards:", error);
      commit("SET_ERROR", error.response?.data?.message || error.message);
      throw error;
    }
  },

  // Réinitialiser les états
  resetState({ commit }) {
    commit("SET_URL_PAIEMENT", null);
    commit("SET_STATUT", null);
    commit("SET_MESSAGE", null);
    commit("CLEAR_ERROR");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
