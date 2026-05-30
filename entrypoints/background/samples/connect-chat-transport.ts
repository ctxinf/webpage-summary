import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { convertToModelMessages, streamText, type UIMessageChunk } from 'ai';
import { browser } from 'wxt/browser';
import {
  CONNECT_CHAT_TRANSPORT_PORT,
  type ConnectChatTransportClientMessage,
  type ConnectChatTransportRequest,
  type ConnectChatTransportServerMessage,
} from '../../options/samples/connect-chat-transport/port-protocol';

export function registerConnectChatTransportSample() {
  console.debug('[ConnectChatTransport:bg] register sample listeners');

  browser.runtime.onConnect.addListener((port) => {
    if (port.name !== CONNECT_CHAT_TRANSPORT_PORT) {
      return;
    }

    let requestId = 'pending';
    const abortController = new AbortController();
    let started = false;
    let finished = false;
    logBackground(requestId, 'port connected', { portName: port.name });

    const postMessage = (message: ConnectChatTransportServerMessage) => {
      if (finished) {
        logBackground(requestId, 'skip post after finish', {
          frameType: message.type,
        });
        return;
      }

      try {
        logBackground(requestId, 'post frame', {
          frameType: message.type,
          chunkType: message.type === 'chunk' ? message.chunk.type : undefined,
        });
        port.postMessage(message);
      } catch {
        logBackground(requestId, 'post frame failed', {
          frameType: message.type,
        });
        abortController.abort();
        finish('post-frame-failed');
      }
    };

    const finish = (reason: string) => {
      if (finished) {
        return;
      }

      finished = true;
      logBackground(requestId, 'finish port', {
        reason,
        aborted: abortController.signal.aborted,
      });
      port.onMessage.removeListener(onMessage);
      port.onDisconnect.removeListener(onDisconnect);
      port.disconnect();
    };

    const onDisconnect = () => {
      logBackground(requestId, 'port disconnected', {
        started,
        finished,
      });
      abortController.abort();
      finish('port-disconnect');
    };

    const onMessage = (message: unknown) => {
      const frame = message as ConnectChatTransportClientMessage;
      logBackground(requestId, 'receive frame', { frameType: frame.type });

      if (frame.type === 'abort') {
        abortController.abort();
        finish('abort-frame');
        return;
      }

      if (frame.type !== 'send-messages' || started) {
        return;
      }

      started = true;
      requestId = frame.requestId;
      logBackground(requestId, 'start stream', {
        chatId: frame.chatId,
        trigger: frame.trigger,
        messageId: frame.messageId,
        messageCount: frame.messages.length,
      });
      void streamMessages(frame, abortController.signal, postMessage).finally(
        () => finish('stream-finally'),
      );
    };

    port.onMessage.addListener(onMessage);
    port.onDisconnect.addListener(onDisconnect);
  });
}

async function streamMessages(
  request: ConnectChatTransportRequest,
  abortSignal: AbortSignal,
  postMessage: (message: ConnectChatTransportServerMessage) => void,
) {
  try {
    logBackground(request.requestId, 'create provider');
    const dashscope = createOpenAICompatible({
      name: 'dashscope',
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      apiKey: request.apiKey,
    });

    const result = streamText({
      model: dashscope('qwen3.6-plus'),
      system:
        'You are serving a browser extension transport sample. Answer concisely.',
      messages: await convertToModelMessages(request.messages),
      abortSignal,
    });

    logBackground(request.requestId, 'consume ui stream');
    for await (const chunk of result.toUIMessageStream()) {
      logBackground(request.requestId, 'ui stream chunk', {
        chunkType: chunk.type,
      });
      postMessage({
        type: 'chunk',
        chunk: chunk as UIMessageChunk,
      });
    }

    logBackground(request.requestId, 'ui stream complete');
    postMessage({ type: 'done' });
  } catch (error) {
    if (abortSignal.aborted) {
      logBackground(request.requestId, 'stream aborted');
      return;
    }

    logBackground(request.requestId, 'stream error', {
      message: getErrorMessage(error),
    });
    postMessage({
      type: 'error',
      message: getErrorMessage(error),
    });
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function logBackground(
  requestId: string,
  event: string,
  detail?: Record<string, unknown>,
) {
  console.debug('[ConnectChatTransport:bg]', requestId, event, detail ?? '');
}
