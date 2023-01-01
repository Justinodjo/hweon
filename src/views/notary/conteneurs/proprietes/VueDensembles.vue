<template>
    <main>
        <section class="pt-0">
            <div class="container vstack gap-4">
                <!-- Title -->
                <div class="row">
                    <div class="col-12">
                        <h1 class="fs-4 mb-0">
                            <i class="bi bi-building fa-fw me-1"></i>Vue d'ensemble des propriétés
                        </h1>
                        <p class="text-muted mb-0">Tableau de bord de gestion des mandats</p>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="row g-4">
                    <!-- Total Propriétés -->
                    <div class="col-md-6 col-xl-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">Total Propriétés</h6>
                                    <h2 class="mb-0">{{ stats.totalProperties }}</h2>
                                    <p class="mb-0 small text-muted mt-2">
                                        <i class="bi bi-building me-1"></i>Sous gestion
                                    </p>
                                </div>
                                <div class="bg-primary bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-building fs-4 text-primary"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contrats Actifs -->
                    <div class="col-md-6 col-xl-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">Contrats Actifs</h6>
                                    <h2 class="mb-0 text-success">{{ stats.activeContracts }}</h2>
                                    <p class="mb-0 small text-muted mt-2">
                                        <i class="bi bi-file-text me-1"></i>En cours
                                    </p>
                                </div>
                                <div class="bg-success bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-file-check fs-4 text-success"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Revenus Mensuels -->
                    <div class="col-md-6 col-xl-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">Revenus Mensuels</h6>
                                    <h2 class="mb-0">{{ formatCurrency(stats.monthlyRevenue) }}</h2>
                                    <p class="mb-0 small mt-2">
                                        <span class="text-success me-1">
                                            <i class="bi bi-arrow-up"></i>12%
                                        </span>
                                        vs mois dernier
                                    </p>
                                </div>
                                <div class="bg-info bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-cash-stack fs-4 text-info"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Taux d'Occupation -->
                    <div class="col-md-6 col-xl-3">
                        <div class="card border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="text-muted mb-2">Taux d'Occupation</h6>
                                    <h2 class="mb-0 text-warning">{{ stats.occupancyRate }}%</h2>
                                    <p class="mb-0 small text-muted mt-2">
                                        {{ stats.activeContracts }}/{{ stats.totalProperties }} propriétés
                                    </p>
                                </div>
                                <div class="bg-warning bg-opacity-10 p-3 rounded">
                                    <i class="bi bi-graph-up fs-4 text-warning"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="row g-4">
                    <!-- Revenue Chart -->
                    <div class="col-lg-8">
                        <div class="card border">
                            <div class="card-header border-bottom">
                                <h5 class="card-header-title">Revenus vs Dépenses</h5>
                            </div>
                            <div class="card-body" style="height: 280px; position: relative;">
                                <canvas ref="revenueChart" height="100"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- Property Type Distribution -->
                    <div class="col-lg-4">
                        <div class="card border">
                            <div class="card-header border-bottom">
                                <h5 class="card-header-title">Répartition par Type</h5>
                            </div>
                            <div class="card-body">
                                <canvas ref="typeChart" height="200"></canvas>
                                <div class="mt-3">
                                    <div v-for="(type, index) in propertyTypes" :key="index"
                                        class="d-flex justify-content-between align-items-center mb-2">
                                        <div class="d-flex align-items-center">
                                            <span class="badge me-2"
                                                :style="{ backgroundColor: type.color, width: '12px', height: '12px' }"></span>
                                            <span class="small">{{ type.name }}</span>
                                        </div>
                                        <span class="badge bg-light text-dark">{{ type.count }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Properties Table -->
                <div class="row">
                    <div class="col-12">
                        <div class="card border">
                            <!-- Card header -->
                            <div class="card-header border-bottom">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h5 class="card-header-title">
                                        Liste des Propriétés
                                        <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                            {{ filteredProperties.length }} biens
                                        </span>
                                    </h5>
                                    <div class="d-flex gap-2">
                                        <select v-model="filters.status" class="form-select form-select-sm"
                                            style="width: auto;">
                                            <option value="">Tous les statuts</option>
                                            <option value="Occupé">Occupé</option>
                                            <option value="Disponible">Disponible</option>
                                            <option value="En Maintenance">En Maintenance</option>
                                        </select>
                                        <select v-model="filters.type" class="form-select form-select-sm"
                                            style="width: auto;">
                                            <option value="">Tous les types</option>
                                            <option value="Villa">Villa</option>
                                            <option value="Appartement">Appartement</option>
                                            <option value="Duplex">Duplex</option>
                                            <option value="Studio">Studio</option>
                                        </select>
                                        <button class="btn btn-sm btn-primary" @click="exportData">
                                            <i class="bi bi-download me-1"></i>Exporter
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Card body -->
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover align-middle mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th class="px-4">Propriété</th>
                                                <th>Propriétaire</th>
                                                <th>Type</th>
                                                <th>Loyer</th>
                                                <th>Statut</th>
                                                <th>Locataire</th>
                                                <th class="text-end px-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="loading">
                                                <td colspan="7" class="text-center py-5">
                                                    <div class="spinner-border text-primary" role="status">
                                                        <span class="visually-hidden">Chargement...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr v-else-if="filteredProperties.length === 0">
                                                <td colspan="7" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucune propriété trouvée</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="property in paginatedProperties" :key="property.id">
                                                <td class="px-4">
                                                    <div class="d-flex align-items-center">
                                                        <div class="avatar avatar-md flex-shrink-0">
                                                            <img v-if="property.image" :src="property.image"
                                                                class="rounded" alt="property"
                                                                @error="handleImageError">
                                                            <div v-else
                                                                class="avatar-placeholder bg-light rounded d-flex align-items-center justify-content-center">
                                                                <i class="bi bi-building text-muted"></i>
                                                            </div>
                                                        </div>
                                                        <div class="ms-3">
                                                            <h6 class="mb-0">{{ property.nom }}</h6>
                                                            <small class="text-muted">
                                                                <i class="bi bi-geo-alt me-1"></i>{{ property.adresse }}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{{ property.proprietaire }}</td>
                                                <td>
                                                    <span class="badge bg-light text-dark">
                                                        {{ property.type }}
                                                    </span>
                                                    <small class="text-muted d-block">{{ property.chambres }}
                                                        ch.</small>
                                                </td>
                                                <td>
                                                    <strong>{{ formatCurrency(property.loyer) }}</strong>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getStatusClass(property.status)">
                                                        <i class="bi" :class="getStatusIcon(property.status)"></i>
                                                        {{ property.status }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div v-if="property.locataire">
                                                        <div>{{ property.locataire }}</div>
                                                        <small class="text-muted">
                                                            <i class="bi bi-calendar-event me-1"></i>
                                                            Jusqu'au {{ formatDate(property.dateFin) }}
                                                        </small>
                                                    </div>
                                                    <span v-else class="text-muted">—</span>
                                                </td>
                                                <td class="text-end px-4">
                                                    <div class="dropdown">
                                                        <button class="btn btn-sm btn-light" type="button"
                                                            :id="'dropdown-' + property.id" data-bs-toggle="dropdown"
                                                            aria-expanded="false">
                                                            <i class="bi bi-three-dots-vertical"></i>
                                                        </button>
                                                        <ul class="dropdown-menu dropdown-menu-end"
                                                            :aria-labelledby="'dropdown-' + property.id">
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="viewDetails(property)">
                                                                    <i class="bi bi-eye me-2"></i>Voir détails
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="viewContract(property)">
                                                                    <i class="bi bi-file-text me-2"></i>Voir contrat
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <hr class="dropdown-divider">
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="editProperty(property)">
                                                                    <i class="bi bi-pencil me-2"></i>Modifier
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- Pagination -->
                                <div v-if="filteredProperties.length > perPage" class="card-footer border-top">
                                    <nav>
                                        <ul class="pagination justify-content-center mb-0">
                                            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                                <a class="page-link" href="#"
                                                    @click.prevent="currentPage--">Précédent</a>
                                            </li>
                                            <li v-for="page in totalPages" :key="page" class="page-item"
                                                :class="{ active: currentPage === page }">
                                                <a class="page-link" href="#" @click.prevent="currentPage = page">{{
                                                    page }}</a>
                                            </li>
                                            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                                <a class="page-link" href="#" @click.prevent="currentPage++">Suivant</a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Modal Detail Property -->
        <div v-if="selectedProperty" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ selectedProperty.nom }}</h5>
                        <button type="button" class="btn-close" @click="selectedProperty = null"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label text-muted small">Type de bien</label>
                                    <p class="mb-0 fw-bold">{{ selectedProperty.type }}</p>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label text-muted small">Nombre de chambres</label>
                                    <p class="mb-0 fw-bold">{{ selectedProperty.chambres }}</p>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label text-muted small">Loyer mensuel</label>
                                    <p class="mb-0 fw-bold text-success">{{ formatCurrency(selectedProperty.loyer) }}
                                    </p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label text-muted small">Statut</label>
                                    <p class="mb-0">
                                        <span class="badge" :class="getStatusClass(selectedProperty.status)">
                                            {{ selectedProperty.status }}
                                        </span>
                                    </p>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label text-muted small">Adresse</label>
                                    <p class="mb-0">
                                        <i class="bi bi-geo-alt me-1"></i>{{ selectedProperty.adresse }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <hr class="my-4">

                        <div class="row g-4">
                            <div class="col-md-6">
                                <h6 class="mb-3">Propriétaire</h6>
                                <p class="mb-2"><strong>{{ selectedProperty.proprietaire }}</strong></p>
                            </div>

                            <div v-if="selectedProperty.locataire" class="col-md-6">
                                <h6 class="mb-3">Locataire Actuel</h6>
                                <p class="mb-2"><strong>{{ selectedProperty.locataire }}</strong></p>
                                <p v-if="selectedProperty.telephone" class="mb-1 small">
                                    <i class="bi bi-telephone me-2"></i>{{ selectedProperty.telephone }}
                                </p>
                                <p v-if="selectedProperty.email" class="mb-1 small">
                                    <i class="bi bi-envelope me-2"></i>{{ selectedProperty.email }}
                                </p>
                                <p v-if="selectedProperty.dateDebut" class="mb-1 small">
                                    <i class="bi bi-calendar-event me-2"></i>
                                    Du {{ formatDate(selectedProperty.dateDebut) }} au {{
                                        formatDate(selectedProperty.dateFin) }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="selectedProperty = null">
                            Fermer
                        </button>
                        <button type="button" class="btn btn-primary" @click="viewContract(selectedProperty)">
                            <i class="bi bi-file-text me-1"></i>Voir le contrat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Chart from 'chart.js/auto';

export default {
    name: 'VueEnsembleProprietes',

    data() {
        return {
            loading: true,
            properties: [],
            contracts: [],
            selectedProperty: null,
            currentPage: 1,
            perPage: 10,
            filters: {
                status: '',
                type: ''
            },
            stats: {
                totalProperties: 0,
                activeContracts: 0,
                monthlyRevenue: 0,
                occupancyRate: 0
            },
            propertyTypes: [
                { name: 'Villa', count: 0, color: '#0d6efd' },
                { name: 'Appartement', count: 0, color: '#198754' },
                { name: 'Duplex', count: 0, color: '#ffc107' },
                { name: 'Studio', count: 0, color: '#6f42c1' }
            ],
            revenueChart: null,
            typeChart: null
        };
    },

    computed: {
        ...mapGetters('auth', {
            userInfo: 'userInfo'
        }),

        filteredProperties() {
            return this.properties.filter(property => {
                const statusMatch = !this.filters.status || property.status === this.filters.status;
                const typeMatch = !this.filters.type || property.type === this.filters.type;
                return statusMatch && typeMatch;
            });
        },

        paginatedProperties() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredProperties.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.filteredProperties.length / this.perPage);
        }
    },

    async mounted() {
        await this.loadData();
        this.$nextTick(() => {
            this.initCharts();
        });
    },

    beforeDestroy() {
        if (this.revenueChart) this.revenueChart.destroy();
        if (this.typeChart) this.typeChart.destroy();
    },

    methods: {
        ...mapActions({
            getBiensByUser: 'biensImmobiliers/getBiensByUser',
            getContratsUtilisateur: 'contrats/getContratsUtilisateur'
        }),

        async loadData() {
            try {
                this.loading = true;

                // Charger les biens de l'utilisateur
                const biensResponse = await this.getBiensByUser({
                    page: 0,
                    size: 100
                });

                // Charger les contrats
                const contratsResponse = await this.getContratsUtilisateur(this.userInfo);

                // Transformer les données
                this.properties = this.transformBiensToProperties(biensResponse.content || []);
                this.contracts = contratsResponse || [];

                // Calculer les statistiques
                this.calculateStats();
                this.calculatePropertyTypes();

            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
                this.$message.error('Erreur lors du chargement des données');
            } finally {
                this.loading = false;
            }
        },

        transformBiensToProperties(biens) {
            return biens.map(bien => {
                const contract = this.findActiveContract(bien.id);

                return {
                    id: bien.id,
                    nom: bien.nom,
                    adresse: bien.adresse,
                    type: bien.typeBiensImmo?.nomTypeBiensImmo || 'N/A',
                    chambres: bien.nombreChambres || 0,
                    status: contract ? 'Occupé' : (bien.disponible ? 'Disponible' : 'En Maintenance'),
                    loyer: bien.prix || 0,
                    proprietaire: bien.utilisateur?.nom || 'N/A',
                    locataire: contract?.locataire?.nom || null,
                    dateDebut: contract?.dateDebut || null,
                    dateFin: contract?.dateFin || null,
                    telephone: contract?.locataire?.telephone || null,
                    email: contract?.locataire?.email || null,
                    image: bien.fichier?.id ? this.getImageUrl(bien.fichier.id) : null
                };
            });
        },

        findActiveContract(bienId) {
            return this.contracts.find(contract =>
                contract.biensImmobiliers?.some(bien => bien.id === bienId) &&
                contract.status === 'ACTIF'
            );
        },

        calculateStats() {
            this.stats.totalProperties = this.properties.length;
            this.stats.activeContracts = this.properties.filter(p => p.status === 'Occupé').length;
            this.stats.monthlyRevenue = this.properties
                .filter(p => p.status === 'Occupé')
                .reduce((sum, p) => sum + p.loyer, 0);
            this.stats.occupancyRate = this.stats.totalProperties > 0
                ? Math.round((this.stats.activeContracts / this.stats.totalProperties) * 100)
                : 0;
        },

        calculatePropertyTypes() {
            const typeCounts = {};
            this.properties.forEach(property => {
                typeCounts[property.type] = (typeCounts[property.type] || 0) + 1;
            });

            this.propertyTypes.forEach(type => {
                type.count = typeCounts[type.name] || 0;
            });
        },

        initCharts() {
            this.initRevenueChart();
            this.initTypeChart();
        },

        initRevenueChart() {
            const ctx = this.$refs.revenueChart?.getContext('2d');
            if (!ctx) return;
            // ✅ Détruire l'ancien graphique s'il existe
            if (this.revenueChart) {
                this.revenueChart.destroy();
            }
            const revenueData = [
                { month: 'Jan', revenue: 980000, expenses: 320000 },
                { month: 'Fév', revenue: 1050000, expenses: 350000 },
                { month: 'Mar', revenue: 1150000, expenses: 380000 },
                { month: 'Avr', revenue: 1100000, expenses: 340000 },
                { month: 'Mai', revenue: 1250000, expenses: 400000 },
                { month: 'Jun', revenue: 1300000, expenses: 420000 }
            ];

            this.revenueChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: revenueData.map(d => d.month),
                    datasets: [
                        {
                            label: 'Revenus',
                            data: revenueData.map(d => d.revenue),
                            backgroundColor: '#198754'
                        },
                        {
                            label: 'Dépenses',
                            data: revenueData.map(d => d.expenses),
                            backgroundColor: '#dc3545'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        },

        initTypeChart() {
            const ctx = this.$refs.typeChart?.getContext('2d');
            if (!ctx) return;
            // ✅ Détruire l'ancien graphique s'il existe
            if (this.typeChart) {
                this.typeChart.destroy();
            }
            this.typeChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: this.propertyTypes.map(t => t.name),
                    datasets: [{
                        data: this.propertyTypes.map(t => t.count),
                        backgroundColor: this.propertyTypes.map(t => t.color)
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        },

        getStatusClass(status) {
            const classes = {
                'Occupé': 'bg-success',
                'Disponible': 'bg-primary',
                'En Maintenance': 'bg-warning'
            };
            return classes[status] || 'bg-secondary';
        },

        getStatusIcon(status) {
            const icons = {
                'Occupé': 'bi-check-circle',
                'Disponible': 'bi-clock',
                'En Maintenance': 'bi-exclamation-circle'
            };
            return icons[status] || 'bi-circle';
        },

        formatCurrency(value) {
            if (!value) return '—';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0
            }).format(value);
        },

        formatDate(date) {
            if (!date) return '—';
            return new Date(date).toLocaleDateString('fr-FR');
        },

        getImageUrl(fileId) {
            return `${this.$store.state.apiBaseUrl || ''}/fichier/download/${fileId}`;
        },

        handleImageError(event) {
            event.target.style.display = 'none';
        },

        viewDetails(property) {
            this.selectedProperty = property;
        },

        viewContract(property) {
            this.$router.push({
                name: 'contrat-details',
                params: { id: property.id }
            });
        },

        editProperty(property) {
            this.$router.push({
                name: 'edit-property',
                params: { id: property.id }
            });
        },

        async exportData() {
            try {
                const fileUrl = await this.$store.dispatch('contrats/exportContrats', 'xlsx');
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = `proprietes_${Date.now()}.xlsx`;
                link.click();
                URL.revokeObjectURL(fileUrl);
                this.$message.success('Export réussi');
            } catch (error) {
                console.error('Erreur export:', error);
                this.$message.error('Erreur lors de l\'export');
            }
        }
    }
};
</script>

<style scoped>
.avatar {
    width: 50px;
    height: 50px;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-placeholder {
    width: 50px;
    height: 50px;
}

.modal.show {
    display: block !important;
}

.table> :not(caption)>*>* {
    padding: 1rem 0.75rem;
}

.badge {
    font-weight: 500;
    padding: 0.35em 0.65em;
}

.card-body canvas {
    max-height: 250px;
    width: 100%;
}
</style>