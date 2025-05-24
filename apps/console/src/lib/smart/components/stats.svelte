<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import { languageModelOptions } from '$lib/smart/components/settings.js';

let assistant: AILanguageModel | undefined;
onMount(async () => {
  assistant = await self.LanguageModel.create($languageModelOptions);
});
onDestroy(() => {
  assistant?.destroy();
});
</script>

{#if self.LanguageModel }
  <div class="my-12">
    <div class="h2">Session stats</div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Temperature</th>
          <th>Top-k</th>
          <th>Tokens so far</th>
          <th>Tokens left</th>
          <th>Total tokens</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{assistant?.temperature}</td>
          <td>{assistant?.topK}</td>
          <td>{assistant?.tokensSoFar}</td>
          <td>{assistant?.tokensLeft}</td>
          <td>{assistant?.maxTokens}</td>
        </tr>
      </tbody>
    </table>
  </div>
{/if}
