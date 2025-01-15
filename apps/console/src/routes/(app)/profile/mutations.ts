import { graphql } from '$houdini';

export const UpdateUserDetails = graphql(`
    mutation UpdateUserDetails($id: uuid!,  $data: users_set_input!) {
      updateUser(pk_columns: { id: $id },  _set: $data) {
      displayName
      phoneNumber
      locale
      note: metadata(path: "note")
      avatarUrl
      }
    }
  `);
