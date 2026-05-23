# Content Samples 结构

## reference 中的 content Tailwind 做法

原项目的 content UI 入口在 `reference/entrypoints/page.content/index.ts`：

1. 入口直接引入 `reference/assets/tailwind.css`。
2. `defineContentScript()` 设置 `cssInjectionMode: 'ui'`。
3. UI 使用 WXT `createShadowRootUi()` 挂到 Shadow DOM。

这个组合让 WXT 把 content 入口生成的 CSS 注入到 Shadow Root UI 中。样式仍由
Tailwind 编译，而不是在 content script 中手写一段运行时 `<style>`。

## React 重写中的拆分

content scope 只保留一个 WXT 入口：

| 责任 | 文件 |
| --- | --- |
| WXT content 入口 | `entrypoints/content/index.ts` |
| 正式 content scope | `entrypoints/content/scope.ts` |
| content samples 挂载 | `entrypoints/content/sample/mountContentSamples.tsx` |

`entrypoints/content/index.ts` 统一声明 `<all_urls>`、`cssInjectionMode: 'ui'` 和
正式 content 初始化。sample 挂载逻辑由入口按开关分发，避免再增加第二个 content
script 入口。content samples 仍有自己的 Shadow Root UI 和 content Tailwind
stylesheet：

- 开关：`constants/flag.ts` 的 `ENABLE_CONTENT_SAMPLES`
- 样式入口：`entrypoints/content/style.css`
- sample 索引页：`entrypoints/content/sample/ContentSamplePage.tsx`
- 当前子页面：
  - `entrypoints/content/sample/ai-dialog/`
  - `entrypoints/content/sample/page-extraction/`

开关关闭时单一 content 入口不挂载 sample UI。

## sample 索引页

索引页负责 launcher、关闭状态和 tabs。子页面通过 `CONTENT_SAMPLE_ITEMS`
注册，后续 sample 应继续放到各自子目录，再把页面组件注册到索引页，而不是把
sample 逻辑塞回 `entrypoints/content/index.ts`。

## AI Dialog sample

`entrypoints/content/sample/ai-dialog/ContentAiDialogSample.tsx` 用来验证当前最关键
的 content 流程：

1. content sample 面板作为页面内对话框入口。
2. 读取默认模型配置和默认 prompt 配置。
3. 使用 AI SDK UI 的 `useChat()` 管理对话状态，并用 `setMessages()` 把默认
   prompt 的 `systemMessage` 初始化为第一条 `system` `UIMessage`。
4. 通过 `AiSdkConnectTransport` 连接 `ai-sdk-connect-bridge` port。
5. background 中的 `registerAiSdkConnectBridge()` 根据模型配置创建 provider，
   执行 `streamText()`，再把 UI message chunks 流式传回 content dialog。

这个 sample 暂时只做最小闭环验证，不包含页面抽取、网页变量渲染或正式页面交互
设计。
