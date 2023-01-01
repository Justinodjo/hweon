import request from "@/http/request";
import {
  connectWebSocket,
  disconnectWebSocket,
  playNotificationSound,
  showBrowserNotification,
} from "@/helpers/websocketService.js";

const state = () => ({
  notifications: JSON.parse(localStorage.getItem("notifications") || "[]"),
  isConnected: false,
  sonAutorise: localStorage.getItem("sonAutorise") !== "false",
  pollingInterval: null,
  wsRetryCount: 0,
  maxRetries: 5,
});

const mutations = {
  ADD_NOTIFICATION(state, payload) {
    const notif = normalizeNotification(payload);

    // Éviter les doublons
    const exists = state.notifications.some((n) => n.id === notif.id);
    if (!exists) {
      state.notifications.unshift(notif);

      // Limiter à 100 notifications
      if (state.notifications.length > 100) {
        state.notifications = state.notifications.slice(0, 100);
      }

      saveToLocalStorage(state.notifications);
    }
  },

  UPDATE_NOTIFICATION(state, updatedNotif) {
    const index = state.notifications.findIndex(
      (n) => n.id === updatedNotif.id
    );
    if (index !== -1) {
      state.notifications[index] = {
        ...state.notifications[index],
        ...updatedNotif,
      };
      saveToLocalStorage(state.notifications);
    }
  },

  MARK_AS_READ(state, notifId) {
    const notif = state.notifications.find((n) => n.id === notifId);
    if (notif) {
      notif.lu = true;
      saveToLocalStorage(state.notifications);
    }
  },

  MARK_ALL_AS_READ(state) {
    state.notifications = state.notifications.map((n) => ({ ...n, lu: true }));
    saveToLocalStorage(state.notifications);
  },

  REMOVE_NOTIFICATION(state, notifId) {
    state.notifications = state.notifications.filter((n) => n.id !== notifId);
    saveToLocalStorage(state.notifications);
  },

  // ❌ Vider toutes les notifications
  CLEAR(state) {
    state.notifications = [];
    localStorage.removeItem("notifications");
  },

  // 🔌 Mettre à jour l'état de connexion
  SET_CONNECTED(state, value) {
    state.isConnected = value;
  },

  SET_SOUND(state, value) {
    state.sonAutorise = value;
    localStorage.setItem("sonAutorise", value);
  },

  SET_NOTIFICATIONS(state, notifications) {
    state.notifications = notifications.map(normalizeNotification);
    saveToLocalStorage(state.notifications);
  },
  SET_POLLING_INTERVAL(state, interval) {
    state.pollingInterval = interval;
  },

  INCREMENT_RETRY(state) {
    state.wsRetryCount++;
  },

  RESET_RETRY(state) {
    state.wsRetryCount = 0;
  },
};

const actions = {
  start({ commit, dispatch, rootGetters }) {
    const user = rootGetters["auth/currentUser"];
    const jwt = rootGetters["auth/token"];
    if (!user || !user.id || !jwt) {
      console.warn("Aucun utilisateur connecté, WebSocket non initialisé.");
      return;
    }

    const userId = user.id;

    // Charger les notifications existantes depuis le backend
    dispatch("loadNotifications");
    connectWebSocket(userId, (rawEvent) => {
      try {
        console.debug("WebSocket raw message:", rawEvent);
        // Parser le message reçu
        let payload = rawEvent;

        // Si c'est un MessageEvent, extraire data
        if (rawEvent && typeof rawEvent === "object" && "data" in rawEvent) {
          payload = rawEvent.data;
        }

        // Si c'est une string, parser le JSON
        if (typeof payload === "string") {
          try {
            payload = JSON.parse(payload.trim());
          } catch (e) {
            console.warn("Impossible de parser le message:", payload);
            payload = { message: payload };
          }
        }

        if (!payload) {
          console.warn("Notification WS reçue vide / null :", rawEvent);
          return;
        }
        // Normaliser la notification
        const notif = {
          id: payload.id || Date.now(),
          titre: payload.titre || payload.title || "Nouvelle notification",
          contenu: payload.contenu || payload.message || "",
          message: payload.message || payload.contenu || "",
          dateNotification:
            payload.dateNotification || new Date().toISOString(),
          lu: false,
          typeNotifications: payload.typeNotifications || "INFO",
          raw: payload, // Garder le payload original pour debug
        };

        commit("ADD_NOTIFICATION", notif);

        // 🔔 Effets visuels et sonores
        if (notif.contenu || notif.message) {
          playNotificationSound();
          showBrowserNotification(notif);

          // Toast Element Plus
          import("element-plus").then(({ ElNotification }) => {
            ElNotification({
              title: notif.titre,
              message: notif.contenu || notif.message,
              type: "info",
              duration: 5000,
              position: "top-right",
            });
          });
        }
      } catch (e) {
        console.error("Erreur parsing notification WS:", e, raw);
      }
    });

    commit("SET_CONNECTED", true);
  },
  async initialize({ dispatch, rootGetters }) {
    const user = rootGetters["auth/currentUser"];
    if (!user || !user.id) {
      console.warn("❌ Aucun utilisateur connecté");
      return;
    }

    try {
      // 1. Charger les notifications existantes
      await dispatch("loadNotifications");

      // 2. Démarrer WebSocket
      await dispatch("startWebSocket");

      // 3. Démarrer le polling de secours
      dispatch("startPolling");

      console.log("✅ Système de notifications initialisé");
    } catch (error) {
      console.error("❌ Erreur initialisation notifications:", error);
    }
  },
  async startWebSocket({ commit, dispatch, rootGetters, state }) {
    const user = rootGetters["auth/currentUser"];
    if (!user || !user.id) return;

    try {
      connectWebSocket(user.id, (rawEvent) => {
        try {
          const payload = parseWebSocketMessage(rawEvent);
          if (!payload) return;

          // Ajouter la notification
          commit("ADD_NOTIFICATION", payload);

          // Effets visuels et sonores
          dispatch("showNotificationEffects", payload);

          // Reset retry count en cas de succès
          commit("RESET_RETRY");
        } catch (error) {
          console.error("❌ Erreur traitement notification WS:", error);
        }
      });

      commit("SET_CONNECTED", true);
      console.log("✅ WebSocket connecté");
    } catch (error) {
      console.error("❌ Erreur connexion WebSocket:", error);

      // Retry avec backoff exponentiel
      if (state.wsRetryCount < state.maxRetries) {
        commit("INCREMENT_RETRY");
        const delay = Math.min(1000 * Math.pow(2, state.wsRetryCount), 30000);

        setTimeout(() => {
          console.log(
            `🔄 Tentative de reconnexion WebSocket (${state.wsRetryCount}/${state.maxRetries})`
          );
          dispatch("startWebSocket");
        }, delay);
      }
    }
  },
  stopWebSocket({ commit }) {
    disconnectWebSocket();
    commit("SET_CONNECTED", false);
    console.log("⏹️ WebSocket déconnecté");
  },
  stop({ commit }) {
    disconnectWebSocket();
    commit("SET_CONNECTED", false);
  },
  // ============================================
  // CHARGEMENT DES NOTIFICATIONS
  // ============================================

  async loadNotifications({ commit }) {
    try {
      const response = await request.get("/api/notifications/user");
      if (response.data && Array.isArray(response.data)) {
        commit("SET_NOTIFICATIONS", response.data);
        console.log(`✅ ${response.data.length} notifications chargées`);
      }
    } catch (error) {
      console.error("❌ Erreur chargement notifications:", error);
    }
  },
  // ============================================
  // POLLING (BACKUP)
  // ============================================

  startPolling({ commit, dispatch, state }) {
    // Éviter les doublons
    if (state.pollingInterval) {
      clearInterval(state.pollingInterval);
    }

    // Polling toutes les 30 secondes
    const interval = setInterval(() => {
      dispatch("checkNewNotifications");
    }, 30000);

    commit("SET_POLLING_INTERVAL", interval);
    console.log("✅ Polling démarré (30s)");
  },

  stopPolling({ state, commit }) {
    if (state.pollingInterval) {
      clearInterval(state.pollingInterval);
      commit("SET_POLLING_INTERVAL", null);
      console.log("⏹️ Polling arrêté");
    }
  },

  async checkNewNotifications({ state, commit }) {
    try {
      const response = await request.get("/api/notifications/user/unread");
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach((notif) => {
          const exists = state.notifications.some((n) => n.id === notif.id);
          if (!exists) {
            commit("ADD_NOTIFICATION", notif);
          }
        });
      }
    } catch (error) {
      console.error("❌ Erreur vérification nouvelles notifications:", error);
    }
  },
  // ============================================
  // ACTIONS SUR LES NOTIFICATIONS
  // ============================================

  async markAsRead({ commit }, notifId) {
    try {
      await request.put(`/api/notifications/${notifId}/read`);
      commit("MARK_AS_READ", notifId);
    } catch (error) {
      console.error("❌ Erreur marquage notification:", error);
      commit("MARK_AS_READ", notifId); // Marquer quand même côté client
    }
  },

  async markAllAsRead({ commit }) {
    try {
      await request.put("/api/notifications/read-all");
      commit("MARK_ALL_AS_READ");
    } catch (error) {
      console.error("❌ Erreur marquage toutes notifications:", error);
      commit("MARK_ALL_AS_READ");
    }
  },

  async removeNotification({ commit }, notifId) {
    try {
      await request.delete(`/api/notifications/${notifId}`);
      commit("REMOVE_NOTIFICATION", notifId);
    } catch (error) {
      console.error("❌ Erreur suppression notification:", error);
      commit("REMOVE_NOTIFICATION", notifId);
    }
  },

  async clearAll({ commit }) {
    try {
      await request.delete("/api/notifications/clear");
      commit("CLEAR_ALL");
    } catch (error) {
      console.error("❌ Erreur nettoyage notifications:", error);
      commit("CLEAR_ALL");
    }
  },

  // ============================================
  // CRÉATION DE NOTIFICATIONS
  // ============================================

  async createNotification(
    { dispatch },
    { userId, type, title, message, data, priority }
  ) {
    try {
      const response = await request.post("/api/notifications/create", {
        utilisateurId: userId,
        typeNotifications: type || "INFO",
        titre: title,
        message: message,
        data: data,
        priority: priority || "MEDIUM",
      });

      return response.data;
    } catch (error) {
      console.error("❌ Erreur création notification:", error);
      throw error;
    }
  },

  async createRappelEcheance({ dispatch }, { contrat, recipientId }) {
    const dateFin = new Date(contrat.dateFin);
    const today = new Date();
    const daysUntilExpiry = Math.ceil(
      (dateFin - today) / (1000 * 60 * 60 * 24)
    );

    return dispatch("createNotification", {
      userId: recipientId,
      type: "RAPPEL",
      title: "Contrat arrivant à échéance",
      message: `Votre contrat ${contrat.referenceContrat} expire dans ${daysUntilExpiry} jours`,
      data: {
        contratId: contrat.id,
        contratRef: contrat.referenceContrat,
        dateFin: contrat.dateFin,
      },
      priority: daysUntilExpiry <= 7 ? "URGENT" : "MEDIUM",
    });
  },
  // ============================================
  // EFFETS VISUELS ET SONORES
  // ============================================

  showNotificationEffects({ state }, notification) {
    // Son
    if (state.sonAutorise) {
      playNotificationSound();
    }

    // Notification navigateur
    showBrowserNotification(notification);

    // Toast Element Plus
    ElNotification({
      title: notification.titre || notification.title || "Notification",
      message: notification.contenu || notification.message,
      type: getNotificationType(notification.typeNotifications),
      duration: 5000,
      position: "top-right",
      customClass: "notification-toast",
    });
  },

  toggleSound({ commit, state }) {
    commit("SET_SOUND", !state.sonAutorise);
  },

  // ============================================
  // CLEANUP
  // ============================================

  cleanup({ dispatch }) {
    dispatch("stopWebSocket");
    dispatch("stopPolling");
  },
};

const getters = {
  notifications: (state) => state.notifications,
  unreadCount: (state) => state.notifications.filter((n) => !n.lu).length,
  isConnected: (state) => state.isConnected,
  unreadNotifications: (state) => state.notifications.filter((n) => !n.lu),
  readNotifications: (state) => state.notifications.filter((n) => n.lu),
  notificationsByType: (state) => (type) => {
    return state.notifications.filter((n) => n.typeNotifications === type);
  },

  notificationsByPriority: (state) => (priority) => {
    return state.notifications.filter((n) => n.priority === priority);
  },

  recentNotifications:
    (state) =>
    (limit = 5) => {
      return state.notifications.slice(0, limit);
    },
};

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

function normalizeNotification(payload) {
  return {
    id: payload.id || Date.now(),
    titre: payload.titre || payload.title || "Notification",
    contenu: payload.contenu || payload.message || "",
    message: payload.message || payload.contenu || "",
    dateNotification: payload.dateNotification || new Date().toISOString(),
    lu: payload.lu ?? payload.notificationsLu ?? false,
    typeNotifications: payload.typeNotifications || payload.type || "INFO",
    priority: payload.priority || "MEDIUM",
    data: payload.data || {},
  };
}

function parseWebSocketMessage(rawEvent) {
  let payload = rawEvent;

  // MessageEvent
  if (rawEvent && typeof rawEvent === "object" && "data" in rawEvent) {
    payload = rawEvent.data;
  }

  // String JSON
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload.trim());
    } catch (e) {
      console.warn("⚠️ Message non-JSON:", payload);
      return null;
    }
  }

  return payload;
}

function saveToLocalStorage(notifications) {
  try {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  } catch (error) {
    console.error("❌ Erreur sauvegarde localStorage:", error);
  }
}

function getNotificationType(type) {
  const typeMap = {
    SUCCESS: "success",
    ERROR: "error",
    WARNING: "warning",
    INFO: "info",
  };
  return typeMap[type] || "info";
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
