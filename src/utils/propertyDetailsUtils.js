// utils/propertyDetailsUtils.js

/**
 * Crée un nouvel objet détail avec valeurs par défaut
 */
export function createNewDetail(type = "", label = "") {
  const detail = {
    typeDetailsBiens: type,
    nombre: 1,
    nomdetails: label,
    description: "",
    prix: null,
    status: true,
    fichier: null,
    fichiers: [],
    chargeMensuel: null,
    taxeFonciereAnnuelle: null,
    observations: "",
    sousDetailsBiensImmobiliers: [],
  };

  // Ajouter des sous-détails par défaut pour certains types
  if (["CAVE", "SOUS_SOL", "GARAGE"].includes(type)) {
    detail.sousDetailsBiensImmobiliers.push({
      anneeConstruction: null,
      nombreEtages: null,
      etatGeneral: "",
      description: "",
      superficie: null,
      caracteristiques: [],
    });
  }

  return detail;
}

export function addFileToDetail(details, detailIndex, file) {
  const updatedDetails = [...details];
  if (!Array.isArray(updatedDetails[detailIndex].fichiers)) {
    updatedDetails[detailIndex].fichiers = [];
  }
  updatedDetails[detailIndex].fichiers.push(file);
  return updatedDetails;
}

export function removeFileFromDetail(details, detailIndex, fileIndex) {
  const updatedDetails = [...details];
  if (
    updatedDetails[detailIndex] &&
    Array.isArray(updatedDetails[detailIndex].fichiers)
  ) {
    updatedDetails[detailIndex].fichiers.splice(fileIndex, 1);
  }
  return updatedDetails;
}

/* ------------------------------------------------------------------ */
/* Fichiers du bien principal (StepOne.vue) */
/* ------------------------------------------------------------------ */
/* ⚠️ Ces fonctions ne sont utilisées que pour les fichiers du bien principal.
   Pour les fichiers des détails, utiliser addFileToDetail / removeFileFromDetail */

/**
 * Ajoute un fichier au bien principal
 */
export function addFileToBien(form, file) {
  const updatedForm = { ...form };
  if (!Array.isArray(updatedForm.fichiers)) {
    updatedForm.fichiers = [];
  }
  updatedForm.fichiers.push(file);
  return updatedForm;
}

/**
 * Supprime un fichier du bien principal
 */
export function removeFileFromBien(form, fileIndex) {
  const updatedForm = { ...form };
  if (Array.isArray(updatedForm.fichiers)) {
    updatedForm.fichiers.splice(fileIndex, 1);
  }
  return updatedForm;
}
