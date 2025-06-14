// This file is auto-generated. Do not edit manually.
// This will be populated by the CLI if used
// biome-ignore lint/complexity/noBannedTypes: <ok>
export type GeneratedTypeMap = {};

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
