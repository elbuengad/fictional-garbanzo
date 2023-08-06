import lowdb from './lowdb.js'
import DataLoader from 'dataloader'
import { v4 as uuidv4 } from 'uuid'
import { IdentityI } from './types.js'

interface DatasourceI<T extends IdentityI> {
    getAll(): Promise<T[]>
    get(key: string): Promise<T>
    create(record: Partial<T>): Promise<T>
    update(record: T): Promise<T>
    remove(key: string): Promise<string>
}

export class BaseDatasource <T extends IdentityI> implements DatasourceI<T> {

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
        this.db = lowdb<T>(this.table)
        this.keys = [];
    }

    private async loadAll(): Promise<T[]> {
        await this.db.read();
        console.log('Loaded: %d %s', this.db.data.length, this.table);
        this.loadKeysFromDbData();
        return this.db.data;
    }

    private loadKeysFromDbData(): void {
        this.keys = []
        this.db.data.forEach((record: T) => {
            this.keys.push(record.id)
        });
    }

    private async saveInStorage(record: T): Promise<void> {
        this.db.data.push({ ...record })
        await this.db.write()
        this.dataLoader.clear(record.id).prime(record.id, record)
        this.keys.push(record.id)
    }

    private async updateInStorage(record: T): Promise<void> {
        const i = this.db.data.findIndex((k: any) => k.id === record.id)
        this.db.data.splice(i, 1, record)
        await this.db.write()
        this.dataLoader.clear(record.id).prime(record.id, {...record})
    }

    private async deleteInStorage(key: string): Promise<void> {
        const i = this.db.data.findIndex((k: any) => k.id === key)
        this.db.data.splice(i, 1)
        await this.db.write()
        this.dataLoader.clear(key)
        const j = this.keys.findIndex((k: any) => k.id === key)
        this.keys.splice(j,1)
    }

    public async getAll(): Promise<T[]> {
        if (!this.keys.length) {
            const fullList = await this.loadAll();
            fullList.forEach((record: T) => {
                this.dataLoader.prime(record.id, {...record})
            });
        }
        return this.dataLoader.loadMany(this.keys);
    }

    public async get(key: string): Promise<T> {
        return this.dataLoader.load(key)
    }

    public async create(input: Partial<T>): Promise<T> {
        const record = {
            id: uuidv4(),
            ...input,
        } as T
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



    public async update(input: T): Promise<T> {
        
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

    public async remove(key: string): Promise<string> {

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