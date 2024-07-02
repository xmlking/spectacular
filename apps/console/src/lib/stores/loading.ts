import { Logger } from '@spectacular/utils';
import { getContext, onDestroy, setContext } from 'svelte';
import { type Invalidator, type Readable, type Subscriber, derived, writable } from 'svelte/store';

export class LoadingState {
  #log = new Logger('loading.store.client');
  readonly formLoading = writable<boolean>(false);
  readonly pageLoading = writable<boolean>(false);
  readonly isLoading = derived(
    [this.formLoading, this.pageLoading],
    ([$formLoading, $pageLoading]) => {
      return $pageLoading || $formLoading;
    },
    false,
  );

  constructor() {
    onDestroy(() => {
      this.#log.debug('onDestroy called');
      this.reset();
    });
  }

  setFormLoading(loading: boolean) {
    this.formLoading.set(loading);
  }

  setPageLoading(loading: boolean) {
    this.pageLoading.set(loading);
  }

  subscribe(run: Subscriber<boolean>, invalidate?: Invalidator<boolean>) {
    return this.isLoading.subscribe(run, invalidate);
  }

  reset() {
    this.formLoading.set(false);
    this.formLoading.set(false);
  }
}

const LOADING_STATE_KEY = Symbol('LOADING_STATE');

export const setLoadingState = () => {
  return setContext(LOADING_STATE_KEY, new LoadingState());
};

export const getLoadingState = () => {
  return getContext<ReturnType<typeof setLoadingState>>(LOADING_STATE_KEY);
};

// Explore
/*
import { navigating } from '$app/stores';
import type { Navigation } from '@sveltejs/kit';

export const navigationDelayed: Readable<boolean> = derived(
  navigating,
  (newValue: Navigation | null, set: (value: boolean) => void) => {
    if (timer) {
      clearTimeout(timer);
    }

    if (newValue) {
      timer = setTimeout(() => set(true), 100);
    }

    set(false);
  },
);
*/
