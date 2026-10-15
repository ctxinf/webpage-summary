import { createShadowRootUi } from '#imports';
import type { ContentScriptContext } from 'wxt/utils/content-script-context';

// WXT resets :host with all: initial !important. These shadow-local overrides
// protect only the host, leaving user-controlled visibility inside React.
const HOST_PROTECTION_CSS = `
  :host {
    display: block !important;
    position: fixed !important;
    top: 0 !important;
    right: 0 !important;
    width: 0 !important;
    height: 0 !important;
    z-index: 2147483647 !important;
    visibility: visible !important;
    opacity: 1 !important;
    overflow: visible !important;
    pointer-events: auto !important;
    transform: none !important;
    filter: none !important;
    clip: auto !important;
    clip-path: none !important;
    contain: none !important;
    content-visibility: visible !important;
    font-size: var(--webpage-summary-panel-srem, 16px) !important;
  }
`;

/** Wait for import-time UI dependencies such as Sonner, without waiting for load. */
export async function waitForContentUiReady(ctx: ContentScriptContext): Promise<boolean> {
  if (ctx.isInvalid) return false;
  if (!document.head) {
    await new Promise<void>((resolve) => {
      const finish = () => {
        observer.disconnect();
        ctx.signal.removeEventListener('abort', finish);
        resolve();
      };
      const observer = new MutationObserver(() => {
        if (document.head) finish();
      });
      ctx.signal.addEventListener('abort', finish, { once: true });
      observer.observe(document, { childList: true, subtree: true });
    });
  }
  return ctx.isValid;
}

/** Keep extraction and automatic summaries behind DOM readiness; abort on unmount. */
export function waitForPageDomReady(signal: AbortSignal): Promise<void> {
  if (document.readyState !== 'loading' || signal.aborted) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const finish = () => {
      document.removeEventListener('DOMContentLoaded', finish);
      signal.removeEventListener('abort', finish);
      resolve();
    };
    document.addEventListener('DOMContentLoaded', finish, { once: true });
    signal.addEventListener('abort', finish, { once: true });
  });
}

interface ProtectedContentUiOptions<T> {
  id: string;
  name: string;
  onMount(container: HTMLElement): T;
  onRemove(mounted: T | undefined): void;
}

/** Isolate the host from body styles and recover it without reopening closed UI. */
export async function mountProtectedContentUi<T>(
  ctx: ContentScriptContext,
  options: ProtectedContentUiOptions<T>,
): Promise<void> {
  if (document.getElementById(options.id)) return;

  let hostObserver: MutationObserver | undefined;
  const ui = await createShadowRootUi<T>(ctx, {
    name: options.name,
    position: 'overlay',
    alignment: 'bottom-right',
    anchor: 'html',
    append: 'last',
    zIndex: 2147483647,
    css: HOST_PROTECTION_CSS,
    onMount(container, _shadow, shadowHost) {
      shadowHost.id = options.id;
      // The parser can append body after an early mount. Keep our stacking
      // context last and recover the same host if page code removes it.
      hostObserver?.disconnect();
      hostObserver = new MutationObserver(() => {
        const anchor = document.documentElement;
        if (anchor && anchor.lastElementChild !== shadowHost) anchor.append(shadowHost);
      });
      hostObserver.observe(document.documentElement, { childList: true });
      container.style.fontSize = 'var(--webpage-summary-panel-srem, 16px)';
      return options.onMount(container);
    },
    onRemove(mounted) {
      hostObserver?.disconnect();
      options.onRemove(mounted);
    },
  });

  // document_start can run before <html> exists.
  ui.autoMount({ once: true });
}
