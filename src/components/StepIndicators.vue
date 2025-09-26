<template>
    <nav aria-label="Progress" class="flex justify-center space-x-2 mb-4">
        <div v-if="showStepIndicators" class="step-navigation mb-4">
            <ul class="nav nav-pills justify-content-between">
                <li v-for="(step, index) in steps" :key="index" class="nav-item">
                    <span :class="getStepClass(index)" @click="canNavigateToStep(index) && $emit('goToStep', index)"
                        :style="canNavigateToStep(index) ? 'cursor: pointer' : ''">
                        {{ index + 1 }}. {{ step }}
                    </span>
                </li>
            </ul>
        </div>

        <ul class="nav nav-pills justify-content-between">
            <li v-for="(step, index) in steps" :key="index" class="nav-item">
                <span :class="getStepClass(index)" @click="canNavigateToStep(index) && $emit('goToStep', index)"
                    :style="canNavigateToStep(index) ? 'cursor: pointer' : ''">
                    {{ index + 1 }}. {{ step }}
                </span>
            </li>
        </ul>

        <!-- Informations d'étape (optionnel) -->
        <div v-if="showStepInfo" class="step-info text-muted small">
            <i class="bi bi-info-circle me-1"></i>
            {{ stepInfoText }}
        </div>
    </nav>
</template>

<script>
export default {
    name: 'StepIndicators',
    props: {
        activeStep: {
            type: Number,
            required: true,
        },
        steps: {
            type: Array,
            required: true,
        },
        allowStepNavigation: {
            type: Boolean,
            default: true,
        },
        showStepInfo: {
            type: Boolean,
            default: true // ou la valeur par défaut que tu veux
        }

    },
    computed: {
        isLastStep() {
            return this.activeStep === this.steps.length - 1
        },

        computedNextButtonText() {
            if (this.nextButtonText) {
                return this.nextButtonText
            }
            return this.isLastStep ? 'Terminer' : 'Suivant'
        },

        nextButtonClass() {
            const baseClass = 'btn d-flex align-items-center'
            return this.isLastStep
                ? `${baseClass} btn-success`
                : `${baseClass} btn-primary`
        }
    },
    methods: {
        canNavigateToStep(stepIndex) {
            if (!this.allowStepNavigation) return false;
            if (stepIndex <= this.activeStep) return true;
            return false;
        },
        /**
       * Détermine la classe CSS pour une étape
       * @param {number} stepIndex - Index de l'étape
       */
        getStepClass(stepIndex) {
            const baseClass = 'nav-link'

            if (stepIndex === this.activeStep) {
                return `${baseClass} active`
            } else if (stepIndex < this.activeStep) {
                return `${baseClass} completed`
            } else {
                return `${baseClass} disabled`
            }
        },

    }
}
</script>

<style scoped>
/* Tes styles ici */
</style>
