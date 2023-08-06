export interface IdentityI {
    id: string;
}

export interface UserI extends IdentityI {
    email: string;
    name: string;
}

export interface PostI extends IdentityI {
    title: string,
    content: string,
    author: string,
}

export interface CommentI extends IdentityI {
    content: string,
    post: string,
    author: string,
}