<template>

    <!-- **************** MAIN CONTENT START **************** -->
    <main class="">

        <!-- =======================Content START -->
        <section class="header-main pt-8">
            <div class="container">
                <div class="row">

                    <!-- Sidebar START -->
                    <div class="col-lg-4 col-xl-3">
                        <!-- Responsive offcanvas body START -->
                        <div class="offcanvas-lg offcanvas-end" tabindex="-1" id="offcanvasSidebar">
                            <!-- Offcanvas header -->
                            <div class="offcanvas-header justify-content-end pb-2">
                                <button type="button" class="btn-close" data-bs-dismiss="offcanvas"
                                    data-bs-target="#offcanvasSidebar" aria-label="Close"></button>
                            </div>

                            <!-- Offcanvas body -->
                            <div class="offcanvas-body p-3 p-lg-0">
                                <div class="card bg-light w-100">

                                    <!-- Edit profile button -->
                                    <div class="position-absolute top-0 end-0 p-3">
                                        <a href="account-profile.html#" class="text-primary-hover"
                                            data-bs-toggle="tooltip" data-bs-title="Edit profile">
                                            <i class="bi bi-pencil-square"></i>
                                        </a>
                                    </div>

                                    <!-- Card body START -->
                                    <div class="card-body p-3">
                                        <!-- Avatar and content -->
                                        <div class="text-center mb-3">
                                            <!-- Avatar -->
                                            <div class="avatar avatar-xl mb-2">
                                                <img class="avatar-img rounded-circle border border-2 border-white"
                                                    src="@/assets/images/avatar/01.jpg" alt="">
                                            </div>
                                            <h6 class="mb-0">{{ fullName }}</h6>
                                            <a href="account-profile.html#"
                                                class="text-reset text-primary-hover small">{{ email }}</a>
                                            <hr>
                                        </div>

                                        <!-- Sidebar menu item START -->
                                        <ul class="nav nav-pills-primary-soft flex-column">
                                            <li class="nav-item" v-if="handlerIdUser">
                                                <router-link class="nav-link active" to="/profils/details_profil"><i
                                                        class="bi bi-person fa-fw me-2"></i>Mon Profile</router-link>
                                            </li>
                                            <li class="nav-item">
                                                <router-link class="nav-link" to="/profils/reservations_details"><i
                                                        class="bi bi-ticket-perforated fa-fw me-2"></i>Mes
                                                    Réservations</router-link>
                                            </li>
                                            <!-- <li class="nav-item">
                                                <router-link class="nav-link" to="/profils/terms"><i
                                                        class="bi bi-briefcase fa-fw me-2"></i>Terms et
                                                    conditions</router-link>
                                            </li> -->
                                            <li class="nav-item">
                                                <router-link class="nav-link" to="/profils/delete_account"><i
                                                        class="bi bi-trash fa-fw me-2"></i>Delete Profile</router-link>
                                            </li>
                                            <li class="nav-item">
                                                <router-link class="nav-link text-danger bg-danger-soft-hover"
                                                    to="/login" :onclick="logout"><i
                                                        class="fas fa-sign-out-alt fa-fw me-2"></i>Sign
                                                    Out</router-link>
                                            </li>
                                        </ul>
                                        <!-- Sidebar menu item END -->
                                    </div>
                                    <!-- Card body END -->
                                </div>
                            </div>
                        </div>
                        <!-- Responsive offcanvas body END -->
                    </div>
                    <!-- Sidebar END -->

                    <!-- Main content START -->
                    <div class="col-lg-8 col-xl-9">

                        <!-- Offcanvas menu button -->
                        <div class="d-grid mb-0 d-lg-none w-100">
                            <button class="btn btn-primary mb-4" type="button" data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasSidebar" aria-controls="offcanvasSidebar">
                                <i class="fas fa-sliders-h"></i> Menu
                            </button>
                        </div>

                        <div class="vstack gap-4">
                            <router-view />
                        </div>
                    </div>
                    <!-- Main content END -->

                </div>
            </div>
        </section>
        <!-- =======================
Content END -->

    </main>
    <!-- **************** MAIN CONTENT END **************** -->
</template>
<script>
import { tns } from 'tiny-slider';
import { mapActions, mapGetters } from "vuex";
// import { setEmail, setUserName, setSecondName, } from "@/helpers/auth";
export default {
    name: "Navbar",
    data() {
        return {
            services: [],
            // secondName: "",
            // name: ""

        };
    },
    mounted() {
        this.loadService();
        // this.logout();
    },
    computed: {
        ...mapGetters('auth', ['userName', 'secondName', 'email', 'userInfo']),

        fullName() {

            if (this.secondName || this.userName) {
                console.log("Voici mon nom:", this.userName, " ", this.secondName);
                // setEmail(this.email, "7d");
                // setUserName(this.userName, "7d");
                // setSecondName(this.secondName, "7d");
                return this.userName + ' ' + this.secondName;
            } else {
                // removeEmail();
                // removeUserName();
                // removeSecondName();
                return "Non Connecté";

            }
        },
        handlerIdUser() {
            if (this.userInfo) {
                return this.userInfo;
            } else {
                return null;
            }
        },
    },
    methods: {
        ...mapActions('auth', ['logout',]),
        async loadService() {
            try {
                const response = await this.$store.dispatch('categorie/getAll');
                this.services = response;
            } catch (error) {
                console.error('Erreur lors de l\'ajout de l\'élément fonction :', error);
            }
        },
        // getRouteClass(status) {
        //     const routeClasses = {
        //         'Nouveauté': 'text-bg-primary',  // Bleu
        //         'Vendu': 'text-bg-danger',       // Rouge
        //         'Disponible': 'text-bg-success', // Vert
        //         'Plus noté': 'text-bg-warning'   // Jaune
        //     };
        //     return routeClasses[status] || 'text-bg-secondary'; // Couleur par défaut (gris)
        // },

    },
};
</script>