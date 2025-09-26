<template>
    <main>
        <!-- =======================
Main banner START -->
        <section class="pt-0">
            <!-- Background and title -->
            <div class="container-fluid style_img_pro">
                <div class="row">
                    <!-- Title -->
                    <div class="col-md-6 mx-auto text-center pt-8 pb-9 mt-7">
                        <h1 class="text-white">Hotel, cab, flight & tour experience</h1>
                        <p class="lead text-white mb-0">Get the best prices on 2,000,000+ properties, worldwide</p>
                    </div>
                </div> <!-- Row END -->
            </div>

            <!-- Search START -->
            <div class="container mt-n8">
                <div class="row">
                    <!-- Tabs START -->
                    <div class="col-11 col-lg-8 col-xl-6 mx-auto">
                        <ul
                            class="nav nav-tabs nav-bottom-line nav-justified nav-responsive bg-mode rounded-top z-index-9 position-relative pt-2 pb-0 px-2">
                            <li class="nav-item" v-for="(item, index) in services" :key="index"
                                @click="currentTab = item.id" :class="{ active: currentTab === item.id }">
                                <a class="nav-link mb-0" data-bs-toggle="tab" @click.prevent="currentTab = item.id">{{
                                    item.nomTypeBiensImmo }}</a>
                            </li>
                        </ul>
                    </div>
                    <!-- Tabs END -->

                    <!-- Tab content START -->
                    <div class="col-12">
                        <div class="tab-content" id="nav-tabContent">

                            <!-- Tab content item START -->
                            <div class="tab-pane fade show active" v-for="(item, index) in services" :key="index"
                                v-show="currentTab === item.id">
                                <form class="card shadow p-0">
                                    <!-- Card header -->
                                    <div class="card-header p-4">
                                        <h5 class="mb-0"><i class="fa-solid fa-hotel fa-fw me-2"></i>{{
                                            item.nomTypeBiensImmo }}</h5>
                                    </div>

                                    <!-- Card body -->
                                    <div class="card-body p-4 pt-0">
                                        <div class="row g-4">
                                            <!-- Location -->
                                            <div class="col-12">
                                                <div class="form-icon-input form-size-lg form-fs-lg">
                                                    <input type="text" class="form-control"
                                                        placeholder="Rechercher un bien..."
                                                        v-model="searchFilters.globalSearch" @input="searchBiens" />

                                                    <span class="form-icon"><i class="bi bi-search fs-5"></i></span>
                                                </div>
                                            </div>

                                        </div> <!-- Row END -->
                                    </div>
                                </form>
                            </div>
                            <!-- Tab content item END -->

                        </div>
                    </div>
                    <!-- Tab content END -->
                </div>
            </div>
            <!-- Search END -->
        </section>

        <!-- Modal ElDialog -->
        <el-dialog v-model="showGeoModal" title="Localisation du bien" width="80%">
            <div class="leaflet-container-wrapper">
                <div id="map" class="leaflet-container-map"></div>
            </div>
        </el-dialog>
        <!-- =======================
Main banner START -->
        <!-- Hotel grid START -->
        <section class="pt-0">
            <div class="container">
                <div class="row g-4">

                    <div v-if="biensImmobiliers.length === 0" class="text-center text-muted my-5">
                        Aucun bien immobilier trouvé.
                    </div>
                    <!-- Card item START -->
                    <div v-else class="col-md-6 col-xl-4" v-for="(biens, index) in biensImmobiliers" :key="index">
                        <div class="card card-img-scale shadow p-2 pb-0 h-100">
                            <!-- Image -->
                            <!-- Image and overlay -->
                            <div class="card-img-scale-wrapper rounded-3">
                                <!-- Overlay item -->
                                <div class="position-absolute top-0 start-0 z-index-1 m-4">
                                    <!-- <i class="bi"
                                        :class="biens.status == true ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'"
                                        style="font-size: 1.2rem;"></i> -->
                                    <div class="badge text-white" :class="{
                                        'bg-success': biens.status == true, 'bg-danger': biens.status == false
                                    }">{{ biens.status == true ? 'Disponible' : 'Non disponible' }}</div>
                                </div>
                                <!-- Image -->
                                <img :src="getImageUrl(biens.fichier?.id)" class="card-img" alt="hotel image">
                                <!-- Badge -->
                                <div class="position-absolute bottom-0 start-0 p-3 d-flex align-items-center gap-2">
                                    <div class="badge text-bg-dark fs-6 rounded-pill stretched-link"
                                        @click="onClickGeo(biens)">
                                        <i class="bi bi-geo-alt me-2"
                                            :class="{ 'pulse-animation text-success': biens.status == true }"></i>{{
                                                biens.commune.libelle }}
                                    </div>
                                </div>
                            </div>
                            <!-- Card body START -->
                            <div class="card-body px-3 pb-0">
                                <!-- Rating and cart -->
                                <div class="d-flex justify-content-between mb-3">
                                    <a href="hotel-grid.html#" class="badge bg-dark text-white"><i
                                            class="bi fa-fw bi-star-fill me-2 text-warning"></i>{{
                                                Math.floor(biens.note) }} </a>
                                    <!-- Icône de notation -->
                                    <button class="btn p-0 border-0 bg-transparent" @click="ouvrirNotation(biens)">
                                        <i class="bi fa-fw bi-bookmark h6 mb-0 z-index-2"></i>
                                    </button>

                                    <!-- Modal de notation -->
                                    <!-- <el-dialog v-model="notationVisible" title="Noter ce bien" width="30%">
                                        <el-rate v-model="noteTemp" :max="5" show-text></el-rate>

                                        <template #footer>
                                            <span class="dialog-footer">
                                                <el-button @click="notationVisible = false">Annuler</el-button>
                                                <el-button type="primary" @click="envoyerNote">Valider</el-button>
                                            </span>
                                        </template>
</el-dialog> -->

                                </div>

                                <!-- Title -->
                                <h5 class="card-title"><a href="hotel-detail.html">{{ biens.nom }} </a>
                                </h5>

                                <!-- List -->
                                <ul class="nav nav-divider mb-2 mb-sm-3">
                                    <li class="nav-item">{{ biens.typeBiensImmobiliere.nomTypeBiensImmo }} </li>
                                    <li class="nav-item">pièce{{ biens.detailsBiensImmobiliers.nombre > 1 ? 's' : '' }}
                                        : {{ biens.detailsBiensImmobiliers.nombre }}</li>
                                </ul>
                            </div>
                            <!-- Card body END -->

                            <!-- Card footer START-->
                            <div class="card-footer pt-0">
                                <!-- Price and Button -->
                                <div class="d-sm-flex justify-content-sm-between align-items-center">
                                    <!-- Price -->
                                    <div class="d-flex align-items-center">
                                        <div>
                                            <h5 class="fw-normal text-success mb-0 me-1">{{ formatCurrency(biens.prix)
                                            }}</h5>
                                            <div v-if="biens.convertedPrice" class="text-muted"
                                                style="font-size: 0.9rem;">
                                                (~ XOF{{ biens.convertedPrice }})
                                            </div>
                                        </div>
                                        <span class="mb-0 me-2" style="text-transform: capitalize;">/{{
                                            capitalize(biens.typeUnite)
                                        }}</span>
                                    </div>
                                    <!-- Button -->
                                    <div class="mt-2 mt-sm-0 z-index-2">
                                        <router-link :to="{ name: 'DirectoryDetails', params: { id: biens.id } }"
                                            class="btn btn-sm btn-primary-soft mb-0 w-100">Details<i
                                                class="bi bi-arrow-right ms-2"></i></router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Card item END -->

                </div> <!-- Row END -->

                <!-- Pagination -->
                <div class="row">
                    <div class="col-12">
                        <nav class="mt-4 d-flex justify-content-center" aria-label="navigation">
                            <ul class="pagination pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
                                <li class="page-item mb-0" :class="{ disabled: currentPage === 1 }"><a class="page-link"
                                        href="hotel-grid.html#" @click.prevent="prevPage" tabindex="-1"><i
                                            class="fa-solid fa-angle-left"></i></a>
                                </li>
                                <li class="page-item mb-0" v-for="(page, index) in getPaginationRange()" :key="index"
                                    :class="{ active: currentPage === page, disabled: page === '...' }"><a
                                        class="page-link" @click.prevent="goToPage(page)" href="#"
                                        v-if="page !== '...'">{{ page }} </a> <span v-else class="page-link">...</span>
                                </li>
                                <li class="page-item mb-0" :class="{ disabled: currentPage === totalPages }"><a
                                        class="page-link" href="#" @click.prevent="nextPage"><i
                                            class="fa-solid fa-angle-right"></i></a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </section>
        <!-- =======================
Hotel grid END -->

        <!-- =======================
Best deal START -->
        <section class=" pt-0 pt-md-8">
            <div class="container">
                <div class="row g-4 align-items-center">


                    <!-- Category START -->
                    <div class="col-lg-12">
                        <!-- Slider START -->
                        <div class="tiny-slider arrow-round arrow-blur arrow-hover">
                            <div class="tiny-slider-inner" v-if="items && items.length" ref="slider"
                                data-autoplay="true" data-arrow="true" data-edge="2" data-dots="false" data-items-xl="1"
                                data-items-lg="2" data-items-md="1">
                                <div v-for="(item, index) in items" :key="item.id" class="slider-item">
                                    <div class="card wide-card border rounded-3 overflow-hidden h-50">
                                        <div class="d-flex flex-column flex-sm-row h-50">
                                            <!-- Image -->
                                            <div class="w-100 w-sm-50" style="height: 200px;">
                                                <img class="w-100 h-100 object-fit-cover"
                                                    :src="item.image || '@/assets/images/placeholder.png'"
                                                    :alt="item.title">
                                            </div>

                                            <!-- Title and content -->
                                            <div class="col-sm-6">
                                                <div class="card-body px-3">
                                                    <h6 class="card-title"><a href="offer-detail.html"
                                                            class="stretched-link">{{
                                                                item.title }}</a>
                                                    </h6>
                                                    <p class="mb-0">{{ item.validate }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Category END -->
                </div>
            </div>
        </section>
        <!-- =======================
Best deal END -->

        <!-- =======================
About START -->
        <section class="py-0 py-lg-7">
            <div class="container">
                <!-- Title -->
                <div class="row mb-4">
                    <div class="col-12">
                        <h2>We always provide the best for our hotel visitors. We are happy to help you.</h2>
                        <p class="mb-0">We focus a great deal on the understanding of behavioral psychology and
                            influence triggers which are crucial for becoming a well-rounded Digital Marketer. We
                            understand that theory is important to build a solid foundation, we understand that theory
                            alone isn't going to get the job done.</p>
                    </div>
                </div>

                <!-- Counters and features START -->
                <div class="row g-4">
                    <!-- Counter -->
                    <div class="col-xl-4">
                        <div
                            class="card card-body bg-primary bg-opacity-10 vstack gap-4 justify-content-center h-100 p-4">
                            <!-- Counter item -->
                            <div class="d-flex justify-content-between align-items-center">
                                <h3 class="purecounter text-primary mb-0" data-purecounter-start="0"
                                    data-purecounter-end="10" data-purecounter-delay="200">0</h3>
                                <h6 class="fw-normal mb-0">Total Hotels</h6>
                            </div>

                            <!-- Counter item -->
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex justify-content-center me-3">
                                    <h3 class="purecounter text-primary mb-0" data-purecounter-start="0"
                                        data-purecounter-end="200" data-purecounter-delay="300">0</h3>
                                    <span class="h3 text-primary mb-0">+</span>
                                </div>
                                <h6 class="fw-normal mb-0">Total Staff</h6>
                            </div>

                            <!-- Counter item -->
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex justify-content-center me-3">
                                    <h3 class="purecounter text-primary mb-0" data-purecounter-start="0"
                                        data-purecounter-end="50" data-purecounter-delay="300">0</h3>
                                    <span class="h3 text-primary mb-0">+</span>
                                </div>
                                <h6 class="fw-normal mb-0">Amazing Services</h6>
                            </div>

                        </div>
                    </div>

                    <!-- Location -->
                    <div class="col-md-6 col-xl-4">
                        <div class="card  overflow-hidden">
                            <!-- Image -->
                            <img src="../assets/images/about/07.jpg" class="rounded-3" alt="">
                            <!-- Full screen button -->
                            <div class="w-100 h-100">
                                <button class="btn btn-dark position-absolute top-50 start-50 translate-middle mb-0"
                                    data-bs-toggle="modal" data-bs-target="#map360">
                                    <i class="bi bi-eye me-2"></i>View 360
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Features -->
                    <div class="col-md-6 col-xl-4">
                        <ul class="list-group list-group-borderless">
                            <li class="list-group-item py-3">
                                <h6 class="mb-0 fw-normal">
                                    <i class="bi bi-cash-coin fa-fw text-info me-2"></i>Best Rate Guaranteed
                                </h6>
                            </li>

                            <li class="list-group-item py-3">
                                <h6 class="mb-0 fw-normal">
                                    <i class="bi bi-credit-card-2-back fa-fw text-warning me-2"></i>Payment at Hotel
                                </h6>
                            </li>

                            <li class="list-group-item py-3">
                                <h6 class="mb-0 fw-normal">
                                    <i class="bi bi-wallet fa-fw text-success me-2"></i>Exclusive Members Rewards
                                </h6>
                            </li>

                            <li class="list-group-item py-3">
                                <h6 class="mb-0 fw-normal">
                                    <i class="bi bi-wifi fa-fw text-danger me-2"></i>WIFI Access
                                </h6>
                            </li>

                            <li class="list-group-item pt-3 pb-0">
                                <h6 class="mb-0 fw-normal">
                                    <i class="bi bi-tags fa-fw text-orange me-2"></i>No Hidden Changes
                                </h6>
                            </li>
                        </ul>

                    </div>
                </div>
                <!-- Counters and features END -->
            </div>
        </section>
        <!-- =======================
About END -->
    </main>
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
export default {
    setup() {
        const store = useStore();
        const loading = useLoading();
        const showGeoModal = ref(false)
        const selectedLat = ref(null)
        const selectedLng = ref(null)
        let mapInstance = null;
        function onClickGeo(bien) {
            selectedLat.value = bien.latitude
            selectedLng.value = bien.longitude
            showGeoModal.value = true
        }
        const notationVisible = ref(false)
        const noteTemp = ref(0)
        const bienSelectionne = ref(null)

        const loadNearbyPOI = async (lat, lng) => {
            const delta = 0.01 // ≈ 1km de rayon

            const query = `
    [out:json];
    (
      node["amenity"="school"](${lat - delta},${lng - delta},${lat + delta},${lng + delta});
      node["amenity"="restaurant"](${lat - delta},${lng - delta},${lat + delta},${lng + delta});
      node["amenity"="hospital"](${lat - delta},${lng - delta},${lat + delta},${lng + delta});
    );
    out;
  `;
            const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                data.elements.forEach(el => {
                    L.marker([el.lat, el.lon])
                        .addTo(mapInstance)
                        .bindPopup(el.tags.name || el.tags.amenity);
                });
            } catch (error) {
                console.error("Erreur chargement POIs : ", error);
            }
        };

        watch(showGeoModal, async (visible) => {
            if (visible) {
                await nextTick(); // attendre que le DOM soit affiché

                // Si carte déjà créée, la supprimer (important pour éviter les erreurs)
                if (mapInstance) {
                    mapInstance.remove();
                    mapInstance = null;
                }

                mapInstance = L.map('map', {
                    center: [selectedLat.value, selectedLng.value],
                    zoom: 15,
                    zoomControl: true,
                    attributionControl: true,
                });

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors',
                }).addTo(mapInstance);

                // Marqueur pour le bien
                L.marker([selectedLat.value, selectedLng.value])
                    .addTo(mapInstance)
                    .bindPopup('Localisation du bien')
                    .openPopup();

                // Charger POIs (restaurants, écoles, hôpitaux)
                loadNearbyPOI(selectedLat.value, selectedLng.value);

                // Très important : forcer le redimensionnement de la carte (cas du modal)
                setTimeout(() => {
                    mapInstance.invalidateSize();
                }, 300);
            }
        });

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
            onClickGeo,
            ouvrirNotation,
            envoyerNote,
            notationVisible,
            noteTemp,
            bienSelectionne,
        }
    },
    props: {
        sliderMode: { type: String, default: 'carousel' },
        sliderAxis: { type: String, default: 'horizontal' },
        sliderSpace: { type: Number, default: 10 },
        sliderEdge: { type: Number, default: 0 },
        sliderSpeed: { type: Number, default: 300 },
        sliderAutoPlay: { type: Boolean, default: true },
        sliderAutoPlayTime: { type: Number, default: 3000 },
        sliderHoverPause: { type: Boolean, default: true },
        sliderArrow: { type: Boolean, default: true },
        sliderDots: { type: Boolean, default: false },
        sliderLoop: { type: Boolean, default: true },
        sliderRewind: { type: Boolean, default: false },
        sliderAutoHeight: { type: Boolean, default: false },
        sliderAutoWidth: { type: Boolean, default: false },
        sliderfixedWidth: { type: Number, default: 0 },
        sliderTouch: { type: Boolean, default: true },
        sliderDrag: { type: Boolean, default: true },
        sliderItems: { type: Number, default: 3 },
        sliderDirection: { type: String, default: 'ltr' },
        sliderNavContainer: { type: String, default: null },
        sliderItemsXs: { type: Number, default: 1 },
        sliderItemsSm: { type: Number, default: 2 },
        sliderItemsMd: { type: Number, default: 2 },
        sliderItemsLg: { type: Number, default: 3 },
        sliderItemsXl: { type: Number, default: 4 },
    },
    data() {
        return {
            items: [
                {
                    image: new URL('../assets/images/offer/01.jpg', import.meta.url).href,
                    title: "Daily 50 Lucky Winners get a Free Stay",
                    validate: "Valid till: 15 Nov",
                },
                {
                    image: new URL('../assets/images/offer/04.jpg', import.meta.url).href,
                    title: "Up to 60% OFF",
                    validate: "On Hotel Bookings Online",
                },
                {
                    image: new URL('../assets/images/offer/03.jpg', import.meta.url).href,
                    title: "Book & Enjoy",
                    validate: "20% Off on the best available room rate",
                },
                {
                    image: new URL('../assets/images/offer/02.jpg', import.meta.url).href,
                    title: "Hot Summer Nights",
                    validate: "Up to 3 nights free!",
                },
                {
                    image: new URL('../assets/images/offer/02.jpg', import.meta.url).href,
                    title: "Hot Summer Nights",
                    validate: "Up to 3 nights free!",
                },
                {
                    image: new URL('../assets/images/offer/02.jpg', import.meta.url).href,
                    title: "Hot Summer Nights",
                    validate: "Up to 3 nights free!",
                },


            ],
            services: [],
            biensImmobiliers: [],
            currentPage: 1,
            perPage: 15,
            totalPages: 0,
            tabs: [],
            currentTab: null,
            searchFilters: {
                globalSearch: '',
                commune: '',
                type: '',
                dateDebut: '',
                dateFin: '',
                occupants: 0,
            },
            form: {
                nom: "",
                email: "",
                telephone: "",
                message: "",
            },
            errorMessage: null,
        };
    },
    mounted() {

        this.$nextTick(() => {
            this.initTinySlider();
        });
        this.currentPage = 1;
        this.loadService().then(() => {
            if (this.services && this.services.length > 0) {
                this.currentTab = this.services[0].id;
            }
            // Ajoute un log clair ici
            console.log("📦 mounted → currentPage =", this.currentPage);
            console.trace();
            this.loadBiensImmobiliers();
        });

        // typeImmo.value = this.$store.dispatch('typeBiens/getOne', typeBiensImmobiliereId);
    },
    watch: {
        currentTab() {
            this.currentPage = 1;
            this.searchBiens();
        }
    },
    computed: {


        /*******  acf277ec-6e0a-4db5-904e-902151f05a69  *******/
        // paginatedBiens() {
        //     const start = (this.currentPage - 1) * this.perPage;
        //     const end = start + this.perPage;
        //     return this.filteredBiens.slice(start, end);
        // },
        // totalPages() {
        //     return Math.ceil(this.filteredBiens.length / this.perPage);
        // }
    },
    methods: {


        initTinySlider() {
            const tnsSlider = tns({
                container: this.$refs.slider,
                mode: this.sliderMode,
                axis: this.sliderAxis,
                gutter: this.sliderSpace,
                edgePadding: this.sliderEdge,
                speed: this.sliderSpeed,
                autoWidth: this.sliderAutoWidth,
                controls: this.sliderArrow,
                nav: this.sliderDots,
                autoplay: this.sliderAutoPlay,
                autoplayTimeout: this.sliderAutoPlayTime,
                autoplayHoverPause: this.sliderHoverPause,
                autoplayButton: false,
                autoplayButtonOutput: false,
                controlsPosition: 'top',
                navContainer: this.sliderNavContainer,
                navPosition: 'top',
                autoplayPosition: 'top',
                controlsText: [
                    '<i class="bi bi-arrow-left"></i>',
                    '<i class="bi bi-arrow-right"></i>',
                ],
                loop: this.sliderLoop,
                rewind: this.sliderRewind,
                autoHeight: this.sliderAutoHeight,
                autoWidth: this.sliderAutoWidth,
                fixedWidth: this.sliderfixedWidth,
                touch: this.sliderTouch,
                mouseDrag: this.sliderDrag,
                arrowKeys: true,
                items: this.sliderItems,
                textDirection: this.sliderDirection,
                responsive: {
                    0: { items: this.sliderItemsXs },
                    576: { items: this.sliderItemsSm },
                    768: { items: this.sliderItemsMd },
                    992: { items: this.sliderItemsLg },
                    1200: { items: this.sliderItemsXl },
                },
            });
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
                const response = await request.get(url);

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
        async searchBiens() {
            const texte = this.searchFilters.globalSearch.trim();
            const type = this.currentTab;
            let status = null;

            // Détection du mot "disponible" ou "non disponible"
            if (/^disponible$/i.test(texte)) {
                status = true;
            } else if (/^non disponible$/i.test(texte)) {
                status = false;
            }
            const loader = this.$loading.show();
            try {
                if (texte.length > 5 || type) {
                    // Recherche avec texte (au moins 2 caractères) ou type (ou les deux)
                    const data = await this.$store.dispatch('biensImmobiliers/searchBiens', { texte, type });
                    this.biensImmobiliers = data;
                    this.totalPages = 1;
                    this.currentPage = 1;
                } else if (!texte && !type) {
                    // Aucun filtre, on recharge tout paginé
                    this.currentPage = 1;
                    await this.loadBiensImmobiliers();
                }
            } catch (error) {
                this.errorMessage = "Erreur lors de la recherche.";
                this.biensImmobiliers = [];
            } finally {
                loader.hide();
            }
        },

        showPagination() {
            return !this.searchFilters.globalSearch.trim();
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
            await Promise.all(
                this.biensImmobiliers.map(bien =>
                    this.updateConvertedPrice(bien, fromCurrency, toCurrency)
                )
            );
        },
        capitalize(value) {
            if (!value) return ''
            return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
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
        onTypeChange() {
            this.searchFilters.globalSearch = '';
        },
        async loadBiensImmobiliers() {
            const loader = this.$loading.show(); // ✅
            try {
                console.log('Chargement des biens - page:', this.currentPage);
                const response = await this.$store.dispatch('biensImmobiliers/getAll', {
                    page: this.currentPage - 1, // Spring Data commence à 0
                    size: this.perPage
                });
                console.log('Réponse reçue :', response);
                console.log("Réponse du backend (number):", response.number);
                // 🔧 mise à jour de currentPage depuis le backend
                this.currentPage = (response.number || 0) + 1;
                // ✅ Utiliser `response.content` et `response.totalPages`
                this.biensImmobiliers = response.content || [];
                this.totalPages = response.totalPages || 0;
            } catch (error) {
                console.error('Erreur lors du chargement des services :', error);
                this.errorMessage = "Désolé, un problème est survenu lors du chargement des biens.";
                this.biensImmobiliers = []; // éviter undefined
            } finally {
                loader.hide();
            }
        },
        getImageUrl(idfile) {

            // return `https://93.115.20.172:8081/fichier/download/${idfile}`;
            return `${API_URLS.API_BASE}/fichier/download/${idfile}`;

        },
        goToPage(page) {
            if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.loadBiensImmobiliers();
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;


                this.loadBiensImmobiliers();

            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadBiensImmobiliers();
            }
        },
        getPaginationRange() {
            const total = this.totalPages;
            const current = this.currentPage;
            const delta = 1; // nombre de pages autour de la page courante
            const range = [];
            const rangeWithDots = [];
            let l;

            for (let i = 1; i <= total; i++) {
                if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
                    range.push(i);
                }
            }

            for (let i of range) {
                if (l) {
                    if (i - l === 2) {
                        rangeWithDots.push(l + 1);
                    } else if (i - l !== 1) {
                        rangeWithDots.push('...');
                    }
                }
                rangeWithDots.push(i);
                l = i;
            }

            return rangeWithDots;
        },
    },
};
</script>

<style scoped>
.style_img_pro {
    background-image: url('../assets/images/bg/08.jpg');
    background-position: center left;
    width: 100%;
    height: 50em;
    position: relative;
    background-size: cover;
}

.wide-card {
    min-width: 250px;
    max-height: 150px;
    /* ou 450px, 500px selon votre besoin */
    max-width: 100%;
    /* Empêche de dépasser le conteneur */
}

.pulse-animation {
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 0.8;
    }

    50% {
        transform: scale(1.3);
        opacity: 1;
    }

    100% {
        transform: scale(1);
        opacity: 0.8;
    }
}

#map {
    height: 400px;
    width: 100%;
    max-height: 60vh;
    border-radius: 10px;
    z-index: 1;
}

/* Optionnel : ajout d'une superposition sombre */
.bg-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
}

.card-img {
    width: 100%;
    height: 250px;
    /* ou 300px */
    object-fit: cover;
    border-radius: 0.5rem;
    /* si besoin d'arrondi */
}

.card {
    display: flex;
    /* Utilisation de Flexbox pour organiser les éléments à l'intérieur */
    flex-direction: column;
    /* Les éléments de la carte sont disposés en colonne */
    height: 400px;
    /* Hauteur fixe pour toutes les cartes */
}

.card-img-scale-wrapper {
    flex-shrink: 0;
    /* Empêche l'image de rétrécir si le contenu est trop grand */
}

.card-body {
    flex-grow: 1;
    /* Permet à la partie du contenu (texte) de s'étirer pour occuper l'espace restant */
    overflow: hidden;
    /* Assure qu'aucun débordement de contenu n'apparaisse */
}

.card-footer {
    margin-top: auto;
    /* Le footer est poussé en bas de la carte */
    padding: 10px;
    /* Un peu de padding pour l'espace autour du footer */
}
</style>
