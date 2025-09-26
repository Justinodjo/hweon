<template>
    <main>
        <!-- =======================
Content START -->
        <section class="pt-0">
            <div class="container vstack gap-4">
                <!-- Title START -->
                <div class="row">
                    <div class="col-12">
                        <h1 class="fs-4 mb-0"><i class="bi bi-journals fa-fw me-1"></i>Listings</h1>
                    </div>
                </div>
                <!-- Title END -->

                <!-- Counter START -->
                <div class="row g-4">

                    <!-- Earning item -->
                    <div class="col-md-6 col-xl-4">
                        <div class="card card-body border p-4 h-100">
                            <h6>Earning
                                <a tabindex="0" class="h6 mb-0" role="button" data-bs-toggle="popover"
                                    data-bs-trigger="focus" data-bs-placement="top"
                                    data-bs-content="After US royalty withholding tax" data-bs-original-title=""
                                    title="">
                                    <i class="bi bi-info-circle-fill small"></i>
                                </a>
                            </h6>
                            <h2 class="text-success">$25,869</h2>
                            <p class="mb-2"><span class="text-primary me-1">0.20%<i class="bi bi-arrow-up"></i></span>vs
                                last month</p>
                            <div class="mt-auto text-primary-hover"><a href="agent-listings.html#"
                                    class="text-decoration-underline p-0 mb-0">View statement</a></div>
                        </div>
                    </div>

                    <!-- Booked Rooms item -->
                    <div class="col-md-6 col-xl-4">
                        <div class="card card-body border p-4 h-100">
                            <h6>Booked Rooms</h6>
                            <h2 class="text-info">58</h2>
                            <p class="mb-2"><span class="text-danger me-1">102</span>Total Rooms</p>
                            <div class="mt-auto text-primary-hover"><a href="agent-listings.html#"
                                    class="text-decoration-underline p-0 mb-0">View Bookings</a></div>
                        </div>
                    </div>

                    <!-- Available Rooms item -->
                    <div class="col-md-6 col-xl-4">
                        <div class="card card-body border p-4 h-100">
                            <h6>Available Rooms</h6>
                            <h2 class="text-warning">42</h2>
                            <p class="mb-2"><span class="text-danger me-1">102</span>Total Rooms</p>
                            <div class="mt-auto text-primary-hover"><a href="agent-listings.html#"
                                    class="text-decoration-underline p-0 mb-0">View Rooms</a></div>
                        </div>
                    </div>

                </div>
                <!-- Counter END -->

                <!-- Listing table START -->
                <div class="row">
                    <div class="col-12">

                        <div class="card border">
                            <!-- Card header -->
                            <div class="card-header border-bottom">
                                <h5 class="card-header-title">Mes annonces <span
                                        class="badge bg-primary bg-opacity-10 text-primary ms-2">{{
                                            biensImmobiliers.length
                                        }} Biens Immobiliers</span></h5>
                                <!-- Filtre et tri -->
                                <div class="mb-3 mt-3">
                                    <div class="row g-3">
                                        <div class="col-md-4">
                                            <input type="text" class="form-control" placeholder="Recherche..."
                                                v-model="searchFilters.globalSearch" @input="searchBiens">
                                        </div>

                                        <div class="col-md-3 m-3">
                                            <select class="form-select" v-model="currentTab" @change="onTypeChange">
                                                <option value="">Tous Types</option>
                                                <option v-for="service in services" :key="service.id"
                                                    :value="service.id">{{ capitalize(service.nomTypeBiensImmo) }}
                                                </option>
                                            </select>
                                        </div>

                                        <div class="col-md-2">
                                            <input type="number" class="form-control" placeholder="Prix Min"
                                                v-model.number="priceFilter.min" @input="filterByPrice">
                                        </div>

                                        <div class="col-md-2">
                                            <input type="number" class="form-control" placeholder="Prix Max"
                                                v-model.number="priceFilter.max" @input="filterByPrice">
                                        </div>


                                        <div class="d-flex col-md-2 left">
                                            <!-- Sélecteur de tri -->
                                            <select v-model="sortKey" @change="sortBiens"
                                                class="form-select bi bi-funnel-fill">
                                                <option value="">Trier par...</option>
                                                <option value="prix">Prix</option>
                                                <option value="nom">Nom</option>
                                                <option value="dateCreation">Date</option>
                                            </select>
                                            <!-- <button class="btn btn-primary w-100" @click="sortBiens">
                                                <i class="bi bi-funnel-fill"></i>
                                            </button> -->
                                        </div>
                                    </div>


                                </div>

                            </div>

                            <!-- Card body START -->
                            <div class="card-body vstack gap-3">
                                <!-- Listing item START -->
                                <div v-if="validBiens.length === 0" class="text-center py-4">
                                    <p class="text-muted">Aucun bien immobilier trouvé.</p>
                                </div>
                                <div class="card border p-2" v-for="(bien, index) in validBiens"
                                    :key="bien.id || `bien-${index}`">
                                    <div class="row g-4">
                                        <!-- Card img -->
                                        <div class="col-md-3 col-lg-2" v-if="bien.fichier && bien.fichier.id">
                                            <img :src="getImageUrl(bien?.fichier.id)" class="card-img rounded-2"
                                                alt="Card image" @error="handleImageError($event, bien)">

                                        </div>

                                        <!-- Card body -->
                                        <div class="col-md-9 col-lg-10">
                                            <div class="card-body position-relative d-flex flex-column p-0 h-100">

                                                <!-- Buttons -->
                                                <div class="list-inline-item dropdown position-absolute top-0 end-0">
                                                    <!-- Share button -->
                                                    <a href="agent-listings.html#"
                                                        class="btn btn-sm btn-round btn-light" role="button"
                                                        :id="`dropdownAction${index}`" data-bs-toggle="dropdown"
                                                        aria-expanded="false">
                                                        <i class="bi bi-three-dots-vertical"></i>
                                                    </a>
                                                    <button @click="toggleFavorite(bien)" class="btn btn-sm"
                                                        :class="{ 'btn-warning': bien.isFavorite, 'btn-outline-warning': !bien.isFavorite }">
                                                        <i class="bi"
                                                            :class="bien.isFavorite ? 'bi-star-fill' : 'bi-star'"></i>
                                                    </button>
                                                    <!-- dropdown button -->
                                                    <ul class="dropdown-menu dropdown-menu-end min-w-auto shadow rounded"
                                                        :aria-labelledby="'dropdownAction' + index">
                                                        <li><a class="dropdown-item" href="agent-listings.html#"><i
                                                                    class="bi bi-info-circle me-1"></i>Report</a></li>
                                                        <li><a class="dropdown-item" href="agent-listings.html#"><i
                                                                    class="bi bi-slash-circle me-1"></i>Disable</a></li>
                                                    </ul>

                                                </div>

                                                <!-- Title -->
                                                <h5 class="card-title mb-0 me-5"><router-link to="/details_biens_list"
                                                        style="cursor:pointer;"> {{ bien.nom || 'Bien sans nom'
                                                        }}</router-link></h5>
                                                <small><i class="bi bi-geo-alt me-2"></i>{{ bien.adresse }}</small>

                                                <!-- Price and Button -->
                                                <div
                                                    class="d-sm-flex justify-content-sm-between align-items-center mt-3 mt-md-auto">

                                                    <!-- Button -->
                                                    <div class="d-flex align-items-center">
                                                        <h5 class="fw-bold mb-0 me-1">{{ formatCurrency(bien.prix) }}
                                                        </h5>
                                                        <span class="mb-0 me-2">/day</span>
                                                    </div>

                                                    <!-- Price -->
                                                    <div class="hstack gap-2 mt-3 mt-sm-0">
                                                        <a href="agent-listings.html#"
                                                            class="btn btn-sm btn-primary mb-0"><i
                                                                class="bi bi-pencil-square fa-fw me-1"></i>Edit</a>
                                                        <a href="agent-listings.html#"
                                                            class="btn btn-sm btn-danger mb-0"><i
                                                                class="bi bi-trash3 fa-fw me-1"></i>Delete</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Listing item END -->

                            </div>
                            <!-- Card body END -->
                        </div>
                    </div>
                </div>
                <!-- Listing table END -->
            </div>
        </section>
        <!-- =======================
Content END -->
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

    },
    data() {
        return {
            items: [],
            services: [],
            biensOriginaux: [], // <- les données non modifiées
            biensImmobiliers: [],
            currentPage: 1,
            perPage: 15,
            totalPages: 0,
            tabs: [],
            currentTab: null,
            sortKey: null,
            selectedBien: null,
            showDetailModal: false,
            sortOrder: 'asc',
            searchFilters: {
                globalSearch: '',
                commune: '',
                type: '',
                dateDebut: '',
                dateFin: '',
                occupants: 0,
            },
            priceFilter: {
                min: null,
                max: null,
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
            // this.initTinySlider();
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


        biensFiltresEtTries() {
            let result = [...this.biensOriginaux];

            // filtre par prix
            result = result.filter(bien => {
                const prix = bien.prix;
                const minOk = this.priceFilter.min == null || prix >= this.priceFilter.min;
                const maxOk = this.priceFilter.max == null || prix <= this.priceFilter.max;
                return minOk && maxOk;
            });

            // tri
            if (this.sortKey) {
                result.sort((a, b) => {
                    let valA = a[this.sortKey];
                    let valB = b[this.sortKey];
                    if (this.sortKey === 'dateCreation') {
                        valA = new Date(valA).getTime();
                        valB = new Date(valB).getTime();
                    }
                    return this.sortOrder === 'asc' ? valA - valB : valB - valA;
                });
            }

            return result;
        },
        validBiens() {
            const biens = Array.isArray(this.biensFiltresEtTries) ? this.biensFiltresEtTries : [];
            return biens.filter(bien => bien && (bien.id || bien.id === 0));
        }
    },
    methods: {

        // NOUVELLE MÉTHODE: Gérer les erreurs d'image
        handleImageError(event, bien) {
            console.warn('Erreur de chargement d\'image pour le bien:', bien.id);
            // Remplacer par une image par défaut ou cacher l'élément
            event.target.style.display = 'none';

            // Optionnel: créer un élément de remplacement
            const placeholder = document.createElement('div');
            placeholder.className = 'card-img rounded-2 bg-light d-flex align-items-center justify-content-center';
            placeholder.style.height = '120px';
            placeholder.innerHTML = '<i class="bi bi-image text-muted" style="font-size: 2rem;"></i>';
            event.target.parentNode.appendChild(placeholder);
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
        // CORRECTION: formatCurrency avec vérification
        formatCurrency(value) {
            if (value == null || value === '') return '—';
            const numValue = Number(value);
            if (isNaN(numValue)) return '—';

            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0,
            }).format(numValue);
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
        filterByPrice() {
            this.biensImmobiliers = this.biensImmobiliers.filter(bien => {
                const prix = bien.prix;
                const minOk = this.priceFilter.min == null || prix >= this.priceFilter.min;
                const maxOk = this.priceFilter.max == null || prix <= this.priceFilter.max;
                return minOk && maxOk;
            });
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
        openDetail(bien) {
            this.selectedBien = bien;
            this.showDetailModal = true;
        },

        sortBiens() {
            if (!this.sortKey) return;

            this.biensImmobiliers.sort((a, b) => {
                let valA = a[this.sortKey];
                let valB = b[this.sortKey];

                // Si date, convertir en timestamp
                if (this.sortKey === 'dateCreation') {
                    valA = new Date(valA).getTime();
                    valB = new Date(valB).getTime();
                }

                if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1;
                if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1;
                return 0;
            });

            // Inverse l'ordre pour la prochaine fois
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        },

        // CORRECTION: toggleFavorite avec vérification
        toggleFavorite(bien) {
            if (!bien || !bien.id) {
                console.warn('toggleFavorite: bien invalide');
                return;
            }

            bien.isFavorite = !bien.isFavorite;

            this.$store.dispatch('biensImmobiliers/updateFavoriteStatus', {
                id: bien.id,
                isFavorite: bien.isFavorite
            }).catch(err => {
                console.error("Erreur mise à jour favori", err);
                // Remettre l'état précédent en cas d'erreur
                bien.isFavorite = !bien.isFavorite;
            });
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
        // CORRECTION: loadBiensImmobiliers avec gestion d'erreur
        async loadBiensImmobiliers() {
            try {
                const response = await this.$store.dispatch('biensImmobiliers/getBiensByUser', {
                    page: this.currentPage - 1,
                    size: this.perPage
                });

                // Vérifier et nettoyer la réponse
                if (response && response.content && Array.isArray(response.content)) {
                    this.biensOriginaux = response.content.filter(bien => bien && bien.id);
                } else if (Array.isArray(response)) {
                    this.biensOriginaux = response.filter(bien => bien && bien.id);
                } else {
                    console.warn('Réponse inattendue de l\'API:', response);
                    this.biensOriginaux = [];
                }

                this.biensImmobiliers = [...this.biensOriginaux];

                console.log('Biens chargés:', this.biensOriginaux.length);
            } catch (error) {
                console.error('Erreur lors du chargement des biens:', error);
                this.biensOriginaux = [];
                this.biensImmobiliers = [];
                this.errorMessage = "Erreur lors du chargement des biens immobiliers.";
            }
        },
        filterByPrice() {
            this.biensImmobiliers = this.biensOriginaux.filter(bien => {
                const prix = bien.prix;
                const minOk = this.priceFilter.min == null || prix >= this.priceFilter.min;
                const maxOk = this.priceFilter.max == null || prix <= this.priceFilter.max;
                return minOk && maxOk;
            });
        },
        getImageUrl(idfile) {
            if (!idfile) {
                console.warn('getImageUrl: ID de fichier manquant');
                return ''; // ou une image par défaut
            }
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
<style>
/* Assurer que l'image remplit le conteneur sans déformation */
.card-img {
    width: 100%;
    /* Prend toute la largeur de la colonne */
    height: 100%;
    /* Prend toute la hauteur disponible */
    object-fit: cover;
    /* Remplir l'espace sans déformation, en coupant si nécessaire */
    border-radius: .375rem;
    /* Si tu veux arrondir les bords des images */
}

/* Si tu veux limiter la hauteur de l'image pour qu'elle ne dépasse pas un certain seuil */
.card-img {
    height: 180px;
    /* Ajuste cette valeur selon la hauteur souhaitée */
    object-fit: cover;
    /* Toujours couvrir l'espace de manière cohérente */
}

/* Style pour les placeholders d'image */
.image-placeholder {
    background-color: #f8f9fa;
    border: 1px dashed #dee2e6;
    color: #6c757d;
}
</style>