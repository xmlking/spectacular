<script lang="ts">
	import * as Button from '@spectacular/ui/components/button';
	import { DashboardPage } from '$lib/components/dashboard';

	type $$Props = Button.Props;
	type $$Events = Button.Events;
</script>

<DashboardPage />
<Button.Root type="submit" on:click on:keydown {...$$restProps}>Test</Button.Root>
