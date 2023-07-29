import { BaseDatasource } from "./base";


const books = new BaseDatasource('books')
const comments = new BaseDatasource('comments')
const posts = new BaseDatasource('posts')
const users = new BaseDatasource('users')

export default {
    books, 
    comments, 
    posts, 
    users, 
}