<script lang="ts">
  import { PendingValue, type Memberships$result, graphql } from "$houdini";
  import { handleMessage } from "$lib/components/layout/toast-manager";
  import { loaded } from "$lib/graphql/loading";
  import { getLoadingState } from "$lib/stores/loading";
  import { getToastStore } from "@skeletonlabs/skeleton";
  import { DateTime } from "@spectacular/skeleton/components";
  import * as Table from "@spectacular/skeleton/components/table";
  import { Logger, sleep } from "@spectacular/utils";
  import { invalidate } from "$app/navigation";
  import { DataHandler, type Row, check } from "@vincjo/datatables/legacy";
  import {
    Trash2,
    ArrowRight,
    MoreHorizontal,
    Plus,
    Search,
    Trash,
    UserCog,
  } from "lucide-svelte";
  import type { MouseEventHandler } from "svelte/elements";
  import { fade, slide } from "svelte/transition";
  import { cn } from "@spectacular/skeleton/utils";
  import { DeleteMembership, UpdateMembership } from "../mutations";
  import { getNhostClient } from "$lib/stores/nhost";
  import { ro } from "date-fns/locale";
  const log = new Logger("memberships:search-results:browser");
  // Variables
  export let data: Memberships$result;
  let { memberships } = data;
  $: ({ memberships } = data);
  const nhost = getNhostClient();
  const toastStore = getToastStore();
  const loadingState = getLoadingState();

  //Datatable handler initialization
  const handler = new DataHandler(memberships.filter(loaded), {
    rowsPerPage: 10,
  });
  $: handler.setRows(memberships);
  const rows = handler.getRows();

  // Functions
  /**
   * Delete Organization action
   */
  let isDeleting = false;

  const handleDelete: MouseEventHandler<HTMLButtonElement> = async (event) => {
    const { userId, dispalyName } = event.currentTarget.dataset;
    console.log(event.currentTarget.dataset);
    const orgId = nhost.auth.getHasuraClaims()?.["x-hasura-default-org"] || "";
    if (!userId) {
      log.error(
        "Misconfiguration: did you mess adding `data-user-id` attributes?",
      );
      return;
    }
    // before
    isDeleting = true;
    const { data, errors: gqlErrors } = await DeleteMembership.mutate({
      orgId,
      userId,
    });
    if (gqlErrors) {
      handleMessage(
        {
          message: `Error deleteing Membership : "${dispalyName}", cause: ${gqlErrors[0].message} `,
          hideDismiss: false,
          timeout: 10000,
          type: "error",
        },
        toastStore,
      );
      return;
    } else if (data?.delete_memberships_by_pk) {
      handleMessage(
        {
          message: `<p class="text-xl">Memebership : <span class="text-red-500 font-bold">${dispalyName}</span> deleted</p>`,
          hideDismiss: false,
          timeout: 1000,
          type: "success",
        },
        toastStore,
      );
    } else {
      handleMessage(
        {
          message: `Membership not found for : ${dispalyName}`,
          hideDismiss: false,
          timeout: 50000,
          type: "error",
        },
        toastStore,
      );
    }
    invalidate(() => true);
    // after
    isDeleting = false;
  };
  /**
   * Update MemberShip role action
   */

  const handleupdateRole: MouseEventHandler<HTMLButtonElement> = async (
    event,
  ) => {
    const { userId, role, dispalyName } = event.currentTarget.dataset;
    console.log(event.currentTarget.dataset);
    const orgId = nhost.auth.getHasuraClaims()?.["x-hasura-default-org"] || "";
    if (!userId) {
      log.error(
        "Misconfiguration: did you mess adding `data-user-id` attributes?",
      );
      return;
    }
    // before
    isDeleting = true;
    const { data, errors: gqlErrors } = await UpdateMembership.mutate({
      orgId,
      userId,
      data: { role },
    });
    if (gqlErrors) {
      handleMessage(
        {
          message: `Error while updating membership: "${dispalyName}", cause: ${gqlErrors[0].message} `,
          hideDismiss: false,
          timeout: 10000,
          type: "error",
        },
        toastStore,
      );
      return;
    } else if (data?.update_memberships_by_pk) {
      handleMessage(
        {
          message: `<p class="text-xl">Membership : <span class="text-red-500 font-bold">${dispalyName}</span> role successfully updated to <span class="text-red-500 font-bold">${role}</span></p>`,
          hideDismiss: false,
          timeout: 10000,
          type: "success",
        },
        toastStore,
      );
    } else {
      handleMessage(
        {
          message: `Membership not found for : ${dispalyName}`,
          hideDismiss: false,
          timeout: 50000,
          type: "error",
        },
        toastStore,
      );
    }
    // after
    isDeleting = false;
  };
  let showActionsFor: String = "";
  // Reactivity
  $: loadingState.setFormLoading(isDeleting);
</script>

<div class="bg-white rounded-lg shadow-sm border border-gray-200">
  <div class="divide-y divide-gray-200">
    {#each $rows as member (member.user.id)}
      <div transition:slide class="p-4 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <img
            src={member.user.avatarUrl}
            alt={member.user.displayName}
            class="w-10 h-10 rounded-full"
          />
          <div>
            <h3 class="font-medium text-gray-900">{member.user.displayName}</h3>
            <p class="text-sm text-gray-500">{member.user.email}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span
            class={cn(
              "px-3 py-1 text-sm rounded-full",
              member.role === "owner" && "bg-purple-100 text-purple-700",
              member.role === "admin" && "bg-blue-100 text-blue-700",
              member.role === "member" && "bg-gray-100 text-gray-700",
            )}
          >
            {member.role}
          </span>

          <div class="relative">
            <button
              on:click={() =>
                (showActionsFor =
                  showActionsFor === member.user.id ? "" : member.user.id)}
              class="btn hover:variant-ghost-success"
              disabled={member.role == "org:owner" ? true : false}
            >
              <MoreHorizontal size={20} />
            </button>

            {#if showActionsFor === member.user.id}
              <div
                transition:fade
                class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
              >
                <div class="px-2 py-1.5 text-sm text-gray-500">
                  Change role to:
                </div>
                {#each ["org:admin", "org:member"] as role}
                  {#if role !== member.role}
                    <button
                      class="w-full px-4 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      data-user-id={member.user.id}
                      data-role={role}
                      data-dispaly-name={member.user.displayName}
                      on:click|stopPropagation|capture={handleupdateRole}
                    >
                      <UserCog size={16} />
                      {role}
                    </button>
                  {/if}
                {/each}
                <div class="h-px bg-gray-200 my-1" />
                <button
                  class="w-full px-4 py-1.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  data-user-id={member.user.id}
                  data-dispaly-name={member.user.displayName}
                  on:click|stopPropagation|capture={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash size={16} />
                  Remove member
                </button>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <div class="p-8 text-center text-gray-500">
        No members found matching your search criteria.
      </div>
    {/each}
  </div>
</div>
