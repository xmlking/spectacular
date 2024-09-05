import { browser } from '$app/environment';
import { Logger } from '@spectacular/utils';
import { getContext, onDestroy, setContext } from 'svelte';
import { derived, get, readable, readonly, writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';

/**
 *  Chrome AI Interfaces
 */

export enum ChromeAICapabilityAvailability {
  /**
   * the device or browser does not support prompting a language model at all
   */
  NO = 'no',
  /**
   * the device or browser supports prompting a language model, but it needs to be downloaded before it can be used
   */
  AFTER_DOWNLOAD = 'after-download',
  /**
   * the device or browser supports prompting a language model and it’s ready to be used without any downloading steps
   */
  READILY = 'readily',
}

export interface ChromeAIAssistantCapabilities {
  available: ChromeAICapabilityAvailability;
  defaultTemperature: number;
  defaultTopK: number;
  maxTopK: number;
}

export interface ChromeAIAssistantCreateOptions extends Record<string, any> {
  temperature?: number;
  topK?: number;
}

export interface ChromeAIAssistant {
  maxTokens: number;
  temperature: number;
  tokensLeft: number;
  tokensSoFar: number;
  topK: number;
  destroy: () => Promise<void>;
  prompt: (prompt: string) => Promise<string>;
  promptStreaming: (prompt: string) => ReadableStream<string>;
}

export interface ChromeAIAssistantFactory {
  capabilities: () => Promise<ChromeAIAssistantCapabilities>;
  create: (options?: ChromeAIAssistantCreateOptions) => Promise<ChromeAIAssistant>;
}

export interface ChromePromptAPI extends Record<string, any> {
  assistant: ChromeAIAssistantFactory;
}

// ----

interface ChromeAISummarizer {
  // sharedContext: string;
  destroy: () => Promise<void>;
  summarize: (input: string) => Promise<string>;
  summarizeStreaming: (prompt: string) => ReadableStream<string>;
}
interface ChromeAISummarizerCapabilities {
  available: ChromeAICapabilityAvailability;
}
interface ChromeAIWriter {
  sharedContext: string;
  write: (input: string) => Promise<string>;
}
interface ChromeAIRewriter {
  length: string; // "as-is"
  sharedContext: string;
  tone: string; // "as-is"
  rewrite: (input: string) => Promise<string>;
}
interface ChromeAITranslationDetector {
  detect: (input: string) => Promise<ChromeAITranslationResult[]>;
}
interface ChromeAITranslationResult {
  confidence: number;
  detectedLanguage: string;
}

// ----

declare global {
  interface Window {
    ai: {
      assistant: {
        create: () => Promise<ChromeAIAssistant>;
        capabilities: () => Promise<ChromeAIAssistantCapabilities>;
      };
      summarizer: {
        create: () => Promise<ChromeAISummarizer>;
        capabilities: () => Promise<ChromeAISummarizerCapabilities>;
      };
      writer: {
        create: () => Promise<ChromeAIWriter>;
      };
      rewriter: {
        create: () => Promise<ChromeAIRewriter>;
      };
    };
    translation: {
      canDetect: () => Promise<boolean>;
      createDetector: () => Promise<ChromeAITranslationDetector>;
    };
  }
}

/**
 *  Chrome AI Util Functions
 */

function getChromeVersion() {
  const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
  return raw ? Number.parseInt(raw[2], 10) : 0;
}

async function getAssistantCapabilities(): Promise<ChromeAIAssistantCapabilities> {
  const state: ChromeAIAssistantCapabilities = window.ai.assistant
    ? await window.ai.assistant.capabilities()
    : {
        available: (await window.ai.canCreateTextSession()) as ChromeAICapabilityAvailability,
        defaultTopK: 3,
        maxTopK: 128,
        defaultTemperature: 0.8,
      };
  return state;
}

function getAssistantApi() {
  return {
    create: window.ai.assistant
      ? window.ai.assistant.create.bind(window.ai.assistant)
      : window.ai.createTextSession.bind(window.ai),
  };
}

/**
 *  Chrome AI Stores
 */

export class ChromeAI {
  #log = new Logger('chromeai.store.client');
  readonly #errors = writable<Array<string>>([]);
  readonly isLoading = writable<boolean>(false);
  readonly #options: ChromeAIAssistantCreateOptions;

  readonly isAISupported: Readable<boolean> = readable(false, (set, update) => {
    if (browser) {
      const version = getChromeVersion();
      this.#log.debug({ chromeVersion: version, isAISupported: 'ai' in globalThis });
      if (version < 129) {
        this.#errors.update((errors) => {
          errors.push('Your browser is not supported. Please update to 129 version or greater');
          return errors;
        });
        return;
      }
      if (!('ai' in globalThis)) {
        this.#errors.update((errors) => {
          errors.push(
            'Prompt API is not available, check your configuration in chrome://flags/#prompt-api-for-gemini-nano',
          );
          return errors;
        });
        return;
      }
      set(true);
    }
  });

  readonly isAssistantReady = derived(
    this.isAISupported,
    ($isAISupported, set) => {
      if (browser && $isAISupported) {
        getAssistantCapabilities().then((cap) => {
          set(cap.available === ChromeAICapabilityAvailability.READILY);
        });
      }
    },
    false,
  );

  // readonly isSummarizeReady =
  // readonly isWriterReady =
  // readonly isRewriterReady =
  // readonly isDetectorReady =

  readonly #assistant: ChromeAIAssistant;
  #summarizer: ChromeAISummarizer;
  #writer: ChromeAIWriter;
  #rewriter: ChromeAIRewriter;
  #detector: ChromeAITranslationDetector;

  constructor(options: ChromeAIAssistantCreateOptions) {
    this.#options = options;

    onDestroy(async () => {
      this.#log.debug('onDestroy called');
      await this.reset();
    });
  }

  async init() {
    if (get(this.isAISupported) === false) return;
    const cap = await getAssistantCapabilities();

    if (cap.available !== ChromeAICapabilityAvailability.READILY) {
      this.#log.error('Built-in assistant model not ready');
      this.#errors.update((errors) => {
        errors.push('Built-in assistant model not ready');
        return errors;
      });
      return;
    }

    this.#assistant = await getAssistantApi().create({
      temperature: cap.defaultTemperature,
      topK: cap.defaultTopK,
      ...this.#options,
    });
  }

  get errors() {
    return readonly(this.#errors);
  }

  get assistant() {
    return this.#assistant;
  }

  async reset() {
    await this.#assistant?.destroy();
  }
}

const CHROME_AI_KEY = Symbol('CHROME_AI');

export const setChromeAI = () => {
  const chromeAI = new ChromeAI({});
  chromeAI.init();
  return setContext(CHROME_AI_KEY, chromeAI);
};

export const getChromeAI = () => {
  return getContext<ReturnType<typeof setChromeAI>>(CHROME_AI_KEY);
};
