<script lang="ts">
// TODO: https://github.com/metonym/svelte-time
import { format, formatDistance } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { onDestroy } from 'svelte';

export let time: Date;
export let dateFormat = 'PPPP';
export let distance = false;

const title = format(time, 'dd. MMMM yyyy HH:mm:ss', { locale: enGB });
let text: string;
const distanceText = () =>
  formatDistance(time, Date.now(), {
    addSuffix: true,
    includeSeconds: true,
  });
let interval: ReturnType<typeof setTimeout> | undefined;
onDestroy(() => {
  if (interval) {
    clearInterval(interval);
  }
});
$: {
  if (distance) {
    // biome-ignore lint/suspicious/noAssignInExpressions: <ok>
    if (!interval) interval = setInterval(() => (text = distanceText()), 1000 * 60);
    text = distanceText();
  } else {
    if (interval) {
      clearInterval(interval);
      interval = undefined;
    }
    text = format(time, dateFormat, { locale: enGB });
  }
}
</script>

<time datetime={time.toTimeString()} {title}>
  {text}
</time>
