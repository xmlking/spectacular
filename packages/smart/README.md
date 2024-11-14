# Smart Components

Hybrid AI Apps

AI assistend web components usage examples.

Enabling on-device AI in your Browser. *Private, Fast and Free*

All Components leveraing `Chrome built-in model (Gemini Nano)`, build with [Vercel AI](https://vercel.com/ai) and [chrome-ai](https://github.com/jeasonstudio/chrome-ai) provider

Use [AiBrow](https://aibrow.ai/) to load **Small Language Models (SLMs)** into browser and use then to build *Hybrid AI WebApps*.

* [Docs](https://docs.aibrow.ai/)
* [API Reference](https://docs.aibrow.ai/api-reference/aibrow)
* [Playground](https://demo.aibrow.ai/playground/)

## Components

### Magic Spell

This **wordsmith** svelte component enables user write *with confidence* in any web forms.

Based on nextjs [magic-spell](https://github.com/ai-ng/magic-spell/tree/main)

### Smart Date

### Sentiment Analyzer (TODO)

## Writing Assistance

The **summarizer** API produces summaries of input text;
The **writer** API writes new material, given a writing task prompt;
The **rewriter** API transforms and rephrases input text in the requested ways.

### Use cases

Based on discussions with web developers, we've been made aware so far of the following use cases:

#### Summarizer API

* Summarizing a meeting transcript for those joining the meeting late.
* Summarizing support conversations for input into a database.
* Giving a sentence- or paragraph-sized summary of many product reviews.
* Summarizing long posts or articles for the reader, to let the reader judge whether to read the whole article.
* Generating article titles (a very specific form of summary).
* Summarizing questions on Q&A sites so that experts can scan through many summaries to find ones they are well-suited to answer.

#### Writer API

* Generating textual explanations of structured data (e.g. poll results over time, bug counts by product, …)
* Expanding pro/con lists into full reviews.
* Generating author biographies based on background information (e.g., from a CV or previous-works list).
* Break through writer's block and make creating blog articles less intimidating by generating a first draft based on stream-of-thought or bullet point inputs.
* Composing a post about a product for sharing on social media, based on either the user's review or the general product description.

#### Rewriter API

* Removing redundancies or less-important information in order to fit into a word limit.
* Increasing or lowering the formality of a message to suit the intended audience.
* Suggest rephrasing of reviews or posts to be more constructive, when they're found to be using toxic language.
* Rephrasing a post or article to use simpler words and concepts ("[explain like I'm 5](https://en.wiktionary.org/wiki/ELI5)").

## TODO

* [Smart Datetime Picker](https://dub.co/blog/smart-datetime-picker) with [Chrono](https://git.new/chrono)
* [midday-ai](https://github.com/midday-ai/midday) for smart filters idea.

## Ref

* <https://github.com/appwrite/console/blob/main/src/lib/commandCenter/panels/ai.svelte>
* <https://dev.to/ptvty/next-level-web-applications-with-on-device-generative-ai-a-look-at-google-chromes-built-in-gemini-nano-llm-4bng>
* <https://medium.com/google-cloud/deep-dive-into-function-calling-in-gemini-b62e2618e3a7>
* <https://github.com/marketplace/models>
* <https://github.com/jeasonstudio/chrome-ai>
* <https://github.com/WICG/translation-api/tree/main>
