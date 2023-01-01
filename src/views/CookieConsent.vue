<template>
    <transition name="slide-up">
        <div v-if="!consentGiven" class="position-fixed bottom-0 start-0 end-0 bg-light border-top shadow-lg z-50">
            <div class="container py-3">
                <div class="row align-items-center">
                    <!-- Message -->
                    <div class="col-md-8 text-center text-md-start">
                        <small class="text-muted">
                            <i class="bi bi-info-circle-fill me-2 text-primary"></i>
                            Nous utilisons des cookies pour améliorer votre expérience.
                            <a href="/politique-cookies" target="_blank" class="text-decoration-underline text-primary">
                                En savoir plus
                            </a>
                        </small>
                    </div>

                    <!-- Boutons -->
                    <div class="col-md-4 mt-3 mt-md-0 text-center text-md-end">
                        <button @click="refuseCookies" class="btn btn-outline-secondary btn-sm me-2">
                            Refuser
                        </button>
                        <button @click="acceptCookies" class="btn btn-primary btn-sm">
                            Accepter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import Cookies from "js-cookie";
import { getConsent, setConsent } from "@/helpers/auth";
export default {
    name: "CookieConsent",
    data() {
        return {
            consentGiven: getConsent(),
        };
    },
    methods: {
        acceptCookies() {
            setConsent("accepted");
            this.consentGiven = true;
            import("@/utils/cookieScripts").then(module => {
                module.initCookieScripts();
            });
        },
        refuseCookies() {
            setConsent("refused");
            this.consentGiven = true;
        },
    },
};
</script>

<style scoped>
/* Animation type "slide up" */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.4s ease, opacity 0.4s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

/* Une fois entré */
.slide-up-enter-to {
    transform: translateY(0);
    opacity: 1;
}

/* Quand on quitte */
.slide-up-leave-from {
    transform: translateY(0);
    opacity: 1;
}

/* On repart en bas de 50px */
.slide-up-leave-to {
    transform: translateY(50px);
    opacity: 0;
}

.z-50 {
    z-index: 1055;
    /* Plus que modal backdrop (1050) */
}
</style>
