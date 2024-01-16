# dotenv

## Files under version control

The main point here is not to commit production database passwords, API keys and other sensitive things to your source code repository,
but it's still nice to have default database connections, ports, hosts, etc., for development and testing purposes to keep your code clean and simple.

Understanding the above, we have the following approach:

You can keep all the fallback values in the default `.env` file, that (if exists) will always be loaded by default.
Also, it is a good place to have all the application used environment variables there, thus having a reference of environment variables that are used by your application on the whole.
So it is a good reason to share the `.env` file with other developers in your team, but keep all the sensitive data on your own (or production) machine locally in the `.env*.local` files.

It is not necessary, but also a good practice to use `NODE_ENV` to control the environment to run your application in.
And if you follow this practice you can keep the `NODE_ENV`-specific defaults in your `.env.development`, `.env.test`, `.env.production` files sharing them with your team as well.
Any `NODE_ENV`-specific `.env.*` file's values can also be overwritten in the appropriate `.env.*.local` file (i.e. `.env.development.local`, `.env.test.local`, `.env.production.local`).

Summarizing the above, you can have the following `.env*` files in your project:

 * `.env` – for default (fallback) values, **tracked** by VCS
 * `.env.development` – for development environment, **tracked** by VCS
 * `.env.test` – for test environment, **tracked** by VCS
 * `.env.production` – for production environment, **tracked** by VCS
 * `.env.local` – for individual default values, **ignored** by VCS
 * `.env.development.local` – for individual development environment values, **ignored** by VCS
 * `.env.test.local` – for individual test environment values, **ignored** by VCS
 * `.env.production.local` – for production environment values (DB passwords, API keys, etc.), **ignored** by VCS

Note that `.env.*` file names may vary in your project depending on your own needs/preferences, just keep in mind that `.env*.local` files should be untracked (ignored) by your version control system.

Here is an example of the `.gitignore` (or `.hgignore`) file entry to keep it clear:

```gitignore
# local .env* files
.env.local
.env.*.local
```


## Variables overwriting/priority

Since multiple `.env*` files are loaded simultaneously, all the variables defined in these files are merged in the following order:

1) The `.env` file has the lowest priority. _Keep the most default (fallback) values there_;
2) The `.env.local` file has a priority over the `.env` (except when `NODE_ENV=test`, in which case this file is not loaded). _Create it if you want to overwrite the default values for your own environment-specific needs_;
3) `NODE_ENV`-specific env files (like `.env.development`, `.env.test`, etc.) have a priority over the default `.env` and `.env.local` files. _Keep `NODE_ENV`-specific environment variables there_;
4) `NODE_ENV`-specific local env files (`.env.development.local`, `.env.production.local`, etc.) have the highest priority over all the env files. _As with `.env.local`, create them only if you need to overwrite `NODE_ENV`-specific values for your own environment-specific needs_;
5) Environment variables that are already set will not be overwritten, that means that the command line variables have a higher priority over all those defined in env files;

Note that the `.env*.local` files should be ignored by your version control system (refer the [Files under version control](#files-under-version-control) section below to learn more), and you should have the `.env.production.local` file only on your production deployment machine.

## Reference
- [dotenv-flow](https://github.com/kerimdzhanov/dotenv-flow)
