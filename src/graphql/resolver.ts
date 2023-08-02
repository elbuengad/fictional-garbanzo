export const resolvers = {
  Query: {
    users: (_: any, __: any, ctx: any) => ctx.datasource.users.getAll(),
    posts: (_: any, __: any, ctx: any) => ctx.datasource.posts.getAll(),
    comments: (_: any, __: any, ctx: any) => ctx.datasource.comments.getAll(),
  },

  User: {
    posts({id}: any, _: any, ctx: any) {
      return ctx.datasource.posts.getAllByUser(id)
    },
  },

  Post: {
    author({author}: any, _: any, ctx: any) {
      return ctx.datasource.users.get(author)
    },
    comments({id}: any, _: any, ctx: any) {
      return ctx.datasource.comments.getAllByPost(id)
    },
  },

  Comment: {
    author({author}: any, _: any, ctx: any) {
      return  ctx.datasource.users.get(author)
    },
    post({post}: any, _: any, ctx: any) {
      return ctx.datasource.posts.get(post)
    },
  }
};