import OpenAI from 'openai';

export interface LLMConfig {
  provider: 'openai' | 'anthropic';
  model: string;
  apiKey: string;
}

export interface LLMResponse {
  content: string;
  usage: { tokens: number };
}

export class LLMClient {
  private client: OpenAI;
  private model: string;

  constructor(config: LLMConfig) {
    if (config.provider === 'openai') {
      this.client = new OpenAI({ apiKey: config.apiKey });
      this.model = config.model || 'gpt-4o';
    } else {
      throw new Error(`Unsupported LLM provider: ${config.provider}`);
    }
  }

  async complete(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    messages.push({ role: 'user', content: prompt });

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: 0.3, // Lower for more consistent analysis
      max_tokens: 2000,
    });

    return {
      content: response.choices[0].message.content || '',
      usage: {
        tokens: response.usage?.total_tokens || 0,
      },
    };
  }

  async completeJSON<T>(prompt: string, systemPrompt: string): Promise<T> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 3000,
    });

    const content = response.choices[0].message.content || '{}';
    return JSON.parse(content) as T;
  }
}

export function createLLMClient(): LLMClient {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  return new LLMClient({
    provider: 'openai',
    model: 'gpt-4o',
    apiKey,
  });
}
