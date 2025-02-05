<script lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger } from '@spectacular/ui/components/select';
import { Trash2 } from 'lucide-svelte';
import { slide } from 'svelte/transition';

// Available roles for members
const roles = ['owner', 'admin', 'member'];

// Component props using proper svelte 5 syntax
let { members = [], onDelete = (id: number) => {}, onUpdateRole = (id: number, role: string) => {} } = $props();
</script>

<div class="space-y-4">
	{#each members as member (member.id)}
		<div class="flex items-center justify-between p-4 bg-card rounded-lg border" transition:slide>
			<div class="flex items-center gap-4">
				<img src={member.avatar} alt={member.name} class="w-10 h-10 rounded-full object-cover" />
				<div>
					<h3 class="font-medium">{member.name}</h3>
					<p class="text-sm text-muted-foreground">
						{member.role.charAt(0).toUpperCase() + member.role.slice(1)}
					</p>
				</div>
			</div>

			<div class="flex items-center gap-4">
				<!-- Fixed select value binding -->
				<Select defaultValue={member.role} onValueChange={(value) => onUpdateRole(member.id, value)}>
					<SelectTrigger class="w-32">
             {member.role ??  "Select role"}
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

				<button onclick={() => onDelete(member.id)} class="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors">
					<Trash2 class="w-4 h-4" />
				</button>
			</div>
		</div>
	{/each}
</div>
