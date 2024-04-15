'use strict'

const browsered = require('./browsered')
const utils = require('./utils')
const nunjucksFilters = require('./nunjucks-filters')
const logging = require('./logging')
const constants = require('./constants')

// Add to window.GOVUKPAY if in browser context
if (typeof window !== 'undefined') {
  window.GOVUKPAY = window.GOVUKPAY || {}
  window.GOVUKPAY = { browsered }
}

module.exports = { browsered, utils, nunjucksFilters, logging, constants }
