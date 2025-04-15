import { limiter } from '$lib/server/limiter/limiter';
import { openai } from '@ai-sdk/openai'; // Ensure OPENAI_API_KEY environment variable is set
import { Logger } from '@spectacular/utils';
import { error } from '@sveltejs/kit';
import { streamText } from 'ai';
import { ollama } from 'ollama-ai-provider';

/**
 * Use this "Completions API" for text generation.
 * Draft documents
 * Write computer code
 * Answer questions about a knowledge base
 * Translate languages
 * Analyze texts
 */
const log = new Logger('experiments:ai:completion:server');

// free https://platform.openai.com/docs/guides/rate-limits/free-tier-rate-limits
const model = openai('gpt-4.1-nano');
// const model = openai('gpt-4.1-mini');
// const model = openai('gpt-4.1');
// const model = openai('o3-mini');
// const model = ollama('phi3'); // phi3, mistral, llama3

const system = `You are a text editor. You will be given a prompt and a text to edit, which may be empty or incomplete.
  Edit the text to match the prompt, and only respond with the full edited version of the text - do not include any other information, context, or explanation.
  If you add on to the text, respond with the full version, not just the new portion. Do not include the prompt or otherwise preface your response.
  Do not enclose the response in quotes.`;

export const POST = async (event) => {
  // ratelimit
  // if (await limiter.isLimited(event)) error(429);

  const { request } = event;
  const { text, prompt } = await request.json();
  log.debug({ text, prompt });
  if (!prompt || !text) return new Response('Prompt is required', { status: 400 });

  const result = streamText({ model, system, prompt: `Prompt: ${prompt}\nText: ${text}` });

  return result.toDataStreamResponse();
};
