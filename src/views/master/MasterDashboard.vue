<template>
    <main>
        <dynamic-sidebar />
        <router-view />
    </main>
</template>
<script>
import { tns } from 'tiny-slider';
import { mapActions, mapGetters } from "vuex";
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
import DynamicSidebar from '@/layouts/components/sidebar/DynamicSidebar.vue';

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
    );
    out;
  `;

            const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                data.elements.forEach(el => {
                    // Créer un élément DOM personnalisé si besoin (sinon un marker simple)
                    const popup = new maplibregl.Popup({ offset: 25 }).setText(el.tags.name || el.tags.amenity);

                    new maplibregl.Marker()
                        .setLngLat([el.lon, el.lat])
                        .setPopup(popup)
                        .addTo(mapInstance);
                });
            } catch (error) {
                console.error("Erreur chargement POIs : ", error);
            }
        };


        const initMap = () => {
            nextTick(() => {
                const mapElement = document.getElementById('map');
                if (!mapElement) {
                    console.error("Le conteneur #map n'existe pas dans le DOM !");
                    return;
                }

                if (mapInstance) {
                    mapInstance.remove(); // MapLibre ne supporte pas remove(), donc re-créer l’élément si nécessaire
                    mapElement.innerHTML = '';
                }

                mapInstance = new maplibregl.Map({
                    container: 'map',
                    style: 'https://demotiles.maplibre.org/style.json', // ou ton propre style personnalisé
                    center: [selectedLng.value, selectedLat.value],
                    zoom: 18,
                });

                new maplibregl.Marker()
                    .setLngLat([selectedLng.value, selectedLat.value])
                    .setPopup(new maplibregl.Popup().setText("Localisation du bien"))
                    .addTo(mapInstance);

                mapInstance.on('load', () => {
                    loadNearbyPOI(selectedLat.value, selectedLng.value);
                });

                setTimeout(() => {
                    mapInstance.resize(); // Remplace `invalidateSize` de Leaflet
                }, 300);
            });
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
            services: [],
            tabs: [],
            currentTab: null,
            biensId: this.$route.params.id,
            biensImmobiliers: null,
            defaultAvatarUrl: new URL('@/assets/images/avatar/01.jpg', import.meta.url).href,
            isLiked: false,
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
        this.loadService().then(() => {
            if (this.services && this.services.length > 0) {
                this.currentTab = this.services[0].id;
            }
        });

        this.loadBiensImmobiliersOne();
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
        ...mapGetters('auth', ['userName', 'secondName', 'email', 'userRoles', 'userInfo', 'userFichier', 'email']),
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


        fullName() {
            // Ici vous pouvez ajouter des calculs ou récupérer le nom de l'utilisateur
            // Exemple avec vuex
            if (this.userName && this.secondName) {
                return this.userName + ' ' + this.secondName
            } else {
                return 'Non Connecté'
            }
        },
        handleEmail() {
            // Idem pour l'email
            return this.email || 'non@connecte.com';
        },

        avatarUrl() {
            if (this.userFichier) {
                // Construire l'URL de l'avatar à partir du dossier assets
                return this.userFichier
                    ? `${API_URLS.API_BASE}/tfe/uploads/${this.userFichier}`
                    : new URL('@/assets/images/avatar/01.jpg', import.meta.url).href;
            }
            return this.defaultAvatarUrl;
        },
    },
    components: {
        'dynamic-sidebar': DynamicSidebar
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
            // 1. Vérifier si connecté
            if (!this.$store.getters['auth/isAuthenticated']) {
                ElMessage.warning("Vous devez être connecté pour liker.");
                return;
            }
            // 2. Si déjà liké, on bloque
            if (this.isLiked) {
                ElMessage.info("Vous avez déjà liké ce bien.");
                return;
            }
            localStorage.setItem(`liked_bien_${id}`, 'true');
            try {
                // 3. Mettre isLiked à true (pour affichage immédiat)
                this.isLiked = true;

                // 4. Appel API via Vuex
                const data = await this.$store.dispatch("biensImmobiliers/likeBien", id);

                // 5. Mettre à jour le compteur en local
                if (this.biensImmobiliers && this.biensImmobiliers.id === id) {
                    this.biensImmobiliers.nombreJaime = data.likes;
                }

                // 6. Ne PAS remettre isLiked à false ici pour garder le cœur rouge

            } catch (err) {
                console.error("Erreur lors du like :", err);
                ElMessage.error("Impossible de liker pour le moment");
                this.isLiked = false; // rollback si erreur
            }
        },

        async loadBiensImmobiliersOne() {
            try {
                this.biensImmobiliers = await this.$store.dispatch('biensImmobiliers/getOne', this.biensId);
                console.log("Voici le bien immobilier", this.biensImmobiliers);

                // 🔧 Force le champ en tableau s'il est null ou un objet
                if (this.biensImmobiliers) {
                    const d = this.biensImmobiliers.detailsBiensImmobiliers;
                    if (!Array.isArray(d)) {
                        this.biensImmobiliers.detailsBiensImmobiliers = d ? [d] : [];
                    }
                }

            } catch (error) {
                console.error("Erreur lors de la récupération du bien immobilier", error);
            }
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
        initTinySlider() {
            const sliderContainer = document.querySelector('.tiny-slider-inner');
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