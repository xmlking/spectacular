import { browser } from '$app/environment';
import { type Writable, derived, readable, writable } from 'svelte/store';
import { type AIStyles, TEMP_STYLES } from './constants.js';

export enum Provider {
  Local = 'local',
  Remote = 'remote',
}

export const aiProvider: Writable<Provider> = writable(browser && 'ai' in window ? Provider.Local : Provider.Remote);

export const languageModelStyle: Writable<AIStyles> = writable('balanced');
export const languageModelOptions = derived<Writable<AIStyles>, { topK: number; temperature: number }>(
  languageModelStyle,
  ($languageModelStyle) => {
    switch ($languageModelStyle) {
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
  type?: SummarizerType;
  format?: SummarizerFormat;
  length?: SummarizerLength;
}> = writable({ type: 'tl;dr', format: 'plain-text', length: 'short' });

export const writerOptions: Writable<{
  tone?: WriterTone;
  format?: WriterFormat;
  length?: WriterLength;
}> = writable({ tone: 'neutral', format: 'plain-text', length: 'short' });

export const rewriterOptions: Writable<{
  tone?: RewriterTone;
  format?: RewriterFormat;
  length?: RewriterLength;
}> = writable({ tone: 'as-is', format: 'as-is', length: 'as-is' });

const lang = browser ? navigator.language : 'en-US';
export const preferedLang: Writable<string> = writable(lang);
