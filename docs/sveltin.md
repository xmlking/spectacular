# Sveltin

Sveltin is a CLI (Command Line Interface) created to boost the developers productivity working on <strong>SvelteKit v1.x.x powered static websites</strong>.

## :information_source: SvelteKit versions

> Latest tested SvelteKit version is [1.8.3](https://github.com/sveltejs/kit/releases/tag/%40sveltejs%2Fkit%401.8.3). SvelteKit reached v1.x.x then no more breakings are expected until a new major release. Although we decided to stay sticked to the tested version, you should be able to upgrade SvelteKit to the upcoming minor versions without disruptions

## :mega: Overview

Sveltin is a simple, quick and powerful CLI to:

- Scaffold SvelteKit powered websites
- Generate resources, libs and endpoints
- Add content to the resources
- Generate menu structure, sitemap and rss
- Make your site SEO Ready (Metadata, Json-LD, OpenGraph) in a easy way

Sveltin provides:

- Out-of-the-box support for vanilla CSS, Sass/SCSS, Tailwind CSS, Bulma and Bootstrap
- Ready to use Svelte [components](https://github.com/sveltinio/sveltin-components-library)

## :rocket: Quick Start

With few commands Sveltin flex the muscles 💪

> **NOTE**: each command can be executed in interactive way so do not need to pass arguments and flags to it.

```bash
# Create a project with TailwindCSS support
sveltin init myBlog --css tailwindcss

# Move to the project folder
cd myBlog

# Install all the dependencies
sveltin install

# Create a public page and compose it with Svelte
# (http://localhost:5173/contact)
sveltin new page contact --svelte

# Create a public page and compose it with Markdown
# (http://localhost:5173/about)
sveltin new page about --markdown

# Create a 'posts' resource
sveltin new resource posts

# Add new content to the posts resource
# (http://localhost:5173/posts/getting-started)
sveltin add content getting-started --to posts

# Add a 'category' metadata
# (http://localhost:5173/posts/category)
sveltin add metadata category --to posts --as single

# Run the server
sveltin server
```

## :book: Documentation

Please see the [documentation](https://docs.sveltin.io) for more information about Sveltin.

## :computer: Installation

### :wrench: Prerequisites

- Git
- Node (v16.9.0 or higher is required)

### OSX and Linux via Homebrew

Homebrew will also install Git and Node.

```bash
# Tap a new formula:
brew tap sveltinio/sveltin

# Install:
brew install sveltin
```

### Windows via Scoop

```bash
# Tap a new bucket:
scoop bucket add sveltinio https://github.com/sveltinio/scoop-sveltin.git

# Install:
scoop install sveltinio/sveltin
```

### Go Install

Installation is done by using the `go install` command. In this case, ensure to have **Go (v1.17 or higher) installed** on your machine:

```bash
go install github.com/sveltinio/sveltin@latest
```

### Manually

You can download the pre-compiled binary for you specific OS from the [releases page](https://github.com/sveltinio/sveltin/releases). You will need to copy the and extract the binary, then move it to your local bin folder. Please, refer to the example below:

```bash
curl https://github.com/sveltinio/sveltin/releases/download/${VERSION}/${PACKAGE_NAME} -o ${PACKAGE_NAME}
sudo tar -xvf ${PACKAGE_NAME} -C /usr/local/bin/
sudo chmod +x /usr/local/bin/sveltin
```

## :gear: CLI Commands & Options

sveltin comes with a set of commands and subcommands to help dealing with your SvelteKit project.

Each command can be executed with inline arguments or interactivly.

```bash
$ sveltin -h

sveltin is the main command to work with SvelteKit powered static website.

Usage:
  sveltin [command]

Available Commands:
  add         Add content and metadata to a resource
  build       Builds a production version of your static website
  completion  Generate the autocompletion script for the specified shell
  deploy      Deploy the website over FTP
  generate    Generate static files (sitemap, rss, menu)
  help        Help about any command
  init        Initialize a new sveltin project
  install     Install the project dependencies
  migrate     Migrate existing sveltin project files to the latest sveltin version ones
  new         Create nee resources, pages and themes
  preview     Preview the production version locally
  server      Run the development server
  update      Update your project dependencies

Flags:
  -h, --help      help for sveltin
  -v, --version   version for sveltin

Use "sveltin [command] --help" for more information about a command.
```

### sveltin init

`sveltin init` is the main command to scaffold a project.

Alias: `create`

Read more [here][init].

### sveltin new

`sveltin new` is the main command to generate pages, resources (routes) and themes for your project.

Alias: `n`

<details>
    <summary>(Click to expand the list of available subcommands)</summary>

| Subcommand     | Aliases | Description                          |
| :------------- | :-----: | :----------------------------------- |
| [new-page]     |    p    | Command to create a new public page. |
| [new-resource] |    r    | Command to create a new resource.    |

</details>

Read more [here][new].

### sveltin add

`sveltin add` is the main command to add content and metadata to existing resources.

Alias: `a`

<details>
    <summary>(Click to expand the list of available subcommands)</summary>

| Subcommand     | Aliases | Description                                                            |
| :------------- | :-----: | :--------------------------------------------------------------------- |
| [add-content]  |    c    | Command to create a new content for existing resource.                 |
| [add-metadata] |    m    | Command to add a new metadata to your content as a Sveltekit resource. |

</details>

Read more [here][add].

### sveltin generate

`sveltin generate` is used to generate static files like sitemap, menu structure or rss feed file.

Alias: `g`

<details>
    <summary>(Click to expand the list of avilable subcommands)</summary>

| Subcommand         | Description                    |
| :----------------- | :----------------------------- |
| [generate-menu]    | Generate the menu config file. |
| [generate-sitemap] | Generate a sitemap.xml.        |
| [generate-rss]     | Generate a rss.xml file.       |

</details>

Read more [here][generate].

### sveltin install

`sveltin install` is used to initialize the Sveltin project getting all depencencies from the `package.json` file.

Alias: `i`

Read more [here][install].

### sveltin update

`sveltin update` is used to update all depencencies from the `package.json` file.

Read more [here][update].

### sveltin migrate

`sveltin migrate` is used to migrate existing sveltin project files to the latest Sveltin version ones.

Read more [here][migrate].

### sveltin server

`sveltin server` is used to run the VITE server. It wraps svelte-kit defined commands to run the server.

Alias: `s`, `serve`, `run`, `dev`

Read more [here][server].

### sveltin build

`sveltin build` is used to build a production version of your static website. It wraps `sveltekit-build` command.

Alias: `b`

Read more [here][build].

### sveltin preview

`sveltin preview` is used to run a preview for the production version locally.

Read more [here][preview].

### sveltin deploy

`sveltin deploy` is used to deploy your website over FTP on your hosting platform.

Read more [here][deploy].

### sveltin completion

`sveltin completion` generates the autocompletion script for the specified shell (bash|zsh|fish|powershell).

[add]: https://docs.sveltin.io/cli/add/
[add-content]: https://docs.sveltin.io/cli/add-content/
[add-metadata]: https://docs.sveltin.io/cli/add-metadata/
[build]: https://docs.sveltin.io/cli/build/
[completion]: https://docs.sveltin.io/cli/completion/
[contributing]: CONTRIBUTING.md
[deploy]: https://docs.sveltin.io/cli/deploy/
[generate]: https://docs.sveltin.io/cli/generate/
[generate-menu]: https://docs.sveltin.io/cli/generate-menu/
[generate-rss]: https://docs.sveltin.io/cli/generate-rss/
[generate-sitemap]: https://docs.sveltin.io/cli/generate-sitemap/
[init]: https://docs.sveltin.io/cli/init/
[install]: https://docs.sveltin.io/cli/install/
[migrate]: https://docs.sveltin.io/cli/migrate/
[new]: https://docs.sveltin.io/cli/new/
[new-page]: https://docs.sveltin.io/cli/new-page/
[new-resource]: https://docs.sveltin.io/cli/new-resource/
[preview]: https://docs.sveltin.io/cli/preview/
[server]: https://docs.sveltin.io/cli/server/
[update]: https://docs.sveltin.io/cli/update/
