import { graphql } from '$houdini';

export const AddUser_Group = graphql(`
   mutation AddUserGroup($group: user_groups_insert_input!) {
  insert_user_groups_one(object: $group) {
    userId
    groupId
  }
}

  `);

export const DeleteUser_Group = graphql(`
    mutation DeleteUserGroups($userId: uuid!, $groupId: uuid!) {
    delete_user_groups_by_pk(groupId: $groupId, userId: $userId) {
    userId
    groupId
  }
    }
  `);
