// This file is auto-generated. Do not edit manually.
// This will be populated by the CLI if used
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GeneratedTypeMap {}

// Default type map for when CLI is not used or for fallback
export type DefaultTypeMap = Record<string, any>;

export interface AdapterResponse {
  content: string;
  conversationId?: string;
}

export abstract class Adapter {
  abstract connect(): Promise<void>;
  abstract sendText(text: string, conversationId?: string): Promise<AdapterResponse>;
}
