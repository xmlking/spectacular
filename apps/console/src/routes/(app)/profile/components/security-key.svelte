<script lang="ts">
import { PendingValue, type SecurityKeyFragment, cache, fragment, graphql, isPending } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { getNhostClient } from '$lib/stores/nhost';
import { getToastStore } from '@skeletonlabs/skeleton';
import { Logger } from '@spectacular/utils';
import { GraphQLError } from 'graphql';
import { KeyRound, Trash } from 'lucide-svelte';
import { fade } from 'svelte/transition';

export let message: App.Superforms.Message | undefined;
export let errors: string[];

// Variables
const log = new Logger('auth:profile:skey:browser');
const toastStore = getToastStore();
const nhost = getNhostClient();

export let securityKey: SecurityKeyFragment;
$: data = fragment(
  securityKey,
  graphql(`
    fragment SecurityKeyFragment on authUserSecurityKeys {
      id
      nickname
    }
  `),
);

$: ({ id, nickname } = $data);

//  $: loading = $securityKeyFragment.__typename === PendingValue;

/**
 * delete handler
 */
let isDeleting = false;
const deleteSecurityKey = graphql(`
  mutation RemoveSecurityKey($id: uuid!) {
    deleteAuthUserSecurityKey(id: $id) {
      ...Security_Keys_remove
    }
  }
`);

const handleDelete = async () => {
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
    const { data, errors: gqlErrors } = await deleteSecurityKey.mutate(
      { id },
      {
        metadata: { logResult: true, useRole: 'me' },
      },
    );
    if (gqlErrors) {
      errors.push(gqlErrors[0].message);
      handleMessage(
        {
          message: `Error deleteing security key: ${nickname}, cause: ${gqlErrors[0].message} `,
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
        message: `Deleted security key: ${nickname}`,
        hideDismiss: true,
        timeout: 10000,
        type: 'success',
      };
      handleMessage(message, toastStore);
    } else {
      errors.push(`Cannot  delete security key: ${nickname}. Data returned from mutation is falsey.`);
      handleMessage(
        {
          message: `Cannot  delete security key: ${nickname}. Data returned from mutation is falsey.`,
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
{#if $data ===  PendingValue}
<!-- {#if isPending(nickname)} -->
<div class="placeholder animate-pulse" />
{/if}


<span class="badge-icon variant-soft-secondary"><KeyRound /></span>
<span class="flex-auto">
  <dt class="font-bold">{nickname}</dt>
  <dd class="text-sm opacity-50">key for {id}</dd>
</span>
<span transition:fade={{ duration: 75 }}>
  <button
    type="button"
    class="btn-icon btn-icon-sm variant-filled-error"
    on:click={handleDelete}
    disabled={isDeleting}
  >
    <Trash />
  </button>
</span>

<!-- opacity-80 transition-opacity duration-50 hover:opacity-100 -->
