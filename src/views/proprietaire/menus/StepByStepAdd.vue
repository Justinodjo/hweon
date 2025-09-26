<template>
    <div class="p-4">
        <el-page-header @back="onBack" content="Enregistrer un bien immobilier" />

        <el-steps :active="step" finish-status="success" class="my-6" align-center>
            <el-step title="Général" description="Infos de base" />
            <el-step title="Localisation" description="Adresse & position" />
            <el-step title="Caractéristiques" description="Surface, prix, unité" />
            <el-step title="Médias" description="Couverture & galerie" />
            <el-step title="Résumé" description="Vérification & envoi" />
        </el-steps>

        <el-card shadow="never">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="180px" status-icon>
                <!-- STEP 1: GENERAL -->
                <div v-show="step === 0">
                    <el-row :gutter="16">
                        <el-col :md="12" :xs="24">
                            <el-form-item label="Nom du bien" prop="nom">
                                <el-input v-model="form.nom" placeholder="Ex: Villa 4 chambres à Akpakpa" />
                            </el-form-item>
                        </el-col>
                        <el-col :md="12" :xs="24">
                            <el-form-item label="Type de bien" prop="typeBiensImmobiliereId">
                                <el-select v-model="form.typeBiensImmobiliereId" filterable clearable
                                    placeholder="Choisir…" :loading="loading.types">
                                    <el-option v-for="t in options.typesBien" :key="t.id"
                                        :label="t.nom || t.libelle || t.name" :value="t.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :md="8" :xs="24">
                            <el-form-item label="Statut actif">
                                <el-switch v-model="form.status" />
                            </el-form-item>
                        </el-col>
                        <el-col :md="8" :xs="24">
                            <el-form-item label="À vendre ?">
                                <el-switch v-model="form.aVendre" />
                            </el-form-item>
                        </el-col>
                        <el-col :md="8" :xs="24">
                            <el-form-item label="Note (optionnel)">
                                <el-rate v-model="form.note" allow-half show-score />
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="Description" prop="description">
                                <el-input v-model="form.description" type="textarea" :rows="5"
                                    placeholder="Décrivez le bien, atouts, accessibilité, etc." />
                            </el-form-item>
                        </el-col>
                        <el-col :md="12" :xs="24">
                            <el-form-item label="Propriétaire (User)" prop="userInfoId">
                                <el-select v-model="form.userInfoId" filterable clearable placeholder="Choisir…"
                                    :loading="loading.users">
                                    <el-option v-for="u in options.users" :key="u.id"
                                        :label="u.email || (u.name + ' ' + (u.second_name || ''))" :value="u.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :md="12" :xs="24">
                            <el-form-item label="Détails (fiche)" prop="detailsBiensImmobiliersId">
                                <el-select v-model="form.detailsBiensImmobiliersId" filterable clearable
                                    placeholder="Associer…" :loading="loading.details">
                                    <el-option v-for="d in options.details" :key="d.id"
                                        :label="d.nom || ('Fiche #' + d.id)" :value="d.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <!-- STEP 2: LOCATION -->
                <div v-show="step === 1">
                    <el-row :gutter="16">
                        <el-col :md="12" :xs="24">
                            <el-form-item label="Adresse" prop="adresse">
                                <el-input v-model="form.adresse" placeholder="Rue, quartier…" />
                            </el-form-item>
                        </el-col>
                        <el-col :md="12" :xs="24">
                            <el-form-item label="Département" prop="departementId">
                                <el-select v-model="form.departementId" filterable clearable placeholder="Choisir…"
                                    :loading="loading.deps">
                                    <el-option v-for="d in options.deps" :key="d.id" :label="d.nom || d.name"
                                        :value="d.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :md="12" :xs="24">
                            <el-form-item label="Commune" prop="communeId">
                                <el-select v-model="form.communeId" filterable clearable placeholder="Choisir…"
                                    :disabled="!form.departementId" :loading="loading.communes">
                                    <el-option v-for="c in options.communes" :key="c.id" :label="c.nom || c.name"
                                        :value="c.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :md="12" :xs="24">
                            <el-form-item label="Arrondissement" prop="arrondissementId">
                                <el-select v-model="form.arrondissementId" filterable clearable placeholder="Choisir…"
                                    :disabled="!form.communeId" :loading="loading.arrs">
                                    <el-option v-for="a in options.arrs" :key="a.id" :label="a.nom || a.name"
                                        :value="a.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :md="12" :xs="24">
                            <el-form-item label="Latitude" prop="latitude">
                                <el-input-number v-model="form.latitude" :step="0.000001" :precision="6"
                                    :controls="false" placeholder="Ex: 6.370293" />
                            </el-form-item>
                        </el-col>
                        <el-col :md="12" :xs="24">
                            <el-form-item label="Longitude" prop="longitude">
                                <el-input-number v-model="form.longitude" :step="0.000001" :precision="6"
                                    :controls="false" placeholder="Ex: 2.391236" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-alert type="info" show-icon :closable="false" title="Astuce">
                                <template #default>
                                    Vous pouvez récupérer les coordonnées depuis une carte (Leaflet/Mapbox/Google).
                                    Laissez vide si vous ne les avez pas.
                                </template>
                            </el-alert>
                        </el-col>
                    </el-row>
                </div>

                <!-- STEP 3: FEATURES -->
                <div v-show="step === 2">
                    <el-row :gutter="16">
                        <el-col :md="8" :xs="24">
                            <el-form-item label="Superficie" prop="superficie">
                                <el-input-number v-model="form.superficie" :min="0" :step="1" :precision="2"
                                    :controls="false" placeholder="Ex: 250" />
                            </el-form-item>
                        </el-col>
                        <el-col :md="8" :xs="24">
                            <el-form-item label="Unité" prop="typeUnite">
                                <el-select v-model="form.typeUnite" filterable clearable placeholder="Choisir…"
                                    :loading="loading.units">
                                    <el-option v-for="u in options.units" :key="u" :label="u" :value="u" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :md="8" :xs="24">
                            <el-form-item label="Prix" prop="prix">
                                <el-input-number v-model="form.prix" :min="0" :step="1000" :precision="0"
                                    :controls="false" placeholder="Ex: 15000000" />
                            </el-form-item>
                        </el-col>
                        <el-col :md="12" :xs="24">
                            <el-form-item label="Équipements" prop="equipementsId">
                                <el-select v-model="form.equipementsId" clearable filterable placeholder="Choisir…"
                                    :loading="loading.equipements">
                                    <el-option v-for="e in options.equipements" :key="e.id"
                                        :label="e.nom || e.libelle || ('Équipements #' + e.id)" :value="e.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <!-- STEP 4: MEDIA -->
                <div v-show="step === 3">
                    <el-row :gutter="16">
                        <el-col :md="12" :xs="24">
                            <el-form-item label="Image de couverture">
                                <el-upload class="upload-cover" drag
                                    :http-request="(opt: any) => uploadFile(opt, 'cover')" :show-file-list="false"
                                    accept="image/*">
                                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                                    <div class="el-upload__text">Déposez une image ou <em>cliquez</em></div>
                                    <template #tip>
                                        <div class="el-upload__tip">JPG/PNG &lt; 5MB</div>
                                    </template>
                                </el-upload>
                                <div v-if="preview.coverUrl" class="mt-3">
                                    <el-image :src="preview.coverUrl" fit="cover"
                                        style="width: 240px; height: 160px; border-radius: 12px;" />
                                </div>
                            </el-form-item>
                        </el-col>

                        <el-col :md="12" :xs="24">
                            <el-form-item label="Galerie (max 12)">
                                <el-upload list-type="picture-card" :limit="12"
                                    :on-exceed="() => $message.warning('Limite de 12 images atteinte')"
                                    :http-request="(opt: any) => uploadFile(opt, 'gallery')" accept="image/*">
                                    <el-icon>
                                        <plus />
                                    </el-icon>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <!-- STEP 5: SUMMARY -->
                <div v-show="step === 4">
                    <el-result icon="success" title="Vérifiez les informations"
                        sub-title="Vous pouvez revenir en arrière pour corriger.">
                        <template #extra>
                            <el-row :gutter="16">
                                <el-col :md="12" :xs="24">
                                    <el-descriptions title="Général" :column="1" border>
                                        <el-descriptions-item label="Nom">{{ form.nom }}</el-descriptions-item>
                                        <el-descriptions-item label="Type">{{ findLabel(options.typesBien,
                                            form.typeBiensImmobiliereId) }}</el-descriptions-item>
                                        <el-descriptions-item label="Statut">{{ form.status ? 'Actif' : 'Inactif'
                                        }}</el-descriptions-item>
                                        <el-descriptions-item label="À vendre?">{{ form.aVendre ? 'Oui' : 'Non'
                                        }}</el-descriptions-item>
                                        <el-descriptions-item label="Note">{{ form.note || '-' }}</el-descriptions-item>
                                    </el-descriptions>
                                </el-col>
                                <el-col :md="12" :xs="24">
                                    <el-descriptions title="Localisation" :column="1" border>
                                        <el-descriptions-item label="Adresse">{{ form.adresse }}</el-descriptions-item>
                                        <el-descriptions-item label="Département">{{ findLabel(options.deps,
                                            form.departementId) }}</el-descriptions-item>
                                        <el-descriptions-item label="Commune">{{ findLabel(options.communes,
                                            form.communeId) }}</el-descriptions-item>
                                        <el-descriptions-item label="Arrondissement">{{ findLabel(options.arrs,
                                            form.arrondissementId) }}</el-descriptions-item>
                                        <el-descriptions-item label="Coordonnées">{{ form.latitude || '-' }}, {{
                                            form.longitude || '-' }}</el-descriptions-item>
                                    </el-descriptions>
                                </el-col>
                                <el-col :md="12" :xs="24" class="mt-4">
                                    <el-descriptions title="Caractéristiques" :column="1" border>
                                        <el-descriptions-item label="Superficie">{{ form.superficie }} {{ form.typeUnite
                                        }}</el-descriptions-item>
                                        <el-descriptions-item label="Prix">{{ formatPrice(form.prix)
                                        }}</el-descriptions-item>
                                        <el-descriptions-item label="Équipements">{{ findLabel(options.equipements,
                                            form.equipementsId) || '-' }}</el-descriptions-item>
                                    </el-descriptions>
                                </el-col>
                                <el-col :md="12" :xs="24" class="mt-4">
                                    <el-descriptions title="Divers" :column="1" border>
                                        <el-descriptions-item label="Propriétaire">{{ findLabel(options.users,
                                            form.userInfoId, 'email') }}</el-descriptions-item>
                                        <el-descriptions-item label="Détails">{{ findLabel(options.details,
                                            form.detailsBiensImmobiliersId) || '-' }}</el-descriptions-item>
                                    </el-descriptions>
                                </el-col>
                            </el-row>
                        </template>
                    </el-result>
                </div>

                <!-- NAVIGATION BUTTONS -->
                <div class="mt-6 flex items-center justify-between">
                    <div>
                        <el-button v-if="step > 0" @click="prevStep" :disabled="submitting">Retour</el-button>
                    </div>
                    <div class="space-x-2">
                        <el-button v-if="step < 4" type="primary" @click="nextStep"
                            :loading="submitting">Suivant</el-button>
                        <el-button v-if="step === 4" type="success" @click="submit"
                            :loading="submitting">Enregistrer</el-button>
                        <el-button text @click="reset" :disabled="submitting">Réinitialiser</el-button>
                    </div>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, UploadFilled } from '@element-plus/icons-vue'
import request from '@/http/request'
// import { API_URLS } from '@/config/api' // 👉 décommentez si vous avez un fichier de routes

const step = ref(0)
const submitting = ref(false)
const formRef = ref()

// ---- Modèle de formulaire
interface FormModel {
    nom: string
    adresse: string
    departementId: number | null
    communeId: number | null
    arrondissementId: number | null
    latitude: number | null
    longitude: number | null
    status: boolean
    aVendre: boolean
    note?: number | null
    superficie: number | null
    prix: number | null
    typeUnite: string | null
    description: string
    typeBiensImmobiliereId: number | null
    detailsBiensImmobiliersId: number | null
    userInfoId: number | null
    equipementsId: number | null
    fichierId: number | null
    fichiersIds: number[]
}

const form = reactive<FormModel>({
    nom: '',
    adresse: '',
    departementId: null,
    communeId: null,
    arrondissementId: null,
    latitude: null,
    longitude: null,
    status: true,
    aVendre: false,
    note: null,
    superficie: null,
    prix: null,
    typeUnite: null,
    description: '',
    typeBiensImmobiliereId: null,
    detailsBiensImmobiliersId: null,
    userInfoId: null,
    equipementsId: null,
    fichierId: null,
    fichiersIds: [],
})

// ---- Options & chargements
const options = reactive({
    typesBien: [] as any[],
    users: [] as any[],
    details: [] as any[],
    deps: [] as any[],
    communes: [] as any[],
    arrs: [] as any[],
    equipements: [] as any[],
    units: [] as string[],
})

const loading = reactive({
    types: false,
    users: false,
    details: false,
    deps: false,
    communes: false,
    arrs: false,
    equipements: false,
    units: false,
})

// ---- Règles de validation
const rules = {
    nom: [{ required: true, message: 'Le nom est requis', trigger: 'blur' }],
    typeBiensImmobiliereId: [{ required: true, message: 'Le type de bien est requis', trigger: 'change' }],
    adresse: [{ required: true, message: "L'adresse est requise", trigger: 'blur' }],
    departementId: [{ required: true, message: 'Département requis', trigger: 'change' }],
    communeId: [{ required: true, message: 'Commune requise', trigger: 'change' }],
    superficie: [
        { required: true, message: 'Superficie requise', trigger: 'blur' },
        { type: 'number', min: 0, message: 'Valeur invalide', trigger: 'blur' },
    ],
    typeUnite: [{ required: true, message: "L'unité est requise", trigger: 'change' }],
    prix: [
        { required: true, message: 'Prix requis', trigger: 'blur' },
        { type: 'number', min: 0, message: 'Valeur invalide', trigger: 'blur' },
    ],
}

// ---- Endpoints (adaptez selon votre backend)
const ENDPOINTS = {
    CREATE: '/api/biens-immobiliers',
    TYPES_BIEN: '/api/type-biens',
    USERS: '/api/user-info',
    DETAILS: '/api/details-biens-immobiliers',
    DEPARTEMENTS: '/api/departements',
    COMMUNES_BY_DEP: (id: number) => `/api/communes?departementId=${id}`,
    ARR_BY_COM: (id: number) => `/api/arrondissements?communeId=${id}`,
    EQUIPEMENTS: '/api/equipements',
    UNITS: '/api/enums/type-unite', // retour attendu: ["M2","HECTARE", ...]
    UPLOAD: '/api/fichiers/upload', // doit retourner { id, url }
}

// ---- Helpers
const $message = ElMessage

function findLabel(list: any[], value: any, attr = 'nom') {
    const item = list.find((i: any) => i.id === value)
    if (!item) return ''
    if (attr && item[attr]) return item[attr]
    return item.nom || item.libelle || item.name || `#${item.id}`
}

function formatPrice(p: number | null) {
    if (p == null) return '-'
    try {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(p)
    } catch {
        return `${p} FCFA`
    }
}

// ---- Navigation
const requiredPropsByStep: Record<number, string[]> = {
    0: ['nom', 'typeBiensImmobiliereId'],
    1: ['adresse', 'departementId', 'communeId'],
    2: ['superficie', 'typeUnite', 'prix'],
    3: [],
    4: [],
}

async function validateCurrentStep() {
    const props = requiredPropsByStep[step.value]
    if (!props || props.length === 0) return true
    try {
        await formRef.value.validateField(props)
        return true
    } catch (e) {
        return false
    }
}

async function nextStep() {
    const ok = await validateCurrentStep()
    if (!ok) return
    step.value = Math.min(step.value + 1, 4)
}

function prevStep() {
    step.value = Math.max(step.value - 1, 0)
}

function reset() {
    ElMessageBox.confirm('Réinitialiser le formulaire ?', 'Confirmation', { type: 'warning' })
        .then(() => {
            Object.assign(form, {
                nom: '', adresse: '', departementId: null, communeId: null, arrondissementId: null,
                latitude: null, longitude: null, status: true, aVendre: false, note: null,
                superficie: null, prix: null, typeUnite: null, description: '', typeBiensImmobiliereId: null,
                detailsBiensImmobiliersId: null, userInfoId: null, equipementsId: null, fichierId: null, fichiersIds: [],
            })
            step.value = 0
            preview.coverUrl = ''
        })
        .catch(() => { })
}

function onBack() {
    history.back()
}

// ---- Chargement des options
async function fetchList(key: keyof typeof loading, url: string) {
    try {
        ; (loading as any)[key] = true
        const { data } = await request.get(url)
        return data
    } catch (e) {
        console.error('Fetch error', key, e)
        return []
    } finally {
        ; (loading as any)[key] = false
    }
}

async function loadInitial() {
    options.typesBien = await fetchList('types', ENDPOINTS.TYPES_BIEN)
    options.users = await fetchList('users', ENDPOINTS.USERS)
    options.details = await fetchList('details', ENDPOINTS.DETAILS)
    options.deps = await fetchList('deps', ENDPOINTS.DEPARTEMENTS)
    options.equipements = await fetchList('equipements', ENDPOINTS.EQUIPEMENTS)
    options.units = await (async () => {
        loading.units = true
        try {
            const { data } = await request.get(ENDPOINTS.UNITS)
            if (Array.isArray(data) && data.length) return data
        } catch (_) { }
        return ['M2', 'HECTARE'] // fallback
    })()
    loading.units = false
}

watch(() => form.departementId, async (id) => {
    form.communeId = null
    form.arrondissementId = null
    options.communes = []
    options.arrs = []
    if (!id) return
    options.communes = await fetchList('communes', ENDPOINTS.COMMUNES_BY_DEP(id))
})

watch(() => form.communeId, async (id) => {
    form.arrondissementId = null
    options.arrs = []
    if (!id) return
    options.arrs = await fetchList('arrs', ENDPOINTS.ARR_BY_COM(id))
})

onMounted(() => {
    loadInitial()
})

// ---- Uploads
const preview = reactive({ coverUrl: '' })

async function uploadFile(option: any, type: 'cover' | 'gallery') {
    const { file, onSuccess, onError } = option
    try {
        const formData = new FormData()
        formData.append('file', file as File)
        const { data } = await request.post(ENDPOINTS.UPLOAD, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        // On attend { id, url }
        if (!data?.id) throw new Error('Réponse upload invalide')
        if (type === 'cover') {
            form.fichierId = data.id
            preview.coverUrl = data.url || preview.coverUrl
        } else {
            form.fichiersIds.push(data.id)
        }
        onSuccess(data)
    } catch (e) {
        console.error(e)
        $message.error("Échec de l'upload")
        onError?.(e)
    }
}

// ---- Soumission
async function submit() {
    const ok = await formRef.value.validate()
    if (!ok) return
    submitting.value = true
    try {
        const payload = buildPayload()
        const { data } = await request.post(ENDPOINTS.CREATE, payload)
        $message.success('Bien enregistré avec succès')
        // Redirection possible: this.$router.push({ name: 'biens.details', params: { id: data.id } })
        reset()
    } catch (e: any) {
        console.error(e)
        $message.error(e?.response?.data?.message || 'Erreur lors de lenregistrement')
    } finally {
        submitting.value = false
    }
}

function buildPayload() {
    return {
        nom: form.nom,
        adresse: form.adresse,
        latitude: form.latitude,
        longitude: form.longitude,
        status: form.status,
        aVendre: form.aVendre,
        note: form.note,
        superficie: form.superficie,
        prix: form.prix,
        typeUnite: form.typeUnite,
        description: form.description,
        typeBiensImmobiliere: form.typeBiensImmobiliereId ? { id: form.typeBiensImmobiliereId } : null,
        detailsBiensImmobiliers: form.detailsBiensImmobiliersId ? { id: form.detailsBiensImmobiliersId } : null,
        userInfo: form.userInfoId ? { id: form.userInfoId } : null,
        fichier: form.fichierId ? { id: form.fichierId } : null,
        fichiers: form.fichiersIds.map((id) => ({ id })),
        departement: form.departementId ? { id: form.departementId } : null,
        commune: form.communeId ? { id: form.communeId } : null,
        arrondissement: form.arrondissementId ? { id: form.arrondissementId } : null,
        equipements: form.equipementsId ? { id: form.equipementsId } : null,
    }
}
</script>

<style scoped>
.el-page-header {
    margin-bottom: 8px;
}

.upload-cover {
    width: 100%;
}

.mt-3 {
    margin-top: 12px;
}

.mt-4 {
    margin-top: 16px;
}

.flex {
    display: flex;
}

.items-center {
    align-items: center;
}

.justify-between {
    justify-content: space-between;
}

.space-x-2>*+* {
    margin-left: 8px;
}
</style>
