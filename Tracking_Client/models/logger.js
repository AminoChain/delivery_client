
const Logger  = require("logging-library")
const ConsoleHandler = require("logging-library")
const LogLevel = require("logging-library")
const LoggerStore = require("logging-library")


class Log{
    #logger = new Logger.Logger()
    .addHandler(new ConsoleHandler.ConsoleHandler(LogLevel.INFO))
    
    

    constructor(){
        LoggerStore.LoggerStore.add("logs.txt",this.#logger)
    }

    logInfo(funcName,message,correlationID){
        this.#logger.info(this._generateLog(funcName, message,correlationID));
    }

    _generateLog(funcName, message,correlationID){
        let entry = `{function:'${funcName}',message:'${message}',correlationID:'${correlationID}'`
        return entry
    }

}
module.exports = Log