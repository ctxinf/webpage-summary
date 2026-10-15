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

import { onMessage } from '@/lib/messaging';
import { createLogger } from '@/lib/logger';
import { mountProtectedContentUi } from '@/lib/content-ui-isolation';

const logger = createLogger('content:scope');



function collectPageTextLength() {
  return document.body?.innerText.trim().length ?? 0;
}

async function mountSummaryBadge(ctx: ContentScriptContext) {
  await mountProtectedContentUi<Root>(ctx, {
    id: 'webpage-summary-react-root',
    name: 'webpage-summary-entrance',
    onMount(container) {
      const root = createRoot(container);
      root.render(createElement(ContentEntrance));
      return root;
    },
    onRemove(root) {
      root?.unmount();
    },
  });
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

  onMessage('ping', () => {
    return Promise.resolve({
      ok: true,
      title: document.title || messages.content.untitledPage,
      url: location.href,
      textLength: collectPageTextLength(),
    });
  });

  onMessage('extractText', async () => {
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
  });
}
