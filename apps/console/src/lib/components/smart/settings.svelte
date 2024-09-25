<script lang="ts">
import { DebugShell } from '@spectacular/skeleton/components';
import { getChromeAI } from '$lib/components/smart/chrome-ai';
import SuperDebug from 'sveltekit-superforms';
import {
  aiProvider,
  assistantStyle,
  assistantOptions,
  summarizerOptions,
  writerOptions,
  rewriterOptions,
  preferedLang,
} from '$lib/components/smart/settings';
// biome-ignore lint/style/useImportType: <explanation>
import { Provider } from '$lib/components/smart/settings';
import { TEMP_STYLES, type AIStyles } from './constants';
const chromeAI = getChromeAI();
const { isAISupported, assistantCapabilities, isLoading } = chromeAI;

// Local variables for each store
let currentProvider: Provider;
let currentAssistantStyle: AIStyles;
let currentSummarizerOptions: typeof $summarizerOptions;
let currentWriterOptions: typeof $writerOptions;
let currentRewriterOptions: typeof $rewriterOptions;

// Initialize local variables with store values
$: currentProvider = $aiProvider;
$: currentAssistantStyle = $assistantStyle;
$: currentSummarizerOptions = { ...$summarizerOptions };
$: currentWriterOptions = { ...$writerOptions };
$: currentRewriterOptions = { ...$rewriterOptions };

function updateSettings() {
  $aiProvider = currentProvider;
  $assistantStyle = currentAssistantStyle;
  $summarizerOptions = currentSummarizerOptions;
  $writerOptions = currentWriterOptions;
  $rewriterOptions = currentRewriterOptions;
}
</script>

{#if isAISupported && $assistantCapabilities.available === "readily"}
  <p>Crome AI available</p>
  <form on:submit|preventDefault={updateSettings}>
    <h2>AI Settings</h2>

    <div>
      <h3 class="h3">AI Provider</h3>
      <select class="select" bind:value={currentProvider}>
        <option value={Provider.Local}>Local</option>
        <option value={Provider.Remote}>Remote</option>
      </select>
    </div>

    <div>
      <h3>Assistant Style</h3>
      <select class="select" bind:value={currentAssistantStyle}>
        <option value="balanced">Balanced</option>
        <option value="creative">Creative</option>
        <option value="precise">Precise</option>
      </select>
    </div>

    <div>
      <h3>Summarizer Options</h3>
      <label>
        Type:
        <select class="select" bind:value={currentSummarizerOptions.type}>
          <option value="tl;dr">TL;DR</option>
          <option value="bullet-points">Bullet Points</option>
          <option value="narrative">Narrative</option>
        </select>
      </label>
      <label>
        Format:
        <select class="select" bind:value={currentSummarizerOptions.format}>
          <option value="plain-text">Plain Text</option>
          <option value="markdown">Markdown</option>
          <option value="html">HTML</option>
        </select>
      </label>
      <label>
        Length:
        <select class="select" bind:value={currentSummarizerOptions.length}>
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </label>
    </div>

    <div>
      <h3>Writer Options</h3>
      <label>
        Tone:
        <select class="select" bind:value={currentWriterOptions.tone}>
          <option value="neutral">Neutral</option>
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
          <option value="friendly">Friendly</option>
          <option value="professional">Professional</option>
        </select>
      </label>
      <label>
        Format:
        <select class="select" bind:value={currentWriterOptions.format}>
          <option value="plain-text">Plain Text</option>
          <option value="markdown">Markdown</option>
          <option value="html">HTML</option>
        </select>
      </label>
      <label>
        Length:
        <select class="select" bind:value={currentWriterOptions.length}>
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </label>
    </div>

    <div>
      <h3>Rewriter Options</h3>
      <label>
        Tone:
        <select class="select" bind:value={currentRewriterOptions.tone}>
          <option value="as-is">As Is</option>
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
          <option value="friendly">Friendly</option>
          <option value="professional">Professional</option>
        </select>
      </label>
      <label>
        Format:
        <select class="select" bind:value={currentRewriterOptions.format}>
          <option value="as-is">As Is</option>
          <option value="plain-text">Plain Text</option>
          <option value="markdown">Markdown</option>
          <option value="html">HTML</option>
        </select>
      </label>
      <label>
        Length:
        <select class="select" bind:value={currentRewriterOptions.length}>
          <option value="as-is">As Is</option>
          <option value="shorter">Shorter</option>
          <option value="longer">Longer</option>
        </select>
      </label>
    </div>

    <button class="btn" type="submit">Update AI Settings</button>
  </form>
{:else}
  <p>Crome AI NOT available</p>
{/if}

<!-- Debug -->
<DebugShell label="AI Settings Form">
  <SuperDebug label="aiProvider" data={$aiProvider} />
  <br />
  <SuperDebug label="assistantStyle" status={false} data={$assistantStyle} />
  <br />
  <SuperDebug
    label="assistantOptions"
    status={false}
    data={$assistantOptions}
  />
  <br />
  <SuperDebug
    label="summarizerOptions"
    status={false}
    data={$summarizerOptions}
  />
  <br />
  <SuperDebug label="writerOptions" status={false} data={$writerOptions} />
  <br />
  <SuperDebug label="rewriterOptions" status={false} data={$rewriterOptions} />
  <br />
  <SuperDebug label="preferedLang" status={false} data={$preferedLang} />
  <br />
</DebugShell>
