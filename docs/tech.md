# 技术栈分析与 React 迁移建议

本文档对比了当前基于 Vue 的技术栈与建议的 React 技术栈。

## 1. 核心框架与工具 (Core Framework & Tools)

| 功能 | 当前技术栈 (Vue) | 建议技术栈 (React) | 说明 |
| :--- | :--- | :--- | :--- |
| **框架** | Vue 3 (Composition API) | **React ** (直接使用latest) | 核心重写目标 |
| **构建工具** | WXT + Vite | **WXT + Vite** | **通用**，WXT 支持多种框架 |
| **编程语言** | TypeScript | **TypeScript** | **通用** |
| **包管理** | pnpm | **pnpm** (使用标准npm)| **通用** |

## 2. UI 与 样式 (UI & Styling)

| 功能 | 当前技术栈 (Vue) | 建议技术栈 (React) | 说明 |
| :--- | :--- | :--- | :--- |
| **样式方案** | Tailwind CSS | **Tailwind CSS** | **通用** |
| **基础组件库** | Radix Vue | **Radix UI (React)** | Radix 的 React 原生版本 |
| **高级组件库** | - | **shadcn/ui** | 基于 Radix UI 和 Tailwind，社区主流 |
| **图标库** | Lucide Vue Next | **Lucide React** | Lucide 的 React 版本 |
| **样式工具** | CVA, clsx, tailwind-merge | **CVA, clsx, tailwind-merge** | **通用** |
| **动画** | tailwindcss-animate | **tailwindcss-animate** | **通用** |

## 3. 状态管理与钩子 (State & Hooks)

| 功能 | 当前技术栈 (Vue) | 建议技术栈 (React) | 说明 |
| :--- | :--- | :--- | :--- |
| **组合式工具** | @vueuse/core | **react-use** 或 **ahooks** | 提供类似的 React Hooks 集合 |
| **路由** | Vue Router | **React Router**  | WXT 页面间导航 |
| **表单处理** | VeeValidate | **React Hook Form** (不再使用表单了, 没必要) | React 生态中最流行的表单库 |
| **数据验证** | Zod | **Zod** | **通用** |

## 4. AI 与 业务逻辑 (AI & Business Logic) - **大部分通用**

| 功能 | 当前技术栈 (Vue) | 建议技术栈 (React) | 说明 |
| :--- | :--- | :--- | :--- |
| **AI SDK** | Vercel AI SDK (`ai`) | **Vercel AI SDK (`ai/react`)** | AI SDK 对 React 有原生 Hooks 支持 |
| **LLM 提供者** | @ai-sdk/* (OpenAI, Anthropic, etc.) | **@ai-sdk/* ** | **通用** |
| **文章提取** | @mozilla/readability | **@mozilla/readability** | **通用** |
| **Markdown** | markdown-it | **markdown-it** 或 **react-markdown** | 如果需要组件化渲染建议 react-markdown |
| **模板引擎** | Mustache | **Mustache** | **通用** |
| **Token 计数** | js-tiktoken | **js-tiktoken** | **通用** |
| **工具函数** | radash, eventemitter3 | **radash, eventemitter3** | **通用** |

## 5. 浏览器扩展相关 (Browser Extension)

| 功能 | 当前技术栈 (Vue) | 建议技术栈 (React) | 说明 |
| :--- | :--- | :--- | :--- |
| **消息通信** | @webext-core/messaging | **@webext-core/messaging** | **通用** |
| **存储管理** | WXT Storage | **WXT Storage** | **通用** |

## 迁移总结 (Migration Summary)

1.  **复用性极高**：业务逻辑、AI 调用、样式配置 (Tailwind)、数据验证 (Zod) 以及浏览器扩展底层的通信逻辑几乎可以 100% 复用。
2.  **重点改动**：
    *   `.vue` 组件转换为 `.tsx` 组件。
    *   Vue 的响应式系统 (`ref`, `reactive`, `computed`) 转换为 React 的状态管理 (`useState`, `useMemo`, `useCallback`)。
    *   VueUse 钩子替换为对应的 React Hooks。
    *   Radix Vue 替换为 Radix UI React。
3.  **开发效率**：建议引入 `shadcn/ui` 来快速构建 React 版本的 UI 界面，因为它与原项目使用的 Tailwind + Radix 思路高度一致。
