# fictional-garbanzo

Graphql implementation on Apollo.

## Description

Graphql Server API implementation using ApolloServer and LowDB a file based DB written in ESM.
IMPORTANT. This is not a hardened server so refrain from using outside of dev environments.


## Requirements

- Node >= 16
- Yarn

## Run

1. `yarn && yarn start`
2. Go to http://localhost:4000/ and interact with the fancy built-in UI, few clicks away from creating and triggering queries.

DB is loaded from JSON files available in `resources` folder.


## Current status

- API exposes User, Post and Comment entities.
- Makes use of dataloader to optimise the access to data.


## Next steps/not included :'(
- Implement mutations for all entities using existing datasource methods.
- Enforce types both on resolvers (grapql-codegen) and on datasources (TS types).
- Add tests, primarly integration ones.
- Create a client application to integrate to the API.
- Implement federation because why not :)


## Considerations
- Some datasource operations (get post' comments) may allow to create its own dataloader as long as it is fine tuned.
- There is not shared cache, so each request is on its own data access, however the nature of the entities/requirements may allow it (e.g. public posts could be cached throughout the server and not only per request).
- DB selected limits a bit the ability to showcase real-life data access scenarios, where pagination and indexes are available is most of DB, however it allows to reduce the bundle size of the project.
