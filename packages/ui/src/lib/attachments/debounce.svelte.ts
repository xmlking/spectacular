import type { Attachment } from 'svelte/attachments';
// Ref: https://github.com/ignatiusmb/syv/blob/master/src/lib/attachment/index.ts

type DebouncedInputOptions = {
  ondebounced: (v: string) => void;
  delay?: number;
  eventTypeToDebounce?: string;
};

export function debounced_input({
  ondebounced,
  delay = 300,
  eventTypeToDebounce = 'input',
}: DebouncedInputOptions): Attachment<HTMLInputElement> {
  let timeoutId: ReturnType<typeof setTimeout>;
  function wrapper(ev: Event) {
    timeoutId && clearTimeout(timeoutId);
    timeoutId = setTimeout(ondebounced, delay, (ev.target as HTMLInputElement).value);
  }

  return (element: HTMLInputElement) => {
    element.addEventListener(eventTypeToDebounce, wrapper);
    return () => {
      clearTimeout(timeoutId);
      element.removeEventListener(eventTypeToDebounce, wrapper);
    };
  };
}
