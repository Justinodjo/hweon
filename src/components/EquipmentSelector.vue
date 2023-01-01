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
                                :checked="isChecked('activites', activite.key)"
                                @change="updateEquipement('activites', activite.key, $event.target.checked)">
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
                                :checked="isChecked('modesPaiement', mode.key)"
                                @change="updateEquipement('modesPaiement', mode.key, $event.target.checked)">
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
                                :checked="isChecked('languesPersonnel', langue.key)"
                                @change="updateEquipement('languesPersonnel', langue.key, $event.target.checked)">
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
                                :checked="isChecked('typesClimatisation', climatisation.key)"
                                @change="updateEquipement('typesClimatisation', climatisation.key, $event.target.checked)">
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
                                :checked="isChecked('securites', securite.key)"
                                @change="updateEquipement('securites', securite.key, $event.target.checked)">
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
                                :checked="isChecked('typeGarage', garage.key)"
                                @change="updateEquipement('typeGarage', garage.key, $event.target.checked)">
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
                                :checked="isChecked('typeCuisine', cuisine.key)"
                                @change="updateEquipement('typeCuisine', cuisine.key, $event.target.checked)">
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
                                :checked="isChecked('typeVue', vue.key)"
                                @change="updateEquipement('typeVue', vue.key, $event.target.checked)">
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
                                :checked="isChecked('services', service.key)"
                                @change="updateEquipement('services', service.key, $event.target.checked)">
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
                        Équipements sélectionnés ({{ selectedEquipmentsCount }})
                    </h6>
                    <div class="selected-equipment-tags">
                        <span v-for="(items, category) in equipements" :key="category"
                            class="badge bg-primary me-2 mb-2">
                            <span v-for="key in items" :key="key" class="badge bg-primary me-2 mb-2">
                                {{ getLabelForKey(category, key) }}
                                <button type="button" class="btn-close btn-close-white ms-2"
                                    @click="updateEquipement(category, key, false)" aria-label="Supprimer"></button>
                            </span>
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
            default: () => ({
                services: [],
                securites: [],
                activites: [],
                modesPaiement: [],
                languesPersonnel: [],
                typeCuisine: [],
                typesClimatisation: [],
                typeGarage: [],
                typeVue: []
            })
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
            type: Array,
            default: () => []
        },
        typeVue: {
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
        },
        selectedEquipmentsCount() {
            return Object.values(this.equipements)
                .reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
        }
    },

    methods: {
        isChecked(category, key) {
            const categoryArray = this.equipements[category];
            return Array.isArray(categoryArray) && categoryArray.includes(key);
        },
        updateEquipement(category, key, checked) {
            const newEquipements = { ...this.equipements };

            // Initialiser le tableau si nécessaire
            if (!Array.isArray(newEquipements[category])) {
                newEquipements[category] = [];
            }

            if (checked) {
                // Ajouter si pas déjà présent
                if (!newEquipements[category].includes(key)) {
                    newEquipements[category] = [...newEquipements[category], key];
                }
            } else {
                // Retirer
                newEquipements[category] = newEquipements[category].filter(k => k !== key);
            }

            console.log(`Updated ${category}:`, newEquipements[category]);
            this.$emit('update:equipements', newEquipements);
        },
        getLabelForKey(category, key) {
            const categoryMap = {
                services: this.services,
                securites: this.securites,
                activites: this.activites,
                modesPaiement: this.modesPaiement,
                languesPersonnel: this.languesPersonnel,
                typeCuisine: this.typeCuisine,
                typesClimatisation: this.typesClimatisation,
                typeGarage: this.typeGarage,
                typeVue: this.typeVue
            };

            const items = categoryMap[category] || [];
            const item = items.find(i => i.key === key);
            return item ? item.label : key;
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