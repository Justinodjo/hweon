<template>
    <div class="rental-management-container">
        <!-- Header avec statistiques -->
        <div class="stats-header">
            <div class="header-content">
                <h2 class="main-title">Gestion des Locations</h2>
                <p class="subtitle">Suivez et gérez vos biens immobiliers</p>
            </div>
            <div class="stats-grid">
                <div class="stat-card active-stat">
                    <div class="stat-icon">🏃‍♂️</div>
                    <div class="stat-content">
                        <span class="stat-number">{{ upcomingReservations.length }}</span>
                        <span class="stat-label">En cours</span>
                    </div>
                </div>
                <div class="stat-card canceled-stat">
                    <div class="stat-icon">❌</div>
                    <div class="stat-content">
                        <span class="stat-number">{{ canceledReservations.length }}</span>
                        <span class="stat-label">Annulées</span>
                    </div>
                </div>
                <div class="stat-card completed-stat">
                    <div class="stat-icon">✅</div>
                    <div class="stat-content">
                        <span class="stat-number">{{ completedReservations.length }}</span>
                        <span class="stat-label">Terminées</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Navigation par onglets -->
        <div class="tabs-navigation">
            <button v-for="tab in tabs" :key="tab.id" :class="['tab-button', { active: activeTab === tab.id }]"
                @click="switchTab(tab.id)">
                <i :class="tab.icon"></i>
                <span>{{ tab.label }}</span>
                <span class="tab-badge" :class="tab.badgeClass">{{ tab.count }}</span>
            </button>
        </div>

        <!-- Contenu des onglets -->
        <div class="tab-content-wrapper">
            <!-- Locations en cours -->
            <div v-show="activeTab === 'ongoing'" class="tab-content">
                <div class="section-header">
                    <h3 class="section-title">Locations en cours</h3>
                    <div class="section-meta">{{ upcomingReservations.length }} location(s)</div>
                </div>

                <div v-if="upcomingReservations.length === 0" class="empty-state">
                    <div class="empty-icon">📋</div>
                    <h4>Aucune location en cours</h4>
                    <p>Vos locations actives apparaîtront ici</p>
                </div>

                <div v-else class="reservations-grid">
                    <div v-for="(reservation, index) in upcomingReservations" :key="`ongoing-${index}`"
                        class="reservation-card ongoing-card">
                        <div class="card-header">
                            <div class="property-info">
                                <div class="property-avatar">
                                    <i class="bi bi-house-door"></i>
                                </div>
                                <div class="property-details">
                                    <h4 class="property-name">{{ reservation.nom }}</h4>
                                    <div class="property-meta">
                                        <span class="reservation-id">ID: {{ reservation.id }}</span>
                                        <span class="reservation-date">{{ formatDate(reservation.dateReservation)
                                            }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="status-badge status-ongoing">En cours</div>
                        </div>

                        <div class="services-section"
                            v-if="reservation.typeServices && reservation.typeServices.length">
                            <h5 class="services-title">Services inclus</h5>
                            <div class="services-table">
                                <div class="table-header">
                                    <span>Service</span>
                                    <span>Prix</span>
                                </div>
                                <div v-for="service in reservation.typeServices" :key="service.id" class="table-row">
                                    <div class="service-info">
                                        <span class="service-id">#{{ service.id || 'N/A' }}</span>
                                        <span class="service-name">{{ service.nom || 'Service non défini' }}</span>
                                    </div>
                                    <div class="service-price">{{ formatPrice(service.prix) }}</div>
                                </div>
                            </div>
                        </div>

                        <div class="card-footer">
                            <div class="footer-info">
                                <div class="info-item">
                                    <i class="bi bi-calendar-event"></i>
                                    <span>{{ formatDate(reservation.dateReservation) }}</span>
                                </div>
                                <div class="info-item">
                                    <i class="bi bi-person"></i>
                                    <span>{{ reservation.nom }} {{ reservation.prenom }}</span>
                                </div>
                            </div>
                            <button class="action-btn" @click="manageReservation(reservation)">
                                <i class="bi bi-gear"></i>
                                Gérer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Locations annulées -->
            <div v-show="activeTab === 'canceled'" class="tab-content">
                <div class="section-header">
                    <h3 class="section-title">Locations annulées</h3>
                    <div class="section-meta">{{ canceledReservations.length }} location(s)</div>
                </div>

                <div v-if="canceledReservations.length === 0" class="empty-state">
                    <div class="empty-icon">🚫</div>
                    <h4>Aucune location annulée</h4>
                    <p>Les locations annulées apparaîtront ici</p>
                </div>

                <div v-else class="reservations-grid">
                    <div v-for="(reservation, index) in canceledReservations" :key="`canceled-${index}`"
                        class="reservation-card canceled-card">
                        <div class="card-header">
                            <div class="property-info">
                                <div class="property-avatar canceled">
                                    <i class="bi bi-house-door"></i>
                                </div>
                                <div class="property-details">
                                    <h4 class="property-name">{{ reservation.nom }}</h4>
                                    <div class="property-meta">
                                        <span class="reservation-id">ID: {{ reservation.id }}</span>
                                        <span class="reservation-status">{{ reservation.status }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="status-badge status-canceled">Annulée</div>
                        </div>

                        <div class="services-section"
                            v-if="reservation.typeServices && reservation.typeServices.length">
                            <h5 class="services-title">Services prévus</h5>
                            <div class="services-table">
                                <div class="table-header">
                                    <span>Service</span>
                                    <span>Prix</span>
                                </div>
                                <div v-for="service in reservation.typeServices" :key="service.id" class="table-row">
                                    <div class="service-info">
                                        <span class="service-id">#{{ service.id || 'N/A' }}</span>
                                        <span class="service-name">{{ service.nom || 'Service non défini' }}</span>
                                    </div>
                                    <div class="service-price">{{ formatPrice(service.prix) }}</div>
                                </div>
                            </div>
                        </div>

                        <div class="card-footer">
                            <div class="footer-info">
                                <div class="info-item">
                                    <i class="bi bi-calendar-x"></i>
                                    <span>{{ formatDate(reservation.dateReservation) }}</span>
                                </div>
                                <div class="info-item">
                                    <i class="bi bi-person"></i>
                                    <span>{{ reservation.nom }} {{ reservation.prenom }}</span>
                                </div>
                            </div>
                            <div class="cancellation-reason">
                                <small>Annulation le {{ formatDate(reservation.dateReservation) }}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Locations terminées -->
            <div v-show="activeTab === 'completed'" class="tab-content">
                <div class="section-header">
                    <h3 class="section-title">Locations terminées</h3>
                    <div class="section-meta">{{ completedReservations.length }} location(s)</div>
                </div>

                <div v-if="completedReservations.length === 0" class="empty-state-special">
                    <div class="empty-content">
                        <div class="empty-illustration">
                            <div class="illustration-icon">🏆</div>
                            <div class="illustration-bg"></div>
                        </div>
                        <h4>Aucune location terminée</h4>
                        <p>Vos locations apparaîtront ici une fois confirmées et terminées</p>
                        <router-link to="/reservation" class="cta-button">
                            <i class="bi bi-plus-circle"></i>
                            Nouvelle location
                        </router-link>
                    </div>
                </div>

                <div v-else class="reservations-grid">
                    <div v-for="(reservation, index) in completedReservations" :key="`completed-${index}`"
                        class="reservation-card completed-card">
                        <div class="card-header">
                            <div class="property-info">
                                <div class="property-avatar completed">
                                    <i class="bi bi-house-check"></i>
                                </div>
                                <div class="property-details">
                                    <h4 class="property-name">{{ reservation.nom }} {{ reservation.prenom }}</h4>
                                    <div class="property-meta">
                                        <span class="reservation-id">ID: {{ reservation.id }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="status-badge status-completed">{{ reservation.status }}</div>
                        </div>

                        <div class="services-section"
                            v-if="reservation.typeServices && reservation.typeServices.length">
                            <h5 class="services-title">Services fournis</h5>
                            <div class="services-table">
                                <div class="table-header">
                                    <span>Service</span>
                                    <span>Prix</span>
                                </div>
                                <div v-for="service in reservation.typeServices" :key="service.id" class="table-row">
                                    <div class="service-info">
                                        <span class="service-id">#{{ service.id || 'N/A' }}</span>
                                        <span class="service-name">{{ service.nom || 'Service non défini' }}</span>
                                    </div>
                                    <div class="service-price">{{ formatPrice(service.prix) }}</div>
                                </div>
                            </div>
                        </div>

                        <div class="card-footer">
                            <div class="footer-info">
                                <div class="info-item">
                                    <i class="bi bi-check-circle"></i>
                                    <span>Terminée avec succès</span>
                                </div>
                            </div>
                            <button class="action-btn secondary" @click="viewDetails(reservation)">
                                <i class="bi bi-eye"></i>
                                Détails
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loader -->
        <div v-if="isLoading" class="loading-overlay">
            <div class="spinner"></div>
            <p>Chargement des réservations...</p>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: 'RentalManagement',
    data() {
        return {
            activeTab: 'ongoing',
            upcomingReservations: [],
            canceledReservations: [],
            completedReservations: [],
            isLoading: false,
            tabs: [
                {
                    id: 'ongoing',
                    label: 'En cours',
                    icon: 'bi bi-arrow-clockwise',
                    badgeClass: 'badge-ongoing',
                    get count() { return this.upcomingReservations?.length || 0; }
                },
                {
                    id: 'canceled',
                    label: 'Annulées',
                    icon: 'bi bi-x-octagon',
                    badgeClass: 'badge-canceled',
                    get count() { return this.canceledReservations?.length || 0; }
                },
                {
                    id: 'completed',
                    label: 'Terminées',
                    icon: 'bi bi-check-circle',
                    badgeClass: 'badge-completed',
                    get count() { return this.completedReservations?.length || 0; }
                }
            ]
        };
    },

    computed: {
        ...mapGetters('auth', ['userName', 'secondName', 'email', 'userInfo']),

        currentUser() {
            const userId = this.$store.getters['auth/userInfo'];
            return userId ? userId : null;
        },

        // Mise à jour des compteurs dans les onglets
        tabsWithCounts() {
            return this.tabs.map(tab => ({
                ...tab,
                count: this.getTabCount(tab.id)
            }));
        }
    },

    mounted() {
        if (this.currentUser) {
            this.loadReservations();
        }
    },

    methods: {
        async loadReservations() {
            this.isLoading = true;
            try {
                const userId = this.currentUser;

                if (!userId) {
                    console.error('Aucun utilisateur connecté');
                    return;
                }

                const allReservations = await this.$store.dispatch('contrats/getBiensLouesParUtilisateur', userId);
                console.log('Réservations récupérées :', allReservations);
                // Vérifier que allReservations est un tableau
                if (!Array.isArray(allReservations)) {
                    console.error('Les données reçues ne sont pas un tableau');
                    return;
                }
                // Traitement des réservations (votre logique conservée)
                const reservationsByUser = allReservations.reduce((acc, reservation) => {
                    if (!userId) return acc;
                    if (!acc[userId]) {
                        acc[userId] = [];
                    }
                    acc[userId].push(reservation);
                    return acc;
                }, {});

                const allReservationsByUser = Object.values(reservationsByUser).flat();

                // Filtrage par statut (votre logique conservée)
                this.upcomingReservations = allReservationsByUser.filter(res => res.status === 'Encours');
                this.canceledReservations = allReservationsByUser.filter(res => res.status === 'Annulée');
                this.completedReservations = allReservationsByUser.filter(res => res.status === 'Confirmé');

                console.log('Réservations en cours:', this.upcomingReservations);
                console.log('Réservations annulées:', this.canceledReservations);
                console.log('Réservations terminées:', this.completedReservations);

            } catch (error) {
                console.error('Erreur lors du chargement des réservations', error);
                this.showError('Erreur lors du chargement des réservations');
            } finally {
                this.isLoading = false;
            }
        },

        switchTab(tabId) {
            this.activeTab = tabId;
        },

        getTabCount(tabId) {
            switch (tabId) {
                case 'ongoing': return this.upcomingReservations.length;
                case 'canceled': return this.canceledReservations.length;
                case 'completed': return this.completedReservations.length;
                default: return 0;
            }
        },

        formatDate(dateString) {
            if (!dateString) return 'Date non définie';
            try {
                return new Date(dateString).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            } catch (error) {
                return dateString;
            }
        },

        formatPrice(price) {
            if (!price || price === 'N/A') return 'Prix non défini';
            return `${price}€`;
        },

        manageReservation(reservation) {
            // Logique de gestion de la réservation
            console.log('Gestion de la réservation:', reservation);
            // Vous pouvez ajouter votre logique ici (modal, navigation, etc.)
        },

        viewDetails(reservation) {
            // Logique d'affichage des détails
            console.log('Détails de la réservation:', reservation);
            // Vous pouvez ajouter votre logique ici
        },

        showError(message) {
            // Système de notification d'erreur
            console.error(message);
            // Vous pouvez intégrer votre système de toast/notification ici
        }
    }
};
</script>

<style scoped>
.rental-management-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Header avec statistiques */
.stats-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    padding: 30px;
    margin-bottom: 30px;
    color: white;
    position: relative;
    overflow: hidden;
}

.stats-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="15" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="80" r="10" fill="rgba(255,255,255,0.1)"/></svg>');
    opacity: 0.5;
}

.header-content {
    position: relative;
    z-index: 2;
    text-align: center;
    margin-bottom: 30px;
}

.main-title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
}

.subtitle {
    font-size: 16px;
    opacity: 0.9;
}

.stats-grid {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
}

.stat-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 20px;
    text-align: center;
    transition: transform 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
}

.stat-icon {
    font-size: 24px;
    margin-bottom: 12px;
}

.stat-number {
    display: block;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 4px;
}

.stat-label {
    font-size: 14px;
    opacity: 0.9;
}

/* Navigation par onglets */
.tabs-navigation {
    display: flex;
    background: white;
    border-radius: 16px;
    padding: 8px;
    margin-bottom: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    gap: 4px;
}

.tab-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px;
    border: none;
    background: transparent;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #64748b;
    font-weight: 500;
}

.tab-button.active {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    transform: scale(1.02);
}

.tab-button:not(.active):hover {
    background: #f8fafc;
    color: #475569;
}

.tab-badge {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 600;
}

.tab-button:not(.active) .tab-badge {
    background: #e2e8f0;
    color: #64748b;
}

/* Contenu des onglets */
.tab-content-wrapper {
    position: relative;
}

.tab-content {
    animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.section-title {
    font-size: 22px;
    font-weight: 700;
    color: #1e293b;
}

.section-meta {
    color: #64748b;
    font-size: 14px;
}

/* États vides */
.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #64748b;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 20px;
}

.empty-state h4 {
    font-size: 18px;
    color: #475569;
    margin-bottom: 12px;
}

.empty-state-special {
    text-align: center;
    padding: 80px 20px;
}

.empty-content {
    max-width: 400px;
    margin: 0 auto;
}

.empty-illustration {
    position: relative;
    display: inline-block;
    margin-bottom: 30px;
}

.illustration-icon {
    font-size: 64px;
    position: relative;
    z-index: 2;
}

.illustration-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
    border-radius: 50%;
    z-index: 1;
}

.cta-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    text-decoration: none;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    color: white;
}

/* Grille des réservations */
.reservations-grid {
    display: grid;
    gap: 24px;
}

.reservation-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #f1f5f9;
    transition: all 0.3s ease;
    position: relative;
}

.reservation-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.ongoing-card:hover {
    border-color: rgba(102, 126, 234, 0.3);
}

.canceled-card:hover {
    border-color: rgba(239, 68, 68, 0.3);
}

.completed-card:hover {
    border-color: rgba(34, 197, 94, 0.3);
}

/* En-tête de carte */
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
}

.property-info {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    flex: 1;
}

.property-avatar {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    flex-shrink: 0;
}

.property-avatar.canceled {
    background: linear-gradient(135deg, #ef4444, #dc2626);
}

.property-avatar.completed {
    background: linear-gradient(135deg, #22c55e, #16a34a);
}

.property-name {
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 8px;
}

.property-meta {
    display: flex;
    gap: 12px;
    font-size: 14px;
    color: #64748b;
}

.reservation-id {
    font-weight: 600;
}

/* Badges de statut */
.status-badge {
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.status-ongoing {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
}

.status-canceled {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
}

.status-completed {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
}

/* Section services */
.services-section {
    margin: 20px 0;
}

.services-title {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 12px;
}

.services-table {
    background: #f8fafc;
    border-radius: 12px;
    overflow: hidden;
}

.table-header {
    display: grid;
    grid-template-columns: 1fr 100px;
    gap: 16px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 600;
}

.table-row {
    display: grid;
    grid-template-columns: 1fr 100px;
    gap: 16px;
    padding: 12px 16px;
    border-bottom: 1px solid #e2e8f0;
    align-items: center;
}

.table-row:last-child {
    border-bottom: none;
}

.service-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.service-id {
    font-size: 12px;
    color: #667eea;
    font-weight: 600;
}

.service-name {
    color: #374151;
    font-weight: 500;
}

.service-price {
    font-weight: 700;
    color: #059669;
    text-align: right;
}

/* Pied de carte */
.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #f1f5f9;
}

.footer-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #64748b;
}

.info-item i {
    color: #667eea;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.action-btn.secondary {
    background: #f1f5f9;
    color: #475569;
}

.action-btn.secondary:hover {
    background: #e2e8f0;
    box-shadow: 0 4px 15px rgba(71, 85, 105, 0.2);
}

.cancellation-reason {
    font-style: italic;
    color: #ef4444;
}

/* Loader */
.loading-overlay {
    position: fixed;
    top: 0;
}
</style>