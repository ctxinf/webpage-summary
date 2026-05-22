import { getUiMessages } from '@/lib/i18n';
import { OptionsPageTitle } from '../OptionsPageTitle';
import { RoutePlaceholder } from '../RoutePlaceholder';

export function CreateModelPage() {
  const messages = getUiMessages();

  return (
    <>
      <OptionsPageTitle>{messages.pageTitles.createModel}</OptionsPageTitle>
      <RoutePlaceholder density="compact" />
    </>
  );
}
