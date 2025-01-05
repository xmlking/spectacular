import { graphql } from '$houdini';

export const UpdateOrganizationDetails = graphql(`
    mutation UpdateOrganizationDetails($id: uuid!,  $data: organizations_set_input!) {
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
