// See https://dev.to/jdgamble555/using-sharable-runes-with-typescript-in-svelte5-5hcp

import { writable, readable } from 'svelte/store';
import { useSharedStore } from './use-shared.svelte';

export const rune = <T>(initialValue?: T) => {
  let _state = $state<T | undefined>(initialValue);
  return {
    get value(): T | undefined {
      return _state;
    },
    set value(v: T) {
      _state = v;
    }
  };
};

// writable store context
export const useWritable = <T>(name: string, initialValue?: T) =>
  useSharedStore(name, writable, initialValue);

// readable store context
export const useReadable = <T>(name: string, initialValue?: T) =>
  useSharedStore(name, readable, initialValue);

// Shared rune context
export const useState = <T>(name: string, initialValue?: T) =>
  useSharedStore(name, rune, initialValue);

/*
// in stores.ts
export const useDarkMode = () => useWritable('dark', false);

// in +page.svelte
const toasts = useWritable<Toast[]>('toasts', toasts);
let isLoading = useWritable('signUpFormLoadingState', false);

  <Button loading={$isLoading} >
*/

/*
// Example of tracking Firebase user state
// Usage:
// <script>
//   import { useUser } from '$lib/stores/state.svelte';
//   const user = useUser();
// </script>
const _useUser = (defaultUser: UserType | null = null) => {
  const user = rune(defaultUser);
  const unsubscribe = onIdTokenChanged(
    auth,
    (_user: User | null) => {
      if (!_user) {
        user.value = null;
        return;
      }
      const { displayName, photoURL, uid, email } = _user;
      user.value = { displayName, photoURL, uid, email };
    });
  onDestroy(unsubscribe);
  return user;
};
export const useUser = (defaultUser: UserType | null = null) =>
  useSharedStore('user', _useUser, defaultUser);
*/
