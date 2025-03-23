<script lang="ts">
  import { run } from 'svelte/legacy';

// TODO: https://github.com/metonym/svelte-time
import { format, formatDistance } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { onDestroy } from 'svelte';

  interface Props {
    time: Date;
    dateFormat?: string;
    distance?: boolean;
  }

  let { time, dateFormat = 'PPPP', distance = false }: Props = $props();

const title = format(time, 'dd. MMMM yyyy HH:mm:ss', { locale: enGB });
let text: string = $state();
const distanceText = () =>
  formatDistance(time, Date.now(), {
    addSuffix: true,
    includeSeconds: true,
  });
let interval: ReturnType<typeof setTimeout> | undefined = $state();
onDestroy(() => {
  if (interval) {
    clearInterval(interval);
  }
});
run(() => {
  if (distance) {
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    if (!interval) interval = setInterval(() => (text = distanceText()), 1000 * 60);
    text = distanceText();
  } else {
    if (interval) {
      clearInterval(interval);
      interval = undefined;
    }
    text = format(time, dateFormat, { locale: enGB });
  }
});
</script>

<time datetime={time.toTimeString()} {title}>
  {text}
</time>
