import pg from 'pg'
import { Config } from '../conf.js'

const { Pool } = pg

export let NCSDao = class{
    static instance

    static getInstance() {
      let instance = NCSDao.instance
        ? NCSDao.instance
        : (NCSDao.instance = new NCSDao())
  
        return instance
    }    

    constructor(){        
        this.pool = new Pool(Config.getInstance().datasrc)
    }

    async execute(q, transaction=true){
        
        let client = await this.pool.connect()
        try{
            if ( transaction) client.query('BEGIN')
            await client.query(q)
            if ( transaction) client.query('COMMIT')
            client.release()
        }catch(e){
            client.release()
            throw new Error(`SQL exec failed: ${q}`)
        }
    }

    async query(q, transaction=true){
        let client = await this.pool.connect()
        let result;
        try{
            if ( transaction) client.query('BEGIN')
            result = await client.query(q)
            if ( transaction) client.query('COMMIT')
            client.release()
        }catch(e){
            client.release()
            throw new Error(`SQL query failed: ${q}`)    
        }
        return result[1].rows
    }

}