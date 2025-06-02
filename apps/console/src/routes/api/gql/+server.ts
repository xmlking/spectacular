import { read } from '$app/server';
import { Logger } from '@repo/utils';
import { ollama } from 'ollama-ai-provider';
import { zodToJsonSchema } from 'openai-zod-to-json-schema';
import { z } from 'zod';
import schemaFile from '../../../../schema.graphql?url';
import { GQLPTClient } from './gqlpt';
import { AdapterOpenAI } from './openai';

const adapter = new AdapterOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

const typeDefs = gqlSchema;
const client = new GQLPTClient({
  adapter,
  typeDefs,
});

// console.log({ gqlSchema });
// const model = openai('gpt-4o-mini');
// const model = openai('gpt-4o-mini', { structuredOutputs: true });
// const model = openai('gpt-4o', { structuredOutputs: true });
// const model = ollama('gemma3:12b', { structuredOutputs: true });

export const POST = async (event) => {
  const { request } = event;
  const { prompt } = await request.json();
  if (!prompt) return new Response('prompt not send', { status: 400 });

  try {
    await client.connect();
    const result = await client.generateQueryAndVariables(prompt);
    return new Response(JSON.stringify(result));
  } catch (err) {
    log.error('backend error', err);
  }
};
