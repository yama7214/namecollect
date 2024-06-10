export let ExactMatchRule = class {
  static instance

  static getInstance() {
    return ExactMatchRule.instance
      ? ExactMatchRule.instance
      : (ExactMatchRule.instance = new ExactMatchRule())
  }

  constructor() {}

  match(param, colmap, target) {
    let query = undefined
    if (target.type == 'simple') {
      query = this.createSimpleQuery(param, colmap)
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
}
