<script lang="ts">
// biome-ignore lint/style/useImportType: <explanation>
import * as Button from '#components/button/index.js';

type $$Props = Button.Props;
type $$Events = Button.Events;
</script>

<Button.Root type="submit" on:click on:keydown {...$$restProps}>
	<slot />
</Button.Root>

<!-- <script lang="ts">
  import Icon from '@iconify/svelte';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';

  export let superForm: SuperForm<z.AnyZodObject, any>;
  export let label = 'Submit';

  const { delayed, formId } = superForm;
</script>

<button class="relative btn variant-filled mt-2" form={$formId} disabled={$delayed} type="submit">
  {#if $delayed}
    <span class="absolute">
      <Icon class="text-xl" icon="line-md:loading-loop" />
    </span>
  {/if}
  <span class={$delayed ? 'invisible' : ''}> {label} </span>
</button> -->
