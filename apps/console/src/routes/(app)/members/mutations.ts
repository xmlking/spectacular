import { graphql } from '$houdini';

export const AddMember = graphql(`
    mutation AddMember($data: memberships_insert_input!) {
      insert_memberships_one(object: $data) {
        ...List_Members_insert @prepend @allLists
      }
    }
  `);

export const UpdateMember = graphql(`
    mutation UpdateMember($orgId: uuid!, $userId: uuid!, $role: String!) {
      update_memberships_by_pk(pk_columns: {orgId: $orgId, userId: $userId}, _set: { role: $role }) {
        orgId
        userId
        role
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
