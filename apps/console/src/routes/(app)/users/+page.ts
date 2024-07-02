import { GetUsersStore } from '$houdini';
import { error } from '@sveltejs/kit';

const getUsersStore = new GetUsersStore();

export async function load(event) {
  const { errors, data } = await getUsersStore.fetch({
    event,
    blocking: true,
  });

  if (errors) {
    for (const error of errors) {
      console.log('list subscriber api error', error);
    }
    return { status: 500 };
  }
  const UsersList = data?.users;
  if (!UsersList) error(404, 'Users not found');
  return { UsersList };
}
