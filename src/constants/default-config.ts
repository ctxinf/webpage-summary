import { browser } from "wxt/browser";
import type { BlackList, SiteCumstomizationItem, WhiteList } from "../types/config/site-rules";
import { InputContentLengthExceededStrategy } from "../types/summary";
export const DefaultConfig = {
  SUMMARY_LANG: browser.i18n.getUILanguage(),
  USER_CUSTOM_STYLE: '',
  ENABLE_TOKAN_USAGE_VIEW: true,
  ENABLE_USER_CHAT_DEFAULT: false,
  ENABLE_AUTO_BEGIN_SUMMARY: false,
  ENABLE_SUMMARY_WINDOW_DEFAULT: false,
  ENABLE_FLOATING_BALL: true,
  ENABLE_POPUP_CLICK_TRIGGER: false,
  SUMMARY_INPUT_EXCEED_BEHAVIOUR: 'cut-preserve-front' as InputContentLengthExceededStrategy,
  ENABLE_AUTO_BEGIN_SUMMARY_BY_ACTION_OR_CONTEXT_TRIGGER: true,
  ENABLE_CREATE_NEW_PANEL_BUTTON: true,
  ENABLE_CHAT_INPUT_BOX: true,
  ENABLE_CONTEXT_MENU_ITEM_SUMMARIZE_THIS_PAGE: true,
  ENABLE_CONTEXT_MENU_ITEM_ADD_SELECTION_TO_CHAT: true,
  ENABLE_AUTO_BEGIN_CHAT_FOR_ADD_SELECTION_TO_CHAT: false,
  WHITELIST: {
    enable: false,
    patterns: [],
  } as WhiteList,
  BLACKLIST: {
    enable: true,
    patterns: [],
  } as BlackList,
  SITE_CUSTOMIZATION: [] as SiteCumstomizationItem[],

} as const
