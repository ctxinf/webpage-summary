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

    console.debug(`[AI SDK Bridge] Port connected: ${port.name}`);

    let requestId = 'pending';
    const abortController = new AbortController();
    let started = false;
    let finished = false;

    const postMessage = (message: AiSdkConnectBridgeServerMessage) => {
      if (finished) return;

      try {
        console.debug(`[AI SDK Bridge] Post message (requestId: ${requestId}):`, message.type);
        port.postMessage(message);
      } catch (e) {
        console.error(`[AI SDK Bridge] Error posting message (requestId: ${requestId}):`, e);
        abortController.abort();
        finish();
      }
    };

    const finish = () => {
      if (finished) return;

      console.debug(`[AI SDK Bridge] Finishing connection (requestId: ${requestId})`);
      finished = true;
      port.onMessage.removeListener(onMessage);
      port.onDisconnect.removeListener(onDisconnect);
      port.disconnect();
    };

    const onDisconnect = () => {
      console.debug(`[AI SDK Bridge] Port disconnected (requestId: ${requestId})`);
      abortController.abort();
      finish();
    };

    const onMessage = (message: unknown) => {
      const frame = message as AiSdkConnectBridgeClientMessage;
      console.debug(`[AI SDK Bridge] Received message from client:`, frame.type);

      if (frame.type === 'abort') {
        console.debug(`[AI SDK Bridge] Aborting (requestId: ${requestId})`);
        abortController.abort();
        finish();
        return;
      }

      if (frame.type !== 'send-messages' || started) {
        return;
      }

      started = true;
      requestId = frame.requestId;
      console.debug(`[AI SDK Bridge] Starting stream (requestId: ${requestId})`);
      void streamMessages(frame, abortController.signal, postMessage).finally(
        () => {
          console.debug(`[AI SDK Bridge] Stream finished (requestId: ${requestId})`);
          finish();
        }
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
    console.debug(`[AI SDK Bridge streamMessages] Fetching model config for id: ${request.modelConfigId}`);
    const modelConfig = await getModelConfigById(request.modelConfigId);

    if (!modelConfig) {
      console.error(`[AI SDK Bridge streamMessages] Model config not found for id: ${request.modelConfigId}`);
      throw new Error('No model config is available.');
    }

    console.debug(`[AI SDK Bridge streamMessages] Model config fetched:`, modelConfig.providerId, modelConfig.modelId);
    console.debug(`[AI SDK Bridge streamMessages] Converting messages to model messages...`);
    const messages = await convertToModelMessages(request.messages);
    console.debug(`[AI SDK Bridge streamMessages] Messages converted. Ready to streamText. Messages count: ${messages.length}`);

    console.debug(`[AI SDK Bridge streamMessages] Calling streamText...`);
    const result = streamText({
      abortSignal,
      messages: messages,
      allowSystemInMessages: true,
      model: createLanguageModelFromConfig(modelConfig),
      system: request.system,
    });
    console.debug(`[AI SDK Bridge streamMessages] streamText called, beginning iteration...`);

    let chunkCount = 0;
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
      chunkCount++;
      if (chunkCount === 1) {
        console.debug(`[AI SDK Bridge streamMessages] Received first chunk`);
      }

      let processedChunk = chunk as UIMessageChunk;
      if (processedChunk.type === 'error') {
        const anyChunk = processedChunk as any;
        processedChunk = {
          ...processedChunk,
          errorText: getErrorMessage(anyChunk.error ?? anyChunk.errorText),
        } as any;
      }

      postMessage({
        type: 'chunk',
        chunk: processedChunk,
      });
    }

    console.debug(`[AI SDK Bridge streamMessages] Finished iterating stream. Total chunks: ${chunkCount}`);
    postMessage({ type: 'done' });
  } catch (error) {
    console.error(`[AI SDK Bridge streamMessages] Error occurred:`, error);
    if (abortSignal.aborted) {
      console.debug(`[AI SDK Bridge streamMessages] Aborted, ignoring error.`);
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
