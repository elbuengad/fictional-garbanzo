export const resolvers = {
  Query: {
    users: (_: any, __: any, ctx: any) => ctx.datasource.users.getAll(),
    posts: (_: any, __: any, ctx: any) => ctx.datasource.posts.getAll(),
    comments: (_: any, __: any, ctx: any) => ctx.datasource.comments.getAll(),
    post:(_: any, args: any, ctx: any) => ctx.datasource.posts.get(args.id),
    user:(_: any, args: any, ctx: any) => ctx.datasource.users.get(args.id),
  },

  Mutation: {

    addUser: (_: any, args: any, ctx: any) => ctx.datasource.users.create(args.input),
    
    updateUser: (_: any, args: any, ctx: any) => ctx.datasource.users.update(args.input),

    deleteUser: (_: any, args: any, ctx: any) => ctx.datasource.users.remove(args.id),
    
    async addPost(_: any, args: any, ctx: any) {  
      //Validate author exists
      await ctx.datasource.users.get(args.input.author)
      
      return ctx.datasource.posts.create(args.input)
    },
    
    async updatePost (_: any, args: any, ctx: any) {
      //Add author to (db) update request
      const { author } = await ctx.datasource.posts.get(args.input.id)

      return ctx.datasource.posts.update({
        ...args.input,
        author,
      })
    },

    deletePost: (_: any, args: any, ctx: any) => ctx.datasource.posts.remove(args.id),

    async addComment(_: any, args: any, ctx: any) {
      //Validate author and post exist
      await Promise.all([ctx.datasource.users.get(args.input.author), ctx.datasource.posts.get(args.input.post)])

      return ctx.datasource.comments.create(args.input)
    },
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