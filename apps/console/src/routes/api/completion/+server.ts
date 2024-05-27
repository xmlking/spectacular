import { createOpenAI } from '@ai-sdk/openai';
import { StreamingTextResponse, streamText } from 'ai';

import { env } from '$env/dynamic/private';
import { Logger } from '@spectacular/utils';
// import { limiter } from '$lib/server/limiter/limiter'; // TODO

const log = new Logger('experiments:ai:completion:server');

// https://sdk.vercel.ai/docs/getting-started/svelte
const openai = createOpenAI({
  organization: env.OPENAI_ORG_ID,
  project: env.OPENAI_PROJECT_ID,
  apiKey: env.OPENAI_API_KEY,
});

// free https://platform.openai.com/docs/guides/rate-limits/free-tier-rate-limits
const model = openai('gpt-3.5-turbo');
// const model = openai("llama3-8b-8192")
const system =
  'You are a text editor. You will be given a prompt and a text to edit, which may be empty or incomplete. Edit the text to match the prompt, and only respond with the full edited version of the text - do not include any other information, context, or explanation. If you add on to the text, respond with the full version, not just the new portion. Do not include the prompt or otherwise preface your response. Do not enclose the response in quotes.';

export const POST = async ({ request }) => {
    const { text, prompt } = await request.json();
    log.debug({ text, prompt });
    if (!prompt) return new Response('Prompt is required', { status: 400 });

    const result = await streamText({ model, system, prompt: `Prompt: ${prompt}\nText: ${text}` });

    return new StreamingTextResponse(result.toAIStream());
};
