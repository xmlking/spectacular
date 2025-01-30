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

export const AcceptInvitation = graphql(`
    mutation AcceptInvitation($email: citext!, $orgId: uuid!) {
      update_invitations_by_pk(pk_columns: { email: $email, orgId: $orgId }, _set: { status: accepted }) {
        email
        orgId
      }
    }
  `);

export const DeclineInvitation = graphql(`
    mutation DeclineInvitation($email: citext!, $orgId: uuid!) {
      update_invitations_by_pk(pk_columns: { email: $email, orgId: $orgId }, _set: { status: declined }) {
        email
        orgId
      }
    }
  `);

export const LeaveOrganization = graphql(`
  mutation LeaveOrganization($userId: uuid!, $orgId: uuid!) {
     delete_memberships_by_pk(userId: $userId, orgId: $orgId) {
      userId
      orgId
      # ...User_Org_Memberships_remove
    }
  }
`);
