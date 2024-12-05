export * from './constants.js';
export * from './settings.js';
export * from './smart.js';

import Stats from './stats.svelte';
import Settings from './settings.svelte';
import Support from './support.svelte';
import MagicSpellTextarea from './magic-spell-textarea.svelte';
import Textarea from './textarea.svelte';
import Date from './date.svelte';
import ComboBox from './combo-box.svelte';
import Sentiment from './sentiment.svelte';
import Chat from './chat.svelte';

export {
  Stats,
  Settings,
  Support,
  MagicSpellTextarea,
  Textarea,
  Date,
  ComboBox,
  Sentiment,
  Chat,
  //
  Stats as SmartStats,
  Settings as SmartSettings,
  Support as SmartSupport,
  MagicSpellTextarea as SmartMagicSpellTextarea,
  Textarea as SmartTextarea,
  Date as SmartDate,
  ComboBox as SmartComboBox,
  Sentiment as SmartSentiment,
  Chat as SmartChat,
};
