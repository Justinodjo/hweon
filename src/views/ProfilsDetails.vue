<template>
    <div>
        <div class="card border">
            <div class="card-header border-bottom">
                <h4 class="card-header-title text-center">Informations personnelles</h4>
            </div>

            <div class="card-body">
                <form class="row g-3" @submit.prevent="saveChanges">
                    <!-- Photo de profil -->
                    <!-- <div class="col-12">
                        <label class="form-label">Photo de profil<span class="text-danger">*</span></label>
                        <div class="d-flex align-items-center">
                            <label class="position-relative me-4" for="uploadfile-1">
                                <span class="avatar avatar-xl">
                                    <img :src="photoPreview || defaultPhoto"
                                        class="avatar-img rounded-circle border border-white border-3 shadow"
                                        alt="photo" />
                                    
                                </span>
                            </label>
                            <label class="btn btn-sm btn-primary-soft mb-0" for="uploadfile-1">Changer</label>
                            <input id="uploadfile-1" class="form-control d-none" type="file" @change="onFileChange" />

                        </div>
                    </div> -->
                    <FilePond ref="filePond" name="file" :server="uploadConfig" accepted-file-types="image/*"
                        label-idle="Déposez votre image ou cliquez pour sélectionner" @processfile="UploadResponse" />

                    <!-- Nom -->
                    <div class="col-md-6">
                        <label class="form-label">Nom<span class="text-danger">*</span></label>
                        <input type="text" class="form-control" v-model="user.secondName"
                            placeholder="Entrer votre nom" />
                    </div>
                    <!-- Nom -->
                    <div class="col-md-6">
                        <label class="form-label">Prénom<span class="text-danger">*</span></label>
                        <input type="text" class="form-control" v-model="user.name"
                            placeholder="Entrer votre prénom " />
                    </div>
                    <!-- Email -->
                    <div class="col-md-6">
                        <label class="form-label">Adresse email<span class="text-danger">*</span></label>
                        <input type="email" class="form-control" v-model="user.email"
                            placeholder="Entrer votre email" />
                    </div>

                    <!-- Téléphone -->
                    <div class="col-md-6">
                        <label class="form-label">Numéro de téléphone<span class="text-danger">*</span></label>
                        <input type="text" class="form-control" v-model="user.numero"
                            placeholder="Entrer votre numéro" />
                    </div>
                    <!-- <div class="col-md-6">
                        <label class="form-label">Numéro de téléphone<span class="text-danger">*</span></label>
                        <input type="text" class="form-control" v-model="user?.roles"
                            placeholder="Entrer votre numéro" />
                    </div> -->
                    <div class="mb-6 position-relative">
                        <label class="form-label">Password</label>
                        <input class="form-control fakepassword" type="password" autocomplete="current-password"
                            v-model="user.password" id="psw-input">
                        <span class="position-absolute top-50 end-0 translate-middle-y p-0 mt-3">
                            <i class="fakepasswordicon fas fa-eye-slash cursor-pointer p-2"></i>
                        </span>
                    </div>

                    <!-- Date de naissance -->
                    <div class="col-md-6">
                        <label class="form-label datetime-picker">Date de naissance<span
                                class="text-danger">*</span></label>
                        <input type="date" class="form-control" v-model="user.dateNaissance" />
                    </div>

                    <!-- Adresse -->
                    <div class="col-12">
                        <label class="form-label">Adresse</label>
                        <textarea class="form-control" v-model="user.adresse" rows="3"></textarea>
                    </div>

                    <!-- Bouton Sauvegarde -->
                    <div class="col-12 text-end">
                        <button type="submit" class="btn btn-primary mb-0">Sauvegarder</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, markRaw, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useLoading } from "vue-loading-overlay";
import { setFichier, setEmail, setUserName, setUserInfo, setSecondName } from "@/helpers/auth";
import Dropzone from 'dropzone'
import 'dropzone/dist/dropzone.css'
import { getToken } from "@/helpers/auth";
import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { API_URLS } from "@/config/api";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute } from 'vue-router';
const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview
);
const loading = useLoading();
const fichier = ref([]);
const store = useStore();
const route = useRoute();
const user = ref({
    name: '',
    secondName: '',
    dateNaissance: '',
    password: "",
    adresse: '',
    email: '',
    numero: '',
    fichier: null, // pour un fichier unique, par exemple le fichier de profil
    fichiers: []  // pour la liste des fichiers associés
})

const defaultPhoto = new URL('@/assets/images/avatar/01.jpg', import.meta.url).href
const photoPreview = ref(null)
const selectedFile = ref(null)

onMounted(async () => {
    const loader = loading.show();
    try {
        // Récupère l'ID utilisateur depuis Vuex
        const userId = store.getters['auth/userInfo'];
        console.log("Voici mon id :", userId)
        if (!userId) {
            ElMessage({
                message: "Identifiant utilisateur non fourni.",
                type: "error",
            });
            return;
        }

        const result = await store.dispatch('user/getOne', userId)
        Object.assign(user.value, result); // 👈 préserve la réactivité

        // Sécurise les fichiers
        if (!Array.isArray(user.value.fichiers)) {
            user.value.fichiers = [];
        }
        if (result.fichier) {
            photoPreview.value = import.meta.env.VITE_API_URL + '/uploads/' + result.fichier;
        }
    } catch (error) {
        console.error('Erreur de chargement :', error)
    } finally {
        loader.hide(); // Ferme le loader
    }
})

// const onFileChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//         selectedFile.value = file
//         photoPreview.value = URL.createObjectURL(file)
//     }
// }

const saveChanges = async () => {

    if (!user.value.name || !user.value.secondName || !user.value.email || !user.value.numero) {
        ElMessage({
            message: "Tous les champs obligatoires doivent être remplis.",
            type: "warning",
        });
        return;
    }
    await ElMessageBox.confirm(
        "Voulez-vous vraiment mettre à jour vos informations ?",
        "Confirmation",
        {
            confirmButtonText: "Oui",
            cancelButtonText: "Annuler",
            type: "warning",
        }
    );
    try {
        // const formData = new FormData();

        // // Ajouter les données de l'utilisateur
        // for (const key in user.value) {
        //     formData.append(key, user.value[key]);
        // }

        // // Ajouter la photo de profil si elle existe
        // if (selectedFile.value) {
        //     formData.append('fichier', selectedFile.value);
        // }

        // // Ajouter les fichiers supplémentaires si existants
        // if (Array.isArray(user.value.fichier) && user.value.fichier.length > 0) {
        //     user.value.fichier.forEach((file) => {
        //         formData.append('fichier[]', file); // Utilisation du tableau 'fichiers[]' pour plusieurs
        //     });
        // }
        const fichierId = reponseUpload.value && !isNaN(reponseUpload.value)
            ? Number(reponseUpload.value)
            : null;
        const payload = {
            id: store.getters['auth/userInfo'],
            name: user.value.name,
            secondName: user.value.secondName,
            dateNaissance: user.value.dateNaissance,
            password: user.value.password,
            adresse: user.value.adresse,
            numero: user.value.numero,
            email: user.value.email,
            fichier: fichierId,     // ✅ contient maintenant {id: ...}
        }
        // Envoyer la requête avec FormData
        await store.dispatch('user/update', payload);
        // Libération de l'URL de la photo si elle a été modifiée
        // if (photoPreview.value) {
        //     URL.revokeObjectURL(photoPreview.value); // Libération de l'URL de la photo
        // }

        ElMessage({
            showClose: true,
            message: 'Modifications sauvegardées !',
            type: "success",
        });


    } catch (e) {
        console.error(e);
        ElMessage({
            message: "Une erreur s'est produite.",
            type: "error",
        });
    }
};
const deleteFile = (file) => {
    const index = user.value.fichiers.indexOf(file);
    if (index > -1) {
        user.value.fichiers.splice(index, 1);
        ElMessage({
            message: "Fichier supprimé.",
            type: "info",
        });
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
            // ✅ On stocke le fichier renvoyé par le backend
            fichier.value.push(fileData);



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



        // ✅ Stocker l'ID globalement
        reponseUpload.value = reponse.id;
        // ✅ On met à jour le cookie avec l'ID du fichier
        setFichier(reponse.id);

        // ✅ On met à jour l’aperçu
        photoPreview.value = `${API_URLS.API_BASE}/fichier/download/${reponse.id}`;
        // ✅ Mettre à jour le store Vuex
        store.commit('auth/setUserFichier', reponse.id); // ou dispatch une action si tu préfères

        // ✅ On notifie le sidebar ou le header
        emit('avatar-updated', reponse.id);
    }
};


</script>

<style scoped>
.avatar-img {
    width: 80px;
    height: 80px;
    object-fit: cover;
}
</style>
