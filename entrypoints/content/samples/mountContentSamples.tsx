import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { ContentScriptContext } from 'wxt/utils/content-script-context';
import { ContentSamplesIndexPage } from './ContentSamplePage';

export async function mountContentSamples(ctx: ContentScriptContext) {
  const ui = await createShadowRootUi<Root>(ctx, {
    name: 'webpage-summary-content-samples',
    position: 'overlay',
    alignment: 'top-right',
    anchor: 'body',
    append: 'last',
    zIndex: 2147483647,
    onMount(container) {
      const root = createRoot(container);
      root.render(createElement(ContentSamplesIndexPage));
      return root;
    },
    onRemove(root) {
      root?.unmount();
    },
  });

  ui.mount();
}
