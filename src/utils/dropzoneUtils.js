// utils/dropzoneUtils.js
import { API_URLS } from "@/config/api";
import { getToken } from "@/helpers/auth";

/**
 * Redimensionne une image en DataURL et retourne un objet File
 */
export function resizeImage(file, maxWidth = 800, maxHeight = 600) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob)
              return reject("Erreur lors de la conversion de l'image.");
            const resizedFile = new File([blob], file.name, {
              type: blob.type,
              lastModified: Date.now(),
            });
            resizedFile.dataURL = canvas.toDataURL(); // Pour prévisualisation
            resolve(resizedFile);
          },
          "image/jpeg",
          0.9
        );
      };
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Retourne l'URL prévisualisation sécurisée d'un fichier
 */
export async function getFilePreviewUrl(fileId) {
  try {
    const response = await fetch(
      `${API_URLS.API_BASE}/fichier/download/${fileId}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error("Erreur récupération preview :", err);
    return ""; // image vide si erreur
  }
}

/**
 * Retourne le type de fichier selon l'étape active
 */
export function getFileTypeByStep(activeStep) {
  console.log("getFileTypeByStep - activeStep:", activeStep);
  switch (activeStep) {
    case 0:
      return "BiensImmobiliers";
    case 2:
      return "DetailsBiensImmobiliers";
    default:
      return "autre";
  }
}
