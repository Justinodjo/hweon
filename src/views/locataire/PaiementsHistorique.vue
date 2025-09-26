<template>
    <div class="container mt-4">
        <h4 class="mb-4">Historique des paiements</h4>

        <!-- Barre de recherche -->
        <div class="row mb-3">
            <div class="col-md-6">
                <input type="text" class="form-control" placeholder="Rechercher par mois, type ou statut..."
                    v-model="searchTerm" />
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-striped table-hover align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>Mois</th>
                        <th>Année</th>
                        <th>Montant (€)</th>
                        <th>Date de paiement</th>
                        <th>Statut</th>
                        <th>Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="paiement in paginatedData" :key="paiement.id">
                        <td>{{ paiement.mois }}</td>
                        <td>{{ paiement.année }}</td>
                        <td>{{ paiement.montant }}</td>
                        <td>{{ paiement.datePaiement }}</td>
                        <td>
                            <span class="badge" :class="{
                                'bg-success': paiement.statut === 'actif',
                                'bg-warning text-dark': paiement.statut === 'partiel',
                                'bg-danger': paiement.statut === 'en retard'
                            }">
                                {{ paiement.statut }}
                            </span>
                        </td>
                        <td>{{ paiement.typePaiement }}</td>
                        <td>
                            <button class="btn btn-sm btn-primary me-1" @click="openModal(paiement)">
                                Détails
                            </button>
                            <button class="btn btn-sm btn-success me-1" @click="signPaiement(paiement)"
                                :disabled="!!paiement.signature">
                                {{ paiement.signature ? "Signé" : "Signer" }}
                            </button>
                            <button class="btn btn-sm btn-outline-primary" @click="downloadReceipt(paiement)">
                                Télécharger
                            </button>
                        </td>
                    </tr>
                    <tr v-if="filteredPaiements.length === 0">
                        <td colspan="7" class="text-center py-4 text-muted">
                            Aucun paiement trouvé
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination Bootstrap -->
        <nav v-if="totalPages > 1">
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="changePage(currentPage - 1)">Précédent</button>
                </li>
                <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                    <button class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="changePage(currentPage + 1)">Suivant</button>
                </li>
            </ul>
        </nav>

        <!-- Modal Bootstrap -->
        <div class="modal fade" id="paiementModal" tabindex="-1" aria-hidden="true" ref="paiementModal">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">Détails du paiement</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"><strong>Mois :</strong> {{ selectedPaiement.mois }}</li>
                            <li class="list-group-item"><strong>Année :</strong> {{ selectedPaiement.année }}</li>
                            <li class="list-group-item"><strong>Montant :</strong> {{ selectedPaiement.montant }} €</li>
                            <li class="list-group-item"><strong>Date :</strong> {{ selectedPaiement.datePaiement }}</li>
                            <li class="list-group-item">
                                <strong>Statut :</strong>
                                <span class="badge" :class="{
                                    'bg-success': selectedPaiement.statut === 'actif',
                                    'bg-warning text-dark': selectedPaiement.statut === 'partiel',
                                    'bg-danger': selectedPaiement.statut === 'en retard'
                                }">
                                    {{ selectedPaiement.statut }}
                                </span>
                            </li>
                            <li class="list-group-item"><strong>Type :</strong> {{ selectedPaiement.typePaiement }}</li>
                            <li class="list-group-item"><strong>Signature :</strong> {{ selectedPaiement.signature ||
                                'Non signé' }}</li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-success" @click="signPaiement(selectedPaiement)"
                            :disabled="!!selectedPaiement.signature">
                            {{ selectedPaiement.signature ? 'Déjà signé' : 'Signer' }}
                        </button>
                        <button class="btn btn-outline-primary" @click="downloadReceipt(selectedPaiement)">
                            Télécharger reçu
                        </button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "PaiementsHistorique",
    data() {
        return {
            paiements: [
                { id: 1, mois: 1, année: 2025, montant: 500, datePaiement: "2025-01-05", statut: "actif", typePaiement: "Virement", signature: null },
                { id: 2, mois: 2, année: 2025, montant: 500, datePaiement: "2025-02-10", statut: "en retard", typePaiement: "Espèces", signature: null },
                { id: 3, mois: 3, année: 2025, montant: 300, datePaiement: "2025-03-01", statut: "partiel", typePaiement: "Chèque", signature: null },
                { id: 4, mois: 4, année: 2025, montant: 400, datePaiement: "2025-04-02", statut: "actif", typePaiement: "Virement", signature: null },
                { id: 5, mois: 5, année: 2025, montant: 450, datePaiement: "2025-05-05", statut: "actif", typePaiement: "Espèces", signature: null },
                { id: 6, mois: 6, année: 2025, montant: 500, datePaiement: "2025-06-10", statut: "en retard", typePaiement: "Chèque", signature: null },
                // Ajoute autant que tu veux pour tester la pagination
            ],
            selectedPaiement: {},
            paiementModal: null,
            currentPage: 1,
            rowsPerPage: 5,
            searchTerm: "",
        };
    },
    computed: {
        filteredPaiements() {
            if (!this.searchTerm) return this.paiements;
            const term = this.searchTerm.toLowerCase();
            return this.paiements.filter(
                (p) =>
                    p.mois.toString().includes(term) ||
                    p.année.toString().includes(term) ||
                    p.typePaiement.toLowerCase().includes(term) ||
                    p.statut.toLowerCase().includes(term)
            );
        },
        totalPages() {
            return Math.ceil(this.filteredPaiements.length / this.rowsPerPage);
        },
        paginatedData() {
            const start = (this.currentPage - 1) * this.rowsPerPage;
            return this.filteredPaiements.slice(start, start + this.rowsPerPage);
        },
    },
    mounted() {
        this.paiementModal = new window.bootstrap.Modal(this.$refs.paiementModal);
    },
    methods: {
        openModal(paiement) {
            this.selectedPaiement = paiement;
            this.paiementModal.show();
        },
        signPaiement(paiement) {
            if (!paiement.signature) {
                paiement.signature = "Utilisateur connecté";
                alert(`Paiement du mois ${paiement.mois} signé !`);
            }
        },
        downloadReceipt(paiement) {
            alert(`Téléchargement du reçu pour le paiement du mois ${paiement.mois}`);
        },
        changePage(page) {
            if (page < 1 || page > this.totalPages) return;
            this.currentPage = page;
        },
    },
};
</script>

<style scoped>
.table th,
.table td {
    vertical-align: middle;
}

.badge {
    font-size: 0.85rem;
    padding: 0.35em 0.65em;
    border-radius: 0.5rem;
}
</style>
