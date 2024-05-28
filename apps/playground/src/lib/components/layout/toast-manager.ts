import type { ToastSettings, ToastStore } from '@skeletonlabs/skeleton';

export function handleMessage(message: App.Superforms.Message, toastStore: ToastStore) {
  let background = 'variant-filled-success';
  if (message.type === 'error') {
    background = 'variant-filled-error';
  } else if (message.type === 'warning') {
    background = 'variant-filled-warning';
  }
  toastStore.trigger({ ...message, background } satisfies ToastSettings);
}
