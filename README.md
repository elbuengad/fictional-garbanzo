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

- API exposes User, Post and Comment entities allowing CRUD. Exception is `Comments` entity which can only be created and/or fetched.
- Makes use of dataloader to optimise the access to data.
- Types enforced in datasources, but not in resolvers yet (could not get graphql-codegen to work due to an awkward string-width dependency issue).


## Next steps/not included :'(
- Add tests, primarly integration ones.
- Create a client application to integrate to the API.
- Implement federation because why not :)


## Considerations
- There is not shared cache, so each request is on its own data access, however the nature of the entities/requirements may allow it (e.g. public posts could be cached throughout the server and not only per request).
- DB selected (LowDB) limits a bit the ability to showcase real-life data access scenarios where pagination and indexes are available on the DB layer, however it allows to reduce the bundle size of the project. 
- An additional array with all available ID's is maintained (per table/datasource) to leverage dataloader capabilities as much as possible. This of course would have a limit in terms of memory but relates to the previous point: if thousands of records are available, then a real DB with pagination would not return all but a defined subset, which then makes the current datasources (and array) pertinent.
