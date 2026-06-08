import { cn } from '@/lib/utils';

export type PlaceholderDensity = 'default' | 'compact' | 'wide';

type RoutePlaceholderProps = {
  density?: PlaceholderDensity;
};

const densityClasses: Record<PlaceholderDensity, string> = {
  compact: 'max-w-xl',
  default: 'max-w-3xl',
  wide: 'max-w-4xl',
};

export function RoutePlaceholder({ density = 'default' }: RoutePlaceholderProps) {
  const rowCount = density === 'compact' ? 3 : 5;

  return (
    <div
      aria-hidden="true"
      className={cn('mr-auto flex flex-col gap-8', densityClasses[density])}
    >
      {Array.from({ length: rowCount }, (_, index) => (
        <div
          className="flex min-h-[62px] items-center justify-between gap-8 border-b border-b-transparent"
          key={index}
        >
          <div className="grid flex-1 gap-2">
            <div className="h-6 w-[min(15rem,60%)] rounded bg-muted" />
            <div className="h-4 w-[min(28rem,88%)] rounded bg-muted/70" />
          </div>
          <div className="h-8 w-16 shrink-0 rounded-md border bg-background" />
        </div>
      ))}
    </div>
  );
}
