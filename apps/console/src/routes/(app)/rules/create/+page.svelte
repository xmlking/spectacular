<script lang="ts">
	import Footer from './../../../../lib/components/layout/footer.svelte';

import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { graphql, type policies_insert_input } from '$houdini';
import * as m from '$i18n/messages';
import { searchRulesFn } from '$lib/api/search-rules';
import { searchSubjects } from '$lib/api/search-subjects';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { i18n } from '$lib/i18n.js';
import { createRuleSchema } from '$lib/schema/rule';
import { createRuleKeys as keys } from '$lib/schema/rule';
import { getLoadingState } from '$lib/stores/loading';
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



const log = new Logger('rules.create.browser');

// Variables
// export let data: PageData;
const toastStore = getToastStore();
const loadingState = getLoadingState();
let gqlErrors: Partial<GraphQLError>[] | null;
// let subjects: Subject[] | undefined;

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
      createdBy
      createdAt
      updatedAt
      updatedBy
      organization
    }
  }
`);




const superform = superForm(defaults(zod(createRuleSchema)), {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  syncFlashMessage: false,
  resetForm: true,
  delayMs: 100,
  timeoutMs: 4000,
  validators: zodClient(createRuleSchema),
  async onUpdate({ form, cancel }) {
    if (!form.valid) return;
  }

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
  posted,
  allErrors,
  reset,
  submitting,
  timeout,
  capture,
  restore,
} = superform;

</script>

<svelte:head>
  <title>Rules</title>
  <meta name="description" content="rules" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Rules</h1>
    <p>create Rules</p>
  </section>

  <section class="space-y-4">
    <!-- Form Level Errors / Messages -->
    <Alerts errors={$errors._errors} message={$message} />
    <!-- GraphQL Errors  -->
    <GraphQLErrors errors={gqlErrors} />
    <!-- Update User Details Form -->

    <form class="card md:space-y-8" method="POST" use:enhance>
      <header class="card-header">
          <div class="text-xl">Create Rule</div>
          <!-- <div>Create new Rule</div> -->
      </header>

      <section class="p-4 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
        <div class="col-span-2">
          <Form.Field form={superform} name='rule.displayName'>
            <Form.Control let:attrs>
              <Form.Label class="label">Display Name</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}

                placeholder="Display Name"

              />
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter the displayName</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>

        <div class="col-span-4">
          <Form.Field form={superform} name='rule.description'>
            <Form.Control let:attrs>
              <Form.Label class="label">Description</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                placeholder="Display Name"
              />
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter the description</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="col-span-3">
          <Form.Field form={superform} name='rule.tags'>
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
              <InputChip {...attrs}   placeholder="Enter tags..." class="input data-[fs-error]:input-error"  />
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter the tags</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="col-span-3">
          <Form.Field form={superform} name='rule.annotations'>
            <Form.Control let:attrs>
              <Form.Label class="label">Annotations</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                placeholder="Enter Annotations..."
              />
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Format: key1=>value1 (or) "key2" => "value2 with space"</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="col-span-3">
          <Form.Field form={superform} name='rule.source'>
            <Form.Control let:attrs>
              <Form.Label class="label">Source</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                placeholder="Enter Source..."
              />
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter the source</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="col-span-3">
          <Form.Field form={superform} name='rule.sourcePort'>
            <Form.Control let:attrs>
              <Form.Label class="label">Source port</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                placeholder="Enter Source port..."
              />
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter the source port</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="col-span-3">
          <Form.Field form={superform} name='rule.destination'>
            <Form.Control let:attrs>
              <Form.Label class="label">Destination</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                placeholder="Enter Destination..."
              />
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter the destination</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="col-span-3">
          <Form.Field form={superform} name='rule.destinationPort'>
            <Form.Control let:attrs>
              <Form.Label class="label">Destination port</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                placeholder="Enter Destination port..."

              />
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter the destination port</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div>
          <Form.Field form={superform} name='rule.protocol'>
            <Form.Control let:attrs>
              <Form.Label class="label">Protocols</Form.Label>
              <select
                class="input data-[fs-error]:input-error"
                {...attrs}

              >
               {#each protocols as protocol}
                <option value={protocol.value}>{protocol.name}</option>
              {/each}
            </select>
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter Protocols</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div>
          <Form.Fieldset form={superform} name='rule.action'>
            <Form.Legend>Action</Form.Legend>
            <RadioGroup active="variant-filled-secondary" >
            {#each actionOptions as action}
            <Form.Control let:attrs>

            </Form.Control>
            {/each}
            </RadioGroup>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Select action</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Fieldset>
        </div>
        <div>
          <Form.Fieldset form={superform} name='rule.direction'>
            <Form.Legend>Direction</Form.Legend>
            <RadioGroup active="variant-filled-secondary" >
            {#each directionOptions as direction}
            <Form.Control let:attrs>

            </Form.Control>
            {/each}
            </RadioGroup>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Select direction</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Fieldset>
        </div>
        <div class="col-start-5 flex justify-end">
          <Form.Field form={superform} name='rule.shared'>
            <Form.Control let:attrs>
              <SlideToggle
                active="variant-filled-secondary"
                size="md"
                {...attrs}

              >
              <Form.Label class="inline-block w-[100px] text-left"> Shared</Form.Label>
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

              />
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter Weight</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>

        <div class="col-span-4">
          <Form.Field form={superform} name='rule.appId'>
            <Form.Control let:attrs>
              <Form.Label class="label">App id</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                placeholder="Display Name"
              />
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">If no app is selected, throttle rate applied system wide.</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="col-span-2">
          <Form.Field form={superform} name='rule.throttleRate'>
            <Form.Control let:attrs>
              <RangeSlider
                 {...attrs}
                 min={0}
                 max={100}
                 step={1}
                 ticked
              >
                <div class="flex justify-between items-center">
                  <Form.Label class="label">Bandwidth limit</Form.Label>
                  <div class="text-xs"> </div>
                </div>
            </RangeSlider>
            </Form.Control>
            <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Set Bandwidth limit</Form.Description>
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="flex justify-start">
          <Form.Field form={superform} name='active'>
            <Form.Control let:attrs>
              <SlideToggle
                active="variant-filled-secondary"
                size="md"
                {...attrs}
              >
              <Form.Label class="inline-block w-[100px] text-left">Active </Form.Label>
						</SlideToggle>
            </Form.Control>
            <!-- <Form.Description>Temporarily disable policy</Form.Description> -->
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="col-start-5">

        </div>
        <div class="col-end-auto">

        </div>

      </section>





      <footer class="card-footer flex justify-end">

      </footer>
    </form>
  </section>

  <section class="space-y-4">

  </section>


</div>
