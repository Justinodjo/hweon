<template>
    <!-- **************** CONTENU PRINCIPAL START **************** -->
    <main>

        <!-- =======================
        Contenu START -->
        <section class="header-main pt-8">
            <div class="container">
                <div class="row">
                    <!-- Contenu principal START -->
                    <div class="col-lg-8 col-xl-9">

                        <!-- Card START -->
                        <div class="card border">
                            <!-- En-tête de la Card -->
                            <div class="card-header border-bottom">
                                <h4 class="card-header-title">Supprimer mon compte</h4>
                            </div>

                            <!-- Corps de la Card START -->
                            <div class="card-body">
                                <h6>Avant de partir...</h6>
                                <ul>
                                    <li>Faites une sauvegarde de vos données <a href="account-delete.html#">ici</a></li>
                                    <li>Si vous supprimez votre compte, vous perdrez toutes vos données.</li>
                                </ul>
                                <div class="form-check form-check-md my-4">
                                    <input class="form-check-input" type="checkbox" value="" id="deleteaccountCheck"
                                        v-model="isChecked">
                                    <label class="form-check-label" for="deleteaccountCheck">Oui, je souhaite supprimer
                                        mon compte</label>
                                </div>

                                <a href="account-delete.html#" class="btn btn-success-soft btn-sm mb-2 mb-sm-0">Garder
                                    mon compte</a>

                                <a href="javascript:void(0)" @click="confirmDelete"
                                    :class="{ 'btn-danger': isChecked, 'btn-secondary': !isChecked }"
                                    class="btn btn-sm mb-0" :disabled="!isChecked">
                                    Supprimer mon compte
                                </a>
                            </div>
                            <!-- Corps de la Card END -->
                        </div>
                        <!-- Card END -->
                    </div>
                    <!-- Contenu principal END -->
                </div>
            </div>
        </section>
        <!-- =======================
        Contenu END -->

    </main>
    <!-- **************** CONTENU PRINCIPAL END **************** -->
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

// Contrôle de l'état de la case à cocher
const isChecked = ref(false);

// Fonction de confirmation de suppression
const confirmDelete = async () => {

    try {
        // Affichage de la boîte de confirmation avant de supprimer
        await ElMessageBox.confirm(
            'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
            'Confirmation de suppression',
            {
                confirmButtonText: 'Oui, supprimer',
                cancelButtonText: 'Annuler',
                type: 'warning',
            }
        );
        // Si l'utilisateur a bien coché la case
        if (isChecked.value) {
            const userId = store.getters['auth/userInfo'];

            // Vérification du rôle utilisateur avant la suppression (si nécessaire)
            const userRole = store.getters['auth/userRole']; // Exemple d'un getter dans ton store
            if (userRole !== 'SUPPLYER_ROLES' && userRole !== 'LOCATAIRE_ROLES') {
                ElMessage({
                    message: "Vous n'êtes pas autorisé à supprimer ce compte.",
                    type: 'error',
                });
                return;
            }
            // Suppression de l'utilisateur via Vuex
            await store.dispatch('user/delete', userId);  // Appelle l'action Vuex pour supprimer le compte

            // Message de succès
            ElMessage({
                message: 'Votre compte a été supprimé avec succès.',
                type: 'success',
            });

            // Rediriger après une courte attente
            setTimeout(() => {
                router.push('/directory/login');
            }, 2000);
        } else {
            ElMessage({
                message: 'Vous devez cocher la case pour confirmer la suppression.',
                type: 'warning',
            });


        }
    } catch (error) {
        // Si l'utilisateur annule la suppression
        console.log('Suppression annulée');
    }
};
</script>

<style scoped>
/* Tu peux ajouter des styles ici si nécessaire */
</style>
