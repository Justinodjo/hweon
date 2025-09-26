<template>
  <router-view :key="$route.path" />
  <el-dialog v-model="isVisible" width="80%" top="5vh" center @update:model-value="handleDialogUpdate" draggable
    :fullscreen="false" :close-on-click-modal="false" :modal-class="'custom-fade'" destroy-on-close>
    <component :is="modalComponent" v-bind="modalProps" />
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
export default {

  mounted() {
    import('@/assets/vendor/tiny-slider/tiny-slider.js');
    import('@/assets/vendor/glightbox/js/glightbox.js');
    // import ("bootstrap/dist/js/bootstrap.bundle.min.js");
    import('@/assets/js/functions.js');

  },
  computed: {
    ...mapGetters("modal", ["isVisible", "modalComponent", "modalProps"])
  },
  methods: {
    handleDialogUpdate(val) {
      if (val) {
        // Si on veut réouvrir manuellement
        this.$store.dispatch("modal/openModal", {
          component: this.modalComponent,
          props: this.modalProps,
        });
      } else {
        // Fermeture demandée par Element Plus
        this.$store.dispatch("modal/closeModal");
      }
    }
  },
}
</script>
<style>
.custom-fade {
  animation: fadeIn 0.3s ease, fadeOut 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }

  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
</style>