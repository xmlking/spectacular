import { getContext, hasContext } from 'svelte';
import type { SuperForm } from 'sveltekit-superforms';
export const FORM_KEY = Symbol('form');

export type RadioOptionType = {
    value: string | number;
    label: string;
};

export type FormContext<T extends Record<string, unknown>> = {
    superform: SuperForm<T, unknown>;
};

export function getFormContext<T extends Record<string, unknown>>(): FormContext<T> {
    if (!hasContext(FORM_KEY)) {
        throw new Error('FormField must be used within a Form component');
    }
    return getContext(FORM_KEY);
}
