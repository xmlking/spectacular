# Hasura Roles

## Roles

Every table or view can have permission rules defined for users based on user **role**. You define your own
roles in the Hasura GraphQL Engine and then create permissions for each of them.

For example:

| Role      | Description                                 | Allowed Activity                            |
| --------- | ------------------------------------------- | ------------------------------------------- |
| anonymous | A user who is not logged-in                 | Only read from some restricted tables/views |
| user      | A user who is logged in                     | CRUD on data that belongs to them           |
| manager   | A user that has access to other users' data | CRUD on all users' data                     |

See [this section](https://hasura.io/docs/latest/auth/authorization/permissions/) on how to configure permissions.

### The admin role

By default, there is an `admin` role that can perform any operation on any table.
For our case `admin` is only used for back channel management app.
For customer facing apps we use `anonymous`, `user`, `manager` roles.
