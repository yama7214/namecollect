let SQLBuilder = class{
    constructor(){
        this.select = []
        this.from = ''
        this.condition = []
    }

    set select(cols){
        Array.isArray(cols) ? this.select.concat(cols) : this.select.add(cols)
    }

    get select(){
        return this.select
    }

    set from (table){
        this.from = table
    }

    get from(){
        return this.from
    }

    like(cols, params){

    }

    eq(cols, params){
        let retval
        let cols = Array.isArray(cols) ? cols : [cols]
        let params = Array.isArray(params) ? params : [params]

        let chunk = undefined
        for (let col of cols ){
            for ( let param of params){
                if ( chunk ){
                    chunk += '\r\nor'
                }else{
                    chunk += '('
                }
                chunk += `${col} = ${param}`
            }
            chunk += ')'
            retval += chunk
            chunk = undefined
        }
        return retval
    }

}