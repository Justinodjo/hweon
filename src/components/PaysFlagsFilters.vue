<template>
    <div class="p-4">
        <h2 class="text-xl font-bold mb-4">Liste des pays</h2>

        <!-- 🔍 Barre de recherche -->
        <input v-model="searchTerm" type="text" placeholder="Rechercher un pays..."
            class="border rounded px-3 py-2 mb-4 w-full" />

        <!-- 🌍 Sélecteur de continent -->
        <select v-model="selectedRegion" class="border rounded px-3 py-2 mb-4 w-full">
            <option value="">-- Tous les continents --</option>
            <option v-for="region in regions" :key="region" :value="region">
                {{ region }}
            </option>
        </select>

        <!-- 🖼️ Liste des pays -->
        <div v-if="loading">Chargement...</div>
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="pays in filteredCountries" :key="pays.code" class="border p-3 rounded shadow">
                <img :src="pays.drapeau" :alt="pays.nom" class="w-20 h-auto mb-2" />
                <p><strong>{{ pays.nom }}</strong></p>
                <p>Indicatif : {{ pays.indicatif }}</p>
                <p class="text-sm text-gray-500">{{ pays.region }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const countries = ref([])
const loading = ref(true)
const searchTerm = ref('')
const selectedRegion = ref('')
const regions = ref([])

onMounted(async () => {
    try {
        const response = await axios.get('https://restcountries.com/v3.1/all')
        countries.value = response.data.map(p => ({
            nom: p.name.common,
            drapeau: p.flags.svg,
            indicatif: `${p.idd?.root || ''}${p.idd?.suffixes?.[0] || ''}`,
            code: p.cca2,
            region: p.region || 'Inconnu'
        }))
        // Extraire les régions uniques
        regions.value = [...new Set(countries.value.map(p => p.region).filter(Boolean))]
    } catch (error) {
        console.error('Erreur lors du chargement des pays :', error)
    } finally {
        loading.value = false
    }
})

const filteredCountries = computed(() => {
    return countries.value.filter(p =>
        p.nom.toLowerCase().includes(searchTerm.value.toLowerCase()) &&
        (selectedRegion.value === '' || p.region === selectedRegion.value)
    )
})
</script>

<style scoped>
input,
select {
    transition: all 0.2s ease;
}

input:focus,
select:focus {
    border-color: #007bff;
    outline: none;
}
</style>
