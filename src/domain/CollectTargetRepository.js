export let CollectTargetRepository = class {
  static targetMap = {}
  static getInstance(targetName, tenantId) {
    let clazz = CollectTargetRepository.targetMap[targetName]

    if (clazz == undefined ){
      let er = new Error(`該当するターゲットが存在しません(${targetName})`)
      er.caused_by = 'target'
      er.httpstatus = 400
      throw er
    }

    return new clazz(tenantId)
  }

  static registerTarget(targetName, targetClass) {
    if (CollectTargetRepository.targetMap[targetName]) {
      console.warn(targetName + ' is already registered.  Overwriting.')
    }
    CollectTargetRepository.targetMap[targetName] = targetClass
  }
}
