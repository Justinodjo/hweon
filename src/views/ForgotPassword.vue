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
                                <div class="col-lg-6 d-md-flex align-items-center order-2 order-lg-1">
                                    <div class="p-3 p-lg-5">
                                        <img src="@/assets/images/element/forgot-pass.svg" alt="">
                                    </div>
                                    <!-- Divider -->
                                    <div class="vr opacity-1 d-none d-lg-block"></div>
                                </div>

                                <!-- Information -->
                                <div class="col-lg-6 order-1">
                                    <div class="p-4 p-sm-7">
                                        <!-- Logo -->
                                        <router-link href="index.html" to="/">
                                            <img class="mb-4 h-50px" src="@/assets/images/hweon_logo_transparent.png"
                                                alt="logo">
                                        </router-link>
                                        <!-- Title -->
                                        <h1 class="mb-2 h3">Mot de passe oublié ?</h1>
                                        <p class="mb-sm-0"> Entrez votre adresse email et nous vous enverrons un lien de
                                            réinitialisation
                                            ainsi qu'un code de vérification par SMS.</p>

                                        <!-- Form START -->
                                        <form class="mt-sm-4 text-start" @submit.prevent="handleSubmit">
                                            <!-- Email -->
                                            <div class="mb-3">
                                                <label class="form-label">Adresse email</label>
                                                <input id="email" v-model="form.email" type="email"
                                                    placeholder="exemple@email.com" required :disabled="loading"
                                                    autocomplete="email" class="form-control">
                                            </div>
                                            <!-- Message d'erreur -->
                                            <div v-if="error" class="alert alert-error">
                                                <i class="icon">⚠️</i>
                                                {{ error }}
                                            </div>

                                            <!-- Message de succès -->
                                            <div v-if="success" class="alert alert-success">
                                                <i class="icon">✓</i>
                                                <div>
                                                    <strong>Email envoyé !</strong><br />
                                                    {{ successMessage }}
                                                </div>
                                            </div>
                                            <div class="mb-3 text-center">
                                                <p>Retour à la <router-link
                                                        :to="{ name: 'login' }">connexion</router-link></p>
                                            </div>

                                            <!-- Button -->
                                            <div class="d-grid"><button type="submit" class="btn btn-primary"
                                                    :disabled="loading">
                                                    <span v-if="!loading">Envoyer le code</span>
                                                    <span v-else class="loading">
                                                        <span class="spinner"></span>
                                                        Envoi en cours...
                                                    </span>
                                                </button></div>

                                            <!-- Divider -->
                                            <!-- <div class="position-relative my-4">
                                                <hr>
                                                <p
                                                    class="small position-absolute top-50 start-50 translate-middle bg-mode px-2">
                                                    Or sign in with</p>
                                            </div> -->

                                            <!-- Google and facebook button -->
                                            <!-- <div class="vstack gap-3">
                                                <a href="forgot-password.html#" class="btn btn-light mb-0"><i
                                                        class="fab fa-fw fa-google text-google-icon me-2"></i>Sign in
                                                    with Google</a>
                                                <a href="forgot-password.html#" class="btn btn-light mb-0"><i
                                                        class="fab fa-fw fa-facebook-f text-facebook me-2"></i>Sign in
                                                    with Facebook</a>
                                            </div> -->

                                            <!-- Copyright -->
                                            <div class="text-primary-hover text-body mt-3 text-center"> Copyrights ©2025
                                                hweon. Créé par <a href="https://www.odjo.tech/"
                                                    class="text-body">ODJO</a>.
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
        </section>
        <!-- =======================
Main Content END -->

    </main>
    <!-- **************** MAIN CONTENT END **************** -->
</template>
<script>
import request from "@/http/request";

export default {
    name: "PasswordResetRequest",
    data() {
        return {
            form: {
                email: "",
            },
            loading: false,
            error: null,
            success: false,
            successMessage: "",
        };
    },
    methods: {
        async handleSubmit() {
            this.error = null;
            this.success = false;
            this.loading = true;

            try {
                const response = await request.post("/api/password-reset/request", this.form);

                if (response.data.success) {
                    this.success = true;
                    this.successMessage = response.data.message;

                    // Redirection vers la page de vérification après 3 secondes
                    setTimeout(() => {
                        this.$router.push({
                            name: "PasswordResetVerify",
                            query: { email: this.form.email },
                        });
                    }, 3000);
                } else {
                    this.error = response.data.message || "Une erreur est survenue";
                }
            } catch (err) {
                console.error("Erreur lors de la demande de réinitialisation:", err);
                this.error =
                    err.response?.data?.message ||
                    "Une erreur est survenue. Veuillez réessayer.";
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>
<style scoped>
.password-reset-request {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.reset-card {
    border-radius: 16px;
    padding: 40px;
    max-width: 450px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.icon-header {
    text-align: center;
    margin-bottom: 20px;
}

.lock-icon {
    font-size: 48px;
    display: inline-block;
    animation: pulse 2s infinite;
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
    }
}

h2 {
    color: #333;
    margin-bottom: 10px;
    font-size: 28px;
    text-align: center;
}

.subtitle {
    color: #666;
    text-align: center;
    margin-bottom: 30px;
    font-size: 14px;
    line-height: 1.5;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-weight: 500;
    font-size: 14px;
}

input[type="email"] {
    width: 100%;
    padding: 14px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 15px;
    transition: all 0.3s;
    box-sizing: border-box;
}

input[type="email"]:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.alert {
    padding: 14px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
}

.alert .icon {
    font-size: 18px;
    flex-shrink: 0;
}

.alert-error {
    background-color: #fee;
    color: #c33;
    border: 1px solid #fcc;
}

.alert-success {
    background-color: #efe;
    color: #2c7a2c;
    border: 1px solid #cfc;
}

.btn {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-primary {

    color: white;
}

.btn-primary:hover:not(:disabled) {
    background-color: var(--bs-secondary);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(--bs-secondary-rgba);
}

.btn-primary:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
}

.loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #ffffff40;
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.back-link {
    margin-top: 20px;
    text-align: center;
}

.back-link a {
    color: #667eea;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: color 0.3s;
}

.back-link a:hover {
    color: #5568d3;
    text-decoration: underline;
}
</style>
