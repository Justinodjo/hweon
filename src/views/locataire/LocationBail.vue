<template>
    <div class="container py-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="fw-semibold text-dark">📑 Liste des Contrats</h2>
            <button class="btn btn-primary" @click="fetchContrats">Rafraîchir</button>
        </div>

        <!-- Table -->
        <div class="card shadow-sm border-0 rounded-3">
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Statut</th>
                            <th>Locataire</th>
                            <th>Début</th>
                            <th>Fin</th>
                            <th>Loyer</th>
                            <th class="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="contrat in contrats" :key="contrat.id">
                            <td>{{ contrat.id }}</td>
                            <td>
                                <span :class="statusClass(contrat.status)" class="badge">
                                    {{ contrat.status }}
                                </span>
                            </td>
                            <td>{{ contrat.userInfo?.nom ?? "—" }}</td>
                            <td>{{ formatDate(contrat.dateDebut) }}</td>
                            <td>{{ formatDate(contrat.dateFin) }}</td>
                            <td class="fw-semibold text-primary">{{ contrat.loyerMensuel }} €</td>
                            <td class="text-end">
                                <button class="btn btn-sm btn-outline-primary" @click="openModal(contrat)"
                                    data-bs-toggle="modal" data-bs-target="#detailModal">
                                    Détails
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal Détails -->
        <div class="modal fade" id="detailModal" tabindex="-1" aria-labelledby="detailModalLabel" aria-hidden="true"
            ref="modalRef">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content rounded-3 shadow">
                    <div class="modal-header">
                        <h5 class="modal-title fw-semibold" id="detailModalLabel">
                            📄 Détails du contrat
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
                    </div>
                    <div class="modal-body" v-if="selectedContrat">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">
                                <strong>Type :</strong> {{ selectedContrat.typeContrat }}
                            </li>
                            <li class="list-group-item">
                                <strong>Loyer mensuel :</strong> {{ selectedContrat.loyerMensuel }} €
                            </li>
                            <li class="list-group-item">
                                <strong>Prix total :</strong> {{ selectedContrat.prixTotal }} €
                            </li>
                            <li class="list-group-item">
                                <strong>Commission :</strong> {{ selectedContrat.commission ?? "—" }} €
                            </li>
                            <li class="list-group-item">
                                <strong>Frais annulation :</strong>
                                {{ selectedContrat.fraisAnnulation ?? "—" }} €
                            </li>
                            <li class="list-group-item">
                                <strong>Biens :</strong>
                                <span v-for="bien in selectedContrat.biensImmobiliers" :key="bien.id"
                                    class="badge bg-secondary me-1">
                                    🏠 {{ bien.nom }}
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Fermer
                        </button>
                        <button type="button" class="btn btn-danger">
                            Résilier
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"

const contrats = ref([
    {
        id: 1,
        status: "ACTIF",
        loyerMensuel: 800,
        prixTotal: 9600,
        dateDebut: "2025-01-01",
        dateFin: "2025-12-31",
        fraisAnnulation: null,
        typeContrat: "MEUBLEE",
        commission: 500,
        userInfo: { nom: "Jean Dupont" },
        biensImmobiliers: [{ id: 1, nom: "Appartement Centre-ville" }]
    }
])

const selectedContrat = ref(null)

function openModal(contrat) {
    selectedContrat.value = contrat
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("fr-FR")
}

function statusClass(status) {
    switch (status) {
        case "ACTIF":
            return "bg-success"
        case "RESILIE":
            return "bg-danger"
        case "EXPIRE":
            return "bg-secondary"
        default:
            return "bg-light text-dark"
    }
}

function fetchContrats() {
    console.log("API → GET /contrats")
}
</script>
