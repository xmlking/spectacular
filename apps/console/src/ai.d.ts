/**
 * Types from
 * https://github.com/swissspidy/ai-experiments/blob/main/packages/editor/src/%40types/ai.d.ts
 */

interface WindowOrWorkerGlobalScope {
  readonly ai: AI;
  readonly translation: Translation;
}

interface AI {
  readonly assistant: AIAssistantFactory;
  readonly summarizer: AISummarizerFactory;
  readonly writer: AIWriterFactory;
  readonly rewriter: AIRewriterFactory;
}

interface AICreateMonitor extends EventTarget {
  ondownloadprogress: ((this: AICreateMonitor, ev: DownloadProgressEvent) => any) | null;

  addEventListener<K extends keyof AICreateMonitorEventMap>(
    type: K,
    listener: (this: AICreateMonitor, ev: AICreateMonitorEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof AICreateMonitorEventMap>(
    type: K,
    listener: (this: AICreateMonitor, ev: AICreateMonitorEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

interface DownloadProgressEvent extends Event {
  readonly loaded: number;
  readonly total: number;
}

interface AICreateMonitorEventMap {
  downloadprogress: DownloadProgressEvent;
}

type AICreateMonitorCallback = (monitor: AICreateMonitor) => void;

type AICapabilityAvailability = 'readily' | 'after-download' | 'no';

// Assistant
// https://github.com/explainers-by-googlers/prompt-api/#full-api-surface-in-web-idl

interface AIAssistantFactory {
  create(
    options?: AIAssistantCreateOptionsWithSystemPrompt | AIAssistantCreateOptionsWithoutSystemPrompt,
  ): Promise<AIAssistant>;
  capabilities(): Promise<AIAssistantCapabilities>;
}

interface AIAssistantCreateOptions {
  signal?: AbortSignal;
  monitor?: AICreateMonitorCallback;

  topK?: number;
  temperature?: number;
}

interface AIAssistantCreateOptionsWithSystemPrompt extends AIAssistantCreateOptions {
  systemPrompt?: string;
  initialPrompts?: Array<AIAssistantAssistantPrompt | AIAssistantUserPrompt>;
}

interface AIAssistantCreateOptionsWithoutSystemPrompt extends AIAssistantCreateOptions {
  systemPrompt?: never;
  initialPrompts?:
    | [AIAssistantSystemPrompt, ...Array<AIAssistantAssistantPrompt | AIAssistantUserPrompt>]
    | Array<AIAssistantAssistantPrompt | AIAssistantUserPrompt>;
}

type AIAssistantPromptRole = 'system' | 'user' | 'assistant';

interface AIAssistantPrompt {
  role?: AIAssistantPromptRole;
  content?: string;
}

interface AIAssistantSystemPrompt extends AIAssistantPrompt {
  role: 'system';
}

interface AIAssistantUserPrompt extends AIAssistantPrompt {
  role: 'user';
}

interface AIAssistantAssistantPrompt extends AIAssistantPrompt {
  role: 'assistant';
}

interface AIAssistant extends EventTarget {
  prompt(input: string, options?: AIAssistantPromptOptions): Promise<string>;
  promptStreaming(input: string, options?: AIAssistantPromptOptions): ReadableStream<string>;

  countPromptTokens(input: string, options?: AIAssistantPromptOptions): Promise<number>;
  readonly maxTokens: number;
  readonly tokensSoFar: number;
  readonly tokensLeft: number;

  readonly topK: number;
  readonly temperature: number;

  oncontextoverflow: ((this: AIAssistant, ev: Event) => any) | null;

  addEventListener<K extends keyof AIAssistantEventMap>(
    type: K,
    listener: (this: AIAssistant, ev: AIAssistantEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof AIAssistantEventMap>(
    type: K,
    listener: (this: AIAssistant, ev: AIAssistantEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;

  clone(): Promise<AIAssistant>;
  destroy(): void;
}

interface AIAssistantEventMap {
  contextoverflow: Event;
}

interface AIAssistantPromptOptions {
  signal?: AbortSignal;
}

interface AIAssistantCapabilities {
  readonly available: AICapabilityAvailability;

  readonly defaultTopK: number | null;
  readonly maxTopK: number | null;
  readonly defaultTemperature: number | null;

  supportsLanguage(languageTag: Intl.UnicodeBCP47LocaleIdentifier): AICapabilityAvailability;
}

/**
 * Summarization API
 */
interface AISummarizerFactory {
  create(options?: AISummarizerCreateOptions): Promise<AISummarizer>;
  capabilities(): Promise<AISummarizerCapabilities>;
}

interface AISummarizerCapabilities {
  available: AICapabilityAvailability;
  supportsType(tone: AISummarizerType): AICapabilityAvailability;
  supportsFormat(format: AISummarizerFormat): AICapabilityAvailability;
  supportsLength(length: AISummarizerLength): AICapabilityAvailability;
  supportsInputLanguage(languageTag: string): AICapabilityAvailability;
}

interface AISummarizerCreateOptions {
  signal?: AbortSignal;
  monitor?: AICreateMonitorCallback;
  sharedContext?: string;
  type?: AISummarizerType; // Default is 'key-points'.
  format?: AISummarizerFormat; // Default is 'markdown'.
  length?: AISummarizerLength; // Default is 'short'.
}

type AISummarizerType = 'tl;dr' | 'key-points' | 'teaser' | 'headline';
type AISummarizerFormat = 'plain-text' | 'markdown';
type AISummarizerLength = 'short' | 'medium' | 'long';

interface AISummarizerSummarizeOptions {
  signal?: AbortSignal;
  context?: string;
}

interface AISummarizer extends EventTarget {
  ready: Promise<undefined>;
  summarize(input: string, options?: AISummarizerSummarizeOptions): Promise<string>;
  summarizeStreaming(input: string, options?: AISummarizerSummarizeOptions): ReadableStream<string>;
}

/**
 * Writer API
 */
interface AIWriterFactory {
  create(options?: AIWriterCreateOptions): Promise<AIWriter>;
  capabilities(): Promise<AIWriterCapabilities>;
}

interface AIWriterCapabilities {
  available: AICapabilityAvailability;
  supportsTone(tone: AIWriterTone): AICapabilityAvailability;
  supportsFormat(format: AIWriterFormat): AICapabilityAvailability;
  supportsLength(length: AIWriterLength): AICapabilityAvailability;
  supportsInputLanguage(languageTag: string): AICapabilityAvailability;
}

interface AIWriterCreateOptions {
  signal?: AbortSignal;
  monitor?: AICreateMonitorCallback;
  sharedContext?: string;
  tone?: AIWriterTone; // Default is 'key-points'.
  format?: AIWriterFormat; // Default is 'markdown'.
  length?: AIWriterLength; // Default is 'short'.
}

// TODO: What about 'key-points'? File issue.
type AIWriterTone = 'formal' | 'neutral' | 'casual';
type AIWriterFormat = 'plain-text' | 'markdown';
type AIWriterLength = 'short' | 'medium' | 'long';

interface AIWriterWriteOptions {
  signal?: AbortSignal;
  context?: string;
}

interface AIWriter {
  write(writingTask: string, options?: AIWriterWriteOptions): Promise<string>;
  writeStreaming(writingTask: string, options?: AIWriterWriteOptions): ReadableStream<string>;
  tone: AIWriterTone;
  format: AIWriterFormat;
  length: AIWriterLength;
  destroy(): void;
}

/**
 * Rewriter API
 */
interface AIRewriterFactory {
  create(options?: AIRewriterCreateOptions): Promise<AIRewriter>;
  capabilities(): Promise<AIRewriterCapabilities>;
}

interface AIRewriterCapabilities {
  available: AICapabilityAvailability;
  supportsTone(tone: AIRewriterTone): AICapabilityAvailability;
  supportsFormat(format: AIRewriterFormat): AICapabilityAvailability;
  supportsLength(length: AIRewriterLength): AICapabilityAvailability;
  supportsInputLanguage(languageTag: string): AICapabilityAvailability;
}

interface AIRewriterCreateOptions {
  signal?: AbortSignal;
  monitor?: AICreateMonitorCallback;
  sharedContext?: string;
  tone?: AIRewriterTone; // Default is 'as-is'.
  format?: AIRewriterFormat; // Default is 'as-is'.
  length?: AIRewriterLength; // Default is 'as-is'.
}

type AIRewriterTone = 'as-is' | 'more-formal' | 'more-casual';
type AIRewriterFormat = 'as-is' | 'plain-text' | 'markdown';
type AIRewriterLength = 'as-is' | 'shorter' | 'longer';

interface AIRewriterRewriteOptions {
  signal?: AbortSignal;
  context?: string;
}

interface AIRewriter {
  rewrite(writingTask: string, options?: AIRewriterRewriteOptions): Promise<string>;
  rewriteStreaming(writingTask: string, options?: AIRewriterRewriteOptions): ReadableStream<string>;
  tone: AIRewriterTone;
  format: AIRewriterFormat;
  length: AIRewriterLength;
  destroy(): void;
}

/**
 * Translation API
 */
interface Translation {
  canDetect(): Promise<AICapabilityAvailability>;
  createDetector(): Promise<LanguageDetector>;
}

interface LanguageDetector extends EventTarget {
  ready: Promise<undefined>;
  ondownloadprogress?(evt: Event): void;
  detect(input: string): Promise<LanguageDetectionResult[]>;
}

interface LanguageDetectionResult {
  confidence: number;
  LanguageDetectionResult: string;
}
