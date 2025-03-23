<script lang="ts" module>
import type { Row } from '@vincjo/datatables/legacy';
type T = Row;
</script>

<script lang="ts" generics="T extends Row">
import type { DataHandler } from '@vincjo/datatables/legacy';
import type { HTMLInputAttributes } from 'svelte/elements';
import { getCtx } from './ctx.js';
import { cn } from '$lib/ui/utils';

type $$Props = HTMLInputAttributes;


  interface Props {
    class?: $$Props['class'];
    handler: DataHandler<T>;
    [key: string]: any
  }

  let { class: className = undefined, handler = $bindable(), ...rest }: Props = $props();
let value = $state('');

handler ??= getCtx();

handler.on('clearSearch', () => (value = ''));
</script>

<input
  class={cn('input w-36 sm:w-64', className)}
  type="search"
  placeholder={handler.i18n.search}
  spellcheck="false"
  {...rest}
  bind:value
  oninput={() => handler.search(value)}
/>
