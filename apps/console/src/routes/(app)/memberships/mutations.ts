import { graphql } from '$houdini';

export const CreateMembership = graphql(`
    mutation CreateMembership($data: memberships_insert_input!) {
      insert_memberships_one(object: $data) {
        ...Search_Memberships_insert @prepend
      }
    }
  `);

export const UpdateMembership = graphql(`
    mutation UpdateMembership($orgId: uuid!, $userId: uuid!, $data: memberships_set_input!) {
      update_memberships_by_pk(pk_columns: {orgId: $orgId, userId: $userId}, _set: $data) {
        orgId
        userId
        role
      }
    }
  `);

export const DeleteMembership = graphql(`
    mutation DeleteeMembership($orgId: OrgIdFromSession!, $userId: uuid!) {
       delete_memberships_by_pk(orgId: $orgId, userId: $userId) {
        ...Search_Memberships_remove
      }
    }
  `);
