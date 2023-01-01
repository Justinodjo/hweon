<template>
    <!-- Modal Détail Paiement -->
    <div v-if="show" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" @click.self="closeModal">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <!-- Header -->
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">
                        <i class="bi bi-receipt me-2"></i>
                        Détails du Paiement
                    </h5>
                    <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
                </div>

                <!-- Body -->
                <div class="modal-body" v-if="paiement">
                    <!-- Informations principales -->
                    <div class="card border mb-4">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">Informations générales</h6>
                        </div>
                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="text-muted small">Référence</label>
                                    <p class="fw-bold mb-0">{{ paiement.reference || `#${paiement.id}` }}</p>
                                </div>

                                <div class="col-md-6">
                                    <label class="text-muted small">Statut</label>
                                    <p class="mb-0">
                                        <span class="badge" :class="getStatusBadgeClass(paiement.statut)">
                                            {{ getStatusLabel(paiement.statut) }}
                                        </span>
                                    </p>
                                </div>

                                <div class="col-md-6">
                                    <label class="text-muted small">Date d'échéance</label>
                                    <p class="mb-0">{{ formatDate(paiement.dateEcheance) }}</p>
                                </div>

                                <div class="col-md-6">
                                    <label class="text-muted small">Date de paiement</label>
                                    <p class="mb-0">{{ formatDate(paiement.datePaiement) }}</p>
                                </div>

                                <div class="col-md-6">
                                    <label class="text-muted small">Mode de paiement</label>
                                    <p class="mb-0">{{ paiement.typePaiement || '—' }}</p>
                                </div>

                                <div class="col-md-6">
                                    <label class="text-muted small">Période</label>
                                    <p class="mb-0">{{ paiement.mois }}/{{ paiement.annee }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Montants -->
                    <div class="card border mb-4">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">Montants</h6>
                        </div>
                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <div class="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                                        <span class="text-muted">Montant dû</span>
                                        <span class="fw-bold fs-5">{{ formatCurrency(paiement.montant) }}</span>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div
                                        class="d-flex justify-content-between align-items-center p-3 bg-success bg-opacity-10 rounded">
                                        <span class="text-success">Montant payé</span>
                                        <span class="fw-bold fs-5 text-success">
                                            {{ formatCurrency(paiement.montantPaye || paiement.montant) }}
                                        </span>
                                    </div>
                                </div>

                                <div class="col-md-12" v-if="paiement.montantRestant > 0">
                                    <div
                                        class="d-flex justify-content-between align-items-center p-3 bg-warning bg-opacity-10 rounded">
                                        <span class="text-warning">Montant restant</span>
                                        <span class="fw-bold fs-5 text-warning">
                                            {{ formatCurrency(paiement.montantRestant) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Distribution des paiements -->
                    <div class="card border mb-4" v-if="paiement.distributions && paiement.distributions.length > 0">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">
                                <i class="bi bi-pie-chart me-2"></i>
                                Distribution des revenus
                            </h6>
                        </div>
                        <div class="card-body">
                            <div v-for="(distribution, index) in paiement.distributions" :key="index">
                                <!-- Montant brut -->
                                <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                                    <span class="text-muted">Montant brut</span>
                                    <span class="fw-bold">{{ formatCurrency(distribution.montantBrut) }}</span>
                                </div>

                                <!-- Commission système -->
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="text-muted">
                                        <i class="bi bi-dash-circle text-danger me-1"></i>
                                        Commission système ({{ getCommissionRate(distribution, 'systeme') }}%)
                                    </span>
                                    <span class="text-danger">
                                        -{{ formatCurrency(distribution.commissionSysteme) }}
                                    </span>
                                </div>

                                <!-- Commission gestionnaire -->
                                <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                                    <span class="text-muted">
                                        <i class="bi bi-dash-circle text-danger me-1"></i>
                                        Commission gestionnaire ({{ getCommissionRate(distribution, 'gestionnaire') }}%)
                                    </span>
                                    <span class="text-danger">
                                        -{{ formatCurrency(distribution.commissionGestionnaire) }}
                                    </span>
                                </div>

                                <!-- Montant net propriétaire -->
                                <div
                                    class="d-flex justify-content-between align-items-center mb-3 p-3 bg-success bg-opacity-10 rounded">
                                    <div>
                                        <div class="fw-bold text-success">Net propriétaire</div>
                                        <small class="text-muted" v-if="distribution.beneficiaireProprietaire">
                                            {{ distribution.beneficiaireProprietaire.nomComplet }}
                                        </small>
                                    </div>
                                    <span class="fw-bold fs-5 text-success">
                                        {{ formatCurrency(distribution.montantNetProprietaire) }}
                                    </span>
                                </div>

                                <!-- Montant net gestionnaire -->
                                <div class="d-flex justify-content-between align-items-center p-3 bg-info bg-opacity-10 rounded"
                                    v-if="distribution.montantNetGestionnaire > 0">
                                    <div>
                                        <div class="fw-bold text-info">Net gestionnaire</div>
                                        <small class="text-muted" v-if="distribution.beneficiaireGestionnaire">
                                            {{ distribution.beneficiaireGestionnaire.nomComplet }}
                                        </small>
                                    </div>
                                    <span class="fw-bold fs-5 text-info">
                                        {{ formatCurrency(distribution.montantNetGestionnaire) }}
                                    </span>
                                </div>

                                <!-- Graphique de distribution -->
                                <div class="mt-4">
                                    <div class="progress" style="height: 30px;">
                                        <div class="progress-bar bg-success"
                                            :style="{ width: getPercentage(distribution.montantNetProprietaire, distribution.montantBrut) + '%' }"
                                            :title="`Propriétaire: ${getPercentage(distribution.montantNetProprietaire, distribution.montantBrut)}%`">
                                            {{ getPercentage(distribution.montantNetProprietaire,
                                                distribution.montantBrut) }}%
                                        </div>
                                        <div class="progress-bar bg-danger"
                                            :style="{ width: getPercentage(distribution.commissionSysteme, distribution.montantBrut) + '%' }"
                                            :title="`Système: ${getPercentage(distribution.commissionSysteme, distribution.montantBrut)}%`">
                                            {{ getPercentage(distribution.commissionSysteme, distribution.montantBrut)
                                            }}%
                                        </div>
                                        <div class="progress-bar bg-warning"
                                            :style="{ width: getPercentage(distribution.commissionGestionnaire, distribution.montantBrut) + '%' }"
                                            :title="`Gestionnaire: ${getPercentage(distribution.commissionGestionnaire, distribution.montantBrut)}%`">
                                            {{ getPercentage(distribution.commissionGestionnaire,
                                                distribution.montantBrut) }}%
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between mt-2 small text-muted">
                                        <span><span class="badge bg-success">■</span> Propriétaire</span>
                                        <span><span class="badge bg-danger">■</span> Commission système</span>
                                        <span><span class="badge bg-warning">■</span> Commission gestionnaire</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Informations du contrat -->
                    <div class="card border mb-4" v-if="paiement.contrats">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">Contrat associé</h6>
                        </div>
                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="text-muted small">Référence contrat</label>
                                    <p class="mb-0">{{ paiement.contrats.referenceContrat }}</p>
                                </div>

                                <div class="col-md-6">
                                    <label class="text-muted small">Type de contrat</label>
                                    <p class="mb-0">{{ paiement.contrats.typeContrat }}</p>
                                </div>

                                <div class="col-md-6" v-if="paiement.contrats.userInfo">
                                    <label class="text-muted small">Locataire</label>
                                    <p class="mb-0">{{ paiement.contrats.userInfo.nomComplet }}</p>
                                </div>

                                <div class="col-md-6">
                                    <label class="text-muted small">Loyer mensuel</label>
                                    <p class="mb-0">{{ formatCurrency(paiement.contrats.loyerMensuel) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Bien immobilier -->
                    <div class="card border"
                        v-if="paiement.contrats && paiement.contrats.biensImmobiliers && paiement.contrats.biensImmobiliers.length > 0">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">Bien immobilier</h6>
                        </div>
                        <div class="card-body">
                            <div v-for="bien in paiement.contrats.biensImmobiliers" :key="bien.id" class="mb-2">
                                <p class="mb-1 fw-bold">{{ bien.nom }}</p>
                                <p class="mb-0 text-muted small">
                                    <i class="bi bi-geo-alt me-1"></i>{{ bien.adresse }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="closeModal">
                        Fermer
                    </button>
                    <button class="btn btn-primary" @click="downloadReceipt"
                        v-if="paiement && paiement.statut === 'PAYE'">
                        <i class="bi bi-download me-2"></i>
                        Télécharger le reçu
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ElMessage } from "element-plus";

export default {
    name: 'PaiementDetailModal',

    props: {
        show: {
            type: Boolean,
            default: false
        },
        paiementId: {
            type: Number,
            default: null
        }
    },

    data() {
        return {
            paiement: null,
            loading: false,
        };
    },

    watch: {
        show(newVal) {
            if (newVal && this.paiementId) {
                this.loadPaiement();
            }
        },

        paiementId(newVal) {
            if (this.show && newVal) {
                this.loadPaiement();
            }
        }
    },

    mounted() {
        if (this.show && this.paiementId) {
            this.loadPaiement();
        }
    },

    methods: {
        async loadPaiement() {
            this.loading = true;
            try {
                const response = await this.$store.dispatch('paiements/getById', this.paiementId);
                this.paiement = response;
            } catch (error) {
                console.error('Erreur chargement paiement:', error);
                ElMessage.error('Erreur lors du chargement du paiement');
                this.closeModal();
            } finally {
                this.loading = false;
            }
        },

        closeModal() {
            this.$emit('close');
        },

        async downloadReceipt() {
            try {
                ElMessage.info('Génération du reçu en cours...');
                // Implémenter le téléchargement du reçu
                console.log('Téléchargement reçu pour:', this.paiement);
            } catch (error) {
                console.error('Erreur téléchargement:', error);
                ElMessage.error('Erreur lors du téléchargement');
            }
        },

        getCommissionRate(distribution, type) {
            if (!distribution.montantBrut) return 0;

            const commission = type === 'systeme'
                ? distribution.commissionSysteme
                : distribution.commissionGestionnaire;

            return ((commission / distribution.montantBrut) * 100).toFixed(1);
        },

        getPercentage(amount, total) {
            if (!total || total === 0) return 0;
            return Math.round((amount / total) * 100);
        },

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
                month: 'long',
                day: 'numeric'
            });
        },

        getStatusBadgeClass(statut) {
            const classes = {
                'PAYE': 'bg-success bg-opacity-10 text-success',
                'EN_ATTENTE': 'bg-warning bg-opacity-10 text-warning',
                'EN_RETARD': 'bg-danger bg-opacity-10 text-danger',
                'ANNULE': 'bg-secondary bg-opacity-10 text-secondary',
            };
            return classes[statut] || 'bg-secondary bg-opacity-10 text-secondary';
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
.modal {
    display: block;
}

.progress {
    border-radius: 0.5rem;
    overflow: hidden;
}

.progress-bar {
    font-size: 0.875rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card {
    transition: all 0.3s ease;
}

.bg-opacity-10 {
    opacity: 0.1;
}

.bg-success.bg-opacity-10 {
    background-color: rgba(25, 135, 84, 0.1) !important;
}

.bg-danger.bg-opacity-10 {
    background-color: rgba(220, 53, 69, 0.1) !important;
}

.bg-info.bg-opacity-10 {
    background-color: rgba(13, 202, 240, 0.1) !important;
}

.bg-warning.bg-opacity-10 {
    background-color: rgba(255, 193, 7, 0.1) !important;
}
</style>