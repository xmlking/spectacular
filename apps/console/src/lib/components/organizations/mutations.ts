import { graphql } from '$houdini';

export const CreateOrganization = graphql(`
    mutation CreateOrganization($data: organizations_insert_input!) {
      insert_organizations_one(object: $data) {
        ...Search_Organizations_insert @prepend
      }
    }
  `);

export const UpdateOrganization = graphql(`
    mutation UpdateOrganization($id: uuid!,  $data: organizations_set_input!) {
      update_organizations_by_pk(pk_columns: {id: $id}, _set: $data) {
        displayName
      }
    }
  `);

export const DeleteOrganization = graphql(`
    mutation DeleteOrganization($id: uuid! ) {
       delete_organizations_by_pk(id: $id) {
        ...Search_Organizations_remove
      }
    }
  `);
