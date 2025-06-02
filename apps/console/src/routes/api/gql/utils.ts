import crypto from 'node:crypto';
import {
  type DefinitionNode,
  type DocumentNode,
  getIntrospectionQuery,
  Kind,
  type OperationDefinitionNode,
} from 'graphql';

export function clearOperationNames(doc: DocumentNode): DocumentNode {
  const newAst: DocumentNode = {
    kind: Kind.DOCUMENT,
    definitions: doc.definitions.map((def: DefinitionNode) => {
      if (def.kind === Kind.OPERATION_DEFINITION) {
        const newDef: OperationDefinitionNode = {
          kind: Kind.OPERATION_DEFINITION,
          operation: def.operation,
          variableDefinitions: def.variableDefinitions,
          directives: def.directives,
          selectionSet: def.selectionSet,
          name: undefined,
        };
        return newDef;
      }
      return def;
    }),
  };
  return newAst;
}

export async function introspection({ url, headers }: { url: string; headers?: Record<string, string> }) {
  const introspectionQuery = getIntrospectionQuery();

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    body: JSON.stringify({
      query: introspectionQuery,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const json = (await response.json()) as any;

  if (json.errors) {
    throw new Error(JSON.stringify(json.errors, null, 2));
  }

  return json;
}

export function hashTypeDefs(typeDefs: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(typeDefs);

  return crypto.subtle.digest('SHA-256', data).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
  });
}

export function compressTypeDefs(typeDefs: string): string {
  return typeDefs
    .replace(/[\s\t]+/g, ' ') // Replace multiple whitespaces and tabs with a single space
    .replace(/"\s+/g, '"') // Remove spaces after quotes
    .replace(/\s+"/g, '"') // Remove spaces before quotes
    .replace(/\\n/g, '') // Remove newline characters
    .replace(/\s*#.*$/gm, '') // Remove comments
    .trim(); // Trim leading and trailing whitespace
}

export async function postGeneratedQuery({
  query,
  variables,
  url,
  headers,
}: {
  query: string;
  variables?: Record<string, unknown>;
  url: string;
  headers?: Record<string, string>;
}): Promise<{
  errors?: any;
  data?: any;
}> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const json = (await response.json()) as any;

  return {
    errors: json.errors,
    data: json.data,
  };
}
