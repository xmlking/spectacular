import { browser } from '$app/environment';
import { Logger } from '@spectacular/utils';
import { getContext, onDestroy, setContext } from 'svelte';
import { derived, get, readable, readonly, writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';

/**
 *  Chrome AI Util Functions
 */

function getChromeVersion() {
  const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
  return raw ? Number.parseInt(raw[2], 10) : 0;
}

async function getAssistantAvailability(): Promise<AICapabilityAvailability> {
  const available: AICapabilityAvailability = window.ai.assistant
    ? (await window.ai.assistant.capabilities()).available
    : ((await window.ai.canCreateTextSession()) as AICapabilityAvailability);
  return available;
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
  readonly #options: AIAssistantCreateOptions;

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
        getAssistantAvailability().then((availability) => {
          set(availability === 'readily');
        });
      }
    },
    false,
  );

  readonly isSummarizeReady = derived(
    this.isAISupported,
    ($isAISupported, set) => {
      if (browser && $isAISupported) {
        window.ai.summarizer?.capabilities().then((cap) => {
          set(cap.available === 'readily');
        });
      }
    },
    false,
  );

  readonly isWriterReady = derived(
    this.isAISupported,
    ($isAISupported, set) => {
      if (browser && $isAISupported) {
        window.ai.summarizer?.capabilities().then((cap) => {
          set(cap.available === 'readily');
        });
      }
    },
    false,
  );

  readonly isRewriterReady = derived(
    this.isAISupported,
    ($isAISupported, set) => {
      if (browser && $isAISupported) {
        window.ai.summarizer?.capabilities().then((cap) => {
          set(cap.available === 'readily');
        });
      }
    },
    false,
  );

  readonly islanguageDetectorReady = derived(
    this.isAISupported,
    ($isAISupported, set) => {
      if (browser && $isAISupported) {
        window.translation?.canDetect().then((availability) => {
          set(availability === 'readily');
        });
      }
    },
    false,
  );

  #assistant: AIAssistant;
  #summarizer: AISummarizer;
  #writer: AIWriter;
  #rewriter: AIRewriter;
  // #detector: LanguageDetector;

  constructor(options: AIAssistantCreateOptions) {
    this.#options = options;

    onDestroy(async () => {
      this.#log.debug('onDestroy called');
      await this.reset();
    });
  }

  async init() {
    if (get(this.isAISupported) === false) return;
    const availability = await getAssistantAvailability();

    if (availability !== 'readily') {
      this.#log.error('Built-in assistant model not ready');
      this.#errors.update((errors) => {
        errors.push('Built-in assistant model not ready');
        return errors;
      });
      return;
    }

    this.#assistant = await getAssistantApi().create({
      // temperature: cap.defaultTemperature,
      // topK: cap.defaultTopK,
      ...this.#options,
    });
    // https://github.com/tomayac/writer-rewriter-api-playground/tree/main
    this.#writer = await window.ai.writer.create({
      // tone: '',
      // length: '',
      // format: '',
      // sharedContext: '',
      ...this.#options,
    });
    this.#rewriter = await window.ai.rewriter.create({
      // tone: '',
      // length: '',
      // format: '',
      // sharedContext: '',
      ...this.#options,
    });
    this.#summarizer = await window.ai.summarizer.create({
      // tone: '',
      // length: '',
      // format: '',
      // sharedContext: '',
      ...this.#options,
    });
  }
  get errors() {
    return readonly(this.#errors);
  }

  get assistant() {
    return this.#assistant;
  }
  get summarizer() {
    return this.#summarizer;
  }
  get writer() {
    return this.#writer;
  }
  get rewriter() {
    return this.#rewriter;
  }

  async reset() {
    await Promise.all([
      await this.#assistant?.destroy(),
      await this.#writer?.destroy(),
      await this.#rewriter?.destroy(),
    ]);
  }
}

const CHROME_AI_KEY = Symbol('CHROME_AI');

export const setChromeAI = () => {
  const chromeAI = new ChromeAI({ temperature: 0.8, topK: 3 });
  chromeAI.init();
  return setContext(CHROME_AI_KEY, chromeAI);
};

export const getChromeAI = () => {
  return getContext<ReturnType<typeof setChromeAI>>(CHROME_AI_KEY);
};
