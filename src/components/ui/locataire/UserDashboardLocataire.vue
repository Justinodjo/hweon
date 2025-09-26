<template>
    <LocatairesSideBar />
    <!-- <Vue3Signature ref="signature" :sigOption="state.option" :w="'800px'" :h="'400px'"></Vue3Signature> -->

</template>
<script>
// import { ref } from "vue"


import LocatairesSideBar from '@/components/ui/locataire/LocatairesSideBar.vue'

export default {
    name: "UserDashboardLocataire",
    // setup() {
    //     const options = ref({
    //         penColor: "rgb(0, 0, 0)",
    //         backgroundColor: "rgb(255,255,255)"
    //     })
    // },
    components: {
        LocatairesSideBar,
    },
    data() {
        return {
            services: [],

        };
    },
    mounted() {


    },
    computed: {




    },
    watch: {

    },
    methods: {

    },
};
</script>