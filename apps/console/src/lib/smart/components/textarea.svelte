<!--
@component SmartTextarea - allow users write/rewrite/summarize with On-Device AI
  @prop {string} value - The field value, this is the seed for Writer.
  @prop {ToolType} tool - Which writing tool? - Writer, Rewriter, Summarizer, Translator
  @prop {AIWriterCreateOptions} writerOptions - Writer Create Options
  @prop {AIRewriterCreateOptions} rewriterOptions - Rewriter Create Options
  @prop {AISummarizerCreateOptions} summarizerOptions - Summarizer Create Options
  @prop {string} context - AI Writer/Rewriter Context
  @prop {boolean} stream - streaming output enabled?
  @slot default - The map container with image, vector, and text annotations

  Usage:
  ```svelte
    <SmartTextarea
      class="textarea data-[fs-error]:input-error"
      {...attrs}
      bind:value={$form.content}
      {...$constraints.content}
      stream={true}
      context="I'm a long-standing customer."
    />
  ```
-->
<script lang="ts" module>
import { Crop, PenTool, Replace, SpellCheck2 } from 'lucide-svelte';
import Translate from './translate-icon.svelte';
// import Summary from "./summary-icon.svelte";
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
    icon: Translate,
    placeholder: 'Translating content...',
    header: 'Translation:',
  },
} as const;

export type ToolType = keyof typeof toolOptions;
</script>

<script lang="ts">
  import { stopPropagation } from 'svelte/legacy';

  import type { HTMLTextareaAttributes } from "svelte/elements";
  import { Logger } from "@spectacular/utils";
  import { Sparkles, SearchIcon } from "lucide-svelte";
  import { default as LoaderIcon } from "./loader-icon.svelte";
  import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton";
  // import { getFormField } from "formsnap";
  import Result from "./result.svelte";
  import { isPolyfilledTranslation, languageTagToHumanReadable } from "./smart.js";

  const log = new Logger("smart:textarea:browser");

  

  interface Props {
    value?: string;
    tool?: ToolType;
    writerOptions?: AIWriterCreateOptions;
    rewriterOptions?: AIRewriterCreateOptions;
    summarizerOptions?: AISummarizerCreateOptions;
    context?: string;
    stream?: boolean;
    [key: string]: any
  }

  let {
    value = $bindable(""),
    tool = $bindable("writer"),
    writerOptions = $bindable({
    tone: "neutral",
    format: "plain-text",
    length: "medium",
  }),
    rewriterOptions = $bindable({
    tone: "as-is",
    format: "as-is",
    length: "as-is",
  }),
    summarizerOptions = $bindable({
    type: "tl;dr",
    format: "plain-text",
    length: "medium",
  }),
    context = "",
    stream = false,
    ...rest
  }: Props = $props();

  // Variables
  // const { errors } = getFormField();
  let loading = $state(false);
  let sharedContext = $state(context);
  let completion: string = $state();
  let error: string = $state();
  let translationOps: AITranslatorCreateOptions = $state({
    sourceLanguage: "en",
    targetLanguage: "en",
  });
  const controller = new AbortController();
  let detectedLanguage: LanguageDetectionResult | null = $state();
  let inputEl: HTMLTextAreaElement = $state();

  function clearPreviousResults() {
    error = "";
    completion = "";
  }

  // Functions
  async function handleSubmit() {
    // Reset state
    clearPreviousResults();
    // Validate
    if (value.trim() === "") {
      error = "Type your intent and try again...";
      // errors?.update((items) => {
      //   items.push(error);
      //   return items;
      // });
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
  function dispatchChangeEvent() {
    const event = new Event("change", { bubbles: true });
    inputEl.dispatchEvent(event);
  }

  // Tools
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
      writer = await self.ai.writer.create({
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
        // errors?.update((items) => {
        //   items.push(error);
        //   return items;
        // });
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
      rewriter = await self.ai.rewriter.create({
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
        // errors?.update((items) => {
        //   items.push(error);
        //   return items;
        // });
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
      summarizer = await self.ai.summarizer.create({
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
        // errors?.update((items) => {
        //   items.push(error);
        //   return items;
        // });
      }
    } finally {
      summarizer?.destroy();
      loading = false;
    }
  }
  async function detectLanguage() {
    let detector;
    try {
      if (!value.trim()) return;
      loading = true;
      detector = await self.ai.languageDetector.create();
      const results = await detector.detect(value.trim());
      if (Array.isArray(results) && results.length > 0) {
        detectedLanguage = results[0];
        if (detectedLanguage.detectedLanguage) {
          translationOps.sourceLanguage = detectedLanguage.detectedLanguage;
          log.debug(
            `The language is: ${results[0].detectedLanguage} with a confidence of: ${results[0].confidence}`,
          );
        }
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        error = err.message;
        // errors?.update((items) => {
        //   items.push(error);
        //   return items;
        // });
      }
    } finally {
      detector?.destroy();
      loading = false;
    }
  }
  async function translate() {
    let translator;
    let streamSupported = isPolyfilledTranslation();
    try {
      if (self.ai.translator) {
        translator = await self.ai.translator.create(translationOps);
      } else if (
        "translation" in self &&
        "createTranslator" in self.translation
      ) {
        translator = await window.translation.createTranslator(translationOps);
      } else {
        error = "translation not supported";
        // errors?.update((items) => {
        //   items.push("translation not supported");
        //   return items;
        // });
        return;
      }
      if (stream && streamSupported) {
        const readableStream = (translator as AITranslator).translateStreaming(
          value.trim(),
        );
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
        completion = await translator.translate(value.trim());
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        error = err.message;
        // errors?.update((items) => {
        //   items.push(error);
        //   return items;
        // });
      }
    } finally {
      if (streamSupported) {
        (translator as AITranslator)?.destroy();
      }
      loading = false;
    }
  }

  // Reactivity
  // $: console.log (`---${completion}---`)
  // Placeholder text based on selected tool
  let placeholder: string = $derived(toolOptions[tool].placeholder);
  // Reactive block to update placeholder whenever tool changes
  
  let header: string = $derived(toolOptions[tool].header);
  
</script>

<div class="relative">
  <textarea
    bind:this={inputEl}
    {...rest}
    class="textarea pr-10"
    disabled={loading}
    bind:value
    onchange={detectLanguage}
></textarea>

  {#if value && detectedLanguage && detectedLanguage.detectedLanguage}
    <p
      class="hidden lg:block text-xs text-muted-foreground absolute right-14 bottom-2"
    >
      The language is <strong
        >{languageTagToHumanReadable(detectedLanguage.detectedLanguage)}</strong
      >
      with a confidence of {(detectedLanguage.confidence * 100).toFixed(1)}%
    </p>
  {/if}

  <button
    class="btn-icon btn-icon-sm bg-initial absolute right-2 bottom-2 p-1 h-auto"
    type="button"
    title="Use AI"
    onclickcapture={stopPropagation(handleSubmit)}
  >
    {#if loading}
      <LoaderIcon />
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
        <ent.icon />
      </RadioItem>
    {/each}
  </RadioGroup>
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
        <select
          bind:value={rewriterOptions.tone}
          onchange={() => (rewriterOptions.length = "as-is")}
        >
          <option value="as-is">As Is</option>
          <option value="more-casual">More Casual</option>
          <option value="more-formal">More Formal</option>
        </select>
        <select
          bind:value={rewriterOptions.length}
          onchange={() => (rewriterOptions.tone = "as-is")}
        >
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
          <option value="pt">Portuguese</option>
          <option value="ja">Japanese</option>
          <option value="zh">Mandarin Chinese</option>
          <option value="zh-Hant">Taiwanese Mandarin</option>
          <option value="vi">Vietnamese</option>
          <option value="tr">Turkish</option>
          <option value="hi">Hindi</option>
          <option value="bn">Bengali</option>
        </select>
        <select bind:value={translationOps.targetLanguage}>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="de">Deutsch</option>
          <option value="fr">Français</option>
          <option value="pt">Portuguese</option>
          <option value="ja">Japanese</option>
          <option value="zh">Mandarin Chinese</option>
          <option value="zh-Hant">Taiwanese Mandarin</option>
          <option value="vi">Vietnamese</option>
          <option value="tr">Turkish</option>
          <option value="hi">Hindi</option>
          <option value="bn">Bengali</option>
        </select>
      {/if}
    </div>
  </fieldset>
</div>
<Result {loading} {header} {placeholder} {completion} {error} on:accepted={() => {value = completion; completion = ''; dispatchChangeEvent()}}  />

<style lang="postcss">
  textarea {
    line-height: 1.5;
    field-sizing: content;
    min-height: 3lh;
  }
</style>
