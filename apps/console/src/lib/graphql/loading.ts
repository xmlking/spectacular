import { dev } from '$app/environment';
import { PendingValue } from '$houdini';

/**
 * To develop a loading state, set this to true
 * WARNING: NEVER LEAVE THIS TRUE WHEN COMITTING
 * TODO: Add a CI check that makes sure this is false
 */
const SIMULATE_LOADING_STATE = false;

function simulatingLoadingState(): boolean {
  // Safeguard to prevent simulating loading states on production
  return dev && SIMULATE_LOADING_STATE;
}

export type MaybeLoading<T> = T | typeof PendingValue;

/**
 * Provide a fallback value if the value is PendingValue
 * @param value the value
 * @param fallback the fallback to use if value is PendingValue
 * @returns the value or the fallback
 */
export function loading<T>(value: MaybeLoading<T>, fallback: T): T {
  if (simulatingLoadingState()) return fallback;
  return value === PendingValue ? fallback : value;
}

type AllLoaded<T> = T extends object
  ? { [K in keyof T]: AllLoaded<T[K]> }
  : T extends unknown[]
    ? AllLoaded<T[number]>[]
    : T extends typeof PendingValue
      ? never
      : T;

export function loaded<T>(value: MaybeLoading<T>): value is T {
  if (simulatingLoadingState()) return false;
  return value !== PendingValue;
}

export function onceLoaded<I, O>(value: MaybeLoading<I>, compute: (loadedValue: I) => O, fallback: O): O {
  return loaded(value) ? compute(value) : fallback;
}

export function onceAllLoaded<T extends unknown[], O, FO>(
  values: { [K in keyof T]: MaybeLoading<T[K]> },
  compute: (...loadedValues: T) => O,
  fallback: FO,
): O | FO {
  if (values.every(loaded)) return compute(...(values as T));
  return fallback;
}

// @ts-expect-error don't know how to fix the 'T could be instanciated with a type that is unrelated to AllLoaded' error
export function allLoaded<T>(value: T): value is AllLoaded<T> {
  if (simulatingLoadingState()) return false;
  if (Array.isArray(value)) return value.every((item) => allLoaded(item));
  if (typeof value === 'object' && value !== null) return Object.values(value).every((item) => allLoaded(item));

  return loaded(value);
}

export function mapLoading<T, O>(value: MaybeLoading<T>, mapping: (value: T) => O): MaybeLoading<O> {
  if (loaded(value)) return mapping(value);
  return PendingValue;
}

export const LOREM_IPSUM = `Lorem ipsum dolor sit amet. A impedit beatae sed nostrum voluptatem
ut omnis aliquid et galisum quaerat. Est sunt voluptatem aut porro iste et tempora voluptatem
aut pariatur minima sed omnis cumque est iusto fugit vel rerum magni. 33 ducimus nesciunt ut
consequuntur esse nam necessitatibus tempore sit suscipit voluptatibus qui rerum earum non autem
doloribus. Rem itaque esse est nostrum optio id repellat recusandae et ipsa quis.

Aut odio ipsa sed autem esse ut autem error qui voluptates perspiciatis aut officiis consequuntur
sit amet nihil. Eos delectus consequatur sit natus iure qui omnis omnis ea illum distinctio et
quos quidem. Et nisi autem est rerum eius ut dolorum commodi et temporibus expedita ea dolorem
error ad asperiores facilis ad numquam libero. Aut suscipit maxime sit explicabo dolorem est
accusantium enim et repudiandae omnis cum dolorem nemo id quia facilis.

Et dolorem perferendis et rerum suscipit qui voluptatibus quia et nihil nostrum 33 omnis soluta.
Nam minus minima et perspiciatis velit et eveniet rerum et nihil voluptates aut eaque ipsa et
ratione facere!`;
