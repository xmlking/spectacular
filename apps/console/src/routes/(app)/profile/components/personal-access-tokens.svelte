<script lang="ts">
import type { PersonalAccessTokensFragment } from '$houdini';
import { PendingValue, fragment, graphql } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { loaded } from '$lib/graphql/loading';
import { getNhostClient } from '$lib/stores/nhost';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DateTime } from '@spectacular/skeleton/components';
import { Alerts } from '@spectacular/skeleton/components/form';
import * as Table from '@spectacular/skeleton/components/table';
import { Logger } from '@spectacular/utils';
import { DataHandler } from '@vincjo/datatables/legacy';
import { GraphQLError } from 'graphql';
import { Trash2 } from 'lucide-svelte';
import type { MouseEventHandler } from 'svelte/elements';
import { deletePersonalAccessToken } from '../mutations';

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
const handler = new DataHandler(personalAccessTokens?.filter(loaded), { rowsPerPage: 5 });
$: handler.setRows(personalAccessTokens);
const rows = handler.getRows();

// Functions
/**
 * PAT delete handler
 */
let isDeleting = false;

const handleDelete: MouseEventHandler<HTMLButtonElement> = async (event) => {
  const { id, name } = event.currentTarget.dataset;
  if (!id || !name) {
    log.error('Misconfiguration: did you mess adding `data-id/data-name` attributes?');
    return;
  }
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
        metadata: { logResult: true, useRole: 'user' },
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
    if (err instanceof GraphQLError) {
      errors.push(err.message);
    } else {
      log.error(err);
      throw err;
    }
  } finally {
    // after
    isDeleting = false;
  }
};
</script>

<!-- Form Level Errors / Messages -->
<Alerts {errors} {message} />

<div class="card p-4">
  <div class="page-container p-0">
    <header class="flex justify-between">
      <Table.Search {handler} />
      <Table.RowsPerPage {handler} />
    </header>
    <table class="table table-hover table-compact w-full table-auto">
      <thead>
        <tr>
          <Table.Head {handler} orderBy="name">Name</Table.Head>
          <Table.Head {handler} orderBy="createdAt">Created At</Table.Head>
          <Table.Head {handler} orderBy="expiresAt">Expires At</Table.Head>
          <Table.Head {handler}>Delete</Table.Head>
        </tr>
      </thead>
      <tbody>
        <!-- {#each $rows as token, i (token.id)} -->
        {#each $rows as token, i}
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
              <td><DateTime distance time={token.createdAt}/></td>
              <td><DateTime distance time={token.expiresAt}/></td>
              <td>
                <button
                type="button"
                class="btn-icon btn-icon-sm variant-filled-error"
                data-id={token.id}
                data-name={token.name}
                on:click|stopPropagation|capture={handleDelete}
                disabled={isDeleting}
                >
                  <Trash2 />
                </button>
              </td>
            </tr>
          {/if}
        {:else}
          <tr>
            <td colspan="5"
              ><div class="text-center text-gray-500">
                No personal access tokens found.
              </div></td
            >
          </tr>
        {/each}
      </tbody>
    </table>
    <footer class="flex justify-between">
      <Table.RowCount {handler} />
      <Table.Pagination {handler} />
    </footer>
  </div>
</div>
