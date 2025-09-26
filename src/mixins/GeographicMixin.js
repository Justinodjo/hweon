// mixins/GeographicMixin.js
import { ElMessage, ElMessageBox } from "element-plus";

export default {
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
          await this.updateAdresse();
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

      if (this.selectedQuartier === "unknown" && this.form.quartierLibelle) {
        addressParts.push(this.form.quartierLibelle);
      } else if (this.selectedQuartier && this.selectedQuartier !== "unknown") {
        const quartier = this.quartiers.find(
          (q) =>
            (q.id?.toString() || q.idQuartier?.toString()) ===
            this.selectedQuartier.toString()
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
          (a) =>
            (a.id?.toString() || a.idArrondissement?.toString()) ===
            this.selectedArrondissement.toString()
        );
        if (arrondissement) addressParts.push(arrondissement.libelle);
      }

      if (this.selectedCommune === "unknown" && this.form.communeLibelle) {
        addressParts.push(this.form.communeLibelle);
      } else if (this.selectedCommune && this.selectedCommune !== "unknown") {
        const commune = this.communes.find(
          (c) =>
            (c.id?.toString() || c.idCommune?.toString()) ===
            this.selectedCommune.toString()
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
          (d) =>
            (d.id?.toString() || d.idDepartement?.toString()) ===
            this.selectedDepartement.toString()
        );
        if (departement) addressParts.push(departement.libelle);
      }

      if (this.selectedPays) {
        const pays = this.pays.find(
          (p) => p.id.toString() === this.selectedPays.toString()
        );
        if (pays) addressParts.push(pays.libelle);
      }

      this.form.adresse = addressParts.join(", ");
      // console.log("Voici mon adresse mise a jours", this.form.adresse);
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

    // 🗺️ Géocodage d'adresse (optionnel)
    async geocodeAddress() {
      if (!this.form.adresse?.trim()) {
        ElMessage.warning("Veuillez saisir une adresse");
        return;
      }

      this.geocodingLoading = true;

      try {
        // Utilisation de l'API Nominatim d'OpenStreetMap (gratuite)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            this.form.adresse
          )}&limit=1`
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la recherche");
        }

        const data = await response.json();

        if (data.length > 0) {
          this.form.latitude = parseFloat(parseFloat(data[0].lat).toFixed(6));
          this.form.longitude = parseFloat(parseFloat(data[0].lon).toFixed(6));
          ElMessage.success("Coordonnées trouvées pour cette adresse");
        } else {
          ElMessage.warning("Aucune coordonnée trouvée pour cette adresse");
        }
      } catch (error) {
        console.error("Erreur géocodage:", error);
        ElMessage.error("Erreur lors de la recherche des coordonnées");
      } finally {
        this.geocodingLoading = false;
      }
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
          this.form.arrondissement = null;
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
