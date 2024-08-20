export let SQLBuilder = class{
    constructor(){
        this._schema = ''
        this._select = []
        this._from = ''
        this._condition = []
    }

    set schema(schema){
        this._schema = schema
    }

    get schema(){
        return schema
    }

    set select(cols){
        Array.isArray(cols) ? this._select = this._select.concat(cols.map(c => '${' + c + '_default}')) : this.select.add('${' + cols + '_default}')
    }

    get select(){
        return this._select
    }

    set from (table){
        this._from = '${' + table + '}'
    }

    get from(){
        return this._from
    }

    set order (s){
        this._order = s
    }

    get order(){
        return this._order ? this._order : "id asc"
    }

    get condition(){
        return this._condition
    }

    like(cols, params){

    }

    eq(cols, params, target){
        let alias2DB = target.alias2DB
        cols = Array.isArray(cols) ? cols : [cols]
        params = Array.isArray(params) ? params : [params]

        let chunk = ''
        for (let col of cols ){
            if ( !alias2DB[col] ) continue
            let norm = alias2DB[col].normalizer
            for ( let param of params){
                param = norm ? param.replaceAll(new RegExp(norm[0], "gm"), norm[1]):param
                chunk ? chunk += ' or ' : chunk += '('
                chunk += `\$\{${col}\} = '${param}'`
            }
        }
        chunk += ')'
        this._condition.push(chunk)
    }

    toString(){
        let retval =
`
SET search_path to '${this._schema}';

SELECT
    ${this.select.join('\r\n    ,')}
FROM
    ${this.from}
WHERE
    ${this.condition.join('\r\n    and ')}
ORDER BY
    ${this.order}
`

        return retval
    }

}