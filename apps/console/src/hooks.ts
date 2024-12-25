import { i18n } from '$lib/i18n';
import { SerializableDate } from '$lib/types';
// export { dead_links as reroute } from "$lib/middleware/dead-links";
import type { Reroute, Transport } from '@sveltejs/kit';

export const reroute = i18n.reroute() satisfies Reroute;

export const transport: Transport = {
  SerializableDate: {
    encode: (value: unknown) => value instanceof SerializableDate && value.raw,
    decode: (rawDate: string) => new SerializableDate(rawDate),
  },
};
