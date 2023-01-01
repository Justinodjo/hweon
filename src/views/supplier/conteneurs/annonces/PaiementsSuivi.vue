<template>
    <main>
        <section class="pt-0">
            <div class="container vstack gap-4">
                <!-- Modal Détails Paiement (Suite et Fin) -->
                <div v-if="selectedPaiement" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);"
                    tabindex="-1">
                    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">
                                    Paiement #{{ selectedPaiement.reference }}
                                    <span class="badge ms-2" :class="getStatutBadgeClass(selectedPaiement.statut)">
                                        {{ getStatutLabel(selectedPaiement.statut) }}
                                    </span>
                                </h5>
                                <button type="button" class="btn-close" @click="selectedPaiement = null"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row g-4">
                                    <!-- Informations Propriété -->
                                    <div class="col-md-6">
                                        <div class="card bg-light border-0 h-100">
                                            <div class="card-body">
                                                <h6 class="mb-3">
                                                    <i class="bi bi-building me-2"></i>Propriété
                                                </h6>
                                                <div class="mb-2">
                                                    <label class="text-muted small">Nom</label>
                                                    <p class="mb-0 fw-bold">{{ selectedPaiement.bienNom }}</p>
                                                </div>
                                                <div v-if="selectedPaiement.bienAdresse" class="mb-2">
                                                    <label class="text-muted small">Adresse</label>
                                                    <p class="mb-0">
                                                        <i class="bi bi-geo-alt me-1"></i>{{
                                                            selectedPaiement.bienAdresse }}
                                                    </p>
                                                </div>
                                                <div v-if="selectedPaiement.bienType" class="mb-2">
                                                    <label class="text-muted small">Type</label>
                                                    <p class="mb-0">{{ selectedPaiement.bienType }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Informations Paiement -->
                                    <div class="col-12">
                                        <div class="card bg-light border-0">
                                            <div class="card-body">
                                                <h6 class="mb-3">
                                                    <i class="bi bi-cash-stack me-2"></i>Détails du Paiement
                                                </h6>
                                                <div class="row g-3">
                                                    <div class="col-md-4">
                                                        <label class="text-muted small">Montant dû</label>
                                                        <p class="mb-0 fw-bold fs-5 text-success">
                                                            {{ formatCurrency(selectedPaiement.montant) }}
                                                        </p>
                                                    </div>
                                                    <div class="col-md-4" v-if="selectedPaiement.montantPaye">
                                                        <label class="text-muted small">Montant payé</label>
                                                        <p class="mb-0 fw-bold fs-5"
                                                            :class="selectedPaiement.montantPaye >= selectedPaiement.montant ? 'text-success' : 'text-warning'">
                                                            {{ formatCurrency(selectedPaiement.montantPaye) }}
                                                        </p>
                                                    </div>
                                                    <div class="col-md-4"
                                                        v-if="selectedPaiement.montantPaye && selectedPaiement.montantPaye < selectedPaiement.montant">
                                                        <label class="text-muted small">Reste à payer</label>
                                                        <p class="mb-0 fw-bold fs-5 text-danger">
                                                            {{ formatCurrency(selectedPaiement.montant -
                                                                selectedPaiement.montantPaye) }}
                                                        </p>
                                                    </div>
                                                </div>
                                                <hr class="my-3">
                                                <div class="row g-3">
                                                    <div class="col-md-6">
                                                        <label class="text-muted small">Date d'échéance</label>
                                                        <p class="mb-0"
                                                            :class="getEcheanceClass(selectedPaiement.dateEcheance)">
                                                            <i class="bi bi-calendar-event me-1"></i>
                                                            {{ formatDate(selectedPaiement.dateEcheance) }}
                                                        </p>
                                                    </div>
                                                    <div class="col-md-6" v-if="selectedPaiement.datePaiement">
                                                        <label class="text-muted small">Date de paiement</label>
                                                        <p class="mb-0">
                                                            <i class="bi bi-calendar-check me-1"></i>
                                                            {{ formatDate(selectedPaiement.datePaiement) }}
                                                        </p>
                                                    </div>
                                                    <div class="col-md-6" v-if="selectedPaiement.modePaiement">
                                                        <label class="text-muted small">Mode de paiement</label>
                                                        <p class="mb-0">
                                                            <i class="bi"
                                                                :class="getModeIcon(selectedPaiement.modePaiement) + ' me-1'"></i>
                                                            {{ selectedPaiement.modePaiement }}
                                                        </p>
                                                    </div>
                                                    <div class="col-md-6" v-if="selectedPaiement.numeroTransaction">
                                                        <label class="text-muted small">N° Transaction</label>
                                                        <p class="mb-0">
                                                            <i class="bi bi-hash me-1"></i>
                                                            {{ selectedPaiement.numeroTransaction }}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Notes et Remarques -->
                                    <div class="col-12" v-if="selectedPaiement.notes">
                                        <div class="card bg-light border-0">
                                            <div class="card-body">
                                                <h6 class="mb-3">
                                                    <i class="bi bi-file-text me-2"></i>Notes
                                                </h6>
                                                <p class="mb-0">{{ selectedPaiement.notes }}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Historique des transactions -->
                                    <div class="col-12"
                                        v-if="selectedPaiement.historique && selectedPaiement.historique.length > 0">
                                        <div class="card bg-light border-0">
                                            <div class="card-body">
                                                <h6 class="mb-3">
                                                    <i class="bi bi-clock-history me-2"></i>Historique
                                                </h6>
                                                <div class="timeline">
                                                    <div v-for="(event, index) in selectedPaiement.historique"
                                                        :key="index" class="timeline-item mb-3">
                                                        <div class="d-flex">
                                                            <div class="timeline-marker bg-primary rounded-circle me-3"
                                                                style="width: 12px; height: 12px; margin-top: 6px;">
                                                            </div>
                                                            <div class="flex-grow-1">
                                                                <p class="mb-1">
                                                                    <strong>{{ event.action }}</strong>
                                                                </p>
                                                                <small class="text-muted">
                                                                    <i class="bi bi-calendar me-1"></i>{{
                                                                        formatDate(event.date) }}
                                                                    <span v-if="event.utilisateur" class="ms-2">
                                                                        <i class="bi bi-person me-1"></i>{{
                                                                            event.utilisateur }}
                                                                    </span>
                                                                </small>
                                                                <p v-if="event.details" class="mb-0 mt-1 small">{{
                                                                    event.details }}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" @click="selectedPaiement = null">
                                    Fermer
                                </button>
                                <button v-if="selectedPaiement.statut === 'PAYE'" type="button" class="btn btn-info"
                                    @click="downloadRecu(selectedPaiement.id)">
                                    <i class="bi bi-download me-1"></i>Télécharger Reçu
                                </button>
                                <button v-if="selectedPaiement.statut !== 'PAYE'" type="button" class="btn btn-warning"
                                    @click="envoyerRappel(selectedPaiement.id)">
                                    <i class="bi bi-bell me-1"></i>Envoyer Rappel
                                </button>
                                <button v-if="selectedPaiement.statut !== 'PAYE'" type="button" class="btn btn-success"
                                    @click="marquerPaye(selectedPaiement.id)">
                                    <i class="bi bi-check-circle me-1"></i>Marquer Payé
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal Création/Modification Paiement -->
                <div v-if="showCreateModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);"
                    tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">
                                    {{ editMode ? 'Modifier le Paiement' : 'Enregistrer un Paiement' }}
                                </h5>
                                <button type="button" class="btn-close" @click="closeCreateModal"></button>
                            </div>
                            <div class="modal-body">
                                <form @submit.prevent="savePaiement">
                                    <div class="row g-3">
                                        <!-- Locataire -->
                                        <div class="col-md-6">
                                            <label class="form-label">Locataire *</label>
                                            <select v-model="paiementForm.locataireId" class="form-select" required>
                                                <option value="">Sélectionner un locataire</option>
                                                <option v-for="loc in availableLocataires" :key="loc.id"
                                                    :value="loc.id">
                                                    {{ loc.nom }}
                                                </option>
                                            </select>
                                        </div>

                                        <!-- Propriété -->
                                        <div class="col-md-6">
                                            <label class="form-label">Propriété *</label>
                                            <select v-model="paiementForm.bienId" class="form-select" required>
                                                <option value="">Sélectionner une propriété</option>
                                                <option v-for="bien in availableBiens" :key="bien.id" :value="bien.id">
                                                    {{ bien.nom }}
                                                </option>
                                            </select>
                                        </div>

                                        <!-- Montant -->
                                        <div class="col-md-6">
                                            <label class="form-label">Montant (XOF) *</label>
                                            <input type="number" v-model.number="paiementForm.montant"
                                                class="form-control" placeholder="150000" required>
                                        </div>

                                        <!-- Date échéance -->
                                        <div class="col-md-6">
                                            <label class="form-label">Date d'échéance *</label>
                                            <input type="date" v-model="paiementForm.dateEcheance" class="form-control"
                                                required>
                                        </div>

                                        <!-- Statut -->
                                        <div class="col-md-6">
                                            <label class="form-label">Statut *</label>
                                            <select v-model="paiementForm.statut" class="form-select" required>
                                                <option value="EN_ATTENTE">En attente</option>
                                                <option value="PAYE">Payé</option>
                                                <option value="PARTIEL">Partiel</option>
                                                <option value="EN_RETARD">En retard</option>
                                                <option value="ANNULE">Annulé</option>
                                            </select>
                                        </div>

                                        <!-- Mode de paiement (si payé) -->
                                        <div class="col-md-6"
                                            v-if="paiementForm.statut === 'PAYE' || paiementForm.statut === 'PARTIEL'">
                                            <label class="form-label">Mode de paiement *</label>
                                            <select v-model="paiementForm.modePaiement" class="form-select" required>
                                                <option value="">Sélectionner</option>
                                                <option value="VIREMENT">Virement</option>
                                                <option value="ESPECES">Espèces</option>
                                                <option value="CHEQUE">Chèque</option>
                                                <option value="MOBILE_MONEY">Mobile Money</option>
                                                <option value="CARTE">Carte bancaire</option>
                                            </select>
                                        </div>

                                        <!-- Date de paiement (si payé) -->
                                        <div class="col-md-6"
                                            v-if="paiementForm.statut === 'PAYE' || paiementForm.statut === 'PARTIEL'">
                                            <label class="form-label">Date de paiement *</label>
                                            <input type="date" v-model="paiementForm.datePaiement" class="form-control"
                                                required>
                                        </div>

                                        <!-- Montant payé (si partiel) -->
                                        <div class="col-md-6" v-if="paiementForm.statut === 'PARTIEL'">
                                            <label class="form-label">Montant payé (XOF) *</label>
                                            <input type="number" v-model.number="paiementForm.montantPaye"
                                                class="form-control" :max="paiementForm.montant" required>
                                        </div>

                                        <!-- Numéro de transaction -->
                                        <div class="col-md-6"
                                            v-if="paiementForm.statut === 'PAYE' || paiementForm.statut === 'PARTIEL'">
                                            <label class="form-label">N° de transaction</label>
                                            <input type="text" v-model="paiementForm.numeroTransaction"
                                                class="form-control" placeholder="TRX123456">
                                        </div>

                                        <!-- Notes -->
                                        <div class="col-12">
                                            <label class="form-label">Notes / Remarques</label>
                                            <textarea v-model="paiementForm.notes" class="form-control" rows="3"
                                                placeholder="Informations complémentaires..."></textarea>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" @click="closeCreateModal">
                                    Annuler
                                </button>
                                <button type="button" class="btn btn-primary" @click="savePaiement">
                                    <i class="bi bi-check-circle me-1"></i>Enregistrer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal Marquer Payé -->
                <div v-if="showPaymentModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);"
                    tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Enregistrer le Paiement</h5>
                                <button type="button" class="btn-close" @click="showPaymentModal = false"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row g-3">
                                    <div class="col-12">
                                        <label class="form-label">Mode de paiement *</label>
                                        <select v-model="paymentForm.modePaiement" class="form-select" required>
                                            <option value="">Sélectionner</option>
                                            <option value="VIREMENT">Virement</option>
                                            <option value="ESPECES">Espèces</option>
                                            <option value="CHEQUE">Chèque</option>
                                            <option value="MOBILE_MONEY">Mobile Money</option>
                                            <option value="CARTE">Carte bancaire</option>
                                        </select>
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label">Date de paiement *</label>
                                        <input type="date" v-model="paymentForm.datePaiement" class="form-control"
                                            :max="new Date().toISOString().split('T')[0]" required>
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label">Montant payé (XOF) *</label>
                                        <input type="number" v-model.number="paymentForm.montantPaye"
                                            class="form-control" required>
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label">N° de transaction</label>
                                        <input type="text" v-model="paymentForm.numeroTransaction" class="form-control"
                                            placeholder="TRX123456">
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label">Notes</label>
                                        <textarea v-model="paymentForm.notes" class="form-control" rows="2"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" @click="showPaymentModal = false">
                                    Annuler
                                </button>
                                <button type="button" class="btn btn-success" @click="confirmMarquerPaye">
                                    <i class="bi bi-check-circle me-1"></i>Confirmer le Paiement
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import Chart from 'chart.js/auto';

export default {
    name: 'SuiviPaiements',
    setup() {
        const store = useStore();

        // Refs
        const loading = ref(false);
        const viewMode = ref('table');
        const searchQuery = ref('');
        const sortAsc = ref(false);
        const currentPage = ref(1);
        const perPage = ref(15);
        const selectedPaiement = ref(null);
        const showCreateModal = ref(false);
        const showPaymentModal = ref(false);
        const editMode = ref(false);
        const selectedPaiements = ref([]);
        const paymentsChart = ref(null);
        const methodsChart = ref(null);

        // Filters
        const filters = ref({
            statut: '',
            propriete: '',
            mois: '',
            mode: ''
        });

        // Forms
        const paiementForm = ref({
            id: null,
            locataireId: '',
            bienId: '',
            montant: 0,
            dateEcheance: '',
            statut: 'EN_ATTENTE',
            modePaiement: '',
            datePaiement: '',
            montantPaye: 0,
            numeroTransaction: '',
            notes: ''
        });

        const paymentForm = ref({
            paiementId: null,
            modePaiement: '',
            datePaiement: new Date().toISOString().split('T')[0],
            montantPaye: 0,
            numeroTransaction: '',
            notes: ''
        });

        // Mock Data
        const paiements = ref([]);
        const availableBiens = ref([]);
        const availableLocataires = ref([]);
        const paymentMethods = ref([
            { name: 'Virement', percentage: 45, color: '#0d6efd' },
            { name: 'Espèces', percentage: 30, color: '#198754' },
            { name: 'Mobile Money', percentage: 20, color: '#ffc107' },
            { name: 'Chèque', percentage: 5, color: '#6c757d' }
        ]);

        // Computed
        const stats = computed(() => {
            const payes = paiements.value.filter(p => p.statut === 'PAYE');
            const enAttente = paiements.value.filter(p => p.statut === 'EN_ATTENTE');
            const enRetard = paiements.value.filter(p => p.statut === 'EN_RETARD');

            const totalEncaisse = payes.reduce((sum, p) => sum + (p.montantPaye || p.montant), 0);
            const totalEnAttente = enAttente.reduce((sum, p) => sum + p.montant, 0);
            const totalEnRetard = enRetard.reduce((sum, p) => sum + p.montant, 0);

            const tauxRecouvrement = paiements.value.length > 0
                ? Math.round((payes.length / paiements.value.length) * 100)
                : 0;

            return {
                totalEncaisse,
                enAttente: totalEnAttente,
                nombreEnAttente: enAttente.length,
                enRetard: totalEnRetard,
                nombreEnRetard: enRetard.length,
                tauxRecouvrement
            };
        });

        const filteredPaiements = computed(() => {
            let result = [...paiements.value];

            // Search
            if (searchQuery.value) {
                const query = searchQuery.value.toLowerCase();
                result = result.filter(p =>
                    p.reference.toLowerCase().includes(query) ||
                    p.locataireNom.toLowerCase().includes(query) ||
                    p.bienNom.toLowerCase().includes(query)
                );
            }

            // Filters
            if (filters.value.statut) {
                result = result.filter(p => p.statut === filters.value.statut);
            }
            if (filters.value.propriete) {
                result = result.filter(p => p.bienId === filters.value.propriete);
            }
            if (filters.value.mois) {
                result = result.filter(p => {
                    const pMonth = p.dateEcheance.substring(0, 7);
                    return pMonth === filters.value.mois;
                });
            }
            if (filters.value.mode) {
                result = result.filter(p => p.modePaiement === filters.value.mode);
            }

            // Sort
            result.sort((a, b) => {
                const dateA = new Date(a.dateEcheance);
                const dateB = new Date(b.dateEcheance);
                return sortAsc.value ? dateA - dateB : dateB - dateA;
            });

            return result;
        });

        const paginatedPaiements = computed(() => {
            const start = (currentPage.value - 1) * perPage.value;
            const end = start + perPage.value;
            return filteredPaiements.value.slice(start, end);
        });

        const totalPages = computed(() => {
            return Math.ceil(filteredPaiements.value.length / perPage.value);
        });

        const allSelected = computed(() => {
            return paginatedPaiements.value.length > 0 &&
                paginatedPaiements.value.every(p => selectedPaiements.value.includes(p.id));
        });

        // Methods
        const formatCurrency = (amount) => {
            if (amount == null) return '0 XOF';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0
            }).format(amount);
        };

        const formatDate = (dateStr) => {
            if (!dateStr) return '—';
            return new Date(dateStr).toLocaleDateString('fr-FR');
        };

        const formatDateShort = (dateStr) => {
            if (!dateStr) return '—';
            return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
        };

        const getStatutBadgeClass = (statut) => {
            const classes = {
                'PAYE': 'bg-success',
                'EN_ATTENTE': 'bg-warning',
                'EN_RETARD': 'bg-danger',
                'PARTIEL': 'bg-info',
                'ANNULE': 'bg-secondary'
            };
            return classes[statut] || 'bg-secondary';
        };

        const getStatutLabel = (statut) => {
            const labels = {
                'PAYE': 'Payé',
                'EN_ATTENTE': 'En attente',
                'EN_RETARD': 'En retard',
                'PARTIEL': 'Partiel',
                'ANNULE': 'Annulé'
            };
            return labels[statut] || statut;
        };

        const getStatutIcon = (statut) => {
            const icons = {
                'PAYE': 'bi-check-circle-fill',
                'EN_ATTENTE': 'bi-clock-fill',
                'EN_RETARD': 'bi-exclamation-triangle-fill',
                'PARTIEL': 'bi-hourglass-split',
                'ANNULE': 'bi-x-circle-fill'
            };
            return icons[statut] || 'bi-question-circle-fill';
        };

        const getModeIcon = (mode) => {
            const icons = {
                'VIREMENT': 'bi-bank',
                'ESPECES': 'bi-cash',
                'CHEQUE': 'bi-receipt',
                'MOBILE_MONEY': 'bi-phone',
                'CARTE': 'bi-credit-card'
            };
            return icons[mode] || 'bi-cash';
        };

        const getEcheanceClass = (dateEcheance) => {
            if (!dateEcheance) return '';
            const today = new Date();
            const echeance = new Date(dateEcheance);
            const diff = Math.floor((echeance - today) / (1000 * 60 * 60 * 24));

            if (diff < 0) return 'text-danger fw-bold';
            if (diff <= 7) return 'text-warning fw-bold';
            return 'text-muted';
        };

        const isEnRetard = (dateEcheance) => {
            if (!dateEcheance) return false;
            const today = new Date();
            const echeance = new Date(dateEcheance);
            return echeance < today;
        };

        const getJoursRetard = (dateEcheance) => {
            if (!dateEcheance) return 0;
            const today = new Date();
            const echeance = new Date(dateEcheance);
            return Math.floor((today - echeance) / (1000 * 60 * 60 * 24));
        };

        const isSelected = (id) => {
            return selectedPaiements.value.includes(id);
        };

        const toggleSelection = (id) => {
            const index = selectedPaiements.value.indexOf(id);
            if (index > -1) {
                selectedPaiements.value.splice(index, 1);
            } else {
                selectedPaiements.value.push(id);
            }
        };

        const toggleSelectAll = () => {
            if (allSelected.value) {
                selectedPaiements.value = [];
            } else {
                selectedPaiements.value = paginatedPaiements.value.map(p => p.id);
            }
        };

        const toggleSort = () => {
            sortAsc.value = !sortAsc.value;
        };

        const filterPaiements = () => {
            currentPage.value = 1;
        };

        const resetFilters = () => {
            searchQuery.value = '';
            filters.value = {
                statut: '',
                propriete: '',
                mois: '',
                mode: ''
            };
            currentPage.value = 1;
        };

        const viewPaiement = (paiement) => {
            selectedPaiement.value = paiement;
        };

        const editPaiement = (paiement) => {
            editMode.value = true;
            paiementForm.value = { ...paiement };
            showCreateModal.value = true;
        };

        const closeCreateModal = () => {
            showCreateModal.value = false;
            editMode.value = false;
            paiementForm.value = {
                id: null,
                locataireId: '',
                bienId: '',
                montant: 0,
                dateEcheance: '',
                statut: 'EN_ATTENTE',
                modePaiement: '',
                datePaiement: '',
                montantPaye: 0,
                numeroTransaction: '',
                notes: ''
            };
        };

        const savePaiement = async () => {
            try {
                if (editMode.value) {
                    await store.dispatch('paiements/update', paiementForm.value);
                    ElMessage.success('Paiement modifié avec succès!');
                } else {
                    await store.dispatch('paiements/create', paiementForm.value);
                    ElMessage.success('Paiement enregistré avec succès!');
                }
                closeCreateModal();
                await loadPaiements();
            } catch (error) {
                console.error('Erreur lors de la sauvegarde:', error);
                ElMessage.error('Erreur lors de la sauvegarde du paiement');
            }
        };

        const marquerPaye = async (id) => {
            const paiement = paiements.value.find(p => p.id === id);
            if (!paiement) return;

            paymentForm.value = {
                paiementId: id,
                modePaiement: '',
                datePaiement: new Date().toISOString().split('T')[0],
                montantPaye: paiement.montant,
                numeroTransaction: '',
                notes: ''
            };
            showPaymentModal.value = true;
        };

        const confirmMarquerPaye = async () => {
            try {
                await store.dispatch('paiements/marquerPaye', paymentForm.value);
                ElMessage.success('Paiement enregistré avec succès!');
                showPaymentModal.value = false;
                if (selectedPaiement.value) {
                    selectedPaiement.value = null;
                }
                await loadPaiements();
            } catch (error) {
                console.error('Erreur lors du marquage:', error);
                ElMessage.error('Erreur lors de l\'enregistrement du paiement');
            }
        };

        const marquerPayes = async () => {
            try {
                await ElMessageBox.confirm(
                    `Voulez-vous marquer ${selectedPaiements.value.length} paiement(s) comme payé(s) ?`,
                    'Confirmation',
                    {
                        confirmButtonText: 'Oui',
                        cancelButtonText: 'Annuler',
                        type: 'warning'
                    }
                );

                await store.dispatch('paiements/marquerPayesMultiple', {
                    ids: selectedPaiements.value,
                    datePaiement: new Date().toISOString().split('T')[0],
                    modePaiement: 'VIREMENT'
                });

                ElMessage.success('Paiements marqués comme payés!');
                selectedPaiements.value = [];
                await loadPaiements();
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur:', error);
                    ElMessage.error('Erreur lors du marquage des paiements');
                }
            }
        };

        const envoyerRappel = async (id) => {
            try {
                await store.dispatch('paiements/envoyerRappel', id);
                ElMessage.success('Rappel envoyé avec succès!');
            } catch (error) {
                console.error('Erreur:', error);
                ElMessage.error('Erreur lors de l\'envoi du rappel');
            }
        };

        const envoyerRappels = async () => {
            try {
                const enRetard = paiements.value.filter(p =>
                    p.statut === 'EN_RETARD' || p.statut === 'EN_ATTENTE'
                );

                if (enRetard.length === 0) {
                    ElMessage.info('Aucun paiement en attente ou en retard');
                    return;
                }

                await ElMessageBox.confirm(
                    `Envoyer ${enRetard.length} rappel(s) aux locataires ?`,
                    'Confirmation',
                    {
                        confirmButtonText: 'Envoyer',
                        cancelButtonText: 'Annuler',
                        type: 'warning'
                    }
                );

                await store.dispatch('paiements/envoyerRappelsMultiple', {
                    ids: enRetard.map(p => p.id)
                });

                ElMessage.success(`${enRetard.length} rappel(s) envoyé(s)!`);
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur:', error);
                    ElMessage.error('Erreur lors de l\'envoi des rappels');
                }
            }
        };

        const envoyerRappelsSelection = async () => {
            try {
                await ElMessageBox.confirm(
                    `Envoyer ${selectedPaiements.value.length} rappel(s) ?`,
                    'Confirmation',
                    {
                        confirmButtonText: 'Envoyer',
                        cancelButtonText: 'Annuler',
                        type: 'warning'
                    }
                );

                await store.dispatch('paiement/envoyerRappelsMultiple', {
                    ids: selectedPaiements.value
                });

                ElMessage.success('Rappels envoyés avec succès!');
                selectedPaiements.value = [];
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur:', error);
                    ElMessage.error('Erreur lors de l\'envoi des rappels');
                }
            }
        };

        const downloadRecu = async (id) => {
            try {
                await store.dispatch('paiement/downloadRecu', id);
                ElMessage.success('Téléchargement du reçu en cours...');
            } catch (error) {
                console.error('Erreur:', error);
                ElMessage.error('Erreur lors du téléchargement du reçu');
            }
        };

        const genererFactures = async () => {
            try {
                const mois = filters.value.mois || new Date().toISOString().substring(0, 7);
                await store.dispatch('paiement/genererFactures', { mois });
                ElMessage.success('Factures générées avec succès!');
            } catch (error) {
                console.error('Erreur:', error);
                ElMessage.error('Erreur lors de la génération des factures');
            }
        };

        const exportPaiements = async () => {
            try {
                await store.dispatch('paiement/export', {
                    filters: filters.value,
                    search: searchQuery.value
                });
                ElMessage.success('Export en cours...');
            } catch (error) {
                console.error('Erreur:', error);
                ElMessage.error('Erreur lors de l\'export');
            }
        };

        const loadPaiements = async () => {
            loading.value = true;
            try {
                const response = await store.dispatch('paiement/getAllPaiements');
                paiements.value = response || [];
            } catch (error) {
                console.error('Erreur:', error);
                ElMessage.error('Erreur lors du chargement des paiements');
            } finally {
                loading.value = false;
            }
        };

        const loadBiens = async () => {
            try {
                const response = await store.dispatch('biensImmobiliers/getAll');
                availableBiens.value = response || [];
            } catch (error) {
                console.error('Erreur:', error);
            }
        };

        const loadLocataires = async () => {
            try {
                const response = await store.dispatch('user/getAll');
                availableLocataires.value = response || [];
            } catch (error) {
                console.error('Erreur:', error);
            }
        };

        const initCharts = () => {
            // Graphique d'évolution des paiements
            if (paymentsChart.value) {
                const ctx = paymentsChart.value.getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
                        datasets: [
                            {
                                label: 'Encaissements',
                                data: [850000, 920000, 880000, 950000, 1000000, 980000, 1050000, 1100000, 1080000, 1150000, 1200000, 1250000],
                                borderColor: '#198754',
                                backgroundColor: 'rgba(25, 135, 84, 0.1)',
                                tension: 0.4,
                                fill: true
                            },
                            {
                                label: 'Attendu',
                                data: [1000000, 1000000, 1000000, 1000000, 1200000, 1200000, 1200000, 1200000, 1200000, 1300000, 1300000, 1300000],
                                borderColor: '#0d6efd',
                                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                                borderDash: [5, 5],
                                tension: 0.4
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top'
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function (value) {
                                        return (value / 1000) + 'K XOF';
                                    }
                                }
                            }
                        }
                    }
                });
            }

            // Graphique des modes de paiement
            if (methodsChart.value) {
                const ctx = methodsChart.value.getContext('2d');
                new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: paymentMethods.value.map(m => m.name),
                        datasets: [{
                            data: paymentMethods.value.map(m => m.percentage),
                            backgroundColor: paymentMethods.value.map(m => m.color),
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        return context.label + ': ' + context.parsed + '%';
                                    }
                                }
                            }
                        }
                    }
                });
            }
        };

        // Lifecycle
        onMounted(async () => {
            await Promise.all([
                loadPaiements(),
                loadBiens(),
                loadLocataires()
            ]);

            // Initialiser les graphiques après le montage
            setTimeout(() => {
                initCharts();
            }, 100);
        });

        return {
            loading,
            viewMode,
            searchQuery,
            sortAsc,
            currentPage,
            perPage,
            selectedPaiement,
            showCreateModal,
            showPaymentModal,
            editMode,
            selectedPaiements,
            filters,
            paiementForm,
            paymentForm,
            paiements,
            availableBiens,
            availableLocataires,
            paymentMethods,
            stats,
            filteredPaiements,
            paginatedPaiements,
            totalPages,
            allSelected,
            paymentsChart,
            methodsChart,
            formatCurrency,
            formatDate,
            formatDateShort,
            getStatutBadgeClass,
            getStatutLabel,
            getStatutIcon,
            getModeIcon,
            getEcheanceClass,
            isEnRetard,
            getJoursRetard,
            isSelected,
            toggleSelection,
            toggleSelectAll,
            toggleSort,
            filterPaiements,
            resetFilters,
            viewPaiement,
            editPaiement,
            closeCreateModal,
            savePaiement,
            marquerPaye,
            confirmMarquerPaye,
            marquerPayes,
            envoyerRappel,
            envoyerRappels,
            envoyerRappelsSelection,
            downloadRecu,
            genererFactures,
            exportPaiements
        };
    }
};
</script>

<style scoped>
.paiement-card {
    transition: all 0.3s ease;
}

.paiement-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.timeline-item {
    position: relative;
}

.timeline-item:not(:last-child):before {
    content: '';
    position: absolute;
    left: 5px;
    top: 20px;
    height: calc(100% - 10px);
    width: 2px;
    background-color: #dee2e6;
}

.table-hover tbody tr:hover {
    background-color: rgba(13, 110, 253, 0.05);
}

.badge {
    font-weight: 500;
    padding: 0.35em 0.65em;
}

.form-check-input:checked {
    background-color: #0d6efd;
    border-color: #0d6efd;
}

.dropdown-menu {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.modal.show {
    display: block;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.spinner-border {
    width: 3rem;
    height: 3rem;
}

.alert {
    border-left: 4px solid;
}

.alert-info {
    border-left-color: #0dcaf0;
}

.alert-danger {
    border-left-color: #dc3545;
}

canvas {
    max-height: 300px;
}

.pagination .page-link {
    color: #0d6efd;
    border-color: #dee2e6;
}

.pagination .page-item.active .page-link {
    background-color: #0d6efd;
    border-color: #0d6efd;
}

.pagination .page-item.disabled .page-link {
    color: #6c757d;
    pointer-events: none;
}

.btn-group .btn {
    border-color: #0d6efd;
}

.card-header-title {
    font-weight: 600;
    color: #212529;
}

small.text-muted {
    font-size: 0.875rem;
}

.input-group-text {
    background-color: #fff;
    border-right: 0;
}

.input-group .form-control {
    border-left: 0;
}

.input-group .form-control:focus {
    box-shadow: none;
    border-color: #dee2e6;
}

.bg-opacity-10 {
    opacity: 0.1;
}

.fs-4 {
    font-size: 1.5rem;
}

.timeline-marker {
    flex-shrink: 0;
}
</style>