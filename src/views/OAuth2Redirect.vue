<template>
    <div>Redirection en cours...</div>
</template>

<script>
import getRedirectByRole from "@/helpers/getRedirectByRole";
import { setToken, setEmail, setUserName, setUserInfo, setSecondName } from "@/helpers/auth";
export default {
    name: "OAuth2Redirect",
    async mounted() {
        const query = new URLSearchParams(window.location.search);
        const oauthToken = query.get("token");
        const authorities = query.get("roles")?.split(",") || [];

        if (!oauthToken) {
            console.error("Token OAuth2 manquant dans l'URL !");
            return;
        }

        try {
            // Stocker le token localement / dans le store pour que l'API puisse l'utiliser
            setToken(oauthToken);

            await this.$store.dispatch("auth/oauthLogin", {
                token: oauthToken,
                roles: authorities,
                permissions: []
            });

            // Maintenant que le token est prêt, récupérer les infos utilisateur
            await this.$store.dispatch("auth/getCurrentUser");

            const isAuthenticated = this.$store.getters["auth/isAuthenticated"];
            if (!isAuthenticated) {
                console.error("Utilisateur non authentifié après OAuth2 !");
                return;
            }

            setEmail(this.$store.getters["auth/email"]);
            setUserName(this.$store.getters["auth/userName"]);
            setSecondName(this.$store.getters["auth/secondName"]);
            setUserInfo(this.$store.getters["auth/userInfo"]);

            const userRoles = this.$store.getters["auth/userRoles"];
            const redirectPath = getRedirectByRole(userRoles);

            this.$router.replace(redirectPath);
        } catch (error) {
            console.error("Erreur lors du login OAuth2 :", error);
        }
    }
}
</script>
