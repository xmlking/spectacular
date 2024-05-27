<script lang="ts">
import { onDestroy } from 'svelte';
import type { HTMLTextareaAttributes } from 'svelte/elements';

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
interface $$Props extends HTMLTextareaAttributes {
  value?: any;
  minRows?: number;
  maxRows?: number;
}

export const value = '';
export const minRows: number | undefined = undefined;
export const maxRows: number | undefined = undefined;

import ProxyTextareaElement from './core.js';

const element: HTMLTextAreaElement | null = null;

const instance = new ProxyTextareaElement();

$: {
  if (element !== null && !instance.hasStarted) instance.start(element, minRows, maxRows);
  if (instance.hasStarted) instance.onUpdateText((value || '').toString());
}

onDestroy(() => {
  instance.cleanUp();
});
</script>

<textarea
  {...$$props}
  bind:this={element}
  bind:value
  on:blur
  on:change
  on:click
  on:focus
  on:input
  on:keydown
  on:keypress
  on:keyup
/>
