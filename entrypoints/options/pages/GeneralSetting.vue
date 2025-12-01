<script setup lang="ts">
import Input from '@/src/components/ui/input/Input.vue';
import Switch from '@/src/components/ui/switch/Switch.vue';
import { useEnableAutoBeginSummary, useEnableAutoBeginSummaryByActionOrContextTrigger, useEnableCreateNewPanelButton, useEnableFloatingBall, useEnablePopupClickTrigger, useEnableSummaryWindowDefault, useEnableTokenUsageView, useEnableUserChatDefault, useSummaryInputExceedBehaviour, useSummaryLanguage, useUserCustomStyle, useEnableChatInputBox } from '@/src/composables/general-config';
import { DefaultConfig } from '@/src/constants/default-config';
import DefaultSettingValue from '../components/DefaultSettingValue.vue';
import { t } from '@/src/utils/extension';
import { useTitle } from '@vueuse/core';
import { useOptionTitle } from '@/src/composables/extension';

const { summaryLanguage } = useSummaryLanguage()
const { enableAutoBeginSummary } = useEnableAutoBeginSummary()
const { enableSummaryWindowDefault } = useEnableSummaryWindowDefault()
const { enableFloatingBall } = useEnableFloatingBall()
const { enablePopupClickTrigger } = useEnablePopupClickTrigger()
const { enableTokenUsageView } = useEnableTokenUsageView()
// const { enableUserChatDefault } = useEnableUserChatDefault()
const { enableAutoBeginSummaryByActionOrContextTrigger } = useEnableAutoBeginSummaryByActionOrContextTrigger()
const { enbaleCreateNewPanelButton } = useEnableCreateNewPanelButton()
const { enableChatInputBox } = useEnableChatInputBox()

useOptionTitle(t('General'))
</script>
<template>
  <h1 class="text-2xl mb-4">{{ t('General') }} {{ t('Setting') }}</h1>
  <div class="mr-auto flex flex-col gap-8 items-stretch">
    <!-- SAMPLE -->
    <!-- <div class="line">
      <div>
        <div class="title">CONFIG ITEM</div>
        <div class="description">DESCRIPTION</div>
      </div>
      <div>
        <div class="w-6 h-6 bg-red-100"></div>
      </div>
    </div>


    <div class="line">
      <div>
        <div class="title">CONFIG ITEM 2</div>
        <div class="description">DESCRIPTION 123456789000000000000000000000</div>
      </div>
      <div>
        <div class="w-16 h-6 bg-red-100"></div>
      </div>
    </div> -->

    <div class="line">
      <div>
        <div class="title">{{ t('Language_Of_Summary') }} </div>
        <div class="description">select the language of the summary that you want to read</div>
      </div>
      <div class="setting">
        <Input v-model="summaryLanguage" />
        <DefaultSettingValue :value="DefaultConfig.SUMMARY_LANG" />
      </div>
    </div>

    <!-- Interaction -->
    <h2 class="font-bold text-2xl border-b ">
      {{ t('Interaction') }}
    </h2>
    <div class="line">
      <div>
        <div class="title">{{ t('Enable_floating_ball') }}</div>
        <div class="description">enable floating ball on the webpage</div>
      </div>
      <div class="setting">
        <Switch v-model:checked="enableFloatingBall" />
        <DefaultSettingValue :value="DefaultConfig.ENABLE_FLOATING_BALL" />
      </div>
    </div>


    <div class="line">
      <div>
        <div class="title">{{ t('Auto_begin_summary') }}</div>
        <div class="description">Auto begin summarizing once the summary panel is opened </div>
      </div>
      <div class="setting">
        <Switch v-model:checked="enableAutoBeginSummary" />
        <DefaultSettingValue :value="DefaultConfig.ENABLE_AUTO_BEGIN_SUMMARY" />
      </div>
    </div>

    <div class="line">
      <div>
        <div class="title">{{ t('Auto_begin_summary_by_action_or_context_trigger') }}</div>
        <div class="description">{{ t('Auto_begin_summary_by_action_or_context_trigger_DESC') }}</div>
      </div>
      <div class="setting">
        <Switch v-model:checked="enableAutoBeginSummaryByActionOrContextTrigger" />
        <DefaultSettingValue :value="DefaultConfig.ENABLE_AUTO_BEGIN_SUMMARY_BY_ACTION_OR_CONTEXT_TRIGGER" />
      </div>
    </div>

    <div class="line">
      <div>
        <div class="title">{{ t('Auto_open_summary_panel_on_new_tab') }}</div>
        <div class="description">always open summary panel when you openning a new page</div>
        <blockquote class="border-l-4 border-l-orange-500 pl-2 bg-neutral-400/20 italic">warning: this might cause you
          inconvenience </blockquote>
      </div>
      <div class="setting">
        <Switch v-model:checked="enableSummaryWindowDefault" />
        <DefaultSettingValue :value="DefaultConfig.ENABLE_SUMMARY_WINDOW_DEFAULT" />
      </div>
    </div>





    <div class="line">
      <div>
        <div class="title">{{ t('Enable_popup_click_trigger') }}</div>
        <div class="description"> change action (extension icon in the left-top of browser) clicked behaviour to opening
          the
          summary panel</div>
        <div class="description"> by default, it will open a popup panel</div>
      </div>
      <div class="setting">
        <Switch v-model:checked="enablePopupClickTrigger" />
        <DefaultSettingValue :value="DefaultConfig.ENABLE_POPUP_CLICK_TRIGGER" />
      </div>
    </div>


    <!-- <div class="line">
      <div>
        <div class="title">{{ t('Always_expand_the_chat_box') }}</div>
        <div class="description">chat box(for user to ask llm after summary with summary context) in
          the bottom of the summary panel</div>
      </div>
      <div class="setting">
        <Switch v-model:checked="enableUserChatDefault" />
        <DefaultSettingValue :value="DefaultConfig.ENABLE_USER_CHAT_DEFAULT" />
      </div>
    </div> -->

    <div class="line">
      <div>
        <div class="title">{{ t('Enbale_token_usage_view') }}</div>
        <div class="description">show token usage information in summary panel header</div>
      </div>
      <div class="setting">
        <Switch v-model:checked="enableTokenUsageView" />
        <DefaultSettingValue :value="DefaultConfig.ENABLE_TOKAN_USAGE_VIEW" />
      </div>
    </div>

    <div class="line">
      <div>
        <div class="title">{{ t('Enbale_create_new_panel_button') }}</div>
      </div>
      <div class="setting">
        <Switch v-model:checked="enbaleCreateNewPanelButton" />
        <DefaultSettingValue :value="DefaultConfig.ENABLE_CREATE_NEW_PANEL_BUTTON" />
      </div>
    </div>

    <div class="line">
      <div>
        <div class="title">{{ t('Enable_chat_input_box') }}</div>
        <div class="description">enable chat input box in the summary panel</div>
      </div>
      <div class="setting">
        <Switch v-model:checked="enableChatInputBox" />
        <DefaultSettingValue :value="DefaultConfig.ENABLE_CHAT_INPUT_BOX" />
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
