<template>
    <main class="header-main py-5">

        <section class="header-main ">
            <div class="">
                <div class="card rounded-3 border p-3 pb-2">
                    <!-- Avatar and info START -->
                    <div class="d-sm-flex">
                        <div class="avatar avatar-xl mb-2 mb-sm-0">
                            <img class="avatar-img rounded-circle" src="@/assets/images/newsletter.png" alt="">
                        </div>
                        <h4 class="mb-2 mb-sm-0 ms-sm-3"><span class="fw-light">Hello</span> Gestionnaire</h4>

                    </div>
                    <!-- Avatar and info START -->

                    <!-- Responsive navbar toggler -->
                    <button class="btn btn-primary w-100 d-block d-xl-none mt-2" type="button"
                        data-bs-toggle="offcanvas" data-bs-target="#dashboardMenu" aria-controls="dashboardMenu">
                        <i class="bi bi-list"></i> Dashboard Menu
                    </button>

                    <!-- Nav links START -->
                    <div class="offcanvas-xl offcanvas-end mt-xl-3" tabindex="-1" id="dashboardMenu">
                        <div class="offcanvas-header border-bottom p-3">
                            <h5 class="offcanvas-title">Menu</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="offcanvas"
                                data-bs-target="#dashboardMenu" aria-label="Close"></button>
                        </div>
                        <!-- Offcanvas body -->
                        <div class="offcanvas-body p-3 p-xl-0">
                            <!-- Nav item -->
                            <div class="navbar navbar-expand-xl">
                                <ul class="navbar-nav navbar-offcanvas-menu">

                                    <li class="nav-item"> <router-link class="nav-link" to="/dashboard"><i
                                                class="bi bi-house-door fa-fw me-1"></i>Accueil</router-link> </li>

                                    <li class="nav-item"> <router-link class="nav-link" to="/service"><i
                                                class="bi bi-journals fa-fw me-1"></i>Catégories</router-link> </li>

                                    <li class="nav-item"> <router-link class="nav-link" to="/sousService"><i
                                                class="bi bi-bell fa-fw me-1"></i>Sous-Catégories</router-link> </li>

                                    <li class="nav-item"><router-link class="nav-link" to="/produits"><i
                                                class="bi bi-star fa-fw me-1"></i>Produits</router-link></li>
                                    <li class="nav-item"><router-link class="nav-link" to="/user"><i
                                                class="bi bi-star fa-fw me-1"></i>Users</router-link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!-- Nav links END -->
                </div>
            </div>
        </section>

        <section class="pt-0">
            <div class="vstack gap-4">
                <!-- Title START -->
                <div class="row">
                    <div class="col-12">
                        <h1 class="fs-4 mb-0"><i class="bi bi-gear fa-fw me-1"></i>Slides</h1>
                    </div>
                </div>

                <!-- Tabs Content START -->
                <div class="row col-12 g-4">
                    <div class="col-sm-12">
                        <div class="tab-content">
                            <!-- Tab content 3 START -->
                            <div class="tab-pane show active" id="tab-1">
                                <div class="row g-4">
                                    <!-- Linked account START -->
                                    <div class="col-sm-6">
                                        <div class="card border">

                                            <!-- Card header -->
                                            <div class="card-header border-bottom">
                                                <h5 class="card-header-title">Listes des Slides</h5>
                                            </div>

                                            <!-- Card body START -->
                                            <div class="card-body">
                                                <!-- Table START -->
                                                <div class="table-responsive border-0">
                                                    <table class="table align-middle p-4 mb-0 table-hover">

                                                        <!-- Table head -->
                                                        <thead class="table-light">
                                                            <tr>
                                                                <th scope="col" class="border-0 rounded-start">N°</th>
                                                                <th scope="col" class="border-0">Libellé</th>
                                                                <th scope="col" class="border-0">Sous-libellé</th>
                                                                <!-- <th scope="col" class="border-0">Nom image</th> -->
                                                                <th scope="col" class="border-0">Action</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            <tr v-for="slide in slides" :key="slide">
                                                                <td> {{ slide.id }}</td>
                                                                <td> {{ slide.titre }} </td>
                                                                <td> {{ slide.sousTitre }} </td>
                                                                <!-- <td> {{ slide.fichier.nom }} </td> -->
                                                                <td>
                                                                    <button
                                                                        class="btn btn-sm btn-danger-soft me-1 mb-1 mb-md-0"
                                                                        @click="updateSlide(slide)">Modifier</button>
                                                                    <button
                                                                        class="btn btn-sm btn-secondary-soft me-1 mb-1 mb-md-0"
                                                                        @click="deleteSlide(slide.id)">Supprimer</button>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>

                                            </div>
                                            <!-- Card body END -->
                                        </div>
                                    </div>
                                    <!-- Linked account END -->

                                    <!-- Social account END -->
                                    <div class="col-sm-6">
                                        <div class="card border rounded-3">
                                            <!-- Card header -->
                                            <div class="card-header border-bottom">
                                                <h5 class="card-header-title">Ajouter un slide</h5>
                                            </div>
                                            <!-- Card body START -->
                                            <div class="card-body">
                                                <div class="mb-3">
                                                    <label class="form-label">Libellé</label>
                                                    <input class="form-control" v-model="slide.titre" type="text"
                                                        placeholder="Libellé du service">
                                                </div>

                                                <div class="mb-3">
                                                    <label class="form-label">Sous-titre</label>
                                                    <input class="form-control" v-model="slide.sousTitre" type="text"
                                                        placeholder="Libellé du sous-titre">
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label">Description</label>
                                                    <input class="form-control" v-model="slide.descriptif" type="text"
                                                        placeholder="Libellé de la description">
                                                </div>

                                                <FilePond ref="filePond" name="file" :server="uploadConfig"
                                                    accepted-file-types="image/*"
                                                    label-idle="Déposez votre image ou cliquez pour sélectionner"
                                                    @processfile="UploadResponse" />

                                                <form id="dropzone" class="dropzone"></form>

                                                <div class="d-flex justify-content-end mt-4">
                                                    <button type="button" @click="saveSlide"
                                                        class="btn btn-primary mb-0">Enregistrer</button>
                                                </div>
                                            </div>
                                            <!-- Card body END -->
                                        </div>
                                    </div>
                                    <!-- Social account END -->

                                    <!-- Active logs START -->
                                    <!-- <div class="col-12"> -->

                                    <!-- </div> -->
                                    <!-- Active logs END -->
                                </div>
                            </div>
                            <!-- Tab content 3 END -->
                        </div>
                    </div>
                </div>
                <!-- Tabs Content END -->
            </div>
        </section>

    </main>
</template>

<script setup>
import Dropzone from 'dropzone'
import 'dropzone/dist/dropzone.css'
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useLoading } from "vue-loading-overlay";
import { ElMessage } from "element-plus";
import { API_URLS } from "@/config/api";
import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview
);


const store = useStore()
const loading = useLoading();
const reponseUpload = ref(null);
const slide = ref({
    titre: '',
    sousTitre: '',
    descriptif: '',
    fichier: null,
})
const slides = ref([])
const fichier = ref([])

onMounted(() => {
    const dropzone = new Dropzone("#dropzone", {
        // url: "https://93.115.20.172:8081/fichier/add",
        url: `${API_URLS.ADD_FICHIER}`,
        maxFiles: 10,
        thumbnailWidth: 150,
        thumbnailHeight: 150,
        init: function () {
            this.on("success", (form, response) => {
                fichier.value.push(response)
            })

            this.on("error", (form, errorMessage) => {
                console.error("Erreur lors de l'upload :", errorMessage)
            })
        },
    })

    loadSlides()
})
const updateSlide = async () => {
    try {
        await store.dispatch('slide/update', categorie.value)
        alert("Slide modifié avec succès !")
        await loadSlides()
    } catch (error) {
        console.error("Erreur lors de la modification :", error)
    }
}

const deleteSlide = async (id) => {
    if (confirm("Voulez-vous vraiment supprimer cet slide ?")) {
        const loader = loading.show();
        try {
            await store.dispatch('slide/delete', id)
            ElMessage({
                showClose: true,
                message: 'Element supprimé avec success.',
                type: "success",
            });
            await loadSlides()
        } catch (error) {
            console.error("Erreur lors de la suppression :", error)
        } finally {
            loader.hide();
            loadSlides()
        }
    }
}
const saveSlide = async () => {
    const loader = loading.show();
    try {
        const payload = {
            titre: slide.value.titre,
            sousTitre: slide.value.sousTitre,
            descriptif: slide.value.descriptif,
            fichier: reponseUpload.value,
        }
        const response = await store.dispatch('slide/create', payload)
        ElMessage({
            showClose: true,
            message: 'Element ajouté avec success.',
            type: "success",
        });
    } catch (error) {
        console.error('Erreur lors de la création de la catégorie:', error)
    } finally {
        loader.hide();
        loadSlides()
    }
}

const loadSlides = async () => {
    const loader = loading.show();
    try {
        slides.value = await store.dispatch('slide/getAll')
    } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error)
    } finally {
        loader.hide();
    }
}

const uploadConfig = {
    // url: "https://93.115.20.172:8081/fichier/add",
    url: `${API_URLS.ADD_FICHIER}`,
    process: {
        url: "/",
        method: "POST",
        headers: {
        },
        withCredentials: false,
        onload: (response) => {
            return response;
        },
        onerror: (error) => {
            console.error("Erreur d'upload:", error);
        },
    },
};



const UploadResponse = (error, file) => {
    if (!error) {
        const reponse = JSON.parse(file.serverId);
        console.log("Reponse de l'upload :", response)
        reponseUpload.value = reponse;
    }
};



</script>