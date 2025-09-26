<template>
    <div class="dropzone-container">
        <!-- Conteneur Dropzone -->
        <div ref="dropzoneElement" class="dropzone"></div>

        <!-- Aperçu des fichiers uploadés -->
        <div v-if="uploadedFilesList.length" class="uploaded-files mt-3">
            <div class="row g-2">
                <div v-for="(file, index) in uploadedFilesList" :key="`uploaded-${index}`"
                    class="col-auto position-relative">
                    <!-- Image prévisualisée -->
                    <img :src="file.previewUrl || file.url" alt="Image uploadée"
                        class="img-thumbnail uploaded-preview" />

                    <!-- Bouton de suppression -->
                    <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 remove-file-btn"
                        @click="removeFile(index)" title="Supprimer ce fichier">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import Dropzone from "dropzone";
import 'dropzone/dist/dropzone.css';
import { ElMessage } from "element-plus";
import { getToken } from "@/helpers/auth";
import { API_URLS } from "@/config/api";
import { handleUploadResponseUnified } from "@/utils/formUtils";
import { getImageUrl } from "@/utils/fileUtils";
import {
    resizeImage,
    getFileTypeByStep,
    getFilePreviewUrl,
} from "@/utils/dropzoneUtils";

export default {
    name: "DropzoneUpload",
    props: { preview: Object, uploadConfig: Object, maxFiles: Number, activeStep: Number, index: Number, form: Object },

    data() { return { dropzoneInstance: null, uploadedFiles: new Set(), uploadedFilesList: [] }; },
    emits: ['file-preprocessed', 'file-uploaded', 'update:fichiers'],
    mounted() {
        const self = this;
        Dropzone.autoDiscover = false;
        const dzEl = this.$refs.dropzoneElement;
        if (dzEl && !dzEl.dropzone) {
            this.dropzoneInstance = new Dropzone(dzEl, {
                url: API_URLS.ADD_FICHIER,
                maxFiles: this.maxFiles,
                thumbnailWidth: 150,
                thumbnailHeight: 150,
                headers: { "Authorization": `Bearer ${getToken()}` },
                init: function () {
                    this.on("addedfile", async (file) => {
                        try {
                            const resizedFile = await resizeImage(file);
                            if (!self.uploadedFiles.has(resizedFile.name)) {
                                const typeFichier = getFileTypeByStep(self.activeStep);
                                resizedFile.typeFichier = typeFichier;
                                self.uploadedFiles.add(resizedFile.name);

                                const previewImg = file.previewElement?.querySelector("img");
                                if (previewImg) previewImg.src = resizedFile.dataURL;

                                self.$emit("file-preprocessed", {
                                    file: resizedFile,
                                    typeFichier,
                                    detailIndex: self.index
                                });
                            }
                        } catch (err) {
                            ElMessage({ showClose: true, message: `Erreur redimensionnement : ${err}`, type: "error" });
                        }
                    });

                    this.on("success", async (file, response) => {
                        console.log("Dropzone success - response:", response);
                        console.log("Dropzone success - activeStep:", self.activeStep);
                        console.log("Dropzone success - index:", self.index);
                        // Harmonisation avec FilePond
                        const fileType = getFileTypeByStep(self.activeStep);
                        const uploadedFile = handleUploadResponseUnified(
                            self.form,           // form
                            response,            // response
                            fileType,           // fileType
                            true,               // multiple
                            self.index          // detailIndex
                        );
                        if (!uploadedFile) {
                            console.warn("Le backend n'a pas encore renvoyé d'id. Upload incomplet.");
                            return; // ne rien faire tant que l'id n'est pas disponible
                        }
                        console.log("Dropzone success - uploadedFile:", uploadedFile);
                        if (uploadedFile) {
                            const fileObj = uploadedFile.file || uploadedFile;
                            const typeFichier = fileObj.typeFichier || getFileTypeByStep(self.activeStep);

                            self.$emit("uploadResponse", {
                                file: fileObj,
                                type: typeFichier,
                                multiple: true,
                                detailIndex: self.index ?? null,
                            });
                        }

                        // Prévisualisation (optionnel)
                        const previewUrl = getImageUrl(response.id);
                        self.uploadedFilesList.push({
                            ...uploadedFile,
                            previewUrl
                        });
                        self.$emit("update:fichiers", self.uploadedFilesList);

                        ElMessage({ showClose: true, message: "Fichier uploadé avec succès !", type: "success" });
                    });

                    this.on("error", (file, errorMessage) => {
                        ElMessage({ showClose: true, message: `Erreur upload : ${errorMessage}`, type: "error" });
                    });
                }
            });
        }
    },
    methods: {
        getFilePreviewUrl, // expose la fonction utilitaire pour le template

        removeFile(index) {
            const removed = this.uploadedFilesList.splice(index, 1)[0];
            if (removed) {
                this.uploadedFiles.delete(removed.name); // retire du Set
            }
            this.$emit("update:fichiers", this.uploadedFilesList);
        }
    },
    beforeUnmount() {
        if (this.dropzoneInstance) {
            this.dropzoneInstance.destroy();
            this.dropzoneInstance = null;
        }
    }
};
</script>


<style scoped>
.dropzone {
    border: 2px dashed #007bff;
    padding: 20px;
    text-align: center;
}

.dropzone-container {
    margin-top: 20px;
}

.dropzone {
    border: 2px dashed #007bff;
    padding: 30px;
    border-radius: 10px;
    background: #f8f9fa;
    cursor: pointer;
}

.dz-message {
    font-size: 16px;
    color: #6c757d;
}

.dz-preview .dz-image img {
    border-radius: 8px;
    object-fit: cover;
}

.uploaded-preview {
    width: 100px;
    height: 80px;
    object-fit: cover;
    border-radius: 5px;
}

.remove-file-btn {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
