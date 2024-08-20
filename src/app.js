import express from "express"
import { Config } from "./conf.js"
import { NameCollectService } from "./service/NameCollectService.js"
import { DeveloperService } from "./service/DeveloperService.js"

import { CollectRuleRepository } from '../src/domain/CollectRuleRepository.js'
import { ExactMatchRule } from '../src/plugin/rule/ExactMatchRule.js'
import { ExactMatchOfNRule } from '../src/plugin/rule/ExactMatchOfNRule.js'

import { CollectTargetRepository } from '../src/domain/CollectTargetRepository.js'
import { BusinessPersonRemix } from '../src/plugin/target/BusinessPersonRemix.js'
import { CustomerRemix } from '../src/plugin/target/CustomerRemix.js'

import log4js from 'log4js'
log4js.configure(Config.getInstance().logs)
const accesslogger = log4js.getLogger('access')


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
    'BusinessPersonRemix',
    BusinessPersonRemix
)

CollectTargetRepository.registerTarget(
    'CustomerRemix',
    CustomerRemix
)


const port = process?.argv[2] ? process.argv[2] : Config.getInstance().serverport
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/', function (req, res) {
    res.send("NameCollectServer Running");
})

app.post('/:tenantId/nameCollection/v1/matching', async function (req, res) {
    let status = 'SUCCESS'
    try{
        req.body.tenant =req.params.tenantId
        let apikey = req.headers.authorization

        let result =await NameCollectService.getInstance(req.params.tenantId, apikey).match(req.body)
        res.send(result);
    }catch(e){
        console.log(e)
        let statuscode = e.httpstatus ? e.httpstatus : 500
        let caused_by = e.caused_by ? e.caused_by : e.stack
        status = `FAILED(${statuscode})`
        res.status(statuscode).send({message: e.message, caused_by: caused_by})
    }finally{
        let accesslog = `[${req.method}][Endpoint:[${req.originalUrl}] [Status:${status}] ${JSON.stringify(req.body)}]`
        accesslogger.info(accesslog)
    }
})

app.post('/:tenantId/nameCollection/v1/syncRequiredId', async function (req, res) {
    let status = 'SUCCESS'
    try{
        req.body.tenant =req.params.tenantId
        let apikey = req.headers.authorization

        let result =await NameCollectService.getInstance(req.params.tenantId, apikey).registerIdPair(req.body)
        res.send('')
    }catch(e){
        console.log(e)
        let statuscode = e.httpstatus ? e.httpstatus : 500
        let caused_by = e.caused_by ? e.caused_by : e.stack
        res.status(statuscode).send({message: e.message, caused_by: caused_by})
    }finally{
        let accesslog = `[${req.method}][Endpoint:[${req.originalUrl}] [Status:${status}] ${JSON.stringify(req.body)}]`
        accesslogger.info(accesslog)
    }
})

app.post('/:tenantId/nameCollection/v1/updateRequired', async function (req, res) {
    let status = 'SUCCESS'
    try{
        req.body.tenant =req.params.tenantId
        let apikey = req.headers.authorization

        let page
        if ( req.headers.session_id && req.headers.max_return ){
            page = {}
            page.apisignature = 'updateRequired'
            page.sessionid = req.headers.session_id
            page.maxreturn = req.headers.max_return
        }
        let result =await NameCollectService.getInstance(req.params.tenantId, apikey).update(req.body, page)
        res.send(result);
    }catch(e){
        console.log(e)
        let statuscode = e.httpstatus ? e.httpstatus : 500
        let caused_by = e.caused_by ? e.caused_by : e.stack
        status = `FAILED(${statuscode})`
        res.status(statuscode).send({message: e.message, caused_by: caused_by})
    }finally{
        let accesslog = `[${req.method}][Endpoint:[${req.originalUrl}] [Status:${status}] ${JSON.stringify(req.body)}]`
        accesslogger.info(accesslog)
    }
})

app.post('/:tenantId/nameCollection/v1/modifiedTargetInfo', async function (req, res) {
    let status = 'SUCCESS'
    let apikey = req.headers.authorization

    try{
        req.tenant =req.params.tenantId
        await NameCollectService.getInstance(req.params.tenantId, apikey).setModifiedTarget(req.body.target, req.body.record)
        res.send('')
    }catch(e){
        console.log(e)
        let statuscode = e.httpstatus ? e.httpstatus : 500
        let caused_by = e.caused_by ? e.caused_by : e.stack
        status = `FAILED(${statuscode})`
        res.status(statuscode).send({message: e.message, caused_by: caused_by})
    }finally{
        let accesslog = `[${req.method}][Endpoint:[${req.originalUrl}] [Status:${status}] ${JSON.stringify(req.body)}]`
        accesslogger.info(accesslog)
    }
})

app.post('/:tenantId/nameCollection/v1/getIdmap', async function (req, res) {
    let status = 'SUCCESS'
    
    try{
        req.tenant =req.params.tenantId
        let apikey = req.headers.authorization

        let result = await NameCollectService.getInstance(req.params.tenantId, apikey).getIdMap(req.body.provider, req.body.target, req.body.ids)
        res.send(result)
    }catch(e){
        console.log(e)
        let statuscode = e.httpstatus ? e.httpstatus : 500
        let caused_by = e.caused_by ? e.caused_by : e.stack
        status = `FAILED(${statuscode})`
        res.status(statuscode).send({message: e.message, caused_by: caused_by})
    }finally{
        let accesslog = `[${req.method}][Endpoint:[${req.originalUrl}] [Status:${status}] ${JSON.stringify(req.body)}]`
        accesslogger.info(accesslog)
    }
})

app.get('/:tenantId/nameCollection/v1/queryIds', async function (req, res) {
    let status = 'SUCCESS'
    try{
        req.tenant =req.params.tenantId
        let apikey = req.headers.authorization

        let page
        if ( req.headers.session_id && req.headers.max_return ){
            page = {}
            page.apisignature = 'queryIds'
            page.sessionid = req.headers.session_id
            page.maxreturn = req.headers.max_return
        }
        let result =await NameCollectService.getInstance(req.params.tenantId, apikey).getQueryIds(req.query.provider, req.query.target, page)
        res.send(result)
    }catch(e){
        console.log(e)
        let statuscode = e.httpstatus ? e.httpstatus : 500
        let caused_by = e.caused_by ? e.caused_by : e.stack
        status = `FAILED(${statuscode})`
        res.status(statuscode).send({message: e.message, caused_by: caused_by})
    }finally{
        let accesslog = `[${req.method}][Endpoint:[${req.originalUrl}] [Status:${status}] ${JSON.stringify(req.body)}]`
        accesslogger.info(accesslog)
    }
})

app.get('/:tenantId/nameCollection/v1/deleteRequired', async function (req, res) {
    let status = 'SUCCESS'
    try{
        req.tenant =req.params.tenantId
        let apikey = req.headers.authorization

        let page
        if ( req.headers.session_id && req.headers.max_return ){
            page = {}
            page.apisignature = 'deleteRequired'
            page.sessionid = req.headers.session_id
            page.maxreturn = req.headers.max_return
        }
        let result =await NameCollectService.getInstance(req.params.tenantId, apikey).getDeleteRequiredQueryIds(req.query.provider, req.query.target, req.query.after, page)
        res.send(result)
    }catch(e){
        console.log(e)
        let statuscode = e.httpstatus ? e.httpstatus : 500
        let caused_by = e.caused_by ? e.caused_by : e.stack
        status = `FAILED(${statuscode})`
        res.status(statuscode).send({message: e.message, caused_by: caused_by})
    }finally{
        let accesslog = `[${req.method}][Endpoint:[${req.originalUrl}] [Status:${status}] ${JSON.stringify(req.body)}]`
        accesslogger.info(accesslog)
    }
})

app.get('/:tenantId/nameCollection/v1/registerRequired', async function (req, res) {
    let status = 'SUCCESS'
    try{
        req.tenant =req.params.tenantId
        let apikey = req.headers.authorization

        let page
        if ( req.headers.session_id && req.headers.max_return ){
            page = {}
            page.apisignature = 'registerRequired'
            page.sessionid = req.headers.session_id
            page.maxreturn = req.headers.max_return
        }
        let result =await NameCollectService.getInstance(req.params.tenantId, apikey).getRegisteredRequired(req.query.provider, req.query.target, req.query.after, page)
        res.send(result)
    }catch(e){
        console.log(e)
        let statuscode = e.httpstatus ? e.httpstatus : 500
        let caused_by = e.caused_by ? e.caused_by : e.stack
        status = `FAILED(${statuscode})`
        res.status(statuscode).send({message: e.message, caused_by: caused_by})
    }finally{
        let accesslog = `[${req.method}][Endpoint:[${req.originalUrl}] [Status:${status}] ${JSON.stringify(req.body)}]`
        accesslogger.info(accesslog)
    }
})

app.get('/:tenantId/nameCollection/v1/syncColumnInfo', async function (req, res) {
    let status = 'SUCCESS'
    try{
        req.tenant =req.params.tenantId
        let apikey = req.headers.authorization

        let result =await NameCollectService.getInstance(req.params.tenantId).getSyncColumnInfo(req.query.target)
        res.send(result)
    }catch(e){
        console.log(e)
        let statuscode = e.httpstatus ? e.httpstatus : 500
        let caused_by = e.caused_by ? e.caused_by : e.stack
        status = `FAILED(${statuscode})`
        res.status(statuscode).send({message: e.message, caused_by: caused_by})
    }finally{
        let accesslog = `[${req.method}][Endpoint:[${req.originalUrl}] [Status:${status}] ${JSON.stringify(req.body)}]`
        accesslogger.info(accesslog)
    }
})


//------- DEVELOPER SERVICE --------

app.delete('/:tenantId/nameCollection/dev/matchingData', async function (req, res) {
    let status = 'SUCCESS'
    try{
        req.tenant =req.params.tenantId
        let apikey = req.headers.authorization

        let result = await DeveloperService.getInstance(req.params.tenantId).deleteMatchingData(req.query.provider)
        res.send(result)
    }catch(e){
        console.log(e)
        let statuscode = e.httpstatus ? e.httpstatus : 500
        let caused_by = e.caused_by ? e.caused_by : e.stack
        status = `FAILED(${statuscode})`
        res.status(statuscode).send({message: e.message, caused_by: caused_by})
    }finally{
        let accesslog = `[${req.method}][Endpoint:[${req.originalUrl}] [Status:${status}] ${JSON.stringify(req.body)}]`
        accesslogger.debug(accesslog)
    }
})

app.get('/:tenantId/nameCollection/dev/matchingData', async function (req, res) {
    let status = 'SUCCESS'
    try{
        req.tenant =req.params.tenantId
        let apikey = req.headers.authorization

        let result = await DeveloperService.getInstance(req.params.tenantId).getMatchingData(req.query.provider)
        res.send(result)
    }catch(e){
        console.log(e)
        let statuscode = e.httpstatus ? e.httpstatus : 500
        let caused_by = e.caused_by ? e.caused_by : e.stack
        status = `FAILED(${statuscode})`
        res.status(statuscode).send({message: e.message, caused_by: caused_by})
    }finally{
        let accesslog = `[${req.method}][Endpoint:[${req.originalUrl}] [Status:${status}] ${JSON.stringify(req.body)}]`
        accesslogger.debug(accesslog)
    }
})

//------- SERVER SETTING --------
app.listen(port, function () {
    console.log(`NameCollect app listening on port ${port}!`);
})