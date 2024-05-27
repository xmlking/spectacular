<script lang="ts">
import { OutClick } from '@spectacular/skeleton/components';
import { count } from '../components/count.js';
</script>

<OutClick class="box bg-stripes-blue-400/10" halfClick={true} on:outclick={() => $count++}>
    COMPONENT CONTENT
</OutClick>
