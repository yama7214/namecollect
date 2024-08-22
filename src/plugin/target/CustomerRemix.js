import pg from 'pg'
import fetch from 'node-fetch'
import {Config} from '../../conf.js'

const { Pool } = pg

export let CustomerRemix = class {
    static instance
    static alias2DB = {
        table: {
            default:"customer",
            normalizer: null},
        id:{
            default:"customer.company_code::text as id",
            normalizer: null,
            apicode: 318,
            type: "num"
        },
        businessCategory:{
            default:"customer.business_category::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        },
        companyName:{
            default:"customer.company_name::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 301,
            type: "text"
        },
        companyKana:{
            default:"customer.company_kana::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 302,
            type: "text"
        },
        zipcodeC:{
            default:"customer.zipcode::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 303,
            type: "text"
        },
        addressC:{
            default:"customer.address::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 304,
            type: "text"
        },
        phoneNoC:{
            default:"customer.tel_no::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 305,
            type: "text"
        },
        telNo2:{
            default:"customer.tel_no_2::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 306,
            type: "text"
        },
        faxNoC:{
            default:"customer.fax_no::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 307,
            type: "text"
        },
        urlC:{
            default:"customer.hp_url::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 308,
            type: "text"
        },
        stockExchange:{
            default:"customer.stock_exchange::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 310,
            type: "num"
        },
        presidentName:{
            default:"customer.president_name::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 311,
            type: "text"
        },
        presidentKana:{
            default:"customer.president_kana::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 312,
            type: "text"
        },
        establishDate:{
            default:"customer.establish_date::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 313,
            type: "date"
        },
        capital:{
            default:"customer.capital::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 315,
            type: "num"
        },
        employeeNum:{
            default:"customer.employee_num::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 316,
            type: "num"
        },
        noteC:{
            default:"customer.note::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 309,
            type: "text"
        },
        validateFlagC:{
            default:"customer.validate_flag::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 335,
            type: "num"
        },
        agencyFlag:{
            default:"customer.establish_date::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 338,
            type: "num"
        },
        industryKindCode:{
            default:"(select user_message from system_message_ja_jp where message_key = (select es.select_data from ext_select es where es.extension_code = 340 and es.select_code = INDUSTRY_KIND_CODE)) postTypeCode",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 340,
            type: "select"
        },
        customerLevel:{
            default:"(select user_message from system_message_ja_jp where message_key = (select cl.level_name from customer_level cl where cl.customer_level = customer.customer_level))",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 341,
            type: "sql",
            sql: "SET search_path TO '${tenant}'; SELECT customer_level as val FROM customer_level left join system_message_ja_jp on customer_level.\"level_name\" = message_key where default_message = '${val}'"
        },
        customerRankCode:{
            default:"(select user_message from system_message_ja_jp where message_key = (select es.select_data from ext_select es where es.extension_code = 339 and es.select_code = CUSTOMER_RANK_CODE)) customerRankCode",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 339,
            type: "select"
        },
        system_reg_date:{
            default:"customer.regist_date",
            normalizer: null
        },
        system_upd_date:{
            default:"customer.refix_date",
            normalizer: null
        },
        extension:{
            default: `
 set search_path to '@tenant';

select 
 col_name as ext_colname,
 'customer' as ext_belong,
case
 when ex_type = 0 then 'text'
 when ex_type = 1 then 'select'
 when ex_type = 2 then 'date'
 when ex_type = 3 then 'num'
 when ex_type = 4 then 'text'
 when ex_type = 5 then 'decimal'
 when ex_type = 6 then 'checkbox'
 when ex_type = 7 then 'text'
 when ex_type = 8 then 'text'
 when ex_type = 9 then 'text'
 when ex_type = 11 then 'date'
 else 'err'
end ext_type
from extension_info 
where
	ex_belong = 3
	and extension_code::text = '@apicode'           
            `
        }
    }
  
    static getInstance(tenantId) {
      /*return CustomerRemix.instance
        ? CustomerRemix.instance
        : (CustomerRemix.instance = new CustomerRemix())*/

        return new CustomerRemix(tenantId)
    }

    constructor(tenantId) {
        this.type = 'sql'
        this.provider = 'pg'
        this.tenantId = tenantId
        this.conf = {
            host: '172.26.1.4',
            user: 'postgres',
            password: 'postgres',
            database: tenantId,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        }
        
        this.pool = new Pool(this.conf)
    } 

    destructor(){
        this.pool.end()
    }

    get alias2DB(){
        return CustomerRemix.alias2DB
    }

    async resolveUndefinedColumn(col){
        let sql = this.alias2DB.extension.default.replaceAll('@tenant', this.tenantId).replaceAll('@apicode', col)
        let retval 
        try{
            let result = await this.query(sql)
            if ( ! result ){
                retval = undefined
            }else{
                if ( result.ext_type == 'select' ){
                    retval = `(select user_message from system_message_ja_jp where message_key = (select es.select_data from ext_select es where es.extension_code = ${col} and es.select_code = ${result.ext_colname})) ${col}`
                }else if ( result.ext_type == 'checkbox'){
                    retval = undefined
                }else{
                    retval = `${result.ext_belong}.${result.ext_colname}`
                }
            }
        }catch(e){
            retval = undefined
        }

        return retval
    }

    async query(q) {
        //QUERY内の置換対象文字列を置き換え
        for ( let key in CustomerRemix.alias2DB ){
            let replaceTo = CustomerRemix.alias2DB[key].normalizer ?  
            `regexp_replace(${CustomerRemix.alias2DB[key].value}, '${CustomerRemix.alias2DB[key].normalizer[0]}', '${CustomerRemix.alias2DB[key].normalizer[1]}', 'g')` : 
            CustomerRemix.alias2DB[key].value
            q = q.replaceAll("${" + key + "}", replaceTo)
            q = q.replaceAll("${" + key + "_default}", CustomerRemix.alias2DB[key].value)
        }

        //apply extensions
        let exts = [...q.matchAll(/\$\{(.+)_default\}/g)]

        for (let ext of exts){
            let sql = CustomerRemix.alias2DB['extension'].value
    
            let apicode = ext[1]
            sql = sql.replaceAll('@apicode', apicode).replaceAll('@tenant', this.tenantId)

            let result = await this.query(sql)

            if ( result == undefined) continue

            //modify alias2DB
            CustomerRemix.alias2DB[apicode] ={
                default:`customer.${result.ext_colname}::text as "${ext[1]}"`,
                value: `customer.${result.ext_colname}::text as "${ext[1]}"`,
                apicode: ext[1],
                type: result.ext_type
            }

            //modify query
            q = q.replaceAll("${" + apicode + "_default}", CustomerRemix.alias2DB[apicode].value)
        }

        //remove unmatched select columns
        q = q.replaceAll(/(,\$\{.+_default\})/g, '--$1')
        
        const client = await this.pool.connect()
        client.query('BEGIN')
        const result = await client.query(q)
        client.query('COMMIT')
        const rows = result[1].rows
        client.release()

        return rows[0]
    }

    onMatch(query, param, colmap, result){
        query.param.companyCode = result.id
    }

    async onUnmatch(query, param, colmap, idmap){
        let body = {
            "objectName": "customer",
            "items": []
        }
        let retval = {}
        for ( let c in colmap){
            let p = param[c]
            let a = CustomerRemix.alias2DB[colmap[c]]
            if ( p && a && a.apicode){
                if ( a.type == 'select' ){
                    let url = Config.getInstance().appserver + this.tenantId + `/rest/v1/entities/selectitems?obj_name=customer&column_code=${a.apicode}`
                    const response = await fetch(url, {
                        method: 'get',
                        headers: {'Content-Type': 'application/json', 'X-Auth-API-Token': Config.getInstance().apikey}
                    });
                    const data = await response.json()
           
                    let selectItemCode
                    for ( let d of data.selectItems ){
                        if ( d.selectItemName == p ){
                            selectItemCode = d.selectItemCode
                            break
                        }
                    }
                    if ( selectItemCode == undefined ){
                        //error
                    }
                    let item = {}
                    item.column_code = a.apicode
                    item['num'] = selectItemCode
                    body.items.push(item)
                    retval[c] = p
                } else if(a.type == 'sql'){
                    let sql = a.sql.replaceAll('$\{val\}', p).replaceAll('$\{tenant\}', this.tenantId)
                    let sqlresult = await this.query(sql)
                  
                    if ( sqlresult == undefined){/*error*/}
                    let item = {}
                    item.column_code = a.apicode
                    item['num'] = parseInt(sqlresult.val)
                    body.items.push(item)
                    retval[c] = p
                }else{
                    let item = {}
                    item.column_code = a.apicode
                    item[a.type] = p
                    body.items.push(item)
                    retval[c] = p
                }
            }
        }
        let url = Config.getInstance().appserver + this.tenantId + '/rest/v1/entity'
        
        const response = await fetch(url, {
            method: 'post',
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json', 'X-Auth-API-Token': Config.getInstance().apikey}
        });
        
        let res 
        let data
        try{
            res = await response.text()
            data = JSON.parse(res)
        }catch(e){
            let er = new Error(`登録に失敗しました(メッセージ:${res})`)
            er.httpstatus = data?.code ? data.code : 500
            throw er
        }
        if ( data.code != undefined && data.code != 200 ){
            let er = new Error(`登録に失敗しました(メッセージ:${data?.messages[0]})`)
            er.httpstatus = data.code
            throw er
        }

        retval.id = data.primarykey
        query.param.companyCode = data.primarykey
        return retval
    }
}


// --- STATIC INITIALIZER ---
function compileAlias2DBValue(){
    const regexp = /\$\{(.*?)\}/g;

    let que = Object.keys(CustomerRemix.alias2DB)

    while (que.length != 0){
        let key = que.pop()
        let val = CustomerRemix.alias2DB[key].default
        let matches = Array.from(val.matchAll(regexp))

        if ( matches.length == 0 ){
            CustomerRemix.alias2DB[key].value = val
        }else{
            que.unshift(key)
            for ( let m of matches ){
                if ( CustomerRemix.alias2DB[m[1]].value ){
                    val = val.replaceAll(m[0], CustomerRemix.alias2DB[m[1]][CustomerRemix.alias2DB[key].refer])
                }
            }
            CustomerRemix.alias2DB[key].default = val
        }
    }
}

compileAlias2DBValue()