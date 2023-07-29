import datasource from '../datasource';

export const resolvers = {
    Query: {
      users: () => datasource.users.getAll(),
      posts: () => datasource.posts.getAll(),
      comments: () => datasource.comments.getAll(),
    },

    User: {
      async posts(parent: any) {
        const posts = await datasource.posts.getAll()
        return posts.filter((post: any) => post.author === parent.id)
      },
    },

    Post: {
      async author(parent: any) {
        const users = await datasource.users.getAll()
        return users.find((user: any)=> user.id === parent.author)
      },
      async comments(parent: any) {
        const comments = await datasource.comments.getAll()
        return comments.filter((comment: any) => comment.post === parent.id)
      },
    },

    Comment: {
      async author(parent: any) {
        const users = await datasource.users.getAll()
        return users.find((user: any)=> user.id === parent.author)
      },
      async post(parent: any) {
        const posts = await datasource.posts.getAll()
        return posts.find((post: any)=> post.id === parent.post)
      },
    }
  };