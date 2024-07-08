<script lang="ts">
import { PendingValue, type PersonalAccessTokensFragment, fragment, graphql } from '$houdini';

export let user: PersonalAccessTokensFragment;
$: data = fragment(
  user,
  graphql(`
      fragment PersonalAccessTokensFragment on users {
        personalAccessTokens: refreshTokens(order_by: { id: asc }) @list(name: "Personal_Access_Tokens") @loading {
          id
          metadata(path: ".name")
        }
      }
  `),
);
$: personalAccessTokens = $data.personalAccessTokens;
</script>

<div class="card p-4">
  <div class="table-container">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>#</th>
          <th>Id</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {#each personalAccessTokens as token, i}
          {#if token === PendingValue}
            <tr class="animate-pulse">
              <td><div class="placeholder" /></td>
              <td><div class="placeholder" /></td>
              <td><div class="placeholder" /></td>
            </tr>
          {:else}
            <tr>
              <td>{i}</td>
              <td>{token.id}</td>
              <td>{token.metadata}</td>
            </tr>
          {/if}
        {:else}
          <tr>
            <td colspan="3"
              ><div class="text-center text-gray-500">
                No personal access tokens found.
              </div></td
            >
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
