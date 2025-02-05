<script lang="ts">
import * as m from '$i18n/messages';
import type { SearchOrganization } from '$lib/schema/organization.js';
import { searchOrganizationKeys as keys } from '$lib/schema/organization.js';
import { getLoadingState } from '$lib/stores/loading';
import type { PartialGraphQLErrors, Subject } from '$lib/types';
import { AppBar } from '@skeletonlabs/skeleton';
import { DebugShell, GraphQLErrors } from '@spectacular/skeleton/components';
import { Alerts, ErrorMessage } from '@spectacular/skeleton/components/form';
import { Logger } from '@spectacular/utils';
import * as Form from 'formsnap';
import { LoaderIcon, MoreHorizontalIcon, ScaleIcon, SearchIcon, ShieldCheckIcon } from 'lucide-svelte';
import SuperDebug, { superForm, type SuperValidated } from 'sveltekit-superforms';

const log = new Logger('org:search:form:component');

export let formInitData: SuperValidated<SearchOrganization>;

// Variables
const loadingState = getLoadingState();

// Search form
const form = superForm(formInitData, {
  dataType: 'json',
  taintedMessage: null,
  syncFlashMessage: false,
  resetForm: true,
  onError({ result }) {
    // the onError event allows you to act on ActionResult errors.
    // TODO:
    // message.set(result.error.message)
    log.error('organization superForm error:', { result });
  },
});
const { form: formData, delayed, allErrors, errors, constraints, message, tainted, posted, submitting, timeout } = form;

let gqlErrors: PartialGraphQLErrors;

// Reactivity
$: invalid = $allErrors.length > 0;
$: loadingState.setFormLoading($delayed);
</script>

<!-- Form Level Errors / Messages -->
<Alerts errors={$errors._errors} message={$message} />
<!-- GraphQL Errors  -->
{#if gqlErrors}
  <GraphQLErrors errors={gqlErrors} />
{/if}
<!-- Form -->
<form data-sveltekit-noscroll>
  <AppBar
    gridColumns="grid-cols-3"
    slotLead="place-content-start !justify-start"
    slotTrail="place-content-end"
  >
    <svelte:fragment slot="lead">
      <ShieldCheckIcon />
      <h3 class="h3 pl-2 hidden md:block">Organizations</h3>
    </svelte:fragment>

    <div
      class="input-group input-group-divider grid-cols-[auto_1fr_auto]"
      class:input-error={invalid}
    >
      <div class="input-group-shim" class:input-error={invalid}>
        <SearchIcon size={17} />
      </div>
      <Form.Field {form} name={keys.displayName}>
        <Form.Control let:attrs>
          <input
            type="search"
            class="data-[fs-error]:input-error hidden md:block"
            placeholder="Display Name"
            autocomplete="off"
            spellcheck="false"
            autocorrect="off"
            {...attrs}
            bind:value={$formData.displayName}
          />
        </Form.Control>
      </Form.Field>
       <button type="submit" class="variant-filled">Search</button>
    </div>

    <!-- TODO: sys:admin should be able to lookup an userId and use it as OwnerId -->
    <!-- <svelte:fragment slot="trail">
      <a
        href="/admin/organizations/create"
        class="btn variant-filled"
        data-sveltekit-preload-data="hover">Add Organization</a
      >
    </svelte:fragment> -->
  </AppBar>
  <input name={keys.limit} bind:value={$formData.limit} type="hidden" />
  <input name={keys.offset} bind:value={$formData.offset} type="hidden" />
  <ErrorMessage error={$errors?.displayName?.[0]} />
  <ErrorMessage error={$errors?.limit?.[0]} />
  <ErrorMessage error={$errors?.offset?.[0]} />
</form>

<DebugShell label="search-form-data">
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
