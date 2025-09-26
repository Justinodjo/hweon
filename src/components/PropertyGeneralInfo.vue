// components/PropertyGeneralInfo.vue
<template>
    <div class="card mb-4">
        <div class="card-header">
            <h6>Informations générales</h6>
        </div>
        <div class="card-body">
            <div class="row g-3">
                <!-- Statut de disponibilité -->
                <div class="col-md-6" v-if="!isAgricole">
                    <label class="form-label">
                        <i class="bi bi-toggle-on me-2"></i>
                        Statut du bien
                    </label>
                    <select class="form-select" :value="form.status ? 'true' : 'false'"
                        @change="updateForm('status', $event.target.value === 'true')">
                        <option value="true">Disponible</option>
                        <option value="false">Non disponible</option>
                    </select>
                    <small class="text-muted">
                        Disponibilité actuelle du bien
                    </small>
                </div>

                <!-- Type de transaction -->
                <div class="col-md-6">
                    <label class="form-label">
                        <i class="bi bi-cash-stack me-2"></i>
                        Type de transaction
                    </label>
                    <select class="form-select" :value="form.aVendre ? 'true' : 'false'"
                        @change="updateForm('aVendre', $event.target.value === 'true')">
                        <option value="true">À vendre</option>
                        <option value="false">À louer</option>
                    </select>
                    <small class="text-muted">
                        Nature de l'offre immobilière
                    </small>
                </div>
            </div>

            <!-- Informations spécifiques au terrain agricole -->
            <div v-if="isAgricole" class="mt-4">
                <div class="card bg-light">
                    <div class="card-header">
                        <h6 class="mb-0">
                            <i class="bi bi-tree me-2"></i>
                            Informations agricoles
                        </h6>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Surface de vente (hectares)</label>
                                <input type="number" class="form-control" :value="form.surfaceVente"
                                    @input="updateForm('surfaceVente', parseFloat($event.target.value) || null)" min="0"
                                    step="0.01" placeholder="Ex: 2.5">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Type de culture</label>
                                <input type="text" class="form-control" :value="form.culture"
                                    @input="updateForm('culture', $event.target.value)"
                                    placeholder="Ex: Céréales, Maraîchage...">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Résumé visuel de l'état -->
            <div v-if="form.etatGeneral" class="mt-4">
                <div class="card border-left-status" :class="getStatusCardClass()">
                    <div class="card-body py-2">
                        <div class="d-flex align-items-center">
                            <i :class="getStatusIcon()" class="me-3 fs-4"></i>
                            <div>
                                <h6 class="mb-1">État du bien: {{ getEtatLabel() }}</h6>
                                <small class="text-muted">{{ getEtatDescription() }}</small>
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
    name: 'PropertyGeneralInfo',

    props: {
        form: {
            type: Object,
            required: true
        },
        etatsGeneral: {
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
        }
    },

    emits: ['update:form'],

    computed: {
        currentYear() {
            return new Date().getFullYear()
        }
    },

    methods: {
        updateForm(field, value) {
            this.$emit('update:form', { [field]: value })
        },

        getEtatLabel() {
            const etat = this.etatsGeneral.find(e => e.key === this.form.etatGeneral)
            return etat ? etat.label : 'Non défini'
        },

        getEtatDescription() {
            const descriptions = {
                'EXCELLENT': 'Bien en parfait état, prêt à habiter',
                'TRES_BON': 'Très bon état général, quelques finitions possibles',
                'BON': 'Bon état avec quelques travaux d\'entretien',
                'CORRECT': 'État correct, travaux de rénovation recommandés',
                'A_RENOVER': 'Travaux de rénovation importants nécessaires',
                'A_RESTAURER': 'Restauration complète requise'
            }
            return descriptions[this.form.etatGeneral] || 'État non précisé'
        },

        getStatusIcon() {
            const icons = {
                'EXCELLENT': 'bi-star-fill text-success',
                'TRES_BON': 'bi-check-circle-fill text-success',
                'BON': 'bi-check-circle text-primary',
                'CORRECT': 'bi-exclamation-circle text-warning',
                'A_RENOVER': 'bi-tools text-warning',
                'A_RESTAURER': 'bi-hammer text-danger'
            }
            return icons[this.form.etatGeneral] || 'bi-question-circle text-muted'
        },

        getStatusCardClass() {
            const classes = {
                'EXCELLENT': 'border-success',
                'TRES_BON': 'border-success',
                'BON': 'border-primary',
                'CORRECT': 'border-warning',
                'A_RENOVER': 'border-warning',
                'A_RESTAURER': 'border-danger'
            }
            return classes[this.form.etatGeneral] || 'border-muted'
        }
    }
}
</script>

<style scoped>
.card-header h6 {
    margin: 0;
    color: #495057;
}

.border-left-status {
    border-left: 4px solid !important;
}

.border-left-status.border-success {
    border-left-color: #28a745 !important;
    background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
}

.border-left-status.border-primary {
    border-left-color: #007bff !important;
    background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
}

.border-left-status.border-warning {
    border-left-color: #ffc107 !important;
    background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
}

.border-left-status.border-danger {
    border-left-color: #dc3545 !important;
    background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
}

.bg-light .card-header {
    background-color: #e9ecef;
    border-bottom: 1px solid #dee2e6;
}

.form-label {
    font-weight: 500;
    color: #495057;
}

.text-muted {
    font-size: 0.875rem;
}

@media (max-width: 768px) {
    .row.g-3>div {
        margin-bottom: 1rem;
    }
}
</style>