type PingMessage = {
  type: 'WEBPAGE_SUMMARY_PING';
};

function collectPageTextLength() {
  return document.body?.innerText.trim().length ?? 0;
}

function mountSummaryBadge() {
  const hostId = 'webpage-summary-react-root';
  if (document.getElementById(hostId)) return;

  const host = document.createElement('div');
  host.id = hostId;
  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    :host {
      all: initial;
      position: fixed;
      right: 16px;
      bottom: 16px;
      z-index: 2147483647;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 36px;
      padding: 0 12px;
      border: 1px solid rgba(24, 24, 27, 0.12);
      border-radius: 8px;
      color: #fafafa;
      background: #18181b;
      box-shadow: 0 10px 28px rgba(24, 24, 27, 0.18);
      cursor: default;
      font: inherit;
      font-size: 13px;
      line-height: 1;
    }

    span {
      display: inline-grid;
      width: 18px;
      height: 18px;
      place-items: center;
      border-radius: 5px;
      color: #18181b;
      background: #fafafa;
      font-size: 12px;
      font-weight: 700;
    }
  `;

  const badge = document.createElement('button');
  badge.type = 'button';
  badge.title = 'Webpage Summary';
  badge.innerHTML = '<span>W</span><strong>Summary</strong>';

  shadow.append(style, badge);
  document.documentElement.append(host);
}

export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  runAt: 'document_idle',
  main() {
    mountSummaryBadge();

    browser.runtime.onMessage.addListener((message: PingMessage) => {
      if (message?.type !== 'WEBPAGE_SUMMARY_PING') return;

      return Promise.resolve({
        ok: true,
        title: document.title || 'Untitled page',
        url: location.href,
        textLength: collectPageTextLength(),
      });
    });
  },
});
