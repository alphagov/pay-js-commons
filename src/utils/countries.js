'use strict'

// NPM Dependencies
const lodash = require('lodash')

// Local Dependencies
let countries = require('../data/countries.json')
const extensions = require('../data/country-record-extension.json')

// Merge the additional data into the register data
countries.forEach(country => {
  const extension = extensions.find(item => item.country === country)
  if (extension) {
    country.entry.aliases = extension.aliases
    country.entry.weighting = extension.weighting
  }
})

countries = lodash.compact(countries)
countries = lodash.sortBy(countries, country => country.entry.name.toLowerCase())

// Exports
exports.retrieveCountries = selectedCountry => {
  const countriesList = lodash.clone(countries)
  countriesList.forEach(country => {
    country.entry.selected = country.entry.country === (selectedCountry || 'GB')
  })
  return countriesList
}

exports.govukFrontendFormatted = selectedCountry => {
  const countriesList = lodash.clone(countries)
  countriesList.forEach(country => {
    country.selected = country.entry.country === (selectedCountry || 'GB')
    country.value = country.entry.country
    country.text = country.entry.name
  })
  return countriesList
}

exports.translateAlpha2 = alpha2Code => countries.find(country => country.entry.country === alpha2Code).entry.name
