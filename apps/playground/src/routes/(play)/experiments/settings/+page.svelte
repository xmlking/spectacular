<script lang="ts">
	import { Form } from 'formsnap';
	import Preview from '$lib/components/preview.svelte';
	import type { PageData } from './$types';
	import { someFormSchema } from './schema';
	export let data: PageData;
</script>

<svelte:head>
	<title>Settings</title>
	<meta name="description" content="Showcase formsnap" />
</svelte:head>

<Preview>
	<header class="space-y-4">
		<h1 class="h1">Settings</h1>
		<p>Showcase formsnap.</p>
	</header>

	<h1 class="pb-8 text-3xl font-semibold tracking-tight">Account Settings</h1>
	<Form.Root
		schema={someFormSchema}
		form={data.form}
		debug={true}
		let:config
		class="container mx-auto flex max-w-[750px] flex-col gap-8"
	>
		<Form.Field {config} name="email">
			<div class="grid gap-2">
				<Form.Label>Email</Form.Label>
				<Form.Input
					class="bg-background border-border text-foreground h-9 rounded border p-2"
				/>
				<Form.Validation class="text-destructive" />
			</div>
		</Form.Field>
		<Form.Field {config} name="username">
			<div class="grid gap-2">
				<Form.Label>Username</Form.Label>
				<Form.Input
					class="bg-background border-border text-foreground h-9 rounded border p-2"
				/>
				<Form.Validation class="text-destructive" />
			</div>
		</Form.Field>
		<Form.Field {config} name="bio">
			<div class="grid gap-2">
				<Form.Label>Bio</Form.Label>
				<Form.Textarea
					rows={4}
					class="bg-background border-border text-foreground resize-none rounded border p-2"
				/>
				<Form.Validation class="text-destructive" />
			</div>
		</Form.Field>
		<Form.Field {config} name="website">
			<div class="grid gap-2">
				<Form.Label>Website</Form.Label>
				<Form.Input
					class="bg-background border-border text-foreground h-9 rounded border p-2"
				/>
				<Form.Validation class="text-destructive" />
			</div>
		</Form.Field>
		<Form.Field {config} name="notifications">
			<div class="grid gap-2">
				<Form.Label>Notifications</Form.Label>
				<Form.Select
					class="bg-background border-border text-foreground h-9 rounded border p-2"
				>
					<option value="all">All</option>
					<option value="mentions">Mentions</option>
					<option value="none">None</option>
				</Form.Select>
				<Form.Validation class="text-destructive" />
			</div>
		</Form.Field>
		<Form.Field {config} name="language">
			<div class="grid gap-2">
				<Form.Label>Language</Form.Label>
				<Form.Select
					class="bg-background border-border text-foreground h-9 rounded border p-2"
				>
					<option value="en">English</option>
					<option value="es">Spanish</option>
					<option value="fr">French</option>
				</Form.Select>
				<Form.Validation class="text-destructive" />
			</div>
		</Form.Field>
		<Form.Field {config} name="usage">
			<div class="grid gap-2">
				<div class="flex items-center gap-4">
					<Form.Checkbox />
					<Form.Label>Send crash reports & statistics</Form.Label>
				</div>
				<Form.Validation class="text-destructive" />
			</div>
		</Form.Field>
		<Form.Field {config} name="theme">
			<div class="grid gap-2">
				<div class="flex items-center gap-4">
					<Form.Radio value="light" />
					<Form.Label>Light</Form.Label>
				</div>
				<Form.Validation class="text-destructive" />
			</div>
		</Form.Field>
		<Form.Field {config} name="theme">
			<div class="grid gap-2">
				<div class="flex items-center gap-4">
					<Form.Radio value="dark" />
					<Form.Label>Dark</Form.Label>
				</div>
				<Form.Validation class="text-destructive" />
			</div>
		</Form.Field>
		<button type="submit" class="variant-filled btn">Submit</button>
	</Form.Root>
</Preview>

<style lang="postcss">
</style>
