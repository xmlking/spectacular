import { limiter } from '$lib/server/limiter/limiter';
import { openai } from '@ai-sdk/openai'; // Ensure OPENAI_API_KEY environment variable is set
import { Logger } from '@spectacular/utils';
import { error } from '@sveltejs/kit';
import { JSONParseError, type LanguageModel, TypeValidationError, generateObject, streamObject, streamText } from 'ai';
import { ollama } from 'ollama-ai-provider';
import { z } from 'zod';
import { personSchema as schema } from '../../(app)/ai/pastesmart/schema';

const log = new Logger('smart:past:server');

// free https://platform.openai.com/docs/guides/rate-limits/free-tier-rate-limits
const model = openai('gpt-4o-mini');
// const model = openai('gpt-4o-mini', {
//   structuredOutputs: true
// });
// const model = openai('gpt-4o');
// const model = openai('o3-mini');
// const model = openai('llama3-8b-8192');
// const model = ollama('phi3'); // phi3, mistral, llama3

export const POST = async (event) => {
  // ratelimit
  // if (await limiter.isLimited(event)) error(429);

  const { request } = event;
  const { content } = await request.json();
  if (!content) return new Response('Prompt is required', { status: 400 });

  try {
    const result = await generateObject({
      model,
      schema,
      prompt: `Extract the data from the following:\n ${content}`,
    });
    return result.toJsonResponse();
  } catch (err) {
    log.error('backend error', err);
    if (TypeValidationError.isInstance(err)) {
      error(500, `${err.value}`);
      // return { type: 'validation-error', value: error.value };
    } else if (JSONParseError.isInstance(err)) {
      error(500, `${err.text}`);
      // return { type: 'parse-error', text: error.text };
    } else {
      error(500, `${err}`);
    }
  }
};
