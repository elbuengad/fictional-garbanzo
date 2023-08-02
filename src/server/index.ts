import { ApolloServer } from "@apollo/server";
import { typeDefs } from "../graphql/typedefs.js";
import { resolvers } from "../graphql/resolver.js";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';
import { UsersDatasource, PostsDatasource, CommentsDatasource } from "../datasource/index.js";

interface ServerContext {
  datasource: {
    users: UsersDatasource,
    posts: PostsDatasource,
    comments: CommentsDatasource,
  }
}

const server = new ApolloServer<ServerContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginInlineTrace()], // See https://www.apollographql.com/docs/apollo-server/api/plugin/inline-trace/
});


export const apolloServer = async () => await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => ({
    datasource: {
      users: new UsersDatasource(),
      posts: new PostsDatasource(),
      comments: new CommentsDatasource(),
    }
  }),
});