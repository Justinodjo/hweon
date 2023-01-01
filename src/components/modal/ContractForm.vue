<template>
    <div v-if="isLoggedIn" class="contract-form-container">
        <!-- Header avec progression -->
        <div class="form-header">
            <h3 class="form-title">Initialisation du Contrat</h3>
            <div class="progress-steps">
                <div v-for="(step, index) in steps" :key="index" class="step"
                    :class="{ active: currentStep === index, completed: currentStep > index }">
                    <div class="step-number">
                        <span v-if="currentStep > index">✓</span>
                        <span v-else>{{ index + 1 }}</span>
                    </div>
                    <span class="step-label">{{ step }}</span>
                </div>
            </div>
        </div>

        <!-- Formulaire avec transition -->
        <form @submit.prevent="handleSubmit" class="contract-form">
            <transition name="slide-fade" mode="out-in">
                <!-- Étape 1: Type de contrat -->
                <div v-if="currentStep === 0" key="step1" class="form-step">
                    <div class="form-group">
                        <label class="form-label required">Type de Contrat</label>
                        <div class="contract-types-grid">
                            <div v-for="(type, index) in contractTypes"
                                :key="type.id ?? type.value ?? type.code ?? index" class="contract-type-card"
                                :class="{ selected: formData.typeContrat === (type.value ?? type.id ?? type.code) }"
                                @click="formData.typeContrat = (type.value ?? type.id ?? type.code)">
                                <span class="type-icon">{{ type.icon || type.iconName || '🏷️' }}</span>
                                <h4>{{ type.label || type.name || type.value || '—' }}</h4>
                                <p>{{ type.description || type.desc || '' }}</p>
                            </div>
                        </div>
                        <span v-if="errors.typeContrat" class="error-message">{{ errors.typeContrat }}</span>
                    </div>
                </div>

                <!-- Étape 2: Dates et loyer -->
                <div v-else-if="currentStep === 1" key="step2" class="form-step">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="form-label required">Date de début</label>
                                <div class="input-with-icon">
                                    <span class="input-icon">📅</span>
                                    <input type="date" v-model="formData.dateDebut" class="form-control"
                                        :class="{ 'is-invalid': errors.dateDebut }" :min="today" />
                                </div>
                                <span v-if="errors.dateDebut" class="error-message">{{ errors.dateDebut }}</span>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="form-label required">Date de fin</label>
                                <div class="input-with-icon">
                                    <span class="input-icon">📅</span>
                                    <input type="date" v-model="formData.dateFin" class="form-control"
                                        :class="{ 'is-invalid': errors.dateFin }" :min="formData.dateDebut || today" />
                                </div>
                                <span v-if="errors.dateFin" class="error-message">{{ errors.dateFin }}</span>
                            </div>
                        </div>
                    </div>
                    <!-- ✅ NOUVEAU: Composant d'alerte de validation -->
                    <ValidationAlert :checking="validationState.checking" :checked="validationState.checked"
                        :errors="validationState.errors" :warnings="validationState.warnings"
                        :biensStatus="biensStatusList" :showDetails="true" @retry="validateDisponibilite" />
                    <!-- ✅ NOUVEAU: Liste des biens sélectionnés avec indicateur -->
                    <div v-if="selectedRooms.length > 0" class="selected-items-summary">
                        <h6 class="summary-subtitle">Biens sélectionnés ({{ selectedRooms.length }})</h6>
                        <div class="selected-items-grid">
                            <div v-for="room in selectedRooms" :key="room.id" class="selected-item-card"
                                :class="getItemValidationClass(room)">
                                <div class="item-header">
                                    <span class="item-name">{{ room.nomdetails || room.nom }}</span>
                                    <span class="item-status">
                                        <i v-if="isItemValidating(room)" class="bi bi-hourglass-split spin"></i>
                                        <i v-else-if="isItemAvailable(room)"
                                            class="bi bi-check-circle-fill text-success"></i>
                                        <i v-else-if="isItemUnavailable(room)"
                                            class="bi bi-x-circle-fill text-danger"></i>
                                    </span>
                                </div>
                                <div class="item-footer">
                                    <span class="item-price">{{ formatCurrency(room.prix) }}</span>
                                    <button type="button" @click="removeFromSelection(room)" class="btn-remove">
                                        <i class="bi bi-x"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div class="form-group">
                        <label class="form-label required">Loyer Mensuel</label>
                        <div class="input-with-icon">
                            <span class="input-icon">💰</span>
                            <input type="text" :value="formatCurrency(formData.loyerMensuel)" class="form-control"
                                :class="{ 'is-invalid': errors.loyerMensuel }" readonly />

                            <span class="input-suffix">XOF</span>
                        </div>
                        <span v-if="errors.loyerMensuel" class="error-message">{{ errors.loyerMensuel }}</span>
                    </div>
                    <div class="info-card">
                        <span class="info-icon">ℹ️</span>
                        <div>
                            Le loyer mensuel est automatiquement calculé selon le ou les biens sélectionnés.
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Avance payée (optionnel)</label>
                        <div class="input-with-icon">
                            <span class="input-icon">💵</span>
                            <input type="number" v-model.number="formData.avance" class="form-control"
                                placeholder="Ex: 150000" />
                            <span class="input-suffix">XOF</span>
                        </div>
                    </div>

                    <div class="info-card" v-if="contractDuration">
                        <span class="info-icon">ℹ️</span>
                        <div>
                            <strong>Durée du contrat :</strong> {{ contractDuration }}
                            <br>
                            <strong>Total estimé :</strong> {{ formatCurrency(estimatedTotal) }}
                        </div>
                    </div>
                </div>

                <!-- Étape 3: Documents -->
                <div v-else-if="currentStep === 2" key="step3" class="form-step">
                    <h4>Documents du contrat</h4>

                    <div class="form-group" v-for="(doc, index) in formData.documents" :key="index">
                        <label class="form-label">{{ doc.label }}</label>
                        <input type="file" @change="handleFileUpload($event, index)" class="form-control" />
                        <small class="text-muted">Type : {{ doc.typeDocument }}</small>
                    </div>

                    <button type="button" class="btn btn-secondary mt-3" @click="addDocumentField">
                        + Ajouter un document
                    </button>
                </div>

                <!-- Étape 3: Récapitulatif -->
                <div v-else-if="currentStep === 3" key="step4" class="form-step">
                    <div class="summary-card">
                        <h4 class="summary-title">Récapitulatif du Contrat</h4>

                        <div class="summary-section">
                            <h5>Biens sélectionnés</h5>
                            <div class="summary-items">
                                <div v-for="room in selectedRooms" :key="room.id" class="summary-item">
                                    <span class="item-name">{{ room.nomdetails || room.nom || "Bien" }}</span>
                                    <span class="item-price">{{ formatCurrency(room.prix) }}</span>
                                </div>
                            </div>
                            <div class="summary-total">
                                <strong>Total biens :</strong>
                                <strong>{{ formatCurrency(totalPrice) }}</strong>
                            </div>
                        </div>

                        <div class="summary-section">
                            <h5>Détails du contrat</h5>
                            <div class="summary-details">
                                <div class="detail-row">
                                    <span>Type de contrat :</span>
                                    <strong>{{ getContractTypeLabel(formData.typeContrat) }}</strong>
                                </div>
                                <div class="detail-row">
                                    <span>Date de début :</span>
                                    <strong>{{ formatDate(formData.dateDebut) }}</strong>
                                </div>
                                <div class="detail-row">
                                    <span>Date de fin :</span>
                                    <strong>{{ formatDate(formData.dateFin) }}</strong>
                                </div>
                                <div class="detail-row">
                                    <span>Durée :</span>
                                    <strong>{{ contractDuration }}</strong>
                                </div>
                                <div class="detail-row">
                                    <span>Loyer mensuel :</span>
                                    <strong>{{ formatCurrency(formData.loyerMensuel) }}</strong>
                                </div>
                            </div>
                        </div>
                        <div class="detail-row">
                            <span>Avance payée :</span>
                            <strong>{{ formatCurrency(formData.avance || 0) }}</strong>
                        </div>
                        <div class="detail-row total-final">
                            <span>Montant restant dû :</span>
                            <strong>{{ formatCurrency(totalPrice + estimatedTotal - (formData.avance || 0)) }}</strong>
                        </div>

                        <div class="summary-section grand-total">
                            <div class="detail-row">
                                <span>Prix total des biens :</span>
                                <strong>{{ formatCurrency(totalPrice) }}</strong>
                            </div>
                            <div class="detail-row">
                                <span>Total loyers estimés :</span>
                                <strong>{{ formatCurrency(estimatedTotal) }}</strong>
                            </div>
                            <div class="detail-row total-final">
                                <span>TOTAL GÉNÉRAL :</span>
                                <strong>{{ formatCurrency(totalPrice + estimatedTotal) }}</strong>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" v-model="acceptTerms" />
                            <span>J'accepte les termes et conditions du contrat</span>
                        </label>
                        <span v-if="errors.acceptTerms" class="error-message">{{ errors.acceptTerms }}</span>
                    </div>
                </div>
            </transition>

            <!-- Boutons de navigation -->
            <div class="form-actions">
                <button v-if="currentStep > 0" type="button" class="btn btn-secondary" @click="previousStep">
                    ← Précédent
                </button>

                <button v-if="currentStep < steps.length - 1" type="button" class="btn btn-primary" @click="nextStep">
                    Suivant →
                </button>

                <button v-else type="submit" class="btn btn-success" :disabled="loading || !acceptTerms">
                    <span v-if="loading">
                        <span class="spinner"></span> Création en cours...
                    </span>
                    <span v-else>✓ Créer le contrat</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import { sendMessage } from "@/helpers/websocketService";
import { showSuccess } from "@/helpers/notify";
import ValidationAlert from '@/components/modal/ValidationAlert.vue'

export default {
    name: "ContractForm",
    props: {
        selectedRooms: {
            type: Array,
            default: () => []
        },
        totalPrice: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            currentStep: 0,
            steps: ["Type de contrat", "Dates & Loyer", "Documents", "Validation"],
            formData: {
                typeContrat: "",
                dateDebut: "",
                dateFin: "",
                loyerMensuel: null,
                status: "ACTIF",
                validationStatus: "EN_ATTENTE",
                documents: [
                    { label: "Pièce d'identité", typeDocument: "IDENTITE", fichier: null },
                    { label: "Justificatif de revenus", typeDocument: "REVENU", fichier: null }
                ]
            },
            acceptTerms: false,
            errors: {},
            loading: false,
            // ✅ NOUVEAU: État de validation
            validationState: {
                checking: false,
                checked: false,
                errors: [],
                warnings: []
            },

            // ✅ NOUVEAU: Disponibilité des biens
            biensDisponibilite: new Map(),

            // ✅ NOUVEAU: Timer pour debounce
            validationDebounce: null,
            biensStatusList: [],
            itemsValidation: new Map()

        };
    },
    components: {
        ValidationAlert
    },
    mounted() {
        this.loadTypeContrat();

    },
    computed: {
        today() {
            return new Date().toISOString().split('T')[0];
        },
        userId() {
            const user = this.$store.getters['auth/userInfo'];
            if (!user) return null;
            return user && typeof user === 'object' && user.id ? user.id : null;
        },
        contractDuration() {
            if (!this.formData.dateDebut || !this.formData.dateFin) return null;

            const start = new Date(this.formData.dateDebut);
            const end = new Date(this.formData.dateFin);
            const months =
                (end.getFullYear() - start.getFullYear()) * 12 +
                (end.getMonth() - start.getMonth());

            if (months < 1) return "Moins d'un mois";
            if (months === 1) return "1 mois";
            if (months < 12) return `${months} mois`;

            const years = Math.floor(months / 12);
            const remainingMonths = months % 12;

            if (remainingMonths === 0) return `${years} an${years > 1 ? 's' : ''}`;
            return `${years} an${years > 1 ? 's' : ''} et ${remainingMonths} mois`;
        },
        estimatedTotal() {
            if (!this.formData.loyerMensuel || !this.formData.dateDebut || !this.formData.dateFin) {
                return 0;
            }

            const start = new Date(this.formData.dateDebut);
            const end = new Date(this.formData.dateFin);

            const months =
                (end.getFullYear() - start.getFullYear()) * 12 +
                (end.getMonth() - start.getMonth());

            const totalMonths = Math.max(1, months);

            return this.formData.loyerMensuel * totalMonths;
        },

        isLoggedIn() {
            return this.$store.getters['auth/isAuthenticated'];
        },
        contractTypes() {
            // les enums sont commités dans state.all par le module types
            return this.$store.state.types.typeContrat || [];
        },


    },
    watch: {
        'formData.dateDebut': 'debouncedValidation',
        'formData.dateFin': 'debouncedValidation',
        'selectedRooms': {
            handler: 'debouncedValidation',
            deep: true
        },
        'formData.typeContrat'(newType) {
            // Déterminer la dateDebut
            if (!this.formData.dateDebut) {
                const today = new Date();
                this.formData.dateDebut = today.toISOString().split('T')[0];

                // Si aucune date choisie, dateFin = dateDebut + 10 jours
                const endDate = new Date(today);
                endDate.setDate(endDate.getDate() + 10);
                this.formData.dateFin = endDate.toISOString().split('T')[0];
            } else {
                // Sinon calculer dateFin selon type de contrat
                let durationMonths = 12; // par défaut 1 an
                if (newType === 'SAISONNIERE') durationMonths = 3;
                if (newType === 'ETUDIANT') durationMonths = 9;

                const startDate = new Date(this.formData.dateDebut);
                const endDate = new Date(startDate);
                endDate.setMonth(endDate.getMonth() + durationMonths);
                this.formData.dateFin = endDate.toISOString().split('T')[0];
            }
        },
        // Recalculer dateFin si l'utilisateur modifie manuellement dateDebut
        'formData.dateDebut'(newDate) {
            if (!newDate) return;

            let durationMonths = 12;
            if (this.formData.typeContrat === 'SAISONNIERE') durationMonths = 3;
            if (this.formData.typeContrat === 'ETUDIANT') durationMonths = 9;

            const startDate = new Date(newDate);
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + durationMonths);

            this.formData.dateFin = endDate.toISOString().split('T')[0];
        },
        selectedRooms: {
            handler(newRooms = []) {
                if (newRooms.length === 1) {
                    this.formData.loyerMensuel = newRooms[0].prix;
                } else if (newRooms.length > 1) {
                    this.formData.loyerMensuel = newRooms.reduce((sum, room) => sum + Number(room.prix || 0), 0);
                } else {
                    this.formData.loyerMensuel = 0;
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        handleFileUpload(event, index) {
            const file = event.target.files[0];
            if (file) {
                this.formData.documents[index].fichier = file;
            }
        },
        addDocumentField() {
            this.formData.documents.push({
                label: "Autre document",
                typeDocument: "AUTRE",
                fichier: null
            });
        },
        async loadTypeContrat() {
            const contractTypes = await this.$store.dispatch("types/getTypeContrat");
            return contractTypes;
        },
        redirectToLogin() {
            this.$router.push({ name: 'login' }); // Adapter selon ta route login
        },
        // ✅ NOUVEAU: Validation avec debounce
        debouncedValidation() {
            clearTimeout(this.validationDebounce);
            this.validationDebounce = setTimeout(() => {
                if (this.formData.dateDebut && this.formData.dateFin) {
                    this.validateDisponibilite();
                }
            }, 500);
        },
        // ✅ NOUVEAU: Valider la disponibilité
        // ✅ MODIFIÉ: Validation avec détails par item
        async validateDisponibilite() {
            if (!this.formData.dateDebut || !this.formData.dateFin) {
                return;
            }

            if (this.selectedRooms.length === 0) {
                return;
            }

            this.validationState.checking = true;
            this.validationState.errors = [];
            this.validationState.warnings = [];
            this.biensStatusList = [];

            try {
                // Validation globale
                const biens = this.$store.state.contrats.selectedBiens.map(b => ({
                    id: b.id,
                    prix: b.prix
                }));

                const details = this.$store.state.contrats.selectedDetails.map(d => ({
                    id: d.id,
                    prix: d.prix
                }));

                const response = await this.$store.dispatch('contrats/verifierDisponibilite', {
                    biensImmobiliers: biens,
                    detailsBiensImmobiliers: details,
                    dateDebut: this.formData.dateDebut,
                    dateFin: this.formData.dateFin,
                    loyerMensuel: this.formData.loyerMensuel,
                    userId: this.userId,
                    typeContrat: this.formData.typeContrat,
                    status: this.formData.status,
                    validationStatus: this.formData.validationStatus
                });

                if (!response.disponible) {
                    this.validationState.errors.push(response.message);
                } else {
                    this.validationState.checked = true;
                }

                // Validation individuelle de chaque item
                await this.validateIndividualItems();

            } catch (error) {
                console.error('Erreur validation:', error);
                this.validationState.errors.push('Erreur lors de la vérification de disponibilité');
            } finally {
                this.validationState.checking = false;
            }
        },
        // ✅ NOUVEAU: Vérifier un bien spécifique
        async checkBienDisponibilite(bienId) {
            if (!this.formData.dateDebut || !this.formData.dateFin) {
                return null;
            }

            try {
                const response = await this.$store.dispatch('contrats/checkBienDisponibilite', {
                    bienId,
                    dateDebut: this.formData.dateDebut,
                    dateFin: this.formData.dateFin
                });

                this.biensDisponibilite.set(bienId, response);
                return response;

            } catch (error) {
                console.error('Erreur vérification bien:', error);
                return null;
            }
        },
        // ✅ NOUVEAU: Obtenir la classe de validation pour un item
        getItemValidationClass(room) {
            const key = room.type === 'bien' ? `bien_${room.id}` : `detail_${room.id}`;
            const status = this.itemsValidation.get(key);

            if (!status) return '';
            if (status.checking) return 'validating';
            if (status.disponible) return 'available';
            return 'unavailable';
        },

        // ✅ NOUVEAU: Vérifier si un item est en cours de validation
        isItemValidating(room) {
            const key = room.type === 'bien' ? `bien_${room.id}` : `detail_${room.id}`;
            const status = this.itemsValidation.get(key);
            return status && status.checking;
        },

        // ✅ NOUVEAU: Vérifier si un item est disponible
        isItemAvailable(room) {
            const key = room.type === 'bien' ? `bien_${room.id}` : `detail_${room.id}`;
            const status = this.itemsValidation.get(key);
            return status && status.checked && status.disponible;
        },

        // ✅ NOUVEAU: Vérifier si un item est indisponible
        isItemUnavailable(room) {
            const key = room.type === 'bien' ? `bien_${room.id}` : `detail_${room.id}`;
            const status = this.itemsValidation.get(key);
            return status && status.checked && !status.disponible;
        },

        // ✅ NOUVEAU: Retirer un item de la sélection
        removeFromSelection(room) {
            if (room.type === 'bien') {
                this.$store.dispatch('contrats/removeBien', room.id);
            } else {
                this.$store.dispatch('contrats/removeDetail', room.id);
            }

            // Retirer de la validation
            const key = room.type === 'bien' ? `bien_${room.id}` : `detail_${room.id}`;
            this.itemsValidation.delete(key);

            // Recalculer la validation
            this.validateDisponibilite();
        },
        // ✅ NOUVEAU: Vérifier une chambre spécifique
        async checkDetailDisponibilite(detailId) {
            if (!this.formData.dateDebut || !this.formData.dateFin) {
                return null;
            }

            try {
                const response = await this.$store.dispatch('contrats/checkDetailDisponibilite', {
                    detailId,
                    dateDebut: this.formData.dateDebut,
                    dateFin: this.formData.dateFin
                });

                this.biensDisponibilite.set(`detail_${detailId}`, response);
                return response;

            } catch (error) {
                console.error('Erreur vérification chambre:', error);
                return null;
            }
        },
        // ✅ MODIFIÉ: Validation de step avec vérification disponibilité
        async validateStep() {
            this.errors = {};

            // Validation étape 0
            if (this.currentStep === 0) {
                if (!this.formData.typeContrat) {
                    this.errors.typeContrat = "Veuillez sélectionner un type de contrat";
                    return false;
                }
            }

            // Validation étape 1 avec vérification de disponibilité
            if (this.currentStep === 1) {
                if (!this.formData.dateDebut) {
                    this.errors.dateDebut = "La date de début est requise";
                    return false;
                }

                if (!this.formData.dateFin) {
                    this.errors.dateFin = "La date de fin est requise";
                    return false;
                }

                if (new Date(this.formData.dateFin) <= new Date(this.formData.dateDebut)) {
                    this.errors.dateFin = "La date de fin doit être postérieure à la date de début";
                    return false;
                }

                // ✅ VÉRIFICATION DE DISPONIBILITÉ
                if (!this.validationState.checked || this.validationState.errors.length > 0) {
                    const loader = this.$loading.show();

                    try {
                        await this.validateDisponibilite();

                        if (this.validationState.errors.length > 0) {
                            this.$message.error('Certains biens ne sont pas disponibles pour cette période');
                            return false;
                        }
                    } finally {
                        loader.hide();
                    }
                }
            }

            // Validation étape 2 (documents)
            if (this.currentStep === 2) {
                let hasErrors = false;
                this.formData.documents.forEach((doc, i) => {
                    if (!doc.typeDocument) {
                        this.errors[`documents_${i}`] = "Type de document requis";
                        hasErrors = true;
                    }
                });

                if (hasErrors) return false;
            }

            // Validation étape 3 (récapitulatif)
            if (this.currentStep === 3) {
                if (!this.acceptTerms) {
                    this.errors.acceptTerms = "Vous devez accepter les termes et conditions";
                    return false;
                }
            }

            return true;
        },
        nextStep() {
            if (this.validateStep()) {
                this.currentStep++;
            }
        },
        previousStep() {
            this.currentStep--;
            this.errors = {};
        },
        // async createContract() {
        //     // ✅ Vérifier si l'utilisateur est connecté
        //     if (!this.$store.getters["auth/isAuthenticated"]) {
        //         this.$message.error("Vous devez être connecté pour créer un contrat.");
        //         return;
        //     }

        //     const selectedRooms = [
        //         ...this.$store.state.contrats.selectedBiens,
        //         ...this.$store.state.contrats.selectedDetails
        //     ];
        //     if (selectedRooms.length === 0) {
        //         this.$message.warning("Aucun bien sélectionné pour le contrat.");
        //         return;
        //     }

        //     this.loading = true;
        //     this.success = false;
        //     this.error = "";

        //     try {
        //         // 👉 appel vers ton store ou backend
        //         await this.$store.dispatch("contrats/createContract", {
        //             biens: this.$store.state.contrats.selectedBiens.map(b => ({ id: b.id, prix: b.prix })),
        //             details: this.$store.state.contrats.selectedDetails.map(d => ({ id: d.id, prix: d.prix })),
        //             totalPrice: this.totalPrice,
        //             userId: this.$store.state.auth.userInfo,
        //             total: this.totalPrice
        //         });

        //         this.success = true;

        //         // Optionnel : vider le panier après succès
        //         this.$store.commit("contrats/CLEAR_CART");
        //         this.$message.success("Contrat créé avec succès !");

        //     } catch (e) {
        //         console.error(e);
        //         this.error = "Erreur lors de la création du contrat.";
        //     } finally {
        //         this.loading = false;
        //     }
        // },
        // ✅ MODIFIÉ: Soumettre avec double vérification
        // ✅ NOUVEAU: Valider chaque item individuellement
        async validateIndividualItems() {
            const validationPromises = [];

            // Valider les biens
            for (const bien of this.$store.state.contrats.selectedBiens) {
                const key = `bien_${bien.id}`;
                this.itemsValidation.set(key, { checking: true });

                const promise = this.checkBienDisponibilite(bien.id)
                    .then(result => {
                        this.itemsValidation.set(key, {
                            checking: false,
                            checked: true,
                            disponible: result.disponible,
                            message: result.message
                        });

                        this.biensStatusList.push({
                            nom: bien.nom,
                            disponible: result.disponible,
                            message: result.message
                        });
                    });

                validationPromises.push(promise);
            }

            // Valider les détails
            for (const detail of this.$store.state.contrats.selectedDetails) {
                const key = `detail_${detail.id}`;
                this.itemsValidation.set(key, { checking: true });

                const promise = this.checkDetailDisponibilite(detail.id)
                    .then(result => {
                        this.itemsValidation.set(key, {
                            checking: false,
                            checked: true,
                            disponible: result.disponible,
                            message: result.message
                        });

                        this.biensStatusList.push({
                            nom: detail.nomdetails || detail.nom,
                            disponible: result.disponible,
                            message: result.message
                        });
                    });

                validationPromises.push(promise);
            }

            await Promise.all(validationPromises);
        },
        async handleSubmit() {
            if (!this.isLoggedIn) {
                this.$message.warning("Vous devez être connecté pour créer un contrat");
                return this.redirectToLogin();
            }

            // Validation finale
            if (!await this.validateStep()) {
                return;
            }

            const biens = this.$store.state.contrats.selectedBiens.map(b => ({
                id: b.id,
                prix: b.prix
            }));

            const details = this.$store.state.contrats.selectedDetails.map(d => ({
                id: d.id,
                prix: d.prix
            }));

            if (biens.length === 0 && details.length === 0) {
                this.$message.warning("Veuillez sélectionner au moins un bien ou une chambre");
                return;
            }

            this.loading = true;
            const loader = this.$loading.show();

            try {
                // ✅ DOUBLE VÉRIFICATION avant création
                const validationFinale = await this.$store.dispatch('contrats/verifierDisponibilite', {
                    biensImmobiliers: biens,
                    detailsBiensImmobiliers: details,
                    dateDebut: this.formData.dateDebut,
                    dateFin: this.formData.dateFin,
                    loyerMensuel: this.formData.loyerMensuel,
                    userId: this.userId,
                    typeContrat: this.formData.typeContrat,
                    status: this.formData.status,
                    validationStatus: this.formData.validationStatus
                });

                if (!validationFinale.disponible) {
                    this.$message.error(`Impossible de créer le contrat: ${validationFinale.message}`);
                    return;
                }

                // Construction du FormData
                const formDataToSend = new FormData();
                formDataToSend.append('typeContrat', this.formData.typeContrat);
                formDataToSend.append('dateDebut', this.formData.dateDebut);
                formDataToSend.append('dateFin', this.formData.dateFin);
                formDataToSend.append('loyerMensuel', this.formData.loyerMensuel);
                formDataToSend.append('status', this.formData.status);
                formDataToSend.append('avance', this.formData.avance || 0);
                formDataToSend.append('validationStatus', this.formData.validationStatus);
                formDataToSend.append('prixTotal', this.totalPrice + this.estimatedTotal);
                formDataToSend.append('userId', this.userId);

                biens.forEach((b, i) => {
                    formDataToSend.append(`biensImmobiliers[${i}].id`, b.id);
                    formDataToSend.append(`biensImmobiliers[${i}].prix`, b.prix);
                });

                details.forEach((d, i) => {
                    formDataToSend.append(`detailsBiensImmobiliers[${i}].id`, d.id);
                    formDataToSend.append(`detailsBiensImmobiliers[${i}].prix`, d.prix);
                });

                this.formData.documents.forEach((doc, i) => {
                    formDataToSend.append(`documents[${i}].typeDocument`, doc.typeDocument);
                    if (doc.fichier) {
                        formDataToSend.append(`documents[${i}].fichier`, doc.fichier);
                    }
                });

                // Créer le contrat
                const contrat = await this.$store.dispatch("contrats/createContract", formDataToSend);

                this.$message.success("Contrat créé avec succès !");
                // 2. Récupérer l'ID du propriétaire
                const proprietaireId = this.selectedBien.proprietaire?.id;

                if (proprietaireId) {
                    // 3. Créer la notification pour le propriétaire
                    await this.$store.dispatch('notifications/createContratNotification', {
                        contrat: contrat,
                        recipientId: proprietaireId
                    });
                }

                // 4. Afficher un message de succès
                this.$message.success('Contrat créé avec succès. Le propriétaire a été notifié.');

                // 5. Rediriger
                this.$router.push({ name: 'Reservations_location' });
                this.$store.commit("contrats/CLEAR_CART");
                this.$emit("contract-created");
                this.resetForm();

            } catch (error) {
                console.error(error);

                // Gestion des erreurs spécifiques
                if (error.response && error.response.data) {
                    const errorData = error.response.data;

                    if (errorData.code === 'BIEN_DEJA_LOUE' ||
                        errorData.code === 'DETAIL_DEJA_LOUE') {
                        this.$message.error(errorData.message);
                    } else {
                        this.$message.error("Erreur lors de la création du contrat");
                    }
                } else {
                    this.$message.error("Erreur lors de la création du contrat");
                }
            } finally {
                this.loading = false;
                loader.hide();
            }
        },

        // ✅ MODIFIÉ: Reset avec état de validation
        resetForm() {
            this.currentStep = 0;
            this.formData = {
                typeContrat: "",
                dateDebut: "",
                dateFin: "",
                avance: 0,
                loyerMensuel: null,
                status: "ACTIF",
                validationStatus: "EN_ATTENTE",
                documents: [
                    { label: "Pièce d'identité", typeDocument: "IDENTITE", fichier: null },
                    { label: "Justificatif de revenus", typeDocument: "REVENU", fichier: null }
                ]
            };
            this.acceptTerms = false;
            this.errors = {};
            this.validationState = {
                checking: false,
                checked: false,
                errors: [],
                warnings: []
            };
            this.biensDisponibilite.clear();
        },
        getContractTypeLabel(value) {
            if (!value) return "—";
            const upperValue = String(value).toUpperCase();
            const type = this.contractTypes.find(
                (t) =>
                    String(t.value).toUpperCase() === upperValue ||
                    String(t.id).toUpperCase() === upperValue ||
                    String(t.code).toUpperCase() === upperValue
            );
            return type ? type.label || type.name || value : value;
        },
        formatCurrency(value) {
            if (!value && value !== 0) return '—';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0,
            }).format(value);
        },
        formatDate(date) {
            if (!date) return '—';
            return new Date(date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
    }
};
</script>

<style scoped>
.contract-form-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.form-header {
    margin-bottom: 3rem;
}

.form-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 2rem;
    text-align: center;
}

/* Progress Steps */
.progress-steps {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: 2rem;
}

.progress-steps::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    height: 2px;
    background: #e0e0e0;
    z-index: 0;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    position: relative;
    z-index: 1;
}

.step-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #e0e0e0;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-bottom: 0.5rem;
    transition: all 0.3s ease;
}

.step.active .step-number {
    background: #007bff;
    color: white;
    box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.2);
}

.step.completed .step-number {
    background: #28a745;
    color: white;
}

.step-label {
    font-size: 0.875rem;
    color: #666;
    text-align: center;
}

.step.active .step-label {
    color: #007bff;
    font-weight: 600;
}

/* Form Step */
.form-step {
    min-height: 400px;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
}

.form-label.required::after {
    content: ' *';
    color: #dc3545;
}

/* Contract Types Grid */
.contract-types-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.contract-type-card {
    padding: 1.5rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #fafafa;
}

.contract-type-card:hover {
    border-color: #007bff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
}

.contract-type-card.selected {
    border-color: #007bff;
    background: #e7f3ff;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
}

.type-icon {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 0.5rem;
}

.contract-type-card h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    margin: 0.5rem 0 0.25rem;
}

.contract-type-card p {
    font-size: 0.8rem;
    color: #666;
    margin: 0;
}

/* Input with Icon */
.input-with-icon {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 1rem;
    font-size: 1.25rem;
    z-index: 1;
}

.input-suffix {
    position: absolute;
    right: 1rem;
    color: #666;
    font-weight: 600;
}

.form-control {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.form-control:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-control.is-invalid {
    border-color: #dc3545;
}

.error-message {
    display: block;
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

/* Info Card */
.info-card {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    background: #e7f3ff;
    border-left: 4px solid #007bff;
    border-radius: 8px;
    margin-top: 1rem;
}

.info-icon {
    font-size: 1.5rem;
}

/* Summary Card */
.summary-card {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 1.5rem;
}

.summary-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 1.5rem;
    text-align: center;
}

.summary-section {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #dee2e6;
}

.summary-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
}

.summary-section h5 {
    font-size: 1rem;
    font-weight: 600;
    color: #666;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.summary-items {
    margin-bottom: 0.75rem;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem;
    background: white;
    border-radius: 6px;
    margin-bottom: 0.5rem;
}

.item-name {
    color: #333;
    font-weight: 500;
}

.item-price {
    color: #007bff;
    font-weight: 600;
}

.summary-total {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem;
    background: #e7f3ff;
    border-radius: 6px;
    font-size: 1.05rem;
}

.summary-details {
    background: white;
    border-radius: 8px;
    padding: 1rem;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
    border-bottom: none;
}

.grand-total {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1.25rem;
    border-radius: 8px;
}

.grand-total .detail-row {
    color: white;
    border-bottom-color: rgba(255, 255, 255, 0.2);
}

.total-final {
    font-size: 1.25rem;
    padding-top: 1rem;
    margin-top: 0.5rem;
    border-top: 2px solid rgba(255, 255, 255, 0.3) !important;
}

/* Checkbox */
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.checkbox-label input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

/* Form Actions */
.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e0e0e0;
}

/* Pour que chaque bouton ait la même taille visuelle */
.form-actions .btn {
    min-width: 160px;
}

.btn {
    padding: 0.875rem 2rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-primary {
    background: #007bff;
    color: white;
}

.btn-primary:hover {
    background: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.btn-secondary {
    background: #6c757d;
    color: white;
}

.btn-secondary:hover {
    background: #545b62;
}

.btn-success {
    background: #28a745;
    color: white;
    flex: 1;
}

.btn-success:hover:not(:disabled) {
    background: #218838;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease;
}

.slide-fade-enter {
    transform: translateX(20px);
    opacity: 0;
}

.slide-fade-leave-to {
    transform: translateX(-20px);
    opacity: 0;
}

/* Responsive */
.row {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -0.5rem;
}

.col-md-6 {
    flex: 0 0 50%;
    padding: 0 0.5rem;
}

@media (max-width: 768px) {
    .contract-form-container {
        padding: 1rem;
    }

    .col-md-6 {
        flex: 0 0 100%;
    }

    .contract-types-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .progress-steps {
        flex-direction: column;
        gap: 1rem;
    }

    .progress-steps::before {
        display: none;
    }

    .form-actions {
        flex-direction: column;
        align-items: stretch;
    }

    .btn {
        width: 100%;
    }

    .form-actions .btn {
        width: 100%;
    }
}

/* Styles pour les items sélectionnés */
.selected-items-summary {
    margin-top: 1.5rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.summary-subtitle {
    font-size: 0.95rem;
    font-weight: 600;
    color: #666;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.selected-items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
}

.selected-item-card {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    transition: all 0.3s ease;
}

.selected-item-card.validating {
    border-color: #007bff;
    background: #e7f3ff;
}

.selected-item-card.available {
    border-color: #28a745;
    background: #d4edda;
}

.selected-item-card.unavailable {
    border-color: #dc3545;
    background: #ffe6e6;
}

.item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}

.item-name {
    font-weight: 600;
    color: #333;
    font-size: 0.95rem;
}

.item-status {
    font-size: 1.25rem;
}

.item-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.item-price {
    color: #007bff;
    font-weight: 600;
}

.btn-remove {
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-remove:hover {
    background: #c82333;
    transform: scale(1.1);
}

/* Animation spin */
@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.spin {
    animation: spin 1s linear infinite;
}

/* Responsive */
@media (max-width: 768px) {
    .selected-items-grid {
        grid-template-columns: 1fr;
    }
}
</style>