<!-- prompt config entry page  -->
<script setup lang="ts">
import { useOptionTitle } from '@/src/composables/extension';
import { t } from '@/src/utils/extension';
useOptionTitle(t('Models'))
</script>
<template>
  <h1 class="my-4 pl-0 text-3xl font-bold">{{ t('Models') }}</h1>

  <RouterView />
</template>