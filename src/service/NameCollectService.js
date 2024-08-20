import { CollectRuleRepository } from '../domain/CollectRuleRepository.js'
import { CollectTargetRepository } from '../domain/CollectTargetRepository.js'
import { QuerySource } from '../domain/QuerySource.js'
import { TargetSource } from '../domain/TargetSource.js'

import crypto from 'crypto'

export let NameCollectService = class {
  static instance

  static getInstance(tenantId) {
    let instance = NameCollectService.instance
      /*? NameCollectService.instance
      : (NameCollectService.instance = new NameCollectService())

      return instance
      */
     return new NameCollectService(tenantId)
  }
  

  constructor(tenantId) {
    this.tenantId = tenantId
    this.instanceId = crypto.randomUUID()
  }

  async getSyncColumnInfo(target){
    return TargetSource.getInstance(target).getSyncCols(this.tenantId)
  }

  async getQueryIds(provider, target, page){
    let querySource = QuerySource.getInstance(provider, this.tenantId)
    await querySource.loadIdMap(target, '', page)
    let idmap = querySource.getIdMap(target).idmap
    let retval = {}
    retval.queryIds = []
    for ( let ids  in idmap ){
      retval.queryIds.push(ids)
    }
    return retval
  }

  async getDeleteRequiredQueryIds(provider, target, after, page){
    let querySource = QuerySource.getInstance(provider, this.tenantId)

    let cond = `targetStatus='DELETED'`
    let longa = 0
    if ( after ){
      let longa = 0
   
      longa = Date.parse(after)
      if ( isNaN(longa) ){
        let er = new Error(`日付フォーマットが正しくありません(after:${after})`)
        er.httpstatus = '400'
        throw er
      }
      
      cond = `${cond} and (targetvalue ->> 'timestamp')::bigint > ${longa}` 
    }

    await querySource.loadIdMap(target, cond, page)
    let idmap = querySource.getIdMap(target).idmap
    let retval = {}
    retval.target = target
    retval.record = []


    for ( let pid in idmap ){
      for ( let tid in idmap[pid] ){
        let ids = idmap[pid][tid]
        retval.record.push({queryId:ids.pid, targetId: ids.tid, targetList: ids.targetlist})
      }
    }
    return retval
  }
  
  async getRegisteredRequired(provider, target, after, page){
    let querySource = QuerySource.getInstance(provider, this.tenantId)

    let cond = `pid is NULL`
    let longa = 0
    if ( after ){
      let longa = 0
   
      longa = Date.parse(after)
      if ( isNaN(longa) ){
        let er = new Error(`日付フォーマットが正しくありません(after:${after})`)
        er.httpstatus = '400'
        throw er
      }
      
      cond = `${cond} and (targetvalue ->> 'timestamp')::bigint > ${longa}` 
    }

    await querySource.loadIdMap(target, cond, page)
    let idmap = querySource.getIdMap(target).idmap
    let retval = {}
    retval.target = target
    retval.record = []

    for ( let pid in idmap ){
      for ( let tid in idmap[pid] ){
        let ids = idmap[pid][tid]
        retval.record.push({targetId: ids.tid, targetList: ids.targetlist, param: ids.targetvalue.record})
      }
    }

    return retval
  }

  async registerIdPair(req){
    let querySource = QuerySource.getInstance(req.provider, this.tenantId)
    let idmap = querySource.initIdMap(req.target)

    for ( let r of req.ids){
      idmap.updateNullPid(r.queryId, r.targetId)
    }
  }

  async getIdMap(provider, target, ids){
    if ( ! ids ){
      let er = new Error(`ID配列の指定が必要です`)
      er.caused_by = 'ids'
      er.httpstatus = 400
      throw er
    }
    let querySource = QuerySource.getInstance(provider, this.tenantId)
    let cond = `pid in (${ids.map(e=>`'${e}'`).join(',')})`
    await querySource.loadIdMap(target, cond)
    let idmap = querySource.getIdMap(target).idmap
    let result = {records:[], deleted:[]}

    for ( let pid in idmap ){
      for ( let tid in idmap[pid] ){
        let m = idmap[pid][tid]
        if ( m.targetstatus == "DELETED"){
          result.deleted.push(m.pid)
        }else{
          let e = {}
          e.queryId = m.pid
          e.targetId = m.tid
          e.param = m.targetvalue.record

          result.records.push(e)
        }
      }
    }

    return result
  }

  async update(req, page){
    let provider = req.provider
    let target = req.target

    let querySource = QuerySource.getInstance(provider, this.tenantId)

    //create Map(key:queryId, value:{timestamp, param}), from request
    let querymap = {}
    for ( let r of req.record ){
      querymap[r.queryId] = {timestamp: r.timestamp, param: r.param}
    }

    //now, target id will be either...
    //1. pid in (keys of querymap)
    //2. targetstatus = 'MODIFIED' and pid IS NOT NULL
    let qkeys = JSON.stringify(Object.keys(querymap)).replaceAll('"', "'")

    let cond1 = `pid in (${qkeys.slice(1,qkeys.length-1)})`
    let cond2 = `(targetstatus = 'MODIFIED' and pid IS NOT NULL)`
    let cond3 = `target = '${target}'`

    await querySource.loadIdMap(target, `${cond3} and (${cond1} or ${cond2})`, page)
    let idmap = querySource.getIdMap(target).idmap
    let pidmap = {}

    for ( let pid in idmap ){
      for ( let tid in idmap[pid] ){
        let ids = idmap[pid][tid]
        pidmap[pid] = ids
      }
    }

    await querySource.loadColMap(target, `sync = true`)
    let colmap = querySource.getColMap(target).colmap

    let mergedinfolist = []

    let timestamp = Date.now()
    
    //merge logic:
    //1. if either is modfied, then accept all modified values.
    //2. if both are modified and modified columns are not duplicated, then accept modified value by column
    //3. if both are modified and modified columns are duplicated, then accept newer timestamp value by column
    
    for ( let pid in idmap ){
      for ( let tid in idmap[pid] ){
        let m  = idmap[pid][tid]

        let pmod = querymap[m.pid]
        let tmod = m.targetstatus == 'MODIFIED'

        let mergedinfo = {pid: m.pid, tid: m.tid, timestamp: timestamp}
        if ( (pmod!=undefined) ^ tmod ){
          mergedinfo = Object.assign(mergedinfo, {dir: tmod ? 't':'p', record: tmod ? m.targetvalue.record : pmod.param })
        }else{
          mergedinfo = Object.assign(mergedinfo, {dir: 'b', record: {}})
          for ( let col of colmap ){
            let mcolval = m.mergedvalue.record[col.tname]
            let pcolmod = mcolval == pmod.param[col.pname]
            let tcolmod = mcolval == m.targetvalue[col.tname]

            if ( pcolmod == true && tcolmod == true ){
              if (pmod.timestamp > m.targetvalue.timestamp){
                mergedinfo.record[col.tname] = pmod.param[col.pname]
              }else{
                mergedinfo.record[col.tname] = m.targetvalue[col.tname]
              }

            }else if ( pcolmod == true && tcolmod == false ){
              mergedinfo.record[col.tname] = pmod.param[col.pname]
            }else if ( pcolmod == false && tcolmod == true ){
              mergedinfo.record[col.tname] = m.targetvalue[col.tname]
            }
          }
        }
        mergedinfolist.push(mergedinfo)
      }
    } 

    let result = {}
    result.record = []
    for ( let m of mergedinfolist ){
      //update targetstatus and mergedvalue of idmap
      
      //create result
      if (m.dir == 'p' || m.dir == 'b'){
        let t = CollectTargetRepository.getInstance(target, this.tenantId)
        m.record.id = m.tid
        //t.onMerge(req.tenant, null, null, Object.keys(m.record), m.record)
      }
      result.record.push({queryId: m.pid, targetId: m.tid, by: m.dir, targetLists: pidmap[m.pid].targetList, param: m.record})
    }
    
    return result
  }

  async match(req) {
    let tlist = req.target

    let retval = {}

    let querySource = QuerySource.getInstance(req.provider, this.tenantId)

    for ( let t of tlist ){

      let result = {}
      result.match = []
    
      let map = req.map
      let target = CollectTargetRepository.getInstance(t, this.tenantId)
      let idmap = querySource.initIdMap(t)
      idmap.load()

      for ( let q of req.query){
        let param = q.param
        let columnmap =  querySource.initColMap(t).addAll(param, map)
        let normparam = columnmap.normalizedParam()

        for ( let e of req.rules){
          let rule = CollectRuleRepository.getInstance(e.rule)
          let option = e.ruleOption[t]

          let uselist = option.use
          let order = option.order
          if( !uselist ){
           //TODO: Thorow Error
          }

          let match
          for ( let use of uselist){
            use = Array.isArray(use) ? use : [use]
            let ruleOption = {use:use, order:order}

            match = await rule.match(this.tenantId, normparam, map, target, ruleOption)
            if ( match ){
              target.onMatch(q, normparam, map, match)
              result.match.push({queryId:q.id, targetId:match.id, param:match})
              idmap.add(q.id, match.id, null, null, match, null)
              break
            }
          }
          if (! match) {
            match = await target.onUnmatch(q, normparam, map, idmap)
            result.match.push({queryId:q.id, targetId:match.id, param:match})
            idmap.add(q.id, match.id, null, null, match, null)
          }
        }
      }

      retval[t] = result
    }

    await querySource.save()
    return retval
  }

  async setModifiedTarget(target, record){
    await TargetSource.getInstance(target).updateIdMap(record, this.tenantId)
  }
}
