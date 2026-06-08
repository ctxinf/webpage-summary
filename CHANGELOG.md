# Changelog
## [0.7.3] - 2026-06-01
Complete refactoring!
Main features:
1. Brand new UI, comprehensively improved user experience
2. Sidebar mode (switching between floating panel and sidebar)
3. Clip content by token count now (by string length before)
4. Optimized AI providers settings, added support for response APIs
5. Completely redesigned settings interface

More:
1. Model config supports custom body
2. Support for fetching AI provider's models list on the model config page
3. Token usage visualization panel


Dependency changes:
1. vue3 -> react
2. ai-sdk@4.x -> ai-sdk@6.x
3. Self-implemented chat UI -> ai-elements
4. Self-implemented content<->background communication protocol supporting chat -> ai-sdk-ui + custom transport over connect API
5. String counting -> token counting (brings an extra 3MB bundle size)
 



## [0.6.2] - 2026-02-01
feature: shadowRoot support for selectors in site customization setting. @linkecoding


## [0.6.1] - 2025-12-01
1. optimize the descriptions and ordering of the general settings.
2. feature: add configuration options to enable/disable context menu items.
3. feature: add a configuration option to allowing “Add to Selection” to send directly.
4. update moonshot-web-ai-provider version, kimi chats are now deleted after the summary completes.

## [0.6.0] - 2025-09-14
1. switch size unit from `rem` to `--webpage-summary-panel-srem`, avoid some sites' html root font-size setting to affect the style of shadow root.
2. feature: add `currentSelection` prompt template variable.

## [0.5.0] - 2025-08-17
1. change project structure from monorepo workspace to regular.
2. update wxt version from 0.19 to 0.20
3. change pnpm to bun (required by wxt@0.20)
4. fix: in some websites (reddit, bilibili, ...), responsive css font sizes to fail.
5. remove some console logs
6. optimize appearance styles
7. feature: provide config to enable/disable chatbox
8. implement the logic for stopping summarize
9. implenent whitelist/blacklist
10. implement site custom selectors

## [0.4.2] - 2025-07-18
update moonshot-web-provider.
delete chatgpt-web-provide because of the the official crackdown on such behavior.

## [0.3.5] - 2025-06-08
fix chat boxt input being affected by single-key shortcuts in sites like github. 

## [0.3.3] - 2025-04-21

fix model name component error in web provider config

## [0.3.2] - 2025-04-20

use dynamic rules to achive scecure declare.

## [0.3.1] - 2025-04-20

feature: support web providers.

## [0.2.2] - 2025-03-25

1. fix `--webpage-summary-panel-top` not working
2. add video tutorial in welcome page

## [0.2.1] - 2025-03-12

1. feature: a context menu item and a command for adding selection to chat input.
2. feature: add clear/reset for clearing all the messages in panel's dialog.
3. feature: support creating multiple panels (for comparing summary of different models or prompts)
4. add adaptation to SPA (Single Page Application), input page content will change when SPA change route.
5. fix: now chatting directly without first summarizing will send messages with page context.
6. fix: draggable functionality using `px` causing it out of view in screen adjustment situations such as changing from vertical to horizontal.
7. fix: write to clipboar failed in page of http protocol
8. optimize prompt item view, add prompt preset view for creating prompt with, add another two prompt presets, and with langs of `zh-CN` and `zh-TW`.

## [0.1.5] - 2025-02-27

1. input length calculation now does not include continuous '\n', ' '

## [0.1.4] - 2025-02-27

1. fix: double panel appears when trigger by action/contentMenu under `on click` permission mode
2. add language:zh for chrome store
3. toaster background color: transparent -> white(80%)
4. fix: error hint not show when call llm failed.( streamText() feature changes when updating @ai-sdk version)
5. fix: openai-compatible default baseURL has no effect.

## [0.1.3] - 2025-02-26

1. adaption to firefox
2. new feature: export/import settings

## [0.1.2] - 2025-02-25

1. add multiple llm providers.
2. fix `open setting` context button not work outside page
3. fix page problems: model config list page: add i18n, use full width, model edit: query problems

## [0.1.1] - 2025-02-24

1. change shortcut of user chatbox: `Shift+Enter : Submit` -> `Shift+Enter: newline` and `Enter: Submit`
2. welcome page on first install
3. improve browser extension declaration(fix permission lacks problem in Edge)
4. clean up some unused codes

## [0.1.0] - 2025-02-23

### The first fully functional version
