<!-- <template>
    <div v-if="isVisible" class="modal fade show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Exporter le Fichier</h5>
                    <button type="button" class="close" @click="closeForm" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="submitUpdateForm">
                        <div>
                            <p>Voulez-vous vraiment exporter ce fichier ?</p>
                        </div>
                        <div v-if="ficheId">
                            <p>ID du fichier récupéré : {{ ficheId }}</p>
                        </div>
                        <div v-if="uploadError" class="alert alert-danger">
                            Erreur lors du téléchargement du fichier : {{ uploadError }}
                        </div>
                        <div class="form-buttons d-flex justify-content-between mt-4">
                            <button class="btn btn-secondary" @click="closeForm">Annuler</button>
                            <button type="submit" class="btn btn-primary">Télécharger</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    /* Fond sombre semi-transparent */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    /* Assure que le modal est au-dessus de tout autre contenu */
}

.modal-content {
    background: #fff;
    /* Fond blanc pour le modal */
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    padding: 20px;
    max-width: 600px;
    width: 100%;
}
</style>


<script>
import { mapActions } from 'vuex';
import { useToast } from 'vue-toastification';

export default {
    props: {
        isVisible: Boolean,
        selectedFicheSuiviAnnuel: Object,
    },
    data() {
        return {
            ficheId: null,
            uploadError: null
        };
    },
    methods: {
        ...mapActions('ficheSuiviAnnuels', ['updateExcelFile']),

        async submitUpdateForm() {
            const toast = useToast();
            try {
                const ficheId = this.selectedFicheSuiviAnnuel.idFicheSuiviAnnuel;
                if (!ficheId) {
                    throw new Error('Aucun ID de fiche de suivi annuel trouvé.');
                }
                await this.updateExcelFile({ ficheId: ficheId });
                toast.success('Fiche de suivi annuelle téléchargée avec succès');
                this.$emit('close');
            } catch (error) {
                console.error("Erreur lors du téléchargement de la fiche de suivi annuelle:", error);
                toast.error('Erreur lors du téléchargement de la fiche de suivi annuelle');
                this.uploadError = error.message;
            }
        },

        closeForm() {
            this.$emit('close');
        }
    }
};
</script> -->
