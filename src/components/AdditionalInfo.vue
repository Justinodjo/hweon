// components/AdditionalInfo.vue
<template>
    <div class="card mb-4">
        <div class="card-header">
            <h6>Informations complémentaires</h6>
        </div>
        <div class="card-body">
            <div class="row g-3">

                <!-- Charges mensuelles -->
                <div class="col-md-4">
                    <label class="form-label">
                        <i class="bi bi-cash-coin me-2"></i>
                        Charges mensuelles (€)
                    </label>
                    <input type="number" class="form-control" :value="form.chargesMensuelles"
                        @input="updateForm('chargesMensuelles', parseFloat($event.target.value) || null)" min="0"
                        step="10" placeholder="0">
                    <small class="form-text text-muted">
                        Montant mensuel estimé
                    </small>
                </div>

                <!-- Taxe foncière -->
                <div class="col-md-4">
                    <label class="form-label">
                        <i class="bi bi-receipt me-2"></i>
                        Taxe foncière annuelle (€)
                    </label>
                    <input type="number" class="form-control" :value="form.taxeFonciereAnnuelle"
                        @input="updateForm('taxeFonciereAnnuelle', parseFloat($event.target.value) || null)" min="0"
                        step="50" placeholder="0">
                    <small class="form-text text-muted">
                        Montant annuel de la taxe foncière
                    </small>
                </div>
            </div>

            <!-- Année de construction et nombre d'étages -->

            <!-- Observations -->
            <div class="mt-4">
                <label class="form-label">
                    <i class="bi bi-chat-left-text me-2"></i>
                    Observations particulières
                </label>
                <textarea class="form-control" :value="form.observations"
                    @input="updateForm('observations', $event.target.value)" rows="4"
                    placeholder="Remarques, travaux à prévoir, particularités du bien..."></textarea>
                <small class="form-text text-muted">
                    Informations supplémentaires importantes pour l'acheteur/locataire
                </small>
                <div class="mt-2">
                    <span class="text-muted small">
                        {{ characterCount }}/500 caractères
                    </span>
                </div>
            </div>

            <!-- Informations énergétiques avancées (optionnel) -->
            <div class="mt-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="mb-0">
                        <i class="bi bi-thermometer me-2"></i>
                        Informations énergétiques
                    </h6>
                    <button type="button" class="btn btn-outline-secondary btn-sm"
                        @click="showAdvancedEnergy = !showAdvancedEnergy">
                        <i :class="showAdvancedEnergy ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                        {{ showAdvancedEnergy ? 'Masquer' : 'Afficher' }}
                    </button>
                </div>

                <div v-if="showAdvancedEnergy" class="card bg-light">
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Type de chauffage</label>
                                <select class="form-select" :value="form.typeChauffage"
                                    @change="updateForm('typeChauffage', $event.target.value)">
                                    <option value="">Non renseigné</option>
                                    <option value="GAZ">Gaz</option>
                                    <option value="ELECTRIQUE">Électrique</option>
                                    <option value="FIOUL">Fioul</option>
                                    <option value="BOIS">Bois</option>
                                    <option value="POMPE_CHALEUR">Pompe à chaleur</option>
                                    <option value="SOLAIRE">Solaire</option>
                                    <option value="MIXTE">Mixte</option>
                                </select>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Isolation thermique</label>
                                <select class="form-select" :value="form.isolation"
                                    @change="updateForm('isolation', $event.target.value)">
                                    <option value="">Non renseigné</option>
                                    <option value="EXCELLENTE">Excellente</option>
                                    <option value="BONNE">Bonne</option>
                                    <option value="MOYENNE">Moyenne</option>
                                    <option value="FAIBLE">Faible</option>
                                    <option value="AUCUNE">Aucune</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AdditionalInfo',

    props: ['form', 'typesDPE', 'currentStep', 'activeStep'],

    emits: ['update:details', 'update:form', 'uploadResponse', 'update:preview'],

    data() {
        return {
            showAdvancedEnergy: false
        }
    },
    mounted() {
        console.log("typesDPE reçus :", this.typesDPE);
    },
    computed: {
        currentYear() {
            return new Date().getFullYear()
        },

        characterCount() {
            return this.form.observations?.length || 0
        }
    },

    watch: {
        'form.observations'(newVal) {
            // Limiter à 500 caractères
            if (newVal && newVal.length > 500) {
                this.updateForm('observations', newVal.substring(0, 500))
            }
        }
    },

    methods: {
        updateForm(field, value) {
            this.$emit('update:form', {
                ...this.form,
                [field]: value
            });
        },
        updateDetail(index, field, value) {
            const updated = [...this.detailsBiensImmobiliers]; updated[index] = { ...updated[index], [field]: value }; this.$emit('update:details', updated)
        },

    }
}
</script>

<style scoped>
.card-header h6 {
    margin: 0;
    color: #495057;
}

.form-label {
    font-weight: 500;
    color: #495057;
}

.form-text {
    font-size: 0.875rem;
}

.card.bg-light {
    border: 1px solid #e9ecef;
}

.btn-outline-secondary {
    border-color: #ced4da;
}

.btn-outline-secondary:hover {
    background-color: #6c757d;
    border-color: #6c757d;
}

.form-control:focus,
.form-select:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

@media (max-width: 768px) {
    .row.g-3>div {
        margin-bottom: 1rem;
    }

    .form-label {
        font-size: 0.9rem;
    }
}
</style>