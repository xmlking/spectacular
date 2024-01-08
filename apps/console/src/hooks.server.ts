import { sequence } from '@sveltejs/kit/hooks';
import { auth, guard, lang, theme } from '$lib/server/middleware';

// NOTE: Order is impotent! `auth` middleware sets `nhost` into `local` which is used by `guard` middleware
export const handle = sequence(auth, guard, lang, theme);
