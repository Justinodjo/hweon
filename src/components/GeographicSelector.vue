// components/GeographicSelector.vue
<template>
    <div class="card mb-4">
        <div class="card-header">
            <h6>Localisation</h6>
        </div>
        <div class="card-body">


            <!-- Sélecteurs géographiques -->
            <div class="row g-3">
                <!-- Pays -->
                <div class="col-12 col-md-6 col-lg-4">
                    <label for="paysSelect" class="form-label">Pays *</label>
                    <select class="form-select" :value="selectedPays" @change="handlePaysChange($event.target.value)"
                        id="paysSelect">
                        <option value="">Sélectionnez un pays</option>
                        <option v-for="pa in pays" :key="pa.id" :value="pa.id">
                            {{ pa.libelle }}
                        </option>
                    </select>
                </div>

                <!-- Département -->
                <div class="col-12 col-md-6 col-lg-4">
                    <label class="form-label">Département *</label>
                    <select class="form-select" :value="selectedDepartement"
                        @change="handleDepartementChange($event.target.value)" :disabled="!selectedPays">
                        <option value="">Sélectionnez un département</option>
                        <option v-for="d in departements" :key="d.idDepartement || d.id"
                            :value="d.idDepartement || d.id">
                            {{ d.libelle }}
                        </option>
                        <option value="unknown">Autre (Non répertorié)</option>
                    </select>
                </div>

                <!-- Commune -->
                <div class="col-12 col-md-6 col-lg-4">
                    <label class="form-label">Commune</label>
                    <select class="form-select" :value="selectedCommune"
                        @change="handleCommuneChange($event.target.value)" :disabled="!selectedDepartement">
                        <option value="">Sélectionnez une commune</option>
                        <option v-for="c in communes" :key="c.idCommune || c.id" :value="c.idCommune || c.id">
                            {{ c.libelle }}
                        </option>
                        <option value="unknown">Autre (Non répertorié)</option>
                    </select>
                </div>

                <!-- Arrondissement -->
                <div class="col-12 col-md-6 col-lg-4">
                    <label class="form-label">Arrondissement</label>
                    <select class="form-select" :value="selectedArrondissement"
                        @change="handleArrondissementChange($event.target.value)" :disabled="!selectedCommune">
                        <option value="">Sélectionnez un arrondissement</option>
                        <option v-for="a in arrondissements" :key="a.idArrondissement || a.id"
                            :value="a.idArrondissement || a.id">
                            {{ a.libelle }}
                        </option>
                        <option value="unknown">Autre (Non répertorié)</option>
                    </select>
                </div>

                <!-- Quartier -->
                <div class="col-12 col-md-6 col-lg-4">
                    <label class="form-label">Quartier</label>
                    <select class="form-select" :value="selectedQuartier"
                        @change="handleQuartierChange($event.target.value)" :disabled="!selectedArrondissement">
                        <option value="">Sélectionnez un quartier</option>
                        <option v-for="q in quartiers" :key="q.idQuartier || q.id" :value="q.idQuartier || q.id">
                            {{ q.libelle }}
                        </option>
                        <option value="unknown">Autre (Non répertorié)</option>
                    </select>
                </div>
            </div>
            <!-- Adresse complète -->
            <div class="mb-3">
                <label class="form-label">Adresse *</label>
                <input :value="adresse" :placeholder="adresseComplete"
                    @input="$emit('updateAddresse', $event.target.value)" @blur="$emit('geocodeAddress')"
                    class="form-control" />
                <button type="button" class="btn btn-primary btn-sm mt-2" @click="$emit('geocodeAddress')">
                    <i class="bi bi-search"></i> Rechercher coordonnées
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GeographicSelector',

    props: {
        adresse: {
            type: String,
            default: ''
        },
        selectedPays: {
            type: [String, Number],
            default: null
        },
        selectedDepartement: {
            type: [String, Number],
            default: null
        },
        selectedCommune: {
            type: [String, Number],
            default: null
        },
        selectedArrondissement: {
            type: [String, Number],
            default: null
        },
        selectedQuartier: {
            type: [String, Number],
            default: null
        },
        pays: {
            type: Array,
            default: () => []
        },
        departements: {
            type: Array,
            default: () => []
        },
        communes: {
            type: Array,
            default: () => []
        },
        arrondissements: {
            type: Array,
            default: () => []
        },
        quartiers: {
            type: Array,
            default: () => []
        }
    },

    emits: [
        'update:selectedPays',
        'update:selectedDepartement',
        'update:selectedCommune',
        'update:selectedArrondissement',
        'update:selectedQuartier',
        'paysChange',
        'departementChange',
        'communeChange',
        'arrondissementChange',
        'quartierChange',
        'geocodeAddress',
        'updateAddresse'
    ],

    computed: {
        adresseComplete() {
            const pays = this.pays.find(p => p.id === this.selectedPays)
            const departement = this.departements.find(d => (d.id || d.idDepartement) === this.selectedDepartement)
            const commune = this.communes.find(c => (c.id || c.idCommune) === this.selectedCommune)
            const arrondissement = this.arrondissements.find(a => (a.id || a.idArrondissement) === this.selectedArrondissement)
            const quartier = this.quartiers.find(q => (q.id || q.idQuartier) === this.selectedQuartier)

            return [
                quartier?.libelle,
                arrondissement?.libelle,
                commune?.libelle,
                departement?.libelle,
                pays?.libelle
            ].filter(Boolean).join(', ')
        }
    },

    methods: {
        handlePaysChange(value) {
            this.$emit('update:selectedPays', value)
            this.$emit('paysChange')
        },

        handleDepartementChange(value) {
            this.$emit('update:selectedDepartement', value)
            this.$emit('departementChange')
        },

        handleCommuneChange(value) {
            this.$emit('update:selectedCommune', value)
            this.$emit('communeChange')
        },

        handleArrondissementChange(value) {
            this.$emit('update:selectedArrondissement', value)
            this.$emit('arrondissementChange')
        },

        handleQuartierChange(value) {
            this.$emit('update:selectedQuartier', value)
            this.$emit('quartierChange')
        }
    }
}
</script>

<style scoped>
.card-header h6 {
    margin: 0;
    color: #495057;
}

@media (max-width: 768px) {

    .row.g-3>.col-md-6,
    .row.g-3>.col-lg-4 {
        margin-bottom: 1rem;
    }
}
</style>