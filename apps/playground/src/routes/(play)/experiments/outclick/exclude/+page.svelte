<script lang="ts">
	import { OutClick } from '@spectacular/ui';
	import { count } from '../components/count.js';
</script>

<OutClick
	class="box bg-stripes-blue-400/10"
	on:outclick={() => $count++}
	excludeQuerySelectorAll="#nothing-happens"
>
	COMPONENT CONTENT
</OutClick>

<div id="nothing-happens" class="box bg-stripes-green-400/10"> NOTHING HAPPENS </div>
