<script lang="ts">
import { goto } from '$app/navigation';
import { graphql } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { getLoadingState } from '$lib/stores/loading';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell, GraphQLErrors } from '@spectacular/skeleton/components';
import { Logger } from '@spectacular/utils';
import * as Form from 'formsnap';
import type { GraphQLError } from 'graphql';
import SuperDebug, { superForm, setMessage } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageData } from './$types';
import { InputChip, RadioGroup, RadioItem, RangeSlider, SlideToggle } from '@skeletonlabs/skeleton';
import { actionOptions, directionOptions, protocols } from '$lib/utils/options';
import { Loader, MoreHorizontal } from 'lucide-svelte';

const log = new Logger('rules:create:browser');

export let data: PageData;

const toastStore = getToastStore();
const loadingState = getLoadingState();
let gqlErrors: Partial<GraphQLError>[] | null;

const createRule = graphql(`
  mutation CreateRule($data: rules_insert_input!) {
    insert_rules_one(object: $data) {
      id
      displayName
      description
      tags
      annotations
      source
      sourcePort
      destination
      destinationPort
      protocol
      action
      direction
      appId
      throttleRate
      weight
      shared
      createdAt
      updatedAt
    }
  }
`);

const superform = superForm(data.form, {
  dataType: 'json',
  taintedMessage: null,
  syncFlashMessage: false,
  resetForm: true,
  async onUpdate({ form, cancel }) {
    if (!form.valid) return;

    const payload = { ...form.data };

    try {
      const { data: ruleData, errors } = await createRule.mutate(
        { data: payload },
        { metadata: { logResult: true, useRole: 'user' } }
      );

      if (errors) {
        gqlErrors = errors;
        return;
      }

      const result = ruleData?.insert_rules_one;
      if (!result) {
        setMessage(form, { type: 'error', message: 'Create rule failed: response empty' }, { status: 404 });
        return;
      }

      // Notify user: successfully created new rule
      const message = {
        type: 'success',
        message: `Rule created: ${result.displayName}`,
      };
      setMessage(form, message);
      handleMessage(message, toastStore);
      await goto('/rules', { invalidateAll: false });
    } catch (error) {
      console.error('Error creating rule:', error);
      setMessage(form, { type: 'error', message: 'An unexpected error occurred' }, { status: 500 });
    }
  },
  onError({ result }) {
    log.error('create rule superForm error:', { result });
  },
});

const { form, errors, constraints, submitting, delayed, timeout, message, tainted } = superform;
</script>

<svelte:head>
  <title>Create Rule</title>
  <meta name="description" content="Create a new rule" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Create Rule</h1>
    <p>Create a new rule for your policies</p>
  </section>

  <section class="space-y-4">
    <!-- Form Level Errors / Messages -->
    <Form.Alerts errors={$errors._errors} message={$message} />
    <!-- GraphQL Errors  -->
    <GraphQLErrors errors={gqlErrors} />
    <!-- Create Rule Form -->
    <form class="card md:space-y-8" method="POST" use:enhance>
      <header class="card-header">
        <div class="text-xl">Create Rule</div>
      </header>
      <section class="p-4 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
        <div class="col-span-2">
          <Form.Field {form} name="displayName">
            <Form.Control let:attrs>
              <Form.Label class="label">Display Name</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                placeholder="Enter rule name"
                bind:value={$form.displayName}
              />
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter the rule name</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>

        <div class="col-span-4">
          <Form.Field {form} name="description">
            <Form.Control let:attrs>
              <Form.Label class="label">Description</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                placeholder="Enter rule description"
                bind:value={$form.description}
              />
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter a description for the rule</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>

        <div class="col-span-3">
          <Form.Field {form} name="tags">
            <Form.Control let:attrs>
              <Form.Label class="label">Tags</Form.Label>
              <InputChip {...attrs} placeholder="Enter tags..." class="input data-[fs-error]:input-error" bind:value={$form.tags} />
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter tags for the rule</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>

        <div class="col-span-3">
          <Form.Field {form} name="annotations">
            <Form.Control let:attrs>
              <Form.Label class="label">Annotations</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                placeholder="Enter Annotations..."
                bind:value={$form.annotations}
              />
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Format: key1=>value1 (or) "key2" => "value2 with space"</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>

        <div class="col-span-3">
          <Form.Field {form} name="source">
            <Form.Control let:attrs>
              <Form.Label class="label">Source</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                placeholder="Enter Source..."
                bind:value={$form.source}
              />
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter the source IP or network</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>

        <div class="col-span-3">
          <Form.Field {form} name="sourcePort">
            <Form.Control let:attrs>
              <Form.Label class="label">Source Port</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                placeholder="Enter Source port..."
                bind:value={$form.sourcePort}
              />
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter the source port</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>

        <div class="col-span-3">
          <Form.Field {form} name="destination">
            <Form.Control let:attrs>
              <Form.Label class="label">Destination</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                placeholder="Enter Destination..."
                bind:value={$form.destination}
              />
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter the destination IP or network</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>

        <div class="col-span-3">
          <Form.Field {form} name="destinationPort">
            <Form.Control let:attrs>
              <Form.Label class="label">Destination Port</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                placeholder="Enter Destination port..."
                bind:value={$form.destinationPort}
              />
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter the destination port</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>

        <div>
          <Form.Field {form} name="protocol">
            <Form.Control let:attrs>
              <Form.Label class="label">Protocol</Form.Label>
              <select
                class="input data-[fs-error]:input-error"
                {...attrs}
                bind:value={$form.protocol}
              >
                {#each protocols as protocol}
                  <option value={protocol.value}>{protocol.name}</option>
                {/each}
              </select>
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Select the protocol</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>

        <div>
          <Form.Fieldset {form} name="action">
            <Form.Legend>Action</Form.Legend>
            <RadioGroup active="variant-filled-secondary">
              {#each actionOptions as action}
                <Form.Control let:attrs>
                  <RadioItem
                    {...attrs}
                    bind:group={$form.action}
                    value={action.value}
                  >
                    <Form.Label class="label">{action.label}</Form.Label>
                  </RadioItem>
                </Form.Control>
              {/each}
            </RadioGroup>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Select the action</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Fieldset>
        </div>

        <div>
          <Form.Fieldset {form} name="direction">
            <Form.Legend>Direction</Form.Legend>
            <RadioGroup active="variant-filled-secondary">
              {#each directionOptions as direction}
                <Form.Control let:attrs>
                  <RadioItem
                    {...attrs}
                    bind:group={$form.direction}
                    value={direction.value}
                  >
                    <Form.Label class="label">{direction.label}</Form.Label>
                  </RadioItem>
                </Form.Control>
              {/each}
            </RadioGroup>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Select the direction</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Fieldset>
        </div>

        <div class="col-span-2">
          <Form.Field {form} name="appId">
            <Form.Control let:attrs>
              <Form.Label class="label">App ID</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                placeholder="Enter App ID..."
                bind:value={$form.appId}
              />
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter the App ID</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>

        <div class="col-span-2">
          <Form.Field {form} name="throttleRate">
            <Form.Control let:attrs>
              <RangeSlider
                {...attrs}
                bind:value={$form.throttleRate}
                min={0}
                max={100}
                step={1}
                ticked
              >
                <div class="flex justify-between items-center">
                  <Form.Label class="label">Bandwidth limit</Form.Label>
                  <div class="text-xs">{$form.throttleRate} /100</div>
                </div>
              </RangeSlider>
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Set Bandwidth limit</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>

        <div class="col-span-2">
          <Form.Field {form} name="weight">
            <Form.Control let:attrs>
              <Form.Label class="label">Weight</Form.Label>
              <input
                type="number"
                class="input data-[fs-error]:input-error"
                {...attrs}
                min={0}
                max={1000}
                bind:value={$form.weight}
              />
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter Weight (0-1000)</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>

        <div class="col-span-2">
          <Form.Field {form} name="shared">
            <Form.Control let:attrs>
              <SlideToggle
                active="variant-filled-secondary"
                size="md"
                {...attrs}
                bind:checked={$form.shared}
              >
                <Form.Label class="inline-block w-[100px] text-left">
                  {$form.shared ? 'Shared' : 'Not Shared'}
                </Form.Label>
              </SlideToggle>
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Toggle if the rule is shared</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
      </section>
      <footer class="card-footer flex justify-end">
        <button
          type="submit"
          class="btn variant-filled-secondary"
          disabled={!$tainted || !$form.valid || $submitting}
        >
          {#if $timeout}
            <MoreHorizontal class="m-2 h-4 w-4 animate-ping" />
          {:else if $delayed}
            <Loader class="m-2 h-4 w-4 animate-spin" />
          {:else}
            Create Rule
          {/if}
        </button>
      </footer>
    </form>
  </section>

  <section class="space-y-4">
    <!-- Debug section -->
    <DebugShell label="form-data">
      <SuperDebug
        label="Miscellaneous"
        status={false}
        data={{
          message: $message,
          submitting: $submitting,
          delayed: $delayed,
          tainted: $tainted,
        }}
      />
      <br />
      <SuperDebug label="Form" data={$form} />
      <br />
      <SuperDebug label="Errors" status={false} data={$errors} />
      <br />
      <SuperDebug label="Constraints" status={false} data={$constraints} />
    </DebugShell>
  </section>
</div>
