# tailcall

[tailcall](https://tailcall.run/) is used as `API Gateway` to unify **REST**, **GraphQL** and **gRPC** backend APIs into single endpoint.

## Usage

### Check

```shell
tailcall check nhost/tailcall/jsonplaceholder.graphql
tailcall check nhost/tailcall/graphql-composition.graphql
```

### Start

```shell
tailcall start nhost/tailcall/jsonplaceholder.graphql
# (or)
TAILCALL_LOG_LEVEL=info tailcall start nhost/tailcall/jsonplaceholder.graphql
```

### Query

Open `http://127.0.0.1:8000/` and query

```gql
query {
	users {
		id
		name
		posts {
			title
		}
	}
}
```

```gql
query {
	user(id: 1) {
		id
		name
		posts {
			title
		}
	}
}
```

```gql
query {
	posts {
		id
		title
		body
	}
}
```
