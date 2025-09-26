<template>
    <div class="container mt-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="mb-0">Réclamations</h4>
            <button class="btn btn-primary" @click="openRequestModal">
                + Nouvelle réclamation
            </button>
        </div>

        <!-- Barre de recherche -->
        <div class="row mb-3">
            <div class="col-md-6">
                <input type="text" class="form-control" placeholder="Rechercher..." v-model="searchTerm" />
            </div>
        </div>

        <!-- Tableau réclamations -->
        <div class="table-responsive">
            <table class="table table-striped table-hover align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>Objet</th>
                        <th>Description</th>
                        <th>Date de dépôt</th>
                        <th>Statut</th>
                        <th>Priorité</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="reclamation in paginatedData" :key="reclamation.id">
                        <td>{{ reclamation.objet }}</td>
                        <td>{{ reclamation.description }}</td>
                        <td>{{ formatDate(reclamation.dateDepot) }}</td>
                        <td>
                            <span class="badge" :class="{
                                'bg-secondary': reclamation.statut === 'EN_ATTENTE',
                                'bg-warning text-dark': reclamation.statut === 'EN_COURS',
                                'bg-success': reclamation.statut === 'TRAITEE'
                            }">
                                {{ reclamation.statut }}
                            </span>
                        </td>
                        <td>
                            <span class="badge" :class="{
                                'bg-success': reclamation.priorite === 'FAIBLE',
                                'bg-warning text-dark': reclamation.priorite === 'MOYENNE',
                                'bg-danger': reclamation.priorite === 'ELEVE'
                            }">
                                {{ reclamation.priorite }}
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-primary me-1" @click="openModal(reclamation)">Détails</button>
                            <button class="btn btn-sm btn-success me-1" @click="signReclamation(reclamation)"
                                :disabled="!!reclamation.signature">
                                {{ reclamation.signature ? 'Signé' : 'Signer' }}
                            </button>
                        </td>
                    </tr>
                    <tr v-if="filteredReclamations.length === 0">
                        <td colspan="6" class="text-center text-muted py-4">Aucune réclamation trouvée</td>
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

        <!-- Modal nouvelle réclamation -->
        <div class="modal fade" id="requestModal" tabindex="-1" aria-hidden="true" ref="requestModal">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">Nouvelle réclamation</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <ReclamationForm :apiUrl="'/api/reclamations'" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal détails réclamation -->
        <div class="modal fade" id="reclamationModal" tabindex="-1" aria-hidden="true" ref="reclamationModal">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">Détails de la réclamation</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"><strong>Objet :</strong> {{ selectedReclamation.objet }}</li>
                            <li class="list-group-item"><strong>Description :</strong> {{
                                selectedReclamation.description }}</li>
                            <li class="list-group-item"><strong>Date :</strong> {{
                                formatDate(selectedReclamation.dateDepot) }}</li>
                            <li class="list-group-item"><strong>Statut :</strong> {{ selectedReclamation.statut }}</li>
                            <li class="list-group-item"><strong>Priorité :</strong> {{ selectedReclamation.priorite }}
                            </li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ReclamationForm from "@/components/modal/ReclamationForm.vue";

export default {
    name: "ReclamationsHistorique",
    components: { ReclamationForm },
    data() {
        return {
            reclamations: [], // récupérées depuis ton API
            selectedReclamation: {},
            currentPage: 1,
            rowsPerPage: 5,
            searchTerm: "",
            requestModal: null,
            reclamationModal: null,
        };
    },
    computed: {
        filteredReclamations() {
            if (!this.searchTerm) return this.reclamations;
            const term = this.searchTerm.toLowerCase();
            return this.reclamations.filter(
                r =>
                    r.objet.toLowerCase().includes(term) ||
                    r.description.toLowerCase().includes(term) ||
                    r.statut.toLowerCase().includes(term) ||
                    r.priorite.toLowerCase().includes(term)
            );
        },
        totalPages() {
            return Math.ceil(this.filteredReclamations.length / this.rowsPerPage);
        },
        paginatedData() {
            const start = (this.currentPage - 1) * this.rowsPerPage;
            return this.filteredReclamations.slice(start, start + this.rowsPerPage);
        },
    },
    mounted() {
        this.requestModal = new window.bootstrap.Modal(this.$refs.requestModal);
        this.reclamationModal = new window.bootstrap.Modal(this.$refs.reclamationModal);
    },
    methods: {
        openRequestModal() {
            this.requestModal.show();
        },
        openModal(reclamation) {
            this.selectedReclamation = reclamation;
            this.reclamationModal.show();
        },
        changePage(page) {
            if (page < 1 || page > this.totalPages) return;
            this.currentPage = page;
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString();
        },
        signReclamation(reclamation) {
            if (!reclamation.signature) {
                reclamation.signature = "Utilisateur connecté";
                alert(`Réclamation "${reclamation.objet}" signée !`);
            }
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
