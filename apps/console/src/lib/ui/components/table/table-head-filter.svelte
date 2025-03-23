<script lang="ts" module>
import type { Row } from '@vincjo/datatables/legacy';
type T = Row;
</script>

<script lang="ts" generics="T extends Row">
import type { DataHandler, Field, Comparator } from '@vincjo/datatables/legacy';
import type { HTMLInputAttributes } from 'svelte/elements';
import { getCtx } from './ctx.js';
import { cn } from '$lib/ui/utils';

type $$Props = HTMLInputAttributes;


  interface Props {
    class?: $$Props['class'];
    handler: DataHandler<T>;
    filterBy: Field<T>;
    align?: 'left' | 'right' | 'center';
    comparator?: Comparator<T> | null;
    [key: string]: any
  }

  let {
    class: className = undefined,
    handler = $bindable(),
    filterBy,
    align = 'left',
    comparator = null,
    ...rest
  }: Props = $props();

handler ??= getCtx();

let value: string = $state('');
handler.on('clearFilters', () => (value = ''));
</script>

<th>
  <input
    style:text-align={align}
    type="text"
    placeholder={handler.i18n.filter}
    spellcheck="false"
    class={cn('input variant-form-material h-8 w-full text-sm', className)}
    {...rest}
    bind:value
    oninput={() => handler.filter(value, filterBy, comparator)}
  />
</th>
