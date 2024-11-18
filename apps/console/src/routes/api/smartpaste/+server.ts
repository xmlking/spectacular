import { limiter } from '$lib/server/limiter/limiter';
import { openai } from '@ai-sdk/openai'; // Ensure OPENAI_API_KEY environment variable is set
import { Logger } from '@spectacular/utils';
import { error } from '@sveltejs/kit';
import { JSONParseError, type LanguageModel, TypeValidationError, generateObject, streamObject, streamText } from 'ai';
import { ollama } from 'ollama-ai-provider';
import { z } from 'zod';

const phoneRegex = /^\+[1-9]\d{1,14}$/;

const log = new Logger('experiments:ai:date:server');

// free https://platform.openai.com/docs/guides/rate-limits/free-tier-rate-limits
const model = openai('gpt-4o-mini');
// const model = openai('gpt-4o');
// const model = openai('gpt-4-turbo');
// const model = openai('llama3-8b-8192');
// const model = ollama('phi3'); // phi3, mistral, llama3

const system =
  'You are a contact information extracter. Given a block of text, extract the contact details including first name,last name,phone number,address line1,address line2, city, state, zip code and country . Ensure the details are formatted according to the schema provided. If the phone number is not in the correct format, convert it to the appropriate international format by adding relavent country code. Do not include the prompt in your response ';
const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z
    .string()
    .regex(phoneRegex, 'Invalid format. A Valid mobile number should look like +123456789012')
    .min(10)
    .max(15)
    .nullable(),
  line1: z.string().nullish(),
  line2: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  zip: z.number().nullish(),
  country: z.string().nullish(),
});

export const POST = async (event) => {
  // ratelimit
  // if (await limiter.isLimited(event)) error(429);

  const { request } = event;
  const { value } = await request.json();
  log.debug({ value });
  if (!value) return new Response('Prompt is required', { status: 400 });

  try {
    const result = await generateObject({
      model,
      schema,
      system,
      prompt: `Extract the following details from the data:\n ${value}`,
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
