<template>
    <div class="container py-4">
        <h3 class="fw-light mb-2"><strong>Avantages</strong></h3>

        <div v-for="(avantage, index) in avantages" :key="index" class="mb-4">
            <strong>{{ avantage.title }}</strong>

            <ul class="list-group list-group-borderless mb-0">
                <!-- Cas spécial : avantage avec sous-list -->
                <li v-if="avantage.sousList" class="list-group-item h6 fw-light d-flex align-items-start mb-0">
                    <i class="bi bi-patch-check-fill text-success me-2 mt-1"></i>
                    <div>
                        <strong>{{ avantage.sousList.title }}</strong>
                        <ul class="list-unstyled ms-4 mt-1">
                            <li v-for="(sousItem, i) in avantage.sousList.items" :key="i" class="d-flex mb-1">
                                <i class="bi bi-patch-check-fill text-success me-2"></i>
                                {{ sousItem }}
                            </li>
                        </ul>
                    </div>
                </li>

                <!-- Liste des points normaux -->
                <li v-for="(point, i) in avantage.points" :key="'point-' + i"
                    class="list-group-item h6 fw-light d-flex mb-0">
                    <i class="bi bi-patch-check-fill text-success me-2"></i>
                    {{ point }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "AvantagesImmobilier",
    data() {
        return {
            avantages: [
                {
                    title: "Gain de temps considérable",
                    points: [
                        "Automatisez vos quittances, relances, révisions de loyers...",
                        "Dites adieu aux tableurs complexes et aux papiers perdus.",
                        "📌 En un clic : vos documents sont générés et vos données centralisées.",
                    ],
                },
                {
                    title: "Suivi facilité de ses biens",
                    points: [
                        "Visualisez vos loyers, retards, rendements, taux d’occupation.",
                        "Analysez la performance de chaque bien.",
                        "📊 Vous savez instantanément ce qui rapporte et ce qui coûte.",
                    ],
                },
                {
                    title: "Zéro oubli administratif",
                    sousList: {
                        title: "Alertes pour :",
                        items: [
                            "la fin des baux",
                            "les révisions de loyers",
                            "les diagnostics à renouveler (DPE, électricité)",
                            "l’envoi automatique des quittances, messages et documents",
                            "les assurances ou taxes à payer",
                        ],
                    },
                    points: ["🔔 Vous restez toujours en conformité et en avance."],
                },
                // Tu peux ajouter ici d'autres blocs comme "Communication simplifiée", etc.
            ],
        };
    },
};
</script>

<style scoped>
.container {
    max-width: 900px;
}
</style>
