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

//delete socail connect
export const deleteSocialConnect = graphql(`
    mutation DeleteAuthUserProvider($id: uuid!) {
      deleteAuthUserProvider(id: $id) {
        userId
      }
    }
  `);

export const deletePersonalAccessToken = graphql(`
    mutation DeletePersonalAccessToken($id: uuid!) {
      deleteAuthRefreshToken(id: $id) {
        ...Personal_Access_Tokens_remove @allLists
      }
    }
  `);

export const deleteSecurityKey = graphql(`
    mutation RemoveSecurityKey($id: uuid!) {
      deleteAuthUserSecurityKey(id: $id) {
        ...Security_Keys_remove @allLists
      }
    }
  `);
