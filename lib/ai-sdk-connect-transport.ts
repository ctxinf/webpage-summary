import type { ChatTransport, UIMessage, UIMessageChunk } from 'ai';
import { browser } from 'wxt/browser';
import {
  AI_SDK_CONNECT_BRIDGE_PORT,
  type AiSdkConnectBridgeClientMessage,
  type AiSdkConnectBridgeServerMessage,
} from '@/lib/ai-sdk-connect-bridge';

type AiSdkConnectTransportOptions = {
  getModelConfigId?: () => string | null;
  getSystemMessage?: () => string | null;
};

export class AiSdkConnectTransport implements ChatTransport<UIMessage> {
  constructor(private readonly options: AiSdkConnectTransportOptions = {}) {}

  async sendMessages({
    abortSignal,
    chatId,
    messages,
    trigger,
    messageId,
  }: Parameters<ChatTransport<UIMessage>['sendMessages']>[0]): Promise<
    ReadableStream<UIMessageChunk>
  > {
    const requestId = crypto.randomUUID();
    const port = browser.runtime.connect({
      name: AI_SDK_CONNECT_BRIDGE_PORT,
    });

    return new ReadableStream<UIMessageChunk>({
      start: (controller) => {
        let closed = false;
        let aborted = false;

        const closePort = () => {
          port.onMessage.removeListener(onMessage);
          port.onDisconnect.removeListener(onDisconnect);
          abortSignal?.removeEventListener('abort', onAbort);

          try {
            port.disconnect();
          } catch {
            // The background side may have already closed the port.
          }
        };

        const closeStream = () => {
          if (closed) return;

          closed = true;
          closePort();
          controller.close();
        };

        const errorStream = (message: string) => {
          if (closed) return;

          closed = true;
          closePort();
          controller.error(new Error(message));
        };

        const onMessage = (message: unknown) => {
          const frame = message as AiSdkConnectBridgeServerMessage;

          if (frame.type === 'chunk') {
            controller.enqueue(frame.chunk);
            return;
          }

          if (frame.type === 'done') {
            closeStream();
            return;
          }

          if (frame.type === 'error') {
            errorStream(frame.message);
          }
        };

        const onDisconnect = () => {
          if (aborted || closed) return;

          errorStream('AI SDK connect bridge disconnected before completion.');
        };

        const onAbort = () => {
          aborted = true;

          try {
            port.postMessage({
              type: 'abort',
            } satisfies AiSdkConnectBridgeClientMessage);
          } finally {
            errorStream('Chat request aborted.');
          }
        };

        port.onMessage.addListener(onMessage);
        port.onDisconnect.addListener(onDisconnect);
        abortSignal?.addEventListener('abort', onAbort, { once: true });

        if (abortSignal?.aborted) {
          onAbort();
          return;
        }

        port.postMessage({
          type: 'send-messages',
          requestId,
          chatId,
          messageId,
          messages,
          modelConfigId: this.options.getModelConfigId?.() ?? null,
          system: this.options.getSystemMessage?.() ?? undefined,
          trigger,
        } satisfies AiSdkConnectBridgeClientMessage);
      },
      cancel() {
        try {
          port.postMessage({
            type: 'abort',
          } satisfies AiSdkConnectBridgeClientMessage);
        } finally {
          port.disconnect();
        }
      },
    });
  }

  async reconnectToStream(): Promise<ReadableStream<UIMessageChunk> | null> {
    return null;
  }
}
