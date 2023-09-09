# Turborepo

## Setup

### Setup Remote Caching for Turborepo on Vercel

```shell
npx turbo login
npx turbo link
```

## Usage

```shell
turbo dev --filter=web
turbo dev --filter=docs
```

### Test

```shell
turbo test --filter=helpers
```

### Build

```shell
turbo build  --filter=playground...
turbo build  --filter=playground... --dry
turbo build --filter=playground... --graph
```
