<script lang="ts" context="module">
// import { IconSummary } from '@spectacular/ui/components/icons';
import { IconTranslate } from '@spectacular/ui/components/icons';
import { Crop, PenTool, Replace, SpellCheck2 } from '@lucide/svelte';

const toolOptions = {
  writer: {
    name: 'Writer',
    icon: PenTool,
    placeholder: 'Generating content...',
    header: '',
  },
  rewriter: {
    name: 'Rewriter',
    icon: SpellCheck2,
    placeholder: 'Rewriting content...',
    header: 'Rewritten Content:',
  },
  summarizer: {
    name: 'Summarizer',
    icon: Crop, // Replace
    placeholder: 'Summarizing content...',
    header: 'Summary:',
  },
  translator: {
    name: 'Translator',
    icon: IconTranslate,
    placeholder: 'Translating content...',
    header: 'Translation:',
  },
} as const;

export type ToolType = keyof typeof toolOptions;
export type WriterOptions = {
  tone?: AIWriterTone;
  format?: AIWriterFormat;
  length?: AIWriterLength;
};
export type RewriterOptions = {
  tone?: AIRewriterTone;
  format?: AIRewriterFormat;
  length?: AIRewriterLength;
};
export type SummarizerOptions = {
  type?: AISummarizerType;
  format?: AISummarizerFormat;
  length?: AISummarizerLength;
};
</script>

<script lang="ts">
  import type { HTMLTextareaAttributes } from "svelte/elements";
  import { Logger } from "@spectacular/utils";
  import { Sparkles, SearchIcon } from "@lucide/svelte";
  import { IconLoading } from '@spectacular/ui/components/icons';
  import * as ToggleGroup  from '@spectacular/ui/components/toggle-group';
  import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton";
  import { getFormField } from "formsnap";
  import Result from "./result.svelte";

  const log = new Logger("smart:textarea:browser");

  interface $$Props extends HTMLTextareaAttributes {
    value?: string;
    provider?: Provider;
    tone?: AIWriterTone;
    format?: AIWriterFormat;
    length?: AIWriterLength;
    writerOptions?: WriterOptions;
    rewriterOptions?: RewriterOptions;
    summarizerOptions?: SummarizerOptions;
    context?: string;
    stream?: boolean;
  }

  export let value = "";
  export let provider = $aiProvider;
  export let tool: ToolType = "writer";
  export let writerOptions: WriterOptions = { ...$writerOps };
  export let rewriterOptions: RewriterOptions = { ...$rewriterOps };
  export let summarizerOptions: SummarizerOptions = { ...$summarizerOps };
  export let context = "";
  export let stream = false;

  // Variables
  const { errors } = getFormField();
  let loading = false;
  let sharedContext = context;
  let completion: string;
  let error: string;
  let translationOps: TranslationLanguageOptions = {
    // TODO: auto detect sourceLanguage
    sourceLanguage: $preferedLang,
    targetLanguage: $preferedLang,
  };
  const controller = new AbortController();

  // Functions
  // async function write1() {
  //   const writer = await chromeAI.createWriter({
  //     tone,
  //     format,
  //     length,
  //     sharedContext,
  //   });
  //   console.log({ writer });
  //   if (writer === undefined) return;
  //   loading = true;
  //   // controller.abort()
  //   const stream = writer.writeStreaming(value, { signal: controller.signal });
  //   completion1 = createStreamStore(stream);
  //   loading = false;
  // }

  function clearPreviousResults() {
    error = "";
    completion = "";
  }

  async function handleSubmit() {
    // Reset state
    clearPreviousResults();
    // Validate
    if (value.trim() === "") {
      error = "Type your intent and try again...";
      errors?.update((items) => {
        items.push(error);
        return items;
      });
      return;
    }

    switch (tool) {
      case "writer":
        await write();
        return;
      case "rewriter":
        await rewrite();
        return;
      case "summarizer":
        await summarize();
        return;
      case "translator":
        await translate();
        return;
    }
  }
  async function write() {
    let writer;
    try {
      loading = true;
      console.log({
        tool: "writer",
        ...writerOptions,
        ...(sharedContext?.trim() && { sharedContext: sharedContext.trim() }),
        prompt: value.trim(),
      });
      writer = await (self.aibrow || self.ai).writer.create({
        ...writerOptions,
        ...(sharedContext?.trim() && { sharedContext: sharedContext.trim() }),
      });
      if (stream) {
        const readableStream = writer.writeStreaming(value.trim());
        // for await (const value of readableStream) {
        //   completion = value;
        // }
        const reader = readableStream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          completion = value;
        }
      } else {
        completion = await writer.write(value.trim());
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        error = err.message;
        errors?.update((items) => {
          items.push(error);
          return items;
        });
      }
    } finally {
      writer?.destroy();
      loading = false;
    }
  }
  async function rewrite() {
    let rewriter;
    try {
      loading = true;
      // sharedContext = "Avoid any toxic language and be as constructive as possible."
      console.log({
        tool: "rewriter",
        ...rewriterOptions,
        ...(sharedContext?.trim() && {
          sharedContext: sharedContext.trim(),
          prompt: value.trim(),
        }),
      });
      rewriter = await (self.aibrow || self.ai).rewriter.create({
        ...rewriterOptions,
        ...(sharedContext?.trim() && { sharedContext: sharedContext.trim() }),
      });
      if (stream) {
        const readableStream = rewriter.rewriteStreaming(value.trim(), {
          context,
        });
        // for await (const value of readableStream) {
        //   completion = value;
        // }
        const reader = readableStream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          completion = value;
        }
      } else {
        completion = await rewriter.rewrite(value.trim(), { context });
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        error = err.message;
        errors?.update((items) => {
          items.push(error);
          return items;
        });
      }
    } finally {
      rewriter?.destroy();
      loading = false;
    }
  }
  async function summarize() {
    let summarizer;
    try {
      loading = true;
      // sharedContext = 'A technical blog post';
      console.log({
        tool: "summarizer",
        ...summarizerOptions,
        ...(sharedContext?.trim() && { sharedContext: sharedContext.trim() }),
        prompt: value.trim(),
      });
      summarizer = await Summarizer.create({
        ...summarizerOptions,
        ...(sharedContext?.trim() && { sharedContext: sharedContext.trim() }),
      });
      if (stream) {
        const readableStream = summarizer.summarizeStreaming(value.trim());
        // for await (const value of readableStream) {
        //   completion = value;
        // }
        const reader = readableStream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          completion = value;
        }
      } else {
        completion = await summarizer.summarize(value.trim());
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        error = err.message;
        errors?.update((items) => {
          items.push(error);
          return items;
        });
      }
    } finally {
      summarizer?.destroy();
      loading = false;
    }
  }
  async function translate() {
    let translator;
    try {
      if (!('translation' in self) || !('createTranslator' in self.translation)) {
        errors?.update((items) => {
          items.push("translation not supported");
          return items;
        });
        return
      }

      const detector = await self.translation.createDetector();
      const { detectedLanguage, confidence } = (await detector.detect(value.trim()))[0];
      translationOps.sourceLanguage = detectedLanguage

      translator = await window.translation.createTranslator({
        sourceLanguage: translationOps.sourceLanguage,
        targetLanguage: translationOps.targetLanguage,
        })

      completion = await translator.translate(value.trim());
      // if (stream) {
      //   const readableStream = translator.translateStreaming(value.trim());
      //   // for await (const value of readableStream) {
      //   //   completion = value;
      //   // }
      //   const reader = readableStream.getReader();
      //   while (true) {
      //     const { done, value } = await reader.read();
      //     if (done) break;
      //     completion = value;
      //   }
      // } else {
      //   completion = await translator.translate(value.trim());
      // }
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        error = err.message;
        errors?.update((items) => {
          items.push(error);
          return items;
        });
      }
    } finally {
      // translator?.destroy();
      loading = false;
    }
  }

  async function translate1() {
    let translator;
    try {
      loading = true;
      const prompt = `Translate the following text to ${translationOps.targetLanguage}:\n\n"${value.trim()}"`;
      console.log({
        tool: "translator",
        prompt,
      });
      translator = await LanguageModel.create();
      if (stream) {
        const readableStream = translator.promptStreaming(prompt);
        // for await (const value of readableStream) {
        //   completion = value;
        // }
        const reader = readableStream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          completion = value;
        }
      } else {
        completion = await translator.prompt(prompt);
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        error = err.message;
        errors?.update((items) => {
          items.push(error);
          return items;
        });
      }
    } finally {
      translator?.destroy();
      loading = false;
    }
  }
  // Reactivity
  // $: console.log (`---${completion}---`)
  // Placeholder text based on selected tool
  let placeholder: string;
  // Reactive block to update placeholder whenever tool changes
  $: placeholder = toolOptions[tool].placeholder;
  let header: string;
  $: header = toolOptions[tool].header;
</script>

<div class="relative">
  <!-- <textarea
    {...$$restProps}
    class="textarea pr-10"
    disabled={loading}
    value={completion?.length > 0 ? completion.trim() : value}
    on:change={(e) => (value = e.target?.value)}
  /> -->
  <textarea
    {...$$restProps}
    class="textarea pr-10"
    disabled={loading}
    bind:value
  />
  <button
    class="btn-icon btn-icon-sm bg-initial absolute right-2 bottom-2 p-1 h-auto"
    type="button"
    on:click|stopPropagation|capture={handleSubmit}
  >
    {#if loading}
      <IconLoading />
    {:else}
      <Sparkles />
    {/if}
  </button>
</div>
<div
  class="grid justify-items-center xl:justify-items-start grid-cols-1 xl:grid-cols-4"
>
  <RadioGroup active="variant-filled-secondary">
    {#each Object.entries(toolOptions) as [value, ent] (value)}
      <RadioItem
        name="tool"
        disabled={loading}
        bind:group={tool}
        {value}
        label={value}
        title={ent.name}
        on:change={clearPreviousResults}
      >
        <svelte:component this={ent.icon} />
      </RadioItem>
    {/each}
  </RadioGroup>

<ToggleGroup.Root type="single">
  {#each Object.entries(toolOptions) as [value, ent] (value)}
    <ToggleGroup.Item
        name="tool"
        disabled={loading}
        bind:value={tool}
        {value}
        label={value}
        title={ent.name}
        on:change={clearPreviousResults}
    >
      <svelte:component this={ent.icon} />
    </ToggleGroup.Item>
  {/each}
</ToggleGroup.Root>

  <fieldset
    class="input-group input-group-divider grid-cols-[auto_1fr_auto] col-span-3"
  >
    <div class="input-group-shim">Context</div>
    <input
      type="text"
      placeholder={context}
      disabled={loading}
      bind:value={sharedContext}
    />
    <div>
      {#if tool === "writer"}
        <select bind:value={writerOptions.tone}>
          <option value="neutral">Neutral</option>
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
        </select>
        <select bind:value={writerOptions.format}>
          <option value="plain-text">Plain Text</option>
          <option value="markdown">Markdown</option>
        </select>
        <select bind:value={writerOptions.length}>
          <option value="short">Shorter</option>
          <option value="medium">Medium</option>
          <option value="long">Longer</option>
        </select>
      {:else if tool === "rewriter"}
        <!-- either Tone Or Length -->
        <select
          bind:value={rewriterOptions.tone}
          on:change={() => (rewriterOptions.length = "as-is")}
        >
          <option value="as-is">As Is</option>
          <option value="more-casual">More Casual</option>
          <option value="more-formal">More Formal</option>
        </select>
        <select
          bind:value={rewriterOptions.length}
          on:change={() => (rewriterOptions.tone = "as-is")}
          >>
          <option value="as-is">As Is</option>
          <option value="shorter">Shorter</option>
          <option value="longer">Longer</option>
        </select>
        <select bind:value={rewriterOptions.format}>
          <option value="as-is">As Is</option>
          <option value="plain-text">Plain Text</option>
          <option value="markdown">Markdown</option>
        </select>
      {:else if tool === "summarizer"}
        <select bind:value={summarizerOptions.type}>
          <option value="tl;dr">TL;DR</option>
          <option value="key-points">Bullet Points</option>
          <option value="teaser">Teaser</option>
          <option value="headline">Headline</option>
        </select>
        <select bind:value={summarizerOptions.format}>
          <option value="plain-text">Plain Text</option>
          <option value="markdown">Markdown</option>
        </select>
        <select bind:value={summarizerOptions.length}>
          <option value="short">Shorter</option>
          <option value="medium">Medium</option>
          <option value="long">Longer</option>
        </select>
        <!-- translator -->
      {:else}
        <select bind:value={translationOps.sourceLanguage}>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="de">Deutsch</option>
          <option value="fr">Français</option>
          <option value="te">తెలుగు</option>
          <option value="ta">தமிழ்</option>
        </select>
        <select bind:value={translationOps.targetLanguage}>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="de">Deutsch</option>
          <option value="fr">Français</option>
          <option value="te">తెలుగు</option>
          <option value="ta">தமிழ்</option>
        </select>
      {/if}
    </div>
  </fieldset>
</div>
<Result {loading} {header} {placeholder} {completion} {error} />

<style lang="postcss">
  textarea {
    line-height: 1.5;
    field-sizing: content;
    min-height: 3lh;
  }
</style>
