import { IdMap } from './IdMap.js'
import { ColumnMap } from './ColumnMap.js'

export let QuerySource = class{
    static instanceMap = {}

    static getInstance(provider, tenantId){
     /*   let key = `${provider}+${tenantId}`
        let instance = QuerySource.instanceMap[key]
      ? QuerySource.instanceMap[key]
      : (QuerySource.instanceMap[key] = new QuerySource(provider, tenantId))

      return instance
      */

      return new QuerySource(provider, tenantId)
    }

    constructor(provider, tenantId){
        this.provider = provider
        this.tenantId = tenantId
        this.idMapHolder = {}
        this.colMapHolder = {}
    }

    async save(){
        for(let target in this.idMapHolder){
            let idmap = this.idMapHolder[target]
            let columnmap = this.colMapHolder[target]
            if (idmap) await idmap.save()
            if (columnmap) await columnmap.save()
        }
    }

    getIdMap(target){
        return this.idMapHolder[target]
    }

    getColMap(target){
        return this.colMapHolder[target]
    }

    initIdMap(target){
        this.idMapHolder[target] = new IdMap(this.provider, target, this.tenantId)
        return this.idMapHolder[target]
    }

    initColMap(target){
        this.colMapHolder[target] = new ColumnMap(this.provider, target, this.tenantId)
        return this.colMapHolder[target]
    }

    async loadIdMap(target, condition, page){
        this.idMapHolder[target] = new IdMap(this.provider, target, this.tenantId)
        await this.idMapHolder[target].load(condition, page)
    }

    async loadColMap(target, condition){
        this.colMapHolder[target] = new ColumnMap(this.provider, target, this.tenantId)
        await this.colMapHolder[target].load(condition)
    }
}