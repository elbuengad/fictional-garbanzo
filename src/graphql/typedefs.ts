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
    
    "Fetch one post by id"
    post(id: ID!): Post!
    
    "Fetch one user by id"
    user(id: ID!): User!

  }

  input CreateUserInput {
    name: String!
    email: String!
  }

  input UpdateUserInput {
    id: ID!
    email: String!
    name: String!
  }

  input CreatePostInput {
    title: String!
    content: String!
    author: ID!
  }

  input UpdatePostInput {
    id: ID!
    title: String!
    content: String!
  }

  input CreateCommentInput {
    content: String!
    post: ID!
    author: ID!
  }

  type Mutation {
    
    "Create new User"
    addUser(input: CreateUserInput!): User!
    
    "Update existing User, input replaces all previous values, so all properties should be sent even if unchanged"
    updateUser(input: UpdateUserInput): User!

    "Remove a User, this is not a cascade deletion, so created post and comments will remain"
    deleteUser(id: ID!): ID!

    "Create new Post"
    addPost(input: CreatePostInput!): Post!
    
    "Update existing Post, input replaces all previous values, so all properties should be sent even if unchanged"
    updatePost(input: UpdatePostInput): Post!

    "Remove a Post, this is not a cascade deletion, so created comments will remain"
    deletePost(id: ID!): ID!

    "Add comment to existing Post"
    addComment(input: CreateCommentInput!): Comment!

  }

`;