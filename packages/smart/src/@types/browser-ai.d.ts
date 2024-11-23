import type { ai, translation } from '@aibrow/dom-types';

declare global {
  interface WindowOrWorkerGlobalScope {
    // readonly ai: typeof ai;
    readonly aibrow: typeof AI;
    readonly translation: typeof translation;
  }
}
