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
                                        <img src="@/assets/images/element/signin.jpeg" alt="">
                                    </div>
                                    <!-- Divider -->
                                    <div class="vr opacity-1 d-none d-lg-block"></div>
                                </div>

                                <!-- Information -->
                                <div class="col-lg-6 order-1">
                                    <div class="p-4 p-sm-7">
                                        <!-- Logo -->
                                        <router-link to="/home">
                                            <img class="h-60px mb-4" src="@/assets/images/logo.png" alt="logo">
                                        </router-link>
                                        <!-- Title -->
                                        <h1 class="mb-2 h3">Bienvenue</h1>
                                        <p class="mb-0">Nouveau ici?<router-link to="directory/signup"> Inscrit
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
                                                <router-link href="forgot-password.html" to="/forgot">Mot de passe
                                                    oublié?</router-link>
                                            </div>
                                            <!-- Button -->
                                            <div><button type="submit" class="btn btn-primary w-100 mb-0">Se
                                                    connecter</button>
                                            </div>

                                            <!-- Divider -->
                                            <!-- <div class="position-relative my-4">
                                                <hr>
                                                <p
                                                    class="small bg-mode position-absolute top-50 start-50 translate-middle px-2">
                                                    Ou se connecter avec</p>
                                            </div> -->

                                            <!-- Google and facebook button -->
                                            <!-- <div class="vstack gap-3">
                                                <a href="sign-in.html#" class="btn btn-light mb-0"><i
                                                        class="fab fa-fw fa-google text-google-icon me-2"></i>Se
                                                    connecter avec Google</a>
                                                <a href="sign-in.html#" class="btn btn-light mb-0"><i
                                                        class="fab fa-fw fa-facebook-f text-facebook me-2"></i>Se
                                                    connecter avec Facebook</a>
                                            </div> -->

                                            <!-- Copyright -->
                                            <div class="text-primary-hover text-body mt-3 text-center"> Copyrights ©2025
                                                Mains d'or plus. Créé par <a href="https://www.odjo.tech/"
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
import { setToken, setEmail, setUserName, setUserInfo, setSecondName } from "@/helpers/auth";
import { useLoading } from "vue-loading-overlay";
import { ElMessage } from "element-plus";
import router from "@/router/index.js";

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
        ...mapGetters("auth", ["userName", "userInfo", "secondName", "email"]),
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

                // Récupérer les rôles de l'utilisateur
                const userRoles = this.$store.getters["auth/userRoles"];
                console.log("User Roles:", userRoles);  // Debugging des rôles

                // Définir la redirection par défaut
                let redirectPath = this.$route.query.redirect || "/home"; // Redirection par défaut
                // Logique de redirection basée sur les rôles
                const roleRedirects = {
                    "ADMIN_ROLES": "admin",
                    "MANAGER_ROLES": "/manager/manager_dashboard",
                    "CLIENTS_ROLES": "/home",
                    "SUPER_ADMIN_ROLES": "/master/master_dashboard",
                    "LOCATAIRE_ROLES": "/Locataire/locataire_dashboard",
                    "PROPRIETAIRE_ROLES": "/proprietaire/proprietaire_dashboard",
                    "NOTARY_ROLES": "notary_dashboard",
                };

                // Trouver le rôle de l'utilisateur et définir la redirection
                for (const role of userRoles) {
                    if (roleRedirects[role]) {
                        redirectPath = roleRedirects[role];
                        break;
                    }
                }

                // Effectuer la redirection après la connexion réussie
                this.$router.push(redirectPath);
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

        togglePasswordVisibility() {
            this.passwordVisible = !this.passwordVisible;
        },
    },
    mounted() {
        // Vérifier si "Remember Me" a été activé précédemment
        const savedEmail = localStorage.getItem("email");
        const savedPassword = localStorage.getItem("password");

        if (savedEmail && savedPassword) {
            this.usernameOrEmail = savedEmail;
            this.password = savedPassword;
            this.rememberMe = true;
        }
    },
};
</script>
<style></style>
