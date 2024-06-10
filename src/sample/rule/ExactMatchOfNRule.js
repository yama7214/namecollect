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
    if (target.type == 'simple') {
      query = this.createSimpleQuery(param, colmap, ruleoption)
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
}
