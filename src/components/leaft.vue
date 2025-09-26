<script setup>
import { onMounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Corriger les icônes manquantes de Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

const map = ref(null)
const biens = ref([])

onMounted(async () => {
  // Appel à votre API
  const response = await fetch('http://localhost:8080/api/biens') // À adapter
  biens.value = await response.json()

  map.value = L.map('map').setView([6.4974, 2.6036], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value)

  // Ajouter les marqueurs pour chaque bien
  biens.value.forEach(bien => {
    L.marker([bien.latitude, bien.longitude])
      .addTo(map.value)
      .bindPopup(`<b>${bien.nom}</b><br>${bien.description}`)
  })
})
</script>

<template>
  <div id="map" style="height: 500px;"></div>
</template>

<style scoped>
#map {
  width: 100%;
  height: 500px;
}
</style>
