import pg from 'pg'
const { Pool } = pg

export let CustomerMS20 = class {
    static instance
    static alias2DB = {
        name: "customers_customer.customer_name",
        name_other: "%customers_customer.customer_name_other",
        address_full: "customers_customer.address",
        address_street: "customers_customer.address ->> 'street'",
        address_building: "customers_customer.address ->> 'building'",
        address_zipcode: "customers_customer.address ->> 'zipcode'",
        address_country: "customers_customer.country ->> 'country'",
        tel_no: "customers_customer.tel_no",
    }
  
    static getInstance() {
      return CustomerMS20.instance
        ? CustomerMS20.instance
        : (CustomerMS20.instance = new CustomerMS20())
    }

    constructor() {
        this.type = 'sql'
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

    query(q) {
        this.pool.query('select 1')
    }
}