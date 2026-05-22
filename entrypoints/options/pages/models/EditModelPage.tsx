import { getUiMessages } from '@/lib/i18n';
import { OptionsPageTitle } from '../OptionsPageTitle';
import { RoutePlaceholder } from '../RoutePlaceholder';

export function EditModelPage() {
  const messages = getUiMessages();

  return (
    <>
      <OptionsPageTitle>{messages.pageTitles.editModel}</OptionsPageTitle>
      <RoutePlaceholder density="compact" />
    </>
  );
}
