import { graphql } from '$houdini';

export const createGroup = graphql(`
  mutation CreateGroup($data: groups_insert_input!) {
    insert_groups_one(object: $data) {
      ...List_Groups_insert @prepend
    }
  }
`);

export const UpdateGroup = graphql(`
  mutation UpdateGroup($id: uuid!,  $data: groups_set_input!) {
    update_groups_by_pk(pk_columns: {id: $id}, _set: $data) {
      displayName
    }
  }
`);

export const DeleteGroup = graphql(`
  mutation DeleteGroup($id: uuid! ) {
     delete_groups_by_pk(id: $id) {
      ...List_Groups_remove
    }
  }
`);
