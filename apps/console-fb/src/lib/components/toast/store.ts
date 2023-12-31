import { writable } from 'svelte/store';

interface ToastModel {
	id: string;
	message: string;
	type: ToastLevel;
	duration: number;
	dismissible: boolean;
}

export interface Toast {
	message: string;
	type?: ToastLevel;
	duration?: number;
	dismissible?: boolean;
}

export enum ToastLevel {
	Info = 'blue',
	Success = 'green',
	Warning = 'indigo',
	Error = 'red'
}

export const toasts = writable<ToastModel[]>([]);

// Setup some sensible defaults for a toast.
const defaults = {
	type: ToastLevel.Info,
	dismissible: true,
	duration: 9000
};

export const dismissToast = (id: string) => {
	toasts.update((all) => all.filter((t) => t.id !== id));
};

export const addToast = (toast: Toast) => {
	// Create a unique ID so we can easily find/remove it
	// if it is dismissible/has a timeout.
	const id = crypto.randomUUID();

	// Push the toast to the top of the list of toasts
	const t = { ...defaults, ...toast, id };
	toasts.update((all) => [t, ...all]);

	// If toast is dismissible, dismiss it after "duration" amount of time.
	if (t.duration) setTimeout(() => dismissToast(id), t.duration);
};
