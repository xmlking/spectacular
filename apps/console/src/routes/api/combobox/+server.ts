import { azure } from '@ai-sdk/azure';
import { openai } from '@ai-sdk/openai'; // Ensure OPENAI_API_KEY environment variable is set
import { Logger } from '@repo/utils';
import { error } from '@sveltejs/kit';
import { generateObject, JSONParseError, type LanguageModel, streamObject, streamText, TypeValidationError } from 'ai';
import { ollama } from 'ollama-ai-provider';
import { z } from 'zod';
import { SPECIALIZATIONS } from '$lib/constants';
import { limiter } from '$lib/server/limiter/limiter';

const log = new Logger('experiments:ai:combobox:server');

// free https://platform.openai.com/docs/guides/rate-limits/free-tier-rate-limits
// const model = openai('gpt-4o-mini');
// const model = openai('gpt-4.1-nano');
// const model = openai('gpt-4.1-mini');
const model = openai('gpt-4.1');
// const model = openai('o3-mini');
// const model = openai('llama3-8b-8192');
// const model = ollama('phi3'); // phi3, mistral, llama3

const system =
  'You are a suggestion generator. Provide all possible suggestions for a given category value. Do not include the prompt. Do not enclose the response in quotes.';
const schema = z.object({
  options: z.enum(SPECIALIZATIONS).array().nullish(),
});
export const POST = async (event) => {
  // ratelimit
  // if (await limiter.isLimited(event)) error(429);

  const { request } = event;
  const { filterText } = await request.json();
  log.debug({ filterText });

  try {
    const result = await generateObject({
      model,
      output: 'array',
      schema,
      system,
      prompt: ` \nGenerate possible Suggestions from Text: ${filterText}`,
    });

    log.debug(result.object);
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
