import { CollectRuleRepository } from '../domain/CollectRuleRepository.js'
import { CollectTargetRepository } from '../domain/CollectTargetRepository.js'

export let CollectNameService = class {
  static instance

  static getInstance() {
    return CollectNameService.instance
      ? CollectNameService.instance
      : (CollectNameService.instance = new CollectNameService())
  }

  constructor() {}

  collect(req) {
    let result = []
    let r = req.query[0]
    let param = r.param
    for (let t in r.target) {
      let e = r.target[t]
      let rule = CollectRuleRepository.getRule(e.rule)
      let target = CollectTargetRepository.getaTarget(t)
      let colmap = e.map
      let match = rule.match(param, colmap, target, e.rule_options)
      console.log(match)
      result.push(match)
    }

    return result
  }
}
