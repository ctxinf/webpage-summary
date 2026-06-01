/**
 * @file cors-fix.ts
 * @description Universal CORS bypass for AI API requests made from the background service worker.
 *
 * ## The Problem
 *
 * Chrome extensions declare host permissions in the manifest (e.g. `<all_urls>`), but Chrome
 * also lets users override those permissions at runtime via the extension's context menu:
 *   "This extension can read and change site data" → "On all sites" | "On specific sites" | "On click"
 *
 * When a user switches from "On all sites" to "On specific sites", Chrome revokes the runtime
 * host permission for all non-listed origins — even though the manifest still declares `<all_urls>`.
 *
 * This has a critical side-effect on background service worker fetch() calls:
 *
 *   Chrome attaches an `Origin: chrome-extension://<id>` header to every outbound request.
 *   Third-party API servers (OpenAI, Anthropic, Cerebras, Gemini, etc.) do not include
 *   `chrome-extension://` origins in their Access-Control-Allow-Origin policy, so the browser
 *   blocks the response (or the preflight OPTIONS) with:
 *
 *     "Response to preflight request doesn't pass access control check:
 *      No 'Access-Control-Allow-Origin' header is present on the requested resource."
 *
 *   When site access IS "On all sites", Chrome exempts extension-initiated requests from CORS
 *   checks entirely (because the extension has host permission for those origins). That is why
 *   the extension works in that mode and fails in restricted mode.
 *
 * ## Why Removing `Origin` From the Request Does NOT Fix It
 *
 * An earlier version of this file used `declarativeNetRequest` to strip the `Origin` header
 * from outbound requests. That does NOT work.
 *
 * Chrome's network stack enforces CORS based on the *internal* request initiator origin, not
 * on the `Origin` header value present in the wire bytes. Even after the header is removed by
 * a declarativeNetRequest rule, Chrome still knows the request came from
 * `chrome-extension://<id>` and still checks the response for a matching
 * `Access-Control-Allow-Origin` header. Removing `Origin` from the request is a no-op from
 * CORS enforcement's perspective.
 *
 * ## The Actual Fix: Inject `Access-Control-Allow-Origin` Into the Response
 *
 * `declarativeNetRequest` can also modify *response* headers. By injecting
 *
 *   Access-Control-Allow-Origin: chrome-extension://<extensionId>
 *
 * into every response for requests that originated from this extension, we satisfy the
 * browser's CORS check. The browser compares the header value against the request's origin
 * and, finding a match, allows the response to be read by the extension code.
 *
 * We also inject `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers` to handle
 * preflight (OPTIONS) responses, which API servers typically send for POST requests with a
 * JSON body and custom headers such as `Authorization`.
 *
 * ## Why `Access-Control-Allow-Headers: *` Is Safe Here
 *
 * The wildcard `*` for allowed headers is only forbidden when the request is made with
 * credentials (cookies, HTTP basic auth). Extension background fetches use API keys in the
 * `Authorization` header — this is not a CORS "credentialed" request — so the wildcard is
 * valid and avoids enumerating every possible header each AI SDK might send.
 *
 * ## Relationship to the Original Project
 *
 * The upstream project (reference/) solved a related but narrower problem for kimi.com by
 * rewriting the `origin` / `referer` request headers to the target domain. That approach works
 * for servers that do echo-back CORS (i.e., respond with `Access-Control-Allow-Origin` matching
 * the received `Origin`) but fails for servers that hard-code their CORS allowlist.
 *
 * Injecting ACAO into the *response* works universally regardless of the server's CORS policy.
 *
 * ## Required Manifest Permissions
 *
 * `declarativeNetRequest` must be listed in the manifest `permissions`. It is added in
 * wxt.config.ts. This permission does NOT require user approval during installation.
 *
 * ## Firefox
 *
 * Firefox does not support `declarativeNetRequest` `modifyHeaders` for response headers in
 * the same way. The upstream project used `webRequest` + `webRequestBlocking` on Firefox.
 * That path is not yet implemented here; Firefox users are currently unaffected because
 * Firefox handles extension CORS differently when `<all_urls>` is in the manifest.
 */

import { browser,  } from 'wxt/browser';

/**
 * Stable rule ID for the CORS fix rule.
 * Must not collide with other dynamic rules in this extension.
 * 1001 leaves room for future site-specific rules below this value.
 */
const CORS_FIX_RULE_ID = 1001;

/**
 * Registers a declarativeNetRequest rule that injects CORS response headers into
 * all API responses received by this extension's background service worker.
 *
 * This makes Chrome treat those responses as if the server explicitly allowed the
 * `chrome-extension://<id>` origin, satisfying the same-origin policy check.
 *
 * Call once during background startup, before any AI API requests are made.
 */
export async function setupCorsFixRule() {
  // declarativeNetRequest responseHeaders modification is a Chrome-only solution.
  // Firefox uses webRequest; skip here.
  if (import.meta.env.FIREFOX) {
    return;
  }

  // `browser.runtime.id` is the bare extension ID (the <id> portion of
  // `chrome-extension://<id>/`). Chrome's declarativeNetRequest uses this
  // form (without the scheme) for `initiatorDomains`.
  const extensionId = browser.runtime.id;

  // The full chrome-extension:// origin string — this is what the browser
  // compares against Access-Control-Allow-Origin in the response.
  const extensionOrigin = `chrome-extension://${extensionId}`;

  const rule:Browser.declarativeNetRequest.Rule = {
    id: CORS_FIX_RULE_ID,
    priority: 1,
    action: {
      type: 'modifyHeaders',
      responseHeaders: [
        {
          // This is the core fix. Without this header (or with a mismatched
          // value), Chrome blocks the response. Setting it to the exact origin
          // of the requesting extension makes Chrome accept the response.
          //
          // We use `set` (not `append`) so that if the server already sends
          // a conflicting ACAO value (e.g. a wildcard `*` that Chrome rejects
          // in some scenarios), we overwrite it with the precise origin.
          operation: 'set',
          header: 'Access-Control-Allow-Origin',
          value: extensionOrigin,
        },
        {
          // Preflight (OPTIONS) responses must also declare which HTTP methods
          // are allowed. Cover every method used by AI SDKs.
          operation: 'set',
          header: 'Access-Control-Allow-Methods',
          value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD',
        },
        {
          // Wildcard `*` is valid for non-credentialed requests (see file-level
          // comment). This avoids enumerating `Authorization`, `Content-Type`,
          // `Accept`, `X-Api-Key`, and any other SDK-specific headers.
          operation: 'set',
          header: 'Access-Control-Allow-Headers',
          value: '*',
        },
      ],
    },
    condition: {
      // Match any URL so all AI API endpoints are covered regardless of which
      // provider the user configures. The `initiatorDomains` filter below
      // ensures this rule only fires for extension-initiated requests.
      urlFilter: '*',

      // Only apply to requests initiated by this extension (background service
      // worker, popup, options page). Regular web page requests are not affected.
      initiatorDomains: [extensionId],

      // `xmlhttprequest` covers both fetch() and XHR as classified by Chrome's
      // network stack for the purpose of declarativeNetRequest conditions.
      resourceTypes: ['xmlhttprequest'],
    },
  };

  try {
    // Remove any stale version of this rule before re-adding it.
    // Handles extension updates and hot-reloads during development without
    // leaving duplicate or outdated rules in the dynamic ruleset.
    const existingRules = await browser.declarativeNetRequest.getDynamicRules();
    const existingIds = existingRules.map((r) => r.id);

    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingIds.includes(CORS_FIX_RULE_ID) ? [CORS_FIX_RULE_ID] : [],
      addRules: [rule],
    });

    console.log(
      '[cors-fix] Response CORS headers rule registered via declarativeNetRequest',
      '(rule id:', CORS_FIX_RULE_ID, ', origin:', extensionOrigin, ')',
    );
  } catch (err) {
    // Non-fatal: without this rule the extension still works when the user has
    // "On all sites" access. It only fails when access is restricted to
    // specific sites. Log and continue rather than crashing the background.
    console.error('[cors-fix] Failed to register CORS fix rule:', err);
  }
}
