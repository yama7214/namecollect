export let ExactMatchOfNRule = class {
  static instance

  static getInstance() {
    return ExactMatchOfNRule.instance
      ? ExactMatchRExactMatchOfNRuleule.instance
      : (ExactMatchOfNRule.instance = new ExactMatchOfNRule())
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

  createSimpleQuery(param, colmap, ruleoption) {
    let q = {}

    q.least_match = ruleoption.least_match
    q.match = []

    for (let m of Object.keys(colmap)) {
      let e = {}
      e.param = Array.isArray(param[m]) ? param[m] : [param[m]]
      e.column = Array.isArray(colmap[m]) ? colmap[m] : [colmap[m]]
      q.match.push(e)
    }

    return q
  }

  createSQLQuery(param, colmap, ruleoption){
    let sql

  }
}
