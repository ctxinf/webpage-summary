import { storage } from "#imports";
import { SPOKEN_LANG_KEY as SUMMARY_LANG_KEY, USER_CUSTOM_STYLE_KEY, ENABLE_TOKAN_USAGE_VIEW, ENABLE_AUTO_BEGIN_SUMMARY, ENABLE_SUMMARY_WINDOW_DEFAULT, SUMMARY_INPUT_EXCEED_BEHAVIOUR, PAGE_TEXT_EXTRACT_METHOD, POPUP_CLICK_TRIGGER as ENABLE_POPUP_CLICK_TRIGGER, ENABLE_FLOATING_BALL, ENABLE_AUTO_BEGIN_SUMMARY_BY_ACTION_OR_CONTEXT_TRIGGER, ENABLE_CREATE_NEW_PANEL_BUTTON, ENABLE_CHAT_INPUT_BOX, ENABLE_CONTEXT_MENU_ITEM_SUMMARIZE_THIS_PAGE, ENABLE_CONTEXT_MENU_ITEM_ADD_SELECTION_TO_CHAT, ENABLE_AUTO_BEGIN_CHAT_FOR_ADD_SELECTION_TO_CHAT } from "../constants/storage-key";
import useWxtStorage from "./useWxtStorage";
import { DefaultConfig } from "../constants/default-config";
import { InputContentLengthExceededStrategy, PageTextExtractMethod } from "../types/summary";

/**
 * get all general configs value
 * @returns 
 */
async function getAllExtConfigs() {
  const result = await storage.getItems([
    { key: SUMMARY_LANG_KEY, fallback: DefaultConfig.SUMMARY_LANG },
    { key: USER_CUSTOM_STYLE_KEY, fallback: DefaultConfig.USER_CUSTOM_STYLE },
    { key: ENABLE_TOKAN_USAGE_VIEW, fallback: DefaultConfig.ENABLE_TOKAN_USAGE_VIEW },
    { key: ENABLE_AUTO_BEGIN_SUMMARY, fallback: DefaultConfig.ENABLE_AUTO_BEGIN_SUMMARY },
    { key: ENABLE_SUMMARY_WINDOW_DEFAULT, fallback: DefaultConfig.ENABLE_SUMMARY_WINDOW_DEFAULT },
    { key: SUMMARY_INPUT_EXCEED_BEHAVIOUR, fallback: DefaultConfig.SUMMARY_INPUT_EXCEED_BEHAVIOUR },
    { key: ENABLE_AUTO_BEGIN_SUMMARY_BY_ACTION_OR_CONTEXT_TRIGGER, fallback: DefaultConfig.ENABLE_AUTO_BEGIN_SUMMARY_BY_ACTION_OR_CONTEXT_TRIGGER },
    { key: ENABLE_CHAT_INPUT_BOX, fallback: DefaultConfig.ENABLE_CHAT_INPUT_BOX },
    { key: ENABLE_AUTO_BEGIN_CHAT_FOR_ADD_SELECTION_TO_CHAT, fallback: DefaultConfig.ENABLE_AUTO_BEGIN_CHAT_FOR_ADD_SELECTION_TO_CHAT },

  ]);

  return {
    summaryLanguage: result[0].value as string ?? DefaultConfig.SUMMARY_LANG,  //.getItems(...) has bugs: setting fallback has no effect
    userCustomStyle: result[1].value as string ?? DefaultConfig.USER_CUSTOM_STYLE,
    enableTokanUsageView: result[2].value as boolean ?? DefaultConfig.ENABLE_TOKAN_USAGE_VIEW,
    enableAutoBeginSummary: result[4].value as boolean ?? DefaultConfig.ENABLE_AUTO_BEGIN_SUMMARY,
    enableSummaryWindowDefault: result[5].value as boolean ?? DefaultConfig.ENABLE_SUMMARY_WINDOW_DEFAULT,
    summaryInputExceedBehaviour: result[6].value as string ?? DefaultConfig.SUMMARY_INPUT_EXCEED_BEHAVIOUR,
    enableAutoBeginSummaryByActionOrContextTrigger: result[7].value as boolean ?? DefaultConfig.ENABLE_AUTO_BEGIN_SUMMARY_BY_ACTION_OR_CONTEXT_TRIGGER,
    enableChatInputBox: result[8].value as boolean ?? DefaultConfig.ENABLE_CHAT_INPUT_BOX,
    enableAutoBeginChatForAddSelectionToChat: result[9].value as boolean ?? DefaultConfig.ENABLE_AUTO_BEGIN_CHAT_FOR_ADD_SELECTION_TO_CHAT,
  }
}
export function useGeneralConfig() {
  return { getAllExtConfigs }
}

/**
 * Reactive summary language config.
 */
export function useSummaryLanguage() {
  const { state: summaryLanguage, ...other } = useWxtStorage(SUMMARY_LANG_KEY, DefaultConfig.SUMMARY_LANG)
  return { summaryLanguage, ...other }
}
export async function getSummaryLanguage() {
  return (await storage.getItem(SUMMARY_LANG_KEY, { fallback: DefaultConfig.SUMMARY_LANG })) || DefaultConfig.SUMMARY_LANG
}


/**
 * Reactive user custom style config.
 */
export function useUserCustomStyle() {
  const { state: userCustomStyle, ...other } = useWxtStorage<string>(USER_CUSTOM_STYLE_KEY, DefaultConfig.USER_CUSTOM_STYLE)
  return { userCustomStyle, ...other }
}
export async function getUserCustomStyle() {
  return await storage.getItem(USER_CUSTOM_STYLE_KEY, { fallback: DefaultConfig.USER_CUSTOM_STYLE })
}



/**
 * Reactive enable token usage view config.
 */
export function useEnableTokenUsageView() {
  const { state: enableTokenUsageView, ...other } = useWxtStorage(ENABLE_TOKAN_USAGE_VIEW, DefaultConfig.ENABLE_TOKAN_USAGE_VIEW)
  return { enableTokenUsageView, ...other }
}



/**
 * Reactive enable auto begin summary config.
 */
export function useEnableAutoBeginSummary() {
  const { state: enableAutoBeginSummary, ...other } = useWxtStorage(ENABLE_AUTO_BEGIN_SUMMARY, DefaultConfig.ENABLE_AUTO_BEGIN_SUMMARY)
  return { enableAutoBeginSummary, ...other }
}
export async function getEnableAutoBeginSummary() {
  return await storage.getItem(ENABLE_AUTO_BEGIN_SUMMARY, { fallback: DefaultConfig.ENABLE_AUTO_BEGIN_SUMMARY })
}

/**
 * Reactive enable summary window default config.
 */
export function useEnableSummaryWindowDefault() {
  const { state: enableSummaryWindowDefault, ...other } = useWxtStorage(ENABLE_SUMMARY_WINDOW_DEFAULT, DefaultConfig.ENABLE_SUMMARY_WINDOW_DEFAULT)
  return { enableSummaryWindowDefault, ...other }
}

export async function getEnableSummaryWindowDefault() {
  return await storage.getItem(ENABLE_SUMMARY_WINDOW_DEFAULT, { fallback: DefaultConfig.ENABLE_SUMMARY_WINDOW_DEFAULT })
}

/**
 * enable floating ball
 */
export function useEnableFloatingBall() {
  const { state: enableFloatingBall, ...other } = useWxtStorage(ENABLE_FLOATING_BALL, DefaultConfig.ENABLE_FLOATING_BALL)
  return { enableFloatingBall, ...other }
}

/**
  popup as a begin summarize trigger
 */

export function useEnablePopupClickTrigger() {
  const { state: enablePopupClickTrigger, ...other } = useWxtStorage(ENABLE_POPUP_CLICK_TRIGGER, DefaultConfig.ENABLE_POPUP_CLICK_TRIGGER)
  return { enablePopupClickTrigger, ...other }
}

export async function getEnablePopupClickTrigger() {
  return await storage.getItem(ENABLE_POPUP_CLICK_TRIGGER, { fallback: DefaultConfig.ENABLE_POPUP_CLICK_TRIGGER })
}

/**
 * Reactive summary input exceed behaviour config.
 */
export function useSummaryInputExceedBehaviour() {
  const { state: summaryInputExceedBehaviour, ...other } = useWxtStorage<InputContentLengthExceededStrategy>(SUMMARY_INPUT_EXCEED_BEHAVIOUR, DefaultConfig.SUMMARY_INPUT_EXCEED_BEHAVIOUR)
  return { summaryInputExceedBehaviour, ...other }
}

export async function getSummaryInputExceedBehaviour() {
  return await storage.getItem<InputContentLengthExceededStrategy>(SUMMARY_INPUT_EXCEED_BEHAVIOUR, { fallback: DefaultConfig.SUMMARY_INPUT_EXCEED_BEHAVIOUR })
}

/**
 * Reactive page text extract method config.
 */
export function usePageTextExtractMethod() {
  const { state: pageTextExtractMethod, ...other } = useWxtStorage<PageTextExtractMethod>(PAGE_TEXT_EXTRACT_METHOD, DefaultConfig.PAGE_TEXT_EXTRACT_METHOD)
  return { pageTextExtractMethod, ...other }
}

export async function getPageTextExtractMethod() {
  return await storage.getItem<PageTextExtractMethod>(PAGE_TEXT_EXTRACT_METHOD, { fallback: DefaultConfig.PAGE_TEXT_EXTRACT_METHOD })
}

/**
 * Reactive enable auto begin summary by action or context trigger config.
 */
export function useEnableAutoBeginSummaryByActionOrContextTrigger() {
  const { state: enableAutoBeginSummaryByActionOrContextTrigger, ...other } = useWxtStorage(ENABLE_AUTO_BEGIN_SUMMARY_BY_ACTION_OR_CONTEXT_TRIGGER, DefaultConfig.ENABLE_AUTO_BEGIN_SUMMARY_BY_ACTION_OR_CONTEXT_TRIGGER)
  return { enableAutoBeginSummaryByActionOrContextTrigger, ...other }
}
export async function getEnableAutoBeginSummaryByActionOrContextTrigger() {
  return await storage.getItem(ENABLE_AUTO_BEGIN_SUMMARY_BY_ACTION_OR_CONTEXT_TRIGGER, { fallback: DefaultConfig.ENABLE_AUTO_BEGIN_SUMMARY_BY_ACTION_OR_CONTEXT_TRIGGER })
}




export function useEnableCreateNewPanelButton() {
  const { state: enbaleCreateNewPanelButton, ...other } = useWxtStorage(ENABLE_CREATE_NEW_PANEL_BUTTON, DefaultConfig.ENABLE_CREATE_NEW_PANEL_BUTTON)
  return { enbaleCreateNewPanelButton, ...other }
}
export async function getEnableCreateNewPanelButton() {
  return await storage.getItem(ENABLE_CREATE_NEW_PANEL_BUTTON, { fallback: DefaultConfig.ENABLE_CREATE_NEW_PANEL_BUTTON })
}

/**
 * Reactive enable chat input box config.
 */
export function useEnableChatInputBox() {
  const { state: enableChatInputBox, ...other } = useWxtStorage(ENABLE_CHAT_INPUT_BOX, DefaultConfig.ENABLE_CHAT_INPUT_BOX)
  return { enableChatInputBox, ...other }
}

export async function getEnableChatInputBox() {
  return await storage.getItem(ENABLE_CHAT_INPUT_BOX, { fallback: DefaultConfig.ENABLE_CHAT_INPUT_BOX })
}


/**
 * Reactive enable context menu item summarize this page config.
 */
export function useEnableContextMenuSummarizeThisPage() {
  const { state: enableContextMenuItemSummarizeThisPage, ...other } = useWxtStorage(ENABLE_CONTEXT_MENU_ITEM_SUMMARIZE_THIS_PAGE, DefaultConfig.ENABLE_CONTEXT_MENU_ITEM_SUMMARIZE_THIS_PAGE)
  return { enableContextMenuItemSummarizeThisPage, ...other }
}

export async function getEnableContextMenuSummarizeThisPage() {
  return await storage.getItem(ENABLE_CONTEXT_MENU_ITEM_SUMMARIZE_THIS_PAGE, { fallback: DefaultConfig.ENABLE_CONTEXT_MENU_ITEM_SUMMARIZE_THIS_PAGE })
}

/**
 * Reactive enable context menu item add selection to chat config.
 */
export function useEnableContextMenuItemAddSelectionToChat() {
  const { state: enableContextMenuItemAddSelectionToChat, ...other } = useWxtStorage(ENABLE_CONTEXT_MENU_ITEM_ADD_SELECTION_TO_CHAT, DefaultConfig.ENABLE_CONTEXT_MENU_ITEM_ADD_SELECTION_TO_CHAT)
  return { enableContextMenuItemAddSelectionToChat, ...other }
}

export async function getEnableContextMenuItemAddSelectionToChat() {
  return await storage.getItem(ENABLE_CONTEXT_MENU_ITEM_ADD_SELECTION_TO_CHAT, { fallback: DefaultConfig.ENABLE_CONTEXT_MENU_ITEM_ADD_SELECTION_TO_CHAT })
}

export function useEnableAutoBeginChatForAddSelectionToChat() {
  const { state: enableAutoBeginChatForAddSelectionToChat, ...other } = useWxtStorage(ENABLE_AUTO_BEGIN_CHAT_FOR_ADD_SELECTION_TO_CHAT, DefaultConfig.ENABLE_AUTO_BEGIN_CHAT_FOR_ADD_SELECTION_TO_CHAT)
  return { enableAutoBeginChatForAddSelectionToChat, ...other }
}
export async function getEnableAutoBeginChatForAddSelectionToChat() {
  return await storage.getItem(ENABLE_AUTO_BEGIN_CHAT_FOR_ADD_SELECTION_TO_CHAT, { fallback: DefaultConfig.ENABLE_AUTO_BEGIN_CHAT_FOR_ADD_SELECTION_TO_CHAT })
}