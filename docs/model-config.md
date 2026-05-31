这是最大的trouble
原有的模型配置非常麻烦同时又不灵活

新的模型配置:
1. provider不搞那么复杂, 只有当前安装的这几种
2. 除 browser-ai 外都支持 extrabody、自定义 headers 配置，支持设置 BASE_URL
4. 设置页面支持通过 /models 拉取 models 并选择，并支持通过设置的 BASE_URL
5. 保证全部都能对接现有的 connect-bridge
6. openai 支持 Chat Completions / Responses 两种模式切换，open-responses 是仅 Responses API endpoint 的独立 provider
7. 既能统一复用, 又能满足一些独特的设置, 还能支持browser-ai这种完全的特例

因为破坏性变更, storageKEY和之前的区分不一样

## 2026-05-23 尝试版落点

已先做一版 v2 配置链路，用来跑通页面、存储、provider factory、正式 background connect bridge：

1. 新 storage key：
   - `local:model-configs`
   - `local:default-model-id`
2. 新增 provider 描述表：`constants/model-settings.ts`
   - provider 直接展示当前 `package.json` 仍保留的 provider：OpenAI Compatible、OpenAI、Open Responses、Anthropic、Google Generative AI、Ollama、Browser AI。
   - Base URL 不是伪装成 provider，而是在 provider 下提供快捷服务商 URL；OpenRouter 作为 OpenAI Compatible 的快捷 URL。
   - 每个 provider 维护 `docsUrl`，编辑页展示当前 provider 描述并可跳到对应 AI SDK provider 文档。
   - `open-responses` 是单独 provider，只表示 Responses API POST endpoint。
   - `browser-ai` 作为特殊 provider 保留，不展示 API Key / Base URL / extraBody / headers。
   - provider icon 从 `reference/public/llm-icons` 复制到当前 `public/llm-icons`，不再用 lucide 图标。
3. 新增模型配置 CRUD：`lib/model-settings-storage.ts`
   - 创建、编辑、删除、默认模型选择。
   - headers / extraBody 按 JSON object 存储。
   - 新增 max input tokens / input price / output price / price unit。
   - 支持按 provider 的 `baseURL + modelsPath` 拉取模型列表，先覆盖 OpenAI-compatible 类接口。
4. 新增 provider factory：`lib/model-provider.ts`
   - background 可通过 `createLanguageModelFromConfig(config)` 创建 AI SDK model。
   - extraBody 先通过 provider 自定义 fetch 合并到 JSON body。
5. `/models` 设置页已从占位替换为可用页面：
   - 列表页：创建、编辑、删除、选择默认。
   - 编辑页：顶部 provider icon 选择、当前 provider 说明与文档外链、Base URL 快捷选择、Model Name input、`/models` 拉取后用模态框选择、API Key 明文切换。
   - 必填字段 label 旁显示 `*`；API Key 统一按可选字段处理。
   - Extra Body JSON 在 Custom Headers JSON 上方，二者默认折叠。
   - Limits and Pricing 放在最下方，默认折叠。
6. 正式 bridge 已放在 samples 之外：
   - 协议：`lib/ai-sdk-connect-bridge.ts`
   - 前端 transport：`lib/ai-sdk-connect-transport.ts`
   - background 注册：`entrypoints/background/ai-sdk-connect-bridge.ts`
   - sample 目录保持 sample，不接入正式模型配置。

## 仍需确认

1. `ollama-ai-provider` 仍是旧 ProviderV1 类型，当前通过类型强转接入 AI SDK 6；运行时兼容性要单独测。
2. 非 OpenAI-compatible provider 的 `/models` 响应格式差异较大，现在只做了通用解析，后续需要逐个 provider 实测。
3. extraBody 的通用 fetch 合并适合 JSON API；如果 provider 使用非 JSON body，需要改成 provider 级策略。
4. `maxInputTokens` 已存储并在列表展示，但正式内容裁剪还要接 token-count 流程。
5. UI 文案还没有完整接入 i18n，当前先保证功能链路。
