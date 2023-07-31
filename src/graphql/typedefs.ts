export const typeDefs = `#graphql

  interface Node {
    id: ID!
  }

  """
  Represents a single author and its posts
  """
  type User implements Node {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]
  }

  """
  Represents a post and its comments, linked to a single author
  """
  type Post implements Node {
    id: ID!
    title: String!
    content: String!
    author: User!
    comments: [Comment!]
  }

  """
  Represents a single comment made by an author and linked to a single post
  """
  type Comment implements Node {
    id: ID!
    content: String!
    post: Post!
    author: User!
  }
  
  type Query {
    "List of all available users"
    users: [User]!
    "List of all available posts"
    posts: [Post]!
    "List of all available comments"
    comments: [Comment]!
  }

`;