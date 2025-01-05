<script lang="ts">
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { cache, graphql, type policies_insert_input } from '$houdini';
import * as m from '$i18n/messages';
import { searchRulesFn } from '$lib/api/search-rules';
import { searchSubjects } from '$lib/api/search-subjects';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { i18n } from '$lib/i18n';
import { createPolicySchema as schema } from '$lib/schema/policy';
import { createPolicyKeys as keys } from '$lib/schema/policy';
import { getLoadingState } from '$lib/stores/loading';
import type { PartialGraphQLErrors } from '$lib/types';
import { actionOptions, directionOptions, protocols, subjectTypeOptions } from '$lib/utils/options';
import { InputChip, RadioGroup, RadioItem, RangeSlider, SlideToggle } from '@skeletonlabs/skeleton';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell, GraphQLErrors } from '@spectacular/skeleton';
import { Alerts } from '@spectacular/skeleton/components/form';
import { Logger, cleanClone } from '@spectacular/utils';
import * as Form from 'formsnap';
import type { GraphQLError } from 'graphql';
import {
  Loader,
  MonitorSmartphone,
  MoreHorizontal,
  Search,
  Server,
  User,
  UserRound,
  Users,
  UsersRound,
} from 'lucide-svelte';
import Select from 'svelte-select';
import SuperDebug, { dateProxy, defaults, setError, setMessage, superForm } from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';
import { CreatePolicy } from '../mutations';

const log = new Logger('policies.create.browser');

// Variables
const toastStore = getToastStore();
const loadingState = getLoadingState();
let gqlErrors: PartialGraphQLErrors;
// let subjects: Subject[] | undefined;

const form = superForm(defaults(zod(schema)), {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  syncFlashMessage: false,
  resetForm: true,
  delayMs: 100,
  timeoutMs: 4000,
  validators: zodClient(schema),
  async onUpdate({ form, cancel }) {
    if (!form.valid) return;

    // validate incoming data with business rules
    if (form.data.ruleId && form.data.rule.shared === false) {
      return setError(form, 'ruleId', 'Only shared rules are allowed to pick from. Chose a shared rule');
    }

    log.debug('before cleanClone with strip:', form.data);
    const dataCopy = cleanClone(form.data, { empty: 'strip' });
    log.debug('after cleanClone with strip:', dataCopy);
    const {
      ruleId,
      rule: { throttleRate, ...ruleRest },
      ...restPolicy
    } = dataCopy;
    const payload: policies_insert_input = {
      ...restPolicy,
      ...(ruleId
        ? { ruleId }
        : {
            rule: {
              data: {
                ...ruleRest,
                ...(throttleRate && { throttleRate: `${throttleRate}` }),
              },
            },
          }),
    };

    // if we are creating Policy with new Rule, overwrite Rule's weight with Policy's weight.
    if (payload.rule?.data && payload.weight) {
      payload.rule.data.weight = payload.weight;
    }
    log.debug('payload:', payload);

    const { data, errors } = await CreatePolicy.mutate({ data: payload }, { metadata: { logResult: true } });

    if (errors) {
      for (const error of errors) {
        if (error.message.includes('Uniqueness violation')) {
          setError(form, 'rule.displayName', 'Display Name already taken');
        } else {
          gqlErrors = errors;
        }
      }
      log.error('create policy api call error:', errors);
      return;
    }

    const result = data?.insert_policies_one;
    if (!result) {
      setMessage(form, { type: 'error', message: 'Create policy failed: responce empty' }, { status: 404 });
      return;
    }

    // Finally notify user: successfully created new policy
    const message: App.Superforms.Message = {
      type: 'success',
      timeout: 10000,
      message: `Policy created with Rule: ${payload.rule?.data.displayName}`,
    } as const;
    setMessage(form, message);
    handleMessage(message, toastStore);

    // FIXME: workaround untile we can inject newly created rule into rules cache.
    // workaround: make all rules stale to bust the cache on new policy insert.
    if (ruleId === undefined) cache.markStale('rules');
    await goto(i18n.resolveRoute('/policies'), {
      invalidateAll: false,
    });
  },
  onError({ result }) {
    log.error('superForm onError:', { result });
  },
});

const {
  form: formData,
  delayed,
  enhance,
  errors,
  constraints,
  message,
  isTainted,
  tainted,
  allErrors,
  reset,
  submitting,
  timeout,
  capture,
  restore,
} = form;
export const snapshot = { capture, restore };

// subject settings
let subject = $formData?.subjectId
  ? {
      id: $formData.subjectId,
      displayName: $formData.subjectDisplayName,
      secondaryId: $formData.subjectSecondaryId,
    }
  : null;

async function fetchSubjects(filterText: string) {
  const result = await searchSubjects($formData.subjectType, filterText);
  if (result.isErr()) {
    gqlErrors = result.error;
    return [];
  }
  return result.value;
}

async function onSubjectChange(changedSubject: CustomEvent) {
  log.debug('onSubjectChange', changedSubject.detail);
  if (browser) {
    if (changedSubject?.detail) {
      $formData.subjectId = changedSubject.detail.id;
      $formData.subjectDisplayName = changedSubject.detail.displayName;
      $formData.subjectSecondaryId = changedSubject.detail.id;
    } else {
      $formData.subjectId = '';
      $formData.subjectDisplayName = '';
      $formData.subjectSecondaryId = '';
    }
  }
}

function clearSubject(event: CustomEvent | Event) {
  console.log('clearSubject');
  // reset Selected ???
  // log.debug('onSubjectTypeChange1',event.target?.value);
  // log.debug('onSubjectTypeChange', event.detail);
  if (browser) {
    subject = null;
    $formData.subjectId = '';
    $formData.subjectDisplayName = '';
    $formData.subjectSecondaryId = '';
  }
}

// rule settings
let rule = $formData?.ruleId
  ? {
      id: $formData.ruleId,
      displayName: $formData.rule.displayName,
    }
  : null;

async function onRuleChange(changedSubject: CustomEvent) {
  log.debug('onRuleChange', changedSubject.detail);
  if (browser) {
    if (changedSubject?.detail) {
      $formData.ruleId = changedSubject.detail.id;
      $formData.rule.shared = changedSubject.detail.shared;
      $formData.rule.displayName = changedSubject.detail.displayName;
      $formData.rule.description = changedSubject.detail.description;
      $formData.rule.tags = changedSubject.detail.tags;
      $formData.rule.metadata = changedSubject.detail.metadata;
      $formData.rule.source = changedSubject.detail.source;
      $formData.rule.sourcePort = changedSubject.detail.sourcePort;
      $formData.rule.destination = changedSubject.detail.destination;
      $formData.rule.destinationPort = changedSubject.detail.destinationPort;
      $formData.rule.protocol = changedSubject.detail.protocol;
      $formData.rule.direction = changedSubject.detail.direction;
      $formData.rule.action = changedSubject.detail.action;
      $formData.rule.appId = changedSubject.detail.appId;
      $formData.rule.weight = changedSubject.detail.weight;
      // HINT: we copy `rule.weight` to `policy.weight` initially and let users overwrite weightage afterwords.
      $formData.weight = changedSubject.detail.weight;
    } else {
      // Reset rule section of form
      rule = null;
      $formData.ruleId = undefined;
      $formData.rule.shared = false;
      $formData.rule.displayName = '';
      $formData.rule.description = undefined;
      $formData.rule.tags = [];
      $formData.rule.metadata = undefined;
      $formData.rule.source = undefined;
      $formData.rule.sourcePort = undefined;
      $formData.rule.destination = undefined;
      $formData.rule.destinationPort = undefined;
      $formData.rule.protocol = 'Any';
      $formData.rule.direction = 'egress';
      $formData.rule.action = 'block';
      $formData.rule.appId = undefined;
      $formData.rule.weight = 1000;
    }
  }
}
function clearRule(event: Event) {
  log.debug('onRuleClear', event.target);
  if (browser) {
    // Reset rule section of form
    rule = null;
    $formData.ruleId = undefined;
    $formData.rule.shared = false;
    $formData.rule.displayName = '';
    $formData.rule.description = undefined;
    $formData.rule.tags = [];
    $formData.rule.metadata = undefined;
    $formData.rule.source = undefined;
    $formData.rule.sourcePort = undefined;
    $formData.rule.destination = undefined;
    $formData.rule.destinationPort = undefined;
    $formData.rule.protocol = 'Any';
    $formData.rule.direction = 'egress';
    $formData.rule.action = 'block';
    $formData.rule.appId = undefined;
    $formData.rule.weight = 1000;
  }
}

async function fetchRule(filterText: string) {
  const result = await searchRulesFn(filterText);
  if (result.isErr()) {
    gqlErrors = result.error;
    return [];
  }
  return result.value;
}

// Reactivity
const validFrom = dateProxy(form, 'validFrom', { format: 'datetime-utc' });
const validTo = dateProxy(form, 'validTo', { format: 'datetime-utc' });
// $: disabled=$formData.rule.shared
$: disabled = rule != null;
$: valid = $allErrors.length === 0;
$: loadingState.setFormLoading($delayed);
</script>

<svelte:head>
  <title>Policies</title>
  <meta name="description" content="policies" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Policies</h1>
    <p>create policies</p>
  </section>

  <section class="space-y-4">
    <!-- Form Level Errors / Messages -->
    <Alerts errors={$errors._errors} message={$message} />
    <!-- GraphQL Errors  -->
    {#if gqlErrors}
      <GraphQLErrors errors={gqlErrors} />
    {/if}
    <!-- Update User Details Form -->
    <form class="card md:space-y-8" method="POST" use:enhance>
      <header class="card-header">
        <div class="text-xl">Create Policy</div>
        <!-- <div>Create new policy</div> -->
      </header>
      <section
        class="p-4 grid gap-6 content-center md:grid-cols-3 lg:grid-cols-6"
      >
        <div class="col-span-2 leading-3">
          <Form.Fieldset {form} name={keys.subjectType}>
            <RadioGroup active="variant-filled">
              {#each subjectTypeOptions as sType}
                <Form.Control let:attrs>
                  <RadioItem
                    {...attrs}
                    bind:group={$formData.subjectType}
                    value={sType.value}
                    on:change={clearSubject}
                  >
                    <Form.Label class="label">{sType.name}</Form.Label>
                  </RadioItem>
                </Form.Control>
              {/each}
            </RadioGroup>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Fieldset>
        </div>
        <div class="col-span-2">
          <Select
            class="input"
            itemId="displayName"
            label="displayName"
            placeholder="Type to select subject"
            bind:value={subject}
            on:change={onSubjectChange}
            on:clear={clearSubject}
            loadOptions={fetchSubjects}
            --tw-border-opacity="1"
            --tw-bg-opacity="1"
            --background="rgb(var(--color-surface-200))"
            --border-radius="var(--theme-rounded-base)"
            --border="var(--theme-border-base) solid rgb(var(--color-surface-400))"
            --border-hover="var(--theme-border-base) solid rgb(var(--color-surface-500))"
            --border-focused="var(--theme-border-base) solid rgb(var(--color-primary-500) / var(--tw-border-opacity))"
            --error-background="rgb(var(--color-error-200) / var(--tw-bg-opacity))"
            --error-border="rgb(var(--color-error-500) / var(--tw-bg-opacity))"
            --disabled-color="rgb(var(--color-surface-400) / 2)"
            --disabled-border-color="rgb(var(--color-surface-400) / 2)"
            --disabled-background="rgb(var(--color-surface-200) / 2)"
            --list-background="rgb(var(--color-surface-200) / var(--tw-bg-opacity))"
            --list-border="var(--theme-border-base) solid rgb(var(--color-surface-400) / var(--tw-bg-opacity))"
            --list-border-radius="var(--theme-rounded-container)"
            --list-empty-padding="10px"
            --list-z-index="100"
            --item-color="var(--body-text-color)"
            --item-border="var(--comfy-dropdown-border-color)"
            --item-is-active-color="rgba(var(--theme-font-color-dark))"
            --item-hover-color="rgba(var(--on-secondary))"
            --item-active-background="rgb(var(--color-surface-400) /2)"
            --item-is-active-bg="var(--pd-input-field-hover-stroke)"
            --item-hover-bg="rgba(var(--color-secondary-500) / 1)"
          >
            <b slot="prepend">
              {#if $formData.subjectType == "group"}
                <UsersRound />
              {:else if $formData.subjectType == "service_account"}
                <User />
              {:else if $formData.subjectType == "device"}
                <MonitorSmartphone />
              {:else if $formData.subjectType == "device_pool"}
                <Server />
              {:else}
                <UserRound />
              {/if}
            </b>
            <svelte:fragment slot="input-hidden" let:value>
              <input
                type="hidden"
                name="subjectDisplayName"
                value={value ? value.displayName : null}
              />
            </svelte:fragment>
          </Select>
        </div>
        <div class="col-span-2">
          <Select
            class="input"
            itemId="id"
            label="displayName"
            placeholder="Type to select rule"
            bind:value={rule}
            on:change={onRuleChange}
            on:clear={clearRule}
            loadOptions={fetchRule}
            --tw-border-opacity="1"
            --tw-bg-opacity="1"
            --background="rgb(var(--color-surface-200))"
            --border-radius="var(--theme-rounded-base)"
            --border="var(--theme-border-base) solid rgb(var(--color-surface-400))"
            --border-hover="var(--theme-border-base) solid rgb(var(--color-surface-500))"
            --border-focused="var(--theme-border-base) solid rgb(var(--color-primary-500) / var(--tw-border-opacity))"
            --error-background="rgb(var(--color-error-200) / var(--tw-bg-opacity))"
            --error-border="rgb(var(--color-error-500) / var(--tw-bg-opacity))"
            --disabled-color="rgb(var(--color-surface-400) / 2)"
            --disabled-border-color="rgb(var(--color-surface-400) / 2)"
            --disabled-background="rgb(var(--color-surface-200) / 2)"
            --list-background="rgb(var(--color-surface-200) / var(--tw-bg-opacity))"
            --list-border="var(--theme-border-base) solid rgb(var(--color-surface-400) / var(--tw-bg-opacity))"
            --list-border-radius="var(--theme-rounded-container)"
            --list-empty-padding="10px"
            --list-z-index="100"
            --item-color="var(--body-text-color)"
            --item-border="var(--comfy-dropdown-border-color)"
            --item-is-active-color="rgba(var(--theme-font-color-dark))"
            --item-hover-color="rgba(var(--on-secondary))"
            --item-active-background="rgb(var(--color-surface-400) /2)"
            --item-is-active-bg="var(--pd-input-field-hover-stroke)"
            --item-hover-bg="rgba(var(--color-secondary-500) / 1)"
          >
            <b slot="prepend">
              <Search />
            </b>
            <svelte:fragment slot="input-hidden" let:value>
              <input
                type="hidden"
                name="ruleDisplayName"
                value={value ? value.displayName : null}
              />
            </svelte:fragment>
          </Select>
        </div>
        <div class="col-span-2">
          <Form.Field {form} name="rule.displayName">
            <Form.Control let:attrs>
              <Form.Label class="label">Display Name</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                {disabled}
                placeholder="Display Name"
                bind:value={$formData.rule.displayName}
              />
            </Form.Control>
            <Form.Description
              class="sr-only md:not-sr-only text-sm text-gray-500"
              >Enter the displayName</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="col-span-4">
          <Form.Field {form} name="rule.description">
            <Form.Control let:attrs>
              <Form.Label class="label">Description</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                {disabled}
                placeholder="Display Name"
                bind:value={$formData.rule.description}
              />
            </Form.Control>
            <Form.Description
              class="sr-only md:not-sr-only text-sm text-gray-500"
              >Enter the description</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="col-span-3">
          <Form.Field {form} name="rule.tags">
            <Form.Control let:attrs>
              <Form.Label class="label">Tags</Form.Label>
              <!-- <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                {disabled}
                placeholder="Enter tags..."
                bind:value={$formData.rule.tags}
              /> -->
              <InputChip
                {...attrs}
                {disabled}
                placeholder="Enter tags..."
                class="input data-[fs-error]:input-error"
                bind:value={$formData.rule.tags}
              />
            </Form.Control>
            <Form.Description
              class="sr-only md:not-sr-only text-sm text-gray-500"
              >Enter the tags</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="col-span-3">
          <Form.Field {form} name="rule.metadata">
            <Form.Control let:attrs>
              <Form.Label class="label">Metadata</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                {disabled}
                placeholder="Enter Metadata..."
                bind:value={$formData.rule.metadata}
              />
            </Form.Control>
            <Form.Description
              class="sr-only md:not-sr-only text-sm text-gray-500"
              >Format: key1=>value1 (or) "key2" => "value2 with space"</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="col-span-3">
          <Form.Field {form} name="rule.source">
            <Form.Control let:attrs>
              <Form.Label class="label">Source</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                {disabled}
                placeholder="Enter Source..."
                bind:value={$formData.rule.source}
              />
            </Form.Control>
            <Form.Description
              class="sr-only md:not-sr-only text-sm text-gray-500"
              >Enter the source</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="col-span-3">
          <Form.Field {form} name="rule.sourcePort">
            <Form.Control let:attrs>
              <Form.Label class="label">Source port</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                {disabled}
                placeholder="Enter Source port..."
                bind:value={$formData.rule.sourcePort}
              />
            </Form.Control>
            <Form.Description
              class="sr-only md:not-sr-only text-sm text-gray-500"
              >Enter the source port</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="col-span-3">
          <Form.Field {form} name="rule.destination">
            <Form.Control let:attrs>
              <Form.Label class="label">Destination</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                {disabled}
                placeholder="Enter Destination..."
                bind:value={$formData.rule.destination}
              />
            </Form.Control>
            <Form.Description
              class="sr-only md:not-sr-only text-sm text-gray-500"
              >Enter the destination</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="col-span-3">
          <Form.Field {form} name="rule.destinationPort">
            <Form.Control let:attrs>
              <Form.Label class="label">Destination port</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                {disabled}
                placeholder="Enter Destination port..."
                bind:value={$formData.rule.destinationPort}
              />
            </Form.Control>
            <Form.Description
              class="sr-only md:not-sr-only text-sm text-gray-500"
              >Enter the destination port</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="leading-3">
          <Form.Field {form} name="rule.protocol">
            <Form.Control let:attrs>
              <Form.Label class="label">Protocols</Form.Label>
              <select
                class="input data-[fs-error]:input-error"
                {...attrs}
                {disabled}
                bind:value={$formData.rule.protocol}
              >
                {#each protocols as protocol}
                  <option value={protocol.value}>{protocol.name}</option>
                {/each}
              </select>
            </Form.Control>
            <Form.Description
              class="sr-only md:not-sr-only text-sm text-gray-500"
              >Enter Protocols</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="leading-3">
          <Form.Fieldset {form} name="rule.action">
            <Form.Legend>Action</Form.Legend>
            <RadioGroup active="variant-filled">
              {#each actionOptions as action}
                <Form.Control let:attrs>
                  <RadioItem
                    {...attrs}
                    {disabled}
                    bind:group={$formData.rule.action}
                    value={action.value}
                  >
                    <Form.Label class="label">{action.label}</Form.Label>
                  </RadioItem>
                </Form.Control>
              {/each}
            </RadioGroup>
            <Form.Description
              class="sr-only md:not-sr-only text-sm text-gray-500"
              >Select action</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Fieldset>
        </div>
        <div class="leading-3">
          <Form.Fieldset {form} name="rule.direction">
            <Form.Legend>Direction</Form.Legend>
            <RadioGroup active="variant-filled">
              {#each directionOptions as direction}
                <Form.Control let:attrs>
                  <RadioItem
                    {...attrs}
                    {disabled}
                    bind:group={$formData.rule.direction}
                    value={direction.value}
                  >
                    <Form.Label class="label">{direction.label}</Form.Label>
                  </RadioItem>
                </Form.Control>
              {/each}
            </RadioGroup>
            <Form.Description
              class="sr-only md:not-sr-only text-sm text-gray-500"
              >Select direction</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Fieldset>
        </div>
        <div class="col-start-5 justify-end content-center">
          <Form.Field {form} name="rule.shared">
            <Form.Control let:attrs>
              <SlideToggle
                active="variant-filled"
                size="md"
                {...attrs}
                {disabled}
                bind:checked={$formData.rule.shared}
              >
                <Form.Label class="inline-block w-[100px] text-left">
                  {$formData.rule.shared ? "" : "Not"} Shared</Form.Label
                >
              </SlideToggle>
            </Form.Control>
            <!-- <Form.Description>Temporarily disable policy</Form.Description> -->
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="col-end-7">
          <Form.Field {form} name={keys.weight}>
            <Form.Control let:attrs>
              <Form.Label class="label">Weight</Form.Label>
              <input
                type="number"
                class="input data-[fs-error]:input-error"
                {...attrs}
                {disabled}
                bind:value={$formData.rule.weight}
              />
            </Form.Control>
            <Form.Description
              class="sr-only md:not-sr-only text-sm text-gray-500"
              >Enter Weight</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>

        <div class="col-span-4">
          <Form.Field {form} name="rule.appId">
            <Form.Control let:attrs>
              <Form.Label class="label">App id</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                {disabled}
                placeholder="Display Name"
                bind:value={$formData.rule.appId}
              />
            </Form.Control>
            <Form.Description
              class="sr-only md:not-sr-only text-sm text-gray-500"
              >If no app is selected, throttle rate applied system wide.</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="col-span-2">
          <Form.Field {form} name="rule.throttleRate">
            <Form.Control let:attrs>
              <RangeSlider
                {...attrs}
                {disabled}
                bind:value={$formData.rule.throttleRate}
                min={0}
                max={100}
                step={1}
                ticked
              >
                <div class="flex justify-between items-center">
                  <Form.Label class="label">Bandwidth limit</Form.Label>
                  <div class="text-xs">{$formData.rule.throttleRate} /100</div>
                </div>
              </RangeSlider>
            </Form.Control>
            <Form.Description
              class="sr-only md:not-sr-only text-sm text-gray-500"
              >Set Bandwidth limit</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="col-start-5">
          <Form.Field {form} name={keys.validFrom}>
            <Form.Control let:attrs>
              <Form.Label class="label">Valid From</Form.Label>
              <input
                type="datetime-local"
                class="input data-[fs-error]:input-error"
                {...attrs}
                bind:value={$validFrom}
              />
            </Form.Control>
            <Form.Description
              class="sr-only md:not-sr-only text-sm text-gray-500"
              >Enter the validFrom date</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="col-end-auto">
          <Form.Field {form} name={keys.validTo}>
            <Form.Control let:attrs>
              <Form.Label class="label">Valid To</Form.Label>
              <input
                type="datetime-local"
                class="input data-[fs-error]:input-error"
                {...attrs}
                bind:value={$validTo}
              />
            </Form.Control>
            <Form.Description
              class="sr-only md:not-sr-only text-sm text-gray-500"
              >Enter the validTo date</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
      </section>
      <footer class="card-footer flex justify-between">
          <Form.Field {form} name={keys.active}>
            <Form.Control let:attrs>
              <SlideToggle
                active="variant-filled"
                size="md"
                {...attrs}
                bind:checked={$formData.active}
              >
                <Form.Label class="inline-block text-left">
                  Active <strong>{$formData.active ? "ON" : "OFF"}</strong></Form.Label
                >
              </SlideToggle>
            </Form.Control>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        <div class="space-x-2">
          <button
            type="button"
            class="btn variant-filled-primary"
            on:click={() => history.back()}>Back</button
          >
          <button
            type="button"
            class="btn variant-filled-warning"
            disabled={!$tainted}
            on:click={() => reset()}
          >
            Reset
          </button>
          <button
            type="submit"
            class="btn variant-filled"
            disabled={!$tainted || !valid || $submitting}
          >
            {#if $timeout}
              <MoreHorizontal class="m-2 h-4 w-4 animate-ping" />
            {:else if $delayed}
              <Loader class="m-2 h-4 w-4 animate-spin" />
            {:else}
              {m.buttons_create()}
            {/if}
          </button>
        </div>
      </footer>
    </form>
  </section>

  <section class="space-y-4">
    <!-- Debug -->
    <DebugShell label="form-data">
      <SuperDebug
        label="Miscellaneous"
        status={false}
        data={{
          message: $message,
          isTainted: isTainted,
          submitting: $submitting,
          delayed: $delayed,
          timeout: $timeout,
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
      <!-- <br />
	<SuperDebug label="$page data" status={false} data={$page} /> -->
    </DebugShell>
  </section>
</div>

<style lang="postcss">
  /*
			CSS variables can be used to control theming.
			https://github.com/rob-balfre/svelte-select/blob/master/docs/theming_variables.md
	*/
  .select1 {
    --border-radius: var(--theme-rounded-container);
    --border-color: rgb(var(--color-secondary-500));
    --border-focused: 1px solid rgb(var(--color-secondary-500));
    --border-hover: 1px solid rgb(var(--color-secondary-500));
    --multi-item-active-outline: 1px solid rgb(var(--color-secondary-500));
    --multi-item-outline: 1px solid rgb(var(--color-secondary-500));
    --clear-select-focus-outline: 1px solid rgb(var(--color-secondary-500));
    --height: 3rem;
    --multi-select-input-margin: 0px;

    --tw-border-opacity: 1 --tw-bg-opacity: 1 --background:
      rgb(var(--color-surface-200)) --border-radius: var(--theme-rounded-base)
      --border: var(--theme-border-base) solid rgb(var(--color-surface-400))
      --border-hover: var(--theme-border-base) solid
      rgb(var(--color-surface-500)) --border-focused: var(--theme-border-base)
      solid rgb(var(--color-primary-500) / var(--tw-border-opacity))
      --error-background: rgb(var(--color-error-200) / var(--tw-bg-opacity))
      --error-border: rgb(var(--color-error-500) / var(--tw-bg-opacity))
      --disabled-color: rgb(var(--color-surface-400) / 2)
      --disabled-border-color: rgb(var(--color-surface-400) / 2)
      --disabled-background: rgb(var(--color-surface-200) / 2) --list-background:
      rgb(var(--color-surface-200) / var(--tw-bg-opacity)) --list-border:
      var(--theme-border-base) solid
      rgb(var(--color-surface-400) / var(--tw-bg-opacity)) --list-empty-padding:
      10px --list-z-index: 100 --item-color: var(--body-text-color)
      --item-border: var(--comfy-dropdown-border-color) --item-is-active-color:
      var(--pd-dropdown-item-text) --item-hover-color:
      var(--pd-dropdown-item-hover-text) --item-active-background:
      var(--pd-input-field-hover-stroke) --item-is-active-bg:
      var(--pd-input-field-hover-stroke) --item-hover-bg:
      rgba(var(--color-secondary-500) / 1);
  }
</style>
