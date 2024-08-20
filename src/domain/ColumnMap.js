import { NCSDao } from "../dao/NCSDao.js"

export let ColumnMap = class{
    static instanceMap = {}

    static getInstance(provider, target, tenantId){
      /*  let key = `${provider}+${target}`
        let instance = ColumnMap.instanceMap[key]
      ? ColumnMap.instanceMap[key]
      : (ColumnMap.instanceMap[key] = new ColumnMap(provider, target))

      return instance*/

      return new ColumnMap(provider, target, tenantId)
    }

    constructor(provider, target, tenantId){
       this.provider = provider
       this.target = target
       this.tenantId = tenantId

       this.param = {}
       this.normparam = {}
       this.colmap = []
    }

    normalizedParam(){
        let retval = {}
        for ( let e in this.normparam){
            retval[e] = this.normparam[e].value
        }

        return retval
    }

    add(pname, qname, popt){
        this.colmap[pname] = {
            qname: qname,
            popt: popt
        }
    }

    addAll(param, colmap){
        this.param = param
        for ( let p of Object.keys(param) ){
            let val = ''
            let key = p
            let opt = {}
            if(p.startsWith('+')){
                key = p.slice(1, p.length)
                let elements = param[p].split('+')
                for ( let e of elements){
                    val = val + param[e]
                    opt.index ? opt.index.push(param[e].length) : (opt.index = [param[e].length])
                    opt.concat ? opt.concat.push(e) : (opt.concat = [e])
                }
            }else{
                val = param[p]
            }
            this.normparam[key] = {value:val, opt:opt, map: colmap[key]? Array.isArray(colmap[key]) ? colmap[key] : [colmap[key]] : []}
        }
        this.colmap = colmap

        return this
    }

    clear(){

    }

    async load(condition){
        condition = condition ? condition : '1=1'
        
        let sql = `
SET search_path TO 'ncs';
SELECT
    pname
    ,tname
    ,popt
    ,sync
FROM
    columnmap
WHERE
    provider = '${this.provider}'
    and target = '${this.target}'
    and tenant = '${this.tenantId}'
    and ${condition}
        `
        
        let result = await NCSDao.getInstance().query(sql)
        for ( let r of result ){
            this.colmap.push({pname:r.pname, tname:r.tname, popt: r.popt, sync: r.sync})
        }
    }

    async save(){
        let remove = `
SET search_path TO 'ncs';
DELETE FROM columnmap
WHERE provider = '${this.provider}' and target = '${this.target}' and tenant = '${this.tenantId}'
        `
        await NCSDao.getInstance().execute(remove)

        let insert = `
SET search_path TO 'ncs';
INSERT INTO columnmap (provider, target, pname, tname, popt, sync, tenant)        
VALUES 
${function fn(){
        let retval = ''
        for ( let e of Object.keys(this.normparam) ){
            let map = this.normparam[e].map
            let sync = true
            for ( let m of map){
                retval = retval + `('${this.provider}', '${this.target}', '${e}', '${m}', '${JSON.stringify(this.normparam[e].opt)}'::jsonb, ${sync}, '${this.tenantId}'),` + "\r\n"
                sync = false
            }
        }
        return retval = retval.slice(0, -3)
    }.apply(this)
}
`
        await NCSDao.getInstance().execute(insert)
    }
    
}