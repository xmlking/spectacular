import { randomBytes, pbkdf2Sync } from 'node:crypto';

export enum role {
	user = 'user',
	me = 'me',
	manager = 'manager',
	supervisor = 'supervisor',
	engine = 'engine',
	tester = 'tester'
}

export class User {
	name: string;
	org: string;
	roles: role[];
	// Creating a unique salt for a particular user
	#salt = randomBytes(16).toString('hex');
	#hash: string;

	constructor(password: string, name: string, org: string, roles: role[] = [role.user]) {
		this.name = name;
		this.org = org;
		this.roles = roles;
		// Hashing user's salt and password with 1000 iterations,
		this.#hash = pbkdf2Sync(password, this.#salt, 1000, 64, `sha512`).toString(`hex`);
	}

	validPassword(password: string) {
		// To verify the same - salt (stored in DB) with same other parameters used while creating hash (1000 iterations, 64 length and sha512 digest)
		const hash = pbkdf2Sync(password, this.#salt, 1000, 64, `sha512`).toString(`hex`);
		// check if hash (stored in DB) and newly generated hash (newHash) are the same
		return this.#hash === hash;
	}
}

export default new Map<string, User>([
	['user1@demo.com', new User('user1-pass', 'User1 Demo', 'chinthagunta')],
	['user2@demo.com', new User('user2-pass', 'User2 Demo', 'chinthagunta')],
	['tester@demo.com', new User('tester-pass', 'Tester Demo', 'chinthagunta', [role.user, role.tester])],
	['manager@demo.com', new User('manager-pass', 'Manager Demo', 'chinthagunta', [role.user, role.manager])],
	['supervisor@demo.com', new User('supervisor-pass', 'Supervisor Demo', 'chinthagunta', [role.user, role.supervisor])]
]);
