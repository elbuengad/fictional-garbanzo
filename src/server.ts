import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./graphql/typedefs";
import { resolvers } from "./graphql/resolver";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginInlineTrace()], // See https://www.apollographql.com/docs/apollo-server/api/plugin/inline-trace/
  });

  
  
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  
  //  1. creates an Express app
  
  //  2. installs your ApolloServer instance as middleware
  
  //  3. prepares your app to handle incoming requests
  
  export const apolloServer = await startStandaloneServer(server, {
  
    listen: { port: 4000 },
  
  });