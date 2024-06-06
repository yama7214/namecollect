let ExactMatchRule = class{
    constructor(option){
        this.option = option 
    }

    match(param, target){
        for ( id of target ){
            let t = CollectRuleRepository.get(id)
            
            let query = undefined
            if (t.type == 'simple' ){
                query = this.createSimpleQuery(param, t)
            }

            if ( ! query ) throw new Error('Target ' + id + ' of type ' + t.type + ' is not supported for this rule')

            let match = t.query(query)
        }
    }

    createSimpleQuery(param, target){
        let q = undefined

        q.least_match = 'all'
        q.match = []

        for ( let m of target.map ){
            let e = {}
            e.param = Array.isArray(param[m]) ? param[m] :[param[m]]
            e.column = Array.isArray(target.map[m]) ? target.map[m] :[target.map[m]]
            q.match.add(e)
        }

        return q
    }
}