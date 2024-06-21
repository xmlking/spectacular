<script lang="ts">
import { Debug } from '@spectacular/skeleton/components';
import { nhost, user } from '$lib/stores/user';
import type { AuthErrorPayload } from '@nhost/nhost-js';

// https://github.com/nhost/nhost/blob/main/examples/react-apollo/src/profile/security-keys.tsx
export let data

  let nickname: string
  let error : AuthErrorPayload | null

  async function  addSecurityKey() {
    console.log({nickname})
    const { key, error: addKeyError } = await nhost.auth.addSecurityKey(nickname)
    // Something unexpected happened
    if (error) {
      console.log(error)
      error = addKeyError
      return
    }
    // Successfully added a new security key
    console.log(key?.id)
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
        <form class="space-y-4" on:submit|preventDefault={addSecurityKey}>
          <input
            bind:value={nickname}
            placeholder='Nickname for the device (optional)'
            class="block w-full p-3 border rounded-md border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button type="submit" class="btn variant-filled">Add a new device</button>
      </form>
    </div>
  </div>
</div>

