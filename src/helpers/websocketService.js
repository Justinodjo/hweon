// src/services/websocketService.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import store from "@/store";
import { getToken } from "@/helpers/auth";
import { API_URLS } from "@/config/api";

let stompClient = null;
let isConnecting = false;

export function connectWebSocket(userId, onMessageReceived) {
  if (stompClient && stompClient.connected) {
    console.log("⚠️ WebSocket déjà connecté");
    return;
  }

  if (isConnecting) {
    console.log("⏳ Connexion WebSocket déjà en cours...");
    return;
  }

  if (!API_URLS.API_BASE) {
    console.error("❌ VITE_API_URL est manquant dans .env");
    return;
  }

  const token = getToken("token");
  if (!token) {
    console.error(
      "❌ Aucun token trouvé. Impossible d’établir la connexion WebSocket."
    );
    return;
  }

  isConnecting = true;

  const socket = () => new SockJS(`${API_URLS.API_BASE}/ws`);

  stompClient = new Client({
    webSocketFactory: socket,
    reconnectDelay: 5000,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: (str) => {
      // Décommenter pour voir les logs STOMP
      // console.log(str);
    },
    onConnect: () => {
      console.log("✅ WebSocket connecté");
      isConnecting = false;

      // 🔹 Souscription aux topics après connexion
      subscribeToTopics(userId, onMessageReceived);
    },
    onStompError: (frame) => {
      console.error("❌ Erreur STOMP :", frame);
      isConnecting = false;
    },
    onWebSocketClose: () => {
      console.warn("⚠️ WebSocket déconnecté, tentative de reconnexion...");
      isConnecting = false;
    },
    onWebSocketError: (event) => {
      console.error("❌ Erreur WebSocket :", event);
      isConnecting = false;
    },
  });

  stompClient.activate();
}

function subscribeToTopics(userId, onMessageReceived) {
  if (!stompClient || !stompClient.connected) {
    console.warn("⚠️ Tentative de souscription avant connexion STOMP");
    return;
  }

  // 🔸 Topic global
  stompClient.subscribe("/topic/notifications/global", (msg) => {
    handleIncomingMessage(msg, onMessageReceived);
  });

  // 🔸 Topic privé utilisateur
  stompClient.subscribe(`/user/queue/notifications/${userId}`, (msg) => {
    handleIncomingMessage(msg, onMessageReceived, true);
  });
}

function handleIncomingMessage(msg, onMessageReceived, isPrivate = false) {
  try {
    const payload = JSON.parse(msg.body);
    if (isPrivate) {
      playNotificationSound();
      showBrowserNotification(payload);
    }
    onMessageReceived(payload);
  } catch (e) {
    console.error("❌ Erreur parsing JSON WS :", e, msg.body);
  }
}

export function disconnectWebSocket() {
  if (stompClient && stompClient.active) {
    console.log("🔌 Déconnexion WebSocket...");
    stompClient.deactivate();
    stompClient = null;
    isConnecting = false;
  }
}

export function sendMessage(destination, message) {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination,
      body: JSON.stringify(message),
    });
  } else {
    console.error("⚠️ Impossible d'envoyer le message : STOMP non connecté.");
  }
}

export function playNotificationSound() {
  if (!store.state.notifications.sonAutorise) return;
  const audio = new Audio("/sounds/notification.mp3");
  audio.play().catch((err) => {
    console.warn("Le son n'a pas pu être joué (bloqué par navigateur)", err);
  });
}

export function showBrowserNotification(payload) {
  if (Notification.permission === "default") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("Nouvelle Notification 📩", {
          body: payload.message,
          icon: "/logo.png",
        }).onclick = () => window.focus();
      }
    });
  } else if (Notification.permission === "granted") {
    const notif = new Notification("Nouvelle Notification 📩", {
      body: payload.message,
      icon: "/logo.png",
    });
    notif.onclick = () => window.focus();
  }
}
