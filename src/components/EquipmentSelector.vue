// components/EquipmentSelector.vue
<template>
    <div class="card mb-4">
        <div class="card-header">
            <h6>Équipements et commodités</h6>
        </div>
        <div class="card-body">
            <div class="row" v-if="!isAgricole">
                <!-- Activités -->
                <div class="col-md-6 mb-4">
                    <h6 class="section-title">
                        <i class="bi bi-activity me-2"></i>
                        Activités
                    </h6>
                    <div class="equipment-grid">
                        <div v-for="activite in activites" :key="activite.key" class="form-check form-check-card">
                            <input class="form-check-input" type="checkbox" :id="`activite-${activite.key}`"
                                :checked="equipements[activite.key]"
                                @change="updateEquipement(activite.key, $event.target.checked)">
                            <label class="form-check-label" :for="`activite-${activite.key}`">
                                {{ activite.label }}
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Modes de paiement -->
                <div class="col-md-6 mb-4">
                    <h6 class="section-title">
                        <i class="bi bi-credit-card me-2"></i>
                        Modes de paiement
                    </h6>
                    <div class="equipment-grid">
                        <div v-for="mode in modesPaiement" :key="mode.key" class="form-check form-check-card">
                            <input class="form-check-input" type="checkbox" :id="`paiement-${mode.key}`"
                                :checked="equipements[mode.key]"
                                @change="updateEquipement(mode.key, $event.target.checked)">
                            <label class="form-check-label" :for="`paiement-${mode.key}`">
                                {{ mode.label }}
                            </label>
                        </div>
                    </div>
                </div>
                <!-- Climatisations -->
                <div class="col-md-6 mb-4">
                    <h6 class="section-title">
                        <i class="bi bi-thermometer-half me-2"></i>
                        Langues du personnel
                    </h6>
                    <div class="equipment-grid">
                        <div v-for="langue in languesPersonnel" :key="langue.key" class="form-check form-check-card">
                            <input class="form-check-input" type="checkbox" :id="`langue-${langue.key}`"
                                :checked="equipements[langue.key]"
                                @change="updateEquipement(langue.key, $event.target.checked)">
                            <label class="form-check-label" :for="`langue-${langue.key}`">
                                {{ langue.label }}
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Climatisations -->
                <div class="col-md-6 mb-4">
                    <h6 class="section-title">
                        <i class="bi bi-thermometer-half me-2"></i>
                        Climatisations
                    </h6>
                    <div class="equipment-grid">
                        <div v-for="climatisation in typesClimatisation" :key="climatisation.key"
                            class="form-check form-check-card">
                            <input class="form-check-input" type="checkbox" :id="`climat-${climatisation.key}`"
                                :checked="equipements[climatisation.key]"
                                @change="updateEquipement(climatisation.key, $event.target.checked)">
                            <label class="form-check-label" :for="`climat-${climatisation.key}`">
                                {{ climatisation.label }}
                            </label>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-4">
                    <h6 class="section-title">
                        <i class="bi bi-shield-check me-2"></i>
                        Sécurité
                    </h6>
                    <div class="equipment-grid">
                        <div v-for="securite in securites" :key="securite.key" class="form-check form-check-card">
                            <input class="form-check-input" type="checkbox" :id="`securite-${securite.key}`"
                                :checked="equipements[securite.key]"
                                @change="updateEquipement(securite.key, $event.target.checked)">
                            <label class="form-check-label" :for="`securite-${securite.key}`">
                                {{ securite.label }}
                            </label>
                        </div>
                    </div>
                </div>
                <!-- Garages -->
                <div class="col-md-6 mb-4">
                    <h6 class="section-title">
                        <i class="bi bi-car-front me-2"></i>
                        Garages
                    </h6>
                    <div class="equipment-grid">
                        <div v-for="garage in typeGarage" :key="garage.key" class="form-check form-check-card">
                            <input class="form-check-input" type="checkbox" :id="`garage-${garage.key}`"
                                :checked="equipements[garage.key]"
                                @change="updateEquipement(garage.key, $event.target.checked)">
                            <label class="form-check-label" :for="`garage-${garage.key}`">
                                {{ garage.label }}
                            </label>
                        </div>
                    </div>
                </div>
                <!-- Cuisines -->
                <div class="col-md-6 mb-4">
                    <h6 class="section-title">
                        <i class="bi bi-car-front me-2"></i>
                        Cuisines
                    </h6>
                    <div class="equipment-grid">
                        <div v-for="cuisine in typeCuisine" :key="cuisine.key" class="form-check form-check-card">
                            <input class="form-check-input" type="checkbox" :id="`garage-${cuisine.key}`"
                                :checked="equipements[cuisine.key]"
                                @change="updateEquipement(cuisine.key, $event.target.checked)">
                            <label class="form-check-label" :for="`garage-${cuisine.key}`">
                                {{ cuisine.label }}
                            </label>
                        </div>
                    </div>
                </div>
                <!-- Cuisines -->
                <div class="col-md-6 mb-4">
                    <h6 class="section-title">
                        <i class="bi bi-car-front me-2"></i>
                        Vues
                    </h6>
                    <div class="equipment-grid">
                        <div v-for="vue in typeVue" :key="vue.key" class="form-check form-check-card">
                            <input class="form-check-input" type="checkbox" :id="`garage-${vue.key}`"
                                :checked="equipements[vue.key]"
                                @change="updateEquipement(vue.key, $event.target.checked)">
                            <label class="form-check-label" :for="`garage-${vue.key}`">
                                {{ vue.label }}
                            </label>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-4">
                    <h6 class="section-title">
                        <i class="bi bi-tools me-2"></i>
                        Services
                    </h6>
                    <div class="equipment-grid">
                        <div v-for="service in services" :key="service.key" class="form-check form-check-card">
                            <input class="form-check-input" type="checkbox" :id="`service-${service.key}`"
                                :checked="equipements[service.key]"
                                @change="updateEquipement(service.key, $event.target.checked)">
                            <label class="form-check-label" :for="`service-${service.key}`">
                                {{ service.label }}
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Services et sécurité -->
            <div class="row">

            </div>

            <!-- Autres équipements -->
            <div class="mt-4">
                <label class="form-label">
                    <i class="bi bi-plus-circle me-2"></i>
                    Autres équipements (texte libre)
                </label>
                <textarea class="form-control" :value="autresEquipements"
                    @input="$emit('update:autresEquipements', $event.target.value)" rows="3"
                    placeholder="Décrivez d'autres équipements non listés ci-dessus..."></textarea>
            </div>

            <!-- Résumé des équipements sélectionnés -->
            <div v-if="selectedEquipments.length > 0" class="mt-4">
                <div class="alert alert-info">
                    <h6 class="alert-heading">
                        <i class="bi bi-info-circle me-2"></i>
                        Équipements sélectionnés ({{ selectedEquipments.length }})
                    </h6>
                    <div class="selected-equipment-tags">
                        <span v-for="equipment in selectedEquipments" :key="equipment.key"
                            class="badge bg-primary me-2 mb-2">
                            {{ equipment.label }}
                            <button type="button" class="btn-close btn-close-white ms-2"
                                @click="updateEquipement(equipment.key, false)" aria-label="Supprimer"></button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'EquipmentSelector',

    props: {
        equipements: {
            type: Object,
            default: () => ({})
        },
        activites: {
            type: Array,
            default: () => []
        },
        modesPaiement: {
            type: Array,
            default: () => []
        },
        languesPersonnel: {
            type: Array,
            default: () => []
        },
        typesClimatisation: {
            type: Array,
            default: () => []
        },
        typeGarage: {
            type: Array,
            default: () => []
        },
        services: {
            type: Array,
            default: () => []
        },
        securites: {
            type: Array,
            default: () => []
        },
        autresEquipements: {
            type: String,
            default: ''
        },
        typeCuisine: {
            type: String,
            default: () => []
        },
        typeVue: {
            type: String,
            default: () => []
        },
        typesBien: {
            type: Array,
            default: () => []
        },
        isAgricole: {
            type: Boolean,
            default: false
        },
        isResidentiel: {
            type: Boolean,
            default: false
        },
    },

    emits: [
        'update:equipements',
        'update:autresEquipements'
    ],

    computed: {
        selectedEquipments() {
            const allEquipments = [
                ...this.activites,
                ...this.modesPaiement,
                ...this.languesPersonnel,
                ...this.typesClimatisation,
                ...this.typeGarage,
                ...this.services,
                ...this.securites,
                ...this.typeVue,
                ...this.typeCuisine,

            ]

            return allEquipments.filter(equipment => this.equipements[equipment.key])
        }
    },

    methods: {
        updateEquipement(key, value) {
            const newEquipements = { ...this.equipements }
            if (value) {
                newEquipements[key] = true
            } else {
                delete newEquipements[key]
            }
            this.$emit('update:equipements', newEquipements)
        }
    }
}
</script>

<style scoped>
.section-title {
    color: #495057;
    font-weight: 600;
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-bottom: 2px solid #e9ecef;
}

.equipment-grid {
    display: grid;
    gap: 8px;
}

.form-check-card {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 12px;
    transition: all 0.2s ease;
    position: relative;
}

.form-check-card:hover {
    background: #e9ecef;
    border-color: #007bff;
    transform: translateY(-1px);
}

.form-check-card .form-check-input:checked~.form-check-label {
    color: #007bff;
    font-weight: 500;
}

.form-check-card .form-check-input:checked {
    background-color: #007bff;
    border-color: #007bff;
}

.form-check-input {
    margin-top: 0;
}

.form-check-label {
    font-size: 0.9rem;
    cursor: pointer;
    margin-left: 8px;
}

.selected-equipment-tags {
    line-height: 1.8;
}

.badge {
    font-size: 0.8rem;
    padding: 6px 10px;
    display: inline-flex;
    align-items: center;
}

.btn-close-white {
    font-size: 0.7rem;
    opacity: 0.8;
}

.btn-close-white:hover {
    opacity: 1;
}

.alert-info {
    border-left: 4px solid #007bff;
    background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
}

.alert-heading {
    margin-bottom: 12px;
    color: #0c5460;
}

@media (max-width: 768px) {
    .equipment-grid {
        grid-template-columns: 1fr;
    }

    .form-check-card {
        padding: 10px;
    }

    .form-check-label {
        font-size: 0.85rem;
    }
}

@media (min-width: 769px) {
    .equipment-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
}
</style>