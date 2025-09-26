<template>
    <main class="py-5">

        <section class="">
            <div class="container">
                <div class="card rounded-3 border p-3 pb-2">
                    <!-- Avatar and info START -->
                    <div class="d-sm-flex align-items-center">
                        <div class="avatar avatar-xl mb-2 mb-sm-0">
                            <img class="avatar-img rounded-circle" src="../../assets/images/avatar/01.jpg" alt="">
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

                                    <!-- <li class="nav-item"> <router-link class="nav-link" to="/reservations"><i
                                                class="bi bi-bookmark-heart fa-fw me-1"></i>Reservations</router-link>
                                    </li> -->

                                    <li class="nav-item"> <router-link class="nav-link active" to="/service"><i
                                                class="bi bi-journals fa-fw me-1"></i>Services</router-link> </li>

                                    <li class="nav-item"> <router-link class="nav-link" to="/sousService"><i
                                                class="bi bi-bell fa-fw me-1"></i>Sous-Services</router-link> </li>

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
            <div class="container vstack gap-4">
                <!-- Title START -->
                <div class="row">
                    <div class="col-12">
                        <h1 class="fs-4 mb-0"><i class="bi bi-gear fa-fw me-1"></i>Services</h1>
                    </div>
                </div>

                <!-- Tabs Content START -->
                <div class="row g-4">
                    <div class="col-12">
                        <div class="tab-content">
                            <!-- Tab content 3 START -->
                            <div class="tab-pane show active" id="tab-1">
                                <div class="row g-4">
                                    <!-- Linked account START -->
                                    <div class="col-lg-6">
                                        <div class="card border">

                                            <!-- Card header -->
                                            <div class="card-header border-bottom">
                                                <h5 class="card-header-title">Listes des Services</h5>
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
                                                                <th scope="col" class="border-0">Action</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            <tr v-for="categorie in categories" :key="categorie">
                                                                <td> {{ categorie.id }}</td>
                                                                <td> {{ categorie.nom }} </td>
                                                                <td>
                                                                    <button @click="deleteCategorie(categorie.id)"
                                                                        class="btn btn-sm btn-danger-soft me-1 mb-1 mb-md-0">Supprimer</button>
                                                                    <button
                                                                        class="btn btn-sm btn-primary-soft me-1 mb-1 mb-md-0"
                                                                        @click="openModal(categorie)">Modifier</button>

                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>

                                            </div>
                                            <!-- Card body END -->
                                        </div>
                                    </div>
                                    <!-- MODAL DE MODIFICATION -->
                                    <el-dialog v-model="modalVisible" title="Modifier le service">
                                        <div class="mb-3">
                                            <label class="form-label">Libellé</label>
                                            <input class="form-control" v-model="categorieSelectionnee.nom" type="text"
                                                placeholder="Libellé du service">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Libellé</label>
                                            <textarea class="form-control" v-model="categorieSelectionnee.descriptif"
                                                type="text" rows="3" spellcheck="false"
                                                placeholder="Description du service"></textarea>
                                        </div>

                                        <FilePond ref="filePond" name="file" :server="uploadConfig"
                                            accepted-file-types="image/*"
                                            label-idle="Déposez votre image ou cliquez pour sélectionner"
                                            @processfile="UploadResponse" />

                                        <template #footer>
                                            <el-button @click="modalVisible = false">Annuler</el-button>
                                            <el-button type="primary"
                                                @click="confirmUpdateCategorie">Modifier</el-button>
                                        </template>
                                    </el-dialog>

                                    <!-- Linked account END -->

                                    <!-- Social account END -->
                                    <div class="col-lg-6">
                                        <div class="card border rounded-3">
                                            <!-- Card header -->
                                            <div class="card-header border-bottom">
                                                <h5 class="card-header-title">Ajouter un service</h5>
                                            </div>
                                            <!-- Card body START -->
                                            <div class="card-body">
                                                <div class="mb-3">
                                                    <label class="form-label">Libellé</label>
                                                    <input class="form-control" v-model="categorie.nom" type="text"
                                                        placeholder="Libellé du service">
                                                </div>

                                                <div class="mb-3">
                                                    <label class="form-label">Description</label>
                                                    <textarea class="form-control" v-model="categorie.descriptif"
                                                        type="text" rows="3" spellcheck="false"
                                                        placeholder="Description du service"></textarea>
                                                </div>

                                                <FilePond ref="filePond" name="file" :server="uploadConfig"
                                                    accepted-file-types="image/*"
                                                    label-idle="Déposez votre image ou cliquez pour sélectionner"
                                                    @processfile="UploadResponse" />

                                                <form id="dropzone" class="dropzone"></form>

                                                <div class="d-flex justify-content-end mt-4">
                                                    <button type="button" @click="saveCategory"
                                                        class="btn btn-primary mb-0">Enregistrer</button>
                                                </div>
                                            </div>
                                            <!-- Card body END -->
                                        </div>
                                    </div>
                                    <!-- Social account END -->

                                    <!-- Active logs START -->
                                    <div class="col-12">

                                    </div>
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
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useStore } from 'vuex'
import { useLoading } from "vue-loading-overlay";
import { getToken } from "../../helpers/auth";
import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { API_URLS } from "@/config/api";
const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview
);

const store = useStore()
const loading = useLoading();
const modalVisible = ref(false); // Affiche le modal
const categorieSelectionnee = reactive({ nom: "", id: null });
const categorie = ref({
    nom: '',
    descriptif: '',
    fichier: null,
})
const categories = ref([])
const fichier = ref([])

onMounted(() => {
    const dropzone = new Dropzone("#dropzone", {
        // url: "https://93.115.20.172:8081/fichier/add",
        url: `${API_URLS.ADD_FICHIER}`,
        maxFiles: 10,
        thumbnailWidth: 150,
        thumbnailHeight: 150,
        headers: {
            "Authorization": `Bearer ${getToken()}`, // Si vous avez besoin d'un token d'autorisation
        },
        init: function () {
            this.on("success", (form, response) => {
                fichier.value.push(response)
            })

            this.on("error", (form, errorMessage) => {
                console.error("Erreur lors de l'upload :", errorMessage)
            })
        },
    })

    loadService()
})

// Ouvrir le modal avec les infos de la catégorie sélectionnée
const openModal = (categorie) => {
    categorieSelectionnee.nom = categorie.nom;
    categorieSelectionnee.descriptif = categorie.descriptif;
    categorieSelectionnee.fichier = categorie.fichier;
    categorieSelectionnee.id = categorie.id;
    modalVisible.value = true;
};

const saveCategory = async () => {
    const loader = loading.show();
    try {
        const payload = {
            nom: categorie.value.nom,
            descriptif: categorie.value.descriptif,
            fichier: fichier.value.length > 0 ? fichier.value[0] : null, // Si tu veux seulement un fichier unique
            fichiers: fichier.value.length > 1 ? fichier.value : [],
        }
        const response = await store.dispatch('categorie/create', payload)
        ElMessage({
            showClose: true,
            message: 'Element ajouté avec succès.',
            type: "success",
        });

        // Réinitialiser après succès
        categorie.value.nom = "";
        categorie.value.descriptif = "";
        fichier.value = [];
    } catch (error) {
        console.error('Erreur lors de la création de la catégorie:', error)
    } finally {
        loader.hide();
        loadService()
    }
}

const loadService = async () => {
    const loader = loading.show();
    try {
        categories.value = await store.dispatch('categorie/getAll')
    } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error)
    } finally {
        loader.hide();
    }
}

// Confirmer la mise à jour de la catégorie
const confirmUpdateCategorie = async () => {
    try {
        await ElMessageBox.confirm(
            "Voulez-vous vraiment mettre à jour ce service ?",
            "Confirmation",
            {
                confirmButtonText: "Oui",
                cancelButtonText: "Annuler",
                type: "warning",
            }
        );

        await store.dispatch("categorie/update", categorieSelectionnee);
        ElMessage({
            showClose: true,
            message: "Service mis à jour avec succès.",
            type: "success",
        });

        modalVisible.value = false;
        loadService(); // Recharger les catégories mises à jour
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        ElMessage({
            showClose: true,
            message: "Erreur lors de la mise à jour. Veuillez réessayer.",
            type: "error",
        });
    }
};

const deleteCategorie = async (id) => {
    try {
        // Confirmer la suppression de la catégorie
        await ElMessageBox.confirm(
            "Voulez-vous vraiment supprimer cette catégorie et ses fichiers associés ?",
            "Confirmation",
            {
                confirmButtonText: "Oui",
                cancelButtonText: "Annuler",
                type: "warning",
            }
        );

        const loader = loading.show();
        try {
            // Récupérer la catégorie avant la suppression pour avoir les fichiers associés
            const categorieToDelete = categories.value.find(categorie => categorie.id === id);
            const fichiersAssociés = categorieToDelete.fichier;

            if (fichiersAssociés && fichiersAssociés.length > 0) {
                // Supprimer les fichiers associés avant de supprimer la catégorie
                await Promise.all(fichiersAssociés.map(fichier => store.dispatch("fichier/deleteFichier", fichier.id)));

                // Si les fichiers sont supprimés avec succès, supprimer la catégorie
                await store.dispatch("categorie/delete", id);

                ElMessage({
                    showClose: true,
                    message: "Catégorie et fichiers supprimés avec succès.",
                    type: "success",
                });
            } else {
                // Si aucun fichier n'est associé à la catégorie, juste supprimer la catégorie
                await store.dispatch("categorie/delete", id);
                ElMessage({
                    showClose: true,
                    message: "Catégorie supprimée avec succès.",
                    type: "success",
                });
            }
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            ElMessage({
                showClose: true,
                message: "Erreur lors de la suppression. Veuillez réessayer.",
                type: "error",
            });
        } finally {
            loader.hide();
            await loadService(); // Recharger les catégories après suppression
        }
    } catch (e) {
        console.log("Suppression annulée par l'utilisateur.");
    }
};


// FilePond configuration
const uploadConfig = {
    // url: "https://93.115.20.172:8081/fichier/add",
    url: `${API_URLS.ADD_FICHIER}`,
    process: {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${getToken()}`, // Attach JWT token
        },
        withCredentials: true,
        onload: (response) => {
            // Transforme la réponse en objet, si nécessaire
            const fileData = JSON.parse(response);  // Si la réponse est une chaîne JSON

            // Assure-toi que la réponse contient l'information que tu veux (comme l'ID du fichier)
            fichier.value.push(fileData);  // Ajoute l'objet de fichier à `fichier`

            return response;
        },
        onerror: (error) => {
            console.error("Erreur d'upload:", error);
            ElMessage({
                showClose: true,
                message: 'Erreur lors de l\'upload du fichier.',
                type: "error",
            });
        },
    },
};

const reponseUpload = ref(null);
const UploadResponse = (error, fileData) => {
    if (!error) {
        const reponse = JSON.parse(fileData.serverId);
        reponseUpload.value = reponse;
    }
};

</script>