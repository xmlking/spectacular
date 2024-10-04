import { limiter } from '$lib/server/limiter/limiter';
import { azure } from '@ai-sdk/azure';
import { openai } from '@ai-sdk/openai'; // Ensure OPENAI_API_KEY environment variable is set
import { Logger } from '@spectacular/utils';
import { error } from '@sveltejs/kit';
import { JSONParseError, type LanguageModel, TypeValidationError, generateObject, streamObject, streamText } from 'ai';
import { ollama } from 'ollama-ai-provider';
import { z } from 'zod';

const log = new Logger('experiments:ai:date:server');

// free https://platform.openai.com/docs/guides/rate-limits/free-tier-rate-limits
// const model = openai('gpt-4o-mini');
const model = openai('gpt-4o');
// const model = openai('gpt-4-turbo');
// const model = openai('llama3-8b-8192');
// const model = ollama('phi3'); // phi3, mistral, llama3

const system =
  'You are a suggestion generator. Provide all possible suggestions for a given category value. Do not include the prompt. Do not enclose the response in quotes.';
const schema = z.object({
  options: z
    .enum([
      'Anesthesiology',
      'Cardiology',
      'Dermatology',
      'Emergency Medicine',
      'Endocrinology',
      'Family Medicine',
      'Gastroenterology',
      'General Surgery',
      'Geriatrics',
      'Hematology',
      'Infectious Disease',
      'Internal Medicine',
      'Nephrology',
      'Neurology',
      'Obstetrics & Gynecology',
      'Oncology',
      'Ophthalmology',
      'Orthopedics',
      'Pediatrics',
      'Psychiatry',
      'Pulmonology',
      'Urology',
    ])
    .array()
    .nullish(),
});
export const POST = async (event) => {
  // ratelimit
  // if (await limiter.isLimited(event)) error(429);

  const { request } = event;
  const { value } = await request.json();
  log.debug({ value });

  try {
    const result = await generateObject({
      model,
      output: 'array',
      schema,
      system,
      prompt: ` \nGenerate possible Suggestions from Text: ${value}`,
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
