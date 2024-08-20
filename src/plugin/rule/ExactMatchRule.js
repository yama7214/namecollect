import { SQLBuilder } from '../../util/SQLBuilder.js'

export let ExactMatchRule = class {
  static instance

  static getInstance() {
    return ExactMatchRule.instance
      ? ExactMatchRule.instance
      : (ExactMatchRule.instance = new ExactMatchRule())
  }

  constructor() {}

  async match(tenant, param, colmap, target, ruleoption) {
    let query = undefined
    switch (target.type){
      case 'simple':
        query = this.createSimpleQuery(param, colmap, ruleoption)
        break
      case 'sql':
        query = this.createSQLQuery(tenant, param, colmap, ruleoption, target)
        break
      default :
        throw new Error('type ' + target.type + ' is not supported.')
      }
    let match = await target.query(query)
    return match
  }

  createSimpleQuery(param, colmap) {
    let q = {}

    q.least_match = 'all'
    q.match = []

    for (let m of Object.keys(colmap)) {
      let e = {}
      e.param = Array.isArray(param[m]) ? param[m] : [param[m]]
      e.column = Array.isArray(colmap[m]) ? colmap[m] : [colmap[m]]
      q.match.push(e)
    }

    return q
  }

  createSQLQuery(tenant, param, colmap, ruleoption, target){
    let sql = new SQLBuilder()
    sql.schema = tenant
    sql.from = 'table'

    let select = []
    let condition_pair = []
    select.push('id')

    for ( let colname of Object.keys(colmap)){
      let colvalue = Array.isArray(colmap[colname]) ? colmap[colname] : [colmap[colname]]
      for ( let e of colvalue){
        let col = e
        if ( colvalue.indexOf(col) == 0){
          select.push(col)
        }
        if ( ruleoption.use.includes(colname)){
          condition_pair.push(col)
        }
      }
      if ( condition_pair.length != 0 ){
        sql.eq(condition_pair, param[colname], target)
      }
      condition_pair = []
    }
    sql.select = select

    sql.order = ruleoption.order

    return sql.toString()
  }
}
