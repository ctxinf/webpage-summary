<script setup lang="ts">
import { Button } from '@/src/components/ui/button';
import { toast } from '@/src/components/ui/toast';
import { useExtInfo, useOptionTitle } from '@/src/composables/extension';
import { MODEL_CONFIG_KEY } from '@/src/constants/storage-key';
import { ModelConfigItem } from '@/src/types/config/model';
import { t } from '@/src/utils/extension';
import { sleep } from 'radash';
import { ref, useTemplateRef } from 'vue';
import { browser } from 'wxt/browser';
import { z } from 'zod';
useOptionTitle(t('Export_Import'))
const compatibilityVersion = 20250224
type ExportDataStructure = {
  name: 'webpage-summary',  //fixed string
  version: string,
  compatibilityVersion: number,
  exportDate: string,
  data: any
}


//verify fields
const importSchema = z.object({
  name: z.literal('webpage-summary'),
  version: z.string(),
  compatibilityVersion: z.literal(compatibilityVersion),
  exportDate: z.string(),
  data: z.record(z.string(), z.any()),
});

const { name, version } = useExtInfo()
const isLoading = ref(false)
const isExportWithApiKeys = ref(false)
const viewData = ref<any>()
const fileInput = useTemplateRef('fileInput')

/**
 * import config
 */


async function importConfigWrapper() {
  const file = fileInput.value?.files?.[0]
  if (!file) {
    alert("please select a file first.")
    return
  }
  // if (import.meta.env.FIREFOX) {

  // }
  importConfig(async () => {
    return await file.text()
  })

  //temporally not use showOpenFilePicker
  // const chromeInput = async () => {
  //   const importPickerOpts = {
  //     types: [
  //       {
  //         description: "JSON",
  //         accept: {
  //           "application/json": [".json"],
  //         },
  //       },
  //     ],
  //     'id': 'webpage-summary',
  //     startIn: 'downloads',
  //     excludeAcceptAllOption: true,
  //     multiple: false,
  //   };
  //   //@ts-ignore
  //   const [fileHandle] = await window.showOpenFilePicker(importPickerOpts);
  //   const file = await fileHandle.getFile();
  // }
}
async function importConfig(fileTextGetter: () => Promise<string>) {
  isLoading.value = true
  await sleep(100) //waiting for loading spin anim

  try {
    const contents = await fileTextGetter();
    const parsedData = importSchema.safeParse(JSON.parse(contents));

    if (!parsedData.success) {
      alertAndToast({ title: 'Import File Parse Failed', description: 'Invalid configuration file, error:' + parsedData.error, variant: 'destructive' });
      isLoading.value = false;

      return
    } else {
      const { data } = parsedData.data;
      await browser.storage.local.set(data)

    }

    // Process the imported data as needed
  } catch (e: any) {
    isLoading.value = false;

    if (e.name === 'AbortError') {
      toast({ title: 'Canceled' });
      return
    }
    console.error('import config failed: ', e)
    alertAndToast({ title: 'Import Error', description: 'Error:' + e, variant: 'destructive' });
    return
  }
  alertAndToast({ title: 'success', description: 'successfully imported!', variant: 'success' })

  isLoading.value = false;
}

/**
 * export
 */
async function exportConfig() {
  const items = await browser.storage.local.get(null);

  /* delete apiKey field */
  if (items && !isExportWithApiKeys.value) {
    const key = MODEL_CONFIG_KEY.replace('local:', '')
    items[key] = (items[key] as ModelConfigItem[])?.map(item => {
      const { apiKey, ...other } = item
      return { ...other }
    })
  }
  isLoading.value = true
  const data: ExportDataStructure = {
    name: 'webpage-summary',
    version: version,
    compatibilityVersion: compatibilityVersion,
    exportDate: new Date().toLocaleString(),
    data: items
  }

  exportJson(name + '-configs-export-' + version + '' + '.json', data)
  isLoading.value = false

  alertAndToast({ title: 'success', description: 'successfully saved', variant: 'success' })
}



function exportJson(filename: string, jsonData: any) {
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename; // 设置下载的文件名
  a.click();
  URL.revokeObjectURL(url); // 释放 URL 对象
}
async function handleFileSelect(event: any) {
  const file = event.target.files[0] as File
  if (file) {
    viewData.value = JSON.parse(await file.text())
  }
}

function alertAndToast(...args: Parameters<typeof toast>) {
  alert(args[0].title)
  toast(...args)
}
</script>
<template>
  <h1 class="text-2xl mb-4">{{ t('Export_Import') }}</h1>
  <p>{{ t('Export_Import_Desc') }}</p>
  <div v-if="!isLoading" class="flex flex-col gap-8 mt-4">
    <div>
      <h2>{{ t('Export') }}</h2>
      <label class="block">
        <input type="checkbox" v-model="isExportWithApiKeys">
        {{ t('Export_if_with_apiKeys') }}
        <span v-if="isExportWithApiKeys" class="text-red-500">{{ t('Export_if_with_apiKeys_Alert') }}</span>
      </label>
      <Button @click="exportConfig" class="mr-4">{{ t('Export') }}</Button>
    </div>


    <div class="flex flex-col gap-2 items-start">
      <h2>{{ t('Import') }}</h2>
      <input type="file" class="" ref="fileInput" accept=".json" @change="handleFileSelect" />
      <span class="text-red-500">{{ t('Import_Alert') }}</span>

      <Button @click="importConfigWrapper" :class="{ 'animate-bounce': !!viewData }">{{ t('Import') }}</Button>
      <!-- view area -->
      <div v-if="viewData" class="border-t grid grid-cols-[auto,1fr] gap-2">
        <h2 class="col-span-2">View before exec import</h2>
        <p class="col-span-2">export date: {{ viewData.exportDate }}</p>
        <template v-for="(value, key) in viewData.data">
          <div class="p-1 rounded border border-gray-500">{{ key }}</div>

          <pre v-if="typeof value !== `object`"> {{ value }}</pre>
          <details v-else>
            <pre>{{ value }}</pre>
          </details>

        </template>

      </div>

    </div>
  </div>
  <div v-else class="size-8 rounded-full border-4 mt-2 border-green-500 border-t-transparent animate-spin">

  </div>
</template>

<style lang="postcss" scoped>
h2 {
  @apply text-lg font-bold mb-2;
}
</style>
