<template>
    <div class="signature-container">
        <el-button type="primary" @click="showModal = true">Ouvrir la signature</el-button>

        <!-- MODALE -->
        <el-dialog v-model="showModal" title="Signature en ligne" width="500px">
            <div class="wrapper">
                <canvas ref="signatureCanvas" class="signature-pad"></canvas>
            </div>

            <template #footer>
                <el-button @click="clearSignature">Effacer</el-button>
                <el-button type="primary" @click="saveSignature">Enregistrer</el-button>
            </template>
        </el-dialog>

        <hr />

        <h3>Signature enregistrée</h3>
        <textarea v-model="signatureData" readonly></textarea>
        <img v-if="signatureData" :src="signatureData" alt="Signature enregistrée" />
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import SignaturePad from "signature_pad";

export default {
    setup() {
        const showModal = ref(false);
        const signatureCanvas = ref(null);
        let signaturePad = null;
        const signatureData = ref("");

        onMounted(() => {
            signaturePad = new SignaturePad(signatureCanvas.value, {
                backgroundColor: "rgba(255, 255, 255, 0)",
                penColor: "rgb(0, 0, 0)"
            });
        });

        const clearSignature = () => {
            if (signaturePad) signaturePad.clear();
        };

        const saveSignature = () => {
            if (signaturePad && !signaturePad.isEmpty()) {
                signatureData.value = signaturePad.toDataURL("image/png");
                showModal.value = false; // Fermer la modale après enregistrement
            } else {
                alert("Veuillez dessiner une signature avant d'enregistrer.");
            }
        };

        return {
            showModal,
            signatureCanvas,
            signatureData,
            clearSignature,
            saveSignature
        };
    }
};
</script>

<style>
.signature-container {
    max-width: 500px;
    margin: auto;
    text-align: center;
    font-family: sans-serif;
}

.wrapper {
    position: relative;
    width: 400px;
    height: 200px;
    border: solid 1px #ddd;
    margin: 10px 0;
}

.signature-pad {
    width: 100%;
    height: 100%;
}

textarea {
    width: 100%;
    min-height: 100px;
    margin-top: 10px;
}
</style>
