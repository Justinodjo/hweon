<template>
    <main>
        <!-- Page content START -->
        <div class="page-content">
            <!-- Page main content START -->
            <div class="page-content-wrapper p-xxl-4">

                <!-- Title -->
                <div class="row">
                    <div class="col-12 mb-4 mb-sm-5">
                        <div class="d-sm-flex justify-content-between align-items-center">
                            <h1 class="h3 mb-3 mb-sm-0">Liste des agents</h1>
                            <div class="d-grid"><a href="admin-agent-list.html#" class="btn btn-primary mb-0"><i
                                        class="bi bi-filetype-pdf me-2"></i>Generate Report</a> </div>
                        </div>
                    </div>
                </div>

                <!-- Search and select START -->
                <div class="row g-3 align-items-center justify-content-between mb-5">
                    <!-- Search -->
                    <div class="col-md-8">
                        <form class="rounded position-relative">
                            <input class="form-control pe-5" type="search" placeholder="Search" aria-label="Search">
                            <button class="btn border-0 px-3 py-0 position-absolute top-50 end-0 translate-middle-y"
                                type="submit"><i class="fas fa-search fs-6"></i></button>
                        </form>
                    </div>

                    <!-- Select option -->
                    <div class="col-md-3">
                        <!-- Short by filter -->
                        <form>
                            <select class="form-select js-choice" aria-label=".form-select-sm">
                                <option value="">Sort by</option>
                                <option>Free</option>
                                <option>Newest</option>
                                <option>Oldest</option>
                            </select>
                        </form>
                    </div>
                </div>
                <!-- Search and select END -->

                <!-- agent list START -->
                <div class="row g-4">
                    <div class="col-md-6 col-lg-4 col-xxl-3" v-for="user in users" :key="user.id">
                        <div class="card border h-100">
                            <!-- Dropdown -->
                            <div class="dropdown position-absolute top-0 end-0 m-3">
                                <a class="btn btn-sm btn-light btn-round small mb-0" data-bs-toggle="dropdown">
                                    <i class="bi bi-three-dots fa-fw"></i>
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end shadow rounded">
                                    <li><a class="dropdown-item" @click.prevent="editUser(user.id)">✏️ Edit</a></li>
                                    <li><a class="dropdown-item" @click.prevent="deleteUser(user.id)">🗑️ Remove</a>
                                    </li>
                                </ul>
                            </div>

                            <!-- Body -->
                            <div class="card-body text-center pb-0">
                                <!-- Photo -->
                                <div class="avatar avatar-xl flex-shrink-0 mb-3">
                                    <img v-if="user.fichier && user.fichier.url" :src="user.fichier.url"
                                        class="avatar-img rounded-circle" alt="avatar" />
                                    <div v-else class="avatar-img rounded-circle bg-secondary bg-opacity-10">
                                        <span
                                            class="text-secondary position-absolute top-50 start-50 translate-middle fw-bold">
                                            {{ user.name?.charAt(0) }}
                                        </span>
                                    </div>
                                </div>

                                <!-- Infos -->
                                <h5 class="mb-1">{{ user.name }} {{ user.secondName }}</h5>
                                <small><i class="bi bi-geo-alt me-1"></i>{{ user.adresse || "Adresse inconnue"
                                    }}</small>

                                <!-- Statistiques -->
                                <div class="d-flex justify-content-between mt-3">
                                    <h6 class="mb-0 small">Listings: <span class="fw-light">N/A</span></h6>
                                    <h6 class="mb-0 small">Note: 4.5⭐</h6>
                                </div>
                            </div>

                            <!-- Footer -->
                            <div class="card-footer d-flex gap-3 align-items-center">
                                <router-link :to="{ name: 'detail_agent', params: { id: user.id } }"
                                    class="btn btn-sm btn-primary-soft mb-0 w-100">
                                    View detail
                                </router-link>
                                <a class="btn btn-sm btn-light flex-shrink-0 mb-0"><i class="bi bi-envelope"></i></a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- agent list END -->

                <!-- Pagination START -->
                <div class="d-sm-flex justify-content-sm-between align-items-sm-center mt-4">
                    <!-- Content -->
                    <p class="mb-sm-0 text-center text-sm-start">Showing 1 to 8 of 20 entries</p>
                    <!-- Pagination -->
                    <nav class="mb-sm-0 d-flex justify-content-center" aria-label="navigation">
                        <ul class="pagination pagination-sm pagination-primary-soft mb-0">
                            <li class="page-item disabled">
                                <a class="page-link" href="admin-agent-list.html#" tabindex="-1">Prev</a>
                            </li>
                            <li class="page-item"><a class="page-link" href="admin-agent-list.html#">1</a></li>
                            <li class="page-item active"><a class="page-link" href="admin-agent-list.html#">2</a></li>
                            <li class="page-item disabled"><a class="page-link" href="admin-agent-list.html#">..</a>
                            </li>
                            <li class="page-item"><a class="page-link" href="admin-agent-list.html#">15</a></li>
                            <li class="page-item">
                                <a class="page-link" href="admin-agent-list.html#">Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <!-- Pagination END -->

            </div>
            <!-- Page main content END -->
            <el-dialog title="Éditer un agent" :visible.sync="editDialogVisible" width="500px" @close="closeDialog">
                <div>
                    <el-form label-position="top" label-width="120px">
                        <el-form-item label="Nom">
                            <el-input v-model="editedUser.name" />
                        </el-form-item>
                        <el-form-item label="Prénom">
                            <el-input v-model="editedUser.secondName" />
                        </el-form-item>
                        <el-form-item label="Adresse">
                            <el-input v-model="editedUser.adresse" />
                        </el-form-item>
                        <el-form-item label="Email">
                            <el-input v-model="editedUser.email" />
                        </el-form-item>
                        <el-form-item label="Numéro">
                            <el-input v-model="editedUser.numero" />
                        </el-form-item>
                    </el-form>
                </div>
                <template #footer>
                    <el-button @click="closeDialog">Annuler</el-button>
                    <el-button type="primary" @click="saveEdit">Sauvegarder</el-button>
                </template>
            </el-dialog>

        </div>
        <!-- Page content END -->
    </main>
</template>
<script>
import { computed, onMounted } from "vue";
import { ElMessage, ElMessageBox, ElDialog, ElInput, ElButton } from "element-plus";
import { useStore } from "vuex";
import { ref } from "vue";
export default {
    name: "ListeDesAgents",

    setup() {
        const store = useStore();

        // Appel de l'action pour charger tous les agents au montage du composant
        onMounted(() => {
            store.dispatch("user/getAll"); // 🔁 remplace 'user' si ton module a un autre nom
        });

        // Getter pour la liste des utilisateurs
        const users = computed(() => store.getters["user/all"]);

        const editDialogVisible = ref(false);
        const editedUser = ref(null);

        function editUser(id) {
            // Trouver l'utilisateur à éditer dans la liste
            const user = users.value.find(u => u.id === id);
            if (user) {
                editedUser.value = { ...user }; // Copie pour éditer sans modifier la liste directement
                editDialogVisible.value = true;
            }
        }

        async function saveEdit() {
            try {
                // Ici, tu dois appeler ton action Vuex pour update l'user
                await store.dispatch("user/update", editedUser.value);
                ElMessage.success("Utilisateur mis à jour avec succès !");
                editDialogVisible.value = false;
            } catch (error) {
                ElMessage.error("Erreur lors de la mise à jour !");
            }
        }

        function closeDialog() {
            editDialogVisible.value = false;
        }
        // Méthode pour supprimer un utilisateur
        const deleteUser = async (id) => {
            try {
                await ElMessageBox.confirm(
                    "Êtes-vous sûr de vouloir supprimer cet utilisateur ?",
                    "Confirmation",
                    {
                        confirmButtonText: "Oui",
                        cancelButtonText: "Annuler",
                        type: "warning",
                    }
                );
                await store.dispatch("user/delete", id);
                ElMessage({
                    message: "Utilisateur supprimé avec succès ✅",
                    type: "success",
                });
            } catch (error) {
                if (error !== 'cancel') {
                    ElMessage({
                        message: "Erreur lors de la suppression ❌",
                        type: "error",
                    });
                }
            }
        };

        return {
            users,
            deleteUser,
            editUser,
            editDialogVisible,
            editedUser,
            saveEdit,
            closeDialog,
        };
    },
};
</script>