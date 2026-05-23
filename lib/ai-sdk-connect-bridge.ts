import type { UIMessage, UIMessageChunk } from 'ai';

export const AI_SDK_CONNECT_BRIDGE_PORT = 'ai-sdk-connect-bridge';

export type AiSdkConnectBridgeRequest = {
  type: 'send-messages';
  requestId: string;
  chatId: string;
  messageId?: string;
  messages: UIMessage[];
  modelConfigId?: string | null;
  system?: string;
  trigger: 'submit-message' | 'regenerate-message';
};

export type AiSdkConnectBridgeClientMessage =
  | AiSdkConnectBridgeRequest
  | { type: 'abort' };

export type AiSdkConnectBridgeServerMessage =
  | { type: 'chunk'; chunk: UIMessageChunk }
  | { type: 'error'; message: string }
  | { type: 'done' };
