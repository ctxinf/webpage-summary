import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import {
  getPromptPreset,
  isPromptPresetKey,
  type PromptDraft,
} from '@/constants/prompt-settings';
import { getUiMessages } from '@/lib/i18n';
import { createPrompt } from '@/lib/prompt-settings-storage';
import { OptionsPageTitle } from '../OptionsPageTitle';
import { PromptEditor } from './PromptEditor';

export function CreatePromptPage() {
  const messages = getUiMessages();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSaving, setIsSaving] = useState(false);
  const presetKey = searchParams.get('preset');
  const preset = getPromptPreset(
    isPromptPresetKey(presetKey) ? presetKey : 'basic',
  );
  const initialDraft = useMemo<PromptDraft>(
    () => ({
      name: preset.name,
      systemMessage: preset.systemMessage,
      userMessage: preset.userMessage,
    }),
    [preset],
  );

  async function handleSubmit(draft: PromptDraft) {
    setIsSaving(true);

    try {
      await createPrompt(draft);
      toast.success(messages.prompts.createdToast);
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
      <OptionsPageTitle>{messages.pageTitles.createPrompt}</OptionsPageTitle>
      <PromptEditor
        initialDraft={initialDraft}
        isSaving={isSaving}
        onSubmit={handleSubmit}
        submitLabel={messages.prompts.create}
      />
    </>
  );
}
