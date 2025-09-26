<template>
    <main>
        <div class="page-content p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3>Liste des rôles</h3>
                <el-button type="primary" @click="openNewRoleDialog">+ Nouveau rôle</el-button>
            </div>

            <el-table :data="roles" style="width: 100%" border>
                <el-table-column prop="nomRole" label="Nom du rôle" />
                <el-table-column label="Permissions">
                    <template #default="{ row }">
                        <el-tag v-for="perm in row.permissions" :key="perm.id" type="success" class="me-1 mb-1">
                            {{ perm.nom }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Actions" width="180">
                    <template #default="{ row }">
                        <el-button size="small" @click="editRole(row)">✏️</el-button>
                        <el-button size="small" type="danger" @click="deleteRole(row.idRole)">🗑️</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- DIALOG -->
            <el-dialog :title="isEdit ? 'Éditer le rôle' : 'Nouveau rôle'" v-model="roleDialogVisible" width="500px">
                <el-form label-position="top" :model="selectedRole">
                    <el-form-item label="Nom du rôle">
                        <el-input v-model="selectedRole.nomRole" />
                    </el-form-item>

                    <el-form-item label="Permissions">
                        <el-select v-model="selectedRole.permissionIds" multiple filterable
                            placeholder="Sélectionner les permissions" style="width: 100%">
                            <el-option v-for="perm in permissions" :key="perm.id" :label="perm.nom" :value="perm.id" />
                        </el-select>
                    </el-form-item>
                </el-form>

                <template #footer>
                    <el-button @click="roleDialogVisible = false">Annuler</el-button>
                    <el-button type="primary" @click="saveRole">Sauvegarder</el-button>
                </template>
            </el-dialog>
        </div>
    </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";

const store = useStore();

const roles = computed(() => store.getters["role/all"]);
const permissions = computed(() => store.getters["permission/all"]);

const roleDialogVisible = ref(false);
const isEdit = ref(false);

const selectedRole = ref({
    idRole: null,
    nomRole: "",
    permissionIds: [],
});

onMounted(() => {
    store.dispatch("role/getAll");
    store.dispatch("permission/getAll");
});

const openNewRoleDialog = () => {
    isEdit.value = false;
    selectedRole.value = {
        idRole: null,
        nomRole: "",
        permissionIds: [],
    };
    roleDialogVisible.value = true;
};

const editRole = (role) => {
    isEdit.value = true;
    selectedRole.value = {
        idRole: role.idRole,
        nomRole: role.nomRole,
        permissionIds: role.permissions.map((p) => p.id),
    };
    roleDialogVisible.value = true;
};

const saveRole = async () => {
    try {
        const payload = {
            idRole: selectedRole.value.idRole,
            nomRole: selectedRole.value.nomRole,
            permissions: selectedRole.value.permissionIds.map((id) => ({ id })),
        };

        if (isEdit.value) {
            await store.dispatch("role/update", payload);
            ElMessage.success("Rôle mis à jour !");
        } else {
            await store.dispatch("role/create", payload);
            ElMessage.success("Rôle créé !");
        }

        roleDialogVisible.value = false;
    } catch (error) {
        console.error(error);
        ElMessage.error("Erreur lors de la sauvegarde !");
    }
};

const deleteRole = async (idRole) => {
    try {
        await ElMessageBox.confirm("Supprimer ce rôle ?", "Attention", {
            type: "warning",
        });
        await store.dispatch("role/delete", idRole);
        ElMessage.success("Rôle supprimé !");
    } catch (err) {
        if (err !== "cancel") {
            ElMessage.error("Erreur lors de la suppression !");
        }
    }
};
</script>
