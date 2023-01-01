<template>
    <!-- Bouton flottant -->
    <button class="floating-btn" :style="{ top: buttonPos.y + 'px', left: buttonPos.x + 'px' }"
        @mousedown="startDragButton" @click="toggleBox" data-aos="fade-up" data-aos-delay="200"
        data-aos-duration="1000">
        <i class="bi bi-chat-dots"></i>
    </button>

    <!-- Suggestion Box -->
    <div v-if="isOpen" class="suggestion-box card p-3 shadow-sm"
        :style="{ top: boxPos.y + 'px', left: boxPos.x + 'px' }" @mousedown="startDragBox">
        <i class="bi bi-x-lg" @click="toggleBox"></i>
        <h5 class="mb-3 text-center">Vos suggestions</h5>

        <textarea v-model="message" class="form-control mb-2" rows="3"
            placeholder="Écrivez votre suggestion ici..."></textarea>

        <button class="btn btn-primary w-100 mb-2" @click="submitSuggestion" :disabled="loading || !message">
            {{ loading ? 'Envoi...' : 'Envoyer' }}
        </button>

        <p v-if="success" class="text-success mt-2">Merci pour votre suggestion !</p>
        <p v-if="error" class="text-danger mt-2">{{ error }}</p>
    </div>
</template>

<script>
import { ref } from 'vue'
import AOS from 'aos';
import { useStore } from 'vuex'
import 'aos/dist/aos.css';
export default {
    name: 'FloatingSuggestionBox',
    setup() {
        const store = useStore()
        const isOpen = ref(false)
        const message = ref('')
        const loading = ref(false)
        const success = ref(false)
        const error = ref('')

        // Position bouton flottant
        const buttonPos = ref({ x: window.innerWidth - 80, y: window.innerHeight - 80 })
        const buttonDragging = ref(false)
        const buttonOffset = ref({ x: 0, y: 0 })

        // Position suggestion box
        const boxPos = ref({ x: window.innerWidth - 420, y: window.innerHeight - 200 })
        const boxDragging = ref(false)
        const boxOffset = ref({ x: 0, y: 0 })

        const toggleBox = () => {
            isOpen.value = !isOpen.value
            if (isOpen.value) {
                // Réinitialiser AOS pour détecter le bouton dans le DOM
                AOS.refreshHard();
            }
        }

        const submitSuggestion = async () => {
            if (!message.value) return
            loading.value = true
            success.value = false
            error.value = ''
            try {
                // Appel réel au store Vuex
                await store.dispatch('suggestions/create', {
                    message: message.value,
                    userEmail: null, // ou récupérer depuis auth
                })
                success.value = true
                message.value = ''
            } catch (e) {
                console.error(e)
                error.value = 'Une erreur est survenue. Veuillez réessayer.'
            } finally {
                loading.value = false
            }
        }


        // Drag bouton
        const startDragButton = (e) => {
            buttonDragging.value = true
            buttonOffset.value.x = e.clientX - buttonPos.value.x
            buttonOffset.value.y = e.clientY - buttonPos.value.y
            window.addEventListener('mousemove', dragButton)
            window.addEventListener('mouseup', stopDragButton)
        }
        const dragButton = (e) => {
            if (!buttonDragging.value) return
            buttonPos.value.x = Math.min(Math.max(e.clientX - buttonOffset.value.x, 0), window.innerWidth - 60)
            buttonPos.value.y = Math.min(Math.max(e.clientY - buttonOffset.value.y, 0), window.innerHeight - 60)
        }

        const dragBox = (e) => {
            if (!boxDragging.value) return
            boxPos.value.x = Math.min(Math.max(e.clientX - boxOffset.value.x, 0), window.innerWidth - 400)
            boxPos.value.y = Math.min(Math.max(e.clientY - boxOffset.value.y, 0), window.innerHeight - 200)
        }

        const stopDragButton = () => {
            buttonDragging.value = false
            window.removeEventListener('mousemove', dragButton)
            window.removeEventListener('mouseup', stopDragButton)
        }

        // Drag box
        const startDragBox = (e) => {
            boxDragging.value = true
            boxOffset.value.x = e.clientX - boxPos.value.x
            boxOffset.value.y = e.clientY - boxPos.value.y
            window.addEventListener('mousemove', dragBox)
            window.addEventListener('mouseup', stopDragBox)
        }

        const stopDragBox = () => {
            boxDragging.value = false
            window.removeEventListener('mousemove', dragBox)
            window.removeEventListener('mouseup', stopDragBox)
        }

        return {
            isOpen, message, loading, success, error,
            buttonPos, startDragButton,
            boxPos, startDragBox,
            toggleBox, submitSuggestion
        }
    }
}
</script>

<style scoped>
.floating-btn {
    position: fixed;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #667eea;
    color: white;
    font-size: 24px;
    border: none;
    cursor: grab;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.floating-btn:active {
    cursor: grabbing;
}

.suggestion-box {
    position: fixed;
    width: 400px;
    z-index: 1050;
    cursor: grab;
}

.suggestion-box:active {
    cursor: grabbing;
}

.floating-btn:active,
.suggestion-box:active {
    transform: scale(0.98);
    transition: transform 0.1s;
}
</style>
