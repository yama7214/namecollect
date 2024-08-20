export let CollectRuleRepository = class {
  static ruleMap = {}
  static getInstance(ruleName) {
    return CollectRuleRepository.ruleMap[ruleName]
  }
  static registerRule(ruleName, rule) {
    if (CollectRuleRepository.ruleMap[ruleName]) {
      console.warn(ruleName + ' is already registered.  Overwriting.')
    }
    CollectRuleRepository.ruleMap[ruleName] = rule
  }
}
