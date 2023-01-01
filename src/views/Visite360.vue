<template>
    <div class="visite-360-container">
        <!-- Sélecteur de mode -->
        <div class="mode-selector mb-3">
            <button @click="mode = 'standard'" :class="{ active: mode === 'standard' }" class="btn btn-sm">
                <i class="bi bi-display"></i> Standard
            </button>
            <button @click="mode = 'vr'" :class="{ active: mode === 'vr' }" class="btn btn-sm">
                <i class="bi bi-badge-vr"></i> Mode VR
            </button>
        </div>

        <!-- Iframe responsive -->
        <div class="ratio ratio-16x9">
            <iframe :src="currentUrl" allowfullscreen allow="xr-spatial-tracking; gyroscope; accelerometer"
                @load="onVisiteLoad">
            </iframe>
        </div>

        <!-- Contrôles -->
        <div class="controls mt-3">
            <button @click="toggleFullscreen" class="btn btn-primary">
                <i class="bi bi-arrows-fullscreen"></i>
                Plein écran
            </button>

            <button v-if="vrSupported" @click="launchVR" class="btn btn-success">
                <i class="bi bi-badge-vr"></i>
                Lancer en VR
            </button>
        </div>

        <!-- Minimap (optionnel) -->
        <div v-if="hotspots.length" class="hotspots-list mt-3">
            <h6>Points d'intérêt</h6>
            <div v-for="(hotspot, index) in hotspots" :key="index" @click="goToHotspot(hotspot)" class="hotspot-item">
                <i class="bi bi-geo-alt-fill"></i>
                {{ hotspot.nom }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        urlEmbed: String,
        bienId: Number
    },

    data() {
        return {
            mode: 'standard',
            vrSupported: false,
            hotspots: []
        }
    },

    computed: {
        currentUrl() {
            let url = this.urlEmbed;
            if (this.mode === 'vr') {
                url += '&vr=1';
            }
            return url;
        }
    },

    mounted() {
        this.checkVRSupport();
        this.loadHotspots();
        this.incrementView();
    },

    methods: {
        checkVRSupport() {
            if ('xr' in navigator) {
                navigator.xr.isSessionSupported('immersive-vr').then(supported => {
                    this.vrSupported = supported;
                });
            }
        },

        async incrementView() {
            try {
                await this.$store.dispatch('visite360/incrementVue', this.bienId);
            } catch (error) {
                console.error('Erreur incrémentation vue:', error);
            }
        },

        toggleFullscreen() {
            const iframe = this.$el.querySelector('iframe');
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
            }
        },

        launchVR() {
            // Basculer vers le mode VR du viewer
            this.mode = 'vr';
            this.toggleFullscreen();
        },

        async loadHotspots() {
            // Charger depuis l'API
            try {
                const response = await this.$store.dispatch(
                    'visite360/getHotspots',
                    this.bienId
                );
                this.hotspots = response;
            } catch (error) {
                console.error('Erreur chargement hotspots:', error);
            }
        },

        goToHotspot(hotspot) {
            // Envoyer message à l'iframe si API disponible
            const iframe = this.$el.querySelector('iframe');
            iframe.contentWindow.postMessage({
                action: 'goToHotspot',
                data: hotspot
            }, '*');
        },

        onVisiteLoad() {
            // Visite chargée
            this.$emit('loaded');
        }
    }
}
</script>

<style scoped>
.visite-360-container {
    position: relative;
}

.mode-selector {
    display: flex;
    gap: 10px;
}

.mode-selector .btn {
    flex: 1;
    transition: all 0.3s ease;
}

.mode-selector .btn.active {
    background: var(--bs-primary);
    color: white;
}

.controls {
    display: flex;
    gap: 10px;
}

.hotspots-list {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
}

.hotspot-item {
    padding: 10px;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.2s;
}

.hotspot-item:hover {
    background: white;
}
</style>