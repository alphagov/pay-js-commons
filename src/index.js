'use strict'

const browsered = require('./browsered')
const utils = require('./utils')

// Add to window.GOVUKPAY if in browser context
if (typeof window !== 'undefined') {
  window.GOVUKPAY = window.GOVUKPAY || {}
  window.GOVUKPAY = { browsered }
}

module.exports.browsered = browsered
module.exports.utils = utils
