<template>
    <div class="card bg-transparent">
        <!-- Card header -->
        <div class="card-header border-bottom bg-transparent px-0 pt-0">
            <h3 class="card-title mb-0">Customer Review</h3>
        </div>

        <!-- Card body START -->
        <div class="card-body pt-4 p-0">
            <!-- Progress bar and rating START -->
            <div class="card bg-light p-4 mb-4">
                <div class="row g-4 align-items-center">
                    <!-- Rating info -->
                    <div class="col-md-4">
                        <div class="text-center">
                            <!-- Info -->
                            <h2 class="mb-0">4.5</h2>
                            <p class="mb-2">Based on 120 Reviews</p>
                            <!-- Star -->
                            <ul class="list-inline mb-0">
                                <li class="list-inline-item me-0"><i class="fa-solid fa-star text-warning"></i></li>
                                <li class="list-inline-item me-0"><i class="fa-solid fa-star text-warning"></i></li>
                                <li class="list-inline-item me-0"><i class="fa-solid fa-star text-warning"></i></li>
                                <li class="list-inline-item me-0"><i class="fa-solid fa-star text-warning"></i></li>
                                <li class="list-inline-item me-0"><i class="fa-solid fa-star-half-alt text-warning"></i>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Progress-bar START -->
                    <div class="col-md-8">
                        <div class="card-body p-0">
                            <div class="row gx-3 g-2 align-items-center">
                                <!-- Progress bar and Rating -->
                                <div class="col-9 col-sm-10">
                                    <!-- Progress item -->
                                    <div class="progress progress-sm bg-warning bg-opacity-15">
                                        <div class="progress-bar bg-warning" role="progressbar" style="width: 95%"
                                            aria-valuenow="95" aria-valuemin="0" aria-valuemax="100">
                                        </div>
                                    </div>
                                </div>
                                <!-- Percentage -->
                                <div class="col-3 col-sm-2 text-end">
                                    <span class="h6 fw-light mb-0">85%</span>
                                </div>

                                <!-- Progress bar and Rating -->
                                <div class="col-9 col-sm-10">
                                    <!-- Progress item -->
                                    <div class="progress progress-sm bg-warning bg-opacity-15">
                                        <div class="progress-bar bg-warning" role="progressbar" style="width: 75%"
                                            aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                                        </div>
                                    </div>
                                </div>
                                <!-- Percentage -->
                                <div class="col-3 col-sm-2 text-end">
                                    <span class="h6 fw-light mb-0">75%</span>
                                </div>

                                <!-- Progress bar and Rating -->
                                <div class="col-9 col-sm-10">
                                    <!-- Progress item -->
                                    <div class="progress progress-sm bg-warning bg-opacity-15">
                                        <div class="progress-bar bg-warning" role="progressbar" style="width: 60%"
                                            aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
                                        </div>
                                    </div>
                                </div>
                                <!-- Percentage -->
                                <div class="col-3 col-sm-2 text-end">
                                    <span class="h6 fw-light mb-0">60%</span>
                                </div>

                                <!-- Progress bar and Rating -->
                                <div class="col-9 col-sm-10">
                                    <!-- Progress item -->
                                    <div class="progress progress-sm bg-warning bg-opacity-15">
                                        <div class="progress-bar bg-warning" role="progressbar" style="width: 35%"
                                            aria-valuenow="35" aria-valuemin="0" aria-valuemax="100">
                                        </div>
                                    </div>
                                </div>
                                <!-- Percentage -->
                                <div class="col-3 col-sm-2 text-end">
                                    <span class="h6 fw-light mb-0">35%</span>
                                </div>

                                <!-- Progress bar and Rating -->
                                <div class="col-9 col-sm-10">
                                    <!-- Progress item -->
                                    <div class="progress progress-sm bg-warning bg-opacity-15">
                                        <div class="progress-bar bg-warning" role="progressbar" style="width: 20%"
                                            aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                                        </div>
                                    </div>
                                </div>
                                <!-- Percentage -->
                                <div class="col-3 col-sm-2 text-end">
                                    <span class="h6 fw-light mb-0">15%</span>
                                </div>
                            </div> <!-- Row END -->
                        </div>
                    </div>
                    <!-- Progress-bar END -->

                </div>
            </div>
            <!-- Progress bar and rating END -->

            <!-- Leave review START -->
            <form class="mb-5" @submit.prevent="submitAvis">
                <!-- Rating -->
                <div class="form-control-bg-light mb-3">
                    <select v-model.number="note" class="form-select">
                        <option :value="5">★★★★★ (5/5)</option>
                        <option :value="4">★★★★☆ (4/5)</option>
                        <option :value="3">★★★☆☆ (3/5)</option>
                        <option :value="2">★★☆☆☆ (2/5)</option>
                        <option :value="1">★☆☆☆☆ (1/5)</option>
                    </select>
                </div>
                <!-- Message -->
                <div class="form-control-bg-light mb-3">
                    <textarea v-model="commentaire" class="form-control" id="exampleFormControlTextarea1"
                        placeholder="Votre avis" rows="3" required></textarea>
                </div>
                <!-- Button -->
                <button type="submit" class="btn btn-lg btn-primary mb-0">
                    Envoyer l'avis <i class="bi fa-fw bi-arrow-right ms-2"></i>
                </button>
            </form>
            <!-- Leave review END -->

            <!-- Review item START -->
            <div class="d-md-flex my-4" v-for="avis in avisList" :key="avis.id">
                <!-- Avatar -->
                <div class="avatar avatar-lg me-3 flex-shrink-0">
                    <img class="avatar-img rounded-circle" :src="avis.fichier?.url || '/default-avatar.jpg'"
                        alt="avatar">
                </div>
                <!-- Text -->
                <div>
                    <div class="d-flex justify-content-between mt-1 mt-md-0">
                        <div>
                            <h6 class="me-3 mb-0">{{ avis.nom }}</h6>
                            <!-- Info -->
                            <ul class="nav nav-divider small mb-2">
                                <li class="nav-item">Séjour du {{ formatDate(avis.dateSejour) }}</li>
                                <li class="nav-item">{{ avis.nombreAvis }} avis rédigés</li>
                            </ul>
                        </div>
                        <!-- Review star -->
                        <div class="icon-md rounded text-bg-warning fs-6">{{ avis.note.toFixed(1) }}</div>
                    </div>

                    <p class="mb-2">{{ avis.commentaire }} </p>

                    <!-- Images -->
                    <div class="row g-4" v-if="avis.fichiers && avis.fichiers.length">
                        <div class="col-4 col-sm-3 col-lg-2" v-for="img in avis.fichiers" :key="img.id">
                            <img :src="img.url" class="rounded" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <!-- Divider -->
            <hr>
            <!-- Review item END -->

            <!-- Button -->
            <div class="text-center">
                <a class="btn btn-primary-soft mb-0" @click="loadMore">Charger plus</a>
            </div>
        </div>
        <!-- Card body END -->
    </div>
</template>
<script>
import { ref, onMounted, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from "element-plus";
import { API_URLS } from "@/config/api";
import { useStore } from 'vuex'
export default {
    name: "Avis",
    props: {
        biensId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            page: 1,
            pageSize: 5,
            avisListLocal: [],
            errorMessage: null,
            note: null,
            commentaire: '',
            nom: "",
            dateSejour: "",
            note: 5,
            commentaire: "",
            userInfo: { id: this.userId },
            biensImmobiliers: { id: this.bienId },
            nombreAvis: 1,
        };
    },
    computed: {
        avisList() {
            return this.avisListLocal.slice(0, this.page * this.pageSize);
        },
        userId() {
            return this.$store.getters["auth/userInfo"];  // 'auth' est le namespace du module
        },
        userName() {
            return this.$store.getters["auth/userName"];
        },
        email() {
            return this.$store.getters["auth/email"];
        },
    },
    methods: {
        formatDate(date) {
            if (!date) return "";
            return new Date(date).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        },
        async submitAvis() {
            if (!this.userId) {
                alert("Vous devez être connecté pour laisser un avis.");
                ElMessage.warning("Vous devez être connecté pour laisser un avis.");
                return;
            }
            try {
                const nouvelAvis = {
                    nom: this.userName || "Anonyme",
                    dateSejour: "2023-08-11",  // ou une date dynamique
                    note: this.note,
                    commentaire: this.commentaire,
                    role: "Utilisateur",
                    userInfo: { id: this.userId },
                    biensImmobiliers: { id: this.bienId },
                    nombreAvis: 1,
                };

                const result = await this.$store.dispatch('avis/create', nouvelAvis);
                this.message = "Avis créé avec succès !";
                // Reset formulaire...
            } catch (error) {
                this.message = "Erreur lors de la création de l'avis.";
                console.error(error);
            }
        },
        async loadDetailsBiensImmobiliers() {
            try {
                const response = await this.$store.dispatch('avis/getAvisParBien', this.biensId);
                // on récupère les données directement depuis la réponse
                this.avisListLocal = response || [];
            } catch (error) {
                console.error("Erreur lors du chargement des services :", error);
                this.errorMessage =
                    "Désolé, un problème est survenu lors du chargement des services.";
            }
        },
        async loadMore() {
            this.page++;
            // Vous pouvez aussi faire une nouvelle requête paginée si backend supporte
        },
    },
    async created() {
        await this.loadDetailsBiensImmobiliers();
    },
};
</script>