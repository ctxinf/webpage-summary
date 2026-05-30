import type { UIMessage, UIMessageChunk } from 'ai';

export const CONNECT_CHAT_TRANSPORT_PORT = 'sample:connect-chat-transport';

export type ConnectChatTransportRequest = {
  type: 'send-messages';
  requestId: string;
  apiKey: string;
  chatId: string;
  messages: UIMessage[];
  trigger: 'submit-message' | 'regenerate-message';
  messageId?: string;
};

export type ConnectChatTransportClientMessage =
  | ConnectChatTransportRequest
  | { type: 'abort' };

export type ConnectChatTransportServerMessage =
  | { type: 'chunk'; chunk: UIMessageChunk }
  | { type: 'error'; message: string }
  | { type: 'done' };
