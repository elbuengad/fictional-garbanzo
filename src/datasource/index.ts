import { BaseDatasource } from "./base.js";
import { CommentI, PostI, UserI } from "./types.js";

export class UsersDatasource extends BaseDatasource<UserI> {
    constructor() {
        super("users")
    }
}

export class PostsDatasource extends BaseDatasource<PostI> {
    constructor() {
        super("posts")
    }

    public async getAllByUser(userId: string): Promise<PostI[]> {
        //This list does not use dataloader
        const fullList = await this.getAll()
        return fullList.filter((record: PostI) => record.author === userId)
    }
}

export class CommentsDatasource extends BaseDatasource<CommentI> {
    constructor() {
        super("comments")
    }

    public async getAllByPost(postId: string): Promise<CommentI[]> {
        //This list does not use dataloader
        const fullList = await this.getAll()
        return fullList.filter((record: CommentI) => record.post === postId)
    }
}


export default {
    UsersDatasource,
    PostsDatasource,
    CommentsDatasource,
}