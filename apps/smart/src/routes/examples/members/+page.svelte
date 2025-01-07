<script lang="ts">
	import { Search, Plus, Trash2 } from "lucide-svelte";
	import MemberList from "./MemberList.svelte";
	import AddMemberDialog from "./AddMemberDialog.svelte";
	import { fade } from "svelte/transition";

	// Search query for filtering members
	let searchQuery = $state("");

	// Show/hide add member dialog
	let showAddDialog = $state(false);

	// Members list with their information
	let members = $state([
		{ id: 1, name: "John Doe", role: "owner", avatar: "$assets/ui-user.png" },
		{ id: 2, name: "Jane Smith", role: "admin", avatar: "$assets/ui-user.png" },
		{ id: 3, name: "Mike Johnson", role: "member", avatar: "$assets/ui-user.png" },
	]);

	// Filter members based on search query
	const filteredMembers = $derived(members.filter((member) => member.name.toLowerCase().includes(searchQuery.toLowerCase())));

	/** Handle member deletion */
	const handleDeleteMember = (id: number) => {
		members = members.filter((member) => member.id !== id);
	};

	/** Handle adding new member */
	const handleAddMember = (member: any) => {
		members = [...members, { ...member, id: members.length + 1 }];
		showAddDialog = false;
	};

	/** Handle role update */
	const handleUpdateRole = (id: number, newRole: string) => {
		members = members.map((member) => (member.id === id ? { ...member, role: newRole } : member));
	};
</script>

<div class="w-full min-h-screen bg-background text-foreground p-6">
	<div class="max-w-4xl mx-auto space-y-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold tracking-tight">Organization Members</h1>
			<button class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors" onclick={() => (showAddDialog = true)}>
				<Plus class="w-4 h-4" />
				Add Member
			</button>
		</div>

		<!-- Search -->
		<div class="relative">
			<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
			<input type="text" bind:value={searchQuery} placeholder="Search members..." class="w-full pl-10 pr-4 py-2 rounded-md border bg-background" />
		</div>

		<!-- Members List -->
		{#if filteredMembers.length > 0}
			<div transition:fade>
				<MemberList members={filteredMembers} onDelete={handleDeleteMember} onUpdateRole={handleUpdateRole} />
			</div>
		{:else}
			<div class="text-center py-12 text-muted-foreground" transition:fade>No members found</div>
		{/if}
	</div>

	<!-- Add Member Dialog -->
	{#if showAddDialog}
		<AddMemberDialog onClose={() => (showAddDialog = false)} onAdd={handleAddMember} />
	{/if}
</div>
