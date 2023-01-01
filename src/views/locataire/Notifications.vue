<template>
    <div class="notifications-container">
        <!-- Header -->
        <div class="notifications-header">
            <div class="header-content">
                <h2 class="main-title">
                    <i class="bi bi-bell-fill"></i>
                    Notifications
                </h2>
                <div class="header-actions">
                    <button class="header-btn" @click="markAllAsRead" v-if="unreadCount > 0">
                        <i class="bi bi-check-all"></i>
                        Tout marquer comme lu
                    </button>
                    <button class="header-btn secondary" @click="clearAll" v-if="notifications.length > 0">
                        <i class="bi bi-trash"></i>
                        Tout effacer
                    </button>
                </div>
            </div>

            <!-- Stats -->
            <div class="stats-row">
                <div class="stat-item">
                    <span class="stat-number">{{ unreadCount }}</span>
                    <span class="stat-label">Non lues</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">{{ todayCount }}</span>
                    <span class="stat-label">Aujourd'hui</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">{{ notifications.length }}</span>
                    <span class="stat-label">Total</span>
                </div>
            </div>
        </div>

        <!-- Filtres -->
        <div class="filters-bar">
            <div class="filter-tabs">
                <button v-for="filter in filters" :key="filter.value"
                    :class="['filter-tab', { active: activeFilter === filter.value }]"
                    @click="activeFilter = filter.value">
                    <i :class="filter.icon"></i>
                    <span>{{ filter.label }}</span>
                    <span class="filter-count" v-if="getFilterCount(filter.value) > 0">
                        {{ getFilterCount(filter.value) }}
                    </span>
                </button>
            </div>
        </div>

        <!-- Liste des notifications -->
        <div class="notifications-list">
            <div v-if="filteredNotifications.length === 0" class="empty-state">
                <div class="empty-icon">🔔</div>
                <h3>Aucune notification</h3>
                <p>{{ getEmptyMessage() }}</p>
            </div>

            <div v-else>
                <!-- Groupement par date -->
                <div v-for="(group, date) in groupedNotifications" :key="date" class="notification-group">
                    <div class="group-date">{{ formatGroupDate(date) }}</div>

                    <transition-group name="notification-list" tag="div" class="group-notifications">
                        <div v-for="notification in group" :key="notification.id"
                            :class="['notification-item', `notification-${notification.type}`, { unread: !notification.read }]"
                            @click="handleNotificationClick(notification)">

                            <!-- Icon -->
                            <div :class="['notification-icon', `icon-${notification.type}`]">
                                <i :class="getNotificationIcon(notification.type)"></i>
                            </div>

                            <!-- Content -->
                            <div class="notification-content">
                                <div class="notification-header">
                                    <h4 class="notification-title">{{ notification.title }}</h4>
                                    <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
                                </div>

                                <p class="notification-message">{{ notification.message }}</p>

                                <!-- Metadata -->
                                <div class="notification-meta" v-if="notification.data">
                                    <span v-if="notification.data.contratRef" class="meta-tag">
                                        <i class="bi bi-file-text"></i>
                                        {{ notification.data.contratRef }}
                                    </span>
                                    <span v-if="notification.data.montant" class="meta-tag">
                                        <i class="bi bi-cash"></i>
                                        {{ formatPrice(notification.data.montant) }}
                                    </span>
                                    <span v-if="notification.data.bien" class="meta-tag">
                                        <i class="bi bi-house"></i>
                                        {{ notification.data.bien }}
                                    </span>
                                </div>

                                <!-- Actions -->
                                <div class="notification-actions" v-if="notification.actionable">
                                    <button class="action-btn primary"
                                        @click.stop="handleAction(notification, 'accept')">
                                        <i class="bi bi-check-circle"></i>
                                        {{ notification.actionLabels?.accept || 'Accepter' }}
                                    </button>
                                    <button class="action-btn secondary"
                                        @click.stop="handleAction(notification, 'reject')">
                                        <i class="bi bi-x-circle"></i>
                                        {{ notification.actionLabels?.reject || 'Refuser' }}
                                    </button>
                                </div>
                            </div>

                            <!-- Actions de notification -->
                            <div class="notification-controls">
                                <button class="control-btn" @click.stop="toggleRead(notification)"
                                    :title="notification.read ? 'Marquer comme non lu' : 'Marquer comme lu'">
                                    <i :class="notification.read ? 'bi bi-envelope-open' : 'bi bi-envelope'"></i>
                                </button>
                                <button class="control-btn delete" @click.stop="deleteNotification(notification.id)"
                                    title="Supprimer">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </transition-group>
                </div>
            </div>
        </div>

        <!-- Loader -->
        <div v-if="isLoading" class="loading-overlay">
            <div class="spinner"></div>
            <p>Chargement des notifications...</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NotificationCenter',
    data() {
        return {
            notifications: [],
            activeFilter: 'all',
            isLoading: false,
            filters: [
                { value: 'all', label: 'Toutes', icon: 'bi bi-grid' },
                { value: 'unread', label: 'Non lues', icon: 'bi bi-envelope' },
                { value: 'CONTRAT', label: 'Contrats', icon: 'bi bi-file-text' },
                { value: 'PAIEMENT', label: 'Paiements', icon: 'bi bi-cash-coin' },
                { value: 'INTERVENTION', label: 'Interventions', icon: 'bi bi-tools' },
                { value: 'MESSAGE', label: 'Messages', icon: 'bi bi-chat-dots' },
                { value: 'ALERTE', label: 'Alertes', icon: 'bi bi-exclamation-triangle' }
            ]
        };
    },

    computed: {
        currentUser() {
            return this.$store.getters['auth/userInfo'];
        },

        unreadCount() {
            return this.notifications.filter(n => !n.read).length;
        },

        todayCount() {
            const today = new Date().toDateString();
            return this.notifications.filter(n =>
                new Date(n.createdAt).toDateString() === today
            ).length;
        },

        filteredNotifications() {
            let filtered = this.notifications;

            if (this.activeFilter === 'unread') {
                filtered = filtered.filter(n => !n.read);
            } else if (this.activeFilter !== 'all') {
                filtered = filtered.filter(n => n.type === this.activeFilter);
            }

            return filtered.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
        },

        groupedNotifications() {
            const groups = {};

            this.filteredNotifications.forEach(notification => {
                const date = new Date(notification.createdAt).toDateString();
                if (!groups[date]) {
                    groups[date] = [];
                }
                groups[date].push(notification);
            });

            return groups;
        }
    },

    mounted() {
        if (this.currentUser) {
            this.loadNotifications();
            this.startPolling();
        }
    },

    beforeUnmount() {
        this.stopPolling();
    },

    methods: {
        async loadNotifications() {
            this.isLoading = true;
            try {
                const userId = this.currentUser;
                this.notifications = await this.$store.dispatch('notifications/getUserNotifications', userId);
            } catch (error) {
                console.error('Erreur lors du chargement des notifications:', error);
                this.$message.error('Impossible de charger les notifications');
            } finally {
                this.isLoading = false;
            }
        },

        startPolling() {
            // Rafraîchir toutes les 30 secondes
            this.pollingInterval = setInterval(() => {
                this.loadNotifications();
            }, 30000);
        },

        stopPolling() {
            if (this.pollingInterval) {
                clearInterval(this.pollingInterval);
            }
        },

        getNotificationIcon(type) {
            const icons = {
                CONTRAT: 'bi bi-file-text',
                PAIEMENT: 'bi bi-cash-coin',
                INTERVENTION: 'bi bi-tools',
                MESSAGE: 'bi bi-chat-dots',
                ALERTE: 'bi bi-exclamation-triangle',
                VISITE: 'bi bi-calendar-event',
                RAPPEL: 'bi bi-alarm',
                SYSTEME: 'bi bi-gear'
            };
            return icons[type] || 'bi bi-bell';
        },

        async toggleRead(notification) {
            try {
                notification.read = !notification.read;
                await this.$store.dispatch('notifications/updateReadStatus', {
                    id: notification.id,
                    read: notification.read
                });
            } catch (error) {
                console.error('Erreur lors de la mise à jour:', error);
                notification.read = !notification.read; // Rollback
            }
        },

        async markAllAsRead() {
            try {
                await this.$store.dispatch('notifications/markAllAsRead', this.currentUser);
                this.notifications.forEach(n => n.read = true);
                this.$message.success('Toutes les notifications ont été marquées comme lues');
            } catch (error) {
                console.error('Erreur:', error);
                this.$message.error('Impossible de marquer les notifications');
            }
        },

        async deleteNotification(id) {
            try {
                await this.$store.dispatch('notifications/delete', id);
                this.notifications = this.notifications.filter(n => n.id !== id);
                this.$message.success('Notification supprimée');
            } catch (error) {
                console.error('Erreur:', error);
                this.$message.error('Impossible de supprimer la notification');
            }
        },

        async clearAll() {
            try {
                await this.$confirm('Voulez-vous vraiment supprimer toutes les notifications ?', 'Confirmation', {
                    confirmButtonText: 'Oui',
                    cancelButtonText: 'Non',
                    type: 'warning'
                });

                await this.$store.dispatch('notifications/clearAll', this.currentUser);
                this.notifications = [];
                this.$message.success('Toutes les notifications ont été supprimées');
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Erreur:', error);
                    this.$message.error('Impossible de supprimer les notifications');
                }
            }
        },

        handleNotificationClick(notification) {
            // Marquer comme lu
            if (!notification.read) {
                this.toggleRead(notification);
            }

            // Navigation selon le type
            if (notification.link) {
                this.$router.push(notification.link);
            } else if (notification.data?.contratId) {
                this.$router.push({
                    name: 'ContratDetails',
                    params: { id: notification.data.contratId }
                });
            } else if (notification.data?.interventionId) {
                this.$router.push({
                    name: 'InterventionDetails',
                    params: { id: notification.data.interventionId }
                });
            }
        },

        async handleAction(notification, action) {
            try {
                const payload = {
                    notificationId: notification.id,
                    action: action,
                    data: notification.data
                };

                await this.$store.dispatch('notifications/handleAction', payload);

                this.$message.success(
                    action === 'accept' ? 'Action acceptée' : 'Action refusée'
                );

                // Supprimer la notification après action
                this.deleteNotification(notification.id);
            } catch (error) {
                console.error('Erreur:', error);
                this.$message.error('Impossible d\'effectuer l\'action');
            }
        },

        getFilterCount(filterValue) {
            if (filterValue === 'all') {
                return this.notifications.length;
            } else if (filterValue === 'unread') {
                return this.unreadCount;
            } else {
                return this.notifications.filter(n => n.type === filterValue).length;
            }
        },

        formatTime(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);

            if (diffMins < 1) return 'À l\'instant';
            if (diffMins < 60) return `Il y a ${diffMins}min`;
            if (diffHours < 24) return `Il y a ${diffHours}h`;
            if (diffDays < 7) return `Il y a ${diffDays}j`;

            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short'
            });
        },

        formatGroupDate(dateString) {
            const date = new Date(dateString);
            const today = new Date().toDateString();
            const yesterday = new Date(Date.now() - 86400000).toDateString();

            if (date.toDateString() === today) return 'Aujourd\'hui';
            if (date.toDateString() === yesterday) return 'Hier';

            return date.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
            });
        },

        formatPrice(amount) {
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0
            }).format(amount);
        },

        getEmptyMessage() {
            if (this.activeFilter === 'unread') {
                return 'Toutes vos notifications ont été lues';
            }
            return 'Vous n\'avez pas encore de notifications';
        }
    }
};
</script>

<style scoped>
.notifications-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Header */
.notifications-header {
    background: linear-gradient(135deg, var(--bs-primary), var(--bs-secondary));
    color: white;
    border-radius: 20px;
    padding: 30px;
    margin-bottom: 24px;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.main-title {
    font-size: 28px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
}

.header-actions {
    display: flex;
    gap: 12px;
}

.header-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.header-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
}

.header-btn.secondary {
    background: rgba(239, 68, 68, 0.2);
}

.header-btn.secondary:hover {
    background: rgba(239, 68, 68, 0.3);
}

.stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.stat-item {
    text-align: center;
    padding: 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
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

/* Filtres */
.filters-bar {
    background: white;
    border-radius: 16px;
    padding: 12px;
    margin-bottom: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.filter-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.filter-tab {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    border: none;
    background: transparent;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    color: var(--bs-gray-600);
}

.filter-tab.active {
    background: var(--bs-primary);
    color: white;
}

.filter-tab:not(.active):hover {
    background: var(--bs-light);
}

.filter-count {
    background: rgba(255, 255, 255, 0.3);
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 600;
}

.filter-tab:not(.active) .filter-count {
    background: var(--bs-light);
    color: var(--bs-gray-600);
}

/* Liste des notifications */
.notifications-list {
    margin-bottom: 24px;
}

.notification-group {
    margin-bottom: 32px;
}

.group-date {
    font-size: 14px;
    font-weight: 700;
    color: var(--bs-gray-600);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
    padding: 0 4px;
}

.notification-item {
    display: flex;
    gap: 16px;
    background: white;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    border: 2px solid transparent;
    transition: all 0.3s ease;
    cursor: pointer;
}

.notification-item:hover {
    border-color: var(--bs-primary);
    transform: translateX(4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.notification-item.unread {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
    border-color: rgba(102, 126, 234, 0.2);
}

.notification-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
}

.icon-CONTRAT {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
}

.icon-PAIEMENT {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
}

.icon-INTERVENTION {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
}

.icon-MESSAGE {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
}

.icon-ALERTE {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
}

.notification-content {
    flex: 1;
}

.notification-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
}

.notification-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--bs-gray-800);
    margin: 0;
}

.notification-time {
    font-size: 12px;
    color: var(--bs-gray-500);
    white-space: nowrap;
}

.notification-message {
    color: var(--bs-gray-600);
    margin: 0 0 12px 0;
    line-height: 1.5;
}

.notification-meta {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 12px;
}

.meta-tag {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    background: var(--bs-light);
    border-radius: 6px;
    font-size: 12px;
    color: var(--bs-gray-700);
}

.notification-actions {
    display: flex;
    gap: 8px;
    margin-top: 12px;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
}

.action-btn.primary {
    background: var(--bs-success);
    color: white;
}

.action-btn.primary:hover {
    background: var(--bs-success);
    transform: translateY(-2px);
}

.action-btn.secondary {
    background: var(--bs-light);
    color: var(--bs-gray-700);
}

.action-btn.secondary:hover {
    background: var(--bs-gray-300);
}

.notification-controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.control-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: var(--bs-light);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--bs-gray-600);
}

.control-btn:hover {
    background: var(--bs-gray-300);
    transform: scale(1.1);
}

.control-btn.delete:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
}

/* Empty state */
.empty-state {
    text-align: center;
    padding: 80px 20px;
}

.empty-icon {
    font-size: 64px;
    margin-bottom: 20px;
    opacity: 0.5;
}

.empty-state h3 {
    font-size: 20px;
    color: var(--bs-gray-800);
    margin-bottom: 12px;
}

.empty-state p {
    color: var(--bs-gray-600);
}

/* Animations */
.notification-list-enter-active,
.notification-list-leave-active {
    transition: all 0.3s ease;
}

.notification-list-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.notification-list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

/* Responsive */
@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .header-actions {
        width: 100%;
    }

    .header-btn {
        flex: 1;
        justify-content: center;
    }

    .stats-row {
        grid-template-columns: 1fr;
    }

    .notification-item {
        flex-direction: column;
    }

    .notification-controls {
        flex-direction: row;
        justify-content: flex-end;
    }
}
</style>