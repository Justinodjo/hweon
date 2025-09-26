<template>
    <main class="page-content p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3>Contrôle d'accès</h3>
        </div>

        <el-table :data="roles" border style="width: 100%">
            <el-table-column prop="nomRole" label="Nom du rôle" />

            <el-table-column label="Permissions">
                <template #default="{ row }">
                    <el-tag v-for="perm in row.permissions" :key="perm.id" type="info" class="me-1 mb-1">
                        {{ perm.nom }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column label="Actions" width="160">
                <template #default="{ row }">
                    <el-button size="small" @click="openEditPermissions(row)">⚙️ Modifier</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- Modal d'édition -->
        <el-dialog title="Modifier les permissions" v-model="dialogVisible" width="500px">
            <el-form label-position="top">
                <el-form-item label="Nom du rôle">
                    <el-input v-model="selectedRole.nomRole" disabled />
                </el-form-item>

                <el-form-item label="Permissions">
                    <el-select v-model="selectedPermissionIds" multiple filterable
                        placeholder="Sélectionner les permissions" style="width: 100%">
                        <el-option v-for="perm in permissions" :key="perm.id" :label="perm.nom" :value="perm.id" />
                    </el-select>
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="dialogVisible = false">Annuler</el-button>
                <el-button type="primary" @click="savePermissions">Sauvegarder</el-button>
            </template>
        </el-dialog>
    </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";

const store = useStore();

const roles = computed(() => store.getters["role/all"]);
const permissions = computed(() => store.getters["permission/all"]);

const dialogVisible = ref(false);
const selectedRole = ref(null);
const selectedPermissionIds = ref([]);

onMounted(() => {
    store.dispatch("role/getAll");
    store.dispatch("permission/getAll");
});

const openEditPermissions = (role) => {
    selectedRole.value = { ...role };
    selectedPermissionIds.value = role.permissions.map((perm) => perm.id);
    dialogVisible.value = true;
};

const savePermissions = async () => {
    try {
        const payload = {
            idRole: selectedRole.value.idRole,
            nomRole: selectedRole.value.nomRole,
            permissions: selectedPermissionIds.value.map((id) => ({ id })),
        };

        await store.dispatch("role/update", payload);
        dialogVisible.value = false;
        ElMessage.success("Permissions mises à jour !");
        await store.dispatch("role/getAll"); // Rafraîchir
    } catch (err) {
        console.error(err);
        ElMessage.error("Erreur lors de la mise à jour.");
    }
};
</script>
