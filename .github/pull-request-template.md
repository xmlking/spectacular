# Required Checks

- [ ] Lint pass `pnpm check`
- [ ] Code format `pnpm format`
- [ ] Unit tested
- [ ] E2E tested

### Commit message format

This project requires at least one commit per PR to follow the below format.  
Commit type: [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test]

| Commit message                                                                                                     | Release type     |
| ------------------------------------------------------------------------------------------------------------------ | ---------------- |
| `fix(component name): short description of change`                                                                 | Patch Release    |
| `feat(component name): short description of change`                                                                | Feature Release  |
| `feat(component name): short description of change`<br><br>`BREAKING CHANGE: Long description of what is breaking` | Breaking Release |
| `ci(component name): short description of change`                                                                  | Feature Release  |
