import type { DataHandler, Row } from '@vincjo/datatables/legacy';
import { getContext, setContext } from 'svelte';

const DATA_HANDLER = Symbol('DATA_HANDLER');

export function setCtx<T extends Row>(handler: DataHandler<T>) {
  setContext(DATA_HANDLER, handler);
}

export function getCtx() {
  return getContext<Parameters<typeof setCtx>[0]>(DATA_HANDLER);
}
