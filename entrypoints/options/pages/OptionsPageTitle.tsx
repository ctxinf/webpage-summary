import type { PropsWithChildren } from 'react';

export function OptionsPageTitle({ children }: PropsWithChildren) {
  return (
    <h1 className="mb-4 text-2xl font-semibold leading-tight">{children}</h1>
  );
}
