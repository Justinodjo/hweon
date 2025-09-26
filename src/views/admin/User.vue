<template>
    <main class="py-5">

        <section class="header-main">
            <div class="container">
                <div class="card rounded-3 border p-3 pb-2">
                    <!-- Avatar and info START -->
                    <div class="d-sm-flex">
                        <div class="avatar avatar-xl mb-2 mb-sm-0">
                            <img class="avatar-img rounded-circle" src="@/assets/images/avatar/01.jpg" alt="">
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
            <div class="container vstack gap-4">
                <!-- Title START -->
                <div class="row align-items-center">
                    <div class="col-12 ">
                        <h1 class="fs-4 mb-0"><i class="bi bi-gear fa-fw me-1"></i> Utilisateurs</h1>
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
                                    <div class="col-sm-8">
                                        <div class="card border">

                                            <!-- Card header -->
                                            <div class="card-header border-bottom">
                                                <h5 class="card-header-title">Listes des Utilisateurs</h5>
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
                                                                <th scope="col" class="border-0">Nom</th>
                                                                <th scope="col" class="border-0">Prénom</th>
                                                                <th scope="col" class="border-0">Email</th>
                                                                <!-- <th scope="col" class="border-0">Status</th> -->
                                                                <th scope="col" class="border-0">Adresse</th>
                                                                <!-- <th scope="col" class="border-0">Activation</th> -->
                                                                <th scope="col" class="border-0">Rôle</th>
                                                                <th scope="col" class="border-0">Action</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            <tr v-for="item in filterItems" :key="item.id">
                                                                <td> {{ item.id }}</td>
                                                                <td> {{ item.secondName }} </td>
                                                                <td> {{ item.name }} </td>
                                                                <td> {{ item.email }} </td>
                                                                <!-- <td>
                                                                    <span
                                                                        :class="['badge', item.status === 'Vendu' ? 'text-bg-danger' : 'text-bg-success']">
                                                                        {{ item.status }}
                                                                    </span>
                                                                </td> -->
                                                                <td> {{ item.adresse }} </td>
                                                                <!-- <td>

                                                                    <span
                                                                        :class="['badge', item.activated ? 'bg-success bg-opacity-10 text-success' : 'bg-orange bg-opacity-10 text-orange']">
                                                                        {{ item.activated ? "Activé" : "Désactivé" }}
                                                                    </span>
                                                                </td> -->
                                                                <td> {{ item.roles && item.roles[0] ?
                                                                    item.roles[0].nomRole : 'Rôle non défini' }} </td>
                                                                <td>
                                                                    <button
                                                                        class="btn btn-sm btn-danger-soft me-1 mb-1 mb-md-0"
                                                                        @click="deleteUser(item.id)">Supprimer</button>
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
                                    <el-dialog v-model="modalVisible" title="Modifier l'utilisateur">
                                        <div class="mb-3">
                                            <label class="form-label">Nom</label>
                                            <input class="form-control" v-model="userSelectionnee.secondName" type="text"
                                                placeholder="Nom de l'utilisateur">
                                        </div>

                                        <div class="mb-3">
                                            <label class="form-label">Prénom</label>
                                            <input class="form-control" v-model="userSelectionnee.name" type="text"
                                                placeholder="Prénom de l'utilisateur">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Email</label>
                                            <input class="form-control" v-model="userSelectionnee.email" type="email"
                                                placeholder="Email de l'utilisateur">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Téléphone</label>
                                            <input class="form-control" v-model="userSelectionnee.numero" type="email"
                                                placeholder="Numéro de l'utilisateur">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Mot de passe</label>
                                            <input class="form-control" v-model="userSelectionnee.password" type="text"
                                                placeholder="Mot de passe de l'utilisateur">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Adresse</label>
                                            <input class="form-control" v-model="userSelectionnee.adresse" type="text"
                                                placeholder="Adresse de l'utilisateur">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Date de Naissance</label>
                                            <input class="form-control" v-model="userSelectionnee.dateNaissance" type="date"
                                                placeholder="Date de naissance">
                                        </div>

                                        <div class="mb-3">
                                            <label class="form-label">Rôle</label>
                                            <select class="form-control" v-model="userSelectionnee.roles">
                                                <option selected :value="null">Choisir le Rôle
                                                </option>
                                                <option v-for="items in role" :key="items.id" :value="items.nomRole">
                                                    {{
                                                        items.nomRole }}</option>
                                            </select>
                                        </div>

                                        <FilePond ref="filePond" name="file" :server="uploadConfig"
                                            accepted-file-types="image/*"
                                            label-idle="Déposez votre image ou cliquez pour sélectionner"
                                            @processfile="UploadResponse" />

                                        <template #footer>
                                            <el-button @click="modalVisible = false">Annuler</el-button>
                                            <el-button type="primary" @click="confirmUpdateUser">Modifier</el-button>
                                        </template>
                                    </el-dialog>
                                    <!-- Social account END -->
                                    <div class="col-sm-4">
                                        <div class="card border rounded-3">
                                            <!-- Card header -->
                                            <div class="card-header border-bottom">
                                                <h5 class="card-header-title">Ajouter un Utilisateur</h5>
                                            </div>
                                            <!-- Card body START -->
                                            <div class="card-body">
                                                <div class="mb-3">
                                                    <label class="form-label">Nom</label>
                                                    <input class="form-control" v-model="user.secondName" type="text"
                                                        placeholder="Nom de l'utilisateur">
                                                </div>

                                                <div class="mb-3">
                                                    <label class="form-label">Prénom</label>
                                                    <input class="form-control" v-model="user.name" type="text"
                                                        placeholder="Prénom de l'utilisateur">
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label">Email</label>
                                                    <input class="form-control" v-model="user.email" type="email"
                                                        placeholder="Email de l'utilisateur">
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label">Téléphone</label>
                                                    <input class="form-control" v-model="user.numero" type="text"
                                                        placeholder="Numéro de l'utilisateur">
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label">Mot de passe</label>
                                                    <input class="form-control" v-model="user.password" type="text"
                                                        placeholder="Mot de passe de l'utilisateur">
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label">Adresse</label>
                                                    <input class="form-control" v-model="user.adresse" type="text"
                                                        placeholder="Adresse de l'utilisateur">
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label">Date de Naissance</label>
                                                    <input class="form-control" v-model="user.dateNaissance" type="date"
                                                        placeholder="Date de naissance">
                                                </div>

                                                <div class="mb-3">
                                                    <label class="form-label">Rôle</label>
                                                    <select class="form-control" v-model="user.roles">
                                                        <option selected :value="null">Choisir le Rôle
                                                        </option>
                                                        <option v-for="items in role" :key="items.id"
                                                            :value="items.nomRole">
                                                            {{
                                                                items.nomRole }}</option>
                                                    </select>
                                                </div>

                                                <FilePond ref="filePond" name="file" :server="uploadConfig"
                                                    accepted-file-types="image/*"
                                                    label-idle="Déposez votre image ou cliquez pour sélectionner"
                                                    @processfile="UploadResponse" />

                                                <form id="dropzone" class="dropzone"></form>

                                                <div class="d-flex justify-content-end mt-4">
                                                    <button type="button" @click="saveUser"
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
import { onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useLoading } from "vue-loading-overlay";
import { ElMessage, ElMessageBox } from "element-plus";
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
const user = ref({})
const role = ref([])
const fichier = ref([])
const modalVisible = ref(false); // Affiche le modal
const userSelectionnee = reactive({
    name: '',
    secondName: '',
    dateNaissance: '',
    adresse: '',
    email: '',
    password: '', roles: [], fichier: null, fichiers: [], id: null
});
const filterItems = ref([])

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
    // loadSousCategorie()
    loadRoles()
    loadUsers()
})

const loadRoles = async () => {
    try {
        const response = await store.dispatch('role/getAll');
        role.value = response
    } catch (error) {
        console.error("Erreur lors du chargement des rôles :", error);
    }
}
// const loadSousCategorie = async () => {
//     try {
//         const response = await store.dispatch('sousService/getAll');
//         typeCategorie.value = response
//     } catch (error) {
//         console.error("Erreur lors du chargement des régions :", error);
//     }
// }
const openModal = (filterItems) => {
    userSelectionnee.secondName = filterItems.secondName;
    userSelectionnee.name = filterItems.name;
    userSelectionnee.email = filterItems.email;
    userSelectionnee.numero = filterItems.numero;
    userSelectionnee.adresse = filterItems.adresse;
    userSelectionnee.password = filterItems.password;
    userSelectionnee.dateNaissance = filterItems.dateNaissance;
    userSelectionnee.roles = filterItems.roles;
    userSelectionnee.id = filterItems.id;
    modalVisible.value = true;
};
// Confirmer la mise à jour de la catégorie
const confirmUpdateUser = async () => {
    try {
        // Afficher la boîte de confirmation
        await ElMessageBox.confirm(
            "Voulez-vous vraiment mettre à jour ce utilisateur ?",
            "Confirmation",
            {
                confirmButtonText: "Oui",
                cancelButtonText: "Annuler",
                type: "warning",
            }
        );

        // Si l'utilisateur confirme, on met à jour la catégorie
        await store.dispatch("user/update", userSelectionnee);
        ElMessage({
            showClose: true,
            message: "Utilisateur mis à jour avec succès.",
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

const saveUser = async () => {
    const loader = loading.show();
    try {
        const payload = {
            name: user.value.name,
            secondName: user.value.secondName,
            dateNaissance: user.value.dateNaissance,
            adresse: user.value.adresse,
            email: user.value.email,
            numero: user.value.numero,
            password: user.value.password,
            roles: user.value.roles ? [{ nomRole: user.value.roles }] : [],
            fichier: fichier.value.length > 0 ? fichier.value[0] : null, // Si tu veux seulement un fichier unique
            fichiers: fichier.value.length > 1 ? fichier.value : [],
        }
        console.log("Voici mon payload", payload);
        const response = await store.dispatch('user/create', payload)
        ElMessage({
            showClose: true,
            message: 'Element ajouté avec success.',
            type: "success",
        });
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error)
    } finally {
        loader.hide();
        loadUsers()
    }
}
const deleteUser = async (id) => {
    await ElMessageBox.confirm(
        "Voulez-vous vraiment supprimer cet utilisateur ?",
        "Confirmation",
        {
            confirmButtonText: "Oui",
            cancelButtonText: "Annuler",
            type: "warning",
        }
    );
    const loader = loading.show();
    try {
        await store.dispatch('user/delete', id)
        ElMessage({
            showClose: true,
            message: 'Element supprimé avec success.',
            type: "success",
        });
    } catch (error) {
        console.error("Erreur lors de la suppression :", error)
    } finally {
        loader.hide();
        loadUsers()
    }

}

const loadUsers = async () => {
    const loader = loading.show();
    try {
        filterItems.value = await store.dispatch('user/getAll')
    } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error)
    } finally {
        loader.hide();
    }
}

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
// Réponse de l'upload (après traitement)
const reponseUpload = ref(null);
const UploadResponse = (error, fileData) => {
    if (!error) {
        const reponse = JSON.parse(fileData.serverId);
        reponseUpload.value = reponse;
    }
};

</script>
