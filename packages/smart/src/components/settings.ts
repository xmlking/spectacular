import { browser } from '$app/environment';
import { type Writable, derived, writable } from 'svelte/store';
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
