import { sequence } from '@sveltejs/kit/hooks';
import { handleDetectLocale, handleDetectTheme } from '$lib/server/middleware';

export const handle = sequence(handleDetectLocale, handleDetectTheme);
