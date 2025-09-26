// steps/StepFour.vue
<template>
    <div class="mb-3">
        <h5 class="mb-4">Géolocalisation et confirmation</h5>

        <!-- Localisation précise -->
        <div class="card mb-4">
            <div class="card-header">
                <h6>Localisation précise</h6>
            </div>
            <div class="card-body">
                <p class="text-muted mb-3">
                    Vérifiez et ajustez si nécessaire l'emplacement de votre bien sur la carte.
                </p>

                <!-- Coordonnées GPS -->
                <div class="row g-3 mb-3">
                    <div class="col-md-5">
                        <label class="form-label">
                            <i class="bi bi-geo me-2"></i>
                            Latitude
                        </label>
                        <input type="number" class="form-control" :value="form.longitude"
                            @input="updateForm('longitude', parseFloat($event.target.value) || null)" step="0.000001"
                            placeholder="Ex: 2.628734">
                    </div>
                    <div class="col-md-2 d-flex align-items-end">
                        <button type="button" class="btn btn-primary w-100" @click="$emit('getCurrentLocation')"
                            :disabled="loading" title="Obtenir ma position actuelle">
                            <div v-if="loading" class="spinner-border spinner-border-sm"></div>
                            <i v-else class="bi bi-geo-alt"></i>
                        </button>
                    </div>
                </div>

                <!-- Carte de prévisualisation -->
                <div v-if="hasValidCoordinates" class="map-preview mb-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="mb-0">Aperçu de la localisation</h6>
                        <small class="text-muted">
                            {{ form.latitude }}, {{ form.longitude }}
                        </small>
                    </div>
                    <!-- <iframe :src="mapUrl" width="100%" height="300" frameborder="0" scrolling="no"
                        class="rounded border"></iframe> -->
                    <div v-if="hasValidCoordinates" class="map-preview mb-3">
                        <div id="map" style="height: 300px; width: 100%"></div>
                    </div>
                    <div class="mt-2">
                        <small class="text-success">
                            <i class="bi bi-check-circle me-1"></i>
                            Localisation définie
                        </small>
                    </div>
                </div>

                <div v-else class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Aucune coordonnée GPS définie. Utilisez le bouton de géolocalisation ou saisissez manuellement les
                    coordonnées.
                </div>
            </div>
        </div>
        <div v-if="isFullyValidated" class="alert alert-success">
            <i class="bi bi-check-circle me-2"></i>
            Toutes les validations sont complètes. Vous pouvez maintenant publier votre annonce.
        </div>
        <div v-else class="alert alert-info">
            <i class="bi bi-info-circle me-2"></i>
            Veuillez cocher toutes les cases de validation pour continuer.
        </div>
        <!-- Récapitulatif du bien -->
        <PropertySummary :form="form" :typesBien="typesBien" :hasValidCoordinates="hasValidCoordinates" />

        <!-- Validation finale et soumission -->
        <div class="card mb-4">
            <div class="card-header">
                <h6>
                    <i class="bi bi-check-square me-2"></i>
                    Validation finale
                </h6>
            </div>
            <div class="card-body">
                <div class="validation-checklist">
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="check-infos"
                            :checked="validationChecks.informations"
                            @change="updateValidation('informations', $event.target.checked)">
                        <label class="form-check-label" for="check-infos">
                            J'ai vérifié que toutes les informations saisies sont correctes
                        </label>
                    </div>

                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="check-photos"
                            :checked="validationChecks.photos"
                            @change="updateValidation('fichiers', $event.target.checked)">
                        <label class="form-check-label" for="check-photos">
                            Les photos téléchargées représentent bien le bien immobilier
                        </label>
                    </div>

                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="check-legal"
                            :checked="validationChecks.legal"
                            @change="updateValidation('legal', $event.target.checked)">
                        <label class="form-check-label" for="check-legal">
                            Je certifie avoir le droit de proposer ce bien à la vente/location
                        </label>
                    </div>

                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="check-terms"
                            :checked="validationChecks.terms"
                            @change="updateValidation('terms', $event.target.checked)">
                        <label class="form-check-label" for="check-terms">
                            J'accepte les conditions générales d'utilisation
                        </label>
                    </div>
                </div>

                <!-- Status de validation -->
                <div class="mt-3">
                    <div v-if="isFullyValidated" class="alert alert-success">
                        <i class="bi bi-check-circle me-2"></i>
                        Toutes les validations sont complètes. Vous pouvez maintenant publier votre annonce.
                    </div>
                    <div v-else class="alert alert-info">
                        <i class="bi bi-info-circle me-2"></i>
                        Veuillez cocher toutes les cases de validation pour continuer.
                    </div>
                </div>
            </div>
        </div>

        <!-- Navigation finale -->
        <!-- <StepNavigation :canGoBack="true" :canGoNext="isFullyValidated" :loading="submitting"
            nextButtonText="Publier l'annonce" @prevStep="$emit('prevStep')" @submit="$emit('submit')" /> -->
        <!-- <StepButtons :activeStep="activeStep" :steps="stepLabels" :loading="submitting" @prevStep="prevStep"
            @nextStep="nextStep" @submit="submit" /> -->
    </div>
</template>

<script>
import PropertySummary from '@/components/PropertySummary.vue'
// import StepNavigation from '@/components/StepNavigation.vue'
// import StepIndicators from '@/components/StepIndicators.vue'  // adapte le chemin
import StepButtons from '@/components/StepButtons.vue'        // adapte le chemin
import L from 'leaflet';
import { nextTick } from 'vue';

export default {
    name: 'StepFour',

    components: {
        PropertySummary,
        // StepNavigation,
        StepButtons
    },

    props: {
        form: {
            type: Object,
            required: true
        },
        typesBien: {
            type: Array,
            default: () => []
        },
        loading: {
            type: Boolean,
            default: false
        },
        submitting: {
            type: Boolean,
            default: false
        }
    },

    emits: [
        'update:form',
        'getCurrentLocation',
        'prevStep',
        'submit'
    ],

    data() {
        return {
            validationChecks: {
                informations: false,
                photos: false,
                legal: false,
                terms: false
            }
        }
    },
    mounted() {
        // Initialisation de la carte si les coordonnées sont valides
        nextTick(() => {
            if (this.hasValidCoordinates) {
                const mapElement = document.getElementById('map');
                if (mapElement) {
                    this.initializeMap();
                } else {
                    console.error('L\'élément "map" n\'a pas été trouvé.');
                }
            }
        });
    },

    computed: {
        hasValidCoordinates() {
            const lat = parseFloat(this.form.latitude);
            const lng = parseFloat(this.form.longitude);
            return lat && lng && !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
        },


        mapUrl() {
            if (!this.hasValidCoordinates) return ''

            const lat = parseFloat(this.form.latitude)
            const lng = parseFloat(this.form.longitude)
            const offset = 0.01

            return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - offset},${lat - offset},${lng + offset},${lat + offset}&marker=${lat},${lng}`
        },

        isFullyValidated() {
            return Object.values(this.validationChecks).every(check => check === true)
        }
    },

    methods: {
        updateForm(field, value) {
            this.$emit('update:form', { [field]: value })
        },

        updateValidation(field, value) {
            this.validationChecks[field] = value
        },
        initializeMap() {
            const lat = parseFloat(this.form.latitude);
            const lng = parseFloat(this.form.longitude);

            // Vérifie que l'élément 'map' est bien présent dans le DOM
            const mapElement = document.getElementById('map');
            if (!mapElement) {
                console.error('L\'élément "map" est introuvable');
                return;
            }

            // Créer la carte en initialisant la vue avec les coordonnées
            const map = L.map('map').setView([lat, lng], 13);

            // Ajouter un fond de carte
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

            // Ajouter un marqueur à la position
            const marker = L.marker([lat, lng]).addTo(map);

            // Ajouter la possibilité de déplacer le marqueur
            marker.on('dragend', (event) => {
                const newLat = event.target.getLatLng().lat;
                const newLng = event.target.getLatLng().lng;

                this.form.latitude = newLat;
                this.form.longitude = newLng;
            });
        },
    }
}
</script>

<style scoped>
.map-preview {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    background: #f8f9fa;
}

.validation-checklist .form-check {
    padding: 8px 12px;
    border-radius: 6px;
    transition: background-color 0.2s ease;
}

.validation-checklist .form-check:hover {
    background-color: #f8f9fa;
}

.validation-checklist .form-check-input:checked~.form-check-label {
    color: #28a745;
    font-weight: 500;
}

.card-header h6 {
    margin: 0;
    color: #495057;
}

.alert {
    border-radius: 8px;
}

.spinner-border-sm {
    width: 1rem;
    height: 1rem;
}

@media (max-width: 768px) {

    .col-md-5,
    .col-md-2 {
        margin-bottom: 1rem;
    }
}
</style>