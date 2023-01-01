<template>
    <div class="card bg-transparent">
        <!-- Card header -->
        <div class="card-header border-bottom bg-transparent px-0 pt-0">
            <h3 class="card-title mb-0"><i class="bi bi-star-fill text-warning me-2"></i>Avis Clients</h3>
            <span class="badge bg-primary">{{ totalAvis }} avis</span>
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
                            <h2 class="mb-0 display-4 fw-bold text-warning">{{ noteMoyenne }}</h2>
                            <p class="mb-2 text-muted">Basé sur {{ totalAvis }} avis</p>
                            <!-- Star -->
                            <ul class="list-inline mb-0">
                                <li v-for="i in 5" :key="i" class="list-inline-item me-0">
                                    <i class="fa-solid" :class="getStarClass(i, noteMoyenne)"></i>
                                </li>
                            </ul>
                            <!-- Pourcentage de recommandation -->
                            <div class="mt-3">
                                <span class="badge bg-success fs-6">
                                    <i class="bi bi-hand-thumbs-up me-1"></i>
                                    {{ tauxRecommandation }}% recommandent
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Progress-bar START -->
                    <!-- Progress-bar START -->
                    <div class="col-md-8">
                        <div class="card-body p-0">
                            <div class="row gx-3 g-2 align-items-center">
                                <!-- Barre de progression pour chaque note (5 à 1) -->
                                <template v-for="note in [5, 4, 3, 2, 1]" :key="note">
                                    <!-- Étoiles + Progress bar -->
                                    <div class="col-9 col-sm-10">
                                        <div class="d-flex align-items-center">
                                            <!-- Label étoiles -->
                                            <span class="me-2 small fw-medium" style="min-width: 50px;">
                                                {{ note }} <i class="fa-solid fa-star text-warning"></i>
                                            </span>
                                            <!-- Progress item -->
                                            <div class="progress progress-sm bg-warning bg-opacity-15 flex-grow-1">
                                                <div class="progress-bar" :class="getProgressBarClass(note)"
                                                    role="progressbar"
                                                    :style="{ width: getPercentageByNote(note) + '%' }"
                                                    :aria-valuenow="getPercentageByNote(note)" aria-valuemin="0"
                                                    aria-valuemax="100">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Pourcentage et compteur -->
                                    <div class="col-3 col-sm-2 text-end">
                                        <span class="h6 fw-light mb-0">{{ getPercentageByNote(note) }}%</span>
                                        <small class="text-muted d-block">({{ getCountByNote(note) }})</small>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                    <!-- Progress-bar END -->

                </div>
            </div>
            <!-- Progress bar and rating END -->
            <!-- Filtres et tri -->
            <div class="row g-3 mb-4" v-if="totalAvis > 0">
                <div class="col-md-6">
                    <select v-model="filterNote" @change="applyFilters" class="form-select">
                        <option value="">Toutes les notes</option>
                        <option value="5">5 étoiles uniquement</option>
                        <option value="4">4 étoiles et plus</option>
                        <option value="3">3 étoiles et plus</option>
                        <option value="2">2 étoiles et plus</option>
                        <option value="1">1 étoile et plus</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <select v-model="sortOrder" @change="applySort" class="form-select">
                        <option value="recent">Plus récents</option>
                        <option value="ancien">Plus anciens</option>
                        <option value="noteDesc">Note décroissante</option>
                        <option value="noteAsc">Note croissante</option>
                    </select>
                </div>
            </div>
            <!-- Leave review START -->
            <div class="card bg-light border-0 p-4 mb-4">
                <h5 class="mb-3">
                    <i class="bi bi-pencil-square me-2"></i>
                    Laisser un avis
                </h5>
                <form @submit.prevent="submitAvis">
                    <!-- Note avec étoiles interactives -->
                    <div class="mb-3">
                        <label class="form-label fw-medium">Votre note *</label>
                        <div class="rating-input">
                            <span v-for="i in 5" :key="i" @click="note = i" @mouseenter="hoverNote = i"
                                @mouseleave="hoverNote = 0" class="star-rating"
                                :class="{ 'active': i <= (hoverNote || note) }">
                                <i class="fa-solid fa-star fs-3"></i>
                            </span>
                        </div>
                        <small class="text-muted d-block mt-2">
                            {{ getRatingLabel(note) }}
                        </small>
                    </div>

                    <!-- Nom (si non connecté) -->
                    <div class="mb-3" v-if="!userId">
                        <label class="form-label">Votre nom *</label>
                        <input v-model="nom" type="text" class="form-control" placeholder="Jean Dupont" required>
                    </div>

                    <!-- Commentaire -->
                    <div class="mb-3">
                        <label class="form-label">Votre commentaire *</label>
                        <textarea v-model="commentaire" class="form-control" placeholder="Partagez votre expérience..."
                            rows="4" required :maxlength="500"></textarea>
                        <small class="text-muted">{{ commentaire.length }}/500 caractères</small>
                    </div>

                    <!-- Date de séjour -->
                    <div class="mb-3">
                        <label class="form-label">Date de visite/séjour</label>
                        <input v-model="dateSejour" type="date" class="form-control" :max="today">
                    </div>

                    <!-- Recommandation -->
                    <div class="mb-3">
                        <div class="form-check">
                            <input v-model="recommande" class="form-check-input" type="checkbox" id="recommande">
                            <label class="form-check-label" for="recommande">
                                Je recommande ce bien
                            </label>
                        </div>
                    </div>

                    <!-- Button -->
                    <button type="submit" class="btn btn-lg btn-primary" :disabled="submitting">
                        <span v-if="submitting">
                            <span class="spinner-border spinner-border-sm me-2"></span>
                            Envoi en cours...
                        </span>
                        <span v-else>
                            Publier l'avis <i class="bi bi-send ms-2"></i>
                        </span>
                    </button>
                </form>
            </div>
            <!-- Leave review END -->

            <!-- Review item START -->
            <!-- Message si aucun avis -->
            <div v-if="filteredAvisList.length === 0" class="text-center py-5">
                <i class="bi bi-chat-square-text text-muted" style="font-size: 3rem;"></i>
                <p class="text-muted mt-3">
                    {{ totalAvis === 0 ? 'Aucun avis pour le moment. Soyez le premier à donner votre avis !' :
                        'Aucun avis ne correspond à vos critères.' }}
                </p>
            </div>
            div v-else>
            <div class="d-md-flex my-4 position-relative" v-for="(avis, index) in paginatedAvisList" :key="avis.id">
                <!-- Avatar -->
                <div class="avatar avatar-lg me-3 flex-shrink-0">
                    <div
                        class="avatar-img rounded-circle bg-primary text-white d-flex align-items-center justify-content-center">
                        <span class="fw-bold fs-5">{{ getInitials(avis.nom) }}</span>
                    </div>
                </div>

                <!-- Text -->
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between mt-1 mt-md-0 flex-wrap">
                        <div class="mb-2">
                            <h6 class="mb-1">{{ avis.nom }}</h6>
                            <!-- Info -->
                            <ul class="nav nav-divider small mb-2 text-muted">
                                <li class="nav-item" v-if="avis.dateSejour">
                                    <i class="bi bi-calendar-event me-1"></i>
                                    Séjour du {{ formatDate(avis.dateSejour) }}
                                </li>
                                <li class="nav-item">
                                    <i class="bi bi-clock me-1"></i>
                                    {{ getRelativeTime(avis.dateCreation) }}
                                </li>
                                <li class="nav-item" v-if="avis.nombreAvis">
                                    <i class="bi bi-chat-dots me-1"></i>
                                    {{ avis.nombreAvis }} avis rédigé{{ avis.nombreAvis > 1 ? 's' : '' }}
                                </li>
                            </ul>
                        </div>

                        <!-- Review star -->
                        <div class="d-flex align-items-start gap-2">
                            <div class="icon-md rounded text-bg-warning fs-6 fw-bold">
                                <i class="fa-solid fa-star me-1"></i>
                                {{ avis.note.toFixed(1) }}
                            </div>
                            <!-- Badge recommandation -->
                            <span v-if="avis.recommande" class="badge bg-success">
                                <i class="bi bi-hand-thumbs-up me-1"></i>
                                Recommandé
                            </span>
                        </div>
                    </div>

                    <!-- Commentaire -->
                    <p class="mb-2">{{ avis.commentaire }}</p>

                    <!-- Images si présentes -->
                    <div class="row g-2 mb-3" v-if="avis.fichiers && avis.fichiers.length">
                        <div class="col-4 col-sm-3 col-lg-2" v-for="img in avis.fichiers" :key="img.id">
                            <img :src="img.url" class="rounded img-thumbnail cursor-pointer" alt="Photo avis"
                                @click="openLightbox(img.url)">
                        </div>
                    </div>

                    <!-- Actions (utile/signaler) -->
                    <div class="d-flex gap-3">
                        <button @click="toggleUtile(avis.id)" class="btn btn-sm btn-light"
                            :class="{ 'active': isUtile(avis.id) }">
                            <i class="bi bi-hand-thumbs-up me-1"></i>
                            Utile ({{ avis.utileCount || 0 }})
                        </button>
                        <button @click="signalerAvis(avis.id)" class="btn btn-sm btn-light">
                            <i class="bi bi-flag me-1"></i>
                            Signaler
                        </button>
                    </div>
                </div>
            </div>

            <!-- Divider entre les avis -->
            <hr v-if="index < paginatedAvisList.length - 1">
        </div>

        <!-- Pagination / Load more -->
        <div class="text-center mt-4" v-if="filteredAvisList.length > pageSize">
            <button v-if="hasMore" @click="loadMore" class="btn btn-primary-soft mb-0">
                Charger plus d'avis
                <i class="bi bi-chevron-down ms-2"></i>
            </button>
            <p class="text-muted small mt-2">
                Affichage de {{ paginatedAvisList.length }} sur {{ filteredAvisList.length }} avis
            </p>
        </div>
    </div>
    <!-- Card body END -->
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
            // Pagination
            page: 1,
            pageSize: 5,

            // Données
            avisListLocal: [],

            // Formulaire
            note: 5,
            hoverNote: 0,
            commentaire: '',
            nom: "",
            dateSejour: "",
            recommande: false,
            submitting: false,

            // Filtres
            filterNote: '',
            sortOrder: 'recent',

            // Utile
            avisUtiles: [],

            // Divers
            errorMessage: null,
            today: new Date().toISOString().split('T')[0]
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
        // Statistiques globales
        totalAvis() {
            return this.avisListLocal.length;
        },
        noteMoyenne() {
            if (this.totalAvis === 0) return 0;
            const somme = this.avisListLocal.reduce((acc, avis) => acc + avis.note, 0);
            return (somme / this.totalAvis).toFixed(1);
        },
        tauxRecommandation() {
            if (this.totalAvis === 0) return 0;
            const recommandes = this.avisListLocal.filter(a => a.recommande || a.note >= 4).length;
            return Math.round((recommandes / this.totalAvis) * 100);
        },
        // Avis filtrés
        filteredAvisList() {
            let filtered = [...this.avisListLocal];

            // Filtre par note
            if (this.filterNote) {
                const minNote = parseInt(this.filterNote);
                filtered = filtered.filter(a => a.note >= minNote);
            }

            // Tri
            switch (this.sortOrder) {
                case 'recent':
                    filtered.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));
                    break;
                case 'ancien':
                    filtered.sort((a, b) => new Date(a.dateCreation) - new Date(b.dateCreation));
                    break;
                case 'noteDesc':
                    filtered.sort((a, b) => b.note - a.note);
                    break;
                case 'noteAsc':
                    filtered.sort((a, b) => a.note - b.note);
                    break;
            }

            return filtered;
        },
        // Avis paginés
        paginatedAvisList() {
            return this.filteredAvisList.slice(0, this.page * this.pageSize);
        },

        hasMore() {
            return this.paginatedAvisList.length < this.filteredAvisList.length;
        }
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

        // Soumettre un avis
        async submitAvis() {
            if (!this.userId && !this.nom) {
                ElMessage.warning("Veuillez saisir votre nom");
                return;
            }

            if (!this.commentaire.trim()) {
                ElMessage.warning("Veuillez saisir un commentaire");
                return;
            }

            this.submitting = true;

            try {
                const nouvelAvis = {
                    nom: this.userName || this.nom,
                    dateSejour: this.dateSejour || new Date().toISOString().split('T')[0],
                    note: this.note,
                    commentaire: this.commentaire.trim(),
                    recommande: this.recommande,
                    userInfo: this.userId ? { id: this.userId } : null,
                    biensImmobiliers: { id: this.biensId },
                    nombreAvis: 1,
                    dateCreation: new Date().toISOString()
                };

                await this.$store.dispatch('avis/create', nouvelAvis);

                ElMessage.success("Merci pour votre avis !");

                // Reset formulaire
                this.note = 5;
                this.commentaire = '';
                this.nom = '';
                this.dateSejour = '';
                this.recommande = false;

                // Recharger les avis
                await this.loadDetailsBiensImmobiliers();

            } catch (error) {
                console.error("Erreur:", error);
                ElMessage.error("Erreur lors de l'envoi de l'avis");
            } finally {
                this.submitting = false;
            }
        },
        // Charger les avis
        async loadDetailsBiensImmobiliers() {
            try {
                const response = await this.$store.dispatch('avis/getAvisParBien', this.biensId);
                this.avisListLocal = response || [];

                // Trier par défaut (plus récents)
                this.avisListLocal.sort((a, b) =>
                    new Date(b.dateCreation || b.dateSejour) - new Date(a.dateCreation || a.dateSejour)
                );
            } catch (error) {
                console.error("Erreur:", error);
                this.errorMessage = "Erreur lors du chargement des avis";
            }
        },
        // Charger plus
        loadMore() {
            this.page++;
        },

        // Appliquer les filtres
        applyFilters() {
            this.page = 1;
        },

        // Appliquer le tri
        applySort() {
            this.page = 1;
        },
        // Marquer comme utile
        toggleUtile(avisId) {
            const index = this.avisUtiles.indexOf(avisId);
            if (index > -1) {
                this.avisUtiles.splice(index, 1);
                // Décrémenter le compteur
                const avis = this.avisListLocal.find(a => a.id === avisId);
                if (avis) avis.utileCount = (avis.utileCount || 1) - 1;
            } else {
                this.avisUtiles.push(avisId);
                // Incrémenter le compteur
                const avis = this.avisListLocal.find(a => a.id === avisId);
                if (avis) avis.utileCount = (avis.utileCount || 0) + 1;
            }

            // Sauvegarder dans localStorage
            localStorage.setItem('avisUtiles', JSON.stringify(this.avisUtiles));
        },

        isUtile(avisId) {
            return this.avisUtiles.includes(avisId);
        },

        // Signaler un avis
        signalerAvis(avisId) {
            ElMessage.info("Avis signalé. Merci pour votre retour.");
            // Ici vous pouvez ajouter l'appel API pour signaler
        },
        // Obtenir le nombre d'avis par note
        getCountByNote(note) {
            return this.avisListLocal.filter(a => Math.floor(a.note) === note).length;
        },

        // Obtenir le pourcentage par note
        getPercentageByNote(note) {
            if (this.totalAvis === 0) return 0;
            const count = this.getCountByNote(note);
            return Math.round((count / this.totalAvis) * 100);
        },

        // Classe CSS pour les barres de progression
        getProgressBarClass(note) {
            if (note >= 4) return 'bg-success';
            if (note === 3) return 'bg-warning';
            return 'bg-danger';
        },

        // Classe CSS pour les étoiles
        getStarClass(position, moyenne) {
            const diff = moyenne - position;
            if (diff >= 0) return 'fa-star text-warning';
            if (diff > -1) return 'fa-star-half-alt text-warning';
            return 'fa-star text-muted';
        },
        // Label de notation
        getRatingLabel(note) {
            const labels = {
                1: 'Très mauvais',
                2: 'Mauvais',
                3: 'Moyen',
                4: 'Bien',
                5: 'Excellent'
            };
            return labels[note] || '';
        },

        // Obtenir les initiales
        getInitials(nom) {
            if (!nom) return '?';
            return nom.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        },

        // Formater la date
        formatDate(date) {
            if (!date) return "";
            return new Date(date).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        },
        // Temps relatif
        getRelativeTime(date) {
            if (!date) return "";
            const now = new Date();
            const past = new Date(date);
            const diffMs = now - past;
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            if (diffDays === 0) return "Aujourd'hui";
            if (diffDays === 1) return "Hier";
            if (diffDays < 7) return `Il y a ${diffDays} jours`;
            if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine(s)`;
            if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
            return `Il y a ${Math.floor(diffDays / 365)} an(s)`;
        },
        // Ouvrir lightbox
        openLightbox(url) {
            // Implémentation avec GLightbox ou autre
            console.log("Ouvrir image:", url);
        }



    },
    async created() {
        await this.loadDetailsBiensImmobiliers();
        // Charger les avis utiles depuis localStorage
        const stored = localStorage.getItem('avisUtiles');
        if (stored) {
            this.avisUtiles = JSON.parse(stored);
        }
    },
};
</script>
<style scoped>
/* Étoiles de notation interactives */
.rating-input {
    display: flex;
    gap: 8px;
}

.star-rating {
    cursor: pointer;
    color: #ddd;
    transition: all 0.2s ease;
}

.star-rating:hover,
.star-rating.active {
    color: #ffc107;
    transform: scale(1.1);
}

/* Avatar par défaut */
.avatar-img {
    width: 48px;
    height: 48px;
    font-size: 18px;
}

/* Bouton actif */
.btn.active {
    background-color: #0d6efd !important;
    color: white !important;
}

/* Image thumbnail */
.img-thumbnail {
    cursor: pointer;
    transition: transform 0.2s ease;
}

.img-thumbnail:hover {
    transform: scale(1.05);
}

/* Progress bar personnalisée */
.progress-sm {
    height: 8px;
}

/* Badge personnalisé */
.icon-md {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Animation fade-in */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.d-md-flex {
    animation: fadeIn 0.3s ease-out;
}

/* Responsive */
@media (max-width: 768px) {
    .rating-input {
        justify-content: center;
    }

    .star-rating i {
        font-size: 2rem !important;
    }
}
</style>
