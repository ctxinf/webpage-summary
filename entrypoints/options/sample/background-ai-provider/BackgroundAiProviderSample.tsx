import { useState } from 'react';
import { Button } from '@/components/ui/button';

import { createLogger } from '@/lib/logger';

const logger = createLogger('options:BackgroundAiProviderSample');

export function BackgroundAiProviderSample() {
  const [apiKey, setApiKey] = useState('');

  async function runSample() {
    if (!apiKey.trim()) {
      return;
    }

    const rs=await browser.runtime.sendMessage({
      type: 'RUN_BACKGROUND_AI_PROVIDER_SAMPLE',
      apiKey: apiKey.trim(),
    });

    logger.info("call suc.",rs)
  }

  return (
    <section className="grid gap-4 rounded-lg border bg-background p-[18px]">
      <h2 className="text-[16px] font-semibold">Background AI Provider</h2>
      <input
        className="h-9 rounded-md border bg-background px-3 text-sm"
        value={apiKey}
        placeholder="API Key"
        onChange={(event) => setApiKey(event.target.value)}
      />
      <Button type="button" onClick={runSample}>
        调用 background
      </Button>
    </section>
  );
}
