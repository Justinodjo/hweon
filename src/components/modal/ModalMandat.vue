<template>
    <el-dialog :model-value="show" width="500px" @close="closeModal" :close-on-click-modal="false"
        :destroy-on-close="true" custom-class="mandat-dialog">
        <template #title>
            <h5 class="mb-0">Mandater un gestionnaire</h5>
        </template>

        <div class="mb-3">
            <label class="form-label">Gestionnaire</label>
            <select v-model="gestionnaireId" class="form-select">
                <option v-for="user in gestionnaires" :key="user.id" :value="user.id">
                    {{ user.nom }}
                </option>
            </select>
        </div>

        <div class="mb-3">
            <label class="form-label">Zone</label>
            <select v-model="zoneType" class="form-select">
                <option value="departement">Département</option>
                <option value="commune">Commune</option>
                <option value="arrondissement">Arrondissement</option>
                <option value="quartier">Quartier</option>
            </select>
        </div>

        <div class="mb-3">
            <label class="form-label">Zone ID</label>
            <input type="number" v-model.number="zoneId" class="form-control" placeholder="ID de la zone" />
        </div>

        <template #footer>
            <button class="btn btn-secondary me-2" @click="closeModal">Annuler</button>
            <button class="btn btn-primary" :disabled="loading" @click="mandater">
                <span v-if="loading" class="spinner-border spinner-border-sm me-1" role="status"></span>
                Mandater
            </button>
        </template>
    </el-dialog>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";

export default {
    props: {
        show: Boolean,
        proprietaireId: Number,
    },
    setup(props, { emit }) {
        const store = useStore();
        const gestionnaireId = ref(null);
        const zoneType = ref("departement");
        const zoneId = ref(null);
        const loading = ref(false);

        const gestionnaires = ref([
            { id: 1, nom: "Alice" },
            { id: 2, nom: "Bob" },
            { id: 3, nom: "Charlie" },
        ]);

        const closeModal = () => emit("close");

        const mandater = async () => {
            if (!gestionnaireId.value || !zoneId.value) {
                ElMessage.warning("Veuillez choisir un gestionnaire et une zone !");
                return;
            }

            const payload = {
                proprietaireId: props.proprietaireId,
                gestionnaireId: gestionnaireId.value,
            };
            payload[zoneType.value + "Id"] = zoneId.value;

            try {
                loading.value = true;
                const count = await store.dispatch("mandats/mandaterGestionnaire", payload);
                ElMessage.success(`${count} biens ont été mandatés avec succès !`);
                closeModal();
            } catch (e) {
                ElMessage.error("Erreur lors de l'envoi du mandat");
            } finally {
                loading.value = false;
            }
        };

        return { gestionnaireId, zoneType, zoneId, gestionnaires, loading, mandater, closeModal };
    },
};
</script>

<style scoped>
.mandat-dialog .el-dialog__header {
    border-bottom: none;
    font-weight: 600;
}

.mandat-dialog .el-dialog__body {
    padding-top: 10px;
}

.mandat-dialog .el-dialog__footer {
    text-align: right;
    border-top: none;
    padding-top: 10px;
}
</style>
