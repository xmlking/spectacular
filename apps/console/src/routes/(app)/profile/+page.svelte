<script lang="ts">
import { Debug } from '@spectacular/skeleton/components';
import { Settings } from 'lucide-svelte';
import Cookies from 'js-cookie'
import { nhost, user } from '$lib/stores/user';
import { goto } from '$app/navigation';
import { NHOST_SESSION_KEY } from '$lib/constants.js';
  import type { AuthErrorPayload } from '@nhost/nhost-js';

export let data

  let email: string
  let error: AuthErrorPayload | null
  const handleSubmit = async () => {


    const { session, error: signInError } = await nhost.auth.signUp({ email, securityKey: true })

    if (session) {
      Cookies.set(NHOST_SESSION_KEY, btoa(JSON.stringify(session)), { path: '/' })
      goto('/protected/todos')
    } else {
      error = signInError
    }
  }
</script>

<svelte:head>
  <title>Datablocks | Profile</title>
  <meta name="description" content="Account Profile" />
</svelte:head>

<div class="page-container">
  <div class="page-section">
    <h2 class="h2">Profile</h2>
    <Debug data={$user} />
  </div>
  <div class="page-section">
    <h3 class="h3">WebAuthn</h3>
      <div class="card p-4">
      <title>Security keys</title>
      <table >
        <colgroup>
          <col />
          <col width="20%" />
        </colgroup>
        <!-- <tbody>
          {list.map(({ id, nickname }) => (
            <tr key={id}>
              <td>{nickname || id}</td>
              <td>
                <button type="button" class="btn variant-filled" on:click={() => handleRemoveKey(id)} color="red">
                  <Settings />
                </button>
              </td>
            </tr>
          ))}
        </tbody> -->
      </table>
        <form class="space-y-4" on:submit|preventDefault={handleSubmit}>
          <input
            bind:value={email}
            placeholder='email'
            class="block w-full p-3 border rounded-md border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button type="submit" class="btn variant-filled">Add a new device</button>

      </form>
    </div>
  </div>
</div>

