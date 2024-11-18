/**
 *  Chrome AI Util Functions
 */

export function getChromeVersion() {
  const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
  return raw ? Number.parseInt(raw[2], 10) : 0;
}

/**
 * Detection & installation from aiBrow extension
 */
export async function checkAibrowInstalled() {
  const capabilities = await window.aibrow.capabilities();
  if (!capabilities.extension) {
    // The extension is not installed
    console.log(
      'Install the extension from https://chromewebstore.google.com/detail/aibrow/bbkbjiehfkggfkbampigbbakecijicdm',
    );
    return false;
  }
  if (!capabilities.helper) {
    // The helper binary is not installed. We can fetch the direct link to the latest
    // version for the current platform
    const helperUrl = await window.aibrow.getHelperDownloadUrl();
    console.log(`Install the helper from ${helperUrl}`);
    return false;
  }

  // We're all installed
  return true;
}

/**
 * polyfill window.ai... at start
 */
export async function init() {
  // check if AiBrow is polyfilling the window.AI API
  const isPolyfilled = window.ai && window.ai.aibrow === true;
  if (isPolyfilled) {
    console.log('AiBrow is polyfilling the window.AI API');
    console.log('%cAiBrow is polyfilling the window.AI API\nAll Good', 'color: green');
    return;
  }
  const aibrowInstalled = await checkAibrowInstalled();
  // polyfilling missing AI features on window.AI
  if (aibrowInstalled && !isPolyfilled) {
    console.log('%cPolyfilling missing AI features on window.AI', 'color: magenta');
    window.ai.writer = window.aibrow.writer;
    window.ai.rewriter = window.aibrow.rewriter;
    window.ai.assistant = window.aibrow.languageModel;
    window.ai.translator = window.aibrow.translator;
    return;
  }
  // if neither aibrow installed nor chrome.ai installed but some AI features are avaible due to `Chrome Origin Trials`
  if ('translation' in self && 'createTranslator' in self.translation) {
    console.log('%cPolyfilling ai.translator.create', 'color: blue');
    window.ai.translator.create = window.translation.createTranslator;
  }

  console.log('%cNo local AI models available', 'color: red');
}
