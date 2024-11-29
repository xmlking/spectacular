import type { ai } from '@aibrow/dom-types';
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
      'Install the extension from https://chromewebstore.google.com/detail/aibrow/bbkbjiehfkggfkbampigbbakecijicdm',
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

export function getBrowserAI() {
  // Always get the browsers AI, regardless of the user's preference in AiBrow
  const ai: AI = self.ai && self.ai.aibrow === true ? self.ai.browserAI : self.ai;
  if (!self.ai) {
    // Eventually this check wont be needed as all browsers support self.ai
    // throw new Error('Your browser doesn\'t support self.ai')
    console.log("%cYour browser doesn't support self.ai", 'color: magenta');
    return undefined;
  }
  return ai;
}

export function getAiBrow(): AI | undefined {
  if (!self.aibrow) {
    // Send user to the download page
    // throw new Error('AiBrow is not installed')
    return undefined;
  }
  return self.aibrow;
}

// const browserAI = getBrowserAI()
// const aibrowAI = getAiBrow()

// Both can be then used interchangeably as needed
// await browserAI.summarizer.create()
// await aibrowAI.summarizer.create()

// Or you can fallback as needed
// const writer = browserAI.writer || aibrowAI.writer || throw new Error('Writer is not supported')
// await writer.create()

export function isPolyfilledAI() {
  return self.ai && self.ai.aibrow === true;
}

export function isPolyfilledTranslation() {
  return window.translation?.aibrow === true;
}

/**
 * print ai status to console
 */
export async function printAIStats() {
  const browserAI = getBrowserAI();
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

export function languageTagToHumanReadable(
  languageTag: Intl.UnicodeBCP47LocaleIdentifier,
  targetLanguage: string = 'en-US',
) {
  const displayNames = new Intl.DisplayNames([targetLanguage], { type: 'language' });
  return displayNames.of(languageTag);
}

/**
 * in-source testing
 * RUN: turbo run @spectacular/smart#test
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
