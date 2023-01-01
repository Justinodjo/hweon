import { createStore } from "vuex";
import categorie from "./modules/categorie.js";
import typeBiens from "./modules/typeBiens.js";
import biensImmobiliers from "./modules/biensImmobiliers.js";
import detailsBiensImmobiliers from "./modules/detailsBiensImmobiliers.js";
import consentements from "./modules/consentements.js";
import sousService from "./modules/sousService.js";
import produits from "./modules/produits.js";
import reservation from "./modules/reservation.js";
import auth from "./modules/auth.js";
import role from "./modules/role.js";
import user from "./modules/user.js";
import avis from "./modules/avis.js";
import modal from "./modules/modal.js";
import departements from "./modules/departements.js";
import types from "./modules/types.js";
import pays from "./modules/pays.js";
import communes from "./modules/communes.js";
import arrondissements from "./modules/arrondissements.js";
import quartiers from "./modules/quartiers.js";
import permissions from "./modules/permissions.js";
import notifications from "./modules/notifications.js";
import fichiers from "./modules/fichiers.js";
import contrats from "./modules/contrats.js";
import interventions from "./modules/interventions.js";
import paiements from "./modules/paiement.js";
import favoris from "./modules/favoris.js";
import offres from "./modules/offres";
import passwordReset from "./modules/passwordReset";
import suggestions from "./modules/suggestions";
export default createStore({
  modules: {
    auth,
    user,
    role,
    categorie,
    typeBiens,
    types,
    pays,
    communes,
    permissions,
    arrondissements,
    quartiers,
    avis,
    modal,
    departements,
    biensImmobiliers,
    consentements,
    contrats,
    sousService,
    interventions,
    produits,
    reservation,
    detailsBiensImmobiliers,
    notifications,
    fichiers,
    paiements,
    suggestions,
    favoris,
    offres,
    passwordReset,
  },
  // plugins: [
  //   createPersistedState({
  //     key: "e-immo-store", // Clé pour localStorage
  //     paths: ["auth.user", "auth.token", "auth.userRoles"], // Chemins à persister
  //     storage: window.localStorage,
  //   }),
  // ],
});
