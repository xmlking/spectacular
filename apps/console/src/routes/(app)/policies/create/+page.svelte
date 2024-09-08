<script lang="ts">
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { graphql, type policies_insert_input } from '$houdini';
import * as m from '$i18n/messages';
import { searchRulesFn } from '$lib/api/search-rules';
import { searchSubjects } from '$lib/api/search-subjects';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { i18n } from '$lib/i18n';
import { createPolicySchema } from '$lib/schema/policy';
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
// import type { PageData } from './$types';

const log = new Logger('policies.create.browser');

// Variables
// export let data: PageData;
const toastStore = getToastStore();
const loadingState = getLoadingState();
let gqlErrors: PartialGraphQLErrors;
// let subjects: Subject[] | undefined;

const createPolicy = graphql(`
    mutation CreatePolicy($data: policies_insert_input!) {
      insert_policies_one(object: $data) {
        id
        weight
        active
        validFrom
        validTo
        subjectId
        subjectType
        subjectDisplayName
        subjectSecondaryId
        createdBy
        createdAt
        updatedAt
        updatedBy
        organization
        rule {
          id
          displayName
          description
          tags
          annotations
          shared
          source
          sourcePort
          destination
          destinationPort
          protocol
          direction
          action
          appId
          throttleRate
          weight
          createdBy
          createdAt
          updatedAt
          updatedBy
          organization
        }
      }
    }
  `);

const superform = superForm(defaults(zod(createPolicySchema)), {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  syncFlashMessage: false,
  resetForm: true,
  delayMs: 100,
  timeoutMs: 4000,
  validators: zodClient(createPolicySchema),
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

    const { data, errors } = await createPolicy.mutate(
      { data: payload },
      { metadata: { logResult: true, useRole: 'user' } },
    );

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
      message: `Policy created with Rule: ${result.rule.displayName}`,
    } as const;
    setMessage(form, message);
    handleMessage(message, toastStore);
    await goto(i18n.resolveRoute('/dashboard/policies'), {
      invalidateAll: false,
    });
  },
  onError({ result }) {
    log.error('superForm onError:', { result });
  },
});

const {
  form,
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
} = superform;
export const snapshot = { capture, restore };

// subject settings
let subject = $form?.subjectId
  ? {
      id: $form.subjectId,
      displayName: $form.subjectDisplayName,
      secondaryId: $form.subjectSecondaryId,
    }
  : null;

async function fetchSubjects(filterText: string) {
  const result = await searchSubjects($form.subjectType, filterText);
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
      $form.subjectId = changedSubject.detail.id;
      $form.subjectDisplayName = changedSubject.detail.displayName;
      $form.subjectSecondaryId = changedSubject.detail.id;
    } else {
      $form.subjectId = '';
      $form.subjectDisplayName = '';
      $form.subjectSecondaryId = '';
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
    $form.subjectId = '';
    $form.subjectDisplayName = '';
    $form.subjectSecondaryId = '';
  }
}

// rule settings
let rule = $form?.ruleId
  ? {
      id: $form.ruleId,
      displayName: $form.rule.displayName,
    }
  : null;

async function onRuleChange(changedSubject: CustomEvent) {
  log.debug('onRuleChange', changedSubject.detail);
  if (browser) {
    if (changedSubject?.detail) {
      $form.ruleId = changedSubject.detail.id;
      $form.rule.shared = changedSubject.detail.shared;
      $form.rule.displayName = changedSubject.detail.displayName;
      $form.rule.description = changedSubject.detail.description;
      $form.rule.tags = changedSubject.detail.tags;
      $form.rule.annotations = changedSubject.detail.annotations;
      $form.rule.source = changedSubject.detail.source;
      $form.rule.sourcePort = changedSubject.detail.sourcePort;
      $form.rule.destination = changedSubject.detail.destination;
      $form.rule.destinationPort = changedSubject.detail.destinationPort;
      $form.rule.protocol = changedSubject.detail.protocol;
      $form.rule.direction = changedSubject.detail.direction;
      $form.rule.action = changedSubject.detail.action;
      $form.rule.appId = changedSubject.detail.appId;
      $form.rule.weight = changedSubject.detail.weight;
      // HINT: we copy `rule.weight` to `policy.weight` initially and let users overwrite weightage afterwords.
      $form.weight = changedSubject.detail.weight;
    } else {
      // Reset rule section of form
      rule = null;
      $form.ruleId = undefined;
      $form.rule.shared = false;
      $form.rule.displayName = '';
      $form.rule.description = undefined;
      $form.rule.tags = [];
      $form.rule.annotations = undefined;
      $form.rule.source = undefined;
      $form.rule.sourcePort = undefined;
      $form.rule.destination = undefined;
      $form.rule.destinationPort = undefined;
      $form.rule.protocol = 'Any';
      $form.rule.direction = 'egress';
      $form.rule.action = 'block';
      $form.rule.appId = undefined;
      $form.rule.weight = 1000;
    }
  }
}
function clearRule(event: Event) {
  log.debug('onRuleClear', event.target);
  if (browser) {
    // Reset rule section of form
    rule = null;
    $form.ruleId = undefined;
    $form.rule.shared = false;
    $form.rule.displayName = '';
    $form.rule.description = undefined;
    $form.rule.tags = [];
    $form.rule.annotations = undefined;
    $form.rule.source = undefined;
    $form.rule.sourcePort = undefined;
    $form.rule.destination = undefined;
    $form.rule.destinationPort = undefined;
    $form.rule.protocol = 'Any';
    $form.rule.direction = 'egress';
    $form.rule.action = 'block';
    $form.rule.appId = undefined;
    $form.rule.weight = 1000;
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
// $: disabled=$form.rule.shared
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
    <GraphQLErrors errors={gqlErrors} />
    <!-- Update User Details Form -->
    <form class="card md:space-y-8" method="POST" use:enhance>
      <header class="card-header">
        <div class="text-xl">Create Policy</div>
        <!-- <div>Create new policy</div> -->
      </header>
      <section class="p-4 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
        <div class="col-span-2">
          <Form.Fieldset form={superform} name={keys.subjectType}>
            <RadioGroup active="variant-filled-secondary">
              {#each subjectTypeOptions as sType}
                <Form.Control let:attrs>
                  <RadioItem
                    {...attrs}
                    bind:group={$form.subjectType}
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
            --list-z-index="100"
            --border-radius="8px"
            --border-focused="1px solid blue"
          >
            <b slot="prepend">
              {#if $form.subjectType == "group"}
                <UsersRound />
              {:else if $form.subjectType == "service_account"}
                <User />
              {:else if $form.subjectType == "device"}
                <MonitorSmartphone />
              {:else if $form.subjectType == "device_pool"}
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
            --list-z-index="100"
            --border-radius="8px"
            --border-focused="1px solid blue"
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
          <Form.Field form={superform} name="rule.displayName">
            <Form.Control let:attrs>
              <Form.Label class="label">Display Name</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                {disabled}
                placeholder="Display Name"
                bind:value={$form.rule.displayName}
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
          <Form.Field form={superform} name="rule.description">
            <Form.Control let:attrs>
              <Form.Label class="label">Description</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                {disabled}
                placeholder="Display Name"
                bind:value={$form.rule.description}
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
          <Form.Field form={superform} name="rule.tags">
            <Form.Control let:attrs>
              <Form.Label class="label">Tags</Form.Label>
              <!-- <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                {disabled}
                placeholder="Enter tags..."
                bind:value={$form.rule.tags}
              /> -->
              <InputChip
                {...attrs}
                {disabled}
                placeholder="Enter tags..."
                class="input data-[fs-error]:input-error"
                bind:value={$form.rule.tags}
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
          <Form.Field form={superform} name="rule.annotations">
            <Form.Control let:attrs>
              <Form.Label class="label">Annotations</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                {disabled}
                placeholder="Enter Annotations..."
                bind:value={$form.rule.annotations}
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
          <Form.Field form={superform} name="rule.source">
            <Form.Control let:attrs>
              <Form.Label class="label">Source</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                {disabled}
                placeholder="Enter Source..."
                bind:value={$form.rule.source}
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
          <Form.Field form={superform} name="rule.sourcePort">
            <Form.Control let:attrs>
              <Form.Label class="label">Source port</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                {disabled}
                placeholder="Enter Source port..."
                bind:value={$form.rule.sourcePort}
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
          <Form.Field form={superform} name="rule.destination">
            <Form.Control let:attrs>
              <Form.Label class="label">Destination</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                {disabled}
                placeholder="Enter Destination..."
                bind:value={$form.rule.destination}
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
          <Form.Field form={superform} name="rule.destinationPort">
            <Form.Control let:attrs>
              <Form.Label class="label">Destination port</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                {disabled}
                placeholder="Enter Destination port..."
                bind:value={$form.rule.destinationPort}
              />
            </Form.Control>
            <Form.Description
              class="sr-only md:not-sr-only text-sm text-gray-500"
              >Enter the destination port</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div>
          <Form.Field form={superform} name="rule.protocol">
            <Form.Control let:attrs>
              <Form.Label class="label">Protocols</Form.Label>
              <select
                class="input data-[fs-error]:input-error"
                {...attrs}
                {disabled}
                bind:value={$form.rule.protocol}
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
        <div>
          <Form.Fieldset form={superform} name="rule.action">
            <Form.Legend>Action</Form.Legend>
            <RadioGroup active="variant-filled-secondary">
              {#each actionOptions as action}
                <Form.Control let:attrs>
                  <RadioItem
                    {...attrs}
                    {disabled}
                    bind:group={$form.rule.action}
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
        <div>
          <Form.Fieldset form={superform} name="rule.direction">
            <Form.Legend>Direction</Form.Legend>
            <RadioGroup active="variant-filled-secondary">
              {#each directionOptions as direction}
                <Form.Control let:attrs>
                  <RadioItem
                    {...attrs}
                    {disabled}
                    bind:group={$form.rule.direction}
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
        <div class="col-start-5 flex justify-end">
          <Form.Field form={superform} name="rule.shared">
            <Form.Control let:attrs>
              <SlideToggle
                active="variant-filled-secondary"
                size="md"
                {...attrs}
                {disabled}
                bind:checked={$form.rule.shared}
              >
                <Form.Label class="inline-block w-[100px] text-left">
                  {$form.rule.shared ? "" : "Not"} Shared</Form.Label
                >
              </SlideToggle>
            </Form.Control>
            <!-- <Form.Description>Temporarily disable policy</Form.Description> -->
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="col-end-7">
          <Form.Field form={superform} name={keys.weight}>
            <Form.Control let:attrs>
              <Form.Label class="label">Weight</Form.Label>
              <input
                type="number"
                class="input data-[fs-error]:input-error"
                {...attrs}
                {disabled}
                bind:value={$form.rule.weight}
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
          <Form.Field form={superform} name="rule.appId">
            <Form.Control let:attrs>
              <Form.Label class="label">App id</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                {disabled}
                placeholder="Display Name"
                bind:value={$form.rule.appId}
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
          <Form.Field form={superform} name="rule.throttleRate">
            <Form.Control let:attrs>
              <RangeSlider
                {...attrs}
                {disabled}
                bind:value={$form.rule.throttleRate}
                min={0}
                max={100}
                step={1}
                ticked
              >
                <div class="flex justify-between items-center">
                  <Form.Label class="label">Bandwidth limit</Form.Label>
                  <div class="text-xs">{$form.rule.throttleRate} /100</div>
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
        <div class="flex justify-start">
          <Form.Field form={superform} name="active">
            <Form.Control let:attrs>
              <SlideToggle
                active="variant-filled-secondary"
                size="md"
                {...attrs}
                bind:checked={$form.active}
              >
                <Form.Label class="inline-block w-[100px] text-left"
                  >Active {$form.active ? "On" : "Off"}</Form.Label
                >
              </SlideToggle>
            </Form.Control>
            <!-- <Form.Description>Temporarily disable policy</Form.Description> -->
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="col-start-5">
          <Form.Field form={superform} name={keys.validFrom}>
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
          <Form.Field form={superform} name={keys.validTo}>
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
      <footer class="card-footer flex justify-end">
        <button
          type="submit"
          class="btn variant-filled-secondary"
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
          submitting: $submitting,
          delayed: $delayed,
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
    </DebugShell>
  </section>
</div>
