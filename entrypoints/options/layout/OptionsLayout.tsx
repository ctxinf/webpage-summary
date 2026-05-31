import { ArrowLeft,  Languages } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { ENABLE_SAMPLES } from '@/constants/flag';
import {
  getUiLocale,
  getUiMessages,
  setUiLocaleOverride,
  UI_LOCALE_OPTIONS,
  type UiLocale,
} from '@/lib/i18n';
import { cn } from '@/lib/utils';

type SidebarLink = {
  label: string;
  to: string;
};

function OptionsSidebarLink({ label, to }: SidebarLink) {
  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          'flex min-h-9 items-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-gray-200 text-green-600'
            : 'text-foreground hover:bg-accent hover:text-accent-foreground',
        )
      }
      to={to}
    >
      <span className="ml-1">{label}</span>
    </NavLink>
  );
}

function isDetailRoute(pathname: string) {
  return pathname.split('/').filter(Boolean).length > 1;
}

function reloadOptionsPage() {
  window.location.reload();
}

export function OptionsLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const manifest = browser.runtime.getManifest();
  const messages = getUiMessages();
  const currentLocale = getUiLocale();
  const primaryLinks: SidebarLink[] = [
    { label: messages.options.navigation.interface, to: '/interface' },
    { label: messages.options.navigation.general, to: '/general' },

    { label: messages.options.navigation.models, to: '/models' },
    { label: messages.options.navigation.prompts, to: '/prompts' },
    {
      label: messages.options.navigation.siteCustomization,
      to: '/site-customization',
    },
    { label: messages.options.navigation.exportImport, to: '/config_manager' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex min-h-11 flex-row items-center gap-1 px-4 py-2 shadow-md">
        <div className="flex min-w-0 items-center gap-2">
          <img alt="" className="size-6 shrink-0" src="/icon/32.png" />
          <h1 className="truncate font-semibold">
            {manifest.name}{' '}
            <span className="text-xs font-light">{manifest.version}</span>
          </h1>
        </div>

        <div className="grow" />
        <div className="flex min-w-0 items-center gap-4">
          <label className="inline-flex h-8 min-w-0 items-center gap-1 rounded-md border bg-background px-2 text-sm shadow-sm">
            <Languages className="shrink-0 text-muted-foreground" size={15} />
            <span className="sr-only">{messages.options.header.language}</span>
            <select
              aria-label={messages.options.header.language}
              className="min-w-0 bg-transparent text-xs font-medium outline-none"
              onChange={(event) => {
                setUiLocaleOverride(event.currentTarget.value as UiLocale);
                reloadOptionsPage();
              }}
              value={currentLocale}
            >
              {UI_LOCALE_OPTIONS.map((locale) => (
                <option key={locale.value} value={locale.value}>
                  {locale.label}
                </option>
              ))}
            </select>
          </label>
          <a
            aria-label="GitHub"
            className="grid size-8 shrink-0 place-items-center text-neutral-600 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            href="https://github.com/slow-groovin/webpage-summary"
            rel="noreferrer noopener"
            target="_blank"
            title="GitHub"
          >
            <GithubIcon size={20} />
          </a>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 max-sm:flex-col">
        <nav
          aria-label={messages.options.navigationLabel}
          className="w-[196px] shrink-0 border-r-2 pt-4 max-sm:w-full max-sm:border-b-2 max-sm:border-r-0 max-sm:pb-4"
        >
          <div className="grid">
            {primaryLinks.map((link) => (
              <OptionsSidebarLink key={link.to} {...link} />
            ))}
          </div>

          {ENABLE_SAMPLES ? (
            <>
              <div className="mx-4 my-4 border-b" />
              <a
                className="mx-4 block rounded-sm px-1 text-sm font-extralight text-gray-500 transition-colors hover:text-foreground"
                href="?samples=1"
              >
                {messages.options.debug}
              </a>
            </>
          ) : null}
        </nav>

        <main className="relative ml-8 w-full max-w-5xl flex-1 p-4 max-sm:ml-0">
          {isDetailRoute(location.pathname) ? (
            <Button
              aria-label={messages.common.back}
              className="mb-1 size-6 rounded-sm p-0 [&_svg]:size-3.5"
              onClick={() => navigate(-1)}
              size="icon"
              type="button"
              variant="outline"
            >
              <ArrowLeft />
            </Button>
          ) : null}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
