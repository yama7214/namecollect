import { SQLBuilder } from '../util/SQLBuilder.js'

export let ExactMatchRule = class {
  static instance

  static getInstance() {
    return ExactMatchRule.instance
      ? ExactMatchRule.instance
      : (ExactMatchRule.instance = new ExactMatchRule())
  }

  constructor() {}

  match(param, colmap, target, ruleoption) {
    let query = undefined
    switch (target.type){
      case 'simple':
        query = this.createSimpleQuery(param, colmap, ruleoption)
        break
      case 'sql':
        query = this.createSQLQuery(param, colmap, ruleoption)
        break
      default :
        throw new Error('type ' + target.type + ' is not supported.')
      }
    let match = target.query(query)
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

  createSQLQuery(param, colmap){
    let sql = new SQLBuilder()
    sql.from = '${table}'
    colmap.
  }
}
