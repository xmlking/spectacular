<script lang="ts">
import { getChromeAI } from './chrome-ai.js';
import { onMount, onDestroy } from 'svelte';
const chromeAI = getChromeAI();
const { isAISupported, assistantCapabilities, isLoading } = chromeAI;

let assistant: AILanguageModel | undefined;
onMount(async () => {
  assistant = await chromeAI.createLanguageModel();
});
onDestroy(() => {
  assistant?.destroy();
});
</script>

{#if isAISupported && $assistantCapabilities?.available === 'readily'}
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
