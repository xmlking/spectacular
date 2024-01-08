<script lang="ts">
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import * as m from '$i18n/messages';
	export let data;

	let termsAccept = false;
	// $: termsValue = $form.terms as Writable<boolean>;
</script>

<form method="POST" action="/auth/sign-up">
	<!--<SuperDebug data={$form} />-->
	<div class="mt-6">
		<label class="label">
			<span class="sr-only">{m.auth_forms_first_name_label()}</span>
			<input
				id="firstName"
				name="firstName"
				type="text"
				placeholder={m.auth_forms_first_name_placeholder()}
				autocomplete="given-name"
				class="input"
			/>
		</label>
	</div>
	<div class="mt-6">
		<label class="label">
			<span class="sr-only">{m.auth_forms_last_name_label()}</span>
			<input
				id="lastName"
				name="lastName"
				type="text"
				placeholder={m.auth_forms_last_name_placeholder()}
				autocomplete="family-name"
				class="input"
			/>
		</label>
	</div>
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
		<label for="terms" class="label">
			<input
				id="terms"
				name="terms"
				type="checkbox"
				class="checkbox"
				bind:checked={termsAccept}
			/>
			<span class="ml-2">
				I accept the
				<a href="/terms" class="text-primaryHover underline">terms</a>
				and
				<a href="/privacy" class="text-primaryHover underline">privacy policy</a>
			</span>
		</label>
	</div>
	<div class="mt-6">
		<button type="submit" disabled={!termsAccept} class="variant-filled-primary btn w-full"
			>{m.auth_labels_signup()}</button
		>
	</div>
</form>
<SuperDebug {data} />
