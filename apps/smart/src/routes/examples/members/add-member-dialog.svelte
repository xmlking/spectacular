<script lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger } from '@spectacular/ui/components/select';
import { X } from '@lucide/svelte';
import { fade } from 'svelte/transition';

// Available roles for new member
const roles = ['owner', 'admin', 'member'];

// Component props with default values
let { onClose = () => {}, onAdd = (member: any) => {} } = $props();

// Form data using $state
let name = $state('');
let selectedRole = $state('member');

/** Handle form submission */
const handleSubmit = (e: SubmitEvent) => {
  e.preventDefault();
  if (name.trim()) {
    onAdd({
      name,
      role: selectedRole,
      avatar: '$assets/ui-user.png',
    });
  }
};
</script>

<div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4" transition:fade>
	<div class="bg-card w-full max-w-md rounded-lg shadow-lg p-6" transition:fade={{ delay: 150 }}>
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-xl font-semibold">Add New Member</h2>
			<button onclick={onClose} class="p-2 hover:bg-accent rounded-md transition-colors">
				<X class="w-4 h-4" />
			</button>
		</div>

		<form onsubmit={handleSubmit} class="space-y-4">
			<div class="space-y-2">
				<label for="name" class="text-sm font-medium">Name</label>
				<input type="text" id="name" bind:value={name} placeholder="Enter member name" class="w-full px-3 py-2 rounded-md border bg-background" required />
			</div>

			<div class="space-y-2">
				<label for="role" class="text-sm font-medium">Role</label>
				<!-- Fixed select value binding -->
				<Select defaultValue={selectedRole} onValueChange={(value) => (selectedRole = value)}>
					<SelectTrigger>
            {selectedRole ??  "Select role"}
						<!-- <SelectValue placeholder="Select role" /> -->
					</SelectTrigger>
					<SelectContent>
						{#each roles as roleOption}
							<SelectItem value={roleOption}>
								{roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
							</SelectItem>
						{/each}
					</SelectContent>
				</Select>
			</div>

			<div class="flex justify-end gap-3 mt-6">
				<button type="button" onclick={onClose} class="px-4 py-2 border rounded-md hover:bg-accent transition-colors">Cancel</button>
				<button type="submit" class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">Add Member</button>
			</div>
		</form>
	</div>
</div>
