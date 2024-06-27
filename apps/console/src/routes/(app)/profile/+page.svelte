<script lang="ts">
  import { page } from "$app/stores";
  import { Meta } from "$lib/components";
  import { nhost, user, elevate } from "$lib/stores/user";
  import type { AuthErrorPayload } from "@nhost/nhost-js";
  import type { PageData } from "./$houdini";
  import { invalidateAll } from "$app/navigation";
  import AddSecurityKeyForm from "./AddSecurityKeyForm.svelte";
  import { Trash } from "lucide-svelte";

  // https://github.com/nhost/nhost/blob/main/examples/react-apollo/src/profile/security-keys.tsx
  export let data: PageData;

  $: ({ GetUser } = data);
  // $: userOrgRoles = $GetUser.data?.user?.userOrgRoles ?? [];
  // $: userProviders = $GetUser.data?.user?.userProviders ?? [];
  // $: personalAccessTokens = $GetUser.data?.user?.personalAccessTokens ?? [];
  $: securityKeys = $GetUser.data?.user?.securityKeys ?? [];

  // Variables
  let nickname: string;
  let error: AuthErrorPayload | null;
  async function handleAdd() {
    console.log({ nickname });
    const { key, error: addKeyError } =
      await nhost.auth.addSecurityKey(nickname);

    if (error) {
      console.log(error);
      error = addKeyError;
      return;
    }
    await invalidateAll();
  }

  async function handleElevate() {
    error = await elevate();
    if (!error) {
      // TODO notify
      console.log("elevated successfully");
    }
  }

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

  // Reactivity
  $: meta = {
    title: "Datablocks | Profile",
    canonical: $page.url.toString(),
  };
</script>

<Meta {...meta} />
<svelte:head>
  <title>Datablocks | Profile</title>
  <meta name="description" content="Edit Profile" />
</svelte:head>

{#if $GetUser.fetching}
  <span>loading...</span>
{:else}
  <div class="page-container">
    <h1 class="h1">Profile</h1>
    <h2 class="h2">Security Keys</h2>

    <AddSecurityKeyForm data={data.addSecurityKeyForm} />

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
  </div>
{/if}
