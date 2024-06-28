<script lang="ts">
  import { page } from "$app/stores";
  import { Meta } from "$lib/components";
  import { nhost, user, elevate } from "$lib/stores/user";
  import type { AuthErrorPayload } from "@nhost/nhost-js";
  import type { PageData } from "./$houdini";
  import { invalidateAll } from "$app/navigation";
  import AddSecurityKeyForm from "./AddSecurityKeyForm.svelte";
  import { Trash } from "lucide-svelte";
  import SecurityKeyList from "./SecurityKeyList.svelte";

  // https://github.com/nhost/nhost/blob/main/examples/react-apollo/src/profile/security-keys.tsx
  export let data: PageData;

  $: ({ GetUser } = data);
  // $: userOrgRoles = $GetUser.data?.user?.userOrgRoles ?? [];
  // $: userProviders = $GetUser.data?.user?.userProviders ?? [];
  // $: personalAccessTokens = $GetUser.data?.user?.personalAccessTokens ?? [];
  $: securityKeys = $GetUser.data?.user?.securityKeys ?? [];

  // Variables

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
    <SecurityKeyList {securityKeys} />
  </div>
{/if}
