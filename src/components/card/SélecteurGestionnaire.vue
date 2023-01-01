<template>
    <div class="gestionnaire-selector">
        <div class="mb-3">
            <label class="form-label fw-bold">
                <i class="bi bi-person-badge me-2"></i>
                Sélectionner un gestionnaire
            </label>

            <!-- Filtre par zone -->
            <div class="input-group mb-3">
                <span class="input-group-text">
                    <i class="bi bi-geo-alt"></i>
                </span>
                <input type="text" class="form-control" v-model="filtreZone" @input="filtrerGestionnaires"
                    placeholder="Filtrer par zone...">
            </div>
        </div>

        <!-- Liste des gestionnaires -->
        <div v-if="loading" class="text-center py-4">
            <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="gestionnairesFiltres.length === 0" class="alert alert-info">
            <i class="bi bi-info-circle me-2"></i>
            Aucun gestionnaire disponible
        </div>

        <div v-else class="gestionnaires-list">
            <div v-for="gestionnaire in gestionnairesFiltres" :key="gestionnaire.id" class="gestionnaire-card"
                :class="{ 'selected': selectedId === gestionnaire.id }" @click="selectionner(gestionnaire)">

                <!-- Avatar -->
                <div class="gestionnaire-avatar">
                    <img v-if="gestionnaire.fichierId" :src="getImageUrl(gestionnaire.fichierId)"
                        :alt="gestionnaire.nom">
                    <div v-else class="avatar-placeholder">
                        {{ getInitiales(gestionnaire.nom, gestionnaire.prenom) }}
                    </div>
                </div>

                <!-- Infos -->
                <div class="gestionnaire-info flex-grow-1">
                    <h6 class="mb-1">
                        {{ gestionnaire.nom }} {{ gestionnaire.prenom }}
                        <i v-if="gestionnaire.score > 80" class="bi bi-patch-check-fill text-primary ms-2"></i>
                    </h6>

                    <div class="small text-muted mb-2">
                        <i class="bi bi-geo-alt me-1"></i>
                        {{ gestionnaire.adresse || 'Non spécifié' }}
                    </div>

                    <!-- Stats -->
                    <div class="d-flex gap-3 mb-2">
                        <span class="badge bg-primary">
                            <i class="bi bi-file-text me-1"></i>
                            {{ gestionnaire.nbContratsGeres }} contrats
                        </span>
                        <span class="badge bg-success">
                            <i class="bi bi-star-fill me-1"></i>
                            Score: {{ gestionnaire.score }}
                        </span>
                        <span class="badge" :class="gestionnaire.disponible ? 'bg-success' : 'bg-warning'">
                            {{ gestionnaire.disponible ? 'Disponible' : 'Occupé' }}
                        </span>
                    </div>

                    <div class="small">
                        <strong>Revenu généré:</strong> {{ formatCurrency(gestionnaire.revenuGenere) }}
                    </div>
                </div>

                <!-- Bouton sélection -->
                <div class="gestionnaire-actions">
                    <button class="btn btn-sm"
                        :class="selectedId === gestionnaire.id ? 'btn-primary' : 'btn-outline-primary'">
                        <i class="bi"
                            :class="selectedId === gestionnaire.id ? 'bi-check-circle-fill' : 'bi-circle'"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Bouton validation -->
        <div v-if="selectedGestionnaire" class="mt-3 text-end">
            <button @click="valider" class="btn btn-primary">
                <i class="bi bi-check2 me-2"></i>
                Confirmer la sélection
            </button>
        </div>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import { API_URLS } from '@/config/api';

export default {
    props: {
        bienId: {
            type: Number,
            default: null
        },
        modelValue: {
            type: Number,
            default: null
        }
    },

    data() {
        return {
            gestionnaires: [],
            gestionnairesFiltres: [],
            selectedId: this.modelValue,
            selectedGestionnaire: null,
            filtreZone: '',
            loading: false,
        };
    },

    mounted() {
        this.chargerGestionnaires();
    },

    methods: {
        async chargerGestionnaires() {
            this.loading = true;
            try {
                let url = '/api/gestionnaires';

                // Si un bienId est fourni, charger les gestionnaires recommandés
                if (this.bienId) {
                    url = `/api/gestionnaires/recommandes/${this.bienId}`;
                }

                const response = await this.$store.dispatch('gestionnaires/getAll', { url });
                this.gestionnaires = response || [];
                this.gestionnairesFiltres = [...this.gestionnaires];

            } catch (error) {
                console.error('Erreur chargement gestionnaires:', error);
                ElMessage.error('Erreur lors du chargement des gestionnaires');
            } finally {
                this.loading = false;
            }
        },

        filtrerGestionnaires() {
            if (!this.filtreZone) {
                this.gestionnairesFiltres = [...this.gestionnaires];
                return;
            }

            const query = this.filtreZone.toLowerCase();
            this.gestionnairesFiltres = this.gestionnaires.filter(g =>
                (g.adresse || '').toLowerCase().includes(query)
            );
        },

        selectionner(gestionnaire) {
            this.selectedId = gestionnaire.id;
            this.selectedGestionnaire = gestionnaire;
            this.$emit('update:modelValue', gestionnaire.id);
        },

        valider() {
            if (!this.selectedGestionnaire) {
                ElMessage.warning('Veuillez sélectionner un gestionnaire');
                return;
            }

            this.$emit('gestionnaire-selected', this.selectedGestionnaire);
            ElMessage.success(`Gestionnaire ${this.selectedGestionnaire.nom} sélectionné`);
        },

        getInitiales(nom, prenom) {
            return `${nom?.charAt(0) || ''}${prenom?.charAt(0) || ''}`.toUpperCase();
        },

        getImageUrl(fichierId) {
            return `${API_URLS.API_BASE}/fichier/download/${fichierId}`;
        },

        formatCurrency(value) {
            if (!value) return '0 XOF';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0
            }).format(value);
        }
    }
};
</script>

<style scoped>
.gestionnaires-list {
    max-height: 500px;
    overflow-y: auto;
}

.gestionnaire-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    border: 2px solid #e9ecef;
    border-radius: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.gestionnaire-card:hover {
    border-color: #0d6efd;
    box-shadow: 0 4px 12px rgba(13, 110, 253, 0.15);
    transform: translateY(-2px);
}

.gestionnaire-card.selected {
    border-color: #0d6efd;
    background-color: #f0f7ff;
}

.gestionnaire-avatar {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
}

.gestionnaire-avatar img,
.avatar-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.avatar-placeholder {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
}
</style>