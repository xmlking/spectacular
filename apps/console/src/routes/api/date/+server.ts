import { limiter } from '$lib/server/limiter/limiter';
import { openai } from '@ai-sdk/openai'; // Ensure OPENAI_API_KEY environment variable is set
import { Logger } from '@spectacular/utils';
import { error } from '@sveltejs/kit';
import { type LanguageModel, streamObject, streamText } from 'ai';
import { ollama } from 'ollama-ai-provider';
import { z } from 'zod';

const log = new Logger('experiments:ai:completion:server');

// free https://platform.openai.com/docs/guides/rate-limits/free-tier-rate-limits
const model = openai('gpt-3.5-turbo');
// const model = openai('gpt-4-turbo');
// const model = openai('gpt-4o');
// const model = openai('llama3-8b-8192');
// const model = ollama('phi3'); // phi3, mistral, llama3
// const model = ollama('phi3');
// const model = azure('pages-stg');

const system = 'You are a text to date converter. Do not include the prompt. Do not enclose the response in quotes.';
const schema = z.object({
  date: z.date().describe('local DateTime with timezone'),
});

export const POST = async (event) => {
  // ratelimit
  if (await limiter.isLimited(event)) error(429);

  const { request } = event;
  const { text, prompt } = await request.json();
  log.debug({ text, prompt });
  if (!prompt || !text) return new Response('Prompt is required', { status: 400 });

  const result = await streamObject({
    model,
    schema,
    // system,
    prompt: `The current date is: ${new Date()} \nGenerate Date from Text: ${text}`,
    onFinish({ object }) {
      // save object to database
    },
  });

  return result.toTextStreamResponse();
};
