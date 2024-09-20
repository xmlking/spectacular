import { browser } from '$app/environment';
import { Logger } from '@spectacular/utils';
import { getContext, onDestroy, setContext } from 'svelte';
import { derived, get, readable, readonly, writable } from 'svelte/store';

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
  readonly #options: AIAssistantCreateOptions;
  #isAISupported = false;
  get isAISupported() {
    return this.#isAISupported;
  }

  readonly assistantAvailability = readable<AICapabilityAvailability>(undefined, (set) => {
    if (browser && this.isAISupported) {
      window.ai.assistant.capabilities().then((cap) => {
        set(cap.available);
      });
    }
  });

  readonly summarizerAvailability = readable<AICapabilityAvailability>(undefined, (set) => {
    if (browser && this.isAISupported) {
      window.ai.summarizer?.capabilities().then((cap) => {
        set(cap.available);
      });
    }
  });

  readonly writerAvailability = readable<AICapabilityAvailability>(undefined, (set) => {
    if (browser && this.isAISupported) {
      // TODO
      // window.ai.writer?.capabilities().then((cap) => {
      //    set(cap.available);
      // });
      if (window.ai.writer) {
        set('readily');
      }
    }
  });

  readonly rewriterAvailability = readable<AICapabilityAvailability>(undefined, (set) => {
    if (browser && this.isAISupported) {
      // window.ai.rewriter?.capabilities().then((cap) => {
      //   set(cap.available);
      // });
      if (window.ai.rewriter) {
        set('readily');
      }
    }
  });

  readonly languageDetectorAvailability = readable<AICapabilityAvailability>(undefined, (set) => {
    if (browser && this.isAISupported) {
      window.translation?.canDetect().then((availability) => {
        set(availability);
      });
    }
  });

  #assistant: AIAssistant;
  #summarizer: AISummarizer;
  // https://github.com/tomayac/writer-rewriter-api-playground/tree/main
  #writer: AIWriter;
  #rewriter: AIRewriter;
  // https://github.com/tomayac/translation-language-detection-api-playground/blob/main/script.js
  #detector: LanguageDetector;
  // https: //github.com/GoogleChromeLabs/web-ai-demos/blob/main/product-reviews/src/lib/HybridTranslator.js
  // #ranslator: ranslator;

  constructor(options: AIAssistantCreateOptions) {
    this.#options = options;
    onDestroy(async () => {
      this.#log.debug('onDestroy called');
      await this.reset();
    });
  }

  async init() {
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

    console.log({ assistantAvailability: get(this.assistantAvailability) });

    const assistantSub = this.assistantAvailability.subscribe(async (availability) => {
      switch (availability) {
        case 'readily':
          this.#assistant = await window.ai.assistant.create({
            // temperature: cap.defaultTemperature,
            // topK: cap.defaultTopK,
            ...this.#options,
          });
          assistantSub();
          break;
        case 'after-download':
          this.#log.error('Built-in assistant model is downloading');
          this.#errors.update((errors) => {
            errors.push('Built-in assistant model is downloading');
            return errors;
          });
          assistantSub();
          break;
        case 'no':
          this.#log.error('Built-in assistant model not available');
          this.#errors.update((errors) => {
            errors.push('Built-in assistant model not available');
            return errors;
          });
          assistantSub();
      }
    });

    const writerSub = this.writerAvailability.subscribe(async (availability) => {
      switch (availability) {
        case 'readily':
          this.#writer = await window.ai.writer.create({
            // temperature: cap.defaultTemperature,
            // topK: cap.defaultTopK,
            ...this.#options,
          });
          break;
        case 'after-download':
          this.#log.error('Built-in writer model is downloading');
          this.#errors.update((errors) => {
            errors.push('Built-in writer model is downloading');
            return errors;
          });
          break;
        case 'no':
          this.#log.error('Built-in writer model not available');
          this.#errors.update((errors) => {
            errors.push('Built-in writer model not available');
            return errors;
          });
      }
      writerSub();
    });

    const rewriterSub = this.rewriterAvailability.subscribe(async (availability) => {
      switch (availability) {
        case 'readily':
          this.#rewriter = await window.ai.rewriter.create({
            // temperature: cap.defaultTemperature,
            // topK: cap.defaultTopK,
            ...this.#options,
          });
          break;
        case 'after-download':
          this.#log.error('Built-in rewriter model is downloading');
          this.#errors.update((errors) => {
            errors.push('Built-in rewriter model is downloading');
            return errors;
          });
          break;
        case 'no':
          this.#log.error('Built-in rewriter model not available');
          this.#errors.update((errors) => {
            errors.push('Built-in rewriter model not available');
            return errors;
          });
      }
      rewriterSub();
    });

    const summarizerSub = this.summarizerAvailability.subscribe(async (availability) => {
      switch (availability) {
        case 'readily':
          this.#summarizer = await window.ai.summarizer.create({
            // temperature: cap.defaultTemperature,
            // topK: cap.defaultTopK,
            ...this.#options,
          });
          summarizerSub();
          break;
        case 'after-download':
          this.#log.error('Built-in summarizer model is downloading');
          this.#errors.update((errors) => {
            errors.push('Built-in summarizer model is downloading');
            return errors;
          });
          summarizerSub();
          break;
        case 'no':
          this.#log.error('Built-in summarizer model not available');
          this.#errors.update((errors) => {
            errors.push('Built-in summarizer model not available');
            return errors;
          });
          summarizerSub();
      }
    });
    const languageDetectorSub = this.languageDetectorAvailability.subscribe(async (availability) => {
      switch (availability) {
        case 'readily':
          this.#detector = await window.translation.createDetector();
          languageDetectorSub();
          break;
        case 'after-download':
          this.#log.error('Built-in languageDetector model is downloading');
          this.#errors.update((errors) => {
            errors.push('Built-in languageDetector model is downloading');
            return errors;
          });
          languageDetectorSub();
          break;
        case 'no':
          this.#log.error('Built-in languageDetector model not available');
          this.#errors.update((errors) => {
            errors.push('Built-in languageDetector model not available');
            return errors;
          });
          languageDetectorSub();
      }
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
  get detector() {
    return this.#detector;
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
  if (browser) {
    chromeAI.init();
  }
  return setContext(CHROME_AI_KEY, chromeAI);
};

export const getChromeAI = () => {
  return getContext<ReturnType<typeof setChromeAI>>(CHROME_AI_KEY);
};
