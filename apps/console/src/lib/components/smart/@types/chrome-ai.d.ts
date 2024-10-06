// /**
//  * Additional Chrome-AI Types that are missing in
//  * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/dom-chromium-ai/index.d.ts
//  */

/**
 * Translation API
 */
interface WindowOrWorkerGlobalScope {
  readonly translation: Translation;
}

interface Translation {
  canDetect(): Promise<AICapabilityAvailability>;
  createDetector(): Promise<LanguageDetector>;
}

interface LanguageDetector extends AICreateMonitor {
  ready: Promise<undefined>;
  detect(input: string): Promise<LanguageDetectionResult[]>;
}

interface LanguageDetectionResult {
  confidence: number;
  LanguageDetectionResult: string;
}
