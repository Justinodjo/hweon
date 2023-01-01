<template>
    <div class="modal fade" tabindex="-1" ref="intervention" id="intervention" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Intervention — {{ isEdit ? 'Éditer' : 'Créer' }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="handleSubmit" novalidate class="needs-validation">
                        <div class="row g-3">
                            <!-- Type d'intervention -->
                            <div class="col-md-6">
                                <label class="form-label">Type d'intervention</label>
                                <input v-model="form.typeIntervention" type="text" required
                                    :class="['form-control', validationClass('typeIntervention')]"
                                    placeholder="Ex: Plomberie" />
                                <div class="invalid-feedback">Le type d'intervention est requis.</div>
                            </div>

                            <!-- Statut -->
                            <div class="col-md-6" v-if="!isProspect">
                                <label class="form-label">Statut</label>
                                <select v-model="form.statut" required
                                    :class="['form-select', validationClass('statut')]">
                                    <option disabled value="">-- Sélectionner --</option>
                                    <option v-for="s in statutOptions" :key="s.value" :value="s.value">{{ s.label }}
                                    </option>
                                </select>
                                <div class="invalid-feedback">Veuillez sélectionner un statut.</div>
                            </div>

                            <!-- Description -->
                            <div class="col-12">
                                <label class="form-label">Description</label>
                                <textarea v-model="form.description" rows="10"
                                    :class="['form-control', validationClass('description')]"
                                    placeholder="Description détaillée..."></textarea>
                                <div class="form-text">Max 5000 caractères. <span v-if="isProspect"
                                        class="text-warning d-block mt-1">
                                        Veuillez compléter vos informations de prise de contact afin que le gestionnaire
                                        ou le propriétaire puisse vous contacter.
                                    </span></div>
                            </div>

                            <!-- Coûts -->
                            <div class="col-md-4" v-if="!isProspect">
                                <label class="form-label">Estimation coût (€)</label>
                                <input v-model.number="form.estimationCout" type="number" step="0.01" min="0"
                                    :class="['form-control', validationClass('estimationCout')]" placeholder="0.00" />
                            </div>

                            <div class="col-md-4" v-if="!isProspect">
                                <label class="form-label">Coût réel (€)</label>
                                <input v-model.number="form.coutReel" type="number" step="0.01" min="0"
                                    :class="['form-control', validationClass('coutReel')]" placeholder="0.00" />
                            </div>

                            <div class="col-md-4 d-flex flex-column" v-if="!isProspect">
                                <label class="form-label">Écart budgétaire</label>
                                <div class="form-control-plaintext fw-bold fs-5">{{ formattedEcart }}</div>
                                <small class="form-text text-muted">Calculé automatiquement</small>
                            </div>

                            <!-- Dates -->
                            <div class="col-md-6" v-if="isProspect">
                                <label class="form-label">Date signalement</label>
                                <input v-model="form.dateSignalement" type="datetime-local"
                                    :class="['form-control', validationClass('dateSignalement')]" />
                            </div>

                            <div class="col-md-6" v-if="!isProspect">
                                <label class="form-label">Date traitement</label>
                                <input v-model="form.dateTraitement" type="datetime-local"
                                    :class="['form-control', validationClass('dateTraitement')]" />
                            </div>

                            <!-- Priorité et Bien immobilier -->
                            <div class="col-md-6">
                                <label class="form-label">Priorité</label>
                                <select v-model="form.priorite" :class="['form-select', validationClass('priorite')]">
                                    <option disabled value="">-- Sélectionner --</option>
                                    <option v-for="p in prioriteOptions" :key="p.value" :value="p.value">{{ p.label }}
                                    </option>
                                </select>
                            </div>

                            <div class="col-md-6" v-if="!isProspect">
                                <label class="form-label">Bien immobilier</label>
                                <select v-model="form.biensImmobilersId" class="form-select">
                                    <option disabled value="">-- Choisir le bien --</option>
                                    <option v-for="b in biensOptions" :key="b.id" :value="b.id">{{ b.label }}</option>
                                </select>
                            </div>

                            <!-- Fichiers -->
                            <div class="col-12" v-if="!isProspect">
                                <label class="form-label">Fichiers</label>
                                <input ref="fileInput" @change="onFilesSelected" type="file" multiple
                                    class="form-control" accept="image/*,.pdf" />
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

                            <!-- Documents -->
                            <div class="col-12" v-if="!isProspect">
                                <label class="form-label">Documents liés</label>
                                <div v-for="(doc, idx) in form.documents" :key="idx" class="input-group mb-2">
                                    <input v-model="doc.title" class="form-control" placeholder="Titre du document" />
                                    <input v-model="doc.url" class="form-control" placeholder="URL / chemin" />
                                    <button type="button" class="btn btn-outline-danger"
                                        @click="removeDocument(idx)">Suppr</button>
                                </div>
                                <button type="button" class="btn btn-sm btn-outline-primary"
                                    @click="addDocument">Ajouter un document</button>
                            </div>

                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                    <button type="button" class="btn btn-primary" @click="handleSubmit">
                        {{ isSubmitting ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Créer') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
export default {
    name: "AddIntervention",
    props: {
        modelValue: { type: Object, default: null },
        biensOptions: { type: Array, default: () => [] },
        isEdit: { type: Boolean, default: false },
        detailsBienId: { type: Number, default: null }
    },
    data() {
        return {
            intervention: null,
            modalInstance: null,
            isProspect: false,
            statutOptions: [],
            prioriteOptions: [],
            form: {
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
                fichiers: [],
                biensImmobilersId: null,
                documents: []
            },
            filesPreview: [],
            isSubmitting: false,
            touched: {}
        };
    },
    computed: {
        isNew() {
            return !this.form.id; // true si c'est un nouvel enregistrement
        },
        formattedEcart() {
            const nf = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
            return nf.format(this.form.ecartBudgetaire || 0);
        },
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(nv) {
                if (nv) Object.assign(this.form, this.sanitizeIncoming(nv));
            }
        },
        'form.estimationCout': 'updateEcart',
        'form.coutReel': 'updateEcart'
    },
    mounted() {
        this.intervention = this.$refs.intervention;
        if (!this.modalInstance) {
            this.modalInstance = new window.bootstrap.Modal(this.intervention);
        }
        this.fetchEnums();
    },
    methods: {
        open(initialData = null, isProspect = false) {
            if (initialData) Object.assign(this.form, initialData);
            this.isProspect = isProspect;

            if (this.isProspect) {
                this.form.estimationCout = 50; // prix par défaut pour prospect
                this.form.coutReel = 0;
                this.form.ecartBudgetaire = 0;
                this.form.prixVisite = this.calculPrixSysteme();
            }

            if (!this.modalInstance) this.modalInstance = new window.bootstrap.Modal(this.intervention);
            this.modalInstance.show();
        },
        fetchEnums() {

            // statut
            this.$store.dispatch('types/getStatutInterventions')
                .then(data => {
                    this.statutOptions = data.map(s => ({ value: s, label: s }));
                })
                .catch(err => console.error('Erreur statut :', err));

            // priorité
            this.$store.dispatch('types/getNiveauxPriorite')
                .then(data => {
                    this.prioriteOptions = data.map(p => ({ value: p, label: p }));
                })
                .catch(err => console.error('Erreur priorité :', err));
        },
        close() {
            if (this.modalInstance) this.modalInstance.hide();
        },
        sanitizeIncoming(src) {
            const copy = { ...src };
            if (copy.dateSignalement) copy.dateSignalement = this.toInputDate(copy.dateSignalement);
            if (copy.dateTraitement) copy.dateTraitement = this.toInputDate(copy.dateTraitement);
            if (copy.estimationCout != null) copy.estimationCout = Number(copy.estimationCout);
            if (copy.coutReel != null) copy.coutReel = Number(copy.coutReel);
            if (copy.biensImmobilers && copy.biensImmobilers.id) copy.biensImmobilersId = copy.biensImmobilers.id;
            return copy;
        },
        calculPrixSysteme() {
            // Exemple : base sur l'estimation et un coefficient selon le type de bien
            const base = Number(this.form.estimationCout || 0);
            const coutReel = Number(this.form.coutReel || 0);
            const ecart = Number(this.form.ecartBudgetaire || 0);

            // Formule simple : estimation + moitié de l'écart entre réel et estimation
            // Tu peux adapter la formule selon tes règles métier
            const prix = base + (coutReel - base) / 2 + ecart * 0.1;

            return Math.max(prix, 0); // prix minimum 0
        },
        toInputDate(dateLike) {
            const d = new Date(dateLike);
            const pad = n => String(n).padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        },
        updateEcart() {
            const est = Number(this.form.estimationCout || 0);
            const reel = Number(this.form.coutReel || 0);
            this.form.ecartBudgetaire = reel - est;
        },
        validationClass(field) {
            return this.touched[field] ? (this.isFieldValid(field) ? 'is-valid' : 'is-invalid') : '';
        },
        isFieldValid(field) {
            switch (field) {
                case 'typeIntervention': return !!this.form.typeIntervention && this.form.typeIntervention.trim().length > 0;
                case 'statut': return !!this.form.statut;
                default: return true;
            }
        },
        markAllTouched() {
            Object.keys(this.form).forEach(k => this.touched[k] = true);
        },
        handleSubmit() {
            this.markAllTouched();
            if (!this.isFieldValid('typeIntervention')) return;

            this.isSubmitting = true;
            try {
                const payload = {
                    typeIntervention: this.form.typeIntervention,
                    description: this.form.description,
                    estimationCout: this.form.estimationCout,
                    coutReel: this.form.coutReel,
                    ecartBudgetaire: this.form.ecartBudgetaire,
                    dateSignalement: this.form.dateSignalement ? new Date(this.form.dateSignalement).toISOString() : null,
                    dateTraitement: this.form.dateTraitement ? new Date(this.form.dateTraitement).toISOString() : null,
                    statut: this.form.statut,
                    priorite: this.form.priorite,
                    biensImmobilersId: this.form.biensImmobilersId,
                    detailsBienId: this.form.detailsBienId, // <-- ici !
                    documents: this.form.documents
                };

                if (this.filesPreview.length > 0) {
                    const fd = new FormData();
                    fd.append('payload', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
                    this.filesPreview.forEach(f => fd.append('files', f.raw, f.name));
                    this.$emit('save', { ...payload, uploadedFiles: this.filesPreview.map(f => ({ name: f.name })) });
                } else {
                    this.$emit('save', payload);
                }
            } catch (err) {
                console.error(err);
                alert('Erreur lors de la sauvegarde — vérifiez la console');
            } finally {
                this.isSubmitting = false;
            }
        },
        onFilesSelected(e) {
            const files = Array.from(e.target.files || []);
            files.forEach(f => {
                const reader = new FileReader();
                reader.onload = ev => {
                    this.filesPreview.push({
                        name: f.name,
                        size: f.size,
                        type: f.type,
                        url: ev.target.result,
                        raw: f,
                        sizeHuman: this.humanFileSize(f.size)
                    });
                };
                reader.readAsDataURL(f);
            });
            e.target.value = null;
        },
        removeFile(i) {
            this.filesPreview.splice(i, 1);
        },
        humanFileSize(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        addDocument() {
            this.form.documents.push({ title: '', url: '' });
        },
        removeDocument(i) {
            this.form.documents.splice(i, 1);
        }
    }
};
</script>

<style scoped>
.modal-content {
    border-radius: .75rem;
}

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
