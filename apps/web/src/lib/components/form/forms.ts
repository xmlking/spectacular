import { getContext, hasContext } from 'svelte';
import type { SuperForm } from 'sveltekit-superforms/client';
import type { AnyZodObject } from 'zod';

export const FORM_KEY = Symbol('form');

export type RadioOptionType = {
	value: string | number;
	label: string;
};

export type FormContext<T extends AnyZodObject> = {
	superform: SuperForm<T, unknown>;
};

export function getFormContext<T extends AnyZodObject>(): FormContext<T> {
	if (!hasContext(FORM_KEY)) {
		throw new Error('FormField must be used within a Form component');
	}
	return getContext(FORM_KEY);
}
