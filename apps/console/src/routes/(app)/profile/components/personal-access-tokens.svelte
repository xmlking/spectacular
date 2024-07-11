<script lang="ts">
import { invalidateAll } from '$app/navigation';
import type { PersonalAccessTokensFragment } from '$houdini';
import { DeletePATStore, fragment, graphql } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { popup } from '@skeletonlabs/skeleton';
import { getToastStore } from '@skeletonlabs/skeleton';
import * as Table from '@spectacular/skeleton/components/table';
import { DataHandler } from '@vincjo/datatables';
import { formatDistance } from 'date-fns';
import { Trash2 } from 'lucide-svelte';

export let user: PersonalAccessTokensFragment;
$: data = fragment(
  user,
  graphql(`
      fragment PersonalAccessTokensFragment on users {
        personalAccessTokens: refreshTokens(order_by: { expiresAt: asc }) @list(name: "Personal_Access_Tokens") @loading(cascade: true) {
          id
          name: metadata(path: "name")
          type
          expiresAt
          createdAt
          userId
        }
      }
    `),
);

$: ({ personalAccessTokens } = $data);
//variables
const toastStore = getToastStore();
const handler = new DataHandler(personalAccessTokens, { rowsPerPage: 5 });
const rows = handler.getRows();

const DeletePAT = new DeletePATStore();
// PAT delete function
async function del(patId: string) {
  const { errors, data } = await DeletePAT.mutate({ patId });
  if (errors) {
    console.log(errors.toString());
  }
  if (data?.deleteAuthRefreshToken?.id) {
    handleMessage(
      {
        message: `<p class="text-xl">Token: <span class="text-red-500 font-bold">${data?.deleteAuthRefreshToken?.metadata}</span> deleted</p>`,
        type: 'success',
      },
      toastStore,
    );
    await invalidateAll();
  }
}
</script>

<div class="card p-4">
  <div class="table-container">
    <table class="table table-hover table-compact w-full table-auto">
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

<pre> {JSON.stringify(personalAccessTokens, null, 2)}</pre>
