/**
 * Map IAM Groups/Roles to App Roles
 * AppRole can be temporarily or permanently applied to a user to give the user bulk permissions for a task.
 * Note: if you get CHUNKING_SESSION_COOKIE (session cookie exceeds allowed 4096 bytes) error,
 * reduce number of app roles returned.
 */
import { Logger } from '@spectacular/utils';
const log = new Logger('middleware:roll-mapper');

// TODO: set managers, testers via environment
const managers = [
  'ed2a9ac6-38bd-4ree-a3c6-f135330fa120', //  aaa
  '4040c505-15d1-49b4-959e-7a625d933aa6', // bbb
  '7fd2d1f0-ffa9-8323-96b0-12f024d8ff23', // ccc
  '4040c505-f3be-44b5-959e-c2b88fbff41d', // ddd
];
const supervisors = [
  'kd2a4ac6-38bd-4ree-a3c6-f135330fa120', //  aaa
  '3040c505-15d1-49b4-959e-7a626d933aa6', // bbb
];
const testers = [
  '7fd2d1f0-0970-959e-15d1-c2b88fbff41d', //  tester
];

/**
 * appRoles
 */
export function appRoles(groups: string[]): string[] {
  // TODO: map groups/roles to subset of ['me', 'user', 'manager', 'tester'] app roles
  // log.debug('appRoles: got groups--->', groups);
  const roles = ['me'];
  groups ? roles.push('user', 'manager') : roles.push('user', 'manager'); // TODO: implement real groups to role mapping
  // if (managers.some((x) => groups.includes(x))) roles.push('manager');
  // if (supervisors.some((x) => groups.includes(x))) roles.push('supervisor');
  // if (testers.some((x) => groups.includes(x))) roles.push('tester');
  return roles;
}
