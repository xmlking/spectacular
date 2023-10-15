<script lang="ts">
  import { Form } from "formsnap";
  import Page from '$lib/components/layout/Page.svelte';
  import type { PageData } from "./$types";
  import {someFormSchema } from "./schema";
  export let data: PageData;
</script>

<svelte:head>
	<title>Settings</title>
	<meta name="description" content="Showcase formsnap" />
</svelte:head>

<Page>
	<header class="space-y-4">
		<h1 class="h1">Settings</h1>
		<p>Showcase formsnap.</p>
	</header>

	<h1 class="text-3xl font-semibold tracking-tight pb-8">Account Settings</h1>
	<Form.Root
		schema={someFormSchema}
		form={data.form}
		debug={true}
		let:config
		class="container max-w-[750px] mx-auto flex flex-col gap-8"
	>
		<Form.Field {config} name="email">
			<div class="grid gap-2">
				<Form.Label>Email</Form.Label>
				<Form.Input class="rounded bg-background border border-border h-9 text-foreground p-2" />
				<Form.Validation class="text-destructive" />
			</div>
		</Form.Field>
		<Form.Field {config} name="username">
			<div class="grid gap-2">
				<Form.Label>Username</Form.Label>
				<Form.Input class="rounded bg-background border border-border h-9 text-foreground p-2" />
				<Form.Validation class="text-destructive" />
			</div>
		</Form.Field>
		<Form.Field {config} name="bio">
			<div class="grid gap-2">
				<Form.Label>Bio</Form.Label>
				<Form.Textarea
					rows={4}
					class="resize-none rounded bg-background border border-border text-foreground p-2"
				/>
				<Form.Validation class="text-destructive" />
			</div>
		</Form.Field>
		<Form.Field {config} name="website">
			<div class="grid gap-2">
				<Form.Label>Website</Form.Label>
				<Form.Input class="rounded bg-background border border-border h-9 text-foreground p-2" />
				<Form.Validation class="text-destructive" />
			</div>
		</Form.Field>
		<Form.Field {config} name="notifications">
			<div class="grid gap-2">
				<Form.Label>Notifications</Form.Label>
				<Form.Select class="rounded bg-background border border-border h-9 text-foreground p-2">
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
				<Form.Select class="rounded bg-background border border-border h-9 text-foreground p-2">
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
		<button type="submit" class="btn variant-filled">Submit</button>
	</Form.Root>
</Page>

<style lang="postcss">

</style>