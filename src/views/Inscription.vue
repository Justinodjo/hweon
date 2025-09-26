<template>
    <div>
        <div v-if="step === 1">
            <h3>Étape 1 : Choisir le rôle</h3>
            <select v-model="user.role">
                <option disabled value="">Sélectionnez un rôle</option>
                <option value="ADMIN">Admin</option>
                <option value="AGENT">Agent</option>
                <option value="RESPONSABLE">Responsable</option>
            </select>
            <button @click="nextStep">Suivant</button>
        </div>

        <div v-else-if="step === 2">
            <h3>Étape 2 : Informations personnelles</h3>
            <input v-model="user.nom" placeholder="Nom" />
            <input v-model="user.prenom" placeholder="Prénom" />
            <button @click="previousStep">Précédent</button>
            <button @click="nextStep">Suivant</button>
        </div>

        <div v-else-if="step === 3">
            <h3>Étape 3 : Informations de connexion</h3>
            <input v-model="user.email" placeholder="Email" />
            <input type="password" v-model="user.password" placeholder="Mot de passe" />
            <button @click="previousStep">Précédent</button>
            <button @click="submitForm">Enregistrer</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const step = ref(1)
const user = ref({
    role: '',
    nom: '',
    prenom: '',
    email: '',
    password: ''
})

const nextStep = () => {
    if (step.value < 3) step.value++
}
const previousStep = () => {
    if (step.value > 1) step.value--
}

const submitForm = async () => {
    try {
        const response = await axios.post('/api/users', user.value)
        alert("Utilisateur enregistré avec succès !")
    } catch (error) {
        alert("Erreur lors de l'enregistrement.")
    }
}
</script>
