<script lang="ts">
  import { onMount } from "svelte";
  onMount(() => {
    // The page is ready.
    console.log("chat mounted");
    const assistant = document.querySelector("msc-ai-assistant");
    assistant?.show(); // toggle(force)
  });

  const mappings = {
    "front-end-expert": {
      prompts:
        "You are a front-end engineer and very good at CSS, HTML and JavaScript.",
      subject: "AI Assistant (front-end)",
    },
    "top-sales": {
      prompts:
        "You are a top sales and very good at product consulting. You are also good at rewriting product information and make them more vivid.",
      subject: "AI Assistant (top sales)",
    },
    translator: {
      prompts:
        "You are a translator and very good at translate English to Traditional Chinese or Traditional Chinese to English.",
      subject: "AI Assistant (translator)",
    },
    writer: {
      prompts:
        "You are a writer and very good at rewriting article and make them more vivid.",
      subject: "AI Assistant (writer)",
    },
    gamer: {
      prompts:
        "You are a gamer and very good at playing PC games and video games. You also know to all games' background and stories.",
      subject: "AI Assistant (gamer)",
    },
    none: {
      prompts: "",
      subject: "AI Assistant",
    },
  };
</script>

<svelte:head>
  <script
    type="module"
    src="https://unpkg.com/msc-ai-assistant/mjs/wc-msc-ai-assistant.js"
  >
  </script>
</svelte:head>

<msc-ai-assistant>
  <script type="application/json">
    {
      "config": {
        "systemPrompt": "You are a front-end engineer and very good at CSS, HTML and JavaScript.",
        "temperature": 0.8,
        "topK": 3
      },
      "l10n": {
        "subject": "AI Assistant",
        "placeholder": "Ask Gemini"
      },
      "pip": false
    }
  </script>
</msc-ai-assistant>

<style>
  msc-ai-assistant {
    /* main */
    --msc-ai-assistant-inline-size: 400px;
    --msc-ai-assistant-block-size: 600px;
    /* --msc-ai-assistant-inset-inline-start: 16px; */
    /* --msc-ai-assistant-inset-block-start: 16px; */
    --msc-ai-assistant-inset-inline-start: calc(
      100% - 16px - var(--msc-ai-assistant-inline-size)
    );
    --msc-ai-assistant-inset-block-start: : calc(100% - 16px -
          var(--msc-ai-assistant-block-size));
    --msc-ai-assistant-box-shadow: none;
    --msc-ai-assistant-z-index: 1000;
    --msc-ai-assistant-background-color: rgba(255 255 255);
    --msc-ai-assistant-head-text-color: rgba(35 42 49);
    --msc-ai-assistant-line-color: rgba(199 205 210);
    --msc-ai-assistant-close-icon-color: rgba(95 99 104);
    --msc-ai-assistant-close-hover-background-color: rgba(245 248 250);
    --msc-ai-assistant-content-text-color: rgba(35 42 49);
    --msc-ai-assistant-content-highlight-text-color: rgba(68 71 70);
    --msc-ai-assistant-content-highlight-background-color: rgba(233 238 246);
    --msc-ai-assistant-content-group-background-color: rgba(241 244 248);
  }
</style>
