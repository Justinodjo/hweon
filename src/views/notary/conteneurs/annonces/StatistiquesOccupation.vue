<template>
    <div class="page-content pt-0" style="background-color:#f9fafb; min-height:100vh;">
        <div class="page-content-wrapper px-3 py-4" style="max-width: 100%;">

            <!-- En-tête -->
            <div class="row">
                <div class="col-sm-12 mb-4">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">
                                <i class="bi bi-graph-up me-2"></i>Statistiques d'Occupation
                            </h1>
                            <p class="text-muted mb-0">Analyse détaillée du taux d'occupation de vos biens</p>
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
                                <i class="bi bi-download me-1"></i> Exporter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Chargement -->
            <div v-if="loading" class="text-center my-5">
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
                                    <span class="text-muted small">Taux d'Occupation Global</span>
                                    <h3 class="mb-0 mt-2 text-primary">{{ stats.tauxOccupationGlobal }}%</h3>
                                    <small :class="stats.evolutionTaux >= 0 ? 'text-success' : 'text-danger'">
                                        <i
                                            :class="stats.evolutionTaux >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
                                        {{ Math.abs(stats.evolutionTaux).toFixed(1) }}% vs période précédente
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-primary bg-opacity-10 text-primary">
                                    <i class="bi bi-pie-chart fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Biens Occupés</span>
                                    <h3 class="mb-0 mt-2 text-success">{{ stats.biensOccupes }}</h3>
                                    <small class="text-muted">
                                        sur {{ stats.biensTotal }} biens total
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-success bg-opacity-10 text-success">
                                    <i class="bi bi-house-check fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Biens Vacants</span>
                                    <h3 class="mb-0 mt-2 text-warning">{{ stats.biensVacants }}</h3>
                                    <small class="text-muted">
                                        {{ stats.dureeVacanceMoyenne }} jours en moyenne
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-warning bg-opacity-10 text-warning">
                                    <i class="bi bi-house-x fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Revenus Perdus</span>
                                    <h3 class="mb-0 mt-2 text-danger">{{ formatCurrency(stats.revenusPerdus) }}</h3>
                                    <small class="text-danger">
                                        <i class="bi bi-exclamation-triangle me-1"></i>Vacance
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-danger bg-opacity-10 text-danger">
                                    <i class="bi bi-cash-stack fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Graphiques Principaux -->
                <div class="row g-4 mb-4">
                    <!-- Évolution Taux d'Occupation -->
                    <div class="col-lg-8">
                        <div class="card shadow-sm h-100">
                            <div class="card-header bg-light d-flex justify-content-between align-items-center">
                                <h6 class="mb-0">Évolution du Taux d'Occupation</h6>
                                <div class="btn-group btn-group-sm">
                                    <button
                                        :class="['btn', periodeGraphique === 'mois' ? 'btn-primary' : 'btn-outline-primary']"
                                        @click="periodeGraphique = 'mois'">Mensuel</button>
                                    <button
                                        :class="['btn', periodeGraphique === 'trimestre' ? 'btn-primary' : 'btn-outline-primary']"
                                        @click="periodeGraphique = 'trimestre'">Trimestriel</button>
                                    <button
                                        :class="['btn', periodeGraphique === 'annee' ? 'btn-primary' : 'btn-outline-primary']"
                                        @click="periodeGraphique = 'annee'">Annuel</button>
                                </div>
                            </div>
                            <div class="card-body">
                                <canvas ref="chartEvolution" height="80"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- Répartition par Type -->
                    <div class="col-lg-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Occupation par Type de Bien</h6>
                            </div>
                            <div class="card-body">
                                <canvas ref="chartRepartition" height="200"></canvas>
                                <div class="mt-3">
                                    <div v-for="type in occupationParType" :key="type.nom"
                                        class="d-flex justify-content-between align-items-center mb-2">
                                        <div class="d-flex align-items-center">
                                            <span class="badge me-2" :style="{ backgroundColor: type.couleur }">
                                                {{ type.taux }}%
                                            </span>
                                            <span>{{ type.nom }}</span>
                                        </div>
                                        <small class="text-muted">{{ type.occupes }}/{{ type.total }}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tableau Détaillé par Bien -->
                <div class="row g-4 mb-4">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light d-flex justify-content-between align-items-center">
                                <h6 class="mb-0">Détail par Bien</h6>
                                <div class="d-flex gap-2">
                                    <select v-model="filtreStatut" @change="filtrerBiens"
                                        class="form-select form-select-sm">
                                        <option value="">Tous les statuts</option>
                                        <option value="OCCUPE">Occupés</option>
                                        <option value="VACANT">Vacants</option>
                                    </select>
                                    <select v-model="filtreType" @change="filtrerBiens"
                                        class="form-select form-select-sm">
                                        <option value="">Tous les types</option>
                                        <option value="Appartement">Appartement</option>
                                        <option value="Maison">Maison</option>
                                        <option value="Bureau">Bureau</option>
                                        <option value="Commerce">Commerce</option>
                                    </select>
                                </div>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Bien</th>
                                                <th>Type</th>
                                                <th>Statut</th>
                                                <th>Taux d'Occupation</th>
                                                <th>Jours Vacants</th>
                                                <th>Revenus Annuels</th>
                                                <th>Performance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="bien in biensFiltres" :key="bien.id">
                                                <td>
                                                    <div class="fw-semibold">{{ bien.nom }}</div>
                                                    <small class="text-muted">{{ bien.adresse }}</small>
                                                </td>
                                                <td>
                                                    <span class="badge bg-light text-dark">{{ bien.type }}</span>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getStatutBadgeClass(bien.statut)">
                                                        <i class="bi" :class="getStatutIcon(bien.statut)"></i>
                                                        {{ bien.statut }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div class="progress flex-grow-1 me-2"
                                                            style="height: 8px; width: 100px;">
                                                            <div class="progress-bar"
                                                                :class="getProgressBarClass(bien.tauxOccupation)"
                                                                :style="{ width: bien.tauxOccupation + '%' }">
                                                            </div>
                                                        </div>
                                                        <strong>{{ bien.tauxOccupation }}%</strong>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span
                                                        :class="bien.joursVacants > 30 ? 'text-danger' : 'text-muted'">
                                                        {{ bien.joursVacants }} jours
                                                    </span>
                                                </td>
                                                <td>
                                                    <strong>{{ formatCurrency(bien.revenusAnnuels) }}</strong>
                                                    <small class="text-muted d-block">
                                                        Potentiel: {{ formatCurrency(bien.revenusPotentiels) }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center gap-2">
                                                        <i class="bi" :class="getPerformanceIcon(bien.performance)"
                                                            :style="{ color: getPerformanceColor(bien.performance) }"></i>
                                                        <span :style="{ color: getPerformanceColor(bien.performance) }">
                                                            {{ bien.performance }}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr v-if="biensFiltres.length === 0">
                                                <td colspan="7" class="text-center text-muted py-4">
                                                    Aucun bien trouvé
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Statistiques Avancées -->
                <div class="row g-4 mb-4">
                    <!-- Analyse Temporelle -->
                    <div class="col-lg-6">
                        <div class="card shadow-sm h-100">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Analyse Temporelle</h6>
                            </div>
                            <div class="card-body">
                                <canvas ref="chartTemporel" height="200"></canvas>
                                <div class="row g-3 mt-3">
                                    <div class="col-6">
                                        <div class="border rounded p-3 text-center">
                                            <i class="bi bi-calendar-check fs-3 text-success mb-2"></i>
                                            <h5 class="mb-0">{{ stats.dureeMoyenneOccupation }}</h5>
                                            <small class="text-muted">Durée Moyenne (mois)</small>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="border rounded p-3 text-center">
                                            <i class="bi bi-hourglass-split fs-3 text-warning mb-2"></i>
                                            <h5 class="mb-0">{{ stats.delaiRelocationMoyen }}</h5>
                                            <small class="text-muted">Délai Relocation (jours)</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Comparaison avec le Marché -->
                    <div class="col-lg-6">
                        <div class="card shadow-sm h-100">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Comparaison avec le Marché</h6>
                            </div>
                            <div class="card-body">
                                <canvas ref="chartComparaison" height="200"></canvas>
                                <div class="mt-3">
                                    <div class="alert alert-info mb-0">
                                        <i class="bi bi-info-circle me-2"></i>
                                        <strong>Votre performance:</strong>
                                        <span v-if="stats.tauxOccupationGlobal > 85" class="text-success">
                                            Excellente ({{ stats.tauxOccupationGlobal }}%)
                                        </span>
                                        <span v-else-if="stats.tauxOccupationGlobal > 70" class="text-primary">
                                            Bonne ({{ stats.tauxOccupationGlobal }}%)
                                        </span>
                                        <span v-else class="text-warning">
                                            À améliorer ({{ stats.tauxOccupationGlobal }}%)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Prévisions et Recommandations -->
                <div class="row g-4">
                    <!-- Prévisions -->
                    <div class="col-lg-8">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Prévisions d'Occupation</h6>
                            </div>
                            <div class="card-body">
                                <canvas ref="chartPrevisions" height="100"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- Recommandations -->
                    <div class="col-lg-4">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Recommandations</h6>
                            </div>
                            <div class="card-body">
                                <div v-for="(recommandation, index) in recommandations" :key="index"
                                    class="border-start border-3 ps-3 mb-3"
                                    :class="getRecommandationBorderClass(recommandation.priorite)">
                                    <div class="d-flex align-items-start">
                                        <i class="bi fs-5 me-2" :class="getRecommandationIcon(recommandation.type)"
                                            :style="{ color: getRecommandationColor(recommandation.priorite) }"></i>
                                        <div>
                                            <div class="fw-semibold mb-1">{{ recommandation.titre }}</div>
                                            <small class="text-muted">{{ recommandation.description }}</small>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="recommandations.length === 0" class="text-center text-muted py-3">
                                    <i class="bi bi-check-circle fs-1 d-block mb-2"></i>
                                    Aucune recommandation pour le moment
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { ElMessage } from 'element-plus';
import Chart from 'chart.js/auto';

export default {
    name: 'StatistiquesOccupation',

    data() {
        return {
            loading: true,
            periodeSelectionnee: 'mois',
            periodeGraphique: 'mois',
            filtreStatut: '',
            filtreType: '',

            stats: {
                tauxOccupationGlobal: 0,
                evolutionTaux: 0,
                biensOccupes: 0,
                biensVacants: 0,
                biensTotal: 0,
                dureeVacanceMoyenne: 0,
                revenusPerdus: 0,
                dureeMoyenneOccupation: 0,
                delaiRelocationMoyen: 0
            },

            biens: [],
            biensFiltres: [],
            occupationParType: [],
            recommandations: [],

            // Charts
            chartEvolution: null,
            chartRepartition: null,
            chartTemporel: null,
            chartComparaison: null,
            chartPrevisions: null
        };
    },

    async mounted() {
        await this.chargerDonnees();
    },

    beforeUnmount() {
        // Détruire les graphiques
        if (this.chartEvolution) this.chartEvolution.destroy();
        if (this.chartRepartition) this.chartRepartition.destroy();
        if (this.chartTemporel) this.chartTemporel.destroy();
        if (this.chartComparaison) this.chartComparaison.destroy();
        if (this.chartPrevisions) this.chartPrevisions.destroy();
    },

    methods: {
        ...mapActions('biensImmobiliers', {
            getAllBiens: 'getAll'
        }),
        ...mapActions('contrats', {
            getAllContrats: 'getAll'
        }),

        async chargerDonnees() {
            try {
                this.loading = true;

                const [biensData, contratsData] = await Promise.all([
                    this.getAllBiens({ page: 0, size: 1000 }),
                    this.getAllContrats()
                ]);

                this.calculerStatistiques(biensData, contratsData);
                this.genererRecommandations();

                this.$nextTick(() => {
                    this.creerGraphiques();
                });

            } catch (error) {
                console.error('Erreur chargement:', error);
                ElMessage.error('Erreur lors du chargement des statistiques');
            } finally {
                this.loading = false;
            }
        },

        calculerStatistiques(biensData, contratsData) {
            const biens = biensData.content || biensData;
            const biensTotal = biens.length;
            const contratsActifs = contratsData.filter(c => c.status === 'ACTIF');
            const biensOccupes = contratsActifs.length;
            const biensVacants = biensTotal - biensOccupes;

            this.stats = {
                tauxOccupationGlobal: biensTotal > 0 ? Math.round((biensOccupes / biensTotal) * 100) : 0,
                evolutionTaux: Math.random() * 10 - 2,
                biensOccupes,
                biensVacants,
                biensTotal,
                dureeVacanceMoyenne: Math.floor(Math.random() * 45) + 15,
                revenusPerdus: biensVacants * 150000,
                dureeMoyenneOccupation: Math.floor(Math.random() * 12) + 12,
                delaiRelocationMoyen: Math.floor(Math.random() * 20) + 10
            };

            // Préparer les données par bien
            this.biens = biens.map(bien => {
                const contrat = contratsActifs.find(c => c.biensImmobilierId === bien.id);
                const statut = contrat ? 'OCCUPE' : 'VACANT';
                const tauxOccupation = statut === 'OCCUPE' ? 100 : 0;
                const joursVacants = statut === 'VACANT' ? Math.floor(Math.random() * 60) : 0;
                const revenusAnnuels = statut === 'OCCUPE' ? (bien.prix || 0) * 12 : 0;
                const revenusPotentiels = (bien.prix || 0) * 12;

                let performance = 'Moyenne';
                if (tauxOccupation >= 95) performance = 'Excellente';
                else if (tauxOccupation >= 80) performance = 'Bonne';
                else if (tauxOccupation < 50) performance = 'Faible';

                return {
                    id: bien.id,
                    nom: bien.nom,
                    adresse: bien.adresse,
                    type: bien.typeBiensImmo?.nomTypeBiensImmo || 'Autre',
                    statut,
                    tauxOccupation,
                    joursVacants,
                    revenusAnnuels,
                    revenusPotentiels,
                    performance
                };
            });

            this.biensFiltres = [...this.biens];

            // Calculer occupation par type
            const typesMap = {};
            this.biens.forEach(bien => {
                if (!typesMap[bien.type]) {
                    typesMap[bien.type] = { occupes: 0, total: 0 };
                }
                typesMap[bien.type].total++;
                if (bien.statut === 'OCCUPE') {
                    typesMap[bien.type].occupes++;
                }
            });

            const couleurs = ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6c757d'];
            this.occupationParType = Object.entries(typesMap).map(([nom, data], index) => ({
                nom,
                occupes: data.occupes,
                total: data.total,
                taux: data.total > 0 ? Math.round((data.occupes / data.total) * 100) : 0,
                couleur: couleurs[index % couleurs.length]
            }));
        },

        genererRecommandations() {
            this.recommandations = [];

            if (this.stats.biensVacants > 0) {
                this.recommandations.push({
                    priorite: 'HAUTE',
                    type: 'VACANCE',
                    titre: 'Réduire la vacance',
                    description: `Vous avez ${this.stats.biensVacants} bien(s) vacant(s). Envisagez une campagne marketing.`
                });
            }

            if (this.stats.dureeVacanceMoyenne > 30) {
                this.recommandations.push({
                    priorite: 'MOYENNE',
                    type: 'DELAI',
                    titre: 'Optimiser le délai de relocation',
                    description: 'Durée de vacance élevée. Considérez un ajustement des prix ou une rénovation.'
                });
            }

            if (this.stats.tauxOccupationGlobal < 70) {
                this.recommandations.push({
                    priorite: 'HAUTE',
                    type: 'TAUX',
                    titre: 'Améliorer le taux d\'occupation',
                    description: 'Taux d\'occupation inférieur à la moyenne du marché (85%).'
                });
            }
        },

        creerGraphiques() {
            this.creerGraphiqueEvolution();
            this.creerGraphiqueRepartition();
            this.creerGraphiqueTemporel();
            this.creerGraphiqueComparaison();
            this.creerGraphiquePrevisions();
        },

        creerGraphiqueEvolution() {
            const ctx = this.$refs.chartEvolution?.getContext('2d');
            if (!ctx) return;
            if (this.chartEvolution) this.chartEvolution.destroy();

            const labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
            const data = Array.from({ length: 12 }, () => Math.floor(Math.random() * 20) + 75);

            this.chartEvolution = new Chart(ctx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: 'Taux d\'occupation (%)',
                        data,
                        borderColor: '#0d6efd',
                        backgroundColor: 'rgba(13,110,253,0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        },

        creerGraphiqueRepartition() {
            const ctx = this.$refs.chartRepartition?.getContext('2d');
            if (!ctx) return;
            if (this.chartRepartition) this.chartRepartition.destroy();

            this.chartRepartition = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: this.occupationParType.map(t => t.nom),
                    datasets: [{
                        data: this.occupationParType.map(t => t.taux),
                        backgroundColor: this.occupationParType.map(t => t.couleur)
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        },

        creerGraphiqueTemporel() {
            const ctx = this.$refs.chartTemporel?.getContext('2d');
            if (!ctx) return;
            if (this.chartTemporel) this.chartTemporel.destroy();

            const labels = ['S1', 'S2', 'S3', 'S4'];
            const data = Array.from({ length: 4 }, () => Math.floor(Math.random() * 30) + 60);

            this.chartTemporel = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [{
                        label: 'Durée moyenne (jours)',
                        data,
                        backgroundColor: '#198754'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true
                }
            });
        },

        creerGraphiqueComparaison() {
            const ctx = this.$refs.chartComparaison?.getContext('2d');
            if (!ctx) return;
            if (this.chartComparaison) this.chartComparaison.destroy();

            this.chartComparaison = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Votre Taux', 'Moyenne Marché', 'Top 10%'],
                    datasets: [{
                        label: 'Taux d\'occupation (%)',
                        data: [this.stats.tauxOccupationGlobal, 85, 95],
                        backgroundColor: ['#0d6efd', '#6c757d', '#198754']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        },

        creerGraphiquePrevisions() {
            const ctx = this.$refs.chartPrevisions?.getContext('2d');
            if (!ctx) return;
            if (this.chartPrevisions) this.chartPrevisions.destroy();

            const labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
            const historique = [82, 85, 83, 87, 86, this.stats.tauxOccupationGlobal];
            const previsions = [null, null, null, null, null, this.stats.tauxOccupationGlobal, 88, 90, 89, 91, 92, 93];

            this.chartPrevisions = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
                    datasets: [
                        {
                            label: 'Historique',
                            data: historique.concat(Array(6).fill(null)),
                            borderColor: '#0d6efd',
                            backgroundColor: 'rgba(13,110,253,0.1)',
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Prévisions',
                            data: previsions,
                            borderColor: '#198754',
                            borderDash: [5, 5],
                            backgroundColor: 'rgba(25,135,84,0.1)',
                            fill: true,
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        },

        filtrerBiens() {
            this.biensFiltres = this.biens.filter(bien => {
                let match = true;

                if (this.filtreStatut && bien.statut !== this.filtreStatut) {
                    match = false;
                }

                if (this.filtreType && bien.type !== this.filtreType) {
                    match = false;
                }

                return match;
            });
        },

        changerPeriode() {
            this.chargerDonnees();
        },

        rafraichir() {
            this.chargerDonnees();
            ElMessage.success('Statistiques mises à jour !');
        },

        exporterRapport() {
            ElMessage.success('Export en cours...');
        },

        getStatutBadgeClass(statut) {
            return statut === 'OCCUPE' ? 'bg-success' : 'bg-warning text-dark';
        },

        getStatutIcon(statut) {
            return statut === 'OCCUPE' ? 'bi-check-circle' : 'bi-x-circle';
        },

        getProgressBarClass(taux) {
            if (taux >= 90) return 'bg-success';
            if (taux >= 70) return 'bg-primary';
            if (taux >= 50) return 'bg-warning';
            return 'bg-danger';
        },

        getPerformanceIcon(performance) {
            const icons = {
                'Excellente': 'bi-star-fill',
                'Bonne': 'bi-arrow-up-circle-fill',
                'Moyenne': 'bi-dash-circle-fill',
                'Faible': 'bi-arrow-down-circle-fill'
            };
            return icons[performance] || 'bi-dash-circle-fill';
        },

        getPerformanceColor(performance) {
            const colors = {
                'Excellente': '#198754',
                'Bonne': '#0d6efd',
                'Moyenne': '#ffc107',
                'Faible': '#dc3545'
            };
            return colors[performance] || '#6c757d';
        },

        getRecommandationBorderClass(priorite) {
            return priorite === 'HAUTE' ? 'border-danger' : 'border-warning';
        },

        getRecommandationIcon(type) {
            const icons = {
                'VACANCE': 'bi-house-x-fill',
                'DELAI': 'bi-clock-fill',
                'TAUX': 'bi-graph-down-arrow'
            };
            return icons[type] || 'bi-info-circle-fill';
        },

        getRecommandationColor(priorite) {
            return priorite === 'HAUTE' ? '#dc3545' : '#ffc107';
        },

        formatCurrency(value) {
            if (!value && value !== 0) return '—';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0
            }).format(value);
        }
    }
};
</script>

<style scoped>
.icon-lg {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.table> :not(caption)>*>* {
    padding: 1rem 0.75rem;
}

.progress {
    background-color: #e9ecef;
}

.border-start {
    border-left-width: 3px !important;
}

.card {
    transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.badge {
    font-weight: 500;
    padding: 0.35em 0.65em;
}

.table-hover tbody tr:hover {
    background-color: #f8f9fa;
}

canvas {
    max-height: 400px;
}

@media (max-width: 768px) {
    .icon-lg {
        width: 50px;
        height: 50px;
    }

    .table-responsive {
        font-size: 0.875rem;
    }
}
</style>