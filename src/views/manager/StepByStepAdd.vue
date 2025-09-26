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
                                <el-select v-model="form.equipementsId" multiple filterable clearable
                                    placeholder="Choisir…">
                                    <el-option v-for="e in options.equipements" :key="e.id" :label="e.nom"
                                        :value="e.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <!-- STEP 4: MEDIA -->
                <div v-show="step === 3">
                    <el-form-item label="Image principale" prop="imagePrincipal">
                        <el-upload class="upload-demo" action="/upload" list-type="picture-card"
                            :file-list="form.imagePrincipal" :on-success="handleImageUpload"
                            :before-upload="beforeUploadImage" :on-remove="handleRemoveImage">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>

                    <el-form-item label="Galerie d'images" prop="images">
                        <el-upload class="upload-demo" action="/upload" :file-list="form.images" :multiple="true"
                            list-type="picture-card" :on-success="handleGalleryUpload"
                            :before-upload="beforeUploadGallery" :on-remove="handleRemoveGallery">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                </div>

                <!-- STEP 5: REVIEW -->
                <div v-show="step === 4">
                    <el-row :gutter="16">
                        <el-col :span="24">
                            <el-button @click="submitForm" type="primary" size="large">Soumettre le bien</el-button>
                        </el-col>
                    </el-row>
                </div>

            </el-form>
        </el-card>

        <el-footer>
            <el-button @click="goNextStep" type="primary" :disabled="step === 4">Suivant</el-button>
            <el-button @click="goPreviousStep" type="text" :disabled="step === 0">Précédent</el-button>
            <el-button @click="resetForm" type="danger" size="small">Réinitialiser</el-button>
        </el-footer>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';

export default defineComponent({
    name: 'FormulaireBien',
    data() {
        return {
            step: 0,
            form: reactive({
                nom: '',
                typeBiensImmobiliereId: null,
                description: '',
                userInfoId: null,
                detailsBiensImmobiliersId: null,
                adresse: '',
                departementId: null,
                communeId: null,
                arrondissementId: null,
                latitude: null,
                longitude: null,
                superficie: null,
                typeUnite: '',
                prix: null,
                equipementsId: [],
                imagePrincipal: [],
                images: [],
                status: false,
                aVendre: false,
                note: 0,
            }),
            loading: {
                types: false,
                users: false,
                details: false,
                deps: false,
                communes: false,
                arrs: false,
                units: false,
                equipements: false,
            },
            options: {
                typesBien: [],
                users: [],
                details: [],
                deps: [],
                communes: [],
                arrs: [],
                units: ['m²', 'ha', 'km²'],
                equipements: [],
            },
            rules: {
                nom: [{ required: true, message: 'Nom du bien est requis', trigger: 'blur' }],
                typeBiensImmobiliereId: [{ required: true, message: 'Veuillez sélectionner le type de bien', trigger: 'change' }],
                adresse: [{ required: true, message: 'Adresse est requise', trigger: 'blur' }],
                departementId: [{ required: true, message: 'Département est requis', trigger: 'change' }],
                communeId: [{ required: true, message: 'Commune est requise', trigger: 'change' }],
                superficie: [{ required: true, type: 'number', message: 'Superficie est requise', trigger: 'blur' }],
                prix: [{ required: true, type: 'number', message: 'Prix est requis', trigger: 'blur' }],
            },
        };
    },
    methods: {
        // Gestion des étapes
        goNextStep() {
            if (this.step < 4) {
                this.step++;
            }
        },
        goPreviousStep() {
            if (this.step > 0) {
                this.step--;
            }
        },
        resetForm() {
            this.$confirm('Êtes-vous sûr de vouloir réinitialiser ce formulaire ?', 'Confirmation', {
                confirmButtonText: 'Oui',
                cancelButtonText: 'Non',
                type: 'warning',
            }).then(() => {
                this.form = this.$options.data().form;  // Réinitialiser le formulaire
            });
        },

        // Soumission du formulaire
        submitForm() {
            this.$message({
                message: 'Le bien a été enregistré avec succès!',
                type: 'success',
            });
        },

        // Gestion des images
        handleImageUpload(file) {
            this.form.imagePrincipal.push(file);
        },
        handleRemoveImage(file) {
            const index = this.form.imagePrincipal.indexOf(file);
            if (index !== -1) {
                this.form.imagePrincipal.splice(index, 1);
            }
        },

        handleGalleryUpload(file) {
            this.form.images.push(file);
        },
        handleRemoveGallery(file) {
            const index = this.form.images.indexOf(file);
            if (index !== -1) {
                this.form.images.splice(index, 1);
            }
        },

        beforeUploadImage(file) {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                this.$message.error('Seules les images sont autorisées');
            }
            return isImage;
        },
        beforeUploadGallery(file) {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                this.$message.error('Seules les images sont autorisées');
            }
            return isImage;
        },

        // Retour en arrière
        onBack() {
            this.$router.push('/previous-path');
        },
    },
});
</script>
