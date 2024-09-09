# Chat

use GUN.js

Web Speach API <https://www.google.com/intl/en/chrome/demos/speech.html>

PROXY  Google Speech Streaming API(gRPC)
<https://github.com/googleapis/nodejs-speech/issues/111>
As linked above in my comment, below URL list worked for me(this is about 2 years back)
<https://texttospeech.googleapis.com/>*
<https://speech.googleapis.com/>*
<https://accounts.google.com/>*
<https://www.googleapis.com/>*
<https://oauth2.googleapis.com/>*
<https://cloud.google.com/>*

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
window.ai.summarizer.capabilities
<https://github.com/words/double-metaphone>

<https://github.com/debugtheworldbot/chromegemini/blob/main/src/lib/utils.ts>
export const getAiApi = () => {
  return {
    create: window.ai.assistant
      ? window.ai.assistant.create.bind(window.ai.assistant)
      : window.ai.createTextSession.bind(window.ai),
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
