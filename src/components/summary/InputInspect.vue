<template>

  <div
    :class="cn('flex items-center rounded-lg underline decoration-dashed text-nowrap text-xs font-light', clazz ?? '')">
    <!-- Word count -->

    <div title=" click the right eye button to View&Change">{{ t('input_length') }}:
      <span v-if="selectLength > maxLength" class="text-red-500" :title="`>${showNum(maxLength)}`">
        {{ showNum(selectLength) }}
      </span>
      <span v-else>
        {{ showNum(selectLength) }}
      </span>
    </div>

    <Button variant="ghost" size="sm-icon" @click="isViewContent = !isViewContent">
      <ScanEyeIcon class="w-6 h-6 text-gray-500/70" />
    </Button>

    <Teleport v-if="root" :to="root">
      <div v-if="isViewContent"
        class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  text-wrap border rounded p-2 bg-secondary    ">

        <!-- view header -->
        <div class="flex items-center gap-2 text-sm mb-2">
          <ExtIcon />
          <h1 class="font-bold text-xl"> Input Content View</h1>
          <span class="rounded border px-2 py-1 font-mono text-[11px]">
            Source: {{ webpagContent.extractMethod ?? 'unknown' }}
          </span>

          <!-- slide bar -->
          <div class="relative flex flex-col font-xs border p-2 pr-5 bg-white">
            <Slider v-model="sliderValue" :min="0" :max="length" :step="1" class="w-32" />
            <div class="relative h-4 w-full">
              <div :style="{ left: sliderPercent(sliderValue[0]) + '%' }" class="absolute">
                {{ showNum(sliderValue[0]) }}
              </div>
              <div :style="{ left: sliderPercent(sliderValue[1]) + '%' }" class="absolute">
                {{ showNum(sliderValue[1]) }}
              </div>
            </div>
          </div>

          <span class="border p-1 rounded">
            <span class="font-semibold">Content Length: </span>
            <span class="text-green-700">
              input:{{ showNum(selectLength) }}/
            </span>
            <span class="">
              total:{{ showNum(length) }}/
            </span>
            <span class="text-red-500">
              max(limit):{{ showNum(maxContentLength) }}
            </span>
          </span>


          <span class="grow" />


          <Button @click="isViewContent = false" variant="github" size="icon">
            <Minimize2Icon @click="" />
          </Button>


        </div>

        <!-- view content -->
        <div class="relative max-w-[66vw] max-h-[66vh]  overflow-y-auto">
          <span class="">{{ webpagContent.textContent?.substring(0, sliderValue[0]) }}</span>
          <span class="text-green-500 underline">{{ webpagContent.textContent?.substring(sliderValue[0], sliderValue[1])
          }}</span>
          <span class="">{{ webpagContent.textContent?.substring(sliderValue[1]) }}</span>
        </div>
      </div>
    </Teleport>


  </div>
</template>

<script setup lang="ts">
import { getSummaryInputExceedBehaviour } from "@/src/composables/general-config";
import { contentLengthExceededStrategys } from "@/src/presets/strategy";
import { InputContentLengthExceededStrategy, WebpageContent } from "@/src/types/summary";
import { cn } from "@/src/utils/shadcn";
import { computed, ref, watch } from "vue";
import type { HTMLAttributes } from 'vue';
import { Slider } from "../ui/slider";
import { Minimize2Icon, ScanEyeIcon } from "lucide-vue-next";
import ExtIcon from "../common/ExtIcon.vue";
import Button from "../ui/button/Button.vue";
import { t } from "@/src/utils/extension";
import { getShadowRootAsync } from "@/src/utils/document";

defineOptions({
  inheritAttrs: false
})
const { webpagContent, maxContentLength, class: clazz } = defineProps<{
  webpagContent: WebpageContent,
  maxContentLength?: number,
  class?: HTMLAttributes['class']
}>()
const root = ref<ShadowRoot | null>(null)

getShadowRootAsync().then(r => root.value = r)


const length = computed(() => webpagContent.textContent?.length ?? 0)
const maxLength = computed(() => maxContentLength ?? length.value)
const isViewContent = ref(false)

const contentTrimmerFunction = defineModel<{ trim: (s: string) => string, range: [number, number] }>('content-trimmer')
const exceedBehaviour = ref<InputContentLengthExceededStrategy>()

const sliderValue = ref<[number, number]>([0, length.value])
const selectLength = computed(() => sliderValue.value[1] - sliderValue.value[0])
const behaviourFunction = computed(() => {
  if (exceedBehaviour.value) {
    return contentLengthExceededStrategys[exceedBehaviour.value]['exec']
  }
  return contentLengthExceededStrategys['nothing']['exec']
})

function normalizeRange(range: readonly number[]) {
  const safeLength = Math.max(length.value, 0)
  const rawStart = Number.isFinite(range[0]) ? Math.round(range[0]) : 0
  const rawEnd = Number.isFinite(range[1]) ? Math.round(range[1]) : safeLength
  const start = Math.min(Math.max(0, rawStart), safeLength)
  const end = Math.min(Math.max(0, rawEnd), safeLength)

  return start <= end ? [start, end] as [number, number] : [end, start] as [number, number]
}

function isSameRange(left: readonly number[], right: readonly number[]) {
  return left[0] === right[0] && left[1] === right[1]
}

function syncSliderRange() {
  const { start, end } = behaviourFunction.value(length.value, maxLength.value)
  sliderValue.value = normalizeRange([start, end])
}

watch([length, maxLength, exceedBehaviour], () => {
  syncSliderRange()
})

watch(sliderValue, (range) => {
  const normalizedRange = normalizeRange(range)
  if (!isSameRange(range, normalizedRange)) {
    sliderValue.value = normalizedRange
    return
  }

  if (!contentTrimmerFunction.value) {
    return
  }

  contentTrimmerFunction.value.trim = (content: string) => {
    return content.slice(normalizedRange[0], normalizedRange[1])
  }
  contentTrimmerFunction.value.range = normalizedRange
}, { immediate: true, deep: true })

getSummaryInputExceedBehaviour().then(v => {
  exceedBehaviour.value = v
  syncSliderRange()
})


function showNum(num?: number) {

  if (!num || num < 1000) {
    return num
  } else {
    return Math.floor(num / 1000) + 'K'
  }
}

function sliderPercent(value: number) {
  const safeLength = Math.max(length.value, 1)
  return value / safeLength * 100
}




</script>