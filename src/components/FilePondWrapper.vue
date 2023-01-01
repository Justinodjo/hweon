<template>
    <div v-if="form" class="file-pond-wrapper">
        <FilePond ref="filePond" name="file" :server="getConfig()" accepted-file-types="image/*"
            label-idle="Déposez votre image ou cliquez pour sélectionner" maxFileSize="5MB"
            :files="getFilesForFilePond()" @processfile="handleFileUploadResponse"
            @processfileerror="handleFileUploadError" :imageResizeTargetWidth="800" :imageResizeTargetHeight="600"
            :imageResizeMode="'cover'" :imageResizeUpscale="false" class="mb-3" />
        <small class="text-muted">
            Vous ne pouvez télécharger qu'une seule image de couverture.
        </small>
    </div>
</template>


<script>
import { FilePond } from "@/utils/filepondSetup";
import { getFilePondConfig, parseServerResponse, buildFileWithType } from "@/utils/filepondUtils";
import { getImageUrl } from "@/utils/fileUtils";
import { getUploadConfig } from "@/utils/formUtils";
export default {
    name: "FilePondWrapper",
    components: { FilePond },
    props: { uploadConfig: Object, preview: Object, activeStep: Number, index: Number, form: Object, },
    emits: ["uploadResponse", "update:form"],
    computed: {
        coverUrl() { return this.preview.coverUrl || ""; }
    },
    methods: {
        // CORRECTION CRITIQUE: Nouvelle méthode getConfig
        getConfig() {
            const fileType = this.activeStep === 0 || this.activeStep === 2
                ? "BiensImmobiliers"
                : "DetailsBiensImmobiliers";

            console.log("FilePond getConfig:", {
                form: !!this.form,
                fileType,
                index: this.index,
                activeStep: this.activeStep
            });

            // CORRECTION: Passer directement les paramètres au lieu d'utiliser uploadConfig
            return getUploadConfig(
                this.activeStep,  // activeStep (obligatoire en premier)
                this.form,        // form
                fileType,         // fileType
                false,            // multiple (false = image de couverture)
                this.index        // detailIndex
            );
        },

        handleFileUploadResponse(error, file) {
            if (error) {
                console.error("Erreur de traitement :", error);
                return;
            }
            console.log("FilePond - Response:", file);
            console.log("FilePond - ServerId:", file.serverId);
            const parsed = parseServerResponse(file);
            console.log("PARSED RESPONSE:", parsed);
            if (!parsed) return;

            // Vérifier que le backend a renvoyé un id
            if (!parsed || !parsed.id) {
                console.warn("Le backend n'a pas encore renvoyé l'id, attendre la sauvegarde...");
                return; // ne rien faire pour l'instant
            }
            // CORRECTION 5: Déterminer le type de fichier correctement
            const fileType = this.activeStep === 0 || this.activeStep === 2
                ? "BiensImmobiliers"
                : "DetailsBiensImmobiliers";
            // Construire le fichier
            const fileWithType = {
                file: {
                    id: parsed.id,
                    nom: parsed.nom || parsed.name || `file_${Date.now()}`,
                    url: getImageUrl(parsed.id),
                    typeFichier: fileType,
                    taille: parsed.taille || parsed.size || 0,
                    extension: parsed.extension || parsed.ext || ''
                },
                type: fileType
            };

            // Éviter doublons
            const existingFiles = Array.isArray(this.form.fichier) ? this.form.fichier.filter(f => f.id !== fileWithType.id) : [];
            this.$emit("update:form", { ...this.form, fichier: [...existingFiles, fileWithType] });
            this.preview.coverUrl = fileWithType.url;
            console.log("FilePond - FileWithType:", fileWithType);
            if (!fileWithType) return;
            this.$emit("uploadResponse", {
                success: true,
                fileType: fileType,
                detailIndex: this.index,
                file: fileWithType.file
            });
            // Mettre à jour le preview avec l'URL serveur
            // Mettre à jour l'aperçu
            const previewUrl = getImageUrl(fileWithType.file.id);
            this.preview.coverUrl = previewUrl;
            // Mettre à jour l'aperçu global
            this.preview.coverUrl = fileWithType.file.url;
        },
        getFilesForFilePond() {
            console.log("getFilesForFilePond - form:", !!this.form);

            if (!this.form) {
                console.warn("FilePond: form is null");
                return [];
            }

            const fileType = this.activeStep === 0 || this.activeStep === 2
                ? "BiensImmobiliers"
                : "DetailsBiensImmobiliers";
            if (fileType === "BiensImmobiliers") {
                // Pour l'image de couverture, utiliser form.fichier[0]
                if (Array.isArray(this.form.fichier) && this.form.fichier[0]?.id) {
                    return [{ source: this.form.fichier[0].id, options: { type: 'limbo' } }];
                }
                return [];
            } else {
                // Pour les détails
                if (this.form.detailsBiensImmobiliers?.[this.index]?.fichier?.length > 0) {
                    return [{
                        source: this.form.detailsBiensImmobiliers[this.index].fichier[0].id,
                        options: { type: 'limbo' }
                    }];
                }
                return [];
            }

        },

        handleFileUploadError(error) { console.error("Erreur lors du traitement :", error); }
    }
};
</script>


<style scoped>
.cover-img-preview {
    max-width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
}

.cover-img-preview-container {
    margin-top: 10px;
}
</style>
