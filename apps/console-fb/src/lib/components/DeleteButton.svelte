<script lang="ts" context="module">
export interface CustomEventProps {
  [key: string]: any;
  id: string | null;
}
</script>

<script lang="ts">
import { ArchiveOutline } from 'flowbite-svelte-icons';
import { createEventDispatcher } from 'svelte';

export let id: string;

const dispatch = createEventDispatcher();
const handleDeleteButton = () => {
  const props: CustomEventProps = { id };
  dispatch('delete', props);
};
</script>

<button on:click={handleDeleteButton}>
  <ArchiveOutline class="text-pink-700 dark:text-blue-300" />
</button>
<!-- For Debug -->
<slot />
