# Hasura Roles

## Roles

Every table or view can have permission rules defined for users based on user **role**. You define your own
roles in the Hasura GraphQL Engine and then create permissions for each of them.

For example:

| Role       | Description                                                        | Allowed Activity                            |
| ---------- | ------------------------------------------------------------------ | ------------------------------------------- |
| anonymous  | user who is not logged-in                                          | Only read from some restricted tables/views |
| user       | user who is logged in                                              | CRUD on data that belongs to self           |
| supervisor | user that has access to all users' data with in their organization | CRUD on all users' data in organization     |
| manager    | user that has access to all users' data                            | CRUD on all users' data                     |

See [this section](https://hasura.io/docs/latest/auth/authorization/permissions/) on how to configure permissions.

### The admin role

By default, there is an `admin` role that can perform any operation on any table.
For our case `admin` is only used for back channel management app.
For customer facing apps we use `anonymous`, `user`, `supervisor`, `manager` roles.
