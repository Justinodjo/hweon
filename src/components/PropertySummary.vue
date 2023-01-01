// components/PropertySummary.vue
<template>
    <div class="card mb-4">
        <div class="card-header">
            <h6>
                <i class="bi bi-clipboard-check me-2"></i>
                Récapitulatif du bien
            </h6>
        </div>
        <div class="card-body">
            <div class="row">
                <!-- Informations principales -->
                <div class="col-md-6">
                    <div class="summary-section">
                        <h6 class="section-title">Informations principales</h6>

                        <div class="info-item">
                            <i class="bi bi-house-door me-2 text-primary"></i>
                            <span class="label">Nom:</span>
                            <strong>{{ form.nom || 'Non défini' }}</strong>
                        </div>

                        <div class="info-item">
                            <i class="bi bi-tag me-2 text-primary"></i>
                            <span class="label">Type:</span>
                            <strong>{{ getTypeBienName() }}</strong>
                        </div>

                        <div class="info-item">
                            <i class="bi bi-geo-alt me-2 text-primary"></i>
                            <span class="label">Adresse:</span>
                            <strong>{{ form.adresse || 'Non définie' }}</strong>
                        </div>

                        <div class="info-item">
                            <i class="bi bi-currency-euro me-2 text-success"></i>
                            <span class="label">Prix:</span>
                            <strong>{{ formatPrice(form.prix) }}</strong>
                        </div>

                        <div class="info-item">
                            <i class="bi bi-arrows-angle-expand me-2 text-info"></i>
                            <span class="label">Superficie:</span>
                            <strong>{{ form.superficie || 0 }} m²</strong>
                        </div>
                    </div>
                </div>

                <!-- Détails complémentaires -->
                <div class="col-md-6">
                    <div class="summary-section">
                        <h6 class="section-title">Détails</h6>

                        <div class="info-item">
                            <i class="bi bi-door-open me-2 text-secondary"></i>
                            <span class="label">Pièces:</span>
                            <strong>{{ getTotalRooms() }}</strong>
                        </div>

                        <div v-if="form.etatGeneral" class="info-item">
                            <i class="bi bi-house-check me-2 text-warning"></i>
                            <span class="label">État:</span>
                            <strong>{{ formatEtatGeneral() }}</strong>
                        </div>

                        <div v-if="form.anneeConstruction" class="info-item">
                            <i class="bi bi-calendar3 me-2 text-muted"></i>
                            <span class="label">Année:</span>
                            <strong>{{ form.anneeConstruction }}</strong>
                        </div>

                        <div class="info-item">
                            <i class="bi bi-toggle-on me-2 text-success"></i>
                            <span class="label">Statut:</span>
                            <strong>{{ form.status ? 'Disponible' : 'Non disponible' }}</strong>
                        </div>

                        <div class="info-item">
                            <i class="bi bi-cash-stack me-2 text-primary"></i>
                            <span class="label">Transaction:</span>
                            <strong>{{ form.aVendre ? 'À vendre' : 'À louer' }}</strong>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Équipements sélectionnés -->
            <div v-if="hasEquipments && !isAgricole" class="mt-4">
                <h6 class="section-title">
                    <i class="bi bi-tools me-2"></i>
                    Équipements sélectionnés
                </h6>
                <div class="equipment-tags">
                    <span v-for="equipment in selectedEquipments" :key="equipment" class="badge bg-secondary me-2 mb-2">
                        {{ formatEquipmentName(equipment) }}
                    </span>
                </div>
                <div v-if="form.autresEquipements" class="mt-2">
                    <small class="text-muted">
                        <strong>Autres:</strong> {{ form.autresEquipements }}
                    </small>
                </div>
            </div>

            <!-- Pièces détaillées -->
            <div v-if="form.detailsBiensImmobiliers && form.detailsBiensImmobiliers.length > 0" class="mt-4">
                <h6 class="section-title">
                    <i class="bi bi-list-ul me-2"></i>
                    Pièces détaillées
                </h6>
                <div class="rooms-list">
                    <div v-for="(detail, index) in form.detailsBiensImmobiliers" :key="index" class="room-item">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <i :class="getRoomIcon(detail.typeDetailsBiens)" class="me-2"></i>
                                <strong>{{ detail.nomdetails || formatRoomType(detail.typeDetailsBiens) }}</strong>
                                <span v-if="detail.nombre > 1" class="text-muted"> ({{ detail.nombre }})</span>
                            </div>
                            <div v-if="detail.prix" class="text-success">
                                {{ formatPrice(detail.prix) }}
                            </div>
                        </div>
                        <div v-if="detail.description" class="room-description">
                            <small class="text-muted">{{ detail.description }}</small>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Géolocalisation -->
            <div class="mt-4">
                <h6 class="section-title">
                    <i class="bi bi-geo me-2"></i>
                    Géolocalisation
                </h6>
                <div v-if="hasValidCoordinates" class="location-info">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-check-circle text-success me-2"></i>
                        <span>Position GPS définie:</span>
                        <code class="ms-2">{{ form.latitude }}, {{ form.longitude }}</code>
                    </div>
                </div>
                <div v-else class="location-info">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-x-circle text-warning me-2"></i>
                        <span class="text-warning">Position GPS non définie</span>
                    </div>
                </div>
            </div>

            <!-- Observations -->
            <div v-if="form.observations" class="mt-4">
                <h6 class="section-title">
                    <i class="bi bi-chat-left-text me-2"></i>
                    Observations
                </h6>
                <div class="observations-box">
                    <p class="mb-0">{{ form.observations }}</p>
                </div>
            </div>

            <!-- Statistiques rapides -->
            <div class="mt-4">
                <div class="row text-center">
                    <div class="col-md-3">
                        <div class="stat-card">
                            <div class="stat-number">{{ formatPrice(form.prix, false) }}</div>
                            <div class="stat-label">Prix {{ form.aVendre ? 'de vente' : 'de location' }}</div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card">
                            <div class="stat-number">{{ form.superficie || 0 }}</div>
                            <div class="stat-label">m² de superficie</div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card">
                            <div class="stat-number">{{ getTotalRooms() }}</div>
                            <div class="stat-label">Pièces</div>
                        </div>
                    </div>
                    <div class="col-md-3" v-if="!isAgricole">
                        <div class="stat-card">
                            <div class="stat-number">{{ getEquipmentCount() }}</div>
                            <div class="stat-label">Équipements</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PropertySummary',

    props: {
        form: {
            type: Object,
            required: true
        },
        typesBien: {
            type: Array,
            default: () => []
        },
        hasValidCoordinates: {
            type: Boolean,
            default: false
        },
        isAgricole: {   // <----- AJOUT OBLIGATOIRE
            type: Boolean,
            default: false
        }
    },

    computed: {
        hasEquipments() {
            return this.form.equipements && Object.keys(this.form.equipements).length > 0
        },

        selectedEquipments() {
            if (!this.form.equipements) return []
            return Object.keys(this.form.equipements).filter(key => this.form.equipements[key])
        }
    },

    methods: {
        getTypeBienName() {
            const type = this.typesBien.find(t => Number(t.id) === Number(this.form.typeBiensImmobiliereId));

            return type ? type.nomTypeBiensImmo : 'Non défini';
        },

        formatPrice(price, withCurrency = true) {
            if (!price) return 'Non défini'

            if (!withCurrency) {
                return new Intl.NumberFormat('fr-FR').format(price)
            }

            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0
            }).format(price)
        },

        formatEtatGeneral() {
            if (!this.form.etatGeneral) return 'Non défini'

            const labels = {
                'EXCELLENT': 'Excellent',
                'TRES_BON': 'Très bon',
                'BON': 'Bon',
                'CORRECT': 'Correct',
                'A_RENOVER': 'À rénover',
                'A_RESTAURER': 'À restaurer'
            }

            return labels[this.form.etatGeneral] || this.form.etatGeneral
        },

        getTotalRooms() {
            if (!this.form.detailsBiensImmobiliers) return 0
            return this.form.detailsBiensImmobiliers.reduce((total, detail) => {
                return total + (detail.nombre || 1)
            }, 0)
        },

        getEquipmentCount() {
            return this.selectedEquipments.length
        },

        formatEquipmentName(equipment) {
            return equipment.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase())
        },

        formatRoomType(type) {
            const labels = {
                'CHAMBRE': 'Chambre',
                'SALLE_BAIN': 'Salle de bain',
                'SALON': 'Salon',
                'CUISINE': 'Cuisine',
                'GARAGE': 'Garage',
                'JARDIN': 'Jardin',
                'TERRASSE': 'Terrasse',
                'BALCON': 'Balcon',
                'CAVE': 'Cave',
                'GRENIER': 'Grenier'
            }
            return labels[type] || type
        },

        getRoomIcon(roomType) {
            const icons = {
                'CHAMBRE': 'bi-moon text-primary',
                'SALLE_BAIN': 'bi-droplet text-info',
                'SALON': 'bi-tv text-success',
                'CUISINE': 'bi-cup-hot text-warning',
                'GARAGE': 'bi-car-front text-secondary',
                'JARDIN': 'bi-tree text-success',
                'TERRASSE': 'bi-sun text-warning',
                'BALCON': 'bi-building text-info'
            }
            return icons[roomType] || 'bi-house text-muted'
        }
    }
}
</script>

<style scoped>
.summary-section {
    margin-bottom: 1.5rem;
}

.section-title {
    color: #495057;
    font-weight: 600;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e9ecef;
}

.info-item {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
    padding: 8px;
    border-radius: 6px;
    background: #f8f9fa;
}

.info-item .label {
    min-width: 80px;
    margin-right: 8px;
    color: #6c757d;
}

.equipment-tags {
    line-height: 1.8;
}

.rooms-list {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1rem;
}

.room-item {
    padding: 8px 0;
    border-bottom: 1px solid #e9ecef;
}

.room-item:last-child {
    border-bottom: none;
}

.room-description {
    margin-top: 4px;
    padding-left: 24px;
}

.location-info {
    background: #f8f9fa;
    border-radius: 6px;
    padding: 12px;
}

.observations-box {
    background: #f8f9fa;
    border-left: 4px solid #007bff;
    border-radius: 6px;
    padding: 1rem;
}

.stat-card {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    transition: transform 0.2s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.stat-number {
    font-size: 1.5rem;
    font-weight: bold;
    color: #007bff;
    margin-bottom: 0.25rem;
}

.stat-label {
    font-size: 0.875rem;
    color: #6c757d;
    font-weight: 500;
}

.card-header h6 {
    margin: 0;
    color: #495057;
}

@media (max-width: 768px) {
    .info-item {
        flex-direction: column;
        align-items: flex-start;
    }

    .info-item .label {
        min-width: auto;
        margin-right: 0;
        margin-bottom: 4px;
    }

    .stat-card {
        margin-bottom: 0.5rem;
    }
}
</style>