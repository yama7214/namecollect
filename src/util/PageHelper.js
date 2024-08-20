import { NCSDao } from "../dao/NCSDao.js"

export let  createPageSQL = async function(page){
    if (!page || !page.apisignature || !page.sessionid || !page.maxreturn ) return ''

    let sql = `
SET search_path to 'ncs';
 
SELECT
    "from"
FROM
    session
WHERE
    apisignature = '${page.apisignature}'
    and sessionid = '${page.sessionid}'
    `
    let result = await NCSDao.getInstance().query(sql)
    
    let offset = 0
    let limit = Number(page.maxreturn)

    let usql
    if ( result.length == 0){
        usql = `
SET search_path to 'ncs';

INSERT INTO session(apisignature, sessionid, "from", accessdate)
VALUES ('${page.apisignature}', '${page.sessionid}', ${limit}, '${new Date().toISOString().slice(0, 19).replace('T', ' ')}')
        `
    }else{
        offset = Number(result[0].from)
        usql = `
SET search_path to 'ncs';

UPDATE session
SET "from"=${offset+limit}, accessdate='${new Date().toISOString().slice(0, 19).replace('T', ' ')}'
WHERE
    apisignature = '${page.apisignature}'
    and sessionid = '${page.sessionid}'
        `
    }

    await NCSDao.getInstance().execute(usql)

    return `LIMIT ${limit} OFFSET ${offset}`
}