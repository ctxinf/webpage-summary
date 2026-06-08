import type { ChatTransport, UIMessage, UIMessageChunk } from 'ai';
import { browser } from 'wxt/browser';
import { createLogger } from '@/lib/logger';

const logger = createLogger('options:ConnectChatTransport');

import {
  CONNECT_CHAT_TRANSPORT_PORT,
  type ConnectChatTransportClientMessage,
  type ConnectChatTransportServerMessage,
} from './port-protocol';

type ConnectChatTransportOptions = {
  getApiKey: () => string;
};

export class ConnectChatTransport implements ChatTransport<UIMessage> {
  constructor(private readonly options: ConnectChatTransportOptions) {}

  async sendMessages({
    abortSignal,
    chatId,
    messages,
    trigger,
    messageId,
  }: Parameters<ChatTransport<UIMessage>['sendMessages']>[0]): Promise<
    ReadableStream<UIMessageChunk>
  > {
    const apiKey = this.options.getApiKey().trim();
    const requestId = crypto.randomUUID();

    if (!apiKey) {
      throw new Error('API Key is required.');
    }

    logTransport(requestId, 'connect', {
      chatId,
      trigger,
      messageId,
      messageCount: messages.length,
    });

    const port = browser.runtime.connect({
      name: CONNECT_CHAT_TRANSPORT_PORT,
    });

    return new ReadableStream<UIMessageChunk>({
      start(controller) {
        let closed = false;
        let aborted = false;

        const closePort = () => {
          logTransport(requestId, 'close port listeners', {
            closed,
            aborted,
          });
          port.onMessage.removeListener(onMessage);
          port.onDisconnect.removeListener(onDisconnect);
          abortSignal?.removeEventListener('abort', onAbort);

          try {
            port.disconnect();
          } catch {
            // The port may already be closed by the background context.
          }
        };

        const closeStream = () => {
          if (closed) {
            return;
          }

          logTransport(requestId, 'close readable stream');
          closed = true;
          closePort();
          controller.close();
        };

        const errorStream = (message: string) => {
          if (closed) {
            return;
          }

          logTransport(requestId, 'error readable stream', {
            message,
            aborted,
          });
          closed = true;
          closePort();
          controller.error(new Error(message));
        };

        const onMessage = (message: unknown) => {
          const frame = message as ConnectChatTransportServerMessage;

          if (frame.type === 'chunk') {
            logTransport(requestId, 'receive chunk', {
              chunkType: frame.chunk.type,
            });
            controller.enqueue(frame.chunk);
            return;
          }

          if (frame.type === 'done') {
            logTransport(requestId, 'receive done');
            closeStream();
            return;
          }

          if (frame.type === 'error') {
            logTransport(requestId, 'receive error frame', {
              message: frame.message,
            });
            errorStream(frame.message);
          }
        };

        const onDisconnect = () => {
          logTransport(requestId, 'port disconnected', {
            closed,
            aborted,
          });

          if (aborted || closed) {
            return;
          }

          errorStream('Background chat port disconnected before completion.');
        };

        const onAbort = () => {
          aborted = true;
          logTransport(requestId, 'abort signal');

          try {
            port.postMessage({
              type: 'abort',
            } satisfies ConnectChatTransportClientMessage);
          } finally {
            errorStream('Chat request aborted.');
          }
        };

        port.onMessage.addListener(onMessage);
        port.onDisconnect.addListener(onDisconnect);
        abortSignal?.addEventListener('abort', onAbort, { once: true });
        logTransport(requestId, 'port listeners ready');

        if (abortSignal?.aborted) {
          onAbort();
          return;
        }

        port.postMessage({
          type: 'send-messages',
          requestId,
          apiKey,
          chatId,
          messages,
          trigger,
          messageId,
        } satisfies ConnectChatTransportClientMessage);
        logTransport(requestId, 'send request frame');
      },
      cancel() {
        logTransport(requestId, 'readable stream cancel');

        try {
          port.postMessage({
            type: 'abort',
          } satisfies ConnectChatTransportClientMessage);
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

function logTransport(
  requestId: string,
  event: string,
  detail?: Record<string, unknown>,
) {
  logger.debug('[ConnectChatTransport]', requestId, event, detail ?? '');
}
