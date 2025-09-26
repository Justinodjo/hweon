<template>
    <div class="card border bg-transparent">
        <!-- Card header -->
        <div class="card-header bg-transparent border-bottom">
            <h4 class="card-header-title">Mes Réservations</h4>
        </div>

        <!-- Card body START -->
        <div class="card-body p-0">
            <!-- Tabs -->
            <ul class="nav nav-tabs nav-bottom-line nav-responsive nav-justified">
                <li class="nav-item">
                    <a class="nav-link mb-0 active" data-bs-toggle="tab" href="#tab-1">
                        <i class="bi bi-briefcase-fill fa-fw me-1"></i> Réservation encours
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link mb-0" data-bs-toggle="tab" href="#tab-2">
                        <i class="bi bi-x-octagon fa-fw me-1"></i> Réservation annulée
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link mb-0" data-bs-toggle="tab" href="#tab-3">
                        <i class="bi bi-patch-check fa-fw me-1"></i> Réservation terminée
                    </a>
                </li>
            </ul>

            <!-- Tabs content START -->
            <div class="tab-content p-2 p-sm-4" id="nav-tabContent">
                <!-- Réservation en cours -->
                <div class="tab-pane fade show active" id="tab-1">
                    <h6>Réservations en cours ({{ upcomingReservations.length }})</h6>
                    <div v-if="upcomingReservations.length === 0">
                        <p>Aucune réservation en cours.</p>
                    </div>
                    <div v-for="(reservation, index) in upcomingReservations" :key="index" class="card border mb-4">
                        <div class="card-header border-bottom d-md-flex justify-content-md-between align-items-center">
                            <div class="d-flex align-items-center">
                                <div class="icon-lg bg-light rounded-circle flex-shrink-0">
                                    <i class="fa-solid fa-calendar-check"></i>
                                </div>
                                <div class="ms-2">
                                    <h6 class="card-title mb-0">{{ reservation.nom }}
                                    </h6>
                                     <table class="table align-middle p-4 mb-0 table-hover table-shrink">
                                        <thead class="table-light">
                                            <tr>
                                                <th scope="col" class="border-0 rounded-start">#</th>
                                                <th scope="col" class="border-0">Nom</th>
                                                <th scope="col" class="border-0">Prix</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="reser in reservation.typeServices" :key="reser.id">
                                                <td>{{ reser.id || 'N/A'
                                                }}</td>
                                                <td>{{ reser.nom || 'N/A'
                                                }}</td>
                                                <td>{{ reser.prix || 'N/A'
                                                }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <!-- <ul class="nav nav-divider small">
                                        <li class="nav-item">ID: {{ reservation.id }}</li>
                                        <li class="nav-item">{{ reservation.status }}</li>
                                    </ul> -->
                                </div>
                            </div>
                            <!-- <div class="mt-2 mt-md-0">
                                <a href="#" class="btn btn-primary-soft mb-0">Gérer</a>
                            </div> -->
                        </div>

                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-sm-6 col-md-4">
                                    <span>Date réservation</span>
                                    <h6 class="mb-0">{{ reservation.dateReservation }}</h6>
                                </div>
                                <!-- <div class="col-sm-6 col-md-4">
                                    <span>Type</span>
                                    <h6 class="mb-0">{{ reservation.type }}</h6>
                                </div> -->
                                <div class="col-md-4">
                                    <span>Réservé par</span>
                                    <h6 class="mb-0">{{ reservation.nom }} {{ reservation.prenom }}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Réservation annulée -->
                <div class="tab-pane fade" id="tab-2">
                    <h6>Réservations annulées ({{ canceledReservations.length }})</h6>
                    <div v-if="canceledReservations.length === 0">
                        <p>Aucune réservation annulée.</p>
                    </div>
                    <div v-for="(reservation, index) in canceledReservations" :key="index" class="card border mb-4">
                        <div class="card-header border-bottom d-md-flex justify-content-md-between align-items-center">
                            <div class="d-flex align-items-center">
                                <div class="icon-lg bg-light rounded-circle flex-shrink-0">
                                    <i class="fa-solid fa-calendar-check"></i>
                                </div>
                                <div class="ms-2">
                                    <h6 class="card-title mb-0">{{ reservation.nom }} 
                                    </h6>
                                     <table class="table align-middle p-4 mb-0 table-hover table-shrink">
                                        <thead class="table-light">
                                            <tr>
                                                <th scope="col" class="border-0 rounded-start">#</th>
                                                <th scope="col" class="border-0">Nom</th>
                                                <th scope="col" class="border-0">Prix</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="reser in reservation.typeServices" :key="reser.id">
                                                <td>{{ reser.id || 'N/A'
                                                }}</td>
                                                <td>{{ reser.nom || 'N/A'
                                                }}</td>
                                                <td>{{ reser.prix || 'N/A'
                                                }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <ul class="nav nav-divider small">
                                        <li class="nav-item">ID: {{ reservation.id }}</li>
                                        <li class="nav-item">{{ reservation.status }}</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="mt-2 mt-md-0">
                                <p class="text-danger mb-0">Réservation annulée</p>
                            </div>
                        </div>

                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-sm-6 col-md-4">
                                    <span>Date</span>
                                    <h6 class="mb-0">{{ reservation.dateReservation }}</h6>
                                </div>
                                <div class="col-sm-6 col-md-4">
                                    <span>Type</span>
                                    <h6 class="mb-0">{{ reservation.typeServices }}</h6>
                                </div>
                                <div class="col-md-4">
                                    <span>Réservé par</span>
                                    <h6 class="mb-0">{{ reservation.nom }} {{ reservation.prenom }}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Réservation terminée -->
                <div class="tab-pane fade" id="tab-3">
                    <h6>Réservations terminées ({{ completedReservations.length }})</h6>
                    <div v-if="completedReservations.length === 0">
                        <div class="bg-mode shadow p-4 rounded overflow-hidden">
                            <div class="row g-4 align-items-center">
                                <div class="col-md-9">
                                    <h6>Aucune réservation terminée</h6>
                                    <h4 class="mb-2">Vos réservations apparaîtront ici une fois terminées.</h4>
                                    <router-link to="/reservation" class="btn btn-primary">Réservez
                                        maintenant</router-link>
                                </div>
                                <div class="col-md-3 text-end">
                                    <img src="@/assets/images/element/17.svg" class="mb-n5" alt="Aucune donnée">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-for="(reservation, index) in completedReservations" :key="index" class="card border mb-4">
                        <div class="card-header border-bottom d-md-flex justify-content-md-between align-items-center">
                            <div class="d-flex align-items-center">
                                <div class="icon-lg bg-light rounded-circle flex-shrink-0">
                                    <i class="fa-solid fa-calendar-check"></i>
                                </div>
                                <div class="ms-2">
                                    <h6 class="card-title mb-0">{{ reservation.nom }} {{ reservation.prenom }}

                                    </h6>
                                    <table class="table align-middle p-4 mb-0 table-hover table-shrink">
                                        <thead class="table-light">
                                            <tr>
                                                <th scope="col" class="border-0 rounded-start">#</th>
                                                <th scope="col" class="border-0">Nom</th>
                                                <th scope="col" class="border-0">Prix</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="reser in reservation.typeServices" :key="reser.id">
                                                <td>{{ reser.id || 'N/A'
                                                }}</td>
                                                <td>{{ reser.nom || 'N/A'
                                                }}</td>
                                                <td>{{ reser.prix || 'N/A'
                                                }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <ul class="nav nav-divider small">
                                        <!-- <li class="nav-item">ID: {{ reservation.id }}</li> -->
                                        <!-- <li class="nav-item">{{ reservation.status }}</li> -->
                                    </ul>
                                </div>
                            </div>
                            <div class="mt-2 mt-md-0">
                                <p class="text-success mb-0">{{ reservation.status }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Tabs content END -->
        </div>
        <!-- Card body END -->
    </div>
</template>

<script>
import { tns } from 'tiny-slider';
import { mapActions, mapGetters } from "vuex";
import { setEmail, setUserName, setSecondName, } from "@/helpers/auth";
export default {
    data() {
        return {
            upcomingReservations: [],
            canceledReservations: [],
            completedReservations: [],
        };
    },
    computed: {
        ...mapGetters('auth', ['userName', 'secondName', 'email', 'userInfo']),
        currentUser() {
            const userId = this.$store.getters['auth/userInfo'];
            // const userId = users.id;
            if (userId) {
                return "Voici mon id :" + userId;
            } else {
                return null;
            }
        },
    },
    mounted() {
        if (this.currentUser) {
            this.loadReservations();
        }
    },
    methods: {
        async loadReservations() {
            try {
                const userId = await this.$store.getters['auth/userInfo'];
                console.log("Voici une reponse", userId)
                if (!userId) {
                    console.error('Aucun utilisateur connecté');
                    return;
                }
                // Récupérer toutes les réservations
                // const allReservations = await this.$store.dispatch('reservation/getAll');
                const allReservations = await this.$store.dispatch('reservation/getReservationsByUser', userId)
                console.log('Réservations récupérées :', allReservations);

                // Vérifier que l'utilisateur connecté a bien un ID


                // Filtrer les réservations par utilisateur
                // console.log("userId = ", userId, typeof userId)
                // const userReservations = allReservations.forEach(
                //     (r, index) => {
                //         console.log(`Reservation[${index}]:userInfo.id =`, typeof r.userInfo.id, "== userId ?", String(r.userInfo.id) === String(userId))
                //     });
                // const userReservations = allReservations.filter(
                //     (r) => r.userInfo && String(r.userInfo.id).trim() === String(userId).trim()
                // );

                const reservationsByUser = allReservations.reduce(
                    (acc, reservation) => {
                        // const userId = reservation.userInfo?.id;
                        if (!userId) return acc;
                        if (!acc[userId]) {
                            acc[userId] = [];
                        }
                        acc[userId].push(reservation);
                        return acc;
                    }, {}
                );

                const allReservationsByUser = Object.values(reservationsByUser).flat();

                // Filtrer et trier les réservations selon le statut
                this.upcomingReservations = allReservationsByUser.filter((res) => res.status === 'Encours');
                console.log(JSON.parse(JSON.stringify(this.upcomingReservations)))
                this.canceledReservations = allReservationsByUser.filter((res) => res.status === 'Annulée');
                console.log('Réservations Annulée par utilisateur :', this.canceledReservations);
                this.completedReservations = allReservationsByUser.filter((res) => res.status === 'Confirmé');
                console.log('Réservations Confirmé par utilisateur :', this.completedReservations);
            } catch (error) {
                console.error('Erreur lors du chargement des réservations', error);
            }
        }
    },
};
</script>
