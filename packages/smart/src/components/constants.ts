export type AIStyles = 'balanced' | 'creative' | 'precise';
export const TEMP_STYLES: Record<AIStyles, { temperature: number; topK: number }> = {
  balanced: {
    temperature: 0.5,
    topK: 3,
  },
  creative: {
    temperature: 0.8,
    topK: 5,
  },
  precise: {
    temperature: 0.2,
    topK: 2,
  },
};

export const ASSISTANT_SYSTEM_PROMPT = {
  content: 'You are a helpful AI assistant.',
  role: 'system',
};
export const WRITER_SYSTEM_PROMPT = {
  content: `You are a text editor. You will be given a prompt and a text to edit, which may be empty or incomplete.
  Edit the text to match the prompt, and only respond with the full edited version of the text - do not include any other information, context, or explanation.
  If you add on to the text, respond with the full version, not just the new portion. Do not include the prompt or otherwise preface your response.
  Do not enclose the response in quotes.`,
  role: 'system',
};

/**
 * language
 */
type LanguageEntry = [string, ...Array<string[]>];
export const langs: LanguageEntry[] = [
  ['Afrikaans', ['af-ZA']],
  ['አማርኛ', ['am-ET']],
  ['Azərbaycanca', ['az-AZ']],
  ['বাংলা', ['bn-BD', 'বাংলাদেশ'], ['bn-IN', 'ভারত']],
  ['Bahasa Indonesia', ['id-ID']],
  ['Bahasa Melayu', ['ms-MY']],
  ['Català', ['ca-ES']],
  ['Čeština', ['cs-CZ']],
  ['Dansk', ['da-DK']],
  ['Deutsch', ['de-DE']],
  [
    'English',
    ['en-AU', 'Australia'],
    ['en-CA', 'Canada'],
    ['en-IN', 'India'],
    ['en-KE', 'Kenya'],
    ['en-TZ', 'Tanzania'],
    ['en-GH', 'Ghana'],
    ['en-NZ', 'New Zealand'],
    ['en-NG', 'Nigeria'],
    ['en-ZA', 'South Africa'],
    ['en-PH', 'Philippines'],
    ['en-GB', 'United Kingdom'],
    ['en-US', 'United States'],
  ],
  [
    'Español',
    ['es-AR', 'Argentina'],
    ['es-BO', 'Bolivia'],
    ['es-CL', 'Chile'],
    ['es-CO', 'Colombia'],
    ['es-CR', 'Costa Rica'],
    ['es-EC', 'Ecuador'],
    ['es-SV', 'El Salvador'],
    ['es-ES', 'España'],
    ['es-US', 'Estados Unidos'],
    ['es-GT', 'Guatemala'],
    ['es-HN', 'Honduras'],
    ['es-MX', 'México'],
    ['es-NI', 'Nicaragua'],
    ['es-PA', 'Panamá'],
    ['es-PY', 'Paraguay'],
    ['es-PE', 'Perú'],
    ['es-PR', 'Puerto Rico'],
    ['es-DO', 'República Dominicana'],
    ['es-UY', 'Uruguay'],
    ['es-VE', 'Venezuela'],
  ],
  ['Euskara', ['eu-ES']],
  ['Filipino', ['fil-PH']],
  ['Français', ['fr-FR']],
  ['Basa Jawa', ['jv-ID']],
  ['Galego', ['gl-ES']],
  ['ગુજરાતી', ['gu-IN']],
  ['Hrvatski', ['hr-HR']],
  ['IsiZulu', ['zu-ZA']],
  ['Íslenska', ['is-IS']],
  ['Italiano', ['it-IT', 'Italia'], ['it-CH', 'Svizzera']],
  ['ಕನ್ನಡ', ['kn-IN']],
  ['ភាសាខ្មែរ', ['km-KH']],
  ['Latviešu', ['lv-LV']],
  ['Lietuvių', ['lt-LT']],
  ['മലയാളം', ['ml-IN']],
  ['मराठी', ['mr-IN']],
  ['Magyar', ['hu-HU']],
  ['ລາວ', ['lo-LA']],
  ['Nederlands', ['nl-NL']],
  ['नेपाली भाषा', ['ne-NP']],
  ['Norsk bokmål', ['nb-NO']],
  ['Polski', ['pl-PL']],
  ['Português', ['pt-BR', 'Brasil'], ['pt-PT', 'Portugal']],
  ['Română', ['ro-RO']],
  ['සිංහල', ['si-LK']],
  ['Slovenščina', ['sl-SI']],
  ['Basa Sunda', ['su-ID']],
  ['Slovenčina', ['sk-SK']],
  ['Suomi', ['fi-FI']],
  ['Svenska', ['sv-SE']],
  ['Kiswahili', ['sw-TZ', 'Tanzania'], ['sw-KE', 'Kenya']],
  ['ქართული', ['ka-GE']],
  ['Հայերեն', ['hy-AM']],
  ['தமிழ்', ['ta-IN', 'இந்தியா'], ['ta-SG', 'சிங்கப்பூர்'], ['ta-LK', 'இலங்கை'], ['ta-MY', 'மலேசியா']],
  ['తెలుగు', ['te-IN']],
  ['Tiếng Việt', ['vi-VN']],
  ['Türkçe', ['tr-TR']],
  ['اُردُو', ['ur-PK', 'پاکستان'], ['ur-IN', 'بھارت']],
  ['Ελληνικά', ['el-GR']],
  ['български', ['bg-BG']],
  ['Русский', ['ru-RU']],
  ['Српски', ['sr-RS']],
  ['Українська', ['uk-UA']],
  ['한국어', ['ko-KR']],
  [
    '中文',
    ['cmn-Hans-CN', '普通话 (中国大陆)'],
    ['cmn-Hans-HK', '普通话 (香港)'],
    ['cmn-Hant-TW', '中文 (台灣)'],
    ['yue-Hant-HK', '粵語 (香港)'],
  ],
  ['日本語', ['ja-JP']],
  ['हिन्दी', ['hi-IN']],
  ['ภาษาไทย', ['th-TH']],
];

// const aaa = langs.flatMap(([l, ...lo]) => lo).sort((a, b) => (a[0] < b[0] ? -1 : 1));
// console.log(aaa);

// <select>
//   <optgroup label="Options 1">
//     <option>Option 1.1</option>
//     <option>Option 1.2</option>
//   </optgroup>
//   <optgroup label="Options 2">
//     <option>Option 2.1</option>
//     <option>Option 2.2</option>
//   </optgroup>
// </select>
