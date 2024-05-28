<script lang="ts">
import Preview from '$lib/components/preview.svelte';
import { DebugShell } from '@spectacular/skeleton/components';
import { Control, Description, Field, FieldErrors, Fieldset, Label, Legend } from 'formsnap';
import SuperDebug, { superForm } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';
import { allergies, schema, themes } from './schema.js';

export let data;

const form = superForm(data.form, {
  validators: zodClient(schema),
});
const {
  form: formData,
  message,
  errors,
  tainted,
  isTainted,
  submitting,
  delayed,
  timeout,
  posted,
  constraints,
  enhance,
} = form;
</script>

<svelte:head>
  <title>Settings</title>
  <meta name="description" content="Showcase formsnap" />
</svelte:head>

<Preview>
  <header class="space-y-4">
    <h1 class="h1">Settings</h1>
    <p>Showcase formsnap.</p>
  </header>

  <h1 class="pb-8 text-3xl font-semibold tracking-tight">Account Settings</h1>
  <form method="POST" class="container mx-auto flex max-w-[750px] flex-col gap-8" use:enhance>
    <Field {form} name="email">
      <Control let:attrs>
        <div class="grid gap-2">
          <Label>Email</Label>
          <input {...attrs} type="email" class="data-fs-[error=true]:input-error" bind:value={$formData.email} />
          <Description class="sr-only">Company email is preferred</Description>
          <FieldErrors class="data-fs-[error=true]:bg-red-200" />
        </div>
      </Control>
    </Field>
    <Field {form} name="bio">
      <Control let:attrs>
        <div class="grid gap-2">
          <Label>Bio</Label>
          <textarea rows={4} {...attrs} bind:value={$formData.bio} />
        </div>
      </Control>
      <Description class="sr-only">Tell us a bit about yourself.</Description>
      <FieldErrors />
    </Field>
    <Field {form} name="language">
      <Control let:attrs>
        <div class="grid gap-2">
          <Label>Language</Label>
          <select {...attrs} bind:value={$formData.language}>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="en">English</option>
          </select>
        </div>
      </Control>
      <Description class="sr-only">Help us address you properly.</Description>
      <FieldErrors />
    </Field>
    <Fieldset {form} name="theme">
      <Legend>Select your theme</Legend>
      {#each themes as theme}
        <Control let:attrs>
          <div class="flex items-center space-x-2">
            <Label>{theme}</Label>
            <input {...attrs} type="radio" value={theme} bind:group={$formData.theme} />
          </div>
        </Control>
      {/each}
      <Description class="sr-only">We prefer dark mode, but the choice is yours.</Description>
      <FieldErrors />
    </Fieldset>
    <Field {form} name="marketingEmails">
      <Control let:attrs>
        <div class="flex items-center gap-4">
          <input {...attrs} type="checkbox" bind:checked={$formData.marketingEmails} />
          <Label>I want to receive marketing emails</Label>
        </div>
      </Control>
      <Description class="sr-only">Stay up to date with our latest news and offers.</Description>
      <FieldErrors />
    </Field>
    <Fieldset {form} name="allergies">
      <Legend>Food allergies</Legend>
      <div class="flex items-center gap-4">
        {#each allergies as allergy}
          <Control let:attrs>
            <input {...attrs} type="checkbox" bind:group={$formData.allergies} value={allergy} />
            <Label>{allergy}</Label>
          </Control>
        {/each}
      </div>
      <Description class="sr-only">When we provide lunch, we'll accommodate your needs.</Description>
      <FieldErrors />
    </Fieldset>
    <button type="submit" class="variant-filled btn">Submit</button>
  </form>
  <DebugShell>
    <SuperDebug
      label="Miscellaneous"
      status={false}
      data={{
        message: $message,
        isTainted: isTainted,
        submitting: $submitting,
        delayed: $delayed,
        timeout: $timeout,
        posted: $posted,
      }}
    />
    <br />
    <SuperDebug label="Form" data={$formData} />
    <br />
    <SuperDebug label="Tainted" status={false} data={$tainted} />
    <br />
    <SuperDebug label="Errors" status={false} data={$errors} />
    <br />
    <SuperDebug label="Constraints" status={false} data={$constraints} />
  </DebugShell>
</Preview>

<style lang="postcss">
</style>
