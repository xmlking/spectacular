<script lang="ts">
	import { TabGroup, TabAnchor } from '@skeletonlabs/skeleton';
	import { User2 } from 'lucide-svelte';
	import { page } from '$app/stores';
	import * as m from '$i18n/messages';
</script>

<div class="mx-auto flex max-w-md flex-col justify-center px-6 py-12 lg:px-8 lg:py-32">
	<div class="card p-6 pb-8 pt-8">
		<div>
			<div class="mb-4 flex flex-row items-center justify-center">
				<div>
					<User2 size={42} />
				</div>
			</div>
			<TabGroup justify="justify-center">
				<TabAnchor href="/auth/signin" selected={$page.url.pathname === '/auth/signin'}>
					<span>{m.auth_labels_signin()}</span>
				</TabAnchor>
				<TabAnchor href="/auth/signup" selected={$page.url.pathname === '/auth/signup'}>
					<span>{m.auth_labels_signup()}</span>
				</TabAnchor>
			</TabGroup>
			<slot />
		</div>
	</div>
</div>
