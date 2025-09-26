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

                                    <li class="nav-item"> <router-link class="nav-link" to="/service"><i
                                                class="bi bi-journals fa-fw me-1"></i>Services</router-link> </li>

                                    <li class="nav-item"> <router-link class="nav-link" to="/sousService"><i
                                                class="bi bi-bell fa-fw me-1"></i>Sous-Services</router-link> </li>

                                    <li class="nav-item"><router-link class="nav-link active" to="/produits"><i
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
                        <h1 class="fs-4 mb-0"><i class="bi bi-gear fa-fw me-1"></i>Produits Utilisés</h1>
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
                                                <h5 class="card-header-title">Listes des Produits</h5>
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
                                                                <th scope="col" class="border-0">Sous-Service</th>
                                                                <th scope="col" class="border-0">Action</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            <tr v-for="item in filterItems" :key="item">
                                                                <td> {{ item.id }}</td>
                                                                <td> {{ item.nom }} </td>
                                                                <td> {{ item.typeService?.nom }} </td>
                                                                <td> <button
                                                                        class="btn btn-sm btn-danger-soft me-1 mb-1 mb-md-0"
                                                                        @click="deleteProduit(item.id)">Supprimer</button>
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
                                    <el-dialog v-model="modalVisible" title="Modifier le produit">
                                        <div class="mb-3">
                                            <label class="form-label">Libellé</label>
                                            <input class="form-control" v-model="produitsSelectionnee.nom" type="text"
                                                placeholder="Libellé du service">
                                        </div>

                                        <FilePond ref="filePond" name="file" :server="uploadConfig"
                                            accepted-file-types="image/*"
                                            label-idle="Déposez votre image ou cliquez pour sélectionner"
                                            @processfile="UploadResponse" />

                                        <template #footer>
                                            <el-button @click="modalVisible = false">Annuler</el-button>
                                            <el-button type="primary"
                                                @click="confirmUpdateProduits">Modifier</el-button>
                                        </template>
                                    </el-dialog>
                                    <!-- Social account END -->
                                    <div class="col-lg-5">
                                        <div class="card border rounded-3">
                                            <!-- Card header -->
                                            <div class="card-header border-bottom">
                                                <h5 class="card-header-title">
                                                    Ajouter un Produit</h5>
                                            </div>
                                            <!-- Card body START -->
                                            <div class="card-body">
                                                <div class="mb-3">
                                                    <label class="form-label">Libellé</label>
                                                    <input class="form-control" v-model="typeService.nom" type="text"
                                                        placeholder="Libellé du produit">
                                                </div>

                                                <div class="mb-3">
                                                    <label class="form-label">Service</label>
                                                    <select class="form-control" v-model="typeService.categorie">
                                                        <option selected :value="null">Choisir le
                                                            Sous-Service</option>
                                                        <option v-for="items in categorie" :key="items.id"
                                                            :value="items">{{
                                                                items.nom }}</option>
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
import { useStore } from 'vuex'
import { useLoading } from "vue-loading-overlay";

import { ElMessage, ElMessageBox } from "element-plus";


const store = useStore()
const loading = useLoading();

const categorie = ref([])
const fichier = ref([])
const typeService = ref({})

const filterItems = ref([])
const modalVisible = ref(false); // Affiche le modal
const produitsSelectionnee = reactive({ nom: "", id: null });
onMounted(() => {
    loadService()
    loadCategorie()
})
// Ouvrir le modal avec les infos de la catégorie sélectionnée
const openModal = (filterItems) => {
    produitsSelectionnee.nom = filterItems.nom;
    produitsSelectionnee.id = filterItems.id;
    modalVisible.value = true;
};
const loadCategorie = async () => {
    try {
        const response = await store.dispatch('sousService/getAll');
        categorie.value = response
    } catch (error) {
        console.error("Erreur lors du chargement des régions :", error);
    }
}


const saveCategory = async () => {
    const loader = loading.show();
    try {
        const payload = {
            nom: typeService.value.nom,
            typeService: typeService.value.categorie,
        }
        const response = await store.dispatch('produits/create', payload)
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
// Confirmer la mise à jour de la catégorie
const confirmUpdateProduits = async () => {
    try {
        // Afficher la boîte de confirmation
        await ElMessageBox.confirm(
            "Voulez-vous vraiment mettre à jour ce produit ?",
            "Confirmation",
            {
                confirmButtonText: "Oui",
                cancelButtonText: "Annuler",
                type: "warning",
            }
        );

        // Si l'utilisateur confirme, on met à jour la catégorie
        await store.dispatch("produits/update", produitsSelectionnee);
        ElMessage({
            showClose: true,
            message: "produit mis à jour avec succès.",
            type: "success",
        });

        modalVisible.value = false; // Fermer le modal après succès
        loadProduits(); // Recharger les catégories mises à jour
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        ElMessage({
            showClose: true,
            message: "Erreur lors de la mise à jour. Veuillez réessayer.",
            type: "error",
        });
    }
};
const deleteProduit = async (id) => {

    await ElMessageBox.confirm(
        "Voulez-vous vraiment supprimer cet produit ?",
        "Confirmation",
        {
            confirmButtonText: "Oui",
            cancelButtonText: "Annuler",
            type: "warning",
        }
    );
    try {
        await store.dispatch('produits/delete', id)
        const loader = loading.show();
        ElMessage({
            showClose: true,
            message: 'Element supprimé avec success.',
            type: "success",
        });
    } catch (error) {
        console.error("Erreur lors de la suppression :", error)
    } finally {
        loader.hide();
        loadProduits()
    }

}

const loadService = async () => {
    const loader = loading.show();
    try {
        filterItems.value = await store.dispatch('produits/getAll')
    } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error)
    } finally {
        loader.hide();
    }
}
// const getStatusClass = (status) => {
//     const statusClasses = {
//         'Payé': 'text-bg-primary',  // Bleu
//         'Encours': 'text-bg-danger',       // Rouge
//         'Fermé': 'text-bg-success', // Vert
//         'Moitié payé': 'text-bg-warning'   // Jaune
//     };
//     return statusClasses[status] || 'text-bg-secondary'; // Couleur par défaut (gris)
// };


</script>
