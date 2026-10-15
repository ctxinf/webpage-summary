import './polyfill';
import { ENABLE_CONTENT_SAMPLES } from '@/constants/flag';
import { waitForContentUiReady } from '@/lib/content-ui-isolation';
import 'sonner/dist/styles.css';
import './style.css';

export default defineContentScript({
  matches: ['<all_urls>'],
  // The entrance must not wait for slow page scripts or subresources.
  runAt: 'document_start',
  cssInjectionMode: 'ui',
  async main(ctx) {
    if (!(await waitForContentUiReady(ctx))) return;
    const { mountContentScope } = await import('./scope');
    await mountContentScope(ctx);

    if (ENABLE_CONTENT_SAMPLES) {
      const { mountContentSamples } = await import('./sample/mountContentSamples');
      await mountContentSamples(ctx);
    }
  },
});
