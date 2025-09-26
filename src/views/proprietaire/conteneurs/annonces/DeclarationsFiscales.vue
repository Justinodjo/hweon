<template>
    <div class="container mt-4">
        <h3 class="mb-4">📑 Déclarations fiscales</h3>

        <div class="d-flex justify-content-end mb-3">
            <button class="btn btn-primary" @click="genererDeclaration">
                ➕ Nouvelle déclaration
            </button>
        </div>

        <!-- Tableau -->
        <div class="table-responsive">
            <table class="table table-striped table-hover align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>Année</th>
                        <th>Revenus locatifs (€)</th>
                        <th>Charges déductibles (€)</th>
                        <th>Impôt calculé (€)</th>
                        <th>Date génération</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="d in declarations" :key="d.id">
                        <td>{{ d.annee }}</td>
                        <td>{{ d.revenusLocatifs }}</td>
                        <td>{{ d.chargesDeductibles }}</td>
                        <td>{{ d.impotCalcule }}</td>
                        <td>{{ formatDate(d.dateGeneration) }}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary" @click="telechargerPDF(d)">
                                Télécharger PDF
                            </button>
                        </td>
                    </tr>
                    <tr v-if="declarations.length === 0">
                        <td colspan="6" class="text-center text-muted py-3">
                            Aucune déclaration fiscale enregistrée
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: "DeclarationsFiscales",
    data() {
        return {
            declarations: [
                {
                    id: 1,
                    annee: 2024,
                    revenusLocatifs: 12000,
                    chargesDeductibles: 2500,
                    impotCalcule: 950,
                    dateGeneration: "2025-01-10",
                },
            ],
        };
    },
    methods: {
        formatDate(date) {
            return new Date(date).toLocaleDateString();
        },
        genererDeclaration() {
            alert("Déclaration générée automatiquement ✅");
            // Appel API backend pour calculer et sauvegarder
        },
        telechargerPDF(d) {
            alert(`Téléchargement PDF déclaration ${d.annee}`);
            // Appel API pour récupérer un PDF (ex: via Spring Boot avec iText / JasperReports)
        },
    },
};
</script>
