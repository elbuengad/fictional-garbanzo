export const typeDefs = `#graphql

  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    comments: [Comment!]
  }

  type Comment {
    id: ID!
    content: String!
    post: Post!
    author: User!
  }
  
  type Query {
    users: [User]!
    posts: [Post]!
    comments: [Comment]!
  }

`;