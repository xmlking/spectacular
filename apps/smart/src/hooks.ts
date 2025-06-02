import { deLocalizeUrl } from '$i18n/runtime';
import type { Reroute } from '@sveltejs/kit';

export const reroute: Reroute = (request) => {
  return deLocalizeUrl(request.url).pathname;
};
