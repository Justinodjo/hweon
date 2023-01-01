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
                                <h6 class="mb-0">Montant Total</h6>
                                <i class="bi bi-cash-stack text-info fs-4"></i>
                            </div>
                            <h2 class="text-info mb-2">{{ formatCurrency(stats.montantTotal) }}</h2>
                            <p class="mb-0">
                                <small class="text-muted">Commissions incluses</small>
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
                                                placeholder="Rechercher par référence, locataire..."
                                                v-model="searchTerm" @input="searchBaux" />
                                        </div>
                                    </div>

                                    <div class="col-md-3">
                                        <select class="form-select" v-model="filterStatus" @change="applyFilters">
                                            <option value="">Tous les statuts</option>
                                            <option value="ACTIF">Actifs</option>
                                            <option value="INACTIF">Inactifs</option>
                                            <option value="EN_ATTENTE">En attente</option>
                                        </select>
                                    </div>

                                    <div class="col-md-2">
                                        <select class="form-select" v-model="filterTypeContrat" @change="applyFilters">
                                            <option value="">Tous les types</option>
                                            <option value="MEUBLEE">Meublée</option>
                                            <option value="VIDE">Vide</option>
                                            <option value="COMMERCIAL">Commercial</option>
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
                                <a class="nav-link" :class="{ active: activeTab === 'en_attente' }" href="#"
                                    @click.prevent="changeTab('en_attente')">
                                    En attente ({{ stats.enAttente }})
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
                                                <th>Gestionnaire</th>
                                                <th>Biens</th>
                                                <th>Période</th>
                                                <th>Loyer</th>
                                                <th>Commissions</th>
                                                <th>Statut</th>
                                                <th class="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="contrat in paginatedBaux" :key="contrat.id">
                                                <td>
                                                    <strong class="text-primary">{{ contrat.referenceContrat ||
                                                        'N/A' }}</strong>
                                                    <br />
                                                    <small class="text-muted">{{
                                                        getTypeContratLabel(contrat.typeContrat)
                                                    }}</small>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <i class="bi bi-person me-2 text-muted"></i>
                                                        <div>
                                                            <div>{{ getFullName(contrat.userInfo) }}</div>
                                                            <small class="text-muted">{{ contrat.userInfo?.email ||
                                                                '' }}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div v-if="contrat.gestionnaire">
                                                        <div>{{ getFullName(contrat.gestionnaire) }}</div>
                                                        <small class="text-muted">{{ contrat.gestionnaire.numero ||
                                                            '' }}</small>
                                                    </div>
                                                    <small v-else class="text-muted">—</small>
                                                </td>
                                                <td>
                                                    <small>
                                                        {{ getBiensCount(contrat) }} bien(s)<br />
                                                        {{ getDetailsCount(contrat) }} détail(s)
                                                    </small>
                                                </td>
                                                <td>
                                                    <small>
                                                        {{ formatDate(contrat.dateDebut) }}<br />
                                                        au {{ formatDate(contrat.dateFin) }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <strong>{{ formatCurrency(contrat.loyerMensuel) }}</strong><br />
                                                    <small class="text-muted">
                                                        Total: {{ formatCurrency(contrat.prixTotal) }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <small>
                                                        <div>Système: {{ formatCurrency(contrat.commissionSysteme)
                                                        }}</div>
                                                        <div>Gestionnaire: {{
                                                            formatCurrency(contrat.commissionGestionnaire) }}</div>
                                                    </small>
                                                </td>
                                                <td>
                                                    <span class="badge mb-1" :class="getStatusClass(contrat.status)">
                                                        {{ getStatusLabel(contrat.status) }}
                                                    </span>
                                                    <br />
                                                    <span class="badge"
                                                        :class="getValidationClass(contrat.validationStatus)">
                                                        {{ getValidationLabel(contrat.validationStatus) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div class="d-flex justify-content-end gap-1">
                                                        <button class="btn btn-sm btn-light" @click="viewBail(contrat)"
                                                            title="Voir détails">
                                                            <i class="bi bi-eye"></i>
                                                        </button>
                                                        <!-- Bouton Valider (si EN_ATTENTE) -->
                                                        <button v-if="contrat.validationStatus === 'EN_ATTENTE'"
                                                            class="btn btn-sm btn-success"
                                                            @click="validateContrat(contrat)"
                                                            title="Valider le contrat">
                                                            <i class="bi bi-check-circle"></i>
                                                        </button>
                                                        <!-- Bouton Résilier (si ACTIF) -->
                                                        <button v-if="contrat.status === 'ACTIF'"
                                                            class="btn btn-sm btn-warning"
                                                            @click="openResiliationModal(contrat)"
                                                            title="Résilier le contrat">
                                                            <i class="bi bi-x-circle"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-light"
                                                            @click="viewDocuments(contrat)" title="Documents">
                                                            <i class="bi bi-file-earmark-text"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-light"
                                                            @click="viewPaiements(contrat)" title="Paiements">
                                                            <i class="bi bi-cash-stack"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-primary"
                                                            @click="editBail(contrat)" title="Modifier">
                                                            <i class="bi bi-pencil-square"></i>
                                                        </button>
                                                        <button class="btn btn-sm btn-danger"
                                                            @click="deleteBail(contrat.id)" title="Supprimer">
                                                            <i class="bi bi-trash3"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- Pagination -->
                                <nav v-if="totalPages > 1" class="mt-4" aria-label="Pagination">
                                    <ul class="pagination justify-content-center">
                                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                            <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                                                <i class="bi bi-chevron-left"></i>
                                            </a>
                                        </li>
                                        <li v-for="page in paginationRange" :key="page" class="page-item"
                                            :class="{ active: page === currentPage, disabled: page === '...' }">
                                            <a v-if="page !== '...'" class="page-link" href="#"
                                                @click.prevent="changePage(page)">
                                                {{ page }}
                                            </a>
                                            <span v-else class="page-link">...</span>
                                        </li>
                                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                            <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                                                <i class="bi bi-chevron-right"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </nav>

                                <div class="text-center text-muted small">
                                    Affichage de {{ startIndex }} à {{ endIndex }} sur {{ filteredBaux.length }} bail(s)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Modal Détails -->
        <div v-if="showDetailModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Détails du Bail - {{ selectedBail?.referenceContrat }}</h5>
                        <button type="button" class="btn-close" @click="showDetailModal = false"></button>
                    </div>
                    <div class="modal-body" v-if="selectedBail">
                        <!-- Informations générales -->
                        <h6 class="border-bottom pb-2 mb-3">Informations générales</h6>
                        <div class="row g-3 mb-4">
                            <div class="col-md-4">
                                <label class="form-label fw-bold">Référence</label>
                                <p>{{ selectedBail.referenceContrat || 'N/A' }}</p>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-bold">Type de contrat</label>
                                <p>{{ getTypeContratLabel(selectedBail.typeContrat) }}</p>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-bold">Statut</label>
                                <p>
                                    <span class="badge" :class="getStatusClass(selectedBail.status)">
                                        {{ getStatusLabel(selectedBail.status) }}
                                    </span>
                                    <span class="badge ms-2" :class="getValidationClass(selectedBail.validationStatus)">
                                        {{ getValidationLabel(selectedBail.validationStatus) }}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <!-- Parties -->
                        <h6 class="border-bottom pb-2 mb-3">Parties</h6>
                        <div class="row g-3 mb-4">
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Locataire</label>
                                <div v-if="selectedBail.userInfo">
                                    <p class="mb-1">{{ getFullName(selectedBail.userInfo) }}</p>
                                    <small class="text-muted">{{ selectedBail.userInfo.email }}</small><br />
                                    <small class="text-muted">{{ selectedBail.userInfo.numero }}</small>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Gestionnaire</label>
                                <div v-if="selectedBail.gestionnaire">
                                    <p class="mb-1">{{ getFullName(selectedBail.gestionnaire) }}</p>
                                    <small class="text-muted">{{ selectedBail.gestionnaire.email }}</small><br />
                                    <small class="text-muted">{{ selectedBail.gestionnaire.numero }}</small>
                                </div>
                                <p v-else class="text-muted">—</p>
                            </div>
                        </div>

                        <!-- Financier -->
                        <h6 class="border-bottom pb-2 mb-3">Informations financières</h6>
                        <div class="row g-3 mb-4">
                            <div class="col-md-3">
                                <label class="form-label fw-bold">Loyer mensuel</label>
                                <p class="text-success fs-5">{{ formatCurrency(selectedBail.loyerMensuel) }}</p>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label fw-bold">Prix total</label>
                                <p class="text-info fs-5">{{ formatCurrency(selectedBail.prixTotal) }}</p>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label fw-bold">Avance</label>
                                <p class="text-warning fs-5">{{ formatCurrency(selectedBail.avance) }}</p>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label fw-bold">Frais annulation</label>
                                <p>{{ formatCurrency(selectedBail.fraisAnnulation) }}</p>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-bold">Commission système</label>
                                <p>{{ formatCurrency(selectedBail.commissionSysteme) }}</p>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-bold">Commission gestionnaire</label>
                                <p>{{ formatCurrency(selectedBail.commissionGestionnaire) }}</p>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-bold">Montant restant</label>
                                <p class="text-danger">{{ formatCurrency(selectedBail.montantRestant) }}</p>
                            </div>
                        </div>

                        <!-- Période -->
                        <h6 class="border-bottom pb-2 mb-3">Période du bail</h6>
                        <div class="row g-3 mb-4">
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Date début</label>
                                <p>{{ formatDate(selectedBail.dateDebut) }}</p>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold">Date fin</label>
                                <p>{{ formatDate(selectedBail.dateFin) }}</p>
                            </div>
                        </div>

                        <!-- Biens -->
                        <h6 class="border-bottom pb-2 mb-3">Biens immobiliers ({{
                            selectedBail.biensImmobiliers?.length || 0 }})</h6>
                        <div v-if="selectedBail.biensImmobiliers?.length" class="mb-4">
                            <div v-for="bien in selectedBail.biensImmobiliers" :key="bien.id" class="card mb-2">
                                <div class="card-body">
                                    <h6>{{ bien.nom }}</h6>
                                    <p class="mb-1"><i class="bi bi-geo-alt me-1"></i>{{ bien.adresse }}</p>
                                    <p class="mb-0">
                                        <span class="badge bg-info">{{ bien.typeBiensImmobiliere?.nomTypeBiensImmo
                                        }}</span>
                                        <span class="ms-2">{{ formatCurrency(bien.prix) }}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Documents -->
                        <h6 class="border-bottom pb-2 mb-3">Documents ({{ selectedBail.documents?.length || 0 }})</h6>
                        <div v-if="selectedBail.documents?.length" class="mb-4">
                            <div class="list-group">
                                <div v-for="doc in selectedBail.documents" :key="doc.id"
                                    class="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <i class="bi bi-file-earmark-pdf me-2"></i>
                                        {{ getDocumentTypeLabel(doc.typeDocument) }}
                                    </div>
                                    <button class="btn btn-sm btn-outline-primary" @click="downloadDocument(doc)">
                                        <i class="bi bi-download"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Paiements -->
                        <h6 class="border-bottom pb-2 mb-3">Paiements distribués ({{
                            selectedBail.paiementsDistribues?.length || 0 }})</h6>
                        <div v-if="selectedBail.paiementsDistribues?.length" class="mb-4">
                            <div class="table-responsive">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Montant brut</th>
                                            <th>Commission système</th>
                                            <th>Commission gestionnaire</th>
                                            <th>Net propriétaire</th>
                                            <th>Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="paiement in selectedBail.paiementsDistribues" :key="paiement.id">
                                            <td>{{ formatDate(paiement.dateCreation) }}</td>
                                            <td>{{ formatCurrency(paiement.montantBrut) }}</td>
                                            <td>{{ formatCurrency(paiement.commissionSysteme) }}</td>
                                            <td>{{ formatCurrency(paiement.commissionGestionnaire) }}</td>
                                            <td>{{ formatCurrency(paiement.montantNetProprietaire) }}</td>
                                            <td>
                                                <span class="badge"
                                                    :class="paiement.paye ? 'bg-success' : 'bg-warning'">
                                                    {{ paiement.paye ? 'Payé' : 'En attente' }}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
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
        const showDetailModal = ref(false);
        const selectedBail = ref(null);
        const searchTerm = ref('');
        const filterStatus = ref('');
        const filterTypeContrat = ref('');

        // Pagination
        const currentPage = ref(1);
        const perPage = ref(10);

        const baux = computed(() => store.state.contrats?.all || []);

        // Helper functions
        const getFullName = (user) => {
            if (!user) return '—';
            return `${user.name || ''} ${user.secondName || ''}`.trim() || '—';
        };

        const getBiensCount = (contrat) => {
            return contrat.biensImmobiliers?.length || 0;
        };

        const getDetailsCount = (contrat) => {
            return contrat.detailsBiensImmobiliers?.length || 0;
        };

        const getTypeContratLabel = (type) => {
            const labels = {
                'MEUBLEE': 'Meublée',
                'VIDE': 'Vide',
                'COMMERCIAL': 'Commercial',
                'PROFESSIONNEL': 'Professionnel'
            };
            return labels[type] || type || '—';
        };

        const getDocumentTypeLabel = (type) => {
            const labels = {
                'CONTRAT_LOCATION': 'Contrat de location',
                'ETAT_LIEUX_ENTREE': 'État des lieux entrée',
                'ETAT_LIEUX_SORTIE': 'État des lieux sortie',
                'PIECE_IDENTITE': 'Pièce d\'identité',
                'JUSTIFICATIF_DOMICILE': 'Justificatif de domicile'
            };
            return labels[type] || type || 'Document';
        };

        // Computed
        const stats = computed(() => {
            const contracts = baux.value || [];
            return {
                total: contracts.length,
                actifs: contracts.filter(c => c.status === 'ACTIF').length,
                expires: contracts.filter(c => {
                    const dateFin = new Date(c.dateFin);
                    return dateFin < new Date();
                }).length,
                enAttente: contracts.filter(c => c.validationStatus === 'EN_ATTENTE').length,
                revenuMensuel: contracts
                    .filter(c => c.status === 'ACTIF')
                    .reduce((sum, c) => sum + Number(c.loyerMensuel || 0), 0),
                montantTotal: contracts.reduce((sum, c) => sum + Number(c.prixTotal || 0), 0)
            };
        });

        const filteredBaux = computed(() => {
            let result = baux.value || [];

            // Recherche
            if (searchTerm.value) {
                const q = searchTerm.value.toLowerCase();
                result = result.filter(c =>
                    (c.referenceContrat || '').toLowerCase().includes(q) ||
                    getFullName(c.userInfo).toLowerCase().includes(q) ||
                    getFullName(c.gestionnaire).toLowerCase().includes(q)
                );
            }

            // Filtre statut
            if (filterStatus.value) {
                result = result.filter(c => c.status === filterStatus.value);
            }

            // Filtre type
            if (filterTypeContrat.value) {
                result = result.filter(c => c.typeContrat === filterTypeContrat.value);
            }

            // Filtre onglet
            if (activeTab.value === 'actifs') {
                result = result.filter(c => c.status === 'ACTIF');
            } else if (activeTab.value === 'expires') {
                result = result.filter(c => new Date(c.dateFin) < new Date());
            } else if (activeTab.value === 'en_attente') {
                result = result.filter(c => c.validationStatus === 'EN_ATTENTE');
            }

            return result;
        });

        // Pagination
        const totalPages = computed(() => Math.ceil(filteredBaux.value.length / perPage.value));

        const paginatedBaux = computed(() => {
            const start = (currentPage.value - 1) * perPage.value;
            const end = start + perPage.value;
            return filteredBaux.value.slice(start, end);
        });

        const paginationRange = computed(() => {
            const total = totalPages.value;
            const current = currentPage.value;
            const delta = 2;
            const range = [];
            const rangeWithDots = [];
            let l;

            for (let i = 1; i <= total; i++) {
                if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
                    range.push(i);
                }
            }

            for (let i of range) {
                if (l) {
                    if (i - l === 2) {
                        rangeWithDots.push(l + 1);
                    } else if (i - l !== 1) {
                        rangeWithDots.push('...');
                    }
                }
                rangeWithDots.push(i);
                l = i;
            }

            return rangeWithDots;
        });

        const startIndex = computed(() => (currentPage.value - 1) * perPage.value + 1);
        const endIndex = computed(() => Math.min(currentPage.value * perPage.value, filteredBaux.value.length));

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
                'ACTIF': 'bg-success bg-opacity-10 text-success',
                'INACTIF': 'bg-danger bg-opacity-10 text-danger',
                'EN_ATTENTE': 'bg-warning bg-opacity-10 text-warning',
            };
            return classes[status] || 'bg-secondary bg-opacity-10 text-secondary';
        };

        const getStatusLabel = (status) => {
            const labels = {
                'ACTIF': 'Actif',
                'INACTIF': 'Inactif',
                'EN_ATTENTE': 'En attente',
            };
            return labels[status] || status || 'Inconnu';
        };

        const getValidationClass = (status) => {
            const classes = {
                'EN_ATTENTE': 'bg-warning bg-opacity-10 text-warning',
                'VALIDE': 'bg-success bg-opacity-10 text-success',
                'REJETE': 'bg-danger bg-opacity-10 text-danger',
            };
            return classes[status] || 'bg-secondary bg-opacity-10 text-secondary';
        };

        const getValidationLabel = (status) => {
            const labels = {
                'EN_ATTENTE': 'En attente',
                'VALIDE': 'Validé',
                'REJETE': 'Rejeté',
            };
            return labels[status] || status || '—';
        };

        const loadBaux = async () => {
            loading.value = true;
            try {
                await store.dispatch('contrats/getAll');
            } catch (error) {
                console.error('Erreur chargement baux:', error);
                ElMessage.error('Erreur lors du chargement des baux');
            } finally {
                loading.value = false;
            }
        };

        const searchBaux = () => {
            currentPage.value = 1;
        };

        const applyFilters = () => {
            currentPage.value = 1;
        };

        const changeTab = (tab) => {
            activeTab.value = tab;
            currentPage.value = 1;
        };

        const changePage = (page) => {
            if (page >= 1 && page <= totalPages.value) {
                currentPage.value = page;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        const openCreateModal = () => {
            ElMessage.info('Fonctionnalité de création en cours de développement');
        };

        const editBail = (bail) => {
            ElMessage.info('Fonctionnalité de modification en cours de développement');
        };

        const viewBail = (bail) => {
            selectedBail.value = bail;
            showDetailModal.value = true;
        };

        const viewDocuments = (bail) => {
            if (!bail.documents || bail.documents.length === 0) {
                ElMessage.warning('Aucun document disponible pour ce bail');
                return;
            }
            selectedBail.value = bail;
            showDetailModal.value = true;
        };

        const viewPaiements = (bail) => {
            if (!bail.paiementsDistribues || bail.paiementsDistribues.length === 0) {
                ElMessage.warning('Aucun paiement enregistré pour ce bail');
                return;
            }
            selectedBail.value = bail;
            showDetailModal.value = true;
        };

        const deleteBail = async (id) => {
            if (!id) {
                console.warn("ID de contrat invalide, suppression annulée");
                return;
            }
            try {
                await ElMessageBox.confirm(
                    'Voulez-vous vraiment supprimer ce bail ? Cette action est irréversible.',
                    'Confirmation',
                    {
                        confirmButtonText: 'Oui, supprimer',
                        cancelButtonText: 'Annuler',
                        type: 'warning',
                    }
                );

                const loader = store.state.loading?.show?.();
                try {
                    await store.dispatch('contrats/delete', id);
                    ElMessage.success('Bail supprimé avec succès');
                    await loadBaux();
                } finally {
                    loader?.hide?.();
                }
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur suppression:', error);
                    ElMessage.error('Erreur lors de la suppression du bail');
                }
            }
        };

        const downloadBail = async (bail) => {
            try {
                ElMessage.info('Téléchargement en cours...');
                await store.dispatch('contrats/downloadPdf', bail.id);
            } catch (error) {
                console.error('Erreur téléchargement:', error);
                ElMessage.error('Erreur lors du téléchargement');
            }
        };

        const downloadDocument = async (document) => {
            try {
                if (document.fichier?.id) {
                    ElMessage.info('Téléchargement en cours...');
                    await store.dispatch('fichiers/download', document.fichier.id);
                } else {
                    ElMessage.warning('Aucun fichier disponible pour ce document');
                }
            } catch (error) {
                console.error('Erreur téléchargement document:', error);
                ElMessage.error('Erreur lors du téléchargement du document');
            }
        };

        // Lifecycle
        onMounted(async () => {
            await loadBaux();
        });

        return {
            loading,
            activeTab,
            showDetailModal,
            selectedBail,
            searchTerm,
            filterStatus,
            filterTypeContrat,
            currentPage,
            perPage,
            baux,
            stats,
            filteredBaux,
            paginatedBaux,
            totalPages,
            paginationRange,
            startIndex,
            endIndex,
            getFullName,
            getBiensCount,
            getDetailsCount,
            getTypeContratLabel,
            getDocumentTypeLabel,
            formatCurrency,
            formatDate,
            getStatusClass,
            getStatusLabel,
            getValidationClass,
            getValidationLabel,
            searchBaux,
            applyFilters,
            changeTab,
            changePage,
            openCreateModal,
            editBail,
            viewBail,
            viewDocuments,
            viewPaiements,
            deleteBail,
            downloadBail,
            downloadDocument,
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
    font-size: 0.75rem;
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

.modal-xl {
    max-width: 1140px;
}

.list-group-item {
    border-left: 3px solid transparent;
    transition: all 0.3s;
}

.list-group-item:hover {
    border-left-color: #0d6efd;
    background-color: #f8f9fa;
}
</style>