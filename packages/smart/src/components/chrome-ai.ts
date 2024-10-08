import { browser } from '$app/environment';
import { Logger } from '@spectacular/utils';
import { getContext, onDestroy, setContext } from 'svelte';
import { derived, get, readable, readonly, writable } from 'svelte/store';
import { assistantOptions, rewriterOptions, summarizerOptions, writerOptions } from './settings.js';

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

  #isAISupported = browser && 'ai' in window;
  get isAISupported() {
    return this.#isAISupported;
  }

  readonly assistantCapabilities = readable<AIAssistantCapabilities>(undefined, (set) => {
    if (this.#isAISupported && window.ai.assistant) {
      window.ai.assistant.capabilities().then((cap) => {
        set(cap);
      });
    }
  });

  readonly summarizerCapabilities = readable<AISummarizerCapabilities>(undefined, (set) => {
    if (this.#isAISupported && window.ai.summarizer) {
      window.ai.summarizer?.capabilities().then((cap) => {
        set(cap);
      });
    }
  });

  readonly writerCapabilities = readable<AIWriterCapabilities>(undefined, (set) => {
    if (this.#isAISupported && window.ai.writer) {
      // TODO
      // window.ai.writer?.capabilities().then((cap) => {
      //    set(cap);
      // });
      set({
        available: 'readily',
        supportsTone: (tone: AIWriterTone) => 'readily',
        supportsFormat: (format: AIWriterFormat) => 'readily',
        supportsLength: (length: AIWriterLength) => 'readily',
        supportsInputLanguage: (languageTag: Intl.UnicodeBCP47LocaleIdentifier) => 'readily',
      });
    }
  });

  readonly rewriterCapabilities = readable<AIRewriterCapabilities>(undefined, (set) => {
    if (this.#isAISupported && window.ai.rewriter) {
      // window.ai.rewriter?.capabilities().then((cap) => {
      //   set(cap);
      // });
      set({
        available: 'readily',
        supportsTone: (tone: AIRewriterTone) => 'readily',
        supportsFormat: (format: AIRewriterFormat) => 'readily',
        supportsLength: (length: AIRewriterLength) => 'readily',
        supportsInputLanguage: (languageTag: Intl.UnicodeBCP47LocaleIdentifier) => 'readily',
      });
    }
  });

  readonly languageDetectorAvailability = readable<AICapabilityAvailability>(undefined, (set) => {
    if (browser && 'translation' in window && 'canDetect' in window.translation) {
      window.translation?.canDetect().then((availability) => {
        set(availability);
      });
    }
  });

  constructor() {
    if (browser) {
      const version = getChromeVersion();
      this.#log.debug({ chromeVersion: version, isAISupported: 'ai' in window });
      if (version < 129) {
        this.#errors.update((errors) => {
          errors.push('Your browser is not supported. Please update to 129 version or greater');
          return errors;
        });
        return;
      }
      if (!('ai' in window)) {
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
  }

  get errors() {
    return readonly(this.#errors);
  }

  // https://github.com/explainers-by-googlers/prompt-api  #assistant: AIAssistant;
  async createAssistant(
    options?: AIAssistantCreateOptionsWithSystemPrompt | AIAssistantCreateOptionsWithoutSystemPrompt,
  ): Promise<AIAssistant | undefined> {
    if (this.#isAISupported && window.ai.assistant) {
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
    if (this.#isAISupported && window.ai.summarizer) {
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
    if (this.#isAISupported && window.ai.writer) {
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
    if (this.#isAISupported && window.ai.rewriter) {
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
    if (this.#isAISupported && 'translation' in window) {
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
          this.#detector = await window.translation.createDetector();
          this.#detector.addEventListener('downloadprogress', (e) => {
            this.#log.info('downloadprogress', e.loaded, e.total);
          });
          await this.#detector.ready;
          return this.#detector;
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
  // https://docs.google.com/document/d/1bzpeKk4k26KfjtR-_d9OuXLMpJdRMiLZAOVNMuFIejk/edit
  async createTranslator(options: TranslationLanguageOptions) {
    if (this.#isAISupported && 'translation' in window) {
      const availability = await window.translation.canTranslate(options);
      switch (availability) {
        case 'readily':
          return await window.translation.createTranslator(options);
        case 'after-download': {
          this.#log.error('Built-in languageTranslator model is downloading');
          this.#errors.update((errors) => {
            errors.push('Built-in languageTranslator model is downloading');
            return errors;
          });
          const translator = await window.translation.createTranslator(options);
          translator.addEventListener('downloadprogress', (e) => {
            this.#log.info('downloadprogress', e.loaded, e.total);
          });
          await translator.ready;
          return translator;
        }
        case 'no':
          this.#log.error('Built-in languageTranslator model not available');
          this.#errors.update((errors) => {
            errors.push('Built-in languageTranslator model not available');
            return errors;
          });
          return;
        default:
          this.#log.error('Built-in languageTranslator model not available');
          this.#errors.update((errors) => {
            errors.push('Built-in languageTranslator model not available');
            return errors;
          });
          return;
      }
    }
  }
}

const CHROME_AI_KEY = Symbol('CHROME_AI');

export const setChromeAI = () => {
  return setContext(CHROME_AI_KEY, new ChromeAI());
};

export const getChromeAI = () => {
  return getContext<ReturnType<typeof setChromeAI>>(CHROME_AI_KEY);
};
