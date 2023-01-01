<template>
    <div class="page-content pt-0">
        <div class="page-content-wrapper vstack container  gap-4">
            <!-- En-tête -->
            <div class="row">
                <div class="col-sm-12 mb-5">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <h1 class="h3 mb-2 mb-sm-0">Relevés de Compte</h1>
                        <div class="d-flex gap-2">
                            <button @click="genererReleve" class="btn btn-primary mb-0">
                                <i class="bi bi-file-earmark-text fa-fw"></i> Générer Relevé
                            </button>
                            <button @click="exporterReleves" class="btn btn-success mb-0">
                                <i class="bi bi-download fa-fw"></i> Exporter PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Résumé financier -->
            <div class="row g-4 mb-5">
                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>Solde Total</span>
                                <h3 class="mb-0 mt-2" :class="solde >= 0 ? 'text-success' : 'text-danger'">
                                    {{ formatCurrency(solde) }}
                                </h3>
                            </div>
                            <div
                                class="icon-lg rounded-circle flex-shrink-0 bg-primary bg-opacity-10 text-primary mb-0">
                                <i class="bi bi-wallet2 fa-fw"></i>
                            </div>
                        </div>
                        <span>Solde actuel du compte</span>
                    </div>
                </div>

                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>Total Encaissements</span>
                                <h3 class="mb-0 mt-2 text-success">{{ formatCurrency(stats.totalEncaissements) }}</h3>
                            </div>
                            <div
                                class="icon-lg rounded-circle flex-shrink-0 bg-success bg-opacity-10 text-success mb-0">
                                <i class="bi bi-arrow-down-circle fa-fw"></i>
                            </div>
                        </div>
                        <span><span class="text-success">{{ stats.nombreEncaissements }} transactions</span> ce
                            mois</span>
                    </div>
                </div>

                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>Total Décaissements</span>
                                <h3 class="mb-0 mt-2 text-danger">{{ formatCurrency(stats.totalDecaissements) }}</h3>
                            </div>
                            <div class="icon-lg rounded-circle flex-shrink-0 bg-danger bg-opacity-10 text-danger mb-0">
                                <i class="bi bi-arrow-up-circle fa-fw"></i>
                            </div>
                        </div>
                        <span><span class="text-danger">{{ stats.nombreDecaissements }} transactions</span> ce
                            mois</span>
                    </div>
                </div>

                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>Commissions</span>
                                <h3 class="mb-0 mt-2 text-info">{{ formatCurrency(stats.totalCommissions) }}</h3>
                            </div>
                            <div class="icon-lg rounded-circle flex-shrink-0 bg-info bg-opacity-10 text-info mb-0">
                                <i class="bi bi-percent fa-fw"></i>
                            </div>
                        </div>
                        <span>Commissions perçues</span>
                    </div>
                </div>
            </div>

            <!-- Filtres -->
            <div class="card shadow mb-4">
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label">Période</label>
                            <select v-model="filters.periode" @change="applyFilters" class="form-select">
                                <option value="7jours">7 derniers jours</option>
                                <option value="30jours">30 derniers jours</option>
                                <option value="mois">Ce mois</option>
                                <option value="trimestre">Ce trimestre</option>
                                <option value="annee">Cette année</option>
                                <option value="personnalisee">Personnalisée</option>
                            </select>
                        </div>

                        <div class="col-md-3" v-if="filters.periode === 'personnalisee'">
                            <label class="form-label">Date début</label>
                            <input type="date" v-model="filters.dateDebut" @change="applyFilters" class="form-control">
                        </div>

                        <div class="col-md-3" v-if="filters.periode === 'personnalisee'">
                            <label class="form-label">Date fin</label>
                            <input type="date" v-model="filters.dateFin" @change="applyFilters" class="form-control">
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Type Transaction</label>
                            <select v-model="filters.typeTransaction" @change="applyFilters" class="form-select">
                                <option value="">Tous</option>
                                <option value="ENCAISSEMENT">Encaissement</option>
                                <option value="DECAISSEMENT">Décaissement</option>
                                <option value="COMMISSION">Commission</option>
                                <option value="REMBOURSEMENT">Remboursement</option>
                            </select>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Contrat</label>
                            <select v-model="filters.contratId" @change="applyFilters" class="form-select">
                                <option value="">Tous les contrats</option>
                                <option v-for="contrat in contrats" :key="contrat.id" :value="contrat.id">
                                    {{ contrat.referenceContrat }}
                                </option>
                            </select>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Rechercher</label>
                            <input type="text" v-model="searchQuery" @input="applyFilters" class="form-control"
                                placeholder="Référence, description...">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tableau des transactions -->
            <div class="card shadow">
                <div class="card-header bg-light">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Historique des Transactions</h5>
                        <div class="d-flex gap-2">
                            <button @click="toggleView('liste')" class="btn btn-sm"
                                :class="vue === 'liste' ? 'btn-primary' : 'btn-outline-primary'">
                                <i class="bi bi-list-ul"></i>
                            </button>
                            <button @click="toggleView('graphique')" class="btn btn-sm"
                                :class="vue === 'graphique' ? 'btn-primary' : 'btn-outline-primary'">
                                <i class="bi bi-graph-up"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card-body">
                    <!-- Vue Liste -->
                    <div v-if="vue === 'liste'">
                        <!-- En-têtes -->
                        <div class="bg-light rounded p-3 d-none d-lg-block">
                            <div class="row">
                                <div class="col-lg-2">
                                    <h6 class="mb-0">Date</h6>
                                </div>
                                <div class="col-lg-2">
                                    <h6 class="mb-0">Type</h6>
                                </div>
                                <div class="col-lg-2">
                                    <h6 class="mb-0">Référence</h6>
                                </div>
                                <div class="col-lg-3">
                                    <h6 class="mb-0">Description</h6>
                                </div>
                                <div class="col-lg-2">
                                    <h6 class="mb-0">Montant</h6>
                                </div>
                                <div class="col-lg-1">
                                    <h6 class="mb-0">Solde</h6>
                                </div>
                            </div>
                        </div>

                        <!-- Chargement -->
                        <div v-if="isLoading" class="text-center my-5">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Chargement...</span>
                            </div>
                        </div>

                        <!-- Aucune transaction -->
                        <div v-else-if="paginatedTransactions.length === 0" class="text-center text-muted my-5">
                            <i class="bi bi-inbox fs-1"></i>
                            <p class="mt-3">Aucune transaction trouvée.</p>
                        </div>

                        <!-- Lignes de transactions -->
                        <div v-else>
                            <div class="row border-bottom py-3 align-items-center"
                                v-for="(transaction, index) in paginatedTransactions" :key="transaction.id"
                                @click="voirDetails(transaction)" style="cursor: pointer;">
                                <div class="col-lg-2">
                                    <strong class="d-lg-none">Date:</strong>
                                    <span class="small">{{ formatDate(transaction.dateTransaction) }}</span>
                                </div>
                                <div class="col-lg-2">
                                    <strong class="d-lg-none">Type:</strong>
                                    <span class="badge" :class="getTypeBadgeClass(transaction.typeTransaction)">
                                        <i :class="getTypeIcon(transaction.typeTransaction)" class="me-1"></i>
                                        {{ transaction.typeTransaction }}
                                    </span>
                                </div>
                                <div class="col-lg-2">
                                    <strong class="d-lg-none">Référence:</strong>
                                    <span class="text-primary">{{ transaction.reference }}</span>
                                </div>
                                <div class="col-lg-3">
                                    <strong class="d-lg-none">Description:</strong>
                                    <span class="small">{{ transaction.description }}</span>
                                </div>
                                <div class="col-lg-2">
                                    <strong class="d-lg-none">Montant:</strong>
                                    <span class="fw-bold" :class="getMontantClass(transaction.typeTransaction)">
                                        {{ formatMontant(transaction) }}
                                    </span>
                                </div>
                                <div class="col-lg-1">
                                    <strong class="d-lg-none">Solde:</strong>
                                    <span class="small fw-bold">{{ formatCurrency(transaction.soldeApres) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Vue Graphique -->
                    <div v-else class="p-4">
                        <canvas id="transactionsChart" height="100"></canvas>
                    </div>
                </div>

                <!-- Pagination -->
                <div class="card-footer" v-if="vue === 'liste'">
                    <div class="d-sm-flex justify-content-sm-between align-items-sm-center">
                        <p class="mb-sm-0 text-center text-sm-start">
                            Affichage {{ startIndex + 1 }} à {{ endIndex }} sur {{ filteredTransactions.length }}
                            entrées
                        </p>
                        <nav class="mb-sm-0 d-flex justify-content-center">
                            <ul class="pagination pagination-sm pagination-primary-soft mb-0">
                                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                    <a class="page-link" @click.prevent="goToPage(currentPage - 1)">Préc</a>
                                </li>
                                <li v-for="page in visiblePages" :key="page" class="page-item"
                                    :class="{ active: currentPage === page }">
                                    <a class="page-link" @click.prevent="goToPage(page)">{{ page }}</a>
                                </li>
                                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                    <a class="page-link" @click.prevent="goToPage(currentPage + 1)">Suiv</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Détails Transaction -->
        <div class="modal fade" id="detailsModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Détails de la Transaction</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" v-if="selectedTransaction">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Date:</label>
                                <p>{{ formatDateTime(selectedTransaction.dateTransaction) }}</p>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Référence:</label>
                                <p class="text-primary">{{ selectedTransaction.reference }}</p>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Type:</label>
                                <p>
                                    <span class="badge" :class="getTypeBadgeClass(selectedTransaction.typeTransaction)">
                                        {{ selectedTransaction.typeTransaction }}
                                    </span>
                                </p>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Montant:</label>
                                <p class="h4" :class="getMontantClass(selectedTransaction.typeTransaction)">
                                    {{ formatMontant(selectedTransaction) }}
                                </p>
                            </div>
                            <div class="col-md-12">
                                <label class="form-label fw-bold">Description:</label>
                                <p>{{ selectedTransaction.description }}</p>
                            </div>
                            <div class="col-md-6" v-if="selectedTransaction.contratReference">
                                <label class="form-label fw-bold">Contrat associé:</label>
                                <p>{{ selectedTransaction.contratReference }}</p>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Solde après transaction:</label>
                                <p class="fw-bold">{{ formatCurrency(selectedTransaction.soldeApres) }}</p>
                            </div>
                            <div class="col-md-12" v-if="selectedTransaction.notes">
                                <label class="form-label fw-bold">Notes:</label>
                                <p class="text-muted">{{ selectedTransaction.notes }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                        <button type="button" class="btn btn-primary" @click="imprimerRecu">
                            <i class="bi bi-printer"></i> Imprimer
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Générer Relevé -->
        <div class="modal fade" id="genererReleveModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Générer un Relevé</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="mb-3">
                                <label class="form-label">Période du relevé</label>
                                <select v-model="releveForm.periode" class="form-select">
                                    <option value="mois">Ce mois</option>
                                    <option value="trimestre">Ce trimestre</option>
                                    <option value="annee">Cette année</option>
                                    <option value="personnalisee">Période personnalisée</option>
                                </select>
                            </div>
                            <div class="row" v-if="releveForm.periode === 'personnalisee'">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Date début</label>
                                    <input type="date" v-model="releveForm.dateDebut" class="form-control">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Date fin</label>
                                    <input type="date" v-model="releveForm.dateFin" class="form-control">
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Format</label>
                                <select v-model="releveForm.format" class="form-select">
                                    <option value="pdf">PDF</option>
                                    <option value="excel">Excel</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="confirmerReleve">
                            <i class="bi bi-file-earmark-arrow-down"></i> Générer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ElMessage } from "element-plus";

export default {
    data() {
        return {
            transactions: [],
            contrats: [],
            stats: {
                totalEncaissements: 0,
                nombreEncaissements: 0,
                totalDecaissements: 0,
                nombreDecaissements: 0,
                totalCommissions: 0
            },
            solde: 0,
            filters: {
                periode: '30jours',
                dateDebut: null,
                dateFin: null,
                typeTransaction: '',
                contratId: ''
            },
            releveForm: {
                periode: 'mois',
                dateDebut: null,
                dateFin: null,
                format: 'pdf'
            },
            searchQuery: '',
            currentPage: 1,
            perPage: 15,
            isLoading: false,
            selectedTransaction: null,
            vue: 'liste',
            chart: null
        };
    },

    computed: {
        filteredTransactions() {
            let result = [...this.transactions];

            // Filtre recherche
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(t =>
                    t.reference?.toLowerCase().includes(query) ||
                    t.description?.toLowerCase().includes(query)
                );
            }

            // Filtre type
            if (this.filters.typeTransaction) {
                result = result.filter(t => t.typeTransaction === this.filters.typeTransaction);
            }

            // Filtre contrat
            if (this.filters.contratId) {
                result = result.filter(t => t.contratId === parseInt(this.filters.contratId));
            }

            return result.sort((a, b) => new Date(b.dateTransaction) - new Date(a.dateTransaction));
        },

        paginatedTransactions() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredTransactions.slice(start, start + this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filteredTransactions.length / this.perPage);
        },

        visiblePages() {
            const pages = [];
            const maxVisible = 5;
            let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
            let end = Math.min(this.totalPages, start + maxVisible - 1);

            if (end - start < maxVisible - 1) {
                start = Math.max(1, end - maxVisible + 1);
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        },

        startIndex() {
            return (this.currentPage - 1) * this.perPage;
        },

        endIndex() {
            return Math.min(this.startIndex + this.perPage, this.filteredTransactions.length);
        }
    },

    mounted() {
        this.fetchTransactions();
        this.fetchContrats();
        this.calculateStats();
    },

    watch: {
        vue(newVue) {
            if (newVue === 'graphique') {
                this.$nextTick(() => {
                    this.initChart();
                });
            }
        }
    },

    methods: {
        async fetchTransactions() {
            this.isLoading = true;
            try {
                const contrats = await this.$store.dispatch("contrats/getAll");

                // Générer les transactions à partir des contrats
                this.transactions = [];
                let soldeAccumule = 0;

                contrats.forEach(contrat => {
                    if (contrat.loyerMensuel) {
                        // Transaction d'encaissement du loyer
                        soldeAccumule += contrat.loyerMensuel;
                        this.transactions.push({
                            id: `ENC-${contrat.id}`,
                            dateTransaction: contrat.dateDebut,
                            typeTransaction: 'ENCAISSEMENT',
                            reference: contrat.referenceContrat,
                            description: `Loyer mensuel - ${this.getBienName(contrat)}`,
                            montant: contrat.loyerMensuel,
                            soldeApres: soldeAccumule,
                            contratId: contrat.id,
                            contratReference: contrat.referenceContrat
                        });

                        // Commission système
                        if (contrat.commissionSysteme) {
                            soldeAccumule -= contrat.commissionSysteme;
                            this.transactions.push({
                                id: `COM-SYS-${contrat.id}`,
                                dateTransaction: contrat.dateDebut,
                                typeTransaction: 'COMMISSION',
                                reference: `COM-${contrat.referenceContrat}`,
                                description: `Commission système - ${contrat.referenceContrat}`,
                                montant: contrat.commissionSysteme,
                                soldeApres: soldeAccumule,
                                contratId: contrat.id,
                                contratReference: contrat.referenceContrat
                            });
                        }

                        // Commission gestionnaire
                        if (contrat.commissionGestionnaire) {
                            soldeAccumule -= contrat.commissionGestionnaire;
                            this.transactions.push({
                                id: `COM-GEST-${contrat.id}`,
                                dateTransaction: contrat.dateDebut,
                                typeTransaction: 'COMMISSION',
                                reference: `COM-GEST-${contrat.referenceContrat}`,
                                description: `Commission gestionnaire - ${contrat.referenceContrat}`,
                                montant: contrat.commissionGestionnaire,
                                soldeApres: soldeAccumule,
                                contratId: contrat.id,
                                contratReference: contrat.referenceContrat
                            });
                        }
                    }

                    // Frais d'annulation si contrat résilié
                    if (contrat.status === 'RESILIE' && contrat.fraisAnnulation) {
                        soldeAccumule += contrat.fraisAnnulation;
                        this.transactions.push({
                            id: `FRAIS-${contrat.id}`,
                            dateTransaction: contrat.dateFin,
                            typeTransaction: 'ENCAISSEMENT',
                            reference: `FRAIS-${contrat.referenceContrat}`,
                            description: `Frais d'annulation - ${contrat.referenceContrat}`,
                            montant: contrat.fraisAnnulation,
                            soldeApres: soldeAccumule,
                            contratId: contrat.id,
                            contratReference: contrat.referenceContrat
                        });
                    }
                });

                this.solde = soldeAccumule;
            } catch (error) {
                console.error("Erreur chargement transactions:", error);
                ElMessage.error("Erreur lors du chargement des transactions");
            } finally {
                this.isLoading = false;
            }
        },

        async fetchContrats() {
            try {
                this.contrats = await this.$store.dispatch("contrats/getAll");
            } catch (error) {
                console.error("Erreur chargement contrats:", error);
            }
        },

        calculateStats() {
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            const transactionsDuMois = this.transactions.filter(t =>
                new Date(t.dateTransaction) >= firstDayOfMonth
            );

            this.stats = {
                totalEncaissements: transactionsDuMois
                    .filter(t => t.typeTransaction === 'ENCAISSEMENT')
                    .reduce((sum, t) => sum + t.montant, 0),
                nombreEncaissements: transactionsDuMois
                    .filter(t => t.typeTransaction === 'ENCAISSEMENT').length,
                totalDecaissements: transactionsDuMois
                    .filter(t => t.typeTransaction === 'DECAISSEMENT')
                    .reduce((sum, t) => sum + t.montant, 0),
                nombreDecaissements: transactionsDuMois
                    .filter(t => t.typeTransaction === 'DECAISSEMENT').length,
                totalCommissions: transactionsDuMois
                    .filter(t => t.typeTransaction === 'COMMISSION')
                    .reduce((sum, t) => sum + t.montant, 0)
            };
        },

        getBienName(contrat) {
            if (contrat.biensImmobiliers?.length > 0) {
                return contrat.biensImmobiliers[0].nom;
            }
            if (contrat.detailsBiensImmobiliers?.length > 0) {
                return contrat.detailsBiensImmobiliers[0].nomdetails;
            }
            return 'Bien immobilier';
        },

        applyFilters() {
            this.currentPage = 1;
            this.calculateStats();
        },

        toggleView(vue) {
            this.vue = vue;
        },

        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },

        voirDetails(transaction) {
            this.selectedTransaction = transaction;
            const modal = new bootstrap.Modal(document.getElementById("detailsModal"));
            modal.show();
        },

        genererReleve() {
            const modal = new bootstrap.Modal(document.getElementById("genererReleveModal"));
            modal.show();
        },

        async confirmerReleve() {
            try {
                const format = this.releveForm.format === 'pdf' ? 'pdf' : 'xlsx';
                const fileUrl = await this.$store.dispatch("contrats/exportContrats", format);

                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = `releve-compte-${new Date().toISOString().split('T')[0]}.${format}`;
                link.click();
                URL.revokeObjectURL(fileUrl);

                bootstrap.Modal.getInstance(document.getElementById("genererReleveModal")).hide();
                ElMessage.success("Relevé généré avec succès");
            } catch (error) {
                ElMessage.error("Erreur lors de la génération du relevé");
            }
        },

        async exporterReleves() {
            try {
                const fileUrl = await this.$store.dispatch("contrats/exportContrats", "pdf");
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = `releves-${new Date().toISOString().split('T')[0]}.pdf`;
                link.click();
                URL.revokeObjectURL(fileUrl);
                ElMessage.success("Export réussi");
            } catch (error) {
                ElMessage.error("Erreur lors de l'export");
            }
        },

        imprimerRecu() {
            window.print();
        },

        initChart() {
            const ctx = document.getElementById('transactionsChart');
            if (!ctx) return;

            // Préparer les données pour le graphique
            const grouped = {};
            this.filteredTransactions.forEach(t => {
                const date = new Date(t.dateTransaction).toLocaleDateString('fr-FR');
                if (!grouped[date]) {
                    grouped[date] = { encaissements: 0, decaissements: 0 };
                }
                if (t.typeTransaction === 'ENCAISSEMENT') {
                    grouped[date].encaissements += t.montant;
                } else if (t.typeTransaction === 'DECAISSEMENT' || t.typeTransaction === 'COMMISSION') {
                    grouped[date].decaissements += t.montant;
                }
            });

            const labels = Object.keys(grouped).slice(-30);
            const dataEncaissements = labels.map(date => grouped[date].encaissements);
            const dataDecaissements = labels.map(date => grouped[date].decaissements);

            if (this.chart) {
                this.chart.destroy();
            }

            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [
                        {
                            label: 'Encaissements',
                            data: dataEncaissements,
                            borderColor: '#198754',
                            backgroundColor: 'rgba(25, 135, 84, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Décaissements',
                            data: dataDecaissements,
                            borderColor: '#dc3545',
                            backgroundColor: 'rgba(220, 53, 69, 0.1)',
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    return context.dataset.label + ': ' + this.formatCurrency(context.parsed.y);
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) => this.formatCurrency(value)
                            }
                        }
                    }
                }
            });
        },

        getTypeBadgeClass(type) {
            const classes = {
                'ENCAISSEMENT': 'bg-success',
                'DECAISSEMENT': 'bg-danger',
                'COMMISSION': 'bg-info',
                'REMBOURSEMENT': 'bg-warning'
            };
            return classes[type] || 'bg-secondary';
        },

        getTypeIcon(type) {
            const icons = {
                'ENCAISSEMENT': 'bi bi-arrow-down-circle',
                'DECAISSEMENT': 'bi bi-arrow-up-circle',
                'COMMISSION': 'bi bi-percent',
                'REMBOURSEMENT': 'bi bi-arrow-repeat'
            };
            return icons[type] || 'bi bi-circle';
        },

        getMontantClass(type) {
            return type === 'ENCAISSEMENT' ? 'text-success' : 'text-danger';
        },

        formatMontant(transaction) {
            const prefix = transaction.typeTransaction === 'ENCAISSEMENT' ? '+' : '-';
            return prefix + ' ' + this.formatCurrency(transaction.montant);
        },

        formatCurrency(value) {
            if (!value && value !== 0) return '0 XOF';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0,
            }).format(Math.abs(value));
        },

        formatDate(date) {
            if (!date) return 'N/A';
            return new Date(date).toLocaleDateString('fr-FR');
        },

        formatDateTime(date) {
            if (!date) return 'N/A';
            return new Date(date).toLocaleString('fr-FR');
        }
    },

    beforeDestroy() {
        if (this.chart) {
            this.chart.destroy();
        }
    }
};
</script>

<style scoped>
.card-body .row {
    align-items: center;
}

.card-body .row:hover {
    background-color: #f8f9fa;
    transition: background-color 0.2s;
}

@media (max-width: 991px) {
    .card-body .row>div {
        margin-bottom: 0.5rem;
    }
}

@media print {

    .btn,
    .pagination,
    .card-header {
        display: none !important;
    }
}
</style>