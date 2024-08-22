import pg from 'pg'
import fetch from 'node-fetch'
import {Config} from '../../conf.js'
import log4js from 'log4js'

const { Pool } = pg

//log4js.configure(Config.getInstance().logs)

export let BusinessPersonRemix = class {
    static instance
    static alias2DB = {
        table: {
            default:"business_person LEFT OUTER JOIN customer ON business_person.company_code = customer.company_code",
            normalizer: null},
        id:{
            default:"business_person.business_person_id::text as id",
            normalizer: null
        },
        name:{
            default:"business_person.person_name::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 903,
            type: "text"
        },
        nameKana:{
            default:"business_person.person_kana::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 918,
            type: "text"
        }, 
        companyName:{
            default:"customer.company_name::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        }, 
        department:{
            default:"business_person.depart_name::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 904,
            type: "text"
        }, 
        post:{
            default:"business_person.post::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 905,
            type: "text"
        }, 
        email:{
            default:"business_person.e_mail::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 914,
            type: "text"
        }, 
        mob_e_mail:{
            default:"business_person.e_mail::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 913,
            type: "text"
        },
        phoneNoB:{
            default:"business_person.tel_no::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 909,
            type: "text"
        }, 
        mobilePhoneNo:{
            default:"business_person.mob_no::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 912,
            type: "text"
        }, 
        interphoneNo:{
            default:"business_person.interphone_no::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 910,
            type: "text"
        }, 
        faxNoB:{
            default:"business_person.fax_no::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 911,
            type: "text"
        }, 
        zipcode: {
            default:"zipcode::text",
            normalizer: ["[ー‐―－\\-〒\\s]", ""],
            apicode: 906,
            type: "text"
        },
        addressB: {
            default:"concat(${addressStreetB}, ${addressBuildingB}) as addressB",
            normalizer: ["[ー‐―－\\-〒\\s]", ""],
            refer: "default",
            apicode: 907,
            type: "text"
        },
        addressStreetB: {
            default:"business_person.address::text",
            normalizer: ["[ー‐―－\\-〒\\s]", "-"],
            apicode: 907,
            type: "text"
        },
        addressBuildingB: {
            default: "business_person.street_number::text",
            normalizer: ["[ー‐―－\\-\\s]", ""],
            apicode: 945,
            type: "text"
        },
        urlB:{
            default:"business_person.url::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 915,
            type: "text"
        }, 
        noteB:{
            default:"business_person.note::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 916,
            type: "text"
        },
        serviceFlag:{
            default:"business_person.service_flag::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 925,
            type: "text"
        },
        validateFlagB:{
            default:"business_person.validate_flag::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 927,
            type: "text"
        },
        postTypeCode:{
            default:"(select user_message from system_message_ja_jp where message_key = (select es.select_data from ext_select es where es.extension_code = 939 and es.select_code = POST_TYPE_CODE)) postTypeCode",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 939,
            type: "select"
        },
        departTypeCode:{
            default:"(select user_message from system_message_ja_jp where message_key = (select es.select_data from ext_select es where es.extension_code = 940 and es.select_code = DEPART_TYPE_CODE)) postTypeCode",
            normalizer: ["[ー‐―－\\-\\s]", "ー"],
            apicode: 940,
            type: "select"
        },
        companyCode:{
            default:"customer.company_code::text",
            normalizer: null,
            apicode: 902,
            type: "num"
        },
        businessCategory:{
            default:"customer.business_category::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        },
        companyName:{
            default:"customer.company_name::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        },
        companyKana:{
            default:"customer.company_kana::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        },
        zipcodeC:{
            default:"customer.zipcode::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        },
        addressC:{
            default:"customer.address::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        },
        phoneNoC:{
            default:"customer.tel_no::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        },
        telNo2:{
            default:"customer.tel_no_2::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        },
        faxNoC:{
            default:"customer.fax_no::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        },
        urlC:{
            default:"customer.hp_url::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        },
        stockExchange:{
            default:"customer.stock_exchange::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        },
        presidentName:{
            default:"customer.president_name::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        },
        presidentKana:{
            default:"customer.president_kana::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        },
        establishDate:{
            default:"customer.establish_date::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        },
        capital:{
            default:"customer.capital::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        },
        employeeNum:{
            default:"customer.employee_num::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        },
        noteC:{
            default:"customer.note::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        },
        validateFlagC:{
            default:"customer.validate_flag::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        },
        agencyFlag:{
            default:"customer.establish_date::text",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        },
        industryKindCode:{
            default:"(select user_message from system_message_ja_jp where message_key = (select es.select_data from ext_select es where es.extension_code = 340 and es.select_code = INDUSTRY_KIND_CODE)) postTypeCode",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        },
        customerRankCode:{
            default:"(select user_message from system_message_ja_jp where message_key = (select es.select_data from ext_select es where es.extension_code = 339 and es.select_code = CUSTOMER_RANK_CODE)) customerRankCode",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        },
        customerLevel:{
            default:"(select user_message from system_message_ja_jp where message_key = (select cl.level_name from customer_level cl where cl.customer_level = customer.customer_level))",
            normalizer: ["[ー‐―－\\-\\s]", "ー"]
        },
        system_reg_date:{
            default:"business_person.regist_date",
            normalizer: null
        },
        system_upd_date:{
            default:"business_person.refix_date",
            normalizer: null
        },
        extension:{
            default: `
 set search_path to '@tenant';

select 
 col_name as ext_colname,
    case
    when ex_belong = 3 then 'customer'
    when ex_belong = 9 then 'business_person'
    end ext_belong,
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
	(ex_belong = 9 or ex_belong = 3)
	and extension_code::text = '@apicode'        
            `
        }
    }
  
    static getInstance(tenatId) {
      /*return BusinessPersonRemix.instance
        ? BusinessPersonRemix.instance
        : (BusinessPersonRemix.instance = new BusinessPersonRemix())*/
        return new BusinessPersonRemix(tenatId)
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
        return BusinessPersonRemix.alias2DB
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
        for ( let key in BusinessPersonRemix.alias2DB ){
            let replaceTo = BusinessPersonRemix.alias2DB[key].normalizer ?  
            `regexp_replace(${BusinessPersonRemix.alias2DB[key].value}, '${BusinessPersonRemix.alias2DB[key].normalizer[0]}', '${BusinessPersonRemix.alias2DB[key].normalizer[1]}', 'g')` : 
            BusinessPersonRemix.alias2DB[key].value
            q = q.replaceAll("${" + key + "}", replaceTo)
            q = q.replaceAll("${" + key + "_default}", BusinessPersonRemix.alias2DB[key].value)
        }
        
        //apply extensions
        let exts = [...q.matchAll(/\$\{(.+)_default\}/g)]

        for (let ext of exts){
            let sql = BusinessPersonRemix.alias2DB['extension'].value
    
            let apicode = ext[1]
            sql = sql.replaceAll('@apicode', apicode).replaceAll('@tenant', this.tenantId)

            let result = await this.query(sql)

            if ( result == undefined)continue

            //modify alias2DB
            BusinessPersonRemix.alias2DB[apicode] ={
                default:`business_person.${result.ext_colname}::text as "${ext[1]}"`,
                value: `business_person.${result.ext_colname}::text as "${ext[1]}"`,
                apicode: ext[1],
                type: result.ext_type
            }

            //modify query
            q = q.replaceAll("${" + apicode + "_default}", BusinessPersonRemix.alias2DB[apicode].value)
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
        //param.id = result.id
    }

    async onMerge(query, param, colmap, result){
        let body = {
            "objectName": "person",
            "items": []
        }
        let retval = {}
        for ( let c in colmap){
            let p = result[c]
            let a = BusinessPersonRemix.alias2DB[c]
            if ( p && a && a.apicode){
                let item = {}
                item.column_code = a.apicode
                item[a.type] = p
                body.items.push(item)
                retval[c] = p
            }
        }
        let url = Config.getInstance().appserver + this.tenantId + '/rest/v1/entity'
        
        const response = await fetch(url, {
            method: 'put',
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json', 'X-Auth-API-Token': Config.getInstance().apikey}
        });
        const data = await response.json()
        retval.id = data.primarykey
        return retval
    }


    async onUnmatch(query, param, colmap, idmap){
        let body = {
            "objectName": "person",
            "items": []
        }
        let retval = {}
        for ( let c in colmap){
            let p = param[c]
            let a = BusinessPersonRemix.alias2DB[colmap[c]]
            if ( p && a && a.apicode){
                if ( a.type == 'select' ){
                    let url = Config.getInstance().appserver + this.tenantId + `/rest/v1/entities/selectitems?obj_name=person&column_code=${a.apicode}`
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
            er.httpstatus = data.code
            throw er
        }
        if ( data.code != undefined && data.code != 200 ){
            let er = new Error(`登録に失敗しました(メッセージ:${data?.messages[0]})`)
            er.httpstatus = data.code
            throw er
        }
        retval.id = data.primarykey
        return retval
    }
}


// --- STATIC INITIALIZER ---
function compileAlias2DBValue(){
    const regexp = /\$\{(.*?)\}/g;

    let que = Object.keys(BusinessPersonRemix.alias2DB)

    while (que.length != 0){
        let key = que.pop()
        let val = BusinessPersonRemix.alias2DB[key].default
        let matches = Array.from(val.matchAll(regexp))

        if ( matches.length == 0 ){
            BusinessPersonRemix.alias2DB[key].value = val
        }else{
            que.unshift(key)
            for ( let m of matches ){
                if ( BusinessPersonRemix.alias2DB[m[1]].value ){
                    val = val.replaceAll(m[0], BusinessPersonRemix.alias2DB[m[1]][BusinessPersonRemix.alias2DB[key].refer])
                }
            }
            BusinessPersonRemix.alias2DB[key].default = val
        }
    }
}

compileAlias2DBValue()