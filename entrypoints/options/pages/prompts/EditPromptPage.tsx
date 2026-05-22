import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import type { PromptConfigItem, PromptDraft } from '@/constants/prompt-settings';
import { getUiMessages } from '@/lib/i18n';
import {
  loadPromptSettings,
  updatePrompt,
} from '@/lib/prompt-settings-storage';
import { OptionsPageTitle } from '../OptionsPageTitle';
import { PromptEditor } from './PromptEditor';

export function EditPromptPage() {
  const messages = getUiMessages();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const promptId = searchParams.get('id');
  const [prompt, setPrompt] = useState<PromptConfigItem | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        if (!promptId) {
          throw new Error(messages.prompts.missingPromptId);
        }

        const settings = await loadPromptSettings();
        const loadedPrompt = settings.prompts.find(
          (item) => item.id === promptId,
        );

        if (!loadedPrompt) {
          throw new Error(messages.prompts.promptNotFound);
        }

        if (!active) return;

        setPrompt(loadedPrompt);
      } catch (error) {
        if (!active) return;

        setLoadError(
          error instanceof Error ? error.message : messages.prompts.loadFailed,
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [
    messages.prompts.loadFailed,
    messages.prompts.missingPromptId,
    messages.prompts.promptNotFound,
    promptId,
  ]);

  async function handleSubmit(draft: PromptDraft) {
    if (!promptId) return;

    setIsSaving(true);

    try {
      await updatePrompt(promptId, draft);
      toast.success(messages.prompts.savedToast);
      navigate('/prompts');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : messages.prompts.saveFailed,
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <OptionsPageTitle>{messages.pageTitles.editPrompt}</OptionsPageTitle>
      {loadError ? (
        <div className="grid max-w-2xl gap-4 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <p>{loadError}</p>
          <Button asChild className="justify-self-start" variant="outline">
            <Link to="/prompts">{messages.common.back}</Link>
          </Button>
        </div>
      ) : null}

      {isLoading ? (
        <div className="text-sm text-muted-foreground">
          {messages.common.loadingSettings}
        </div>
      ) : null}

      {prompt ? (
        <PromptEditor
          initialDraft={{
            name: prompt.name,
            systemMessage: prompt.systemMessage,
            userMessage: prompt.userMessage,
          }}
          isSaving={isSaving}
          onSubmit={handleSubmit}
          submitLabel={messages.common.save}
        />
      ) : null}
    </>
  );
}
