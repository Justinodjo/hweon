<template>
    <form @submit.prevent="handleSubmit" novalidate class="needs-validation p-4 bg-white rounded shadow-sm">
        <h3 class="mb-4">Intervention — {{ isEdit ? 'Éditer' : 'Créer' }}</h3>

        <div class="row g-3">
            <div class="col-md-6">
                <label class="form-label">Type d'intervention</label>
                <input v-model="form.typeIntervention" type="text" required
                    :class="['form-control', validationClass('typeIntervention')]" placeholder="Ex: Plomberie" />
                <div class="invalid-feedback">Le type d'intervention est requis.</div>
            </div>

            <div class="col-md-6">
                <label class="form-label">Statut</label>
                <select v-model="form.statut" required :class="['form-select', validationClass('statut')]">
                    <option disabled value="">-- Sélectionner --</option>
                    <option v-for="s in statutOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
                </select>
                <div class="invalid-feedback">Veuillez sélectionner un statut.</div>
            </div>

            <div class="col-12">
                <label class="form-label">Description</label>
                <textarea v-model="form.description" rows="4" :class="['form-control', validationClass('description')]"
                    placeholder="Description détaillée..." />
                <div class="form-text">Max 1000 caractères.</div>
            </div>

            <div class="col-md-4">
                <label class="form-label">Estimation coût (€)</label>
                <input v-model.number="form.estimationCout" type="number" step="0.01" min="0"
                    :class="['form-control', validationClass('estimationCout')]" placeholder="0.00" />
            </div>

            <div class="col-md-4">
                <label class="form-label">Coût réel (€)</label>
                <input v-model.number="form.coutReel" type="number" step="0.01" min="0"
                    :class="['form-control', validationClass('coutReel')]" placeholder="0.00" />
            </div>

            <div class="col-md-4 d-flex flex-column">
                <label class="form-label">Écart budgétaire</label>
                <div class="form-control-plaintext fw-bold fs-5">{{ formattedEcart }}</div>
                <small class="form-text text-muted">Calculé automatiquement (Coût réel - Estimation)</small>
            </div>

            <div class="col-md-6">
                <label class="form-label">Date signalement</label>
                <input v-model="form.dateSignalement" type="datetime-local"
                    :class="['form-control', validationClass('dateSignalement')]" />
            </div>

            <div class="col-md-6">
                <label class="form-label">Date traitement</label>
                <input v-model="form.dateTraitement" type="datetime-local"
                    :class="['form-control', validationClass('dateTraitement')]" />
            </div>

            <div class="col-md-6">
                <label class="form-label">Priorité</label>
                <select v-model="form.priorite" :class="['form-select', validationClass('priorite')]">
                    <option disabled value="">-- Sélectionner --</option>
                    <option v-for="p in prioriteOptions" :key="p.value" :value="p.value">{{ p.label }}</option>
                </select>
            </div>

            <div class="col-md-6">
                <label class="form-label">Bien immobilier</label>
                <select v-model="form.biensImmobilersId" class="form-select">
                    <option disabled value="">-- Choisir le bien --</option>
                    <option v-for="b in biensOptions" :key="b.id" :value="b.id">{{ b.label }}</option>
                </select>
            </div>

            <div class="col-12">
                <label class="form-label">Fichiers (images, pdf)</label>
                <input ref="fileInput" @change="onFilesSelected" type="file" multiple class="form-control"
                    accept="image/*,.pdf" />
                <div class="mt-2 d-flex gap-2 flex-wrap">
                    <div v-for="(f, i) in filesPreview" :key="i" class="border rounded p-2 bg-light"
                        style="min-width:120px;">
                        <div v-if="f.type.startsWith('image/')">
                            <img :src="f.url" alt="preview" class="img-fluid rounded"
                                style="max-height:80px; display:block; margin-bottom:6px;" />
                        </div>
                        <div class="text-truncate small">{{ f.name }}</div>
                        <div class="small text-muted">{{ f.sizeHuman }}</div>
                        <button type="button" class="btn btn-sm btn-outline-danger mt-2"
                            @click="removeFile(i)">Supprimer</button>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <label class="form-label">Documents liés</label>
                <div v-for="(doc, idx) in form.documents" :key="idx" class="input-group mb-2">
                    <input v-model="doc.title" class="form-control" placeholder="Titre du document" />
                    <input v-model="doc.url" class="form-control" placeholder="URL / chemin" />
                    <button type="button" class="btn btn-outline-danger" @click="removeDocument(idx)">Suppr</button>
                </div>
                <button type="button" class="btn btn-sm btn-outline-primary" @click="addDocument">Ajouter un
                    document</button>
            </div>

        </div>

        <div class="d-flex justify-content-end gap-2 mt-4">
            <button type="button" class="btn btn-secondary" @click="$emit('cancel')">Annuler</button>
            <button type="submit" :class="['btn', isSubmitting ? 'btn-primary disabled' : 'btn-primary']">
                {{ isSubmitting ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Créer') }}
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
// axios est recommandé pour les appels API — importez si vous l'utilisez
// import axios from 'axios'

// Props: initial data for edition, options for selects
const props = defineProps({
    modelValue: { type: Object, default: null },
    biensOptions: { type: Array, default: () => [] },
    isEdit: { type: Boolean, default: false }
})
const emit = defineEmits(['save', 'cancel', 'update:modelValue'])

const isSubmitting = ref(false)
const isEdit = props.isEdit

const statutOptions = [
    { value: 'EN_ATTENTE', label: 'En attente' },
    { value: 'EN_COURS', label: 'En cours' },
    { value: 'TERMINE', label: 'Terminé' }
]

const prioriteOptions = [
    { value: 'BASSE', label: 'Basse' },
    { value: 'NORMALE', label: 'Normale' },
    { value: 'HAUTE', label: 'Haute' },
    { value: 'CRITIQUE', label: 'Critique' }
]

// Form model
const form = reactive({
    id: null,
    typeIntervention: '',
    description: '',
    estimationCout: null,
    coutReel: null,
    ecartBudgetaire: 0,
    dateSignalement: '',
    dateTraitement: '',
    statut: '',
    priorite: '',
    fichierId: null,
    fichiers: [], // will be uploaded files meta
    biensImmobilersId: null,
    documents: []
})

// Initialize when edit
if (props.modelValue) {
    Object.assign(form, sanitizeIncoming(props.modelValue))
}

watch(() => props.modelValue, (nv) => {
    if (nv) Object.assign(form, sanitizeIncoming(nv))
})

function sanitizeIncoming(src) {
    // adapt incoming entity fields to form shape (dates to datetime-local)
    const copy = { ...src }
    if (copy.dateSignalement) copy.dateSignalement = toInputDate(copy.dateSignalement)
    if (copy.dateTraitement) copy.dateTraitement = toInputDate(copy.dateTraitement)
    if (copy.estimationCout != null) copy.estimationCout = Number(copy.estimationCout)
    if (copy.coutReel != null) copy.coutReel = Number(copy.coutReel)
    if (copy.biensImmobilers && copy.biensImmobilers.id) copy.biensImmobilersId = copy.biensImmobilers.id
    return copy
}

function toInputDate(dateLike) {
    // Accepts Date or ISO string -> returns 'YYYY-MM-DDTHH:mm' for datetime-local
    const d = new Date(dateLike)
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Files handling
const fileInput = ref(null)
const filesPreview = ref([])

function onFilesSelected(e) {
    const files = Array.from(e.target.files || [])
    files.forEach(f => {
        const reader = new FileReader()
        reader.onload = (ev) => {
            filesPreview.value.push({ name: f.name, size: f.size, type: f.type, url: ev.target.result, raw: f, sizeHuman: humanFileSize(f.size) })
        }
        reader.readAsDataURL(f)
    })
    // reset input so same file can be selected again
    fileInput.value.value = null
}

function removeFile(index) {
    filesPreview.value.splice(index, 1)
}

function humanFileSize(bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Documents handlers
function addDocument() {
    form.documents.push({ title: '', url: '' })
}
function removeDocument(i) {
    form.documents.splice(i, 1)
}

// Computed: ecartBudgetaire
const computedEcart = computed(() => {
    const est = Number(form.estimationCout || 0)
    const reel = Number(form.coutReel || 0)
    return reel - est
})

watch(computedEcart, (v) => {
    form.ecartBudgetaire = v
})

const formattedEcart = computed(() => {
    const nf = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
    return nf.format(form.ecartBudgetaire || 0)
})

// Simple validation state
const touched = reactive({})
function validationClass(field) {
    return touched[field] ? (isFieldValid(field) ? 'is-valid' : 'is-invalid') : ''
}

function isFieldValid(field) {
    switch (field) {
        case 'typeIntervention': return !!form.typeIntervention && form.typeIntervention.trim().length > 0
        case 'statut': return !!form.statut
        default: return true
    }
}

function markAllTouched() {
    Object.keys(form).forEach(k => touched[k] = true)
}

// Submit
async function handleSubmit() {
    markAllTouched()
    // minimal required checks
    if (!isFieldValid('typeIntervention') || !isFieldValid('statut')) {
        // bootstrap will show invalid feedback
        return
    }

    isSubmitting.value = true

    try {
        // Prepare payload
        const payload = {
            typeIntervention: form.typeIntervention,
            description: form.description,
            estimationCout: form.estimationCout,
            coutReel: form.coutReel,
            ecartBudgetaire: form.ecartBudgetaire,
            dateSignalement: form.dateSignalement ? new Date(form.dateSignalement).toISOString() : null,
            dateTraitement: form.dateTraitement ? new Date(form.dateTraitement).toISOString() : null,
            statut: form.statut,
            priorite: form.priorite,
            biensImmobilersId: form.biensImmobilersId,
            documents: form.documents
        }

        // If files to upload, handle FormData upload
        if (filesPreview.value.length > 0) {
            const fd = new FormData()
            fd.append('payload', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
            filesPreview.value.forEach((f, i) => fd.append('files', f.raw, f.name))

            // Exemple d'appel:
            // const response = await axios.post('/api/interventions/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
            // emit('save', response.data)

            // pour la démo on renvoie le payload local
            emit('save', { ...payload, uploadedFiles: filesPreview.value.map(f => ({ name: f.name })) })
        } else {
            // Exemple d'appel simple:
            // const response = props.isEdit ? await axios.put(`/api/interventions/${form.id}`, payload) : await axios.post('/api/interventions', payload)
            // emit('save', response.data)
            emit('save', payload)
        }

    } catch (err) {
        console.error(err)
        alert('Erreur lors de la sauvegarde — vérifiez la console')
    } finally {
        isSubmitting.value = false
    }
}

</script>

<style scoped>
/* Look épuré: soft shadows, compact spacing */
.form-control-plaintext {
    background: #f8f9fa;
    padding: .375rem .75rem;
    border-radius: .375rem;
}

.needs-validation {
    max-width: 960px;
    margin: 0 auto;
}
</style>
