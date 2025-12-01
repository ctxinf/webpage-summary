import { onMessage, sendMessage } from "@/messaging";
import { getEnableContextMenuItemAddSelectionToChat, getEnableContextMenuSummarizeThisPage } from "@/src/composables/general-config";
import { activePageAndInvokeSummary, t } from "@/src/utils/extension";
import { browser } from "wxt/browser";



export function registerControlMessages() {
  onMessage('openOptionPage', async (msg) => {
    console.debug('[openOptionPage]', msg.data)
    return browser.tabs.create({ url: msg.data })
  })


  onMessage('openPopupPage', async (msg) => {

    console.debug('[openPopupPage]', msg.data)
    const { query } = msg.data
    browser.action.setPopup({
      popup: '/popup.html?' + query,
    })
    browser.action.openPopup({
      windowId: msg.sender.tab?.windowId

    })

  })
}


export async function addContextMenus() {
  const enableSummaizeThisPage = await getEnableContextMenuSummarizeThisPage();
  const enableAddSelectionToChat = await getEnableContextMenuItemAddSelectionToChat();

  await browser.contextMenus.removeAll()

  if (enableSummaizeThisPage) {
    console.debug('[contextMenu]add summarize-this-page')
    // summrize trigger
    browser.contextMenus.create({
      id: "summarize-this-page",
      title: t('summarize_this_page') + '',
      contexts: import.meta.env.FIREFOX ? ["page", "page_action"] : ["page", "action"]  // add btn to page context menu
    });
  }

  if (enableAddSelectionToChat) {
    console.debug('[contextMenu]add add-to-chat')
    //add selection to chat
    browser.contextMenus.create({
      id: "add-to-chat",
      title: t('add_selection_to_chat'),
      contexts: ["selection"]
    });
  }


  // open-setting
  browser.contextMenus.create({
    id: "open-setting",
    title: t('Open_Setting') + '⚙',
    contexts: import.meta.env.FIREFOX ? ["page_action"] : ["action"] // add btn to page context menu
  });



  //event handler for context memu click
  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    console.debug('[contextMenu]onClicked, menuItemId:', info.menuItemId)
    if (info.menuItemId === "summarize-this-page" && tab) {
      activePageAndInvokeSummary(tab)
    }

    if (info.menuItemId === "open-setting") {
      browser.tabs.create({ url: '/options.html#/' })
    }

    if (info.menuItemId === "add-to-chat") {
      /*
       *  `selectionText` will never have newline `/n`
       */
      sendMessage('addContentToChatDialog', info.selectionText ?? '', tab?.id)
    }
  });
}