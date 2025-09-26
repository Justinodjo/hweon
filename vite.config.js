// Description: Configuration de Vite pour le projet Vue.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import dotenv from "dotenv";

// Charge les variables d’environnement depuis `.env`
dotenv.config();

const apiUrl = process.env.VITE_API_URL;
// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: "globalThis",
  },
  build: {
    chunkSizeWarningLimit: 2000,
    sourcemap: process.env.NODE_ENV === "development",
    // sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["tiny-slider", "lodash", "axios"], // Diviser les libs externes en chunks séparés
        },
      },
    },
  },
  resolve: {
    alias: {
      extensions: [".js", ".vue", ".json"],
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".vue", ".json", ".ts", ".jsx", ".tsx"],
  },
  server: {
    // port: 3000, // Port de l'application frontend
    open: true, // Ouvre le navigateur par défaut
    hmr: {
      overlay: false, // Désactive l'overlay d'erreur, qui peut bloquer le second onglet
      clientPort: 5173, // Spécifie explicitement le port HMR
    },
    proxy: {
      "/api": {
        // target: "http://localhost:8081", // Point vers votre backend en HTTP
        target: apiUrl, // Point vers votre backend en HTTPS
        changeOrigin: true, // Modifie l'origine de la requête pour celle de l'API
        secure: true, // Assurez-vous que la connexion est sécurisée
      },
      "/fichier": {
        // target: "http://localhost:8081", // Même chose pour les autres routes
        target: apiUrl,
        changeOrigin: true,
        secure: false, // ou false si l'API est en HTTP local
      },
    },
  },
  plugins: [vue()],
});
