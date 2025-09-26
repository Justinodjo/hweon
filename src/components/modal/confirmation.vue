<script>
import { ref } from "vue";
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    verbose: {
      type: String,
      default: "Voulez-vous continuer ?",
    },
    acceptText: {
      type: String,
      default: "Oui",
    },
    rejectText: {
      type: String,
      default: "Non",
    },
  },
  emits: ["update:open", "update:confirm"],
  setup() {
    const choice = ref(null);
    return {
      choice,
    };
  },
};
</script>

<template>
  <!--  eslint-disable -->
  <el-dialog
    :modelValue="open"
    title=""
    :destroy-on-close="true"
    @close="$emit('update:open', false)"
  >
    <div class="text-center mb-3">
      {{ verbose }}
    </div>
    <div class="text-center">
      <el-button type="danger" size="large" @click="$emit('update:open', false)">{{ rejectText }}</el-button>
      <el-button type="primary" size="large" class="primary border-0" @click="$emit('update:open', false)">{{ acceptText }}</el-button>
    </div>
  </el-dialog>
</template>

<style scoped>
button.primary {
  background: #2997bf;
}
</style>
