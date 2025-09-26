// components/StepNavigation.vue
<template>
    <div>
        <!-- Navigation principale pour les étapes -->
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

        <!-- Boutons de navigation -->
        <div class="d-flex justify-content-between align-items-center mt-4">
            <!-- Bouton Précédent -->
            <button v-if="showBackButton" type="button" class="btn btn-secondary d-flex align-items-center"
                @click="$emit('prevStep')" :disabled="!canGoBack">
                <i class="bi bi-arrow-left me-2"></i>
                {{ backButtonText }}
            </button>
            <div v-else></div>

            <!-- Informations d'étape (optionnel) -->
            <div v-if="showStepInfo" class="step-info text-muted small">
                <i class="bi bi-info-circle me-1"></i>
                {{ stepInfoText }}
            </div>

            <!-- Bouton Suivant / Terminer -->
            <button v-if="showNextButton" type="button" :class="nextButtonClass" @click="handleNextClick"
                :disabled="!canGoNext || loading">
                <div v-if="loading" class="spinner-border spinner-border-sm me-2"></div>
                <i v-else-if="isLastStep" class="bi bi-check-circle me-2"></i>
                <i v-else class="bi bi-arrow-right me-2"></i>
                {{ computedNextButtonText }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'StepNavigation',

    props: {
        // Configuration des étapes
        steps: {
            type: Array,
            default: () => []
        },
        activeStep: {
            type: Number,
            default: 0
        },

        // Contrôle de navigation
        canGoBack: {
            type: Boolean,
            default: true
        },
        canGoNext: {
            type: Boolean,
            default: true
        },

        // Personnalisation des boutons
        showBackButton: {
            type: Boolean,
            default: true
        },
        showNextButton: {
            type: Boolean,
            default: true
        },
        backButtonText: {
            type: String,
            default: 'Précédent'
        },
        nextButtonText: {
            type: String,
            default: ''
        },

        // Affichage conditionnel
        showStepIndicators: {
            type: Boolean,
            default: true
        },
        showStepInfo: {
            type: Boolean,
            default: false
        },
        stepInfoText: {
            type: String,
            default: ''
        },

        // État
        loading: {
            type: Boolean,
            default: false
        },

        // Validation
        allowStepNavigation: {
            type: Boolean,
            default: false
        }
    },

    emits: [
        'prevStep',
        'nextStep',
        'submit',
        'goToStep'
    ],

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

        /**
         * Vérifie si on peut naviguer vers une étape
         * @param {number} stepIndex - Index de l'étape
         */
        canNavigateToStep(stepIndex) {
            if (!this.allowStepNavigation) return false

            // Permettre de revenir aux étapes précédentes
            if (stepIndex < this.activeStep) return true

            // Permettre de naviguer à l'étape courante
            if (stepIndex === this.activeStep) return true

            // Ne pas permettre d'aller aux étapes suivantes
            return false
        },

        /**
         * Gère le clic sur le bouton suivant
         */
        handleNextClick() {

            if (this.isLastStep) {

                console.log('Émission de l\'événement submit');
                this.$emit('submit')
            } else {
                this.$emit('nextStep')
            }
        }
    }
}
</script>

<style scoped>
.step-navigation .nav-pills {
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 8px;
    background: #f8f9fa;
}

.nav-link {
    border-radius: 6px;
    padding: 8px 16px;
    margin: 0 4px;
    transition: all 0.3s ease;
    font-size: 0.875rem;
    font-weight: 500;
    border: 1px solid transparent;
}

.nav-link.active {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
    box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
}

.nav-link.completed {
    background-color: #28a745;
    color: white;
    border-color: #28a745;
}

.nav-link.completed:hover {
    background-color: #218838;
    cursor: pointer;
}

.nav-link.disabled {
    color: #6c757d;
    background: transparent;
    cursor: not-allowed;
}

.nav-link:hover:not(.disabled):not(.active) {
    background-color: #e9ecef;
    color: #495057;
}

.step-info {
    max-width: 300px;
    text-align: center;
}

.btn {
    min-width: 120px;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-secondary:hover:not(:disabled) {
    background-color: #5a6268;
    border-color: #545b62;
}

.btn-primary:hover:not(:disabled) {
    background-color: #0056b3;
    border-color: #004085;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
}

.btn-success:hover:not(:disabled) {
    background-color: #218838;
    border-color: #1e7e34;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
}

.spinner-border-sm {
    width: 1rem;
    height: 1rem;
}

@media (max-width: 768px) {
    .step-navigation .nav-pills {
        flex-direction: column;
        padding: 12px;
    }

    .nav-item {
        margin-bottom: 8px;
    }

    .nav-item:last-child {
        margin-bottom: 0;
    }

    .nav-link {
        margin: 0;
        text-align: center;
    }

    .d-flex.justify-content-between {
        flex-direction: column;
        gap: 16px;
    }

    .step-info {
        order: -1;
        max-width: 100%;
        text-align: center;
    }
}

@media (max-width: 576px) {
    .nav-link {
        font-size: 0.75rem;
        padding: 6px 12px;
    }

    .btn {
        min-width: 100px;
        font-size: 0.875rem;
    }
}
</style>