import { graphql } from '$houdini';

export const UpdateGroupDetails = graphql(`
    mutation UpdateGroupDetails($id: uuid!,  $data: groups_set_input!) {
      update_groups_by_pk(pk_columns: {id: $id}, _set: $data) {
        displayName
      }
    }
  `);

export const DeleteGroup = graphql(`
    mutation DeleteGroup($id: uuid! ) {
       delete_groups_by_pk(id: $id) {
        ...Search_Groups_remove
      }
    }
  `);
