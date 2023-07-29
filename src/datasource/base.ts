import lowdb from "./lowdb"

interface DatasourceI {
    getAll():Promise<any>
}

export class BaseDatasource implements DatasourceI {

    db: any
    table: string

    constructor(table: string) {
        this.table = table
        this.db = lowdb(this.table)
    }

    private async load(): Promise<void> {
        if(!this.db.data.length) {
            await this.db.read()
            console.log('Loaded: %d %s', this.db.data.length, this.table);
        }
    }

    public async getAll(): Promise<any> {
        await this.load()
        return this.db.data
    }

}