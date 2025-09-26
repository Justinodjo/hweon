// utils/fileUtils.js
import { API_URLS } from "@/config/api";

/**
 * Retourne le type de fichier en fonction de l'étape
 */
export function getFileTypeByStep(currentStep) {
  switch (currentStep) {
    case 0:
      return "biensImmobiliers";
    case 2:
      return "detailsBiensImmobiliers";
    default:
      return "autre";
  }
}

/**
 * Normalisation d'un fichier
 */
export function formatFile(file) {
  return {
    id: file.id,
    url: file.url,
    nom: file.nom || file.name,
    originalName: file.originalName,
    taille: file.taille,
    contentType: file.contentType,
    typeFichier: file.typeFichier || null,
  };
}

/**
 * Gère les fichiers du form principal (BiensImmobiliers)
 */
export function updateFormFiles(form, files) {
  return { ...form, fichier: files.map(formatFile) };
}

/**
 * Ajoute un fichier dans les détails (DetailsBiensImmobiliers)
 */
export function addFileToDetail(details, index, newFile) {
  const updated = [...details];
  const files = updated[index].fichiers || [];
  updated[index].fichiers = [...files, formatFile(newFile)];
  return updated;
}

/**
 * Supprime un fichier dans les détails
 */
export function removeFileFromDetail(details, index, fileIndex) {
  const updated = [...details];
  updated[index].fichiers.splice(fileIndex, 1);
  return updated;
}

/**
 * Supprime un fichier du form principal
 */
export function removeFileFromForm(files, fileIndex) {
  return files.filter((_, i) => i !== fileIndex);
}

/**
 * URL pour télécharger un fichier
 */
export const getImageUrl = (idfile) => {
  return `${API_URLS.API_BASE}/fichier/download/${idfile}`;
};
