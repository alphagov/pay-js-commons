'use strict'

const { translateAlpha2 } = require('../utils/countries')

module.exports = iso => {
  return translateAlpha2(iso)
}
