import { openai } from '@ai-sdk/openai'; // Ensure OPENAI_API_KEY environment variable is set
import { Logger } from '@repo/utils';
import { error } from '@sveltejs/kit';
import {
  generateObject,
  JSONParseError,
  jsonSchema,
  type LanguageModel,
  streamObject,
  streamText,
  TypeValidationError,
} from 'ai';
import { ollama } from 'ollama-ai-provider';
import { z } from 'zod';
import { limiter } from '$lib/server/limiter/limiter';
// import { personSchema as schema } from '../../(app)/ai/pastesmart/schema';
import { personJsonSchema } from '../../(app)/ai/pastesmart/schema';

const log = new Logger('smart:past:server');

// free https://platform.openai.com/docs/guides/rate-limits/free-tier-rate-limits
// const model = openai('gpt-4.1-nano');
const model = openai('gpt-4.1-mini');
// const model = openai('gpt-4.1');
// const model = openai('o3-mini');
// const model = openai('gpt-4.1-mini', {
//   structuredOutputs: true
// });
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
      schema: jsonSchema(personJsonSchema),
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
