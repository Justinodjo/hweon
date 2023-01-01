<template>
    <div>
        <h3>Effectuer un paiement</h3>
        <input v-model="nom" placeholder="Nom" />
        <input v-model="email" placeholder="Email" />
        <input v-model="montant" type="number" placeholder="Montant" />
        <button @click="payer">Payer</button>

        <p v-if="message" class="message">{{ message }}</p>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const nom = ref("");
const email = ref("");
const montant = ref(0);
const contratId = 12; // exemple statique, à récupérer dynamiquement

const message = computed(() => store.getters["paiement/message"]);

const payer = async () => {
    await store.dispatch("paiement/initierPaiement", {
        contratId,
        montant: montant.value,
        email: email.value,
        nom: nom.value,
    });
};
</script>

<style scoped>
.message {
    margin-top: 10px;
    color: red;
}
</style>
