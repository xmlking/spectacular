<script lang="ts">
  import {
    fragment,
    graphql,
    PendingValue,
    type UserOrgRolesFragment,
  } from "$houdini";

  export let user: UserOrgRolesFragment;
  $: data = fragment(user, graphql(`
      fragment UserOrgRolesFragment on users {
        userOrgRoles(order_by: { organization: asc }) @list(name: "User_Org_Roles") @loading {
          organization
          role
          isDefaultRole
        }
      }
  `));
  $: userOrgRoles = $data.userOrgRoles;
</script>

<div class="card p-4">
  <div class="table-container">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Organization</th>
          <th>Role</th>
          <th>isDefaultRole</th>
        </tr>
      </thead>
      <tbody>
        {#each userOrgRoles as role, i}
          {#if role === PendingValue}
            <tr class="animate-pulse">
              <td><div class="placeholder" /></td>
              <td><div class="placeholder" /></td>
              <td><div class="placeholder" /></td>
            </tr>
          {:else}
            <tr>
              <td>{role.organization}</td>
              <td>{role.role}</td>
              <td>{role.isDefaultRole}</td>
            </tr>
          {/if}
        {:else}
          <tr>
            <td colspan="3"
              ><div class="text-center text-gray-500">
                No org roles found.
              </div></td
            >
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
