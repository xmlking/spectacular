import type { ai, translation } from '@aibrow/dom-types';

declare global {
  interface Window {
    readonly ai: typeof ai;
    readonly aibrow: typeof ai;
    readonly translation: typeof translation;
  }
}
