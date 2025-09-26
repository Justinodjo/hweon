<template>
    <!-- Title START -->
    <div class="row">
        <div class="col-12">
            <h1 class="fs-4 mb-0"><i class="bi bi-house-door fa-fw me-1"></i>Accueil</h1>
        </div>
    </div>
    <!-- Title END -->

    <!-- Counter START -->
    <div class="row g-4">
        <!-- Counter item -->
        <div class="col-sm-6 col-xl-3">
            <div class="card card-body border">
                <div class="d-flex align-items-center">
                    <!-- Icon -->
                    <div class="icon-xl bg-success rounded-3 text-white">
                        <i class="bi bi-journals"></i>
                    </div>
                    <!-- Content -->
                    <div class="ms-3">
                        <!-- <h4>56</h4> -->
                        <!-- <h4>{{ totalReservations }}</h4> -->
                        <span>Réservations</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Counter item -->
        <div class="col-sm-6 col-xl-3">
            <div class="card card-body border">
                <div class="d-flex align-items-center">
                    <!-- Icon -->
                    <div class="icon-xl bg-info rounded-3 text-white">
                        <i class="bi bi-graph-up-arrow"></i>
                    </div>
                    <!-- Content -->
                    <div class="ms-3">
                        <!-- <h4>$2,55,365</h4> -->
                        <!-- <h4>{{ chiffreAffaires.toLocaleString() }}</h4> -->
                        <span>CA</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Counter item -->
        <div class="col-sm-6 col-xl-3">
            <div class="card card-body border">
                <div class="d-flex align-items-center">
                    <!-- Icon -->
                    <div class="icon-xl bg-warning rounded-3 text-white">
                        <i class="bi bi-bar-chart-line-fill"></i>
                    </div>
                    <!-- Content -->
                    <div class="ms-3">
                        <!-- <h4>15K</h4> -->
                        <!-- <h4>{{ totalVisiteurs.toLocaleString() }}</h4> -->
                        <span>Visiteurs</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Counter item -->
        <div class="col-sm-6 col-xl-3">
            <div class="card card-body border">
                <div class="d-flex align-items-center">
                    <!-- Icon -->
                    <div class="icon-xl bg-primary rounded-3 text-white">
                        <i class="bi bi-star"></i>
                    </div>
                    <!-- Content -->
                    <div class="ms-3">
                        <!-- <h4>12K</h4> -->
                        <!-- <h4>{{ totalClients.toLocaleString() }}</h4> -->
                        <span>Clients</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { tns } from 'tiny-slider';
import { mapActions, mapGetters } from "vuex";
import { API_URLS } from "@/config/api";
import { setEmail, setUserName, setSecondName, } from "@/helpers/auth";

export default {
    name: "StatCard",
    data() {
        return {
            services: [],
            defaultAvatarUrl: new URL('@/assets/images/avatar/04.jpg', import.meta.url).href,
            // secondName: "",
            // name: ""
        };
    }
}
</script>