import { getUiMessages } from '@/lib/i18n';
import { OptionsPageTitle } from './OptionsPageTitle';
import { RoutePlaceholder } from './RoutePlaceholder';

export function SiteCustomizationPage() {
  const messages = getUiMessages();

  return (
    <>
      <OptionsPageTitle>{messages.pageTitles.siteCustomization}</OptionsPageTitle>
      <RoutePlaceholder density="wide" />
    </>
  );
}
