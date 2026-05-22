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
- 当前子页面：`entrypoints/content/sample/page-extraction/`

开关关闭时单一 content 入口不挂载 sample UI。

## sample 索引页

索引页负责 launcher、关闭状态和 tabs。当前 tab 只有 `Page Extraction`，但子页面
通过 `CONTENT_SAMPLE_ITEMS` 注册，后续 sample 应继续放到各自子目录，再把页面
组件注册到索引页，而不是把 sample 逻辑塞回 `entrypoints/content/index.ts`。
