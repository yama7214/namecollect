import { NCSDao } from "../dao/NCSDao.js"
import { CollectTargetRepository } from './CollectTargetRepository.js'

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
       this.pnamemap = {}
       this.tnamemap = {}
    }

    normalizedParam(){
        let retval = {}
        for ( let e in this.normparam){
            retval[e] = this.normparam[e].value
        }

        return retval
    }

    // add(pname, qname, popt){
    //     this.colmap[pname] = {
    //         qname: qname,
    //         popt: popt
    //     }
    // }

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
                    opt.concat = opt.concat ? opt.concat : []
                    opt.concat.push(e)
                }
            }else{
                val = param[p]
            }
            this.normparam[key] = {value:val, opt:opt, map: colmap[key]? Array.isArray(colmap[key]) ? colmap[key] : [colmap[key]] : []}
            this.colmap.push({pname:key, tname:colmap[key], popt: opt, sync:true})
            this.pnamemap[key] = {pname:key, tname:colmap[key], popt: opt, sync:true}
            this.tnamemap[colmap[key]] = {pname:key, tname:colmap[key], popt: opt, sync:true}
        }
        //this.colmap = colmap

        return this
    }

    clear(){

    }

    tname2pname(tname){
        tname = Array.isArray(tname) ? tname : [tname]

        let retval = []
        for ( let t of tname){
            if ( ! this.tnamemap[t]){
                retval.push(tname)
            }else{
                retval.push(this.tnamemap[t].pname ? this.tnamemap[t].pname : tname)
            }
        }

        return retval.length < 2 ? retval[0] : retval
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
            this.pnamemap[r.pname] = {pname:r.pname, tname:r.tname, popt: r.popt, sync: r.sync}
            this.tnamemap[r.tname] = {pname:r.pname, tname:r.tname, popt: r.popt, sync: r.sync}
        }
    }

    async save(){
        let t = CollectTargetRepository.getInstance(this.target, this.tenantId)
        let fn = async function(that){
            let retval = ''
            for ( let e in Object.keys(that.colmap) ){
                let sync = true
    
                let alias = that.colmap[e].tname
                let pname = that.colmap[e].pname
                if ( ! alias ){
                    continue
                }
                let owncol =  await t.isOwnColumn(alias)
                if ( ! owncol ){
                    continue
                }
    
                retval = retval + `('${that.provider}', '${that.target}', '${pname}', '${alias}', '${that.colmap[e].popt ? JSON.stringify(that.colmap[e].popt): null}'::jsonb, ${sync}, '${that.tenantId}'),` + "\r\n"
                sync = false
    
            }
            return retval = retval.slice(0, -3)
        }

        let val = await fn(this)

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
${val}
`
        await NCSDao.getInstance().execute(insert)
    }
    
}