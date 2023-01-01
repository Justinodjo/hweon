<template>
    <div class="password-reset-verify">
        <div class="reset-card">
            <div class="icon-header">
                <i class="phone-icon">📱</i>
            </div>

            <h2>Vérification SMS</h2>
            <p class="subtitle">
                Un code à 6 chiffres a été envoyé par SMS au numéro associé à votre compte.
                Consultez également votre boîte mail pour le lien de réinitialisation.
            </p>

            <form @submit.prevent="handleSubmit">
                <!-- Code de vérification -->
                <div class="form-group">
                    <label for="code">Code de vérification</label>
                    <input id="code" v-model="form.code" type="text" placeholder="000000" required :disabled="loading"
                        maxlength="6" class="code-input" @input="formatCode" />
                    <small class="help-text">Entrez le code à 6 chiffres reçu par SMS</small>
                </div>

                <!-- Message d'erreur -->
                <div v-if="error" class="alert alert-error">
                    <i class="icon">⚠️</i>
                    {{ error }}
                </div>

                <!-- Message de succès -->
                <div v-if="success" class="alert alert-success">
                    <i class="icon">✓</i>
                    Code vérifié ! Redirection...
                </div>

                <!-- Bouton de soumission -->
                <button type="submit" class="btn btn-primary" :disabled="loading || form.code.length !== 6">
                    <span v-if="!loading">Vérifier le code</span>
                    <span v-else class="loading">
                        <span class="spinner"></span>
                        Vérification...
                    </span>
                </button>

                <!-- Renvoi du code -->
                <div class="resend-section">
                    <p>Vous n'avez pas reçu le code ?</p>
                    <button type="button" class="btn-link" @click="resendCode" :disabled="resendDisabled">
                        {{ resendDisabled ? `Renvoyer dans ${countdown}s` : 'Renvoyer le code' }}
                    </button>
                </div>

                <!-- Lien de retour -->
                <div class="back-link">
                    <router-link to="/password-reset/request">← Modifier l'email</router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import request from "@/http/request";

export default {
    name: "PasswordResetVerify",
    data() {
        return {
            form: {
                token: "",
                code: "",
            },
            email: "",
            loading: false,
            error: null,
            success: false,
            resendDisabled: true,
            countdown: 60,
        };
    },
    mounted() {
        // Récupérer l'email et le token depuis l'URL
        this.email = this.$route.query.email || "";
        this.form.token = this.$route.query.token || "";

        // Si on arrive depuis l'email avec le token
        if (this.form.token) {
            this.validateToken();
        }

        // Démarrer le compte à rebours pour le renvoi
        this.startCountdown();
    },
    methods: {
        formatCode(event) {
            // N'autoriser que les chiffres
            this.form.code = event.target.value.replace(/\D/g, '');
        },

        async validateToken() {
            try {
                const response = await request.get("/api/password-reset/validate-token", {
                    params: { token: this.form.token },
                });

                if (!response.data.valid) {
                    this.error = "Le lien est invalide ou a expiré";
                }
            } catch (err) {
                console.error("Erreur validation token:", err);
            }
        },

        async handleSubmit() {
            this.error = null;
            this.success = false;
            this.loading = true;

            try {
                const response = await this.$store.dispatch("passwordReset/verifyCode", {
                    token: this.form.token,  // Token de l'URL
                    code: this.form.code
                });
                if (response.data.success) {
                    this.success = true;

                    // Redirection vers la page de nouveau mot de passe
                    setTimeout(() => {
                        this.$router.push({
                            name: "PasswordResetConfirm",
                            query: { token: this.form.token },
                        });
                    }, 1500);
                } else {
                    this.error = response.data.message || "Code invalide";
                }
            } catch (err) {
                console.error("Erreur lors de la vérification:", err);
                this.error =
                    err.response?.data?.message ||
                    "Code invalide. Veuillez réessayer.";
            } finally {
                this.loading = false;
            }
        },

        async resendCode() {
            try {
                const response = await request.post("passwordReset/requestReset", {
                    email: this.email,
                });

                if (response.data.success) {
                    this.startCountdown();
                    alert("Un nouveau code a été envoyé !");
                }
            } catch (err) {
                console.error("Erreur renvoi code:", err);
                alert("Erreur lors du renvoi du code");
            }
        },

        startCountdown() {
            this.resendDisabled = true;
            this.countdown = 60;

            const interval = setInterval(() => {
                this.countdown--;

                if (this.countdown <= 0) {
                    clearInterval(interval);
                    this.resendDisabled = false;
                }
            }, 1000);
        },
    },
};
</script>

<style scoped>
/* Styles similaires à PasswordResetRequest.vue */
.password-reset-verify {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
}

.reset-card {
    background: white;
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

.phone-icon {
    font-size: 48px;
    display: inline-block;
    animation: shake 3s infinite;
}

@keyframes shake {

    0%,
    100% {
        transform: rotate(0deg);
    }

    25% {
        transform: rotate(-10deg);
    }

    75% {
        transform: rotate(10deg);
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

.code-input {
    width: 100%;
    padding: 14px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 24px;
    text-align: center;
    letter-spacing: 8px;
    font-weight: 600;
    transition: all 0.3s;
    box-sizing: border-box;
}

.code-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.help-text {
    display: block;
    margin-top: 6px;
    font-size: 12px;
    color: #999;
}

.alert {
    padding: 14px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.alert .icon {
    font-size: 18px;
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
    background-color: var(--btn-primary);
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background-color: #5568d3;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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

.resend-section {
    margin-top: 20px;
    text-align: center;
}

.resend-section p {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
}

.btn-link {
    background: none;
    border: none;
    color: #667eea;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
}

.btn-link:hover:not(:disabled) {
    color: #5568d3;
}

.btn-link:disabled {
    color: #999;
    cursor: not-allowed;
    text-decoration: none;
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