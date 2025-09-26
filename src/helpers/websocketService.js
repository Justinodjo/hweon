// src/services/websocketService.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import store from "@/store";
import { getToken } from "@/helpers/auth";
import { API_URLS } from "@/config/api";

let stompClient = null;

if (!API_URLS.API_BASE) {
  console.error("❌ VITE_API_URL est manquant dans .env");
}
export function connectWebSocket(userId, onMessageReceived) {
  const token = getToken("token");

  const socket = () => new SockJS(`${API_URLS.API_BASE}/ws`);

  stompClient = new Client({
    webSocketFactory: socket,
    reconnectDelay: 5000,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: (str) => {
      // Commenter la ligne suivante pour désactiver les logs
      console.log(str);
    },
    onConnect: () => {
      console.log("✅ WebSocket connecté");

      // Topic public
      stompClient.subscribe("/topic/notifications", (msg) => {
        const payload = JSON.parse(msg.body);
        onMessageReceived(payload);
      });

      // Topic privé pour l'utilisateur
      stompClient.subscribe(`/queue/user-${userId}`, (msg) => {
        const payload = JSON.parse(msg.body);
        onMessageReceived(payload);
      });
    },
    onStompError: (frame) => {
      console.error("❌ Erreur STOMP :", frame);
    },
    onWebSocketError: (event) => {
      console.error("❌ Erreur WebSocket :", event);
    },
  });

  stompClient.activate();
}

export function disconnectWebSocket() {
  if (stompClient !== null && stompClient.active) {
    stompClient.deactivate();
    console.log("🔌 WebSocket déconnecté");
  }
}
export function sendMessage(destination, message) {
  if (stompClient && stompClient.active) {
    stompClient.publish({
      destination: destination,
      body: JSON.stringify(message),
    });
  } else {
    console.error("WebSocket n'est pas connecté.");
  }
}
