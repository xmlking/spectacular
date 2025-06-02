import OpenAI, { type ClientOptions } from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/index';
import { Adapter, type AdapterResponse } from './types';

export type AdapterOpenAIOptions = ClientOptions;

export class AdapterOpenAI extends Adapter {
  openai: OpenAI;
  private messageHistory: Map<string, ChatCompletionMessageParam[]> = new Map();

  constructor(options: AdapterOpenAIOptions) {
    super();
    this.openai = new OpenAI(options);
  }

  async connect() {
    const response = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'user' as const,
          content: 'When I say Ping, return exactly Pong',
        },
        { role: 'user' as const, content: 'Ping' },
      ],
      model: 'gpt-4.1-nano',
    });

    const content = response.choices[0].message.content;
    if (content !== 'Pong') {
      throw new Error('Cannot connect to OpenAI');
    }
  }

  async sendText(text: string, conversationId?: string): Promise<AdapterResponse> {
    let messages: ChatCompletionMessageParam[] = [
      {
        role: 'user' as const,
        content: text,
      },
    ];

    if (conversationId && this.messageHistory.has(conversationId)) {
      messages = [...this.messageHistory.get(conversationId)!, ...messages];
    }

    const response = await this.openai.chat.completions.create({
      messages,
      model: 'gpt-4.1-mini',
      // model: 'gpt-4.1',
      response_format: { type: 'json_object' },
    });

    const content = response?.choices[0]?.message?.content || '';
    const newId = response.id;

    this.messageHistory.set(newId, [
      ...(conversationId ? this.messageHistory.get(conversationId) || [] : []),
      { role: 'user' as const, content: text },
      { role: 'assistant' as const, content: content || '' },
    ]);

    return {
      content,
      conversationId: newId,
    };
  }
}
