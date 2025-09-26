// steps/StepTwo.vue
<template>
    <div class="mb-3">
        <h5 class="mb-4">Équipements</h5>

        <!-- Upload d'images -->
        <div class="card mb-4" v-if="isAgricole">
            <div class="card-header">
                <h6>Si vous avez des batiments sur la propriété, vous pouvez changer la categorie du bien</h6>
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
            this.$emit('update:form', { ...this.form, equipements });
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