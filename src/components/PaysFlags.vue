<template>
    <div>
        <h2>Liste des pays</h2>
        <div v-if="loading">Chargement...</div>
        <div v-else class="grid grid-cols-3 gap-4">
            <div v-for="pays in paysList" :key="pays.code" class="border p-3 rounded shadow">
                <img :src="pays.drapeau" :alt="pays.nom" class="w-16 h-auto" />
                <p><strong>{{ pays.nom }}</strong></p>
                <p>Indicatif : {{ pays.indicatif }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const paysList = ref([])
const loading = ref(true)

onMounted(async () => {
    try {
        const response = await axios.get('https://restcountries.com/v3.1/all')
        paysList.value = response.data.map(p => ({
            nom: p.name.common,
            drapeau: p.flags.svg,
            indicatif: `${p.idd?.root || ''}${p.idd?.suffixes?.[0] || ''}`,
            code: p.cca2
        }))
    } catch (error) {
        console.error('Erreur lors du chargement des pays :', error)
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
img {
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>
