# Micro-Frontends

> You (probably) don't need Micro-Frontends

This is the "Distributed and Decoupled Spectrum"

Make sure that you explore all the other options before trying to implement a fully distributed system

![The Evolution of Micro Frontends](./images/micro-frontends-evolution.jpeg 'Title')

## The Evolution of Micro Frontends

### Monolith Micro-Frontends

Let's start with the Monolith.

Either a backend and frontend together or a frontend monolith connecting to APIs.

Great for solo devs and small teams.

Monoliths can definitely scale to millions of users

### The Modular Monolith

You can get clear boundaries, a better-organized app and multiple teams collaborating at the same time.

However, the application still has to be deployed as a single unit.

### Integrated Applications

They could be developed and deployed independently but often there is an integration step at build time where all the pieces come together and get deployed as a single unit.

Monorepos are a great tool for integrated applications.

### Vertical Micro-Frontends

Independently deployable apps that are mounted on a different URL path but under the same domain.

Whenever you have to cross an app boundary, the new app is loaded entirely.

There is no horizontal composition which could impact performance and UX.

### Runtime Micro-Frontends.

This type allows you to compose vertically and horizontally. The app works and feels like a single unit but is composed of multiple apps at runtime.

There is no full page refresh, the perfect balance of UX and DX.

## Reference

- [The Evolution of Micro Frontends ](https://twitter.com/Infoxicador/status/1606382229764116483) by Ruben Casas, [Video](https://www.youtube.com/watch?v=MGpTUx8MKMY)
