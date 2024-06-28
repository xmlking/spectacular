<script lang="ts">
  import { nhost, elevate } from "$lib/stores/user";
  import { invalidateAll } from "$app/navigation";
  import { Trash } from "lucide-svelte";

  let securityKeys: {
    readonly nickname: string | null;
    readonly id: string;
  }[] = [];

  async function handleDelete(id: string) {
    const error = await elevate();
    if (error) {
      console.log(error);
      return;
    }
    const { data, error: removeError } = await nhost.graphql.request(
      "mutation RemoveSecurityKey($id: uuid!) {\r\n  deleteAuthUserSecurityKey(id: $id) {\r\n    id\r\n  }\r\n}",
      { id },
    );
    if (removeError) {
      console.log(error);
    }
    if (data) {
      console.log(data);
      await invalidateAll();
    }
  }
</script>

<ul class="list">
  {#each securityKeys as { id, nickname }}
    <li>
      <button
        type="button"
        class="btn-icon btn-icon-sm variant-filled"
        on:click={handleDelete(id)}
      >
        <Trash class="text-red-500 w-5 h-5" />
      </button>
      <span class="flex-auto">{nickname}</span>
    </li>
  {/each}
</ul>
