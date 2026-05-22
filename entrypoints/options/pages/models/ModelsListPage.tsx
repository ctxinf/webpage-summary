import { getUiMessages } from '@/lib/i18n';
import { OptionsPageTitle } from '../OptionsPageTitle';
import { RoutePlaceholder } from '../RoutePlaceholder';

export function ModelsListPage() {
  const messages = getUiMessages();

  return (
    <>
      <OptionsPageTitle>{messages.pageTitles.models}</OptionsPageTitle>
      <RoutePlaceholder density="compact" />
    </>
  );
}
