// mixins/DataLoadingMixin.js
// import { ElMessage } from "element-plus";

export default {
  data() {
    return {
      dataLoading: false,
      loadingStates: {
        typesBien: false,
        pays: false,
        services: false,
        securites: false,
        activites: false,
        modePaiement: false,
        languesPersonnel: false,
        typeCuisine: false,
        typeVue: false,
        typeGarage: false,
      },
      typesBien: [], // Ajouté
      pays: [], // Ajouté
      services: [], // Ajouté
      securites: [], // Ajouté
      activites: [], // Ajouté
      modesPaiement: [], // Ajouté
      typeVue: [],
      languesPersonnel: [], // Ajouté
      typesDetailsBiens: [], // Ajouté
      etatsGeneral: [], // Ajouté
      typesClimatisation: [], // Ajouté
      typeGarage: [], // Ajouté
      typesDPE: [], // Ajouté
      uniteSurface: [], // Ajouté
      uniteVolume: [], // Ajouté
    };
  },

  methods: {
    /**
     * Charge toutes les données nécessaires au formulaire
     */
    async loadAllData() {
      this.dataLoading = true;

      try {
        // Charger les données en parallèle avec gestion d'erreur
        const [
          typesBien,
          pays,
          services,
          securites,
          activites,
          modesPaiement,
          languesPersonnel,
          typesDetailsBiens,
          etatsGeneral,
          typeCuisine,
          typeVue,
          typesClimatisation,
          typeGarage,
          typesDPE,
          typeUnite,
          uniteSurface,
        ] = await Promise.all([
          this.loadTypesBien(),
          this.loadPays(),
          this.loadServices(),
          this.loadSecurites(),
          this.loadActivites(),
          this.loadModePaiement(),
          this.loadLanguePersonnel(), // Si nécessaire
          this.loadTypesDetailsBiens(),
          this.loadEtatsGeneral(),
          this.loadTypeCuisine(),
          this.loadTypeVue(),

          this.loadTypesClimatisation(),
          this.loadTypesGarage(),
          this.loadTypesDPE(),
          this.loadTypeUnite(),
          this.loadUniteSurface(),
        ]);

        // Assigner les données chargées
        this.typesBien = typesBien || [];
        this.pays = pays || [];
        this.services = this.formatEnumArray(services || []);
        this.securites = this.formatEnumArray(securites || []);
        this.activites = this.formatEnumArray(activites || []);
        this.modesPaiement = this.formatEnumArray(modesPaiement || []);
        this.languesPersonnel = this.formatEnumArray(languesPersonnel || []);
        this.typesDetailsBiens = this.formatEnumArray(typesDetailsBiens || []);
        this.etatsGeneral = this.formatEnumArray(etatsGeneral || []);
        this.typesClimatisation = this.formatEnumArray(
          typesClimatisation || []
        );
        this.typeCuisine = this.formatEnumArray(typeCuisine || []);
        this.typeVue = this.formatEnumArray(typeVue || []);
        this.typeUnite = this.formatEnumArray(typeUnite || []);
        this.typeGarage = this.formatEnumArray(typeGarage || []);
        this.typesDPE = this.formatEnumArray(typesDPE || []);
        this.uniteSurface = this.formatEnumArray(uniteSurface || []);

        console.log("✅ Toutes les données chargées avec succès");
      } catch (error) {
        console.error("❌ Erreur lors du chargement des données:", error);
        ElMessage.error("Erreur lors du chargement des données initiales");
      } finally {
        this.dataLoading = false;
      }
    },

    /**
     * Charge les types de biens immobiliers
     */
    async loadTypesBien() {
      this.loadingStates.typesBien = true;
      try {
        const data = await this.$store.dispatch("typeBiens/getAll");
        console.log("Types de biens chargés:", data);
        return data;
      } catch (error) {
        console.error("Erreur chargement types de biens:", error);
        ElMessage.warning("Impossible de charger les types de biens");
        return [];
      } finally {
        this.loadingStates.typesBien = false;
      }
    },

    /**
     * Charge la liste des pays
     */
    async loadPays() {
      this.loadingStates.pays = true;
      try {
        const data = await this.$store.dispatch("pays/getAll");
        console.log("Pays chargés:", data);
        return data;
      } catch (error) {
        console.error("Erreur chargement pays:", error);
        ElMessage.warning("Impossible de charger la liste des pays");
        return [];
      } finally {
        this.loadingStates.pays = false;
      }
    },

    /**
     * Charge les services disponibles
     */
    async loadServices() {
      this.loadingStates.services = true;
      try {
        const data = await this.$store.dispatch("types/getServices");
        console.log("Services chargés:", data);
        return data;
      } catch (error) {
        console.error("Erreur chargement services:", error);
        return [];
      } finally {
        this.loadingStates.services = false;
      }
    },

    /**
     * Charge les options de sécurité
     */
    async loadSecurites() {
      this.loadingStates.securites = true;
      try {
        const data = await this.$store.dispatch("types/getSecurites");
        console.log("Sécurités chargées:", data);
        return data;
      } catch (error) {
        console.error("Erreur chargement sécurités:", error);
        return [];
      } finally {
        this.loadingStates.securites = false;
      }
    },

    /**
     * Charge les activités disponibles
     */
    async loadActivites() {
      this.loadingStates.activites = true;
      try {
        const data = await this.$store.dispatch("types/getActivites");
        console.log("Activités chargées:", data);
        return data;
      } catch (error) {
        console.error("Erreur chargement activités:", error);
        return [];
      } finally {
        this.loadingStates.activites = false;
      }
    },
    /**
     * Charge les modes de paiement
     */
    async loadModePaiement() {
      this.loadingStates.modesPaiement = true;
      try {
        const data = await this.$store.dispatch("types/getModePaiement");
        console.log("Modes de paiement chargés:", data);
        return data;
      } catch (error) {
        console.error("Erreur chargement modes de paiement:", error);
        return [];
      } finally {
        this.loadingStates.modesPaiement = false;
      }
    },
    /**
     * Charge les modes de paiement
     */
    async loadTypeUnite() {
      this.loadingStates.typeUnite = true;
      try {
        const data = await this.$store.dispatch("types/getTypeUnite");
        console.log("Types d'unité chargés:", data);
        return data;
      } catch (error) {
        console.error("Erreur chargement types d'unité:", error);
        return [];
      } finally {
        this.loadingStates.typeUnite = false;
      }
    },
    /**
     * Charge les types de détails de biens
     */
    async loadTypesDetailsBiens() {
      try {
        const data = await this.$store.dispatch("types/getTypeDetailsBien");
        console.log("Types détails biens chargés:", data);
        return data;
      } catch (error) {
        console.error("Erreur chargement types détails biens:", error);
        return [];
      }
    },

    /**
     * Charge les états généraux
     */
    async loadEtatsGeneral() {
      try {
        const data = await this.$store.dispatch("types/getEtatGeneral");
        console.log("États généraux chargés:", data);
        return data;
      } catch (error) {
        console.error("Erreur chargement états généraux:", error);
        return [];
      }
    },

    /**
     * Charge les types de climatisation
     */
    async loadTypesClimatisation() {
      try {
        const data = await this.$store.dispatch("types/getTypeClimatisation");
        console.log("Types climatisation chargés:", data);
        return data;
      } catch (error) {
        console.error("Erreur chargement types climatisation:", error);
        return [];
      }
    },

    /**
     * Charge les types de garage
     */
    async loadTypesGarage() {
      try {
        const data = await this.$store.dispatch("types/getTypeGarage");
        console.log("Types garage chargés:", data);
        return data;
      } catch (error) {
        console.error("Erreur chargement types garage:", error);
        return [];
      }
    },

    /**
     * Charge les types de garage
     */
    async loadTypeCuisine() {
      try {
        const data = await this.$store.dispatch("types/getTypeCuisine");
        console.log("Types cuisine chargés:", data);
        return data;
      } catch (error) {
        console.error("Erreur chargement types de cuisine:", error);
        return [];
      }
    },

    /**
     * Charge les types DPE
     */
    async loadTypesDPE() {
      try {
        const data = await this.$store.dispatch("types/getTypeDPE");
        console.log("Types DPE chargés:", data);
        return data;
      } catch (error) {
        console.error("Erreur chargement types DPE:", error);
        return [];
      }
    },
    /**
     * Charge les Unités de surface
     */
    async loadUniteSurface() {
      try {
        const data = await this.$store.dispatch("types/getUniteSurface");
        console.log("Unités de surface chargés:", data);
        return data;
      } catch (error) {
        console.error("Erreur chargement unités de surface:", error);
        return [];
      }
    },

    /**
     * Charge les Unités de surface
     */
    async loadUniteVolume() {
      try {
        const data = await this.$store.dispatch("types/getUniteVolume");
        console.log("Unités de volume chargés:", data);
        return data;
      } catch (error) {
        console.error("Erreur chargement unités de volume:", error);
        return [];
      }
    },

    /**
     * Charge les Unités de surface
     */
    async loadLanguePersonnel() {
      try {
        const data = await this.$store.dispatch("types/getLanguePersonnel");
        console.log("Unités de langue personnelle chargées:", data);
        return data;
      } catch (error) {
        console.error("Erreur chargement de langue personnelle:", error);
        return [];
      }
    },

    /**
     * Charge les Unités de surface
     */
    async loadTypeVue() {
      try {
        const data = await this.$store.dispatch("types/getTypeVue");
        console.log("Unités de volume chargés:", data);
        return data;
      } catch (error) {
        console.error("Erreur chargement unités de volume:", error);
        return [];
      }
    },

    /**
     * Formate un tableau d'énumérations pour affichage
     * @param {Array} enumArray - Tableau d'énumérations
     * @returns {Array} Tableau formaté avec key et label
     */
    formatEnumArray(enumArray) {
      if (!Array.isArray(enumArray)) {
        return [];
      }

      return enumArray.map((enumValue) => ({
        key: enumValue,
        label: this.formatEnumLabel(enumValue),
      }));
    },

    /**
     * Formate un libellé d'énumération
     * @param {string} enumValue - Valeur d'énumération (ex: "INTERNET_HAUT_DEBIT")
     * @returns {string} Libellé formaté (ex: "Internet haut débit")
     */
    formatEnumLabel(enumValue) {
      if (!enumValue) return "";

      return enumValue
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase());
    },

    /**
     * Recharge les données d'un type spécifique
     * @param {string} dataType - Type de données à recharger
     */
    async reloadData(dataType) {
      const loaders = {
        typesBien: this.loadTypesBien,
        pays: this.loadPays,
        services: this.loadServices,
        securites: this.loadSecurites,
        activites: this.loadActivites,
        modesPaiement: this.loadModePaiement,
        languesPersonnel: this.loadLanguePersonnel,
        typesDetailsBiens: this.loadTypesDetailsBiens,
        etatsGeneral: this.loadEtatsGeneral,
        typesClimatisation: this.loadTypesClimatisation,
        typeGarage: this.loadTypesGarage,
        typesDPE: this.loadTypesDPE,
        typeUnite: this.loadTypeUnite,
        uniteSurface: this.loadUniteSurface,
        uniteVolume: this.loadUniteVolume,
        typeCuisine: this.loadTypeCuisine,
        typeVue: this.loadTypeVue,
      };

      if (loaders[dataType]) {
        try {
          const data = await loaders[dataType]();
          this[dataType] =
            dataType.includes("types") || dataType === "pays"
              ? data
              : this.formatEnumArray(data);
          ElMessage.success(`${dataType} rechargé avec succès`);
        } catch (error) {
          ElMessage.error(`Erreur lors du rechargement de ${dataType}`);
        }
      }
    },

    /**
     * Vérification de la disponibilité des données critiques
     */
    checkCriticalData() {
      const criticalData = {
        "Types de biens": this.typesBien?.length > 0,
        Pays: this.pays?.length > 0,
      };

      const missingData = Object.entries(criticalData)
        .filter(([_, available]) => !available)
        .map(([name]) => name);

      if (missingData.length > 0) {
        ElMessage.warning(`Données manquantes: ${missingData.join(", ")}`);
        return false;
      }

      return true;
    },
  },
};
