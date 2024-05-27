<script lang="ts">
import { handleMessage } from '$lib/components/layout/toast-manager';
// import {  MagicSpellTextarea } from '@spectacular/skeleton/components/magic-spell-textarea';
import { MagicSpellTextarea } from '$lib/components/magic-spell-textarea';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton/components';
import { Logger } from '@spectacular/utils';
import SuperDebug, { superForm } from 'sveltekit-superforms';

const log = new Logger('ai:ms:browser');
const toastStore = getToastStore();

export let data;
const {
    form,
    delayed,
    timeout,
    enhance,
    errors,
    constraints,
    message,
    tainted,
    posted,
    submitting,
    formId,
    capture,
    restore,
} = superForm(data.form, {
    id: 'ai-form',
    dataType: 'json',
    taintedMessage: null,
    syncFlashMessage: false,
    delayMs: 100,
    timeoutMs: 4000,
    onError({ result }) {
        // TODO:
        // message.set(result.error.message)
        log.error('ai error:', { result });
    },
    onUpdated({ form }) {
        if (form.message) {
            handleMessage(form.message, toastStore);
        }
    },
});
export const snapshot = { capture, restore };
</script>

<div class="page-container">
    <div class="page-section">
        <header class="flex justify-between">
            <h1 class="h1">Magic Spell</h1>
        </header>

        <form method="POST" use:enhance>
            <div class="flex flex-col space-y-4">
                <label class="label" for="commentOne">
                    <span>Comment One</span>
                    <MagicSpellTextarea
                        id="commentOne"
                        name="commentOne"
                        bind:value={$form.commentOne}
                        data-invalid={$errors.commentOne}
                        placeholder="It was a dark and stormy night..."
                        {...$constraints.commentOne}
                    />
                    {#if $errors.commentOne}
                        <small>{$errors.commentOne}</small>
                    {/if}
                </label>
                <label class="label" for="commentTwo">
                    <span>Comment Two</span>
                    <MagicSpellTextarea
                        id="commentTwo"
                        name="commentTwo"
                        bind:value={$form.commentTwo}
                        data-invalid={$errors.commentTwo}
                        placeholder="It was a dark and stormy night..."
                        {...$constraints.commentTwo}
                    />
                    {#if $errors.commentTwo}
                        <small>{$errors.commentTwo}</small>
                    {/if}
                </label>
                <button type="submit" class="variant-filled-primary btn w-full">submit</button>
            </div>
        </form>
    </div>
</div>

<DebugShell>
    <SuperDebug
        label="AI Miscellaneous"
        status={false}
        data={{
            message: $message,
            submitting: $submitting,
            delayed: $delayed,
            timeout: $timeout,
            posted: $posted,
        }}
    />
    <br />
    <SuperDebug label="AI Form" data={$form} />
    <br />
    <SuperDebug label="Tainted" status={false} data={$tainted} />
    <br />
    <SuperDebug label="Errors" status={false} data={$errors} />
    <br />
    <SuperDebug label="Constraints" status={false} data={$constraints} />
    <!-- <br />
 	<SuperDebug label="$page data" status={false} data={$page} /> -->
    <br />
    <SuperDebug
        label="AI Miscellaneous"
        status={false}
        data={{
            message: $message,
            submitting: $submitting,
            delayed: $delayed,
            timeout: $timeout,
            posted: $posted,
            formId: $formId,
        }}
    />
    <br />
    <SuperDebug label="AI Form" data={$form} />
    <br />
    <SuperDebug label="AI Tainted" status={false} data={$tainted} />
    <br />
    <SuperDebug label="AI Errors" status={false} data={$errors} />
    <br />
    <SuperDebug label="AI Constraints" status={false} data={$constraints} />
</DebugShell>
