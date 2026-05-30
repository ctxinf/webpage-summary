import { storage } from '#imports';
// @ts-expect-error -- picomatch ships no bundled types and we don't want a hard dep on @types/picomatch.
import picomatch from 'picomatch';

type PicomatchMatcher = (input: string) => boolean;
const compilePicomatch = picomatch as (
  pattern: string,
  options?: { dot?: boolean; nocase?: boolean },
) => PicomatchMatcher;
import {
  BLACKLIST_STORAGE_KEY,
  DEFAULT_BLACKLIST,
  DEFAULT_SITE_CUSTOMIZATION,
  DEFAULT_WHITELIST,
  isWhiteListLike,
  parseSiteCustomizationList,
  SITE_CUSTOMIZATION_STORAGE_KEY,
  WHITELIST_STORAGE_KEY,
  type BlackList,
  type SiteCustomizationItem,
  type WhiteList,
} from '@/constants/site-rules';

export type SiteRulesSnapshot = {
  whitelist: WhiteList;
  blacklist: BlackList;
  siteCustomization: SiteCustomizationItem[];
};

export async function loadWhitelist(): Promise<WhiteList> {
  const raw = await storage.getItem<unknown>(WHITELIST_STORAGE_KEY);
  return isWhiteListLike(raw) ? raw : { ...DEFAULT_WHITELIST };
}

export async function loadBlacklist(): Promise<BlackList> {
  const raw = await storage.getItem<unknown>(BLACKLIST_STORAGE_KEY);
  return isWhiteListLike(raw) ? raw : { ...DEFAULT_BLACKLIST };
}

export async function loadSiteCustomization(): Promise<SiteCustomizationItem[]> {
  const raw = await storage.getItem<unknown>(SITE_CUSTOMIZATION_STORAGE_KEY);
  return raw == null ? [...DEFAULT_SITE_CUSTOMIZATION] : parseSiteCustomizationList(raw);
}

export async function loadSiteRules(): Promise<SiteRulesSnapshot> {
  const [whitelist, blacklist, siteCustomization] = await Promise.all([
    loadWhitelist(),
    loadBlacklist(),
    loadSiteCustomization(),
  ]);
  return { whitelist, blacklist, siteCustomization };
}

export async function saveWhitelist(value: WhiteList) {
  await storage.setItem(WHITELIST_STORAGE_KEY, value);
}

export async function saveBlacklist(value: BlackList) {
  await storage.setItem(BLACKLIST_STORAGE_KEY, value);
}

export async function saveSiteCustomization(value: SiteCustomizationItem[]) {
  await storage.setItem(SITE_CUSTOMIZATION_STORAGE_KEY, value);
}

/**
 * Modern glob matcher used for site rules.
 *
 * Patterns follow the same syntax as the original minimatch-based rules
 * (e.g. `www.reddit.com`, `*.reddit.com`, `www.reddit.com/r/**`).
 * picomatch is a drop-in superset for that syntax, faster and tiny.
 */
const matcherCache = new Map<string, PicomatchMatcher>();

function getMatcher(pattern: string): PicomatchMatcher {
  const cached = matcherCache.get(pattern);
  if (cached) return cached;
  let matcher: PicomatchMatcher;
  try {
    matcher = compilePicomatch(pattern, { dot: true, nocase: true });
  } catch {
    matcher = () => false;
  }
  matcherCache.set(pattern, matcher);
  return matcher;
}

export function matchPattern(pattern: string, input: string) {
  return getMatcher(pattern)(input);
}

function anyPatternMatches(patterns: string[], hostname: string, hostnameWithPath: string) {
  return patterns.some(
    (pattern) => matchPattern(pattern, hostname) || matchPattern(pattern, hostnameWithPath),
  );
}

/**
 * Decide whether the extension should be active on the given URL,
 * given the configured whitelist and blacklist.
 *
 * Mirrors the reference implementation's precedence: whitelist (if enabled)
 * wins; otherwise blacklist (if enabled) is consulted; otherwise allow.
 */
export function isUrlAllowed(
  url: URL | Location,
  whitelist: WhiteList,
  blacklist: BlackList,
): boolean {
  const hostname = url.hostname;
  const path = url.pathname || '';
  const hostnameWithPath = hostname + path;

  if (whitelist.enable) {
    return anyPatternMatches(whitelist.patterns, hostname, hostnameWithPath);
  }

  if (blacklist.enable) {
    return !anyPatternMatches(blacklist.patterns, hostname, hostnameWithPath);
  }

  return true;
}

/**
 * Find the first enabled customization rule whose pattern matches the URL.
 */
export function findMatchingCustomization(
  url: URL | Location,
  customizations: SiteCustomizationItem[],
): SiteCustomizationItem | undefined {
  const hostname = url.hostname;
  const path = url.pathname || '';
  const hostnameWithPath = hostname + path;

  return customizations.find(
    (item) =>
      item.enable &&
      (matchPattern(item.pattern, hostname) ||
        matchPattern(item.pattern, hostnameWithPath)),
  );
}
