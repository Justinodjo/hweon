<template>
    <div ref="mapContainer" class="map-container"></div>
</template>

<script>
import { ref, onMounted } from "vue";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import Cluster from "ol/source/Cluster";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Feature from "ol/Feature";
import Overlay from "ol/Overlay";
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style";

export default {
    name: "ClusteredPropertiesMap",
    setup() {
        const mapContainer = ref(null);

        onMounted(() => {
            const vectorSource = new VectorSource({
                url: "/api/properties", // Ton API GeoJSON
                format: new GeoJSON(),
            });

            const clusterSource = new Cluster({
                distance: 40, // regroupe les points à moins de 40px
                source: vectorSource,
            });

            const styleCache = {};
            const clustersLayer = new VectorLayer({
                source: clusterSource,
                style: (feature) => {
                    const size = feature.get("features").length;
                    let style = styleCache[size];
                    if (!style) {
                        style = new Style({
                            image: new CircleStyle({
                                radius: 10 + size,
                                stroke: new Stroke({ color: "#fff", width: 2 }),
                                fill: new Fill({ color: "#3399CC" }),
                            }),
                            text: new Text({
                                text: size.toString(),
                                fill: new Fill({ color: "#fff" }),
                            }),
                        });
                        styleCache[size] = style;
                    }
                    return style;
                },
            });

            const map = new Map({
                target: mapContainer.value,
                layers: [
                    new TileLayer({ source: new OSM() }),
                    clustersLayer,
                ],
                view: new View({ center: [0, 0], zoom: 2 }),
            });

            const popupEl = document.createElement("div");
            popupEl.className = "ol-popup";
            const overlay = new Overlay({
                element: popupEl,
                positioning: "bottom-center",
                stopEvent: false,
                offset: [0, -20],
            });
            map.addOverlay(overlay);

            map.on("singleclick", (evt) => {
                const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
                if (feature) {
                    const features = feature.get("features");
                    if (features.length === 1) {
                        const props = features[0].getProperties();
                        overlay.setPosition(features[0].getGeometry().getCoordinates());
                        popupEl.innerHTML = `
              <strong>${props.title}</strong><br/>
              ${props.address || ""}<br/>
              Prix : ${props.price || ""} €
            `;
                    } else {
                        map.getView().fit(feature.getGeometry().getExtent(), {
                            duration: 500,
                            padding: [50, 50, 50, 50],
                        });
                    }
                } else {
                    overlay.setPosition(undefined);
                }
            });

            vectorSource.on("change", () => {
                if (vectorSource.getState && vectorSource.getState() === "ready") {
                    map.getView().fit(vectorSource.getExtent(), {
                        padding: [50, 50, 50, 50],
                    });
                }
            });
        });

        return { mapContainer };
    },
};
</script>

<style scoped>
.map-container {
    width: 100%;
    height: 600px;
}

.ol-popup {
    background: white;
    padding: 8px;
    border: 1px solid #333;
    border-radius: 4px;
}
</style>
