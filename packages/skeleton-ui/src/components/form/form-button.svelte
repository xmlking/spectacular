<script lang="ts">
// biome-ignore lint/style/useImportType: <explanation>
import * as Button from '#components/button/index.js';

type $$Props = Button.Props;
type $$Events = Button.Events;
</script>

<Button.Root type="submit" on:click on:keydown {...$$restProps}>
	<slot />
</Button.Root>
