<template>
    <!-- **************** MAIN CONTENT START **************** -->
    <main>

        <!-- =======================
Main Banner START -->
        <section class="pt-0">
            <div class="container">
                <!-- Background image -->
                <div class="p-3 p-sm-5 rounded-3"
                    style="background-image: url('../assets/images/bg/04.jpg'); background-position: center center; background-repeat: no-repeat; background-size: cover;">
                    <!-- <div
                        style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.4); z-index: 0;">
                    </div> -->
                    <!-- Banner title -->
                    <div class="row">
                        <div class="col-md-8 mx-auto my-5 text-center text-white" style="z-index: 1;">
                            <h1 class="text-center text-dark" v-tooltip="{
                                content: 'C\'est un champ contenant le nom du bien immobilier.',
                                placement: 'top',
                                delay: { show: 500, hide: 200 },
                                trigger: 'hover',
                                theme: 'light'
                            }">
                                {{ typebiensimmo?.nomTypeBiensImmo }}</h1>
                            <ul class="nav nav-divider h6 text-dark mb-0 justify-content-center">
                                <li class="nav-item"><span class="badge bg-primary">{{ biensImmobiliers?.length || 0
                                }}</span> Propriétés</li>
                                <li class="nav-item"><span class="badge bg-secondary">{{ pagination.totalElements
                                }}</span> Total</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Search START -->
                <div class="row mt-n4 mt-sm-n7">
                    <div class="col-11 mx-auto">

                        <!-- Booking from START -->
                        <div class="bg-mode shadow p-4 rounded-3">

                            <!-- Main search START -->
                            <form class="form-control-bg-transparent bg-mode rounded-3">
                                <div class="row g-4 align-items-center">

                                    <div class="col-xl-10">
                                        <div class="row g-4">
                                            <!-- Location -->
                                            <div class="col-md-6 col-lg-4">
                                                <label class="h6 fw-normal mb-0"><i
                                                        class="bi bi-geo-alt text-primary me-1"></i>Localisation</label>
                                                <!-- Input field -->
                                                <div
                                                    class="form-border-bottom form-control-transparent form-fs-lg mt-2">
                                                    <select class="form-select js-choice" data-search-enabled="true">
                                                        <option value="">Sélectionner la localisation</option>
                                                        <option>Cotonou, Littoral</option>
                                                        <option selected>Porto-Novo, Ouémé</option>
                                                        <option>Parakou, Borgou</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <!-- Check in -->
                                            <div class="col-md-6 col-lg-4">
                                                <label class="h6 fw-normal mb-0"><i
                                                        class="bi bi-calendar text-primary me-1"></i>Gamme de
                                                    prix</label>
                                                <!-- Input field -->
                                                <div
                                                    class="form-border-bottom form-control-transparent form-fs-lg mt-2">
                                                    <select class="form-select js-choice">
                                                        <option value="">Sélectionner le budget</option>
                                                        <option>0 - 100,000 FCFA</option>
                                                        <option>100,000 - 500,000 FCFA</option>
                                                        <option>500,000+ FCFA</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <!-- Guest -->
                                            <div class="col-md-6 col-lg-4">
                                                <label class="h6 fw-normal mb-0"><i
                                                        class="fa-solid fa-building text-primary me-1"></i>Type de
                                                    bien</label>
                                                <!-- Input field -->
                                                <div
                                                    class="form-border-bottom form-control-transparent form-fs-lg mt-2">
                                                    <select class="form-select js-choice" data-search-enabled="true">
                                                        <option value="">Sélectionner le type</option>
                                                        <option selected>Résidentiel</option>
                                                        <option>Commercial</option>
                                                        <option>Terrain</option>
                                                        <option>Bureaux</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Button -->
                                    <div class="col-xl-2">
                                        <div class="d-grid">
                                            <a href="#" class="btn btn-lg btn-dark mb-0">Rechercher</a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <!-- Main search END -->

                            <!-- Collapse button -->
                            <div class="d-grid mt-4">
                                <input type="checkbox" class="btn-check" id="btn-check-soft">
                                <label class="btn btn-primary-soft btn-primary-check mb-0" for="btn-check-soft"
                                    data-bs-toggle="collapse" data-bs-target="#collapseExample"
                                    aria-controls="collapseExample">
                                    <i class="bi fa-fe bi-sliders me-2"></i>Filtres avancés
                                </label>
                            </div>

                            <!-- Advance filter START -->
                            <div class="collapse" id="collapseExample">
                                <form class="row g-4 mt-3">

                                    <!-- Input item -->
                                    <div class="col-md-6 col-lg-4">
                                        <div class="form-control-borderless">
                                            <label class="form-label">Nom de la propriété</label>
                                            <input type="text" class="form-control form-control-lg bg-light">
                                        </div>
                                    </div>

                                    <!-- nouislider item -->
                                    <div class="col-md-6 col-lg-4">
                                        <label class="form-label">Gamme de prix (FCFA)</label>
                                        <div class="position-relative">
                                            <div class="noui-wrapper">
                                                <div class="d-flex justify-content-between">
                                                    <input type="text" class="text-body input-with-range-min">
                                                    <input type="text" class="text-body input-with-range-max">
                                                </div>
                                                <div class="noui-slider-range mt-2" data-range-min='50000'
                                                    data-range-max='1000000' data-range-selected-min='100000'
                                                    data-range-selected-max='500000'></div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Select item -->
                                    <div class="col-md-6 col-lg-4">
                                        <label class="form-label">Superficie (m²)</label>
                                        <div class="position-relative">
                                            <div class="noui-wrapper">
                                                <div class="d-flex justify-content-between">
                                                    <input type="text" class="text-body input-with-range-min">
                                                    <input type="text" class="text-body input-with-range-max">
                                                </div>
                                                <div class="noui-slider-range mt-2" data-range-min='20'
                                                    data-range-max='500' data-range-selected-min='50'
                                                    data-range-selected-max='200'></div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Flights -->
                                    <div class="col-md-6 col-lg-4">
                                        <label class="form-label">Disponibilité</label>
                                        <div>
                                            <div class="btn-group" role="group"
                                                aria-label="Basic radio toggle button group">
                                                <input type="radio" class="btn-check" name="btnradio" id="btnradio1"
                                                    checked>
                                                <label class="btn btn-light btn-primary-soft-check mb-0"
                                                    for="btnradio1">À vendre</label>

                                                <input type="radio" class="btn-check" name="btnradio" id="btnradio2">
                                                <label class="btn btn-light btn-primary-soft-check mb-0"
                                                    for="btnradio2">À louer</label>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Star rating -->
                                    <div class="col-md-6 col-lg-4">
                                        <label class="form-label">Note minimale</label>
                                        <ul class="list-inline mb-0 g-3">
                                            <!-- 1 -->
                                            <li class="list-inline-item">
                                                <input type="checkbox" class="btn-check" id="btn-check-9">
                                                <label class="btn btn-light btn-primary-soft-check"
                                                    for="btn-check-9">1<i class="bi bi-star-fill"></i></label>
                                            </li>
                                            <!-- 2 -->
                                            <li class="list-inline-item">
                                                <input type="checkbox" class="btn-check" id="btn-check-10">
                                                <label class="btn btn-light btn-primary-soft-check"
                                                    for="btn-check-10">2<i class="bi bi-star-fill"></i></label>
                                            </li>
                                            <!-- 3 -->
                                            <li class="list-inline-item">
                                                <input type="checkbox" class="btn-check" id="btn-check-11">
                                                <label class="btn btn-light btn-primary-soft-check"
                                                    for="btn-check-11">3<i class="bi bi-star-fill"></i></label>
                                            </li>
                                            <!-- 4 -->
                                            <li class="list-inline-item">
                                                <input type="checkbox" class="btn-check" id="btn-check-12">
                                                <label class="btn btn-light btn-primary-soft-check"
                                                    for="btn-check-12">4<i class="bi bi-star-fill"></i></label>
                                            </li>
                                            <!-- 4 -->
                                            <li class="list-inline-item">
                                                <input type="checkbox" class="btn-check" id="btn-check-13">
                                                <label class="btn btn-light btn-primary-soft-check"
                                                    for="btn-check-13">5<i class="bi bi-star-fill"></i></label>
                                            </li>
                                        </ul>
                                    </div>

                                    <!-- Select item -->
                                    <div class="col-md-6 col-lg-4">
                                        <div class="form-control-bg-light form-size-lg">
                                            <label class="form-label">Sélectionner une option</label>
                                            <select class="form-select js-choice">
                                                <option value="">Sélectionner une option</option>
                                                <option>Piscine</option>
                                                <option>Jardin</option>
                                                <option>Garage</option>
                                                <option>Climatisation</option>
                                                <option>Sécurité 24h/24</option>
                                                <option>Vue sur mer</option>
                                                <option>Ascenseur</option>
                                                <option>Terrasse</option>
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <!-- Advance filter END -->

                        </div>
                        <!-- Booking from END -->
                    </div>
                </div>
                <!-- Search END -->

                <!-- Alert box START -->
                <div class="alert alert-success d-flex align-items-center mt-5 rounded-3 mb-0" role="alert">
                    <span class="h4 mb-0 alert-heading"><i class="bi bi-check-circle-fill me-2"></i> </span>
                    <div class="ms-3">
                        <h6 class="mb-0 alert-heading">Nouvelles propriétés disponibles !</h6>
                        <p class="mb-0">De nombreux biens immobiliers de qualité viennent d'être ajoutés</p>
                    </div>
                </div>
                <!-- Alert box END -->


            </div>
        </section>
        <!-- =======================
Main Banner END -->

        <!-- =======================
Tour grid START -->
        <section class="pt-0">
            <div class="container">

                <!-- Filter and content START -->
                <div class="row g-4 align-items-center justify-content-between mb-4">
                    <!-- Content -->
                    <div class="col-12 col-xl-8">
                        <h5 class="mb-0">Affichage {{ ((pagination.pageActuelle - 1) * pagination.taillePage) + 1 }}-{{
                            Math.min(pagination.pageActuelle * pagination.taillePage, pagination.totalElements) }} de {{
                                pagination.totalElements }} résultats</h5>
                    </div>

                    <!-- Select option -->
                    <div class="col-xl-2">
                        <form class="form-control-bg-light">
                            <select class="form-select js-choice">
                                <option value="">Plus vus</option>
                                <option>Récemment ajoutés</option>
                                <option>Plus populaires</option>
                                <option>Mieux notés</option>
                                <option>Prix croissant</option>
                                <option>Prix décroissant</option>
                            </select>
                        </form>
                    </div>
                </div>
                <!-- Filter and content END -->

                <!-- Loading state -->
                <div v-if="chargement" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Chargement...</span>
                    </div>
                </div>
                <div v-if="!chargement && !erreurChargement" class="row g-4">

                    <!-- Card item START -->
                    <div v-for="bien in biensImmobiliers" :key="bien.id" class="col-md-6 col-xl-4">
                        <div class="card card-hover-shadow pb-0 h-100">
                            <!-- Overlay item -->
                            <div class="position-relative">
                                <!-- Image -->
                                <div class="image-wrapper">
                                    <img v-if="bien.fichiers && bien.fichiers.length > 0"
                                        :src="getImageUrl(bien.fichiers[0].id)" class="card-img-top"
                                        style="height: 250px; object-fit: cover;" alt="Image du bien">
                                    <img v-else src="../assets/images/category/tour/4by3/04.jpg" class="card-img-top"
                                        style="height: 250px; object-fit: cover;" alt="Image par défaut">
                                </div>

                                <!-- Overlay -->
                                <div class="card-img-overlay d-flex flex-column p-4 z-index-1">
                                    <!-- Card overlay top -->
                                    <div>
                                        <span v-if="bien.aVendre" class="badge text-bg-success">À Vendre</span>
                                        <span v-else class="badge text-bg-info">À Louer</span>
                                        <span class="badge text-bg-dark">{{ bien.typeBiensImmobiliere?.nomTypeBiensImmo
                                            || 'N/A' }}</span>
                                    </div>
                                    <!-- Card overlay bottom -->
                                    <div class="w-100 mt-auto">
                                        <span class="badge text-bg-white fs-6">{{ Math.round(bien.superficie) }}
                                            m²</span>
                                    </div>
                                </div>
                            </div>
                            <!-- Image -->

                            <!-- Card body START -->
                            <div class="card-body px-3">
                                <!-- Title -->
                                <h5 class="card-title mb-0">
                                    <a href="#" @click.prevent="voirDetails(bien)" class="stretched-link">
                                        {{ bien.nom }}
                                    </a>
                                </h5>
                                <span class="small">
                                    <i class="bi bi-geo-alt me-2"></i>
                                    {{ bien.commune?.libelle }}, {{ bien.departement?.libelle }}
                                </span>

                                <!-- Property Features -->
                                <ul class="nav nav-divider mt-3 mb-0">
                                    <li class="nav-item h6 fw-normal mb-0">
                                        <i class="fa-solid fa-ruler-combined text-primary me-2"></i>{{
                                            Math.round(bien.superficie) }} m²
                                    </li>
                                    <li class="nav-item h6 fw-normal mb-0">
                                        <i class="fa-solid fa-eye text-info me-2"></i>{{ bien.nombreVues }} vues
                                    </li>
                                    <li class="nav-item h6 fw-normal mb-0">
                                        <i class="fa-solid fa-star text-warning me-2"></i>{{ bien.note ?
                                            bien.note.toFixed(1) : 'N/A' }}
                                    </li>
                                </ul>
                                <!-- List -->
                                <!-- Description preview -->
                                <p class="text-muted small mt-2 mb-0">
                                    {{ bien.description ?
                                        bien.description.substring(0, 100) + '...' : 'Aucune description disponible'
                                    }}
                                </p>
                            </div>
                            <!-- Card body END -->

                            <!-- Card footer START-->
                            <div class="card-footer pt-0">
                                <!-- Price and Button -->
                                <div class="d-sm-flex justify-content-sm-between align-items-center flex-wrap">
                                    <!-- Price -->
                                    <div class="hstack gap-2">
                                        <h5 class="fw-normal text-success mb-0">{{ formatCurrency(bien.prix) }}</h5>
                                        <small v-if="bien.typeUnite">/{{ bien.typeUnite.toLowerCase() }}</small>
                                    </div>
                                    <!-- Actions -->
                                    <div class="mt-2 mt-sm-0">
                                        <button @click="incrementLike(bien.id)"
                                            class="btn btn-sm btn-outline-danger me-2 like-btn"
                                            :class="{ 'clicked': isLiked }" :disabled="isLiked">
                                            <i class="fa-solid fa-heart"></i>
                                            <span class="like-count">{{ bien.nombreJaime }}</span>
                                        </button>
                                        <button @click="onClickGeo(bien)" v-if="bien.latitude && bien.longitude"
                                            class="btn btn-sm btn-outline-primary me-2">
                                            <i class="bi bi-geo-alt"></i>
                                        </button>
                                        <a href="#" @click.prevent="voirDetails(bien)"
                                            class="btn btn-sm btn-primary mb-0">Voir détails</a>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <!-- Card item END -->

                </div> <!-- Row END -->

                <!-- Pagination -->
                <!-- Pagination START -->
                <div class="row" v-if="pagination.totalPages > 1">
                    <div class="col-12">
                        <nav class="mt-4 d-flex justify-content-center" aria-label="navigation">
                            <ul class="pagination pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
                                <li class="page-item mb-0" :class="{ disabled: pagination.pageActuelle === 1 }">
                                    <a class="page-link" href="#"
                                        @click.prevent="changerPage(pagination.pageActuelle - 1)">
                                        <i class="fa-solid fa-angle-left"></i>
                                    </a>
                                </li>

                                <li v-for="page in Math.min(pagination.totalPages, 5)" :key="page"
                                    class="page-item mb-0" :class="{ active: pagination.pageActuelle === page }">
                                    <a class="page-link" href="#" @click.prevent="changerPage(page)">{{ page }}</a>
                                </li>

                                <li v-if="pagination.totalPages > 5" class="page-item mb-0">
                                    <a class="page-link" href="#">..</a>
                                </li>

                                <li v-if="pagination.totalPages > 5" class="page-item mb-0">
                                    <a class="page-link" href="#" @click.prevent="changerPage(pagination.totalPages)">
                                        {{ pagination.totalPages }}
                                    </a>
                                </li>

                                <li class="page-item mb-0"
                                    :class="{ disabled: pagination.pageActuelle === pagination.totalPages }">
                                    <a class="page-link" href="#"
                                        @click.prevent="changerPage(pagination.pageActuelle + 1)">
                                        <i class="fa-solid fa-angle-right"></i>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <!-- Pagination END -->
            </div>
        </section>
        <!-- =======================
Tour grid END -->

        <!-- Geo Modal START -->
        <div v-if="showGeoModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Localisation du bien</h5>
                        <button type="button" class="btn-close" @click="showGeoModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div id="map" style="height: 400px; width: 100%;"></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Geo Modal END -->

        <!-- Rating Modal START -->
        <div v-if="notationVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Noter ce bien</h5>
                        <button type="button" class="btn-close" @click="notationVisible = false"></button>
                    </div>
                    <div class="modal-body text-center">
                        <h6>{{ bienSelectionne?.nom }}</h6>
                        <div class="rating-stars mt-3">
                            <i v-for="star in 5" :key="star" class="fa-solid fa-star fs-4 mx-1"
                                :class="{ 'text-warning': star <= noteTemp, 'text-muted': star > noteTemp }"
                                @click="noteTemp = star" style="cursor: pointer;"></i>
                        </div>
                        <p class="mt-2">Note: {{ noteTemp }}/5</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            @click="notationVisible = false">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="envoyerNote">Valider</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Rating Modal END -->


    </main>
    <!-- **************** MAIN CONTENT END **************** -->
</template>
<script>

import { tns } from 'tiny-slider';
// import { mapActions, mapGetters } from "vuex";
import { ref, onMounted, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from "element-plus";
import { API_URLS } from "@/config/api";
import { useStore } from 'vuex'
import { useLoading } from "vue-loading-overlay";
import L from 'leaflet';
import GLightbox from 'glightbox'
import 'glightbox/dist/css/glightbox.min.css'
import 'leaflet/dist/leaflet.css'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import roomSlider from "@/components/card/room-slider.vue";
import Avis from "@/components/card/Avis.vue";
export default {
    setup() {
        const store = useStore();
        const loading = useLoading();
        const showGeoModal = ref(false)
        const selectedLat = ref(null)
        const selectedLng = ref(null)
        let mapInstance = null;


        function onClickGeo(biensImmobiliers) {
            if (!biensImmobiliers?.latitude || !biensImmobiliers?.longitude) {
                console.warn("Coordonnées manquantes");
                return;
            }
            selectedLat.value = biensImmobiliers.latitude
            selectedLng.value = biensImmobiliers.longitude
            showGeoModal.value = true

            // Initialiser la carte après que le modal soit visible
            nextTick(() => {
                initMap();
            });
        }
        const notationVisible = ref(false)
        const noteTemp = ref(0)
        const bienSelectionne = ref(null)

        const loadNearbyPOI = async (lat, lng) => {
            const delta = 0.01;

            const query = `
                [out:json];
                (
                  node["amenity"="school"](${lat - delta},${lng - delta},${lat + delta},${lng + delta});
                  node["amenity"="restaurant"](${lat - delta},${lng - delta},${lat + delta},${lng + delta});
                  node["amenity"="hospital"](${lat - delta},${lng - delta},${lat + delta},${lng + delta});
                  node["shop"](${lat - delta},${lng - delta},${lat + delta},${lng + delta});
                );
                out;
            `;

            const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                data.elements.forEach(el => {
                    const popup = new maplibregl.Popup({ offset: 25 })
                        .setText(el.tags.name || el.tags.amenity || el.tags.shop || 'Point d\'intérêt');

                    // Couleur différente selon le type
                    const color = el.tags.amenity === 'school' ? '#28a745' :
                        el.tags.amenity === 'hospital' ? '#dc3545' :
                            el.tags.amenity === 'restaurant' ? '#ffc107' : '#6c757d';

                    const markerEl = document.createElement('div');
                    markerEl.style.backgroundColor = color;
                    markerEl.style.width = '12px';
                    markerEl.style.height = '12px';
                    markerEl.style.borderRadius = '50%';
                    markerEl.style.border = '2px solid white';

                    new maplibregl.Marker(markerEl)
                        .setLngLat([el.lon, el.lat])
                        .setPopup(popup)
                        .addTo(mapInstance);
                });
            } catch (error) {
                console.error("Erreur chargement POIs : ", error);
            }
        };


        const initMap = () => {
            setTimeout(() => {
                const mapElement = document.getElementById('map');
                if (!mapElement) {
                    console.error("Le conteneur #map n'existe pas dans le DOM !");
                    return;
                }

                if (mapInstance) {
                    mapInstance.remove();
                    mapElement.innerHTML = '';
                }

                mapInstance = new maplibregl.Map({
                    container: 'map',
                    style: 'https://demotiles.maplibre.org/style.json',
                    center: [selectedLng.value, selectedLat.value],
                    zoom: 15,
                });

                // Marker principal pour le bien
                const mainMarkerEl = document.createElement('div');
                mainMarkerEl.style.backgroundColor = '#007bff';
                mainMarkerEl.style.width = '20px';
                mainMarkerEl.style.height = '20px';
                mainMarkerEl.style.borderRadius = '50%';
                mainMarkerEl.style.border = '3px solid white';
                mainMarkerEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

                new maplibregl.Marker(mainMarkerEl)
                    .setLngLat([selectedLng.value, selectedLat.value])
                    .setPopup(new maplibregl.Popup().setText("Localisation du bien"))
                    .addTo(mapInstance);

                mapInstance.on('load', () => {
                    loadNearbyPOI(selectedLat.value, selectedLng.value);
                });

                setTimeout(() => {
                    mapInstance.resize();
                }, 300);
            }, 100);
        };





        const ouvrirNotation = (bien) => {
            bienSelectionne.value = bien
            noteTemp.value = bien.note || 0
            notationVisible.value = true
        }

        const envoyerNote = async () => {
            try {
                // Exemple d'appel à l'API de notation
                await store.dispatch('biens/noterBien', {
                    id: bienSelectionne.value.id,
                    note: noteTemp.value,
                })

                ElMessage.success("Merci pour votre note !")
                notationVisible.value = false
            } catch (e) {
                ElMessage.error("Erreur lors de l'envoi de la note.")
            }
        }
        return {
            store,
            loading,
            showGeoModal,
            selectedLat,
            selectedLng,
            initMap,
            onClickGeo,
            ouvrirNotation,
            envoyerNote,
            notationVisible,
            noteTemp,
            bienSelectionne,
        }
    },

    data() {
        return {
            services: [],
            tabs: [],
            currentTab: null,
            typeSelectionne: null,
            typebiensimmo: null,
            biensImmobiliers: null,
            isLiked: false,
            pagination: {
                pageActuelle: 1,
                taillePage: 10,
                totalElements: 0,
                totalPages: 0
            },
            errorMessage: null,
            chargement: false,
            erreurChargement: null,
            filtres: {
                localisation: '',
                prixMin: null,
                prixMax: null,
                typeBien: '',
                superficieMin: null,
                superficieMax: null,
                aVendre: null,
                noteMin: null,
                caracteristiques: []
            }
        };
    },
    mounted() {
        this.$nextTick(() => {

        });
        // Si un type est spécifié dans la route
        const typeId = this.$route.params.id;
        if (typeId) {
            console.log("Voici l'id du type de bien", typeId)
            this.typeSelectionne = typeId;
            this.loadTypeBiensImmobiliersOne(typeId);

            this.loadBiensImmobiliersByType(this.typeSelectionne);
        }

        // this.loadBiensImmobiliersOne();
        GLightbox({
            selector: '.glightbox',
            loop: true,
            zoomable: true,
            draggable: true,
            autoplayVideos: true,
            openEffect: 'zoom',
            closeEffect: 'zoom',
            slideEffect: 'slide',
            touchNavigation: true,
            afterSlideLoad: (slide) => {
                console.log('Slide loaded:', slide);
            },
            afterOpen: () => {
                console.log('Lightbox opened');
            },
            afterClose: () => {
                console.log('Lightbox closed');
            },
        });

        const liked = localStorage.getItem(`liked_bien_${this.biensImmobiliers?.id}`);
        if (liked === 'true') this.isLiked = true;
    },
    computed: {
        shortDescription() {
            if (!this.biensImmobiliers?.description) return '';
            // Extraire les deux premières phrases
            const sentences = this.biensImmobiliers.description.match(/[^\.!\?]+[\.!\?]+/g) || [];
            return sentences.slice(0, 2).join(' ').trim();
        },
        longDescription() {
            if (!this.biensImmobiliers?.description) return '';
            const sentences = this.biensImmobiliers.description.match(/[^\.!\?]+[\.!\?]+/g) || [];
            return sentences.slice(2).join(' ').trim();
        },
        isAuthenticated() {
            return this.$store.getters['auth/isAuthenticated']; // adapte selon ton store
        },
        biensFiltered() {
            if (!this.biensImmobiliers) return [];

            return this.biensImmobiliers.filter(bien => {
                // Filtrage par localisation
                if (this.filtres.localisation && !bien.commune?.libelle.toLowerCase().includes(this.filtres.localisation.toLowerCase())) {
                    return false;
                }

                // Filtrage par prix
                if (this.filtres.prixMin && bien.prix < this.filtres.prixMin) return false;
                if (this.filtres.prixMax && bien.prix > this.filtres.prixMax) return false;

                // Filtrage par superficie
                if (this.filtres.superficieMin && bien.superficie < this.filtres.superficieMin) return false;
                if (this.filtres.superficieMax && bien.superficie > this.filtres.superficieMax) return false;

                // Filtrage par type
                if (this.filtres.typeBien && bien.typeBiensImmobiliere?.nomTypeBiensImmo !== this.filtres.typeBien) {
                    return false;
                }

                // Filtrage par disponibilité (à vendre/à louer)
                if (this.filtres.aVendre !== null && bien.aVendre !== this.filtres.aVendre) {
                    return false;
                }

                // Filtrage par note
                if (this.filtres.noteMin && bien.note < this.filtres.noteMin) return false;

                return true;
            });
        }
    },
    components: {
        'room-slider': roomSlider,
        'Avis': Avis
    },
    // 11. Watchers pour réagir aux changements
    watch: {
        '$route.params.id'(newTypeId) {
            if (newTypeId && newTypeId !== this.typeSelectionne) {
                this.changerType(parseInt(newTypeId));
            }
        },

        showGeoModal(newVal) {
            if (newVal && this.selectedLat.value && this.selectedLng.value) {
                this.initMap();
            }
        }
    },
    methods: {
        async handleTabClick(tab) {
            this.currentTab = tab.id;
            await this.loadSousService(tab.id);
        },
        openModal() {
            const modal = new bootstrap.Modal(document.getElementById('mapmodal'));
            modal.show();
        },
        async incrementLike(id) {
            if (!this.$store.getters['auth/isAuthenticated']) {
                ElMessage.warning("Vous devez être connecté pour liker.");
                return;
            }

            const liked = localStorage.getItem(`liked_bien_${id}`);
            if (liked === 'true') {
                ElMessage.info("Vous avez déjà liké ce bien.");
                return;
            }

            try {
                this.isLiked = true;
                localStorage.setItem(`liked_bien_${id}`, 'true');

                const data = await this.$store.dispatch("biensImmobiliers/likeBien", id);

                // Mettre à jour le compteur localement
                const bienIndex = this.biensImmobiliers.findIndex(bien => bien.id === id);
                if (bienIndex !== -1) {
                    this.biensImmobiliers[bienIndex].nombreJaime = data.likes || this.biensImmobiliers[bienIndex].nombreJaime + 1;
                }

                ElMessage.success("Bien ajouté à vos favoris!");

            } catch (err) {
                console.error("Erreur lors du like :", err);
                ElMessage.error("Impossible de liker pour le moment");
                this.isLiked = false;
                localStorage.removeItem(`liked_bien_${id}`);
            }
        },
        // 3. Méthode pour changer de type
        async changerType(typeId) {
            this.typeSelectionne = typeId;
            this.pagination.pageActuelle = 1;
            await this.loadBiensImmobiliersByType(typeId, 0, this.pagination.taillePage);
        },

        async changerPage(nouvellePage) {
            if (nouvellePage < 1 || nouvellePage > this.pagination.totalPages) return;

            this.pagination.pageActuelle = nouvellePage;

            if (this.typeSelectionne) {
                await this.loadBiensImmobiliersByType(
                    this.typeSelectionne,
                    nouvellePage - 1,
                    this.pagination.taillePage
                );
            } else {
                await this.loadAllBiensImmobiliers(nouvellePage - 1, this.pagination.taillePage);
            }
        },

        // 5. Méthode pour changer la taille de page
        async changerTaillePage(nouvelleTaille) {
            this.pagination.taillePage = nouvelleTaille;
            this.pagination.pageActuelle = 1;

            if (this.typeSelectionne) {
                await this.loadBiensImmobiliersByType(this.typeSelectionne, 0, nouvelleTaille);
            } else {
                await this.loadAllBiensImmobiliers(0, nouvelleTaille);
            }
        },
        async loadTypeBiensImmobiliersOne() {
            const typeId = this.$route.params.id;
            try {

                // Récupérer le type de bien depuis le store
                try {
                    this.typebiensimmo = await this.$store.dispatch('typeBiens/getOne', typeId);
                    console.log("Type de bien récupéré :", this.typebiensimmo);
                } catch (error) {
                    console.error("Erreur lors de la récupération du type de bien :", error);
                }

            } catch (error) {
                console.error("Erreur lors de la récupération du bien immobilier", error);
            }
        },

        async loadAllBiensImmobiliers(page = 0, size = 12) {
            this.chargement = true;
            this.erreurChargement = null;

            try {
                const payload = { page: page, size: size };
                const response = await this.$store.dispatch('biensImmobiliers/getAll', payload);

                this.biensImmobiliers = response.content || [];
                this.pagination = {
                    pageActuelle: response.number + 1,
                    taillePage: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages
                };

                // Force le champ detailsBiensImmobiliers en tableau si nécessaire
                this.biensImmobiliers.forEach(bien => {
                    const details = bien.detailsBiensImmobiliers;
                    if (!Array.isArray(details)) {
                        bien.detailsBiensImmobiliers = details ? [details] : [];
                    }
                });

                console.log("Tous les biens immobiliers chargés:", this.biensImmobiliers);

            } catch (error) {
                console.error("Erreur lors de la récupération des biens:", error);
                this.erreurChargement = "Impossible de charger les biens immobiliers.";
                this.biensImmobiliers = [];
            } finally {
                this.chargement = false;
            }
        },
        async loadBiensImmobiliersByType(typeId, page = 0, size = 10) {
            this.chargement = true;
            this.erreurChargement = null;

            try {
                const payload = {
                    page: page,
                    size: size,
                    typeId: typeId,
                };

                const response = await this.$store.dispatch('biensImmobiliers/getBiensByType', payload);
                console.log("Réponse de la fonction :", response.content);
                // Mise à jour des données
                this.biensImmobiliers = response.content || [];
                this.pagination = {
                    pageActuelle: response.number + 1, // +1 car l'API utilise 0-based
                    taillePage: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages
                };

                // Force le champ detailsBiensImmobiliers en tableau si nécessaire
                this.biensImmobiliers.forEach(bien => {
                    const details = bien.detailsBiensImmobiliers;
                    if (!Array.isArray(details)) {
                        bien.detailsBiensImmobiliers = details ? [details] : [];
                    }
                });

                console.log("Biens immobiliers par type chargés:", this.biensImmobiliers);

            } catch (error) {
                console.error("Erreur lors de la récupération des biens par type:", error);
                this.erreurChargement = "Impossible de charger les biens immobiliers.";
                this.biensImmobiliers = [];
            } finally {
                this.chargement = false;
            }
        },
        async ouvrirNotation(bien) {
            this.bienSelectionne = bien;
            this.noteTemp = bien.note || 0;
            this.notationVisible = true;
        },
        async envoyerNote() {
            try {
                await this.$store.dispatch('biensImmobiliers/noterBien', {
                    id: this.bienSelectionne.id,
                    note: this.noteTemp,
                });

                // Mettre à jour la note localement
                const bienIndex = this.biensImmobiliers.findIndex(bien => bien.id === this.bienSelectionne.id);
                if (bienIndex !== -1) {
                    this.biensImmobiliers[bienIndex].note = this.noteTemp;
                }

                ElMessage.success("Merci pour votre note !");
                this.notationVisible = false;
            } catch (e) {
                ElMessage.error("Erreur lors de l'envoi de la note.");
            }
        },
        voirDetails(bien) {
            // Navigation vers la page de détails du bien
            this.$router.push({
                name: 'DirectoryDetails',
                params: { id: bien.id }
            });
        },
        toggleRoomSelection(room) {
            const index = this.selectedRooms.findIndex(r => r.id === room.id);
            if (index !== -1) {
                // Déjà sélectionné, on retire
                this.selectedRooms.splice(index, 1);
                this.totalPrice -= (room.prix || 0) * (room.nombre || 1);
            } else {
                // Nouvelle sélection
                this.selectedRooms.push(room);
                this.totalPrice += (room.prix || 0) * (room.nombre || 1);
            }
        },
        async sendMessage() {
            const loader = loading.show();
            try {
                const payload = {
                    nom: this.form.nom,
                    email: this.form.email,
                    telephone: this.form.telephone,
                    message: this.form.message,
                }
                const response = await store.dispatch('typeBiens/send', payload)
                ElMessage({
                    showClose: true,
                    message: 'Element ajouté avec success.',
                    type: "success",
                });
            } catch (error) {
                console.error('Erreur lors de la création de la catégorie:', error)
            } finally {
                loader.hide();
                this.loadService();
            }
        },
        async loadService() {
            try {
                const response = await this.$store.dispatch('typeBiens/getAll');
                this.services = response;
            } catch (error) {
                console.error('Erreur lors du chargement des services :', error);
                this.errorMessage = "Désolé, un problème est survenu lors du chargement des services.";
            }
        },
        async loadSousService(categoryId) {
            const typeService = ref([]);
            const selectedTypeService = ref(null);
            try {
                const response = await this.$store.dispatch('biensImmobiliers/getAllSousService', categoryId);
                typeService.value = response;
            } catch (error) {
                console.error("Erreur lors du chargement des sous-services :", error);
            }
        },

        trierResultats(critere) {
            switch (critere) {
                case 'prix_croissant':
                    this.biensImmobiliers.sort((a, b) => a.prix - b.prix);
                    break;
                case 'prix_decroissant':
                    this.biensImmobiliers.sort((a, b) => b.prix - a.prix);
                    break;
                case 'superficie_croissante':
                    this.biensImmobiliers.sort((a, b) => a.superficie - b.superficie);
                    break;
                case 'superficie_decroissante':
                    this.biensImmobiliers.sort((a, b) => b.superficie - a.superficie);
                    break;
                case 'note_decroissante':
                    this.biensImmobiliers.sort((a, b) => (b.note || 0) - (a.note || 0));
                    break;
                case 'plus_recents':
                    this.biensImmobiliers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
                case 'plus_vus':
                    this.biensImmobiliers.sort((a, b) => b.nombreVues - a.nombreVues);
                    break;
                default:
                    // Tri par défaut (plus récents)
                    this.biensImmobiliers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
        },
        formatEnum(value) {
            // Convertit EXEMPLE_ENUM → Exemple Enum
            return value
                .toLowerCase()
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        },
        async loadProduit(item) {
            try {
                const response = await this.$store.dispatch('sousService/getAllProduit', item?.id);
                produits.value = response;
                selectedTypeService.value = item;
                openModalSuivi();
            } catch (error) {
                console.error("Erreur lors du chargement des produits :", error);
            }
        },
        formatCurrency(value) {
            if (!value) return '—';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0,
            }).format(value);
        },

        async convertCurrency(amount, fromCurrency, toCurrency) {
            if (!amount) return null;
            try {
                const url = `https://v6.exchangerate-api.com/v6/aea6e2851889287522f072cb/latest/${fromCurrency}`;
                const response = await axios.get(url);

                if (response.data.result !== "success") {
                    throw new Error('Erreur API de conversion');
                }

                const rate = response.data.conversion_rates[toCurrency];
                if (!rate) throw new Error(`Taux pour ${toCurrency} non trouvé`);

                return (amount * rate).toFixed(2);
            } catch (error) {
                console.error('Erreur conversion devise:', error);
                return null;
            }
        },

        // Exemple de méthode pour convertir un prix de bien et le stocker
        async updateConvertedPrice(bien, fromCurrency = 'XOF', toCurrency = 'USD') {
            const converted = await this.convertCurrency(bien.prix, fromCurrency, toCurrency);
            if (converted) {
                bien.convertedPrice = converted;  // tu peux stocker dans une propriété du bien
            } else {
                bien.convertedPrice = null;
            }
        },

        // Si tu veux convertir tous les biens affichés d’un coup :
        async convertAllPrices(toCurrency) {
            const fromCurrency = 'XOF'; // ou dynamique selon ton besoin
            for (const bien of this.biensImmobiliers) {
                await this.updateConvertedPrice(bien, fromCurrency, toCurrency);
            }
        },
        capitalize(value) {
            if (!value) return ''
            return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        },
        openModalSuivi() {
            const modal = new bootstrap.Modal(document.getElementById('detailModal'));
            modal.show();
        },
        getImageUrl(idfile) {

            // return `https://93.115.20.172:8081/fichier/download/${idfile}`;
            return `${API_URLS.API_BASE}/fichier/download/${idfile}`;

        },
    },
};
</script>
<style scoped>
.room-options-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}

.leaflet-container-map {
    height: 600px;
    width: 100%;
}

.wide-card {
    min-width: 250px;
    max-height: 150px;
    max-width: 100%;
}

.room-card {
    flex: 1 1 calc(33.333% - 40px);
    max-width: 400px;
    background-color: #1e1e1e;
    border-radius: 12px;
    padding: 16px;
    color: white;
}

.like-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.3s ease;
}

.like-btn .fa-heart {
    transition: transform 0.3s ease, color 0.3s ease;
}

.like-btn.clicked .fa-heart {
    transform: scale(1.2);
    color: #dc3545;
}

.like-btn:hover .fa-heart {
    transform: scale(1.1);
}

.like-count {
    transition: all 0.3s ease;
}

.card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-img-top {
    transition: transform 0.3s ease;
}

.card:hover .card-img-top {
    transform: scale(1.05);
}

.rating-stars i {
    transition: color 0.2s ease, transform 0.2s ease;
}

.rating-stars i:hover {
    transform: scale(1.2);
}

.badge {
    font-weight: 500;
    padding: 6px 12px;
}

.pagination .page-link {
    border-radius: 6px;
    margin: 0 2px;
    border: none;
    color: #6c757d;
}

.pagination .page-item.active .page-link {
    background-color: #007bff;
    border-color: #007bff;
}

.modal.show {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .room-card {
        flex: 1 1 100%;
        max-width: 100%;
    }

    .card-body {
        padding: 1rem;
    }

    .pagination .page-link {
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
    }
}

/* Style pour les cartes de biens */
.property-card {
    border: none;
    border-radius: 15px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.property-image {
    position: relative;
    overflow: hidden;
}

.property-image img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.property-card:hover .property-image img {
    transform: scale(1.1);
}

.property-badges {
    position: absolute;
    top: 15px;
    left: 15px;
    z-index: 2;
}

.property-badges .badge {
    margin-right: 8px;
    margin-bottom: 8px;
    font-size: 0.75rem;
    padding: 6px 10px;
    border-radius: 20px;
}

.property-info {
    position: absolute;
    bottom: 15px;
    right: 15px;
    z-index: 2;
}

.property-details {
    padding: 1.5rem;
}

.property-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3436;
    margin-bottom: 0.5rem;
    line-height: 1.3;
}

.property-location {
    color: #636e72;
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.property-features {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 1rem 0;
}

.feature-item {
    display: flex;
    align-items: center;
    font-size: 0.85rem;
    color: #636e72;
}

.feature-item i {
    margin-right: 0.5rem;
    width: 16px;
}

.property-description {
    font-size: 0.9rem;
    color: #636e72;
    line-height: 1.5;
    margin: 1rem 0;
}

.property-footer {
    padding: 1rem 1.5rem;
    background-color: #f8f9fa;
    border-top: 1px solid #e9ecef;
}

.property-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: #00b894;
    margin: 0;
}

.property-price-unit {
    font-size: 0.8rem;
    color: #636e72;
    font-weight: 400;
}

.property-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.btn-action {
    padding: 0.5rem;
    border-radius: 8px;
    border: 1px solid #ddd;
    background: white;
    color: #636e72;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 40px;
}

.btn-action:hover {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
    transform: translateY(-2px);
}

.btn-action.liked {
    background-color: #dc3545;
    color: white;
    border-color: #dc3545;
}

/* Style pour les modals */
.modal-content {
    border: none;
    border-radius: 15px;
    overflow: hidden;
}

.modal-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom: none;
}

.modal-header .btn-close {
    filter: invert(1);
}

#map {
    border-radius: 10px;
    overflow: hidden;
}

.image-wrapper {
    overflow: hidden;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
}

.img-hover-zoom {
    transition: transform 0.3s ease;
}

.image-wrapper:hover .img-hover-zoom {
    transform: scale(1.05);
    /* ou 1.1 si tu veux un zoom plus fort */
}

[data-v-tooltip] {
    z-index: 9999 !important;
    /* Utilise un z-index très élevé */
}
</style>
