<template>
    <!-- Solution 1: Utilisation de vue-tel-input (Recommandé) -->
    <div class="international-phone-input">
        <label class="form-label">Téléphone</label>
        <vue-tel-input v-model="phoneNumber" :default-country="'BJ'"
            :dropdown-options="{ showDialCodeInSelection: true, showFlags: true }" :input-options="{
                placeholder: 'Entrez votre numéro',
                styleClasses: 'form-control',
                maxlength: 20
            }" :valid-characters-only="true" :onlyCountries="[]" :ignoredCountries="[]" mode="international"
            @validate="handleValidation" @on-input="handlePhoneInput" />

        <!-- Message d'erreur -->
        <div v-if="phoneError" class="text-danger small mt-1">
            <i class="bi bi-exclamation-circle me-1"></i>
            {{ phoneError }}
        </div>

        <!-- Informations du numéro -->
        <div v-if="phoneData && phoneData.valid" class="small text-muted mt-1">
            <i class="bi bi-check-circle text-success me-1"></i>
            {{ phoneData.country?.name }} (+{{ phoneData.country?.dialCode }})
        </div>
    </div>
</template>

<script>
import { ref, watch } from 'vue';
import { VueTelInput } from 'vue-tel-input';
import 'vue-tel-input/vue-tel-input.css';

export default {
    name: 'InternationalPhoneInput',

    components: {
        VueTelInput
    },

    props: {
        modelValue: {
            type: String,
            default: ''
        }
    },

    emits: ['update:modelValue', 'validate'],

    setup(props, { emit }) {
        const phoneNumber = ref(props.modelValue);
        const phoneData = ref(null);
        const phoneError = ref('');

        // Surveiller les changements du v-model parent
        // watch(() => props.modelValue, (newValue) => {
        //     if (newValue !== phoneNumber.value) {
        //         phoneNumber.value = newValue;
        //     }
        // });

        // Gérer l'input du téléphone
        const handlePhoneInput = (formattedNumber, payload) => {
            if (!payload || !payload.number) {
                if (phoneNumber.value !== '') {
                    emit('update:modelValue', '');
                }
                phoneData.value = null;
                phoneError.value = '';
                return;
            }

            const { number, valid, country } = payload;

            const international = number?.international ?? '';

            phoneData.value = {
                formatted: formattedNumber,
                number: international,
                valid,
                country
            };

            // 🔥 Empêcher l’émission répétée
            if (international !== phoneNumber.value) {
                emit('update:modelValue', international);
            }

            // Validation
            if (formattedNumber && !valid) {
                phoneError.value = 'Numéro de téléphone invalide';
            } else {
                phoneError.value = '';
            }
        };


        // Gérer la validation
        const handleValidation = (validation) => {
            // handlePhoneInput();
            emit('validate', validation);
        };

        return {
            phoneNumber,
            phoneData,
            phoneError,
            handlePhoneInput,
            handleValidation
        };
    }
};
</script>

<style scoped>
/* Personnalisation du composant */
:deep(.vue-tel-input) {
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    transition: border-color 0.15s ease-in-out;
}

:deep(.vue-tel-input:focus-within) {
    border-color: #86b7fe;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

:deep(.vti__dropdown) {
    background-color: #f8f9fa;
    border-radius: 0.375rem 0 0 0.375rem;
}

:deep(.vti__dropdown:hover) {
    background-color: #e9ecef;
}

:deep(.vti__dropdown-list) {
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

:deep(.vti__input) {
    border: none !important;
    font-size: 1rem;
    padding: 0.375rem 0.75rem;
}

/* Style du message d'erreur */
.text-danger {
    animation: shake 0.3s ease;
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-5px);
    }

    75% {
        transform: translateX(5px);
    }
}
</style>
