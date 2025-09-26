<template>
    <div class="container mt-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="mb-0">Demandes de maintenance</h4>
            <button class="btn btn-primary" @click="openRequestModal">
                + Nouvelle demande
            </button>
        </div>

        <!-- Barre de recherche -->
        <div class="row mb-3">
            <div class="col-md-6">
                <input type="text" class="form-control" placeholder="Rechercher par type, statut, priorité..."
                    v-model="searchTerm" />
            </div>
        </div>

        <!-- Tableau responsive -->
        <div class="table-responsive">
            <table class="table table-striped table-hover align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Date signalement</th>
                        <th>Date traitement</th>
                        <th>Coût estimé (€)</th>
                        <th>Coût réel (€)</th>
                        <th>Écart (€)</th>
                        <th>Statut</th>
                        <th>Priorité</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="intervention in paginatedData" :key="intervention.id">
                        <td>{{ intervention.typeIntervention }}</td>
                        <td>{{ intervention.description }}</td>
                        <td>{{ formatDate(intervention.dateSignalement) }}</td>
                        <td>{{ intervention.dateTraitement ? formatDate(intervention.dateTraitement) : '-' }}</td>
                        <td>{{ intervention.estimationCout }}</td>
                        <td>{{ intervention.coutReel || '-' }}</td>
                        <td>{{ intervention.ecartBudgetaire || '-' }}</td>
                        <td>
                            <span class="badge" :class="{
                                'bg-secondary': intervention.statut === 'EN_ATTENTE',
                                'bg-warning text-dark': intervention.statut === 'EN_COURS',
                                'bg-success': intervention.statut === 'TERMINE'
                            }">
                                {{ intervention.statut }}
                            </span>
                        </td>
                        <td>
                            <span class="badge" :class="{
                                'bg-success': intervention.priorite === 'FAIBLE',
                                'bg-warning text-dark': intervention.priorite === 'MOYENNE',
                                'bg-danger': intervention.priorite === 'ELEVE'
                            }">
                                {{ intervention.priorite }}
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-primary me-1" @click="openModal(intervention)">
                                Détails
                            </button>
                            <button class="btn btn-sm btn-success me-1" @click="signIntervention(intervention)"
                                :disabled="!!intervention.signature">
                                {{ intervention.signature ? 'Signé' : 'Signer' }}
                            </button>
                            <button class="btn btn-sm btn-outline-primary" @click="downloadDocuments(intervention)">
                                Télécharger
                            </button>
                        </td>
                    </tr>
                    <tr v-if="filteredInterventions.length === 0">
                        <td colspan="10" class="text-center py-4 text-muted">
                            Aucune intervention trouvée
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

        <!-- Modal pour nouvelle demande -->
        <div class="modal fade" id="requestModal" tabindex="-1" aria-hidden="true" ref="requestModal">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">Nouvelle demande de maintenance</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <MaintenanceRequestForm :apiUrl="'/api/interventions'" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Bootstrap -->
        <div class="modal fade" id="interventionModal" tabindex="-1" aria-hidden="true" ref="interventionModal">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">Détails de l'intervention</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"><strong>Type :</strong> {{ selectedIntervention.typeIntervention
                                }}</li>
                            <li class="list-group-item"><strong>Description :</strong> {{
                                selectedIntervention.description }}</li>
                            <li class="list-group-item"><strong>Date signalement :</strong> {{
                                formatDate(selectedIntervention.dateSignalement) }}</li>
                            <li class="list-group-item"><strong>Date traitement :</strong> {{
                                selectedIntervention.dateTraitement ? formatDate(selectedIntervention.dateTraitement) :
                                    '-' }}</li>
                            <li class="list-group-item"><strong>Coût estimé :</strong> {{
                                selectedIntervention.estimationCout }}</li>
                            <li class="list-group-item"><strong>Coût réel :</strong> {{ selectedIntervention.coutReel ||
                                '-' }}</li>
                            <li class="list-group-item"><strong>Écart :</strong> {{ selectedIntervention.ecartBudgetaire
                                || '-' }}</li>
                            <li class="list-group-item"><strong>Statut :</strong> {{ selectedIntervention.statut }}</li>
                            <li class="list-group-item"><strong>Priorité :</strong> {{ selectedIntervention.priorite }}
                            </li>
                            <li class="list-group-item"><strong>Documents :</strong>
                                <ul>
                                    <li v-for="f in selectedIntervention.fichiers" :key="f.id">
                                        {{ f.nom }}
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-success" @click="signIntervention(selectedIntervention)"
                            :disabled="!!selectedIntervention.signature">
                            {{ selectedIntervention.signature ? 'Déjà signé' : 'Signer' }}
                        </button>
                        <button class="btn btn-outline-primary" @click="downloadDocuments(selectedIntervention)">
                            Télécharger documents
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
import MaintenanceRequestForm from "@/components/modal/MaintenanceRequestForm.vue";
export default {
    name: "MaintenanceHistorique",
    data() {
        return {
            interventions: [
                {
                    id: 1,
                    typeIntervention: "Plomberie",
                    description: "Fuite au lavabo",
                    estimationCout: 100,
                    coutReel: 120,
                    ecartBudgetaire: 20,
                    dateSignalement: "2025-01-10",
                    dateTraitement: "2025-01-12",
                    statut: "EN_COURS",
                    priorite: "ELEVE",
                    fichiers: [{ id: 1, nom: "facture_plomberie.pdf" }],
                    signature: null,
                },
                {
                    id: 2,
                    typeIntervention: "Électricité",
                    description: "Remplacement prise",
                    estimationCout: 50,
                    coutReel: 50,
                    ecartBudgetaire: 0,
                    dateSignalement: "2025-02-05",
                    dateTraitement: null,
                    statut: "EN_ATTENTE",
                    priorite: "MOYENNE",
                    fichiers: [],
                    signature: null,
                },
            ],
            selectedIntervention: {},
            interventionModal: null,
            currentPage: 1,
            rowsPerPage: 5,
            searchTerm: "",
            requestModal: null,
        };
    },
    components: {
        MaintenanceRequestForm,
    },
    computed: {
        filteredInterventions() {
            if (!this.searchTerm) return this.interventions;
            const term = this.searchTerm.toLowerCase();
            return this.interventions.filter(
                (i) =>
                    i.typeIntervention.toLowerCase().includes(term) ||
                    i.description.toLowerCase().includes(term) ||
                    i.statut.toLowerCase().includes(term) ||
                    i.priorite.toLowerCase().includes(term)
            );
        },
        totalPages() {
            return Math.ceil(this.filteredInterventions.length / this.rowsPerPage);
        },
        paginatedData() {
            const start = (this.currentPage - 1) * this.rowsPerPage;
            return this.filteredInterventions.slice(start, start + this.rowsPerPage);
        },
    },
    mounted() {
        this.interventionModal = new window.bootstrap.Modal(this.$refs.interventionModal);
        this.requestModal = new window.bootstrap.Modal(this.$refs.requestModal);
    },
    methods: {
        openModal(intervention) {
            this.selectedIntervention = intervention;
            this.interventionModal.show();
        },
        openRequestModal() {
            this.requestModal.show();
        },
        signIntervention(intervention) {
            if (!intervention.signature) {
                intervention.signature = "Utilisateur connecté";
                alert(`Intervention "${intervention.typeIntervention}" signée !`);
            }
        },
        downloadDocuments(intervention) {
            alert(`Téléchargement des documents de "${intervention.typeIntervention}"`);
        },
        changePage(page) {
            if (page < 1 || page > this.totalPages) return;
            this.currentPage = page;
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString();
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
