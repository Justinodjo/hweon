// steps/StepTwo.vue
<template>
    <div class="mb-3">
        <h5 class="mb-4">Équipements</h5>

        <!-- ✅ Message pour les biens agricoles -->
        <div v-if="isAgricole" class="card mb-4 border-warning">
            <div class="card-header bg-warning bg-opacity-10">
                <h6 class="mb-0">
                    <i class="bi bi-info-circle me-2"></i>
                    Bien agricole sélectionné
                </h6>
            </div>
            <div class="card-body">
                <p class="mb-3">
                    Les équipements détaillés ne sont pas nécessaires pour les biens agricoles.
                </p>
                <p class="mb-0">
                    <strong>Si votre propriété comprend des bâtiments</strong> (maison, hangar, grange),
                    vous pouvez revenir à l'étape 1 pour changer la catégorie du bien.
                </p>
            </div>
        </div>

        <!-- Équipements et commodités -->
        <EquipmentSelector v-if="!isAgricole" :equipements="form.equipements" :activites="activites"
            :modesPaiement="modesPaiement" :typesClimatisation="typesClimatisation" :typeGarage="typeGarage"
            :services="services" :securites="securites" :typeCuisine="typeCuisine" :typeVue="typeVue"
            :languesPersonnel="languesPersonnel" :autresEquipements="form.autresEquipements" :typesBien="typesBien"
            @update:equipements="updateEquipements" @update:autresEquipements="updateAutresEquipements" />
    </div>
</template>

<script>
import EquipmentSelector from '@/components/EquipmentSelector.vue'


export default {
    name: 'StepTwo',

    components: {
        EquipmentSelector,
    },

    props: {
        form: {
            type: Object,
            required: true
        },
        preview: {
            type: Object,
            required: true
        },
        uploadConfig: {
            type: Object,
            required: true
        },
        typesBien: {
            type: Array,
            default: () => []
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
        detailsBiensImmobiliers: {
            type: Array,
            default: () => []
        },
        typeCuisine: {
            type: [String, Array],
            default: () => []
        },
        typeVue: {
            type: [String, Array],
            default: () => []
        },
    },

    emits: [
        'update:form',
        'uploadResponse',
        'prevStep',
        'nextStep'
    ],

    computed: {
        isAgricole() {
            const typeBien = this.typesBien.find(t => Number(t.id) === Number(this.form.typeBiensImmobiliereId));
            return typeBien?.nomTypeBiensImmo?.toLowerCase() === 'agricole';
        },
        isCommercial() {
            const typeBien = this.typesBien.find(t => Number(t.id) === Number(this.form.typeBiensImmobiliereId));
            return typeBien?.nomTypeBiensImmo?.toLowerCase() === 'commercial';
        }
    },

    methods: {
        updateEquipements(equipements) {
            console.log('StepTwo.updateEquipements reçu:', equipements);
            // garantir un objet non null
            const safe = equipements || {
                securites: [], services: [], activites: [], modesPaiement: [], languesPersonnel: [], typeCuisine: [], typesClimatisation: [], typeGarage: [], typeVue: []
            };
            this.$emit('update:form', { ...this.form, equipements: safe });
        },

        updateAutresEquipements(value) {
            this.$emit('update:form', { ...this.form, autresEquipements: value });
        }
    }
}
</script>

<style scoped>
.dropzone {
    min-height: 150px;
    border: 2px dashed #ccc;
    border-radius: 8px;
    background: #fafafa;
}

.card-header h6 {
    margin: 0;
    color: #495057;
}
</style>