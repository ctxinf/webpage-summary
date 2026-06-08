# AGENTS

## 调试约定

- **不要运行 `npm run dev`**，这个常驻后台，如需重启通知用户手动操作
- **不要使用 AgentBrowser 进行测试**
- i18n 调试：`LANG=en_US.UTF-8 agent-browser open`

---

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | React + TypeScript |
| 构建 | WXT + Vite |
| 包管理 | pnpm |
| 样式 | Tailwind CSS + tailwindcss-animate |
| 组件库 | Radix UI (React) + shadcn/ui 体系 + `ai-elements` |
| 图标 | Lucide React |
| 工具 | CVA, clsx, tailwind-merge |
| AI | Vercel AI SDK v6（`ai/react` `useChat`） |
| LLM provider | @ai-sdk/openai, anthropic, google 等 |
| 验证 | Zod |
| 正文提取 | @mozilla/readability |
| Markdown | markdown-it / react-markdown |
| 模板 | Mustache（Prompt 变量渲染） |
| Token 计数 | js-tiktoken（已引入，尚未接入裁剪流程） |
| 扩展通信 | @webext-core/messaging + 自建 connect bridge |
| 存储 | WXT Storage（`browser.storage.local`） |

---

## 入口点 (entrypoints)

| 入口 | 说明 |
|---|---|
| `entrypoints/content/` | 注入网页的 content script，Shadow DOM 挂载总结面板和悬浮球 |
| `entrypoints/background/` | 后台脚本，处理快捷键、右键菜单、LLM 流式调用 |
| `entrypoints/popup/` | 扩展图标弹窗 |
| `entrypoints/options/` | 设置页，管理模型、Prompt、通用开关、站点规则、导入导出 |
| `entrypoints/kimi.content.ts` | 针对 Kimi 网页抓取 token 的特殊 content script |

---

## 通信架构

### 普通消息（控制面）
基于 `@webext-core/messaging`，用于短 RPC 和控制事件：`openOptionPage`、`invokeSummary`（background→content 打开/触发总结）、`addContentToChatDialog` 等。协议文件：`messaging.ts`

### Connect Bridge（LLM 流式通道）
正式接口：`lib/ai-sdk-connect-bridge.ts` + `lib/ai-sdk-connect-transport.ts`

帧协议：
```ts
ClientFrame: { type: 'send-messages'; requestId; chatId; messages: UIMessage[] } | { type: 'abort' }
ServerFrame:  { type: 'chunk'; chunk: UIMessageChunk } | { type: 'error'; message } | { type: 'done' }
```

流程：content `useChat({ transport: new AiSdkConnectTransport() })` → port → background `registerAiSdkConnectBridge()` → `createLanguageModelFromConfig()` → `streamText()` → `result.toUIMessageStream()` → 逐帧发回 content。

`reconnectToStream()` 返回 `null`（direct transport 策略）。

---

## 存储键 (Storage Keys)

全部键定义在 `src/constants/storage-key.ts`，统一 `local:` 前缀。

| Key | 类型 | 说明 |
|---|---|---|
| `local:model-configs` | `ModelConfigItem[]` | LLM 模型配置列表 |
| `local:prompt-configs` | `PromptConfigItem[]` | Prompt 模板列表 |
| `local:site-customization-list` | `SiteCumstomizationItem[]` | 站点自定义提取规则 |
| `local:default-model-id` | `string` | 当前默认模型配置 ID |
| `local:default-prompt-id` | `string` | 当前默认 Prompt ID |
| `local:site-prompt-rules` | `SitePromptRule[]` | 站点 Prompt 路由规则（已预留） |
| `local:summary-lang` | `string` | 总结目标语言（`zh-CN`, `en` 等） |
| `local:summary-input-exceed-behaviour` | `string` | 超长裁剪策略（front/middle/back/nothing） |
| `local:enable-auto-begin-summary` | `boolean` | 页面加载完成后自动开始总结 |
| `local:popup-click-trigger` | `boolean` | 点击 Popup 按钮是否触发总结 |
| `local:enable-floating-ball` | `boolean` | 是否显示悬浮球 |
| `local:enable-summary-window-default` | `boolean` | 总结面板是否默认展开 |
| `local:enable-chat-input-box` | `boolean` | 是否显示底部聊天输入框 |
| `local:enable-context-menu-summarize-this-page` | `boolean` | 右键菜单"总结此页" |
| `local:context-menu-add-selection-to-chat` | `boolean` | 右键菜单"添加选中到对话" |
| `local:enable-tokan-usage-view` | `boolean` | 显示 Token 用量（注意：拼写是 TOKAN，保持兼容） |
| `local:site-filter-whitelist` | `WhiteList` | 白名单（启用时只注入匹配页面） |
| `local:site-filter-blacklist` | `BlackList` | 黑名单（启用时不注入匹配页面） |
| `local:user-custom-style` | `string` | 全局注入 CSS 变量 |

配置优先级：**站点规则 > 全局设置**（规划通过 `resolveConfig(key, hostname)` 实现）。

---


## 模型配置（React 重写版）

Provider 描述表：`constants/model-settings.ts`。支持：OpenAI Compatible、OpenAI、Open Responses、Anthropic、Google Generative AI、Ollama、Browser AI。

- Base URL 不是独立 provider，而是 provider 下的快捷 URL（OpenRouter = OpenAI Compatible + 快捷 URL）
- `browser-ai`：特殊 provider，不展示 API Key / Base URL / extraBody / headers
- CRUD：`lib/model-settings-storage.ts`
- Provider factory：`lib/model-provider.ts`，`createLanguageModelFromConfig(config)`
- extraBody / headers 按 JSON object 存储，通过 provider 自定义 fetch 合并到 JSON body

---

## 面板结构（重构目标）

支持三种面板，可按需开关：

| 面板 | 说明 |
|---|---|
| 页面内浮动面板 | 默认开启，可拖拽，吸附右侧 |
| 页面内嵌侧边栏 | 顶部 model/prompt 选择，中间对话历史，底部开始/重新总结+输入框 |
| Popup 面板 | 简洁，仅 model/prompt 选择和总结，默认固定 |

面板相关设置独立为"总结面板设置"子页。前端组件页面不复用。


---

## 已知问题与坑

| 问题 | 详情 |
|---|---|
| `TOKAN` 拼写错误 | storage key `local:enable-tokan-usage-view`，重写时保持兼容，不改 key |
| truthy 判断丢 0 值 | `temperature/topP` 等用 truthy 判断，值为 `0` 会被丢弃 |
| `use_serach` 拼写不一致 | LLM options 里是 `use_serach`，模型配置字段是 `use_search` |
| Markdown `html: true` XSS | 需评估 `dangerouslySetInnerHTML` 用法 |
| 右键菜单开关变更不实时 | 修改后可能需要重启后台才一致 |
| stop 不取消上游请求 | `stop()` 只断 port，不传 abort signal 给 AI SDK |
| `textContentTrimmer` 多次裁剪 | 在已裁剪文本上重新生成会再次裁剪 |
| `ollama-ai-provider` 兼容性 | 仍是旧 ProviderV1 类型，通过类型强转接入 AI SDK 6，运行时兼容性待测 |
