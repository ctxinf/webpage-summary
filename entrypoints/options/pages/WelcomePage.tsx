import { getUiMessages } from '@/lib/i18n';
import { OptionsPageTitle } from './OptionsPageTitle';
import { RoutePlaceholder } from './RoutePlaceholder';

export function WelcomePage() {
  const messages = getUiMessages();

  return (
    <>
      <OptionsPageTitle>{messages.pageTitles.welcome}</OptionsPageTitle>
      <RoutePlaceholder density="compact" />
    </>
  );
}
