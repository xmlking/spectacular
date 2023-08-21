import envPub from '$lib/variables/variables';

export function getOrg(email: string | null | undefined) {
	// TODO: define mapping rules from subject to organization
	let org = envPub.PUBLIC_ORGANIZATION;
	if (email?.endsWith('@gmail.com')) org = 'chinthagunta'; // HINT: Order important
	if (email?.endsWith('@example.com')) org = 'example';
	return org;
}
