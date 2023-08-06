# GraphQL

## Server

[Hasrua](https://hasura.io/) is used as main _GraphQL_ backend to expose CRUD APIs on **PostgreSQL** Database.  
In case, if application need to consumer multiple federated backend APIs (i.e., REST, GraphQL, gRPC) [GraphQL Mesh](https://the-guild.dev/graphql/mesh) us as Gateway and schema-stitching tool.  
Check [[.meshrc.yml](../.meshrc.yml)] file for GraphQL Mesh configuration.

## Client

[Houdini](https://www.houdinigraphql.com/) A fully-featured GraphQL client that seamlessly integrates with the **SvelteKit** project.

### Declarative

**Houdini** is data-fetching turned declarative. Components declare their data dependencies, without worrying about how to fetch them. Houdini guarantees that the data each component needs is fetched and available. This keeps components decoupled and promotes reuse.

With Houdini, components and their data dependencies can be quickly modified without modifying other parts of the system. That means you won't accidentally break other components as you refactor or make changes to your app.

Updates to your application cache are made with a set of declarative fragments that avoid the surgical logic necessary to keep your application up to date.

### Typesafe

Houdini generates types for every document in your application. If you are a TypeScript person, you won't have to juggle any generic parameters or mess with complicated paths
