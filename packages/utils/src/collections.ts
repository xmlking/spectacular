/**
 * Groups an array of objects by a specified key.
 * @param arr - The array of objects to group.
 * @param key - The key to group the objects by.
 * @returns An object with keys as the unique values of the specified key and values as arrays of objects with that key value.
 */

export const groupBy = <T extends Record<string, any>, K extends keyof T>(arr: T[], key: K): Record<string, T[]> =>
  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  // biome-ignore lint/style/noCommaOperator: <explanation>
    arr.reduce((acc, item) => ((acc[item[key]] = [...(acc[item[key]] || []), item]), acc), {} as Record<string, T[]>);


export function asArray<T>(x: T | T[]): T[];
export function asArray<T>(x: T | readonly T[]): readonly T[];
export function asArray<T>(x: T | T[]): T[] {
  return Array.isArray(x) ? x : [x];
}

export function findAddedAndRemoved<T>(originalSet: T[], modifiedSet: T[]) {
  const added = modifiedSet.filter((item) => !originalSet.includes(item));
  const removed = originalSet.filter((item) => !modifiedSet.includes(item));

  return { added, removed };
}

if (import.meta.vitest) {
  // RUN: turbo run test --filter=./packages/utils
  // in-source testing
  const { it, expect } = import.meta.vitest;

  it('Test findAddedAndRemoved', async () => {
    const originalSet = ['apple', 'banana', 'orange'];
    const modifiedSet = ['banana', 'grape', 'orange'];

    const { added, removed } = findAddedAndRemoved(originalSet, modifiedSet);

    expect(added).toStrictEqual(['grape']);
    expect(removed).toStrictEqual(['apple']);
  });

    it('Test groupBy', async () => {
      const ungrouped = [
        { branch: 'audi', model: 'q8', year: '2019' },
        { branch: 'audi', model: 'rs7', year: '2020' },
        { branch: 'ford', model: 'mustang', year: '2019' },
        { branch: 'ford', model: 'explorer', year: '2020' },
        { branch: 'bmw', model: 'x7', year: '2020' },
      ];
      const grouped = {
        audi: [
          { branch: 'audi', model: 'q8', year: '2019' },
          { branch: 'audi', model: 'rs7', year: '2020' },
        ],
        bmw: [{ branch: 'bmw', model: 'x7', year: '2020' }],
        ford: [
          { branch: 'ford', model: 'mustang', year: '2019' },
          { branch: 'ford', model: 'explorer', year: '2020' },
        ],
      };

      expect(groupBy(ungrouped, 'branch')).toStrictEqual(grouped);
    });


}
