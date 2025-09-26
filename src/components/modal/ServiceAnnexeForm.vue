<template>
    <form @submit.prevent="submitForm">
        <!-- Nom du service -->
        <div class="mb-3">
            <label for="nom" class="form-label">Nom du service</label>
            <input type="text" id="nom" class="form-control" v-model="form.nom" required
                placeholder="Ex : Ménage, Parking, Internet..." />
        </div>

        <!-- Description -->
        <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea id="description" class="form-control" rows="3" v-model="form.description"
                placeholder="Décrivez brièvement le service"></textarea>
        </div>

        <!-- Prix -->
        <div class="mb-3">
            <label for="prix" class="form-label">Prix (€)</label>
            <input type="number" id="prix" class="form-control" v-model.number="form.prix" required min="0" step="0.01"
                placeholder="Ex : 50" />
        </div>

        <!-- Périodicité -->
        <div class="mb-3">
            <label for="periodicite" class="form-label">Périodicité</label>
            <select id="periodicite" class="form-select" v-model="form.periodicite" required>
                <option disabled value="">-- Choisir --</option>
                <option value="PONCTUEL">Ponctuel</option>
                <option value="MENSUEL">Mensuel</option>
                <option value="ANNUEL">Annuel</option>
            </select>
        </div>

        <!-- Statut -->
        <div class="mb-3">
            <label for="statut" class="form-label">Statut</label>
            <select id="statut" class="form-select" v-model="form.statut" required>
                <option value="DISPONIBLE">Disponible</option>
                <option value="INDISPONIBLE">Indisponible</option>
            </select>
        </div>

        <!-- Boutons -->
        <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-secondary me-2" @click="$emit('cancel')">
                Annuler
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm"></span>
                <span v-else>Enregistrer</span>
            </button>
        </div>
    </form>
</template>

<script>
import axios from "axios";

export default {
    name: "ServiceAnnexeForm",
    props: {
        apiUrl: { type: String, required: true }, // ex: "/api/services-annexes"
        initialData: { type: Object, default: null }, // pour l’édition
    },
    data() {
        return {
            form: {
                nom: "",
                description: "",
                prix: 0,
                periodicite: "",
                statut: "DISPONIBLE",
            },
            loading: false,
        };
    },
    mounted() {
        if (this.initialData) {
            this.form = { ...this.initialData };
        }
    },
    methods: {
        async submitForm() {
            try {
                this.loading = true;

                if (this.initialData?.id) {
                    // Edition
                    await axios.put(`${this.apiUrl}/${this.initialData.id}`, this.form);
                } else {
                    // Création
                    await axios.post(this.apiUrl, this.form);
                }

                this.$emit("submitted"); // informer le parent
                this.resetForm();
            } catch (error) {
                console.error("Erreur :", error);
                alert("❌ Impossible d’enregistrer le service annexe.");
            } finally {
                this.loading = false;
            }
        },
        resetForm() {
            this.form = {
                nom: "",
                description: "",
                prix: 0,
                periodicite: "",
                statut: "DISPONIBLE",
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
