<script setup lang="ts">
import { Button } from "@/src/components/ui/button";
import { toast } from "@/src/components/ui/toast";
import { useOptionTitle } from "@/src/composables/extension";
import { useUserCustomStyle } from "@/src/composables/general-config";
import { filterValidCssVariableText } from "@/src/utils/document";
import { t } from "@/src/utils/extension";
import { ref } from "vue";

useOptionTitle(t('Appearance'))
const { userCustomStyle, then } = useUserCustomStyle();
const editValue = ref<string>("");

then(() => {
  editValue.value = userCustomStyle.value;
});

const references = [
  { key: "--webpage-summary-panel-width: 30em;", description: "Width of the summary panel" },
  { key: "--webpage-summary-panel-dialog-max-height: 20em;", description: "Maximum height of the summary panel dialog" },
  { key: "--webpage-summary-panel-background: #ffffff;", description: "Background color of the summary panel" },
  { key: "--webpage-summary-panel-top: 4em;", description: "Initial Top position of the summary panel" },
  { key: "--webpage-summary-panel-right: 4em;", description: "Initial Right position of the summary panel" },
  { key: "--webpage-summary-panel-bottom: unset;", description: "Initial Bottom position of the summary panel" },
  { key: "--webpage-summary-panel-left: unset;", description: "Initial Left position of the summary panel" },
  { key: "--webpage-summary-markdown-font-size: inherit;", description: "font-size base of rendered markdown" },
  { key: "--webpage-summary-markdown-line-height: inherit;", description: "line-height base of rendered markdow" },
  { key: "--webpage-summary-markdown-color: inherit;", description: "text color of rendered markdow" },
  { key: "--webpage-summary-panel-srem: 16px;", description: "base font-size of the whole extension" },
];

function submit() {
  userCustomStyle.value = filterValidCssVariableText(editValue.value);
  toast({ title: "success", description: "successfully saved" });

  //refresh page
  window.location.reload();
}
</script>
<template>
  <h1 class="text-2xl mb-4">{{ t("Appearance") }} {{ t("Setting") }}</h1>
  <div class="w-fit">
    <div class="title">{{ t("Custom_css_variables") }}</div>
    <div class="description">{{ t("Custom_css_variables_DESC") }}</div>

    <div
      class="grid grid-cols-[auto,1fr] p-2 rounded-2xl w-fit my-2 space-y-2 items-baseline bg-gradient-to-r from-lime-100 to-blue-200">
      <h2 class="col-span-2 border-b">Reference</h2>
      <template v-for="variable in references" :key="variable.key">
        <span class="font-mono">{{ variable.key }} </span>
        <span class="ml-4 text-sm text-gray-800 select-none">/* {{ variable.description }} */</span>
      </template>
    </div>

    <textarea v-model="editValue" class="border h-64 px-2 w-full resize font-mono"
      :placeholder="t('Custom_css_variables_INPUT_PLACEHOLDER')" />
    <br />
    <Button @click="submit">{{ t("Submit") }}</Button>
  </div>
</template>

<style lang="postcss" scoped>
.title {
  @apply text-lg;
}

.description {
  @apply italic text-base font-light;
}
</style>
