<script lang="ts">
	import { Form } from "formsnap";
	import Page from '$lib/components/Page.svelte';
	import {contactFormSchema } from "./schema";
	export let data;
</script>

 <svelte:head>
	<title>Contact</title>
	<meta name="description" content="Contact Info" />
</svelte:head>

<Page>
	<header class="space-y-4">
		<h1 class="h1">Contact</h1>
		<!-- <p>Contact form.</p> -->
	</header>

	<Form.Root
		schema={contactFormSchema}
		form={data.form}
		debug={true}
		let:config
		class="container max-w-[750px] mx-auto flex flex-col gap-8"
	>
		<Form.Field {config} name="name">
			<div class="grid gap-2">
				<Form.Label>Name</Form.Label>
				<Form.Input class="input" placeholder="Your Name"/>
				<Form.Validation class="text-destructive" />
			</div>
		</Form.Field>
		<Form.Field {config} name="email">
			<div class="grid gap-2">
				<Form.Label>Email</Form.Label>
				<Form.Input class="input"  placeholder="your@email.com" />
				<Form.Validation class="text-destructive" />
			</div>
		</Form.Field>
		<Form.Field {config} name="subject">
			<div class="grid gap-2">
				<Form.Label>Subject</Form.Label>
				<Form.Input class="input" placeholder="Subject" />
				<Form.Validation class="text-destructive" />
			</div>
		</Form.Field>
		<Form.Field {config} name="message">
			<div class="grid gap-2">
				<Form.Label>Message</Form.Label>
				<Form.Textarea
					rows={4}
					class="textarea"
					placeholder="Insert your message here..."
				/>
				<Form.Validation class="text-destructive" />
			</div>
		</Form.Field>
		<button type="submit" class="btn variant-filled">Send</button>
	</Form.Root>
</Page>

<style lang="postcss">

</style>
