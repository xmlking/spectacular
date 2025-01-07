<script lang="ts">
import { ArrowRight, MoreHorizontal, Plus, Search, Trash, UserCog } from 'lucide-svelte';
import { fade, slide } from 'svelte/transition';
import MemberForm from './MemberForm.svelte';
import { cn } from '@spectacular/skeleton/utils';

type Member = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'member';
  avatar: string;
};

// Members list state
let members: Member[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'owner',
    avatar: 'assets/avatars/01.png',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    avatar: 'assets/avatars/02.png',
  },
];

// State for showing add member form
let showAddForm = false;
// State for editing member
let editingMember: Member | null = null;
// State for showing member actions
let showActionsFor = '';
// Filter states
let searchQuery = '';
let selectedRole = 'all';

// Filtered members based on search and role
$: filteredMembers = members.filter((member) => {
  const matchesSearch =
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesRole = selectedRole === 'all' || member.role === selectedRole;
  return matchesSearch && matchesRole;
});

/** Handle add new member */
const handleAddMember = (event: CustomEvent<Member>) => {
  members = [...members, { ...event.detail, id: crypto.randomUUID() }];
  showAddForm = false;
};

/** Handle member role update */
const handleUpdateRole = (member: Member, newRole: Member['role']) => {
  members = members.map((m) => (m.id === member.id ? { ...m, role: newRole } : m));
  showActionsFor = '';
};

/** Handle member deletion */
const handleDeleteMember = (id: string) => {
  members = members.filter((m) => m.id !== id);
  showActionsFor = '';
};
</script>

<div class="w-full min-h-screen bg-gray-50 text-gray-900">
	<div class="max-w-5xl mx-auto p-6">
		<!-- Header -->
		<div class="flex items-center justify-between mb-8">
			<div>
				<h1 class="text-2xl font-bold text-gray-900">Team Members</h1>
				<p class="text-gray-500 mt-1">Manage your organization members and their roles.</p>
			</div>

			<button on:click={() => (showAddForm = true)} class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
				<Plus size={20} />
				Add Member
			</button>
		</div>

		<!-- Filter Section -->
		<div class="mb-6 flex flex-col sm:flex-row gap-4">
			<div class="flex-1 relative">
				<Search size={20} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
				<input type="text" bind:value={searchQuery} placeholder="Search by name or email..." class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
			</div>
			<select bind:value={selectedRole} class="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
				<option value="all">All Roles</option>
				<option value="owner">Owner</option>
				<option value="admin">Admin</option>
				<option value="member">Member</option>
			</select>
		</div>

		<!-- Members List -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200">
			<div class="divide-y divide-gray-200">
				{#each filteredMembers as member (member.id)}
					<div transition:slide class="p-4 flex items-center justify-between gap-4">
						<div class="flex items-center gap-3">
							<img src={member.avatar} alt={member.name} class="w-10 h-10 rounded-full" />
							<div>
								<h3 class="font-medium text-gray-900">{member.name}</h3>
								<p class="text-sm text-gray-500">{member.email}</p>
							</div>
						</div>

						<div class="flex items-center gap-3">
							<span class={cn("px-3 py-1 text-sm rounded-full", member.role === "owner" && "bg-purple-100 text-purple-700", member.role === "admin" && "bg-blue-100 text-blue-700", member.role === "member" && "bg-gray-100 text-gray-700")}>
								{member.role}
							</span>

							<div class="relative">
								<button on:click={() => (showActionsFor = showActionsFor === member.id ? "" : member.id)} class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
									<MoreHorizontal size={20} />
								</button>

								{#if showActionsFor === member.id}
									<div transition:fade class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
										<div class="px-2 py-1.5 text-sm text-gray-500">Change role to:</div>
										{#each ["owner", "admin", "member"] as role}
											{#if role !== member.role}
												<button on:click={() => handleUpdateRole(member, role)} class="w-full px-4 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
													<UserCog size={16} />
													{role}
												</button>
											{/if}
										{/each}
										<div class="h-px bg-gray-200 my-1" />
										<button on:click={() => handleDeleteMember(member.id)} class="w-full px-4 py-1.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
											<Trash size={16} />
											Remove member
										</button>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{:else}
					<div class="p-8 text-center text-gray-500">No members found matching your search criteria.</div>
				{/each}
			</div>
		</div>
	</div>
</div>

{#if showAddForm}
	<div transition:fade class="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
		<div transition:slide class="bg-white rounded-lg shadow-xl max-w-md w-full">
			<div class="p-4 border-b border-gray-200">
				<h2 class="text-lg font-semibold">Add New Member</h2>
			</div>

			<MemberForm on:submit={handleAddMember} on:cancel={() => (showAddForm = false)} />
		</div>
	</div>
{/if}
