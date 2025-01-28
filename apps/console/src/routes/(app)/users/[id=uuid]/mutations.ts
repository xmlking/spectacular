import { graphql } from '$houdini';

export const UpdateUserDetail = graphql(`
    mutation UpdateUserDetail($id: uuid!,  $data: users_set_input!) {
      updateUser(pk_columns: { id: $id },  _set: $data) {
      displayName
      phoneNumber
      locale
      note: metadata(path: "note")
      avatarUrl
      }
    }
  `);

export const AddUserGroup = graphql(`
  mutation AddUserGroup($userId: uuid!, $groupId: uuid!) {
    insert_user_groups_one(object: {userId: $userId, groupId: $groupId}) {
      userId
      groupId
    }
  }
  `);

export const DeleteUserGroup = graphql(`
  mutation DeleteUserGroup($userId: uuid!, $groupId: uuid!) {
    delete_user_groups_by_pk(groupId: $groupId, userId: $userId) {
      userId
      groupId
    }
  }
  `);
