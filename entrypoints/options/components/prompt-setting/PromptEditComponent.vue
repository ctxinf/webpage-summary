<!-- the component to modify prompt config item fields, child of PromptCreate.vue,PromptEdit.vue -->
<script setup lang="ts">
import AutoResizeTextarea from "@/src/components/custom-ui/AutoResizeTextarea.vue";
import Button from "@/src/components/ui/button/Button.vue";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/src/components/ui/collapsible";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { toast } from "@/src/components/ui/toast";
import { usePromptConfigStorage, usePromptDefaultPreset, usePromptPreset } from "@/src/composables/prompt";
import { PromptConfigItem } from "@/src/types/config/prompt";
import { t } from "@/src/utils/extension";
import { toTypedSchema } from "@vee-validate/zod";
import { ChevronsDown, ChevronsUp } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { z } from "zod";
const { isNameExist } = usePromptConfigStorage();
const isCollapseOpen = ref(true);
const defaultPrompt = usePromptDefaultPreset();

const { item, presetKey } = defineProps<{
  item?: PromptConfigItem;
  isDisable?: boolean;
  presetKey?: string;
}>();
const emits = defineEmits<{
  submit: [string, string, string];
}>();

const promptPreset = presetKey ? usePromptPreset(presetKey) : defaultPrompt;

const formSchema = toTypedSchema(
  z.object({
    name: z
      .string()
      .trim()
      .min(1)
      .refine(
        async (name) => {
          return !(await isNameExist(name, item?.id));
        },
        { message: "Name already exists" }
      ),
    systemMessage: z.string().trim().min(1),
    userMessage: z.string().trim().min(1),
  })
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: item?.name ?? "My prompt",
    systemMessage: item?.systemMessage ?? promptPreset.systemMessage,
    userMessage: item?.userMessage ?? promptPreset.userMessage,
  },
});

const onSubmit = handleSubmit(
  async (values) => {
    emits("submit", values.name, values.systemMessage, values.userMessage);
  },
  ({ errors }) => {
    const firstError = Object.values(errors).find((error): error is string => Boolean(error));

    toast({
      variant: "warning",
      title: "Validation failed",
      description: firstError ?? "Please fix the highlighted fields before submitting.",
    });
  }
);

const templatVariables = [
  { key: "currentModel", description: "selected model for this run, formatted as config-name [provider/model]" },
  { key: "summaryLanguage", description: "language of output summary" },
  { key: "articleUrl", description: "url of page" },
  { key: "textContent", description: "main content of page" },
  { key: "inputTextLength", description: "length of the actual page content sent to the model" },
  { key: "readabilityTextLength", description: "length extracted by @mozilla/readability, regardless of current extract method" },
  { key: "extractMethod", description: "current extract method used for textContent" },
  { key: "currentSelection", description: "current selection" },
];
</script>
<template>
  <div class="flex flex-col my-4 space-y-4 items-stretch">
    <!-- template variables -->
    <Collapsible v-model:open="isCollapseOpen">
      <CollapsibleContent class="shadow-lime-500 shadow rounded-lg p-2 w-fit self-start bg-gradient-to-r from-lime-100 to-blue-200 text-black">
        <h1 class="font-semibold">{{ t("Template_Variables") }}</h1>
        <hr class="border-t-black" />
        <div class="grid grid-cols-[auto,1fr] mt-2 space-y-2 items-baseline">
          <template v-for="variable in templatVariables" :key="variable.key">
            <span class="font-mono">&#123;&#123;{{ variable.key }}&#125;&#125; </span>
            <span class="ml-4 text-sm text-gray-800">{{ variable.description }}</span>
          </template>
        </div>
      </CollapsibleContent>
      <CollapsibleTrigger class="text-blue-500 hover:text-blue-700 transition-colors duration-200">
        <div v-if="isCollapseOpen" class="flex items-center space-x-2 cursor-pointer">
          <ChevronsUp class="w-4 h-4" />
          <div class="font-semibold">{{ t("Hide_Template_Variables") }}</div>
        </div>

        <div v-else class="flex items-center space-x-2 cursor-pointer">
          <ChevronsDown class="w-4 h-4" />
          <div class="font-semibold">{{ t("Show_Template_Variables") }}</div>
        </div>
      </CollapsibleTrigger>
    </Collapsible>

    <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input type="text" placeholder="my prompt 1" v-bind="componentField" :disabled="isDisable" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="systemMessage">
        <FormItem>
          <FormLabel>System Message</FormLabel>
          <FormControl>
            <AutoResizeTextarea type="text" placeholder="system message" class="text-lg" spellcheck="false" v-bind="componentField" />
          </FormControl>

          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="userMessage">
        <FormItem>
          <FormLabel>User Message</FormLabel>
          <FormControl>
            <AutoResizeTextarea type="text" placeholder="user message" class="text-lg" spellcheck="false" v-bind="componentField" />
          </FormControl>

          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit">
        {{ t("Submit") }}
      </Button>
    </form>
  </div>
</template>
<style lang="postcss" scoped></style>
