<script lang="ts">
  import {
    fragment,
    graphql,
    PendingValue,
    type AuthProvidersFragment,
  } from "$houdini";

  export let user: AuthProvidersFragment;
  $: data = fragment(user, graphql(`
      fragment AuthProvidersFragment on users {
        providers: userProviders(order_by: { providerId: asc }) @list(name: "Auth_Providers") @loading {
          id
          providerId
          providerUserId
          updatedAt
        }
      }
  `));
  $: providers = $data.providers;
</script>

<div class="card p-4">
  <div class="table-container">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Id</th>
          <th>providerId</th>
          <th>providerUserId</th>
          <th>updatedAt</th>
        </tr>
      </thead>
      <tbody>
        {#each providers as provider, i}
          {#if provider === PendingValue}
            <tr class="animate-pulse">
              <td><div class="placeholder" /></td>
              <td><div class="placeholder" /></td>
              <td><div class="placeholder" /></td>
              <td><div class="placeholder" /></td>
            </tr>
          {:else}
            <tr>
              <td>{provider.id}</td>
              <td>{provider.providerId}</td>
              <td>{provider.providerUserId}</td>
              <td>{provider.updatedAt}</td>
            </tr>
          {/if}
        {:else}
          <tr>
            <td colspan="4"
              ><div class="text-center text-gray-500">
                No org roles found.
              </div></td
            >
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

