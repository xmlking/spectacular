import { GetOrganizationsStore } from '$houdini';
import { error } from '@sveltejs/kit';

const getOrganizationsStore = new GetOrganizationsStore();

export async function load(event) {
  const { errors, data } = await getOrganizationsStore.fetch({
    event,
    blocking: true,
  });

  if (errors) {
    for (const error of errors) {
      console.log('list Organizations api error', error);
    }

    return { status: 500 };
  }
  const OrganizationsList = data?.organizations;
  if (!OrganizationsList) error(404, 'Organizations not found');
  return { OrganizationsList };
}
