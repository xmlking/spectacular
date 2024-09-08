<script lang="ts">
import { getChromeAI } from '$lib/stores/chrome-ai';
import { ErrorMessage, Alerts } from '@spectacular/skeleton/components/form';
import { JSONParseError, TypeValidationError, generateObject } from 'ai';
import { chromeai } from 'chrome-ai';
import { LoaderIcon, SearchIcon, Sparkles } from 'lucide-svelte';
import { onDestroy, onMount } from 'svelte';
import { AssistantStats } from '$lib/components/smart';
import { z } from 'zod';
import { Logger } from '@spectacular/utils';

const log = new Logger('ai:generate:browser');
let message: App.Superforms.Message;
const chromeAI = getChromeAI();
const { isAISupported, isAssistantReady, errors } = chromeAI;

const model = chromeai('text', {
  // additional settings
  temperature: 0.8,
  topK: 3,
});

// biome-ignore lint/style/useConst: <explanation>
let prompt = 'Generate a lasagna recipe.';
let output = '';
let error: string;
let isLoading = false;

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

onMount(() => {
  log.error('onMount...');
  log.debug({ isAISupported: $isAISupported, isAssistantReady: $isAssistantReady });
});

onDestroy(() => {
  log.debug('onDestroy...');
});

const onGenerate = async () => {
  console.log('in onGenerate');
  output = '';
  error = '';
  try {
    isLoading = true;
    const { object } = await generateObject({
      model,
      schema,
      prompt,
    });

    output = JSON.stringify(object, null, 2);
    isLoading = false;
  } catch (err) {
    console.error(err);
    if (TypeValidationError.isInstance(err)) {
      // error = `${err.value}`;
      output = JSON.stringify(err.value, null, 2);
    } else if (JSONParseError.isInstance(err)) {
      // error = `${err.text}`;
      output = JSON.stringify(err.text, null, 2);
    } else {
      error = `${err}`;
    }
  } finally {
    isLoading = false;
  }
};
</script>

<div class="page-container">
  <div class="page-section">
    <header class="flex justify-between">
      <h1 class="h1">On-Device AI: Smart Data Generate</h1>
    </header>
    <Alerts errors={$errors} {message} />
    <AssistantStats />
    <ErrorMessage {error} />

    <label class="label">
      <span>Prompt</span>
      <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
        <div class="input-group-shim">
          <SearchIcon size={17} />
        </div>
        <input
          type="search"
          placeholder="Generate a XYZ recipe."
          bind:value={prompt}
        />
        <button
          type="submit"
          class="variant-filled-secondary"
          on:click={onGenerate}
          aria-label="Submit"
        >
          {#if isLoading}
            <LoaderIcon />
          {:else}
            <Sparkles />
          {/if}
        </button>
      </div>
    </label>

    <label class="label">
      <span>Output</span>
      <textarea class="textarea" value={output} />
    </label>
  </div>
</div>

<style lang="postcss">
  textarea {
    line-height: 1.5;
    field-sizing: content;
    min-height: 3lh;
  }
</style>
