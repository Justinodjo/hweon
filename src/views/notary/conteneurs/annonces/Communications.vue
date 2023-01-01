<template>
    <div class="page-content pt-0 bloc">
        <div class="page-content-wrapper vstack container gap-4">

            <!-- En-tête -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-sm-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-2">
                                <i class="bi bi-chat-dots me-2"></i>Communications
                            </h1>
                            <p class="text-muted mb-0">Gestion des emails, SMS et notifications</p>
                        </div>
                        <div class="d-flex gap-2 mt-3 mt-sm-0">
                            <button @click="showComposeModal = true" class="btn btn-primary">
                                <i class="bi bi-plus-circle me-1"></i>Nouveau Message
                            </button>
                            <button @click="rafraichir" class="btn btn-outline-primary">
                                <i class="bi bi-arrow-clockwise"></i>
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
                <!-- KPIs -->
                <div class="row g-4 mb-4">
                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Total Envoyés</span>
                                    <h3 class="mb-0 mt-2 text-primary">{{ stats.total }}</h3>
                                    <small class="text-muted">
                                        <i class="bi bi-send me-1"></i>Ce mois
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-primary bg-opacity-10 text-primary">
                                    <i class="bi bi-send fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">Emails</span>
                                    <h3 class="mb-0 mt-2 text-success">{{ stats.emails }}</h3>
                                    <small class="text-success">
                                        <i class="bi bi-envelope me-1"></i>Envoyés
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-success bg-opacity-10 text-success">
                                    <i class="bi bi-envelope fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">SMS</span>
                                    <h3 class="mb-0 mt-2 text-info">{{ stats.sms }}</h3>
                                    <small class="text-muted">
                                        <i class="bi bi-phone me-1"></i>Envoyés
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-info bg-opacity-10 text-info">
                                    <i class="bi bi-phone fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-6 col-xl-3">
                        <div class="card card-body shadow-sm h-100">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted small">En Attente</span>
                                    <h3 class="mb-0 mt-2 text-warning">{{ stats.enAttente }}</h3>
                                    <small class="text-warning">
                                        <i class="bi bi-clock me-1"></i>Non envoyés
                                    </small>
                                </div>
                                <div class="icon-lg rounded-circle bg-warning bg-opacity-10 text-warning">
                                    <i class="bi bi-clock fa-fw fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modèles et Statistiques -->
                <div class="row g-4 mb-4">
                    <div class="col-md-6">
                        <div class="card shadow-sm h-100">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Modèles de Messages</h6>
                            </div>
                            <div class="card-body">
                                <div v-for="modele in modeles" :key="modele.id"
                                    class="modele-item mb-3 p-3 border rounded" @click="useModele(modele)">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <strong>{{ modele.nom }}</strong>
                                            <div class="text-muted small mt-1">{{ modele.description }}</div>
                                        </div>
                                        <span class="badge" :class="'bg-' + getTypeColor(modele.type)">
                                            {{ getTypeLabel(modele.type) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="card shadow-sm h-100">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Statistiques d'Envoi</h6>
                            </div>
                            <div class="card-body">
                                <div v-for="stat in envoisStats" :key="stat.label" class="mb-3">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <div class="d-flex align-items-center">
                                            <i class="bi fs-5 me-2" :class="[stat.icon, 'text-' + stat.color]"></i>
                                            <span>{{ stat.label }}</span>
                                        </div>
                                        <strong :class="'text-' + stat.color">{{ stat.count }}</strong>
                                    </div>
                                    <div class="progress" style="height: 6px;">
                                        <div class="progress-bar" :class="'bg-' + stat.color"
                                            :style="{ width: stat.percentage + '%' }"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filtres -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <div class="row g-3">
                                    <div class="col-md-3">
                                        <div class="position-relative">
                                            <input type="text" class="form-control" placeholder="Rechercher..."
                                                v-model="searchQuery" @input="filterMessages">
                                            <i
                                                class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.type" @change="filterMessages" class="form-select">
                                            <option value="">Tous les types</option>
                                            <option value="EMAIL">Email</option>
                                            <option value="SMS">SMS</option>
                                            <option value="NOTIFICATION">Notification</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.statut" @change="filterMessages" class="form-select">
                                            <option value="">Tous les statuts</option>
                                            <option value="ENVOYE">Envoyé</option>
                                            <option value="EN_ATTENTE">En attente</option>
                                            <option value="ECHEC">Échec</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <select v-model="filters.periode" @change="filterMessages" class="form-select">
                                            <option value="">Toutes périodes</option>
                                            <option value="TODAY">Aujourd'hui</option>
                                            <option value="WEEK">Cette semaine</option>
                                            <option value="MONTH">Ce mois</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <button @click="resetFilters" class="btn btn-secondary w-100">
                                            <i class="bi bi-arrow-counterclockwise me-1"></i>Réinitialiser
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Liste des messages -->
                <div class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">
                                    Historique des Communications
                                    <span class="badge bg-primary bg-opacity-10 text-primary ms-2">
                                        {{ filteredMessages.length }} messages
                                    </span>
                                </h6>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Date</th>
                                                <th>Type</th>
                                                <th>Destinataire</th>
                                                <th>Objet / Message</th>
                                                <th>Statut</th>
                                                <th class="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="paginatedMessages.length === 0">
                                                <td colspan="6" class="text-center py-5">
                                                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                                    <p class="text-muted mb-0">Aucun message trouvé</p>
                                                </td>
                                            </tr>
                                            <tr v-else v-for="message in paginatedMessages" :key="message.id">
                                                <td>
                                                    <small class="text-muted">
                                                        <i class="bi bi-calendar-event me-1"></i>
                                                        {{ formatDateTime(message.dateEnvoi) }}
                                                    </small>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="'bg-' + getTypeColor(message.type)">
                                                        <i class="bi" :class="getTypeIcon(message.type)"></i>
                                                        {{ getTypeLabel(message.type) }}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div>
                                                        <strong>{{ message.destinataire }}</strong>
                                                    </div>
                                                    <small class="text-muted">{{ message.contact }}</small>
                                                </td>
                                                <td>
                                                    <div>
                                                        <strong v-if="message.objet">{{ message.objet }}</strong>
                                                    </div>
                                                    <small class="text-muted">{{ truncateText(message.contenu, 60)
                                                    }}</small>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getStatutBadgeClass(message.statut)">
                                                        <i class="bi" :class="getStatutIcon(message.statut)"></i>
                                                        {{ getStatutLabel(message.statut) }}
                                                    </span>
                                                </td>
                                                <td class="text-end">
                                                    <div class="dropdown">
                                                        <button class="btn btn-sm btn-light" type="button"
                                                            data-bs-toggle="dropdown">
                                                            <i class="bi bi-three-dots-vertical"></i>
                                                        </button>
                                                        <ul class="dropdown-menu dropdown-menu-end">
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="viewMessage(message)">
                                                                    <i class="bi bi-eye me-2"></i>Voir détails
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item" href="#"
                                                                    @click.prevent="renvoyerMessage(message)">
                                                                    <i class="bi bi-arrow-repeat me-2"></i>Renvoyer
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
                                <div v-if="filteredMessages.length > perPage" class="card-footer border-top">
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
        </div>

        <!-- Modal Détails -->
        <div v-if="selectedMessage" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Détails du Message
                            <span class="badge ms-2" :class="'bg-' + getTypeColor(selectedMessage.type)">
                                {{ getTypeLabel(selectedMessage.type) }}
                            </span>
                        </h5>
                        <button type="button" class="btn-close" @click="selectedMessage = null"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="text-muted small">Date d'envoi</label>
                                <p class="mb-0">{{ formatDateTime(selectedMessage.dateEnvoi) }}</p>
                            </div>
                            <div class="col-md-6">
                                <label class="text-muted small">Statut</label>
                                <p class="mb-0">
                                    <span class="badge" :class="getStatutBadgeClass(selectedMessage.statut)">
                                        {{ getStatutLabel(selectedMessage.statut) }}
                                    </span>
                                </p>
                            </div>
                            <div class="col-12">
                                <label class="text-muted small">Destinataire</label>
                                <p class="mb-0"><strong>{{ selectedMessage.destinataire }}</strong></p>
                                <p class="mb-0"><small>{{ selectedMessage.contact }}</small></p>
                            </div>
                            <div class="col-12" v-if="selectedMessage.objet">
                                <label class="text-muted small">Objet</label>
                                <p class="mb-0"><strong>{{ selectedMessage.objet }}</strong></p>
                            </div>
                            <div class="col-12">
                                <label class="text-muted small">Message</label>
                                <div class="p-3 bg-light rounded">{{ selectedMessage.contenu }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="selectedMessage = null">Fermer</button>
                        <button type="button" class="btn btn-primary" @click="renvoyerMessage(selectedMessage)">
                            <i class="bi bi-arrow-repeat me-1"></i>Renvoyer
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Composition -->
        <div v-if="showComposeModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Nouveau Message</h5>
                        <button type="button" class="btn-close" @click="closeComposeModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Type de message *</label>
                                <select v-model="messageForm.type" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="EMAIL">Email</option>
                                    <option value="SMS">SMS</option>
                                    <option value="NOTIFICATION">Notification</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Destinataire *</label>
                                <select v-model="messageForm.destinataireId" class="form-select" required>
                                    <option value="">Sélectionner</option>
                                    <option value="1">Jean Kouassi</option>
                                    <option value="2">Marie Diallo</option>
                                    <option value="3">Paul Kone</option>
                                </select>
                            </div>
                            <div class="col-12" v-if="messageForm.type === 'EMAIL'">
                                <label class="form-label">Objet *</label>
                                <input type="text" v-model="messageForm.objet" class="form-control" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Message *</label>
                                <textarea v-model="messageForm.contenu" class="form-control" rows="6"
                                    required></textarea>
                                <small class="text-muted">{{ messageForm.contenu.length }} caractères</small>
                            </div>
                            <div class="col-12">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox"
                                        v-model="messageForm.envoyerMaintenant" id="envoyerMaintenant">
                                    <label class="form-check-label" for="envoyerMaintenant">
                                        Envoyer immédiatement
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeComposeModal">Annuler</button>
                        <button type="button" class="btn btn-primary" @click="envoyerMessage">
                            <i class="bi bi-send me-1"></i>{{ messageForm.envoyerMaintenant ? 'Envoyer' : 'Programmer'
                            }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus';

export default {
    name: 'Communications',

    data() {
        return {
            loading: true,
            searchQuery: '',
            currentPage: 1,
            perPage: 15,
            selectedMessage: null,
            showComposeModal: false,
            filters: { type: '', statut: '', periode: '' },
            messageForm: {
                type: '',
                destinataireId: '',
                objet: '',
                contenu: '',
                envoyerMaintenant: true
            },
            messages: [],
            stats: { total: 0, emails: 0, sms: 0, enAttente: 0 },
            modeles: [],
            envoisStats: []
        };
    },

    computed: {
        filteredMessages() {
            let result = [...this.messages];
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(m =>
                    m.destinataire.toLowerCase().includes(query) ||
                    (m.objet && m.objet.toLowerCase().includes(query)) ||
                    m.contenu.toLowerCase().includes(query)
                );
            }
            if (this.filters.type) result = result.filter(m => m.type === this.filters.type);
            if (this.filters.statut) result = result.filter(m => m.statut === this.filters.statut);
            return result.sort((a, b) => new Date(b.dateEnvoi) - new Date(a.dateEnvoi));
        },

        paginatedMessages() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredMessages.slice(start, start + this.perPage);
        },

        totalPages() {
            return Math.ceil(this.filteredMessages.length / this.perPage);
        }
    },

    async mounted() {
        await this.loadData();
    },

    methods: {
        async loadData() {
            try {
                this.loading = true;

                const noms = ['Jean Kouassi', 'Marie Diallo', 'Paul Kone', 'Sophie N\'Guessan'];
                const types = ['EMAIL', 'SMS', 'NOTIFICATION'];
                const statuts = ['ENVOYE', 'EN_ATTENTE', 'ECHEC'];

                this.messages = Array.from({ length: 50 }, (_, i) => ({
                    id: i + 1,
                    type: types[Math.floor(Math.random() * types.length)],
                    destinataire: noms[Math.floor(Math.random() * noms.length)],
                    contact: types[Math.floor(Math.random() * 2)] === 'EMAIL' ?
                        `contact${i}@email.com` : `+225 07 ${Math.floor(Math.random() * 90000000 + 10000000)}`,
                    objet: types[Math.floor(Math.random() * 2)] === 'EMAIL' ? `Objet du message ${i + 1}` : null,
                    contenu: `Contenu du message numéro ${i + 1}. Ceci est un exemple de texte pour démonstration.`,
                    statut: statuts[Math.floor(Math.random() * statuts.length)],
                    dateEnvoi: new Date(2024, 10, Math.floor(Math.random() * 30) + 1, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60)).toISOString()
                }));

                this.modeles = [
                    { id: 1, nom: 'Rappel RDV Signature', description: 'Rappel pour un rendez-vous de signature', type: 'EMAIL' },
                    { id: 2, nom: 'Confirmation Acte', description: 'Confirmation de la réception d\'un acte', type: 'SMS' },
                    { id: 3, nom: 'Document Manquant', description: 'Notification de document manquant', type: 'EMAIL' },
                    { id: 4, nom: 'Alerte Échéance', description: 'Alerte pour une échéance proche', type: 'NOTIFICATION' }
                ];

                this.calculateStats();
                this.calculateEnvoisStats();
            } catch (error) {
                console.error('Erreur:', error);
                ElMessage.error('Erreur lors du chargement');
            } finally {
                this.loading = false;
            }
        },

        calculateStats() {
            this.stats.total = this.messages.length;
            this.stats.emails = this.messages.filter(m => m.type === 'EMAIL').length;
            this.stats.sms = this.messages.filter(m => m.type === 'SMS').length;
            this.stats.enAttente = this.messages.filter(m => m.statut === 'EN_ATTENTE').length;
        },

        calculateEnvoisStats() {
            const total = this.messages.length;
            this.envoisStats = [
                { label: 'Envoyés', count: this.messages.filter(m => m.statut === 'ENVOYE').length, icon: 'bi-check-circle', color: 'success', percentage: 0 },
                { label: 'En attente', count: this.messages.filter(m => m.statut === 'EN_ATTENTE').length, icon: 'bi-clock', color: 'warning', percentage: 0 },
                { label: 'Échecs', count: this.messages.filter(m => m.statut === 'ECHEC').length, icon: 'bi-x-circle', color: 'danger', percentage: 0 }
            ];
            this.envoisStats.forEach(stat => {
                stat.percentage = total > 0 ? Math.round((stat.count / total) * 100) : 0;
            });
        },

        filterMessages() {
            this.currentPage = 1;
        },

        resetFilters() {
            this.searchQuery = '';
            this.filters = { type: '', statut: '', periode: '' };
            this.currentPage = 1;
        },

        viewMessage(message) {
            this.selectedMessage = message;
        },

        useModele(modele) {
            this.messageForm.type = modele.type;
            this.showComposeModal = true;
            ElMessage.info(`Modèle "${modele.nom}" chargé`);
        },

        closeComposeModal() {
            this.showComposeModal = false;
            this.messageForm = { type: '', destinataireId: '', objet: '', contenu: '', envoyerMaintenant: true };
        },

        envoyerMessage() {
            if (!this.messageForm.type || !this.messageForm.destinataireId || !this.messageForm.contenu) {
                ElMessage.warning('Veuillez remplir tous les champs obligatoires');
                return;
            }
            ElMessage.success(this.messageForm.envoyerMaintenant ? 'Message envoyé!' : 'Message programmé!');
            this.closeComposeModal();
            this.loadData();
        },

        renvoyerMessage(message) {
            ElMessage.success('Message renvoyé avec succès!');
            if (this.selectedMessage) this.selectedMessage = null;
        },

        rafraichir() {
            this.loadData();
            ElMessage.success('Données mises à jour !');
        },

        getTypeLabel(type) {
            const labels = { 'EMAIL': 'Email', 'SMS': 'SMS', 'NOTIFICATION': 'Notification' };
            return labels[type] || type;
        },

        getTypeIcon(type) {
            const icons = { 'EMAIL': 'bi-envelope', 'SMS': 'bi-phone', 'NOTIFICATION': 'bi-bell' };
            return icons[type] || 'bi-chat';
        },

        getTypeColor(type) {
            const colors = { 'EMAIL': 'success', 'SMS': 'info', 'NOTIFICATION': 'warning' };
            return colors[type] || 'secondary';
        },

        getStatutLabel(statut) {
            const labels = { 'ENVOYE': 'Envoyé', 'EN_ATTENTE': 'En attente', 'ECHEC': 'Échec' };
            return labels[statut] || statut;
        },

        getStatutIcon(statut) {
            const icons = { 'ENVOYE': 'bi-check-circle', 'EN_ATTENTE': 'bi-clock', 'ECHEC': 'bi-x-circle' };
            return icons[statut] || 'bi-circle';
        },

        getStatutBadgeClass(statut) {
            const classes = { 'ENVOYE': 'bg-success', 'EN_ATTENTE': 'bg-warning text-dark', 'ECHEC': 'bg-danger' };
            return classes[statut] || 'bg-secondary';
        },

        truncateText(text, length) {
            if (!text) return '';
            return text.length > length ? text.substring(0, length) + '...' : text;
        },

        formatDateTime(dateStr) {
            if (!dateStr) return '—';
            const date = new Date(dateStr);
            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
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

.modal.show {
    display: block !important;
}

.modele-item {
    cursor: pointer;
    transition: all 0.3s;
}

.modele-item:hover {
    background-color: #f8f9fa;
    transform: translateX(5px);
}

.table-hover tbody tr:hover {
    background-color: rgba(13, 110, 253, 0.05);
}

.badge {
    font-weight: 500;
    padding: 0.35em 0.65em;
}

.dropdown-menu {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.spinner-border {
    width: 3rem;
    height: 3rem;
}

.pagination .page-link {
    color: #0d6efd;
    border-color: #dee2e6;
}

.pagination .page-item.active .page-link {
    background-color: #0d6efd;
    border-color: #0d6efd;
}

.pagination .page-item.disabled .page-link {
    color: #6c757d;
    pointer-events: none;
}

@media (max-width: 768px) {
    .icon-lg {
        width: 50px;
        height: 50px;
    }
}

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