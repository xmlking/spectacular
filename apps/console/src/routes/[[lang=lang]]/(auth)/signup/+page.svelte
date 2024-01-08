<script lang="ts">
	import UserAuthForm from '$lib/components/auth/user-auth-form.svelte';
</script>

<section>
	<div class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
		<div
			class="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0"
		>
			<div class="space-y-4 p-6 sm:p-8 md:space-y-6">
				<!-- form-->
				<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div class="flex flex-col space-y-2 text-center">
						<h1 class="text-2xl font-semibold tracking-tight"> Create an Account </h1>
						<p class="text-sm text-gray-500">
							Enter your email below to create your account
						</p>
					</div>
					<UserAuthForm />
					<p class="text-muted-foreground px-8 text-center text-sm">
						By clicking continue, you agree to our{' '}
						<a href="/terms" class="hover:text-primary underline underline-offset-4">
							Terms of Service
						</a>{' '}
						and{' '}
						<a href="/privacy" class="hover:text-primary underline underline-offset-4">
							Privacy Policy
						</a>
						.
					</p>
					<!-- form End-->
				</div>
			</div>
		</div>
	</div>
</section>
