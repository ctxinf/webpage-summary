import { convertToModelMessages, streamText, type UIMessageChunk } from 'ai';
import { browser } from 'wxt/browser';
import {
  AI_SDK_CONNECT_BRIDGE_PORT,
  type AiSdkConnectBridgeClientMessage,
  type AiSdkConnectBridgeRequest,
  type AiSdkConnectBridgeServerMessage,
} from '@/lib/ai-sdk-connect-bridge';
import { createLanguageModelFromConfig } from '@/lib/model-provider';
import { getModelConfigById } from '@/lib/model-settings-storage';

// Bridges AI SDK UI's custom transport to AI SDK Core inside the background
// worker through the browser extension runtime.onConnect port API.
export function registerAiSdkConnectBridge() {
  browser.runtime.onConnect.addListener((port) => {
    if (port.name !== AI_SDK_CONNECT_BRIDGE_PORT) {
      return;
    }

    let requestId = 'pending';
    const abortController = new AbortController();
    let started = false;
    let finished = false;

    const postMessage = (message: AiSdkConnectBridgeServerMessage) => {
      if (finished) return;

      try {
        port.postMessage(message);
      } catch {
        abortController.abort();
        finish();
      }
    };

    const finish = () => {
      if (finished) return;

      finished = true;
      port.onMessage.removeListener(onMessage);
      port.onDisconnect.removeListener(onDisconnect);
      port.disconnect();
    };

    const onDisconnect = () => {
      abortController.abort();
      finish();
    };

    const onMessage = (message: unknown) => {
      const frame = message as AiSdkConnectBridgeClientMessage;

      if (frame.type === 'abort') {
        abortController.abort();
        finish();
        return;
      }

      if (frame.type !== 'send-messages' || started) {
        return;
      }

      started = true;
      requestId = frame.requestId;
      void streamMessages(frame, abortController.signal, postMessage).finally(
        () => finish(),
      );
    };

    port.onMessage.addListener(onMessage);
    port.onDisconnect.addListener(onDisconnect);
  });
}

async function streamMessages(
  request: AiSdkConnectBridgeRequest,
  abortSignal: AbortSignal,
  postMessage: (message: AiSdkConnectBridgeServerMessage) => void,
) {
  try {
    const modelConfig = await getModelConfigById(request.modelConfigId);

    if (!modelConfig) {
      throw new Error('No model config is available.');
    }

    const result = streamText({
      abortSignal,
      messages: await convertToModelMessages(request.messages),
      allowSystemInMessages: true,
      model: createLanguageModelFromConfig(modelConfig),
      system: request.system,
    });

    for await (const chunk of result.toUIMessageStream({
      sendReasoning: true,
      messageMetadata: ({ part }) => {
        if (part.type === 'finish') {
          return {
            usage: (part as any).usage || (part as any).totalUsage || null,
          };
        }
        return undefined;
      }
    })) {
      postMessage({
        type: 'chunk',
        chunk: chunk as UIMessageChunk,
      });
    }

    postMessage({ type: 'done' });
  } catch (error) {
    if (abortSignal.aborted) {
      return;
    }

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
