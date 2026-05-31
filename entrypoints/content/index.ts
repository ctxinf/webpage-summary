import './polyfill';
import { ENABLE_CONTENT_SAMPLES } from '@/constants/flag';
import { mountContentScope } from './scope';
import { mountContentSamples } from './sample/mountContentSamples';
import 'sonner/dist/styles.css';
import './style.css';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  cssInjectionMode: 'ui',
  async main(ctx) {
    await mountContentScope(ctx);

    if (ENABLE_CONTENT_SAMPLES) {
      // console.log('ENABLE_CONTENT_SAMPLES',ENABLE_CONTENT_SAMPLES)
      await mountContentSamples(ctx);
    }
  },
});
