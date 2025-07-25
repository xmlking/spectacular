import { Logger } from '@repo/utils';
import { env as secrets } from '$env/dynamic/private';
import { enableBotProtection, showMagicLinkLogin, showSocialLogin } from '$lib/flags';

const log = new Logger('server:auth:signin');

export const load = async () => {
  const showBotProtection = await enableBotProtection();
  const showMagicLink = await showMagicLinkLogin();
  const showSocial = await showSocialLogin();

  return { flags: { showBotProtection, showMagicLink, showSocial } }; // TODO: use flags
};
