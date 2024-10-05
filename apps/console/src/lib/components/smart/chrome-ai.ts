import { browser } from '$app/environment';
import { Logger } from '@spectacular/utils';
import { getContext, onDestroy, setContext } from 'svelte';
import { derived, get, readable, readonly, writable } from 'svelte/store';
import { assistantOptions, rewriterOptions, summarizerOptions, writerOptions } from './settings';

/**
 *  Chrome AI Util Functions
 */

function getChromeVersion() {
  const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
  return raw ? Number.parseInt(raw[2], 10) : 0;
}

/**
 *  Chrome AI Stores
 */

export class ChromeAI {
  #log = new Logger('chromeai.store.client');
  readonly #errors = writable<Array<string>>([]);
  readonly isLoading = writable<boolean>(false);

  #detector: LanguageDetector;

  #assistantOptions: { topK: number; temperature: number };
  #summarizerOptions: { type?: AISummarizerType; format?: AISummarizerFormat; length?: AISummarizerLength };
  #writerOptions: { tone?: AIWriterTone; format?: AIWriterFormat; length?: AIWriterLength };
  #rewriterOptions: { tone?: AIRewriterTone; format?: AIRewriterFormat; length?: AIRewriterLength };
  #preferedLang: string;

  #isAISupported = 'ai' in globalThis;
  get isAISupported() {
    return this.#isAISupported;
  }

  readonly assistantCapabilities = readable<AIAssistantCapabilities>(undefined, (set) => {
    if (browser && this.#isAISupported) {
      window.ai.assistant.capabilities().then((cap) => {
        set(cap);
      });
    }
  });

  readonly summarizerCapabilities = readable<AISummarizerCapabilities>(undefined, (set) => {
    if (browser && this.#isAISupported) {
      window.ai.summarizer?.capabilities().then((cap) => {
        set(cap);
      });
    }
  });

  readonly writerCapabilities = readable<AIWriterCapabilities>(undefined, (set) => {
    if (browser && this.#isAISupported) {
      // TODO
      // window.ai.writer?.capabilities().then((cap) => {
      //    set(cap);
      // });
      if (window.ai.writer) {
        set({
          available: 'readily',
          supportsTone: (tone: AIWriterTone) => 'readily',
          supportsFormat: (format: AIWriterFormat) => 'readily',
          supportsLength: (length: AIWriterLength) => 'readily',
          supportsInputLanguage: (languageTag: Intl.UnicodeBCP47LocaleIdentifier) => 'readily',
        });
      }
    }
  });

  readonly rewriterCapabilities = readable<AIRewriterCapabilities>(undefined, (set) => {
    if (browser && this.#isAISupported) {
      // window.ai.rewriter?.capabilities().then((cap) => {
      //   set(cap);
      // });
      if (window.ai.rewriter) {
        set({
          available: 'readily',
          supportsTone: (tone: AIRewriterTone) => 'readily',
          supportsFormat: (format: AIRewriterFormat) => 'readily',
          supportsLength: (length: AIRewriterLength) => 'readily',
          supportsInputLanguage: (languageTag: Intl.UnicodeBCP47LocaleIdentifier) => 'readily',
        });
      }
    }
  });

  readonly languageDetectorAvailability = readable<AICapabilityAvailability>(undefined, (set) => {
    if (browser && this.#isAISupported) {
      window.translation?.canDetect().then((availability) => {
        set(availability);
      });
    }
  });

  constructor() {
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
    this.#isAISupported = true;

    const assistantOptionsSub = assistantOptions.subscribe((options) => {
      this.#assistantOptions = options;
    });
    const summarizerOptionsSub = summarizerOptions.subscribe((options) => {
      this.#summarizerOptions = options;
    });
    const writerOptionsSub = writerOptions.subscribe((options) => {
      this.#writerOptions = options;
    });
    const rewriterOptionsSub = rewriterOptions.subscribe((options) => {
      this.#rewriterOptions = options;
    });

    onDestroy(async () => {
      this.#log.debug('onDestroy called');
      assistantOptionsSub();
      summarizerOptionsSub();
      writerOptionsSub();
      rewriterOptionsSub();
    });
  }

  async init() {
    console.log({ assistantCapabilities: get(this.assistantCapabilities) });
  }

  get errors() {
    return readonly(this.#errors);
  }

  // https://github.com/explainers-by-googlers/prompt-api  #assistant: AIAssistant;
  async createAssistant(
    options?: AIAssistantCreateOptionsWithSystemPrompt | AIAssistantCreateOptionsWithoutSystemPrompt,
  ): Promise<AIAssistant | undefined> {
    if (browser && this.#isAISupported) {
      const availability = (await window.ai.assistant?.capabilities())?.available;
      switch (availability) {
        case 'readily':
          return await window.ai.assistant.create({ ...this.#assistantOptions, ...options });
        case 'after-download':
          this.#log.error('Built-in assistant model is downloading');
          this.#errors.update((errors) => {
            errors.push('Built-in assistant model is downloading');
            return errors;
          });
          return;
        case 'no':
          this.#log.error('Built-in assistant model not available');
          this.#errors.update((errors) => {
            errors.push('Built-in assistant model not available');
            return errors;
          });
          return;
        default:
          this.#log.error('Built-in assistant model not available');
          this.#errors.update((errors) => {
            errors.push('Built-in assistant model not available');
            return errors;
          });
          return;
      }
    }
  }

  async createSummarizer(options?: AISummarizerCreateOptions): Promise<AISummarizer | undefined> {
    if (browser && this.#isAISupported) {
      const availability = (await window.ai.summarizer?.capabilities())?.available;
      switch (availability) {
        case 'readily':
          return await window.ai.summarizer.create({ ...this.#summarizerOptions, ...options });
        case 'after-download':
          this.#log.error('Built-in summarizer model is downloading');
          this.#errors.update((errors) => {
            errors.push('Built-in summarizer model is downloading');
            return errors;
          });
          return;
        case 'no':
          this.#log.error('Built-in summarizer model not available');
          this.#errors.update((errors) => {
            errors.push('Built-in summarizer model not available');
            return errors;
          });
          return;
        default:
          this.#log.error('Built-in summarizer model not available');
          this.#errors.update((errors) => {
            errors.push('Built-in summarizer model not available');
            return errors;
          });
          return;
      }
    }
  }

  // https://github.com/tomayac/writer-rewriter-api-playground/tree/main
  async createWriter(options?: AIWriterCreateOptions): Promise<AIWriter | undefined> {
    if (browser && this.#isAISupported && window.ai.writer) {
      return await window.ai.writer.create({ ...this.#writerOptions, ...options });
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      this.#log.error('Built-in writer model not available');
      this.#errors.update((errors) => {
        errors.push('Built-in writer model not available');
        return errors;
      });
    }
  }

  async createRewriter(options?: AIRewriterCreateOptions): Promise<AIRewriter | undefined> {
    if (browser && this.#isAISupported && window.ai.rewriter) {
      return await window.ai.rewriter.create({ ...this.#rewriterOptions, ...options });
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      this.#log.error('Built-in rewriter model not available');
      this.#errors.update((errors) => {
        errors.push('Built-in rewriter model not available');
        return errors;
      });
    }
  }

  // https://github.com/tomayac/translation-language-detection-api-playground/blob/main/script.js
  async createDetector() {
    if (this.#detector) return this.#detector;
    if (browser && this.#isAISupported) {
      const availability = await window.translation?.canDetect();
      switch (availability) {
        case 'readily':
          this.#detector = await window.translation.createDetector();
          return this.#detector;
        case 'after-download':
          this.#log.error('Built-in languageDetector model is downloading');
          this.#errors.update((errors) => {
            errors.push('Built-in languageDetector model is downloading');
            return errors;
          });
          return;
        case 'no':
          this.#log.error('Built-in languageDetector model not available');
          this.#errors.update((errors) => {
            errors.push('Built-in languageDetector model not available');
            return errors;
          });
          return;
        default:
          this.#log.error('Built-in languageDetector model not available');
          this.#errors.update((errors) => {
            errors.push('Built-in languageDetector model not available');
            return errors;
          });
          return;
      }
    }
  }

  // https: //github.com/GoogleChromeLabs/web-ai-demos/blob/main/product-reviews/src/lib/HybridTranslator.js
  async createTranslator() {
    throw new Error('un implemented');
  }
}

const CHROME_AI_KEY = Symbol('CHROME_AI');

export const setChromeAI = () => {
  const chromeAI = new ChromeAI();
  if (browser) {
    chromeAI.init();
  }
  return setContext(CHROME_AI_KEY, chromeAI);
};

export const getChromeAI = () => {
  return getContext<ReturnType<typeof setChromeAI>>(CHROME_AI_KEY);
};