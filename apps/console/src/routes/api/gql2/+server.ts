import { openai } from '@ai-sdk/openai'; // Ensure OPENAI_API_KEY environment variable is set
import { Logger } from '@spectacular/utils';
import { error } from '@sveltejs/kit';
import { JSONParseError, type LanguageModel, TypeValidationError, generateObject, streamObject, streamText } from 'ai';
import { zodToJsonSchema } from 'openai-zod-to-json-schema';
import { z } from 'zod';
import { read } from '$app/server';
import { ollama } from 'ollama-ai-provider';
import schemaFile from '../../../../schema.graphql?url';

const outputSchema = z.object({
  query: z.string().nullish().describe('GraphQL query'),
  variables: z.any().nullish().describe('GraphQL variables'),
});
const outputJSONSchema = zodToJsonSchema(outputSchema, { openaiStrictMode: true });

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
const model = openai('gpt-4o-mini');
// const model = openai('gpt-4o-mini', { structuredOutputs: true });
// const model = openai('gpt-4o', { structuredOutputs: true });
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
