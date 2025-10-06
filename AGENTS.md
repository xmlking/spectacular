# AGENTS.md

- You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:
- Use `shadcn-svelte`UI components
- always use `bun` as node package manager

## Available MCP Tools

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

## UI Components

- Use [shadcn-svelte](https://shadcn-svelte.com/docs/components) UI components located at `packages/ui/src/components/ui`, import prefix : `@repo/ui/components/ui/`

Example import statements:

```tsx
  import { Input } from '@repo/ui/components/ui/input/index.js';
  import { Button } from '@repo/ui/components/ui/button/index.js';
  import { Checkbox } from '@repo/ui/components/ui/checkbox/index.js';
```
