import { openai } from '@ai-sdk/openai'; // Ensure OPENAI_API_KEY environment variable is set
import { Logger } from '@repo/utils';
import { error } from '@sveltejs/kit';
import { generateObject, JSONParseError, type LanguageModel, streamObject, streamText, TypeValidationError } from 'ai';
import { ollama } from 'ollama-ai-provider';
import { z } from 'zod';
import { read } from '$app/server';
import schemaFile from '../../../../schema.graphql?url';

const outputSchema = z.object({
  query: z.string().nullish().describe('GraphQL query'),
  variables: z.any().nullish().describe('GraphQL variables'),
});

const outputJSONSchema = z.toJSONSchema(outputSchema);

const log = new Logger('smart:gql:server');

const system = 'You are a GraphQL query generator.';
const asset = read(schemaFile);
const gqlSchema = await asset.text();
// const gqlSchema1 = await asset.arrayBuffer();

function prompt_template(question: string) {
  // return `Given the following GraphQL schema:
  // ${gqlSchema}
  // Please transform the following text into a GraphQL query:
  //  ${ question}
  // `;

  return `Given an input question, Convert into a syntactically correct GraphQL Query and variables.
  Do not include \`nodes\` in the query.

  # GraphQL Reference

  ${gqlSchema}

  # Question
  ${question}
  `;
}

// console.log({ gqlSchema });
// const model = openai('gpt-4.1-nano');
const model = openai('gpt-4.1-mini');
// const model = openai('gpt-4.1');
// const model = openai('o3-mini');
// const model = openai('gpt-4.1-mini', { structuredOutputs: true });
// const model = openai('gpt-4.1', { structuredOutputs: true });
// const model = ollama('gemma3:12b', { structuredOutputs: true });

export const POST = async (event) => {
  const { request } = event;
  const { prompt } = await request.json();
  if (!prompt) return new Response('prompt not send', { status: 400 });

  try {
    const result = await generateObject({
      model,
      schema: outputSchema,
      prompt: prompt_template(prompt),
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
