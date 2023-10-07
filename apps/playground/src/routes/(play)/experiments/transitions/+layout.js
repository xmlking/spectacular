/** @type {import('./$types').LayoutLoad} */
export const load = async ({ url }) => {
	return { path: url.pathname };
};
