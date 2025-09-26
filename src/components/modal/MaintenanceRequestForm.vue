<template>
    <div class="maintenance-form">
        <form @submit.prevent="submitForm" class="needs-validation" novalidate>
            <div class="mb-3">
                <label for="typeIntervention" class="form-label">Type d'intervention</label>
                <select id="typeIntervention" class="form-select" v-model="form.typeIntervention" required>
                    <option value="">Sélectionner un type</option>
                    <option v-for="type in interventionTypes" :key="type" :value="type">{{ type }}</option>
                </select>
                <div class="invalid-feedback">Veuillez sélectionner un type d'intervention.</div>
            </div>

            <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea id="description" class="form-control" v-model="form.description" rows="3" required></textarea>
                <div class="invalid-feedback">La description est obligatoire.</div>
            </div>

            <div class="mb-3">
                <label for="priorite" class="form-label">Priorité</label>
                <select id="priorite" class="form-select" v-model="form.priorite" required>
                    <option value="">Sélectionner la priorité</option>
                    <option v-for="niveau in priorities" :key="niveau" :value="niveau">{{ niveau }}</option>
                </select>
                <div class="invalid-feedback">Veuillez sélectionner une priorité.</div>
            </div>

            <div class="mb-3">
                <label for="fichiers" class="form-label">Fichiers (optionnel)</label>
                <input type="file" class="form-control" id="fichiers" multiple @change="handleFiles" />
            </div>

            <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                Soumettre la demande
            </button>
        </form>

        <div v-if="successMessage" class="alert alert-success mt-3">
            {{ successMessage }}
        </div>
    </div>
</template>

<script>
export default {
    name: "MaintenanceRequestForm",
    props: {
        interventionTypes: {
            type: Array,
            default: () => ["Plomberie", "Électricité", "Chauffage", "Autre"],
        },
        priorities: {
            type: Array,
            default: () => ["FAIBLE", "MOYENNE", "ELEVE"],
        },
        apiUrl: {
            type: String,
            default: "/api/interventions",
        },
    },
    data() {
        return {
            form: {
                typeIntervention: "",
                description: "",
                priorite: "",
                fichiers: [],
            },
            successMessage: "",
            loading: false,
        };
    },
    methods: {
        handleFiles(event) {
            this.form.fichiers = Array.from(event.target.files);
        },
        async submitForm() {
            const formEl = this.$el.querySelector("form");
            if (!formEl.checkValidity()) {
                formEl.classList.add("was-validated");
                return;
            }

            try {
                this.loading = true;
                const formData = new FormData();
                formData.append("typeIntervention", this.form.typeIntervention);
                formData.append("description", this.form.description);
                formData.append("priorite", this.form.priorite);
                this.form.fichiers.forEach((file) => formData.append("fichiers", file));

                await fetch(this.apiUrl, {
                    method: "POST",
                    body: formData,
                });

                this.successMessage = "Votre demande a été envoyée avec succès !";
                this.form = { typeIntervention: "", description: "", priorite: "", fichiers: [] };
                formEl.classList.remove("was-validated");
            } catch (err) {
                console.error(err);
                alert("Erreur lors de l'envoi de la demande");
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
textarea.form-control {
    resize: vertical;
}

.spinner-border {
    vertical-align: text-bottom;
}
</style>
