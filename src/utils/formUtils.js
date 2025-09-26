// utils/formUtils.js
import { ElMessage } from "element-plus";
import { API_URLS } from "@/config/api";
import { getToken } from "@/helpers/auth";
import { getImageUrl } from "@/utils/fileUtils";
// =========================
// Payload du formulaire
// =========================
export function buildEquipementsPayload(form) {
  const eq = form.equipements || {};
  return {
    services: eq.services || [],
    securite: eq.securite || [],
    activites: eq.activites || [],
    modesPaiement: eq.modesPaiement || [],
    languesPersonnel: eq.languesPersonnel || [],
    typeCuisine: eq.typeCuisine || [],
    typesClimatisation: eq.typesClimatisation || [],
    typeGarage: eq.typeGarage || [],
    typeVue: eq.typeVue || [],
    typeRevetement: eq.typeRevetement || [],
    autres: eq.autres || "",
  };
}

export function buildSubmissionData(form, userId, options = {}) {
  const {
    services = [],
    securites = [],
    activites = [],
    modesPaiement = [],
    languesPersonnel = [],
    typeCuisine = [],
    typesClimatisation = [],
    typeGarage = [],
    typeVue = [],
  } = options;

  return {
    nom: form.nom,
    adresse: form.adresse,
    prix: form.prix,
    superficie: form.superficie,
    uniteSurface: form.uniteSurface,
    latitude: form.latitude,
    longitude: form.longitude,
    description: form.description,
    status: form.status,
    aVendre: form.aVendre,
    typeUnite: form.typeUnite,
    typeBiensImmobiliere: { id: form.typeBiensImmobiliereId },
    departement:
      form.departementId === "unknown"
        ? { libelle: form.departementLibelle }
        : { idDepartement: form.departementId },
    commune:
      form.communeId === "unknown"
        ? { libelle: form.communeLibelle }
        : { idCommune: form.communeId },
    arrondissement:
      form.arrondissementId === "unknown"
        ? { libelle: form.arrondissementLibelle }
        : { idArrondissement: form.arrondissementId },
    detailsBiensImmobiliers: Array.isArray(form.detailsBiensImmobiliers)
      ? form.detailsBiensImmobiliers.map((detail) => ({
          typeDetailsBiens: detail.typeDetailsBiens,
          nombre: detail.nombre,
          nomdetails: detail.nomdetails,
          description: detail.description,
          prix: detail.prix,
          status: detail.status,
          observations: detail.observations,
          taxeFonciereAnnuelle: detail.taxeFonciereAnnuelle,
          typeDPE: detail.typeDPE,
          sousDetailsBiensImmobiliers: Array.isArray(
            detail.sousDetailsBiensImmobiliers
          )
            ? detail.sousDetailsBiensImmobiliers.map((sousDetail) => ({
                typeSousDetailsBiens: sousDetail.typeSousDetailsBiens,
                nombre: sousDetail.nombre,
                description: sousDetail.description,
                etatGeneral: sousDetail.etatGeneral,
              }))
            : [],
          // CORRECTION 6: S'assurer que les fichiers sont correctement mappés
          fichier: Array.isArray(detail.fichier)
            ? detail.fichier[0] || null
            : detail.fichier || null,
          fichiers: Array.isArray(detail.fichiers) ? detail.fichiers : [],
        }))
      : [],
    equipements: buildEquipementsPayload(
      form,
      services,
      securites,
      activites,
      modesPaiement,
      languesPersonnel,
      typeCuisine,
      typesClimatisation,
      typeGarage,
      typeVue
    ),
    fichier: form.fichier.length > 0 ? form.fichier[0] : null,
    fichiers: form.fichiers.length > 0 ? form.fichiers : [],
    userInfo: { id: userId },
  };
}

// =========================
// Gestion upload de fichiers
// =========================
export function handleUploadResponseUnified(
  form,
  response,
  fileType,
  multiple = true,
  detailIndex = 0
) {
  // VÉRIFICATION CRITIQUE en premier
  console.log("handleUploadResponseUnified called with:", {
    form: !!form,
    response: !!response,
    fileType,
    multiple,
    detailIndex,
  });
  if (!fileType) {
    console.warn("handleUploadResponseUnified: fileType est undefined !");
  }
  if (!form) {
    console.error("handleUploadResponseUnified: form is undefined!");
    ElMessage.error("Erreur: formulaire non disponible pour l'upload");
    return null;
  }

  if (!response) {
    console.error("handleUploadResponseUnified: response is undefined!");
    return null;
  }
  let parsed;
  try {
    console.log("Réponse brute du serveur :", response);
    parsed = typeof response === "string" ? JSON.parse(response) : response;
  } catch (err) {
    console.error("Erreur parsing upload :", err, response);
    return null;
  }
  console.log("Parsed file id:", parsed.id);
  if (!parsed.id) {
    console.error(
      "Le champ 'id' est manquant dans la réponse du serveur:",
      parsed
    );
    return null;
  }
  const file = normalizeFile(parsed, fileType);
  if (!file) return null;

  if (!file.id) {
    console.error("handleUploadResponseUnified: file.id is missing");
    return null;
  }
  console.log("handleUploadResponseUnified - constructed file:", file);
  // ========================
  // === BiensImmobiliers ===
  // ========================
  function addFileToArray(array, file) {
    if (!array.find((f) => f.id === file.id)) array.push(file);
  }
  if (fileType === "BiensImmobiliers") {
    if (multiple) addFileToArray(form.fichiers, file);
    else form.fichier = [file];
  } // ==============================
  // === DetailsBiensImmobiliers ===
  // ==============================
  else if (fileType === "DetailsBiensImmobiliers") {
    const detail = ensureDetailStructure(form, detailIndex);

    if (!detail) {
      console.error(
        "handleUploadResponseUnified: unable to create detail structure"
      );
      return null;
    }

    if (multiple) {
      detail.fichiers.push(file);
      console.log(
        `Added to detail[${detailIndex}].fichiers:`,
        detail.fichiers.length
      );
    } else {
      detail.fichier = [file];
      console.log(`Set detail[${detailIndex}].fichier:`, detail.fichier);
    }
  }

  console.log("handleUploadResponseUnified - form après mise à jour:", {
    fichier: form.fichier?.length || 0,
    fichiers: form.fichiers?.length || 0,
    detailsCount: form.detailsBiensImmobiliers?.length || 0,
  });

  ElMessage.success("Image uploadée avec succès");
  return file;
}

// Configuration de Filestack / FilePond
export function getUploadConfig(
  activeStep,
  form,
  fileType,
  multiple = true,
  detailIndex = 0
) {
  console.log("getUploadConfig called with:", {
    form: !!form,
    fileType,
    multiple,
    detailIndex,
  });
  return {
    url: API_URLS.ADD_FICHIER,
    process: {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      withCredentials: false,
      onload: (response) => {
        console.log("getUploadConfig onload - form:", !!form);
        console.log("getUploadConfig onload - response:", response);

        // CORRECTION CRITIQUE: Vérifier que form existe
        if (!form) {
          console.error("getUploadConfig onload - form is undefined!");
          ElMessage.error("Erreur: formulaire non disponible");
          return null;
        }
        let parsed;
        try {
          parsed =
            typeof response === "string" ? JSON.parse(response) : response;
        } catch (e) {
          console.error("Erreur parsing réponse upload:", e, response);
          ElMessage.error("Réponse serveur invalide");
          return null;
        }

        if (!parsed || !parsed.id) {
          console.error("Réponse invalide du serveur :", parsed);
          ElMessage.error("Réponse inattendue du serveur.");
          return null;
        }

        const result = handleUploadResponseUnified(
          form,
          parsed,
          fileType,
          multiple,
          detailIndex
        );
        // ✅ FilePond attend que onload retourne un JSON (stringifié) ou un id
        if (!result) return null;
        // ✅ FilePond attend un JSON stringifié ou un id
        return JSON.stringify(result);
      },
      onerror: (error) => {
        console.error("Erreur d'upload:", error);
        ElMessage.error("Erreur lors de l'upload du fichier.");
      },
    },
  };
}
// 3. CORRECTION dans ensureDetailStructure
function ensureDetailStructure(form, detailIndex) {
  console.log("ensureDetailStructure:", {
    detailIndex,
    currentLength: form.detailsBiensImmobiliers?.length,
  });

  if (!form.detailsBiensImmobiliers) {
    form.detailsBiensImmobiliers = [];
  }

  if (!Array.isArray(form.detailsBiensImmobiliers)) {
    console.warn("detailsBiensImmobiliers is not an array, resetting");
    form.detailsBiensImmobiliers = [];
  }

  // Valider detailIndex
  if (detailIndex < 0) {
    console.warn("detailIndex is negative, using 0");
    detailIndex = 0;
  }

  while (form.detailsBiensImmobiliers.length <= detailIndex) {
    form.detailsBiensImmobiliers.push({
      typeDetailsBiens: null,
      nombre: 0,
      nomdetails: "",
      description: "",
      prix: null,
      status: true,
      observations: "",
      taxeFonciereAnnuelle: null,
      typeDPE: null,
      sousDetailsBiensImmobiliers: [],
      fichier: [],
      fichiers: [],
    });
    console.log(
      "Created detail at index:",
      form.detailsBiensImmobiliers.length - 1
    );
  }

  const detail = form.detailsBiensImmobiliers[detailIndex];

  if (!detail) {
    console.error("Failed to get detail at index:", detailIndex);
    return null;
  }

  // Sécuriser les tableaux
  if (!Array.isArray(detail.fichier)) detail.fichier = [];
  if (!Array.isArray(detail.fichiers)) detail.fichiers = [];

  return detail;
}

// =========================
// Géolocalisation
// =========================
export function getCurrentLocation(form, setStatus) {
  setStatus({ loadingGeolocation: true, geolocationStatus: "loading" });

  navigator.geolocation.getCurrentPosition(
    (position) => {
      form.latitude = position.coords.latitude;
      form.longitude = position.coords.longitude;
      setStatus({ loadingGeolocation: false, geolocationStatus: "success" });
    },
    (error) => {
      setStatus({
        loadingGeolocation: false,
        geolocationStatus: "error",
        geolocationError: error.message,
      });
    }
  );
}

// =========================
// Normalisation d'un fichier uploadé
// =========================
function normalizeFile(parsed, fileType) {
  if (!parsed || !parsed.id) {
    console.error("normalizeFile: fichier invalide, skipped", parsed);
    return null; // NE PAS CRÉER d'objet fallback avec id undefined
  }

  return {
    id: parsed.id,
    nom: parsed.nom || parsed.name || `file_${Date.now()}`,
    url: parsed.url || parsed.path || getImageUrl(parsed.id), // fallback automatique
    typeFichier: fileType || "autre",
    taille: parsed.taille || parsed.size || 0,
    extension: parsed.extension || parsed.ext || "",
    originalName: parsed.originalName || parsed.nom,
    contentType: parsed.contentType || "image/jpeg", // valeur par défaut
  };
}
