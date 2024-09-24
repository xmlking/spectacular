<script lang="ts">
import { getChromeAI } from '$lib/components/smart/chrome-ai';
const chromeAI = getChromeAI();
</script>

{#if isAISupported && $assistantAvailability === 'readily'}
{/if}
