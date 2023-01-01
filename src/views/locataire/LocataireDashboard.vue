<template>

    <!-- **************** MAIN CONTENT START **************** -->
    <main>

        <!-- =======================Content START -->
        <section class="header-main pt-8">
            <div class="container">
                <!-- Bouton visible seulement sur mobile -->
                <div class="d-lg-none mb-3 text-end">
                    <button class="btn btn-outline-primary" type="button" data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasSidebar" aria-controls="offcanvasSidebar">
                        <i class="bi bi-list"></i> Menu
                    </button>
                </div>
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