<script lang="ts">
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import LL from '$lib/i18n/i18n-svelte';
	export let data;

	let termsAccept = false;
	// $: termsValue = $form.terms as Writable<boolean>;
</script>

<form method="POST" action="/auth/sign-up">
	<!--<SuperDebug data={$form} />-->
	<div class="mt-6">
		<label class="label">
			<span class="sr-only">{$LL.auth.forms.firstName.label()}</span>
			<input
				id="firstName"
				name="firstName"
				type="text"
				placeholder={$LL.auth.forms.firstName.placeholder()}
				autocomplete="given-name"
				class="input"
			/>
		</label>
	</div>
	<div class="mt-6">
		<label class="label">
			<span class="sr-only">>{$LL.auth.forms.lastName.label()}</span>
			<input
				id="lastName"
				name="lastName"
				type="text"
				placeholder={$LL.auth.forms.lastName.placeholder()}
				autocomplete="family-name"
				class="input"
			/>
		</label>
	</div>
	<div class="mt-6">
		<label class="label">
			<span class="sr-only">{$LL.auth.forms.email.label()}</span>
			<input
				id="email"
				name="email"
				type="email"
				placeholder={$LL.auth.forms.email.placeholder()}
				autocomplete="email"
				class="input"
			/>
		</label>
	</div>

	<div class="mt-6">
		<label class="label">
			<span class="sr-only">{$LL.auth.forms.password.label()}</span>
			<input
				id="password"
				name="password"
				type="password"
				placeholder={$LL.auth.forms.password.placeholder()}
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
			>{$LL.auth.labels.signup()}</button
		>
	</div>
</form>
<SuperDebug {data} />
