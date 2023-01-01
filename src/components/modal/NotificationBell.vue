<template>
    <div class="notification-wrapper">
        <!-- Icône de cloche avec badge -->
        <el-badge :value="unreadCount" :max="9" class="notification-icon">
            <el-button @click="toggleDrawer" circle>
                <i class="el-icon-bell"></i>
            </el-button>
        </el-badge>

        <!-- Drawer des notifications -->
        <el-drawer v-model="drawer" title="Notifications" direction="rtl" size="30%" @open="markAllAsRead">
            <template #default>
                <div v-if="notifications.length > 0">
                    <el-timeline>
                        <el-timeline-item v-for="(notif, i) in notifications" :key="i"
                            :timestamp="formatDate(notif.dateNotification)" :type="notif.lu ? 'info' : 'primary'"
                            @click="markAsRead(notif)"
                            class="cursor-pointer hover:bg-gray-100 rounded-md p-2 transition">
                            <div class="font-medium text-gray-800">
                                {{ notif.titre || "Nouvelle notification" }}
                            </div>
                            <div class="text-sm text-gray-600">
                                {{ notif.message || notif.contenu }}
                            </div>
                        </el-timeline-item>
                    </el-timeline>
                </div>
                <div v-else class="text-center text-gray-400 text-sm mt-4">
                    Aucune notification
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const router = useRouter();

const store = useStore();
const drawer = ref(false);

const notifications = computed(() => store.getters["notifications/notifications"]);
const unreadCount = computed(() =>
    store.getters["notifications/notifications"].filter((n) => !n.lu).length
);

const toggleDrawer = () => {
    drawer.value = !drawer.value;
};

// Marquer une seule notification comme lue
function markAsRead(notification) {
    // 1️⃣ Met à jour la notification comme lue
    store.commit("notifications/UPDATE_NOTIFICATION", {
        ...notification,
        lu: true,
    });

    // 2️⃣ Détermine la redirection (selon type ou lien)
    if (notification.lien) {
        router.push(notification.lien);
    } else if (notification.type === "contrat" && notification.idObjet) {
        router.push(`/contrats/${notification.idObjet}`);
    } else if (notification.type === "message" && notification.idObjet) {
        router.push(`/messages/${notification.idObjet}`);
    } else {
        console.log("Aucune redirection associée à cette notification.");
    }
}


// Marquer toutes comme lues
function markAllAsRead() {
    store.commit("notifications/MARK_ALL_AS_READ");
}

function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("fr-FR", {
        dateStyle: "short",
        timeStyle: "short",
    });
}
</script>

<style scoped>
.notification-wrapper {
    position: relative;
}

.notification-icon {
    margin-right: 10px;
}
</style>
