import { browser } from '$app/environment';
import { type Writable, derived, readable, writable } from 'svelte/store';
import { type AIStyles, TEMP_STYLES } from './constants.js';

export enum Provider {
  Local = 'local',
  Remote = 'remote',
}

export const aiProvider: Writable<Provider> = writable(browser && 'ai' in window ? Provider.Local : Provider.Remote);

export const assistantStyle: Writable<AIStyles> = writable('balanced');
export const assistantOptions = derived<Writable<AIStyles>, { topK: number; temperature: number }>(
  assistantStyle,
  ($assistantStyle) => {
    switch ($assistantStyle) {
      case 'balanced':
        return TEMP_STYLES.balanced;
      case 'creative':
        return TEMP_STYLES.creative;
      case 'precise':
        return TEMP_STYLES.precise;
    }
  },
  { topK: 3, temperature: 0.8 },
);

export const summarizerOptions: Writable<{
  type?: AISummarizerType;
  format?: AISummarizerFormat;
  length?: AISummarizerLength;
}> = writable({ type: 'tl;dr', format: 'plain-text', length: 'short' });

export const writerOptions: Writable<{
  tone?: AIWriterTone;
  format?: AIWriterFormat;
  length?: AIWriterLength;
}> = writable({ tone: 'neutral', format: 'plain-text', length: 'short' });

export const rewriterOptions: Writable<{
  tone?: AIRewriterTone;
  format?: AIRewriterFormat;
  length?: AIRewriterLength;
}> = writable({ tone: 'as-is', format: 'as-is', length: 'as-is' });

const lang = browser ? navigator.language : 'en-US';
export const preferedLang: Writable<string> = writable(lang);

export function languageTagToHumanReadable(
  languageTag: Intl.UnicodeBCP47LocaleIdentifier,
  targetLanguage: string = lang,
) {
  const displayNames = new Intl.DisplayNames([targetLanguage], { type: 'language' });
  return displayNames.of(languageTag);
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

/**
 * TODO: build like vercel `useCompletion`
 */
export function useChromeAi() {}
