<template>
    <div class="mb-3">
        <!-- Informations de base -->
        <div class="card mb-4">
            <div class="card-header">
                <h6>Informations de base</h6>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">Nom du bien *</label>
                    <input type="text" class="form-control" :value="form.nom"
                        @input="updateForm('nom', $event.target.value)" placeholder="Nom du bien..." />
                </div>

                <div class="mb-3">
                    <label class="form-label">Type de bien *</label>
                    <select class="form-select" :value="form.typeBiensImmobiliereId"
                        @change="updateForm('typeBiensImmobiliereId', $event.target.value)">
                        <option value="">Sélectionnez un type</option>
                        <option v-for="t in typesBien" :key="t.id" :value="t.id">
                            {{ t.nomTypeBiensImmo }}
                        </option>
                    </select>
                </div>

                <div class="row g-3 mb-3">
                    <div class="col-md-6" v-if="isAgricole">
                        <label class="form-label">Prix *</label>
                        <input type="number" class="form-control" :value="form.prix"
                            @input="updateForm('prix', $event.target.value)" min="0" />
                    </div>

                    <div class="col-md-6" v-if="isAgricole">
                        <label class="form-label">Superficie *</label>
                        <input type="number" class="form-control" :value="form.superficie"
                            @input="updateForm('superficie', $event.target.value)" min="0" />
                    </div>

                    <div class="col-md-6" v-if="isAgricole">
                        <label class="form-label">Unité de surface</label>
                        <select class="form-select" :value="form.uniteSurface"
                            @change="updateForm('uniteSurface', $event.target.value)">
                            <option value="">Sélectionnez</option>
                            <option v-for="u in uniteSurface" :key="u.key" :value="u.key">
                                {{ u.label }}
                            </option>
                        </select>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Type de location</label>
                        <select class="form-select" :value="form.typeUnite"
                            @change="updateForm('typeUnite', $event.target.value)">
                            <option value="">Unité</option>
                            <option v-for="u in typeUnite" :key="u.key" :value="u.key">
                                {{ u.label }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" :value="form.description"
                        @input="updateForm('description', $event.target.value)" rows="4"></textarea>
                </div>
            </div>
        </div>

        <!-- Localisation -->
        <GeographicSelector :selectedPays="selectedPays" :selectedDepartement="selectedDepartement"
            :selectedCommune="selectedCommune" :selectedArrondissement="selectedArrondissement"
            :selectedQuartier="selectedQuartier" :pays="pays" :departements="departements" :communes="communes"
            :arrondissements="arrondissements" :quartiers="quartiers" :adresse="form.adresse"
            @update:selectedPays="$emit('update:selectedPays', $event)"
            @update:selectedDepartement="$emit('update:selectedDepartement', $event)"
            @update:selectedCommune="$emit('update:selectedCommune', $event)"
            @update:selectedArrondissement="$emit('update:selectedArrondissement', $event)"
            @update:selectedQuartier="$emit('update:selectedQuartier', $event)" @paysChange="$emit('paysChange')"
            @departementChange="$emit('departementChange')" @communeChange="$emit('communeChange')"
            @arrondissementChange="$emit('arrondissementChange')" @quartierChange="$emit('quartierChange')"
            @geocodeAddress="$emit('geocodeAddress')" @updateAddresse="updateForm('adresse', $event)" />

        <GeolocationInput :latitude="form.latitude" :longitude="form.longitude" :loading="loading"
            :geolocationStatus="geolocationStatus" :geolocationError="geolocationError"
            @update:latitude="updateForm('latitude', $event)" @update:longitude="updateForm('longitude', $event)"
            @getCurrentLocation="$emit('getCurrentLocation')" />

        <!-- Image de couverture -->
        <div class="card mb-4">
            <div class="card-header">
                <h6>Image de couverture</h6>
            </div>
            <div class="card-body">
                <FilePondWrapper :form="form" :uploadConfig="uploadConfig" :preview="preview" :currentStep="currentStep"
                    :activeStep="activeStep" @uploadResponse="handleFileUploaded" />

                <!-- Autres images -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h6>Autres images</h6>
                    </div>
                    <div class="card-body">
                        <DropzoneUpload :form="form" :uploadConfig="uploadConfig" :preview="preview" :maxFiles="10"
                            :maxFileSize="'5MB'" @file-uploaded="handleFileUploaded" :initialFiles="fichiers"
                            :activeStep="activeStep" :currentStep="currentStep" />
                        <small class="text-muted">Vous pouvez télécharger jusqu'à 10 images supplémentaires.</small>
                    </div>
                </div>

                <div v-if="preview.coverUrl" class="mb-3">
                    <img :src="preview.coverUrl" class="img-thumbnail cover-img-preview" />
                </div>

                <div v-if="form.fichier && form.fichier.length" class="uploaded-files mt-4">
                    <h5>Fichiers uploadés :</h5>
                    <div class="d-flex flex-wrap gap-3">
                        <div v-for="(file, index) in form.fichier" :key="index" class="file-preview card p-2">
                            <img v-if="file.id" :src="getImageUrl(file.id)" alt="Aperçu" class="img-fluid rounded" />
                            <p class="text-truncate">{{ file.nom || file.name || 'Fichier' }}</p>
                            <button @click="removeFile(index)" class="btn btn-sm btn-danger w-100">Supprimer</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import GeographicSelector from '@/components/GeographicSelector.vue'
import GeolocationInput from '@/components/GeolocationInput.vue'
import DropzoneUpload from '@/components/DropzoneUpload.vue'
import FilePondWrapper from '@/components/FilePondWrapper.vue'
import { getFileTypeByStep, updateFormFiles, getImageUrl } from "@/utils/stepOneUtils";

export default {
    name: 'StepOne',
    components: { GeographicSelector, GeolocationInput, DropzoneUpload, FilePondWrapper },
    props: {
        form: Object,
        preview: { type: Object, default: () => ({ coverUrl: '' }) },
        fichiers: Array,
        typesBien: Array,
        uniteSurface: Array,
        typeUnite: Array,
        pays: Array,
        departements: Array,
        communes: Array,
        arrondissements: Array,
        quartiers: Array,
        selectedPays: [String, Number],
        selectedDepartement: [String, Number],
        selectedCommune: [String, Number],
        selectedArrondissement: [String, Number],
        selectedQuartier: [String, Number],
        uploadConfig: Object,
        loading: Boolean,
        geolocationStatus: String,
        geolocationError: String,
        currentStep: Number,
        activeStep: Number
    },
    emits: [
        'update:form', 'update:fichiers',
        'update:selectedPays', 'update:selectedDepartement', 'update:selectedCommune', 'update:selectedArrondissement', 'update:selectedQuartier',
        'paysChange', 'departementChange', 'communeChange', 'arrondissementChange', 'quartierChange',
        'geocodeAddress', 'getCurrentLocation', 'uploadResponse'
    ],
    computed: {
        selectedTypeBien() {
            return this.typesBien.find(t => Number(t.id) === Number(this.form.typeBiensImmobiliereId)) || {};
        },
        isAgricole() {
            return this.selectedTypeBien.nomTypeBiensImmo?.toLowerCase() === 'agricole';
        }
    },
    methods: {
        getImageUrl,
        updateForm(field, value) {
            this.$emit('update:form', { ...this.form, [field]: value });
        },
        handleFileUploaded(response) {
            console.log("StepOne - handleFileUploaded:", response);
            if (!response || typeof response !== 'object') return;
            response.file.typeFichier = getFileTypeByStep(this.currentStep);
            const updatedFiles = [
                ...((this.fichiers || []).filter(f => f.id !== response.file.id)),
                response.file
            ];
            // Émettre vers le parent pour gérer l'upload
            this.$emit('uploadResponse', response);
            this.$emit('update:fichiers', updatedFiles);
            this.$emit('update:form', updateFormFiles(this.form, updatedFiles));
        },
        removeFile(index) {
            const updatedFiles = [...this.form.fichier];
            updatedFiles.splice(index, 1);
            this.$emit('update:form', updateFormFiles(this.form, updatedFiles));
        },

    }
}
</script>

<style scoped>
.cover-img-preview {
    width: 200px;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
}

.file-preview img {
    height: 100px;
    object-fit: cover;
    border-radius: 5px;
}

.card-header h6 {
    margin: 0;
    color: #495057;
}
</style>
