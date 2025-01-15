import { graphql } from '$houdini';

// FIXME:  ...Search_Rules_insert @when(shared: false)
// `shared` has to be the arguments of the field marked with @list ???
export const CreatePolicy = graphql(`
    mutation CreatePolicy($data: policies_insert_input!) {
      insert_policies_one(object: $data) {
        ...Search_Policies_insert @prepend
        rule {
          ...Search_Rules_insert @when(shared: false) @prepend
        }
      }
    }
  `);

export const DeleteRule = graphql(`
    mutation DeleteRule($id: uuid!) {
      delete_rules_by_pk(id: $id) {
        ...Search_Rules_remove
        policies {
          id @policies_delete
        }
      }
    }
  `);

export const DeletePolicy = graphql(`
    mutation DeletePolicy($id: uuid!) {
      delete_policies_by_pk(id: $id) {
        ...Search_Policies_remove
      }
    }
  `);
