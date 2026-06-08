export const PAGE_TEXT_EXTRACT_METHODS = [
  'readability',
  'dom-heuristic',
] as const;

export type PageTextExtractMethod = (typeof PAGE_TEXT_EXTRACT_METHODS)[number];

export function isPageTextExtractMethod(
  value: unknown,
): value is PageTextExtractMethod {
  return (
    typeof value === 'string' &&
    PAGE_TEXT_EXTRACT_METHODS.includes(value as PageTextExtractMethod)
  );
}
