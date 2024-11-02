export function languageTagToHumanReadable(
  languageTag: Intl.UnicodeBCP47LocaleIdentifier,
  targetLanguage: string = 'en-US',
) {
  const displayNames = new Intl.DisplayNames([targetLanguage], { type: 'language' });
  return displayNames.of(languageTag);
}

 /**
  * in-source testing
  * RUN: turbo run test --filter=@spectacular/smart
  */
if (import.meta.vitest) {
  const { it, expect } = import .meta.vitest;

  it('test languageTagToHumanReadable', async () => {
    expect(languageTagToHumanReadable("ja", "en")).toEqual("Japanese");
    expect(languageTagToHumanReadable("zh", "en")).toEqual("Chinese");
    expect(languageTagToHumanReadable("zh-Hant", "en")).toEqual("Traditional Chinese");
    expect(languageTagToHumanReadable("zh-TW", "en")).toEqual("Chinese (Taiwan)");
    expect(languageTagToHumanReadable("en", "ja")).toEqual("英語");
  })
}
