import lowdb from './lowdb.js'
import DataLoader from 'dataloader'
import { v4 as uuidv4 } from 'uuid'

interface DatasourceI {
    getAll(): Promise<any>
    get(key: any): Promise<any>
    create(record: any): Promise<any>
    update(record: any): Promise<any>
    remove(key: any): Promise<void>
}

export class BaseDatasource implements DatasourceI {

    private db: any
    private table: string
    private keys: string[]

    private dataLoader = new DataLoader(async (keys) => {
        const results = await this.loadAll();
        const idToMap = results.reduce((mapping: any, record: any) => {
            mapping[record.id] = record
            return mapping
        }, {});
        this.loadKeysFromDbData();
        return keys.map((key: any) => idToMap[key] || new Error(`No result for ${key}`));
    }, {})

    constructor(table: string) {
        this.table = table
        this.db = lowdb(this.table)
        this.keys = [];
    }

    private async loadAll(): Promise<any> {
        await this.db.read();
        console.log('Loaded: %d %s', this.db.data.length, this.table);
        this.loadKeysFromDbData();
        return this.db.data;
    }

    private loadKeysFromDbData(): void {
        this.keys = []
        this.db.data.forEach((record: any) => {
            this.keys.push(record.id)
        });
    }

    private async saveInStorage(record: any): Promise<void> {
        this.db.data.push({ ...record })
        await this.db.write()
        this.dataLoader.clear(record.id).prime(record.id, record)
        this.keys.push(record.id)
    }

    private async updateInStorage(record: any): Promise<void> {
        const i = this.db.data.findIndex((k: any) => k.id === record.id)
        this.db.data.splice(i, 1, record)
        await this.db.write()
        this.dataLoader.clear(record.id).prime(record.id, {...record})
    }

    private async deleteInStorage(key: any): Promise<void> {
        const i = this.db.data.findIndex((k: any) => k.id === key)
        this.db.data.splice(i, 1)
        await this.db.write()
        this.dataLoader.clear(key)
        const j = this.keys.findIndex((k: any) => k.id === key)
        this.keys.splice(j,1)
    }

    public async getAll(): Promise<any> {
        if (!this.keys.length) {
            const fullList = await this.loadAll();
            fullList.forEach((record: any) => {
                this.dataLoader.prime(record.id, {...record})
            });
        }
        return this.dataLoader.loadMany(this.keys);
    }

    public async get(key: any): Promise<any> {
        return this.dataLoader.load(key)
    }

    public async create(input: any): Promise<any> {
        const record = {
            id: uuidv4(),
            ...input,
        }
        //If object already exists then throw
        //This try-catch section is required because DB (lowDB) does not provide any built-in integrity checks
        try {
            await this.get(record.id)
            console.warn('Attempt to duplicate record: %s',record.id)
            throw new Error('Error during creation')
        } catch(e:any) {
            if(e.message.startsWith('No result for')) {
                console.info('Record doesnt exist, adding into %s with id: %s', this.table, record.id)
            } else {
                console.warn('An error occurred on creating record id: %s',record.id, e)
                throw new Error('Error during creation')
            }
        }
        await this.saveInStorage(record)
        return this.get(record.id)
    }



    public async update(input: any): Promise<any> {
        
        //If object does not exists then throw
        //This try-catch section is required because DB (lowDB) does not provide any built-in integrity checks
        try {
            await this.get(input.id)
            console.info('On %s, updating record with id: %s', this.table, input.id)
        } catch (e: any) {
            if (e.message.startsWith('No result for')) {
                console.warn('Attempt to update inexistent record: %s', input.id)
            } else {
                console.warn('An error occurred on updating record id: %s', input.id, e)
            }
            throw new Error('Error during update')
        }

        await this.updateInStorage(input)
        return this.get(input.id)

    }

    public async remove(key: any): Promise<void> {

        //If object does not exists then throw
        //This try-catch section is required because DB (lowDB) does not provide any built-in integrity checks
        try {
            await this.get(key)
            console.info('On %s, deleting record with id: %s', this.table, key)
        } catch (e: any) {
            if (e.message.startsWith('No result for')) {
                console.warn('Attempt to delete inexistent record: %s', key)
            } else {
                console.warn('An error occurred on deleting record id: %s', key, e)
            }
            throw new Error('Error during update')
        }

        await this.deleteInStorage(key)
        return key

    }

}