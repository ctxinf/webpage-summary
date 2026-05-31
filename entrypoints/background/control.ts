import { onMessage, sendMessage } from '@/lib/messaging';
import { loadGeneralSettings } from '@/lib/general-settings-storage';
import { browser, type Browser } from 'wxt/browser';
import { sleep } from 'radash';
import { getUiMessages } from '@/lib/i18n';

export function registerControlMessages() {
  onMessage('openOptionPage', async (msg) => {
    console.debug('[openOptionPage]', msg.data);
    return void browser.tabs.create({ url: msg.data });
  });

  onMessage('openPopupPage', async (msg) => {
    console.debug('[openPopupPage]', msg.data);
    const { query } = msg.data;
    browser.action.setPopup({
      popup: '/popup.html?' + query,
    });
    browser.action.openPopup({
      windowId: msg.sender.tab?.windowId,
    });
  });
}

export async function activePageAndInvokeSummary(tab: Browser.tabs.Tab) {
  if (!tab.id) return;
  
  let shadowRootExist = false;
  for (let i = 0; i < 5; i++) {
    await sleep(100);
    try {
      const result = await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          return !!document.querySelector('webpage-summary-entrance')?.shadowRoot;
        },
      });
      shadowRootExist = Boolean(result?.[0]?.result);
      if (shadowRootExist) {
        break;
      }
    } catch (e) {
      console.warn('[activePageAndInvokeSummary] script execution failed', e);
    }
  }

  if (shadowRootExist) {
    sendMessage('invokeSummary', undefined, { tabId: tab.id }).catch(e => {
      console.warn('[activePageAndInvokeSummary] sendMessage failed', e);
    });
  } else {
    console.error("Cannot find webpage-summary-entrance shadow root, check if extension is enabled on this page.");
  }
}

export async function addContextMenus() {
  const settings = await loadGeneralSettings();
  const messages = getUiMessages();

  await browser.contextMenus.removeAll();

  if (settings.enableContextMenuSummarizeThisPage) {
    console.debug('[contextMenu] adding summarize-this-page');
    browser.contextMenus.create({
      id: 'summarize-this-page',
      title: messages.common.contextMenu.summarizeThisPage,
      contexts: import.meta.env.FIREFOX ? ['page', 'page_action'] : ['page', 'action'],
    });
  }

  if (settings.enableContextMenuAddSelectionToChat) {
    console.debug('[contextMenu] adding add-to-chat');
    browser.contextMenus.create({
      id: 'add-to-chat',
      title: messages.common.contextMenu.addToChat,
      contexts: ['selection'],
    });
  }

  // Open settings context menu
  browser.contextMenus.create({
    id: 'open-setting',
    title: messages.common.contextMenu.openSetting,
    contexts: import.meta.env.FIREFOX ? ['page_action'] : ['action'],
  });
}

// Set up event listeners for context menu and commands click
export function initializeControlHandlers() {
  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    console.debug('[contextMenu] onClicked, menuItemId:', info.menuItemId);
    if (info.menuItemId === 'summarize-this-page' && tab) {
      activePageAndInvokeSummary(tab);
    }

    if (info.menuItemId === 'open-setting') {
      browser.tabs.create({ url: '/options.html#/' });
    }

    if (info.menuItemId === 'add-to-chat' && tab?.id) {
      sendMessage('addContentToChatDialog', info.selectionText ?? '', { tabId: tab.id }).catch(e => {
        console.warn('[contextMenu] addContentToChatDialog failed', e);
      });
    }
  });

  browser.commands.onCommand.addListener((command, tab) => {
    console.debug('[command] received command:', command);
    if (command === 'COMMAND_INVOKE_SUMMARY' && tab) {
      activePageAndInvokeSummary(tab);
    }
  });
}
