<template>
    <!-- ============================================ -->
    <!-- NOTIFICATION BADGE COMPONENT -->
    <!-- ============================================ -->
    <div class="notification-badge-container">
        <!-- Bouton flottant -->
        <button @click.stop="togglePanel" class="notification-btn" :class="{ 'has-unread': unreadCount > 0 }">
            <i class="bi bi-bell-fill"></i>
            <span v-if="unreadCount > 0" class="badge-count">
                {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
        </button>

        <!-- Panneau de notifications -->
        <transition name="slide-fade">
            <div v-if="showPanel" class="notification-panel" @click.stop>
                <!-- En-tête -->
                <div class="panel-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">
                            <i class="bi bi-bell me-2"></i>
                            Notifications
                            <span class="badge bg-primary ms-2">{{ unreadCount }}</span>
                        </h5>
                        <div class="d-flex gap-2">
                            <!-- Bouton son -->
                            <button @click="toggleSound" class="btn btn-sm btn-light"
                                :title="sonAutorise ? 'Désactiver le son' : 'Activer le son'">
                                <i class="bi" :class="sonAutorise ? 'bi-volume-up-fill' : 'bi-volume-mute-fill'"></i>
                            </button>

                            <!-- Bouton marquer tout lu -->
                            <button v-if="unreadCount > 0" @click="markAllAsRead" class="btn btn-sm btn-primary"
                                title="Marquer tout comme lu">
                                <i class="bi bi-check2-all"></i>
                            </button>

                            <!-- Bouton fermer -->
                            <button @click="togglePanel" class="btn btn-sm btn-light">
                                <i class="bi bi-x-lg"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Filtres -->
                    <div class="mt-3">
                        <div class="btn-group btn-group-sm w-100" role="group">
                            <button v-for="filter in filters" :key="filter.value" @click="currentFilter = filter.value"
                                class="btn"
                                :class="currentFilter === filter.value ? 'btn-primary' : 'btn-outline-primary'">
                                {{ filter.label }}
                                <span v-if="filter.count > 0" class="ms-1">({{ filter.count }})</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Liste des notifications -->
                <div class="panel-body">
                    <div v-if="filteredNotifications.length === 0" class="empty-state">
                        <i class="bi bi-inbox fs-1 text-muted"></i>
                        <p class="text-muted mt-3">Aucune notification</p>
                    </div>

                    <div v-else class="notifications-list">
                        <div v-for="notif in filteredNotifications" :key="notif.id" class="notification-item"
                            :class="{ 'unread': !notif.lu, [`type-${notif.typeNotifications}`]: true }"
                            @click="handleNotificationClick(notif)">

                            <!-- Icône -->
                            <div class="notif-icon">
                                <i class="bi" :class="getNotificationIcon(notif.typeNotifications)"></i>
                            </div>

                            <!-- Contenu -->
                            <div class="notif-content">
                                <div class="d-flex justify-content-between align-items-start mb-1">
                                    <h6 class="mb-0">{{ notif.titre }}</h6>
                                    <small class="text-muted">{{ getRelativeTime(notif.dateNotification) }}</small>
                                </div>
                                <p class="mb-1 small">{{ notif.message || notif.contenu }}</p>

                                <!-- Badge priorité -->
                                <span v-if="notif.priority && notif.priority !== 'MEDIUM'" class="badge"
                                    :class="getPriorityBadgeClass(notif.priority)">
                                    {{ notif.priority }}
                                </span>
                            </div>

                            <!-- Actions -->
                            <div class="notif-actions">
                                <button @click.stop="markAsRead(notif.id)" v-if="!notif.lu" class="btn btn-sm btn-light"
                                    title="Marquer comme lu">
                                    <i class="bi bi-check2"></i>
                                </button>
                                <button @click.stop="removeNotification(notif.id)" class="btn btn-sm btn-light"
                                    title="Supprimer">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Bouton tout effacer -->
                    <div v-if="notifications.length > 0" class="panel-footer">
                        <button @click="confirmClearAll" class="btn btn-sm btn-outline-danger w-100">
                            <i class="bi bi-trash me-2"></i>
                            Tout effacer
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Overlay -->
        <div v-if="showPanel" class="notification-overlay" @click="togglePanel">
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { ElMessageBox, ElMessage } from 'element-plus';

export default {
    name: 'NotificationBadge',

    data() {
        return {
            showPanel: false,
            currentFilter: 'all',
        };
    },

    computed: {
        ...mapGetters('notifications', [
            'notifications',
            'unreadCount',
            'unreadNotifications',
            'readNotifications',
            'isConnected',
        ]),

        sonAutorise() {
            return this.$store.state.notifications.sonAutorise;
        },

        filters() {
            return [
                {
                    label: 'Toutes',
                    value: 'all',
                    count: this.notifications.length
                },
                {
                    label: 'Non lues',
                    value: 'unread',
                    count: this.unreadCount
                },
                {
                    label: 'Lues',
                    value: 'read',
                    count: this.readNotifications.length
                },
            ];
        },

        filteredNotifications() {
            switch (this.currentFilter) {
                case 'unread':
                    return this.unreadNotifications;
                case 'read':
                    return this.readNotifications;
                default:
                    return this.notifications;
            }
        },
    },
    // Fermer le panneau au clic en dehors
    mounted() {
        document.addEventListener('click', (e) => {
            if (this.showPanel && !this.$el.contains(e.target)) {
                this.showPanel = false;
            }
        });
        // Ajouter au prochain tick pour éviter le clic initial
        this.$nextTick(() => {
            document.addEventListener('click', this.handleClickOutside);
        });
    },
    beforeUnmount() {
        if (this.handleClickOutside) {
            document.removeEventListener('click', this.handleClickOutside);
        }
    },
    methods: {
        ...mapActions('notifications', [
            'markAsRead',
            'markAllAsRead',
            'removeNotification',
            'clearAll',
            'toggleSound',
        ]),

        togglePanel() {
            this.showPanel = !this.showPanel;
        },


        handleNotificationClick(notif) {
            // Marquer comme lu
            if (!notif.lu) {
                this.markAsRead(notif.id);
            }

            // Naviguer si nécessaire
            if (notif.data && notif.data.contratId) {
                this.$router.push({
                    name: 'ContratDetails',
                    params: { id: notif.data.contratId }
                });
                this.togglePanel();
            }
        },

        async confirmClearAll() {
            try {
                await ElMessageBox.confirm(
                    'Êtes-vous sûr de vouloir supprimer toutes les notifications ?',
                    'Confirmation',
                    {
                        confirmButtonText: 'Oui, supprimer',
                        cancelButtonText: 'Annuler',
                        type: 'warning',
                    }
                );

                await this.clearAll();
                ElMessage.success('Notifications supprimées');

            } catch {
                // Annulé
            }
        },

        getNotificationIcon(type) {
            const icons = {
                INFO: 'bi-info-circle-fill',
                SUCCESS: 'bi-check-circle-fill',
                WARNING: 'bi-exclamation-triangle-fill',
                ERROR: 'bi-x-circle-fill',
                RAPPEL: 'bi-alarm-fill',
                PAIEMENT: 'bi-credit-card-fill',
            };
            return icons[type] || 'bi-bell-fill';
        },

        getPriorityBadgeClass(priority) {
            const classes = {
                URGENT: 'bg-danger',
                HIGH: 'bg-warning',
                MEDIUM: 'bg-info',
                LOW: 'bg-secondary',
            };
            return classes[priority] || 'bg-info';
        },

        getRelativeTime(date) {
            if (!date) return '';

            const now = new Date();
            const past = new Date(date);
            const diffMs = now - past;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return 'À l\'instant';
            if (diffMins < 60) return `Il y a ${diffMins} min`;
            if (diffHours < 24) return `Il y a ${diffHours}h`;
            if (diffDays === 1) return 'Hier';
            if (diffDays < 7) return `Il y a ${diffDays} jours`;

            return past.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short'
            });
        },
    },
};
</script>

<style scoped>
/* ============================================ */
/* STYLES NOTIFICATION BADGE */
/* ============================================ */

.notification-badge-container {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 1000;
}

.notification-btn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    position: relative;
}

.notification-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.notification-btn.has-unread {
    animation: pulse 2s infinite;
}

@keyframes pulse {

    0%,
    100% {
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    50% {
        box-shadow: 0 4px 25px rgba(102, 126, 234, 0.8);
    }
}

.badge-count {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ff4757;
    color: white;
    border-radius: 12px;
    padding: 2px 6px;
    font-size: 11px;
    font-weight: bold;
    min-width: 20px;
    text-align: center;
}

.notification-panel {
    position: absolute;
    bottom: 80px;
    right: 0;
    width: 400px;
    max-height: 600px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.panel-header {
    padding: 20px;
    border-bottom: 1px solid #e9ecef;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.panel-header h5 {
    color: white;
}

.panel-header .btn-light {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
}

.panel-header .btn-light:hover {
    background: rgba(255, 255, 255, 0.3);
}

.panel-body {
    flex: 1;
    overflow-y: auto;
    max-height: 450px;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
}

.notifications-list {
    padding: 10px;
}

.notification-item {
    display: flex;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 8px;
    background: #f8f9fa;
    transition: all 0.3s ease;
    cursor: pointer;
}

.notification-item:hover {
    background: #e9ecef;
    transform: translateX(-4px);
}

.notification-item.unread {
    background: #e3f2fd;
    border-left: 4px solid #2196f3;
}

.notification-item.type-ERROR {
    border-left-color: #f44336;
}

.notification-item.type-WARNING {
    border-left-color: #ff9800;
}

.notification-item.type-SUCCESS {
    border-left-color: #4caf50;
}

.notif-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    font-size: 20px;
}

.type-INFO .notif-icon {
    color: #2196f3;
}

.type-ERROR .notif-icon {
    color: #f44336;
}

.type-WARNING .notif-icon {
    color: #ff9800;
}

.type-SUCCESS .notif-icon {
    color: #4caf50;
}

.type-RAPPEL .notif-icon {
    color: #9c27b0;
}

.type-PAIEMENT .notif-icon {
    color: #00bcd4;
}

.notif-content {
    flex: 1;
    min-width: 0;
}

.notif-content h6 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
}

.notif-content p {
    color: #666;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.notif-actions {
    display: flex;
    flex-direction: column;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.notification-item:hover .notif-actions {
    opacity: 1;
}

.notif-actions .btn {
    padding: 4px 8px;
}

.panel-footer {
    padding: 15px;
    border-top: 1px solid #e9ecef;
}

.notification-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: -1;
}

/* Animations */
.slide-fade-enter-active {
    animation: slideIn 0.3s ease-out;
}

.slide-fade-leave-active {
    animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideOut {
    from {
        opacity: 1;
        transform: translateY(0);
    }

    to {
        opacity: 0;
        transform: translateY(20px);
    }
}

/* Scrollbar personnalisée */
.panel-body::-webkit-scrollbar {
    width: 6px;
}

.panel-body::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.panel-body::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
}

.panel-body::-webkit-scrollbar-thumb:hover {
    background: #555;
}

/* Responsive */
@media (max-width: 768px) {
    .notification-badge-container {
        bottom: 20px;
        right: 20px;
    }

    .notification-btn {
        width: 50px;
        height: 50px;
        font-size: 20px;
    }

    .notification-panel {
        width: calc(100vw - 40px);
        max-width: 400px;
    }
}
</style>