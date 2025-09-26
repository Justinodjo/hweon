<template>
    <div class="p-6 max-w-6xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-semibold">Gestion des Contrats</h1>
            <el-segmented v-model="activeTab"
                :options="[{ label: 'Nouveau contrat', value: 'wizard' }, { label: 'Liste des contrats', value: 'list' }]" />
        </div>

        <el-card shadow="hover" class="rounded-2xl">
            <template #header>
                <div class="flex items-center gap-3">
                    <el-icon><document-add /></el-icon>
                    <span v-if="activeTab === 'wizard'">Créer un contrat</span>
                    <span v-else>Contrats enregistrés</span>
                </div>
            </template>

            <!-- ======================= WIZARD ======================= -->
            <div v-if="activeTab === 'wizard'">
                <!-- Steps -->
                <el-steps :active="currentStep" finish-status="success" align-center class="mb-8">
                    <el-step title="Informations" description="Type, dates, loyer" />
                    <el-step title="Parties & Biens" description="Client, gestionnaire, biens" />
                    <el-step title="Récapitulatif" description="Vérification & envoi" />
                </el-steps>

                <el-form ref="formRef" :model="form" :rules="rules" label-position="top"
                    class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- ÉTAPE 1 -->
                    <template v-if="currentStep === 1">
                        <el-form-item label="Type de contrat" prop="typeContrat">
                            <el-select v-model="form.typeContrat" placeholder="Choisir un type">
                                <el-option v-for="t in typeOptions" :key="t" :label="t" :value="t" />
                            </el-select>
                        </el-form-item>

                        <el-form-item label="Statut" prop="status">
                            <el-select v-model="form.status" placeholder="Statut">
                                <el-option v-for="s in statusOptions" :key="s" :label="s" :value="s" />
                            </el-select>
                        </el-form-item>

                        <el-form-item label="Date de début" prop="dateDebut">
                            <el-date-picker v-model="form.dateDebut" type="date" placeholder="Sélectionner"
                                format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                        </el-form-item>

                        <el-form-item label="Date de fin" prop="dateFin">
                            <el-date-picker v-model="form.dateFin" type="date" placeholder="Sélectionner"
                                format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                        </el-form-item>

                        <el-form-item label="Loyer mensuel" prop="loyerMensuel">
                            <el-input-number v-model="form.loyerMensuel" :min="0" :step="1000" class="w-full" />
                        </el-form-item>

                        <div class="rounded-xl bg-gray-50 p-4 md:col-span-2">
                            <div class="flex flex-wrap gap-6 text-sm">
                                <div>
                                    <div class="text-gray-500">Durée estimée</div>
                                    <div class="text-base font-semibold">{{ dureeMois }} mois</div>
                                </div>
                                <div>
                                    <div class="text-gray-500">Échéance proche ?</div>
                                    <el-tag :type="isEcheanceProche ? 'danger' : 'success'">{{ isEcheanceProche ? 'Oui'
                                        : 'Non' }}</el-tag>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- ÉTAPE 2 -->
                    <template v-else-if="currentStep === 2">
                        <el-form-item label="Client (ID)" prop="clientId">
                            <el-input v-model.number="form.clientId" placeholder="ID utilisateur (client)" />
                        </el-form-item>

                        <el-form-item label="Gestionnaire (ID)" prop="gestionnaireId">
                            <el-input v-model.number="form.gestionnaireId" placeholder="ID gestionnaire (optionnel)" />
                        </el-form-item>

                        <el-form-item label="Biens immobiliers" prop="biensIds" class="md:col-span-2">
                            <el-select v-model="form.biensIds" multiple filterable placeholder="Sélectionner les biens"
                                class="w-full" @visible-change="onOpenBiens">
                                <el-option v-for="b in biensOptions" :key="b.id" :label="`${b.nom} — ${money(b.prix)}`"
                                    :value="b.id">
                                    <div class="flex items-center justify-between w-full">
                                        <span>{{ b.nom }}</span>
                                        <span class="text-gray-500">{{ money(b.prix) }}</span>
                                    </div>
                                </el-option>
                            </el-select>
                            <div v-if="form.biensIds.length" class="mt-3 flex flex-wrap gap-2">
                                <el-tag v-for="id in form.biensIds" :key="id" closable @close="removeBien(id)">
                                    {{ labelBien(id) }}
                                </el-tag>
                            </div>
                        </el-form-item>

                        <div class="rounded-xl bg-gray-50 p-4 md:col-span-2">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <div class="text-gray-500">Prix total (biens)</div>
                                    <div class="text-base font-semibold">{{ money(prixTotal) }}</div>
                                </div>
                                <div>
                                    <div class="text-gray-500">Commission (7% sur loyers)</div>
                                    <div class="text-base font-semibold">{{ money(commission) }}</div>
                                </div>
                                <div>
                                    <div class="text-gray-500">Total estimé</div>
                                    <div class="text-base font-semibold">{{ money(totalEstime) }}</div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- ÉTAPE 3 -->
                    <template v-else>
                        <div class="md:col-span-2 space-y-4">
                            <el-alert type="info" show-icon :closable="false"
                                title="Vérifiez les informations avant de valider" />
                            <el-descriptions :column="2" :border="true">
                                <el-descriptions-item label="Type">{{ form.typeContrat }}</el-descriptions-item>
                                <el-descriptions-item label="Statut">{{ form.status }}</el-descriptions-item>
                                <el-descriptions-item label="Début">{{ form.dateDebut }}</el-descriptions-item>
                                <el-descriptions-item label="Fin">{{ form.dateFin }}</el-descriptions-item>
                                <el-descriptions-item label="Loyer mensuel">{{ money(form.loyerMensuel)
                                }}</el-descriptions-item>
                                <el-descriptions-item label="Client ID">{{ form.clientId }}</el-descriptions-item>
                                <el-descriptions-item label="Gestionnaire ID">{{ form.gestionnaireId || '—'
                                }}</el-descriptions-item>
                                <el-descriptions-item label="Biens sélectionnés">
                                    {{ form.biensIds.map(labelBien).join(',') }}
                                </el-descriptions-item>
                            </el-descriptions>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <el-statistic title="Prix total (biens)" :value="prixTotal" :precision="0" />
                                <el-statistic title="Commission (estimée)" :value="commission" :precision="0" />
                                <el-statistic title="Total estimé" :value="totalEstime" :precision="0" />
                            </div>
                        </div>
                    </template>

                    <div class="md:col-span-2 flex justify-between mt-6">
                        <el-button :disabled="currentStep === 1" @click="prevStep" plain>Précédent</el-button>
                        <div class="flex gap-3">
                            <el-button v-if="currentStep < 3" type="primary" @click="nextStep">Suivant</el-button>
                            <el-button v-else type="success" @click="submit">Enregistrer le contrat</el-button>
                        </div>
                    </div>
                </el-form>
            </div>

            <!-- ======================= LISTE ======================= -->
            <div v-else>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div class="md:col-span-2">
                        <el-input v-model="filters.search" placeholder="Recherche (client, bien, id)" clearable />
                    </div>
                    <el-select v-model="filters.type" placeholder="Type de contrat" clearable>
                        <el-option v-for="t in typeOptions" :key="t" :label="t" :value="t" />
                    </el-select>
                    <el-date-picker v-model="filters.range" type="daterange" start-placeholder="Début"
                        end-placeholder="Fin" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                </div>

                <div class="flex items-center justify-between mb-3">
                    <el-radio-group v-model="filters.status" size="small">
                        <el-radio-button label="ALL">Tous</el-radio-button>
                        <el-radio-button label="ACTIF">Actifs</el-radio-button>
                        <el-radio-button label="EXPIRE">Expirés</el-radio-button>
                        <el-radio-button label="RESILIE">Résiliés</el-radio-button>
                    </el-radio-group>
                    <div class="flex gap-2">
                        <el-tag type="success">Actifs {{ counts.ACTIF }}</el-tag>
                        <el-tag type="warning">Expirés {{ counts.EXPIRE }}</el-tag>
                        <el-tag type="danger">Résiliés {{ counts.RESILIE }}</el-tag>
                    </div>
                </div>

                <el-table :data="filteredContrats" stripe class="rounded-xl overflow-hidden">
                    <el-table-column prop="id" label="#" width="80" />
                    <el-table-column label="Client" min-width="160">
                        <template #default="{ row }">{{ row.userInfo?.name || '—' }}</template>
                    </el-table-column>
                    <el-table-column prop="typeContrat" label="Type" width="140" />
                    <el-table-column label="Statut" width="130">
                        <template #default="{ row }">
                            <el-tag :type="statusTag(row.status)">{{ row.status }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="Bien(s)" min-width="220">
                        <template #default="{ row }">
                            <div class="flex gap-1 flex-wrap">
                                <el-tag v-for="b in (row.biensImmobiliers || [])" :key="b.id" size="small"
                                    effect="plain">{{ b.nom }}</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dateDebut" label="Début" width="120" />
                    <el-table-column prop="dateFin" label="Fin" width="120" />
                    <el-table-column prop="loyerMensuel" label="Loyer" width="120">
                        <template #default="{ row }">{{ money(row.loyerMensuel) }}</template>
                    </el-table-column>
                    <el-table-column prop="prixTotal" label="Prix Total" width="140">
                        <template #default="{ row }">{{ money(row.prixTotal) }}</template>
                    </el-table-column>
                    <el-table-column label="Actions" width="180" fixed="right">
                        <template #default="{ row }">
                            <el-button size="small" @click="view(row)">Voir</el-button>
                            <el-popconfirm title="Résilier ce contrat ?" confirm-button-text="Oui"
                                cancel-button-text="Non" @confirm="resilier(row)">
                                <template #reference>
                                    <el-button size="small" type="danger" plain>Résilier</el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="mt-4 flex justify-end">
                    <el-pagination background layout="prev, pager, next" :page-size="page.size"
                        :total="filteredContrats.length" @current-change="(p) => page.current = p" />
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
// Icône optionnelle (Element Plus)
import { DocumentAdd as documentAdd } from '@element-plus/icons-vue'

// Votre util HTTP existant
import request from '@/http/request'

// =========================
// ENUMS côté front
// =========================
const typeOptions = [
    'MEUBLEE', 'NON_MEUBLEE', 'SAISONNIERE', 'COMMERCIALE', 'PROFESSIONNELLE', 'ETUDIANT', 'OPTION_ACHAT', 'ACCESSION'
]
const statusOptions = ['ACTIF', 'EXPIRE', 'RESILIE']

// =========================
// Onglets
// =========================
const activeTab = ref('wizard') // 'wizard' | 'list'

// =========================
// WIZARD STATE
// =========================
const currentStep = ref(1)
const formRef = ref()
const form = reactive({
    typeContrat: '',
    status: 'ACTIF',
    dateDebut: '', // YYYY-MM-DD
    dateFin: '',   // YYYY-MM-DD
    loyerMensuel: null,
    clientId: null,
    gestionnaireId: null,
    biensIds: []
})

// Validation rules Element Plus
const rules = {
    typeContrat: [{ required: true, message: 'Type requis', trigger: 'change' }],
    status: [{ required: true, message: 'Statut requis', trigger: 'change' }],
    dateDebut: [{ required: true, message: 'Date de début requise', trigger: 'change' }],
    dateFin: [
        { required: true, message: 'Date de fin requise', trigger: 'change' },
        {
            validator: (_, v, cb) => {
                if (!form.dateDebut || !v) return cb()
                if (new Date(v) <= new Date(form.dateDebut)) return cb(new Error('La date de fin doit être après la date de début'))
                cb()
            }, trigger: 'change'
        }
    ],
    loyerMensuel: [{ required: true, message: 'Loyer mensuel requis', trigger: 'blur' }],
    clientId: [{ required: true, message: 'Client requis', trigger: 'blur' }],
    biensIds: [{ type: 'array', required: true, message: 'Sélectionnez au moins un bien', trigger: 'change' }]
}

// Biens (chargés à la demande)
const biensOptions = ref([])
const biensMap = computed(() => Object.fromEntries(biensOptions.value.map(b => [b.id, b])))

async function onOpenBiens(open) {
    if (open && !biensOptions.value.length) {
        try {
            // Adaptez au besoin : pagination/filtre
            const { data } = await request.get('biens/all', { params: { page: 0, size: 100 } })
            biensOptions.value = data.content || data || []
        } catch (e) {
            ElMessage.error('Impossible de charger les biens')
        }
    }
}

function labelBien(id) {
    const b = biensMap.value[id]
    return b ? `${b.nom}` : `#${id}`
}

function removeBien(id) {
    form.biensIds = form.biensIds.filter(i => i !== id)
}

// Utils
function money(n) {
    const v = Number(n || 0)
    return v.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })
}

function monthsBetween(a, b) {
    if (!a || !b) return 0
    const d1 = new Date(a), d2 = new Date(b)
    let months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth())
    // si le jour du mois de fin est inférieur au début, on retire 1 mois
    if (d2.getDate() < d1.getDate()) months -= 1
    return Math.max(0, months)
}

// Calculs
const dureeMois = computed(() => monthsBetween(form.dateDebut, form.dateFin))
const isEcheanceProche = computed(() => {
    if (!form.dateFin) return false
    const today = new Date()
    const fin = new Date(form.dateFin)
    const diff = Math.ceil((fin - today) / (1000 * 60 * 60 * 24))
    return diff <= 30
})
const prixTotal = computed(() => form.biensIds.reduce((sum, id) => sum + (biensMap.value[id]?.prix || 0), 0))
const commission = computed(() => {
    const taux = 0.07
    return (form.gestionnaireId && form.loyerMensuel && dureeMois.value)
        ? Math.round(form.loyerMensuel * dureeMois.value * taux)
        : 0
})
const totalEstime = computed(() => prixTotal.value + commission.value)

function nextStep() {
    formRef.value.validate((ok) => { if (ok) currentStep.value = Math.min(3, currentStep.value + 1) })
}
function prevStep() { currentStep.value = Math.max(1, currentStep.value - 1) }

async function submit() {
    formRef.value.validate(async (ok) => {
        if (!ok) return
        try {
            const payload = {
                typeContrat: form.typeContrat,
                status: form.status,
                dateDebut: form.dateDebut,
                dateFin: form.dateFin,
                loyerMensuel: form.loyerMensuel,
                prixTotal: prixTotal.value,
                commission: commission.value,
                userInfo: { id: form.clientId },
                gestionnaire: form.gestionnaireId ? { id: form.gestionnaireId } : null,
                biensImmobiliers: form.biensIds.map(id => ({ id }))
            }
            const { data } = await request.post('contrats/add', payload)
            ElMessage.success('Contrat enregistré !')
            // Reset
            Object.assign(form, { typeContrat: '', status: 'ACTIF', dateDebut: '', dateFin: '', loyerMensuel: null, clientId: null, gestionnaireId: null, biensIds: [] })
            currentStep.value = 1
            // rafraîchir la liste
            await fetchContrats()
            activeTab.value = 'list'
        } catch (e) {
            ElMessage.error('Erreur lors de la création du contrat')
        }
    })
}

// =========================
// LISTE STATE
// =========================
const filters = reactive({ status: 'ALL', type: '', range: [], search: '' })
const contrats = ref([])
const page = reactive({ current: 1, size: 10 })

const filteredContrats = computed(() => {
    let arr = [...contrats.value]
    if (filters.status !== 'ALL') arr = arr.filter(c => c.status === filters.status)
    if (filters.type) arr = arr.filter(c => c.typeContrat === filters.type)
    if (filters.range?.length === 2) arr = arr.filter(c => (!c.dateDebut || c.dateDebut >= filters.range[0]) && (!c.dateFin || c.dateFin <= filters.range[1]))
    if (filters.search) {
        const q = filters.search.toLowerCase()
        arr = arr.filter(c => (
            String(c.id).includes(q) ||
            (c.userInfo?.name || '').toLowerCase().includes(q) ||
            (c.biensImmobiliers || []).some(b => (b.nom || '').toLowerCase().includes(q))
        ))
    }
    // pagination locale
    const start = (page.current - 1) * page.size
    return arr.slice(start, start + page.size)
})

const counts = reactive({ ACTIF: 0, EXPIRE: 0, RESILIE: 0 })

function recomputeCounts() {
    counts.ACTIF = contrats.value.filter(c => c.status === 'ACTIF').length
    counts.EXPIRE = contrats.value.filter(c => c.status === 'EXPIRE').length
    counts.RESILIE = contrats.value.filter(c => c.status === 'RESILIE').length
}

function statusTag(s) {
    switch (s) {
        case 'ACTIF': return 'success'
        case 'EXPIRE': return 'warning'
        case 'RESILIE': return 'danger'
        default: return ''
    }
}

async function fetchContrats() {
    try {
        const { data } = await request.get('contrats/all', { params: { page: 0, size: 100 } })
        // Le backend peut renvoyer {content, ...} ou un tableau direct
        contrats.value = data.content || data || []
        recomputeCounts()
    } catch (e) {
        ElMessage.error('Impossible de charger les contrats')
    }
}

function view(row) {
    ElMessage.info(`Contrat #${row.id}`)
}

async function resilier(row) {
    try {
        await request.put(`contrats/${row.id}/resilier`) // adaptez à votre endpoint
        row.status = 'RESILIE'
        recomputeCounts()
        ElMessage.success('Contrat résilié')
    } catch (e) {
        ElMessage.error("Échec de la résiliation")
    }
}

onMounted(() => {
    fetchContrats()
})
</script>

<style scoped>
/* Petites finitions pour un rendu plus épuré */
.el-card {
    border-radius: 1rem;
}

.el-steps {
    --el-color-primary: #3b82f6;
}
</style>
