import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueTelInput from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";
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
// 🔹 Import AOS et Rellax
import AOS from "aos";
import "aos/dist/aos.css";
import Rellax from "rellax";
import PrimeVue from "primevue/config";

const globalOptions = {
  mode: "international",
  defaultCountry: "BJ",
  preferredCountries: ["BJ", "FR", "TG", "CI", "SN", "CM"],
  validCharactersOnly: true,
  dropdownOptions: {
    showDialCodeInSelection: true,
    showFlags: true,
    showSearchBox: true,
  },
};

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
  .use(VueTelInput, globalOptions)
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

// 🔹 Initialisation AOS
AOS.init({
  duration: 1200,
  easing: "ease-in-out",
  once: true, // animation once
});

// 🔹 Initialisation Rellax pour tout élément avec la classe .parallax
// Tu peux aussi le mettre dans un composant si tu veux un scope limité
new Rellax(".parallax", {
  speed: -2,
  center: true,
});
// 🚀 Lancer WebSocket si utilisateur est déjà connecté
const token = store.getters["auth/isAuthenticated"];
const userId = store.getters["auth/userInfo"];
// Assure-toi que tu n'initialises pas le WebSocket plusieurs fois
let socketStarted = false;
if (token && userId && !socketStarted) {
  store.dispatch("notifications/start");
  console.log("🧠 WebSocket démarré avec userId:", userId);
}
