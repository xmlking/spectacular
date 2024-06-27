<script lang="ts" context="module">
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import type { FormPath } from "sveltekit-superforms";

  type T = Record<string, unknown>;
  type U = unknown;
</script>

<script
  lang="ts"
  generics="T extends Record<string, unknown>, U extends FormPath<T>"
>
  import {
    Field,
    type FieldProps,
    FieldErrors,
    Control,
    Label,
  } from "formsnap";
  import type { SuperForm } from "sveltekit-superforms";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type $$Props = FieldProps<T, U>;

  export let form: SuperForm<T>;
  export let name: U;
  export let placeholder: string;

  let { form: formData, tainted, allErrors } = form;
</script>

<Field {form} {name}>
  <Control let:attrs>
    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
      <span />
      <input
        {...attrs}
        type="text"
        placeholder={placeholder ?? ""}
        bind:value={$formData[name]}
      />
      <button
        disabled={!$tainted || $allErrors.length >= 1}
        class={!$tainted || $allErrors.length >= 1
          ? "variant-ghost"
          : "variant-filled-primary"}>✚</button
      >
    </div>
  </Control>
  <FieldErrors let:errors let:errorAttrs>
    <ul class="list-disc pl-4 text-red-500 dark:text-red-400">
      {#each errors as error}
        <li {...errorAttrs}>{error}</li>
      {/each}
    </ul>
  </FieldErrors>
</Field>
