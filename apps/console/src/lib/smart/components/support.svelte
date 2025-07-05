<script lang="ts">
import type { ai as AI } from '@aibrow/dom-types';
import { Chrome, Languages, Sparkles, Wifi } from 'lucide-svelte';
import { onDestroy, onMount } from 'svelte';
import { checkAibrowInstalled, isPolyfilledLanguageModel, isPolyfilledTranslation, printAIStats } from './smart.js';

let chromeAISupported = false;
let aibrowInstalled = false;
let aiPolyfilled = false;
let translationPolyfilled = false;

let aibrowAI: typeof AI | undefined;

onMount(async () => {
  printAIStats();
  chromeAISupported = 'LanguageModel' in window;
  aibrowInstalled = await checkAibrowInstalled();
  aiPolyfilled = isPolyfilledLanguageModel();
  translationPolyfilled = isPolyfilledTranslation();
  aibrowAI = self.aibrow;
});
</script>

<div class="flex items-center justify-between">
  <span class="flex items-center gap-2">
    <Chrome
      size={20}
      class={chromeAISupported ? "text-green-500" : "text-red-500"}
    />
    Browser AI Installed
  </span>
  <span class="flex items-center gap-2">
    <Wifi
      size={20}
      class={aibrowInstalled ? "text-green-500" : "text-red-500"}
    />
    AiBrow Installed
  </span>
  <span class="flex items-center gap-2">
    <Sparkles
      size={20}
      class={aiPolyfilled ? "text-green-500" : "text-red-500"}
    />
    AI Polyfilled
  </span>

  <span class="flex items-center gap-2">
    <Languages
      size={20}
      class={translationPolyfilled ? "text-green-500" : "text-red-500"}
    />
    Translation Polyfilled
  </span>
</div>

{#if !chromeAISupported}
<details class="mb-8 p-4 rounded-lg" open={false}>
  <summary class="font-semibold text-lg cursor-pointer"
    >How to Enable Built-in AI APIs in Chrome</summary
  >
  <div class="mt-4">
    <ol class="list-decimal list-inside mb-4">
      <li>Download the latest version of Google Canary</li>
      <li>Type <code>chrome://flags</code> in the address bar</li>
      <li>Enable "Prompt API for Gemini Nano"</li>
      <li>Enable "Summarization API for Gemini Nano"</li>
      <li>Enable "Writer API for Gemini Nano"</li>
      <li>Enable "Rewriter API for Gemini Nano"</li>
      <li>Enable "Language detection web platform API"</li>
      <li>Set "Enables optimization guide on device" to "Enabled BypassPerfRequirements"</li>
      <li>Set "Experimental translation API" to "Enabled without language pack limit"</li>
      <li>Click <strong>Relaunch</strong> or restart browser</li>
      <li>
        Go to <code>chrome://components/</code> and update "Optimization Guide On
        Device Model"
      </li>
      <li> Go to <code>chrome://on-device-translation-internals/</code> and install all aviable Language Packages</li>
      AiBrow isn't installed! Please follow the
      <li><strong>Optional:</strong> For AiBrow: Please follow the<a class="anchor" href="https://aibrow.ai/install">install instructions</a></li>
    </ol>
    <p>To use it, open Developer Tools and create a session with:</p>
    <pre class="pre"><code
        >const session = await LanguageModel.create();</code
      ></pre>
  </div>
</details>
{/if}
