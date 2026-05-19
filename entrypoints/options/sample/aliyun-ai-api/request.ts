import { ALIYUN_AI_API_SAMPLE } from './config';

export type AliyunChatRequest = {
  apiKey: string;
  endpoint: string;
  model: string;
  prompt: string;
};

export type AliyunChatResult = {
  content: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  raw: unknown;
};

type AliyunChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  usage?: AliyunChatResult['usage'];
  error?: {
    code?: string;
    message?: string;
  };
};

export async function requestAliyunChat({
  apiKey,
  endpoint,
  model,
  prompt,
}: AliyunChatRequest): Promise<AliyunChatResult> {
  const response = await fetch(endpoint || ALIYUN_AI_API_SAMPLE.endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model || ALIYUN_AI_API_SAMPLE.model,
      messages: [
        {
          role: 'system',
          content:
            'You are a concise assistant used to verify direct Aliyun DashScope API access.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  const data = (await response.json().catch(() => null)) as
    | AliyunChatResponse
    | null;

  if (!response.ok) {
    const message =
      data?.error?.message ||
      data?.error?.code ||
      `${response.status} ${response.statusText}`;

    throw new Error(message);
  }

  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('响应中没有 choices[0].message.content');
  }

  return {
    content,
    usage: data?.usage,
    raw: data,
  };
}
