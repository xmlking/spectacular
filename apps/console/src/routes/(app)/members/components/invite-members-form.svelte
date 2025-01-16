<script lang="ts">
import { getLoadingState } from '$lib/stores/loading';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton';
import { Alerts } from '@spectacular/skeleton/components/form';
import { Logger } from '@spectacular/utils';
import * as Form from 'formsnap';
import { Loader, LoaderCircle, MoreHorizontal } from 'lucide-svelte';
import SuperDebug, { type ErrorStatus, defaults, setError, setMessage, superForm } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

// Variables
const log = new Logger('memberships:invite:form:browser');
const toastStore = getToastStore();
const loadingState = getLoadingState();
</script>

<!-- Form Level Errors / Messages -->
<!-- <Alerts errors={$errors._errors} message={$message} /> -->
<!-- Form -->
<div class="card p-4">
	<header class="card-header">(header)</header>
	<section class="p-4">Invite new members by email address</section>
	<footer class="card-footer">(footer)</footer>
</div>
