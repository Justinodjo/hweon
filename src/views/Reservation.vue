<template>
    <main class="py-5">
        <section>
            <div class="container">
                <!-- Card START -->
                <div class="card bg-light overflow-hidden px-sm-5">
                    <div class="row align-items-center g-4">
                        <!-- Content -->
                        <div class="col-sm-9">
                            <div class="card-body">
                                <!-- Title -->
                                <h1 class="m-0 h2 card-title">Faire une réservation</h1>
                            </div>
                        </div>

                        <!-- Image -->
                        <div class="col-sm-3 text-end d-none d-sm-block">
                            <img src="../assets/images/element/17.svg" class="mb-n4" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section>
            <div class="container">
                <div class="row g-4 g-lg-5">
                    <div class="col-xl-8">
                        <div class="vstack gap-5">
                            <!-- Alert box START -->
                            <div class="alert alert-danger alert-dismissible d-flex justify-content-between align-items-center fade show mb-4 rounded-3 pe-2"
                                role="alert">
                                <div class="d-flex">
                                    <span class="alert-heading h5 mb-0 me-2"><i
                                            class="bi bi-exclamation-octagon-fill"></i></span>
                                    <span><strong class="alert-heading me-2">Covid :</strong> Vous pourriez être
                                        invité à
                                        présenter un test RT-PCR négatif à Mains d'or plus</span>
                                </div>
                                <button type="button" class="btn btn-link text-primary-hover pb-0 text-end"
                                    data-bs-dismiss="alert" aria-label="Close">
                                    <i class="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <!-- Alert box END -->
                            <!-- Guest detail START -->
                            <div class="card shadow">
                                <!-- Card header -->
                                <div class="card-header border-bottom p-4">
                                    <h4 class="card-title mb-0"><i class="bi bi-people-fill me-2"></i>Information
                                        réservation</h4>
                                </div>

                                <!-- Card body START -->
                                <div class="card-body">
                                    <div class="row g-3">
                                        <!-- Form fields -->
                                        <div class="col-md-6">
                                            <label class="form-label">Nom</label>
                                            <input class="form-control" type="text" v-model="reservation.nom"
                                                placeholder="Entrez votre nom" required>
                                        </div>

                                        <div class="col-md-6">
                                            <label class="form-label">Prénoms</label>
                                            <input class="form-control" type="text" v-model="reservation.prenom"
                                                placeholder="Entrez votre prénom" required>
                                        </div>

                                        <div class="col-md-6">
                                            <label class="form-label">Contact</label>
                                            <input class="form-control" type="text" v-model="reservation.contact"
                                                placeholder="Entrez votre contact" required>
                                        </div>

                                        <div class="col-md-6">
                                            <label class="form-label">Email</label>
                                            <input class="form-control" v-model="reservation.email" type="email"
                                                placeholder="Entrez votre email" required>
                                        </div>

                                        <div class="col-md-6">
                                            <label class="form-label">Date Réservation</label>
                                            <input class="form-control" v-model="reservation.dateReservation"
                                                type="date" required>
                                        </div>

                                        <div class="col-md-6" hidden>
                                            <label class="form-label">Status</label>
                                            <select class="form-select" v-model="reservation.status">
                                                <option value="Encours" selected>Encours</option>
                                            </select>
                                        </div>

                                        <div class="col-md-6">
                                            <label class="form-label">Choisissez un service</label>
                                            <select class="form-select" v-model="selectedService"
                                                @change="onServiceChange">
                                                <option :value="null">Choisissez un service</option>
                                                <option v-for="items in services" :key="items.id" :value="items.id">{{
                                                    items.nom }}</option>
                                            </select>
                                        </div>

                                        <!-- Prestations -->
                                        <div class="card border mt-4" v-if="typeService.length > 0">
                                            <div class="card-header border-bottom">
                                                <h5 class="card-title mb-0">Quelles sont les prestations que vous
                                                    désirez ?</h5>
                                            </div>

                                            <div class="card-body">
                                                <form class="hstack flex-wrap gap-3">
                                                    <div v-for="(type, index) in typeService" :key="index"
                                                        class="form-check">
                                                        <input class="form-check-input" type="checkbox" :value="type.id"
                                                            :id="'type-' + type.id" :checked="isSelected(type)"
                                                            @change="toggleServiceSelection(type)" />
                                                        <label class="form-check-label" :for="'type-' + type.id">{{
                                                            type.nom }}</label>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside class="col-xl-4">
                        <div class="row g-4">
                            <!-- Total -->
                            <div class="col-md-6 col-xl-12 mt-4">
                                <div class="card shadow rounded-2">
                                    <div class="card-header border-bottom">
                                        <h5 class="card-title mb-0">Prestations</h5>
                                    </div>

                                    <div class="card-body">
                                        <ul class="list-group list-group-borderless" v-if="selectedTypes[0]">
                                            <li v-for="(type, index) in selectedTypes" :key="index"
                                                class="list-group-item d-flex justify-content-between align-items-center">
                                                <span class="h6 fw-light mb-0">{{ type.nom }}</span>
                                                <span>{{ formatPrice(type.prix) }}</span>
                                            </li>
                                        </ul>
                                        <h6 v-else>Ajouter des éléments</h6>
                                    </div>

                                    <div class="card-footer border-top">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <span class="h5 mb-0">Total</span>
                                            <span class="h5 mb-0">{{ formatPrice(totalPrice) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Mode de paiement -->
                            <div class="card shadow mt-3">
                                <div class="card-header border-bottom">
                                    <h5 class="card-title mb-0">Choisissez le montant à payer</h5>
                                </div>
                                <div class="card-body">
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" id="moitie" value="moitie"
                                            v-model="modePaiement" />
                                        <label class="form-check-label" for="moitie">Payer la moitié ({{
                                            formatPrice(totalPrice / 2) }})</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" id="total" value="total"
                                            v-model="modePaiement" />
                                        <label class="form-check-label" for="total">Payer la totalité ({{
                                            formatPrice(totalPrice) }})</label>
                                    </div>
                                </div>
                            </div>

                            <button id="pay-btn" @click="initierPaiement" class="btn btn-primary mt-3">Payer avec
                                FedaPay</button>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    </main>
</template>

<script>
import { useStore } from "vuex";
import { useLoading } from "vue-loading-overlay";
import { ElMessage } from "element-plus";
import { getToken } from "@/helpers/auth";

const loading = useLoading();
const store = useStore();

export default {
    data() {
        return {
            reservation: {
                nom: "",
                prenom: "",
                email: "",
                contact: "",
                paymentStatus: "En attente",
                status: "Encours"
            },
            services: [],
            selectedService: null,
            typeService: [],
            selectedTypes: [],
            modePaiement: "total",
        };
    },
    computed: {
        totalPrice() {
            return this.selectedTypes.reduce((sum, type) => sum + type.prix, 0);
        },
    },
    methods: {
        formatPrice(price) {
            return new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "XOF",
            }).format(price);
        },
        toggleServiceSelection(type) {
            const index = this.selectedTypes.findIndex((item) => item.id === type.id);
            if (index !== -1) {
                this.selectedTypes.splice(index, 1);
                console.log(`Service ${type.nom} retiré de la sélection.`);
            } else {
                this.selectedTypes.push(type);

                console.log(`Service ${type.nom} ajouté à la sélection.`);
            }
            this.saveSelectedTypes();
        },
        isSelected(type) {
            return this.selectedTypes.some((item) => item.id === type.id);
        },
        saveSelectedTypes() {
            const currentSelectedTypes = this.selectedTypes;
            const savedTypes = JSON.parse(localStorage.getItem("selectedTypes"));

            // Sauvegarder seulement si les types ont changé
            if (JSON.stringify(currentSelectedTypes) !== JSON.stringify(savedTypes)) {
                localStorage.setItem("selectedTypes", JSON.stringify(currentSelectedTypes));
            }
        },
        loadSelectedTypes() {
            const savedTypes = JSON.parse(localStorage.getItem("selectedTypes"));
            if (savedTypes) {
                this.selectedTypes = savedTypes;
            }
        },
        async loadServices() {
            const loader = loading.show();
            try {
                const response = await this.$store.dispatch("categorie/getAll");
                this.services = response;
            } catch (error) {
                console.error("Erreur lors du chargement des services :", error);
                ElMessage.error("Échec du chargement des services. Veuillez réessayer.");
            } finally {
                loader.hide();
            }
        },
        async onServiceChange() {
            if (!this.selectedService) {
                this.typeService = [];
                return; // Sortir de la fonction si aucun service n'est sélectionné
            }

            try {
                const response = await this.$store.dispatch(
                    "categorie/getAllSousService",
                    this.selectedService
                );
                this.typeService = response;
                this.loadSelectedTypes();  // Charger les types sélectionnés
            } catch (error) {
                console.error("Erreur lors du chargement des services :", error);
                ElMessage.error("Échec du chargement des services. Veuillez réessayer.");
            }
        },
        async initierPaiement() {
            if (!this.modePaiement) {
                ElMessage.warning("Veuillez choisir un mode de paiement.");
                return;
            }

            if (!this.reservation.email || !this.reservation.nom) {
                ElMessage.error("Veuillez remplir vos informations.");
                return;
            }

            if (this.selectedTypes.length === 0) {
                ElMessage.warning("Veuillez sélectionner au moins un service.");
                return;
            }

            const montant = this.modePaiement === "moitie" ? (this.totalPrice / 2) : this.totalPrice;
            const callbackUrl = `${window.location.origin}/confirmation-paiement?mode=${this.modePaiement}`;
            const script = document.createElement("script");
            script.src = 'https://cdn.fedapay.com/checkout.js?v=1.1.7';
            script.onload = () => {
                FedaPay.init('#pay-btn', {
                    public_key: 'pk_live_A4oJuu-WBgb1E5tnl2XU4VAy',
                    transaction: {
                        amount: montant,
                        description: "Réservation chez Mains d’or plus"
                    },
                    currency: {
                        iso: 'XOF'
                    },
                    customer: {
                        email: this.reservation.email,
                        lastname: this.reservation.nom,
                        firstname: this.reservation.prenom,
                        callback_url: callbackUrl,
                    },
                    onComplete: (resp) => {
                        const loader = loading.show();
                        if (resp.transaction.status === 'approved') {
                            // Prépare les données à envoyer pour la création de la réservation
                            const payload = {
                                nom: this.reservation.nom,
                                prenom: this.reservation.prenom,
                                email: this.reservation.email,
                                dateReservation: this.reservation.dateReservation,
                                contact: this.reservation.contact,
                                paymentStatus: this.reservation.paymentStatus,
                                status: this.reservation.status,
                                typeServices: this.selectedTypes,
                                userInfo: {
                                    id: this.$store.getters["auth/userInfo"] // Récupérer l'ID de l'utilisateur connecté
                                },
                            };
                            // Mise à jour du statut de la réservation et du paiement après un paiement réussi
                            this.reservation.paymentStatus = "Payé";
                            this.reservation.status = "Confirmé";


                            // Modifier le status de la réservation


                            // Appel à l'action Vuex pour créer la réservation
                            console.log("Tentative de création de réservation avec les données suivantes:", payload);
                            this.$store.dispatch('reservation/create', payload)
                                .then((response) => {
                                    console.log("Réponse après création de réservation:", response);

                                    this.resetForm(); // Réinitialiser le formulaire
                                    ElMessage.success("Réservation confirmée !");
                                    this.$router.push('/confirmation');
                                })
                                .catch((error) => {
                                    console.error("Erreur lors de la création de la réservation", error);
                                    ElMessage.error("Échec de la réservation.");
                                })
                                .finally(() => loader.hide());
                        } else {
                            this.reservation.paymentStatus = "Échoué"; // Si le paiement échoue
                            this.reservation.status = "Annulée";
                            this.$store.dispatch('reservation/create', payload)
                            ElMessage.error("Le paiement a échoué.");
                            loader.hide();
                        }
                    },
                });

            }

            document.head.appendChild(script);
        },
        resetForm() {
            this.reservation = {
                nom: "",
                prenom: "",
                contact: "",
                email: "",
                dateReservation: "",
                paymentStatus: "En attente",
                status: "Encours",
            };
            this.selectedTypes = [];
            this.modePaiement = "total";
            this.selectedService = null;
            this.typeService = [];
            this.loadSelectedTypes();
            localStorage.removeItem("selectedTypes");
        },

    },

    created() {

        this.loadServices();
        this.loadSelectedTypes();
    },
};
</script>

<style scoped>
/* Styles pour ton composant */
</style>
