<template>
    <div class="container p-4">
        <div class="card shadow-sm">
            <div class="card-body">
                <!-- Barre de progression -->
                <ProgressBar :activeStep="activeStep" :totalSteps="4" />

                <!-- Étapes numérotées -->
                <StepIndicators :activeStep="activeStep" :steps="stepLabels" :allowStepNavigation="true"
                    @goToStep="activeStep = $event" />

                <!-- Contenu des étapes -->
                <component :is="currentStepComponent" :form="form" :preview="preview" :loading="loadingGeolocation"
                    :key="activeStep" :geolocationStatus="geolocationStatus" :geolocationError="geolocationError"
                    :uploadConfig="uploadConfig" :typesBien="typesBien" :typeBien="selectedTypeBien"
                    @update:typeBien="form.typeBiensImmobiliereId = $event" :pays="pays" :departements="departements"
                    :communes="communes" :arrondissements="arrondissements" :quartiers="quartiers"
                    :selectedPays="selectedPays" :selectedDepartement="selectedDepartement"
                    :selectedCommune="selectedCommune" :selectedArrondissement="selectedArrondissement"
                    :selectedQuartier="selectedQuartier" :services="services" :securites="securites"
                    :activites="activites" :modesPaiement="modesPaiement" :typesDetailsBiens="typesDetailsBiens"
                    :etatsGeneral="etatsGeneral" :typesClimatisation="typesClimatisation" :typeGarage="typeGarage"
                    :typesDPE="typesDPE" :isResidentiel="isResidentiel" :activeStep="activeStep"
                    :isAgricole="isAgricole" :languesPersonnel="languesPersonnel" :typeVue="typeVue"
                    :typeCuisine="typeCuisine" :uniteSurface="uniteSurface" :typeUnite="typeUnite"
                    :fichiers="form.fichier" @update:form="updateForm"
                    @update:fichiers="updateForm({ fichier: $event })" @update:selectedPays="selectedPays = $event"
                    @update:selectedDepartement="selectedDepartement = $event"
                    @update:selectedCommune="selectedCommune = $event"
                    @update:selectedArrondissement="selectedArrondissement = $event"
                    @update:selectedQuartier="selectedQuartier = $event" @paysChange="onPaysChange"
                    @departementChange="onDepartementChange" @communeChange="onCommuneChange"
                    @arrondissementChange="onArrondissementChange" @quartierChange="onQuartierChange"
                    @geocodeAddress="geocodeAddress" @getCurrentLocation="getCurrentLocation"
                    @uploadResponse="handleUpload" @prevStep="prevStep" @nextStep="nextStep" @submit="submit" />

                <!-- Boutons de navigation -->
                <StepButtons :activeStep="activeStep" :steps="stepLabels" :loading="submitting" @prevStep="prevStep"
                    @nextStep="nextStep" @submit="submit" />
            </div>
        </div>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import { useLoading } from 'vue-loading-overlay';

// Mixins centralisés
import * as Mixins from '@/mixins';

// Composants centralisés
import * as Steps from '@/steps';
import * as Components from '@/components';

// Helpers
import { getUploadConfig, buildSubmissionData, handleUploadResponseUnified } from '@/utils/formUtils';
import { getFileTypeByStep } from '@/utils/filepondUtils';
export default {
    name: 'AddBiensStepOne',

    components: {
        ...Steps,
        ...Components,
    },

    mixins: [
        Mixins.GeolocationMixin,
        Mixins.GeographicMixin,
        Mixins.FormValidationMixin,
        Mixins.DataLoadingMixin,
    ],

    emits: ['hide', 'show', 'success', 'close'],

    data() {
        return {
            visible: false,
            activeStep: 0,
            submitting: false,
            loading: useLoading(),
            reponseUpload: null,
            loadingGeolocation: false,
            geolocationStatus: 'idle',
            geolocationError: '',

            stepLabels: [
                'Infos de base',
                'Autres Informations',
                'Détails du bien',
                'Géolocalisation & Confirmation',
            ],

            form: {
                nom: '',
                adresse: '',
                typeBiensImmobiliereId: null,

                prix: null,
                superficie: null,
                latitude: null,
                longitude: null,
                departementId: null,
                communeId: null,
                arrondissementId: null,
                quartierId: null,
                description: '',
                fichier: [],
                fichiers: [],
                status: true,
                aVendre: true,
                typeUnite: 'MONTH',
                uniteSurface: null,
                detailsBiensImmobiliers: [],
                equipements: {
                    services: [],
                    securites: [],
                    activites: [],
                    modesPaiement: [],
                    languesPersonnel: [],
                    typeCuisine: [],
                    typesClimatisation: [],
                    typeGarage: [],
                    typeVue: []
                },
                userInfo: { id: this.userId },
            },

            preview: { coverUrl: '' },

            selectedPays: null,
            selectedDepartement: null,
            selectedCommune: null,
            selectedArrondissement: null,
            selectedQuartier: null,

            pays: [],
            departements: [],
            communes: [],
            arrondissements: [],
            quartiers: [],
            typesBien: [],
            services: [],
            securites: [],
            activites: [],
            modesPaiement: [],
            languesPersonnel: [],
            typesDetailsBiens: [],
            etatsGeneral: [],
            typesClimatisation: [],
            typeGarage: [],
            typesDPE: [],
            typeVue: [],
            typeCuisine: [],
            uniteSurface: [],
        };
    },

    computed: {
        currentStepComponent() {
            const components = ['StepOne', 'StepTwo', 'StepThree', 'StepFour'];
            return components[this.activeStep] || 'StepOne';
        },
        userId() {
            return this.$store.getters['auth/userInfo']; // renvoie l'ID
        },
        selectedTypeBien() {
            return this.typesBien.find(t => t.id === this.form.typeBiensImmobiliereId) || null;
        },
        isAgricole() {
            return this.getTypeBien('Agricole');
        },
        isResidentiel() {
            return this.getTypeBien('Résidentiel');
        },
        isFormValid() {
            return this.form.nom && this.form.adresse && this.form.typeBiensImmobiliereId;
        },
        fileType() {
            return getFileTypeByStep(this.activeStep);
        },
        uploadConfig() {
            const fileType = this.fileType;
            return getUploadConfig(this.activeStep, this.form, fileType, true, 0);
        },
    },

    async mounted() {
        await this.loadAllData();
    },

    methods: {
        show() { this.visible = true; return this.visible; },
        hide() { this.visible = false; return this.visible; },
        nextStep() { if (this.activeStep < 3) this.activeStep++; },
        prevStep() { if (this.activeStep > 0) this.activeStep--; },
        updateForm(updates) { this.form = { ...this.form, ...updates }; },
        getTypeBien(type) {
            const typeBien = this.typesBien.find(t => t.id === this.form.typeBiensImmobiliereId);
            return typeBien?.nomTypeBiensImmo === type;
        },
        UploadResponse(error, fileData) {
            this.handleUploadResponse(error, fileData);
        },
        getCurrentLocation() {
            this.loadingGeolocation = true;
            this.geolocationStatus = 'loading';
            navigator.geolocation.getCurrentPosition(
                pos => {
                    this.form.latitude = pos.coords.latitude;
                    this.form.longitude = pos.coords.longitude;
                    this.geolocationStatus = 'success';
                    this.loadingGeolocation = false;
                },
                err => {
                    this.geolocationStatus = 'error';
                    this.geolocationError = err.message;
                    this.loadingGeolocation = false;
                }
            );
        },

        handleUpload({ file, fileType, multiple, detailIndex }) {
            console.log("=== PARENT handleUpload ===");
            console.log("Params:", { file, fileType, multiple, detailIndex });
            console.log("Form avant:", JSON.stringify({
                fichiers: this.form.fichiers,
                detailsBiensImmobiliers: this.form.detailsBiensImmobiliers
            }, null, 2));

            // CORRECTION 4: Appel correct avec les bons paramètres
            const result = handleUploadResponseUnified(
                this.form,      // form
                file,           // response/file
                fileType,           // fileType
                multiple,       // multiple
                detailIndex     // detailIndex
            );
            if (!result || !result.file || !result.file.id) {
                console.warn("Upload result invalid or missing file.id", result);
                this.debugFormState();
            }

            console.log("Result:", result);
            console.log("Form après:", JSON.stringify({
                fichiers: this.form.fichiers,
                detailsBiensImmobiliers: this.form.detailsBiensImmobiliers
            }, null, 2));
            console.log("========================");

            return result;
        },

        debugFormState() {
            console.log("=== DEBUG FORM STATE ===");
            console.log("Form.fichier:", this.form.fichier);
            console.log("Form.fichiers:", this.form.fichiers);
            console.log("Form.detailsBiensImmobiliers:", this.form.detailsBiensImmobiliers);
            console.log("========================");
        },
        resetForm() {
            this.form = {
                nom: '', adresse: '', typeBiensImmobiliereId: null,
                prix: null, superficie: null, latitude: null, longitude: null,
                departementId: null, communeId: null, arrondissementId: null, quartierId: null,
                description: '', fichier: [], fichiers: [], status: true, aVendre: true,
                typeUnite: 'MONTH', uniteSurface: null, detailsBiensImmobiliers: [], equipements: {},
                userInfo: { id: this.userId },
            };
            this.preview.coverUrl = '';
            this.activeStep = 0;
            this.reponseUpload = null;
        },
        async submit() {
            if (!this.userId) return ElMessage.warning('Veuillez vous connecter');
            if (!this.isFormValid) return ElMessage.warning('Veuillez remplir tous les champs obligatoires');

            // Inspecte le form complet avant envoi
            console.log('FORM READY TO SUBMIT:', JSON.stringify(this.form, null, this.userId));
            if (this.submitting) return;
            this.submitting = true;
            try {
                // ✅ utilise le helper
                const formData = buildSubmissionData(this.form, this.userId);
                const response = await this.$store.dispatch('biensImmobiliers/create', formData);
                ElMessage.success('Bien enregistré avec succès');
                this.resetForm();
                this.visible = false;
                this.$emit('success', formData);
            } catch (err) {
                console.error(err);
                ElMessage.error('Erreur lors de l\'enregistrement');
            } finally {
                this.submitting = false;
            }
        },
        // buildSubmissionData(form, userId) {
        //     return {
        //         ...form,
        //         userInfo: { id: userId },
        //         equipements: {
        //             services: form.equipements.services,
        //             securites: form.equipements.securites,
        //             activites: form.equipements.activites,
        //             modesPaiement: form.equipements.modesPaiement,
        //             languesPersonnel: form.equipements.languesPersonnel,
        //             typeCuisine: form.equipements.typeCuisine,
        //             typesClimatisation: form.equipements.typesClimatisation,
        //             typeGarage: form.equipements.typeGarage,
        //             typeVue: form.equipements.typeVue,
        //         }
        //     };
        // }

    },
};
</script>
