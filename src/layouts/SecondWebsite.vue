<template>
    <span>
        <Header v-if="!hideHeaderFooter" />
        <router-view />
        <Footer v-if="!hideHeaderFooter" />
    </span>
</template>

<script>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {

    components: {
        Header, Footer
    },
    setup() {
        const route = useRoute();

        // Vérifie si la route courante est master_dashboard ceci est un commentaire
        // Si la route en cours a meta.hideHeaderFooter à true, on cache header/footer
        const hideHeaderFooter = computed(() => route.meta.hideHeaderFooter === true);

        return { hideHeaderFooter };
    }
};
</script>
