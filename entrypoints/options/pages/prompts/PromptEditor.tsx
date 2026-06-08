import { Save } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  PROMPT_TEMPLATE_VARIABLES,
  type PromptDraft,
} from '@/constants/prompt-settings';
import { getUiMessages } from '@/lib/i18n';

type PromptEditorProps = {
  initialDraft: PromptDraft;
  isSaving: boolean;
  onSubmit: (draft: PromptDraft) => void | Promise<void>;
  submitLabel: string;
};

export function PromptEditor({
  initialDraft,
  isSaving,
  onSubmit,
  submitLabel,
}: PromptEditorProps) {
  const messages = getUiMessages();
  const [draft, setDraft] = useState(initialDraft);

  useEffect(() => {
    setDraft(initialDraft);
  }, [initialDraft]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(draft);
  }

  function updateDraft<Key extends keyof PromptDraft>(
    key: Key,
    value: PromptDraft[Key],
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }));
  }

  return (
    <form className="grid max-w-4xl gap-7 pb-24" onSubmit={handleSubmit}>
      <section className="border-b pb-7">
        <label className="flex max-w-2xl items-center gap-3" htmlFor="prompt-name">
          <span className="shrink-0 text-sm font-medium">
            {messages.prompts.name}
          </span>
          <input
            autoFocus
            className="h-9 min-w-0 flex-1 rounded-md border bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            id="prompt-name"
            onChange={(event) => updateDraft('name', event.currentTarget.value)}
            placeholder={messages.prompts.namePlaceholder}
            required
            spellCheck={false}
            value={draft.name}
          />
        </label>
      </section>

      <section aria-label={messages.prompts.templateVariables} className="grid gap-3 border-b pb-7">
        <header>
          <h2 className="text-base font-semibold">
            {messages.prompts.templateVariables}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            {messages.prompts.templateVariablesDescription}
          </p>
        </header>

        <div className="grid max-w-2xl overflow-hidden rounded-md border border-lime-400/40 bg-gradient-to-r from-lime-100 to-blue-200 text-black shadow-sm sm:grid-cols-[auto_minmax(0,1fr)]">
          {PROMPT_TEMPLATE_VARIABLES.map((variable) => (
            <div className="contents" key={variable.key}>
              <code className="border-b border-black/10 px-3 py-2 text-sm">{`{{${variable.key}}}`}</code>
              <p className="border-b border-black/10 px-3 py-2 text-sm text-black/75">
                {messages.prompts.variableDescriptions[variable.descriptionKey]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5">
        <label className="grid gap-2" htmlFor="prompt-system-message">
          <span className="text-sm font-medium">
            {messages.prompts.systemMessage}
          </span>
          <textarea
            className="min-h-64 resize-y rounded-md border bg-background px-3 py-2 font-mono text-sm leading-6 shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            id="prompt-system-message"
            onChange={(event) =>
              updateDraft('systemMessage', event.currentTarget.value)
            }
            required
            spellCheck={false}
            value={draft.systemMessage}
          />
        </label>

        <label className="grid gap-2" htmlFor="prompt-user-message">
          <span className="text-sm font-medium">
            {messages.prompts.userMessage}
          </span>
          <textarea
            className="min-h-52 resize-y rounded-md border bg-background px-3 py-2 font-mono text-sm leading-6 shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            id="prompt-user-message"
            onChange={(event) =>
              updateDraft('userMessage', event.currentTarget.value)
            }
            required
            spellCheck={false}
            value={draft.userMessage}
          />
        </label>
      </section>

      <footer className="sticky bottom-0 flex items-center gap-3 border-t bg-background/95 py-4 backdrop-blur">
        <Button disabled={isSaving} type="submit">
          <Save />
          {isSaving ? messages.common.saving : submitLabel}
        </Button>
      </footer>
    </form>
  );
}
