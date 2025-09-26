// components/ProgressBar.vue
<template>
    <div class="progress mb-4" style="height: 25px;">
        <div class="progress-bar progress-bar-striped" role="progressbar" :style="progressStyle"
            :aria-valuenow="currentStep" aria-valuemin="0" :aria-valuemax="totalSteps">
            <span class="progress-text">
                Étape {{ currentStep }} sur {{ totalSteps }}
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProgressBar',

    props: {
        activeStep: {
            type: Number,
            required: true,
            validator: value => value >= 0
        },
        totalSteps: {
            type: Number,
            required: true,
            validator: value => value > 0
        }
    },

    computed: {
        currentStep() {
            return this.activeStep + 1
        },

        progressPercentage() {
            return Math.round((this.currentStep / this.totalSteps) * 100);
        },

        progressStyle() {
            let color = '#007bff';  // Default blue color

            // Change color based on progress
            if (this.progressPercentage < 30) {
                color = '#dc3545';  // Red if progress is less than 30%
            } else if (this.progressPercentage < 70) {
                color = '#ffc107';  // Yellow if progress is between 30% and 70%
            } else {
                color = '#28a745';  // Green if progress is more than 70%
            }

            return {
                width: `${this.progressPercentage}%`,
                backgroundColor: color,  // Dynamic color change
                transition: 'width 0.3s ease'  // Smooth transition for width change
            };
        }

    }
}
</script>

<style scoped>
.progress {
    background-color: #e9ecef;
    /* Couleur de fond de la barre */
    border-radius: 8px;
    overflow: hidden;
}

.progress-bar {
    background: linear-gradient(45deg, #007bff, #0056b3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 500;
    position: relative;
    transition: width 0.5s ease-in-out;
    /* Durée plus longue et transition plus fluide */
}

.progress-bar-striped {
    background-image: linear-gradient(45deg,
            rgba(255, 255, 255, 0.15) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            transparent 75%,
            transparent);
    background-size: 1rem 1rem;
    animation: progress-bar-stripes 1s linear infinite;
}

.progress-text {
    font-size: 0.875rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

@keyframes progress-bar-stripes {
    0% {
        background-position-x: 1rem;
    }
}

@media (max-width: 576px) {
    .progress-text {
        font-size: 0.75rem;
    }
}
</style>