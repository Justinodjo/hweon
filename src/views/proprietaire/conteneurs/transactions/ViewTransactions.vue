<template>
    <div class="container py-4">
        <!-- Exemple 1: Utilisation des actions existantes -->
        <div class="card mb-4">
            <!-- <div class="card-header bg-primary text-white">
                <h5 class="mb-0">
                    <i class="bi bi-credit-card me-2"></i>
                    Initier un Paiement (Votre méthode existante)
                </h5>
            </div>
            <div class="card-body">
                <form @submit.prevent="initierPaiement">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">Contrat ID</label>
                            <input v-model.number="formPaiement.contratId" type="number" class="form-control" required>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Montant</label>
                            <input v-model.number="formPaiement.montant" type="number" class="form-control" required>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Email</label>
                            <input v-model="formPaiement.email" type="email" class="form-control" required>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Nom</label>
                            <input v-model="formPaiement.nom" type="text" class="form-control" required>
                        </div>

                        <div class="col-12">
                            <button type="submit" class="btn btn-primary" :disabled="loading">
                                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                                <i v-else class="bi bi-send me-2"></i>
                                Payer maintenant
                            </button>
                        </div>
                    </div>
                </form>
                <div v-if="statut" class="alert mt-3" :class="{
                    'alert-warning': statut === 'en_attente',
                    'alert-success': statut === 'reussi',
                    'alert-danger': statut === 'echec'
                }">
                    <strong>Statut:</strong> {{ statut }}
                    <br>
                    <strong>Message:</strong> {{ message }}
                </div>
            </div> -->
        </div>

        <!-- Exemple 2: Liste des paiements avec les nouvelles actions -->
        <div class="card mb-4">
            <div class="card-header bg-success text-white">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="bi bi-list-check me-2"></i>
                        Liste des Paiements
                    </h5>
                    <button @click="chargerPaiements" class="btn btn-sm btn-light">
                        <i class="bi bi-arrow-clockwise me-1"></i>
                        Actualiser
                    </button>
                </div>
            </div>
            <div class="card-body">
                <!-- Filtres rapides -->
                <div class="btn-group mb-3" role="group">
                    <button @click="chargerParStatut('PAYE')" class="btn btn-outline-success btn-sm">
                        Payés ({{ paiementsPayes.length }})
                    </button>
                    <button @click="chargerParStatut('EN_ATTENTE')" class="btn btn-outline-warning btn-sm">
                        En attente ({{ paiementsEnAttente.length }})
                    </button>
                    <button @click="chargerParStatut('EN_RETARD')" class="btn btn-outline-danger btn-sm">
                        En retard ({{ paiementsEnRetard.length }})
                    </button>
                    <button @click="chargerPaiements" class="btn btn-outline-primary btn-sm">
                        Tous
                    </button>
                </div>

                <!-- Statistiques -->
                <div class="row g-3 mb-4">
                    <div class="col-md-4">
                        <div class="card border-success">
                            <div class="card-body text-center">
                                <h6 class="text-muted">Total payé</h6>
                                <h4 class="text-success mb-0">{{ formatCurrency(totalPaye) }}</h4>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="card border-warning">
                            <div class="card-body text-center">
                                <h6 class="text-muted">En attente</h6>
                                <h4 class="text-warning mb-0">{{ formatCurrency(totalEnAttente) }}</h4>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="card border-primary">
                            <div class="card-body text-center">
                                <h6 class="text-muted">Total paiements</h6>
                                <h4 class="text-primary mb-0">{{ paiements.length }}</h4>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Loading -->
                <div v-if="loading" class="text-center py-5">
                    <div class="spinner-border text-primary"></div>
                    <p class="mt-2 text-muted">Chargement...</p>
                </div>

                <!-- Liste -->
                <div v-else-if="paiements.length > 0" class="table-responsive">
                    <table class="table table-hover">
                        <thead class="table-light">
                            <tr>
                                <th>Référence</th>
                                <th>Montant</th>
                                <th>Statut</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="paiement in paiements" :key="paiement.id">
                                <td>{{ paiement.reference || `#${paiement.id}` }}</td>
                                <td>{{ formatCurrency(paiement.montant) }}</td>
                                <td>
                                    <span class="badge" :class="getStatusClass(paiement.statut)">
                                        {{ getStatusLabel(paiement.statut) }}
                                    </span>
                                </td>
                                <td>{{ formatDate(paiement.datePaiement || paiement.dateEcheance) }}</td>
                                <td>
                                    <div class="btn-group btn-group-sm">
                                        <button @click="voirDetails(paiement.id)" class="btn btn-outline-primary"
                                            title="Voir détails">
                                            <i class="bi bi-eye"></i>
                                        </button>

                                        <button v-if="paiement.statut !== 'PAYE'" @click="marquerCommePaye(paiement.id)"
                                            class="btn btn-outline-success" title="Marquer payé">
                                            <i class="bi bi-check-circle"></i>
                                        </button>

                                        <button
                                            v-if="paiement.statut === 'EN_ATTENTE' || paiement.statut === 'EN_RETARD'"
                                            @click="envoyerRappel(paiement.id)" class="btn btn-outline-warning"
                                            title="Envoyer rappel">
                                            <i class="bi bi-bell"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Vide -->
                <div v-else class="text-center py-5 text-muted">
                    <i class="bi bi-inbox fs-1 d-block mb-3"></i>
                    <p>Aucun paiement trouvé</p>
                </div>
            </div>
        </div>

        <!-- Exemple 3: Actions groupées -->
        <div class="card">
            <div class="card-header bg-info text-white">
                <h5 class="mb-0">
                    <i class="bi bi-lightning me-2"></i>
                    Actions Groupées
                </h5>
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-6">
                        <button @click="exporterExcel" class="btn btn-success w-100">
                            <i class="bi bi-file-excel me-2"></i>
                            Exporter en Excel
                        </button>
                    </div>

                    <div class="col-md-6">
                        <button @click="verifierRetards" class="btn btn-warning w-100">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            Vérifier les retards
                        </button>
                    </div>

                    <div class="col-md-6">
                        <button @click="chargerStatistiques" class="btn btn-primary w-100">
                            <i class="bi bi-graph-up me-2"></i>
                            Charger statistiques
                        </button>
                    </div>

                    <div class="col-md-6">
                        <button @click="reinitialiser" class="btn btn-secondary w-100">
                            <i class="bi bi-arrow-counterclockwise me-2"></i>
                            Réinitialiser
                        </button>
                    </div>
                </div>

                <!-- Affichage des statistiques -->
                <div v-if="statistiques" class="mt-4 p-3 bg-light rounded">
                    <h6 class="mb-3">Statistiques du système:</h6>
                    <div class="row g-2">
                        <div class="col-md-3">
                            <small class="text-muted">Total paiements</small>
                            <p class="mb-0 fw-bold">{{ statistiques.totalPaiements }}</p>
                        </div>
                        <div class="col-md-3">
                            <small class="text-muted">Montant total</small>
                            <p class="mb-0 fw-bold">{{ formatCurrency(statistiques.totalMontant) }}</p>
                        </div>
                        <div class="col-md-3">
                            <small class="text-muted">Payés</small>
                            <p class="mb-0 fw-bold text-success">{{ statistiques.payes }}</p>
                        </div>
                        <div class="col-md-3">
                            <small class="text-muted">En attente</small>
                            <p class="mb-0 fw-bold text-warning">{{ statistiques.enAttente }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal détails (optionnel) -->
        <PaiementDetailModal v-if="showModal" :show="showModal" :paiementId="selectedPaiementId"
            @close="showModal = false" />
    </div>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";
import { mapState, mapGetters, mapActions } from 'vuex';
import PaiementDetailModal from '@/components/modal/PaiementDetailModal.vue';

export default {
    name: 'ExempleUtilisationPaiements',

    components: {
        PaiementDetailModal
    },

    data() {
        return {
            formPaiement: {
                contratId: null,
                montant: null,
                email: '',
                nom: ''
            },
            showModal: false,
            selectedPaiementId: null,
        };
    },

    computed: {
        // 🔥 Mapping des états du store
        ...mapState('paiements', [
            'urlPaiement',
            'statut',
            'message',
            'paiements',
            'paiement',
            'statistiques',
            'loading',
            'error'
        ]),

        // 🔥 Mapping des getters
        ...mapGetters('paiements', [
            'paiementsPayes',
            'paiementsEnAttente',
            'paiementsEnRetard',
            'totalPaye',
            'totalEnAttente'
        ]),
    },

    async mounted() {
        await this.chargerPaiements();
    },

    methods: {
        // 🔥 Mapping des actions
        ...mapActions('paiements', [
            'getAll',
            'getOne',
            'initierPaiement',
            'traiterCallback',
            'getStatistiques',
            'getByStatut',
            'marquerPaye',
            'envoyerRappel',
            'exportToExcel',
            'verifierPaiementsEnRetard',
            'resetState'
        ]),

        // ============================================
        // MÉTHODES D'ACTION
        // ============================================

        async initierPaiement() {
            try {
                await this.$store.dispatch('paiements/initierPaiement', this.formPaiement);

                // Le store redirige automatiquement vers FedaPay
                // Pas besoin de code supplémentaire ici

            } catch (error) {
                ElMessage.error('Erreur lors de l\'initiation du paiement');
            }
        },

        async chargerPaiements() {
            try {
                await this.getAll();
                ElMessage.success('Paiements chargés avec succès');
            } catch (error) {
                ElMessage.error('Erreur lors du chargement des paiements');
            }
        },

        async chargerParStatut(statut) {
            try {
                await this.getByStatut(statut);
                ElMessage.info(`Paiements filtrés: ${statut}`);
            } catch (error) {
                ElMessage.error('Erreur lors du filtrage');
            }
        },

        async voirDetails(id) {
            this.selectedPaiementId = id;
            this.showModal = true;
        },

        async marquerCommePaye(id) {
            try {
                await ElMessageBox.confirm(
                    'Voulez-vous marquer ce paiement comme payé ?',
                    'Confirmation',
                    {
                        confirmButtonText: 'Oui',
                        cancelButtonText: 'Annuler',
                        type: 'warning',
                    }
                );

                await this.marquerPaye({
                    id,
                    modePaiement: 'ESPECES',
                    datePaiement: new Date().toISOString().split('T')[0],
                    montantPaye: null,
                    numeroTransaction: null
                });

                ElMessage.success('Paiement marqué comme payé');
                await this.chargerPaiements();

            } catch (error) {
                if (error !== 'cancel') {
                    ElMessage.error('Erreur lors de la mise à jour');
                }
            }
        },

        async envoyerRappel(id) {
            try {
                await this.$store.dispatch('paiements/envoyerRappel', id);
                ElMessage.success('Rappel envoyé avec succès');
            } catch (error) {
                ElMessage.error('Erreur lors de l\'envoi du rappel');
            }
        },

        async exporterExcel() {
            try {
                await this.exportToExcel();
                ElMessage.success('Export Excel réussi');
            } catch (error) {
                ElMessage.error('Erreur lors de l\'export');
            }
        },

        async verifierRetards() {
            try {
                await this.verifierPaiementsEnRetard();
                ElMessage.success('Vérification des retards effectuée');
                await this.chargerPaiements();
            } catch (error) {
                ElMessage.error('Erreur lors de la vérification');
            }
        },

        async chargerStatistiques() {
            try {
                await this.getStatistiques();
                ElMessage.success('Statistiques chargées');
            } catch (error) {
                ElMessage.error('Erreur lors du chargement des statistiques');
            }
        },

        reinitialiser() {
            this.resetState();
            this.formPaiement = {
                contratId: null,
                montant: null,
                email: '',
                nom: ''
            };
            ElMessage.info('États réinitialisés');
        },

        // ============================================
        // UTILITAIRES
        // ============================================

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

        formatDate(date) {
            if (!date) return '—';
            return new Date(date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },

        getStatusClass(statut) {
            const classes = {
                'PAYE': 'bg-success',
                'EN_ATTENTE': 'bg-warning',
                'EN_RETARD': 'bg-danger',
                'ANNULE': 'bg-secondary',
            };
            return classes[statut] || 'bg-secondary';
        },

        getStatusLabel(statut) {
            const labels = {
                'PAYE': 'Payé',
                'EN_ATTENTE': 'En attente',
                'EN_RETARD': 'En retard',
                'ANNULE': 'Annulé',
            };
            return labels[statut] || statut;
        },
    },
};
</script>

<style scoped>
.card {
    transition: all 0.3s ease;
}

.card:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-group-sm .btn {
    padding: 0.25rem 0.5rem;
}

.table-hover tbody tr:hover {
    background-color: rgba(0, 123, 255, 0.05);
}
</style>