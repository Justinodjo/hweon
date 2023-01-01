<template>
  <router-view :key="$route.path" />
  <el-dialog v-model="isVisible" width="80%" top="5vh" center @update:model-value="handleDialogUpdate" draggable
    :fullscreen="false" :close-on-click-modal="false" :modal-class="'custom-fade'" destroy-on-close>
    <component :is="modalComponent" v-bind="modalProps" />
  </el-dialog>
  <CookieConsent />
  <!-- Badge notification flottant -->
  <NotificationBadge v-if="isAuthenticated" />
</template>

<script>
import { mapGetters } from "vuex";
import CookieConsent from "@/views/CookieConsent.vue";
import NotificationBadge from "@/components/card/NotificationBadge.vue";
import { NotificationScheduler } from "@/mixins/notificationScheduler";
export default {
  data() {
    return {
      notificationScheduler: null,
      schedulerInterval: null,
    };
  },
  mounted() {
    this.$store.dispatch("auth/checkAuth").then((isAuth) => {
      if (isAuth) {
        this.setupNotifications();
      } else {
        // Déconnecter l'utilisateur si token invalide
        this.$store.dispatch("auth/logout");
      }
    });
    this.loadExternalScripts();
  },
  computed: {
    ...mapGetters("modal", ["isVisible", "modalComponent", "modalProps"]),
    ...mapGetters("auth", ["isAuthenticated"]),
  },
  components: { CookieConsent, NotificationBadge },
  watch: {
    isAuthenticated(isAuth) {
      if (isAuth) {
        this.setupNotifications();
      } else {
        this.cleanupNotifications();
      }
    },
  },

  beforeUnmount() {
    this.cleanupNotifications();
  },
  methods: {
    handleDialogUpdate(val) {
      if (!val) {
        this.$store.dispatch("modal/closeModal");
      }
    },

    async setupNotifications() {
      if (!this.isAuthenticated) return;

      try {
        // 1. Initialiser le système de notifications
        await this.$store.dispatch("notifications/initialize");

        // 2. Demander la permission pour les notifications browser
        if ("Notification" in window && Notification.permission === "default") {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            console.log("✅ Notifications browser activées");
          }
        }

        // 3. Initialiser le scheduler
        this.initializeScheduler();

      } catch (error) {
        console.error("❌ Erreur setup notifications:", error);
      }
    },

    initializeScheduler() {
      if (this.notificationScheduler) return;

      this.notificationScheduler = new NotificationScheduler(this.$store);

      // Vérifier les échéances toutes les heures
      this.schedulerInterval = setInterval(() => {
        if (this.isAuthenticated) {
          this.notificationScheduler.checkExpiringContracts();
          this.notificationScheduler.checkLatePayments();
        }
      }, 3600000); // 1 heure

      console.log("✅ Scheduler de notifications démarré");
    },

    cleanupNotifications() {
      // Nettoyer le scheduler
      if (this.schedulerInterval) {
        clearInterval(this.schedulerInterval);
        this.schedulerInterval = null;
      }

      // Nettoyer les notifications
      this.$store.dispatch("notifications/cleanup");

      console.log("🧹 Notifications nettoyées");
    },

    loadExternalScripts() {
      import("@/assets/vendor/tiny-slider/tiny-slider.js");
      import("@/assets/vendor/glightbox/js/glightbox.js");
      import("@/assets/js/functions.js");
    },
  },
}
</script>
<style>
.custom-fade {
  animation: fadeIn 0.3s ease, fadeOut 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }

  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

.custom-fade {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.notification-toast {
  max-width: 400px;
}
</style>