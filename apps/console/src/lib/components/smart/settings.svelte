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
const chromeAI = getChromeAI();
const { isAISupported, assistantCapabilities, isLoading } = chromeAI;
</script>

{#if isAISupported && $assistantCapabilities.available === "readily"}
  <p>Crome AI available</p>

  <form class="p-6 bg-card rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-6 text-center">Registration Form</h2>

    <div class="grid gap-6 mb-6 md:grid-cols-2">
      <fieldset class="border border-surface-400 rounded-md p-4">
        <legend class="text-sm font-semibold px-2">Personal Information</legend>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="label">
              <span>First Name</span>
              <input class="input" placeholder="John" required />
            </label>
          </div>
          <div>
            <label for="last-name">
              <span>Last Name</span>
              <input class="input" placeholder="Doe" required />
            </label>
          </div>
        </div>
        <div class="mt-4">
          <label class="label">
            <span>Email</span>
            <input
              class="input"
              type="email"
              placeholder="john.doe@example.com"
              required
            />
          </label>
        </div>
      </fieldset>

      <fieldset class="border border-surface-400 rounded-md p-4">
        <legend class="text-sm font-semibold px-2">Account Details</legend>
        <div>
          <label class="label">
            <span>Username</span>
            <input class="input" placeholder="johndoe123" required />
          </label>
        </div>
        <div class="mt-4">
          <label class="label">
            <span>Password</span>
            <input class="input" type="password" required />
          </label>
        </div>
      </fieldset>
    </div>

    <fieldset class="border border-surface-400 rounded-md p-4 mb-6">
      <legend class="text-sm font-semibold px-2">Contact Information</legend>
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label for="phone">
            <span>Phone Number</span>
            <input class="input" type="tel" placeholder="+1 (555) 123-4567" />
          </label>
        </div>
        <div>
          <label for="address">
            <span>Address</span>
            <input class="input" placeholder="123 Main St, City, Country" />
          </label>
        </div>
      </div>
    </fieldset>

    <fieldset class="border border-surface-400 rounded-md p-4 mb-6">
      <legend class="text-sm font-semibold px-2">Preferences</legend>
      <div class="flex items-center space-x-2">
        <checkbox class="checkbox" id="newsletter" />
        <label for="newsletter"><span>Subscribe to newsletter</span> </label>
      </div>
      <div class="flex items-center space-x-2 mt-2">
        <checkbox class="checkbox" id="terms" required />
        <label for="terms"><span>I agree to the Terms and Conditions</span></label>
      </div>
    </fieldset>
  </form>

  <form class="grid grid-cols-6 gap-4">
    <h2>AI Settings</h2>

    <div class="col-span-6">
      <h3 class="h3">AI Provider</h3>
      <select class="select" bind:value={$aiProvider}>
        <option value={Provider.Local}>Local</option>
        <option value={Provider.Remote}>Remote</option>
      </select>
    </div>

    <div class="col-span-6">
      <h3>Assistant Style</h3>
      <select class="select" bind:value={$assistantStyle}>
        <option value="balanced">Balanced</option>
        <option value="creative">Creative</option>
        <option value="precise">Precise</option>
      </select>
    </div>

    <div class="col-span-6">
      <h3>Summarizer Options</h3>
      <label>
        Type:
        <select class="select" bind:value={$summarizerOptions.type}>
          <option value="tl;dr">TL;DR</option>
          <option value="bullet-points">Bullet Points</option>
          <option value="narrative">Narrative</option>
        </select>
      </label>
      <label>
        Format:
        <select class="select" bind:value={$summarizerOptions.format}>
          <option value="plain-text">Plain Text</option>
          <option value="markdown">Markdown</option>
          <option value="html">HTML</option>
        </select>
      </label>
      <label>
        Length:
        <select class="select" bind:value={$summarizerOptions.length}>
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </label>
    </div>

    <div class="col-span-6">
      <h3>Writer Options</h3>
      <label>
        Tone:
        <select class="select" bind:value={$writerOptions.tone}>
          <option value="neutral">Neutral</option>
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
          <option value="friendly">Friendly</option>
          <option value="professional">Professional</option>
        </select>
      </label>
      <label>
        Format:
        <select class="select" bind:value={$writerOptions.format}>
          <option value="plain-text">Plain Text</option>
          <option value="markdown">Markdown</option>
          <option value="html">HTML</option>
        </select>
      </label>
      <label>
        Length:
        <select class="select" bind:value={$writerOptions.length}>
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
        <select class="select" bind:value={$rewriterOptions.tone}>
          <option value="as-is">As Is</option>
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
          <option value="friendly">Friendly</option>
          <option value="professional">Professional</option>
        </select>
      </label>
      <label>
        Format:
        <select class="select" bind:value={$rewriterOptions.format}>
          <option value="as-is">As Is</option>
          <option value="plain-text">Plain Text</option>
          <option value="markdown">Markdown</option>
          <option value="html">HTML</option>
        </select>
      </label>
      <label>
        Length:
        <select class="select" bind:value={$rewriterOptions.length}>
          <option value="as-is">As Is</option>
          <option value="shorter">Shorter</option>
          <option value="longer">Longer</option>
        </select>
      </label>
    </div>
  </form>

  <form class="grid grid-cols-6 gap-4">
    <h2 class="col-span-6">AI Settings</h2>
    <div class="col-span-3">
      <h3 class="h3">AI Provider</h3>
      <select class="select" bind:value={$aiProvider}>
        <option value={Provider.Local}>Local</option>
        <option value={Provider.Remote}>Remote</option>
      </select>
    </div>
    <div class="col-span-3">
      <h3>Assistant Style</h3>
      <select class="select" bind:value={$assistantStyle}>
        <option value="balanced">Balanced</option>
        <option value="creative">Creative</option>
        <option value="precise">Precise</option>
      </select>
    </div>
    <div class="col-span-6">
      <h3>Summarizer Options</h3>
      <label>
        Type:
        <select class="select" bind:value={$summarizerOptions.type}>
          <option value="tl;dr">TL;DR</option>
          <option value="bullet-points">Bullet Points</option>
          <option value="narrative">Narrative</option>
        </select>
      </label>
      <label>
        Format:
        <select class="select" bind:value={$summarizerOptions.format}>
          <option value="plain-text">Plain Text</option>
          <option value="markdown">Markdown</option>
          <option value="html">HTML</option>
        </select>
      </label>
      <label>
        Length:
        <select class="select" bind:value={$summarizerOptions.length}>
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </label>
    </div>
    <div class="col-span-6">
      <h3>Writer Options</h3>
      <label>
        Tone:
        <select class="select" bind:value={$writerOptions.tone}>
          <option value="neutral">Neutral</option>
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
          <option value="friendly">Friendly</option>
          <option value="professional">Professional</option>
        </select>
      </label>
      <label>
        Format:
        <select class="select" bind:value={$writerOptions.format}>
          <option value="plain-text">Plain Text</option>
          <option value="markdown">Markdown</option>
          <option value="html">HTML</option>
        </select>
      </label>
      <label>
        Length:
        <select class="select" bind:value={$writerOptions.length}>
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </label>
    </div>
    <div class="col-span-6">
      <h3>Rewriter Options</h3>
      <label>
        Tone:
        <select class="select" bind:value={$rewriterOptions.tone}>
          <option value="as-is">As Is</option>
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
          <option value="friendly">Friendly</option>
          <option value="professional">Professional</option>
        </select>
      </label>
      <label>
        Format:
        <select class="select" bind:value={$rewriterOptions.format}>
          <option value="as-is">As Is</option>
          <option value="plain-text">Plain Text</option>
          <option value="markdown">Markdown</option>
          <option value="html">HTML</option>
        </select>
      </label>
      <label>
        Length:
        <select class="select" bind:value={$rewriterOptions.length}>
          <option value="as-is">As Is</option>
          <option value="shorter">Shorter</option>
          <option value="longer">Longer</option>
        </select>
      </label>
    </div>
  </form>
{:else}
  <p>Chrome AI NOT available</p>
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
