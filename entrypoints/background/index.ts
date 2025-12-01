import { sendMessage } from "@/messaging";
import { browser } from "wxt/browser";
import { defineBackground } from "#imports";
import { addContextMenus, registerControlMessages } from "./control";
import { registerDebugMessages } from "./debug";
import { registerLLMMessages } from "./llm";
import { onInstallHook } from "./onInstall";
import { addWebRequestListnerForModifyHeaders } from "./firefox-rules";
import { updateDynamicRulesForModifyHeaders } from "./chrome-rules";
export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
  const extensionUrl = chrome.runtime.getURL("");
  const extensionHost = new URL(extensionUrl);
  console.log("Extension Host:", extensionHost);
  registerControlMessages();

  registerDebugMessages();

  registerLLMMessages();

  // command
  browser.commands.onCommand.addListener((command, tab) => {
    if (command === "COMMAND_INVOKE_SUMMARY" && tab?.id) {
      sendMessage("invokeSummary", undefined, { tabId: tab.id });
      return;
    } else if (command === "COMMAND_ADD_SELECTION" && tab?.id) {
      sendMessage("addContentToChatDialog", "", tab?.id);
      return;
    }
    console.log("[unhandle command]", command);
  });

  //onInstall
  browser.runtime.onInstalled.addListener((d) => {
    console.log("[onInstall]");
    onInstallHook(d);
  });

  //contextMenu
  addContextMenus();

  /**
   * dynamic rules
   */
  const extensionId = browser.runtime.id; // Get the current extension's ID
  const domains = [
    { domain: "www.kimi.com", id: 101 },
  ];

  if (import.meta.env.FIREFOX) {
    for (const { domain, id } of domains) {
      addWebRequestListnerForModifyHeaders({ domain }, extensionHost.host);
    }
  } else {
    for (const d of domains) {
      updateDynamicRulesForModifyHeaders(d, extensionId);
    }
  }
});
