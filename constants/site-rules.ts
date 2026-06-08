import type { StorageItemKey } from '#imports';

/**
 * Whitelist: when enabled, the extension is only active on URLs whose
 * `hostname` or `hostname + pathname` matches one of the glob patterns.
 */
export type WhiteList = {
  enable: boolean;
  patterns: string[];
};

/**
 * Blacklist: when enabled, the extension is disabled on URLs whose
 * `hostname` or `hostname + pathname` matches one of the glob patterns.
 */
export type BlackList = WhiteList;

/**
 * A user-defined rule that overrides the default extractor for matching
 * URLs by reading text from explicit CSS selectors (optionally drilling
 * into shadow roots).
 */
export type SiteCustomizationItem = {
  enable: boolean;
  pattern: string;
  selectors: string[];
  useShadowRoot?: boolean;
  shadowRootSelectors?: string[];
};

// Storage keys — kept identical to the Vue reference project for migration compatibility.
export const WHITELIST_STORAGE_KEY = 'local:site-filter-whitelist' satisfies StorageItemKey;
export const BLACKLIST_STORAGE_KEY = 'local:site-filter-blacklist' satisfies StorageItemKey;
export const SITE_CUSTOMIZATION_STORAGE_KEY = 'local:site-customization-list' satisfies StorageItemKey;

export const DEFAULT_WHITELIST: WhiteList = {
  enable: false,
  patterns: [],
};

export const DEFAULT_BLACKLIST: BlackList = {
  enable: true,
  patterns: [],
};

export const DEFAULT_SITE_CUSTOMIZATION: SiteCustomizationItem[] = [];

export function isWhiteListLike(value: unknown): value is WhiteList {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.enable === 'boolean' &&
    Array.isArray(v.patterns) &&
    v.patterns.every((p) => typeof p === 'string')
  );
}

export function isSiteCustomizationItem(
  value: unknown,
): value is SiteCustomizationItem {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  if (typeof v.enable !== 'boolean') return false;
  if (typeof v.pattern !== 'string') return false;
  if (!Array.isArray(v.selectors)) return false;
  if (!v.selectors.every((s) => typeof s === 'string')) return false;
  if (v.useShadowRoot !== undefined && typeof v.useShadowRoot !== 'boolean') return false;
  if (
    v.shadowRootSelectors !== undefined &&
    !(
      Array.isArray(v.shadowRootSelectors) &&
      v.shadowRootSelectors.every((s) => typeof s === 'string')
    )
  ) {
    return false;
  }
  return true;
}

export function parseSiteCustomizationList(value: unknown): SiteCustomizationItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isSiteCustomizationItem);
}
