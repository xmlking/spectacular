import { showMagicLinkLogin, showSocialLogin } from '$lib/flags';
import { Logger } from '@spectacular/utils';

const log = new Logger('server:auth:signin');

export const load = async (event) => {
  const showMagicLink = await showMagicLinkLogin();
  const showSocial = await showSocialLogin();
  return { flags: { showMagicLink, showSocial } }; // TODO: use flags
};
