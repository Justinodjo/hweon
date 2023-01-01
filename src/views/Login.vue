<template>
    <!-- **************** MAIN CONTENT START **************** -->
    <main>

        <!-- =======================
    Main Content START -->
        <section class="vh-xxl-100">
            <div class="container h-100 d-flex px-0 px-sm-4">
                <div class="row justify-content-center align-items-center m-auto">
                    <div class="col-12">
                        <div class="bg-mode shadow rounded-3 overflow-hidden">
                            <div class="row g-0">
                                <!-- Vector Image -->
                                <div class="col-lg-6 d-flex align-items-center order-2 order-lg-1">
                                    <div class="p-3 p-lg-5">
                                        <img src="@/assets/images/element/signin.svg" alt="">
                                    </div>
                                    <!-- Divider -->
                                    <div class="vr opacity-1 d-none d-lg-block"></div>
                                </div>

                                <!-- Information -->
                                <div class="col-lg-6 order-1">
                                    <div class="p-4 p-sm-7">
                                        <!-- Logo -->
                                        <router-link to="/home">
                                            <img class="h-60px mb-4" src="@/assets/images/hweon_logo_transparent.png"
                                                alt="logo">
                                        </router-link>
                                        <!-- Title -->
                                        <h1 class="mb-2 h3">Bienvenue</h1>
                                        <p class="mb-0">Nouveau ici?<router-link to="/directory/signup"> Inscrit
                                                toi</router-link>
                                        </p>
                                        <!-- Form START -->
                                        <form class="mt-4 text-start" @submit.prevent="handleSubmit">
                                            <!-- Email -->
                                            <div class="mb-3">
                                                <label class="form-label">Nom ou Email *</label>
                                                <input type="usernameOrEmail" v-model="usernameOrEmail"
                                                    class="form-control">
                                                <!-- <span v-if="errorMessage" class="text-danger">{{ errorMessage }}</span> -->
                                            </div>
                                            <!-- Password -->
                                            <div class="mb-3 position-relative">
                                                <label class="form-label">Mot de passe *</label>
                                                <input class="form-control fakepassword"
                                                    :type="passwordVisible ? 'text' : 'password'"
                                                    autocomplete="current-password" v-model="password" id="psw-input"
                                                    :disabled="isSubmitting" />
                                                <span
                                                    class="position-absolute top-50 end-0 translate-middle-y p-0 mt-3">
                                                    <i class="fakepasswordicon cursor-pointer p-2 fas"
                                                        :class="passwordVisible ? 'fa-eye' : 'fa-eye-slash'"
                                                        @click="togglePasswordVisibility"></i>
                                                </span>
                                                <!-- <span v-if="errorMessage" class="text-danger">{{ errorMessage }}</span> -->
                                            </div>
                                            <!-- Remember me -->
                                            <div class="mb-3 d-sm-flex justify-content-between">
                                                <div>
                                                    <input type="checkbox" class="form-check-input" id="rememberCheck"
                                                        v-model="rememberMe">
                                                    <label class="form-check-label" for="rememberCheck">Se souvenir de
                                                        moi ?</label>
                                                </div>
                                                <router-link :to="{ name: 'forgot' }">Mot de passe
                                                    oublié?</router-link>
                                            </div>
                                            <!-- Button -->
                                            <div><button type="submit" class="btn btn-primary w-100 mb-0">Se
                                                    connecter</button>
                                            </div>

                                            <!-- Divider -->
                                            <div class="position-relative my-4">
                                                <hr>
                                                <p
                                                    class="small bg-mode position-absolute top-50 start-50 translate-middle px-2">
                                                    Ou se connecter avec</p>
                                            </div>

                                            <!-- Google and facebook button -->
                                            <div class="vstack gap-3">
                                                <a href="#" class="btn btn-light mb-0"
                                                    @click.prevent="loginWithGoogle"><i
                                                        class="fab fa-fw fa-google text-google-icon me-2"></i>Se
                                                    connecter avec Google</a>
                                                <!-- <a href="sign-in.html#" class="btn btn-light mb-0"><i
                                                        class="fab fa-fw fa-facebook-f text-facebook me-2"></i>Se
                                                    connecter avec Facebook</a> -->
                                            </div>

                                            <!-- Copyright -->
                                            <div class="text-primary-hover text-body mt-3 text-center"> Copyrights ©2025
                                                Hweon. Créé par <a href="https://www.odjo.tech/"
                                                    class="text-body">ODJO</a>. </div>
                                        </form>
                                        <!-- Form END -->
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

    <!-- Back to top -->
    <!-- <div class="back-top"></div> -->
    <!-- </div> -->
</template>
<script>

import { mapActions, mapGetters } from "vuex";
import { setToken, setEmail, setUserName, setUserInfo, setSecondName, setFichier, getFichier } from "@/helpers/auth";
import getRedirectByRole from "@/helpers/getRedirectByRole";
import { useLoading } from "vue-loading-overlay";
import { ElMessage } from "element-plus";
import router from "@/router/index.js";
import { API_URLS } from "@/config/api";

const loading = useLoading();

export default {
    name: "Login",
    data() {
        return {
            usernameOrEmail: "",
            password: "",
            rememberMe: false,
            errorMessage: "", // Variable pour afficher les erreurs de connexion
            passwordVisible: false, // Gérer la visibilité du mot de passe
            isSubmitting: false,
        };
    },
    computed: {
        userName() { return this.$store.getters["auth/userName"]; },
        userInfo() { return this.$store.getters["auth/userInfo"]; },
        secondName() { return this.$store.getters["auth/secondName"]; },
        email() { return this.$store.getters["auth/email"]; },
        userRoles() { return this.$store.getters["auth/userRoles"]; },
        userFichier() { return this.$store.getters["auth/userFichier"]; },
    },
    methods: {
        ...mapActions("auth", ["login"]),

        // Gère la soumission du formulaire
        async handleSubmit() {
            if (this.isSubmitting) return; // Éviter de soumettre si déjà en cours
            this.isSubmitting = true;
            const loader = loading.show();

            const authRequest = {
                email: this.usernameOrEmail,
                password: this.password,
            };

            try {
                await this.login(authRequest);

                // Récupérer le token et l'enregistrer dans localStorage
                const token = this.$store.getters["auth/isAuthenticated"];
                if (!token) {
                    throw new Error("Token absent après connexion.");
                }

                // Sauvegarder les données dans les cookies ou localStorage
                const expirationTime = this.rememberMe ? "7d" : "1d";
                setToken(token, expirationTime);
                setEmail(this.email, expirationTime);
                setUserName(this.userName, expirationTime);
                setSecondName(this.secondName, expirationTime);
                setUserInfo(this.userInfo, expirationTime);
                setFichier(this.userFichier || "", expirationTime);

                // Récupérer les rôles de l'utilisateur
                const userRoles = this.$store.getters["auth/userRoles"];
                console.log("User Roles:", userRoles);  // Debugging des rôles

                // Définir la redirection par défaut

                const redirectPath = getRedirectByRole(userRoles) || this.$route.query.redirect || "/home";


                // Effectuer la redirection après la connexion réussie
                this.$router.replace(redirectPath);
            } catch (error) {
                console.error("Login error:", error);
                this.errorMessage =
                    "Identifiants incorrects ou problème de connexion, veuillez réessayer.";
                ElMessage.error(
                    "Identifiants incorrects ou problème de connexion, veuillez réessayer."
                );
            } finally {
                loader.hide();
                this.isSubmitting = false;
            }
        },
        // loginWithGoogle() {
        //     window.location.href = `${API_URLS.API_BASE}/oauth2/authorization/google`;
        // },
        loginWithGoogle() {
            window.location.href = "https://dev.mainsdorplus.com/oauth2/authorization/google";
        },
        async handleOAuth2Success() {
            const query = new URLSearchParams(window.location.search);
            const oauthToken = query.get("token");
            const authorities = query.get("roles")?.split(",") || [];
            // 🔹 Stocke le token immédiatement (avant tout appel)
            localStorage.setItem("token", oauthToken);
            setToken(oauthToken, "7d");

            if (!oauthToken) return;

            const roles = authorities
                .filter(r => r.startsWith("ROLE_"))
                .map(r => r.replace("ROLE_", "") + "_ROLES");

            const permissions = authorities.filter(r => !r.startsWith("ROLE_"));
            try {
                await this.$store.dispatch("auth/oauthLogin", {
                    token: oauthToken,
                    roles,
                    permissions
                });

                if (response.isNew) {
                    // Nouvel utilisateur → page sélection rôle
                    this.$router.replace(`/select-role?email=${response.email}`);
                    return;
                }
                // 2️⃣ Récupère les informations de l’utilisateur connecté depuis /auth/me
                const userData = await this.$store.dispatch("auth/getCurrentUser");
                // Mettre à jour cookies/localStorage si nécessaire
                setUserInfo(userData.id, "7d");
                setUserName(userData.userName, "7d");
                setSecondName(userData.secondName, "7d");
                setRoles(userData.roles, "7d");
                setEmail(userData.email, "7d");
                setFichier(userData.fichier ? userData.fichier : "", "7d");

                // 3️⃣ Redirection basée sur les rôles
                const redirectPath = getRedirectByRole(this.userRoles) || "/home";

                this.$router.replace(redirectPath); // replace pour éviter historique et boucle
            } catch (error) {
                console.error("OAuth2 login error:", error);
                ElMessage.error("Erreur lors de la connexion via Google.");
            }
        },

        togglePasswordVisibility() {
            this.passwordVisible = !this.passwordVisible;
        },
    },
    mounted() {
        // Vérifier si "Remember Me" a été activé précédemment
        // Gestion de callback OAuth2
        const query = new URLSearchParams(window.location.search);
        const oauthToken = query.get("token");
        if (oauthToken) {
            // Vérifier qu'on n'a pas déjà traité ce token
            const processedToken = localStorage.getItem("oauthToken");
            if (processedToken !== oauthToken) {
                this.handleOAuth2Success({ token: oauthToken }).then(() => {
                    localStorage.setItem("oauthToken", oauthToken); // marquer comme traité
                });
            }
        }
    },
};
</script>
<style></style>
