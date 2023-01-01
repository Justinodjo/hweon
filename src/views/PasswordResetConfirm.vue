<template>
    <div class="password-reset-confirm">
        <div class="reset-card">
            <div class="icon-header">
                <i class="key-icon">🔑</i>
            </div>

            <h2>Nouveau mot de passe</h2>
            <p class="subtitle">
                Choisissez un mot de passe fort pour sécuriser votre compte
            </p>

            <form @submit.prevent="handleSubmit">
                <!-- Nouveau mot de passe -->
                <div class="form-group">
                    <label for="password">Nouveau mot de passe</label>
                    <div class="password-wrapper">
                        <input id="password" v-model="form.newPassword" :type="showPassword ? 'text' : 'password'"
                            placeholder="Minimum 8 caractères" required :disabled="loading" minlength="8" />
                        <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                            {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                        </button>
                    </div>

                    <!-- Indicateur de force -->
                    <div class="password-strength">
                        <div class="strength-bar" :class="passwordStrength"></div>
                        <span class="strength-label" :class="passwordStrength">
                            {{ strengthLabel }}
                        </span>
                    </div>
                </div>

                <!-- Confirmation du mot de passe -->
                <div class="form-group">
                    <label for="confirm">Confirmer le mot de passe</label>
                    <input id="confirm" v-model="form.confirmPassword" :type="showPassword ? 'text' : 'password'"
                        placeholder="Confirmez le mot de passe" required :disabled="loading" />
                    <span v-if="passwordMismatch" class="error-text">
                        ⚠️ Les mots de passe ne correspondent pas
                    </span>
                </div>

                <!-- Exigences du mot de passe -->
                <div class="password-requirements">
                    <p class="req-title">Le mot de passe doit contenir :</p>
                    <ul>
                        <li :class="{ valid: hasMinLength }">✓ Au moins 8 caractères</li>
                        <li :class="{ valid: hasUpperCase }">✓ Une lettre majuscule</li>
                        <li :class="{ valid: hasLowerCase }">✓ Une lettre minuscule</li>
                        <li :class="{ valid: hasNumber }">✓ Un chiffre</li>
                        <li :class="{ valid: hasSpecialChar }">✓ Un caractère spécial (@#$%^&+=)</li>
                    </ul>
                </div>

                <!-- Message d'erreur -->
                <div v-if="error" class="alert alert-error">
                    <i class="icon">⚠️</i>
                    {{ error }}
                </div>

                <!-- Message de succès -->
                <div v-if="success" class="alert alert-success">
                    <i class="icon">✓</i>
                    Mot de passe réinitialisé avec succès ! Redirection...
                </div>

                <!-- Bouton de soumission -->
                <button type="submit" class="btn btn-primary"
                    :disabled="loading || passwordMismatch || !isPasswordValid">
                    <span v-if="!loading">Réinitialiser le mot de passe</span>
                    <span v-else class="loading">
                        <span class="spinner"></span>
                        Réinitialisation...
                    </span>
                </button>
            </form>
        </div>
    </div>
</template>

<script>
import request from "@/http/request";

export default {
    name: "PasswordResetConfirm",
    data() {
        return {
            form: {
                token: "",
                newPassword: "",
                confirmPassword: "",
            },
            showPassword: false,
            loading: false,
            error: null,
            success: false,
        };
    },
    computed: {
        passwordMismatch() {
            return (
                this.form.confirmPassword.length > 0 &&
                this.form.newPassword !== this.form.confirmPassword
            );
        },
        hasMinLength() {
            return this.form.newPassword.length >= 8;
        },
        hasUpperCase() {
            return /[A-Z]/.test(this.form.newPassword);
        },
        hasLowerCase() {
            return /[a-z]/.test(this.form.newPassword);
        },
        hasNumber() {
            return /\d/.test(this.form.newPassword);
        },
        hasSpecialChar() {
            return /[@#$%^&+=]/.test(this.form.newPassword);
        },
        isPasswordValid() {
            return (
                this.hasMinLength &&
                this.hasUpperCase &&
                this.hasLowerCase &&
                this.hasNumber &&
                this.hasSpecialChar
            );
        },
        passwordStrength() {
            const password = this.form.newPassword;
            if (password.length === 0) return "";
            if (!this.hasMinLength) return "weak";

            let strength = 0;
            if (this.hasMinLength) strength++;
            if (this.hasUpperCase && this.hasLowerCase) strength++;
            if (this.hasNumber) strength++;
            if (this.hasSpecialChar) strength++;

            if (strength <= 2) return "weak";
            if (strength === 3) return "medium";
            return "strong";
        },
        strengthLabel() {
            const labels = {
                weak: "Faible",
                medium: "Moyen",
                strong: "Fort",
            };
            return labels[this.passwordStrength] || "";
        },
    },
    mounted() {
        // Récupérer le token depuis l'URL
        this.form.token = this.$route.query.token || "";

        if (!this.form.token) {
            this.error = "Token manquant. Veuillez recommencer le processus.";
        }
    },
    methods: {
        async handleSubmit() {
            if (this.passwordMismatch) {
                this.error = "Les mots de passe ne correspondent pas";
                return;
            }

            if (!this.isPasswordValid) {
                this.error = "Le mot de passe ne respecte pas les exigences";
                return;
            }

            this.error = null;
            this.success = false;
            this.loading = true;

            try {
                const response = await request.post("/api/password-reset/reset", this.form);

                if (response.data.success) {
                    this.success = true;

                    // Redirection vers la page de connexion après 2 secondes
                    setTimeout(() => {
                        this.$router.push("/login");
                    }, 2000);
                } else {
                    this.error = response.data.message || "Une erreur est survenue";
                }
            } catch (err) {
                console.error("Erreur lors de la réinitialisation:", err);
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
/* Styles de base similaires aux autres composants */
.password-reset-confirm {
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
    max-width: 500px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.icon-header {
    text-align: center;
    margin-bottom: 20px;
}

.key-icon {
    font-size: 48px;
    display: inline-block;
    animation: rotate 3s infinite;
}

@keyframes rotate {

    0%,
    100% {
        transform: rotate(0deg);
    }

    50% {
        transform: rotate(15deg);
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

.password-wrapper {
    position: relative;
}

input {
    width: 100%;
    padding: 14px;
    padding-right: 50px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 15px;
    transition: all 0.3s;
    box-sizing: border-box;
}

input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.toggle-password {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
    padding: 4px;
}

.password-strength {
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.strength-bar {
    flex: 1;
    height: 6px;
    background-color: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
    position: relative;
}

.strength-bar::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 0;
    transition: width 0.3s, background-color 0.3s;
}

.strength-bar.weak::after {
    width: 33%;
    background-color: #f44336;
}

.strength-bar.medium::after {
    width: 66%;
    background-color: #ff9800;
}

.strength-bar.strong::after {
    width: 100%;
    background-color: #4caf50;
}

.strength-label {
    font-size: 12px;
    font-weight: 600;
    min-width: 60px;
}

.strength-label.weak {
    color: #f44336;
}

.strength-label.medium {
    color: #ff9800;
}

.strength-label.strong {
    color: #4caf50;
}

.error-text {
    color: #c33;
    font-size: 12px;
    margin-top: 6px;
    display: block;
}

.password-requirements {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
}

.req-title {
    font-size: 13px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
}

.password-requirements ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.password-requirements li {
    font-size: 12px;
    color: #999;
    padding: 4px 0;
    transition: color 0.3s;
}

.password-requirements li.valid {
    color: #4caf50;
    font-weight: 500;
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
    background-color: #667eea;
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
</style>
