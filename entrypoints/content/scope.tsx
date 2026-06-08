import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { ContentScriptContext } from 'wxt/utils/content-script-context';
import { getUiMessages } from '@/lib/i18n';
import { loadGeneralSettings } from '@/lib/general-settings-storage';
import { parsePageContent, textsBySelectors } from '@/lib/page-extraction';
import {
  findMatchingCustomization,
  isUrlAllowed,
  loadSiteRules,
} from '@/lib/site-rules-storage';
import { ContentEntrance } from './ContentEntrance';

import { createLogger } from '@/lib/logger';

const logger = createLogger('content:scope');

type PingMessage = {
  type: 'WEBPAGE_SUMMARY_PING';
};

type ExtractMessage = {
  type: 'WEBPAGE_SUMMARY_EXTRACT_TEXT';
};

type IncomingMessage = PingMessage | ExtractMessage;

function collectPageTextLength() {
  return document.body?.innerText.trim().length ?? 0;
}

async function mountSummaryBadge(ctx: ContentScriptContext) {
  // logger.info('[ContentScope] mountSummaryBadge running');
  const hostId = 'webpage-summary-react-root';
  if (document.getElementById(hostId)) {
    // logger.info('[ContentScope] hostId already exists, skipping');
    return;
  }

  const ui = await createShadowRootUi<Root>(ctx, {
    name: 'webpage-summary-entrance',
    position: 'overlay',
    alignment: 'bottom-right',
    anchor: 'body',
    append: 'last',
    zIndex: 2147483647,
    onMount(container) {
      // logger.info('[ContentScope] UI container mounted, rendering React root');
      const root = createRoot(container);
      root.render(createElement(ContentEntrance));
      return root;
    },
    onRemove(root) {
      // logger.info('[ContentScope] UI container unmounted');
      root?.unmount();
    },
  });

  ui.mount();
  // logger.info('[ContentScope] ui.mount() called');
}

export async function mountContentScope(ctx: ContentScriptContext) {
  // logger.info('[ContentScope] mountContentScope called');
  const messages = getUiMessages();

  const { whitelist, blacklist } = await loadSiteRules();
  const urlAllowed = isUrlAllowed(location, whitelist, blacklist);
  if (urlAllowed) {
    await mountSummaryBadge(ctx);
  } else {
    // logger.info('[ContentScope] site rules blocked UI mount for', location.hostname);
  }

  browser.runtime.onMessage.addListener((message: IncomingMessage) => {
    if (message?.type === 'WEBPAGE_SUMMARY_PING') {
      return Promise.resolve({
        ok: true,
        title: document.title || messages.content.untitledPage,
        url: location.href,
        textLength: collectPageTextLength(),
      });
    }

    if (message?.type === 'WEBPAGE_SUMMARY_EXTRACT_TEXT') {
      return (async () => {
        try {
          const [settings, { siteCustomization }] = await Promise.all([
            loadGeneralSettings(),
            loadSiteRules(),
          ]);

          const matchedRule = findMatchingCustomization(location, siteCustomization);
          // logger.info('matchedRule',matchedRule)
          const extracted = matchedRule
            ? textsBySelectors(
                matchedRule.selectors,
                {
                  shadowRootSelectors: matchedRule.shadowRootSelectors,
                  useShadowRoot: matchedRule.useShadowRoot,
                },
                document,
              )
            : parsePageContent(settings.pageTextExtractMethod, document);

          return {
            ok: true,
            title: document.title || messages.content.untitledPage,
            url: location.href,
            text: extracted?.textContent ?? '',
          };
        } catch (e) {
          return { ok: false, error: (e as Error)?.message ?? String(e) };
        }
      })();
    }

    return;
  });
}
