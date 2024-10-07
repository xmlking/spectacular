<script lang="ts">
import type { HTMLTextareaAttributes } from 'svelte/elements';
import { getChromeAI } from './chrome-ai.js';
import { Logger } from '@spectacular/utils';
import { Sparkles } from 'lucide-svelte';
import type { Provider } from './settings.js';
import { aiProvider, writerOptions, createStreamStore } from './settings.js';
import type { Readable, Writable } from 'svelte/store';

const log = new Logger('smart:textarea:browser');

interface $$Props extends HTMLTextareaAttributes {
  value: string;
  provider?: Provider;
  tone?: AIWriterTone;
  format?: AIWriterFormat;
  length?: AIWriterLength;
  sharedContext?: string;
}

export let value: string;
export let provider = $aiProvider;
export let tone = $writerOptions.tone;
export let format = $writerOptions.format;
export let length = $writerOptions.length;
export let sharedContext = 'writing assistant';

const chromeAI = getChromeAI();
let isLoading = false;

let completion: Readable<string>;
const controller = new AbortController();

async function write() {
  const writer = await chromeAI.createWriter({
    tone,
    format,
    length,
    sharedContext,
  });
  console.log({ writer });
  if (writer === undefined) return;
  isLoading = true;
  // controller.abort()
  const stream = writer.writeStreaming(value, { signal: controller.signal });
  completion = createStreamStore(stream);
  isLoading = false;
}
$: console.log($completion);
</script>

<textarea
  {...$$restProps}
  class="textarea"
  disabled={isLoading}
  value={isLoading && $completion.length > 0 ? $completion.trim() : value}
/>

<button class="btn-icon variant-filled" type="button" on:click|preventDefault={write}><Sparkles /></button>

<style lang="postcss">
	textarea {
    line-height: 1.5;
    field-sizing: content;
    min-height: 3lh;
	}
</style>
