<script lang="ts">
import { DashboardPage } from '$lib/components/dashboard';
import type * as Button from '@spectacular/ui/components/button';

type $$Props = Button.Props;
type $$Events = Button.Events;
</script>

<DashboardPage />
<Button.Root type="submit" on:click on:keydown {...$$restProps}>Test</Button.Root>
