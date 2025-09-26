/**
 * Génère la configuration FilePond avec éventuellement un index
 */
export function getFilePondConfig(uploadConfig, index) {
  const config = { ...uploadConfig };
  config.process = {
    ...config.process,
    ondata: (formData) => {
      if (index !== undefined) formData.append("detailIndex", index);
      return formData;
    },
  };
  return config;
}

/**
 * Parse la réponse du serveur et retourne un objet JSON
 * Fonction robuste : gère string ou déjà objet
 */
export function parseServerResponse(file) {
  if (!file?.serverId) return null;
  try {
    // Si c'est déjà un objet, retourne tel quel
    if (typeof file.serverId === "object") return file.serverId;
    // Sinon, parse la string JSON
    return JSON.parse(file.serverId);
  } catch (err) {
    console.error("Erreur JSON:", err, file.serverId);
    return null;
  }
}

/**
 * Retourne le type de fichier selon l'étape active
 */
export function getFileTypeByStep(step) {
  switch (step) {
    case 0:
      return "BiensImmobiliers";
    case 2:
      return "DetailsBiensImmobiliers";
    default:
      return "autre";
  }
}

/**
 * Crée l'objet final à émettre après upload
 */
export function buildFileWithType(parsed, step, index) {
  if (!parsed) return null;
  return {
    file: {
      id: parsed.id,
      url: parsed.url,
      nom: parsed.nom,
      originalName: parsed.originalName,
      taille: parsed.taille,
      contentType: parsed.contentType,
      typeFichier: getFileTypeByStep(step),
      detailIndex: index ?? null,
    },
  };
}
