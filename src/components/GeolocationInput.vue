// components/GeolocationInput.vue
<template>
    <div class="card mb-4">
        <div class="card-header">
            <h6>Position GPS</h6>
        </div>
        <div class="card-body">
            <div class="geolocation-section">
                <div class="row g-3 align-items-end">
                    <div class="col-md-5">
                        <label class="form-label">Latitude</label>
                        <input :value="latitude"
                            @input="$emit('update:latitude', parseFloat($event.target.value) || null)"
                            class="form-control" placeholder="Latitude" type="number" step="0.000001" />
                    </div>
                    <div class="col-md-5">
                        <label class="form-label">Longitude</label>
                        <input :value="longitude"
                            @input="$emit('update:longitude', parseFloat($event.target.value) || null)"
                            class="form-control" placeholder="Longitude" type="number" step="0.000001" />
                    </div>
                    <div class="col-md-2">
                        <button type="button" class="btn btn-primary w-100" @click="$emit('getCurrentLocation')"
                            :disabled="loading" title="Obtenir ma position actuelle">
                            <i class="bi bi-geo-alt" v-if="!loading"></i>
                            <div class="spinner-border spinner-border-sm" v-else></div>
                        </button>
                    </div>
                    <div class="col-md-2">
                        <button type="button" class="btn btn-secondary w-100" @click="resetCoordinates"
                            title="Réinitialiser la position">
                            <i class="bi bi-arrow-clockwise" v-if="!loading"></i>
                            <div class="spinner-border spinner-border-sm" v-else></div>
                        </button>
                    </div>
                </div>

                <!-- Status de géolocalisation -->
                <div v-if="geolocationStatus !== 'idle'" class="mt-3">
                    <div v-if="geolocationStatus === 'success'" class="alert alert-success d-flex align-items-center"
                        role="alert">
                        <i class="bi bi-check-circle me-2"></i>
                        Position obtenue avec succès
                    </div>
                    <div v-if="geolocationStatus === 'error'" class="alert alert-danger d-flex align-items-center"
                        role="alert">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        Erreur: {{ geolocationError }}
                    </div>
                    <div v-if="geolocationStatus === 'loading'" class="alert alert-info d-flex align-items-center"
                        role="alert">
                        <div class="spinner-border spinner-border-sm me-2"></div>
                        Obtention de la position en cours...
                    </div>
                </div>

                <!-- Aperçu carte -->
                <div v-if="latitude && longitude" class="mt-3">
                    <div class="map-preview">
                        <p><strong>Aperçu de la position:</strong></p>
                        <iframe :src="mapUrl" width="100%" height="400" frameborder="1" scrolling="yes"
                            class="rounded border"></iframe>
                        <small class="text-muted">
                            Coordonnées: {{ latitude }}, {{ longitude }}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import L from 'leaflet';
export default {
    name: 'GeolocationInput',
    data() {
        return {
            map: null,
            marker: null,
        };
    },
    props: {
        latitude: {
            type: [Number, String],
            default: null
        },
        longitude: {
            type: [Number, String],
            default: null
        },
        loading: {
            type: Boolean,
            default: false
        },
        geolocationStatus: {
            type: String,
            default: 'idle',
            validator: (value) => ['idle', 'loading', 'success', 'error', 'denied', 'unsupported'].includes(value)
        },
        geolocationError: {
            type: String,
            default: ''
        }
    },

    emits: [
        'update:latitude',
        'update:longitude',
        'getCurrentLocation'
    ],
    watch: {
        geolocationStatus(newStatus) {
            if (newStatus === 'error') {
                if (this.geolocationError === 'denied') {
                    this.$emit('notify', 'La géolocalisation a été refusée.');
                } else if (this.geolocationError === 'unsupported') {
                    this.$emit('notify', 'La géolocalisation n\'est pas supportée par ce navigateur.');
                }
            }
        }
    },
    computed: {
        mapUrl() {
            if (!this.latitude || !this.longitude) return ''

            const lat = parseFloat(this.latitude)
            const lng = parseFloat(this.longitude)
            const offset = 0.01

            return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - offset},${lat - offset},${lng + offset},${lat + offset}&marker=${lat},${lng}`
        },

        coordinatesValid() {
            return this.latitude && this.longitude &&
                !isNaN(parseFloat(this.latitude)) &&
                !isNaN(parseFloat(this.longitude))
        },
        resetCoordinates() {
            this.$emit('update:latitude', null);
            this.$emit('update:longitude', null);
        },

    },
    methods: {
        // Initialiser la carte Leaflet
        initializeMap() {
            const map = L.map('map').setView([this.latitude || 48.8566, this.longitude || 2.3522], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Créer un marqueur à la position de l'utilisateur
            this.marker = L.marker([this.latitude || 48.8566, this.longitude || 2.3522], {
                draggable: true  // Marqueur déplaçable
            }).addTo(map);

            this.marker.on('dragend', (event) => {
                const newLat = event.target.getLatLng().lat;
                const newLng = event.target.getLatLng().lng;
                this.$emit('update:latitude', newLat);
                this.$emit('update:longitude', newLng);
            });

            this.map = map;
        },
    }
}
</script>

<style scoped>
.geolocation-section {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #e9ecef;
}

.map-preview {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    background: #f8f9fa;
    padding: 10px;
}

.card-header h6 {
    margin: 0;
    color: #495057;
}

.spinner-border-sm {
    width: 1rem;
    height: 1rem;
}

.alert {
    margin-bottom: 0;
    border-radius: 6px;
}

@media (max-width: 768px) {

    .col-md-5,
    .col-md-2 {
        margin-bottom: 1rem;
    }

    .btn.w-100 {
        width: 100% !important;
    }
}
</style>