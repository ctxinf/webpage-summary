<template>
  <template v-if="true">
    <DraggableContainer
      class="border w-[var(--webpage-summary-panel-width)] bg-[--webpage-summary-panel-background] rounded-t-xl rounded-b-xl shadow-2xl">
      <template #header>
        <SummaryHeader v-model:current-model="currentModel" v-model:current-prompt="currentPrompt" class="rounded-t-xl"
          :token-usage="tokenUsage">
          <template #before-icon-buttons>
            <Button v-if="closeOrHide === 'close'" @click="$emit('closePanel')" variant="github" size="sm-icon"
              title="close this panel" class="p-0 text-foreground/80">
              <XIcon />
            </Button>
          </template>
          <template #left-buttons>
            <StatusButton :status="status" @view-failed-reason="viewFailedReason" @refresh="refreshSummary"
              @stop="stop" />
          </template>
          <template #right-buttons>
            <Button v-if="closeOrHide === 'hide' && enbaleCreateNewPanelButton" @click="$emit('createNewPanel')"
              variant="github" size="sm-icon" title="create new panel" class="p-0 text-foreground/50">
              <CopyPlusIcon />
            </Button>
            <!-- minimize button -->
            <Button v-if="closeOrHide === 'hide'" @click="$emit('minimizePanel')" variant="github" size="sm-icon"
              title="minimize" class="p-0 text-foreground/50">
              <Minimize2Icon />
            </Button>
          </template>
        </SummaryHeader>
      </template>

      <template #default>
        <SummaryDialog class="mt-[-1px] min-h-16 overflow-y-auto max-h-[--webpage-summary-panel-dialog-max-height]"
          style="overflow-anchor: auto" ref="summaryDialog">
          <template #top-right-buttons>
            <div class="flex items-center gap-1 rounded-md border bg-background/80 p-1" :title="t('Extract_method')">
              <Button v-for="option in extractMethodOptions" :key="option.value" variant="ghost" size="sm"
                class="h-7 px-2 text-xs"
                :class="pageTextExtractMethod === option.value ? 'bg-secondary text-foreground shadow-sm' : 'text-muted-foreground'"
                @click="pageTextExtractMethod = option.value">
                {{ option.label }}
              </Button>
            </div>

            <!-- length view&manage -->
            <InputInspect v-if="webpageContent && currentModel && textContentTrimmer"
              :content-trimmer="textContentTrimmer" :webpag-content="webpageContent"
              :max-content-length="currentModel?.maxContentLength"
              class="ml-2" />

            <!-- token usage -->
            <div v-if="enableTokenUsageView && tokenUsage.inputToken"
              class="flex items-center gap-1 border rounded p-1 bg-gray-200" title="Token Usage">
              <TokenUsageItem :usage="tokenUsage" />
            </div>

            <div class="grow" />
            <!-- grow for pushing 👆 to left -->

            <!-- reset/clear button -->
            <Button variant="github" size="sm-icon"
              v-if="uiMessages.filter((m) => !m.hide).length > 0 && status !== 'running'" title="Clear all" class=""
              @click="resetMessages">
              <img :src="clearAll" />
            </Button>
          </template>

          <!-- markdown render messages  -->
          <div class="flex flex-col gap-4">
            <template v-for="(msg, index) in uiMessages" :key="index">
              <MessageItem v-if="!msg.hide" :message="msg" />
            </template>
            <div id="dialog-bottom-anchor"></div>
          </div>
        </SummaryDialog>

        <div class="w-full h-fit relative">
          <div class="absolute top-[0.25em] right-0 flex flex-row gap-1">
            <!-- enable ChaptInputBox  buttons -->
            <Button v-show="!expandChatInputBox && enableChatInputBox"
              @click="() => (expandChatInputBox = !expandChatInputBox)" variant="github" size="icon"
              class="p-1 rounded-none text-neutral-400 text-primary/50" title="continue chat">
              <MessageCirclePlusIcon />
            </Button>
          </div>

          <div class="absolute bottom-[-1em] left-[50%] flex flex-row gap-1">
            <!-- hide  buttons -->
            <Button v-show="expandChatInputBox && enableChatInputBox"
              @click="() => (expandChatInputBox = !expandChatInputBox)" variant="github" size="icon"
              class="h-4 rounded-none text-gray-500">
              <ChevronUpIcon />
            </Button>
          </div>

          <ChatInputBox v-show="expandChatInputBox && enableChatInputBox" @submit="submitUserInput" ref="chatInputBox"
            :disabled="status !== 'ready'" class="rounded-b-xl border-t" />
        </div>
      </template>
    </DraggableContainer>
  </template>
</template>

<script setup lang="ts">
import StatusButton from "@/src/components/summary/StatusButton.vue";
import SummaryHeader from "@/src/components/summary/SummaryHeader.vue";
import { useEnableChatInputBox, useEnableCreateNewPanelButton, useEnableTokenUsageView } from "@/src/composables/general-config";
import { useSummary } from "@/src/composables/useSummary";
import useWxtStorage from "@/src/composables/useWxtStorage";
import { EXPAND_CHAT_INPUT_BOX } from "@/src/constants/storage-key";
import type { PageTextExtractMethod } from "@/src/types/summary";
import { scrollToId } from "@/src/utils/document";
import { t } from "@/src/utils/extension";
import EventEmitter from "eventemitter3";
import { ChevronUpIcon, CopyPlusIcon, MessageCirclePlusIcon, Minimize2Icon, XIcon } from "lucide-vue-next";
import { onMounted, provide, ref, useTemplateRef } from "vue";
import clearAll from "~/assets/svg/clear-all.svg";
import DraggableContainer from "../container/DraggableContainer.vue";
import ChatInputBox from "../summary/ChatInputBox.vue";
import MessageItem from "../summary/MessageItem.vue";
import SummaryDialog from "../summary/SummaryDialog.vue";
import Button from "../ui/button/Button.vue";
import { toast } from "../ui/toast";
import InputInspect from "./InputInspect.vue";
import TokenUsageItem from "./TokenUsageItem.vue";

const chatInputText = ref("");
const { closeOrHide = "hide" } = defineProps<{
  closeOrHide?: "close" | "hide"; //hide: first panel. close: panel created manually
}>();
const emit = defineEmits<{
  minimizePanel: [];
  closePanel: [];
  createNewPanel: [];
}>();

const {
  chat,
  stop,
  error,
  status,
  currentModel,
  currentPrompt,
  uiMessages,
  refreshSummary,
  onPrepareDone,
  onChunk,
  pageTextExtractMethod,
  textContentTrimmer,
  tokenUsage,
  copyMessages,
  resetMessages,
  webpageContent,
} = useSummary();
const { enableTokenUsageView } = useEnableTokenUsageView();

const { enbaleCreateNewPanelButton } = useEnableCreateNewPanelButton();
const { enableChatInputBox } = useEnableChatInputBox();
const { state: expandChatInputBox } = useWxtStorage(EXPAND_CHAT_INPUT_BOX, false);
// const{state:expandChatInputBox}=
const summaryDialog = useTemplateRef<InstanceType<typeof SummaryDialog>>("summaryDialog");
const chatInputBox = useTemplateRef<InstanceType<typeof ChatInputBox>>("chatInputBox");
const extractMethodOptions: { value: PageTextExtractMethod; label: string }[] = [
  { value: "readability", label: t("Extract_method_readability") },
  { value: "dom-heuristic", label: t("Extract_method_dom_heuristic") },
];

/*provide funcs to SummaryDialog.vue */
provide("copy-func", copyMessages);
provide("scroll-bottom", () => scrollToId("dialog-bottom-anchor"));

const event = new EventEmitter();
/*expose funcs */
defineExpose({
  status: () => status.value,
  refreshSummary,
  submitUserInput,
  addContentToChatDialog,
  on: (name: string, fn: Parameters<typeof event.on>[1]) => event.on(name, fn),
});

onPrepareDone(() => {
  if (!currentModel.value) {
    toast({ variant: "destructive", description: "no model configed, please create a model config first!", open: true, duration: 10000 });
  }
  if (!currentPrompt.value) {
    toast({ variant: "destructive", description: "no prompt configed, please create a prompt config first!", open: true, duration: 10000 });
  }
  event.emit("onPrepareDone");
});
// onChunk(() => {
//   scrollToId('dialog-bottom-anchor')
// })

async function submitUserInput(content: string, onSuc: () => void) {
  //if summary is not executed, start the summary for the first time
  if (!content && status.value === "ready" && uiMessages.value.filter((m) => !m.hide).length === 0) {
    refreshSummary();
    return;
  }
  if (!content || status.value !== "ready") return;
  chat(content, "user");
  scrollToId("dialog-bottom-anchor");
  onSuc();
}

async function addContentToChatDialog(content: string) {
  chatInputBox.value?.appendContent(content);
  chatInputBox.value?.appendContent(" ");
}

async function viewFailedReason() {
  toast({ title: "ERROR", description: error.value, variant: "destructive" });
}

onMounted(() => { });
</script>

<style scoped></style>
