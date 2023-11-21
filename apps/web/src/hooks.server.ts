import { sequence } from '@sveltejs/kit/hooks';
import { handleDetectTheme } from '$lib/server/middleware';

export const handle = sequence(handleDetectTheme);
