import { NCSDao } from "../dao/NCSDao.js"

export let DeveloperService = class {
    static instance

    static getInstance(tenantId) {
      /*let instance = DeveloperService.instance
        ? DeveloperService.instance
        : (DeveloperService.instance = new DeveloperService(tenantId))
  
        return instance*/
        return new DeveloperService(tenantId)
    }
    
  
    constructor(tenantId) {
    this.tenantId = tenantId
    this.instanceId = crypto.randomUUID()
    }

    async deleteMatchingData(provider){
        this.provider = provider
        let sql = `
SET search_path TO 'ncs';
DELETE FROM idmap 
WHERE tenant = '${this.tenantId}'
${function fn() {return(this.provider ? `and provider = '${provider}'`:'')}.apply(this)};
DELETE FROM columnmap
WHERE tenant = '${this.tenantId}'
${function fn() {return(this.provider ? `and provider = '${provider}'`:'')}.apply(this)};
        `
       await NCSDao.getInstance().execute(sql)
    }

    async getMatchingData(provider){
        this.provider = provider
        let idmapsql = `
SET search_path TO 'ncs';
SELECT provider, target, pid, tid FROM idmap
WHERE tenant = '${this.tenantId}'
${function fn() {return(this.provider ? `and provider = '${provider}'`:'')}.apply(this)};
        `

        let colmapsql = `
SET search_path TO 'ncs';
SELECT provider, target, pname, tname FROM columnmap
WHERE tenant = '${this.tenantId}'
${function fn() {return(this.provider ? `and provider = '${provider}'`:'')}.apply(this)};
                `

      let idmaprec =  await NCSDao.getInstance().query(idmapsql)
      let colmaprec =  await NCSDao.getInstance().query(colmapsql)

      let retval = {colmap:{}, idmap:{}}

      for ( let id of idmaprec ){
        retval.idmap[id.provider] = retval.idmap[id.provider] ? retval.idmap[id.provider] : {}
        retval.idmap[id.provider][id.target] = retval.idmap[id.provider][id.target] ? retval.idmap[id.provider][id.target] :[]
        retval.idmap[id.provider][id.target].push({queryId: id.pid, targetId :id.tid})
      }

      for ( let col of colmaprec ){
        retval.colmap[col.provider] = retval.colmap[col.provider] ? retval.colmap[col.provider] : {}
        retval.colmap[col.provider][col.target] = retval.colmap[col.provider][col.target] ? retval.colmap[col.provider][col.target] :[]
        retval.colmap[col.provider][col.target].push({queryColumn:col.pname, targetColumn: col.tname})
      }

      return retval
    }
}