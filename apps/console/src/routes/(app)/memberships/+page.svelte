<script lang="ts">
  import {
    ArrowRight,
    MoreHorizontal,
    Plus,
    Search,
    Trash,
    UserCog,
  } from "lucide-svelte";
  import { DebugShell, GraphQLErrors } from "@spectacular/skeleton/components";
  import { fade, slide } from "svelte/transition";
  import { cn } from "@spectacular/skeleton/utils";
  import { DataHandler } from "@vincjo/datatables/legacy";
  import type { PageData } from "./$houdini";
  import SearchMembersResult from "./components/search-members-result.svelte";
  import MemberForm from "./components/MemberForm.svelte";
  export let data: PageData;

  // Reactivity
  let { Memberships } = data;
  $: ({ Memberships } = data);

  type Member = {
    id: string;
    name: string;
    email: string;
    role: "admin" | "owner" | "member";
    avatar: string;
  };
  // State for showing add member form
  let showAddForm = false;
  // State for editing member
  let editingMember: Member | null = null;
  // State for showing member actions
  let showActionsFor = "";
  // Filter states
  let searchQuery = "";
  let selectedRole = "all";
</script>

<div class="w-full min-h-screen text-gray-900">
  <div class="max-w-5xl mx-auto p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Team Members</h1>
        <p class="text-gray-500 mt-1">
          Manage your organization members and their roles.
        </p>
      </div>

      <button
        on:click={() => (showAddForm = true)}
        class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <Plus size={20} />
        Add Member
      </button>
    </div>

    <!-- Filter Section -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <div class="flex-1 relative">
        <Search
          size={20}
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search by name or email..."
          class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <select
        bind:value={selectedRole}
        class="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="all">All Roles</option>
        <option value="owner">Owner</option>
        <option value="admin">Admin</option>
        <option value="member">Member</option>
      </select>
    </div>

    <!-- Members List -->
    {#if $Memberships.errors}
      <GraphQLErrors errors={$Memberships.errors} />
    {:else if $Memberships.data}
      <SearchMembersResult data={$Memberships.data} />
    {/if}
  </div>
</div>

{#if showAddForm}
  <div
    transition:fade
    class="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
  >
    <div transition:slide class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold">Add New Member</h2>
      </div>
      {#if $Memberships.errors}
        <GraphQLErrors errors={$Memberships.errors} />
      {:else if $Memberships.data}
        <MemberForm on:cancel={() => (showAddForm = false)} />
      {/if}
    </div>
  </div>
{/if}
