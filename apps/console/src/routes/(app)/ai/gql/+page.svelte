<script lang="ts">
import { DebugShell } from '$lib/ui/components';
import { Logger } from '@spectacular/utils';
import type { MouseEventHandler } from 'svelte/elements';
import SuperDebug from 'sveltekit-superforms';

const log = new Logger('ai:smart:gql');

let result = {};
let prompt = 'list first 10 users ordered by displayName';

const useRemoteModel = async (prompt: string) => {
  const response = await fetch('/api/gql', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw (await response.json()) as Error;
  }
  return await response.json();
};

const onclick: MouseEventHandler<HTMLButtonElement> = async (event) => {
  const { prompt } = event.currentTarget.dataset;
  if (!prompt) {
    log.error('Missing prompt');
    return;
  }
  result = await useRemoteModel(prompt);
  log.debug({ prompt, result });
};
</script>

<div class="page-container">
  <div class="page-section">
    <header class="flex justify-between">
      <h1 class="h1">Smart GQL Demo</h1>
    </header>
    <form>
      <div class="mb-4 flex gap-2">
        <input
          type="text"
          class="input flex-1"
          placeholder="Enter your GraphQL prompt"
          bind:value={prompt}
        />
        <button
          type="submit"
          class="btn variant-filled-primary"
          on:click={onclick}
          data-prompt={prompt}
        >
          Generate GraphQL
        </button>
      </div>
    </form>

    <SuperDebug label="result" data={result} />
  </div>
</div>
