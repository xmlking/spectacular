<script lang="ts">
  interface Props {
    entityName: string;
  }

  let { entityName }: Props = $props();
</script>

<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
  <span class="uppercase">{entityName}</span> Not Found
</p>
