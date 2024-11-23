export * from './constants.js';
export * from './settings.js';
export * from './smart.js';

import Stats from './stats.svelte';
import Settings from './settings.svelte';
import Support from './support.svelte';
import MagicSpellTextarea from './magic-spell-textarea.svelte';
import Textarea from './textarea.svelte';
import DatePicker from './date-picker.svelte';
import Date from './date.svelte';
import ComboBox from './combo-box.svelte';
import Paste from './paste.svelte';
import Sentiment from './sentiment.svelte';

export {
  Stats,
  Settings,
  Support,
  MagicSpellTextarea,
  Textarea,
  DatePicker,
  Date,
  ComboBox,
  Paste,
  Sentiment,
  //
  Stats as SmartStats,
  Settings as SmartSettings,
  Support as SmartSupport,
  MagicSpellTextarea as SmartMagicSpellTextarea,
  Textarea as SmartTextarea,
  DatePicker as SmartDatePicker,
  Date as SmartDate,
  ComboBox as SmartComboBox,
  Paste as SmartPaste,
  Sentiment as SmartSentiment
};
