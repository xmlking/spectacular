# Hasura Roles

## Roles

Every table or view can have permission rules defined for users based on user **role**. You define your own
roles in the Hasura GraphQL Engine and then create permissions for each of them.

Recommended roles:

- **Users**: users who are using the application as a starting point for their work.
- **Supervisors**: users who are mainly using the application to manage users and their access of their _organization_.
- **Administrators**: this users are able to grant additional organizations or departments and elect supervisors.

| Role       | Description                                                            | Allowed Activity                                                     |
| ---------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------- |
| anonymous  | A user who is not logged-in                                            | Only read from some restricted tables/views                          |
| user       | A user who is logged in                                                | Allow access to personally created data                              |
| supervisor | A user that has access to other users' data with in their organization | Allow access to personally created data or their organization's data |
| manager    | A user that has access to any users' data across all organizations     | Allow access to all users' data                                      |

See [this section](https://hasura.io/docs/latest/auth/authorization/permissions/) on how to configure permissions.

By default, users have two allowed roles:

- user (default)
- me

### The admin role

By default, there is an `admin` role that can perform any operation on any table.
For our case `admin` is only used for back channel management app.
For customer facing apps we use `public`, `user`, `supervisor`, `manager` roles.

### Assign Allowed Roles

It’s possible to give users a subset of allowed roles during signup.

**Example:** Only set the `supervisor` role (includeing standard `user`, `me` roles) for the user’s allowed roles:

```js
await nhost.auth.signUp({
  email: 'joe@example.com',
  password: 'secret-password'
  options: {
    allowedRoles: ['user','me','supervisor']
  }
})
```

### Set Role for GraphQL Requests

When no role is specified, the user’s default role will be used:

```js
await nhost.graphql.request(QUERY, {});
```

If you want to make a GraphQL request using a specific role, you can do so by using the `x-hasura-role` header, like this:

```js
await nhost.graphql.request(
	QUERY,
	{},
	{
		headers: {
			'x-hasura-role': 'me'
		}
	}
);
```

## Reference

- [Authentication and authorization in multi-tenancy B2B scenarios](https://zitadel.com/docs/guides/solution-scenarios/b2b)
