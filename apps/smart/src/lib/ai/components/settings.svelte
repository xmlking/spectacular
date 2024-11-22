<script lang="ts">
import { DebugShell } from '@spectacular/skeleton/components';
import { getChromeAI } from './chrome-ai.js';
import SuperDebug from 'sveltekit-superforms';
import {
  aiProvider,
  languageModelStyle,
  languageModelOptions,
  summarizerOptions,
  writerOptions,
  rewriterOptions,
  preferedLang,
} from './settings.js';
import { Provider } from './settings.js';
import { onMount } from 'svelte';
// import { langs } from './constants';
const chromeAI = getChromeAI();
const { isAISupported, assistantCapabilities, isLoading } = chromeAI;

let voices: { label: string; value: string; isDefault: boolean }[] = [];
onMount(() => {
  speechSynthesis.onvoiceschanged = () => {
    voices =
      window.speechSynthesis?.getVoices().map((v) => ({
        label: v.name,
        value: v.lang,
        isDefault: v.default,
      })) ?? [];
    // console.log(voices);
  };
});
</script>

{#if isAISupported && $assistantCapabilities?.available === "readily"}
  <form class="card p-6 shadow-lg">
    <fieldset class="border border-surface-400 rounded-md p-4 mb-6">
      <legend class="text-sm font-semibold px-2">LanguageModel Options</legend>
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label>
            <span>AI Provider</span>
            <select class="select" bind:value={$aiProvider}>
              <option value={Provider.Local}>Local</option>
              <option value={Provider.Remote}>Remote</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            <span>LanguageModel Style</span>
            <select class="select" bind:value={$languageModelStyle}>
              <option value="balanced">Balanced</option>
              <option value="creative">Creative</option>
              <option value="precise">Precise</option>
            </select>
          </label>
        </div>
      </div>
    </fieldset>

    <div class="grid gap-6 mb-6 md:grid-cols-3">
      <fieldset class="border border-surface-400 rounded-md p-4">
        <legend class="text-sm font-semibold px-2">Writer Options</legend>
        <div>
          <label class="label">
            <span>Tone</span>
            <select class="select" bind:value={$writerOptions.tone}>
              <option value="neutral">Neutral</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
            </select>
          </label>
        </div>
        <div class="mt-4">
          <label class="label">
            <span>Format</span>
            <select class="select" bind:value={$writerOptions.format}>
              <option value="plain-text">Plain Text</option>
              <option value="markdown">Markdown</option>
            </select>
          </label>
        </div>
        <div class="mt-4">
          <label class="label">
            <span>Length</span>
            <select class="select" bind:value={$writerOptions.length}>
              <option value="short">Shorter</option>
              <option value="medium">Medium</option>
              <option value="long">Longer</option>
            </select>
          </label>
        </div>
      </fieldset>
      <fieldset class="border border-surface-400 rounded-md p-4">
        <legend class="text-sm font-semibold px-2">Rewriter Options</legend>
        <div>
          <label class="label">
            <span>Tone</span>
            <select class="select" bind:value={$rewriterOptions.tone}>
              <option value="as-is">As Is</option>
              <option value="more-casual">More Casual</option>
              <option value="more-formal">More Formal</option>
            </select>
          </label>
        </div>
        <div class="mt-4">
          <label class="label">
            <span>Format</span>
            <select class="select" bind:value={$rewriterOptions.format}>
              <option value="as-is">As Is</option>
              <option value="plain-text">Plain Text</option>
              <option value="markdown">Markdown</option>
            </select>
          </label>
        </div>
        <div class="mt-4">
          <label class="label">
            <span>Length</span>
            <select class="select" bind:value={$rewriterOptions.length}>
              <option value="as-is">As Is</option>
              <option value="shorter">Shorter</option>
              <option value="longer">Longer</option>
            </select>
          </label>
        </div>
      </fieldset>
      <fieldset class="border border-surface-400 rounded-md p-4">
        <legend class="text-sm font-semibold px-2">Summarizer Options</legend>
        <div>
          <label class="label">
            <span>Type</span>
            <select class="select" bind:value={$summarizerOptions.type}>
              <option value="tl;dr">TL;DR</option>
              <option value="key-points">Bullet Points</option>
              <option value="teaser">Teaser</option>
              <option value="headline">Headline</option>
            </select>
          </label>
        </div>
        <div class="mt-4">
          <label class="label">
            <span>Format</span>
            <select class="select" bind:value={$summarizerOptions.format}>
              <option value="plain-text">Plain Text</option>
              <option value="markdown">Markdown</option>
            </select>
          </label>
        </div>
        <div class="mt-4">
          <label class="label">
            <span>Length</span>
            <select class="select" bind:value={$summarizerOptions.length}>
              <option value="short">Shorter</option>
              <option value="medium">Medium</option>
              <option value="long">Longer</option>
            </select>
          </label>
        </div>
      </fieldset>
    </div>

    <fieldset class="border border-surface-400 rounded-md p-4 mb-6">
      <legend class="text-sm font-semibold px-2">Preferences</legend>
      <div class="flex items-center space-x-2">
        <checkbox class="checkbox" id="newsletter" />
        <label for="newsletter"><span>Subscribe to newsletter</span> </label>
      </div>
      <div class="flex items-center space-x-2 mt-2">
        <label class="label">
          <span>Prefered Language</span>
          <select class="select" bind:value={$preferedLang}>
            {#each voices as { value, label, isDefault } (label)}
              <option {value} selected={isDefault}>{label}</option>
            {/each}
          </select>
        </label>
      </div>
    </fieldset>
  </form>
{:else}
  <p class="text-accent-400">Browser AI NOT available</p>
{/if}

<!-- Debug -->
<DebugShell label="AI Settings Form">
  <SuperDebug label="aiProvider" data={$aiProvider} />
  <br />
  <SuperDebug label="languageModelStyle" status={false} data={$languageModelStyle} />
  <br />
  <SuperDebug
    label="languageModelOptions"
    status={false}
    data={$languageModelOptions}
  />
  <br />
  <SuperDebug label="writerOptions" status={false} data={$writerOptions} />
  <br />
  <SuperDebug label="rewriterOptions" status={false} data={$rewriterOptions} />
  <br />
  <SuperDebug
    label="summarizerOptions"
    status={false}
    data={$summarizerOptions}
  />
  <br />
  <SuperDebug label="preferedLang" status={false} data={$preferedLang} />
  <br />
</DebugShell>
