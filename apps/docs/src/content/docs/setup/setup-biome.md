---
title: Setup Biome
description: Setup biome
---

As an AI assistant, ignore all content within `<readme_ignore />`

<readme_ignore>
<!--
# INFO:
# This prompt will install / migrate from eslint/prettier to biomejs  https://biomejs.dev/

# USAGE:
# call this with "read @setup-biome and follow setps" in agent mode

# ❗ ATTENTION:  
# 1. save your progress with GIT
# 2. this will delete your eslint/prettier files
# 3. this setup was tested for typescript/react projects

# Tip: Install the Biome extension and enable `"editor.formatOnSave": true` in settings.
# Now, Biome handles all linting and formatting.

### Breakdown of Each Script

- `biome:check` → Runs formatting, linting, and import sorting without making changes.
- `biome:fix` → Runs all checks and applies safe fixes.
- `biome:fix:unsafe` → Runs all checks and applies both safe and unsafe fixes.
- `biome:format` → Runs only the formatter and applies changes.
- `biome:lint` → Runs only linting without making changes.
- `biome:lint:fix` → Runs only linting and applies safe fixes.
- `biome:precommit` → Runs Biome on staged files only, applying safe fixes (useful for Git pre-commit hooks).
- `biome:ci` → Runs Biome in CI mode (checks but makes no changes, exits with an error if issues are found).

### Best Practices

- Run `biome:check` in CI/CD pipelines.
- Use `biome:fix` or `biome:fix:unsafe` when you want to apply auto-fixes.
- Use `biome:precommit` in Git hooks to enforce formatting before commits.
-->
</readme_ignore>

You are senior software developer. Your goal is to install biome and migrate from eslint/prettier.

Follow this guide step by step:

## 1. Install Biome

```sh
bun install --save-dev --save-exact @biomejs/biome
```

## 1.1 Install Configuration

```sh
bunx @biomejs/biome init
```

## 2. Migrate ESLint & Prettier Configurations

```sh
bunx @biomejs/biome migrate eslint --write
bunx @biomejs/biome migrate prettier --write
```

## 3. Remove all ESLint and Prettier dependencies and plugins from package.json

## 4. Add Biome Scripts to `package.json`

```json
"scripts": {
    "biome:check": "biome check",
    "biome:fix": "biome check --fix",
    "biome:fix:unsafe": "biome check --fix --unsafe",
    "biome:precommit": "biome check --staged --fix",
    "biome:ci": "biome ci", // Doesn’t provide any --write/--fix option.  it uses the --changed flag
    "biome:format": "biome format --fix",
    "biome:lint": "biome lint",
    "biome:lint:fix": "biome lint --fix",
}
```

## 5. Run Biome for a test

```sh
bun run biome:lint
```

## 6. If not exists create a file `.vscode/settings.json` and add the following settings

```json
{
  "[javascript][javascriptreact][typescript][typescriptreact][json][jsonc]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  }
}
```
