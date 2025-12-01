<script setup lang="ts">
import { t } from "@/src/utils/extension";
import { computed, onMounted, ref, toRaw } from "vue";
import type {
  SiteCumstomizationItem,
  WhiteList,
  BlackList,
} from "@/src/types/config/site-rules";
import Button from "@/src/components/ui/button/Button.vue";
import { storage } from "#imports";
import {
  BLACKLIST,
  SITE_CUSTOMIZATION,
  WHITELIST,
} from "@/src/constants/storage-key";
import { DefaultConfig } from "@/src/constants/default-config";
import Switch from "@/src/components/ui/switch/Switch.vue";
import { ChevronDown, Plus, Minus } from "lucide-vue-next";
import { toast } from "@/src/components/ui/toast";
import HoverTextBadget from "@/src/components/common/HoverTextBadget.vue";
import { useOptionTitle } from "@/src/composables/extension";

const whitelist = ref<WhiteList>(DefaultConfig.WHITELIST);
const blacklist = ref<BlackList>(DefaultConfig.BLACKLIST);
const siteCustomization = ref<SiteCumstomizationItem[]>(
  DefaultConfig.SITE_CUSTOMIZATION
);

useOptionTitle(t('Site_Customization'))
onMounted(async () => {
  whitelist.value =
    (await storage.getItem(WHITELIST)) || DefaultConfig.WHITELIST;
  blacklist.value =
    (await storage.getItem(BLACKLIST)) || DefaultConfig.BLACKLIST;
  siteCustomization.value =
    (await storage.getItem(SITE_CUSTOMIZATION)) ||
    DefaultConfig.SITE_CUSTOMIZATION;
});

// computed properties to convert between array and string for textareas
const whitelistPatterns = computed({
  get: () => whitelist.value.patterns.join("\n"),
  set: (value) => {
    whitelist.value.patterns = value.split("\n").filter((p) => p.trim() !== "");
  },
});

const blacklistPatterns = computed({
  get: () => blacklist.value.patterns.join("\n"),
  set: (value) => {
    blacklist.value.patterns = value.split("\n").filter((p) => p.trim() !== "");
  },
});

// functions to manage site customization items
function addSiteCustomization() {
  siteCustomization.value.push({
    enable: true,
    pattern: "",
    selectors: [],
  });
}

function removeSiteCustomization(index: number) {
  siteCustomization.value.splice(index, 1);
}

function siteCustomizationSelectors(item: SiteCumstomizationItem) {
  return computed({
    get: () => item.selectors.join("\n"),
    set: (value) => {
      item.selectors = value.split("\n").filter((p) => p.trim() !== "");
    },
  });
}

function updateWhitelistEnable(value: boolean) {
  whitelist.value.enable = value;
  if (value) {
    blacklist.value.enable = false;
  }
}

function updateBlacklistEnable(value: boolean) {
  blacklist.value.enable = value;
  if (value) {
    whitelist.value.enable = false;
  }
}

// handle submit
async function handleSubmit() {
  console.log("whitelist.value", toRaw(whitelist.value));
  await storage.setItem(WHITELIST, toRaw(whitelist.value));
  await storage.setItem(BLACKLIST, toRaw(blacklist.value));
  await storage.setItem(SITE_CUSTOMIZATION, toRaw(siteCustomization.value));
  toast({ title: t("Saved") });
}

const examples = [
  { key: "example.com", description: "example.com" },
  { key: "*.example.com", description: "a.example.com, b.example.com" },
  {
    key: "**.example.com",
    description: "a.example.com, b.example.com, a.b.example.com",
  },
  {
    key: "example.com/articles/*",
    description: "example.com/articles/1, example.com/articles/2",
  },
];
</script>
<template>
  <div class="relative p-1">
    <div class="pb-24">
      <h1 class="my-4 pl-0 text-3xl font-bold">
        {{ t("Site_Customization") }}
      </h1>

      <div
        class="grid grid-cols-[auto,1fr] p-2 rounded-2xl my-2 space-y-2 items-baseline bg-gradient-to-r from-lime-100 to-blue-200">
        <h2 class="col-span-2 border-b">
          {{ t("Site_Custom_Patterns_Example") }}
        </h2>
        <template v-for="variable in examples" :key="variable.key">
          <span class="font-mono">{{ variable.key }} </span>
          <span class="ml-4 text-sm text-gray-800 select-none">
            {{ variable.description }}
          </span>
        </template>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <!-- Whitelist Section -->
        <details open class="details-card">
          <summary class="summary-style">
            <div class="flex items-center gap-3">
              <Switch :checked="whitelist.enable" @update:checked="updateWhitelistEnable" @click.stop />
              <span class="font-semibold">{{ t("Whitelist") }}</span>
            </div>
            <ChevronDown class="summary-chevron" />
          </summary>
          <div class="p-4 pt-2">
            <label>
              {{ t("Site_Custom_Whitelist_Description") }}
            </label>
            <label class="block text-sm font-medium text-gray-600 mb-2">
              <!-- TODO Pa -->
              {{ t("Site_Custom_Patterns") }} ({{
                t("Site_Custom_one_per_line")
              }})
            </label>

            <textarea v-model="whitelistPatterns" rows="10" class="textarea-style"
              :placeholder="'e.g. \nwww.reddit.com\nwww.reddit.com/r/**/comments/**\n*.news.com\n**.quora.com'"></textarea>
          </div>
        </details>

        <!-- Blacklist Section -->
        <details open class="details-card">
          <summary class="summary-style">
            <div class="flex items-center gap-3">
              <Switch :checked="blacklist.enable" @update:checked="updateBlacklistEnable" @click.stop />
              <span class="font-semibold">{{ t("Blacklist") }}</span>
            </div>
            <ChevronDown class="summary-chevron" />
          </summary>
          <div class="p-4 pt-2">
            <label>
              {{ t("Site_Custom_Blacklist_Description") }}
            </label>

            <label class="block text-sm font-medium text-gray-600 mb-2">{{ t("Site_Custom_Patterns") }} ({{
              t("Site_Custom_one_per_line")
            }})</label>
            <textarea v-model="blacklistPatterns" rows="10" class="textarea-style"
              :placeholder="'e.g. \n www.bing.com\n*.visa.com\n**.google.com'"></textarea>
          </div>
        </details>
      </div>

      <!-- Site Customization Section -->
      <details open class="details-card mt-6">
        <summary class="summary-style">
          <!-- //TODO:所有的summary改为h2 markdown二级标题样式 -->
          <h2 class="font-semibold flex items-center gap-1">
            {{ t("Site_Customization") }}
            <HoverTextBadget class="text-nowrap" :title="'?'" :description="t('Site_Custom_Description')" />
          </h2>

          <div class="flex items-center gap-2">
            <button @click.prevent="addSiteCustomization" class="add-button">
              <Plus class="w-4 h-4" />
            </button>
            <ChevronDown class="summary-chevron" />
          </div>
        </summary>

        <div class="p-4 pt-2 space-y-4">
          <div v-for="(item, index) in siteCustomization" :key="index">
            <details class="details-card-inner">
              <summary class="summary-style-inner">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <Switch :checked="item.enable" @update:checked="item.enable = $event" @click.stop />
                  <p class="font-medium truncate" :class="{ 'text-gray-400': !item.pattern }">
                    <!-- TODO: 改为标题3 -->

                    {{ item.pattern || t("Site_Custom_New_Rule") }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <button @click.prevent="removeSiteCustomization(index)" class="remove-button">
                    <Minus class="w-4 h-4" />
                  </button>
                  <ChevronDown class="summary-chevron" />
                </div>
              </summary>
              <div class="p-4 pt-2 grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-2">
                    {{ t("Site_Custom_Match_Pattern") }}
                  </label>

                  <input type="text" v-model="item.pattern" class="input-style" placeholder="e.g. www.reddit.com" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-2">{{ t("Site_Custom_Selectors") }} ({{
                    t("Site_Custom_one_per_line")
                  }})
                  </label>
                  <textarea v-model="siteCustomizationSelectors(item).value" rows="5" class="textarea-style"
                    :placeholder="'e.g. \n.text-neutral-content\n#comment-tree'"></textarea>
                </div>
              </div>
            </details>
          </div>
        </div>
      </details>
    </div>

    <!-- Sticky Footer -->
    <div class="sticky bottom-6">
      <Button @click="handleSubmit" class="shadow-lg">
        {{ t("Submit") }}
      </Button>
    </div>
  </div>
</template>
<style lang="postcss" scoped>
.details-card {
  @apply bg-white border border-gray-200 rounded-lg overflow-hidden;
}

.details-card-inner {
  @apply bg-gray-50 border border-gray-200 rounded-md overflow-hidden;
}

.summary-style {
  @apply flex justify-between items-center p-4 cursor-pointer list-none;
}

.summary-style-inner {
  @apply flex justify-between items-center p-3 cursor-pointer list-none;
}

.summary-chevron {
  @apply w-5 h-5 text-gray-500 transition-transform duration-200;
}

details[open]>summary .summary-chevron {
  @apply rotate-180;
}

.textarea-style {
  @apply mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2;
}

.input-style {
  @apply mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2;
}

.add-button {
  @apply p-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
}

.remove-button {
  @apply p-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500;
}
</style>
