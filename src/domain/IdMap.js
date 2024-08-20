import { NCSDao } from "../dao/NCSDao.js"
import {createPageSQL} from "../util/PageHelper.js"

export let IdMap = class{
    static instanceMap = {}

    static getInstance(provider, target, tenantId){
    /* let key = `${provider}+${target}`
       let instance = IdMap.instanceMap[key]
      ? IdMap.instanceMap[key]
      : (IdMap.instanceMap[key] = new IdMap(provider, target))

      return instance
        */
       
      return new IdMap(provider, target, tenantId)
    }

    constructor(provider, target, tenantId){
        this.provider = provider
        this.target = target
        this.tenantId = tenantId

        this.idmap = {}
    }

    async updateNullPid(pid, tid){
        let sql = `
SET search_path TO 'ncs';
UPDATE idmap
SET pid = '${pid}'
WHERE
    provider = '${this.provider}'
    and provider = '${this.provider}'
    and target = '${this.target}'
    and tenant = '${this.tenantId}'
    and tid = '${tid}'
    and pid IS null
        `
        await NCSDao.getInstance().execute(sql)
    }

    async save(){
        //UPSERT idmap
        let upsert = `
SET search_path TO 'ncs';
INSERT INTO idmap (provider, target, pid, tid, targetvalue, tenant, mergedvalue, "option")
VALUES ${
    function fn(){
        let retval = ''
        for ( let pid in this.idmap ){
            for ( let tid in this.idmap[pid]){
                let e = this.idmap[pid][tid]
                retval = retval + `('${this.provider}', '${this.target}', ${e.pid ? `'${e.pid}'` : 'null'},  ${e.tid ? `'${e.tid}'` : 'null'}, ${e.targetvalue ? `'${JSON.stringify(e.targetvalue)}'::jsonb` : 'null'}, '${this.tenantId}', ${e.mergedvalue ? `'${JSON.stringify(e.mergedvalue)}'::jsonb` : 'null'}, ${e.option ? `'${JSON.stringify(e.option)}'::jsonb` : 'null'}),` + "\r\n"
            }
        }
        return retval = retval.slice(0, -3)
    }.apply(this)
}
ON CONFLICT(provider, target, pid, tenant) DO
UPDATE SET 
    tid = excluded.tid,
    targetvalue = coalesce(excluded.targetvalue, idmap.targetvalue),
    mergedvalue = coalesce(excluded.mergedvalue, idmap.mergedvalue),
    "option" = coalesce(excluded.mergedvalue, idmap.mergedvalue)
    ;
        `

    await NCSDao.getInstance().execute(upsert)

    }

    add(pid, tid, targetlist, targetstatus, targetvalue, mergedvalue, option){
        targetvalue = targetvalue ? {record:targetvalue, timestamp:Date.now()} : null
        mergedvalue = mergedvalue ? {record:mergedvalue, timestamp:Date.now()} : null

        let val = {
            pid:pid, tid:tid,
            targetlist:targetlist, 
            targetstatus:targetstatus, 
            targetvalue:targetvalue, 
            mergedvalue:mergedvalue,
            option: option
        }


        this.idmap[pid] ={}
        this.idmap[pid][tid] = val
    }

    clear(){
        this.idpam = {}
    }

    async load(condition, page){
        let limitoffset = await createPageSQL(page)

        condition = condition ? condition : '1=1'
        let sql = `
SET search_path TO 'ncs';
SELECT 
    pid, tid, targetlist, targetstatus, targetvalue, mergedvalue, option
FROM
    idmap
WHERE
    provider = '${this.provider}'
    and target = '${this.target}'
    and tenant = '${this.tenantId}'
    and ${condition}
ORDER BY id
${limitoffset}
        `

        let result = await NCSDao.getInstance().query(sql)
        //this.clear()

        for ( let r of result ){
            let val = {
                pid:r.pid, 
                tid:r.tid, 
                targetlist: r.targetlist, 
                targetstatus:r.targetstatus, 
                targetvalue: r.targetvalue, 
                mergedvalue: r.mergedvalue,
                option: r.option
            }
            
            this.idmap[r.pid] = {}
            this.idmap[r.pid][r.tid] = val
        }
    }
}