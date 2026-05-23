import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { ContentScriptContext } from 'wxt/utils/content-script-context';
import { getUiMessages } from '@/lib/i18n';
import { ContentEntrance } from './ContentEntrance';

type PingMessage = {
  type: 'WEBPAGE_SUMMARY_PING';
};

function collectPageTextLength() {
  return document.body?.innerText.trim().length ?? 0;
}

async function mountSummaryBadge(ctx: ContentScriptContext) {
  const hostId = 'webpage-summary-react-root';
  if (document.getElementById(hostId)) return;

  const ui = await createShadowRootUi<Root>(ctx, {
    name: 'webpage-summary-entrance',
    position: 'overlay',
    alignment: 'bottom-right',
    anchor: 'body',
    append: 'last',
    zIndex: 2147483647,
    onMount(container) {
      const root = createRoot(container);
      root.render(createElement(ContentEntrance));
      return root;
    },
    onRemove(root) {
      root?.unmount();
    },
  });

  ui.mount();
}

export async function mountContentScope(ctx: ContentScriptContext) {
  const messages = getUiMessages();
  await mountSummaryBadge(ctx);

  browser.runtime.onMessage.addListener((message: PingMessage) => {
    if (message?.type !== 'WEBPAGE_SUMMARY_PING') return;

    return Promise.resolve({
      ok: true,
      title: document.title || messages.content.untitledPage,
      url: location.href,
      textLength: collectPageTextLength(),
    });
  });
}
