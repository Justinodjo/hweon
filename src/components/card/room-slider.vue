<template>
    <!-- Room item START -->
    <div class="card shadow p-3">
        <div class="row g-4">
            <!-- Card img -->
            <div class="col-md-5 position-relative">

                <!-- Overlay item -->
                <div class="position-absolute top-0 start-0 z-index-1 mt-3 ms-4">
                    <div class="badge text-bg-danger">30% Off</div>
                </div>

                <!-- Slider START -->
                <div class="tiny-slider arrow-round arrow-xs arrow-dark overflow-hidden rounded-2"
                    v-if="roomDetails.fichiers && roomDetails.fichiers.length">
                    <div class="tiny-slider-inner" ref="sliderContainer" data-autoplay="true" data-arrow="true"
                        data-dots="false" data-items="1">
                        <!-- Image item -->
                        <div v-for="file in roomDetails?.fichiers" :key="file.id">
                            <img :src="getImageUrl(file.id)" alt="Card image">
                        </div>

                        <!-- Image item -->
                        <div><img src="../../assets/images/category/hotel/4by3/02.jpg" alt="Card image">
                        </div>

                        <!-- Image item -->
                        <div><img src="../../assets/images/category/hotel/4by3/03.jpg" alt="Card image">
                        </div>

                        <!-- Image item -->
                        <div><img src="../../assets/images/category/hotel/4by3/01.jpg" alt="Card image">
                        </div>



                    </div>
                </div>
                <!-- Slider END -->

                <!-- Button -->
                <!-- Button -->
                <a href="hotel-detail.html#" class="btn btn-link text-decoration-underline p-0 mb-0 mt-1"
                    data-bs-toggle="modal" data-bs-target="#roomDetail" @click="openRoomDetails(room)">
                    <i class="bi bi-eye-fill me-1"></i>voir plus de détails
                </a>
            </div>

            <!-- Card body -->
            <div class="col-md-7">
                <div class="card-body d-flex flex-column h-100 p-0">

                    <!-- Title -->
                    <h5 class="card-title"><a href="hotel-detail.html#">Luxury Room
                            with Balcony</a></h5>

                    <!-- Amenities -->
                    <ul class="nav nav-divider mb-2">
                        <li class="nav-item">Air Conditioning</li>
                        <li class="nav-item">Wifi</li>
                        <li class="nav-item">Kitchen</li>
                        <li class="nav-item">
                            <a href="hotel-detail.html#" class="mb-0 text-primary">More+</a>
                        </li>
                    </ul>

                    <p class="text-success mb-0">Free Cancellation till 7 Jan 2022
                    </p>

                    <!-- Price and Button -->
                    <div class="d-sm-flex justify-content-sm-between align-items-center mt-auto">
                        <!-- Button -->
                        <div class="d-flex align-items-center">
                            <h5 class="fw-bold mb-0 me-1">{{ formatCurrency(room.prix) }}</h5>
                            <span class="mb-0 me-2">/day</span>
                            <span class="text-decoration-line-through mb-0">$1000</span>
                        </div>
                        <!-- Price -->
                        <div class="mt-3 mt-sm-0">
                            <a class="btn btn-sm btn-primary mb-0" @click="handleRoomSelection">Select Room</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Room item END -->

    <!-- Modal for Room Details -->
    <div class="modal fade" id="roomDetail" tabindex="-1" aria-labelledby="roomDetailLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="roomDetailLabel">{{ roomDetails.nomdetails }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <!-- Image Section -->
                        <div class="col-md-6">
                            <div v-if="roomDetails.fichier">
                                <img :src="getImageUrl(roomDetails.fichier.id)" alt="Room Image"
                                    class="img-fluid rounded-2" />
                            </div>
                            <div v-if="roomDetails.fichiers && roomDetails.fichiers.length">
                                <h5>Additional Images:</h5>
                                <div v-for="file in roomDetails.fichiers" :key="file.id">
                                    <img :src="getImageUrl(file.id)" alt="Additional Image"
                                        class="img-fluid rounded-2 mb-2" />
                                </div>
                            </div>
                        </div>

                        <!-- Room Details Section -->
                        <div class="col-md-6">
                            <h6>Description:</h6>
                            <p>{{ roomDetails.description }}</p>

                            <h6>Price:</h6>
                            <p>{{ formatCurrency(roomDetails.prix) }}</p>

                            <h6>Status:</h6>
                            <p>{{ roomDetails.status ? 'Active' : 'Inactive' }}</p>

                            <h6>Views:</h6>
                            <p>{{ roomDetails.nombreVues }}</p>

                            <h6>Likes:</h6>
                            <p>{{ roomDetails.nombreJaime }}</p>
                        </div>
                    </div>
                </div>

                <!-- Sous-Details Section -->
                <div
                    v-if="roomDetails.sousDetailsBiensImmobiliers && roomDetails.sousDetailsBiensImmobiliers.length > 0">
                    <h5>Sub-Details</h5>
                    <div v-for="sousDetail in roomDetails.sousDetailsBiensImmobiliers" :key="sousDetail.id"
                        class="mb-3">
                        <h6>{{ sousDetail.typeSousDetailsBiens }}</h6>
                        <p><strong>Number: </strong>{{ sousDetail.nombre }}</p>
                        <p><strong>Description: </strong>{{ sousDetail.description }}</p>
                        <p><strong>Area: </strong>{{ sousDetail.superficie }} m²</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { tns } from 'tiny-slider';
// import { mapActions, mapGetters } from "vuex";
import { ref, onMounted, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from "element-plus";
import { API_URLS } from "@/config/api";
import { useStore } from 'vuex'
import { useLoading } from "vue-loading-overlay";
export default {
    setup() {
        const store = useStore();
        const loading = useLoading();

        return {
            store,
            loading
        }
    },
    props: {
        room: {
            type: Object,
            required: true,
        },
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
            store: useStore(),
            services: [],
            tabs: [],
            currentTab: null,
            form: {
                nom: "",
                email: "",
                telephone: "",
                message: "",
            },
            roomDetails: {
                nomdetails: '',
                description: '',
                prix: 0,
                status: false,
                nombreVues: 0,
                nombreJaime: 0,
                sousDetailsBiensImmobiliers: [],
                fichier: null,
                fichiers: []
            },
            loading: useLoading(),
            selectedRooms: [],
            totalPrice: 0,
            errorMessage: null,
        };
    },
    emits: ['roomSelected'],
    mounted() {
        this.$nextTick(() => {
            this.initTinySlider();
        });
        this.loadService().then(() => {
            if (this.services && this.services.length > 0) {
                this.currentTab = this.services[0].id;
            }
        });
    },
    watch: {
        room: {
            immediate: true,
            handler() {
                this.$nextTick(() => {
                    this.initTinySlider();
                });
            }
        },
        'roomDetails.fichiers': {
            handler() {
                this.$nextTick(() => {
                    this.initTinySlider();
                });
            }
        }
    },
    methods: {


        initTinySlider() {
            const sliderContainer = this.$refs.sliderContainer;
            if (!sliderContainer) return;
            const tnsSlider = tns({
                container: sliderContainer,
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
                currency: 'EUR',
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
        async updateConvertedPrice(bien, fromCurrency = 'EUR', toCurrency = 'USD') {
            const converted = await this.convertCurrency(bien.prix, fromCurrency, toCurrency);
            if (converted) {
                bien.convertedPrice = converted;  // tu peux stocker dans une propriété du bien
            } else {
                bien.convertedPrice = null;
            }
        },

        // Si tu veux convertir tous les biens affichés d’un coup :
        async convertAllPrices(toCurrency) {
            const fromCurrency = 'EUR'; // ou dynamique selon ton besoin
            for (const bien of this.biensImmobiliers) {
                await this.updateConvertedPrice(bien, fromCurrency, toCurrency);
            }
        },
        capitalize(value) {
            if (!value) return ''
            return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        },
        handleRoomSelection() {
            // Émet l’événement vers le parent avec les infos de la room
            this.$emit('room-selected', this.room);
        },
        // Ouvrir les détails de l'appartement dans le modal
        openRoomDetails(room) {
            // Mettre à jour les détails de la chambre
            this.roomDetails = {
                nomdetails: room.nomdetails,
                description: room.description,
                prix: room.prix,
                status: room.status,
                nombreVues: room.nombreVues,
                nombreJaime: room.nombreJaime,
                fichier: room.fichier,
                fichiers: room.fichiers,
                sousDetailsBiensImmobiliers: room.sousDetailsBiensImmobiliers || []
            };
        },
        formatCurrency(value) {
            if (!value) return '—';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
            }).format(value);
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
        getImageUrl(idfile) {

            // return `https://93.115.20.172:8081/fichier/download/${idfile}`;
            return `${API_URLS.API_BASE}/fichier/download/${idfile}`;

        },
        // toggleRoomSelection(room) {
        //     const index = this.selectedRooms.findIndex(r => r.id === room.id);
        //     if (index !== -1) {
        //         this.selectedRooms.splice(index, 1);
        //         this.totalPrice -= (room.prix || 0) * (room.nombre || 1);
        //     } else {
        //         this.selectedRooms.push(room);
        //         this.totalPrice += (room.prix || 0) * (room.nombre || 1);
        //     }
        // }
    },
};
</script>
<style scoped>
.tiny-slider-inner img {
    width: 100%;
    height: auto;
    /* Garde les proportions */
    object-fit: cover;
    /* Coupe l'image pour remplir si nécessaire */
}
</style>
