

<script lang="ts">
import { ErrorMessage } from '@spectacular/skeleton/components/form';
import { streamObject } from 'ai';
import { chromeai } from 'chrome-ai';
import { SearchIcon } from 'lucide-svelte';
import { onMount } from 'svelte';
import { z } from 'zod';

const model = chromeai('text', {
  // additional settings
  temperature: 0.5,
  topK: 5,
});

let prompt = 'Generate a lasagna recipe.';
let output = '';
let error: string;
let isEnabled = false;

const schema = z.object({
  recipe: z.object({
    name: z.string(),
    ingredients: z.array(
      z.object({
        name: z.string(),
        amount: z.string(),
      }),
    ),
    steps: z.array(z.string()),
  }),
});

onMount(async () => {
  isEnabled = !!('ai' in globalThis);
  isEnabled = (await globalThis.ai?.canCreateTextSession()) === 'readily';
  console.log({ isEnabled });
  if (!isEnabled) error = 'Your browser is not supported. Please update Chrome to version 127 or higher.';
});

const onGenerate = async () => {
  output = '';
  const { partialObjectStream } = await streamObject({
    model,
    schema,
    prompt,
  });

  for await (const partialObject of partialObjectStream) {
    output += JSON.stringify(partialObject, null, 2);
    // { recipe: {...} }
  }
};
</script>
<div class="page-container">
  <div class="page-section">
    <header class="flex justify-between">
      <h1 class="h1">Smart Data Generate</h1>
    </header>

    <ErrorMessage {error} />

    <label class="label">
      <span>Prompt</span>
      <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
        <div class="input-group-shim">
          <SearchIcon size={17} />
        </div>
        <input type="search" placeholder="Generate a XYZ recipe." bind:value={prompt} />
        <button class="variant-filled-secondary" on:click={onGenerate}>Generate</button>
      </div>
    </label>

    <label class="label">
      <span>Output</span>
      <textarea  class="textarea" value={output}/>
    </label>
  </div>

</div>

<style>
	textarea {
    line-height: 1.5;
    field-sizing: content;
    min-height: 3lh;
	}
</style>
