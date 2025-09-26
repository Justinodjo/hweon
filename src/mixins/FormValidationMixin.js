// mixins/FormValidationMixin.js
export default {
  computed: {
    /**
     * Valide l'étape 1 (informations de base)
     */
    isStepOneValid() {
      return !!(
        this.form.nom?.trim() &&
        this.form.adresse?.trim() &&
        this.form.typeBiensImmobiliereId
      );
    },

    /**
     * Valide l'étape 2 (détails du bien)
     */
    isStepTwoValid() {
      // La validation de l'étape 2 est généralement optionnelle
      // mais on peut vérifier certains champs si nécessaire
      return true;
    },

    /**
     * Valide l'étape 3 (images et confirmation)
     */
    isStepThreeValid() {
      return true;
    },

    /**
     * Validation complète du formulaire
     */
    isFormValid() {
      return (
        this.isStepOneValid && this.isStepTwoValid && this.isStepThreeValid
      );
    },
  },

  methods: {
    /**
     * Valide un champ spécifique
     * @param {string} field - Le nom du champ à valider
     * @param {*} value - La valeur à valider
     * @returns {Object} Objet avec isValid et message d'erreur
     */
    validateField(field, value) {
      const validators = {
        nom: (val) => ({
          isValid: val && val.trim().length >= 2,
          message: "Le nom doit contenir au moins 2 caractères",
        }),

        prix: (val) => ({
          isValid: val && !isNaN(val) && parseFloat(val) > 0,
          message: "Le prix doit être un nombre positif",
        }),

        superficie: (val) => ({
          isValid: val && !isNaN(val) && parseFloat(val) > 0,
          message: "La superficie doit être un nombre positif",
        }),

        adresse: (val) => ({
          isValid: val && val.trim().length >= 5,
          message: "L'adresse doit contenir au moins 5 caractères",
        }),

        typeBiensImmobiliereId: (val) => ({
          isValid: !!val,
          message: "Veuillez sélectionner un type de bien",
        }),

        latitude: (val) => ({
          isValid: !val || (val >= -90 && val <= 90),
          message: "La latitude doit être comprise entre -90 et 90",
        }),

        longitude: (val) => ({
          isValid: !val || (val >= -180 && val <= 180),
          message: "La longitude doit être comprise entre -180 et 180",
        }),

        email: (val) => ({
          isValid: !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
          message: "Format d'email invalide",
        }),

        telephone: (val) => ({
          isValid: !val || /^[\d\s\+\-\(\)]{8,}$/.test(val),
          message: "Format de téléphone invalide",
        }),

        anneeConstruction: (val) => {
          const currentYear = new Date().getFullYear();
          return {
            isValid: !val || (val >= 1800 && val <= currentYear),
            message: `L'année doit être comprise entre 1800 et ${currentYear}`,
          };
        },
      };

      if (validators[field]) {
        return validators[field](value);
      }

      return { isValid: true, message: "" };
    },

    /**
     * Valide plusieurs champs en une fois
     * @param {Object} fields - Objet avec les champs à valider {fieldName: value}
     * @returns {Object} Résultat de validation avec erreurs
     */
    validateFields(fields) {
      const errors = {};
      let isValid = true;

      for (const [fieldName, value] of Object.entries(fields)) {
        const validation = this.validateField(fieldName, value);
        if (!validation.isValid) {
          errors[fieldName] = validation.message;
          isValid = false;
        }
      }

      return {
        isValid,
        errors,
      };
    },

    /**
     * Valide les coordonnées GPS
     * @param {number} latitude
     * @param {number} longitude
     * @returns {Object} Résultat de validation
     */
    validateCoordinates(latitude, longitude) {
      const errors = [];

      if (latitude !== null && latitude !== undefined) {
        if (isNaN(latitude) || latitude < -90 || latitude > 90) {
          errors.push("La latitude doit être comprise entre -90 et 90");
        }
      }

      if (longitude !== null && longitude !== undefined) {
        if (isNaN(longitude) || longitude < -180 || longitude > 180) {
          errors.push("La longitude doit être comprise entre -180 et 180");
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
      };
    },

    /**
     * Valide les détails du bien immobilier
     * @param {Array} details - Liste des détails à valider
     * @returns {Object} Résultat de validation
     */
    validatePropertyDetails(details) {
      if (!Array.isArray(details)) {
        return { isValid: true, errors: [] };
      }

      const errors = [];

      details.forEach((detail, index) => {
        if (!detail.typeDetailsBiens) {
          errors.push(`Type de pièce manquant pour l'élément ${index + 1}`);
        }

        if (!detail.nombre || detail.nombre < 1) {
          errors.push(`Nombre invalide pour l'élément ${index + 1}`);
        }

        if (!detail.nomdetails?.trim()) {
          errors.push(`Nom/Description manquant pour l'élément ${index + 1}`);
        }
      });

      return {
        isValid: errors.length === 0,
        errors,
      };
    },

    /**
     * Nettoie et formate les données du formulaire
     * @param {Object} formData - Données du formulaire
     * @returns {Object} Données nettoyées
     */
    sanitizeFormData(formData) {
      const cleaned = { ...formData };

      // Nettoyer les chaînes de caractères
      const stringFields = [
        "nom",
        "adresse",
        "description",
        "observations",
        "autresEquipements",
      ];
      stringFields.forEach((field) => {
        if (cleaned[field]) {
          cleaned[field] = cleaned[field].trim();
        }
      });

      // Convertir les nombres
      const numberFields = [
        "prix",
        "superficie",
        "latitude",
        "longitude",
        "anneeConstruction",
        "nombreEtages",
      ];
      numberFields.forEach((field) => {
        if (
          cleaned[field] !== null &&
          cleaned[field] !== undefined &&
          cleaned[field] !== ""
        ) {
          cleaned[field] = parseFloat(cleaned[field]);
        }
      });

      // Nettoyer les détails
      if (Array.isArray(cleaned.detailsBiensImmobiliers)) {
        cleaned.detailsBiensImmobiliers = cleaned.detailsBiensImmobiliers.map(
          (detail) => ({
            ...detail,
            nomdetails: detail.nomdetails?.trim() || "",
            description: detail.description?.trim() || "",
            nombre: parseInt(detail.nombre) || 1,
            prix: detail.prix ? parseFloat(detail.prix) : null,
          })
        );
      }

      return cleaned;
    },

    /**
     * Affiche les erreurs de validation
     * @param {Object} validationResult - Résultat de validateFields
     */
    displayValidationErrors(validationResult) {
      if (!validationResult.isValid && validationResult.errors) {
        const errorMessages = Object.values(validationResult.errors);
        if (errorMessages.length > 0) {
          ElMessage.error(errorMessages[0]); // Afficher la première erreur
        }
      }
    },
  },
};
