# 原项目 Messaging 与 LLM 流式输出分析

本文聚焦 `reference/` 中两套跨扩展上下文通信机制，以及正式摘要链路里对 AI SDK `streamText()` 的简单流式封装。

注意：`reference/` 依赖旧版 AI SDK，协议代码仍写 `CoreMessage`。当前 React 重写使用 AI SDK 6 时，SDK Core 输入类型已是 `ModelMessage`；接 `useChat` 时 transport 边界应优先传 `UIMessage`，再在 background 用 `convertToModelMessages()` 转成 `ModelMessage[]`。

## 1. 结论

原项目把通信拆成两层：

| 层 | 实现 | 适用场景 | 正式业务用途 |
| --- | --- | --- | --- |
| 普通 typed messaging | `@webext-core/messaging` 包装的 `sendMessage/onMessage` | 一次请求，一次返回，或单向控制事件 | 打开设置页、打开 popup、触发 content summary、把选中文本塞进聊天框 |
| 自定义 connect messaging | 基于 `browser.runtime.connect()` 的 `sendConnectMessage/onConnectMessage` | 长连接、分段返回、同一调用同时返回同步值/Promise/chunk | content 调 background 发起 LLM 流式摘要 |

LLM 正式路径没有把浏览器原生 stream 或 AI SDK 的 `AsyncIterable` 直接跨上下文传递，而是：

1. content 端把 `messages` 和 `modelConfig` 发给 background。
2. background 用 AI SDK `streamText()` 请求模型。
3. background 把 `textStream` 的每个文本片段转成 runtime port chunk。
4. content 端把 chunk 追加到当前 assistant UI 消息。
5. 流结束后，content 再把完整 assistant 文本写回对话上下文，并等待 token usage Promise 计算 token 和费用。

## 2. 普通 Messaging

### 2.1 定义

普通消息协议在 `reference/messaging.ts`：

```ts
export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>();
```

它依赖 `@webext-core/messaging`，用 `ProtocolMap` 约束消息名、入参和返回值。当前协议包含：

| 消息 | 方向 | 作用 |
| --- | --- | --- |
| `openOptionPage` | popup/content -> background | 打开 options 页 |
| `openPopupPage` | content/popup -> background | 设置并打开 popup |
| `invokeSummary` | background/其他页面 -> content | 打开或切换摘要面板，可按配置触发摘要 |
| `addContentToChatDialog` | background -> content | 把右键菜单选中文本加入聊天输入区 |
| `getStringLength` | debug -> background | 基础消息测试 |
| `streamTextTest` | debug -> background | 早期手工流式桥接测试 |

### 2.2 正式调用关系

普通消息主要承担控制面通信，不承担正式 LLM 流：

- popup 调 `sendMessage('openOptionPage', ...)`，background 在 `registerControlMessages()` 里处理。
- background 的快捷键、右键菜单和工具函数向指定 tab 发 `invokeSummary` 或 `addContentToChatDialog`。
- content 页面在 `reference/entrypoints/page.content/App.vue` 注册这两个 handler，负责打开面板、触发摘要、追加选中文本。

这类消息适合：

- 目标动作短。
- 返回值不需要持续推送。
- 不需要显式控制连接生命周期。

### 2.3 `streamTextTest` 不是正式 LLM 路径

`streamTextTest` 虽然定义在普通 messaging 协议里，但只被 debug 代码使用：

1. debug 页面先用 `sendMessage('streamTextTest', { connectId, ... })` 通知 background 建立一次测试任务。
2. 页面再自行 `browser.runtime.connect({ name: connectId })`。
3. background 根据 `connectId` 找到 port listener，把 `result.textStream` 手工 `postMessage()` 回去。

这个流程把普通消息和裸 port 拼在一起，属于实验性桥接。正式摘要已经换成 `sendConnectMessage('streamTextViaConnect')`，React 重写不应把 `streamTextTest` 当成业务协议保留。

## 3. 自定义 Connect Messaging

### 3.1 协议目标

`reference/connect-messaging.ts` 在 runtime port 上又封了一层 typed API：

```ts
export const { onConnectMessage, sendConnectMessage } =
  defineConnectMessage();
```

它想解决两个问题：

1. 普通 extension message 不适合连续回传 LLM chunk。
2. 一个调用除了流式文本，还要并行返回 token usage 这类异步尾部数据。

因此 `ProtocolMap` 可以声明一个对象返回值，且每个字段标记为三种类型之一：

| 返回类型 | 含义 | 调用端表现 |
| --- | --- | --- |
| `raw` | 已有的直接值 | 普通字段 |
| `promise` | 稍后 resolve 的值 | `Promise<T>` |
| `chunk` | 连续推送的数据 | `{ onChunk, onChunkComplete }` |

调试协议 `func1` 同时覆盖了三种返回值；正式 LLM 协议只用到了 `promise` 和 `chunk`。

### 3.2 端口协议

每个 connect 消息名会映射成 port name：

```ts
const NAME_KEY = `onConnectMessage:${key}`;
```

当前内部消息帧有：

| 帧类型 | 方向 | 作用 |
| --- | --- | --- |
| `markReturn` | handler -> caller | 先声明返回对象里各字段属于 `raw/promise/chunk` |
| `resolve` | handler -> caller | resolve 某个 Promise 字段 |
| `chunk` | handler -> caller | 推送某个 chunk 字段的一段数据 |
| `chunkEnd` | handler -> caller | 标记某个 chunk 字段结束 |
| `error` | handler -> caller | 把 handler 或 stream 错误发给调用端 |

类型里还声明了 `stop`，但当前真正的停止动作不是发送 `stop` 帧，而是 caller 收到返回对象后拿到一个本地 `stop()`，直接断开 port。

### 3.3 调用流程

`sendConnectMessage()` 的调用流程是：

1. 用消息名建立 port。
2. 立刻把 `input` 作为第一条 port message 发给 handler。
3. 等 handler 发 `markReturn`。
4. caller 根据 `markReturn` 组装返回对象：
   - `promise` 字段创建本地 Promise，等后续 `resolve` 帧。
   - `chunk` 字段创建 `createChunkProcessor()`，等后续 `chunk/chunkEnd` 帧。
   - 返回对象额外挂上本地 `stop()`。
5. `sendConnectMessage()` Promise 在 `markReturn` 到达后 resolve，而不是等 stream 完成。

这说明 connect messaging 本质上是一个简化 RPC over port：

- `markReturn` 相当于握手和返回 schema。
- 后续 port message 是 Promise resolve 和 stream event。
- 调用端拿到的不是原始 port，而是一个被封装过的消费接口。

## 4. 正式 LLM 流式封装

### 4.1 协议定义

正式协议只有一个入口：

```ts
streamTextViaConnect(input: {
  messages: CoreMessage[];
  modelConfig: ModelConfigItem;
}): {
  tokenUsage: Promise<TokenUsage>;
  textStream: ChunkConsumer;
};
```

content 端在 `reference/src/composables/useSummary.ts` 调它；background 端在 `reference/entrypoints/background/llm.ts` 注册 handler。

### 4.2 Background 端

`registerLLMMessages()` 的 handler 做了以下事情：

1. 从 `modelConfig` 中提取 AI SDK 调用参数。
2. 通过 `createVercelModel(modelConfig)` 构造模型。
3. 调 `streamText({ model, messages, ...options })`。
4. 先 `markReturn()` 告诉调用端：
   - `textStream` 是 chunk 返回。
   - `tokenUsage` 是 Promise 返回。
5. `usage.then(...)` 后通过 `resolve('tokenUsage', ...)` 发回 token 数。
6. `for await (const element of textStream)`，每段调用 `chunk('textStream', element)`。
7. stream 结束后发 `chunkEnd('textStream')`。

它没有暴露 AI SDK 的完整返回对象，只把业务真正使用的两部分缩成：

- 文本增量。
- prompt/completion token usage。

### 4.3 Content 端

`useSummary().chat()` 中的消费方式是：

1. 根据页面内容、prompt 和后续聊天历史构造 `messages`。
2. 先向 UI 塞一条空 assistant 消息。
3. 调 `sendConnectMessage('streamTextViaConnect', ...)`。
4. `textStream.onChunk()` 把文本追加到最后一条 assistant UI 消息。
5. `textStream.onChunkComplete()` 时：
   - 把 UI 中拼好的 assistant 文本写回核心 `messages`。
   - 等 `tokenUsage` Promise。
   - 累计 token，并按模型配置中的百万 token 单价计算费用。

这意味着原项目对消息状态分了两层：

- `uiMessages` 负责流式显示。
- `messages` 负责后续 LLM 上下文；只有 assistant 最终文本完整后才写入。

### 4.4 停止与错误

调用端拿到的 `stop()` 来自 connect wrapper：

- `useSummary.stop()` 调用它后，会断开 port，并把本地 chunk handler 改为空函数。
- 这会停止 UI 继续接收 chunk。

错误路径分两段：

- `streamText({ onError })` 的异步流错误会经 `error(unpackStreamTextError(e))` 发给 caller。
- handler 外层 `try/catch` 捕获同步构造或循环过程中的异常，也走 `error(...)`。

content 正式路径传了 `onError`，收到错误后会把摘要状态设为 failed，并交给 `handleConnectError()` 展示。

## 5. 两套 Messaging 的边界

### 5.1 为什么普通消息不够

普通 `sendMessage/onMessage` 适合控制命令和短 RPC，但正式摘要还需要：

- 逐段增量文本。
- 流结束事件。
- token usage 在稍后单独 resolve。
- 手工停止接收。

因此原项目没有让普通消息承担 LLM chunk，而是单独封装了 port 通道。

### 5.2 为什么 connect wrapper 也没有替代普通消息

connect wrapper 更重：

- 每次消息都要建立 port。
- handler 必须先声明返回 schema。
- 要显式处理 chunk、Promise、complete、error、disconnect。

对 `invokeSummary`、`openOptionPage` 这种控制事件，普通 typed messaging 更简单，也更符合语义。

## 6. 当前实现的问题

以下问题在 React 重写时不建议原样复制：

1. LLM handler 没有调用 `complete()`。

   `func1` debug handler 在 `chunkEnd()` 后会 `complete()`，但 `streamTextViaConnect` 只发 `chunkEnd()`。这会让 port 在自然结束后的关闭语义不够清晰。

2. `stop()` 只断 port，没有把取消信号传给 AI SDK。

   当前停止更像“前端不再接收”，不是“后台请求真正中止”。如果 provider 仍在输出，background 侧循环和上游请求是否及时释放没有明确保证。

3. chunk 消费器不缓存早到的数据。

   `createChunkProcessor()` 在 `onChunk()` 注册前的默认回调是空函数。若 `markReturn` 后 chunk 到达过快，调用端尚未注册 handler，就有丢首段文本的可能。

4. 错误语义不完整。

   caller 提供 `onError` 时走 hook；不提供时，wrapper 在 port listener 里直接 `throw`，并没有把主 Promise 或流状态统一 reject。Promise、chunk 和错误结束的契约还不够稳。

5. 内部协议里有未落地字段。

   `ConnectMessage.type` 声明了 `stop`，但收发逻辑没有处理该帧；真正停止依赖 `port.disconnect()`。

6. LLM options 过滤逻辑值得复查。

   `llm.ts` 先对一个空 `options` 对象取 `Object.keys(options)`，再 `assign/pick`，按当前代码读法会得到空 key 列表。另外代码写的是 `use_serach`，与配置里的 `use_search` 命名疑似不一致。

## 7. React 重写建议

### 7.1 保留的能力

建议保留下面的职责分层：

- 普通 typed messaging 继续承载控制命令。
- background 统一执行 LLM 请求，content 只处理页面上下文和 UI。
- LLM 通道必须支持 chunk、完成、错误、取消。
- token usage 应和文本流解耦，不能阻塞首屏流式输出。

### 7.2 可以收敛的接口

React 重写时可以把 LLM 专用接口收敛成更窄的协议，而不是复刻通用 `raw/promise/chunk` RPC：

```ts
type LlmStreamEvent =
  | { type: 'text-delta'; delta: string }
  | { type: 'usage'; usage: TokenUsage }
  | { type: 'done' }
  | { type: 'error'; error: SerializedError };
```

这样做的好处是：

- 流事件顺序更直观。
- usage、done、error 都能在同一状态机里处理。
- 取消可以明确落到 `AbortController` 或 provider 支持的 abort signal。
- 不需要为正式业务维护一套泛化的 `raw/promise/chunk` 返回 schema。

如果后续样例仍需要展示通用 connect wrapper，可把它放在 `samples/` 对应开关下，不要让 debug 协议反向塑造正式业务接口。

## 8. 关键源码索引

| 主题 | 文件 |
| --- | --- |
| 普通 messaging 协议 | `reference/messaging.ts` |
| 自定义 connect messaging 协议与实现 | `reference/connect-messaging.ts` |
| LLM background handler | `reference/entrypoints/background/llm.ts` |
| 摘要 content 调用端 | `reference/src/composables/useSummary.ts` |
| 普通控制消息 handler | `reference/entrypoints/background/control.ts` |
| content 控制消息 handler | `reference/entrypoints/page.content/App.vue` |
| connect wrapper 三类返回值 debug 样例 | `reference/entrypoints/background/debug.ts`、`reference/src/components/debug/ConnectMessageDebug.vue` |
| 普通消息 + 裸 port 的早期 LLM debug 样例 | `reference/entrypoints/background/debug.ts`、`reference/src/components/debug/TestSummary.vue` |
