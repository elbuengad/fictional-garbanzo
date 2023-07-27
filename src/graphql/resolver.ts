// Resolvers define how to fetch the types defined in your schema.

import books from "../datasource/books";

export const resolvers = {
    Query: {
      books: () => {
        return books.getAllBooks()
      }
    },
  };