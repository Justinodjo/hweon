<template>
    <div class="card shadow-sm h-100">
        <!-- En-tête -->
        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Messagerie avec le gestionnaire</h5>
            <button class="btn btn-sm btn-light" @click="loadMessages">
                <i class="bi bi-arrow-clockwise"></i>
            </button>
        </div>

        <!-- Zone messages -->
        <div class="card-body chat-box" ref="chatBox">
            <div v-for="msg in messages" :key="msg.id" class="mb-3">
                <div :class="[
                    'd-inline-block p-2 rounded',
                    msg.expediteur === 'locataire'
                        ? 'bg-primary text-white ms-auto float-end'
                        : 'bg-light text-dark me-auto float-start'
                ]" style="max-width: 70%; word-wrap: break-word;">
                    <div class="small mb-1 fw-bold">
                        {{ msg.expediteur === 'locataire' ? 'Moi' : 'Gestionnaire' }}
                    </div>
                    {{ msg.contenu }}
                    <div class="text-muted small mt-1">{{ formatDate(msg.dateEnvoi) }}</div>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>

        <!-- Formulaire envoi -->
        <div class="card-footer">
            <form @submit.prevent="sendMessage" class="d-flex">
                <input type="text" v-model="newMessage" class="form-control me-2" placeholder="Écrire un message..."
                    required />
                <button class="btn btn-primary" type="submit">
                    <i class="bi bi-send"></i>
                </button>
            </form>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "MessagesChat",
    props: {
        apiUrl: { type: String, default: "/api/messages" },
        userRole: { type: String, default: "locataire" }, // "locataire" ou "gestionnaire"
    },
    data() {
        return {
            messages: [],
            newMessage: "",
        };
    },
    mounted() {
        this.loadMessages();
    },
    methods: {
        async loadMessages() {
            try {
                const res = await axios.get(this.apiUrl);
                this.messages = res.data;
                this.scrollToBottom();
            } catch (e) {
                console.error("Erreur chargement messages :", e);
            }
        },
        async sendMessage() {
            if (!this.newMessage.trim()) return;
            const msg = {
                contenu: this.newMessage,
                expediteur: this.userRole,
                dateEnvoi: new Date(),
            };
            try {
                await axios.post(this.apiUrl, msg);
                this.messages.push(msg);
                this.newMessage = "";
                this.scrollToBottom();
            } catch (e) {
                console.error("Erreur envoi message :", e);
            }
        },
        formatDate(date) {
            return new Date(date).toLocaleString();
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const box = this.$refs.chatBox;
                box.scrollTop = box.scrollHeight;
            });
        },
    },
};
</script>

<style scoped>
.chat-box {
    height: 400px;
    overflow-y: auto;
    background-color: #f8f9fa;
}
</style>
