import type { ai } from '@aibrow/dom-types';
import { IsSupported } from 'runed';
import { readable } from 'svelte/store';

type AI = typeof ai;
/**
 *  Browser AI Util Functions
 */

export function getChromeVersion() {
  const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
  return raw ? Number.parseInt(raw[2], 10) : 0;
}

/**
 * Detection & installation from aiBrow extension
 */
export async function checkAibrowInstalled() {
  if (!self.aibrow) {
    // The extension is not installed
    console.log(
      'Install the extension from https://chromewebstore.google.com/detail/aibrow/bbkbjiehfkggfkbampigbbakecijicdm'
    );
    return false;
  }

  const capabilities = await self.aibrow.capabilities();
  if (!capabilities.helper) {
    // The helper binary is not installed. We can fetch the direct link to the latest
    // version for the current platform
    const helperUrl = await self.aibrow.getHelperDownloadUrl();
    console.log(`Install the helper from ${helperUrl}`);
    return false;
  }

  // We're all installed
  return true;
}

export async function checkBrowserAIInstalled() {
  let status = false;

  if ('LanguageDetector' in self) {
    const availability = await LanguageDetector.availability();
    if (availability === 'available') {
      status = true;
    } else {
      console.log("%cYour browser LanguageDetector API isn't usable", 'color: magenta');
    }
  } else {
    console.log("%cYour browser doesn't support AI LanguageDetector", 'color: magenta');
  }

  if ('Translator' in self) {
    const availability = await Translator.availability({
      sourceLanguage: 'en',
      targetLanguage: 'es',
    });
    if (availability === 'available') {
      status = true;
    } else {
      console.log("%cYour browser Translator API isn't usable", 'color: magenta');
    }
  } else {
    console.log("%cYour browser doesn't support AI Translator", 'color: magenta');
  }

  if ('Writer' in self) {
    const availability = await Writer.availability();
    if (availability === 'available') {
      status = true;
    } else {
      console.log("%cYour browser Writer API isn't usable", 'color: magenta');
    }
  } else {
    console.log("%cYour browser doesn't support AI Writer", 'color: magenta');
  }

  if ('Rewriter' in self) {
    const availability = await Rewriter.availability();
    if (availability === 'available') {
      status = true;
    } else {
      console.log("%cYour browser Rewriter API isn't ready", 'color: magenta');
    }
  } else {
    console.log("%cYour browser doesn't support AI Rewriter", 'color: magenta');
  }

  if ('Summarizer' in self) {
    const availability = await Summarizer.availability();
    if (availability === 'available') {
      status = true;
    } else {
      console.log("%cYour browser Summarizer API isn't ready", 'color: magenta');
    }
  } else {
    console.log("%cYour browser doesn't support AI Summarizer", 'color: magenta');
  }

  if ('Proofreader' in self) {
    const availability = await Proofreader.availability();
    if (availability === 'available') {
      // status = true; // TODO
    } else {
      console.log("%cYour browser Proofreader API isn't ready", 'color: magenta');
    }
  } else {
    console.log("%cYour browser doesn't support AI Proofreader", 'color: magenta');
  }

  if ('LanguageModel' in self) {
    const availability = await LanguageModel.availability();
    if (availability === 'available') {
      status = true;
    } else {
      console.log("%cYour browser LanguageModel API isn't usable", 'color: magenta');
    }
  } else {
    console.log("%cYour browser doesn't support AI LanguageModel", 'color: magenta');
  }

  return status;
}

// Both can be then used interchangeably as needed
// await browserAI.summarizer.create()
// await aibrowAI.summarizer.create()

// Or you can fallback as needed
// const writer = browserAI.writer || aibrowAI.writer || throw new Error('Writer is not supported')
// await writer.create()

export function isPolyfilledLanguageModel() {
  return 'LanguageModel' in self && self.LanguageModel.aibrow === true;
}

export function isPolyfilledTranslation() {
  return 'Translator' in self && self.Translator.aibrow === true;
}

export function isPolyfilledLanguageDetector() {
  return 'LanguageDetector' in self && self.LanguageDetector.aibrow === true;
}

export function isPolyfilledWriter() {
  return 'Writer' in self && self.Writer.aibrow === true;
}

export function isPolyfilledRewriter() {
  return 'Rewriter' in self && self.Rewriter.aibrow === true;
}

export function isPolyfilledSummarizer() {
  return 'Summarizer' in self && self.Summarizer.aibrow === true;
}

export function isPolyfilledProofreader() {
  return 'Proofreader' in self && self.Proofreader.aibrow === true;
}

/**
 * isPolyfilledAI
 * usage:
 * @example
 * ```svelte
 * <script lang="ts">
 *  if (isPolyfilledAI2.current) {
 *    // Do something with the geolocation API
 *  }
 * </script>
 */
const isPolyfilledAI2 = new IsSupported(() => 'aibrow' in self);

/**
 * print ai status to console
 */
export async function printAIStats() {
  const browserAI = await checkBrowserAIInstalled();
  const aibrowAI = await checkAibrowInstalled();

  if (browserAI) {
    console.log('%cBrowser AI Installed', 'color: green');
  }
  if (aibrowAI) {
    console.log('%cAiBrow Installed', 'color: green');
  } else {
    console.log('%cAiBrow Not Installed', 'color: magenta');
  }
  if (!browserAI && !aibrowAI) {
    console.log("%cYour browser doesn't have any lcoal Models", 'color: red');
  }
}

export function createStreamStore(stream: ReadableStream<string>) {
  return readable('', (set) => {
    // Create a reader from the stream
    const reader = stream.getReader();

    // Function to read from the stream
    const read = async () => {
      try {
        // for await (const value of stream) {
        //   set(value);
        // }
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Update the store with the new value
          set(value);
        }
      } catch (error) {
        console.error('Error reading from stream:', error);
        set(''); // Clear the store on error
      } finally {
        reader.releaseLock();
      }
    };

    // Start reading the stream
    read();

    return () => reader.cancel();
  });
}

export function languageTagToHumanReadable(languageTag: Intl.UnicodeBCP47LocaleIdentifier, targetLanguage = 'en-US') {
  const displayNames = new Intl.DisplayNames([targetLanguage], { type: 'language' });
  return displayNames.of(languageTag);
}

/**
 * in-source testing
 * RUN: turbo run @repo/smart#test
 */
if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('test languageTagToHumanReadable', async () => {
    expect(languageTagToHumanReadable('ja', 'en')).toEqual('Japanese');
    expect(languageTagToHumanReadable('zh', 'en')).toEqual('Chinese');
    expect(languageTagToHumanReadable('zh-Hant', 'en')).toEqual('Traditional Chinese');
    expect(languageTagToHumanReadable('zh-TW', 'en')).toEqual('Chinese (Taiwan)');
    expect(languageTagToHumanReadable('en', 'ja')).toEqual('英語');
  });
}
