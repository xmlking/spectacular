<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
    [key: string]: any
  }

  let { ...props }: Props = $props();
// Classes
const cBase = 'page-container';

// Reactive
let classesBase = $derived(`${cBase} ${props.class ?? ''}`);
</script>

<div class={classesBase}>
  <!-- Content -->
  {@render props.children?.()}
</div>
