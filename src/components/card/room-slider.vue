<template>
    <!-- Room item START -->
    <div class="card shadow p-3" v-if="room.fichiers && room.fichiers.length">
        <div class="row g-4">
            <!-- Card img -->
            <div class="col-md-5 position-relative">

                <!-- Overlay item -->
                <div class="position-absolute top-0 start-0 z-index-1 mt-3 ms-4">
                    <div class="badge" :class="{
                        'text-bg-success': room?.status == true, 'text-bg-danger': room?.status == false
                    }">{{ room?.status == true ? 'Disponible' : 'Non disponible' }}</div>
                </div>

                <!-- Slider START -->
                <div class="tiny-slider arrow-round arrow-xs arrow-dark overflow-hidden rounded-2"
                    v-show="room.fichiers && room.fichiers.length">
                    <div class="tiny-slider-inner" ref="sliderContainer" data-autoplay="true" data-arrow="true"
                        data-dots="false" data-items="1">
                        <!-- Image item -->
                        <div v-for="files in room?.fichiers" :key="files.id">
                            <img :src="getImageUrl(files.id)" alt="Card image">
                        </div>
                    </div>
                </div>
                <!-- Slider END -->

                <!-- Button -->
                <!-- Button -->
                <a class="btn btn-link text-decoration-underline p-0 mb-0 mt-1" @click="openIntervention(room)">
                    <i class="bi bi-eye-fill me-1"></i>Visiter l'appartement
                </a>
            </div>

            <!-- Card body -->
            <div class="col-md-7">
                <div class="card-body d-flex flex-column h-100 p-0">

                    <!-- Title -->
                    <h5 class="card-title"><a href="hotel-detail.html#">{{ room?.nomdetails }} </a></h5>

                    <!-- Amenities -->
                    <ul class="nav nav-divider mb-2">
                        <li class="nav-item">{{ room.typeDetailsBiens }}</li>
                        <li class="nav-item">DPE ({{ room.typeDPE }})</li>
                        <li class="nav-item"><i class="bi bi-eye-fill"></i> {{ roomDetails.nombreVues }}</li>
                        <li class="nav-item">
                            <a class="mb-0 text-primary" data-bs-toggle="modal" data-bs-target="#roomDetail"
                                @click="openRoomDetails(room)">Plus</a>
                        </li>
                    </ul>

                    <!-- <p class="text-success mb-0">Free Cancellation till 7 Jan 2022
                    </p> -->

                    <!-- Price and Button -->
                    <div class="d-sm-flex justify-content-sm-between align-items-center mt-auto">
                        <!-- Button -->
                        <div class="d-flex align-items-center">
                            <h5 class="fw-bold mb-0 me-1">{{ formatCurrency(room.prix) }}</h5>
                            <!-- <span class="mb-0 me-2">/day</span>
                            <span class="text-decoration-line-through mb-0">$1000</span> -->
                        </div>
                        <!-- Price -->
                        <div class="mt-3 mt-sm-0">
                            <button type="button" class="btn btn-sm mb-0"
                                :class="isRoomSelected(room) ? 'btn-danger' : (isSelectableRoom(room) ? 'btn-primary' : 'btn-secondary')"
                                :disabled="!isSelectableRoom(room)" @click="handleRoomSelection(room)">
                                <span v-if="!isSelectableRoom(room)">Indisponible</span>
                                <span v-else>{{ isRoomSelected(room) ? 'Sélectionné' : 'Sélectionner' }}</span>
                            </button>
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
                            <p :class="{
                                'text-success': room?.status == true, 'text-danger': room?.status == false
                            }">{{ roomDetails.status ? 'Active' : 'Inactive' }}</p>

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
    <AddIntervention ref="intervention" :biensOptions="[room]" :isEdit="false" id=" intervention"
        @save="handleInterventionSaved" />
</template>
<script>
import { tns } from 'tiny-slider';
import { jsPDF } from "jspdf";
// import { mapActions, mapGetters } from "vuex";
import { ref, onMounted, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from "element-plus";
import AddIntervention from "@/components/modal/AddIntervention.vue";
import { API_URLS } from "@/config/api";
import { getToken } from "@/helpers/auth";
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
        biensId: { type: Number, required: true },
        sliderMode: { type: String, default: 'carousel' },
        sliderAxis: { type: String, default: 'horizontal' },
        sliderSpace: { type: Number, default: 3 },
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
        sliderItems: { type: Number, default: 1 },
        sliderDirection: { type: String, default: 'ltr' },
        sliderNavContainer: { type: String, default: null },
        sliderItemsXs: { type: Number, default: 1 },
        sliderItemsSm: { type: Number, default: 2 },
        sliderItemsMd: { type: Number, default: 2 },
        sliderItemsLg: { type: Number, default: 2 },
        sliderItemsXl: { type: Number, default: 1 },
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
            roomSliderInstance: null,
            totalPrice: 0,
            errorMessage: null,
        };
    },
    emits: ['room-selected'],
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
    components: {
        AddIntervention,
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
    computed: {
        totalPrice() {
            return this.store.getters["contrats/totalPrice"];
        },
        selectedRoomIds() {
            return this.$store.state.contrats.selectedDetails.map(r => r.id);
        }
    },
    methods: {

        isSelectableRoom(room) {
            if (!room) return false;
            // cas booléen simple
            if (typeof room.status === "boolean") return room.status === true;
            // tolérance aux chaînes (EN_COURS, OCCUPE, LIBRE, etc.)
            if (typeof room.status === "string") {
                const s = room.status.toLowerCase();
                if (s.includes("en_cours") || s.includes("encours") || s.includes("occupe") || s.includes("occup")) return false;
                if (s.includes("libre") || s.includes("dispon")) return true;
            }
            // fallback : disponible
            return true;
        },
        initTinySlider() {
            const container = this.$refs.sliderContainer;
            if (!container) return;

            // Détruire l'ancienne instance si elle existe
            if (this.roomSliderInstance) {
                this.roomSliderInstance.destroy();
                this.roomSliderInstance = null;
            }
            const roomSliderInstance = tns({
                container: container,
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
                items: this.sliderItems || 1,
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
        async generatePDF(data) {
            if (!data.fichiers || !data.fichiers.length) {
                console.warn("Aucune image trouvée pour ce PDF !");
            }
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const margin = 20;
            let yPos = 20;

            // --- Titre ---
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text("Fiche d'intervention", pageWidth / 2, yPos, { align: 'center' });
            yPos += 15;

            // --- Infos générales ---
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            const infoFields = [
                { label: 'Type', value: data.typeIntervention },
                { label: 'Estimation coût', value: `${data.estimationCout ?? 0} XOF` },
                { label: 'Coût réel', value: `${data.coutReel ?? 0} XOF` },
                { label: 'Écart budgétaire', value: `${data.ecartBudgetaire ?? 0} XOF` },
                { label: 'Statut', value: data.statut },
                { label: 'Priorité', value: data.priorite }
            ];

            infoFields.forEach(field => {
                doc.setFont('helvetica', 'bold');
                doc.text(`${field.label} :`, margin, yPos);
                doc.setFont('helvetica', 'normal');
                doc.text(`${field.value}`, margin + 45, yPos);
                yPos += 8;
            });
            yPos += 5;

            // --- Description ---
            if (data.description) {
                doc.setFont('helvetica', 'bold');
                doc.text('Description :', margin, yPos);
                yPos += 7;
                const maxWidth = pageWidth - 2 * margin;
                const lines = doc.splitTextToSize(data.description, maxWidth);
                doc.setFont('helvetica', 'normal');
                doc.text(lines, margin, yPos);
                yPos += lines.length * 7 + 5;
            }

            // --- Documents ---
            if (data.documents && data.documents.length) {
                doc.setFont('helvetica', 'bold');
                doc.text('Documents liés :', margin, yPos);
                yPos += 7;
                doc.setFont('helvetica', 'normal');
                data.documents.forEach(docItem => {
                    const text = docItem.title || docItem.name || 'Sans titre';
                    doc.text(`- ${text}`, margin + 5, yPos);
                    yPos += 7;
                });
                yPos += 5;
            }

            // --- Images ---
            if (data.fichiers && data.fichiers.length) {
                doc.setFont('helvetica', 'bold');
                doc.text('Images :', margin, yPos);
                yPos += 7;

                const imgMaxWidth = 80;
                const imgMaxHeight = 60;
                let xPos = margin;
                const filesBase64 = await this.getAllImagesBase64(data.fichiers);
                console.log("Images converties en Base64 :", filesBase64);
                for (const imgData of filesBase64) {
                    try {
                        const img = new Image();
                        img.src = imgData;
                        await new Promise(resolve => { img.onload = resolve; });


                        const { width, height } = this.getScaledImageSize(img.width, img.height, imgMaxWidth, imgMaxHeight);

                        // Nouvelle ligne si dépassement largeur
                        if (xPos + width > pageWidth - margin) {
                            xPos = margin;
                            yPos += imgMaxHeight + 10;
                        }

                        // Nouvelle page si dépassement hauteur
                        if (yPos + height > pageHeight - margin) {
                            doc.addPage();
                            yPos = margin;
                        }

                        doc.addImage(imgData, 'PNG', xPos, yPos, width, height);
                        xPos += width + 10; // espace entre images
                    } catch (err) {
                        console.error("Erreur chargement image :", err);
                    }
                }
                yPos += imgMaxHeight + 10;
            }

            // --- Enregistrer PDF ---
            doc.save(`intervention_${data.typeIntervention}_${Date.now()}.pdf`);
        },
        openIntervention(room) {
            if (this.$refs.intervention) {
                // Si le client est un prospect, on passe `true`
                const isProspect = true; // ou calculé dynamiquement selon ta logique
                this.$refs.intervention.open({
                    typeIntervention: 'Visite appartement',
                    description: `Demande de visite programmée pour ${room.nomdetails} du bien immobilier.`,
                    biensImmobilersId: this.biensId,  // ID du bien global
                    detailsBienId: room.id
                }, isProspect);
            } else {
                console.error("Le composant Intervention n'est pas trouvé via $refs.intervention");
            }

            // Forcer l'ouverture du modal Bootstrap si besoin
            const modalEl = this.$refs.intervention?.$el;
            if (modalEl) {
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
            }
        },

        async handleInterventionSaved(intervention) {
            console.log("Intervention enregistrée :", intervention);
            // Définir le statut par défaut si c'est une nouvelle intervention
            if (!intervention.id) {
                intervention.statut = 'ENCOURS'; // statut par défaut
            }
            // Si payload contient un ID => update, sinon create
            if (intervention.id) {
                await this.$store.dispatch('interventions/update', intervention);
            } else {
                console.log('Token avant POST :', getToken());
                await this.$store.dispatch('interventions/create', intervention);
            }

            // Recharger toutes les interventions après création ou modification
            await this.$store.dispatch('interventions/getAll');
            this.generatePDF(intervention);

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
        handleRoomSelection(room) {
            if (!this.isSelectableRoom(room)) {
                ElMessage.warning("Impossible de sélectionner : logement occupé ou lié à un contrat actif.");
                return;
            }
            if (this.isRoomSelected(room)) {
                // Retirer du panier
                this.store.dispatch("contrats/removeFromCart", { id: room.id, type: "detail" });
            } else {
                // Ajouter au panier
                this.store.dispatch("contrats/addToCart", { item: room, type: "detail" });
            }
            this.$emit("room-selected", room);
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
            console.log('Room fichiers:', room.fichiers)

            this.$nextTick(() => {
                // Initialiser le slider avant ouverture
                this.initTinySlider();

                // Lors de l'ouverture du modal, forcer le refresh du slider
                const modalEl = document.getElementById('roomDetail');
                modalEl.addEventListener('shown.bs.modal', () => {
                    if (this.$refs.sliderContainer) {
                        const slider = this.$refs.sliderContainer;
                        if (slider && slider.tns) {
                            slider.tns.refresh(); // refresh du slider pour recalculer la taille
                        }
                    }
                }, { once: true });
            });
        },
        formatCurrency(value) {
            if (!value) return '—';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
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
        async getAllImagesBase64(fichiers) {
            return await Promise.all(fichiers.map(file => this.getBase64ImageFromURL(this.getImageUrl(file.id))));
        },

        getScaledImageSize(imgWidth, imgHeight, maxWidth = 180, maxHeight = 150) {
            let w = imgWidth;
            let h = imgHeight;

            const ratio = imgWidth / imgHeight;

            if (w > maxWidth) {
                w = maxWidth;
                h = w / ratio;
            }

            if (h > maxHeight) {
                h = maxHeight;
                w = h * ratio;
            }

            return { width: w, height: h };
        },
        // Fonction utilitaire pour convertir URL en Base64
        async getBase64ImageFromURL(url) {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        },
        getImageUrl(idfile) {

            // return `https://93.115.20.172:8081/fichier/download/${idfile}`;
            return `${API_URLS.API_BASE}/fichier/download/${idfile}`;

        },
        isRoomSelected(room) {
            return this.selectedRoomIds.includes(room.id);
        },
        toggleRoomSelection(room) {
            const index = this.selectedRooms.findIndex(r => r.id === room.id);
            if (index !== -1) {
                this.selectedRooms.splice(index, 1);
                this.totalPrice -= (room.prix || 0);
            } else {
                this.selectedRooms.push(room);
                this.totalPrice += (room.prix || 0);
            }
        }
    },
};
</script>
<style scoped>
.tns-item img {
    width: 100% !important;
    height: auto;
    object-fit: cover;
    /* ne déforme pas l'image */
}
</style>
