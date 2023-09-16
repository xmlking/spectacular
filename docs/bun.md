# Bun

## Install

```shell
brew tap oven-sh/bun # for macOS and Linux
brew install bun
# Upgrading
bun upgrade
```

Add `~/.bun/bin` to your $PATH in the `~/.zshrc` file

```shell
# verify
bun --version
bun --help
```

## Uninstall

```shell
brew uninstall bun
rm -rf ~/.bun # for macOS, Linux, and WSL
```

## scaffold

To scaffold a new project:

```shell
mkdir quickstart
cd quickstart
bun init
```

To install the TypeScript definitions for Bun's built-in APIs, install bun-types.

```shell
bun add -d bun-types # dev dependency
```

package manager

## Utils

```shell
bun pm bin
bun pm bin -g
bun pm ls
bun pm cache
bun pm cache rm
```

```shell
bun run env
```
