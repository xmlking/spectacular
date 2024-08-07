<script lang="ts">
import { dev } from '$app/environment';
import { FloatingTextInput, Form, SelectFB as FormSelect, Radio, Range, TagsInput, Toggle } from '$lib/components/form';
import { actionOptions, directionOptions, protocols } from '$lib/models/enums';
import { updateRuleKeys as keys } from '$lib/models/schema';
import { Logger } from '@spectacular/utils';
import { Breadcrumb, BreadcrumbItem, Heading, Helper, P } from 'flowbite-svelte';
import SuperDebug, { superForm } from 'sveltekit-superforms';

const log = new Logger('routes:rules:update');
export let data;
// Client API:
const superform = superForm(data.form, {
  dataType: 'json',
  taintedMessage: null,
  syncFlashMessage: false,
  onError({ result }) {
    // the onError event allows you to act on ActionResult errors.
    // TODO:
    // message.set(result.error.message)
    log.error('superForm:', { result });
  },
});
const {
  form,
  delayed,
  enhance,
  errors,
  constraints,
  message,
  tainted,
  posted,
  allErrors,
  reset,
  submitting,
  capture,
  restore,
} = superform;
export const snapshot = { capture, restore };
</script>

<svelte:head>
  <title>Rules | Update</title>
  <meta name="description" content="Update Rule" />
</svelte:head>

<Breadcrumb aria-label="Default breadcrumb example" class="mb-6">
  <BreadcrumbItem href="/dashboard" home>Home</BreadcrumbItem>
  <BreadcrumbItem href="/dashboard/rules">Rules</BreadcrumbItem>
  <BreadcrumbItem>Update Rule</BreadcrumbItem>
</Breadcrumb>

<Heading tag="h4" class="pb-5">Update Rule</Heading>

{#if $form.shared}
  <Form {superform} submitButtonText="Update" class="space-y-6">
    <div class="mb-6 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
      <div class="col-span-2">
        <FloatingTextInput field={keys.displayName} label="Display Name" />
      </div>
      <div class="col-span-4">
        <FloatingTextInput field={keys.description} label="Description" />
      </div>
      <div class="col-span-3">
        <TagsInput field={keys.tags} label="Tags" placeholder={'Enter tags...'} />
      </div>
      <div class="col-span-3">
        <FloatingTextInput field={keys.annotations} label="Annotations" />
        <Helper class="mt-2 text-sm italic">Format: key1=>value1 (or) "key2" => "value2 with space"</Helper>
      </div>
      <div class="col-span-3">
        <FloatingTextInput field={keys.source} label="Source" />
      </div>
      <div class="col-span-3">
        <FloatingTextInput field={keys.sourcePort} label="Source port" />
      </div>
      <div class="col-span-3">
        <FloatingTextInput field={keys.destination} label="Destination" />
      </div>
      <div class="col-span-3">
        <FloatingTextInput field={keys.destinationPort} label="Destination port" />
      </div>
      <div>
        <FormSelect field={keys.protocol} items={protocols} />
      </div>
      <div>
        <Radio field={keys.action} items={actionOptions} />
      </div>
      <div>
        <Radio field={keys.direction} items={directionOptions} />
      </div>
      <div class="col-start-5 flex justify-end">
        <Toggle field={keys.shared} class="toggle-secondary toggle" labelPosition="before" disabled>Shared</Toggle>
      </div>
      <div class="col-end-7">
        <FloatingTextInput field={keys.weight} type="number" label="Weight" />
      </div>
      <div class="col-span-4">
        <FloatingTextInput field={keys.appId} label="App id" />
        <Helper class="mt-2 text-sm italic">If no app is selected, throttle rate applied system wide.</Helper>
      </div>
      <div class="col-span-2">
        <Range field={keys.throttleRate} class="range-primary range-md" min="0" max="100" label="Bandwidth limit"
          >Throttle Rate {$form.throttleRate}</Range
        >
      </div>
    </div>
  </Form>
{:else}
  <P>Not a Golden Rule</P>
{/if}

{#if dev}
  <br />
  <SuperDebug
    label="Miscellaneous"
    status={false}
    data={{
      message: $message,
      submitting: $submitting,
      delayed: $delayed,
      posted: $posted,
    }}
  />
  <br />
  <SuperDebug label="Form" data={$form} />
  <br />
  <SuperDebug label="Tainted" status={false} data={$tainted} />
  <br />
  <SuperDebug label="Errors" status={false} data={$errors} />
  <br />
  <SuperDebug label="Constraints" status={false} data={$constraints} />
  <!-- <br />
 	<SuperDebug label="$page data" status={false} data={$page} /> -->
{/if}
