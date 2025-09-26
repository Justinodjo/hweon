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

                                    <li class="nav-item"> <router-link class="nav-link" to="/manager_dashboard"><i
                                                class="bi bi-house-door fa-fw me-1"></i>Accueil</router-link> </li>

                                    <li class="nav-item"> <router-link class="nav-link" to="/manager_service"><i
                                                class="bi bi-journals fa-fw me-1"></i>Services</router-link> </li>

                                    <li class="nav-item"> <router-link class="nav-link active"
                                            to="/manager_sousService"><i
                                                class="bi bi-bell fa-fw me-1"></i>Sous-Services</router-link> </li>

                                    <li class="nav-item"><router-link class="nav-link" to="/manager_produits"><i
                                                class="bi bi-star fa-fw me-1"></i>Produits</router-link></li>
                                    <!-- <li class="nav-item"><router-link class="nav-link" to="/manager_user"><i
                                                class="bi bi-star fa-fw me-1"></i>Users</router-link></li> -->
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
                        <h1 class="fs-4 mb-0"><i class="bi bi-gear fa-fw me-1"></i>Sous-Services</h1>
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
                                    <div class="col-lg-7">
                                        <div class="card border">

                                            <!-- Card header -->
                                            <div class="card-header border-bottom">
                                                <h5 class="card-header-title">Listes des Sous-Services</h5>
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
                                                                <th scope="col" class="border-0">Prix</th>
                                                                <th scope="col" class="border-0">Service</th>
                                                                <th scope="col" class="border-0">Action</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            <tr v-for="item in filterItems" :key="item">
                                                                <td> {{ item.id }}</td>
                                                                <td> {{ item.nom }} </td>
                                                                <td> {{ item.prix }} </td>
                                                                <td> {{ item.categorie?.nom }} </td>
                                                                <td> <button @click="deleteTypeService(item.id)"
                                                                        class="btn btn-sm btn-danger-soft me-1 mb-1 mb-md-0">Supprimer</button>
                                                                    <button
                                                                        class="btn btn-sm btn-primary-soft me-1 mb-1 mb-md-0"
                                                                        @click="openModal(item)">Modifier</button>
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
                                    <!-- MODAL DE MODIFICATION -->
                                    <el-dialog v-model="modalVisible" title="Modifier le sous-service">
                                        <div class="mb-3">
                                            <label class="form-label">Libellé</label>
                                            <input class="form-control" v-model="typeServiceSelectionnee.nom"
                                                type="text" placeholder="Libellé du sous-service">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Service</label>
                                            <select class="form-control" v-model="typeServiceSelectionnee.categorie">
                                                <option selected :value="typeServiceSelectionnee.categorie">Choisir le
                                                    Service</option>
                                                <option v-for="items in categorie" :key="items.id" :value="items">{{
                                                    items.nom }}</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Libellé</label>
                                            <input class="form-control" v-model="typeServiceSelectionnee.prix"
                                                type="text" placeholder="Prix du sous-service">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Libellé</label>
                                            <textarea class="form-control" v-model="typeServiceSelectionnee.description"
                                                type="text" rows="3" spellcheck="false"
                                                placeholder="Description du service"></textarea>
                                        </div>
                                        <!-- <FilePond ref="filePond" name="file" :server="uploadConfig"
                                            accepted-file-types="image/*"
                                            label-idle="Déposez votre image ou cliquez pour sélectionner"
                                            @processfile="UploadResponse" /> -->

                                        <template #footer>
                                            <el-button @click="modalVisible = false">Annuler</el-button>
                                            <el-button type="primary" @click="confirmUpdateService">Modifier</el-button>
                                        </template>
                                    </el-dialog>
                                    <!-- Social account END -->
                                    <div class="col-lg-5">
                                        <div class="card border rounded-3">
                                            <!-- Card header -->
                                            <div class="card-header border-bottom">
                                                <h5 class="card-header-title">Ajouter un Sous-Services</h5>
                                            </div>
                                            <!-- Card body START -->
                                            <div class="card-body">
                                                <div class="mb-3">
                                                    <label class="form-label">Libellé</label>
                                                    <input class="form-control" v-model="typeService.nom" type="text"
                                                        placeholder="Libellé du sous-service">
                                                </div>

                                                <div class="mb-3">
                                                    <label class="form-label">Prix</label>
                                                    <input class="form-control" v-model="typeService.prix" type="text"
                                                        placeholder="Prix du service">
                                                </div>

                                                <div class="mb-3">
                                                    <label class="form-label">Service</label>
                                                    <select class="form-control" v-model="typeService.categorie">
                                                        <option selected :value="null">Choisir le Service</option>
                                                        <option v-for="items in categorie" :key="items.id"
                                                            :value="items">{{ items.nom }}</option>
                                                    </select>
                                                </div>

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
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useStore } from 'vuex'
import { useLoading } from "vue-loading-overlay";
import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

const store = useStore()
const loading = useLoading();

const categorie = ref([])
const fichier = ref([])
const typeService = ref({})
const modalVisible = ref(false); // Affiche le modal
const typeServiceSelectionnee = reactive({ nom: "", description: "", prix: null, id: null });
const filterItems = ref([])

onMounted(() => {
    loadService()
    loadCategorie()
})

const loadCategorie = async () => {
    try {
        const response = await store.dispatch('categorie/getAll');
        categorie.value = response
    } catch (error) {
        console.error("Erreur lors du chargement des régions :", error);
    }
}
// Ouvrir le modal avec les infos de la catégorie sélectionnée
const openModal = (typeService) => {
    typeServiceSelectionnee.nom = typeService.nom;
    typeServiceSelectionnee.prix = typeService.prix;
    typeServiceSelectionnee.description = typeService.description;
    typeServiceSelectionnee.description = typeService.description;
    typeServiceSelectionnee.categorie = typeService.categorie;
    modalVisible.value = true;
};
// Confirmer la mise à jour de la catégorie
const confirmUpdateService = async () => {
    try {
        // Afficher la boîte de confirmation
        await ElMessageBox.confirm(
            "Voulez-vous vraiment mettre à jour ce service ?",
            "Confirmation",
            {
                confirmButtonText: "Oui",
                cancelButtonText: "Annuler",
                type: "warning",
            }
        );

        // Si l'utilisateur confirme, on met à jour la catégorie
        await store.dispatch("sousService/update", typeServiceSelectionnee);
        ElMessage({
            showClose: true,
            message: "Service mis à jour avec succès.",
            type: "success",
        });

        modalVisible.value = false; // Fermer le modal après succès
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

const deleteTypeService = async (id) => {
    try {
        // Affichage d'une boîte de confirmation stylisée
        await ElMessageBox.confirm(
            "Voulez-vous vraiment supprimer ce sous-service ?",
            "Confirmation",
            {
                confirmButtonText: "Oui",
                cancelButtonText: "Annuler",
                type: "warning",
            }
        );

        // Afficher le loader pendant la suppression
        const loader = loading.show();

        try {
            await store.dispatch("sousService/delete", id);
            ElMessage({
                showClose: true,
                message: "Élément supprimé avec succès.",
                type: "success",
            });
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            ElMessage({
                showClose: true,
                message: "Erreur lors de la suppression. Veuillez réessayer.",
                type: "error",
            });
        } finally {
            loader.hide();
            await loadService(); // Charger les nouvelles catégories
        }
    } catch (e) {
        console.log("Suppression annulée par l'utilisateur.");
    }
};
const saveCategory = async () => {
    const loader = loading.show();
    try {
        const payload = {
            nom: typeService.value.nom,
            prix: typeService.value.prix,
            categorie: typeService.value.categorie,
        }
        const response = await store.dispatch('sousService/create', payload)
        ElMessage({
            showClose: true,
            message: 'Element ajouté avec success.',
            type: "success",
        });
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
        filterItems.value = await store.dispatch('sousService/getAll')
    } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error)
    } finally {
        loader.hide();
    }
}



</script>
