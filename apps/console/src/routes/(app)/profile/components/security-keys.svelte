<script lang="ts">
  import type { GetUser$result } from "$houdini";
  import { flip } from "svelte/animate";
  import { quintOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  import SecurityKeyItem from "./security-key.svelte";

  export const defaultDE = {
    duration: 450,
    easing: quintOut,
  };

  export let securityKeys: NonNullable<GetUser$result["user"]>["securityKeys"];
  export let message: App.Superforms.Message | undefined;
  export let errors: string[];
</script>

<div class="w-full text-token card p-4 space-y-4">
  <dl class="list-dl">
    {#each securityKeys as securityKey (securityKey.id)}
      <div transition:fade={defaultDE} animate:flip={defaultDE}>
        <SecurityKeyItem bind:message bind:errors {securityKey} />
      </div>
    {/each}
  </dl>
</div>
