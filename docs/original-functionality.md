# Raw Functionality Inventory

本文档从 `reference/` 源码直接推断原项目功能，不以 README 为准。它包含用户可见功能、后台/配置/通信等结构性功能，以及重写时需要保留或重新确认的实现细节。

## 1. 软件定位

原项目是一个基于 WXT + Vue 3 的浏览器扩展，用 AI 对当前网页内容做总结，并允许用户配置模型、提示词、页面提取方式、站点规则和面板外观。

主要运行上下文：

- `entrypoints/page.content/`：注入到网页中的内容脚本 UI，使用 Shadow DOM 挂载总结面板和悬浮球。
- `entrypoints/background/`：后台脚本，处理快捷键、右键菜单、LLM 流式调用、动态请求头规则、调试消息。
- `entrypoints/popup/`：扩展图标弹窗，提供“总结当前页”和“打开设置”。
- `entrypoints/options/`：扩展设置页，管理模型、提示词、通用开关、站点规则、页面提取、外观、导入导出。
- `entrypoints/kimi.content.ts`：针对 Kimi 网页的 token 抓取逻辑。

## 2. 用户可见功能

### 2.1 当前网页总结

- 对当前网页提取正文内容，然后用用户选择的 LLM 模型和 Prompt 生成 Markdown 总结。
- 默认提取方式是 `@mozilla/readability`，会读取 `title`、`textContent`、`excerpt`、`siteName`、`publishedTime`、`lang`、`articleUrl` 等字段。
- 总结输出使用流式渲染，边生成边显示。
- 支持停止正在运行的总结请求。
- 支持重新生成总结。
- 支持清空/重置当前对话。
- 支持复制当前对话记录到剪贴板，格式是 `role + content`，消息之间用分隔线。
- 总结内容按 Markdown 渲染，`markdown-it` 开启了 `html: true`、`linkify`、`typographer`。

### 2.2 总结面板

- 页面内注入一个可拖拽的浮动总结面板。
- 面板默认挂在 Shadow DOM 内，host 名称是 `webpage-summary`。
- 可通过 CSS 变量控制面板宽度、位置、背景、Markdown 字号/行高/颜色等。
- 面板顶部包含：
  - 扩展图标。
  - 状态按钮：准备中、首次开始、刷新、运行中、停止、失败详情。
  - 当前模型选择器。
  - 当前 Prompt 选择器。
  - 创建新面板按钮。
  - 最小化/关闭按钮。
  - 打开设置按钮。
- 面板内容区包含：
  - 输入长度查看/裁剪入口。
  - token 用量和费用显示。
  - 复制按钮。
  - 清空按钮。
  - go top / go bottom。
  - Markdown 消息列表。
- 支持多面板：第一个面板是 hide/minimize，后续新建面板可以 close。新面板会做轻微位置偏移。

### 2.3 悬浮球

- 页面右侧有可拖拽悬浮球，用于打开总结面板。
- 悬浮球松开后自动吸附右侧。
- 悬浮球垂直位置保存到 WXT storage，key 形如 `local:right-floating-ball-top-page`。
- 鼠标悬停后显示关闭按钮和 hover 提示。
- 悬浮球可通过 `local:enable-floating-ball` 开关隐藏。

### 2.4 Popup 行为

- 默认点击扩展图标会打开 popup，popup 中有：
  - 总结当前页面按钮。
  - 打开设置按钮。
  - 扩展名称、版本、图标。
- 可配置 `local:popup-click-trigger`，让点击扩展图标直接触发当前页总结并关闭 popup。

### 2.5 右键菜单和快捷键

- 右键菜单支持：
  - `summarize-this-page`：总结当前页。
  - `add-to-chat`：把选中文本加入聊天输入框。
  - `open-setting`：打开设置页。
- 右键菜单项可配置显示/隐藏：
  - `local:enable-context-menu-summarize-this-page`
  - `local:context-menu-add-selection-to-chat`
- 快捷键：
  - `COMMAND_INVOKE_SUMMARY`：默认 `Alt+S`，macOS 为 `Command+S`，触发总结面板。
  - `COMMAND_ADD_SELECTION`：默认 `Alt+A`，macOS 为 `Command+A`，添加选中文本到聊天。

### 2.6 继续聊天

- 总结面板底部可展开聊天输入框。
- 输入框支持 Enter 发送、Shift+Enter 换行。
- 为了避免 GitHub 等站点捕获普通按键，输入框聚焦时会对非组合键调用 `stopImmediatePropagation()`。
- 可以把页面当前选区或右键菜单选区追加到聊天输入框。
- 可配置添加选区后是否自动发送聊天：`local:enable-auto-begin-chat-for-add-selection-to-chat`。
- 如果没有可见消息且用户提交空内容，会触发首次总结。

## 3. 页面提取功能

### 3.1 通用提取

- `simpleParseRead()` 使用 `document.cloneNode(true)` 和 `new Readability(...).parse()` 获取文章主体。
- 会清理连续空白和换行。
- 返回 `articleUrl = window.location.href`。

### 3.2 站点自定义提取

- 站点规则保存在 `local:site-customization-list`。
- 规则字段：
  - `enable`
  - `pattern`
  - `selectors`
  - `useShadowRoot`
  - `shadowRootSelectors`
- 匹配方式使用 `minimatch`，匹配对象包括：
  - `window.location.hostname`
  - `window.location.hostname + window.location.pathname`
- 命中规则后不用 Readability，而是根据 CSS selector 抽取文本。
- 普通模式：直接 `document.querySelectorAll(selector)`。
- Shadow DOM 模式：
  - `selectors` 作为 host selector。
  - `shadowRootSelectors` 在每个 host 的 `shadowRoot` 内查询。
- 多个 selector 命中的 Element 会去重。
- 提取结果包装为类 Readability 结构，包括 `articleUrl`、`title`、`content`、`textContent`、`length`、`siteName` 等。

### 3.3 URL 白名单/黑名单

- 内容脚本虽然匹配 `<all_urls>`，但实际挂载前会检查白名单/黑名单。
- 白名单 `local:site-filter-whitelist` 启用时，只有匹配 pattern 的页面才注入。
- 黑名单 `local:site-filter-blacklist` 启用时，匹配 pattern 的页面不注入。
- 白名单和黑名单在设置页互斥启用。

### 3.4 SPA 路由变化

- 内容脚本监听 `document.body` 的 DOM mutation。
- 如果 `window.location.pathname` 变化，会延迟 1000ms 后重新解析网页内容。
- SPA 路由变化时会停止当前总结，并清空内部消息/UI 消息。

## 4. 输入长度与裁剪

- 模型配置中可设置 `maxContentLength`，表示网页输入内容最大长度。
- `InputInspect` 会展示当前选择长度、总长度、最大长度。
- 用户可通过 slider 手动选择传给模型的文本区间。
- 全局裁剪策略保存在 `local:summary-input-exceed-behaviour`：
  - `cut-preserve-front`：保留开头。
  - `cut-preserve-end`：保留结尾。
  - `cut-preserve-middle`：保留中间。
  - `nothing`：不裁剪。
- 当前实现按字符串长度裁剪，不是 token 级裁剪。UI 文案里已有 tokenizer 相关提示，但源码没有实际 tokenization 裁剪流程。

## 5. Prompt 功能

- Prompt 由 `systemMessage` 和 `userMessage` 两段组成。
- 支持 CRUD、排序、删除、设置默认 Prompt。
- 首次安装时如果没有 Prompt，会自动创建名为 `Sample` 的默认 Prompt。
- 预置 Prompt 按浏览器 UI 语言选择：
  - 英文。
  - 简体中文。
  - 繁体中文。
- Prompt 使用 Mustache 渲染变量：
  - `{{summaryLanguage}}`
  - `{{articleUrl}}`
  - `{{textContent}}`
  - `{{currentSelection}}`
- 设置页显示模板变量说明，并支持从预置 Prompt 创建新 Prompt。
- Prompt 列表里模板变量会高亮。

## 6. 模型/Provider 功能

### 6.1 模型配置

- 模型配置支持 CRUD、复制、排序、删除、设置默认模型。
- 第一个创建的模型会自动成为默认模型。
- 字段包括：
  - `name`
  - `providerType`
  - `modelName`
  - `apiKey`
  - `baseURL`
  - `maxContentLength`
  - `maxTokens`
  - `temperature`
  - `topP`
  - `topK`
  - `frequencyPenalty`
  - `presencePenalty`
  - `inputTokenPrice`
  - `outputTokenPrice`
  - `priceUnit`
  - `use_search`
  - `at`
- API key 在导出时默认会被移除，用户可显式选择带 API key 导出。
- 设置页会展示 provider icon、模型名、baseURL、输入/输出上限、单价。

### 6.2 Provider 覆盖范围

源码预置 Provider：

- `openai-compitable`
- `openai`
- `anthropic`
- `deepseek`
- `google-generative`
- `mistral`
- `xAI`
- `perplexity`
- `openrouter`
- `siliconflow`
- `together.ai`
- `cohere`
- `deepinfra`
- `ollama`
- `lm-studio`
- `moonshot(web)`

这些 Provider 通过 Vercel AI SDK 或兼容 Provider 创建 `languageModel(modelName)`。

### 6.3 Web Provider / Kimi 特殊能力

- `moonshot(web)` 被标记为 `isWeb`，使用 `moonshot-web-ai-provider`。
- `entrypoints/kimi.content.ts` 会读取 `*.kimi.com` 页面的 `window.localStorage.access_token` 和 `refresh_token`，写入扩展 storage。
- 后台会针对 `www.kimi.com` 修改由扩展发起的 XHR 请求头：
  - Chrome/Edge 使用 `declarativeNetRequest.updateDynamicRules()` 设置 `origin` 和 `referer`。
  - Firefox 使用 `webRequest.onBeforeSendHeaders` + blocking 修改 `origin` 和 `referer`。
- Web 模型设置支持 `use_search`。
- Web 模型编辑页尝试调用 Provider 上的 `getModels()` 来展示模型列表。
- `useSummary()` 中有 Kimi/K1 废弃提示：如果 provider 是 `moonshot(web)` 且 modelName 为 `kimi` 或 `k1`，会 toast 警告。

## 7. LLM 调用和流式通信

- 内容脚本不直接调用 LLM，而是通过 `sendConnectMessage('streamTextViaConnect')` 请求后台。
- 后台 `registerLLMMessages()` 使用 `streamText()` 调用 AI SDK。
- 返回值被封装为：
  - `textStream`：chunk 消费器。
  - `tokenUsage`：Promise，完成后 resolve 输入/输出 token。
  - `stop()`：断开 runtime port。
- 背景脚本会把 stream chunk 逐个转发到内容脚本。
- 内容脚本收到 chunk 后追加到最后一条 assistant UI 消息。
- 流结束后把 assistant 消息写回核心 `messages`，以支持后续聊天上下文。
- token 使用量会累计，并根据模型配置里的百万 token 单价估算本次费用。
- 调用参数会从模型配置中 pick 出：
  - `temperature`
  - `topP`
  - `topK`
  - `frequencyPenalty`
  - `presencePenalty`
  - `maxTokens`
  - `use_serach`（注意源码拼写）

## 8. 通信结构功能

### 8.1 普通消息

- `messaging.ts` 使用 `@webext-core/messaging` 定义 typed protocol。
- 包含：
  - `openOptionPage`
  - `openPopupPage`
  - `invokeSummary`
  - `addContentToChatDialog`
  - `getStringLength`
  - `streamTextTest`

### 8.2 自定义 Connect 消息层

项目自己封装了一套基于 `browser.runtime.connect()` 的 typed connect messaging：

- `onConnectMessage(key, handler)`
- `sendConnectMessage(key, input, opts)`

它支持三种返回类型：

- `raw`：直接返回。
- `promise`：异步 resolve。
- `chunk`：流式 chunk 和 chunkEnd。

这套机制是 LLM 流式返回的核心基础设施，也被 debug 面板复用。

## 9. 配置存储和同步

- 配置主要使用 WXT storage，key 带 `local:` 前缀。
- `useWxtStorage()` 包装了：
  - 异步读取初始值。
  - `storage.watch()` 跨上下文监听。
  - writable computed 写回 storage。
- 因此 options 页修改配置后，已打开页面内的内容脚本可以感知部分变化。
- 复杂列表有专用 storage manager：
  - `useModelConfigStorage()`
  - `usePromptConfigStorage()`
- 简单开关有专用 hook 和静态 getter，例如：
  - `useEnableFloatingBall()`
  - `getEnableAutoBeginSummary()`
  - `useSummaryLanguage()`

## 10. 设置页功能

### 10.1 General

- 总结语言。
- 是否显示聊天输入框。
- 是否显示悬浮球。
- 点击 popup 是否直接触发总结。
- 新页面是否默认打开总结面板。
- 打开面板后是否自动开始总结。
- action/context 触发后是否自动开始总结。
- 添加选区到聊天后是否自动发送。
- 是否显示 token 使用情况。
- 是否显示创建新面板按钮。
- 是否显示右键菜单项。

### 10.2 Page Extraction

- 当前通用提取方式固定为 `@mozilla/readability`。
- 可设置内容超长后的默认裁剪策略。
- 引导用户去 Site Customization 配置特殊站点 selector。

### 10.3 Models

- 模型配置列表。
- 默认模型选择。
- 创建、编辑、复制、删除、上移、下移。
- Provider 选择。
- 普通 API provider 表单。
- Web provider 表单。
- 可选参数折叠区。

### 10.4 Prompts

- Prompt 配置列表。
- 默认 Prompt 选择。
- 创建、编辑、删除、上移、下移。
- 从预置模板创建。
- 预览预置 Prompt。
- Prompt 编辑时显示 Mustache 变量说明。

### 10.5 Site Customization

- 白名单 pattern。
- 黑名单 pattern。
- 自定义站点提取规则。
- 支持 Shadow DOM host selector + shadowRoot 内 selector。
- 页面底部 sticky 保存按钮。

### 10.6 Appearance

- 用户可填写 CSS variables。
- 只保留以 `--webpage-summary` 开头且以 `;` 结尾的行。
- 保存后刷新设置页。
- 注入网页时会把这些 CSS variables 写入 Shadow DOM 的 `html, :host`。

### 10.7 Export / Import

- 导出全部 `browser.storage.local` 数据为 JSON。
- 导出结构包含：
  - `name: 'webpage-summary'`
  - `version`
  - `compatibilityVersion`
  - `exportDate`
  - `data`
- `compatibilityVersion` 固定为 `20250224`。
- 导入时使用 Zod 校验结构和 compatibilityVersion。
- 导入会直接 `browser.storage.local.set(data)` 覆盖/写入。
- 导入前可预览 JSON 数据。

### 10.8 Welcome

- 首次安装打开 `/options.html#/welcome`。
- 展示视频教程 iframe 和两张远程教程动图。

## 11. 外观和 UI 基础设施

- UI 使用 Tailwind + Radix Vue + 一套类似 shadcn 的本地组件。
- 本地组件覆盖 button、card、dialog、form、select、tooltip、toast、tabs、switch、slider、sidebar、auto-form 等。
- 内容脚本 Shadow UI 使用 `cssInjectionMode: 'ui'`，并设置 `inheritStyles: true`。
- 为避免部分网站隐藏 web component，挂载时强制 `shadowHost.style.visibility = 'visible'`。
- `assets/markdown.css` 用于 Markdown 内容样式。
- `assets/tailwind.css` 作为基础样式入口。

## 12. 国际化

- manifest 使用 `default_locale: "en"`。
- locale 文件包括：
  - `public/_locales/en/messages.json`
  - `public/_locales/zh_CN/messages.json`
  - `public/_locales/zh_TW/messages.json`
- 文案通过 `browser.i18n.getMessage()` 获取。
- 默认总结语言使用 `browser.i18n.getUILanguage()`。
- 预置 Prompt 也根据 UI 语言选择。

## 13. 调试/开发功能

- 开发模式 manifest name 会改成 `(DEV)summary-ext (${browser})`。
- 生产构建会 external 掉 `src/components/debug`。
- Debug 路由只在 `import.meta.env.DEV` 下显示。
- Debug 能力包括：
  - 普通消息测试。
  - runtime connect 测试。
  - 流式消息测试。
  - storage debug。
  - readability debug。
  - fetch debug。
  - resizable/debug UI 组件。
  - Vercel AI Core debug。

## 14. 浏览器兼容能力

- WXT 支持 Chrome、Edge、Firefox 构建。
- manifest 权限按浏览器分支：
  - Firefox 使用 `webRequest`、`webRequestBlocking` 和 `*://*.kimi.com/*` host 权限。
  - Chromium 使用 `declarativeNetRequest`。
- `activeTab`、`storage`、`contextMenus`、`scripting`、`cookies` 都是核心权限。
- `web_accessible_resources` 暴露 `llm-icons/*`。

## 15. 需要在 React 重写时重点确认的问题

这些不是需求结论，而是从代码里看到的实现问题或可疑点：

- `getAllExtConfigs()` 读取 `storage.getItems()` 后的 index 明显错位，且访问了不存在的 `result[9]`。
- `ENABLE_TOKAN_USAGE_VIEW` 拼写为 `TOKAN`，storage key 也是 `local:enable-tokan-usage-view`，重写时要决定是否兼容旧 key。
- `openai` 的默认 base URL 写成了 `https://openai.ai/api/v1`，需要确认是否故意。
- `openai-compitable` 拼写错误，且 providerMap 里映射到 `createOpenAI`，不是 `createOpenAICompatible`。重写时要确认兼容策略。
- `topK` schema 限制 `0..1`，通常 topK 是整数或更大范围，需要确认。
- 普通 provider 的 `temperature/topP/topK/frequencyPenalty/presencePenalty` 在提交时用 truthy 判断，值为 `0` 会被丢弃。
- LLM options 里定义了 `use_serach`，模型配置字段是 `use_search`，存在拼写不一致。
- `connect-messaging` 的 LLM handler 没有显式调用 `complete()`，可能导致 port 生命周期不够干净。
- `SummaryInputSchema` 类型里 `currentSelection` 是可选，但 Zod schema 要求 `z.string()`。
- Markdown 渲染开启 `html: true` 并直接 `v-html`，需要评估 XSS 风险。
- 站点自定义提取的 `content` 实际等于包了 `<p>` 的 `textContent`，命名上有混淆。
- 当前长度裁剪基于字符串长度，不是 token 数；现有依赖里有 `js-tiktoken`，但核心流程没有使用它。
- 右键菜单开关修改后，源码没有明显监听配置变化并自动重建菜单，可能需要重启/刷新后台或重新安装后才一致。
- `PromptConfigStorage.isNameExist(name, id?)` 的逻辑 `id && prompt.id !== id` 会导致不传 id 时总是 false；创建时另有 while 检查，所以影响主要在编辑验证。
- `textContentTrimmer` 在 `initMessages()` 中会直接修改 `webpageContent.value.textContent`，多次重新生成可能在已裁剪文本上再次裁剪。
- SPA route 监听依靠 MutationObserver + 1000ms 延迟，是折中方案，不保证所有 SPA 完整渲染后再提取。

## 16. React 重写应保留的核心结构能力

- 内容脚本 UI 与网页隔离：继续使用 Shadow DOM 或同等隔离方案。
- 内容提取、Prompt 渲染、LLM 调用、UI 对话状态要清晰分层。
- 后台统一执行 LLM 请求，内容脚本只处理 UI 和页面上下文。
- 保留 typed messaging 和 stream/promise/chunk 能力，避免普通 one-shot message 承载流式文本。
- 保留 storage hook 的跨上下文同步能力。
- 保留模型/Prompt 默认项指针，而不是把默认状态塞进列表项。
- 保留站点白名单/黑名单和 selector 自定义提取，尤其是 Shadow DOM 站点能力。
- 保留 import/export compatibilityVersion，便于未来迁移旧配置。
- 保留 Kimi/web provider 的浏览器差异处理前，需要重新确认权限、安全和可维护性。
