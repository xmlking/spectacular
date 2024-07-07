# Houidini Role Plugin

Inspired by [grafbase-houdini](https://github.com/grafbase/grafbase/tree/main/packages/grafbase-houdini) plugin

## Setup

1. Add `@spectacular/role-houdini` plugin to `houdini.config.js`

  ```js
  const config = {
    plugins: {
      'houdini-svelte': {},
      '@spectacular/role-houdini': {}
    },
  }
  ```

1. Add Role directive to any GLQ. e.g., `@role(name: "user")`

  ```gql
  query GetUser($userId: uuid!) @role(name: "user") {
    user(id: $userId) {
      ...UserDetailsFragment @loading
      userOrgRoles(order_by: {organization: asc}) {
        organization
        role
        isDefaultRole
      }
    }
  }

```
