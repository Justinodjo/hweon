// Integration dans AddBiensStepOne.vue
<template>
    <div class="container p-4">
        <div class="card shadow-sm">
            <div class="card-body">
                <!-- Barre de progression -->
                <ProgressBar :activeStep="activeStep" :totalSteps="5" />

                <!-- Étapes numérotées -->
                <StepNavigation :activeStep="activeStep" :steps="stepLabels" />

                <!-- Analyseur de richesse - Nouvelle étape -->
                <div v-if="activeStep === 4" class="wealth-analysis-step">
                    <h5 class="mb-4">
                        <i class="fas fa-chart-line me-2"></i>
                        Analyse de Potentiel de Richesse
                    </h5>

                    <!-- Alerte si analyse non disponible -->
                    <div v-if="!isFormValidForWealth" class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        Complétez les informations de base pour activer l'analyse de richesse.
                    </div>

                    <!-- Composant d'analyse de richesse -->
                    <WealthAnalyzer v-else :form="form" :isFormValid="isFormValidForWealth"
                        @analysis-updated="handleWealthAnalysis" />

                    <!-- Navigation spéciale pour cette étape -->
                    <div class="d-flex justify-content-between mt-4">
                        <button type="button" class="btn btn-outline-secondary" @click="prevStep">
                            <i class="fas fa-arrow-left me-2"></i>
                            Précédent
                        </button>
                        <div class="d-flex gap-2">
                            <button type="button" class="btn btn-info" @click="exportWealthAnalysis"
                                :disabled="!wealthAnalysisResult">
                                <i class="fas fa-download me-2"></i>
                                Exporter l'analyse
                            </button>
                            <button type="button" class="btn btn-success" @click="submitWithWealth"
                                :disabled="submitting || !isFormValidForWealth">
                                <i class="fas fa-save me-2"></i>
                                {{ submitting ? 'Enregistrement...' : 'Enregistrer le bien' }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Contenu des autres étapes -->
                <component v-else :is="currentStepComponent" :form="form" :preview="preview"
                    :loading="loadingGeolocation" :geolocationStatus="geolocationStatus"
                    :geolocationError="geolocationError" :uploadConfig="uploadConfig" :typesBien="typesBien"
                    :pays="pays" :departements="departements" :communes="communes" :arrondissements="arrondissements"
                    :quartiers="quartiers" :selectedPays="selectedPays" :selectedDepartement="selectedDepartement"
                    :selectedCommune="selectedCommune" :selectedArrondissement="selectedArrondissement"
                    :selectedQuartier="selectedQuartier" :services="services" :securites="securites"
                    :activites="activites" :modePaiement="modePaiement" :typesDetailsBiens="typesDetailsBiens"
                    :etatsGeneral="etatsGeneral" :typesClimatisation="typesClimatisation" :typesGarage="typesGarage"
                    :typesDPE="typesDPE" @update:form="updateForm" @update:selectedPays="selectedPays = $event"
                    @update:selectedDepartement="selectedDepartement = $event"
                    @update:selectedCommune="selectedCommune = $event"
                    @update:selectedArrondissement="selectedArrondissement = $event"
                    @update:selectedQuartier="selectedQuartier = $event" @paysChange="onPaysChange"
                    @departementChange="onDepartementChange" @communeChange="onCommuneChange"
                    @arrondissementChange="onArrondissementChange" @quartierChange="onQuartierChange"
                    @geocodeAddress="geocodeAddress" @getCurrentLocation="getCurrentLocation"
                    @uploadResponse="UploadResponse" @prevStep="prevStep" @nextStep="nextStep" @submit="submit" />

                <!-- Indicateur de richesse dans la barre latérale -->
                <div v-if="wealthAnalysisResult && activeStep < 4" class="wealth-indicator-sidebar">
                    <div class="wealth-mini-card" @click="goToWealthAnalysis">
                        <div class="wealth-mini-score"
                            :class="getWealthScoreClass(wealthAnalysisResult.scoreNumerique)">
                            {{ wealthAnalysisResult.scoreNumerique.toFixed(1) }}
                        </div>
                        <small>Potentiel de richesse</small>
                        <div class="wealth-mini-rank">{{ wealthAnalysisResult.rang }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { getToken } from "@/helpers/auth"
import { API_URLS } from "@/config/api"
import { useLoading } from "vue-loading-overlay"

// Import des mixins existants
import GeolocationMixin from "../../mixins/GeolocationMixin";
import GeographicMixin from "../../mixins/GeographicMixin";
import FormValidationMixin from "../../mixins/FormValidationMixin";
import DataLoadingMixin from "../../mixins/DataLoadingMixin";

// Import des composants d'étapes
import StepOne from '@/steps/StepOne.vue';
import StepTwo from '@/steps/StepTwo.vue';
import StepThree from '@/steps/StepThree.vue';
import StepFour from '@/steps/StepFour.vue';

// Import des composants utilitaires
import ProgressBar from '@/components/ProgressBar.vue';
import StepNavigation from '@/components/StepNavigation.vue';

// Import du nouveau composant d'analyse
import WealthAnalyzer from '@/components/WealthAnalyzer.vue';

export default {
    name: 'AddBiensStepOne',

    components: {
        StepOne,
        StepTwo,
        StepThree,
        StepFour,
        ProgressBar,
        StepNavigation,
        WealthAnalyzer
    },

    mixins: [
        GeolocationMixin,
        GeographicMixin,
        FormValidationMixin,
        DataLoadingMixin
    ],

    emits: ['hide', 'show', 'success', 'close'],

    data() {
        return {
            visible: false,
            activeStep: 0,
            submitting: false,
            loading: useLoading(),
            reponseUpload: null,
            shower: false,
            loadingGeolocation: false,
            geolocationStatus: 'idle',
            fichier: [],
            geolocationError: '',

            // Nouveau: Données d'analyse de richesse
            wealthAnalysisResult: null,
            wealthAnalysisEnabled: true,

            // Configuration
            stepLabels: [
                'Infos de base',
                'Détails du bien',
                'Image & Confirmation',
                'Géolocalisation & Confirmation',
                'Analyse de Richesse' // Nouvelle étape
            ],

            // Données du formulaire principal (existant)
            form: {
                nom: '',
                adresse: '',
                typeBiensImmobiliereId: null,
                prix: null,
                superficie: null,
                latitude: null,
                longitude: null,
                loadingGeolocation: false,
                departementId: null,
                communeId: null,
                arrondissementId: null,
                quartierId: null,
                description: '',
                fichier: [],
                status: true,
                aVendre: true,
                typeUnite: 'M2',
                detailsBiensImmobiliers: [],
                equipements: {},
                autresEquipements: '',
                anneeConstruction: null,
                nombreEtages: null,
                etatBien: '',
                observations: '',
                nombreChambres: null,
                surfaceVente: null,
                culture: '',

                // Nouveaux champs pour l'analyse de richesse
                delaiVente: 90,
                situationFinanciere: 'normale',
                tendanceMarche: 'stable',
                agentExperience: 5,
                agentReputation: 6,
                entrepriseTaille: 'moyenne',
                prixMoyenZone: 150000
            },

            preview: {
                coverUrl: ''
            },

            // Sélections géographiques (existant)
            selectedPays: null,
            selectedDepartement: null,
            selectedCommune: null,
            selectedArrondissement: null,
            selectedQuartier: null,

            // Données de référence (existant)
            pays: [],
            departements: [],
            communes: [],
            arrondissements: [],
            quartiers: [],
            typesBien: [],
            services: [],
            securites: [],
            activites: [],
            modePaiement: [],
            typesDetailsBiens: [],
            etatsGeneral: [],
            typesClimatisation: [],
            typesGarage: [],
            typesDPE: []
        }
    },

    computed: {
        currentStepComponent() {
            const components = ['StepOne', 'StepTwo', 'StepThree', 'StepFour']
            return components[this.activeStep] || 'StepOne'
        },

        // Validation pour l'analyse de richesse
        isFormValidForWealth() {
            return this.form.nom &&
                this.form.adresse &&
                this.form.prix &&
                this.form.superficie &&
                this.form.typeBiensImmobiliereId &&
                this.form.departementId;
        },

        // Configuration d'upload (existant)
        uploadConfig() {
            return {
                url: `${API_URLS.ADD_FICHIER}`,
                process: {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${getToken()}`,
                    },
                    withCredentials: false,
                    onload: (response) => {
                        try {
                            const fileData = JSON.parse(response)
                            this.fichier.push(fileData)
                            ElMessage.success('Image uploadée avec succès')
                            return response
                        } catch (error) {
                            console.error('Erreur parsing response:', error)
                            ElMessage.error('Erreur lors du traitement de la réponse')
                            throw error
                        }
                    },
                    onerror: (error) => {
                        console.error("Erreur d'upload:", error)
                        ElMessage.error("Erreur lors de l'upload du fichier.")
                    },
                }
            }
        }
    },

    async mounted() {
        await this.loadAllData()
    },

    methods: {
        // Méthodes de navigation (modifiées)
        nextStep() {
            if (this.activeStep < 4) { // Changé de 3 à 4
                this.activeStep++;
            }
        },

        prevStep() {
            if (this.activeStep > 0) {
                this.activeStep--;
            }
        },

        // Nouvelle méthode pour aller directement à l'analyse
        goToWealthAnalysis() {
            if (this.isFormValidForWealth) {
                this.activeStep = 4;
            } else {
                ElMessage.warning('Complétez d\'abord les informations de base');
            }
        },

        // Gestion de l'analyse de richesse
        handleWealthAnalysis(analysisResult) {
            this.wealthAnalysisResult = analysisResult;

            // Stocker l'analyse pour utilisation ultérieure
            this.form.wealthAnalysis = analysisResult;

            // Log pour debugging
            console.log('Analyse de richesse:', analysisResult);
        },

        // Export de l'analyse de richesse
        exportWealthAnalysis() {
            if (!this.wealthAnalysisResult) return;

            const analysisData = {
                bien: {
                    nom: this.form.nom,
                    adresse: this.form.adresse,
                    prix: this.form.prix,
                    superficie: this.form.superficie,
                    type: this.typesBien.find(t => t.id === this.form.typeBiensImmobiliereId)?.nomTypeBiensImmo
                },
                analyse: this.wealthAnalysisResult,
                dateAnalyse: new Date().toISOString()
            };

            // Création et téléchargement du fichier JSON
            const dataStr = JSON.stringify(analysisData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

            const exportFileDefaultName = `analyse_richesse_${this.form.nom || 'bien'}_${new Date().toISOString().slice(0, 10)}.json`;

            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();

            ElMessage.success('Analyse exportée avec succès');
        },

        // Soumission avec analyse de richesse
        async submitWithWealth() {
            if (!this.isFormValidForWealth) {
                ElMessage.warning('Veuillez remplir tous les champs obligatoires');
                return;
            }

            this.submitting = true;
            const loader = this.loading.show({
                container: this.$el,
                canCancel: false,
            });

            try {
                // Construction des données avec analyse de richesse
                const formData = this.buildSubmissionDataWithWealth();

                // Log des données complètes
                console.log('Données à envoyer (avec analyse):', formData);

                // Appel API
                const response = await this.$store.dispatch('biensImmobiliers/createWithWealthAnalysis', formData);

                ElMessage.success('Bien enregistré avec analyse de richesse');

                // Afficher un résumé de l'analyse
                this.showWealthSummary();

                this.handleSuccessfulSubmission(response);

            } catch (err) {
                this.handleSubmissionError(err);
            } finally {
                this.submitting = false;
                loader.hide();
            }
        },

        // Construction des données avec analyse de richesse
        buildSubmissionDataWithWealth() {
            const baseData = this.buildSubmissionData(); // Méthode existante

            // Ajout de l'analyse de richesse
            if (this.wealthAnalysisResult) {
                baseData.analyseRichesse = {
                    score: this.wealthAnalysisResult.scoreNumerique,
                    rang: this.wealthAnalysisResult.rang,
                    composants: this.wealthAnalysisResult.composants,
                    recommandations: this.wealthAnalysisResult.recommandations,
                    planAction: this.wealthAnalysisResult.planAction,
                    dateAnalyse: new Date().toISOString()
                };

                // Ajout de métadonnées pour le business intelligence
                baseData.businessIntelligence = {
                    potentielRentabilite: this.calculateProfitabilityPotential(),
                    prioriteTraitement: this.calculateTreatmentPriority(),
                    risqueInvestissement: this.calculateInvestmentRisk(),
                    opportuniteMarche: this.calculateMarketOpportunity()
                };
            }

            return baseData;
        },

        // Calculs de Business Intelligence
        calculateProfitabilityPotential() {
            if (!this.wealthAnalysisResult) return 'moyen';

            const score = this.wealthAnalysisResult.scoreNumerique;
            if (score >= 8) return 'très_élevé';
            if (score >= 6) return 'élevé';
            if (score >= 4) return 'moyen';
            if (score >= 2) return 'faible';
            return 'très_faible';
        },

        calculateTreatmentPriority() {
            if (!this.wealthAnalysisResult) return 'normale';

            const urgence = this.wealthAnalysisResult.composants.urgence.score;
            const problemes = this.wealthAnalysisResult.composants.problemes.score;

            const priorityScore = (urgence * 0.6) + (problemes * 0.4);

            if (priorityScore >= 8) return 'critique';
            if (priorityScore >= 6) return 'haute';
            if (priorityScore >= 4) return 'normale';
            return 'basse';
        },

        calculateInvestmentRisk() {
            if (!this.wealthAnalysisResult) return 'moyen';

            const problemes = this.wealthAnalysisResult.composants.problemes.score;
            const competition = this.wealthAnalysisResult.composants.competition.score;

            const riskScore = (problemes * 0.7) + (competition * 0.3);

            if (riskScore >= 7) return 'élevé';
            if (riskScore >= 5) return 'moyen';
            if (riskScore >= 3) return 'faible';
            return 'très_faible';
        },

        calculateMarketOpportunity() {
            if (!this.wealthAnalysisResult) return 'moyenne';

            const frequence = this.wealthAnalysisResult.composants.frequence.score;
            const echelle = this.wealthAnalysisResult.composants.echelle.score;
            const competition = this.wealthAnalysisResult.composants.competition.score;

            const opportunityScore = ((frequence + echelle) * 0.4) - (competition * 0.2);

            if (opportunityScore >= 6) return 'excellente';
            if (opportunityScore >= 4) return 'bonne';
            if (opportunityScore >= 2) return 'moyenne';
            return 'faible';
        },

        // Affichage du résumé de l'analyse
        showWealthSummary() {
            if (!this.wealthAnalysisResult) return;

            const summary = `
                <div class="wealth-summary">
                    <h6><i class="fas fa-chart-line me-2"></i>Résumé de l'Analyse</h6>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <strong>Score de Richesse:</strong> ${this.wealthAnalysisResult.scoreNumerique}/10
                        </div>
                        <div class="summary-item">
                            <strong>Rang:</strong> ${this.wealthAnalysisResult.rang}
                        </div>
                        <div class="summary-item">
                            <strong>Recommandations:</strong> ${this.wealthAnalysisResult.recommandations?.length || 0} actions prioritaires
                        </div>
                        <div class="summary-item">
                            <strong>Potentiel:</strong> ${this.calculateProfitabilityPotential().toUpperCase()}
                        </div>
                    </div>
                </div>
            `;

            ElMessage({
                message: summary,
                type: 'success',
                duration: 10000,
                dangerouslyUseHTMLString: true
            });
        },

        // Utilitaires pour l'affichage
        getWealthScoreClass(score) {
            if (score >= 8) return 'wealth-excellent';
            if (score >= 6) return 'wealth-good';
            if (score >= 4) return 'wealth-average';
            if (score >= 2) return 'wealth-poor';
            return 'wealth-very-poor';
        },

        // Méthodes existantes (inchangées)
        show() {
            this.visible = true;
            return this.visible;
        },

        hide() {
            this.visible = false;
            return this.visible;
        },

        updateForm(updates) {
            this.form = { ...this.form, ...updates };
        },

        UploadResponse(error, fileData) {
            if (!error && fileData) {
                try {
                    const reponse = JSON.parse(fileData.serverId);
                    this.reponseUpload = reponse;
                    this.preview.coverUrl = reponse.url;
                } catch (parseError) {
                    console.error('Erreur parsing FilePond response:', parseError);
                }
            }
        },

        getCurrentLocation() {
            this.loadingGeolocation = true;
            this.geolocationStatus = 'loading';

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.form.latitude = position.coords.latitude;
                    this.form.longitude = position.coords.longitude;
                    this.geolocationStatus = 'success';
                    this.loadingGeolocation = false;
                },
                (error) => {
                    this.geolocationStatus = 'error';
                    this.geolocationError = error.message;
                    this.loadingGeolocation = false;
                }
            );
        },

        resetForm() {
            this.form = {
                nom: '',
                adresse: '',
                typeBiensImmobiliereId: null,
                prix: null,
                superficie: null,
                description: '',
                latitude: null,
                longitude: null,
                departementId: null,
                communeId: null,
                arrondissementId: null,
                quartierId: null,
                fichier: [],
                equipements: {},
                autresEquipements: '',
                detailsBiensImmobiliers: [],
                nombreChambres: null,
                surfaceVente: null,
                culture: '',
                wealthAnalysis: null
            };
            this.preview.coverUrl = '';
            this.activeStep = 0;
            this.fichier = [];
            this.reponseUpload = null;
            this.wealthAnalysisResult = null;
        },

        async submit() {
            // Redirection vers la soumission avec analyse si on est à l'étape 4
            if (this.activeStep === 4) {
                await this.submitWithWealth();
                return;
            }

            // Soumission classique pour les autres cas
            if (!this.isFormValid) {
                ElMessage.warning('Veuillez remplir tous les champs obligatoires');
                return;
            }

            this.submitting = true;
            try {
                const formData = this.buildSubmissionData();
                await this.$store.dispatch('biensImmobiliers/create', formData);
                ElMessage.success('Bien enregistré avec succès');

                this.resetForm();
                this.visible = false;
                this.$emit('success', formData);

            } catch (err) {
                console.error('Erreur soumission:', err);
                ElMessage.error('Erreur lors de l\'enregistrement');
            } finally {
                this.submitting = false;
            }
        },

        buildSubmissionData() {
            return {
                nom: this.form.nom,
                adresse: this.form.adresse,
                prix: this.form.prix,
                superficie: this.form.superficie,
                latitude: this.form.latitude,
                longitude: this.form.longitude,
                description: this.form.description,
                status: this.form.status,
                aVendre: this.form.aVendre,
                typeUnite: this.form.typeUnite,
                typeBiensImmobiliere: { id: this.form.typeBiensImmobiliereId },
                departement: this.form.departementId === 'unknown'
                    ? { libelle: this.form.departementLibelle }
                    : { id: this.form.departementId },
                commune: this.form.communeId === 'unknown'
                    ? { libelle: this.form.communeLibelle }
                    : { id: this.form.communeId },
                arrondissement: this.form.arrondissementId === 'unknown'
                    ? { libelle: this.form.arrondissementLibelle }
                    : { id: this.form.arrondissementId },
                detailsBiensImmobiliers: this.form.detailsBiensImmobiliers.map(detail => ({
                    typeDetailsBiens: detail.typeDetailsBiens,
                    nombre: detail.nombre,
                    nomdetails: detail.nomdetails,
                    description: detail.description,
                    prix: detail.prix,
                    status: detail.status
                })),
                equipements: this.buildEquipementsPayload(),
                fichier: this.reponseUpload,
                fichiers: this.fichier
            };
        },

        buildEquipementsPayload() {
            const services = this.services.filter(s => this.form.equipements[s.key]).map(s => s.key.toUpperCase());
            const securite = this.securites.filter(s => this.form.equipements[s.key]).map(s => s.key.toUpperCase());
            const activites = this.activites.filter(a => this.form.equipements[a.key]).map(a => a.key.toUpperCase());

            return {
                services,
                securite,
                activites,
                autres: this.form.autresEquipements || ''
            };
        },

        handleSuccessfulSubmission(response) {
            this.resetForm();
            this.visible = false;
            this.$emit('success', response);
        },

        handleSubmissionError(error) {
            console.error('Erreur soumission:', error);

            let errorMessage = 'Erreur lors de l\'enregistrement';

            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        errorMessage = 'Données invalides. Veuillez vérifier le formulaire.';
                        break;
                    case 401:
                        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
                        break;
                    case 403:
                        errorMessage = 'Accès non autorisé.';
                        break;
                    case 422:
                        errorMessage = 'Erreur de validation. Vérifiez vos données.';
                        break;
                    case 500:
                        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
                        break;
                }

                if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.request) {
                errorMessage = 'Erreur réseau. Vérifiez votre connexion.';
            }

            ElMessage.error(errorMessage);
        }
    }
}
</script>

<style scoped>
/* Styles existants + nouveaux styles pour l'analyse de richesse */

/* Indicateur de richesse dans la barre latérale */
.wealth-indicator-sidebar {
    position: fixed;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    z-index: 1000;
    cursor: pointer;
    transition: all 0.3s ease;
}

.wealth-indicator-sidebar:hover {
    transform: translateY(-50%) scale(1.05);
}

.wealth-mini-card {
    background: white;
    border-radius: 12px;
    padding: 1rem;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 2px solid #e9ecef;
    min-width: 120px;
    transition: all 0.3s ease;
}

.wealth-mini-card:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    border-color: #007bff;
}

.wealth-mini-score {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.25rem;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 0.5rem auto;
}

.wealth-mini-rank {
    font-size: 0.75rem;
    color: #6c757d;
    margin-top: 0.25rem;
}

/* Classes de couleur pour les scores */
.wealth-excellent,
.wealth-mini-score.wealth-excellent {
    background: #28a745;
    color: white;
}

.wealth-good,
.wealth-mini-score.wealth-good {
    background: #17a2b8;
    color: white;
}

.wealth-average,
.wealth-mini-score.wealth-average {
    background: #ffc107;
    color: #333;
}

.wealth-poor,
.wealth-mini-score.wealth-poor {
    background: #fd7e14;
    color: white;
}

.wealth-very-poor,
.wealth-mini-score.wealth-very-poor {
    background: #dc3545;
    color: white;
}

/* Styles pour l'étape d'analyse */
.wealth-analysis-step {
    min-height: 500px;
}

/* Styles pour le résumé */
.summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.summary-item {
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #007bff;
}

/* Responsive design */
@media (max-width: 768px) {
    .wealth-indicator-sidebar {
        position: static;
        transform: none;
        margin: 1rem auto;
        width: fit-content;
    }

    .wealth-indicator-sidebar:hover {
        transform: none;
    }

    .wealth-mini-card {
        min-width: 100px;
        padding: 0.75rem;
    }

    .wealth-mini-score {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
    }
}

/* Animation pour les transitions */
.wealth-analysis-step {
    animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>