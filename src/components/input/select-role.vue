<template>
    <div class="d-flex justify-content-center align-items-center vh-100 bg-dark bg-opacity-50">
        <div class="bg-light bg-opacity-75 p-4 rounded shadow" style="min-width: 300px;">
            <h2 class="mb-3 text-center">Qui êtes-vous ?</h2>
            <p class="text-center">Cette information nous aidera à personnaliser votre expérience.</p>
            <select v-model="selectedRole" class="form-select mb-3">
                <option disabled value="">-- Sélectionnez un rôle --</option>
                <option value="LOCATAIRE_ROLES">Locataire</option>
                <option value="PROPRIETAIRE_ROLES">Propriétaire</option>
                <option value="SUPPLIER_ROLES">Fournisseur</option>
                <option value="MANAGER_ROLES">Gestionnaire</option>
                <option value="NOTARY_ROLES">Notaire</option>
                <option value="CLIENTS_ROLES">Acheteur</option>

            </select>
            <div v-if="showError" class="invalid-feedback text-center">
                Veuillez sélectionner un rôle avant de continuer.
            </div>
            <button class="btn btn-primary w-100" @click="assignRole">Valider</button>
        </div>
    </div>
</template>

<script>
import request from "@/http/request";
import getRedirectByRole from "@/helpers/getRedirectByRole";
import { setToken, setEmail, setUserName, setUserInfo, setSecondName, setRoles } from "@/helpers/auth";
import { ElMessage } from "element-plus";

export default {
    data() {
        return {
            selectedRole: "",
            showError: false,
            email: new URLSearchParams(window.location.search).get("email"),
        };
    },
    methods: {
        async assignRole() {
            if (!this.selectedRole) {
                this.showError = true;
                ElMessage.error("Veuillez sélectionner un rôle !");
                return;
            }
            this.showError = false;
            try {
                const response = await request.post("/auth/oauth2/complete-oauth2", null, {
                    params: {
                        email: this.email,
                        roleName: this.selectedRole,
                    },
                });
                const { token, redirectUrl, roleName } = response.data;
                setToken(token);
                setRoles([roleName]); // <-- stocke dans localStorage
                ElMessage.success("Rôle attribué avec succès !");
                // const redirectPath = getRedirectByRole([this.selectedRole]);
                this.$router.replace(redirectUrl);
            } catch (err) {
                console.error(err);
                ElMessage.error("Impossible d'attribuer le rôle.");
            }
        },
    },
};
</script>
