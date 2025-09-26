// mixins/GeographicMixin.js
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  data() {
    return {
      geolocationError: "", // Déclarez ici geolocationError
    };
  },
  methods: {
    /**
     * Gestionnaire pour le changement de pays
     */
    async onPaysChange() {
      console.log("Pays sélectionné:", this.selectedPays);

      this.resetGeographicLevels("departement");

      if (this.selectedPays) {
        try {
          await this.fetchDepartementsByPays();
          this.updateFormGeography();
          this.updateAdresse();
        } catch (error) {
          console.error("Erreur lors du chargement des départements:", error);
          ElMessage.error("Erreur lors du chargement des départements");
        }
      }
    },

    /**
     * Gestionnaire pour le changement de département
     */
    async onDepartementChange() {
      console.log("Département sélectionné:", this.selectedDepartement);

      this.resetGeographicLevels("commune");

      if (this.selectedDepartement && this.selectedDepartement !== "unknown") {
        try {
          await this.fetchCommunes();
          this.updateFormGeography();
          this.updateAdresse();
        } catch (error) {
          console.error("Erreur lors du chargement des communes:", error);
          ElMessage.error("Erreur lors du chargement des communes");
        }
      } else if (this.selectedDepartement === "unknown") {
        this.handleUnknownDepartement();
      }
    },

    /**
     * Gestionnaire pour le changement de commune
     */
    async onCommuneChange() {
      console.log("Commune sélectionnée:", this.selectedCommune);

      this.resetGeographicLevels("arrondissement");

      if (this.selectedCommune && this.selectedCommune !== "unknown") {
        try {
          await this.fetchArrondissements();
          this.updateFormGeography();
          this.updateAdresse();
        } catch (error) {
          console.error(
            "Erreur lors du chargement des arrondissements:",
            error
          );
          ElMessage.error("Erreur lors du chargement des arrondissements");
        }
      } else if (this.selectedCommune === "unknown") {
        this.handleUnknownCommune();
      }
    },

    /**
     * Gestionnaire pour le changement d'arrondissement
     */
    async onArrondissementChange() {
      console.log("Arrondissement sélectionné:", this.selectedArrondissement);

      this.resetGeographicLevels("quartier");

      if (
        this.selectedArrondissement &&
        this.selectedArrondissement !== "unknown"
      ) {
        try {
          await this.fetchQuartiers();
          this.updateFormGeography();
          this.updateAdresse();
        } catch (error) {
          console.error("Erreur lors du chargement des quartiers:", error);
          ElMessage.error("Erreur lors du chargement des quartiers");
        }
      } else if (this.selectedArrondissement === "unknown") {
        this.handleUnknownArrondissement();
      }
    },

    /**
     * Gestionnaire pour le changement de quartier
     */
    onQuartierChange() {
      console.log("Quartier sélectionné:", this.selectedQuartier);

      this.updateFormGeography();
      this.updateAdresse();

      if (this.selectedQuartier === "unknown") {
        this.handleUnknownQuartier();
      }
    },

    /**
     * Réinitialise les niveaux géographiques à partir d'un niveau donné
     * @param {string} fromLevel - Le niveau à partir duquel réinitialiser
     */
    resetGeographicLevels(fromLevel) {
      const levels = ["departement", "commune", "arrondissement", "quartier"];
      const startIndex = levels.indexOf(fromLevel);

      for (let i = startIndex; i < levels.length; i++) {
        const level = levels[i];
        switch (level) {
          case "departement":
            this.selectedDepartement = null;
            this.departements = [];
            break;
          case "commune":
            this.selectedCommune = null;
            this.communes = [];
            break;
          case "arrondissement":
            this.selectedArrondissement = null;
            this.arrondissements = [];
            break;
          case "quartier":
            this.selectedQuartier = null;
            this.quartiers = [];
            break;
        }
      }
    },

    /**
     * Met à jour les données du formulaire avec les sélections géographiques
     */
    updateFormGeography() {
      this.form.paysId = this.selectedPays;
      this.form.departementId = this.selectedDepartement;
      this.form.communeId = this.selectedCommune;
      this.form.arrondissementId = this.selectedArrondissement;
      this.form.quartierId = this.selectedQuartier;
    },

    /**
     * Met à jour l'adresse complète basée sur les sélections
     */
    updateAdresse() {
      const addressParts = [];

      // Utiliser les libellés personnalisés si disponibles
      if (this.selectedQuartier === "unknown" && this.form.quartierLibelle) {
        addressParts.push(this.form.quartierLibelle);
      } else if (this.selectedQuartier && this.selectedQuartier !== "unknown") {
        const quartier = this.quartiers.find(
          (q) => (q.id || q.idQuartier) === this.selectedQuartier
        );
        if (quartier) addressParts.push(quartier.libelle);
      }

      if (
        this.selectedArrondissement === "unknown" &&
        this.form.arrondissementLibelle
      ) {
        addressParts.push(this.form.arrondissementLibelle);
      } else if (
        this.selectedArrondissement &&
        this.selectedArrondissement !== "unknown"
      ) {
        const arrondissement = this.arrondissements.find(
          (a) => (a.id || a.idArrondissement) === this.selectedArrondissement
        );
        if (arrondissement) addressParts.push(arrondissement.libelle);
      }

      if (this.selectedCommune === "unknown" && this.form.communeLibelle) {
        addressParts.push(this.form.communeLibelle);
      } else if (this.selectedCommune && this.selectedCommune !== "unknown") {
        const commune = this.communes.find(
          (c) => (c.id || c.idCommune) === this.selectedCommune
        );
        if (commune) addressParts.push(commune.libelle);
      }

      if (
        this.selectedDepartement === "unknown" &&
        this.form.departementLibelle
      ) {
        addressParts.push(this.form.departementLibelle);
      } else if (
        this.selectedDepartement &&
        this.selectedDepartement !== "unknown"
      ) {
        const departement = this.departements.find(
          (d) => (d.id || d.idDepartement) === this.selectedDepartement
        );
        if (departement) addressParts.push(departement.libelle);
      }

      if (this.selectedPays) {
        const pays = this.pays.find((p) => p.id === this.selectedPays);
        if (pays) addressParts.push(pays.libelle);
      }

      this.form.adresse = addressParts.join(", ");
    },

    /**
     * Récupère les départements d'un pays
     */
    async fetchDepartementsByPays() {
      if (!this.selectedPays) return;

      try {
        this.departements = await this.$store.dispatch(
          "departements/getDepartementsByPays",
          this.selectedPays
        );
        console.log("Départements chargés:", this.departements);

        // Réinitialiser les niveaux inférieurs
        this.selectedDepartement = null;
        this.communes = [];
        this.selectedCommune = null;
        this.arrondissements = [];
        this.selectedArrondissement = null;
        this.quartiers = [];
        this.selectedQuartier = null;
      } catch (error) {
        console.error("Erreur lors du chargement des départements:", error);
        this.departements = [];
        ElMessage.error("Erreur lors du chargement des départements");
      }
    },

    // 🌍 Méthodes de géolocalisation
    getCurrentLocation() {
      if (!navigator.geolocation) {
        this.geolocationStatus = "unsupported";
        this.geolocationError =
          "Géolocalisation non supportée par ce navigateur";
        ElMessage.error("Géolocalisation non supportée");
        return;
      }

      this.loadingGeolocation = true;
      this.geolocationStatus = "loading";
      this.geolocationError = "";

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          this.form.latitude = parseFloat(latitude.toFixed(6));
          this.form.longitude = parseFloat(longitude.toFixed(6));
          this.geolocationStatus = "success";
          this.loadingGeolocation = false;
          ElMessage.success("Position GPS obtenue avec succès");
        },
        (error) => {
          this.loadingGeolocation = false;

          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.geolocationStatus = "denied";
              this.geolocationError = "Permission de géolocalisation refusée";
              break;
            case error.POSITION_UNAVAILABLE:
              this.geolocationStatus = "error";
              this.geolocationError = "Position GPS non disponible";
              break;
            case error.TIMEOUT:
              this.geolocationStatus = "error";
              this.geolocationError =
                "Délai d'attente dépassé pour la géolocalisation";
              break;
            default:
              this.geolocationStatus = "error";
              this.geolocationError =
                "Erreur lors de l'obtention de la position GPS";
              break;
          }
          ElMessage.error(this.geolocationError);
        },
        options
      );
    },
    async getCurrentLocation() {
      this.$emit("update:loading", true);
      try {
        const position = await this.getPositionFromBrowser();
        this.$emit("update:latitude", position.latitude);
        this.$emit("update:longitude", position.longitude);
        this.$emit("update:geolocationStatus", "success");
      } catch (error) {
        this.$emit("update:geolocationStatus", "error");
        this.$emit("update:geolocationError", error.message);
      } finally {
        this.$emit("update:loading", false);
      }
    },

    getPositionFromBrowser() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve(position.coords),
            (error) => reject(error)
          );
        } else {
          reject(new Error("Géolocalisation non supportée"));
        }
      });
    },

    /**
     * Récupère les communes d'un département
     */
    async fetchCommunes() {
      if (!this.selectedDepartement) return;

      try {
        const communes = await this.$store.dispatch(
          "communes/getCommunesByDepartementId",
          { id: this.selectedDepartement }
        );
        console.log("Communes chargées:", communes);
        this.communes = communes || [];

        // Réinitialiser les niveaux inférieurs
        this.selectedCommune = null;
        this.arrondissements = [];
        this.selectedArrondissement = null;
        this.quartiers = [];
        this.selectedQuartier = null;
      } catch (error) {
        console.error("Erreur lors du chargement des communes:", error);
        this.communes = [];
        ElMessage.error("Erreur lors du chargement des communes");
      }
    },

    /**
     * Récupère les arrondissements d'une commune
     */
    async fetchArrondissements() {
      if (!this.selectedCommune) return;

      try {
        const arrondissements = await this.$store.dispatch(
          "arrondissements/getArrondissementsByCommuneId",
          { id: this.selectedCommune }
        );
        console.log("Arrondissements chargés:", arrondissements);
        this.arrondissements = arrondissements || [];

        // Réinitialiser les niveaux inférieurs
        this.selectedArrondissement = null;
        this.quartiers = [];
        this.selectedQuartier = null;
      } catch (error) {
        console.error("Erreur lors du chargement des arrondissements:", error);
        this.arrondissements = [];
        ElMessage.error("Erreur lors du chargement des arrondissements");
      }
    },

    /**
     * Récupère les quartiers d'un arrondissement
     */
    async fetchQuartiers() {
      if (!this.selectedArrondissement) return;

      try {
        const quartiers = await this.$store.dispatch(
          "quartiers/getQuartiersByarrondissementId",
          { id: this.selectedArrondissement }
        );
        console.log("Quartiers chargés:", quartiers);
        this.quartiers = quartiers || [];
        this.selectedQuartier = null;
      } catch (error) {
        console.error("Erreur lors du chargement des quartiers:", error);
        this.quartiers = [];
        ElMessage.error("Erreur lors du chargement des quartiers");
      }
    },

    /**
     * Gère le cas "département non répertorié"
     */
    handleUnknownDepartement() {
      ElMessageBox.prompt(
        "Veuillez saisir le nom du département",
        "Département non répertorié",
        {
          confirmButtonText: "Valider",
          cancelButtonText: "Annuler",
          inputPattern: /^.{2,}$/,
          inputErrorMessage: "Le nom doit contenir au moins 2 caractères",
        }
      )
        .then(({ value }) => {
          this.form.departementLibelle = value;
          this.updateAdresse();
          ElMessage.success("Département personnalisé ajouté");
        })
        .catch(() => {
          this.selectedDepartement = null;
        });
    },

    /**
     * Gère le cas "commune non répertoriée"
     */
    handleUnknownCommune() {
      ElMessageBox.prompt(
        "Veuillez saisir le nom de la commune",
        "Commune non répertoriée",
        {
          confirmButtonText: "Valider",
          cancelButtonText: "Annuler",
          inputPattern: /^.{2,}$/,
          inputErrorMessage: "Le nom doit contenir au moins 2 caractères",
        }
      )
        .then(({ value }) => {
          this.form.communeLibelle = value;
          this.updateAdresse();
          ElMessage.success("Commune personnalisée ajoutée");
        })
        .catch(() => {
          this.selectedCommune = null;
        });
    },

    /**
     * Gère le cas "arrondissement non répertorié"
     */
    handleUnknownArrondissement() {
      ElMessageBox.prompt(
        "Veuillez saisir le nom de l'arrondissement",
        "Arrondissement non répertorié",
        {
          confirmButtonText: "Valider",
          cancelButtonText: "Annuler",
          inputPattern: /^.{2,}$/,
          inputErrorMessage: "Le nom doit contenir au moins 2 caractères",
        }
      )
        .then(({ value }) => {
          this.form.arrondissementLibelle = value;
          this.updateAdresse();
          ElMessage.success("Arrondissement personnalisé ajouté");
        })
        .catch(() => {
          this.selectedArrondissement = null;
        });
    },

    /**
     * Gère le cas "quartier non répertorié"
     */
    handleUnknownQuartier() {
      ElMessageBox.prompt(
        "Veuillez saisir le nom du quartier",
        "Quartier non répertorié",
        {
          confirmButtonText: "Valider",
          cancelButtonText: "Annuler",
          inputPattern: /^.{2,}$/,
          inputErrorMessage: "Le nom doit contenir au moins 2 caractères",
        }
      )
        .then(({ value }) => {
          this.form.quartierLibelle = value;
          this.updateAdresse();
          ElMessage.success("Quartier personnalisé ajouté");
        })
        .catch(() => {
          this.selectedQuartier = null;
        });
    },
  },
};
