# AI SDK ChatTransport over Browser Connect

本项目已经加了一个 sample，用 AI SDK UI 的 `ChatTransport` 接口包住浏览器扩展 `browser.runtime.connect()`：

- options sample：`entrypoints/options/sample/connect-chat-transport/`
- background sample：`entrypoints/background/sample/connect-chat-transport.ts`
- 开关：沿用 `constants/flag.ts` 的 `ENABLE_SAMPLES`

## 1. 要解决的问题

原项目为了 LLM 流式输出，在 connect port 上自建了一套泛化 RPC：

- `markReturn`
- `raw`
- `promise`
- `chunk`
- `chunkEnd`
- `complete`
- `stop`
- `error`

这个协议一旦承担聊天状态，就会重复造 AI SDK UI 已经做过的东西。

AI SDK UI 的 `ChatTransport` 边界更窄：

```ts
sendMessages(options): Promise<ReadableStream<UIMessageChunk>>
reconnectToStream(options): Promise<ReadableStream<UIMessageChunk> | null>
```

所以 extension port 不需要伪装成一套通用 RPC。它只需要把 background 产生的 `UIMessageChunk` 送回 content/options。

## 2. Sample 结构

### 2.1 Options 侧

`ConnectChatTransport` 实现 `ChatTransport<UIMessage>`：

1. `sendMessages()` 打开名为 `sample:connect-chat-transport` 的 port。
2. 把 SDK 传入的 `messages`、`chatId`、`trigger`、`messageId` 发给 background。
3. 返回一个 `ReadableStream<UIMessageChunk>`。
4. background 发 `chunk` 帧时 `controller.enqueue(chunk)`。
5. background 发 `done` 帧时关闭 stream。
6. SDK 的 `abortSignal` 触发时发 `abort` 帧并断开 port。

sample UI 直接使用：

```ts
const { messages, sendMessage, status, stop } = useChat({
  transport: new ConnectChatTransport(...),
});
```

聊天消息合并、assistant streaming part 更新、停止状态和错误状态都仍由 AI SDK UI 管。

### 2.2 Background 侧

background handler 做真正的 provider 调用：

1. 收到 UI messages。
2. 用 `convertToModelMessages()` 转成 model messages。
3. 调 `streamText()`。
4. 用 `result.toUIMessageStream()` 得到 SDK UI chunk stream。
5. 把每个 `UIMessageChunk` 透传回 port。

它不是把 `textStream` 手工转成某个私有 delta 协议，而是让 SDK 产出它自己的 UI stream 协议。

## 3. Port 协议

sample 当前只保留四类 frame：

```ts
type ClientFrame =
  | { type: 'send-messages'; requestId: string; apiKey: string; chatId: string; messages: UIMessage[] }
  | { type: 'abort' };

type ServerFrame =
  | { type: 'chunk'; chunk: UIMessageChunk }
  | { type: 'error'; message: string }
  | { type: 'done' };
```

和原 connect RPC 相比，协议面缩成：

- 请求一次。
- UI chunk 连续回传。
- 错误。
- 结束。
- 取消。

sample 会在 options 和 background 控制台分别打印带同一个 `requestId` 的调试日志：

- options 前缀：`[ConnectChatTransport]`
- background 前缀：`[ConnectChatTransport:bg]`

日志覆盖 port 建立、请求帧、UI chunk 类型、done、error、abort、disconnect 和关闭原因。

## 4. 当前边界

sample 当前目标是验证 transport，不是完整业务接入：

- provider 仍固定为 DashScope OpenAI-compatible 的 `qwen3.6-plus`。
- API key 由 sample 页面输入后随 port 请求发送。
- `reconnectToStream()` 返回 `null`，与 AI SDK 的 direct transport 思路一致。
- 还没有把 prompt、网页正文、model config、token usage metadata 接到正式 summary 流程。

后续正式接入时，优先继续扩展请求 body 或 UI message metadata，不要回到泛化 `raw/promise/chunk` RPC。
