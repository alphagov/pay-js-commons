'use strict'

const browsered = require('./browsered')

// Add to window.GOVUKPAY if in browser context
if (window) {
  window.GOVUKPAY = window.GOVUKPAY || {}
  window.GOVUKPAY = {browsered}
}

module.exports.browsered = browsered
