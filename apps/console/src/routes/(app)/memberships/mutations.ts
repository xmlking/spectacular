import { graphql } from '$houdini';

export const CreateMembership = graphql(`
    mutation CreateMembership($data: memberships_insert_input!) {
      insert_memberships_one(object: $data) {
        ...Search_Memberships_insert @prepend
      }
    }
  `);

export const UpdateMembership = graphql(`
    mutation UpdateMembership($orgId: uuid!, $userId: uuid!, $role: String!) {
      update_memberships_by_pk(pk_columns: {orgId: $orgId, userId: $userId}, _set: { role: $role }) {
        orgId
        userId
        role
      }
    }
  `);

export const DeleteMembership = graphql(`
    mutation DeleteMembership($orgId: uuid!, $userId: uuid!) {
       delete_memberships_by_pk(orgId: $orgId, userId: $userId) {
        ...Search_Memberships_remove
      }
    }
  `);
