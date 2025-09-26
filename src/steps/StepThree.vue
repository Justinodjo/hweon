// steps/StepThree.vue
<template>
    <div class="mb-3">
        <h5 class="mb-4">Détails du bien immobilier</h5>

        <!-- Informations générales -->
        <PropertyGeneralInfo :form="form" :isAgricole="isAgricole"
            :detailsBiensImmobiliers="form.detailsBiensImmobiliers" :isResidentiel="isResidentiel"
            @update:form="$emit('update:form', $event)" :preview="preview" />

        <!-- Pièces principales -->
        <PropertyDetailsManager v-show="!isAgricole" :detailsBiensImmobiliers="form.detailsBiensImmobiliers"
            :etatsGeneral="etatsGeneral" :typesDetailsBiens="typesDetailsBiens" @update:details="updateDetails"
            :isAgricole="isAgricole" :isResidentiel="isResidentiel" :preview="preview" :activeStep="activeStep"
            :form="form" :uploadResponse="uploadResponse" :uploadConfig="uploadConfig" :typesDPE="typesDPE" />

        <!-- Navigation -->
        <!-- <StepNavigation :canGoBack="true" :canGoNext="isStepThreeValid" @prevStep="$emit('prevStep')"
            @nextStep="$emit('nextStep')" /> -->
        <!-- <StepButtons :activeStep="activeStep" :steps="stepLabels" :loading="submitting" @prevStep="prevStep"
            @nextStep="nextStep" @submit="submit" /> -->
    </div>
</template>

<script>
import PropertyGeneralInfo from '@/components/PropertyGeneralInfo.vue'
import PropertyDetailsManager from '@/components/PropertyDetailsManager.vue'
import StepNavigation from '@/components/StepNavigation.vue'
// import StepIndicators from '@/components/StepIndicators.vue'  // adapte le chemin
import StepButtons from '@/components/StepButtons.vue'        // adapte le chemin
export default {
    name: 'StepThree',

    components: {
        PropertyGeneralInfo,
        PropertyDetailsManager,
        // StepNavigation,
        StepButtons,
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
        etatsGeneral: {
            type: Array,
            default: () => []
        },
        typesDetailsBiens: {
            type: Array,
            default: () => []
        },
        detailsBiensImmobiliers: {
            type: Array,
            default: () => []
        },
        activeStep: {
            type: Number,
            required: true
        },
        preview: {
            type: Object,
            required: true,
            default: () => ({
                coverUrl: '' // Initialiser la valeur de coverUrl même si elle est vide
            })
        },
        typesDPE: {
            type: Array,
            default: () => []
        },
        uploadConfig: {
            type: Object,
            required: true,
            default: () => ({
                url: '' // Initialiser la valeur de coverUrl même si elle est vide
            })
        },
    },

    emits: [
        'update:form',
        'prevStep',
        'nextStep'
    ],
    watch: {

    },
    computed: {

        isAgricole() {
            const typeBien = this.typesBien.find(t => Number(t.id) === Number(this.form.typeBiensImmobiliereId));
            return typeBien?.nomTypeBiensImmo?.toLowerCase() === 'agricole';
        },
        isCommercial() {
            const typeBien = this.typesBien.find(t => Number(t.id) === Number(this.form.typeBiensImmobiliereId));
            return typeBien?.nomTypeBiensImmo?.toLowerCase() === 'commercial';
        },
        isResidentiel() {
            const typeBien = this.typesBien.find(t => Number(t.id) === Number(this.form.typeBiensImmobiliereId));
            return typeBien?.nomTypeBiensImmo?.toLowerCase() === 'residentiel';
        },
    },

    methods: {
        updateDetails(details) {
            this.$emit('update:form', {
                ...this.form,
                detailsBiensImmobiliers: details
            });
        },
    }
}
</script>