<template>
    <div>
        <MapPropertyView :latitude="48.8584" :longitude="2.2945" title="Appartement à vendre"
            description="75007 Paris - 2 chambres - 65m² - 550 000€" />
    </div>
</template>

<script>
import MapPropertyView from "@/components/card/MapPropertyView.vue";

export default {
    components: {
        MapPropertyView
    }
};

// Si tu veux afficher plusieurs biens depuis un fichier ou API:

// Remplace le Feature unique par un VectorSource chargé depuis GeoJSON

// Exemple:

// import GeoJSON from 'ol/format/GeoJSON';

// new VectorSource({
//     url: '/path/to/biens.geojson',
//     format: new GeoJSON()
// })

// Utilise la source XYZ avec un fond Google Maps ou Bing si tu as la clé:

// import XYZ from 'ol/source/XYZ';

// new TileLayer({
//     source: new XYZ({
//         url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png' // exemple libre
//     })
// })

// Si tu charges plusieurs biens, tu peux faire un map.getView().fit(vectorSource.getExtent(), { ...})
</script>
