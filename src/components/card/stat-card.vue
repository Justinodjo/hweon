<script setup>
// eslint-disable-next-line no-undef
defineProps(["title", "value"])
import { Icon } from "@iconify/vue";

</script>

<template>
    <div class="card_content rounded p-3 m-2">
        <div class="pe-3">
          <h6 class="my-0">{{title}}</h6>
          <small>Données disponibles</small>
          <h2 class="fw-bolder text-dark mb-0">{{value}}</h2>
        </div>
        <h1 class="text-success display-4">
          <Icon icon="bi-broadcast" />
        </h1>
      </div>
</template>

<style>

.card_content {
  box-shadow: 0 7px 25px rgba(0, 0, 0, 0.08);
  border: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
}
</style>
