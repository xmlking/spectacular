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
    if (browser && 'translation' in window && 'canDetect' in window.translation) {
      window.translation?.canDetect().then((availability) => {
        set(availability);
      });
    }
  });

  constructor() {
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
      this.#isAISupported = true;
    }
  }

  get errors() {
    return readonly(this.#errors);
  }
}

const CHROME_AI_KEY = Symbol('CHROME_AI');

export const setChromeAI = () => {
  return setContext(CHROME_AI_KEY, new ChromeAI());
};

export const getChromeAI = () => {
  return getContext<ReturnType<typeof setChromeAI>>(CHROME_AI_KEY);
};
