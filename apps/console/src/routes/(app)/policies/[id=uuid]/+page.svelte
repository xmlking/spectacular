<script lang="ts">
import { DebugShell } from '@spectacular/skeleton';
import { Logger } from '@spectacular/utils';
import SuperDebug, { superForm } from 'sveltekit-superforms';

export let data;

const log = new Logger('routes:policies:create');

const superform = superForm(data.form, {
  dataType: 'json',
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
  isTainted,
  tainted,
  allErrors,
  reset,
  submitting,
  capture,
  restore,
} = superform;
export const snapshot = { capture, restore };
</script>


<DebugShell label="form-data">
  <SuperDebug
    label="Miscellaneous"
    status={false}
    data={{
      message: $message,
      submitting: $submitting,
      delayed: $delayed
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

