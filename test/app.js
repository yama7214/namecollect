import { CollectRuleRepository } from '../src/domain/CollectRuleRepository.js'
import { ExactMatchRule } from '../src/plugin/rule/ExactMatchRule.js'
import { ExactMatchOfNRule } from '../src/plugin/rule/ExactMatchOfNRule.js'

import { CollectTargetRepository } from '../src/domain/CollectTargetRepository.js'
import { BusinessCardSimple } from '../src/plugin/target/BusinessCardSimple.js'
import { CustomerSimple } from '../src/plugin/target/CustomerSimple.js'
import { CustomerMS20 } from '../src/plugin/target/CustomerMS20.js'

import { CollectNameService } from '../src/service/CollectNameService.js'

import { request_sample } from '../src/dto/NameCollectionRequest.mjs'

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
let result = await CollectNameService.getInstance().match(request_sample)
