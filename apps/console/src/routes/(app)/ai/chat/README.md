# Chat

Decentralized Chat App using GUN.js and Svelte
use GUN.js

Web Speach API <https://www.google.com/intl/en/chrome/demos/speech.html>
<https://dictafone.app/new> <https://github.com/herebefrogs/dictafone.app>

PROXY  Google Speech Streaming API(gRPC)
<https://github.com/googleapis/nodejs-speech/issues/111>
As linked above in my comment, below URL list worked for me(this is about 2 years back)
<https://texttospeech.googleapis.com/>*
<https://speech.googleapis.com/>*
<https://accounts.google.com/>*
<https://www.googleapis.com/>*
<https://oauth2.googleapis.com/>*
<https://cloud.google.com/>*

Prompt gallery
<https://ai.google.dev/gemini-api/prompts>

Writing code
<https://github.com/tomayac/writer-rewriter-api-playground/tree/main>

Language Detector demo
<https://developer.chrome.com/blog/august2024-language-detection>

All Google samples
<https://github.com/GoogleChromeLabs/web-ai-demos/tree/main>
<https://github.com/swissspidy/ai-experiments/tree/main>

chrome://flags/#summarization-api-for-gemini-nano

<https://www.skeleton.dev/elements/chat>

 web speech API
<https://github.com/jhubbardsf/svelte-speech-recognition>

 <https://github.com/AhsanAyaz/zubaan-gemini-nano/blob/main/src/components/Dictaphone.tsx>

example  phonetic
<https://github.com/jacksloan/qlab-rest/blob/main/apps/voice-cmd/src/routes/index.svelte>

Libs
<https://github.com/jeffwhelpley/offlineai/tree/main>
Summarizer.capabilities
<https://github.com/words/double-metaphone>

<https://github.com/debugtheworldbot/chromegemini/blob/main/src/lib/utils.ts>
export const getAiApi = () => {
  return {
    create: LanguageModel
      ? LanguageModel.create.bind(self.LanguageModel)
      : self.ai.createTextSession.bind(self.ai),
  };
};

export async function checkSummarize() {
  function getChromeVersion() {
    var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    return raw ? parseInt(raw[2], 10) : 0;
  }
--

 <https://chrome.dev/web-ai-demos/summarization-api-playground/>

Chrome AI

<https://chromeai.org/>
prompt-api-playground <https://github.com/tomayac/prompt-api-playground>
writer-rewriter-api-playground <https://github.com/tomayac/writer-rewriter-api-playground>
<https://github.com/ReyNeill/Web-Powered-GPT>

use-nano
<https://github.com/freakyflow/use-nano/blob/main/src/use-nano.ts>

## prompts

```js
const SYSTEM_PROMPT: ChatCompletionMessageParam = {
  content: "You are a helpful AI assistant.",
  role: "system",
};
```

 Generate summary using Gemini Nano

```js
{
    systemPrompt:
      "You are helpful assistant to summarize web article. Your output is markdown formatted. please summary with bullet points and meaningful sections.",
    topK: 10,
    temperature: 0,
  }

   const prompt = `Summarize the following text.:\n\n${markdownPrompt}`;
  ```

Translate the summary to Japanese

```js
 const sessionTranslator = await LanguageModel.create({
    systemPrompt: "You are helpful assistant to translate the summary",
    topK: 10,
    temperature: 0,
  });

  if (language === "japanese") {
    summary = await sessionTranslator.prompt(
      `日本語に翻訳してください:\n\n${summary}`
    );
    console.debug("translated", summary);
  }
  sessionTranslator.destroy();
```

```js
 const stream = session.promptStreaming(
     `Summarise the following text in full sentences in less than 300 characters: ${ postContent }`
    );
```

```js
    const session = await LanguageModel.create( {
     initialPrompts: [
      {
       role: 'system',
       content: `You are a content assistant tasked with categorizing given content with the correct terms.

The following terms exist on the site:

${ termsList }

Given the provided content, determine the most suitable terms to describe the content.
Do not summarize the content. Do not hallucinate.
Provide the output as a comma-separated list of recommended term IDs.
`,
      },
      {
       role: 'user',
       content:
        'This is a presentation about my favorite content management system, WordPress. Go check it out.',
      },
      {
       role: 'assistant',
       content: '10,6',
      },
      {
       role: 'user',
       content: `I love pizza and Drupal!`,
      },
      {
       role: 'assistant',
       content: '1,3,4',
      },
     ],
    } );

    const prompt =
     `You are a content assistant tasked with categorizing given content with the correct terms.

The following terms exist on the site:

${ termsList }

Given these terms and provided content, determine the most suitable terms to describe the content.
Do not summarize. Do not hallucinate.
Provide the output as a comma-separated list of numeric term IDs.

Content:

${ postContent }`
      .replaceAll( '\t', '' )
      .replaceAll( '\n\n\n\n', '\n\n' );

    const stream = session.promptStreaming( prompt );
```

```js
async giveTitle(text: string): Promise<string> {
  const session = await LanguageModel.create();
  try {
   const result = await session.prompt(
    `Given the following summary, generate a title for the article: 
        ${text}`
   );
   console.log(`Answer: Title ${result.trim()}.`);
   return result.trim();
  } catch (error) {
   console.error(`Failed to generate title: ${error}`);
   return 'No title given';
  } finally {
   session.destroy();
  }
 }
```

```js
  let initiatorPrompt = `As ${initiator.name}, respond to ${recipient.name} who previously said: "${lastMessage}". Please role-play according to your attributes: ${initiatorAttributes} Recent interactions include: ${initiatorHistory}. Keep it short, 2 or 3 sentences.`;
     
const recipientPrompt = `As ${recipient.name}, respond to ${initiator.name} who just said: "${lastMessage}". Please role-play according to your attributes: ${recipientAttributes} Recent interactions include: ${recipientHistory}. Keep it short, 2 or 3 sentences.`;
```
