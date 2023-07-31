import lowdb from './lowdb'
import DataLoader from 'dataloader'

interface DatasourceI {
    getAll():Promise<any>
    get(key:any): Promise<any>
    create(record:any): Promise<any>
    update(record:any): Promise<any>
    remove(key:any): Promise<void>
}

export class BaseDatasource implements DatasourceI {

    private db: any
    private table: string
    private dataLoader = new DataLoader(keys => this.batchLoader(keys), {}) //Dataloader options are by default batch:true, cache:true
    
    constructor(table: string) {
        this.table = table
        this.db = lowdb(this.table)
    }
    
    private async batchLoader(keys: any) {
        const results = await this.loadAll();
        return keys.map((key: any) => results[key] || new Error(`No result for ${key}`));
    }

    private async loadAll(): Promise<any> {
        await this.db.read();
        console.log('Loaded: %d %s', this.db.data.length, this.table);
        return this.db.data;
    }

    
    public async getAll(): Promise<any> {
        const fullList = await this.loadAll();
        fullList.forEach((record:any) => {
            this.dataLoader.prime(record.id, record)
        });
        return fullList;
    }

    public async get(key: any): Promise<any> {
        return this.dataLoader.load(key)
    }

    public async create(record: any): Promise<any> {

        //If object already exists then throw
        //This try-catch section is required because DB (lowDB) does not provide any built-in integrity checks
        try {
            await this.get(record.key)
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

        this.db.data.push({...record})
        this.db.write()
        this.dataLoader.prime(record.id, record)
        return this.get(record.id)

    }

    

    public async update(record: any): Promise<any> {
        
        //If object does not exists then throw
        //This try-catch section is required because DB (lowDB) does not provide any built-in integrity checks
        try {
            await this.get(record.key)
        } catch(e:any) {
            if(e.message.startsWith('No result for')) {
                console.warn('Attempt to update inexistent record: %s',record.id)
            } else {
                console.warn('An error occurred on updating record id: %s',record.id, e)
            }
            throw new Error('Error during update')
        }

        const i = this.db.data.findIndex((k: any)=>k.id===record.id)
        this.db.data.splice(i, 1, record)
        await this.db.write()
        this.dataLoader.clear(record.id).prime(record.id, record)
        return this.get(record.id)

    }

    public async remove(key: any): Promise<void> {

        //If object does not exists then throw
        //This try-catch section is required because DB (lowDB) does not provide any built-in integrity checks
        try {
            await this.get(key)
        } catch(e:any) {
            if(e.message.startsWith('No result for')) {
                console.warn('Attempt to delete inexistent record: %s',key)
            } else {
                console.warn('An error occurred on deleting record id: %s',key, e)
            }
            throw new Error('Error during update')
        }

        const i = this.db.data.findIndex((k: any)=>k.id===key)
        this.db.data = this.db.data.splice(i, 1)
        await this.db.write()
        this.dataLoader.clear(key)
        return

    }

}