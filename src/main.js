import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/assets/vendor/tiny-slider/tiny-slider.css";
import "./styles/index.css";
import "@/assets/js/index.js";
import ElementPlus from "element-plus";
// import VTooltip from "v-tooltip";
import "element-plus/dist/index.css";
import VueLoading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import ScaleLoader from "vue-spinner/src/ScaleLoader.vue";
import AddBiensStepOne from "@/components/modal/AddBiensStepOne.vue";
import { connectWebSocket } from "@/helpers/websocketService.js";
import {
  Card,
  Button,
  InputText,
  Dialog,
  Textarea,
  OverlayPanel,
  Toolbar,
  DataTable,
  Column,
  MultiSelect,
} from "./components";
import ConfirmationService from "primevue/confirmationservice";
import Vue3Signature from "vue3-signature";
import PrimeVue from "primevue/config";
const app = createApp(App);
app
  .use(store)
  .use(router)
  .use(ElementPlus, { size: "small" })
  .use(PrimeVue)
  .use(ConfirmationService)
  .use(VueLoading, {
    color: "#0F417A",
    loader: "bars",
    opacity: 0.4,
  })
  // .use(VTooltip)
  .use(Vue3Signature)
  .component("Card", Card)
  .component("Button", Button)
  .component("InputText", InputText)
  .component("Dialog", Dialog)
  .component("Textarea", Textarea)
  .component("OverlayPanel", OverlayPanel)
  .component("Toolbar", Toolbar)
  .component("MultiSelect", MultiSelect)
  .component("DataTable", DataTable)
  .component("Column", Column)
  .component("scale-loader", ScaleLoader)
  .component("AddBiensStepOne", AddBiensStepOne)
  .mount("#app");

// 🚀 Lancer WebSocket si utilisateur est déjà connecté
const token = store.getters["auth/isAuthenticated"];
const userId = store.getters["auth/userInfo"];
// Assure-toi que tu n'initialises pas le WebSocket plusieurs fois
let socketStarted = false;
if (token && userId && !socketStarted) {
  store.dispatch("notifications/start");
  console.log("🧠 WebSocket démarré avec userId:", userId);
}
