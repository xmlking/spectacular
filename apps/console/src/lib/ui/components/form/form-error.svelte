<script lang="ts">
import { cn } from '$lib/ui/utils';
  interface Props {
    error: string | undefined;
    [key: string]: any
  }

  let { ...props }: Props = $props();
</script>

{#if props.error}
  <p {...props} class={cn('mt-2 text-xs font-normal text-red-700 dark:text-red-500', props.class)}>
    <span class="font-medium">Oh, snapp!</span>
    {props.error}
  </p>
{/if}
