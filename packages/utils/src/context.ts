/**
 * Typed Svelte Context
 * Ref: https://gist.github.com/tlux/0d87ec94581866567dad2ce64fa7c527
 * Ref: https://github.com/KamenKolev/svelte-typed-context
 */
import {
	getContext as svelteGetContext,
	setContext as svelteSetContext,
	hasContext as svelteHasContext
} from 'svelte';

declare const isChecked: unique symbol;

/**
 * Provided as key to getContext and setContext in order to enable strict typing
 */
export interface InjectionKey<T = unknown> {}

export interface CheckedInjectionKey<T> extends InjectionKey<T> {
	[isChecked]?: never;
}

type getContext = {
	<T>(key: CheckedInjectionKey<T>): T;
	<T>(key: InjectionKey<T>): undefined | T;
};
type setContext = <T>(key: InjectionKey<T>, context: T) => void;
type hasContext = <T>(key: InjectionKey<T>) => key is CheckedInjectionKey<T>;

export const getContext = svelteGetContext as getContext;
export const setContext = svelteSetContext as setContext;
export const hasContext = svelteHasContext as hasContext;
