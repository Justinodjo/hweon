// utils/stepOneUtils.js
import { API_URLS } from "@/config/api";
/**
 * Détermine le type de fichier selon l'étape
 */
export function getFileTypeByStep(currentStep) {
  switch (currentStep) {
    case 0:
      return "BiensImmobiliers";
    case 2:
      return "DetailsBiensImmobiliers";
    default:
      return "autre";
  }
}

/**
 * Met à jour la liste des fichiers dans le form principal (BiensImmobiliers)
 */
export function updateFormFiles(form, files) {
  return { ...form, fichier: files };
}

export const getImageUrl = (idfile) => {
  return `${API_URLS.API_BASE}/fichier/download/${idfile}`;
};
