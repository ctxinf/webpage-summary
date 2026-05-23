import { getUiMessages } from '@/lib/i18n';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  createEmptyModelDraft,
  createModelConfig,
} from '@/lib/model-settings-storage';
import { OptionsPageTitle } from '../OptionsPageTitle';
import { ModelEditor } from './ModelEditor';

export function CreateModelPage() {
  const messages = getUiMessages();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  return (
    <>
      <OptionsPageTitle>{messages.pageTitles.createModel}</OptionsPageTitle>
      <ModelEditor
        initialDraft={createEmptyModelDraft()}
        isSaving={isSaving}
        onSubmit={async (draft) => {
          setIsSaving(true);

          try {
            await createModelConfig(draft);
            toast.success('Model created.');
            navigate('/models');
          } finally {
            setIsSaving(false);
          }
        }}
        submitLabel="Create"
      />
    </>
  );
}
