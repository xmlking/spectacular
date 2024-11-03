import * as m from '$i18n/messages';
import * as runtime from '$i18n/runtime';
import { createI18n } from '@inlang/paraglide-sveltekit';
export const i18n = createI18n(runtime, {
  pathnames: {
    '/about': m.about_path,
  },
  exclude: ['/base/not-translated'],
  textDirection: {
    en: 'ltr',
    es: 'ltr',
    de: 'ltr',
  }
});
