import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const DB_DIR = 'resources/db'
const cwd = dirname(fileURLToPath(import.meta.url))

export default <T>(table: string) : Low<T> => {
    const file = join(cwd,'..','..',DB_DIR,`/${table}.json`)
    const adapter = new JSONFile<T>(file)
    return new Low<T>(adapter, {} as T)
}

