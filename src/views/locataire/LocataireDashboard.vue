<template>

    <!-- **************** MAIN CONTENT START **************** -->
    <main>

        <!-- =======================Content START -->
        <section class="header-main pt-8">
            <div class="container">
                <div class="row">

                    <!-- Sidebar Component -->
                    <UserDashboardLocataire />
                    <!-- <Vue3Signature ref="signature" :sigOption="state.option" :w="'800px'" :h="'400px'"></Vue3Signature> -->
                    <!-- Main Content (the area where the routes will be displayed) -->
                    <div class="col-lg-8 col-xl-9">
                        <router-view />
                    </div>
                </div>
            </div>



        </section>
    </main>
</template>
<script>
import { tns } from 'tiny-slider';
import { mapActions, mapGetters } from "vuex";

import UserDashboardLocataire from '@/components/ui/locataire/UserDashboardLocataire.vue'
export default {
    name: "LocataireDashboard",
    components: {
        UserDashboardLocataire,
    },
    data() {
        return {
            services: [],
            // secondName: "",
            // name: ""

        };
    },
    mounted() {

        // this.logout();
    },

};
</script>