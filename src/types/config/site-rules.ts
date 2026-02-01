/**
 * for whitelist mode: decide if current hostname or hostname+path can apply this extension.
 */
export type WhiteList = {
  /**
   * 
   */
  enable: boolean,
  /**
   * glob patterns for hostname or hostname+path
   */
  patterns: string[],
}

/**
 * for blacklist mode
 */
export type BlackList = WhiteList;


/**
 * for specific patterns: use specific selectors instead of default method to get input contents for summarizing.
 */
export type SiteCumstomizationItem = {
  enable: boolean,
  pattern: string,
  selectors: string[],
  useShadowRoot?: boolean,
  shadowRootSelectors?: string[],
}