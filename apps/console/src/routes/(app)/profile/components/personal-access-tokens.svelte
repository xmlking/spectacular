<script lang="ts">
import type { PersonalAccessTokensFragment } from '$houdini';
import { PendingValue, fragment, graphql } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { getNhostClient } from '$lib/stores/nhost';
import { popup } from '@skeletonlabs/skeleton';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DateTime } from '@spectacular/skeleton/components';
import { Alerts } from '@spectacular/skeleton/components/form';
import * as Table from '@spectacular/skeleton/components/table';
import { Logger } from '@spectacular/utils';
import { DataHandler } from '@vincjo/datatables';
import { formatDistance } from 'date-fns';
import { GraphQLError } from 'graphql';
import { Trash2 } from 'lucide-svelte';

// Variables
const log = new Logger('profile:pat:browser');
const toastStore = getToastStore();
const nhost = getNhostClient();
let message: App.Superforms.Message | undefined;
const errors: string[] = [];

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
// const handler = new DataHandler(personalAccessTokens, { rowsPerPage: 5 });
// const rows = handler.getRows();

// Functions
/**
 * PAT delete handler
 */
let isDeleting = false;
const deletePersonalAccessToken = graphql(`
    mutation DeletePersonalAccessToken($id: uuid!) {
      deleteAuthRefreshToken(id: $id) {
        ...Personal_Access_Tokens_remove @allLists
      }
    }
  `);

const handleDelete = async (id: string, name: string) => {
  // before
  isDeleting = true;
  // check if elevate is needed
  const error = await nhost.elevate();
  if (error) {
    errors.push(error.message);
    handleMessage(
      {
        message: `elevate action failed with error ${error.message} `,
        hideDismiss: false,
        timeout: 10000,
        type: 'error',
      },
      toastStore,
    );
    return;
  }

  try {
    const { data, errors: gqlErrors } = await deletePersonalAccessToken.mutate(
      { id },
      {
        metadata: { logResult: true, useRole: 'me' },
      },
    );
    if (gqlErrors) {
      message = { type: 'error', message: gqlErrors[0].message };
      // errors = [...errors, gqlErrors[0].message];
      handleMessage(
        {
          message: `Error deleteing PAT: ${name}, cause: ${gqlErrors[0].message} `,
          hideDismiss: false,
          timeout: 10000,
          type: 'error',
        },
        toastStore,
      );
      return;
    }
    if (data) {
      message = {
        message: `Deleted PAT: ${name}`,
        hideDismiss: true,
        timeout: 10000,
        type: 'success',
      };
      handleMessage(message, toastStore);
    } else {
      errors.push(`Cannot  delete PAT: ${name}. Data returned from mutation is falsey.`);
      handleMessage(
        {
          message: `Cannot  delete PAT: ${name}. Data returned from mutation is falsey.`,
          hideDismiss: true,
          timeout: 10000,
          type: 'error',
        },
        toastStore,
      );
    }
  } catch (err) {
    log.error(err);
    if (err instanceof GraphQLError) {
      errors.push(err.message);
    } else {
      throw err;
    }
  } finally {
    // after
    // No need to reset as securityKey disappear.
    isDeleting = false;
  }
};
</script>

<!-- Form Level Errors / Messages -->
<Alerts {errors} {message} />

<div class="card p-4">
  <div class="table-container">
    <table class="table table-hover table-compact w-full table-auto">
      <thead>
        <tr>
          <th>Name</th>
          <th>Created At</th>
          <th>Expires At</th>
           <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {#each personalAccessTokens as token}
          {#if token.id === PendingValue}
            <tr class="animate-pulse">
              <td><div class="placeholder" /></td>
              <td><div class="placeholder" /></td>
              <td><div class="placeholder" /></td>
              <td><div class="placeholder" /></td>
            </tr>
          {:else}
            <tr>
              <td>{token.name}</td>
              <td><DateTime time={token.createdAt}/></td>
              <td><DateTime time={token.expiresAt}/></td>
              <td>
                <button
                type="button"
                class="btn-icon btn-icon-sm variant-filled-error"
                on:click={() => {handleDelete(token.id, token.name) }}
                disabled={isDeleting}
                >
                  <Trash2 />
                </button>
            </td>
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
