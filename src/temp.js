import { CollectTargetRepository } from './domain/CollectTargetRepository.js'
import { CustomerMS20 } from './sample/target/CustomerMS20.js'

let c = CustomerMS20.getInstance()
c.query()