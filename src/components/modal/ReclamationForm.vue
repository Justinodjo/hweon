<template>
    <form @submit.prevent="submitForm">
        <!-- Objet -->
        <div class="mb-3">
            <label for="objet" class="form-label">Objet</label>
            <input type="text" id="objet" class="form-control" v-model="form.objet" required
                placeholder="Ex : Facture incorrecte, problème de voisinage..." />
        </div>

        <!-- Description -->
        <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea id="description" class="form-control" rows="4" v-model="form.description" required
                placeholder="Décrivez votre réclamation en détail"></textarea>
        </div>

        <!-- Priorité -->
        <div class="mb-3">
            <label class="form-label">Niveau de priorité</label>
            <select class="form-select" v-model="form.priorite" required>
                <option disabled value="">-- Choisir --</option>
                <option value="FAIBLE">Faible</option>
                <option value="MOYENNE">Moyenne</option>
                <option value="ELEVE">Élevée</option>
            </select>
        </div>

        <!-- Statut (par défaut EN_ATTENTE) -->
        <input type="hidden" v-model="form.statut" />

        <!-- Fichiers joints -->
        <div class="mb-3">
            <label class="form-label">Joindre un fichier (optionnel)</label>
            <input type="file" class="form-control" multiple @change="handleFiles" />
            <small class="text-muted">Formats acceptés : PDF, images, docx…</small>
        </div>

        <!-- Boutons -->
        <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-secondary me-2" @click="$emit('cancel')">
                Annuler
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm"></span>
                <span v-else>Soumettre</span>
            </button>
        </div>
    </form>
</template>

<script>
import axios from "axios";

export default {
    name: "ReclamationForm",
    props: {
        apiUrl: { type: String, required: true }, // ex: "/api/reclamations"
    },
    data() {
        return {
            form: {
                objet: "",
                description: "",
                priorite: "",
                statut: "EN_ATTENTE", // valeur par défaut
                fichiers: [],
            },
            loading: false,
        };
    },
    methods: {
        handleFiles(event) {
            this.form.fichiers = Array.from(event.target.files);
        },
        async submitForm() {
            try {
                this.loading = true;

                const formData = new FormData();
                formData.append("objet", this.form.objet);
                formData.append("description", this.form.description);
                formData.append("priorite", this.form.priorite);
                formData.append("statut", this.form.statut);

                this.form.fichiers.forEach((file, index) => {
                    formData.append(`fichiers[${index}]`, file);
                });

                await axios.post(this.apiUrl, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                this.$emit("submitted"); // notification au parent
                this.resetForm();
            } catch (error) {
                console.error("Erreur lors de l'envoi :", error);
                alert("❌ Une erreur est survenue lors de l'envoi de la réclamation.");
            } finally {
                this.loading = false;
            }
        },
        resetForm() {
            this.form = {
                objet: "",
                description: "",
                priorite: "",
                statut: "EN_ATTENTE",
                fichiers: [],
            };
        },
    },
};
</script>

<style scoped>
.spinner-border {
    width: 1rem;
    height: 1rem;
}
</style>
