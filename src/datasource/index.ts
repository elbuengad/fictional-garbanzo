import { BaseDatasource } from "./base.js";

export class UsersDatasource extends BaseDatasource {
    constructor() {
        super("users")
    }
}

export class PostsDatasource extends BaseDatasource {
    constructor() {
        super("posts")
    }

    public async getAllByUser(userId: any): Promise<any> {
        //This list does not use dataloader
        const fullList = await this.getAll()
        return fullList.filter((record: any) => record.author === userId)
    }
}

export class CommentsDatasource extends BaseDatasource {
    constructor() {
        super("comments")
    }

    public async getAllByPost(postId: any): Promise<any> {
        //This list does not use dataloader
        const fullList = await this.getAll()
        return fullList.filter((record: any) => record.post === postId)
    }
}


export default {
    UsersDatasource,
    PostsDatasource,
    CommentsDatasource,
}