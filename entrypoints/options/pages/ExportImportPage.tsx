import { getUiMessages } from '@/lib/i18n';
import { OptionsPageTitle } from './OptionsPageTitle';
import { RoutePlaceholder } from './RoutePlaceholder';

export function ExportImportPage() {
  const messages = getUiMessages();

  return (
    <>
      <OptionsPageTitle>{messages.pageTitles.exportImport}</OptionsPageTitle>
      <RoutePlaceholder density="compact" />
    </>
  );
}
