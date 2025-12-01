<script lang="ts" setup>
import { RouterView } from 'vue-router';
import Toaster from '@/src/components/ui/toast/Toaster.vue'
import { useOptionTitle } from '@/src/composables/extension';
useOptionTitle()
</script>

<template>
  <RouterView />
  <Toaster />
</template>

<style scoped></style>
