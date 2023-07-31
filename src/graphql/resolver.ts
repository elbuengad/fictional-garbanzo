export const resolvers = {
  Query: {
    users: (_: any, __: any, ctx: any) => ctx.datasource.users.getAll(),
    posts: (_: any, __: any, ctx: any) => ctx.datasource.posts.getAll(),
    comments: (_: any, __: any, ctx: any) => ctx.datasource.comments.getAll(),
  },

  User: {
    async posts(parent: any, _: any, ctx: any) {
      const posts = await ctx.datasource.posts.getAll()
      return posts.filter((post: any) => post.author === parent.id)
    },
  },

  Post: {
    async author(parent: any, _: any, ctx: any) {
      const users = await ctx.datasource.users.getAll()
      return users.find((user: any) => user.id === parent.author)
    },
    async comments(parent: any, _: any, ctx: any) {
      const comments = await ctx.datasource.comments.getAll()
      return comments.filter((comment: any) => comment.post === parent.id)
    },
  },

  Comment: {
    async author(parent: any, _: any, ctx: any) {
      const users = await ctx.datasource.users.getAll()
      return users.find((user: any) => user.id === parent.author)
    },
    async post(parent: any, _: any, ctx: any) {
      const posts = await ctx.datasource.posts.getAll()
      return posts.find((post: any) => post.id === parent.post)
    },
  }
};