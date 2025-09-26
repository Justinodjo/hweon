<template>
    <div class="container mt-4">
        <h4 class="mb-4">Suivi des charges</h4>

        <!-- Barre de recherche -->
        <div class="row mb-3">
            <div class="col-md-6">
                <input type="text" class="form-control" placeholder="Rechercher par type, mois, année ou statut..."
                    v-model="searchTerm" />
            </div>
        </div>

        <!-- Tableau responsive -->
        <div class="table-responsive">
            <table class="table table-striped table-hover align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>Type</th>
                        <th>Mois</th>
                        <th>Année</th>
                        <th>Montant (€)</th>
                        <th>Date de paiement</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="charge in paginatedData" :key="charge.id">
                        <td>{{ charge.typeCharge }}</td>
                        <td>{{ charge.mois }}</td>
                        <td>{{ charge.année }}</td>
                        <td>{{ charge.montant }}</td>
                        <td>{{ charge.datePaiement }}</td>
                        <td>
                            <span class="badge" :class="{
                                'bg-success': charge.statut === 'payé',
                                'bg-warning text-dark': charge.statut === 'partiel',
                                'bg-danger': charge.statut === 'en retard'
                            }">
                                {{ charge.statut }}
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-primary me-1" @click="openModal(charge)">
                                Détails
                            </button>
                            <button class="btn btn-sm btn-success me-1" @click="signCharge(charge)"
                                :disabled="!!charge.signature">
                                {{ charge.signature ? "Signé" : "Signer" }}
                            </button>
                            <button class="btn btn-sm btn-outline-primary" @click="downloadReceipt(charge)">
                                Télécharger
                            </button>
                        </td>
                    </tr>
                    <tr v-if="filteredCharges.length === 0">
                        <td colspan="7" class="text-center py-4 text-muted">
                            Aucune charge trouvée
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
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
        <div class="modal fade" id="chargeModal" tabindex="-1" aria-hidden="true" ref="chargeModal">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">Détails de la charge</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"><strong>Type :</strong> {{ selectedCharge.typeCharge }}</li>
                            <li class="list-group-item"><strong>Mois :</strong> {{ selectedCharge.mois }}</li>
                            <li class="list-group-item"><strong>Année :</strong> {{ selectedCharge.année }}</li>
                            <li class="list-group-item"><strong>Montant :</strong> {{ selectedCharge.montant }} €</li>
                            <li class="list-group-item"><strong>Date :</strong> {{ selectedCharge.datePaiement }}</li>
                            <li class="list-group-item">
                                <strong>Statut :</strong>
                                <span class="badge" :class="{
                                    'bg-success': selectedCharge.statut === 'payé',
                                    'bg-warning text-dark': selectedCharge.statut === 'partiel',
                                    'bg-danger': selectedCharge.statut === 'en retard'
                                }">
                                    {{ selectedCharge.statut }}
                                </span>
                            </li>
                            <li class="list-group-item"><strong>Signature :</strong>
                                {{ selectedCharge.signature || 'Non signé' }}</li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-success" @click="signCharge(selectedCharge)"
                            :disabled="!!selectedCharge.signature">
                            {{ selectedCharge.signature ? 'Déjà signé' : 'Signer' }}
                        </button>
                        <button class="btn btn-outline-primary" @click="downloadReceipt(selectedCharge)">
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
    name: "ChargesHistorique",
    data() {
        return {
            charges: [
                { id: 1, typeCharge: "Électricité", mois: 1, année: 2025, montant: 120, datePaiement: "2025-01-15", statut: "payé", signature: null },
                { id: 2, typeCharge: "Eau", mois: 1, année: 2025, montant: 45, datePaiement: "2025-01-20", statut: "partiel", signature: null },
                { id: 3, typeCharge: "Copropriété", mois: 1, année: 2025, montant: 200, datePaiement: "2025-01-25", statut: "en retard", signature: null },
                // ajoute d'autres pour tester la pagination
            ],
            selectedCharge: {},
            chargeModal: null,
            currentPage: 1,
            rowsPerPage: 5,
            searchTerm: "",
        };
    },
    computed: {
        filteredCharges() {
            if (!this.searchTerm) return this.charges;
            const term = this.searchTerm.toLowerCase();
            return this.charges.filter(
                (c) =>
                    c.typeCharge.toLowerCase().includes(term) ||
                    c.mois.toString().includes(term) ||
                    c.année.toString().includes(term) ||
                    c.statut.toLowerCase().includes(term)
            );
        },
        totalPages() {
            return Math.ceil(this.filteredCharges.length / this.rowsPerPage);
        },
        paginatedData() {
            const start = (this.currentPage - 1) * this.rowsPerPage;
            return this.filteredCharges.slice(start, start + this.rowsPerPage);
        },
    },
    mounted() {
        this.chargeModal = new window.bootstrap.Modal(this.$refs.chargeModal);
    },
    methods: {
        openModal(charge) {
            this.selectedCharge = charge;
            this.chargeModal.show();
        },
        signCharge(charge) {
            if (!charge.signature) {
                charge.signature = "Utilisateur connecté";
                alert(`Charge "${charge.typeCharge}" du mois ${charge.mois} signée !`);
            }
        },
        downloadReceipt(charge) {
            alert(`Téléchargement du reçu pour la charge "${charge.typeCharge}" du mois ${charge.mois}`);
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
