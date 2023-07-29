import { BaseDatasource } from "./base";

const comments = new BaseDatasource('comments')
const posts = new BaseDatasource('posts')
const users = new BaseDatasource('users')

export default {
    comments, 
    posts, 
    users, 
}