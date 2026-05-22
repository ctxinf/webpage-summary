import { getUiMessages } from '@/lib/i18n';
import { OptionsPageTitle } from './OptionsPageTitle';
import { RoutePlaceholder } from './RoutePlaceholder';

export function AppearancePage() {
  const messages = getUiMessages();

  return (
    <>
      <OptionsPageTitle>{messages.pageTitles.appearance}</OptionsPageTitle>
      <RoutePlaceholder density="wide" />
    </>
  );
}
