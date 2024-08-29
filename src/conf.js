export let Config = class{
    static instance

    static getInstance(){
        let instance = Config.instance
        ? Config.instance
        : (Config.instance = new Config())
  
        return instance        
    }

    constructor(){
        this.serverport = 3001,
        this.appserver = 'https://dev-solution.softbrain.co.jp/',
        this.apikey = 'b8c64545-de5e-4bf0-81f3-e0f8affcdbba',
        this.datasrc = {
            host: '172.26.1.4',
            user: 'postgres',
            password: 'postgres',
            database: 'ncs',
            schema: 'ncs',
            max: 20,
            idleTimeoutMillis: 60000,
            connectionTimeoutMillis: 60000,
        }
        this.logs = {        
            appenders: { 
                access: { type: "dateFile", "category": "default", "pattern": "yyyyMMdd.log", filename: "./logs/access.log" },
                error:  { type: "dateFile", "category": "errlog","pattern": "yyyyMMdd.log", filename: "./logs/error.log" },
                system: { type: "dateFile", "category": "syslog","pattern": "yyyyMMdd.log", filename: "./logs/system.log" }
                },
            categories: { 
                default: { appenders: ["access"], level: "debug" } ,
                errlog:  { appenders: ["error"], level: "debug" } ,
                syslog:  { appenders: ["system"], level: "debug" }
            }
        }
        this.developerOnly = {
            secretKey: 'AXTEqyxMlZTbxfpsgoV53fsr8Zi4dSjy'
        }
    }
}