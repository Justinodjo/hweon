<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">

            <!-- En-tête -->
            <div class="row">
                <div class="col-sm-12 mb-4">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">Tableau de Bord Locatif</h1>
                            <p class="text-muted mb-0">Vue d'ensemble de votre activité locative</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <select v-model="periodeSelectionnee" @change="changerPeriode" class="form-select">
                                <option value="7jours">7 derniers jours</option>
                                <option value="30jours">30 derniers jours</option>
                                <option value="mois">Ce mois</option>
                                <option value="trimestre">Ce trimestre</option>
                                <option value="annee">Cette année</option>
                            </select>
                            <button @click="rafraichir" class="btn btn-outline-primary">
                                <i class="bi bi-arrow-clockwise"></i>
                            </button>
                            <button @click="exporterRapport" class="btn btn-success">
                                <i class="bi bi-download"></i> Exporter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Chargement -->
            <div v-if="isLoading" class="text-center my-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Chargement...</span>
                </div>
            </div>

            <div v-else>
                <!-- KPIs Principaux -->
                <div class="row g-4 mb-4">
                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Revenus du Mois</span>
                                    <h3 class="mb-0 mt-2 text-success">{{ formatCurrency(kpis.revenusMois) }}</h3>
                                    <small :class="kpis.evolutionRevenus >= 0 ? 'text-success' : 'text-danger'">
                                        <i
                                            :class="kpis.evolutionRevenus >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
                                        {{ Math.abs(kpis.evolutionRevenus).toFixed(1) }}% vs mois dernier
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-success bg-opacity-10 text-success">
                                    <i class="bi bi-currency-exchange fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Taux d'Occupation</span>
                                    <h3 class="mb-0 mt-2 text-primary">{{ kpis.tauxOccupation }}%</h3>
                                    <small class="text-muted">
                                        {{ kpis.biensLoues }}/{{ kpis.biensTotal }} biens loués
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-primary bg-opacity-10 text-primary">
                                    <i class="bi bi-house-check fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Contrats Actifs</span>
                                    <h3 class="mb-0 mt-2 text-info">{{ kpis.contratsActifs }}</h3>
                                    <small class="text-muted">
                                        {{ kpis.contratsExpiresBientot }} expirent bientôt
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-info bg-opacity-10 text-info">
                                    <i class="bi bi-file-earmark-text fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Impayés</span>
                                    <h3 class="mb-0 mt-2 text-danger">{{ formatCurrency(kpis.impayes) }}</h3>
                                    <small class="text-danger">
                                        {{ kpis.nombreImpayes }} paiement(s) en retard
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-danger bg-opacity-10 text-danger">
                                    <i class="bi bi-exclamation-triangle fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Alertes -->
                <div class="row mb-4" v-if="alertes && alertes.length > 0">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-warning bg-opacity-10">
                                <h6 class="mb-0">
                                    <i class="bi bi-bell-fill text-warning me-2"></i>
                                    Alertes et Notifications ({{ alertes.length }})
                                </h6>
                            </div>
                            <div class="card-body p-0">
                                <div class="list-group list-group-flush">
                                    <div v-for="alerte in alertes.slice(0, 5)" :key="alerte.id"
                                        class="list-group-item d-flex justify-content-between align-items-center">
                                        <div class="d-flex align-items-center">
                                            <i :class="getAlerteIcon(alerte.type)" class="me-3 fs-5"
                                                :style="{ color: getAlerteColor(alerte.type) }"></i>
                                            <div>
                                                <div class="fw-semibold">{{ alerte.titre }}</div>
                                                <small class="text-muted">{{ alerte.description }}</small>
                                            </div>
                                        </div>
                                        <div class="text-end">
                                            <small class="text-muted d-block">{{ formatDate(alerte.date) }}</small>
                                            <button @click="traiterAlerte(alerte)"
                                                class="btn btn-sm btn-outline-primary mt-1">
                                                Voir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Graphiques -->
                <div class="row g-4 mb-4">
                    <!-- Graphique Revenus -->
                    <div class="col-lg-8">
                        <div class="card shadow-sm h-100">
                            <div class="card-header bg-light d-flex justify-content-between align-items-center">
                                <h6 class="mb-0">Évolution des Revenus</h6>
                                <div class="btn-group btn-group-sm">
                                    <button
                                        :class="['btn', graphiqueRevenus === 'mois' ? 'btn-primary' : 'btn-outline-primary']"
                                        @click="graphiqueRevenus = 'mois'">Mois</button>
                                    <button
                                        :class="['btn', graphiqueRevenus === 'trimestre' ? 'btn-primary' : 'btn-outline-primary']"
                                        @click="graphiqueRevenus = 'trimestre'">Trimestre</button>
                                    <button
                                        :class="['btn', graphiqueRevenus === 'annee' ? 'btn-primary' : 'btn-outline-primary']"
                                        @click="graphiqueRevenus = 'annee'">Année</button>
                                </div>
                            </div>
                            <div class="card-body">
                                <canvas ref="chartRevenus" height="80"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- Répartition par Type -->
                    <div class="col-lg-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Répartition des Biens</h6>
                            </div>
                            <div class="card-body">
                                <canvas ref="chartRepartition" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tableau Contrats à Expirer et Derniers Paiements -->
                <div class="row g-4 mb-4">
                    <!-- Contrats à expirer -->
                    <div class="col-lg-6">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light d-flex justify-content-between align-items-center">
                                <h6 class="mb-0">Contrats Arrivant à Échéance</h6>
                                <span class="badge bg-warning">{{ contratsExpireBientot.length }}</span>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Bien</th>
                                                <th>Locataire</th>
                                                <th>Échéance</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="contrat in contratsExpireBientot.slice(0, 5)" :key="contrat.id">
                                                <td>
                                                    <div class="fw-semibold">{{ contrat.bien }}</div>
                                                    <small class="text-muted">{{ contrat.reference }}</small>
                                                </td>
                                                <td>{{ contrat.locataire }}</td>
                                                <td>
                                                    <span class="badge" :class="getEcheanceBadgeClass(contrat.dateFin)">
                                                        {{ formatDate(contrat.dateFin) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button @click="renouvelerContrat(contrat)"
                                                        class="btn btn-sm btn-outline-primary">
                                                        <i class="bi bi-arrow-repeat"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr v-if="contratsExpireBientot.length === 0">
                                                <td colspan="4" class="text-center text-muted py-3">
                                                    Aucun contrat à renouveler prochainement
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="card-footer text-center" v-if="contratsExpireBientot.length > 5">
                                <a href="#" class="text-primary">Voir tous les contrats ({{ contratsExpireBientot.length
                                    }})</a>
                            </div>
                        </div>
                    </div>

                    <!-- Derniers paiements -->
                    <div class="col-lg-6">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light d-flex justify-content-between align-items-center">
                                <h6 class="mb-0">Derniers Paiements</h6>
                                <button @click="$router.push('/paiements')" class="btn btn-sm btn-outline-primary">
                                    Voir tout
                                </button>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Date</th>
                                                <th>Locataire</th>
                                                <th>Montant</th>
                                                <th>Statut</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="paiement in derniersPaiements.slice(0, 5)" :key="paiement.id">
                                                <td>{{ formatDate(paiement.date) }}</td>
                                                <td>
                                                    <div class="fw-semibold">{{ paiement.locataire }}</div>
                                                    <small class="text-muted">{{ paiement.bien }}</small>
                                                </td>
                                                <td class="fw-bold">{{ formatCurrency(paiement.montant) }}</td>
                                                <td>
                                                    <span class="badge" :class="getPaiementBadgeClass(paiement.statut)">
                                                        {{ paiement.statut }}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr v-if="derniersPaiements.length === 0">
                                                <td colspan="4" class="text-center text-muted py-3">
                                                    Aucun paiement récent
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Statistiques détaillées -->
                <div class="row g-4 mb-4">
                    <!-- Performance par bien -->
                    <div class="col-lg-6">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Top 5 Biens les Plus Rentables</h6>
                            </div>
                            <div class="card-body">
                                <div v-for="(bien, index) in topBiens" :key="bien.id" class="mb-3">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <div>
                                            <span class="badge bg-primary me-2">{{ index + 1 }}</span>
                                            <span class="fw-semibold">{{ bien.nom }}</span>
                                        </div>
                                        <span class="fw-bold text-success">{{ formatCurrency(bien.revenu) }}</span>
                                    </div>
                                    <div class="progress" style="height: 10px;">
                                        <div class="progress-bar bg-success"
                                            :style="{ width: (topBiens.length ? (bien.revenu / topBiens[0].revenu * 100) : 0) + '%' }">
                                        </div>
                                    </div>
                                    <small class="text-muted">Taux d'occupation: {{ bien.tauxOccupation }}%</small>
                                </div>
                                <div v-if="topBiens.length === 0" class="text-center text-muted py-3">Aucun bien
                                    disponible</div>
                            </div>
                        </div>
                    </div>

                    <!-- Demandes d'intervention -->
                    <div class="col-lg-6">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light d-flex justify-content-between align-items-center">
                                <h6 class="mb-0">Demandes d'Intervention</h6>
                                <span class="badge bg-danger">{{ interventionsUrgentes }}</span>
                            </div>
                            <div class="card-body">
                                <div class="row text-center">
                                    <div class="col-3">
                                        <div class="p-3 bg-warning bg-opacity-10 rounded">
                                            <h4 class="mb-0 text-warning">{{ interventions.ouvertes }}</h4>
                                            <small class="text-muted">Ouvertes</small>
                                        </div>
                                    </div>
                                    <div class="col-3">
                                        <div class="p-3 bg-primary bg-opacity-10 rounded">
                                            <h4 class="mb-0 text-primary">{{ interventions.enCours }}</h4>
                                            <small class="text-muted">En cours</small>
                                        </div>
                                    </div>
                                    <div class="col-3">
                                        <div class="p-3 bg-danger bg-opacity-10 rounded">
                                            <h4 class="mb-0 text-danger">{{ interventions.urgentes }}</h4>
                                            <small class="text-muted">Urgentes</small>
                                        </div>
                                    </div>
                                    <div class="col-3">
                                        <div class="p-3 bg-success bg-opacity-10 rounded">
                                            <h4 class="mb-0 text-success">{{ interventions.resolues }}</h4>
                                            <small class="text-muted">Résolues</small>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <canvas ref="chartInterventions" height="150"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Locataires -->
                <div class="row g-4">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light d-flex justify-content-between align-items-center">
                                <h6 class="mb-0">Aperçu Locataires</h6>
                                <button @click="$router.push('/locataires')" class="btn btn-sm btn-outline-primary">
                                    Voir tous
                                </button>
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div class="col-md-3">
                                        <div class="border rounded p-3 text-center">
                                            <i class="bi bi-people fs-2 text-primary mb-2"></i>
                                            <h4 class="mb-0">{{ locataires.total }}</h4>
                                            <small class="text-muted">Locataires Actifs</small>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="border rounded p-3 text-center">
                                            <i class="bi bi-star fs-2 text-warning mb-2"></i>
                                            <h4 class="mb-0">{{ locataires.noteMoyenne }}/5</h4>
                                            <small class="text-muted">Satisfaction Moyenne</small>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="border rounded p-3 text-center">
                                            <i class="bi bi-check-circle fs-2 text-success mb-2"></i>
                                            <h4 class="mb-0">{{ locataires.bonPayeurs }}%</h4>
                                            <small class="text-muted">Bons Payeurs</small>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="border rounded p-3 text-center">
                                            <i class="bi bi-clock-history fs-2 text-info mb-2"></i>
                                            <h4 class="mb-0">{{ locataires.dureeMoyenne }} mois</h4>
                                            <small class="text-muted">Durée Moyenne</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div> <!-- /v-else -->
        </div> <!-- /page-content-wrapper -->
    </div> <!-- /page-content -->
</template>


<script>
import { ElMessage } from "element-plus";
import Chart from 'chart.js/auto';

export default {
    name: "DashboardLocatif",

    data() {
        return {
            isLoading: false,
            periodeSelectionnee: 'mois',
            graphiqueRevenus: 'mois',

            kpis: {
                revenusMois: 0,
                evolutionRevenus: 0,
                tauxOccupation: 0,
                biensLoues: 0,
                biensTotal: 0,
                contratsActifs: 0,
                contratsExpiresBientot: 0,
                impayes: 0,
                nombreImpayes: 0
            },

            alertes: [],
            contratsExpireBientot: [],
            derniersPaiements: [],
            topBiens: [],

            interventions: {
                ouvertes: 0,
                enCours: 0,
                urgentes: 0,
                resolues: 0
            },

            interventionsUrgentes: 0,

            locataires: {
                total: 0,
                noteMoyenne: 0,
                bonPayeurs: 0,
                dureeMoyenne: 0
            },

            // Charts
            chartRevenus: null,
            chartRepartition: null,
            chartInterventions: null
        };
    },

    mounted() {
        this.chargerDonnees();
    },

    beforeUnmount() {
        // Détruire les graphiques
        if (this.chartRevenus) this.chartRevenus.destroy();
        if (this.chartRepartition) this.chartRepartition.destroy();
        if (this.chartInterventions) this.chartInterventions.destroy();
    },

    methods: {
        async chargerDonnees() {
            this.isLoading = true;
            try {
                // Charger les données depuis le store
                const [contrats, biens, paiements] = await Promise.all([
                    this.$store.dispatch("contrats/getAll"),
                    this.$store.dispatch("biensImmobiliers/getAll", { page: 0, size: 1000 }),
                    this.$store.dispatch("paiements/getAll").catch(() => [])
                ]);

                this.calculerKPIs(contrats, biens, paiements);
                this.genererAlertes(contrats);
                this.identifierContratsExpire(contrats);
                this.recupererDerniersPaiements(paiements);
                this.calculerTopBiens(contrats, biens);
                this.calculerStatistiquesInterventions();
                this.calculerStatistiquesLocataires(contrats);

                // Créer les graphiques
                this.$nextTick(() => {
                    this.creerGraphiqueRevenus(contrats);
                    this.creerGraphiqueRepartition(biens);
                    this.creerGraphiqueInterventions();
                });

            } catch (error) {
                console.error("Erreur chargement dashboard:", error);
                ElMessage.error("Erreur lors du chargement du tableau de bord");
            } finally {
                this.isLoading = false;
            }
        },

        calculerKPIs(contrats, biens, paiements) {
            const now = new Date();
            const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);
            const debutMoisDernier = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const finMoisDernier = new Date(now.getFullYear(), now.getMonth(), 0);

            // Revenus du mois
            const revenusMois = contrats
                .filter(c => c.status === 'ACTIF')
                .reduce((sum, c) => sum + (c.loyerMensuel || 0), 0);

            // Taux d'occupation
            const biensContent = biens.content || biens;
            const biensTotal = biensContent.length;
            const biensLoues = contrats.filter(c => c.status === 'ACTIF').length;
            const tauxOccupation = biensTotal > 0 ? Math.round((biensLoues / biensTotal) * 100) : 0;

            // Contrats
            const contratsActifs = contrats.filter(c => c.status === 'ACTIF').length;
            const contratsExpiresBientot = contrats.filter(c => {
                if (!c.dateFin || c.status !== 'ACTIF') return false;
                const dateFin = new Date(c.dateFin);
                const diff = (dateFin - now) / (1000 * 60 * 60 * 24);
                return diff > 0 && diff <= 60;
            }).length;

            // Impayés (simulation)
            const impayes = revenusMois * 0.05; // 5% d'impayés
            const nombreImpayes = Math.floor(contratsActifs * 0.05);

            this.kpis = {
                revenusMois,
                evolutionRevenus: Math.random() * 20 - 5, // -5% à +15%
                tauxOccupation,
                biensLoues,
                biensTotal,
                contratsActifs,
                contratsExpiresBientot,
                impayes,
                nombreImpayes
            };
        },

        genererAlertes(contrats) {
            this.alertes = [];
            const now = new Date();

            // Alertes contrats expirant
            contrats.forEach(contrat => {
                if (!contrat.dateFin || contrat.status !== 'ACTIF') return;

                const dateFin = new Date(contrat.dateFin);
                const diff = (dateFin - now) / (1000 * 60 * 60 * 24);

                if (diff > 0 && diff <= 30) {
                    this.alertes.push({
                        id: `contrat-${contrat.id}`,
                        type: 'CONTRAT_EXPIRE',
                        titre: 'Contrat arrivant à échéance',
                        description: `Le contrat ${contrat.referenceContrat} expire dans ${Math.floor(diff)} jours`,
                        date: now
                    });
                }
            });

            // Autres alertes simulées
            if (this.kpis.impayes > 0) {
                this.alertes.push({
                    id: 'impayes',
                    type: 'IMPAYE',
                    titre: 'Impayés en cours',
                    description: `${this.kpis.nombreImpayes} paiement(s) en retard pour un montant de ${this.formatCurrency(this.kpis.impayes)}`,
                    date: now
                });
            }
        },

        identifierContratsExpire(contrats) {
            const now = new Date();
            this.contratsExpireBientot = contrats
                .filter(c => {
                    if (!c.dateFin || c.status !== 'ACTIF') return false;
                    const dateFin = new Date(c.dateFin);
                    const diff = (dateFin - now) / (1000 * 60 * 60 * 24);
                    return diff > 0 && diff <= 60;
                })
                .map(c => ({
                    ...c,
                    bien: this.getBienName(c),
                    locataire: c.userInfo?.name || 'N/A',
                    reference: c.referenceContrat
                }))
                .sort((a, b) => new Date(a.dateFin) - new Date(b.dateFin));
        },

        recupererDerniersPaiements(paiements) {
            if (!paiements || paiements.length === 0) {
                // Générer des paiements fictifs
                this.derniersPaiements = Array.from({ length: 10 }, (_, i) => ({
                    id: i + 1,
                    date: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000),
                    locataire: `Locataire ${i + 1}`,
                    bien: `Bien ${i + 1}`,
                    montant: Math.floor(Math.random() * 200000) + 50000,
                    statut: i < 2 ? 'EN_ATTENTE' : 'PAYE'
                }));
            } else {
                this.derniersPaiements = paiements
                    .sort((a, b) => new Date(b.datePaiement) - new Date(a.datePaiement))
                    .slice(0, 10);
            }
        },

        calculerTopBiens(contrats, biens) {
            const revenusParBien = {};

            contrats.forEach(contrat => {
                if (contrat.status !== 'ACTIF') return;
                const bienId = contrat.bienImmobilierId;
                if (!revenusParBien[bienId]) {
                    revenusParBien[bienId] = { revenu: 0, tauxOccupation: 0 };
                }
                revenusParBien[bienId].revenu += contrat.loyerMensuel || 0;
                revenusParBien[bienId].tauxOccupation += 1; // Simplification
            });

            this.topBiens = Object.entries(revenusParBien)
                .map(([bienId, data]) => {
                    const bien = biens.content.find(b => b.id === parseInt(bienId));
                    return {
                        id: bienId,
                        nom: bien ? bien.nom : 'N/A',
                        revenu: data.revenu,
                        tauxOccupation: Math.min(100, (data.tauxOccupation / 12) * 100) // Simplification
                    };
                })
                .sort((a, b) => b.revenu - a.revenu)
                .slice(0, 5);
        },

        calculerStatistiquesInterventions() {
            // Simuler des données d'interventions
            this.interventions = {
                ouvertes: 12,
                enCours: 5,
                urgentes: 3,
                resolues: 20
            };
            this.interventionsUrgentes = this.interventions.urgentes;
        },


        calculerStatistiquesLocataires(contrats) {
            const locatairesSet = new Set();
            let totalNotes = 0;
            let bonPayeursCount = 0;

            contrats.forEach(contrat => {
                if (contrat.status !== 'ACTIF') return;
                locatairesSet.add(contrat.userInfo?.id);
                totalNotes += contrat.userInfo?.satisfactionNote || 0;
                if (contrat.userInfo?.estBonPayeur) bonPayeursCount += 1;
            });

            const totalLocataires = locatairesSet.size;
            this.locataires = {
                total: totalLocataires,
                noteMoyenne: totalLocataires > 0 ? (totalNotes / totalLocataires).toFixed(2) : 0,
                bonPayeurs: totalLocataires > 0 ? Math.round((bonPayeursCount / totalLocataires) * 100) : 0,
                dureeMoyenne: 12 // Simplification
            };
        },

        formatCurrency(montant) {
            return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(montant);
        },

        formatDate(dateStr) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateStr).toLocaleDateString('fr-FR', options);
        },

        getAlerteIcon(type) {
            switch (type) {
                case 'CONTRAT_EXPIRE': return 'bi bi-exclamation-circle-fill';
                case 'IMPAYE': return 'bi bi-x-circle-fill';
                default: return 'bi bi-info-circle-fill';
            }
        },

        getAlerteColor(type) {
            switch (type) {
                case 'CONTRAT_EXPIRE': return '#ffc107';
                case 'IMPAYE': return '#dc3545';
                default: return '#0d6efd';
            }
        },

        getEcheanceBadgeClass(dateFin) {
            const diff = (new Date(dateFin) - new Date()) / (1000 * 60 * 60 * 24);
            if (diff < 15) return 'bg-danger';
            if (diff < 30) return 'bg-warning';
            return 'bg-success';
        },

        getPaiementBadgeClass(statut) {
            switch (statut) {
                case 'PAYE': return 'bg-success';
                case 'EN_ATTENTE': return 'bg-warning';
                case 'EN_RETARD': return 'bg-danger';
                default: return 'bg-secondary';
            }
        },

        getBienName(contrat) {
            return contrat.bienImmobilier?.nom || 'N/A';
        },
        creerGraphiqueRevenus(contrats) {
            const ctx = this.$refs.chartRevenus.getContext("2d");
            if (this.chartRevenus) this.chartRevenus.destroy();

            const data = contrats.slice(0, 12).map(c => c.loyerMensuel || 0);
            this.chartRevenus = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({ length: data.length }, (_, i) => `M${i + 1}`),
                    datasets: [{
                        label: 'Revenus',
                        data,
                        borderColor: '#0d6efd',
                        backgroundColor: 'rgba(13,110,253,0.2)',
                        fill: true,
                        tension: 0.4
                    }]
                }
            });
        },

        creerGraphiqueRepartition(biens) {
            const ctx = this.$refs.chartRepartition.getContext("2d");
            if (this.chartRepartition) this.chartRepartition.destroy();

            const data = biens.content.map(b => b.type || 'Autre');
            const counts = data.reduce((acc, type) => {
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            }, {});

            this.chartRepartition = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(counts),
                    datasets: [{
                        data: Object.values(counts),
                        backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545']
                    }]
                }
            });
        },

        creerGraphiqueInterventions() {
            const ctx = this.$refs.chartInterventions.getContext("2d");
            if (this.chartInterventions) this.chartInterventions.destroy();

            this.chartInterventions = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Ouvertes', 'En cours', 'Urgentes', 'Résolues'],
                    datasets: [{
                        label: 'Interventions',
                        data: [
                            this.interventions.ouvertes,
                            this.interventions.enCours,
                            this.interventions.urgentes,
                            this.interventions.resolues
                        ],
                        backgroundColor: ['#ffc107', '#0d6efd', '#dc3545', '#198754']
                    }]
                }
            });
        },
        changerPeriode() {
            this.chargerDonnees();
        },

        rafraichir() {
            this.chargerDonnees();
            ElMessage.success("Tableau de bord mis à jour !");
        },

        exporterRapport() {
            ElMessage.success("Export en cours...");
        },

        traiterAlerte(alerte) {
            ElMessage.info(`Alerte : ${alerte.titre}`);
        },


    }
}
</script>
<style scoped>
.bloc {
    min-height: 100vh;
    right: 2rem;
    /* ou relative selon ton cas */
}

/* Pour les petits écrans (ex. <style 768px) */
@media (max-width: 768px) {
    .bloc {
        min-height: auto;
        right: 0;
    }
}
</style>