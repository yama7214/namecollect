import { CollectTargetRepository } from "./CollectTargetRepository.js"
import { NCSDao } from "../dao/NCSDao.js"

export let TargetSource = class{
    static instanceMap = {}

    static getInstance(target){
      /*  let instance = TargetSource.instanceMap[target]
      ? TargetSource.instanceMap[target]
      : (TargetSource.instanceMap[target] = new TargetSource(target))

      return instance*/

      return new TargetSource(target)
    }

    constructor(target){
        this.targetName = target

    }

    initIdMap(provider){}

    initColMap(provider){}

    loadIdMap(provider){}

    loadColMap(provider){}

    async getSyncCols(tenant){
        let retval = {}
        let sql = `
set search_path to 'ncs';

SELECT DISTINCT
	tname
FROM
	columnmap
WHERE
	tenant='${tenant}'
    and target = '${this.targetName}' and sync = true        
`

        let result = await NCSDao.getInstance().query(sql)
        let target = CollectTargetRepository.getInstance(this.targetName, tenant)

        retval.id = target.alias2DB.id.default.replace(/(.*)::.*/, '$1')
        retval.param = []
        for ( let r of result ){
            let p ={}
            if ( target.alias2DB[r.tname] == undefined) {
                p.alias = r.tname
                p.db = await target.resolveUndefinedColumn(r.tname)

                if ( ! p.db ) continue
            }else{   
                p.alias = r.tname
                p.db =  target.alias2DB[r.tname].default.replaceAll(/::text/g, '')
            }
            retval.param.push(p)
        }
        return retval
    }

    async updateIdMap(record, tenantId){
        let  modified = async function(tid, listname, value, tenant){
            let sql = `
SET search_path to 'ncs';

UPDATE idmap
SET 
    targetlist='{${listname.map(e => `"${e}"`).join(',')}}',
    targetstatus='MODIFIED',
    targetvalue='{"record":${JSON.stringify(value)}, "timestamp":${Date.now()}}'::jsonb
WHERE
    tenant='${tenant}'
    and tid='${tid}'
            `
            await NCSDao.getInstance().execute(sql)
        }

        let deleted = async function(tid, tenant){
            let sql = `
SET search_path to 'ncs';

UPDATE idmap
SET 
    targetstatus='DELETED'
WHERE
    tenant='${tenant}'
    and tid='${tid}'
            `
            await NCSDao.getInstance().execute(sql)
        }

        let integrated = async function(tid, toid, tenant){
            let sql = `
SET search_path to 'ncs';

UPDATE idmap
SET 
    tid='${toid}'
WHERE
    tenant='${tenant}'
    and tid='${tid}'
            `
            await NCSDao.getInstance().execute(sql)
        }

        for ( let r of record){
            let action = r.action

            if ( action == 'MODIFIED' ){
                await modified(r.id, r.listname, r.param, tenantId)
            }else if ( action == 'DELETED' ){
                await deleted(r.id, tenantId)
            }else if ( action == 'INTEGRATED' ){
                await integrated(r.id, r.toid, tenantId)
            }
        }

    }
}