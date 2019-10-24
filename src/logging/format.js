'use strict'

const { format } = require('winston')

const govUkPayLoggingFormat = format((info, opts) => {
  info['@timestamp'] = new Date().toISOString()
  info['@version'] = 1
  info.container = opts.container
  info.environment = opts.environment
  info.level = info.level.toUpperCase()
  return info
})

module.exports = { govUkPayLoggingFormat }
