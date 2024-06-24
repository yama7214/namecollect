import { CollectRuleRepository } from './domain/CollectRuleRepository.js'
import { ExactMatchRule } from './sample/rule/ExactMatchRule.js'
import { ExactMatchOfNRule } from './sample/rule/ExactMatchOfNRule.js'

import { CollectTargetRepository } from './domain/CollectTargetRepository.js'
import { BusinessCardSimple } from './sample/target/BusinessCardSimple.js'
import { CustomerSimple } from './sample/target/CustomerSimple.js'
import { CustomerMS20 } from './sample/target/CustomerMS20.js'

import { CollectNameService } from './service/CollectNameService.js'

import { request_sample } from './dto/NameCollectionRequest.mjs'

/** start up initialization */
CollectRuleRepository.registerRule(
  'ExactMatchRule',
  ExactMatchRule.getInstance()
)

CollectRuleRepository.registerRule(
  'ExactMatchOfNRule',
  ExactMatchOfNRule.getInstance()
)

CollectTargetRepository.registerTarget(
  'BusinessCardSimple',
  BusinessCardSimple.getInstance()
)

CollectTargetRepository.registerTarget(
  'CustomerSimple',
  CustomerSimple.getInstance()
)

CollectTargetRepository.registerTarget(
  'CustomerMS20',
  CustomerMS20.getInstance()
)

/** sample request */
let result = CollectNameService.getInstance().collect(request_sample)
