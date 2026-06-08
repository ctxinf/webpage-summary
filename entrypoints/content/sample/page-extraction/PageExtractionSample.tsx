import { FileSearch, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { loadGeneralSettings } from '@/lib/general-settings-storage';
import {
  parsePageContent,
  type PageTextExtractMethod,
  type WebpageContent,
} from '@/lib/page-extraction';

const METHOD_LABELS: Record<PageTextExtractMethod, string> = {
  readability: 'Readability',
  'dom-heuristic': 'DOM heuristic',
};

export function PageExtractionSample() {
  const [method, setMethod] =
    useState<PageTextExtractMethod>('readability');
  const [configuredMethod, setConfiguredMethod] =
    useState<PageTextExtractMethod>('readability');
  const [result, setResult] = useState<WebpageContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadConfiguredMethod() {
      try {
        const settings = await loadGeneralSettings();

        if (!active) return;

        setConfiguredMethod(settings.pageTextExtractMethod);
        setMethod(settings.pageTextExtractMethod);
        runExtraction(settings.pageTextExtractMethod);
      } catch (loadError) {
        if (!active) return;

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Page extraction settings failed to load.',
        );
        runExtraction('readability');
      }
    }

    loadConfiguredMethod();

    return () => {
      active = false;
    };
  }, []);

  function runExtraction(nextMethod: PageTextExtractMethod = method) {
    try {
      const extracted = parsePageContent(nextMethod);

      if (!extracted) {
        setResult(null);
        setError(`${METHOD_LABELS[nextMethod]} returned no content.`);
        return;
      }

      setMethod(nextMethod);
      setResult(extracted);
      setError(null);
    } catch (extractError) {
      setResult(null);
      setError(
        extractError instanceof Error
          ? extractError.message
          : 'Page extraction failed.',
      );
    }
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-start gap-[10px]">
        <FileSearch className="mt-[3px] shrink-0" size={16} />
        <div>
          <h3 className="m-0 mt-px text-[15px] font-semibold leading-tight text-zinc-950">
            Page Extraction
          </h3>
          <p className="m-0 text-zinc-600">
            Configured default: {METHOD_LABELS[configuredMethod]}
          </p>
        </div>
      </div>

      <fieldset className="m-0 flex min-w-0 flex-wrap gap-2 rounded-md border border-zinc-200 p-[10px]">
        <legend className="px-1 text-zinc-600">Method</legend>
        {(Object.keys(METHOD_LABELS) as PageTextExtractMethod[]).map(
          (option) => (
            <label
              className="inline-flex min-h-7 items-center gap-[5px]"
              key={option}
            >
              <input
                className="m-0 h-[14px] w-[14px] accent-zinc-900"
                checked={method === option}
                name="content-sample-extract-method"
                onChange={() => runExtraction(option)}
                type="radio"
              />
              <span>{METHOD_LABELS[option]}</span>
            </label>
          ),
        )}
      </fieldset>

      <button
        className="inline-flex min-h-[34px] w-fit items-center justify-center gap-[7px] rounded-md border border-zinc-900 bg-zinc-900 px-[11px] font-semibold text-white"
        onClick={() => runExtraction()}
        type="button"
      >
        <RefreshCw size={16} />
        Extract current page
      </button>

      {error ? (
        <p className="m-0 rounded-md border border-red-300 bg-red-50 px-[10px] py-2 text-red-800">
          {error}
        </p>
      ) : null}

      {result ? (
        <>
          <dl className="m-0 grid grid-cols-3 gap-2">
            <div className="min-w-0 rounded-md border border-zinc-200 bg-zinc-50 p-2">
              <dt className="text-zinc-500">Used</dt>
              <dd className="m-0 mt-0.5 break-words font-semibold text-zinc-950">
                {METHOD_LABELS[method]}
              </dd>
            </div>
            <div className="min-w-0 rounded-md border border-zinc-200 bg-zinc-50 p-2">
              <dt className="text-zinc-500">Input text</dt>
              <dd className="m-0 mt-0.5 break-words font-semibold text-zinc-950">
                {result.textContent.length}
              </dd>
            </div>
            <div className="min-w-0 rounded-md border border-zinc-200 bg-zinc-50 p-2">
              <dt className="text-zinc-500">Readability</dt>
              <dd className="m-0 mt-0.5 break-words font-semibold text-zinc-950">
                {result.readabilityTextLength ?? '-'}
              </dd>
            </div>
          </dl>

          <div className="grid min-w-0 gap-[7px] rounded-md border border-zinc-200 bg-zinc-50 p-[10px]">
            <p className="m-0 break-words font-semibold text-zinc-950">
              {result.title || 'Untitled page'}
            </p>
            <pre className="m-0 max-h-[min(320px,42vh)] overflow-auto whitespace-pre-wrap break-words rounded text-zinc-800">
              {result.textContent.slice(0, 3600)}
            </pre>
          </div>
        </>
      ) : null}
    </div>
  );
}
