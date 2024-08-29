import pg from 'pg'
const { Pool } = pg

export let CustomerMS20 = class {
    static instance
    static alias2DB = {
        table: {
            default:"customers_customer",
            normalizer: null},
        id:{
            default:"customers_customer.customer_id::text as id",
            normalizer: null
        },
        name:{
            default:"customers_customer.customer_name::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]},
        name_other: {
            default:"customers_customer.customer_name_other::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]},
        address: {
            default:"concat(${address_zipcode}, ${address_street}, ${address_building})",
            normalizer: ["[ー‐―－\\-〒\\s]", ""],
            refer: "default"},
        address_street: {
            default:"customers_customer.address ->> 'street'::text",
            normalizer: ["[ー‐―－\\-\\s]", "-"]},
        address_building: {
            default: "customers_customer.address ->> 'building'::text",
            normalizer: ["[ー‐―－\\-\\s]", "-"]},
        address_zipcode: {
            default: "customers_customer.address ->> 'zipcode'::text",
            normalizer: ["[ー‐―－\\-〒\\s]", ""]},
        address_country: {
            default:"customers_customer.country ->> 'country'::text",
            normalizer: null
        },
        tel_no: {
            default: "customers_customer.tel_no::text",
            normalizer: ["[ー‐―－\\-]", ""]
        }
    }
  
    static getInstance() {
      return CustomerMS20.instance
        ? CustomerMS20.instance
        : (CustomerMS20.instance = new CustomerMS20())
    }

    constructor() {
        //TODO: READ API KEY FROM PARAMETER STORE
        this.apikey = 'b8c64545-de5e-4bf0-81f3-e0f8affcdbba'
        this.type = 'sql'
        this.provider = 'pg'
        this.conf = {
            host: 'ms2-lab4-querydb-0.cmpimn9hwmp4.ap-northeast-1.rds.amazonaws.com',
            user: 'sbddc',
            password: 'sbddc',
            database: 'sbddc_query',
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        }
        
        this.pool = new Pool(this.conf)
    } 

    destructor(){
        this.pool.end()
    }

    onUnmatch(){
        
    }

    get alias2DB(){
        return CustomerMS20.alias2DB
    }

    async query(q) {
        //QUERY内の置換対象文字列を置き換え
        for ( let key in CustomerMS20.alias2DB ){
            let replaceTo = CustomerMS20.alias2DB[key].normalizer ?  
            `regexp_replace(${CustomerMS20.alias2DB[key].value}, '${CustomerMS20.alias2DB[key].normalizer[0]}', '${CustomerMS20.alias2DB[key].normalizer[1]}', 'g')` : 
            CustomerMS20.alias2DB[key].value
            q = q.replaceAll("${" + key + "}", replaceTo)
            q = q.replaceAll("${" + key + "_default}", CustomerMS20.alias2DB[key].value)
        }
        
        const client = await this.pool.connect()
        client.query('BEGIN')
        const result = await client.query(q)
        client.query('COMMIT')
        const rows = result[1].rows
        client.release()

        return rows[0]
    }
}


// --- STATIC INITIALIZER ---
function compileAlias2DBValue(){
    const regexp = /\$\{(.*?)\}/g;

    let que = Object.keys(CustomerMS20.alias2DB)

    while (que.length != 0){
        let key = que.pop()
        let val = CustomerMS20.alias2DB[key].default
        let matches = Array.from(val.matchAll(regexp))

        if ( matches.length == 0 ){
            CustomerMS20.alias2DB[key].value = val
        }else{
            que.unshift(key)
            for ( let m of matches ){
                if ( CustomerMS20.alias2DB[m[1]].value ){
                    val = val.replaceAll(m[0], CustomerMS20.alias2DB[m[1]][CustomerMS20.alias2DB[key].refer])
                }
            }
            CustomerMS20.alias2DB[key].default = val
        }
    }
}

compileAlias2DBValue()