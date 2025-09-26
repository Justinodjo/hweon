<template>
    <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h6>Pièces principales</h6>
            <button type="button" class="btn btn-primary btn-sm" @click="addDetail">
                <i class="bi bi-plus me-2"></i>Ajouter une pièce
            </button>
        </div>

        <div class="card-body">
            <!-- Boutons rapides -->
            <div class="mb-4">
                <span class="text-muted me-3">Ajouter rapidement:</span>
                <div class="quick-add-buttons">
                    <button v-for="type in commonRoomTypes" :key="type.key"
                        class="btn btn-outline-secondary btn-sm me-2 mb-2"
                        @click="addPredefinedDetail(type.key, type.label)">
                        <i :class="type.icon" class="me-1"></i>{{ type.label }}
                    </button>
                </div>
            </div>

            <!-- Liste des détails/pièces -->
            <div v-if="detailsBiensImmobiliers.length === 0" class="text-center py-4 empty-state">
                <i class="bi bi-house text-muted fs-1"></i>
                <p class="text-muted mt-2">Aucune pièce ajoutée</p>
                <small class="text-muted">Utilisez les boutons ci-dessus pour ajouter des pièces</small>
            </div>

            <div v-for="(detail, index) in detailsBiensImmobiliers" :key="`detail-${index}`" class="detail-card">
                <div class="card border">
                    <div class="card-header bg-light d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">
                            <i :class="getRoomIcon(detail.typeDetailsBiens)" class="me-2"></i>Pièce {{ index + 1 }}
                        </h6>
                        <button class="btn btn-danger btn-sm" @click="removeDetail(index)"
                            title="Supprimer cette pièce">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>

                    <div class="card-body">
                        <div class="row g-3 mb-3">
                            <div class="col-md-4">
                                <label class="form-label">Type de pièce *</label>
                                <select class="form-select" :value="detail.typeDetailsBiens"
                                    @change="updateDetail(index, 'typeDetailsBiens', $event.target.value)">
                                    <option value="">Sélectionnez un type</option>
                                    <option v-for="type in typesDetailsBiens" :key="type.key" :value="type.key">
                                        {{ type.label }}
                                    </option>
                                </select>
                            </div>

                            <div class="col-md-2">
                                <label class="form-label">Nombre *</label>
                                <input type="number" class="form-control" :value="detail.nombre"
                                    @input="updateDetail(index, 'nombre', parseInt($event.target.value) || 1)" min="1"
                                    max="20">
                            </div>

                            <div class="col-md-4">
                                <label class="form-label">Nom/Description *</label>
                                <input type="text" class="form-control" :value="detail.nomdetails"
                                    @input="updateDetail(index, 'nomdetails', $event.target.value)"
                                    placeholder="Ex: Chambre parentale, Cuisine équipée...">
                            </div>

                            <div class="col-md-2">
                                <label class="form-label">Prix (FCFA)</label>
                                <input type="number" class="form-control" :value="detail.prix"
                                    @input="updateDetail(index, 'prix', parseFloat($event.target.value) || null)"
                                    min="0" placeholder="Optionnel">
                            </div>
                        </div>

                        <!-- Upload images -->
                        <div v-if="!isAgricole">
                            <FilePondWrapper :form="form" :uploadConfig="uploadConfig" :preview="preview"
                                :currentStep="currentStep" :index="index" :metadata="{ detailIndex: index }"
                                @uploadResponse="(response) => handleFileUploaded(response, index)" />
                            <DropzoneUpload :form="form" :uploadConfig="uploadConfig" :preview="preview" :index="index"
                                :maxFiles="10" @uploadResponse="(event) => handleFileUploadResponse(index, event)"
                                :initialFiles="detail.fichiers" />
                        </div>

                        <!-- Description détaillée -->
                        <div class="mb-3">
                            <label class="form-label">Description détaillée</label>
                            <textarea class="form-control" :value="detail.description"
                                @input="updateDetail(index, 'description', $event.target.value)" rows="2"
                                placeholder="Détails supplémentaires sur cette pièce..."></textarea>
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" :id="`status-${index}`"
                                :checked="detail.status !== false"
                                @change="updateDetail(index, 'status', $event.target.checked)">
                            <label class="form-check-label" :for="`status-${index}`">
                                Pièce disponible/fonctionnelle
                            </label>
                        </div>

                        <!-- Sous-détails -->
                        <div v-if="detail.sousDetailsBiensImmobiliers && detail.sousDetailsBiensImmobiliers.length > 0">
                            <h6>Sous-détails</h6>
                            <div v-for="(sousDetail, sousIndex) in detail.sousDetailsBiensImmobiliers"
                                :key="`sousDetail-${sousIndex}`" class="row g-3 mb-3">
                                <div class="col-md-4" v-if="!isResidentiel">
                                    <label class="form-label">Année de construction</label>
                                    <input type="number" class="form-control" :value="sousDetail.anneeConstruction"
                                        @input="updateSousDetail(index, sousIndex, 'anneeConstruction', parseInt($event.target.value) || null)"
                                        min="1800" :max="currentYear" placeholder="Ex: 2020">
                                </div>
                                <div class="col-md-4" v-if="!isResidentiel">
                                    <label class="form-label">Nombre d'étages</label>
                                    <input type="number" class="form-control" :value="sousDetail.nombreEtages"
                                        @input="updateSousDetail(index, sousIndex, 'nombreEtages', parseInt($event.target.value) || null)"
                                        min="1" max="50" placeholder="1">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">État du bien *</label>
                                    <select class="form-select" :value="sousDetail.etatGeneral"
                                        @change="updateSousDetail(index, sousIndex, 'etatGeneral', $event.target.value)">
                                        <option value="">Sélectionnez l'état</option>
                                        <option v-for="etat in etatsGeneral" :key="etat.key" :value="etat.key">
                                            {{ etat.label }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <button type="button" class="btn btn-danger btn-sm mt-3"
                                        @click="removeSousDetail(index, sousIndex)">Supprimer</button>
                                </div>
                            </div>
                            <div class="text-end mb-3">
                                <button type="button" class="btn btn-secondary btn-sm" @click="addSousDetail(index)">
                                    Ajouter un sous-détail
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Résumé -->
            <div v-if="detailsBiensImmobiliers.length > 0" class="mt-4 card bg-info bg-opacity-10 border-info">
                <div class="card-body">
                    <h6 class="card-title">
                        <i class="bi bi-info-circle me-2"></i>
                        Résumé des pièces ({{ detailsBiensImmobiliers.length }})
                    </h6>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="summary-stats">
                                <div v-for="(count, type) in roomSummary" :key="type" class="mb-1">
                                    <small><i :class="getRoomIcon(type)" class="me-1"></i>{{ formatRoomType(type) }}:
                                        <strong>{{ count }}</strong></small>
                                </div>
                            </div>
                        </div>
                        <div v-if="totalSpecificPrice > 0" class="col-md-6">
                            <small class="text-muted">Prix spécifiques total: <strong>{{ formatPrice(totalSpecificPrice)
                                    }}</strong></small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FilePondWrapper from '@/components/FilePondWrapper.vue'
import DropzoneUpload from '@/components/DropzoneUpload.vue'
import AdditionalInfo from '@/components/AdditionalInfo.vue'
import { createNewDetail, addFileToDetail, removeFileFromDetail } from '@/utils/propertyDetailsUtils.js'
import { API_URLS } from "@/config/api";

export default {
    name: 'PropertyDetailsManager',
    components: { FilePondWrapper, DropzoneUpload, AdditionalInfo },
    props: ['form', 'preview', 'uploadConfig', 'detailsBiensImmobiliers', 'typesDetailsBiens', 'etatsGeneral', 'typesBien', 'typesDPE', 'currentStep', 'activeStep'],
    emits: ['update:details', 'update:form', 'uploadResponse', 'update:preview'],
    computed: {
        commonRoomTypes() {
            return [
                { key: 'CHAMBRE', label: 'Chambre', icon: 'bi-moon' },
                { key: 'SALLE_BAIN', label: 'Salle de bain', icon: 'bi-droplet' },
                { key: 'SALON', label: 'Salon', icon: 'bi-tv' },
                { key: 'CUISINE', label: 'Cuisine', icon: 'bi-cup-hot' },
                { key: 'GARAGE', label: 'Garage', icon: 'bi-car-front' },
                { key: 'JARDIN', label: 'Jardin', icon: 'bi-tree' },
                { key: 'TERRASSE', label: 'Terrasse', icon: 'bi-sun' },
                { key: 'BALCON', label: 'Balcon', icon: 'bi-building' }
            ]
        },
        roomSummary() {
            const summary = {}
            this.detailsBiensImmobiliers.forEach(d => {
                const type = d.typeDetailsBiens
                if (type) summary[type] = (summary[type] || 0) + (d.nombre || 1)
            })
            return summary
        },
        totalSpecificPrice() {
            return this.detailsBiensImmobiliers.reduce((sum, d) => sum + (parseFloat(d.prix) || 0), 0)
        },
        currentYear() { return new Date().getFullYear() },
        isAgricole() { return this.getTypeBien?.toLowerCase() === 'agricole' },
        isResidentiel() { return this.getTypeBien?.toLowerCase() === 'residentiel' },
        getTypeBien() {
            if (!this.typesBien || !this.form) return null;
            const type = this.typesBien.find(
                t => Number(t.id) === Number(this.form.typeBiensImmobiliereId)
            );
            return type?.nomTypeBiensImmo || null;
        },
    },
    methods: {
        addDetail() { this.$emit('update:details', [...this.detailsBiensImmobiliers, createNewDetail()]) },
        addPredefinedDetail(type, label) { this.$emit('update:details', [...this.detailsBiensImmobiliers, createNewDetail(type, label)]) },
        removeDetail(index) { this.$emit('update:details', this.detailsBiensImmobiliers.filter((_, i) => i !== index)) },
        updateDetail(index, field, value) {
            const updated = [...this.detailsBiensImmobiliers]; updated[index] = { ...updated[index], [field]: value }; this.$emit('update:details', updated)
        },
        addSousDetail(index) {
            const updated = [...this.detailsBiensImmobiliers]; updated[index].sousDetailsBiensImmobiliers.push({ anneeConstruction: null, nombreEtages: null, etatGeneral: '', description: '', superficie: null, caracteristiques: [] }); this.$emit('update:details', updated)
        },
        updateSousDetail(i, j, field, value) { const updated = [...this.detailsBiensImmobiliers]; updated[i].sousDetailsBiensImmobiliers[j][field] = value; this.$emit('update:details', updated) },
        removeSousDetail(i, j) { const updated = [...this.detailsBiensImmobiliers]; updated[i].sousDetailsBiensImmobiliers.splice(j, 1); this.$emit('update:details', updated) },
        handleFileUploaded(resp, index) {
            if (!resp?.file) return; const file = { id: resp.file.id, url: resp.file.url, nom: resp.file.nom || resp.file.name, originalName: resp.file.originalName, taille: resp.file.taille, contentType: resp.file.contentType }; this.$emit('update:details', addFileToDetail(this.detailsBiensImmobiliers, index, file))
        },
        handleFileUploadResponse(index, event) {
            if (event.action === 'remove') { this.$emit('update:details', removeFileFromDetail(this.detailsBiensImmobiliers, index, event.fileIndex)); return }
            if (!event?.file) return; this.handleFileUploaded(event, index)
        },
        getRoomIcon(type) {
            const icons = { 'CHAMBRE': 'bi-moon text-primary', 'SALLE_BAIN': 'bi-droplet text-info', 'SALON': 'bi-tv text-success', 'CUISINE': 'bi-cup-hot text-warning', 'GARAGE': 'bi-car-front text-secondary', 'JARDIN': 'bi-tree text-success', 'TERRASSE': 'bi-sun text-warning', 'BALCON': 'bi-building text-info', 'CAVE': 'bi-archive text-dark', 'GRENIER': 'bi-house-up text-muted' }
            return icons[type] || 'bi-house text-muted'
        },
        formatRoomType(type) { return this.typesDetailsBiens.find(t => t.key === type)?.label || this.commonRoomTypes.find(t => t.key === type)?.label || type },
        formatPrice(price) { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(price) },
        getImageUrl(idfile) { return `${API_URLS.API_BASE}/fichier/download/${idfile}` }
    }
}
</script>

<style scoped>
.detail-card {
    margin-bottom: 1rem
}

.detail-card:last-child {
    margin-bottom: 0
}

.quick-add-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px
}

.empty-state {
    padding: 2rem;
    text-align: center
}

.summary-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 4px
}

.card-header h6 {
    color: #495057
}

.form-label {
    font-weight: 500;
    color: #495057
}

.btn-outline-secondary:hover {
    background-color: #6c757d;
    border-color: #6c757d
}

.card.border {
    border: 1px solid #dee2e6 !important
}

.card.border:hover {
    border-color: #007bff !important;
    box-shadow: 0 2px 4px rgba(0, 123, 255, 0.1)
}

.bg-info.bg-opacity-10 {
    background-color: rgba(13, 202, 240, 0.1) !important
}

@media (max-width:768px) {
    .quick-add-buttons {
        justify-content: center
    }

    .btn-sm {
        font-size: 0.8rem;
        padding: 4px 8px
    }

    .summary-stats {
        grid-template-columns: 1fr
    }
}
</style>
