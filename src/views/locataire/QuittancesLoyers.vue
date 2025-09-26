<template>
    <div class="container mt-4">
        <h4 class="mb-4">Quittances de loyer</h4>

        <!-- Barre de recherche -->
        <div class="row mb-3">
            <div class="col-md-6">
                <input type="text" class="form-control" placeholder="Rechercher par locataire, mois ou statut..."
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
                        <th>Locataire</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="quittance in paginatedData" :key="quittance.id">
                        <td>{{ quittance.mois }}</td>
                        <td>{{ quittance.année }}</td>
                        <td>{{ quittance.montant }}</td>
                        <td>{{ quittance.datePaiement }}</td>
                        <td>{{ quittance.locataire }}</td>
                        <td>
                            <span class="badge" :class="{
                                'bg-success': quittance.statut === 'payé',
                                'bg-warning text-dark': quittance.statut === 'partiel',
                                'bg-danger': quittance.statut === 'en retard'
                            }">
                                {{ quittance.statut }}
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-primary me-1" @click="openModal(quittance)">
                                Détails
                            </button>
                            <button class="btn btn-sm btn-success me-1" @click="signQuittance(quittance)"
                                :disabled="!!quittance.signature">
                                {{ quittance.signature ? "Signé" : "Signer" }}
                            </button>
                            <button class="btn btn-sm btn-outline-primary" @click="downloadReceipt(quittance)">
                                Télécharger
                            </button>
                        </td>
                    </tr>
                    <tr v-if="filteredQuittances.length === 0">
                        <td colspan="7" class="text-center py-4 text-muted">
                            Aucune quittance trouvée
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
        <div class="modal fade" id="quittanceModal" tabindex="-1" aria-hidden="true" ref="quittanceModal">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">Détails de la quittance</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"><strong>Mois :</strong> {{ selectedQuittance.mois }}</li>
                            <li class="list-group-item"><strong>Année :</strong> {{ selectedQuittance.année }}</li>
                            <li class="list-group-item"><strong>Montant :</strong> {{ selectedQuittance.montant }} €
                            </li>
                            <li class="list-group-item"><strong>Date :</strong> {{ selectedQuittance.datePaiement }}
                            </li>
                            <li class="list-group-item"><strong>Locataire :</strong> {{ selectedQuittance.locataire }}
                            </li>
                            <li class="list-group-item">
                                <strong>Statut :</strong>
                                <span class="badge" :class="{
                                    'bg-success': selectedQuittance.statut === 'payé',
                                    'bg-warning text-dark': selectedQuittance.statut === 'partiel',
                                    'bg-danger': selectedQuittance.statut === 'en retard'
                                }">
                                    {{ selectedQuittance.statut }}
                                </span>
                            </li>
                            <li class="list-group-item"><strong>Signature :</strong> {{ selectedQuittance.signature ||
                                'Non signé' }}</li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-success" @click="signQuittance(selectedQuittance)"
                            :disabled="!!selectedQuittance.signature">
                            {{ selectedQuittance.signature ? 'Déjà signé' : 'Signer' }}
                        </button>
                        <button class="btn btn-outline-primary" @click="downloadReceipt(selectedQuittance)">
                            Télécharger quittance
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
    name: "QuittancesHistorique",
    data() {
        return {
            quittances: [
                { id: 1, mois: 1, année: 2025, montant: 500, datePaiement: "2025-01-05", locataire: "Jean Dupont", statut: "payé", signature: null },
                { id: 2, mois: 2, année: 2025, montant: 500, datePaiement: "2025-02-10", locataire: "Marie Curie", statut: "en retard", signature: null },
                { id: 3, mois: 3, année: 2025, montant: 300, datePaiement: "2025-03-01", locataire: "Paul Martin", statut: "partiel", signature: null },
                // Ajoute d'autres pour tester la pagination
            ],
            selectedQuittance: {},
            quittanceModal: null,
            currentPage: 1,
            rowsPerPage: 5,
            searchTerm: "",
        };
    },
    computed: {
        filteredQuittances() {
            if (!this.searchTerm) return this.quittances;
            const term = this.searchTerm.toLowerCase();
            return this.quittances.filter(
                (q) =>
                    q.mois.toString().includes(term) ||
                    q.année.toString().includes(term) ||
                    q.locataire.toLowerCase().includes(term) ||
                    q.statut.toLowerCase().includes(term)
            );
        },
        totalPages() {
            return Math.ceil(this.filteredQuittances.length / this.rowsPerPage);
        },
        paginatedData() {
            const start = (this.currentPage - 1) * this.rowsPerPage;
            return this.filteredQuittances.slice(start, start + this.rowsPerPage);
        },
    },
    mounted() {
        this.quittanceModal = new window.bootstrap.Modal(this.$refs.quittanceModal);
    },
    methods: {
        openModal(quittance) {
            this.selectedQuittance = quittance;
            this.quittanceModal.show();
        },
        signQuittance(quittance) {
            if (!quittance.signature) {
                quittance.signature = "Utilisateur connecté";
                alert(`Quittance du mois ${quittance.mois} signée !`);
            }
        },
        downloadReceipt(quittance) {
            alert(`Téléchargement de la quittance du mois ${quittance.mois}`);
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
