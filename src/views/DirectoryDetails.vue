<template>

    <main class="py-5">
        <div class="modal fade" id="detailModal" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Détails</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <h5 class="mb-1">{{ selectedTypeService.nom }}</h5>

                        <p>{{ selectedTypeService.description }}</p>

                        <h6>Produits Utilisés</h6>
                        <ul class="ps-4" v-for="(produit, index) in produits" :key="index">
                            <li class="mb-2">{{ produit.nom }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <section>
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="card bg-light p-0 pb-0">
                            <!-- Card body -->
                            <div class="card-body d-flex justify-content-between flex-wrap">
                                <!-- Title and badge -->
                                <div>
                                    <!-- Badge -->
                                    <div class="badge text-bg-dark me-1"><i
                                            class="fa-solid fa-spa fa-fw text-warning"></i>
                                        {{ category?.nom }}</div>
                                    <router-link class="badge text-bg-dark me-1" to="/">Retour</router-link>

                                    <!-- Title -->
                                    <h1 class="h3 mt-2 mb-1">{{ category?.nom }}</h1>
                                    <p class="mb-2 mb-sm-0"><i class="bi bi-geo-alt me-1 text-primary"></i>Cotonou,
                                        Fidjrossè à côté de l’ISMA /Porto-Novo, Adjina, von Sacré-Cœur</p>
                                </div>

                            </div>
                            <!-- Card footer -->
                            <div class="card-footer bg-transparent border-top py-0">
                                <ul class="nav nav-tabs nav-bottom-line nav-responsive border-0" role="tablist">
                                    <li class="nav-item"> <a class="nav-link mb-0 active" data-bs-toggle="tab"
                                            href="directory-detail.html#tab-1">A propos</a> </li>
                                    <li class="nav-item"> <a class="nav-link mb-0" data-bs-toggle="tab"
                                            href="directory-detail.html#tab-2">Services</a> </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="pt-0">
            <div class="container">
                <!-- Tabs contents START -->
                <div class="tab-content mb-0" id="tour-pills-tabContent">

                    <!-- Content item START -->
                    <div class="tab-pane fade show active" id="tab-1" role="tabpanel" aria-labelledby="tab-1">
                        <div class="row g-4 g-lg-5">
                            <!-- Left side START -->
                            <div class="col-lg-7 col-xl-8">
                                <!-- Card START -->
                                <div class="card bg-transparent mb-0">
                                    <!-- Card header -->
                                    <div class="card-header bg-transparent border-bottom px-0 pt-0">
                                        <h4 class="mb-0">Description</h4>
                                    </div>
                                    <!-- Card body -->
                                    <div class="card-body px-0 pb-0">
                                        <p class="mb-3">{{ category?.descriptif }}</p>

                                    </div>
                                </div>
                                <!-- Card END -->

                                <!-- Card START -->
                                <div class="card bg-transparent">
                                    <!-- Card header -->
                                    <div class="card-header bg-transparent border-bottom px-0">
                                        <h4 class="mb-0">Image Gallery</h4>
                                    </div>
                                    <!-- Card body -->
                                    <div class="card-body px-0 pb-0">
                                        <div class="row g-4">
                                            <div class="col-md-4" v-for="(item, index) in category?.fichiers"
                                                :key="index">
                                                <a class="w-100 h-100">
                                                    <div>
                                                        <!-- <img :src="getImageUrl(item.id)" class="card-img" alt=""> -->
                                                        <!-- Slider START -->
                                                        <div class="tiny-slider arrow-round arrow-blur">
                                                            <div class="tiny-slider-inner" data-autoplay="true"
                                                                data-arrow="true" data-gutter="0" data-edge="0"
                                                                data-dots="false" data-items="3" data-items-md="2"
                                                                data-items-xs="1">
                                                                <!-- Slider item -->
                                                                <div>
                                                                    <a class="w-100 h-100" data-glightbox
                                                                        data-gallery="gallery"
                                                                        :href="getImageUrl(item.id)"
                                                                        data-title="Image {{ index + 1 }}">
                                                                        <div
                                                                            class="card card-element-hover card-overlay-hover rounded-0 overflow-hidden">
                                                                            <!-- Image -->
                                                                            <img :src="getImageUrl(item.id)" class=""
                                                                                alt="">
                                                                            <!-- Full screen button -->
                                                                            <div class="hover-element w-100 h-100">
                                                                                <i
                                                                                    class="bi bi-fullscreen fs-6 text-white position-absolute top-50 start-50 translate-middle bg-dark rounded-1 p-2 lh-1"></i>
                                                                            </div>
                                                                        </div>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!-- Slider START -->
                                                    </div>
                                                </a>


                                            </div>


                                        </div>
                                    </div>
                                </div>
                                <!-- Card END -->

                            </div>
                            <!-- Left side END -->

                            <!-- Right side START -->
                            <div class="col-lg-5 col-xl-4">


                                <!-- Time table START -->
                                <div class="card shadow">
                                    <!-- Card header -->
                                    <div class="card-header border-bottom">
                                        <h5 class="mb-0">Nos Horaires</h5>
                                    </div>

                                    <!-- Card body -->
                                    <div class="card-body">
                                        <ul class="list-group list-group-borderless mb-0">
                                            <li class="list-group-item d-flex justify-content-between">
                                                <span>Lundi</span>
                                                <span>10h 00 à 22h 00 </span>
                                            </li>

                                            <li class="list-group-item py-0">
                                                <hr class="my-1">
                                            </li>

                                            <li class="list-group-item d-flex justify-content-between">
                                                <span>Mardi</span>
                                                <span>10h 00 à 22h 00</span>
                                            </li>

                                            <li class="list-group-item py-0">
                                                <hr class="my-1">
                                            </li>

                                            <li class="list-group-item d-flex justify-content-between">
                                                <span>Mercredi</span>
                                                <span>10h 00 à 22h 00</span>
                                            </li>

                                            <li class="list-group-item py-0">
                                                <hr class="my-1">
                                            </li>

                                            <li class="list-group-item d-flex justify-content-between">
                                                <span>Jeudi</span>
                                                <span>10h 00 à 22h 00</span>
                                            </li>

                                            <li class="list-group-item py-0">
                                                <hr class="my-1">
                                            </li>

                                            <li class="list-group-item d-flex justify-content-between">
                                                <span>Vendredi</span>
                                                <span>10h 00 à 22h 00</span>
                                            </li>

                                            <li class="list-group-item py-0">
                                                <hr class="my-1">
                                            </li>

                                            <li class="list-group-item d-flex justify-content-between">
                                                <span>Samedi</span>
                                                <span>10h 00 à 22h 00</span>
                                            </li>

                                            <li class="list-group-item py-0">
                                                <hr class="my-1">
                                            </li>

                                            <li class="list-group-item d-flex justify-content-between">
                                                <span>Dimanche</span>
                                                <span>10h 00 à 22h 00</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <!-- Time table END -->
                            </div>
                            <!-- Right side END -->
                        </div>
                    </div>
                    <!-- Content item END -->

                    <!-- Content item START -->
                    <div class="tab-pane fade" id="tab-2" role="tabpanel" aria-labelledby="tab-2">
                        <div class="row g-4">
                            <!-- Left side START -->
                            <div class="col-lg-8">
                                <!-- Card item -->
                                <div class="card card-body border mb-4" v-for="(item, index) in typeService"
                                    :key="index">
                                    <!-- Badge -->
                                    <div class="d-sm-flex justify-content-between mb-2">
                                        <div class="mb-2 mb-sm-0">
                                            <div class="badge text-bg-dark"><i
                                                    class="fa-solid fa-spa fa-fw text-warning"></i> Service</div>
                                        </div>
                                        <!-- <span class="text-success">Disponible</span> -->
                                    </div>
                                    <!-- Title -->
                                    <h5 class="card-title mb-0"><a href="#">{{ item.nom }}</a></h5>
                                    <p>{{ item.description }}</p>
                                    <div class="d-sm-flex justify-content-between mt-2">
                                        <div class="hstack gap-1">
                                            <h5 class="mb-0">{{ item.prix }} FCFA</h5>
                                        </div>

                                        <div class="mt-2 mt-sm-0">
                                            <a href="#" class="btn btn-sm btn-light mb-0"
                                                @click="loadProduit(item)">Détails</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Left side END -->

                            <!-- Right side START -->
                            <div class="col-lg-4">

                                <!-- Coupon code widget -->
                                <div class="card card-body shadow">
                                    <div class="cardt-title">
                                        <h5>Faite votre réservation</h5>
                                    </div>

                                    <p>Réservez dès maintenant l'un de nos service pour une prise en charge rapide</p>
                                    <!-- Input group -->
                                    <div class="input-group mt-1">
                                        <router-link to="/reservation" class="btn btn-primary">Réservez
                                            maintenant</router-link>
                                    </div>
                                </div>
                            </div>
                            <!-- Right side END -->

                        </div>
                    </div>

                </div>
                <!-- Tabs contents END -->
            </div>
        </section>

    </main>
</template>

<script setup>
import { useStore } from 'vuex';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { API_URLS } from "@/config/api";
import GLightbox from 'glightbox'
import 'glightbox/dist/css/glightbox.min.css'

const store = useStore();
const route = useRoute();
const category = ref(null);
const typeService = ref({});
const produits = ref([]);
const selectedTypeService = ref({});
const categoryId = route.params.id;

onMounted(async () => {
    category.value = await store.dispatch('categorie/getOne', categoryId);
    loadSousService();
    GLightbox({
        selector: '[data-glightbox]'
    });
});

const getImageUrl = (idfile) => {
    // return `https://93.115.20.172:8081/fichier/download/${idfile}`;
    return `${API_URLS.API_BASE}/fichier/download/${idfile}`;
};

const loadSousService = async () => {
    try {
        const response = await store.dispatch('categorie/getAllSousService', categoryId);
        typeService.value = response;
    } catch (error) {
        console.error("Erreur lors du chargement des sous-services :", error);
    }
};

const loadProduit = async (item) => {
    try {
        const response = await store.dispatch('sousService/getAllProduit', item?.id);
        produits.value = response;
        selectedTypeService.value = item;
        openModalSuivi();
    } catch (error) {
        console.error("Erreur lors du chargement des produits :", error);
    }
};

const openModalSuivi = () => {
    const modal = new bootstrap.Modal(document.getElementById('detailModal'));
    modal.show();
};

// Watcher pour surveiller le changement de la route
// watch(
//     () => route.params.id,
//     async (newCategoryId, oldCategoryId) => {
//         // Réagir au changement de `categoryId`
//         console.log("Category changed from:", oldCategoryId, "to:", newCategoryId);

//         // Rechargez les données si l'ID change
//         if (newCategoryId !== oldCategoryId) {
//             categoryId = newCategoryId;  // Met à jour le `categoryId`
//             category.value = await store.dispatch('categorie/getOne', categoryId);
//             loadSousService();
//         }
//     }
// );
</script>



<style lang="scss" scoped></style>