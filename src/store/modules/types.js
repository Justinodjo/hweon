import request from "@/http/request";

const state = () => ({
  all: [],
  one: {},
  typeContrat: [],
});

const getters = {
  all: (state) => state.all,
  one: (state) => state.one,
  typeContrat: (state) => state.typeContrat,
};

const mutations = {
  SET_ALL: (state, obj) => {
    state.all = obj;
  },
  SET_TYPE_CONTRAT: (state, obj) => {
    state.typeContrat = obj;
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
  async getSousDetails(cxt, payload) {
    let { data } = await request.get("enums/type-sous-details");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getServices(cxt, payload) {
    let { data } = await request.get("enums/services");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getSecurites(cxt, payload) {
    let { data } = await request.get("enums/securites");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getActivites(cxt, payload) {
    let { data } = await request.get("enums/activites");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypeOffre(cxt, payload) {
    let { data } = await request.get("enums/type-offre");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypeNotification(cxt, payload) {
    let { data } = await request.get("enums/type-notification");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypeDonnee(cxt, payload) {
    let { data } = await request.get("enums/type-donnee");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypeDocument(cxt, payload) {
    let { data } = await request.get("enums/type-document");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypeDetailsBien(cxt, payload) {
    let { data } = await request.get("enums/type-details-bien");
    cxt.commit("SET_ALL", data);
    return data;
  },

  // async getTypeContrat(cxt, payload) {
  //   let { data } = await request.get("enums/type-contrat");
  //   cxt.commit("SET_ALL", data);
  //   return data;
  // },

  async getTypeConsentement(cxt, payload) {
    let { data } = await request.get("enums/type-consentement");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypeAlertes(cxt, payload) {
    let { data } = await request.get("enums/type-alertes");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getStatutOffres(cxt, payload) {
    let { data } = await request.get("enums/statut-offres");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getStatutInterventions(cxt, payload) {
    let { data } = await request.get("enums/statut-interventions");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getStatutConsentements(cxt, payload) {
    let { data } = await request.get("enums/statut-consentements");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getStatusContrats(cxt, payload) {
    let { data } = await request.get("enums/status-contrats");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getNiveauxPriorite(cxt, payload) {
    let { data } = await request.get("enums/niveaux-priorite");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getModePaiement(cxt, payload) {
    let { data } = await request.get("enums/mode-paiement");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getLanguePersonnel(cxt, payload) {
    let { data } = await request.get("enums/langue-personnel");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypeVue(cxt, payload) {
    let { data } = await request.get("enums/type-vue");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypeVitrage(cxt, payload) {
    let { data } = await request.get("enums/type-vitrage");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypeVentilation(cxt, payload) {
    let { data } = await request.get("enums/type-ventilation");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypeUnite(cxt, payload) {
    let { data } = await request.get("enums/type-unite");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypeTerrasse(cxt, payload) {
    let { data } = await request.get("enums/type-terrasse");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypeRevetementMural(cxt, payload) {
    let { data } = await request.get("enums/type-revetement-mural");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypePorte(cxt, payload) {
    let { data } = await request.get("enums/type-porte");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypeMenuiserie(cxt, payload) {
    let { data } = await request.get("enums/type-menuiserie");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypePlafond(cxt, payload) {
    let { data } = await request.get("enums/type-plafond");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypeSol(cxt, payload) {
    let { data } = await request.get("enums/type-sol");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypePiscine(cxt, payload) {
    let { data } = await request.get("enums/type-piscine");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypeIsolation(cxt, payload) {
    let { data } = await request.get("enums/type-isolation");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypeGarage(cxt, payload) {
    let { data } = await request.get("enums/type-garage");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypeCuisine(cxt, payload) {
    let { data } = await request.get("enums/type-cuisine");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypeClimatisation(cxt, payload) {
    let { data } = await request.get("enums/type-climatisation");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypeChauffage(cxt, payload) {
    let { data } = await request.get("enums/type-chauffage");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypeCaracteristique(cxt, payload) {
    let { data } = await request.get("enums/type-caracteristique");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypeBalcon(cxt, payload) {
    let { data } = await request.get("enums/type-balcon");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getEtatGeneral(cxt, payload) {
    let { data } = await request.get("enums/etat-general");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getTypeDPE(cxt, payload) {
    let { data } = await request.get("enums/type-dpe");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getUniteSurface(cxt, payload) {
    let { data } = await request.get("enums/unite-surface");
    cxt.commit("SET_ALL", data);
    return data;
  },
  async getUniteVolume(cxt, payload) {
    let { data } = await request.get("enums/unite-volume");
    cxt.commit("SET_ALL", data);
    return data;
  },
  async getTypeContrat({ commit, state }) {
    // 🔹 Étape 1 : éviter de recharger si déjà en cache
    if (state.all && state.all.length > 0) {
      return state.all;
    }

    try {
      const { data } = await request.get("enums/type-contrat");
      console.log("voici ma data", data);
      const items = Array.isArray(data) ? data : [];
      console.log("voici mon items", items);
      // 🔹 Tables de correspondance
      const LABELS = {
        MEUBLEE: "Meublée",
        NON_MEUBLEE: "Non Meublée",
        SAISONNIERE: "Saisonnière",
        COMMERCIALE: "Commerciale",
        PROFESSIONNELLE: "Professionnelle",
        ETUDIANT: "Étudiant",
        OPTION_ACHAT: "Option d’Achat",
        ACCESSION: "Accession",
      };

      const ICONS = {
        MEUBLEE: "🏠",
        NON_MEUBLEE: "🏢",
        SAISONNIERE: "🌴",
        COMMERCIALE: "🏪",
        PROFESSIONNELLE: "💼",
        ETUDIANT: "🎓",
        OPTION_ACHAT: "🛒",
        ACCESSION: "🏡",
      };

      const DESCS = {
        MEUBLEE: "Location avec meubles inclus.",
        NON_MEUBLEE: "Location vide (non meublée).",
        SAISONNIERE: "Location de courte durée.",
        COMMERCIALE: "Usage commercial.",
        PROFESSIONNELLE: "Bureau ou local professionnel.",
        ETUDIANT: "Logement adapté aux étudiants.",
        OPTION_ACHAT: "Possibilité d’achat ultérieure.",
        ACCESSION: "Accession progressive à la propriété.",
      };

      // 🔹 Mapping des données
      const mapped = items.map((key) => {
        const k = String(key).toUpperCase();
        return {
          id: k,
          value: k,
          label: LABELS[k] || k,
          icon: ICONS[k] || "🏷️",
          description: DESCS[k] || "",
        };
      });

      commit("SET_TYPE_CONTRAT", mapped);
      console.log("voici mon mapped", mapped);
      return mapped;
    } catch (err) {
      console.error("❌ Erreur getTypeContrat :", err);
      commit("SET_TYPE_CONTRAT", []);
      return [];
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
