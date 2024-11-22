// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type AI from '@aibrow/dom-types';

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  interface Window {
    readonly aibrow: typeof AI;
  }
  declare module '*.png?enhanced';
}

export {};
