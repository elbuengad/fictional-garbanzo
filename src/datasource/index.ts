import { BaseDatasource } from "./base";

export class UsersDatasource extends BaseDatasource {
    constructor() {
        super("users")
    }
}

export class PostsDatasource extends BaseDatasource {
    constructor() {
        super("posts")
    }
}

export class CommentsDatasource extends BaseDatasource {
    constructor() {
        super("comments")
    }
}


export default {
    UsersDatasource,
    PostsDatasource,
    CommentsDatasource,
}