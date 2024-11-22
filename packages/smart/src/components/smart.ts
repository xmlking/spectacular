import type { ai as AI } from '@aibrow/dom-types';
/**
 *  Browser AI Util Functions
 */

export function getChromeVersion() {
  const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
  return raw ? Number.parseInt(raw[2], 10) : 0;
}

/**
 * Detection & installation from aiBrow extension
 */
export async function checkAibrowInstalled() {
  if (!window.aibrow) {
    // The extension is not installed
    console.log(
      'Install the extension from https://chromewebstore.google.com/detail/aibrow/bbkbjiehfkggfkbampigbbakecijicdm',
    );
    return false;
  }

  const capabilities = await window.aibrow.capabilities();
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

export function getBrowserAI() {
  // Always get the browsers AI, regardless of the user's preference in AiBrow
  const ai: typeof AI = window.ai && window.ai.aibrow === true ? window.ai.browserAI : window.ai;
  if (!window.ai) {
    // Eventually this check wont be needed as all browsers support window.ai
    // throw new Error('Your browser doesn\'t support window.ai')
    console.log("%cYour browser doesn't support window.ai", 'color: magenta');
    return undefined;
  }
  return ai;
}

export function getAiBrow(): typeof AI | undefined {
  if (!window.aibrow) {
    // Send user to the download page
    // throw new Error('AiBrow is not installed')
    return undefined;
  }
  return window.aibrow;
}

// const browserAI = getBrowserAI()
// const aibrowAI = getAiBrow()

// Both can be then used interchangeably as needed
// await browserAI.summarizer.create()
// await aibrowAI.summarizer.create()

// Or you can fallback as needed
// const writer = browserAI.writer || aibrowAI.writer || throw new Error('Writer is not supported')
// await writer.create()

export function isPolyfilledAI() {
  return window.ai && window.ai.aibrow === true;
}

export function isPolyfilledTranslation() {
  return window.translation?.aibrow === true;
}

/**
 * print ai status to console
 */
export async function printAIStats() {
  const browserAI = getBrowserAI();
  const aibrowAI = await checkAibrowInstalled();

  if (browserAI) {
    console.log('%cBrowser AI Installed', 'color: green');
  }
  if (aibrowAI) {
    console.log('%cAiBrow Installed', 'color: green');
  } else {
    console.log('%cAiBrow Not Installed', 'color: magenta');
  }
  if (!browserAI && !aibrowAI) {
    console.log("%cYour browser doesn't have any lcoal Models", 'color: red');
  }
}
