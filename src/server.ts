import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./typedefs";
import { resolvers } from "./resolver";
import { startStandaloneServer } from "@apollo/server/standalone";

const server = new ApolloServer({

    typeDefs,
  
    resolvers,
  
  });

  
  
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  
  //  1. creates an Express app
  
  //  2. installs your ApolloServer instance as middleware
  
  //  3. prepares your app to handle incoming requests
  
  export const apolloServer = await startStandaloneServer(server, {
  
    listen: { port: 4000 },
  
  });