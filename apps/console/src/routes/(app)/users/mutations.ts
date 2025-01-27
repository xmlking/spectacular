import { graphql } from '$houdini';

export const UpdateUser = graphql(`
    mutation UpdateUser($id: uuid!,  $data: users_set_input!) {
      updateUser(pk_columns: {id: $id}, _set: $data) {
        displayName
      }
    }
  `);

export const DeleteUser = graphql(`
    mutation DeleteUser($id: uuid!) {
      #  deleteUser(id: $id) {
      #   ...Search_Users_remove
      # }
      updateUser(pk_columns: {id: $id}, _set: {}) {
        displayName
      }
    }
  `);
