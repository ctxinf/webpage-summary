<script setup lang="ts">
import { useOptionTitle } from "@/src/composables/extension";
import { usePageTextExtractMethod, useSummaryInputExceedBehaviour } from "@/src/composables/general-config";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { contentLengthExceededStrategys } from "@/src/presets/strategy";
import type { PageTextExtractMethod } from "@/src/types/summary";
import { t } from "@/src/utils/extension";
import { CircleCheckBigIcon } from "lucide-vue-next";
import { RouterLink } from "vue-router";
import DefaultSettingValue from "../components/DefaultSettingValue.vue";
const { summaryInputExceedBehaviour } = useSummaryInputExceedBehaviour();
const { pageTextExtractMethod } = usePageTextExtractMethod();

const extractMethodOptions: { value: PageTextExtractMethod, label: string, description: string }[] = [
  {
    value: 'readability',
    label: t('Extract_method_readability'),
    description: t('Extract_method_readability_DESC'),
  },
  {
    value: 'dom-heuristic',
    label: t('Extract_method_dom_heuristic'),
    description: t('Extract_method_dom_heuristic_DESC'),
  },
]

useOptionTitle(t("Extract_method"))
</script>
<template>
  <h1 class="text-2xl mb-2">{{ t("Page_Extraction") }}</h1>
  <p class="description">
    extract text content from webpage as input of summary
  </p>

  <div class="mb-4" />

  <div class="mr-auto flex flex-col gap-8 items-stretch">
    <!-- description -->
    <p class="border-l-8 border-l-blue-400 italic pl-2 p-1 bg-neutral-500/10">
      Two <span class="font-bold">general</span> extract methods are available now.
      <br />
      <span class="font-bold">@mozilla/readability</span> remains the default for classic article pages.
      <br />
      <span class="font-bold">DOM heuristic</span> keeps visible text from semantic containers and often preserves
      documentation callouts or notes that Readability may skip.
      <br />

      Or you can
      <RouterLink to="/site-customization" class="text-green-600 underline font-bold">customize
      </RouterLink>
      special site using selectors

      <br />
      Site customization selectors always take priority over the general extract method.
    </p>

    <div class="line mt-[-2em]">
      <div>
        <div class="title">{{ t("Extract_method") }}</div>
        <p class="description">how to get text content from .html file</p>
      </div>
      <div class="w-[28rem] max-w-full">
        <RadioGroup v-model="pageTextExtractMethod" class="gap-3">
          <label v-for="option in extractMethodOptions" :key="option.value"
            class="flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors"
            :class="pageTextExtractMethod === option.value ? 'border-sky-500 bg-sky-50/70' : 'border-border hover:border-sky-300'">
            <RadioGroupItem :value="option.value" class="mt-1" />
            <div>
              <div class="font-semibold">{{ option.label }}</div>
              <p class="description not-italic text-sm text-foreground/80">{{ option.description }}</p>
            </div>
          </label>
        </RadioGroup>
        <DefaultSettingValue value="readability" class="mt-2 w-fit" />
      </div>
    </div>

    <div class="line border rounded-xl p-2">
      <div>
        <div class="title">{{ t("Length_exceeding_behaviour") }}</div>
        <p class="description">
          what to do when webpage content length exceeds the maxContentLength of
          model's config
        </p>
        <p class="description text-amber-600">
          feel free to set, you can also adjust context window on the spot when
          bad response received.
        </p>

        <Tabs v-model="summaryInputExceedBehaviour">
          <TabsList class="gap-4 p-4 bg-gray-300 items-stretch">
            <TabsTrigger value="cut-preserve-front" class="border">
              <img src="../../../assets/svg/cut-preserve-front-intro.svg" />
            </TabsTrigger>

            <TabsTrigger value="cut-preserve-end" class="border">
              <img src="../../../assets/svg/cut-preserve-end-intro.svg" />
            </TabsTrigger>

            <TabsTrigger value="cut-preserve-middle" class="border">
              <img src="../../../assets/svg/cut-preserve-middle-intro.svg" class="" />
            </TabsTrigger>

            <TabsTrigger value="nothing" class="border"> Nothing </TabsTrigger>
          </TabsList>
        </Tabs>

        <div class="my-4 flex items-center gap-2 text-nowrap">
          <CircleCheckBigIcon class="text-green-500" />

          <div
            class="border rounded p-1 w-48 hover:cursor-pointer active:outline-1 select-none shadow font-mono font-bold">
            {{
              contentLengthExceededStrategys[summaryInputExceedBehaviour]?.name
            }}
          </div>
          <div>
            {{
              t(
                (summaryInputExceedBehaviour.replaceAll("-", "_") +
                  "_DESC") as any
              )
            }}
          </div>
        </div>
        <DefaultSettingValue value="cut-preserve-front" class="w-fit" />
      </div>
    </div>
  </div>
</template>
<style lang="postcss" scoped>
.title {
  @apply text-lg;
}

.description {
  @apply italic text-base font-light;
}

.line {
  @apply flex justify-between items-center gap-8 border-b border-b-transparent hover:border-b-border;
}

.setting {
  @apply flex flex-col items-end gap-0.5;
}
</style>
