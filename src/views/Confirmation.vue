<template>
    <!-- **************** MAIN CONTENT START **************** -->
    <main>
        <!-- =======================
Main content START -->
        <section class="pt-4">
            <div class="container">
                <div class="row">
                    <div class="col-md-10 col-xl-8 mx-auto">

                        <div class="card shadow">
                            <!-- Image -->
                            <img src="@/assets/images/gallery/04.jpg" class="rounded-top" alt="">

                            <!-- Card body -->
                            <div class="card-body text-center p-4">
                                <!-- Title -->
                                <h1 class="card-title fs-3">🎊 Félicitations! 🎊</h1>
                                <p class="lead mb-3">Réservation effectuée avec success</p>

                                <!-- Second title -->
                                <h5 class="text-primary mb-4">Réservation</h5>

                                <!-- List -->
                                <div class="row justify-content-between text-start mb-4">
                                    <div class="col-lg-5">
                                        <ul class="list-group list-group-borderless">
                                            <li
                                                class="list-group-item d-sm-flex justify-content-between align-items-center">
                                                <span class="mb-0"><i class="bi bi-vr fa-fw me-2"></i>Réservation
                                                    ID:</span>
                                                <span class="h6 fw-normal mb-0">{{ reservation?.id || 'Loading...'
                                                    }}</span>
                                            </li>
                                            <li
                                                class="list-group-item d-sm-flex justify-content-between align-items-center">
                                                <span class="mb-0"><i class="bi bi-person fa-fw me-2"></i>Réservé par:
                                                </span>
                                                <span class="h6 fw-normal mb-0">{{ reservation?.nom }} {{
                                                    reservation?.prenom }}</span>
                                            </li>
                                            <li
                                                class="list-group-item d-sm-flex justify-content-between align-items-center">
                                                <span class="mb-0"><i class="bi bi-wallet2 fa-fw me-2"></i>Paiement:
                                                </span>
                                                <span class="h6 fw-normal mb-0">{{ reservation?.paymentStatus }}</span>
                                            </li>
                                            <li
                                                class="list-group-item d-sm-flex justify-content-between align-items-center">
                                                <span class="mb-0"><i class="bi bi-currency-dollar fa-fw me-2"></i>Prix
                                                    total:
                                                </span>
                                                <span class="h6 fw-normal mb-0">{{ reservation?.prixTotal }} FCFA</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="col-lg-5">
                                        <ul class="list-group list-group-borderless">
                                            <li
                                                class="list-group-item d-sm-flex justify-content-between align-items-center">
                                                <span class="mb-0"><i class="bi bi-calendar fa-fw me-2"></i>Date:</span>
                                                <span class="h6 fw-normal mb-0">{{ new
                                                    Date(reservation?.dateReservation).toLocaleDateString() }}</span>
                                            </li>

                                        </ul>
                                    </div>
                                </div>

                                <!-- Button -->
                                <div class="d-sm-flex justify-content-sm-end d-grid">
                                    <!-- Share button with dropdown -->
                                    <div class="dropdown me-sm-2 mb-2 mb-sm-0">
                                        <a href="booking-confirm.html#" class="btn btn-light mb-0 w-100" role="button"
                                            id="dropdownShare" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="bi bi-share me-2"></i>Share
                                        </a>
                                        <!-- dropdown button -->
                                        <ul class="dropdown-menu dropdown-menu-end min-w-auto shadow rounded"
                                            aria-labelledby="dropdownShare">
                                            <li><a class="dropdown-item" href="booking-confirm.html#"><i
                                                        class="fab fa-twitter-square me-2"></i>Twitter</a></li>
                                            <li><a class="dropdown-item"
                                                    href="https://www.facebook.com/share/v/1FM4Kp4NUd/"><i
                                                        class="fab fa-facebook-square me-2"></i>Facebook</a></li>
                                            <li><a class="dropdown-item"
                                                    href="https://www.instagram.com/p/DJHGILEtBXZ/?igsh=bnE4cHRtcWtlbzdu"><i
                                                        class="fab fa-instagram me-2"></i>LinkedIn</a></li>
                                            <li><a class="dropdown-item" href="booking-confirm.html#"><i
                                                        class="fas fa-copy me-2"></i>Copy link</a></li>
                                        </ul>
                                    </div>
                                    <!-- New Button to Show Reservation Details -->
                                    <button @click="showReservationDetails" class="btn btn-primary mb-0">
                                        <i class="bi bi-eye me-2"></i>Show Reservation Details
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
        <!-- =======================
Main content END -->

    </main>
    <!-- **************** MAIN CONTENT END **************** -->
</template>

<script setup>
import { useStore } from 'vuex';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { jsPDF } from "jspdf";  // Import jsPDF

const store = useStore();
const route = useRoute();
const reservation = ref(null);

const reservationId = route.params.id;

onMounted(async () => {
    reservation.value = await store.dispatch('reservation/getOne', reservationId);

});

const showReservationDetails = () => {
    const details = `
    Reservation Details:
    ID: ${reservation.value?.id}
    Name: ${reservation.value?.nom} ${reservation.value?.prenom}
    Contact: ${reservation.value?.contact}
    Email: ${reservation.value?.email}
    Reservation Date: ${new Date(reservation.value?.dateReservation).toLocaleDateString()}
    Total Price: ${reservation.value?.prixTotal} EUR
    Reservation Status: ${reservation.value?.status}
    Payment Status: ${reservation.value?.paymentStatus}
    `;

    alert(details);  // Display the reservation details in an alert box
};
</script>
