<script lang="ts">
  import type { SuperValidated, Infer } from "sveltekit-superforms";
  import { setError, setMessage, superForm } from "sveltekit-superforms";
  import {
    addWebAuthnKeys,
    webAuthnSchema,
    type WebAuthn,
  } from "$lib/schema/user";
  import InputFieldWithErrors from "./InputFieldWithErrors.svelte";
  import { zod } from "sveltekit-superforms/adapters";
  import { nhost, elevate } from "$lib/stores/user";
  import type { AuthErrorPayload } from "@nhost/nhost-js";
  import { Debug } from "@spectacular/skeleton";

  export let data: SuperValidated<WebAuthn>;

  let error: AuthErrorPayload | null;

  const superform = superForm(data, {
    SPA: true,
    resetForm: true,
    validators: zod(webAuthnSchema),
    async onUpdate({ form }) {
      error = await elevate();
      if (error) {
        console.log(error);
        return;
      }
      const { key, error: addKeyError } = await nhost.auth.addSecurityKey(
        $formData.nickname,
      );
      // Something unexpected happened
      if (error) {
        console.log(error);
        error = addKeyError;
        return;
      }
      // Successfully added a new security key
      console.log(key?.id);
    },
  });

  const {
    allErrors,
    capture,
    constraints,
    delayed,
    enhance,
    errors,
    form: formData,
    message,
    posted,
    restore,
    reset,
    submitting,
    tainted,
  } = superform;
</script>

<Debug
  data={{
    $allErrors,
    $constraints,
    $delayed,
    $errors,
    $formData,
    $message,
    $posted,
    $submitting,
    $tainted,
  }}
  class="mb-5"
/>

{#if $message || $errors._errors}
  <aside class="alert variant-ghost">
    <div class="alert-message">
      {#if $message}
        <h3 class="h3">{message}</h3>
      {:else if $errors._errors}
        <ul class="ml-2 list-outside list-none">
          {#each $errors._errors as gqlErrorMsg}
            <li>{gqlErrorMsg.message}</li>
          {/each}
        </ul>
      {/if}
    </div>
  </aside>
{/if}

<form method="post" use:enhance>
  <InputFieldWithErrors
    form={superform}
    name={addWebAuthnKeys["nickname"]}
    placeholder={"Add a security key"}
  />
</form>
