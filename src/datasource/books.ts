import lowdb from "./lowdb"

interface BookI {
    getAllBooks():Promise<any>
}

const BOOKS_TABLE_NAME = 'books'
const db = lowdb(BOOKS_TABLE_NAME)

class Book implements BookI {

    private async load(): Promise<void> {
        if(!db.data.length) {
            await db.read()
            console.log('Loaded: %d %s', db.data.length, BOOKS_TABLE_NAME);
        }
    }

    async getAllBooks(): Promise<any> {
        await this.load()
        return db.data
    }

}

export default new Book();
