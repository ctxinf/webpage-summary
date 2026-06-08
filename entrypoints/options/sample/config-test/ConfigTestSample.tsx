import React, { useRef, useState } from 'react';
import { browser } from 'wxt/browser';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { migrateModelConfigs, runFullMigration } from '@/lib/migration';
import { MODEL_CONFIGS_V2_STORAGE_KEY } from '@/constants/model-settings';

import { createLogger } from '@/lib/logger';

const logger = createLogger('options:ConfigTestSample');

const compatibilityVersion = 20250224;

const importSchema = z.object({
  name: z.literal('webpage-summary'),
  version: z.string(),
  compatibilityVersion: z.literal(compatibilityVersion),
  exportDate: z.string(),
  data: z.record(z.string(), z.any()),
});

export function ConfigTestSample() {
  const [viewData, setViewData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [importLog, setImportLog] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClear = async () => {
    if (confirm('Are you sure you want to clear all extension data? This cannot be undone.')) {
      await browser.storage.local.clear();
      toast.success('Local storage cleared');
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const text = await file.text();
        const json = JSON.parse(text);
        setViewData(json);

        const parsedData = importSchema.safeParse(json);
        if (parsedData.success) {
          const { data } = parsedData.data;
          await browser.storage.local.set(data);
          toast.success('Legacy configuration loaded into local storage. Ready to run migration.');
        } else {
          toast.error('Invalid configuration file: ' + parsedData.error.message);
        }
      } catch (e) {
        toast.error('Failed to parse file: ' + String(e));
        setViewData(null);
      }
    }
  };

  const handleRunMigration = async () => {
    setIsLoading(true);
    try {
      const logs = await runFullMigration();
      setImportLog(logs);
      toast.success('Successfully executed migration process!');
    } catch (e) {
      logger.error('Migration failed:', e);
      toast.error('Migration Error: ' + String(e));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h2 className="text-xl font-bold mb-2">Clear Storage</h2>
        <p className="mb-4 text-sm text-muted-foreground">This will remove all configurations from browser.storage.local.</p>
        <Button onClick={handleClear} variant="destructive">Clear Configuration</Button>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-2">Import Legacy File</h2>
        <p className="mb-4 text-sm text-muted-foreground">Upload an old JSON backup file to test backward compatibility.</p>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          accept=".json" 
          onChange={handleFileSelect}
          className="block mb-4"
        />

        <Button 
          onClick={handleRunMigration} 
          disabled={!viewData || isLoading}
        >
          {isLoading ? 'Running Migration...' : 'Run Migration Test'}
        </Button>

        {importLog.length > 0 && (
          <div className="mt-4 border p-4 rounded-md overflow-auto bg-muted text-sm text-green-700 font-mono">
            <h3 className="font-semibold mb-2">Import Logs:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {importLog.map((log, i) => <li key={i}>{log}</li>)}
            </ul>
          </div>
        )}

        {viewData && (
          <div className="mt-6 border p-4 rounded-md overflow-auto max-h-[400px] bg-background text-sm">
            <h3 className="font-semibold mb-2">Preview (Export Date: {viewData.exportDate})</h3>
            <pre>{JSON.stringify(viewData.data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
