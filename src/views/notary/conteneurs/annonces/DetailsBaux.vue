<template>
    <main>
        <section class="pt-0">
            <div class="container vstack gap-4">
                <!-- En-tête -->
                <div class="row">
                    <div class="col-12">
                        <h1 class="fs-4 mb-0">
                            <i class="bi bi-file-text fa-fw me-1"></i>Gestion des Baux
                        </h1>
                    </div>
                </div>

                <!-- Statistiques -->
                <div class="row g-4">
                    <div class="col-md-6 col-xl-3">
                        <div class="card card-body border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="mb-0">Total Baux</h6>
                                <i class="bi bi-file-text text-primary fs-4"></i>
                            </div>
                            <h2 class="text-primary mb-2">{{ stats.total }}</h2>
                            <p class="mb-0">
                                <small class="text-muted">{{ stats.actifs }} actifs</small>
                            </p>
                        </div>
                    </div>

                    <div class="col-md-6 col-xl-3">
                        <div class="card card-body border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="mb-0">Revenus Mensuels</h6>
                                <i class="bi bi-currency-dollar text-success fs-4"></i>
                            </div>
                            <h2 class="text-success mb-2">{{ formatCurrency(stats.revenuMensuel) }}</h2>
                            <p class="mb-0">
                                <small class="text-muted">Loyers actifs</small>
                            </p>
                        </div>
                    </div>

                    <div class="col-md-6 col-xl-3">
                        <div class="card card-body border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="mb-0">Baux Expirés</h6>
                                <i class="bi bi-exclamation-circle text-danger fs-4"></i>
                            </div>
                            <h2 class="text-danger mb-2">{{ stats.expires }}</h2>
                            <p class="mb-0">
                                <small class="text-muted">À renouveler</small>
                            </p>
                        </div>
                    </div>

                    <div class="col-md-6 col-xl-3">
                        <div class="card card-body border p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="mb-0">Paiements en Retard</h6>
                                <i class="bi bi-calendar-x text-warning fs-4"></i>
                            </div>
                            <h2 class="text-warning mb-2">{{ stats.retards }}</h2>
                            <p class="mb-0">
                                <small class="text-muted">À relancer</small>
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Filtres et actions -->
                <div class="row">
                    <div class="col-12">
                        <div class="card border">
                            <div class="card-body">
                                <div class="row g-3 align-items-center">
                                    <div class="col-md-4">
                                        <div class="input-group">
                                            <span class="input-group-text bg-white">
                                                <i class="bi bi-search"></i>
                                            </span>
                                            <input type="text" class="form-control"
                                                placeholder="Rechercher un bail, locataire..." v-model="searchTerm"
                                                @input="searchBaux" />
                                        </div>
                                    </div>

                                    <div class="col-md-3">
                                        <select class="form-select" v-model="filterStatus" @change="applyFilters">
                                            <option value="">Tous les statuts</option>
                                            <option value="actif">Actifs</option>
                                            <option value="expire">Expirés</option>
                                            <option value="resilie">Résiliés</option>
                                            <option value="en_attente">En attente</option>
                                        </select>
                                    </div>

                                    <div class="col-md-2">
                                        <select class="form-select" v-model="sortKey" @change="sortBaux">
                                            <option value="">Trier par...</option>
                                            <option value="reference">Référence</option>
                                            <option value="locataire">Locataire</option>
                                            <option value="dateDebut">Date début</option>
                                            <option value="loyerMensuel">Loyer</option>
                                        </select>
                                    </div>

                                    <div class="col-md-3 text-end">
                                        <button class="btn btn-primary" @click="openCreateModal">
                                            <i class="bi bi-plus-lg me-1"></i>
                                            Nouveau Bail
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Onglets -->
                <div class="row">
                    <div class="col-12">
                        <ul class="nav nav-tabs">
                            <li class="nav-item">
                                <a class="nav-link" :class="{ active: activeTab === 'tous' }" href="#"
                                    @click.prevent="changeTab('tous')">
                                    Tous les baux ({{ baux.length }})
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" :class="{ active: activeTab === 'actifs' }" href="#"
                                    @click.prevent="changeTab('actifs')">
                                    Actifs ({{ stats.actifs }})
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" :class="{ active: activeTab === 'expires' }" href="#"
                                    @click.prevent="changeTab('expires')">
                                    Expirés ({{ stats.expires }})
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" :class="{ active: activeTab === 'retards' }" href="#"
                                    @click.prevent="changeTab('retards')">
                                    En retard ({{ stats.retards }})
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Liste des baux -->
                <div class="row">
                    <div class="col-12">
                        <div class="card border">
                            <div class="card-header border-bottom">
                                <h5 class="card-header-title">
                                    Liste des baux
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ filteredBaux.length }} baux
                                    </span>
                                </h5>
                            </div>
                            <div class="card-body">
                                <div v-if="loading" class="text-center py-5">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Chargement...</span>
                                    </div>
                                </div>

                                <div v-else-if="filteredBaux.length === 0" class="text-center py-5">
                                    <i class="bi bi-file-text text-muted" style="font-size: 3rem;"></i>
                                    <p class="text-muted mt-3">Aucun bail trouvé</p>
                                </div>

                                <div v-else class="table-responsive">
                                    <table class="table table-hover align-middle">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Référence</th>
                                                <th>Locataire</th>
                                                <th>Bien</th>
                                                <th>Période</th>
                                                <th>Loyer</th>
                                                <th>Statut</th>
                                                <th>Paiement</th>
                                                <th class="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="bail in filteredBaux" :key="bail.id">
                                                <td>
                                                    <strong class="text-primary">{{ bail.referenceContrat }}</strong>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <i class="bi bi-person me-2 text-muted"></i>
                                                        {{ bail.userInfo?.name + ' ' + bail.userInfo?.secondName }}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <i class="bi bi-house me-2 text-muted"></i>
                                                        <small>{{ bail.biensImmobiliers || bail.detailsBiensImmobiliers
                                                            }}</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <small>
                                                        {{ formatDate(bail.dateDebut) }}<br />
                                                        au {{ formatDate(bail.dateFin) }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <strong>{{ formatCurrency(bail.loyerMensuel) }}</strong><br />
                                                    <small class="text-muted">
                                                        Dépôt: {{ formatCurrency(bail.depot) }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getStatusClass(bail.status)">
                                                        {{ getStatusLabel(bail.status) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getPaiementClass(bail.paiementStatus)">
                                                        <i class="bi" :class="getPaiementIcon(bail.paiementStatus)"></i>
                                                        {{ getPaiementLabel(bail.paiementStatus) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div class="d-flex justify-content-end gap-1">
                                                        <button class="btn btn-sm btn-light" @click="viewBail(bail)"
                                                            title="Voir détails">
                                                            <i class="bi bi-eye"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-light" @click="downloadBail(bail)"
                                                            title="Télécharger">
                                                            <i class="bi bi-download"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-primary" @click="editBail(bail)"
                                                            title="Modifier">
                                                            <i class="bi bi-pencil-square"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-danger"
                                                            @click="deleteBail(bail.id)" title="Supprimer">
                                                            <i class="bi bi-trash3"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Modal Création/Edition -->
        <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ modalType === 'create' ? 'Nouveau Bail' : 'Modifier le Bail' }}
                        </h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-12">
                                <label class="form-label">Référence *</label>
                                <input type="text" class="form-control" v-model="bailForm.reference" />
                            </div>
                            <div class="col-12">
                                <label class="form-label">Locataire *</label>
                                <select class="form-select" v-model="bailForm.locataireId">
                                    <option value="">Sélectionner un locataire</option>
                                    <option v-for="loc in locataires" :key="loc.id" :value="loc.id">
                                        {{ loc.nom }}
                                    </option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Bien immobilier *</label>
                                <select class="form-select" v-model="bailForm.bienId">
                                    <option value="">Sélectionner un bien</option>
                                    <option v-for="bien in biensDisponibles" :key="bien.id" :value="bien.id">
                                        {{ bien.nom }}
                                    </option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date début *</label>
                                <input type="date" class="form-control" v-model="bailForm.dateDebut" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date fin *</label>
                                <input type="date" class="form-control" v-model="bailForm.dateFin" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Loyer mensuel (XOF) *</label>
                                <input type="number" class="form-control" v-model.number="bailForm.loyerMensuel"
                                    placeholder="500000" />
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Dépôt de garantie (XOF) *</label>
                                <input type="number" class="form-control" v-model.number="bailForm.depot"
                                    placeholder="1000000" />
                            </div>
                            <div class="col-12">
                                <label class="form-label">Conditions particulières</label>
                                <textarea class="form-control" rows="3" v-model="bailForm.conditions"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="closeModal">Annuler</button>
                        <button class="btn btn-primary" @click="saveBail">Enregistrer</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Détails -->
        <div v-if="showDetailModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Détails du Bail</h5>
                        <button type="button" class="btn-close" @click="showDetailModal = false"></button>
                    </div>
                    <div class="modal-body" v-if="selectedBail">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Référence</label>
                                <p>{{ selectedBail.reference }}</p>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Statut</label>
                                <p>
                                    <span class="badge" :class="getStatusClass(selectedBail.status)">
                                        {{ getStatusLabel(selectedBail.status) }}
                                    </span>
                                </p>
                            </div>
                            <div class="col-12">
                                <label class="form-label fw-bold">Locataire</label>
                                <p>{{ selectedBail.locataire }}</p>
                            </div>
                            <div class="col-12">
                                <label class="form-label fw-bold">Bien</label>
                                <p>{{ selectedBail.bien }}</p>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Date début</label>
                                <p>{{ formatDate(selectedBail.dateDebut) }}</p>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Date fin</label>
                                <p>{{ formatDate(selectedBail.dateFin) }}</p>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Loyer mensuel</label>
                                <p class="text-success fs-5">{{ formatCurrency(selectedBail.loyerMensuel) }}</p>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Dépôt de garantie</label>
                                <p class="text-info fs-5">{{ formatCurrency(selectedBail.depot) }}</p>
                            </div>
                            <div class="col-12" v-if="selectedBail.conditions">
                                <label class="form-label fw-bold">Conditions particulières</label>
                                <p>{{ selectedBail.conditions }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="showDetailModal = false">Fermer</button>
                        <button class="btn btn-primary" @click="downloadBail(selectedBail)">
                            <i class="bi bi-download me-1"></i>
                            Télécharger le bail
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
    name: 'GestionBaux',
    setup() {
        const store = useStore();
        const loading = ref(false);
        const activeTab = ref('tous');
        const showModal = ref(false);
        const showDetailModal = ref(false);
        const modalType = ref('create');
        const selectedBail = ref(null);
        const searchTerm = ref('');
        const filterStatus = ref('');
        const sortKey = ref('');

        const baux = computed(() => store.state.contrats.all || []);
        const locataires = ref([]);
        const overrideBaux = ref(null);
        const biensDisponibles = ref([]);
        const normalizeStatus = (s) => {
            if (s == null) return 'inconnu';
            if (typeof s === 'boolean') return s ? 'actif' : 'resilie';
            const str = String(s).toLowerCase();
            if (str.includes('act') || str.includes('en_cours') || str.includes('encours') || str.includes('active')) return 'actif';
            if (str.includes('expir')) return 'expire';
            if (str.includes('resil')) return 'resilie';
            return str;
        };
        const bailForm = ref({
            id: null,
            reference: '',
            locataireId: '',
            bienId: '',
            dateDebut: '',
            dateFin: '',
            loyerMensuel: 0,
            depot: 0,
            conditions: '',
        });

        // Computed
        const stats = computed(() => {
            const source = overrideBaux.value ?? baux.value;
            return {
                total: (source || []).length,
                actifs: (source || []).filter((b) => normalizeStatus(b.status) === 'actif').length,
                expires: (source || []).filter((b) => normalizeStatus(b.status) === 'expire').length,
                retards: (source || []).filter((b) => (b.paiementStatus || '').toLowerCase() === 'retard').length,
                revenuMensuel: (source || [])
                    .filter((b) => normalizeStatus(b.status) === 'actif')
                    .reduce((sum, b) => sum + Number(b.loyerMensuel || 0), 0),
            };
        });

        const filteredBaux = computed(() => {
            const source = overrideBaux.value ?? baux.value;
            return (source || []).filter((bail) => {
                const q = searchTerm.value.toLowerCase();
                const matchSearch =
                    (bail.locataire || '').toString().toLowerCase().includes(q) ||
                    (bail.bien || '').toString().toLowerCase().includes(q) ||
                    (bail.reference || '').toString().toLowerCase().includes(q);

                const matchStatus = !filterStatus.value || normalizeStatus(bail.status) === filterStatus.value;

                const matchTab =
                    activeTab.value === 'tous' ||
                    (activeTab.value === 'actifs' && normalizeStatus(bail.status) === 'actif') ||
                    (activeTab.value === 'expires' && normalizeStatus(bail.status) === 'expire') ||
                    (activeTab.value === 'retards' && (bail.paiementStatus || '').toLowerCase() === 'retard');

                return matchSearch && matchStatus && matchTab;
            });
        });

        // Methods
        const formatCurrency = (amount) => {
            if (amount == null || amount === '') return '—';
            const numValue = Number(amount);
            if (isNaN(numValue)) return '—';

            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0,
            }).format(numValue);
        };

        const formatDate = (dateString) => {
            if (!dateString) return '—';
            return new Date(dateString).toLocaleDateString('fr-FR');
        };

        const getStatusClass = (status) => {
            const classes = {
                actif: 'bg-success bg-opacity-10 text-success',
                expire: 'bg-danger bg-opacity-10 text-danger',
                resilie: 'bg-warning bg-opacity-10 text-warning',
                en_attente: 'bg-info bg-opacity-10 text-info',
            };
            return classes[status] || 'bg-secondary bg-opacity-10 text-secondary';
        };

        const getStatusLabel = (status) => {
            const labels = {
                actif: 'Actif',
                expire: 'Expiré',
                resilie: 'Résilié',
                en_attente: 'En attente',
            };
            return labels[status] || 'Inconnu';
        };

        const getPaiementClass = (status) => {
            const classes = {
                a_jour: 'bg-success bg-opacity-10 text-success',
                retard: 'bg-danger bg-opacity-10 text-danger',
                partiel: 'bg-warning bg-opacity-10 text-warning',
            };
            return classes[status] || 'bg-secondary bg-opacity-10 text-secondary';
        };

        const getPaiementLabel = (status) => {
            const labels = {
                a_jour: 'À jour',
                retard: 'En retard',
                partiel: 'Partiel',
            };
            return labels[status] || 'Inconnu';
        };

        const getPaiementIcon = (status) => {
            const icons = {
                a_jour: 'bi-check-circle-fill',
                retard: 'bi-exclamation-circle-fill',
                partiel: 'bi-exclamation-triangle-fill',
            };
            return icons[status] || 'bi-question-circle-fill';
        };

        const loadBaux = async () => {
            loading.value = true;
            try {
                // l'action doit remplir state.contrats.all (et peut retourner les données)
                const response = await store.dispatch('contrats/getAll');                // si l'action ne retourne rien, les composants lisent state.contrats.all via "baux"
                overrideBaux.value = null;
                if (!response && (!store.state.contrats.all || !store.state.contrats.all.length)) {
                    ElMessage.warning('Aucun bail trouvé');
                }
            } catch (error) {
                console.error('Erreur lors du chargement des baux:', error);
                ElMessage.error('Erreur lors du chargement des baux');
            } finally {
                loading.value = false;
            }
        };

        const loadLocataires = async () => {
            try {
                const response = await store.dispatch('locataires/getAll');
                locataires.value = response || [];
            } catch (error) {
                console.error('Erreur lors du chargement des locataires:', error);
            }
        };

        const loadBiensDisponibles = async () => {
            try {
                const response = await store.dispatch('biensImmobiliers/getDisponibles');
                biensDisponibles.value = response || [];
            } catch (error) {
                console.error('Erreur lors du chargement des biens:', error);
            }
        };

        const searchBaux = async () => {
            if (searchTerm.value.length > 2) {
                loading.value = true;
                try {
                    const response = await store.dispatch('baux/search', {
                        texte: searchTerm.value,
                    });
                    baux.value = response || [];
                    overrideBaux.value = response || [];
                } catch (error) {
                    console.error('Erreur lors de la recherche:', error);
                    ElMessage.error('Erreur lors de la recherche');
                } finally {
                    loading.value = false;
                }
            } else if (searchTerm.value.length === 0) {
                overrideBaux.value = null;
                await loadBaux();
            }
        };

        const applyFilters = () => {
            // Les filtres sont appliqués automatiquement via le computed filteredBaux
        };

        const sortBaux = () => {
            if (!sortKey.value) return;

            baux.value.sort((a, b) => {
                let valA = a[sortKey.value];
                let valB = b[sortKey.value];

                if (sortKey.value === 'dateDebut' || sortKey.value === 'dateFin') {
                    valA = new Date(valA).getTime();
                    valB = new Date(valB).getTime();
                }

                if (typeof valA === 'string') {
                    return valA.localeCompare(valB);
                }

                return valA - valB;
            });
        };

        const changeTab = (tab) => {
            activeTab.value = tab;
        };

        const openCreateModal = () => {
            modalType.value = 'create';
            bailForm.value = {
                id: null,
                reference: '',
                locataireId: '',
                bienId: '',
                dateDebut: '',
                dateFin: '',
                loyerMensuel: 0,
                depot: 0,
                conditions: '',
            };
            showModal.value = true;
        };

        const editBail = (bail) => {
            modalType.value = 'edit';
            bailForm.value = { ...bail };
            showModal.value = true;
        };

        const viewBail = (bail) => {
            selectedBail.value = bail;
            showDetailModal.value = true;
        };

        const closeModal = () => {
            showModal.value = false;
            bailForm.value = {
                id: null,
                reference: '',
                locataireId: '',
                bienId: '',
                dateDebut: '',
                dateFin: '',
                loyerMensuel: 0,
                depot: 0,
                conditions: '',
            };
        };

        const saveBail = async () => {
            try {
                if (modalType.value === 'create') {
                    await store.dispatch('baux/create', bailForm.value);
                    ElMessage.success('Bail créé avec succès !');
                } else {
                    await store.dispatch('baux/update', bailForm.value);
                    ElMessage.success('Bail mis à jour avec succès !');
                }
                closeModal();
                await loadBaux();
            } catch (error) {
                console.error('Erreur lors de la sauvegarde:', error);
                ElMessage.error('Erreur lors de la sauvegarde du bail');
            }
        };

        const deleteBail = async (id) => {
            try {
                await ElMessageBox.confirm(
                    'Voulez-vous vraiment supprimer ce bail ?',
                    'Confirmation',
                    {
                        confirmButtonText: 'Oui',
                        cancelButtonText: 'Annuler',
                        type: 'warning',
                    }
                );
                await store.dispatch('baux/delete', id);
                ElMessage.success('Bail supprimé avec succès !');
                await loadBaux();
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur lors de la suppression:', error);
                    ElMessage.error('Erreur lors de la suppression du bail');
                }
            }
        };

        const downloadBail = async (bail) => {
            try {
                await store.dispatch('baux/download', bail.id);
                ElMessage.success('Téléchargement du bail en cours...');
            } catch (error) {
                console.error('Erreur lors du téléchargement:', error);
                ElMessage.error('Erreur lors du téléchargement du bail');
            }
        };

        // Lifecycle
        onMounted(async () => {
            await Promise.all([loadBaux(), loadLocataires(), loadBiensDisponibles()]);
        });

        return {
            loading,
            activeTab,
            showModal,
            showDetailModal,
            modalType,
            selectedBail,
            searchTerm,
            filterStatus,
            sortKey,
            baux,
            locataires,
            biensDisponibles,
            bailForm,
            stats,
            filteredBaux,
            formatCurrency,
            formatDate,
            getStatusClass,
            getStatusLabel,
            getPaiementClass,
            getPaiementLabel,
            getPaiementIcon,
            searchBaux,
            applyFilters,
            sortBaux,
            changeTab,
            openCreateModal,
            editBail,
            viewBail,
            closeModal,
            saveBail,
            deleteBail,
            downloadBail,
        };
    },
};
</script>

<style scoped>
.table th,
.table td {
    vertical-align: middle;
}

.badge {
    padding: 0.35em 0.65em;
}

.modal.show {
    display: block;
}

.btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
}

.card-body {
    padding: 1.5rem;
}

.nav-tabs .nav-link {
    color: #6c757d;
}

.nav-tabs .nav-link.active {
    color: #0d6efd;
    font-weight: 500;
}

.input-group-text {
    border-right: 0;
}

.input-group .form-control {
    border-left: 0;
}

.input-group .form-control:focus {
    box-shadow: none;
    border-color: #dee2e6;
}

.spinner-border {
    width: 3rem;
    height: 3rem;
}
</style>