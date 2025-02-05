import { graphql } from '$houdini';

export const InviteMembers = graphql(`
    mutation InviteMembers($objects: [invitations_insert_input!]!) {
      insert_invitations(objects: $objects) {
        affected_rows
        returning {
          email
          role
          orgId
          updatedAt
        }
#        ...List_Invitations_insert @prepend @allLists
      }
    }
  `);

export const UpdateInvite = graphql(`
  mutation UpdateInvite($orgId: uuid!, $email: citext!, $role: String!) @dedupe(cancelFirst: true) {
    update_invitations_by_pk(pk_columns: {orgId: $orgId, email: $email}, _set: { role: $role }) {
      email
      role
      orgId
      updatedAt
    }
  }
`);

export const DeleteInvite = graphql(`
  mutation DeleteInvite($orgId: uuid!, $email: citext!) {
    delete_invitations_by_pk(orgId: $orgId, email: $email) {
      ...List_Invitations_remove @allLists
    }
  }
`);

export const UpdateMember = graphql(`
    mutation UpdateMember($orgId: uuid!, $userId: uuid!, $role: String!) {
      update_memberships_by_pk(pk_columns: {orgId: $orgId, userId: $userId}, _set: { role: $role }) {
        userId
        orgId
        role
        updatedAt
        user {
          displayName
          avatarUrl
          email
        }
      }
    }
  `);

export const DeleteMember = graphql(`
    mutation DeleteMember($orgId: uuid!, $userId: uuid!) {
       delete_memberships_by_pk(orgId: $orgId, userId: $userId) {
        ...List_Members_remove @allLists
      }
    }
  `);
