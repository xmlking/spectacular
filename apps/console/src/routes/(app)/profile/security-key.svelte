<script lang="ts">
import { RemoveSecurityKeyStore, fragment, graphql } from '$houdini';
import type { SecurityKey } from '$houdini';
import { Logger } from '@spectacular/utils';
import { fade } from 'svelte/transition';

const log = new Logger('auth:profile:browser');

let isDeleting = false;

export let securityKey: SecurityKey;

$: data = fragment(
  securityKey,
  graphql`
      fragment SecurityKey on authUserSecurityKeys {
        nickname
        id
      }
    `,
);

$: ({ id, nickname } = $data);

const deleteSecurityKey = new RemoveSecurityKeyStore();

const handleDelete = async () => {
  // before
  isDeleting = true;
  const { errors } = await deleteSecurityKey.mutate({ id });

  if (errors?.length) {
    log.error({ errors });
    // window.location.reload();
    return;
  }

  // after
  // No need to reset as comments disappear.
};
</script>

 <div class="relative">
    <div class="flex items-center">
      <p class="font-bold">{nickname}</p>
      <!-- <time class="ml-2 text-sm font-medium text-zinc-500" title={createdAt.toISO()}>
        {createdAt.toFormat('MM/dd/yyyy')}
      </time> -->
    </div>

    <div class="absolute bottom-0 right-0" transition:fade={{ duration: 75 }}>
      <button on:click={handleDelete} disabled={isDeleting}>Delete</button>
    </div>

  </div>
