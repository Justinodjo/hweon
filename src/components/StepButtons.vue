<template>
    <div class="d-flex justify-content-between align-items-center mt-4">
        <button class="btn btn-outline" :disabled="activeStep === 0 || loading" @click="$emit('prevStep')">
            Précédent
        </button>

        <button v-if="steps && activeStep < steps.length - 1" class="btn btn-primary" :disabled="loading"
            @click="$emit('nextStep')">
            Suivant
        </button>

        <button v-else class="btn btn-success" :disabled="loading" @click="$emit('submit')">
            Valider
        </button>
    </div>
</template>

<script>
export default {
    name: 'StepButtons',
    props: {
        activeStep: {
            type: Number,
            required: true,
        },
        steps: {
            type: Array,
            required: true,
            default: () => []
        },
        loading: {
            type: Boolean,
            default: false,
        }
    }
}
</script>

<style scoped>
/* Tes styles ici */
</style>
