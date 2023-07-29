import datasource from '../datasource';

export const resolvers = {
    Query: {
      books: () => {
        return datasource.books.getAll()
      }
    },
  };