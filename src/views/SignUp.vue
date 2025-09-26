<template>
    <!-- **************** MAIN CONTENT START **************** -->
    <main>
        <!-- =======================
        Main Content START -->
        <section class="vh-xxl-100 min-vh-100">

            <el-dialog v-model="showCguModal" width="60%">
                <div style="max-height: 60vh; overflow-y: auto;">
                    <p>📜 <strong>Conditions Générales d’Utilisation (CGU)</strong></p>
                    <p><em>Dernière mise à jour : 1er août 2025</em></p>

                    <p>
                        Bienvenue sur <strong>e-immo</strong>, une plateforme de gestion et de mise en relation
                        immobilière développée par <strong>ODJO TECH</strong>.
                        L’accès et l’utilisation du site impliquent l’acceptation sans réserve des présentes CGU.
                    </p>

                    <h3>1. 🧑‍💻 <strong>Objet</strong></h3>
                    <p>
                        Les présentes CGU définissent les conditions d’accès et d’utilisation de la plateforme
                        <strong>e-immo</strong> accessible à l’adresse : <a href="https://www.e-immo.com"
                            target="_blank">www.e-immo.com</a>.
                    </p>

                    <h3>2. 🛠️ <strong>Services proposés</strong></h3>
                    <ul>
                        <li>La création de comptes utilisateurs (locataires, propriétaires, notaires, fournisseurs)</li>
                        <li>La publication, consultation et gestion de biens immobiliers</li>
                        <li>La signature de contrats électroniques</li>
                        <li>Le dépôt de documents administratifs</li>
                        <li>L’interaction entre acteurs de l'immobilier</li>
                    </ul>

                    <h3>3. 👤 <strong>Accès au service</strong></h3>
                    <p>
                        L’utilisateur s’engage à fournir des informations exactes lors de l’inscription.
                    </p>
                    <p>
                        L’accès peut être suspendu ou supprimé en cas de :
                    </p>
                    <ul>
                        <li>Non-respect des présentes CGU</li>
                        <li>Utilisation frauduleuse du service</li>
                        <li>Tentative de piratage ou d’atteinte à la sécurité</li>
                    </ul>

                    <h3>4. 🔒 <strong>Compte utilisateur</strong></h3>
                    <p>
                        Chaque compte est personnel et sécurisé par un mot de passe. L’utilisateur est responsable de la
                        confidentialité de ses identifiants.
                    </p>
                    <p>
                        Toute activité suspecte doit être immédiatement signalée à <a
                            href="mailto:support@e-immo.com">support@e-immo.com</a>.
                    </p>

                    <h3>5. 📢 <strong>Obligations des utilisateurs</strong></h3>
                    <p>Chaque utilisateur s’engage à :</p>
                    <ul>
                        <li>Utiliser la plateforme de manière loyale</li>
                        <li>Ne pas publier de contenus illicites, diffamatoires ou contraires à l’ordre public</li>
                        <li>Respecter les autres utilisateurs et leurs droits</li>
                    </ul>

                    <h3>6. ❌ <strong>Comportements interdits</strong></h3>
                    <p>Sont strictement interdits :</p>
                    <ul>
                        <li>L’usurpation d’identité</li>
                        <li>Le spam ou prospection commerciale non autorisée</li>
                        <li>L’exploitation abusive des données d'autres utilisateurs</li>
                        <li>L’introduction de virus ou tentatives de piratage</li>
                    </ul>

                    <h3>7. 🔧 <strong>Responsabilités</strong></h3>
                    <p>
                        <strong>ODJO TECH</strong> ne saurait être tenue responsable :
                    </p>
                    <ul>
                        <li>Des interruptions ou dysfonctionnements temporaires</li>
                        <li>Des pertes de données en cas de négligence utilisateur</li>
                        <li>Du contenu publié par les utilisateurs</li>
                    </ul>

                    <h3>8. 🔐 <strong>Données personnelles</strong></h3>
                    <p>
                        Les données personnelles sont collectées conformément à la <a
                            href="/politique-de-confidentialite" target="_blank">Politique de Confidentialité</a>
                        disponible sur la plateforme.
                    </p>

                    <h3>9. ⚖️ <strong>Propriété intellectuelle</strong></h3>
                    <p>
                        Tous les éléments (logos, textes, interfaces, code source) sont la propriété de <strong>ODJO
                            TECH</strong> et ne peuvent être copiés ou réutilisés sans autorisation préalable.
                    </p>

                    <h3>10. 📝 <strong>Modifications des CGU</strong></h3>
                    <p>
                        Les présentes CGU peuvent être modifiées à tout moment. Les utilisateurs seront informés en cas
                        de changement majeur.
                    </p>

                    <h3>11. 📍 <strong>Droit applicable</strong></h3>
                    <p>
                        Les présentes CGU sont soumises au droit béninois. Tout litige sera soumis aux juridictions
                        compétentes de Cotonou.
                    </p>

                    <h3>12. 📬 <strong>Contact</strong></h3>
                    <p>
                        Pour toute question relative aux CGU : <a href="mailto:contact@odjo.tech">contact@odjo.tech</a>
                    </p>
                </div>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button type="primary" @click="showCguModal = false">Fermer</el-button>
                    </span>
                </template>
            </el-dialog>

            <el-dialog v-model="showPrivacyModal" title="Politique de Confidentialité" width="60%">
                x <div style="max-height: 60vh; overflow-y: auto;">
                    <p>🛡️ <strong>Politique de Confidentialité</strong></p>
                    <p><em>Dernière mise à jour : 1er août 2025</em></p>

                    <p>
                        La présente Politique de Confidentialité décrit comment <strong>[Nom de votre plateforme, ex.
                            e-immo]</strong>
                        collecte, utilise et protège les données personnelles des utilisateurs lors de l’utilisation de
                        nos services.
                    </p>

                    <h3>1. 📌 <strong>Responsable du traitement</strong></h3>
                    <p>
                        Le responsable du traitement des données est : <strong>ODJO TECH</strong><br>
                        Contact : <a href="mailto:contact@odjo.tech">contact@odjo.tech</a><br>
                        Téléphone : +229 61 36 68 96
                    </p>

                    <h3>2. 🧾 <strong>Données collectées</strong></h3>
                    <p>Nous collectons les données suivantes :</p>
                    <ul>
                        <li><strong>Identité :</strong> nom, prénom, date de naissance, adresse postale</li>
                        <li><strong>Coordonnées :</strong> email, numéro de téléphone</li>
                        <li><strong>Informations de connexion :</strong> adresse IP, mot de passe (crypté)</li>
                        <li><strong>Données techniques :</strong> type d’appareil, navigateur, cookies</li>
                        <li><strong>Documents et fichiers :</strong> pièces justificatives transmises volontairement
                        </li>
                    </ul>

                    <h3>3. 🎯 <strong>Finalités du traitement</strong></h3>
                    <p>Vos données sont collectées pour :</p>
                    <ul>
                        <li>Création et gestion de votre compte utilisateur</li>
                        <li>Mise en relation avec d'autres utilisateurs (ex. propriétaires, locataires)</li>
                        <li>Gestion des contrats, biens, réservations</li>
                        <li>Sécurisation de la plateforme (authentification, logs)</li>
                        <li>Communication d’informations importantes</li>
                        <li>Respect des obligations légales et réglementaires</li>
                    </ul>

                    <h3>4. 📅 <strong>Durée de conservation</strong></h3>
                    <p>Vos données sont conservées :</p>
                    <ul>
                        <li>Tant que vous êtes utilisateur actif</li>
                        <li>Puis archivées pendant une durée conforme à la législation (ex. 3 à 10 ans selon les cas)
                        </li>
                    </ul>
                    <p>
                        Vous pouvez demander leur suppression à tout moment (voir ci-dessous).
                    </p>

                    <h3>5. 🧑‍⚖️ <strong>Vos droits</strong></h3>
                    <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                    <ul>
                        <li><strong>Droit d’accès :</strong> connaître les données détenues</li>
                        <li><strong>Droit de rectification :</strong> corriger des erreurs</li>
                        <li><strong>Droit à l’effacement :</strong> demander la suppression</li>
                        <li><strong>Droit à la limitation du traitement</strong></li>
                        <li><strong>Droit à la portabilité</strong></li>
                        <li><strong>Droit d’opposition</strong></li>
                    </ul>
                    <p>
                        Pour exercer vos droits : <a href="mailto:contact@odjo.tech">contact@odjo.tech</a> ou via votre
                        espace utilisateur.
                    </p>

                    <h3>6. 🔐 <strong>Sécurité</strong></h3>
                    <p>
                        Nous utilisons des mesures techniques et organisationnelles strictes pour protéger vos données
                        (ex. chiffrement, pare-feu, restrictions d’accès…).
                    </p>

                    <h3>7. 📤 <strong>Partage des données</strong></h3>
                    <p>
                        Nous ne vendons pas vos données. Elles peuvent être partagées uniquement avec :
                    </p>
                    <ul>
                        <li>Des prestataires techniques pour l’hébergement ou la gestion des emails</li>
                        <li>Les autorités judiciaires sur requête officielle</li>
                    </ul>

                    <h3>8. 🍪 <strong>Cookies</strong></h3>
                    <p>
                        Des cookies peuvent être utilisés pour :
                    </p>
                    <ul>
                        <li>Sauvegarder vos préférences</li>
                        <li>Faciliter votre navigation</li>
                        <li>Analyser le trafic (Google Analytics, etc.)</li>
                    </ul>
                    <p>
                        Vous pouvez les refuser ou les configurer dans votre navigateur.
                    </p>

                    <h3>9. ❓ <strong>Questions et réclamations</strong></h3>
                    <p>
                        Pour toute question ou réclamation, contactez : <a
                            href="mailto:contact@odjo.tech">contact@odjo.tech</a><br>
                        Vous pouvez aussi déposer plainte auprès de l’Autorité de protection des données de votre pays.
                    </p>

                    <h3>✅ <strong>Consentement</strong></h3>
                    <p>
                        En créant un compte et en acceptant cette politique, vous consentez au traitement de vos données
                        conformément à cette Politique.
                    </p>
                </div>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button type="primary" @click="showPrivacyModal = false">Fermer</el-button>
                    </span>
                </template>
            </el-dialog>

            <div class="container h-100 d-flex px-0 px-sm-4">
                <div class="row justify-content-center align-items-center m-auto w-100 h-100">

                    <div class="col-12">
                        <div class="bg-mode shadow rounded-3 overflow-hidden">
                            <div class="row g-0">
                                <!-- Vector Image -->
                                <div class="col-12 col-lg-6 d-none d-lg-flex align-items-center order-2 order-lg-1"
                                    v-if="step === 1">
                                    <div class="p-3 p-lg-6">
                                        <img src="@/assets/images/element/step-1.svg" alt="">
                                    </div>
                                    <!-- Divider -->
                                    <div class="vr opacity-1 d-none d-lg-block"></div>
                                </div>


                                <div class="col-12 col-lg-6 d-none d-lg-flex align-items-center order-2 order-lg-1"
                                    v-else-if="step === 2">
                                    <div class="p-3 p-lg-6">
                                        <img src="@/assets/images/element/step-2.svg" alt="">
                                    </div>
                                    <!-- Divider -->
                                    <div class="vr opacity-1 d-none d-lg-block"></div>
                                </div>



                                <div class="col-12 col-lg-6 d-none d-lg-flex align-items-center order-2 order-lg-1"
                                    v-else-if="step === 3">
                                    <div class="p-3 p-lg-6">
                                        <img src="@/assets/images/element/step-3.svg" alt="">
                                    </div>
                                    <!-- Divider -->
                                    <div class="vr opacity-1 d-none d-lg-block"></div>
                                </div>

                                <!-- Information -->
                                <div class="col-12 col-lg-6 order-1 order-lg-2">
                                    <div class="p-4 p-sm-6 w-100">
                                        <!-- Logo -->
                                        <router-link to="/home">
                                            <img class="h-50px mb-4" src="@/assets/images/logo.png" alt="logo">
                                        </router-link>
                                        <!-- Title -->
                                        <h1 class="mb-2 h3">Crée ton compte</h1>
                                        <p class="mb-0">Membre ? <router-link to="/directory/login">Connecte
                                                toi</router-link></p>

                                        <div v-if="step === 1">
                                            <h5 class="mt-4">Étape 1 :Êtes-vous un ?</h5>
                                            <!-- Form START -->
                                            <form class="mt-4 text-start">
                                                <!-- last name -->
                                                <div class="mb-3 text-start">
                                                    <select class="form-select js-choice"
                                                        v-model="userData.userInfo.roles">
                                                        <option disabled value="">Vous êtes un</option>
                                                        <option value="LOCATAIRE_ROLES">Locataire</option>
                                                        <option value="PROPRIETAIRE_ROLES">Propriétaire</option>
                                                        <option value="SUPPLIER_ROLES">Fournisseur</option>
                                                        <option value="NOTARY_ROLES">Notaire</option>
                                                    </select>
                                                </div>
                                                <!-- Button -->
                                                <div class="d-flex justify-content-end">
                                                    <button type="button" @click="nextStep"
                                                        class="btn btn-primary w-50 mb-0 ml-6">Suivant</button>
                                                </div>

                                                <!-- Copyright -->
                                                <div class="text-primary-hover text-body mt-3 text-center">
                                                    Copyrights ©2025 e-immo. Créé par
                                                    <a href="https://www.odjo.tech/" class="text-body">ODJO</a>.
                                                </div>
                                            </form>
                                            <!-- Form END -->
                                        </div>
                                        <div v-else-if="step === 2">
                                            <h5 class="mt-4">Étape 2 : Informations personnelles</h5>
                                            <!-- Form START -->
                                            <form class="mt-4 text-start">
                                                <!-- first name -->
                                                <div class="mb-3">
                                                    <label class="form-label">Nom</label>
                                                    <input type="text" v-model="userData.userInfo.name"
                                                        class="form-control">
                                                </div>
                                                <!-- last name -->
                                                <div class="mb-3">
                                                    <label class="form-label">Prénoms</label>
                                                    <input type="text" v-model="userData.userInfo.secondName"
                                                        class="form-control">
                                                </div>
                                                <!-- dateNaissance -->
                                                <div class="mb-3">
                                                    <label class="form-label">Date de naissance</label>
                                                    <input type="date" v-model="userData.userInfo.dateNaissance"
                                                        class="form-control">
                                                </div>
                                                <!-- adresse -->
                                                <div class="mb-3">
                                                    <label class="form-label">Adresse</label>
                                                    <input type="text" v-model="userData.userInfo.adresse"
                                                        class="form-control">
                                                </div>
                                                <!-- adresse -->
                                                <div class="mb-3">
                                                    <label class="form-label">Téléphone</label>
                                                    <input type="text" v-model="userData.userInfo.numero"
                                                        class="form-control">
                                                </div>
                                                <!-- Button -->
                                                <div class="d-flex justify-content-between">
                                                    <button type="button" @click="previousStep"
                                                        class="btn btn-secondary">Précédent</button>
                                                    <button type="button" @click="nextStep"
                                                        class="btn btn-primary">Suivant</button>
                                                </div>

                                                <!-- Copyright -->
                                                <div class="text-primary-hover text-body mt-3 text-center">
                                                    Copyrights ©2025 e-immo. Créé par
                                                    <a href="https://www.odjo.tech/" class="text-body">ODJO</a>.
                                                </div>
                                            </form>
                                            <!-- Form END -->
                                        </div>

                                        <div v-else-if="step === 3">
                                            <h5 class="mt-4">Étape 3 : Informations de connexion</h5>
                                            <!-- Form START -->
                                            <form class="mt-4 text-start">
                                                <!-- Email -->
                                                <div class="mb-3">
                                                    <label class="form-label">Email</label>
                                                    <input type="email" v-model="userData.userInfo.email"
                                                        class="form-control">
                                                </div>
                                                <!-- Password -->
                                                <div class="mb-3 position-relative">
                                                    <label class="form-label">Mot de passe</label>
                                                    <input class="form-control" type="password"
                                                        autocomplete="current-password"
                                                        v-model="userData.userInfo.password" id="psw-input">
                                                    <span
                                                        class="position-absolute top-50 end-0 translate-middle-y p-0 mt-3">
                                                        <i
                                                            class="fakepasswordicon fas fa-eye-slash cursor-pointer p-2"></i>
                                                    </span>
                                                </div>

                                                <!-- Password -->
                                                <div class="mb-3 position-relative">
                                                    <label class="form-label">Confirmez votre mot de passe</label>
                                                    <input class="form-control" type="password"
                                                        autocomplete="current-password"
                                                        v-model="userData.userInfo.passwordConfirm"
                                                        id="psw-confirm-input">
                                                    <span
                                                        class="position-absolute top-50 end-0 translate-middle-y p-0 mt-3">
                                                        <i
                                                            class="fakepasswordicon fas fa-eye-slash cursor-pointer p-2"></i>
                                                    </span>
                                                </div>

                                                <!-- Consentement -->
                                                <div class="form-check mb-3">
                                                    <input class="form-check-input" type="checkbox"
                                                        v-model="userData.consentement" id="consentement">
                                                    <label class="form-check-label" for="consentement">
                                                        J’accepte les
                                                        <button type="button"
                                                            class="btn btn-link p-0 m-0 align-baseline"
                                                            @click="showCguModal = true">
                                                            Conditions Générales d’Utilisation
                                                        </button>
                                                        et la
                                                        <button type="button"
                                                            class="btn btn-link p-0 m-0 align-baseline"
                                                            @click="showPrivacyModal = true">
                                                            Politique de confidentialité
                                                        </button>.
                                                    </label>
                                                </div>
                                                <!-- Button -->
                                                <div class="d-flex justify-content-between">
                                                    <button type="button" @click="previousStep"
                                                        class="btn btn-secondary">Précédent</button>
                                                    <button type="button" @click="handleSubmit"
                                                        class="btn btn-primary">S'inscrire</button>
                                                </div>

                                                <!-- Copyright -->
                                                <div class="text-primary-hover text-body mt-3 text-center">
                                                    Copyrights ©2025 e-immo. Créé par
                                                    <a href="https://www.odjo.tech/" class="text-body">ODJO</a>.
                                                </div>
                                            </form>
                                            <!-- Form END -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- =======================
        Main Content END -->

    </main>
    <!-- **************** MAIN CONTENT END **************** -->
</template>



<script setup>
// import Dropzone from 'dropzone'
// import 'dropzone/dist/dropzone.css'
import { ref, reactive, onMounted, toRaw } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useStore } from 'vuex'
import { useLoading } from "vue-loading-overlay";
import { setToken, setEmail, setUserName, setUserInfo, setSecondName, setRoles, getToken } from "@/helpers/auth";
// import vueFilePond from "vue-filepond";
// import "filepond/dist/filepond.min.css";
import router from "@/router/index.js";
// import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
// import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
// import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { API_URLS } from "@/config/api";
// const FilePond = vueFilePond(
//     FilePondPluginFileValidateType,
//     FilePondPluginImagePreview
// );

const store = useStore()
const loading = useLoading();
const showCguModal = ref(false)
const showPrivacyModal = ref(false)
const userData = ref({
    userInfo: {
        name: '',
        secondName: '',
        dateNaissance: '',
        adresse: '',
        email: '',
        password: '',
        passwordConfirm: '',
        numero: '',
        roles: [],
    },
    consentement: false,
    // fichier: null,
})
const fichier = ref([])
const step = ref(1)
const userIP = ref('127.0.0.1'); // Valeur par défaut
onMounted(() => {
    // const dropzone = new Dropzone("#dropzone", {
    //     url: "/fichier/add",
    //     maxFiles: 10,
    //     thumbnailWidth: 150,
    //     thumbnailHeight: 150,
    //     headers: {
    //         "Authorization": `Bearer ${getToken()}`, // Si vous avez besoin d'un token d'autorisation
    //     },
    //     init: function () {
    //         this.on("success", (form, response) => {
    //             fichier.value.push(response)
    //         })

    //         this.on("error", (form, errorMessage) => {
    //             console.error("Erreur lors de l'upload :", errorMessage)
    //         })
    //     },
    // })

    fetchIP();
})



const fetchIP = async () => {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        userIP.value = data.ip;
    } catch (error) {
        console.error("Erreur de récupération IP :", error);
    }
};

const handleSubmit = async () => {
    const loader = loading.show();
    console.log("handleSubmit démarré, étape:", step.value);

    // Validation de l'étape 3 (confirmation des mots de passe et consentement)
    try {

        if (step.value === 3) {
            if (
                !userData.value.userInfo.email.trim() ||
                !userData.value.userInfo.password ||
                !userData.value.userInfo.passwordConfirm
            ) {
                ElMessage.error("Tous les champs sont obligatoires.");
                loader.hide();
                return;
            }

            // Validation des champs requis
            const requiredFields = [
                { field: userData.value.userInfo.email, name: "Email" },
                { field: userData.value.userInfo.password, name: "Mot de passe" },
                { field: userData.value.userInfo.passwordConfirm, name: "Confirmation mot de passe" },
                { field: userData.value.userInfo.name, name: "Nom" },
                { field: userData.value.userInfo.roles, name: "Rôle" }
            ];

            for (const { field, name } of requiredFields) {
                if (!field || !field.trim()) {
                    ElMessage.error(`Le champ ${name} est obligatoire.`);
                    return;
                }
            }

            // Validation des mots de passe
            if (userData.value.userInfo.password !== userData.value.userInfo.passwordConfirm) {
                ElMessage.warning("Les mots de passe ne correspondent pas");
                loader.hide();
                return;
            }

            if (!userData.value.consentement) {
                ElMessage.warning("Vous devez accepter les conditions.");
                loader.hide();
                return;
            }

            if (!userData.value.userInfo.name.trim()) {
                ElMessage.error("Le nom est obligatoire.");
                loader.hide();
                return;
            }
        }
        const payload = {

            name: userData.value.userInfo.name,
            secondName: userData.value.userInfo.secondName,
            dateNaissance: userData.value.userInfo.dateNaissance,
            adresse: userData.value.userInfo.adresse,
            email: userData.value.userInfo.email,
            password: userData.value.userInfo.password,
            passwordConfirm: userData.value.userInfo.passwordConfirm,
            numero: userData.value.userInfo.numero,
            roles: [userData.value.userInfo.roles]

        };

        console.log("Création de l'utilisateur avec payload:", payload);
        // Création de l'utilisateur
        const response = await store.dispatch('user/create', payload);
        console.log("Réponse création utilisateur:", response);

        if (!response || !response.id) {
            throw new Error("Impossible de récupérer l'ID utilisateur.");
        }

        if (response.id) {
            // Création du consentement RGPD
            console.log("l'utilisateur avec response:", response);
            await store.dispatch("consentements/create", {
                typeConsentement: "RGPD",
                statut: userData.value.consentement ? "ACCEPTE" : "REFUSE",
                versionPolitique: "v1.0",
                dateConsentement: new Date(),
                ipAddress: userIP.value,
                userInfo: {
                    id: response.id // clé pour lier à UserInfo côté back
                }
            });

        }

        ElMessage({
            showClose: true,
            message: 'Inscription réussie !',
            type: "success",
        });

        // Redirection en fonction des rôles
        const roleRedirects = {
            ADMIN_ROLES: "/dashboard",
            MANAGER_ROLES: "/manager_dashboard",
            LOCATAIRE_ROLES: "/locataire_dashboard",
            SUPPLIER_ROLES: "/supplier_dashboard",
            NOTARY_ROLES: "/notary_dashboard",
            SUPER_ADMIN_ROLES: "/master_dashboard",
            PROPRIETAIRE_ROLES: "/proprietaire/proprietaire_dashboard",
        };

        const selectedRole = userData.value.userInfo.roles;
        const redirectPath = roleRedirects[selectedRole] || "/";
        // Sauvegarder les données dans les cookies ou localStorage
        // setToken(token, "7d");
        // setEmail(this.email, "7d");
        // setUserName(this.userName, "7d");
        // setSecondName(this.secondName, "7d");
        // setUserInfo(this.userInfo, "7d");
        // setRoles(this.selectedRole, "7d");
        router.push(redirectPath);

        // Reset du formulaire
        userData.value = {
            userInfo: {
                name: '',
                secondName: '',
                dateNaissance: '',
                adresse: '',
                email: '',
                password: '',
                passwordConfirm: '',
                numero: '',
                roles: [
                    {
                        nomRoles: '',
                    }
                ],
            },
            consentement: false,
        };
        fichier.value = [];

    } catch (error) {
        console.error("Erreur lors de la soumission :", error);

        // Gestion d'erreur plus spécifique
        let errorMessage = "Erreur lors de la création du compte";

        if (error.response) {
            // Erreur de réponse du serveur
            errorMessage = error.response.data?.message || `Erreur ${error.response.status}`;
        } else if (error.request) {
            // Erreur de réseau
            errorMessage = "Erreur de connexion au serveur";
        } else {
            // Autre erreur
            errorMessage = error.message;
        }

        ElMessage.error(errorMessage);
    } finally {
        loader.hide();
    }
};


const validateStep = () => {
    if (step.value === 1) {
        return userData.value.userInfo.roles !== "";
    }
    // Ajouter une validation du numéro de téléphone
    const validatePhoneNumber = (phone) => {
        // Regex pour numéros internationaux (adaptez selon vos besoins)
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,20}$/;
        return phoneRegex.test(phone);
    };


    if (step.value === 2) {
        const requiredFields = [
            userData.value.userInfo.name.trim(),
            userData.value.userInfo.secondName.trim(),
            userData.value.userInfo.dateNaissance,
            userData.value.userInfo.adresse.trim(),
            userData.value.userInfo.numero.trim()
        ];

        return requiredFields.every(field => field !== "");
    }

    return true;
};



const nextStep = () => {
    if (!validateStep()) {
        ElMessage({
            type: "warning",
            message: "Veuillez remplir tous les champs requis.",
        });
        return;
    }
    if (step.value < 3) step.value++;
};
const previousStep = () => {
    if (step.value > 1) step.value--
}


// FilePond configuration
const uploadConfig = {
    url: `${API_URLS.ADD_FICHIER}`,
    process: {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${getToken()}`, // Attach JWT token
        },
        withCredentials: true,
        onload: (response) => {
            // Transforme la réponse en objet, si nécessaire
            const fileData = JSON.parse(response);  // Si la réponse est une chaîne JSON

            // Assure-toi que la réponse contient l'information que tu veux (comme l'ID du fichier)
            fichier.value.push(fileData);  // Ajoute l'objet de fichier à `fichier`

            return response;
        },

        onerror: (error) => {
            console.error("Erreur d'upload:", error);
        },



        onerror: (error) => {
            console.error("Erreur d'upload:", error);
            ElMessage({
                showClose: true,
                message: 'Erreur lors de l\'upload du fichier.',
                type: "error",
            });
        },
    },
};

const reponseUpload = ref(null);
const UploadResponse = (error, fileData) => {
    if (!error) {
        const reponse = JSON.parse(fileData.serverId);
        reponseUpload.value = reponse;
    }
};

</script>
<style lang="css" scoped>
/* Enlever l'ombre du dialog */
.el-dialog__wrapper {
    box-shadow: none !important;
    /* Enlève l'ombre du cadre */
}

/* Modifier l'overlay en arrière-plan (c'est l'arrière-plan semi-transparent qui fait effet noir) */
.el-dialog__mask {
    background-color: rgba(0, 0, 0, 0.2);
    /* Ajuster la transparence du noir */
}
</style>