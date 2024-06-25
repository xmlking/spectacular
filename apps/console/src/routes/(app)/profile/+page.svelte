<script lang="ts">
  import { page } from "$app/stores";
  import { Meta } from "$lib/components";
  import { nhost, user } from "$lib/stores/user";
  import type { AuthErrorPayload } from "@nhost/nhost-js";
  import { Avatar } from "@skeletonlabs/skeleton";
  import { Debug } from "@spectacular/skeleton/components";
  import type { PageData } from "./$houdini";
  import SecurityKeysCard from "./security-keys.svelte";
  import { ListBox, ListBoxItem } from "@skeletonlabs/skeleton";
  import { RemoveSecurityKeyStore } from "$houdini";

  const deleteStore = new RemoveSecurityKeyStore();

  // https://github.com/nhost/nhost/blob/main/examples/react-apollo/src/profile/security-keys.tsx
  export let data: PageData;

  $: ({ GetUser } = data);
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
  }

  async function handleElevate() {
    const email = $user?.email;
    if (email) {
      const { elevated, isError } =
        await nhost.auth.elevateEmailSecurityKey(email);
      if (elevated) {
        console.log({ elevated });
      }
      if (isError) {
        console.log({ isError });
      }
    }
  }

  async function handleDelete(id) {
    const { errors, data } = await deleteStore.mutate({ id });

    if (errors) {
      for (const error of errors) {
        console.log("Remove security key error", error);
      }
    }
  }

  // Reactivity
  $: meta = {
    title: "Datablocks | Profile",
    canonical: $page.url.toString(),
  };

  let valueSingle: string;
</script>

<Meta {...meta} />

<svelte:head>
  <title>Datablocks | Profile</title>
  <meta name="description" content="Account Profile" />
</svelte:head>

<div class="page-container">
  {#if $GetUser.fetching}
    <span>loading...</span>
  {:else}
    {#if error}
      <h3>Error:</h3>
      <section class="rounded-lg bg-slate-50">
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </section>
    {/if}

    <section class="rounded-lg bg-slate-50">
      <pre>{JSON.stringify($GetUser.data, null, 2)}</pre>
    </section>

    <section class="rounded-lg bg-slate-50">
      <SecurityKeysCard {securityKeys} />
    </section>
  {/if}

  <div class="page-section">
    <h2 class="h2">Profile</h2>
  </div>
  <h3 class="h3">WebAuthn</h3>
  <div class="card p-4">
    <title>Security keys</title>
  </div>

  {#if securityKeys.length > 0}
    <ListBox>
      {#each securityKeys as { id, nickname }}
        <ListBoxItem bind:group={valueSingle} name="medium" value={id}>
          {nickname}
          <svelte:fragment slot="trail">
            <button
              type="button"
              class="btn variant-filled"
              on:click={handleDelete(id)}
            >
              ❌
            </button>
          </svelte:fragment>
        </ListBoxItem>
      {/each}
    </ListBox>
  {/if}

  <form class="space-y-4" on:submit|preventDefault={addSecurityKey}>
    <input
      bind:value={nickname}
      placeholder="Nickname for the device (optional)"
      class="block w-full p-3 border rounded-md border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
    <button type="submit" class="btn variant-filled">
      Add a new authenticator
    </button>
  </form>

  <button type="button" class="btn variant-filled" on:click={handleElevate}>
    Elevate
  </button>

  <Debug data={$user} />
</div>
