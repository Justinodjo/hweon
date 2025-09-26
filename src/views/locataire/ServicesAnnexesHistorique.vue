<template>
    <div class="container mt-4">
        <h4 class="mb-4">Services Annexes</h4>

        <!-- Bouton ajout -->
        <div class="d-flex justify-content-between mb-3">
            <input type="text" class="form-control w-50" placeholder="Rechercher un service..." v-model="searchTerm" />
            <button class="btn btn-primary" @click="openForm(null)">
                <i class="bi bi-plus-circle me-1"></i> Ajouter un service
            </button>
        </div>

        <!-- Tableau -->
        <div class="table-responsive">
            <table class="table table-striped table-hover align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Prix (€)</th>
                        <th>Périodicité</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="service in paginatedData" :key="service.id">
                        <td>{{ service.nom }}</td>
                        <td>{{ service.description }}</td>
                        <td>{{ service.prix.toFixed(2) }}</td>
                        <td>
                            <span class="badge bg-info">{{ service.periodicite }}</span>
                        </td>
                        <td>
                            <span class="badge" :class="{
                                'bg-success': service.statut === 'DISPONIBLE',
                                'bg-secondary': service.statut === 'INDISPONIBLE'
                            }">
                                {{ service.statut }}
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-warning me-2" @click="openForm(service)">
                                Modifier
                            </button>
                            <button class="btn btn-sm btn-danger" @click="deleteService(service)">
                                Supprimer
                            </button>
                        </td>
                    </tr>
                    <tr v-if="filteredServices.length === 0">
                        <td colspan="6" class="text-center text-muted py-3">
                            Aucun service trouvé
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <nav v-if="totalPages > 1">
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="changePage(currentPage - 1)">
                        Précédent
                    </button>
                </li>
                <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                    <button class="page-link" @click="changePage(page)">
                        {{ page }}
                    </button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="changePage(currentPage + 1)">
                        Suivant
                    </button>
                </li>
            </ul>
        </nav>

        <!-- Modal Form -->
        <div class="modal fade" id="serviceModal" tabindex="-1" ref="serviceModal" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            {{ editingService ? "Modifier le service" : "Ajouter un service" }}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <ServiceAnnexeForm :apiUrl="apiUrl" :initialData="editingService" @submitted="loadServices"
                            @cancel="closeModal" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import ServiceAnnexeForm from "@/components/modal/ServiceAnnexeForm.vue";

export default {
    name: "ServicesAnnexesHistorique",
    components: { ServiceAnnexeForm },
    data() {
        return {
            services: [],
            editingService: null,
            searchTerm: "",
            currentPage: 1,
            rowsPerPage: 5,
            apiUrl: "/api/services-annexes",
            serviceModal: null,
        };
    },
    computed: {
        filteredServices() {
            if (!this.searchTerm) return this.services;
            const term = this.searchTerm.toLowerCase();
            return this.services.filter(
                (s) =>
                    s.nom.toLowerCase().includes(term) ||
                    (s.description && s.description.toLowerCase().includes(term)) ||
                    s.periodicite.toLowerCase().includes(term) ||
                    s.statut.toLowerCase().includes(term)
            );
        },
        totalPages() {
            return Math.ceil(this.filteredServices.length / this.rowsPerPage);
        },
        paginatedData() {
            const start = (this.currentPage - 1) * this.rowsPerPage;
            return this.filteredServices.slice(start, start + this.rowsPerPage);
        },
    },
    mounted() {
        this.serviceModal = new window.bootstrap.Modal(this.$refs.serviceModal);
        this.loadServices();
    },
    methods: {
        async loadServices() {
            try {
                const res = await axios.get(this.apiUrl);
                this.services = res.data;
                this.closeModal();
            } catch (e) {
                console.error("Erreur chargement services :", e);
            }
        },
        openForm(service) {
            this.editingService = service ? { ...service } : null;
            this.serviceModal.show();
        },
        closeModal() {
            this.serviceModal.hide();
        },
        async deleteService(service) {
            if (confirm(`Voulez-vous vraiment supprimer "${service.nom}" ?`)) {
                try {
                    await axios.delete(`${this.apiUrl}/${service.id}`);
                    this.loadServices();
                } catch (e) {
                    console.error("Erreur suppression :", e);
                    alert("❌ Impossible de supprimer le service.");
                }
            }
        },
        changePage(page) {
            if (page < 1 || page > this.totalPages) return;
            this.currentPage = page;
        },
    },
};
</script>

<style scoped>
.badge {
    font-size: 0.85rem;
    padding: 0.4em 0.7em;
    border-radius: 0.5rem;
}
</style>
