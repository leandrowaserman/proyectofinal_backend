import log4js from "log4js"

log4js.configure({
    appenders:{
        myLoggerConsole:{type:"console"},
        myLoggerWarnFile:{type:"file",filename:"warn.log"},
        myLoggerErrorFile:{type:"file",filename:"error.log"}
    },
    categories:{
        default:{appenders:["myLoggerConsole"],level:"trace"},
        info:{appenders:["myLoggerConsole"],level:"info"},
        warning:{appenders:["myLoggerConsole","myLoggerWarnFile"],level:"warn"},
        error:{appenders:["myLoggerConsole","myLoggerErrorFile"],level:"error"}
    }
})
const loggerTrace = log4js.getLogger("default")
const loggerWarn = log4js.getLogger("warning")
const loggerError = log4js.getLogger("error")

export{
    loggerTrace,
    loggerWarn,
    loggerError
}