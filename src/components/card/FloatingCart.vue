<template>
    <div class="floating-cart" :style="{ top: position.y + 'px', left: position.x + 'px' }" @mousedown="startDrag">

        <!-- Bouton flottant panier -->
        <div class="">
            <span class="badge rounded-pill bg-danger"
                :style="{ position: 'absolute', top: '-10px', left: '-1px', zIndex: 1051 }">
                {{ selectedRooms.length }}
            </span>
            <button class="btn btn-primary position-relative" data-bs-toggle="offcanvas" data-bs-target="#cartDrawer">
                🛒 Panier

            </button>

        </div>

        <!-- Offcanvas Panier -->
        <div class="offcanvas offcanvas-end" tabindex="-1" id="cartDrawer">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title">Mon Panier</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
            </div>
            <div class="offcanvas-body">
                <div v-if="selectedRooms.length === 0">
                    <p>Votre panier est vide.</p>
                </div>
                <div v-else>
                    <div v-for="room in selectedRooms" :key="room.id"
                        class="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
                        <span>{{ room.nomdetails || "Chambre" }}</span>
                        <span>{{ formatCurrency(room.prix || 0) }}</span>
                        <button class="btn btn-sm btn-danger" @click="removeRoom(room)">
                            ❌
                        </button>
                    </div>
                </div>
            </div>
            <div class="p-3 border-top">
                <h6>Total: {{ formatCurrency(totalPrice) }}</h6>
                <button class="btn btn-success w-100 mt-2" @click="createContract" data-bs-toggle="modal"
                    data-bs-target="#contractModal" :disabled="loading || selectedRooms.length === 0">
                    {{ loading ? 'Création...' : 'Passer au contrat' }}
                </button>
            </div>
        </div>
    </div>
    <!-- Modal Contrat -->
    <div v-show="isLoggedIn" class="modal fade" id="contractModal" tabindex="-1" aria-labelledby="contractModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <ContractForm :selectedRooms="selectedRooms" :totalPrice="totalPrice"
                        @contract-created="onContractCreated" />
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import ContractForm from '@/components/modal/ContractForm.vue'
import { ref, onMounted, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useLoading } from "vue-loading-overlay";
export default {
    name: "FloatingCart",
    components: { ContractForm },
    // props: {
    //     selectedRooms: {
    //         type: Array,
    //         default: () => [],
    //     },
    // },
    data() {
        return {
            position: { x: window.innerWidth - 100, y: window.innerHeight - 100 }, // position initiale
            dragging: false,
            dragOffset: { x: 0, y: 0 },
            loading: false,
            success: false,
            error: "",
        };
    },
    emits: ['removeRoom'],
    computed: {
        selectedRooms() {
            // Ici tu combines biens et détails si tu veux les afficher tous
            return [
                ...this.$store.state.contrats.selectedBiens,
                ...this.$store.state.contrats.selectedDetails
            ];
        },
        totalPrice() {
            return this.selectedRooms.reduce(
                (total, room) => total + (room.prix || 0),
                0
            );
        },

        isLoggedIn() {
            return this.$store.getters['auth/isAuthenticated'];
        }
    },
    methods: {
        checkout() {
            alert("Paiement non encore implémenté !");
        },
        async ajouterAuPanier(bien) {
            await this.$store.dispatch("contrats/addToCart", bien);
            this.$message.success("Bien ajouté au panier !");
        },

        startDrag(e) {
            this.dragging = true;
            this.dragOffset.x = e.clientX - this.position.x;
            this.dragOffset.y = e.clientY - this.position.y;

            window.addEventListener("mousemove", this.onDrag);
            window.addEventListener("mouseup", this.stopDrag);
        },
        onContractCreated() {
            this.$store.commit("contrats/CLEAR_CART");
            this.$message.success("Contrat créé avec succès !");
            if (!this.isLoggedIn) {
                const redirect = (this.$route && this.$route.fullPath) ? this.$route.fullPath : '/';
                this.$router.push({ path: '/login', query: { redirect } });
                return;
            }
            // Fermer la modal Bootstrap (si utilisé)
            const modalEl = document.getElementById("contractModal");
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) modalInstance.hide();
        },
        onDrag(e) {
            if (!this.dragging) return;
            this.position.x = e.clientX - this.dragOffset.x;
            this.position.y = e.clientY - this.dragOffset.y;

            // limiter dans la fenêtre
            this.position.x = Math.max(0, Math.min(this.position.x, window.innerWidth - 100));
            this.position.y = Math.max(0, Math.min(this.position.y, window.innerHeight - 50));
        },
        stopDrag() {
            this.dragging = false;
            window.removeEventListener("mousemove", this.onDrag);
            window.removeEventListener("mouseup", this.stopDrag);
        },
        removeRoom(room) {
            if (this.$store.state.contrats.selectedBiens.find(b => b.id === room.id)) {
                this.$store.dispatch("contrats/removeFromCart", { id: room.id, type: "bien" });
            } else {
                this.$store.dispatch("contrats/removeFromCart", { id: room.id, type: "detail" });
            }
        },
        formatCurrency(value) {
            if (!value) return '—';
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0,
            }).format(value);
        },
    },
};
</script>

<style scoped>
.floating-cart {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 280px;
    z-index: 1050;
    border-radius: 10px;
    cursor: grab;
}

.floating-cart:active {
    cursor: grabbing;
}
</style>
