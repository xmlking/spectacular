<script lang="ts">
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import * as m from '$i18n/messages';

	export let data;
</script>

<form method="POST" action="/auth/sign-in">
	<div class="mt-6">
		<label class="label">
			<span class="sr-only">{m.auth_forms_email_label()}</span>
			<input
				id="email"
				name="email"
				type="email"
				placeholder={m.auth_forms_email_placeholder()}
				autocomplete="email"
				class="input"
			/>
		</label>
	</div>

	<div class="mt-6">
		<label class="label">
			<span class="sr-only">{m.auth_forms_password_label()}</span>
			<input
				id="password"
				name="password"
				type="password"
				placeholder={m.auth_forms_password_placeholder()}
				class="input"
			/>
		</label>
	</div>
	<div class="mt-6">
		<button type="submit" class="variant-filled-primary btn w-full"
			>{m.auth_labels_signin()}</button
		>
	</div>
	<div class="mt-10 flex flex-row items-center justify-center">
		<a href="/auth/password/reset" class="font-semibold">{m.auth_labels_forgot_password()}</a>
	</div>
</form>

<SuperDebug {data} />
