import { useState } from 'react';
import { browser } from 'wxt/browser';
import { z } from 'zod';
import { getUiMessages } from '@/lib/i18n';
import { OptionsPageTitle } from './OptionsPageTitle';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { MODEL_CONFIGS_V2_STORAGE_KEY } from '@/constants/model-settings';

const compatibilityVersion = 20250224;

const importSchema = z.object({
  name: z.literal('webpage-summary'),
  version: z.string(),
  compatibilityVersion: z.literal(compatibilityVersion),
  exportDate: z.string(),
  data: z.record(z.string(), z.any()),
});

type ExportDataStructure = z.infer<typeof importSchema>;

type DiffItem = {
  key: string;
  action: 'add' | 'update';
  oldValue: any;
  newValue: any;
  selected: boolean;
};

export function ConfigManagerPage() {
  const messages = getUiMessages();
  const [isExportWithApiKeys, setIsExportWithApiKeys] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [diffItems, setDiffItems] = useState<DiffItem[] | null>(null);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const items = await browser.storage.local.get(null);
      
      /* delete apiKey field */
      if (items && !isExportWithApiKeys) {
        const key = MODEL_CONFIGS_V2_STORAGE_KEY.replace('local:', '');
        if (items[key] && Array.isArray(items[key])) {
          items[key] = items[key].map((item: any) => {
            const { apiKey, ...other } = item;
            return { ...other };
          });
        }
      }

      /* remove content-samples-position */
      if (items) {
        delete items['local:content-samples-position'];
        delete items['content-samples-position'];
      }

      const manifest = browser.runtime.getManifest();
      const version = manifest.version;

      const data: ExportDataStructure = {
        name: 'webpage-summary',
        version: version,
        compatibilityVersion: compatibilityVersion,
        exportDate: new Date().toLocaleString(),
        data: items,
      };

      // TODO: remove this debug log later
      console.log('Exported Data Object:', data);

      const jsonString = JSON.stringify(data);
      // UTF-8 friendly base64 encoding
      const base64String = btoa(encodeURIComponent(jsonString));
      
      await navigator.clipboard.writeText(base64String);
      toast.success(messages.common?.success || 'Success', {
        description: 'Configuration copied to clipboard. You can now paste it in another extension instance.',
      });
    } catch (e) {
      console.error('Export failed:', e);
      toast.error('Export Error', { description: String(e) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    setIsLoading(true);
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (!clipboardText) {
        toast.error('Clipboard is empty.');
        return;
      }

      let jsonString;
      try {
        jsonString = decodeURIComponent(atob(clipboardText));
      } catch (e) {
        toast.error('Invalid clipboard content. Make sure you copied a valid base64 configuration string.');
        return;
      }

      const parsedJson = JSON.parse(jsonString);
      const parsedData = importSchema.safeParse(parsedJson);

      if (!parsedData.success) {
        toast.error('Import Parse Failed', { description: 'Invalid configuration structure.' });
        return;
      }

      const { data } = parsedData.data;

      /* remove content-samples-position before importing */
      if (data) {
        delete data['local:content-samples-position'];
        delete data['content-samples-position'];
      }

      const currentItems = await browser.storage.local.get(null);
      const newDiffs: DiffItem[] = [];

      for (const [key, value] of Object.entries(data)) {
        const isUpdate = currentItems.hasOwnProperty(key);
        // Simple stringify comparison to skip unchanged
        if (isUpdate && JSON.stringify(currentItems[key]) === JSON.stringify(value)) {
          continue;
        }
        newDiffs.push({
          key,
          action: isUpdate ? 'update' : 'add',
          oldValue: isUpdate ? currentItems[key] : undefined,
          newValue: value,
          selected: true,
        });
      }

      if (newDiffs.length === 0) {
        toast.info('未发现任何变更', { description: '剪贴板中的配置与当前配置完全一致。' });
        return;
      }

      setDiffItems(newDiffs);
      toast.info('请审阅即将导入的配置');
    } catch (e) {
      console.error('Import failed:', e);
      toast.error('Import Error', { description: String(e) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!diffItems) return;
    
    setIsLoading(true);
    try {
      const dataToSave: Record<string, any> = {};
      for (const item of diffItems) {
        if (item.selected) {
          dataToSave[item.key] = item.newValue;
        }
      }
      
      if (Object.keys(dataToSave).length > 0) {
        await browser.storage.local.set(dataToSave);
        toast.success(messages.common?.success || 'Success', {
          description: `成功导入了 ${Object.keys(dataToSave).length} 项配置。`,
        });
      } else {
        toast.info('未选择任何配置进行导入。');
      }
      
      setDiffItems(null);
    } catch (e) {
      console.error('Import confirmation failed:', e);
      toast.error('Import Error', { description: String(e) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAll = async () => {
    if (window.confirm('确定要清除所有配置吗？此操作无法撤销。')) {
      setIsLoading(true);
      try {
        await browser.storage.local.clear();
        toast.success(messages.common?.success || 'Success', {
          description: '所有配置已被清除。',
        });
      } catch (e) {
        console.error('Reset failed:', e);
        toast.error('Reset Error', { description: String(e) });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <OptionsPageTitle>{messages.options.navigation.exportImport}</OptionsPageTitle>
      <div className="text-sm text-muted-foreground mb-6">
        {messages.exportImport.exportImportDescription}
      </div>

      <div className="flex flex-col gap-8">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">{messages.exportImport.exportConfiguration}</h2>
          <div className="flex items-center gap-2">
            <Switch 
              id="export-apikeys" 
              checked={isExportWithApiKeys} 
              onCheckedChange={(checked) => setIsExportWithApiKeys(checked === true)}
            />
            <label htmlFor="export-apikeys" className="text-sm font-medium leading-none cursor-pointer">
              {messages.exportImport.exportWithApiKeys}
            </label>
          </div>
          {isExportWithApiKeys && (
            <p className="text-sm text-destructive">
              Warning: Exporting with API Keys includes sensitive information. Keep the exported string safe.
            </p>
          )}
          <Button onClick={handleExport} disabled={isLoading}>
            {isLoading ? 'Exporting...' : messages.exportImport.copyToClipboard}
          </Button>
        </section>

        <section className="space-y-4 border-t pt-6">
          <h2 className="text-lg font-semibold">{messages.exportImport.importConfiguration}</h2>
          <p className="text-sm text-muted-foreground">
            {messages.exportImport.importConfigurationDescription}
          </p>
          <Button onClick={handleImport} disabled={isLoading || diffItems !== null} variant="secondary">
            {isLoading ? 'Reading...' : messages.exportImport.readFromClipboard}
          </Button>

          {diffItems && (
            <div className="mt-6 space-y-4 bg-muted p-4 rounded-md">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">导入审阅 (Import Review)</h3>
                <div className="space-x-2 flex items-center">
                  <Button size="sm" onClick={handleConfirmImport} disabled={isLoading}>
                    确认导入
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700 text-white" 
                    onClick={() => setDiffItems(diffItems.map(i => ({ ...i, selected: true })))}
                  >
                    全部接受
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => setDiffItems(diffItems.map(i => ({ ...i, selected: false })))}
                  >
                    全部拒绝
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setDiffItems(null)}>
                    取消
                  </Button>
                </div>
              </div>
              <div className="border rounded-md bg-background">
                <table className="w-full text-sm text-left table-fixed">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2 font-medium w-[200px]">配置项</th>
                      <th className="px-4 py-2 font-medium w-1/3">旧的值</th>
                      <th className="px-4 py-2 font-medium w-1/3">新的值</th>
                      <th className="px-4 py-2 font-medium text-right w-[180px]">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {diffItems.map((item, idx) => (
                      <tr key={item.key} className="hover:bg-muted/50">
                        <td className="px-4 py-2 font-mono text-xs break-all align-top">
                          <div className="flex items-center gap-2">
                            <span className={`shrink-0 text-[10px] whitespace-nowrap px-1.5 py-0.5 rounded-sm ${item.action === 'update' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                              {item.action === 'update' ? '冲突' : '新增'}
                            </span>
                            <span>{item.key}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-xs font-mono break-all whitespace-pre-wrap align-top">
                          {item.action === 'update' ? (
                            <div className="text-red-700 max-h-[300px] overflow-y-auto">
                              {JSON.stringify(item.oldValue, null, 2)}
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">-</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-xs font-mono break-all whitespace-pre-wrap align-top">
                          <div className="text-green-700 max-h-[300px] overflow-y-auto">
                            {JSON.stringify(item.newValue, null, 2)}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant={item.selected ? 'default' : 'outline'}
                              className={`h-7 px-2.5 text-xs ${item.selected ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                              onClick={() => {
                                const newItems = [...diffItems];
                                newItems[idx].selected = true;
                                setDiffItems(newItems);
                              }}
                            >
                              ✅ {item.action === 'update' ? '覆盖' : '接受'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant={!item.selected ? 'destructive' : 'outline'}
                              className="h-7 px-2.5 text-xs"
                              onClick={() => {
                                const newItems = [...diffItems];
                                newItems[idx].selected = false;
                                setDiffItems(newItems);
                              }}
                            >
                              ❌ {item.action === 'update' ? '跳过' : '放弃'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-4 border-t pt-6">
          <h2 className="text-lg font-semibold text-destructive">{messages.exportImport.dangerZone}</h2>
          <p className="text-sm text-muted-foreground">
            {messages.exportImport.resetConfigurationDescription}
          </p>
          <Button variant="destructive" onClick={handleResetAll} disabled={isLoading}>
            {messages.exportImport.resetAllConfigurations}
          </Button>
        </section>
      </div>
    </>
  );
}
