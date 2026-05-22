# React Prompt Settings Rewrite

## Current State Before This Pass

The React options router already exposed `/prompts`, `/prompts/create`, and
`/prompts/edit`, but each route was still a placeholder. The only complete
prompt management implementation lived in `reference/`:

- Prompt templates are stored in `local:prompt-configs`.
- The selected default prompt ID is stored in `local:default-prompt-id`.
- A prompt template contains `id`, `name`, `systemMessage`, `userMessage`, and
  `at`.
- The reference options page supports create, edit, delete, ordering, choosing
  the default prompt, and creating from presets.
- Template variables exposed by the reference flow are
  `{{summaryLanguage}}`, `{{articleUrl}}`, `{{textContent}}`, and
  `{{currentSelection}}`.

## Rewrite Shape

This pass keeps the reference storage keys for compatibility and splits prompt
settings into two React-side layers:

- `constants/prompt-settings.ts` defines prompt records, preset templates,
  template variables, storage keys, and the reserved per-site prompt rule type.
- `lib/prompt-settings-storage.ts` owns loading, parsing, validation, CRUD,
  ordering, default-prompt selection, and first-install Sample prompt creation.

The options UI now uses those APIs instead of mutating storage inside page
components. `/prompts` is the management list; create and edit routes share the
same editor surface.

## Site Prompt Reservation

Per-site prompt selection should be a routing rule over prompt templates, not a
special prompt template shape. A single template may remain reusable globally
while a site rule points a matching site pattern at a prompt ID.

The rewrite reserves this boundary now:

- Storage key: `local:site-prompt-rules`
- Rule type: `SitePromptRule`
- Fields: `id`, `enable`, `pattern`, `promptId`, and `at`

The current UI does not edit these rules yet because the React site
customization page is still a placeholder. When that page is implemented it can
share site matching rules with prompt routing without migrating the prompt
library.
