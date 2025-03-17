import { Adapter } from './types';
import { clearOperationNames, compressTypeDefs, hashTypeDefs, introspection, postGeneratedQuery } from './utils';

import { sortAST } from '@apollo/utils.sortast';
import { promises } from 'fs';
import {
  type DocumentNode,
  GraphQLSchema,
  type SelectionNode,
  buildClientSchema,
  buildSchema,
  graphql,
  lexicographicSortSchema,
  parse,
  print,
  printSchema,
  validate,
} from 'graphql';
import path from 'path';

const log = new Logger('smart:gqlpt:server');

import {
  JSON_RESPONSE_FORMAT,
  QUERY_GENERATION_RULES,
  QUERY_JSON_RESPONSE_FORMAT,
  TYPE_GENERATION_RULES,
} from './rules';
import type { DefaultTypeMap, GeneratedTypeMap } from './types';
import { Logger } from '@spectacular/utils';

export interface GQLPTClientOptions {
  url?: string;
  headers?: Record<string, string>;
  typeDefs?: string;
  schema?: GraphQLSchema;
  adapter: Adapter;
  generatedPath?: string;
  maxRetries?: number;
  excludedQueries?: string[];
}

type MergedTypeMap = GeneratedTypeMap & DefaultTypeMap;

export class GQLPTClient<T extends MergedTypeMap = MergedTypeMap> {
  options: GQLPTClientOptions;
  schema?: GraphQLSchema;
  typeDefs?: string;
  schemaHash?: string;

  private queryMap: Record<
    string,
    {
      query: string;
      variables?: Record<string, unknown>;
    }
  > = {};

  constructor(options: GQLPTClientOptions) {
    this.options = options;

    if (!options.adapter) {
      throw new Error('Missing adapter');
    }

    if (!options.typeDefs && !options.url && !options.schema) {
      throw new Error('Missing typeDefs, url or schema');
    }

    if (options.typeDefs) {
      try {
        parse(options.typeDefs);
      } catch (error) {
        throw new Error(`Cannot parse typeDefs ${error}`);
      }
    }
  }

  getAdapter() {
    return this.options.adapter;
  }

  public getTypeDefs() {
    return this.typeDefs;
  }

  async connect() {
    log.info('Connecting to GQLPTClient');

    await this.getAdapter().connect();

    log.info('Connected to GQLPTClient');

    if (this.options.typeDefs) {
      log.info('Building schema from typeDefs');

      const schema = buildSchema(this.options.typeDefs);
      this.typeDefs = printSchema(schema);
      this.schema = lexicographicSortSchema(schema);
      this.schemaHash = await hashTypeDefs(this.options.typeDefs);
    } else if (this.options.url) {
      log.info('Fetching schema from URL');

      const response = await introspection({
        url: this.options.url,
        headers: this.options.headers,
      });

      const schema = buildClientSchema(response.data);
      this.schema = lexicographicSortSchema(schema);
      this.typeDefs = printSchema(this.schema);
      this.schemaHash = await hashTypeDefs(this.typeDefs);
    } else if (this.options.schema) {
      log.info('Building schema from provided schema');
      this.schema = lexicographicSortSchema(this.options.schema);
      this.typeDefs = printSchema(this.schema);
      this.schemaHash = await hashTypeDefs(this.typeDefs);
    }

    log.info('Schema built');

    const generatedPath = this.options.generatedPath || 'node_modules/gqlpt/build/generated.json';
    const resolvedGeneratedPath = path.resolve(process.cwd(), generatedPath);

    if (generatedPath) {
      log.info(`Reading generated queries from ${resolvedGeneratedPath}`);

      try {
        const content = await promises.readFile(resolvedGeneratedPath, 'utf-8');
        const jsonObj = JSON.parse(content);
        const schemaHashEntry = jsonObj[this.schemaHash || ('' as string)] as any;

        if (schemaHashEntry) {
          Object.entries(schemaHashEntry).forEach(([key, value]) => {
            const v = value as {
              query: string;
              variables?: Record<string, unknown>;
            };

            this.queryMap[key] = {
              query: v.query,
              variables: v.variables,
            };
          });
        }
      } catch (error) {
        log.error(`Error reading generated queries: ${(error as Error).message}`);
      } finally {
        log.info('Read generated queries');
      }
    }
  }

  async generateQueryAndVariables(plainText: string): Promise<{
    query: string;
    variables?: Record<string, unknown>;
  }> {
    log.info(`Generating query for: ${plainText}`);

    const typeDefs = this.getTypeDefs();
    if (!typeDefs) {
      throw new Error('Missing typeDefs, url or schema - have you called connect?');
    }

    const generated = this.queryMap[plainText];
    if (generated) {
      log.info(`Using cached query for: ${plainText}`);

      return {
        query: generated.query,
        variables: generated.variables,
      };
    }

    return this.generateQueryWithRetry(plainText, compressTypeDefs(typeDefs));
  }

  async generateAndSend<Q extends string>(
    plainText: Q,
    {
      urlOverride,
      headersOverride,
    }: {
      urlOverride?: string;
      headersOverride?: Record<string, string>;
    } = {},
  ): Promise<Q extends keyof T ? T[Q] : any> {
    if (!this.options.url && !urlOverride && !this.options.schema) {
      throw new Error('Missing url or schema to query');
    }

    const { query, variables } = await this.generateQueryAndVariables(plainText);

    let response: any;

    if (this.options.schema && this.schema) {
      const gqlResponse = await graphql({
        schema: this.schema as GraphQLSchema,
        source: query,
        variableValues: variables,
      });

      response = {
        data: gqlResponse.data,
        errors: gqlResponse.errors,
      };
    } else {
      response = await postGeneratedQuery({
        query,
        variables,
        url: (urlOverride || this.options.url) as string,
        headers: headersOverride || this.options.headers,
      });
    }

    return response as Q extends keyof T ? T[Q] : any;
  }

  async generateQueryAndTypeForBuild(plainText: string): Promise<{
    query: string;
    variables?: Record<string, unknown>;
    typeDefinition: string;
  }> {
    const typeDefs = this.getTypeDefs();
    if (!typeDefs) {
      throw new Error('Missing typeDefs, url or schema - have you called connect?');
    }

    const query = `
      Given the following GraphQL schema:

      ${compressTypeDefs(typeDefs)}

      And this plain text query:
      "${plainText}"

      Please perform the following tasks:

      1. Generate a GraphQL query that answers the plain text query.
      2. Provide any necessary variables for the query.
      3. Based on the generated query, create a TypeScript type definition that represents the expected structure of the query result.

      ${QUERY_GENERATION_RULES}

      ${TYPE_GENERATION_RULES}

      ${JSON_RESPONSE_FORMAT}
    `;

    const { content } = await this.getAdapter().sendText(query);

    const result = JSON.parse(content) as {
      query: string;
      variables?: Record<string, unknown>;
      typeDefinition: string;
    };

    const queryAst = parse(result.query, { noLocation: true });
    const newAst = clearOperationNames(queryAst);
    const sortedAst = sortAST(newAst);
    const printedQuery = print(sortedAst);

    return {
      query: printedQuery,
      variables: result.variables,
      typeDefinition: result.typeDefinition,
    };
  }

  private async generateQueryWithRetry(
    plainText: string,
    schema: string,
    retryCount: number = 0,
    conversationId?: string,
    currentQuery?: string,
  ): Promise<{ query: string; variables?: Record<string, unknown> }> {
    const isRetry = retryCount > 0;

    const prompt = isRetry
      ? `
      The previous GraphQL query attempt:
      ${currentQuery}

      Failed with the following validation errors:
      ${this.validateQueryAgainstSchema(currentQuery!).join('\n')}

      ${this.options.excludedQueries?.length ? `Note: The following queries cannot be used: ${this.options.excludedQueries.join(', ')}` : ''}

      Please fix these validation errors.

      ${QUERY_GENERATION_RULES}

      ${QUERY_JSON_RESPONSE_FORMAT}
    `
      : `
      Given the following GraphQL schema:

      ${compressTypeDefs(schema)}

      And this plain text query:
      "${plainText}"

      Please generate a valid GraphQL query that answers the plain text query.

      ${QUERY_GENERATION_RULES}

      ${QUERY_JSON_RESPONSE_FORMAT}
    `;

    log.info(`Sending prompt to adapter: ${prompt}`);
    log.info(`Conversation ID: ${conversationId}`);
    log.info(`Retry count: ${retryCount}`);

    const response = await this.getAdapter().sendText(prompt, conversationId);

    const result = JSON.parse((response.content || '').replace(/`/g, '')) as {
      query: string;
      variables?: Record<string, unknown>;
    };

    const queryAst = parse(result.query, { noLocation: true });
    const excludedErrors = this.validateExcludedQuery(queryAst);

    if (excludedErrors.length > 0) {
      if (retryCount >= (this.options.maxRetries || 5)) {
        throw new Error(
          `Could not generate valid query after ${retryCount} attempts. Last errors: ${excludedErrors.join(', ')}`,
        );
      }

      return this.generateQueryWithRetry(plainText, schema, retryCount + 1, response.conversationId, result.query);
    }

    const newAst = clearOperationNames(queryAst);
    const sortedAst = sortAST(newAst);
    const generatedQuery = print(sortedAst);

    const validationErrors = this.validateQueryAgainstSchema(generatedQuery);

    if (validationErrors.length === 0) {
      const res = {
        query: generatedQuery,
        variables: result.variables,
      };

      log.info(`Generated query: ${result.query}`);
      log.info(`Variables: ${JSON.stringify(result.variables)}`);

      return res;
    }

    if (retryCount >= (this.options.maxRetries || 5)) {
      throw new Error(
        `Could not generate valid query after ${retryCount} attempts. Last errors: ${validationErrors.join(', ')}`,
      );
    }

    try {
      return await this.generateQueryWithRetry(
        plainText,
        schema,
        retryCount + 1,
        response.conversationId,
        generatedQuery,
      );
    } catch (error) {
      throw new Error(`Failed to generate query on retry ${retryCount + 1}: ${(error as Error).message}`);
    }
  }

  private validateQueryAgainstSchema(queryString: string): string[] {
    log.info('Validating query against schema');

    if (!this.schema) {
      throw new Error('Schema not initialized');
    }

    try {
      const queryDoc = parse(queryString);
      const errors = validate(this.schema, queryDoc);
      return errors.map((error) => error.message);
    } catch (error) {
      log.error(`Error validating query: ${(error as Error).message}`);

      return [(error as Error).message];
    } finally {
      log.info('Query validated');
    }
  }

  private validateSelectionSet(
    selections: ReadonlyArray<SelectionNode>,
    operationType: string,
    errors: string[],
  ): void {
    for (const selection of selections) {
      if (selection.kind === 'Field') {
        const fieldName = selection.name.value;
        if (this.options.excludedQueries?.includes(fieldName)) {
          errors.push(`${operationType} contains excluded field '${fieldName}'. This field cannot be used.`);
        }

        if (selection.selectionSet?.selections) {
          this.validateSelectionSet(selection.selectionSet.selections, operationType, errors);
        }
      }
    }
  }

  private validateExcludedQuery(queryDoc: DocumentNode): string[] {
    if (!this.options.excludedQueries?.length) {
      return [];
    }

    const errors: string[] = [];

    for (const def of queryDoc.definitions) {
      if (def.kind === 'OperationDefinition') {
        const operationType = def.operation;
        if (def.selectionSet?.selections) {
          this.validateSelectionSet(def.selectionSet.selections, operationType, errors);
        }
      }
    }

    return errors;
  }
}
