## Linked Issue

Closes #{issueNumber}

## Description

{description}

## Changsets

Instructions: Changesets automate our changelog. If you modify files in `/packages/ui`, run `pnpm run changeset` in the root of the monorepo, follow the prompts, then commit the markdown file. Changes that add features should be `minor` while chores and bugfixes should be `patch`. Please prefix the changeset message with `feat:`, `fix:` or `chore:`.

## Checklist

Please read and apply all [contribution requirements](https://github.com/xmlking/spectacular/blob/main/CODE_OF_CONDUCT.md).

- [ ] This PR targets the `main` branch
- [ ] Documentation reflects all relevant changes
- [ ] Branch is prefixed with: `docs/`, `feat/`, `chore/`, `fix/`
- [ ] Ensure Svelte and Typescript linting is current - run `pnpm run check`
- [ ] Ensure Prettier linting is current - run `pnpm run format`
- [ ] All test cases are passing - run `pnpm run test`
- [ ] Includes a changeset (if relevant; see above)

### Commit message format

This project requires at least one commit per PR to follow the below format.  
Commit type: [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test]

| Commit message                                                                                             | Release type     |
| ---------------------------------------------------------------------------------------------------------- | ---------------- |
| `fix(module): short description of change`                                                                 | Patch Release    |
| `feat(module): short description of change`                                                                | Feature Release  |
| `feat(module): short description of change`<br><br>`BREAKING CHANGE: Long description of what is breaking` | Breaking Release |
| `ci(module): short description of change`                                                                  | Feature Release  |
