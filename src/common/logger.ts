import log from 'electron-log'

log.transports.console.level = false
log.transports.file.level = 'debug'
log.transports.file.maxSize = 10024300

log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
let date = new Date()
let dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()

log.transports.file.resolvePathFn = () => 'logs/' + dateStr + '.log'

export default {
    info(param: any) {
        log.info(param)
    },
    debug(param: any) {
        log.debug(param)
    },
    warn(param: any) {
        log.warn(param)
    },
    error(param: any) {
        log.error(param)
    },
    verbose(param: any) {
        log.verbose(param)
    },
    silly(param: any) {
        log.silly(param)
    }
}