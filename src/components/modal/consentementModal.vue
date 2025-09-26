<template>
    <el-dialog v-model="visible" title="Consentement RGPD" width="600px" :close-on-click-modal="false"
        :show-close="false">
        <p>
            Nous utilisons vos données personnelles pour améliorer nos services.
            Veuillez accepter notre politique de confidentialité.
        </p>
        <div class="text-end">
            <el-button @click="refuser">Refuser</el-button>
            <el-button type="primary" @click="accepter">Accepter</el-button>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

const visible = ref(true);
const store = useStore();
const ipAddress = ref('127.0.0.1');

// Fonction pour récupérer l'IP publique de l'utilisateur
const getUserIP = async () => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipAddress.value = data.ip;
    } catch (error) {
        console.error("Erreur lors de la récupération de l'IP :", error);
    }
};

// Appeler au chargement
onMounted(() => {
    getUserIP();
});

const accepter = async () => {
    try {
        await store.dispatch('consentement/add', {
            typeConsentement: 'RGPD',
            statut: 'ACCEPTE',
            versionPolitique: 'v1.0',
            dateConsentement: new Date(),
            ipAddress: ipAddress.value,
        });
    } catch (error) {
        console.error('Erreur enregistrement consentement', error);
    } finally {
        visible.value = false;
    }
};

const refuser = () => {
    visible.value = false;
    // Redirection ou désactivation possible ici
};
</script>
