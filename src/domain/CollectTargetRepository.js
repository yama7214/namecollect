export let CollectTargetRepository = class {
  static targetMap = {}
  static getaTarget(targetName) {
    return CollectTargetRepository.targetMap[targetName]
  }

  static registerTarget(targetName, target) {
    if (CollectTargetRepository.targetMap[targetName]) {
      console.warn(targetName + ' is already registered.  Overwriting.')
    }
    CollectTargetRepository.targetMap[targetName] = target
  }
}
