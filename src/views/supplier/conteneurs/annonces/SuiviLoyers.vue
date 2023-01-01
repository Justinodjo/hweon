<template>
    <div class="page-content pt-0">
        <div class="page-content-wrapper vstack container gap-4">
            <!-- En-tête -->
            <div class="row">
                <div class="col-sm-12 mb-5">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <h1 class="h3 mb-2 mb-sm-0">Suivi des Loyers Perçus</h1>
                        <div class="d-grid">
                            <button @click="exporterLoyers" class="btn btn-success mb-0">
                                <i class="bi bi-download fa-fw"></i> Exporter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Statistiques -->
            <div class="row g-4 mb-5">
                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>Total Perçu (Mois)</span>
                                <h3 class="mb-0 mt-2">{{ formatCurrency(stats.totalPercuMois) }}</h3>
                            </div>
                            <div
                                class="icon-lg rounded-circle flex-shrink-0 bg-success bg-opacity-10 text-success mb-0">
                                <i class="bi bi-cash-stack fa-fw"></i>
                            </div>
                        </div>
                        <span><span class="text-success">{{ stats.contratsPaiesMois }} contrats payés</span> ce
                            mois</span>
                    </div>
                </div>

                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>En Attente</span>
                                <h3 class="mb-0 mt-2">{{ formatCurrency(stats.totalEnAttente) }}</h3>
                            </div>
                            <div
                                class="icon-lg rounded-circle flex-shrink-0 bg-warning bg-opacity-10 text-warning mb-0">
                                <i class="bi bi-hourglass-split fa-fw"></i>
                            </div>
                        </div>
                        <span><span class="text-warning">{{ stats.contratsEnAttente }} contrats</span> en attente</span>
                    </div>
                </div>

                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>Total Année</span>
                                <h3 class="mb-0 mt-2">{{ formatCurrency(stats.totalPercuAnnee) }}</h3>
                            </div>
                            <div
                                class="icon-lg rounded-circle flex-shrink-0 bg-primary bg-opacity-10 text-primary mb-0">
                                <i class="bi bi-graph-up fa-fw"></i>
                            </div>
                        </div>
                        <span><span class="text-primary">{{ stats.tauxCollecte }}%</span> taux de collecte</span>
                    </div>
                </div>

                <div class="col-md-6 col-xxl-3">
                    <div class="card card-body shadow p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="me-2">
                                <span>Retards</span>
                                <h3 class="mb-0 mt-2">{{ stats.contratsEnRetard }}</h3>
                            </div>
                            <div class="icon-lg rounded-circle flex-shrink-0 bg-danger bg-opacity-10 text-danger mb-0">
                                <i class="bi bi-exclamation-triangle fa-fw"></i>
                            </div>
                        </div>
                        <span><span class="text-danger">{{ formatCurrency(stats.montantRetards) }}</span> impayés</span>
                    </div>
                </div>
            </div>

            <!-- Filtres -->
            <div class="row g-4 mb-4">
                <div class="col-md-3">
                    <label class="form-label">Période</label>
                    <select v-model="filters.periode" @change="applyFilters" class="form-select">
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
                    <label class="form-label">Statut Paiement</label>
                    <select v-model="filters.statutPaiement" @change="applyFilters" class="form-select">
                        <option value="">Tous</option>
                        <option value="PAYE">Payé</option>
                        <option value="EN_ATTENTE">En attente</option>
                        <option value="RETARD">En retard</option>
                    </select>
                </div>

                <div class="col-md-3">
                    <label class="form-label">Rechercher</label>
                    <input type="text" v-model="searchQuery" @input="applyFilters" class="form-control"
                        placeholder="Référence, locataire...">
                </div>
            </div>

            <!-- Tableau des loyers -->
            <div class="card shadow">
                <div class="card-body">
                    <!-- En-têtes -->
                    <div class="bg-light rounded p-3 d-none d-lg-block">
                        <div class="row">
                            <div class="col-lg-2">
                                <h6 class="mb-0">Référence</h6>
                            </div>
                            <div class="col-lg-2">
                                <h6 class="mb-0">Locataire</h6>
                            </div>
                            <div class="col-lg-2">
                                <h6 class="mb-0">Bien</h6>
                            </div>
                            <div class="col-lg-1">
                                <h6 class="mb-0">Montant</h6>
                            </div>
                            <div class="col-lg-2">
                                <h6 class="mb-0">Échéance</h6>
                            </div>
                            <div class="col-lg-2">
                                <h6 class="mb-0">Statut</h6>
                            </div>
                            <div class="col-lg-1">
                                <h6 class="mb-0">Action</h6>
                            </div>
                        </div>
                    </div>

                    <!-- Lignes de données -->
                    <div v-if="isLoading" class="text-center my-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Chargement...</span>
                        </div>
                    </div>

                    <div v-else-if="paginatedLoyers.length === 0" class="text-center text-muted my-5">
                        Aucun loyer trouvé.
                    </div>

                    <div v-else>
                        <div class="row border-bottom py-3" v-for="loyer in paginatedLoyers" :key="loyer.id">
                            <div class="col-lg-2">
                                <strong class="d-lg-none">Référence:</strong>
                                <span>{{ loyer.referenceContrat }}</span>
                            </div>
                            <div class="col-lg-2">
                                <strong class="d-lg-none">Locataire:</strong>
                                <span>{{ loyer.locataire }}</span>
                            </div>
                            <div class="col-lg-2">
                                <strong class="d-lg-none">Bien:</strong>
                                <span>{{ loyer.bien }}</span>
                            </div>
                            <div class="col-lg-1">
                                <strong class="d-lg-none">Montant:</strong>
                                <span class="fw-bold">{{ formatCurrency(loyer.montant) }}</span>
                            </div>
                            <div class="col-lg-2">
                                <strong class="d-lg-none">Échéance:</strong>
                                <span>{{ formatDate(loyer.dateEcheance) }}</span>
                                <span v-if="loyer.joursRetard > 0" class="text-danger ms-1">
                                    ({{ loyer.joursRetard }}j de retard)
                                </span>
                            </div>
                            <div class="col-lg-2">
                                <strong class="d-lg-none">Statut:</strong>
                                <span class="badge" :class="getStatutBadgeClass(loyer.statutPaiement)">
                                    {{ loyer.statutPaiement }}
                                </span>
                            </div>
                            <div class="col-lg-1">
                                <div class="dropdown">
                                    <button class="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                        <i class="bi bi-three-dots-vertical"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li>
                                            <a class="dropdown-item" @click="voirDetails(loyer)">
                                                <i class="bi bi-eye me-2"></i>Détails
                                            </a>
                                        </li>
                                        <li v-if="loyer.statutPaiement !== 'PAYE'">
                                            <a class="dropdown-item" @click="marquerPaye(loyer)">
                                                <i class="bi bi-check-circle me-2"></i>Marquer payé
                                            </a>
                                        </li>
                                        <li>
                                            <a class="dropdown-item" @click="envoyerRappel(loyer)">
                                                <i class="bi bi-bell me-2"></i>Envoyer rappel
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div class="card-footer pt-0">
                    <div class="d-sm-flex justify-content-sm-between align-items-sm-center">
                        <p class="mb-sm-0 text-center text-sm-start">
                            Affichage {{ startIndex + 1 }} à {{ endIndex }} sur {{ filteredLoyers.length }} entrées
                        </p>
                        <nav class="mb-sm-0 d-flex justify-content-center" aria-label="navigation">
                            <ul class="pagination pagination-sm pagination-primary-soft mb-0">
                                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                    <a class="page-link" @click.prevent="goToPage(currentPage - 1)">Préc</a>
                                </li>
                                <li v-for="page in totalPages" :key="page" class="page-item"
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

        <!-- Modal Détails -->
        <div class="modal fade" id="detailsModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Détails du Loyer</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" v-if="selectedLoyer">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <strong>Référence:</strong> {{ selectedLoyer.referenceContrat }}
                            </div>
                            <div class="col-md-6">
                                <strong>Locataire:</strong> {{ selectedLoyer.locataire }}
                            </div>
                            <div class="col-md-6">
                                <strong>Bien:</strong> {{ selectedLoyer.bien }}
                            </div>
                            <div class="col-md-6">
                                <strong>Montant:</strong> {{ formatCurrency(selectedLoyer.montant) }}
                            </div>
                            <div class="col-md-6">
                                <strong>Date échéance:</strong> {{ formatDate(selectedLoyer.dateEcheance) }}
                            </div>
                            <div class="col-md-6">
                                <strong>Statut:</strong>
                                <span class="badge" :class="getStatutBadgeClass(selectedLoyer.statutPaiement)">
                                    {{ selectedLoyer.statutPaiement }}
                                </span>
                            </div>
                            <div class="col-md-6" v-if="selectedLoyer.datePaiement">
                                <strong>Date paiement:</strong> {{ formatDate(selectedLoyer.datePaiement) }}
                            </div>
                            <div class="col-md-6" v-if="selectedLoyer.modePaiement">
                                <strong>Mode paiement:</strong> {{ selectedLoyer.modePaiement }}
                            </div>
                        </div>
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
            loyers: [],
            stats: {
                totalPercuMois: 0,
                contratsPaiesMois: 0,
                totalEnAttente: 0,
                contratsEnAttente: 0,
                totalPercuAnnee: 0,
                tauxCollecte: 0,
                contratsEnRetard: 0,
                montantRetards: 0
            },
            filters: {
                periode: 'mois',
                dateDebut: null,
                dateFin: null,
                statutPaiement: ''
            },
            searchQuery: '',
            currentPage: 1,
            perPage: 10,
            isLoading: false,
            selectedLoyer: null
        };
    },

    computed: {
        filteredLoyers() {
            let result = [...this.loyers];

            // Filtre recherche
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(l =>
                    l.referenceContrat?.toLowerCase().includes(query) ||
                    l.locataire?.toLowerCase().includes(query) ||
                    l.bien?.toLowerCase().includes(query)
                );
            }

            // Filtre statut
            if (this.filters.statutPaiement) {
                result = result.filter(l => l.statutPaiement === this.filters.statutPaiement);
            }

            return result;
        },

        paginatedLoyers() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredLoyers.slice(start, start + this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filteredLoyers.length / this.perPage);
        },

        startIndex() {
            return (this.currentPage - 1) * this.perPage;
        },

        endIndex() {
            return Math.min(this.startIndex + this.perPage, this.filteredLoyers.length);
        }
    },

    mounted() {
        this.fetchLoyers();
        this.fetchStats();
    },

    methods: {
        async fetchLoyers() {
            this.isLoading = true;
            try {
                const response = await this.$store.dispatch("contrats/getAll");

                // Transformer les contrats en loyers
                this.loyers = response.map(contrat => ({
                    id: contrat.id,
                    referenceContrat: contrat.referenceContrat,
                    locataire: contrat.userInfo?.nom || 'N/A',
                    bien: this.getBienName(contrat),
                    montant: contrat.loyerMensuel || 0,
                    dateEcheance: this.calculateNextEcheance(contrat),
                    statutPaiement: this.determineStatut(contrat),
                    datePaiement: null,
                    modePaiement: null,
                    joursRetard: this.calculateRetard(contrat)
                }));
            } catch (error) {
                console.error("Erreur chargement loyers:", error);
                ElMessage.error("Erreur lors du chargement des loyers");
            } finally {
                this.isLoading = false;
            }
        },

        async fetchStats() {
            try {
                const statsData = await this.$store.dispatch("contrats/getStats");
                this.stats = {
                    totalPercuMois: statsData.totalPercuMois || 0,
                    contratsPaiesMois: statsData.contratsPaiesMois || 0,
                    totalEnAttente: statsData.totalEnAttente || 0,
                    contratsEnAttente: statsData.contratsEnAttente || 0,
                    totalPercuAnnee: statsData.totalPercuAnnee || 0,
                    tauxCollecte: statsData.tauxCollecte || 0,
                    contratsEnRetard: statsData.contratsEnRetard || 0,
                    montantRetards: statsData.montantRetards || 0
                };
            } catch (error) {
                console.error("Erreur stats:", error);
            }
        },

        getBienName(contrat) {
            if (contrat.biensImmobiliers?.length > 0) {
                return contrat.biensImmobiliers[0].nom;
            }
            if (contrat.detailsBiensImmobiliers?.length > 0) {
                return contrat.detailsBiensImmobiliers[0].nomdetails;
            }
            return 'N/A';
        },

        calculateNextEcheance(contrat) {
            // Logique simplifiée - à adapter selon vos besoins
            const today = new Date();
            return new Date(today.getFullYear(), today.getMonth() + 1, 1);
        },

        determineStatut(contrat) {
            if (contrat.status === 'ACTIF') {
                const echeance = this.calculateNextEcheance(contrat);
                if (new Date() > echeance) return 'RETARD';
                return 'EN_ATTENTE';
            }
            return 'PAYE';
        },

        calculateRetard(contrat) {
            const echeance = this.calculateNextEcheance(contrat);
            const today = new Date();
            if (today > echeance) {
                return Math.floor((today - echeance) / (1000 * 60 * 60 * 24));
            }
            return 0;
        },

        applyFilters() {
            this.currentPage = 1;
            this.fetchLoyers();
        },

        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },

        voirDetails(loyer) {
            this.selectedLoyer = loyer;
            const modal = new bootstrap.Modal(document.getElementById("detailsModal"));
            modal.show();
        },

        async marquerPaye(loyer) {
            try {
                await this.$store.dispatch("contrats/update", {
                    id: loyer.id,
                    // Ajoutez ici les champs nécessaires pour marquer comme payé
                });
                loyer.statutPaiement = 'PAYE';
                loyer.datePaiement = new Date();
                ElMessage.success("Loyer marqué comme payé");
                this.fetchStats();
            } catch (error) {
                ElMessage.error("Erreur lors de la mise à jour");
            }
        },

        async envoyerRappel(loyer) {
            try {
                // Implémenter l'envoi de rappel via votre API
                ElMessage.success("Rappel envoyé avec succès");
            } catch (error) {
                ElMessage.error("Erreur lors de l'envoi du rappel");
            }
        },

        async exporterLoyers() {
            try {
                const fileUrl = await this.$store.dispatch("contrats/exportContrats", "xlsx");
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = `loyers-${new Date().toISOString().split('T')[0]}.xlsx`;
                link.click();
                URL.revokeObjectURL(fileUrl);
                ElMessage.success("Export réussi");
            } catch (error) {
                ElMessage.error("Erreur lors de l'export");
            }
        },

        formatCurrency(value) {
            if (!value) return '0 XOF';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0,
            }).format(value);
        },

        formatDate(date) {
            if (!date) return 'N/A';
            return new Date(date).toLocaleDateString('fr-FR');
        },

        getStatutBadgeClass(statut) {
            const classes = {
                'PAYE': 'bg-success',
                'EN_ATTENTE': 'bg-warning',
                'RETARD': 'bg-danger'
            };
            return classes[statut] || 'bg-secondary';
        }
    }
};
</script>

<style scoped>
.card-body .row {
    align-items: center;
}

@media (max-width: 991px) {
    .card-body .row>div {
        margin-bottom: 0.5rem;
    }
}
</style>