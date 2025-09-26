import {
  connectWebSocket,
  disconnectWebSocket,
} from "@/helpers/websocketService.js";

const state = () => ({
  notifications: [],
  isConnected: false,
});

const mutations = {
  ADD_NOTIFICATION(state, payload) {
    state.notifications.unshift(payload);
  },
  SET_CONNECTED(state, value) {
    state.isConnected = value;
  },
  CLEAR(state) {
    state.notifications = [];
  },
};

const actions = {
  start({ commit, rootGetters }) {
    const userId = rootGetters["auth/userInfo"];
    if (!userId) {
      console.warn("Aucun utilisateur connecté, WebSocket non initialisé.");
      return;
    }

    connectWebSocket(userId, (notif) => {
      commit("ADD_NOTIFICATION", notif);

      // Bonus : déclencher un toast
      if (notif?.contenu) {
        import("element-plus").then(({ ElNotification }) => {
          ElNotification({
            title: "Nouvelle notification",
            message: notif.contenu,
            type: "info",
          });
        });
      }
    });

    commit("SET_CONNECTED", true);
  },

  stop({ commit }) {
    disconnectWebSocket();
    commit("SET_CONNECTED", false);
  },
};

const getters = {
  notifications: (state) => state.notifications,
  unreadCount: (state) => state.notifications.length,
  isConnected: (state) => state.isConnected,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
